# Appliance RS Design QA

## Seven-improvement release — September 5, 2026

- Preserved the page order, blue identity, original six outline icons, real appliance photos, and modal interaction.
- 19 unit/server tests passed: legacy JSON, selected-only requests, cross-category/duplicate IDs, unknown ZIP acceptance, 0/1/3 photos, fourth-file rejection, corrupt/spoofed MIME, oversize bodies/files, and missing/failed mocked SMTP.
- 10 PHP checks passed using an isolated FrankenPHP 8.5.10 runtime (GD/fileinfo/mbstring enabled) and a test-only mail transport. No customer mail was sent. The temporary fixture is separate from the release package.
- 10 Playwright scenarios passed on each build target (desktop and mobile): all six modals, problem/ZIP handoff, both review tabs, focus cycling in both directions and return, reduced motion, selected-only submissions, 3-photo cap, HEIC fallback, remove, failed-mail retention, retry, and readable model-label compression. Axe checks passed for pricing and service modals.
- Model-label test: 3200×2400 PNG → 2400×1800 JPEG, below 1 MB; model and serial text visually verified readable. This cannot guarantee readability of an originally blurred photo.
- Verified exact Google Maps company and South Carolina service area visually. No iframe is requested until the map button is clicked.
- Screenshots are in ignored `test-results/` and `artifacts/`; reproducible browser tests are in `tests/e2e/`.
- Production Next and static PHP builds, lint and TypeScript passed. `out/` includes both required PHP data/config files and the correct `/api/contact.php` endpoint.
- Five cold-cache, applied mobile-throttling Lighthouse runs on the local Next production build: median LCP **804 ms**, CLS **0**, TBT **11 ms**. Separate default Lantern simulation gave **2914 ms** LCP, CLS **0**; its ≤2500 ms target was not met. Do not conflate these methods or promise every visitor a fixed load time. Field INP remains unknown without real-user data.
- Release/inbox gate: Vercel production has no SMTP environment variables configured. A real received email with photographs is still required after mail setup on either final host. Successful mocked tests do not establish inbox delivery.

The sections below record the earlier baseline and are retained as history.

## Target

- Approved reference: `design/reference/approved-homepage.png`
- Implemented route: `/`
- Visual direction: same one-page section order and blue/orange service-business language, with deeper shadows, dimensional buttons, and restrained interaction motion.

## Comparison

- Side-by-side hero comparison: `design/qa/hero-comparison-v3.png`
- Side-by-side appliance-section comparison: `design/qa/services-comparison-v1.png`
- Side-by-side appliance-modal comparison: `design/qa/services-modal-comparison-v1.png`
- Icon-only appliance state: `design/qa/services-collapsed-v1.png`
- Desktop washer/dryer modal: `design/qa/services-modal-desktop-v1.png`
- Mobile washer/dryer modal: `design/qa/services-modal-mobile-v1.png`
- Desktop/tablet viewport: `design/qa/home-viewport-v3.png`
- Mobile viewport: `design/qa/home-mobile-v2.png`
- Hero uses a purpose-built photorealistic asset rather than a placeholder.
- The original round Appliance RS logo is retained as requested.

## Browser verification

- Sticky header, active section behavior, responsive navigation, and mobile contact bar render correctly.
- Call/Text chooser opens as an accessible dialog and closes with Escape.
- Appliance cards preserve the approved six-category icon row while keeping all service photos hidden until selection.
- Clicking a category opens an animated, in-viewport detail modal with the matching real photo, four typical problems, and an appliance-specific request button; no scroll below the icon row is required.
- The modal is centered at desktop widths and becomes a near-full-height bottom sheet on mobile.
- Escape, the close button, and the dimmed backdrop close the modal; keyboard focus returns to the selected appliance card.
- The detail CTA closes the modal, scrolls to the callback form, and preselects the matching appliance.
- The appliance interaction was verified at desktop and mobile widths with no horizontal overflow or browser-console errors.
- Full service-area toggle exposes all 19 named areas.
- FAQ accordion opens and reveals its answer.
- Callback form accepts a valid local QA payload and reports honest preview-only delivery status when SMTP is not configured.
- A fresh-browser console inspection returned no warnings or errors after opening the washer/dryer detail panel.
- DOM geometry showed sequential, non-overlapping page sections.

## Build verification

- ESLint: passed.
- TypeScript: passed.
- Vitest: 3/3 passed.
- Next.js production build: passed.
- Static client-host build: passed and includes `api/contact.php`.
- Vercel page returned HTTP 200 with `X-Robots-Tag: noindex, nofollow, noarchive`.
- Vercel contact endpoint returned 405 for GET and the expected 502 `delivery_not_configured` response for a valid controlled POST before SMTP credentials are supplied.
- PHP CLI was not installed on this workstation, so the PHP syntax check remains a host/deployment gate.

final result: passed
