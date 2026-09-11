# Appliance RS production SEO verification

Observed on `https://appliancesc.com` on 2026-09-10.

## Live HTTP checks

- All nine canonical URLs returned HTTP 200.
- A deliberately missing URL returned HTTP 404.
- `http://appliancesc.com/` returned a single 301 to `https://appliancesc.com/`.
- `https://www.appliancesc.com/` returned a single 301 to `https://appliancesc.com/`.
- `robots.txt` allows crawling and declares `https://appliancesc.com/sitemap.xml`.
- `sitemap.xml` contains exactly the nine canonical HTTPS URLs with matching trailing slashes and no redirect URLs.

## Google status

- Search Console ownership is not yet verified for `appliancersl@gmail.com`; sitemap submission and URL Inspection remain pending.
- The client-owned Maps JavaScript API configuration is active on the production domain.
- GA4 account `407663541`, property `553717251`, and web stream `G-DQ5ZH4QG69` are active. Enhanced form interactions are disabled. Client-owned GTM container `GTM-59GNC338` is created but intentionally remains unpublished until its consent-aware tags and non-PII events are validated.
- The Google Ads `Calls from ads` conversion is configured as the primary phone-lead action with a 60-second threshold. Website intent events remain planned as secondary observation events.
- The Google Business Profile service catalog shows the main appliance-repair services. The newly added garbage-disposal service is still shown as submitted for review.

This file records observed technical readiness, not guaranteed Google indexing, ad delivery, lead delivery, or approval of pending Business Profile changes.
