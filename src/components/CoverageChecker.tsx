"use client";
import { useEffect, useRef, useState } from "react";
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
  const [googleReady, setGoogleReady] = useState(false);
  const mapsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = mapsRef.current;
    if (!target) return;
    if (!("IntersectionObserver" in window)) {
      const fallback = globalThis.setTimeout(() => setGoogleReady(true), 0);
      return () => globalThis.clearTimeout(fallback);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {setGoogleReady(true); observer.disconnect();}
    }, {rootMargin: "200px 0px"});
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
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
    <div className="map-duo" ref={mapsRef}>
      <div className="service-map-preview">
        <div className="map-pane-heading"><IconMapPin size={18} /><strong>3D service area</strong></div>
        <div className="service-map-visual">
          <picture>
            <source srcSet="/images/map/upstate-service-area-3d.avif" type="image/avif" />
            <img src="/images/map/upstate-service-area-3d.webp" alt="" width="960" height="640" loading="lazy" decoding="async" />
          </picture>
          {mapCities.map(city => <a className={`map-city map-city-${city.position}`} href={cityMapUrl(city.name)} key={city.name} rel="noreferrer" target="_blank" aria-label={`Open ${city.name}, South Carolina in Google Maps`}><span>{city.name}</span></a>)}
        </div>
        <div className="map-preview-copy">
          <span className="map-preview-icon"><IconMapPin size={24} /></span>
          <div><p className="eyebrow">Our Upstate service area</p><h3>Where Appliance RS works</h3><p>Select a city marker to open it in Google Maps.</p></div>
        </div>
      </div>
      <div className="google-map-pane">
        <div className="map-pane-heading"><IconBrandGoogle size={18} /><strong>Google Maps</strong></div>
        {googleReady ? <iframe allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={business.mapEmbed} title="Appliance RS service location on Google Maps" /> : <div className="google-map-placeholder"><IconBrandGoogle size={28} /><strong>Google map loads when you reach this section</strong><button type="button" onClick={() => setGoogleReady(true)}>Load map now</button></div>}
      </div>
    </div>
    <a className="map-link" href={business.googleProfile} rel="noreferrer" target="_blank"><IconBrandGoogle /> Open Appliance RS on Google <IconArrowRight /></a>
  </div>;
}
