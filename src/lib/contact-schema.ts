import { z } from "zod";
import problems from "../content/problems.json" with { type: "json" };

export const applianceValues = [
  "refrigerator-freezer", "ice-maker", "washer-dryer", "dishwasher-disposal",
  "oven-cooktop", "microwave", "other",
] as const;
export const contactMethods = ["call", "text", "email"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z.string().trim().min(10, "Please enter a valid phone number.").max(30).refine(value => value.replace(/\D/g, "").length >= 10, "Please enter a valid phone number."),
  email: z.union([z.literal(""), z.string().trim().email("Please enter a valid email.")]),
  applianceType: z.enum(applianceValues),
  problem: z.string().trim().max(1500).default(""),
  selectedProblemIds: z.array(z.string().max(80)).max(4).default([]),
  brand: z.string().trim().max(80).default(""),
  model: z.string().trim().max(100).default(""),
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
  const allowed = problems[data.applianceType].map(problem => problem.id);
  if (data.selectedProblemIds.some(id => !allowed.includes(id)) || new Set(data.selectedProblemIds).size !== data.selectedProblemIds.length) {
    ctx.addIssue({code: "custom", path: ["selectedProblemIds"], message: "Please choose problems for the selected appliance."});
  }
  if (!data.selectedProblemIds.length && data.problem.length < 10) {
    ctx.addIssue({code: "custom", path: ["problem"], message: "Select a problem or briefly describe what’s happening."});
  }
  if (data.preferredContact === "email" && !data.email) {
    ctx.addIssue({ code: "custom", path: ["email"], message: "Email is required when email is your preferred contact method." });
  }
});

export type ContactPayload = z.infer<typeof contactSchema>;

export function fieldErrors(error: z.ZodError<ContactPayload>) {
  return error.flatten().fieldErrors;
}
