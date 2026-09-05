// @vitest-environment node
import {describe, it, expect, vi, beforeEach} from "vitest";
import sharp from "sharp";
import {randomBytes} from "node:crypto";
import {parseContactRequest} from "../../src/lib/server/contact-input";
import {contactSchema} from "../../src/lib/contact-schema";
import {checkCoverage, zipTowns} from "../../src/content/coverage";
const sendMail = vi.hoisted(() => vi.fn());
vi.mock("nodemailer", () => ({default: {createTransport: () => ({sendMail})}}));
import handler from "../../api/contact";
const valid = {name:"QA Test",phone:"8645550123",email:"",applianceType:"washer-dryer",problem:"",selectedProblemIds:["dryer-not-heating"],brand:"Brand QA",model:"TEST-123",zipCode:"99999",preferredContact:"call",bestTime:"Anytime",consent:true,formStartedAt:1};
async function request(count = 0, type = "image/jpeg", bytes?: Uint8Array) {
  const form = new FormData(); form.set("payload",JSON.stringify(valid));
  const buffer = bytes ?? await sharp({create:{width:20,height:20,channels:3,background:"white"}}).jpeg().toBuffer();
  for(let i=0;i<count;i++) form.append("photos[]",new Blob([new Uint8Array(buffer)],{type}),`photo-${i}.jpg`);
  return new Request("http://localhost/api/contact",{method:"POST",body:form,headers:{"x-forwarded-for":crypto.randomUUID()}});
}
describe("request validation",()=>{
  it("allows selected problems without repeated description",()=>expect(contactSchema.safeParse(valid).success).toBe(true));
  it("rejects wrong-category and duplicate IDs",()=>{for(const selectedProblemIds of [["fridge-not-cooling"],["dryer-not-heating","dryer-not-heating"]]) expect(contactSchema.safeParse({...valid,selectedProblemIds}).success).toBe(false);});
  it("requires a description or selection",()=>expect(contactSchema.safeParse({...valid,selectedProblemIds:[]}).success).toBe(false));
  it("keeps independent description and unknown valid ZIP",()=>expect(contactSchema.parse({...valid,problem:"My independent notes."}).problem).toBe("My independent notes."));
  it("covers 19 towns with ZIP+4 and honest unknown fallback",()=>{expect(new Set(Object.values(zipTowns)).size).toBe(19);expect(checkCoverage("29601-1234").status).toBe("listed");expect(checkCoverage("99999").status).toBe("unconfirmed");expect(checkCoverage("abc").status).toBe("invalid");});
  it.each([0,1,3])("accepts %i photos",async n=>expect((await parseContactRequest(await request(n))).attachments).toHaveLength(n));
  it("keeps legacy JSON compatible",async()=>expect((await parseContactRequest(new Request("http://localhost",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(valid)}))).raw).toEqual(valid));
  it("rejects four files",async()=>await expect(parseContactRequest(await request(4))).rejects.toMatchObject({code:"too_many_photos"}));
  it("rejects spoofed MIME and corrupt images",async()=>{await expect(parseContactRequest(await request(1,"image/png"))).rejects.toMatchObject({code:"invalid_photo"});await expect(parseContactRequest(await request(1,"image/jpeg",new Uint8Array([1,2,3])))).rejects.toMatchObject({code:"invalid_photo"});});
  it("rejects oversized images",async()=>await expect(parseContactRequest(await request(1,"image/jpeg",new Uint8Array(1_000_001)))).rejects.toMatchObject({code:"invalid_photo_size"}));
  it("keeps a valid detailed JPEG below 1 MB during server normalization",async()=>{
    const bytes=await sharp(randomBytes(1536*1152*3),{raw:{width:1536,height:1152,channels:3}}).jpeg({quality:70}).toBuffer();
    expect(bytes.length).toBeLessThan(1_000_000);
    const input=await parseContactRequest(await request(1,'image/jpeg',bytes));
    expect(input.attachments[0].content.length).toBeLessThanOrEqual(1_000_000);
  });
  it("bounds actual streamed bytes without content-length",async()=>await expect(parseContactRequest(new Request("http://localhost",{method:"POST",body:new Uint8Array(4_000_001)}))).rejects.toMatchObject({status:413}));
});
describe("mail handler (local mock, no external delivery)",()=>{
  beforeEach(()=>{vi.unstubAllEnvs();sendMail.mockReset();});
  it("does not claim success without mail settings",async()=>{vi.stubEnv("SMTP_HOST","");expect((await handler.fetch(await request(1))).status).toBe(502);expect(sendMail).not.toHaveBeenCalled();});
  it("includes selected problems, model and three validated attachments",async()=>{for(const key of ["SMTP_HOST","SMTP_USER","SMTP_PASS","CONTACT_FROM_EMAIL"])vi.stubEnv(key,"test-only");sendMail.mockResolvedValue({accepted:["test@example.invalid"]});expect((await handler.fetch(await request(3))).status).toBe(200);const mail=sendMail.mock.calls[0][0];expect(mail.attachments).toHaveLength(3);expect(mail.text).toContain("TEST-123");expect(mail.text).toContain("Selected problems:");expect(mail.attachments[0].contentType).toBe("image/jpeg");});
  it("reports mail failure",async()=>{for(const key of ["SMTP_HOST","SMTP_USER","SMTP_PASS","CONTACT_FROM_EMAIL"])vi.stubEnv(key,"test-only");sendMail.mockRejectedValue(new Error("offline"));expect((await handler.fetch(await request())).status).toBe(502);});
});
