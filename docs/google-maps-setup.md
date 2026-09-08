# Interactive service-town map

The classic Google embed remains the fallback until both build variables are set:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=
```

Use a client-owned Google Cloud project with billing and Maps JavaScript API enabled. Create a dedicated browser API key restricted to Maps JavaScript API and HTTP referrers for the actual website (currently `https://appliance-rs-website.vercel.app/*`). Add client domains only when moving hosting. Use a separate restricted development key for `http://localhost:3100/*` and `http://127.0.0.1:3100/*`. Browser keys are public by design; referrer and API restrictions are essential. Never use an unrestricted server key.

Create a JavaScript Map ID. Optionally attach a light cloud map style: pale blue water, muted parks, uncluttered roads, business POIs hidden, locality labels retained. Do not use a demonstration Map ID in production. The site's HTML markers provide orange regional centers, blue towns, hover/focus labels and selection halos regardless of the optional base-map style.

Set both variables on Vercel and rebuild. For PHP hosting set them before `npm run build:client-host`; the static output contains the public browser configuration. No database or server-side Maps service is required.

## Loading and billing

Only import the Google runtime as the map approaches the viewport (200px). Create one map per component mount. Selecting towns, checking ZIP, resetting the viewport and resizing reuse it. Do not request Places, geocoding, routing, 3D, or Street View. All 19 coordinates and ZIP associations are stored locally.

Dynamic Maps has 10,000 free monthly map loads per billing account/SKU under the current pay-as-you-go pricing. Page views, unique visitors and successful map loads are different metrics. A reload can cause a new chargeable map load. Other projects on the billing account can consume the same free allowance.

Budget alerts are notifications, not a hard spending cap. Check the project's available Maps quotas and other usage before setting any limits. Do not promise a monthly $0 cap based on a per-minute quota or a browser-side counter. A billing-account-wide cap requires a separately designed control; it is not implemented here. On API, authentication, quota or loading failure the classic embed and the ZIP checker remain available.

## Verification

- Verify real map tiles and keyboard/touch marker selection with the restricted key on the actual domain.
- Confirm all 19 towns fit, without fabricated service-boundary circles or route buttons.
- Test a listed ZIP, an unknown ZIP, and ZIP+4; selecting a city must not recreate the map.
- Confirm Request repair transfers a valid ZIP and focuses the contact form without losing its other fields.
- Test slow/blocked API and authentication failure; confirm the classic embed fallback.
- On mobile, cooperative gestures let the page scroll with one finger; use two fingers to pan the map.
- The test provider in `tests/fixtures/maps-provider.js` exercises our integration without spending quota; it is not proof of live Google rendering.

Sources: [Google billing](https://developers.google.com/maps/billing-and-pricing/pricing), [cost controls](https://developers.google.com/maps/billing-and-pricing/manage-costs), [advanced markers](https://developers.google.com/maps/documentation/javascript/advanced-markers/start).
