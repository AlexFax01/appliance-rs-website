"use client";

import { useEffect, useRef, useState } from "react";
import { IconFocus2, IconMapPin, IconPhone, IconArrowRight } from "@tabler/icons-react";
import { business } from "@/content/site";
import type { MapTown } from "@/content/map-towns";
import type { ServiceMapController } from "@/lib/service-map";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "";
const configured = Boolean(apiKey && mapId);

export function ServiceAreaMap({ selectedTown, onRequest }: {
  selectedTown: string | null;
  onRequest: (town: MapTown) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const controller = useRef<ServiceMapController | null>(null);
  const latestTown = useRef(selectedTown);
  const [state, setState] = useState<"loading" | "ready" | "fallback">(configured ? "loading" : "fallback");
  const [selected, setSelected] = useState<MapTown | null>(null);
  useEffect(() => {
    latestTown.current = selectedTown;
    controller.current?.select(selectedTown);
  }, [selectedTown]);
  useEffect(() => {
    if (!configured || !container.current) return;
    const element = container.current;
    const abort = new AbortController();
    let started = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const fallback = () => {
      if (abort.signal.aborted) return;
      abort.abort(); clearTimeout(timeout); controller.current?.destroy(); controller.current = null;
      setState("fallback");
    };
    const start = async () => {
      if (started || abort.signal.aborted) return;
      started = true;
      timeout = setTimeout(fallback, 15000);
      try {
        const { createServiceMap } = await import("@/lib/service-map");
        if (abort.signal.aborted) return;
        const instance = await createServiceMap(element, {
          apiKey, mapId, signal: abort.signal, onSelect: setSelected,
          onReady: () => { if (!abort.signal.aborted) { clearTimeout(timeout); setState("ready"); } },
          onError: fallback,
        });
        if (abort.signal.aborted) { instance?.destroy(); return; }
        controller.current = instance;
        if (latestTown.current) instance?.select(latestTown.current);
      } catch { fallback(); }
    };
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { observer?.disconnect(); void start(); }
    }, { rootMargin: "200px 0px" }) : null;
    if (observer) observer.observe(element); else void start();
    window.addEventListener("service-map-auth-error", fallback);
    return () => {
      abort.abort(); observer?.disconnect(); clearTimeout(timeout);
      window.removeEventListener("service-map-auth-error", fallback);
      controller.current?.destroy(); controller.current = null;
    };
  }, []);

  return <div className={`town-map ${state === "fallback" ? "town-map-fallback" : ""}`}>
    {state !== "fallback" && <div className="town-map-toolbar">
      <div className="town-map-legend"><span><i className="legend-primary" />Main cities</span><span><i />Service towns</span></div>
      <button type="button" disabled={state !== "ready"} onClick={() => controller.current?.reset()}><IconFocus2 size={18} />Show all</button>
    </div>}
    <div className="classic-map-frame town-map-frame">
      {state === "fallback" ? <iframe allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" src={business.mapEmbed} title="Appliance RS service area on Google Maps" /> : <>
        <div ref={container} className="town-map-canvas" aria-label="Appliance RS service towns on Google Maps" />
        {state === "loading" && <div className="town-map-loading" role="status"><IconMapPin size={28} /><span>Loading your local service area…</span></div>}
      </>}
    </div>
    {state !== "fallback" && <div className="town-map-details" aria-live="polite" aria-atomic="true">
      <div className="town-map-detail-copy">
        <span className="town-map-kicker">{selected ? "Local appliance repair" : "Service, close to home"}</span>
        <h4>{selected ? `${selected.name}, SC` : "Find your town on the map"}</h4>
        <p>{selected ? "We serve this town. We’ll confirm your exact address when scheduling." : "Tap a dot or use our ZIP checker to explore local service."}</p>
        {selected && <small>ZIP codes: {selected.zips.join(", ")}</small>}
      </div>
      {selected && <div className="town-map-actions">
        <button className="button-3d button-primary" type="button" onClick={() => onRequest(selected)}>Request repair <IconArrowRight size={16} /></button>
        <a className="town-map-call" href={`tel:${business.phoneHref}`}><IconPhone size={17} />Call {business.phoneDisplay}</a>
      </div>}
    </div>}
    {state === "fallback" && configured && <p className="town-map-fallback-note">Use our ZIP checker to confirm your service town.</p>}
  </div>;
}
