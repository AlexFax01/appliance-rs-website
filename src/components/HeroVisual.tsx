"use client";
import { useEffect, useRef } from "react";
import { IconShieldCheck } from "@tabler/icons-react";
const widths = [480, 800, 1200, 1600];
const sources = (format: string) => widths.map(width => `/images/hero/hero-${width}.${format} ${width}w`).join(", ");
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const media = matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let visible = false, frame = 0;
    const update = () => { frame = 0; if (!media.matches || !visible) return; const rect = node.getBoundingClientRect(); const fraction = Math.max(-1, Math.min(1, -rect.top / rect.height)); node.style.setProperty("--photo-offset", `${fraction * 16}px`); node.style.setProperty("--badge-offset", `${fraction * -8}px`); };
    const scroll = () => { if (visible && media.matches && !frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(entries => {visible = entries[0].isIntersecting; scroll();});
    const preference = () => {node.style.removeProperty("--photo-offset"); node.style.removeProperty("--badge-offset"); scroll();};
    observer.observe(node); window.addEventListener("scroll", scroll, {passive: true}); media.addEventListener("change", preference);
    return () => {observer.disconnect(); window.removeEventListener("scroll", scroll); media.removeEventListener("change", preference); cancelAnimationFrame(frame);};
  }, []);
  return <div className="hero-visual" ref={ref}>
    <picture className="hero-picture">
      <source type="image/avif" srcSet={sources("avif")} sizes="(max-width: 900px) 100vw, 50vw" />
      <source type="image/webp" srcSet={sources("webp")} sizes="(max-width: 900px) 100vw, 50vw" />
      {/* Prebuilt responsive files also work on the client's static PHP host. */}
      <img alt="Appliance RS technician explaining a refrigerator diagnosis to a homeowner" src="/images/hero/hero-800.webp" width={1536} height={1024} fetchPriority="high" decoding="async" />
    </picture>
    <div className="hero-badge"><IconShieldCheck /><span><strong>Local service</strong><small>Clear answers. Careful work.</small></span></div>
  </div>;
}
