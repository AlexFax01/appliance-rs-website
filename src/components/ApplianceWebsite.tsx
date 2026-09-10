"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { DishWasherIcon, MicrowaveIcon, OvenIcon, RefrigeratorIcon, SnowflakeIcon, WashingMachineIcon } from "@hugeicons/core-free-icons";
import {
  IconArrowRight, IconBrandGoogle, IconCheck, IconChevronRight, IconCircleCheck,
  IconCoin, IconMapPin, IconMenu2, IconMessageCircle, IconPhone, IconSearch,
  IconShieldCheck, IconStarFilled, IconX,
} from "@tabler/icons-react";
import { appliances, business, faqs, reviews, serviceAreas } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { CoverageChecker } from "./CoverageChecker";
import { HeroVisual } from "./HeroVisual";
import { HomeStructuredData } from "./StructuredData";
import { SiteFooter } from "./SiteFooter";
const ServiceDialog = dynamic(() => import('./ServiceDialog').then(module => module.ServiceDialog), {ssr: false});
const PriceDialog = dynamic(() => import('./PriceDialog').then(module => module.PriceDialog), {ssr: false});

const navItems = [
  ["home", "Home"], ["appliances", "Appliances We Repair"], ["process", "Our Process"],
  ["about", "About Us"], ["areas", "Service Areas"], ["reviews", "Reviews"],
] as const;

const applianceIcons = [RefrigeratorIcon, SnowflakeIcon, WashingMachineIcon, DishWasherIcon, OvenIcon, MicrowaveIcon];

