# Appliance RS Google owner activation handoff

Last checked: 2026-09-10

These are the remaining owner-only actions. Complete them while signed in as `appliancersl@gmail.com`. Do not use a shared agency account and do not send passwords or recovery codes by email or chat.

## 1. Google Analytics 4 — created

Created September 10, 2026 with:

- account: `Appliance RS LLC`;
- property: `Appliance RS Website`;
- country: United States;
- timezone: Eastern Time / New York;
- currency: USD;
- industry: Home & Garden;
- company size: 1-10 employees;
- objectives: Generate leads and examine user engagement;
- optional account data-sharing toggles: off.
- account ID: `407663541`;
- property ID: `553717251`;
- web stream ID: `15756951281`;
- measurement ID: `G-DQ5ZH4QG69`;
- enhanced form interactions: off.

Verified production configuration:

1. Event-data and user-data retention are set to 14 months. Reset on new user activity remains enabled.
2. GA4 is installed only through the client-owned GTM container; there is no duplicate direct `gtag.js`.
3. Consent defaults to denied. Production requests confirmed that optional Google cookies are absent before consent and created only after `Accept all`.
4. Tag Assistant and a production request trace confirmed the approved non-PII interaction pipeline, including `request_repair_click` and `map_open`.

## 2. Google Tag Manager

Created September 10, 2026 with:

- account: `Appliance RS LLC`;
- country: United States;
- container: `Appliance RS Website`;
- target platform: Website;
- anonymous data sharing: off.
- account ID: `6376260244`;
- container ID: `263810382`;
- public ID: `GTM-59GNC338`;
- GDPR data-processing terms: accepted.

Published configuration:

1. Google tag: `Google tag - Appliance RS GA4`.
2. Approved event tag: `GA4 events - approved non-PII`.
3. Conversion Linker: `Conversion Linker - All Pages`.
4. First live release: Version 2, `2026-09-10 Appliance RS consent and lead-intent measurement`.
5. Consent and event execution were verified in Tag Assistant; the production network trace also confirmed custom events in the GA4 batched POST payload.

## 3. Search Console

Current state: the Domain property `appliancesc.com` was created in the client account on September 10, 2026. Ownership is still unverified because Domain properties require DNS confirmation.

Owner or DNS-admin action:

1. Add the exact TXT value currently displayed by Search Console to the root DNS zone for `appliancesc.com` in AccuWeb.
2. Keep the TXT record after verification.
3. Return to Search Console and confirm ownership.
4. Submit `https://appliancesc.com/sitemap.xml` and inspect the nine canonical URLs.

The authoritative nameservers are:

- `ns1.ssdlinux35.accuwebhosting.com`
- `ns2.ssdlinux35.accuwebhosting.com`

FTPS access is sufficient to publish the website but is not sufficient to edit DNS. The live homepage also carries the supplied Google verification meta marker as an auxiliary recovery method for a URL-prefix property; it does not replace DNS verification for the required Domain property.

## 4. Security and advertising ownership

- Enable Google two-step verification and store recovery codes offline.
- Complete Local Services Ads identity / representative verification personally.
- Keep the existing Google Ads budget and bidding unchanged until there are at least 14 days of clean measurement.
- The confirmed primary Ads conversion remains `Calls from ads`: phone-lead primary action, 60-second call threshold, conversion type ID `7653794562`.
- Add ProgressorAI later through named delegated roles only: GA4 Editor, GTM Publish, Search Console Full user or delegated owner, Google Ads Standard, and the minimum Maps/API role needed.
