"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { IconArrowRight, IconCircleCheck, IconX } from "@tabler/icons-react";
import { appliances } from "@/content/site";

type ApplianceService = (typeof appliances)[number];

type ServiceDialogProps = {
  service?: ApplianceService;
  onClose: () => void;
  onRequest: (appliance: ApplianceService["value"]) => void;
};

export function ServiceDialog({ service, onClose, onRequest }: ServiceDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!service) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
      previous?.focus();
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div className="service-modal-backdrop" onMouseDown={onClose}>
      <div
        aria-describedby="service-dialog-description"
        aria-labelledby="service-dialog-title"
        aria-modal="true"
        className="service-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <button aria-label="Close appliance details" className="icon-button service-dialog-close" onClick={onClose} type="button">
          <IconX size={23} />
        </button>
        <div className="service-dialog-image">
          <Image alt={service.alt} fill priority sizes="(max-width: 640px) 100vw, 46vw" src={service.image} />
          <span>Appliance RS repair service</span>
        </div>
        <div className="service-dialog-copy">
          <p className="eyebrow">Typical problems we repair</p>
          <h2 id="service-dialog-title">{service.title}</h2>
          <ul className="service-problem-list">
            {service.problems.map((problem) => <li key={problem}><IconCircleCheck />{problem}</li>)}
          </ul>
          <p className="service-dialog-note" id="service-dialog-description">Tell us the brand, model, and what the appliance is doing. We’ll confirm service availability and the next step.</p>
          <button className="button-3d button-primary service-dialog-cta" onClick={() => { onClose(); onRequest(service.value); }} type="button">
            Request {service.title} repair <IconArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
