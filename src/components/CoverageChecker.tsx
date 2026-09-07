"use client";
import { useState } from "react";
import { IconMapPin, IconArrowRight, IconBrandGoogle } from "@tabler/icons-react";
import { checkCoverage, coverageSource } from "@/content/coverage";
import { business } from "@/content/site";

const mapCities = [
  { name: "Travelers Rest", position: "travelers-rest" },
  { name: "Greenville", position: "greenville" },
  { name: "Greer", position: "greer" },
  { name: "Simpsonville", position: "simpsonville" },
  { name: "Spartanburg", position: "spartanburg" },
] as const;

const cityMapUrl = (name: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, SC`)}`;

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
    {mapOpen ? <div className="interactive-map">
      <iframe allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={business.mapEmbed} title="Appliance RS service location on Google Maps" />
      <button className="map-close" type="button" onClick={() => setMapOpen(false)}>Back to service area</button>
    </div> : <div className="service-map-preview">
      <div className="service-map-visual">
        <picture>
          <source srcSet="/images/map/upstate-service-area-3d.avif" type="image/avif" />
          <img src="/images/map/upstate-service-area-3d.webp" alt="" width="960" height="640" loading="lazy" decoding="async" />
        </picture>
        {mapCities.map(city => <a className={`map-city map-city-${city.position}`} href={cityMapUrl(city.name)} key={city.name} rel="noreferrer" target="_blank" aria-label={`Open ${city.name}, South Carolina in Google Maps`}><span>{city.name}</span></a>)}
      </div>
      <div className="map-preview-copy">
        <span className="map-preview-icon"><IconMapPin size={24} /></span>
        <div><p className="eyebrow">Our Upstate service area</p><h3>See where Appliance RS works</h3><p>Explore our main service towns without loading a live map.</p></div>
        <button className="button-3d button-primary" type="button" onClick={() => setMapOpen(true)}>Explore interactive map <IconArrowRight size={18} /></button>
      </div>
    </div>}
    <a className="map-link" href={business.googleProfile} rel="noreferrer" target="_blank"><IconBrandGoogle /> Open Appliance RS on Google <IconArrowRight /></a>
  </div>;
}
