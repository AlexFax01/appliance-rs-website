"use client";
import { useEffect, useRef, useState } from "react";
import { IconMapPin, IconArrowRight, IconBrandGoogle, IconMap2 } from "@tabler/icons-react";
import { checkCoverage, coverageSource, townZips } from "@/content/coverage";
import { business, serviceAreas } from "@/content/site";

const pulseMarkers = [
  {name: "Travelers Rest", position: "travelers-rest"},
  {name: "Greenville", position: "greenville"},
  {name: "Greer", position: "greer"},
  {name: "Simpsonville", position: "simpsonville"},
  {name: "Spartanburg", position: "spartanburg"},
] as const;

export function CoverageChecker({onZip}: {onZip: (zip: string) => void}) {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<ReturnType<typeof checkCoverage> | null>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [mapInteractive, setMapInteractive] = useState(false);
  const [selectedTown, setSelectedTown] = useState("Greenville");
  const mapRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = mapRef.current;
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
  const movePulse = (event: React.PointerEvent<HTMLDivElement>) => {
    if (mapInteractive || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 8;
    pulseRef.current?.style.setProperty("--pulse-x", `${x}px`);
    pulseRef.current?.style.setProperty("--pulse-y", `${y}px`);
  };
  const resetPulse = () => {
    pulseRef.current?.style.setProperty("--pulse-x", "0px");
    pulseRef.current?.style.setProperty("--pulse-y", "0px");
  };
  const selectTown = (town: string) => {setSelectedTown(town); setMapInteractive(false);};
  const selectedZips = townZips[selectedTown] ?? [];
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
    <div className="google-service-map" ref={mapRef}>
      <div className="map-pane-heading"><IconBrandGoogle size={18} /><strong>Service Pulse</strong><span>Google Maps + local coverage</span></div>
      <div className={`service-pulse${mapInteractive ? " is-interactive" : ""}`} onPointerMove={movePulse} onPointerLeave={resetPulse} ref={pulseRef}>
        {googleReady ? <iframe allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" src={business.mapEmbed} title="Appliance RS service location on Google Maps" /> : <div className="google-map-placeholder"><IconBrandGoogle size={28} /><strong>Google map loads when you reach this section</strong><button type="button" onClick={() => setGoogleReady(true)}>Load map now</button></div>}
        {googleReady && !mapInteractive ? <div className="pulse-visual-layer">
          <span className="pulse-zone pulse-zone-west" /><span className="pulse-zone pulse-zone-center" /><span className="pulse-zone pulse-zone-east" />
          {pulseMarkers.map(marker => <button aria-label={`Show ${marker.name} service details`} className={`pulse-marker pulse-marker-${marker.position}${selectedTown === marker.name ? " is-selected" : ""}`} key={marker.name} onClick={() => selectTown(marker.name)} type="button"><IconMapPin /><span>{marker.name}</span></button>)}
          <aside aria-live="polite" className="pulse-city-card">
            <div><span>Selected service city</span><strong>{selectedTown}, SC</strong><small>ZIP zone: {selectedZips.join(", ") || "Confirm when scheduling"}</small></div>
          </aside>
        </div> : null}
        {googleReady ? <button className="pulse-mode-button" onClick={() => setMapInteractive(value => !value)} type="button"><IconMap2 size={17} />{mapInteractive ? "Show service pulse" : "Explore Google map"}</button> : null}
      </div>
      <div className="service-city-directory">
        <div className="service-city-heading"><IconMapPin size={20} /><div><strong>All 19 listed service towns</strong><span>Select a town to see its covered ZIP zone.</span></div></div>
        <div className="service-city-links">
          {serviceAreas.map(city => <button aria-pressed={selectedTown === city.name} className={city.primary ? "service-city-link service-city-primary" : "service-city-link"} key={city.name} onClick={() => selectTown(city.name)} type="button"><IconMapPin size={14} />{city.name}</button>)}
        </div>
      </div>
    </div>
    <a className="map-link" href={business.googleProfile} rel="noreferrer" target="_blank"><IconBrandGoogle /> Open Appliance RS on Google <IconArrowRight /></a>
  </div>;
}
