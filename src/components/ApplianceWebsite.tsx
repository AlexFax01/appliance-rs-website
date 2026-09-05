"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { DishWasherIcon, MicrowaveIcon, OvenIcon, RefrigeratorIcon, SnowflakeIcon, WashingMachineIcon } from "@hugeicons/core-free-icons";
import {
  IconArrowRight, IconBrandGoogle, IconCheck, IconChevronRight, IconCircleCheck,
  IconCoin, IconMapPin, IconMenu2, IconMessageCircle, IconPhone, IconSearch,
  IconShieldCheck, IconStarFilled, IconX,
} from "@tabler/icons-react";
import { appliances, business, faqs, reviews, serviceAreas } from "@/content/site";
import { ContactChooser } from "./ContactChooser";
import { ContactForm } from "./ContactForm";

const navItems = [
  ["home", "Home"], ["appliances", "Appliances We Repair"], ["process", "Our Process"],
  ["about", "About Us"], ["areas", "Service Areas"], ["reviews", "Reviews"],
] as const;

const applianceIcons = [RefrigeratorIcon, SnowflakeIcon, WashingMachineIcon, DishWasherIcon, OvenIcon, MicrowaveIcon];

export function ApplianceWebsite() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [selectedAppliance, setSelectedAppliance] = useState("refrigerator-freezer");
  const [expandedAppliance, setExpandedAppliance] = useState<(typeof appliances)[number]["value"] | null>(null);
  const [showAllAreas, setShowAllAreas] = useState(false);

  const expandedApplianceDetails = appliances.find((item) => item.value === expandedAppliance);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }, []);

  const requestCallback = useCallback((appliance?: string) => {
    if (appliance) setSelectedAppliance(appliance);
    window.setTimeout(() => scrollTo("contact"), 20);
  }, [scrollTo]);

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
      <header className="site-header">
        <div className="header-inner">
          <button aria-label="Go to top" className="brand" onClick={() => scrollTo("home")} type="button">
            <Image alt="Appliance RS round logo" className="brand-logo" height={54} priority src="/images/brand/appliance-rs-logo.webp" width={54} />
            <span className="brand-copy"><strong>Appliance RS</strong><small>{business.tagline}</small></span>
          </button>
          <nav aria-label="Primary navigation" className="desktop-nav">
            {navItems.map(([id, label]) => (
              <button className={activeSection === id ? "active" : ""} key={id} onClick={() => scrollTo(id)} type="button">{label}</button>
            ))}
          </nav>
          <button className="button-3d button-primary header-cta" onClick={() => setContactOpen(true)} type="button">
            <IconPhone className="phone-wiggle" size={19} /><span>Call or Text</span><strong>{business.phoneDisplay}</strong>
          </button>
          <button aria-expanded={mobileOpen} aria-label="Toggle navigation" className="icon-button menu-button" onClick={() => setMobileOpen((value) => !value)} type="button">
            {mobileOpen ? <IconX /> : <IconMenu2 />}
          </button>
        </div>
        {mobileOpen ? (
          <nav aria-label="Mobile navigation" className="mobile-nav">
            {navItems.map(([id, label]) => <button key={id} onClick={() => scrollTo(id)} type="button">{label}</button>)}
            <button className="button-3d button-primary" onClick={() => { setMobileOpen(false); setContactOpen(true); }} type="button">Call or Text {business.phoneDisplay}</button>
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
              <button className="button-3d button-primary button-large" onClick={() => setContactOpen(true)} type="button"><IconPhone className="phone-wiggle" /> Call or Text {business.phoneDisplay}</button>
              <button className="text-action" onClick={() => requestCallback()} type="button">Request a callback <IconArrowRight /></button>
            </div>
            <p className="location-note"><IconMapPin /> Proudly serving the Upstate of South Carolina</p>
          </div>
          <div className="hero-visual">
            <Image alt="Appliance RS technician explaining a refrigerator diagnosis to a homeowner" fill priority sizes="(max-width: 900px) 100vw, 50vw" src="/images/hero/appliance-rs-hero.png" />
            <div className="hero-badge"><IconShieldCheck /><span><strong>Local service</strong><small>Clear answers. Careful work.</small></span></div>
          </div>
        </section>

        <section className="section services-section" id="appliances">
          <div className="section-heading centered"><p className="eyebrow">What we fix</p><h2>We Repair All Major Appliances</h2><p>Choose an appliance to see common problems and repair options.</p></div>
          <div className="service-grid">
            {appliances.map((item, index) => {
              const isExpanded = expandedAppliance === item.value;
              return (
                <button
                  aria-controls="appliance-repair-details"
                  aria-expanded={isExpanded}
                  className={`service-card${isExpanded ? " is-active" : ""}`}
                  key={item.value}
                  onClick={() => setExpandedAppliance((current) => current === item.value ? null : item.value)}
                  type="button"
                >
                  <span aria-hidden="true" className="service-icon"><HugeiconsIcon icon={applianceIcons[index]} strokeWidth={1.8} /></span>
                  <h3>{item.title}</h3>
                  <span className="service-link">{isExpanded ? "Hide details" : "View common repairs"}<IconChevronRight /></span>
                </button>
              );
            })}
          </div>
          <div aria-hidden={!expandedApplianceDetails} className={`service-reveal${expandedApplianceDetails ? " is-open" : ""}`} id="appliance-repair-details">
            <div className="service-reveal-inner">
              {expandedApplianceDetails ? (
                <article className="service-reveal-panel" key={expandedApplianceDetails.value}>
                  <div className="service-reveal-image">
                    <Image alt={expandedApplianceDetails.alt} fill sizes="(max-width: 760px) 100vw, 45vw" src={expandedApplianceDetails.image} />
                  </div>
                  <div className="service-reveal-copy">
                    <p className="eyebrow">Typical problems we repair</p>
                    <h3>{expandedApplianceDetails.title}</h3>
                    <ul className="service-problem-list">
                      {expandedApplianceDetails.problems.map((problem) => <li key={problem}><IconCircleCheck />{problem}</li>)}
                    </ul>
                    <p className="service-reveal-note">Tell us the brand, model, and what the appliance is doing. We’ll confirm service availability and the next step.</p>
                    <button className="button-3d button-primary" onClick={() => requestCallback(expandedApplianceDetails.value)} type="button">Request {expandedApplianceDetails.title} repair <IconArrowRight /></button>
                  </div>
                </article>
              ) : null}
            </div>
          </div>
          <button className="text-action section-link" onClick={() => requestCallback("other")} type="button">Ask about another appliance <IconArrowRight /></button>
        </section>

        <section className="section why-section" id="about">
          <div className="section-heading centered"><p className="eyebrow">Why Appliance RS</p><h2>Straightforward service from a local team</h2></div>
          <div className="benefit-grid">
            <Benefit icon={<span className="price-icon">$85</span>} title="$85 Service Call">Upfront, straightforward pricing. No surprises.</Benefit>
            <Benefit icon={<IconSearch />} title="Diagnostic Fee Waived">Service call fee waived with an approved repair.</Benefit>
            <Benefit icon={<IconShieldCheck />} title="Warranty-Backed Repairs">Parts and labor coverage is confirmed with your quote.</Benefit>
            <Benefit icon={<IconMapPin />} title="Local Upstate Service">Fast response from a team that lives and works here.</Benefit>
            <Benefit icon={<IconMessageCircle />} title="Clear Communication">We explain the issue, your options, and the cost before work begins.</Benefit>
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="section-heading centered"><p className="eyebrow">Four clear steps</p><h2>Our Simple Process</h2></div>
          <ol className="process-list">
            <Process number="1" title="Call or Text">Reach out any time. We’ll schedule a time that works for you.</Process>
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
              {serviceAreas.slice(0, showAllAreas ? serviceAreas.length : 10).map((area) => <li key={area}><IconCheck /> {area}</li>)}
            </ul>
            <button className="text-action" onClick={() => setShowAllAreas((value) => !value)} type="button">{showAllAreas ? "Show fewer areas" : "See full service area"} <IconArrowRight /></button>
          </div>
          <div className="map-card">
            <iframe allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={business.mapEmbed} title="Appliance RS service location on Google Maps" />
            <a className="map-link" href={business.googleProfile} rel="noreferrer" target="_blank"><IconBrandGoogle /> Open Appliance RS on Google <IconArrowRight /></a>
          </div>
        </section>

        <section className="section reviews-section" id="reviews">
          <div className="reviews-top"><div className="section-heading"><p className="eyebrow">Real local feedback</p><h2>Trusted by Upstate homeowners</h2></div><a className="google-rating" href={business.googleProfile} rel="noreferrer" target="_blank"><IconBrandGoogle /><span><strong>5.0 on Google</strong><small>60 reviews</small></span></a></div>
          <div className="review-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.name}>
                <div className="stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <IconStarFilled key={i} />)}</div>
                <blockquote>“{review.text}”</blockquote><footer><strong>{review.name}</strong><span>{review.date} · Google review</span></footer>
              </article>
            ))}
          </div>
          <p className="review-note">Public Google reviews selected September 5, 2026.</p>
        </section>

        <section className="section contact-section" id="contact">
          <div className="contact-copy"><p className="eyebrow">Request service</p><h2>Tell us what’s going on. We’ll take it from here.</h2><p>Send the essentials and choose how you want us to respond. For the fastest help, call or text us directly.</p><a className="contact-phone" href={`tel:${business.phoneHref}`}><IconPhone /> {business.phoneDisplay}</a><ul><li><IconCheck /> No-obligation request</li><li><IconCheck /> Clear next steps</li><li><IconCheck /> Text fallback available</li></ul></div>
          <ContactForm selectedAppliance={selectedAppliance} />
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-heading centered"><p className="eyebrow">Good to know</p><h2>Frequently Asked Questions</h2></div>
          <div className="faq-grid">{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div>
        </section>

        <section className="final-cta">
          <div className="final-icon"><IconPhone /></div><div><p>Need Appliance Repair?</p><h2>Call or Text <span>{business.phoneDisplay}</span></h2><small>We’ll get your home running smoothly again—fast.</small></div>
          <button className="button-3d button-orange button-large" onClick={() => setContactOpen(true)} type="button"><IconPhone /> Call or Text Now</button>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><Image alt="Appliance RS logo" height={44} src="/images/brand/appliance-rs-logo.webp" width={44} /><span><strong>{business.name}</strong><small>{business.tagline}</small></span></div>
        <p>© 2026 Appliance RS. All rights reserved.</p><div className="footer-links"><Link href="/privacy">Privacy</Link><span>Fully Insured</span><span>Pay After Repair</span><span>Clear Pricing</span></div>
      </footer>

      <div className="mobile-contact-bar"><a href={`tel:${business.phoneHref}`}><IconPhone /> Call</a><a href={`sms:${business.phoneHref}`}><IconMessageCircle /> Text</a><button onClick={() => requestCallback()} type="button">Request callback</button></div>
      <ContactChooser onClose={() => setContactOpen(false)} onRequestCallback={() => requestCallback()} open={contactOpen} />
    </>
  );
}

function Benefit({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <article className="benefit-card"><span className="benefit-icon">{icon}</span><h3>{title}</h3><p>{children}</p></article>;
}

function Process({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <li><span className="process-number">{number}</span><h3>{title}</h3><p>{children}</p></li>;
}
