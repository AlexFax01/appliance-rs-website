import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { mapTowns, type MapTown } from "@/content/map-towns";

export type ServiceMapController = {
  select: (town: string | null) => void;
  reset: () => void;
  destroy: () => void;
};
let configured = false;

export async function createServiceMap(element: HTMLElement, options: {
  apiKey: string; mapId: string; signal: AbortSignal;
  onSelect: (town: MapTown | null) => void;
  onReady: () => void;
  onError: () => void;
}): Promise<ServiceMapController | null> {
  if (!configured) {
    setOptions({ key: options.apiKey, v: "quarterly", language: "en", region: "US" });
    const target = window as Window & { gm_authFailure?: () => void };
    const previous = target.gm_authFailure;
    target.gm_authFailure = () => { previous?.(); window.dispatchEvent(new Event("service-map-auth-error")); };
    configured = true;
  }
  const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
    importLibrary("maps"), importLibrary("marker"),
  ]);
  if (options.signal.aborted) return null;
  const map = new Map(element, {
    mapId: options.mapId, center: { lat: 34.95, lng: -82.18 }, zoom: 10,
    mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    zoomControl: true, gestureHandling: "cooperative", keyboardShortcuts: true,
    clickableIcons: false, tilt: 0, heading: 0,
  });
  const bounds = new google.maps.LatLngBounds();
  const listeners: google.maps.MapsEventListener[] = [];
  let selectedName: string | null = null;
  const entries = mapTowns.map(town => {
    bounds.extend(town.position);
    const content = document.createElement("div");
    content.className = `town-pin${town.primary ? " town-pin-primary" : ""}`;
    const dot = document.createElement("span"); dot.className = "town-pin-dot";
    const label = document.createElement("span"); label.className = "town-pin-label"; label.textContent = town.name;
    content.append(dot, label);
    const marker = new AdvancedMarkerElement({
      map, position: town.position, title: `Appliance repair in ${town.name}, SC`,
      content, anchorTop: "-50%", anchorLeft: "-50%", zIndex: town.primary ? 2 : 1,
    });
    listeners.push(marker.addListener("click", () => select(town.name)));
    return { town, marker, content };
  });
  function select(name: string | null) {
    const entry = entries.find(item => item.town.name === name);
    selectedName = entry?.town.name ?? null;
    for (const item of entries) {
      const selected = item === entry;
      item.content.classList.toggle("is-selected", selected);
      item.marker.zIndex = selected ? 10 : item.town.primary ? 2 : 1;
    }
    if (entry) map.panTo(entry.town.position);
    options.onSelect(entry?.town ?? null);
  }
  const fit = () => map.fitBounds(bounds, { top: 42, bottom: 42, left: 36, right: 36 });
  listeners.push(map.addListener("zoom_changed", () => {
    element.classList.toggle("town-labels-visible", (map.getZoom() ?? 0) >= 11);
  }));
  listeners.push(google.maps.event.addListenerOnce(map, "tilesloaded", options.onReady));
  listeners.push(map.addListener("mapcapabilities_changed", () => {
    if (map.getMapCapabilities().isAdvancedMarkersAvailable === false) options.onError();
  }));
  fit();
  let width = element.clientWidth;
  let resizeFrame = 0;
  const observer = new ResizeObserver(() => {
    if (element.clientWidth === width) return;
    width = element.clientWidth;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => { if (!selectedName) fit(); });
  });
  observer.observe(element);
  return {
    select,
    reset: () => { select(null); fit(); },
    destroy: () => {
      observer.disconnect(); cancelAnimationFrame(resizeFrame);
      listeners.forEach(listener => listener.remove());
      entries.forEach(({ marker }) => { marker.map = null; });
      google.maps.event.clearInstanceListeners(map);
      element.replaceChildren();
    },
  };
}
