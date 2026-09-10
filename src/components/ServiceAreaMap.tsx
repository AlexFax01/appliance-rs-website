"use client";

import { useEffect, useRef, useState } from "react";
import { IconFocus2, IconMapPin, IconPhone, IconArrowRight, IconArrowsMaximize, IconX } from "@tabler/icons-react";
import { business } from "@/content/site";
import type { MapTown } from "@/content/map-towns";
import type { ServiceMapController } from "@/lib/service-map";
import { trackEvent } from "@/lib/analytics";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "";
const configured = Boolean(apiKey && mapId);

export function ServiceAreaMap({ selectedTown, onRequest }: {
  selectedTown: string | null;
  onRequest: (town: MapTown) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const controller = useRef<ServiceMapController | null>(null);
  const latestTown = useRef(selectedTown);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "fallback">("idle");
  const [activated, setActivated] = useState(false);
  const [selected, setSelected] = useState<MapTown | null>(null);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    latestTown.current = selectedTown;
    controller.current?.select(selectedTown);
  }, [selectedTown]);
  useEffect(() => {
    if (!expanded) return;
    const focusTarget = restoreFocus.current;
    document.body.classList.add("map-open");
    closeButton.current?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", close);
    return () => {
      document.body.classList.remove("map-open");
      window.removeEventListener("keydown", close);
      focusTarget?.focus();
    };
  }, [expanded]);
  useEffect(() => {
    if (!activated) return;
    if (!configured) return;
    if (!container.current) return;
    const element = container.current;
    const abort = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const fallback = () => {
      if (abort.signal.aborted) return;
      abort.abort(); clearTimeout(timeout); controller.current?.destroy(); controller.current = null;
      setState("fallback");
    };
    const start = async () => {
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
    void start();
    window.addEventListener("service-map-auth-error", fallback);
    return () => {
      abort.abort(); clearTimeout(timeout);
      window.removeEventListener("service-map-auth-error", fallback);
      controller.current?.destroy(); controller.current = null;
    };
  }, [activated]);

  return <div className={`town-map ${state === "fallback" ? "town-map-fallback" : ""}${expanded ? " is-expanded" : ""}`} role={expanded ? "dialog" : undefined} aria-modal={expanded || undefined} aria-label={expanded ? "Expanded Appliance RS service area map" : undefined}>
    {state !== "idle" && state !== "fallback" && <div className="town-map-toolbar">
      <div className="town-map-legend"><span><i className="legend-primary" />Main cities</span><span><i />Service towns</span><span className="legend-area"><i />Approx. service area</span></div>
      <div className="town-map-tools">
        <button type="button" disabled={state !== "ready"} onClick={() => controller.current?.reset()}><IconFocus2 size={18} />Show all</button>
        {!expanded && <button className="town-map-expand" type="button" disabled={state !== "ready"} aria-expanded="false" onClick={event => { restoreFocus.current = event.currentTarget; setExpanded(true); }}><IconArrowsMaximize size={18} />Expand map</button>}
        {expanded && <button ref={closeButton} className="town-map-close" type="button" onClick={() => setExpanded(false)}><IconX size={19} />Close map</button>}
      </div>
    </div>}
    <div className="classic-map-frame town-map-frame">
      {state === "idle" ? <div className="map-activation"><IconMapPin size={38} /><p className="eyebrow">Interactive Google map</p><h4>See where Appliance RS works</h4><p>Open the map to explore the listed service towns. The map stays unloaded until you choose to view it.</p><button className="button-3d button-primary" onClick={() => { if (configured) { setState("loading"); setActivated(true); } else setState("fallback"); trackEvent("map_open", { map_type: configured ? "javascript" : "embed" }); }} type="button">Open Google map <IconArrowRight size={17} /></button></div> : state === "fallback" ? <iframe allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" src={business.mapEmbed} title="Appliance RS service area on Google Maps" /> : <>
        <div ref={container} className="town-map-canvas" aria-label="Appliance RS service towns on Google Maps" />
        {state === "loading" && <div className="town-map-loading" role="status"><IconMapPin size={28} /><span>Loading your local service area…</span></div>}
      </>}
      {state !== "idle" && state !== "fallback" && !selected && <div className="town-map-hint"><IconMapPin size={17} /><span>Tap a branded pin to view local service.</span></div>}
      {state !== "idle" && state !== "fallback" && selected && <div className="town-map-details" aria-live="polite" aria-atomic="true">
        <div className="town-map-detail-copy">
          <span className="town-map-kicker">Local appliance repair</span>
          <h4>{selected.name}, SC</h4>
          <p>We serve this town. We’ll confirm your exact address when scheduling.</p>
          <small>ZIP codes: {selected.zips.join(", ")}</small>
        </div>
        <div className="town-map-actions">
          <button className="button-3d button-primary" type="button" onClick={() => onRequest(selected)}>Request repair <IconArrowRight size={16} /></button>
          <a className="town-map-call" data-analytics-event="call_click" data-analytics-location="map" href={`tel:${business.callPhone.e164}`}><IconPhone size={17} />Call {business.callPhone.display}</a>
        </div>
      </div>}
    </div>
    {state === "fallback" && configured && <p className="town-map-fallback-note">The interactive map is unavailable. Use our ZIP checker or the classic Google map to confirm your service town.</p>}
  </div>;
}
