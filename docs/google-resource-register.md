# Appliance RS Google resource register

Last updated: 2026-09-10

Canonical owner: `appliancersl@gmail.com`
Agency access: named ProgressorAI account only; never a shared password.

| Resource | Intended name / identifier | Owner | Current release status |
| --- | --- | --- | --- |
| Website | `https://appliancesc.com/` | Appliance RS LLC | Production hosting; nine canonical URLs prepared |
| Google Business Profile | Appliance RS LLC (`/g/11z7t4g7sf`) | `appliancersl@gmail.com` | Verified profile; HTTPS/UTM, public-chat removal, repair attribute, and disposal service submitted for Google review September 10, 2026 |
| Google Ads | `293-049-5593` | `appliancersl@gmail.com` | Existing; Calls from ads is the 60-second primary action; inactive website-call duplicate moved to secondary; budgets and bidding unchanged |
| Search Console | Domain property `appliancesc.com` | `appliancersl@gmail.com` | Not verified in the client account. Search Console reports that the signed-in client account has no access; DNS ownership confirmation is required |
| GA4 account | Appliance RS LLC (`407663541`) | `appliancersl@gmail.com` | Created September 10, 2026; United States terms and Google Ads data-processing terms accepted |
| GA4 property | Appliance RS Website (`553717251`) | `appliancersl@gmail.com` | Active; United States, Eastern Time, USD, Home & Garden, 1-10 employees, lead-generation and engagement objectives |
| GA4 web stream | Appliance RS Website (`15756951281`, `G-DQ5ZH4QG69`) | `appliancersl@gmail.com` | Active for `https://appliancesc.com`; enhanced form interactions disabled; production collection waits for GTM activation |
| GTM web container | Appliance RS Website (`GTM-59GNC338`; account `6376260244`, container `263810382`) | `appliancersl@gmail.com` | Created September 10, 2026; GDPR data-processing terms accepted; container is not yet configured or published |
| Google Cloud project | My First Project (`project-3bc5bc8b-4231-4ef3-b98`) | `appliancersl@gmail.com` | Active with client billing/free-trial account; Maps JavaScript API enabled September 10, 2026 |
| Maps browser key | Appliance RS Website (`20550761-46d2-4c96-8350-0d7d92c4ea42`) | `appliancersl@gmail.com` | Active; restricted to `https://appliancesc.com/*` and Maps JavaScript API |
| Maps Map ID | `c153fc6441a7350678380d17` | `appliancersl@gmail.com` | Active production JavaScript vector map |
| Local Services Ads | Appliance RS LLC | Client Google account | Identity / representative verification is owner-only |

## Verified profile facts (2026-09-10)

- Primary category: Appliance repair service.
- Public phone: `864-924-4349`.
- Service-area business: no public storefront address.
- Hours: Monday-Friday 7:30 AM-6:00 PM; Saturday 8:00 AM-5:00 PM; Sunday closed.
- All 19 configured service areas remain in the profile.
- The existing repair catalog already included refrigerator/freezer, washer/dryer, dishwasher, oven, cooktop/stove, microwave, and ice-maker repair. `Garbage disposal repair` was added and is pending Google review.
- The public GBP SMS channel using `864-497-6563` was submitted for removal. That number remains used only by the website's user-initiated SMS handoff.

## Recovery and role checklist

- Owner enables Google two-step verification and stores recovery codes offline.
- Owner keeps the Cloud billing profile active and accepts any future Ads legal terms that require owner action.
- ProgressorAI receives Search Console Full user (or delegated owner), GA4 Editor, GTM Publish, Google Ads Standard, and only the Cloud Maps/API role required for configuration.
- Billing Admin is not assigned to ProgressorAI unless the owner explicitly decides it is necessary.
- DNS verification TXT records remain in DNS after Search Console verification.
- API keys, recovery codes, personal documents, and passwords are never stored in GitHub.

## Owner-action boundary observed September 10, 2026

- GA4 account, property, and web stream are active. Event-data and user-data retention are both set to 14 months as of September 10, 2026; reset on new user activity remains enabled.
- GTM account and web container are active. The empty container still needs the consent-aware GA4 configuration, event tags, validation, and a separately approved first publication.
- Search Console cannot yet expose a sitemap or URL Inspection because `appliancersl@gmail.com` is not a verified user for the domain property.
- The authoritative nameservers are `ns1.ssdlinux35.accuwebhosting.com` and `ns2.ssdlinux35.accuwebhosting.com`. The supplied FTPS login does not authenticate to cPanel, so it does not provide DNS-zone authority. A DNS-capable AccuWeb login or owner-added TXT record is required.
- The live site is already technically ready for measurement. Do not add a placeholder GTM ID or duplicate direct `gtag.js` while the client-owned resources are pending.

## Release identifiers to record after creation

Record the Search Console verification date, GA4 property ID, GA4 measurement ID, GTM container ID and published version, Cloud project ID, Map ID, restricted-key creation date, Ads linkage dates, and the name of each delegated user. Never paste a secret key value into this document.
