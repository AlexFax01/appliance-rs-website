import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import { contactSchema, type ContactPayload } from "../src/lib/contact-schema.js";
import problems from "../src/content/problems.json" with { type: "json" };
import { parseContactRequest, InputError } from "../src/lib/server/contact-input.js";

export const config = { runtime: "nodejs" };

const attempts = new Map<string, number[]>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 6;

function selectedProblems(payload: ContactPayload) {
  return problems[payload.applianceType].filter(problem => payload.selectedProblemIds.includes(problem.id)).map(problem => problem.label).join("; ") || "None selected";
}

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
    `Appliance: ${payload.applianceType}`,
    `Brand: ${payload.brand || "Not provided"}`,
    `Model: ${payload.model || "Not provided"}`,
    `Selected problems: ${selectedProblems(payload)}`,
    `Service address: ${payload.address}`,
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
    ["Appliance", payload.applianceType],
    ["Brand", payload.brand || "Not provided"], ["Model", payload.model || "Not provided"],
    ["Selected problems", selectedProblems(payload)],
    ["Service address", payload.address],
    ["ZIP", payload.zipCode], ["Preferred contact", payload.preferredContact],
    ["Best time", payload.bestTime], ["Text fallback", payload.fallbackToText ? "Yes" : "No"],
  ];
  return `<h1>New Appliance RS callback request</h1><table>${rows.map(([label, value]) => `<tr><th align="left" style="padding:6px 16px 6px 0">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("")}</table><h2>Problem</h2><p>${escapeHtml(payload.problem).replace(/\n/g, "<br>")}</p>`;
}

async function handle(request: Request) {
  if (request.method !== "POST") return json({ ok: false, code: "method_not_allowed" }, 405);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return json({ ok: false, code: "rate_limited", message: "Please wait before trying again." }, 429);

  let input: Awaited<ReturnType<typeof parseContactRequest>>;
  try { input = await parseContactRequest(request); }
  catch (error) {
    if (error instanceof InputError) return json({ok: false, code: error.code, message: error.message}, error.status);
    return json({ok: false, code: "invalid_request", message: "Please check your request and try again."}, 400);
  }
  const raw = input.raw as Record<string, unknown> | null;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return json({ ok: false, code: "invalid_json" }, 400);
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
    const delivery = await transport.sendMail({
      from: CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL ?? "appliansersl@gmail.com",
      subject: `Appliance RS service request — ${parsed.data.applianceType} — ${requestId.slice(0, 8)}`,
      text: textBody(parsed.data, requestId),
      html: htmlBody(parsed.data, requestId),
      attachments: input.attachments,
    });
    if (!delivery.accepted?.length) throw new Error("No recipient accepted the request");
    return json({ ok: true, requestId });
  } catch {
    return json({ ok: false, code: "delivery_failed", message: "We couldn’t deliver the request right now." }, 502);
  }
}

const contactFunction = { fetch: handle };

export default contactFunction;
