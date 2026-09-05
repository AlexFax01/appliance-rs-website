"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { IconAlertCircle, IconCircleCheck, IconSend } from "@tabler/icons-react";
import { appliances, business } from "@/content/site";
import { contactSchema } from "@/lib/contact-schema";

type FormState = "idle" | "submitting" | "success" | "error" | "preview";

export function ContactForm({ selectedAppliance }: { selectedAppliance: string }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedAt = useRef(0);
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "/api/contact";
  const isPreview = (process.env.NEXT_PUBLIC_SITE_STAGE ?? "preview") !== "production";

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const options = useMemo(() => [...appliances, { value: "other", title: "Other appliance" }], []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    setErrors({});

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      applianceType: String(form.get("applianceType") ?? "other"),
      problem: String(form.get("problem") ?? ""),
      zipCode: String(form.get("zipCode") ?? ""),
      preferredContact: String(form.get("preferredContact") ?? "call"),
      bestTime: String(form.get("bestTime") ?? "Anytime"),
      fallbackToText: form.get("fallbackToText") === "on",
      consent: form.get("consent") === "on",
      website: String(form.get("website") ?? ""),
      formStartedAt: startedAt.current,
      pageUrl: window.location.href,
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      setState("error");
      setMessage("Please check the highlighted fields.");
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (response.ok) {
        setState("success");
        setMessage("Thanks — your request was sent. Appliance RS will follow up soon.");
        event.currentTarget.reset();
        startedAt.current = Date.now();
        return;
      }
      if (response.status === 404 && isPreview) {
        setState("preview");
        setMessage("Preview check passed. Email delivery activates when the demo endpoint is configured.");
        return;
      }
      const result = (await response.json().catch(() => null)) as { message?: string; fieldErrors?: Record<string, string[]> } | null;
      if (result?.fieldErrors) {
        setErrors(Object.fromEntries(Object.entries(result.fieldErrors).map(([key, value]) => [key, value[0]])));
      }
      throw new Error(result?.message ?? "We couldn’t send the request right now.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? `${error.message} Please call or text ${business.phoneDisplay}.` : `Please call or text ${business.phoneDisplay}.`);
    }
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
        <Field label="Email (optional)" error={errors.email}>
          <input aria-invalid={Boolean(errors.email)} autoComplete="email" inputMode="email" name="email" placeholder="jane@example.com" type="email" />
        </Field>
        <Field label="ZIP code" error={errors.zipCode}>
          <input aria-invalid={Boolean(errors.zipCode)} autoComplete="postal-code" inputMode="numeric" maxLength={10} name="zipCode" placeholder="29601" required />
        </Field>
        <Field label="Appliance" error={errors.applianceType}>
          <select defaultValue={selectedAppliance || "refrigerator-freezer"} key={selectedAppliance} name="applianceType">
            {options.map((item) => <option key={item.value} value={item.value}>{item.title}</option>)}
          </select>
        </Field>
        <Field label="Best time to reach you" error={errors.bestTime}>
          <select defaultValue="Anytime" name="bestTime">
            <option>Anytime</option><option>Morning</option><option>Afternoon</option><option>Evening</option>
          </select>
        </Field>
        <Field className="form-span" label="What’s happening?" error={errors.problem}>
          <textarea aria-invalid={Boolean(errors.problem)} name="problem" placeholder="Tell us the appliance brand, model if known, and what it’s doing." required rows={4} />
        </Field>
      </div>

      <fieldset className="contact-method">
        <legend>How should we contact you?</legend>
        <label><input defaultChecked name="preferredContact" type="radio" value="call" /> Call</label>
        <label><input name="preferredContact" type="radio" value="text" /> Text</label>
        <label><input name="preferredContact" type="radio" value="email" /> Email</label>
      </fieldset>

      <label className="check-row"><input name="fallbackToText" type="checkbox" /> If I don’t answer, send me a text.</label>
      <label className="check-row"><input name="consent" type="checkbox" /> I agree Appliance RS may contact me about this service request.</label>
      {errors.consent ? <p className="field-error">{errors.consent}</p> : null}
      <input aria-hidden="true" autoComplete="off" className="honeypot" name="website" tabIndex={-1} />

      {message ? (
        <div aria-live="polite" className={`form-notice form-notice-${state}`} role="status">
          {state === "success" ? <IconCircleCheck size={20} /> : <IconAlertCircle size={20} />}{message}
        </div>
      ) : null}

      <button className="button-3d button-primary form-submit" disabled={state === "submitting"} type="submit">
        <IconSend size={21} /> {state === "submitting" ? "Sending…" : "Request my callback"}
      </button>
      <p className="form-fineprint">No obligation. We’ll confirm the service details before scheduling.</p>
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
