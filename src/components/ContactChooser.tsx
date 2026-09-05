"use client";

import { useEffect, useRef } from "react";
import { IconMessage, IconPhone, IconX } from "@tabler/icons-react";
import { business } from "@/content/site";

type ContactChooserProps = {
  open: boolean;
  onClose: () => void;
  onRequestCallback: () => void;
};

export function ContactChooser({ open, onClose, onRequestCallback }: ContactChooserProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        aria-labelledby="contact-dialog-title"
        aria-modal="true"
        className="contact-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <button aria-label="Close contact options" className="icon-button dialog-close" onClick={onClose} type="button">
          <IconX size={22} />
        </button>
        <p className="eyebrow">How can we help?</p>
        <h2 id="contact-dialog-title">Choose the easiest way to reach us.</h2>
        <p className="dialog-copy">Call or text now, or send a short callback request and we’ll follow up.</p>
        <div className="dialog-actions">
          <a className="button-3d button-primary" href={`tel:${business.phoneHref}`}>
            <IconPhone size={22} /> Call now
          </a>
          <a className="button-3d button-secondary" href={`sms:${business.phoneHref}`}>
            <IconMessage size={22} /> Send a text
          </a>
          <button
            className="button-3d button-outline"
            onClick={() => { onClose(); onRequestCallback(); }}
            type="button"
          >
            Request a callback
          </button>
        </div>
      </div>
    </div>
  );
}
