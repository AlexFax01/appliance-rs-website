# Appliance RS GTM and GA4 measurement plan

GA4 must be installed through one client-owned GTM container. Do not add a second direct `gtag.js` installation.

## Consent defaults

Before GTM loads, the site sets `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` to `denied`. The consent panel can grant analytics and advertising independently and stores the choice locally. Essential Call, form, SMS, ZIP, and map features do not require consent.

## Data-layer events

| Event | Allowed parameters | Meaning |
| --- | --- | --- |
| `call_click` | `cta_location`, `appliance_type` | Visitor clicked a call link; not proof of a completed call |
| `repair_form_start` | none | First focus inside the service form |
| `repair_form_valid` | `appliance_type` | Local form validation completed |
| `sms_handoff` | `method` | Visitor explicitly opened the prepared SMS URI; not proof that Send was pressed |
| `sms_copy` | `method` | Visitor copied the prepared message |
| `service_view` | `appliance_type` | Visitor opened or followed service details |
| `request_repair_click` | `cta_location`, `appliance_type` | Visitor selected a request CTA |
| `zip_check` | `coverage_result` (`covered` or `unknown`) | Advisory service-area result |
| `map_open` | `map_type` (`javascript` or `embed`) | Visitor explicitly loaded the Google map |
| `google_profile_click` | `cta_location` | Visitor followed the Google Business Profile link |

Names, phone numbers, addresses, ZIP values, issue text, brand, model, SMS body, and QR contents are prohibited analytics parameters.

## GTM configuration

1. Add one GA4 Configuration / Google tag using the client-owned measurement ID.
2. Keep enhanced form measurement disabled. A browser form event is not a delivered SMS lead.
3. Create custom event triggers for the table above and map only the allowed parameters.
4. Configure Conversion Linker with consent checks.
5. Keep `call_click`, `repair_form_valid`, and `sms_handoff` secondary/observation conversions.
6. Use the real Google Ads call conversion (minimum 60-second call) as the primary biddable conversion.
7. Preview with Tag Assistant, verify events fire once, verify denied/granted consent states, then publish a named GTM version.

Suggested first version name: `2026-09-10 Appliance RS consent and lead-intent measurement`.
