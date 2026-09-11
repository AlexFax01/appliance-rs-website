# Appliance RS Google resource register

Last updated: 2026-09-11

Canonical owner: `appliancersl@gmail.com`
Agency access: named ProgressorAI account only; never a shared password.

| Resource | Intended name / identifier | Owner | Current release status |
| --- | --- | --- | --- |
| Website | `https://appliancesc.com/` | Appliance RS LLC | Production hosting; nine canonical URLs prepared |
| Google Business Profile | Appliance RS LLC (`/g/11z7t4g7sf`) | `appliancersl@gmail.com` | Verified profile; HTTPS/UTM, public-chat removal, repair attribute, and disposal service submitted for Google review September 10, 2026; direct GA4 profile linkage not yet completed |
| Google Ads | `293-049-5593` | `appliancersl@gmail.com` | Linked to GA4 property `553717251` on September 11, 2026; auto-tagging enabled; Calls from ads is the 60-second primary action; inactive website-call duplicate moved to secondary; budgets and bidding unchanged |
| Search Console | Domain property `appliancesc.com` | `appliancersl@gmail.com` | Created September 10, 2026; verification remains pending because a Domain property requires the displayed DNS TXT record |
| GA4 account | Appliance RS LLC (`407663541`) | `appliancersl@gmail.com` | Created September 10, 2026; United States terms and Google Ads data-processing terms accepted |
| GA4 property | Appliance RS Website (`553717251`) | `appliancersl@gmail.com` | Active; United States, Eastern Time, USD, Home & Garden, 1-10 employees, lead-generation and engagement objectives |
| GA4 web stream | Appliance RS Website (`15756951281`, `G-DQ5ZH4QG69`) | `appliancersl@gmail.com` | Active for `https://appliancesc.com`; enhanced form interactions disabled; live page views and approved non-PII interactions verified through GTM |
| GTM web container | Appliance RS Website (`GTM-59GNC338`; account `6376260244`, container `263810382`) | `appliancersl@gmail.com` | Published Version 2 on September 10, 2026 with the Google tag, approved non-PII GA4 events, Conversion Linker, and consent-aware behavior |
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
- GA4 property `553717251` is linked to the client Google Ads account `293-049-5593` as of September 11, 2026. The setup result showed `Link created`, and auto-tagging was enabled. Google notes that linked Ads data can take up to 24 hours to appear.
- GTM Version 2 is live. Tag Assistant shows `GA4 events - approved non-PII` executed on `request_repair_click`; an independent production request trace confirmed batched `request_repair_click` and `map_open` hits to `G-DQ5ZH4QG69` after consent.
- Before consent, the production browser set no `_ga` or `_gcl` cookies. After `Accept all`, the consent state changed to granted and GA4/Conversion Linker cookies were created.
- The Domain property now exists in the client account, but Search Console cannot expose sitemap submission or URL Inspection until the DNS TXT record is added and ownership is confirmed.
- The authoritative nameservers are `ns1.ssdlinux35.accuwebhosting.com` and `ns2.ssdlinux35.accuwebhosting.com`. The supplied FTPS login does not authenticate to cPanel, so it does not provide DNS-zone authority. A DNS-capable AccuWeb login or owner-added TXT record is required.
- The live site is measuring through the client-owned GTM container. Do not add a duplicate direct `gtag.js` installation.
- The optional direct GA4-to-Business-Profile link remains uncreated. The only eligible managed profile shown was `Appliance RS LLC`; no other profile was selected or linked. This does not block the website, Business Profile, Maps, GTM, GA4, or Ads measurement already in production.

## Release identifiers to record after creation

Record the eventual Search Console verification date, Business Profile linkage date, and the name of each delegated user. Never paste a secret key value into this document.
