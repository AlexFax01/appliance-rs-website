import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconArrowLeft, IconPhone } from "@tabler/icons-react";
import { business } from "@/content/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested Appliance RS page could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <article className="not-found-card">
        <Image alt="Appliance RS logo" height={72} priority src="/images/brand/appliance-rs-logo.webp" width={72} />
        <p className="eyebrow">404 · Page not found</p>
        <h1>This page isn’t here, but local appliance help is.</h1>
        <p>The link may be outdated. Return to the Appliance RS homepage or call us directly for service.</p>
        <div className="not-found-actions">
          <Link className="button-3d button-primary" href="/"><IconArrowLeft size={19} /> Back to home</Link>
          <a className="button-3d button-orange" data-analytics-event="call_click" data-analytics-location="404" href={`tel:${business.callPhone.e164}`}><IconPhone size={19} /> Call {business.callPhone.display}</a>
        </div>
      </article>
    </main>
  );
}
