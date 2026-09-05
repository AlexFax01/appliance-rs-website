# Appliance RS Website

Standalone redesign demo for Appliance RS. The project is intentionally separate from the source archive and can ship in two ways:

- **Vercel:** Next.js frontend plus `api/contact.ts` serverless email delivery.
- **Client PHP hosting:** static site in `out/` plus `out/api/contact.php` and PHPMailer.

No database, Supabase, CRM, or automation service is required.

Current noindex client demo: <https://appliance-rs-website.vercel.app>

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The preview defaults to `noindex`. The callback form validates locally; actual delivery requires the SMTP variables below.

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
4. Configure SMTP and submit one controlled test request before sharing the form as live.

## PHP-host deployment

1. Run `npm run build:client-host`.
2. Upload the contents of `out/` to the client web root.
3. In `out/api/`, run `composer install --no-dev --optimize-autoloader` on the server or upload the generated `vendor/` folder.
4. Configure the SMTP and contact environment variables on the host.
5. `build:client-host` sets `/api/contact.php` automatically. Use PHP 8.1+ with GD (JPEG/PNG/WebP), fileinfo, mbstring and OpenSSL. Apply `out/api/.user.ini` or its equivalent in the host dashboard: `post_max_size=4M`, `upload_max_filesize=1M`, `max_file_uploads=4`, `memory_limit=128M`. The fourth upload is deliberately allowed through PHP so the application can explicitly reject more than three. Keep production error display disabled.
6. Submit a controlled test request and verify receipt at the configured destination.

## Content and assets

- Approved direction: `design/reference/approved-homepage.png`
- Generated hero: `public/images/hero/appliance-rs-hero.png`
- Service photos: `public/images/services/`
- Business content, service areas, reviews, and contact details: `src/content/site.ts`
- Visual acceptance notes: `design-qa.md`

Google reviews are curated static excerpts with a verification date. They are not scraped at runtime, and the site does not publish review schema.

## Seven improvements (September 2026)

- Existing appliance icons open native dialogs with multiple problem choices and category-specific Google excerpts; selections transfer to the callback form without replacing free-text notes.
- ZIP matching is advisory, not an availability promise. `src/content/coverage.ts` includes the source/license/date for all 19 towns. Google Maps loads only after a click, using the verified company CID.
- The form prepares up to three JPEG/PNG/WebP photos, at most 1,000,000 bytes each. HEIC is decoded only when the browser supports it; unsupported files show a JPEG export suggestion. Browser resizing strips image metadata. The server decodes and re-encodes every attachment and checks declared MIME against content.
- Both mail handlers accept legacy JSON and multipart requests with a JSON `payload` field and `photos`/`photos[]` file parts. Browser submissions use `photos[]` for PHP compatibility. Total request limit: 4,000,000 bytes. PHP/server upload restrictions must be configured as above.
- Optional brand/model and selected problem IDs appear in the private email. No database or public upload directory is used. SMTP acceptance is not proof of inbox receipt: final readiness requires a controlled received email with attachments on each intended host.
- Bounded desktop-only parallax, one-shot icon/button feedback, and a shared $85 explanation preserve the approved page structure. Reduced-motion preferences disable decorative movement.
- Hero assets are prebuilt AVIF/WebP (`node scripts/prepare-hero.mjs`). The same fonts are locally subset to Latin/punctuation, licensed in `src/app/fonts/`; unsupported name glyphs use system fallback. Optional font display avoids late swaps. Inline CSS is enabled for this small landing page; modal code, validation, and photo processing load on demand.

## Extended checks

Run a production server on port 3100, then `npm run test:e2e` (isolated Chrome). Set `TEST_BASE_URL=http://127.0.0.1:3101` to run against a served PHP export. Browser tests mock email responses and do not send customer mail.

`PHP_TEST_RUNTIME=/path/to/frankenphp node scripts/test-php.mjs` runs isolated PHP transport/validation checks with a test-only mail class, never included in `out/`. `npm run test:php` remains available on hosts with a normal PHP CLI.

`node scripts/measure-performance.mjs URL LABEL` writes five cold-cache mobile Lighthouse runs into ignored `artifacts/performance/`. It uses applied DevTools network/CPU throttling rather than simulated Lantern estimates. Record which method was used; lab TBT is not field INP.
