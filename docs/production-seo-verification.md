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

- The Domain property `appliancesc.com` was created in Search Console for `appliancersl@gmail.com`. DNS TXT ownership verification, sitemap submission, and URL Inspection remain pending because the supplied hosting login has no DNS-zone authority.
- The client-owned Maps JavaScript API configuration is active on the production domain.
- GA4 account `407663541`, property `553717251`, and web stream `G-DQ5ZH4QG69` are active. Enhanced form interactions are disabled. Client-owned GTM container `GTM-59GNC338` is live as Version 2 with the Google tag, approved non-PII event tag, and Conversion Linker.
- Live consent QA confirmed no `_ga` or `_gcl` cookies before a choice. After `Accept all`, the consent state changed to granted and measurement cookies appeared.
- Tag Assistant showed the custom GA4 event tag executed for `request_repair_click`. A separate production browser trace confirmed `request_repair_click` and `map_open` in the GA4 batched POST payload; these events contained only allow-listed interaction metadata, not form contact details.
- The Google Ads `Calls from ads` conversion is configured as the primary phone-lead action with a 60-second threshold. Website intent events remain planned as secondary observation events.
- The Google Business Profile service catalog shows the main appliance-repair services. The newly added garbage-disposal service is still shown as submitted for review.

This file records observed technical readiness, not guaranteed Google indexing, ad delivery, lead delivery, or approval of pending Business Profile changes.
