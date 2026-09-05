import { z } from "zod";

export const applianceValues = [
  "refrigerator-freezer", "ice-maker", "washer-dryer", "dishwasher-disposal",
  "oven-cooktop", "microwave", "other",
] as const;
export const contactMethods = ["call", "text", "email"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z.string().trim().min(10, "Please enter a valid phone number.").max(30),
  email: z.union([z.literal(""), z.string().trim().email("Please enter a valid email.")]),
  applianceType: z.enum(applianceValues),
  problem: z.string().trim().min(10, "Please briefly describe the problem.").max(1500),
  zipCode: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/, "Please enter a valid ZIP code."),
  preferredContact: z.enum(contactMethods),
  bestTime: z.string().trim().min(2, "Please choose the best time to reach you.").max(80),
  fallbackToText: z.boolean().default(false),
  consent: z.literal(true, { error: "Please confirm we may contact you." }),
  website: z.string().max(0).optional().default(""),
  formStartedAt: z.coerce.number().int().positive(),
  pageUrl: z.string().url().optional().or(z.literal("")),
  turnstileToken: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.preferredContact === "email" && !data.email) {
    ctx.addIssue({ code: "custom", path: ["email"], message: "Email is required when email is your preferred contact method." });
  }
});

export type ContactPayload = z.infer<typeof contactSchema>;

export function fieldErrors(error: z.ZodError<ContactPayload>) {
  return error.flatten().fieldErrors;
}
