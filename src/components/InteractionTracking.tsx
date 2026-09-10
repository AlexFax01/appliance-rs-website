"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

export function InteractionTracking() {
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-analytics-event]") : null;
      if (!target) return;
      const name = target.dataset.analyticsEvent as AnalyticsEventName | undefined;
      if (!name) return;
      trackEvent(name, {
        cta_location: target.dataset.analyticsLocation,
        appliance_type: target.dataset.analyticsAppliance,
      });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);

  return null;
}
