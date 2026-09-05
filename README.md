# Appliance RS Website

Standalone redesign demo for Appliance RS. The project is intentionally separate from the source archive and can ship in two ways:

- **Vercel:** Next.js frontend plus `api/contact.ts` serverless email delivery.
- **Client PHP hosting:** static site in `out/` plus `out/api/contact.php` and PHPMailer.

No database, Supabase, CRM, or automation service is required.

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
5. Set `NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact.php` before building the final package.
6. Submit a controlled test request and verify receipt at the configured destination.

## Content and assets

- Approved direction: `design/reference/approved-homepage.png`
- Generated hero: `public/images/hero/appliance-rs-hero.png`
- Service photos: `public/images/services/`
- Business content, service areas, reviews, and contact details: `src/content/site.ts`
- Visual acceptance notes: `design-qa.md`

Google reviews are curated static excerpts with a verification date. They are not scraped at runtime, and the site does not publish review schema.
