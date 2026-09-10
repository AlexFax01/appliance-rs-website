export type AnalyticsEventName =
  | "call_click"
  | "repair_form_start"
  | "repair_form_valid"
  | "sms_handoff"
  | "sms_copy"
  | "service_view"
  | "request_repair_click"
  | "zip_check"
  | "map_open"
  | "google_profile_click"
  | "consent_update";

type SafeEventParameters = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEventName, parameters: SafeEventParameters = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...parameters });
}
