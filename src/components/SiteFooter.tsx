import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { business } from "@/content/site";
import { CookieSettingsButton } from "./CookieSettingsButton";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-brand"><Image alt="Appliance RS logo" height={44} src="/images/brand/appliance-rs-logo.webp" width={44} /><span><strong>{business.name}</strong><small>{business.tagline}</small></span></div>
      <p>© 2026 Appliance RS. All rights reserved.</p>
      <div className="footer-meta">
        <div className="footer-links"><Link href="/privacy/">Privacy</Link><CookieSettingsButton /><span>Fully Insured</span><span>Pay After Repair</span><span>Clear Pricing</span></div>
        <a className="footer-credit" href="https://progressorai.ca/" rel="noreferrer" target="_blank">
          <Image alt="" aria-hidden="true" height={12} src="/images/brand/progressorai-logo.png" width={13} />
          <span>Website crafted by <strong>ProgressorAI</strong></span>
          <IconArrowRight aria-hidden="true" size={12} />
        </a>
      </div>
    </footer>
  );
}