export function ApplianceWebsite() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [selectedAppliance, setSelectedAppliance] = useState("refrigerator-freezer");
  const [expandedAppliance, setExpandedAppliance] = useState<(typeof appliances)[number]["value"] | null>(null);
  const [showAllAreas, setShowAllAreas] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [zip, setZip] = useState("");
  const [problemSelections, setProblemSelections] = useState<Record<string, string[]>>({});
  const setProblems = (appliance: string, ids: string[]) => setProblemSelections(current => ({...current, [appliance]: ids}));

  const expandedApplianceDetails = appliances.find((item) => item.value === expandedAppliance);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }, []);

  const followSectionLink = useCallback((event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    window.history.replaceState(null, "", `#${id}`);
    scrollTo(id);
  }, [scrollTo]);

  const requestCallback = useCallback((appliance?: string) => {
    if (appliance) setSelectedAppliance(appliance);
    window.setTimeout(() => scrollTo("contact"), 20);
  }, [scrollTo]);

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    const appliance = parameters.get("appliance");
    const requestedZip = parameters.get("zip");
    const timeout = window.setTimeout(() => {
      if (appliance && appliances.some((item) => item.value === appliance)) setSelectedAppliance(appliance);
      if (requestedZip) setZip(requestedZip.slice(0, 10));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -68%", threshold: [0.1, 0.35, 0.7] },
    );
    navItems.forEach(([id]) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <HomeStructuredData />
      <header className="site-header">
        <div className="header-inner">
          <a aria-label="Go to top" className="brand" href="#home" onClick={(event) => followSectionLink(event, "home")}>
            <Image alt="Appliance RS round logo" className="brand-logo" height={54} priority src="/images/brand/appliance-rs-logo.webp" width={54} />
            <span className="brand-copy"><strong>Appliance RS</strong><small>{business.tagline}</small></span>
          </a>
          <nav aria-label="Primary navigation" className="desktop-nav">
            {navItems.map(([id, label]) => (
              <a className={activeSection === id ? "active" : ""} href={`#${id}`} key={id} onClick={(event) => followSectionLink(event, id)}>{label}</a>
            ))}
          </nav>
          <a className="button-3d button-orange header-cta" data-analytics-event="call_click" data-analytics-location="header" href={`tel:${business.callPhone.e164}`}>
            <IconPhone className="phone-wiggle" size={19} /><span>Call now</span><strong>{business.callPhone.display}</strong>
          </a>
          <button aria-controls="mobile-navigation" aria-expanded={mobileOpen} aria-label="Toggle navigation" className="icon-button menu-button" onClick={() => setMobileOpen((value) => !value)} type="button">
            {mobileOpen ? <IconX /> : <IconMenu2 />}
          </button>
        </div>
        {mobileOpen ? (
          <nav aria-label="Mobile navigation" className="mobile-nav" id="mobile-navigation">
            {navItems.map(([id, label]) => <a aria-current={activeSection === id ? "page" : undefined} href={`#${id}`} key={id} onClick={() => setMobileOpen(false)}>{label}</a>)}
            <a className="button-3d button-orange" data-analytics-event="call_click" data-analytics-location="mobile_menu" href={`tel:${business.callPhone.e164}`} onClick={() => setMobileOpen(false)}>Call {business.callPhone.display}</a>
          </nav>
        ) : null}
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Upstate South Carolina appliance repair</p>
            <h1>Fast, Trusted Appliance Repair in Upstate South Carolina</h1>
            <p className="hero-lede">We repair major appliances in your home—refrigerators, washers, dryers, dishwashers, ovens, microwaves, and ice makers—quickly and correctly the first time.</p>
            <div className="trust-row">
              <span><IconShieldCheck /> Fully Insured</span><span><IconCoin /> Clear Pricing</span><span><IconCircleCheck /> Pay After Repair</span>
            </div>
            <div className="hero-actions">
              <a className="button-3d button-orange button-large" data-analytics-event="call_click" data-analytics-location="hero" href={`tel:${business.callPhone.e164}`}><IconPhone className="phone-wiggle" /> Call {business.callPhone.display}</a>
              <button className="text-action" data-analytics-event="request_repair_click" data-analytics-location="hero" onClick={() => requestCallback()} type="button">Request by text <IconArrowRight /></button>
            </div>
            <p className="location-note"><IconMapPin /> Proudly serving the Upstate of South Carolina</p>
          </div>
          <HeroVisual />
        </section>

        <section className="section services-section" id="appliances">
          <div className="section-heading centered"><p className="eyebrow">What we fix</p><h2>We Repair All Major Appliances</h2><p>Choose an appliance to see common problems and repair options.</p></div>
          <div className="service-grid">
            {appliances.map((item, index) => {
              const isExpanded = expandedAppliance === item.value;
              return (
                <button
                  aria-haspopup="dialog"
                  data-appliance={item.value}
                  aria-expanded={isExpanded}
                  className={`service-card${isExpanded ? " is-active" : ""}`}
                  data-analytics-event="service_view"
                  data-analytics-appliance={item.value}
                  key={item.value}
                  onClick={() => setExpandedAppliance(item.value)}
                  type="button"
                >
                  <span aria-hidden="true" className="service-icon"><HugeiconsIcon icon={applianceIcons[index]} strokeWidth={1.8} /></span>
                  <h3>{item.title}</h3>
                  <span className="service-link">View common repairs <IconChevronRight /></span>
                </button>
              );
            })}
          </div>
          <button className="text-action section-link" onClick={() => requestCallback("other")} type="button">Ask about another appliance <IconArrowRight /></button>
        </section>

        <section className="section why-section" id="about">
          <div className="section-heading centered"><p className="eyebrow">Why Appliance RS</p><h2>Straightforward service from a local team</h2></div>
          <div className="benefit-grid">
            <button className="benefit-card price-card" aria-haspopup="dialog" type="button" onClick={() => setPriceOpen(true)}><span className="benefit-icon price-icon">$85</span><h3>$85 Service Call</h3><p>Upfront, straightforward pricing. No surprises.</p><span className="service-link">How pricing works <IconChevronRight /></span></button>
            <Benefit icon={<IconSearch />} title="Diagnostic Fee Waived">Service call fee waived with an approved repair.</Benefit>
            <Benefit icon={<IconShieldCheck />} title="Warranty-Backed Repairs">Parts and labor coverage is confirmed with your quote.</Benefit>
            <Benefit icon={<IconMapPin />} title="Local Upstate Service">Fast response from a team that lives and works here.</Benefit>
            <Benefit icon={<IconMessageCircle />} title="Clear Communication">We explain the issue, your options, and the cost before work begins.</Benefit>
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="section-heading centered"><p className="eyebrow">Four clear steps</p><h2>Our Simple Process</h2></div>
          <ol className="process-list">
            <Process number="1" title="Call or request by text">Submit a service request anytime. We’ll confirm a time that works for you.</Process>
            <Process number="2" title="On-Site Diagnosis">We find the issue and explain your options clearly.</Process>
            <Process number="3" title="Upfront Quote">You’ll know the cost before we start any work.</Process>
            <Process number="4" title="Expert Repair">We repair it right the first time and test everything.</Process>
          </ol>
        </section>

        <section className="section area-section" id="areas">
          <div className="area-copy">
            <p className="eyebrow">Local coverage</p><h2>Proudly Serving the Upstate of South Carolina</h2>
            <p>Professional appliance repair throughout Greenville, Spartanburg, and nearby communities.</p>
            <ul className="area-list">
              {serviceAreas.slice(0, showAllAreas ? serviceAreas.length : 10).map((area) => {
                const tier = area.population !== null && area.population >= 20_000 ? "large" : area.population !== null && area.population >= 5_000 ? "medium" : "small";
                return <li className={`area-${tier}${area.primary ? " area-primary" : ""}`} key={area.name}><IconCheck /> <span>{area.name}</span></li>;
              })}
            </ul>
            <button className="text-action" onClick={() => setShowAllAreas((value) => !value)} type="button">{showAllAreas ? "Show fewer areas" : "See full service area"} <IconArrowRight /></button>
          </div>
          <CoverageChecker onZip={setZip} />
        </section>

        <section className="section reviews-section" id="reviews">
          <div className="reviews-top"><div className="section-heading"><p className="eyebrow">Real local feedback</p><h2>Trusted by Upstate homeowners</h2></div><a className="google-rating" data-analytics-event="google_profile_click" data-analytics-location="reviews" href={business.googleProfile} rel="noreferrer" target="_blank"><IconBrandGoogle /><span><strong>5.0 on Google</strong><small>60+ reviews</small></span></a></div>
          <div className="review-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.name}>
                <div className="stars" aria-label="5 out of 5 stars" role="img">{Array.from({ length: 5 }, (_, i) => <IconStarFilled key={i} />)}</div>
                <blockquote>“{review.text}”</blockquote><footer><strong>{review.name}</strong><span>{review.date} · Google review</span></footer>
              </article>
            ))}
          </div>
          <p className="review-note">Public Google reviews selected September 5, 2026.</p>
        </section>

        <section className="section contact-section" id="contact">
          <div className="contact-copy"><p className="eyebrow">Request service by text</p><h2>Tell us what’s going on. We’ll build the message.</h2><p>Complete the form and we’ll prepare a text to the service team. Review it and press Send in Messages.</p><a className="contact-phone" data-analytics-event="call_click" data-analytics-location="contact" href={`tel:${business.callPhone.e164}`}><IconPhone /> {business.callPhone.display}</a><ul><li><IconCheck /> Service requests accepted 24/7</li><li><IconCheck /> Your details stay on your device</li><li><IconCheck /> You choose when to send</li></ul></div>
          <ContactForm selectedAppliance={selectedAppliance} onApplianceChange={setSelectedAppliance} selectedProblemIds={problemSelections[selectedAppliance] ?? []} onProblemsChange={ids => setProblems(selectedAppliance, ids)} zip={zip} onZipChange={setZip} />
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-heading centered"><p className="eyebrow">Good to know</p><h2>Frequently Asked Questions</h2></div>
          <div className="faq-grid">{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div>
        </section>

        <section className="final-cta">
          <div className="final-icon"><IconPhone /></div><div><p>Need Appliance Repair?</p><h2>Call <span>{business.callPhone.display}</span></h2><small>Or prepare a detailed service request by text.</small></div>
          <div className="final-cta-actions"><a className="button-3d button-orange button-large" data-analytics-event="call_click" data-analytics-location="final_cta" href={`tel:${business.callPhone.e164}`}><IconPhone /> Call now</a><button className="button-3d button-light" data-analytics-event="request_repair_click" data-analytics-location="final_cta" onClick={() => requestCallback()} type="button"><IconMessageCircle /> Request by text</button></div>
        </section>
      </main>

      <SiteFooter />

      <nav aria-label="Quick contact" className="mobile-contact-bar"><a className="mobile-call" data-analytics-event="call_click" data-analytics-location="mobile_bar" href={`tel:${business.callPhone.e164}`}><IconPhone /> Call</a><button data-analytics-event="request_repair_click" data-analytics-location="mobile_bar" onClick={() => requestCallback()} type="button"><IconMessageCircle /> Request by text</button></nav>
      {expandedApplianceDetails ? <ServiceDialog key={expandedApplianceDetails.value} onClose={() => setExpandedAppliance(null)} onRequest={requestCallback} service={expandedApplianceDetails} selectedProblemIds={problemSelections[expandedApplianceDetails.value] ?? []} onProblemsChange={ids => setProblems(expandedApplianceDetails.value, ids)} /> : null}
      {priceOpen ? <PriceDialog onClose={() => setPriceOpen(false)} onRequest={() => requestCallback()} /> : null}
    </>
  );
}

function Benefit({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <article className="benefit-card"><span className="benefit-icon">{icon}</span><h3>{title}</h3><p>{children}</p></article>;
}

function Process({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <li><span className="process-number">{number}</span><h3>{title}</h3><p>{children}</p></li>;
}
