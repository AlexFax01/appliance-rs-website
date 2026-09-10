"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { IconArrowRight, IconCheck, IconPhone, IconStarFilled, IconX } from "@tabler/icons-react";
import { appliances, business, problemCatalog } from "@/content/site";
import { reviewsFor, reviewsVerifiedAt } from "@/content/service-reviews";
import { ModalFrame } from "./ModalFrame";
type Service = (typeof appliances)[number];
export function ServiceDialog({ service, selectedProblemIds, onProblemsChange, onClose, onRequest }: {
  service: Service; selectedProblemIds: string[]; onProblemsChange: (ids: string[]) => void; onClose: () => void; onRequest: (appliance: string) => void;
}) {
  const [tab, setTab] = useState<"problems" | "reviews">("problems");
  const tabs = useRef<HTMLDivElement>(null);
  const reviews = reviewsFor(service.value);
  const choose = (id: string) => onProblemsChange(selectedProblemIds.includes(id) ? selectedProblemIds.filter(item => item !== id) : [...selectedProblemIds, id]);
  return <ModalFrame className="service-dialog" labelledBy="service-dialog-title" onClose={onClose}>
    <button aria-label="Close appliance details" className="icon-button service-dialog-close" onClick={onClose} type="button"><IconX size={23} /></button>
    <div className="service-dialog-scroll">
      <div className="service-dialog-image"><Image alt={service.alt} fill sizes="(max-width: 760px) 100vw, 460px" src={service.image} /><span>Appliance RS repair service</span></div>
      <div className="service-dialog-copy">
        <p className="eyebrow">Let’s get it working again</p><h2 id="service-dialog-title">{service.title}</h2>
        <div className="service-tabs" role="tablist" aria-label="Appliance details" ref={tabs} onKeyDown={event => {
          if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === "Home" ? "problems" : event.key === "End" ? "reviews" : tab === "problems" ? "reviews" : "problems";
          setTab(next); tabs.current?.querySelector<HTMLButtonElement>(`#service-tab-${next}`)?.focus();
        }}>
          <button type="button" role="tab" id="service-tab-problems" aria-selected={tab === "problems"} aria-controls="service-panel-problems" tabIndex={tab === "problems" ? 0 : -1} onClick={() => setTab("problems")}>Common problems</button>
          <button type="button" role="tab" id="service-tab-reviews" aria-selected={tab === "reviews"} aria-controls="service-panel-reviews" tabIndex={tab === "reviews" ? 0 : -1} onClick={() => setTab("reviews")}>Customer reviews{reviews.length ? ` (${reviews.length})` : ""}</button>
        </div>
        <div role="tabpanel" id="service-panel-problems" aria-labelledby="service-tab-problems" hidden={tab !== "problems"}>
          <p className="service-dialog-note">Select anything that sounds familiar. We’ll include it in your request.</p>
          <div className="problem-options">{problemCatalog[service.value].map(problem => <button type="button" className="problem-option" aria-pressed={selectedProblemIds.includes(problem.id)} key={problem.id} onClick={() => choose(problem.id)}><span className="problem-check"><IconCheck size={16} /></span>{problem.label}</button>)}</div>
          <p className="service-dialog-note">Something else? You can describe it in the request form.</p>
        </div>
        <div role="tabpanel" id="service-panel-reviews" aria-labelledby="service-tab-reviews" hidden={tab !== "reviews"} tabIndex={0}>
          {reviews.length ? reviews.map(review => <article className="service-review" key={review.id}>
            <div className="stars" role="img" aria-label={`${review.rating} out of 5 stars`}>{Array.from({length: review.rating}, (_, i) => <IconStarFilled key={i} size={14} />)}</div>
            <blockquote>“{review.text}”</blockquote><strong>{review.name}</strong><a href={review.source} target="_blank" rel="noreferrer">Read on Google <IconArrowRight size={14} /></a>
          </article>) : <p className="service-dialog-note">See what local customers say about Appliance RS on Google.</p>}
          <a className="text-action" href={business.googleProfile} target="_blank" rel="noreferrer">All Google reviews <IconArrowRight /></a>
          {reviews.length ? <p className="review-note">Selected excerpts · Verified {reviewsVerifiedAt}</p> : null}
        </div>
      </div>
    </div>
    <div className="service-dialog-footer">
      <span aria-live="polite">{selectedProblemIds.length ? `${selectedProblemIds.length} problem${selectedProblemIds.length === 1 ? "" : "s"} selected` : "Tell us what needs attention"}</span>
      <div className="service-dialog-actions">
        <a className="service-learn-link" href={`/${service.slug}/`}>Learn more</a>
        <button className="button-3d button-primary service-dialog-cta" data-analytics-event="request_repair_click" data-analytics-location="service_dialog" data-analytics-appliance={service.value} onClick={() => { onClose(); onRequest(service.value); }} type="button">Request repair <IconArrowRight /></button>
        <a className="button-3d button-orange service-dialog-call" data-analytics-event="call_click" data-analytics-location="service_dialog" data-analytics-appliance={service.value} href={`tel:${business.callPhone.e164}`}><IconPhone size={19} /> Call now</a>
      </div>
    </div>
  </ModalFrame>;
}
