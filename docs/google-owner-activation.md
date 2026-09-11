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

Remaining configuration:

1. Event-data and user-data retention are set to 14 months. Reset on new user activity remains enabled.
2. Install the GA4 configuration only through the new GTM container; do not add a duplicate direct `gtag.js`.
3. Verify consent and non-PII custom events in Tag Assistant and GA4 DebugView.

## 2. Google Tag Manager

The creation wizard is staged with:

- account: `Appliance RS LLC`;
- country: United States;
- container: `Appliance RS Website`;
- target platform: Website;
- anonymous data sharing: off.

Pending action:

1. Confirm the final `Yes` action that creates the persistent GTM account/container.
2. Record the new `GTM-...` container ID.

After both GA4 and GTM exist, ProgressorAI can configure the tags from `docs/gtm-measurement-plan.md`, build the production site with the real public GTM ID, publish a named GTM version, and verify consent plus events in Tag Assistant.

## 3. Search Console

Current state: the client account does not have verified access to the existing Domain property `appliancesc.com`.

Owner or DNS-admin action:

1. Start ownership verification for the Domain property in Search Console.
2. Copy the exact `google-site-verification=...` TXT value shown by Google.
3. Add it to the root DNS zone for `appliancesc.com` in AccuWeb.
4. Keep the TXT record after verification.
5. Return to Search Console and confirm ownership.

The authoritative nameservers are:

- `ns1.ssdlinux35.accuwebhosting.com`
- `ns2.ssdlinux35.accuwebhosting.com`

FTPS access is sufficient to publish the website but is not sufficient to edit DNS. After ownership is confirmed, submit `https://appliancesc.com/sitemap.xml` and inspect the nine canonical URLs listed in the README.

## 4. Security and advertising ownership

- Enable Google two-step verification and store recovery codes offline.
- Complete Local Services Ads identity / representative verification personally.
- Keep the existing Google Ads budget and bidding unchanged until there are at least 14 days of clean measurement.
- The confirmed primary Ads conversion remains `Calls from ads`: phone-lead primary action, 60-second call threshold, conversion type ID `7653794562`.
- Add ProgressorAI later through named delegated roles only: GA4 Editor, GTM Publish, Search Console Full user or delegated owner, Google Ads Standard, and the minimum Maps/API role needed.
