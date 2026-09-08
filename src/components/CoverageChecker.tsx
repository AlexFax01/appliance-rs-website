"use client";
import { useState } from "react";
import { IconMapPin, IconArrowRight, IconBrandGoogle, IconMap2 } from "@tabler/icons-react";
import { checkCoverage, coverageSource } from "@/content/coverage";
import { business } from "@/content/site";

export function CoverageChecker({onZip}: {onZip: (zip: string) => void}) {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<ReturnType<typeof checkCoverage> | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const evaluate = (value: string, showInvalid = true) => {
    const answer = checkCoverage(value);
    if (answer.status === "invalid" && !showInvalid) {
      setResult(null);
      return;
    }
    setResult(answer);
    if (answer.status !== "invalid") onZip(answer.zip);
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
      <div className="map-pane-heading"><IconBrandGoogle size={18} /><strong>Service area</strong><span>Upstate South Carolina</span></div>
      <div className={`service-pulse${mapOpen ? " is-interactive" : ""}`}>
        {mapOpen ? <>
          <iframe allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" src={business.mapEmbed} title="Appliance RS service area on Google Maps" />
          <button className="pulse-mode-button" onClick={() => setMapOpen(false)} type="button"><IconMap2 size={17} />Back to overview</button>
        </> : <div className="service-map-preview">
          <div aria-hidden="true" className="service-map-art">
            <span className="map-road map-road-one" /><span className="map-road map-road-two" /><span className="map-road map-road-three" />
            <span className="pulse-zone pulse-zone-west" /><span className="pulse-zone pulse-zone-center" /><span className="pulse-zone pulse-zone-east" />
          </div>
          <div className="service-map-preview-copy"><span>Approximate coverage</span><strong>Serving Upstate South Carolina</strong><p>Open the live map only when you need it.</p><button className="button-3d button-primary" type="button" onClick={() => setMapOpen(true)}><IconMap2 size={19} /> View service area</button></div>
        </div>}
      </div>
    </div>
    <a className="map-link" href={business.googleProfile} rel="noreferrer" target="_blank"><IconBrandGoogle /> Open Appliance RS on Google <IconArrowRight /></a>
  </div>;
}
