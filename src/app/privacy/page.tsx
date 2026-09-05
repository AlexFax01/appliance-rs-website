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
        <p>Appliance RS uses the information you submit to respond to your service request, confirm details, and arrange an appointment. We do not sell the information submitted through this website.</p>
        <h2>Information collected</h2>
        <p>The callback form may collect your name, phone number, email, ZIP code, appliance type, service details, contact preference, and preferred time.</p>
        <h2>Questions or deletion requests</h2>
        <p>Contact us at <a href={`mailto:${business.email}`}>{business.email}</a> or call <a href={`tel:${business.phoneHref}`}>{business.phoneDisplay}</a>.</p>
        <p className="legal-updated">Last updated September 5, 2026.</p>
      </article>
    </main>
  );
}
