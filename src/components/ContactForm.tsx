"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { IconAlertCircle, IconMessage, IconSend } from "@tabler/icons-react";
import { appliances, business, problemCatalog } from "@/content/site";

type FormState = "idle" | "preparing" | "ready" | "error";

const fieldOrder = [
  "name", "phone", "address", "zipCode", "applianceType", "bestTime", "brand", "model",
  "selectedProblemIds", "problem", "preferredContact", "consent",
] as const;

export function ContactForm({ selectedAppliance, onApplianceChange, selectedProblemIds, onProblemsChange, zip, onZipChange }: { selectedAppliance: string; onApplianceChange: (value: string) => void; selectedProblemIds: string[]; onProblemsChange: (ids: string[]) => void; zip: string; onZipChange: (zip: string) => void }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedAt = useRef(0);
  const [smsHref, setSmsHref] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const options = useMemo(() => [...appliances, { value: "other", title: "Other appliance" }], []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "preparing") return;
    const formElement = event.currentTarget;
    setState("preparing");
    setMessage("");
    setSmsHref("");
    setErrors({});

    const form = new FormData(event.currentTarget);
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

    let schemaModule: typeof import('@/lib/contact-schema');
    try { schemaModule = await import('@/lib/contact-schema'); }
    catch {setState('error');setMessage('The form could not finish loading. Your details are saved; please try again.');return;}
    const parsed = schemaModule.contactSchema.safeParse(payload);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      setState("error");
      setMessage("Please check the highlighted fields.");
      const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);
      window.requestAnimationFrame(() => {
        const selector = firstInvalidField === "selectedProblemIds"
          ? ".selected-problems button"
          : firstInvalidField ? `[name="${firstInvalidField}"]` : null;
        const target = selector ? formElement.querySelector<HTMLElement>(selector) : null;
        target?.focus({ preventScroll: true });
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    const appliance = options.find(item => item.value === parsed.data.applianceType)?.title ?? "Other appliance";
    const selectedLabels = (problemCatalog[parsed.data.applianceType] ?? [])
      .filter(problem => parsed.data.selectedProblemIds.includes(problem.id))
      .map(problem => problem.label);
    const lines = [
      "Hi Appliance RS, I would like to request appliance repair.",
      "",
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
    const href = `sms:${business.phoneHref}${separator}body=${encodeURIComponent(lines)}`;
    setSmsHref(href);
    setState("ready");
    setMessage("Your service request is ready. Review the text in Messages and press Send.");
    window.setTimeout(() => document.getElementById("sms-ready-link")?.click(), 0);
  }

  return (
    <form className="callback-form" id="callback-form" noValidate onSubmit={submit}>
      <div className="form-grid">
        <Field label="Your name" error={errors.name}>
          <input aria-invalid={Boolean(errors.name)} autoComplete="name" name="name" placeholder="Jane Smith" required />
        </Field>
        <Field label="Phone number" error={errors.phone}>
          <input aria-invalid={Boolean(errors.phone)} autoComplete="tel" inputMode="tel" name="phone" placeholder="(864) 555-0123" required />
        </Field>
        <Field className="form-span" label="Service address" error={errors.address}>
          <input aria-invalid={Boolean(errors.address)} autoComplete="street-address" name="address" placeholder="123 Main St, Greenville, SC" maxLength={200} required />
        </Field>
        <Field label="ZIP code" error={errors.zipCode}>
          <input aria-invalid={Boolean(errors.zipCode)} autoComplete="postal-code" inputMode="numeric" maxLength={10} name="zipCode" placeholder="29601" value={zip} onChange={event => onZipChange(event.target.value)} required />
        </Field>
        <Field label="Appliance" error={errors.applianceType}>
          <select value={selectedAppliance} onChange={event => onApplianceChange(event.target.value)} name="applianceType">
            {options.map((item) => <option key={item.value} value={item.value}>{item.title}</option>)}
          </select>
        </Field>
        <Field label="Best time to reach you" error={errors.bestTime}>
          <select defaultValue="Anytime" name="bestTime">
            <option>Anytime</option><option>Morning</option><option>Afternoon</option><option>Evening</option>
          </select>
        </Field>
        <Field label="Brand (optional)" error={errors.brand}><input name="brand" placeholder="e.g. Whirlpool" maxLength={80} /></Field>
        <Field label="Model (optional)" error={errors.model}><input name="model" placeholder="Model number from the label" maxLength={100} /></Field>
        <fieldset className="form-span selected-problems"><legend>Common problems (optional)</legend>
          <div className="problem-options">{(problemCatalog[selectedAppliance as keyof typeof problemCatalog] ?? []).map(problem => <button type="button" className="problem-option" key={problem.id} aria-pressed={selectedProblemIds.includes(problem.id)} onClick={() => onProblemsChange(selectedProblemIds.includes(problem.id) ? selectedProblemIds.filter(id => id !== problem.id) : [...selectedProblemIds, problem.id])}>{problem.label}</button>)}</div>
          {errors.selectedProblemIds ? <p className="field-error">{errors.selectedProblemIds}</p> : null}
        </fieldset>
        <Field className="form-span" label={selectedProblemIds.length ? "Anything else? (optional)" : "What’s happening?"} error={errors.problem}>
          <textarea aria-invalid={Boolean(errors.problem)} name="problem" placeholder="Tell us more about what’s happening." required={!selectedProblemIds.length} rows={3} maxLength={1500} />
        </Field>
      </div>
      <fieldset className="contact-method">
        <legend>How should we reply?</legend>
        <label><input defaultChecked name="preferredContact" type="radio" value="call" /> Call</label>
        <label><input name="preferredContact" type="radio" value="text" /> Text</label>
      </fieldset>

      <label className="check-row"><input name="fallbackToText" type="checkbox" /> If I don’t answer, send me a text.</label>
      <label className="check-row"><input name="consent" type="checkbox" /> I agree Appliance RS may contact me about this service request.</label>
      {errors.consent ? <p className="field-error">{errors.consent}</p> : null}
      <input aria-hidden="true" autoComplete="off" className="honeypot" name="website" tabIndex={-1} />

      {message ? (
        <div aria-live="polite" className={`form-notice form-notice-${state}`} role="status">
          {state === "ready" ? <IconMessage size={20} /> : <IconAlertCircle size={20} />}<span>{message}{smsHref ? <> <a href={smsHref} id="sms-ready-link">Open the SMS again.</a></> : null}</span>
        </div>
      ) : null}

      <button className="button-3d button-primary form-submit" disabled={state === "preparing"} type="submit">
        <IconSend size={21} /> {state === "preparing" ? "Preparing your message…" : "Review & open SMS"}
      </button>
      <p className="form-fineprint">Nothing is sent automatically. Your phone opens a prepared text to {business.phoneDisplay}, and you press Send.</p>
    </form>
  );
}

function Field({ label, error, children, className = "" }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>{children}{error ? <small className="field-error">{error}</small> : null}
    </label>
  );
}
