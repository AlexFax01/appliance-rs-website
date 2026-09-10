"use client";

import { useCallback, useEffect, useState } from "react";
import { IconAdjustments, IconShieldCheck, IconX } from "@tabler/icons-react";
import { trackEvent } from "@/lib/analytics";

type ConsentChoice = { analytics: boolean; advertising: boolean };
const storageKey = "appliance-rs-consent-v1";

function applyConsent(choice: ConsentChoice) {
  window.gtag?.("consent", "update", {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: choice.advertising ? "granted" : "denied",
    ad_user_data: choice.advertising ? "granted" : "denied",
    ad_personalization: choice.advertising ? "granted" : "denied",
  });
  trackEvent("consent_update", {
    analytics_consent: choice.analytics,
    advertising_consent: choice.advertising,
  });
}

export function ConsentManager() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>({ analytics: false, advertising: false });

  useEffect(() => {
    let initialChoice: ConsentChoice | null = null;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as ConsentChoice;
        initialChoice = { analytics: parsed.analytics === true, advertising: parsed.advertising === true };
      }
    } catch { /* Invalid local state is treated as no choice. */ }
    const timeout = window.setTimeout(() => {
      if (initialChoice) {
        setChoice(initialChoice);
        applyConsent(initialChoice);
      } else setOpen(true);
    }, 0);
    const reopen = () => { setSettings(true); setOpen(true); };
    window.addEventListener("open-cookie-settings", reopen);
    return () => { window.clearTimeout(timeout); window.removeEventListener("open-cookie-settings", reopen); };
  }, []);

  const save = useCallback((next: ConsentChoice) => {
    setChoice(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    applyConsent(next);
    setOpen(false);
    setSettings(false);
  }, []);

  if (!open) return null;
  return (
    <aside aria-labelledby="consent-title" className="consent-panel" role="dialog">
      <button aria-label="Close cookie settings" className="consent-close" onClick={() => setOpen(false)} type="button"><IconX size={18} /></button>
      <div className="consent-copy">
        <IconShieldCheck aria-hidden="true" size={25} />
        <div><strong id="consent-title">Your privacy choices</strong><p>We use optional Google Analytics and advertising cookies to understand site performance. Essential site functions work without them.</p></div>
      </div>
      {settings ? (
        <div className="consent-settings">
          <label><span><strong>Analytics</strong><small>Anonymous site interactions; no form details.</small></span><input checked={choice.analytics} onChange={(event) => setChoice((current) => ({ ...current, analytics: event.target.checked }))} type="checkbox" /></label>
          <label><span><strong>Advertising</strong><small>Measures advertising performance when allowed.</small></span><input checked={choice.advertising} onChange={(event) => setChoice((current) => ({ ...current, advertising: event.target.checked }))} type="checkbox" /></label>
          <div className="consent-actions"><button className="button-3d button-outline" onClick={() => save({ analytics: false, advertising: false })} type="button">Reject non-essential</button><button className="button-3d button-primary" onClick={() => save(choice)} type="button">Save choices</button></div>
        </div>
      ) : (
        <div className="consent-actions">
          <button className="button-3d button-outline" onClick={() => save({ analytics: false, advertising: false })} type="button">Reject</button>
          <button className="consent-settings-button" onClick={() => setSettings(true)} type="button"><IconAdjustments size={17} /> Settings</button>
          <button className="button-3d button-primary" onClick={() => save({ analytics: true, advertising: true })} type="button">Accept all</button>
        </div>
      )}
    </aside>
  );
}
