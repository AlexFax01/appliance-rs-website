"use client";

import { cloneElement, FormEvent, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { IconAlertCircle, IconCheck, IconCopy, IconMessage, IconSend } from "@tabler/icons-react";
import { appliances, business, problemCatalog } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { contactSchema } from "@/lib/contact-schema";

type FormState = "idle" | "preparing" | "ready" | "error";

const fieldOrder = [
  "name", "phone", "address", "zipCode", "applianceType", "bestTime", "brand", "model",
  "selectedProblemIds", "problem", "preferredContact", "consent",
] as const;

const fieldLabels: Record<string, string> = {
  name: "Your name", phone: "Phone number", address: "Service address", zipCode: "ZIP code",
  applianceType: "Appliance", bestTime: "Best time to reach you", brand: "Brand", model: "Model",
  selectedProblemIds: "Common problems", problem: "What’s happening?", preferredContact: "Reply method", consent: "Contact permission",
};

function focusField(form: HTMLFormElement, field: string) {
  const target = form.querySelector<HTMLElement>(field === "selectedProblemIds" ? ".selected-problems button" : `[name="${field}"]`);
  target?.focus({ preventScroll: true });
  target?.scrollIntoView({ behavior: "instant", block: "center" });
}

export function ContactForm({ selectedAppliance, onApplianceChange, selectedProblemIds, onProblemsChange, zip, onZipChange }: { selectedAppliance: string; onApplianceChange: (value: string) => void; selectedProblemIds: string[]; onProblemsChange: (ids: string[]) => void; zip: string; onZipChange: (zip: string) => void }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [smsHref, setSmsHref] = useState("");
  const [smsText, setSmsText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const startedAt = useRef(0);
  const trackedStart = useRef(false);

  useEffect(() => { startedAt.current = Date.now(); }, []);
  const options = useMemo(() => [...appliances, { value: "other", title: "Other appliance" }], []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "preparing") return;
    const formElement = event.currentTarget;
    setState("preparing");
    setMessage("");
    setSmsHref("");
    setSmsText("");
    setQrDataUrl("");
    setCopied(false);
    setErrors({});

    const form = new FormData(formElement);
    const payload = {
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      applianceType: String(form.get("applianceType") ?? "other"),
      problem: String(form.get("problem") ?? ""),
      selectedProblemIds,
      brand: String(form.get("brand") ?? ""),
      model: String(form.get("model") ?? ""),
      address: String(form.get("address") ?? ""),
      zipCode: String(form.get("zipCode") ?? ""),
      preferredContact: String(form.get("preferredContact") ?? "call"),
      bestTime: String(form.get("bestTime") ?? "Anytime"),
      fallbackToText: form.get("fallbackToText") === "on",
      consent: form.get("consent") === "on",
      website: String(form.get("website") ?? ""),
      formStartedAt: startedAt.current,
      pageUrl: window.location.href,
    };

    // Validation must work with the already-loaded form, even if the connection drops.
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      setState("error");
      setMessage("Please fix the following fields to review your request. Your entries are still here.");
      const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);
      window.requestAnimationFrame(() => {
        if (firstInvalidField) focusField(formElement, firstInvalidField);
      });
      return;
    }

    const appliance = options.find((item) => item.value === parsed.data.applianceType)?.title ?? "Other appliance";
    const selectedLabels = (problemCatalog[parsed.data.applianceType] ?? [])
      .filter((problem) => parsed.data.selectedProblemIds.includes(problem.id))
      .map((problem) => problem.label);
    const lines = [
      "Hi Appliance RS, I would like to request appliance repair.", "",
      `Name: ${parsed.data.name}`,
      `My callback number: ${parsed.data.phone}`,
      `Appliance: ${appliance}`,
      parsed.data.brand ? `Brand: ${parsed.data.brand}` : "",
      parsed.data.model ? `Model: ${parsed.data.model}` : "",
      selectedLabels.length ? `Common problems: ${selectedLabels.join("; ")}` : "",
      parsed.data.problem ? `Details: ${parsed.data.problem}` : "",
      `Service address: ${parsed.data.address}`,
      `ZIP code: ${parsed.data.zipCode}`,
      `Best time: ${parsed.data.bestTime}`,
      `Preferred reply: ${parsed.data.preferredContact}`,
      parsed.data.fallbackToText ? "If I miss your call, please text me." : "",
    ].filter(Boolean).join("\n");
    const separator = /iPad|iPhone|iPod/.test(navigator.userAgent) ? "&" : "?";
    const href = `sms:${business.smsRecipient.e164}${separator}body=${encodeURIComponent(lines)}`;
    setSmsText(lines);
    setSmsHref(href);
    trackEvent("repair_form_valid", { appliance_type: parsed.data.applianceType });
    setState("ready");
    setMessage("Your request is ready. Review it below, then open Messages and press Send.");
    window.requestAnimationFrame(() => document.getElementById("sms-ready-panel")?.scrollIntoView({ behavior: "smooth", block: "center" }));
    try {
      const { toDataURL } = await import("qrcode");
      setQrDataUrl(await toDataURL(href, { width: 260, margin: 1, errorCorrectionLevel: "M", color: { dark: "#06316d", light: "#ffffff" } }));
    } catch {
      // The SMS button and copy fallback stay available if QR generation fails.
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(smsText);
      setCopied(true);
      trackEvent("sms_copy", { method: "clipboard" });
    } catch {
      setCopied(false);
    }
  }

  return (
    <form className="callback-form" id="callback-form" noValidate onSubmit={submit} onFocusCapture={() => {
      if (!trackedStart.current) { trackedStart.current = true; trackEvent("repair_form_start"); }
    }}>
      <div className="form-grid">
        <Field label="Your name" error={errors.name}><input aria-invalid={Boolean(errors.name)} autoComplete="name" name="name" placeholder="Jane Smith" required /></Field>
        <Field label="Phone number" error={errors.phone}><input aria-invalid={Boolean(errors.phone)} autoComplete="tel" inputMode="tel" name="phone" placeholder="(864) 555-0123" required /></Field>
        <Field className="form-span" label="Service address" error={errors.address}><input aria-invalid={Boolean(errors.address)} autoComplete="street-address" name="address" placeholder="123 Main St, Greenville, SC" maxLength={200} required /></Field>
        <Field label="ZIP code" error={errors.zipCode}><input aria-invalid={Boolean(errors.zipCode)} autoComplete="postal-code" inputMode="numeric" maxLength={10} name="zipCode" placeholder="29601" value={zip} onChange={(event) => onZipChange(event.target.value)} required /></Field>
        <Field label="Appliance" error={errors.applianceType}><select value={selectedAppliance} onChange={(event) => onApplianceChange(event.target.value)} name="applianceType">{options.map((item) => <option key={item.value} value={item.value}>{item.title}</option>)}</select></Field>
        <Field label="Best time to reach you" error={errors.bestTime}><select defaultValue="Anytime" name="bestTime"><option>Anytime</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></Field>
        <Field label="Brand (optional)" error={errors.brand}><input name="brand" placeholder="e.g. Whirlpool" maxLength={80} /></Field>
        <Field label="Model (optional)" error={errors.model}><input name="model" placeholder="Model number from the label" maxLength={100} /></Field>
        <fieldset className="form-span selected-problems" aria-invalid={Boolean(errors.selectedProblemIds)} aria-describedby={errors.selectedProblemIds ? "request-problems-error" : undefined}><legend>Common problems (optional)</legend><div className="problem-options">{(problemCatalog[selectedAppliance as keyof typeof problemCatalog] ?? []).map((problem) => <button type="button" className="problem-option" key={problem.id} aria-pressed={selectedProblemIds.includes(problem.id)} onClick={() => onProblemsChange(selectedProblemIds.includes(problem.id) ? selectedProblemIds.filter((id) => id !== problem.id) : [...selectedProblemIds, problem.id])}>{problem.label}</button>)}</div>{errors.selectedProblemIds ? <p className="field-error" id="request-problems-error">{errors.selectedProblemIds}</p> : null}</fieldset>
        <Field className="form-span" label={selectedProblemIds.length ? "Anything else? (optional)" : "What’s happening?"} error={errors.problem}><textarea aria-invalid={Boolean(errors.problem)} name="problem" placeholder="Tell us more about what’s happening." required={!selectedProblemIds.length} rows={3} maxLength={600} /></Field>
      </div>
      <fieldset className="contact-method"><legend>How should we reply?</legend><label><input defaultChecked name="preferredContact" type="radio" value="call" /> Call</label><label><input name="preferredContact" type="radio" value="text" /> Text</label></fieldset>
      <label className="check-row"><input name="fallbackToText" type="checkbox" /> If I don’t answer, send me a text.</label>
      <label className="check-row"><input name="consent" type="checkbox" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "request-consent-error" : undefined} /> I agree Appliance RS may contact me about this service request.</label>
      {errors.consent ? <p className="field-error" id="request-consent-error">{errors.consent}</p> : null}
      <input aria-hidden="true" autoComplete="off" className="honeypot" name="website" tabIndex={-1} />

      {message ? <div aria-live={state === "error" ? "assertive" : "polite"} className={`form-notice form-notice-${state}`} role={state === "error" ? "alert" : "status"}>{state === "ready" ? <IconMessage size={20} /> : <IconAlertCircle size={20} />}<div><span>{message}</span>{state === "error" ? <ul className="form-error-list">{Object.entries(errors).map(([field, error]) => <li key={field}>{fieldLabels[field] ? <button type="button" onClick={(event) => focusField(event.currentTarget.form!, field)}><strong>{fieldLabels[field]}:</strong> {error}</button> : error}</li>)}</ul> : null}</div></div> : null}

      {state === "ready" ? (
        <section className="sms-ready-panel" id="sms-ready-panel" aria-label="Prepared SMS request">
          <div className="sms-review"><span>Prepared message</span><pre>{smsText}</pre></div>
          <div className="sms-actions">
            {qrDataUrl ? <div className="sms-qr"><Image alt="QR code that opens the prepared Appliance RS SMS on a phone" height={180} src={qrDataUrl} unoptimized width={180} /><small>Scan with your phone camera to continue in Messages.</small></div> : null}
            <div className="sms-action-buttons">
              <a className="button-3d button-orange" href={smsHref} id="sms-ready-link" onClick={() => trackEvent("sms_handoff", { method: "sms_link" })}><IconSend size={20} /> Open SMS</a>
              <button className="button-3d button-outline" onClick={copyMessage} type="button"><IconCopy size={19} /> {copied ? "Message copied" : "Copy message"}</button>
              {copied ? <small className="sms-copy-success"><IconCheck size={15} /> Copied. Paste it into Messages on your phone.</small> : null}
            </div>
          </div>
        </section>
      ) : <button className="button-3d button-primary form-submit" disabled={state === "preparing"} type="submit"><IconSend size={21} /> {state === "preparing" ? "Preparing your message…" : "Review request"}</button>}
      <p className="form-fineprint">Nothing is sent automatically or stored by this website. You review the prepared text and press Send in Messages.</p>
    </form>
  );
}

function Field({ label, error, children, className = "" }: { label: string; error?: string; children: ReactElement<{ name: string; "aria-invalid"?: boolean; "aria-describedby"?: string }>; className?: string }) {
  const errorId = `request-${children.props.name}-error`;
  return <label className={`field ${className}`}><span>{label}</span>{cloneElement(children, { "aria-invalid": Boolean(error), "aria-describedby": error ? errorId : undefined })}{error ? <small className="field-error" id={errorId}>{error}</small> : null}</label>;
}
