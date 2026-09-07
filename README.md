# Appliance RS Website

Standalone redesign demo for Appliance RS. The project is intentionally separate from the source archive and can ship in two ways:

- **Vercel:** Next.js frontend with a device-native, prefilled SMS request flow.
- **Client PHP hosting:** static site in `out/` with the same SMS request flow. The existing mail handlers remain available for a future approved email mode.

No database, Supabase, CRM, or automation service is required.

Current noindex client demo: <https://appliance-rs-website.vercel.app>

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The preview defaults to `noindex`. The request form validates locally and opens a prepared SMS addressed to Appliance RS. Nothing is sent until the visitor presses Send in their messaging app.

## Environment variables

```text
NEXT_PUBLIC_SITE_URL=https://your-preview-url.example
NEXT_PUBLIC_SITE_STAGE=preview
NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
CONTACT_FROM_EMAIL=website@example.com
CONTACT_TO_EMAIL=appliansersl@gmail.com
```

Set `NEXT_PUBLIC_SITE_STAGE=production` only on the final approved production domain. The included `vercel.json` also adds an `X-Robots-Tag: noindex` header to the Vercel demo.

## Verification

```bash
npm run check
npm run build:client-host
```

The first command runs ESLint, TypeScript, unit tests, and the standard Next.js build. The second creates the portable client-host package in `out/`.

## Vercel deployment

1. Import the GitHub repository into Vercel.
2. Add the environment variables from `.env.example`.
3. Keep `NEXT_PUBLIC_SITE_STAGE=preview` for the client demo.
4. Test the SMS handoff on the client’s actual iPhone and Android device before the production-domain launch.

## PHP-host deployment

1. Run `npm run build:client-host`.
2. Upload the contents of `out/` to the client web root.
3. In `out/api/`, run `composer install --no-dev --optimize-autoloader` on the server or upload the generated `vendor/` folder.
4. Test the SMS handoff on the production domain. SMTP configuration is only needed if the optional email endpoint is activated later.
5. If email mode is activated, `build:client-host` includes `/api/contact.php`. Use PHP 8.1+ with GD (JPEG/PNG/WebP), fileinfo, mbstring and OpenSSL and keep production error display disabled.

## Content and assets

- Approved direction: `design/reference/approved-homepage.png`
- Generated hero: `public/images/hero/appliance-rs-hero.png`
- Service photos: `public/images/services/`
- Business content, service areas, reviews, and contact details: `src/content/site.ts`
- Visual acceptance notes: `design-qa.md`

Google reviews are curated static excerpts with a verification date. They are not scraped at runtime, and the site does not publish review schema.

## Seven improvements (September 2026)

- Existing appliance icons open native dialogs with multiple problem choices and category-specific Google excerpts; selections transfer to the callback form without replacing free-text notes.
- ZIP matching is advisory, not an availability promise. `src/content/coverage.ts` includes the source/license/date for all 19 towns. Service Areas starts with a 33 KB AVIF (53 KB WebP fallback) 3D preview; the Google iframe with the verified company CID is created only after the visitor chooses “Explore interactive map.”
- The form builds a complete SMS containing the visitor’s contact details, appliance, chosen problems, description, ZIP, and preferred response time. It opens the phone’s messaging app addressed to 864-924-4349; the visitor reviews it and presses Send.
- Up to three photos can be prepared and previewed locally. Because `sms:` links cannot pre-attach files, the form explicitly asks the visitor to attach them in Messages after it opens. The current browser flow does not upload those previews.
- Service towns are ordered by 2020 Census population. Greenville, Spartanburg, Greer, and Simpsonville are emphasized as regional centers; Moore follows the ranked Census places because it has no directly comparable Census-place count.
- Bounded desktop-only parallax, one-shot icon/button feedback, and a shared $85 explanation preserve the approved page structure. Reduced-motion preferences disable decorative movement.
- Hero assets are prebuilt AVIF/WebP (`node scripts/prepare-hero.mjs`). The same fonts are locally subset to Latin/punctuation, licensed in `src/app/fonts/`; unsupported name glyphs use system fallback. Optional font display avoids late swaps. Inline CSS is enabled for this small landing page; modal code, validation, and photo processing load on demand.

## Extended checks

Run a production server on port 3100, then `npm run test:e2e` (isolated Chrome). Set `TEST_BASE_URL=http://127.0.0.1:3101` to run against a served PHP export. Browser tests inspect the generated SMS link and never send a customer message.

`PHP_TEST_RUNTIME=/path/to/frankenphp node scripts/test-php.mjs` runs isolated PHP transport/validation checks with a test-only mail class, never included in `out/`. `npm run test:php` remains available on hosts with a normal PHP CLI.

After `vercel build --prod`, run `node scripts/test-vercel-output.mjs` to check the real emitted function, including ESM imports and validated image decoding. It disables SMTP in its own process and never sends external mail.

`node scripts/measure-performance.mjs URL LABEL` writes five cold-cache mobile Lighthouse runs into ignored `artifacts/performance/`. It uses applied DevTools network/CPU throttling rather than simulated Lantern estimates. Record which method was used; lab TBT is not field INP.
