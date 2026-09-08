import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

const valid = {
  name: "Jane Smith", phone: "864-555-0123", applianceType: "refrigerator-freezer",
  problem: "The refrigerator is no longer cooling.", address: "123 Main St, Greenville, SC", zipCode: "29601", preferredContact: "call",
  bestTime: "Morning", fallbackToText: true, consent: true, website: "", formStartedAt: 1,
};

describe("contactSchema", () => {
  it("accepts a complete callback request", () => expect(contactSchema.safeParse(valid).success).toBe(true));
  it("rejects email as a contact method", () => {
    const result = contactSchema.safeParse({ ...valid, preferredContact: "email" });
    expect(result.success).toBe(false);
  });
  it("rejects an invalid ZIP code", () => expect(contactSchema.safeParse({ ...valid, zipCode: "abc" }).success).toBe(false));
  it("requires a service address", () => expect(contactSchema.safeParse({ ...valid, address: "" }).success).toBe(false));
});
