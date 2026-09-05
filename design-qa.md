# Appliance RS Design QA

## Target

- Approved reference: `design/reference/approved-homepage.png`
- Implemented route: `/`
- Visual direction: same one-page section order and blue/orange service-business language, with deeper shadows, dimensional buttons, and restrained interaction motion.

## Comparison

- Side-by-side hero comparison: `design/qa/hero-comparison-v3.png`
- Desktop/tablet viewport: `design/qa/home-viewport-v3.png`
- Mobile viewport: `design/qa/home-mobile-v2.png`
- Hero uses a purpose-built photorealistic asset rather than a placeholder.
- The original round Appliance RS logo is retained as requested.

## Browser verification

- Sticky header, active section behavior, responsive navigation, and mobile contact bar render correctly.
- Call/Text chooser opens as an accessible dialog and closes with Escape.
- Appliance cards scroll to the callback form and preselect the matching appliance.
- Full service-area toggle exposes all 19 named areas.
- FAQ accordion opens and reveals its answer.
- Callback form accepts a valid local QA payload and reports honest preview-only delivery status when SMTP is not configured.
- Console inspection returned no warnings or errors at desktop/tablet and mobile breakpoints.
- DOM geometry showed sequential, non-overlapping page sections.

## Build verification

- ESLint: passed.
- TypeScript: passed.
- Vitest: 3/3 passed.
- Next.js production build: passed.
- Static client-host build: passed and includes `api/contact.php`.
- PHP CLI was not installed on this workstation, so the PHP syntax check remains a host/deployment gate.

final result: passed
