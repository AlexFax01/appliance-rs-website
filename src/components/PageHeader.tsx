import Image from "next/image";
import Link from "next/link";
import { IconMessageCircle, IconPhone } from "@tabler/icons-react";
import { business } from "@/content/site";

export function PageHeader({ requestHref = "/#contact" }: { requestHref?: string }) {
  return (
    <header className="page-header">
      <Link aria-label="Appliance RS home" className="brand" href="/">
        <Image alt="Appliance RS round logo" className="brand-logo" height={48} priority src="/images/brand/appliance-rs-logo.webp" width={48} />
        <span className="brand-copy"><strong>Appliance RS</strong><small>{business.tagline}</small></span>
      </Link>
      <nav aria-label="Page navigation"><Link href="/#appliances">All services</Link><Link href="/service-areas/">Service areas</Link></nav>
      <div className="page-header-actions">
        <Link className="button-3d button-outline" data-analytics-event="request_repair_click" data-analytics-location="internal_header" href={requestHref}><IconMessageCircle size={18} /> Request by text</Link>
        <a className="button-3d button-orange" data-analytics-event="call_click" data-analytics-location="internal_header" href={`tel:${business.callPhone.e164}`}><IconPhone size={18} /> Call {business.callPhone.display}</a>
      </div>
    </header>
  );
}
