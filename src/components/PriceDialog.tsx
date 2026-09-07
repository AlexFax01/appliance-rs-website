"use client";
import { IconPhone, IconX } from "@tabler/icons-react";
import { business, pricing } from "@/content/site";
import { ModalFrame } from "./ModalFrame";
export function PriceDialog({onClose, onRequest}: {onClose: () => void; onRequest: () => void}) {
  return <ModalFrame className="pricing-dialog" labelledBy="pricing-title" onClose={onClose}>
    <button className="icon-button service-dialog-close" type="button" aria-label="Close pricing details" onClick={onClose}><IconX /></button>
    <p className="eyebrow">Clear pricing</p><h2 id="pricing-title">How the {pricing.fee} service call works</h2>
    <ol>{pricing.steps.map(step => <li key={step}>{step}</li>)}</ol>
    <p>The final repair price and warranty coverage are confirmed with your quote before work begins.</p>
    <div className="pricing-actions"><button type="button" className="button-3d button-primary" onClick={() => {onClose(); onRequest();}}>Request service</button><a className="button-3d button-orange" href={`tel:${business.phoneHref}`}><IconPhone size={19} /> Call now</a></div>
  </ModalFrame>;
}
