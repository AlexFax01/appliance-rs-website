"use client";
import { useEffect, useRef } from "react";
export function ModalFrame({ children, onClose, className, labelledBy }: { children: React.ReactNode; onClose: () => void; className: string; labelledBy: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal(); document.body.classList.add("modal-open");
    const controls = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]') ?? []).filter(element => element.tabIndex >= 0 && !element.matches(':disabled') && element.getClientRects().length > 0);
    let reverseTab = false;
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialog?.open) return;
      reverseTab = event.shiftKey;
      const available = controls();
      const first = available[0], last = available[available.length - 1];
      const active = document.activeElement;
      if (active === dialog || !active || !dialog.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault(); first?.focus();
      }
    };
    const containFocus = (event: FocusEvent) => {
      if (!dialog?.open || (event.target instanceof Node && dialog.contains(event.target))) return;
      const available = controls();
      (reverseTab ? available[available.length - 1] : available[0])?.focus();
    };
    document.addEventListener("keydown", trapFocus, true);
    document.addEventListener("focusin", containFocus, true);
    return () => {
      document.removeEventListener("keydown", trapFocus, true);
      document.removeEventListener("focusin", containFocus, true);
      dialog?.close(); document.body.classList.remove("modal-open"); previous?.focus({preventScroll: true});
    };
  }, []);
  return <dialog ref={ref} aria-labelledby={labelledBy} className={className} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>{children}</dialog>;
}
