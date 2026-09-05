import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import { z } from "zod";

export const config = { runtime: "nodejs" };

const attempts = new Map<string, number[]>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 6;

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(10).max(30),
  email: z.union([z.literal(""), z.string().trim().email()]),
  applianceType: z.enum(["refrigerator-freezer", "ice-maker", "washer-dryer", "dishwasher-disposal", "oven-cooktop", "microwave", "other"]),
  problem: z.string().trim().min(10).max(1500),
  zipCode: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/),
  preferredContact: z.enum(["call", "text", "email"]),
  bestTime: z.string().trim().min(2).max(80),
  fallbackToText: z.boolean().default(false),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
  formStartedAt: z.coerce.number().int().positive(),
  pageUrl: z.string().url().optional().or(z.literal("")),
  turnstileToken: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.preferredContact === "email" && !data.email) {
    ctx.addIssue({ code: "custom", path: ["email"], message: "Email is required when email is your preferred contact method." });
  }
});

type ContactPayload = z.infer<typeof contactSchema>;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character] ?? character);
}

function limited(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const data = new URLSearchParams({ secret, response: token, remoteip: ip });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: data });
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

function textBody(payload: ContactPayload, requestId: string) {
  return [
    `New Appliance RS callback request (${requestId})`,
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email || "Not provided"}`,
    `Appliance: ${payload.applianceType}`,
    `ZIP: ${payload.zipCode}`,
    `Preferred contact: ${payload.preferredContact}`,
    `Best time: ${payload.bestTime}`,
    `Text fallback: ${payload.fallbackToText ? "Yes" : "No"}`,
    "",
    "Problem:",
    payload.problem,
    "",
    `Page: ${payload.pageUrl || "Not provided"}`,
  ].join("\n");
}

function htmlBody(payload: ContactPayload, requestId: string) {
  const rows = [
    ["Request", requestId], ["Name", payload.name], ["Phone", payload.phone],
    ["Email", payload.email || "Not provided"], ["Appliance", payload.applianceType],
    ["ZIP", payload.zipCode], ["Preferred contact", payload.preferredContact],
    ["Best time", payload.bestTime], ["Text fallback", payload.fallbackToText ? "Yes" : "No"],
  ];
  return `<h1>New Appliance RS callback request</h1><table>${rows.map(([label, value]) => `<tr><th align="left" style="padding:6px 16px 6px 0">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("")}</table><h2>Problem</h2><p>${escapeHtml(payload.problem).replace(/\n/g, "<br>")}</p>`;
}

async function handle(request: Request) {
  if (request.method !== "POST") return json({ ok: false, code: "method_not_allowed" }, 405);
  if (Number(request.headers.get("content-length") ?? 0) > 32_768) return json({ ok: false, code: "payload_too_large" }, 413);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return json({ ok: false, code: "rate_limited", message: "Please wait before trying again." }, 429);

  const raw = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!raw) return json({ ok: false, code: "invalid_json" }, 400);
  if (typeof raw.website === "string" && raw.website.length > 0) return json({ ok: true, requestId: randomUUID() });
  const startedAt = Number(raw.formStartedAt ?? 0);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1800) return json({ ok: false, code: "spam_check", message: "Please try again." }, 429);

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return json({ ok: false, code: "validation", fieldErrors: parsed.error.flatten().fieldErrors }, 400);
  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) return json({ ok: false, code: "spam_check", message: "Please complete the verification." }, 429);

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_FROM_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_FROM_EMAIL) {
    return json({ ok: false, code: "delivery_not_configured", message: "Email delivery is not configured yet." }, 502);
  }

  const requestId = randomUUID();
  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT ?? 587) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transport.sendMail({
      from: CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL ?? "appliansersl@gmail.com",
      replyTo: parsed.data.email || undefined,
      subject: `Appliance RS service request — ${parsed.data.applianceType} — ${requestId.slice(0, 8)}`,
      text: textBody(parsed.data, requestId),
      html: htmlBody(parsed.data, requestId),
    });
    return json({ ok: true, requestId });
  } catch {
    return json({ ok: false, code: "delivery_failed", message: "We couldn’t deliver the request right now." }, 502);
  }
}

const contactFunction = { fetch: handle };

export default contactFunction;
