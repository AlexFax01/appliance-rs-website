"use client";

export function CookieSettingsButton() {
  return <button className="footer-cookie-button" onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))} type="button">Cookie settings</button>;
}
