import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { business } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Appliance RS handles service request information, analytics choices, and third-party map services.",
  alternates: { canonical: "/privacy/" },
  openGraph: { url: "/privacy/", title: "Privacy | Appliance RS", description: "Privacy information for the Appliance RS website." },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader />
      <main className="legal-page">
        <article className="legal-card">
          <Link className="text-link" href="/">← Back to Appliance RS</Link>
          <p className="eyebrow">Privacy</p>
          <h1>Your service request stays on your device until you send it.</h1>
          <p>The website prepares a text message in your browser. Nothing is sent automatically: you review the message and choose whether to send it to Appliance RS through your device’s Messages application. The website does not store the contents of your service request.</p>

          <h2>Information in a service request</h2>
          <p>The prepared SMS may include your name, callback number, service address, ZIP code, appliance type, selected problems, brand, model, service details, contact preference, and preferred time. This information is handled by your device and mobile messaging provider after you choose to open or send the message.</p>

          <h2>Analytics and advertising choices</h2>
          <p>With your permission, Google Analytics and Google Ads may receive non-identifying events such as a page view, a call-button click, a ZIP coverage result, or the opening of a prepared SMS. Appliance RS does not send names, phone numbers, street addresses, ZIP codes, model numbers, or service-request text to Google Analytics or Google Ads.</p>
          <p>You can accept, reject, or change optional analytics and advertising cookies at any time using “Cookie settings” in the website footer. Essential functions remain available when optional cookies are rejected.</p>

          <h2>Google Maps and external links</h2>
          <p>The interactive Google map loads only after you choose to open it. Google may then receive technical information such as your IP address and browser details under Google’s own terms. Links to Google reviews and the Appliance RS Business Profile open Google services in a separate page.</p>

          <h2>Retention and sharing</h2>
          <p>Appliance RS does not sell information entered on this website. A message that you send is retained according to the settings of the owner’s messaging service and your own device. Optional analytics data is configured with a 14-month retention period.</p>

          <h2>Questions or privacy requests</h2>
          <p>Contact <a href={`mailto:${business.email}`}>{business.email}</a> or call <a data-analytics-event="call_click" data-analytics-location="privacy" href={`tel:${business.callPhone.e164}`}>{business.callPhone.display}</a>.</p>
          <p className="legal-updated">Last updated September 10, 2026.</p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
