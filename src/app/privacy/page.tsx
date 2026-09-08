import Link from "next/link";
import { business } from "@/content/site";

export const metadata = {
  title: "Privacy | Appliance RS",
  description: "How Appliance RS handles callback request information.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <article className="legal-card">
        <Link className="text-link" href="/">← Back to Appliance RS</Link>
        <p className="eyebrow">Privacy</p>
        <h1>Your request stays focused on your repair.</h1>
        <p>The request form prepares a text message on your device. Nothing is sent automatically: you review the message and choose whether to send it to Appliance RS. We do not sell information entered on this website.</p>
        <h2>Information collected</h2>
        <p>The form may include your name, phone number, service address, ZIP code, appliance type, selected problems, brand, model, service details, contact preference, and preferred time in the SMS that opens on your device.</p>
        <h2>Questions or deletion requests</h2>
        <p>Contact us at <a href={`mailto:${business.email}`}>{business.email}</a> or call <a href={`tel:${business.phoneHref}`}>{business.phoneDisplay}</a>.</p>
        <p className="legal-updated">Last updated September 8, 2026.</p>
      </article>
    </main>
  );
}
