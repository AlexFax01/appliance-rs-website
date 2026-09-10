# Appliance RS Website

Production source for [appliancesc.com](https://appliancesc.com/), a fast static Next.js site for Appliance RS LLC. Production runs on the client’s existing hosting; GitHub plus verified local archives are the recovery sources. The retired Vercel demo is not part of this release.

Built and maintained by [ProgressorAI](https://progressorai.ca/).

## Contact model

- Calls always use `864-924-4349`.
- The service form prepares an SMS addressed to `864-497-6563` only after local validation.
- The visitor reviews the prepared message and explicitly opens Messages; nothing is sent or stored by the website.
- Desktop visitors also receive a local QR and copy fallback. The QR is generated in the browser without a third-party service.
- There is no CRM, database, email form, SMTP configuration, or server contact endpoint.

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Production public configuration:

```text
NEXT_PUBLIC_SITE_URL=https://appliancesc.com
NEXT_PUBLIC_SITE_STAGE=production
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=client-owned-browser-key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=client-owned-map-id
```

GA4 is installed only through GTM. The Maps key must be restricted to the production domain and Maps JavaScript API. With production Maps values the branded map loads automatically as it approaches the viewport; empty or failed Maps configuration keeps the classic Google map fallback.

## Canonical pages

- `/`
- `/refrigerator-freezer-repair/`
- `/ice-maker-repair/`
- `/washer-dryer-repair/`
- `/dishwasher-disposal-repair/`
- `/oven-cooktop-repair/`
- `/microwave-repair/`
- `/service-areas/`
- `/privacy/`

Service content, business details, hours, and the ordered list of 19 communities live in `src/content/site.ts`.

## Verification and client-host build

```bash
npm run check
npm run build:client-host
npm run test:e2e
```

`build:client-host` creates the portable static package in `out/` and copies the production `.htaccess`. Upload hashed assets first and HTML last. Retain previous hashed files in `_next/static` during deployment: already-open pages may still request them. Never delete that directory before uploading a release. Form validation ships with the form; the optional QR library must not block validation or SMS review. Verify all nine canonical URLs, the custom 404, robots, sitemap, Call/SMS targets, consent behavior, and the live map after deployment.

`node scripts/measure-performance.mjs URL LABEL` records five cold-cache mobile Lighthouse runs in `artifacts/performance/`. Run it before and after publishing the GTM container.

## Google ownership boundary

Search Console, GA4, GTM, Google Cloud, Business Profile, and Ads must remain owned by `appliancersl@gmail.com`. The owner accepts legal terms, configures billing and recovery, enables 2FA, and completes identity verification. ProgressorAI receives only named delegated roles; shared passwords and secrets do not belong in GitHub.
