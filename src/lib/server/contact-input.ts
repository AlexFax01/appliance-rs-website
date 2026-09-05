import sharp from "sharp";
export const MAX_REQUEST_BYTES = 4_000_000;
export const MAX_PHOTO_BYTES = 1_000_000;
export class InputError extends Error {
  constructor(public code: string, message: string, public status = 400) {super(message);}
}
export type Attachment = {filename: string; content: Buffer; contentType: string};
async function boundedBody(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_REQUEST_BYTES) throw new InputError("payload_too_large", "Please keep your request under 4 MB.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new InputError("invalid_request", "The request is empty.");
  const chunks: Uint8Array[] = []; let size = 0;
  try {while (true) {const {done, value} = await reader.read(); if (done) break; size += value.byteLength; if (size > MAX_REQUEST_BYTES) {await reader.cancel(); throw new InputError("payload_too_large", "Please keep your request under 4 MB.", 413);} chunks.push(value);}}
  finally {reader.releaseLock();}
  return Buffer.concat(chunks);
}
export async function parseContactRequest(request: Request): Promise<{raw: unknown; attachments: Attachment[]}> {
  const buffer = await boundedBody(request);
  const type = request.headers.get("content-type") ?? "";
  if (type.startsWith("application/json")) {
    if (buffer.length > 32_768) throw new InputError("payload_too_large", "Please shorten the request.", 413);
    try {return {raw: JSON.parse(buffer.toString("utf8")), attachments: []};} catch {throw new InputError("invalid_json", "The request could not be read.");}
  }
  if (!type.startsWith("multipart/form-data")) throw new InputError("unsupported_content_type", "Please submit the request form.", 415);
  let form: FormData;
  try {form = await new Response(buffer, {headers: {"content-type": type}}).formData();} catch {throw new InputError("invalid_request", "The request could not be read.");}
  const payload = form.get("payload");
  if (typeof payload !== "string" || Buffer.byteLength(payload) > 32_768 || form.getAll("payload").length !== 1) throw new InputError("invalid_payload", "Please check the request details.");
  let raw: unknown; try {raw = JSON.parse(payload);} catch {throw new InputError("invalid_json", "The request could not be read.");}
  if (Array.from(form.keys()).some(key => !["payload", "photos", "photos[]"].includes(key))) throw new InputError("invalid_field", "Unexpected request field.");
  const files = [...form.getAll("photos"), ...form.getAll("photos[]")];
  if (files.length > 3) throw new InputError("too_many_photos", "You can attach up to 3 photos.");
  const attachments: Attachment[] = [];
  for (const [index, file] of files.entries()) {
    if (typeof file === "string" || !file.size || file.size > MAX_PHOTO_BYTES) throw new InputError("invalid_photo_size", "Each prepared photo must be between 1 byte and 1 MB.");
    const mimeFormats: Record<string, string> = {"image/jpeg": "jpeg", "image/png": "png", "image/webp": "webp"};
    if (!mimeFormats[file.type]) throw new InputError("invalid_photo_type", "Please attach JPEG, PNG, or WebP photos.");
    try {
      const input = sharp(Buffer.from(await file.arrayBuffer()), {limitInputPixels: 12_000_000, failOn: "warning"});
      const info = await input.metadata();
      if (info.format !== mimeFormats[file.type] || (info.pages ?? 1) > 1) throw new Error("Invalid format");
      const content = await input.rotate().resize({width: 2400, height: 2400, fit: "inside", withoutEnlargement: true}).jpeg({quality: 85}).toBuffer();
      if (content.length > MAX_PHOTO_BYTES) throw new Error("Photo too large");
      attachments.push({filename: `appliance-photo-${index + 1}.jpg`, content, contentType: "image/jpeg"});
    } catch {throw new InputError("invalid_photo", "A photo could not be read. Please remove it or choose another JPEG, PNG, or WebP photo.");}
  }
  return {raw, attachments};
}
