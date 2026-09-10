"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconMapPin, IconArrowRight, IconBrandGoogle } from "@tabler/icons-react";
import { checkCoverage, coverageSource } from "@/content/coverage";
import { business } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { ServiceAreaMap } from "./ServiceAreaMap";

export function CoverageChecker({onZip = () => undefined}: {onZip?: (zip: string) => void}) {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<ReturnType<typeof checkCoverage> | null>(null);
  const evaluate = (value: string, showInvalid = true) => {
    const answer = checkCoverage(value);
    if (answer.status === "invalid" && !showInvalid) {
      setResult(null);
      return;
    }
    setResult(answer);
    if (answer.status !== "invalid") {
      onZip(answer.zip);
      trackEvent("zip_check", { coverage_result: answer.status === "listed" ? "covered" : "unknown" });
    }
  };
  return <div className="map-card coverage-card">
    <div className="coverage-checker">
      <span className="coverage-pin"><IconMapPin size={34} /></span>
      <p className="eyebrow">Local service, close to home</p><h3>Do we serve your area?</h3>
      <p>Enter your ZIP code to check our listed service towns.</p>
      <form onSubmit={event => {event.preventDefault(); evaluate(zip);}} noValidate>
        <label htmlFor="coverage-zip">ZIP code</label>
        <div className="coverage-input"><input id="coverage-zip" inputMode="numeric" autoComplete="postal-code" placeholder="29601" maxLength={10} value={zip} aria-invalid={result?.status === "invalid"} aria-describedby="coverage-result" onChange={event => {const value = event.target.value; setZip(value); evaluate(value, /^\d{5}(?:-\d{4})?$/.test(value.trim()));}} /><button className="button-3d button-primary" type="submit">Check my area</button></div>
      </form>
      <div id="coverage-result" className={`coverage-result ${result?.status ?? ""}`} role="status">
        {result?.status === "invalid" ? "Please enter a valid 5-digit ZIP code or ZIP+4." : result?.status === "listed" ? <><strong>{result.town}, South Carolina</strong><span>Your ZIP is in our listed service area. We’ll confirm your address when scheduling.</span></> : result?.status === "unconfirmed" ? "Please contact us to confirm service in your area." : "Exact address and service availability are confirmed when scheduling."}
      </div>
      <small className="coverage-source">Postal data: <a href={coverageSource.url} target="_blank" rel="noreferrer">GeoNames</a> · Checked September 5, 2026</small>
    </div>
    <div className="google-service-map">
      <div className="map-pane-heading"><IconBrandGoogle size={18} /><strong>Google service map</strong><span>Upstate South Carolina</span></div>
      <ServiceAreaMap selectedTown={result?.status === "listed" ? result.town ?? null : null} onRequest={town => {
        const requestZip = result?.status === "listed" && result.town === town.name ? result.zip : town.zips[0];
        setZip(requestZip); evaluate(requestZip);
        const contact = document.getElementById("contact");
        if (!contact) {
          router.push(`/?zip=${encodeURIComponent(requestZip)}#contact`);
          return;
        }
        contact.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        document.querySelector<HTMLInputElement>('#contact [name="name"]')?.focus({ preventScroll: true });
      }} />
    </div>
    <a className="map-link" data-analytics-event="google_profile_click" data-analytics-location="service_map" href={business.googleProfile} rel="noreferrer" target="_blank"><IconBrandGoogle /> Open Appliance RS on Google <IconArrowRight /></a>
  </div>;
}
