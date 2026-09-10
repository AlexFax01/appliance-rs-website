import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconCheck, IconMessageCircle, IconPhone } from "@tabler/icons-react";
import { CoverageChecker } from "@/components/CoverageChecker";
import { PageHeader } from "@/components/PageHeader";
import { ServiceAreasStructuredData } from "@/components/StructuredData";
import { SiteFooter } from "@/components/SiteFooter";
import { business, serviceAreas } from "@/content/site";

export const metadata: Metadata = {
  title: "Appliance Repair Service Areas in Upstate South Carolina",
  description: "Check Appliance RS service coverage across Greenville, Spartanburg, Greer, Simpsonville, and 15 nearby Upstate South Carolina communities.",
  alternates: { canonical: "/service-areas/" },
  openGraph: { title: "Appliance RS Service Areas", description: "Explore the 19 listed Upstate South Carolina communities served by Appliance RS.", url: "/service-areas/" },
};

export default function ServiceAreasPage() {
  return (
    <>
      <ServiceAreasStructuredData />
      <PageHeader />
      <main className="service-areas-page">
        <section className="service-areas-intro"><nav aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Service areas</span></nav><p className="eyebrow">Local appliance repair coverage</p><h1>Appliance Repair Service Areas in Upstate South Carolina</h1><p>Appliance RS provides in-home service throughout the listed communities below. ZIP matching is a helpful first check; the team confirms your exact street address and appointment availability when scheduling.</p><div><Link className="button-3d button-primary" href="/#contact"><IconMessageCircle size={19} /> Request by text</Link><a className="button-3d button-orange" data-analytics-event="call_click" data-analytics-location="service_areas_hero" href={`tel:${business.callPhone.e164}`}><IconPhone size={19} /> Call {business.callPhone.display}</a></div></section>
        <section className="service-area-directory"><div><p className="eyebrow">19 listed communities</p><h2>Where the technician works</h2><p>The largest regional centers appear first. A listed town does not guarantee that every address or appliance can be scheduled.</p></div><ul>{serviceAreas.map((area) => <li className={area.primary ? "area-primary" : ""} key={area.name}><IconCheck size={17} /><span>{area.name}</span></li>)}</ul></section>
        <section className="service-area-explorer"><CoverageChecker /></section>
        <section className="service-area-final"><h2>Not sure whether your address is covered?</h2><p>Send the ZIP code and service address in the request form. Appliance RS will confirm before scheduling.</p><Link className="button-3d button-primary" href="/#contact">Prepare your request <IconArrowRight size={17} /></Link></section>
      </main>
      <SiteFooter />
      <nav aria-label="Quick contact" className="mobile-contact-bar"><a className="mobile-call" data-analytics-event="call_click" data-analytics-location="mobile_bar" href={`tel:${business.callPhone.e164}`}><IconPhone /> Call</a><Link href="/#contact"><IconMessageCircle /> Request by text</Link></nav>
    </>
  );
}
