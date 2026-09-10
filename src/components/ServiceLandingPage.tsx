import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconCheck, IconCircleCheck, IconMapPin, IconMessageCircle, IconPhone, IconSearch } from "@tabler/icons-react";
import { appliances, business, pricing, serviceAreas, type Appliance } from "@/content/site";
import { PageHeader } from "./PageHeader";
import { ServiceStructuredData } from "./StructuredData";
import { SiteFooter } from "./SiteFooter";

export function ServiceLandingPage({ service }: { service: Appliance }) {
  const requestHref = `/?appliance=${service.value}#contact`;
  const related = appliances.filter((item) => item.value !== service.value).slice(0, 3);
  return (
    <>
      <ServiceStructuredData service={service} />
      <PageHeader requestHref={requestHref} />
      <main className="service-page">
        <section className="service-page-hero">
          <div className="service-page-copy">
            <nav aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>{service.title} repair</span></nav>
            <p className="eyebrow">Local in-home appliance service</p>
            <h1>{service.pageTitle}</h1>
            <p>{service.intro}</p>
            <div className="service-page-actions">
              <Link className="button-3d button-primary" data-analytics-event="request_repair_click" data-analytics-location="service_page_hero" data-analytics-appliance={service.value} href={requestHref}><IconMessageCircle size={20} /> Request by text</Link>
              <a className="button-3d button-orange" data-analytics-event="call_click" data-analytics-location="service_page_hero" data-analytics-appliance={service.value} href={`tel:${business.callPhone.e164}`}><IconPhone size={20} /> Call {business.callPhone.display}</a>
            </div>
            <p className="service-page-availability"><IconCircleCheck size={18} /> Service requests accepted 24/7. Appointment availability is confirmed when scheduling.</p>
          </div>
          <div className="service-page-image"><Image alt={service.alt} fill priority sizes="(max-width: 800px) 100vw, 48vw" src={service.image} /></div>
        </section>

        <section className="service-page-section service-page-columns">
          <article>
            <p className="eyebrow">Common symptoms</p><h2>Problems we can diagnose</h2>
            <ul className="service-detail-list">{service.problems.map((problem) => <li key={problem}><IconCheck size={19} /><span>{problem}</span></li>)}</ul>
          </article>
          <article>
            <p className="eyebrow">A complete visit</p><h2>What the technician checks</h2>
            <ul className="service-detail-list">{service.checks.map((check) => <li key={check}><IconSearch size={19} /><span>{check}</span></li>)}</ul>
          </article>
        </section>

        <section className="service-page-section service-pricing-band">
          <div><p className="eyebrow">Clear pricing</p><h2>{pricing.fee} service call</h2><p>{pricing.summary} You receive the repair price before work begins and pay after the approved work is completed.</p></div>
          <Link className="button-3d button-light" href={requestHref}>Prepare a service request <IconArrowRight size={18} /></Link>
        </section>

        <section className="service-page-section service-area-summary">
          <div><p className="eyebrow">Upstate South Carolina</p><h2>Local service across 19 listed communities</h2><p>Appliance RS serves Greenville, Spartanburg, Greer, Simpsonville, and nearby towns. Enter your ZIP on the service-area page; the exact address is confirmed when scheduling.</p></div>
          <ul>{serviceAreas.slice(0, 8).map((area) => <li key={area.name}><IconMapPin size={16} /> {area.name}</li>)}</ul>
          <Link className="text-action" href="/service-areas/">See all service areas <IconArrowRight /></Link>
        </section>

        <section className="service-page-section related-services">
          <p className="eyebrow">Other appliances</p><h2>More repair services</h2>
          <div>{related.map((item) => <Link data-analytics-event="service_view" data-analytics-appliance={item.value} key={item.value} href={`/${item.slug}/`}><strong>{item.title}</strong><span>Common problems and service details <IconArrowRight size={16} /></span></Link>)}</div>
        </section>
      </main>
      <SiteFooter />
      <nav aria-label="Quick contact" className="mobile-contact-bar"><a className="mobile-call" data-analytics-event="call_click" data-analytics-location="mobile_bar" href={`tel:${business.callPhone.e164}`}><IconPhone /> Call</a><Link data-analytics-event="request_repair_click" data-analytics-location="mobile_bar" href={requestHref}><IconMessageCircle /> Request by text</Link></nav>
    </>
  );
}
