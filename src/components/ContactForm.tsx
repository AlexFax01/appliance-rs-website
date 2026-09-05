"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { IconAlertCircle, IconCircleCheck, IconSend } from "@tabler/icons-react";
import { appliances, business, problemCatalog } from "@/content/site";

type FormState = "idle" | "submitting" | "success" | "error" | "preview";

export function ContactForm({ selectedAppliance, onApplianceChange, selectedProblemIds, onProblemsChange, zip, onZipChange }: { selectedAppliance: string; onApplianceChange: (value: string) => void; selectedProblemIds: string[]; onProblemsChange: (ids: string[]) => void; zip: string; onZipChange: (zip: string) => void }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedAt = useRef(0);
  const [photos, setPhotos] = useState<{file: File; url: string}[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const photoUrls = useRef(new Set<string>());
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "/api/contact";
  const isPreview = (process.env.NEXT_PUBLIC_SITE_STAGE ?? "preview") !== "production";

  useEffect(() => {
    startedAt.current = Date.now();
    const urls = photoUrls.current;
    return () => {urls.forEach(url => URL.revokeObjectURL(url));};
  }, []);

  async function addPhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []); event.target.value = "";
    if (!files.length) return;
    if (files.length + photos.length > 3) {setPhotoError("You can attach up to 3 photos. Please remove a photo first."); return;}
    setPreparing(true); setPhotoError("");
    const prepared: {file: File; url: string}[] = [];
    const failures: string[] = [];
    try {
      const {preparePhoto} = await import("@/lib/prepare-photo");
      for (const original of files) {
        try {const file = await preparePhoto(original); const url = URL.createObjectURL(file); photoUrls.current.add(url); prepared.push({file, url});}
        catch (error) {failures.push(error instanceof Error ? error.message : "This photo could not be prepared.");}
      }
      setPhotos(current => [...current, ...prepared]); setPhotoError(failures.join(" "));
    } catch {setPhotoError("Photo preparation could not load. Please try again. Your other details are saved.");}
    finally {setPreparing(false);}
  }
  function removePhoto(url: string) {URL.revokeObjectURL(url); photoUrls.current.delete(url); setPhotos(current => current.filter(photo => photo.url !== url)); setPhotoError("");}

  const options = useMemo(() => [...appliances, { value: "other", title: "Other appliance" }], []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preparing || state === "submitting") return;
    const formElement = event.currentTarget;
    setState("submitting");
    setMessage("");
    setErrors({});

    const form = new FormData(formElement);
    const payload = {
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      applianceType: String(form.get("applianceType") ?? "other"),
      problem: String(form.get("problem") ?? ""),
      selectedProblemIds,
      brand: String(form.get("brand") ?? ""),
      model: String(form.get("model") ?? ""),
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
      return;
    }

    try {
      const body = new FormData(); body.append("payload", JSON.stringify(parsed.data));
      photos.forEach(photo => body.append("photos[]", photo.file));
      const response = await fetch(endpoint, {method: "POST", body});
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; fieldErrors?: Record<string, string[]> } | null;
      if (response.ok && result?.ok === true) {
        setState("success");
        setMessage("Thanks — your request was sent. Appliance RS will follow up soon.");
        formElement.reset(); photos.forEach(photo => {URL.revokeObjectURL(photo.url); photoUrls.current.delete(photo.url);}); setPhotos([]); onProblemsChange([]); onZipChange("");
        startedAt.current = Date.now();
        return;
      }
      if (response.status === 404 && isPreview) {
        setState("preview");
        setMessage("Preview check passed. Email delivery activates when the demo endpoint is configured.");
        return;
      }
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
      <div className="photo-upload">
        <label htmlFor="repair-photos">Photos (optional)</label>
        <p>Show us the appliance, error code, or model label. Look around the door frame or an accessible label; don’t disassemble or move the appliance.</p>
        <input id="repair-photos" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" multiple onChange={addPhotos} disabled={preparing || state === "submitting"} aria-describedby="photo-help photo-feedback" />
        <small id="photo-help">Up to 3 photos · JPEG, PNG or WebP · Automatically resized to 1 MB each. HEIC works when your browser can open it.</small>
        <div id="photo-feedback" role="status">{preparing ? "Preparing your photos…" : photoError ? <p className="field-error">{photoError}</p> : null}</div>
        <div className="photo-previews">{photos.map(photo => <div className="photo-preview" key={photo.url}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt={`Attachment preview: ${photo.file.name}`} /><span>{photo.file.name}</span><small>{Math.ceil(photo.file.size / 1000)} KB</small><button type="button" onClick={() => removePhoto(photo.url)} disabled={preparing || state === "submitting"} aria-label={`Remove ${photo.file.name}`}>Remove</button>
        </div>)}</div>
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

      <button className="button-3d button-primary form-submit" disabled={state === "submitting" || preparing} type="submit">
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
