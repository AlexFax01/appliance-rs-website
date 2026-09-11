# Appliance RS production SEO verification

Observed on `https://appliancesc.com` on 2026-09-10, with Google linkage status updated on 2026-09-11.

## Live HTTP checks

- All nine canonical URLs returned HTTP 200.
- A deliberately missing URL returned HTTP 404.
- `http://appliancesc.com/` returned a single 301 to `https://appliancesc.com/`.
- `https://www.appliancesc.com/` returned a single 301 to `https://appliancesc.com/`.
- `robots.txt` allows crawling and declares `https://appliancesc.com/sitemap.xml`.
- `sitemap.xml` contains exactly the nine canonical HTTPS URLs with matching trailing slashes and no redirect URLs.
- The nine-URL and HTTP 404 checks were repeated successfully on September 11, 2026 after the Google linkage work.

## Google status

- The URL-prefix property `https://appliancesc.com/` is verified in Search Console for `appliancersl@gmail.com`. On September 11, 2026, `https://appliancesc.com/sitemap.xml` was submitted successfully; Search Console reported 9 discovered pages.
- URL Inspection reported that `https://appliancesc.com/` is already in Google’s index and served through HTTPS. A fresh indexing request was accepted into Google’s priority crawl queue.
- The separate Domain property `appliancesc.com` remains pending because the supplied hosting login has no DNS-zone authority. This does not block monitoring or indexing work for the canonical HTTPS URL-prefix property.
- The client-owned Maps JavaScript API configuration is active on the production domain.
- GA4 account `407663541`, property `553717251`, and web stream `G-DQ5ZH4QG69` are active. Enhanced form interactions are disabled. Client-owned GTM container `GTM-59GNC338` is live as Version 2 with the Google tag, approved non-PII event tag, and Conversion Linker.
- Live consent QA confirmed no `_ga` or `_gcl` cookies before a choice. After `Accept all`, the consent state changed to granted and measurement cookies appeared.
- Tag Assistant showed the custom GA4 event tag executed for `request_repair_click`. A separate production browser trace confirmed `request_repair_click` and `map_open` in the GA4 batched POST payload; these events contained only allow-listed interaction metadata, not form contact details.
- GA4 property `553717251` is linked to Google Ads account `293-049-5593`; auto-tagging is enabled. The successful setup result was observed on September 11, 2026. Budgets and bidding were not changed.
- The Google Ads `Calls from ads` conversion is configured as the primary phone-lead action with a 60-second threshold. Website intent events remain planned as secondary observation events.
- The Google Business Profile service catalog shows the main appliance-repair services. The newly added garbage-disposal service is still shown as submitted for review.
- The optional direct GA4-to-Business-Profile link is not yet complete. This is an administrative reporting integration and does not block the live public profile or site measurement.

This file records observed technical readiness, not guaranteed Google indexing, ad delivery, lead delivery, or approval of pending Business Profile changes.
