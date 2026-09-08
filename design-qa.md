# Service map design QA

## Visual truth and implementation evidence

- Source visual: `/var/folders/hk/gy7qblzn7gs144f82q69kv1h0000gn/T/TemporaryItems/NSIRD_screencaptureui_GxxZeA/Знімок екрана 2026-09-08 о 12.03.06 дп.png`
- Source pixels: 1442 × 1144.
- Live full-view screenshot: `/Volumes/Coding /Repos/appliance-rs-website/artifacts/qa/service-area-full-live.png`
- Live focused screenshot: `/Volumes/Coding /Repos/appliance-rs-website/artifacts/qa/service-map-live.png`
- Capture viewport: 1442 × 1144 at DPR 1 for the full view; 1488 × 1160 at DPR 1 for the focused map capture.
- Tested state: production page, Google map loaded, `Show all` applied, no town selected for the comparison capture.

## Comparison history

### Pass 1 — approved transformation

The source used anonymous blue and orange dots on a standard Google basemap. The approved transformation is intentionally not pixel-identical: it replaces those dots with Appliance RS logo pins, adds a restrained coverage hull, keeps labels only for the four principal cities, introduces a compact instruction card, and adds explicit `Show all` and `Expand map` controls.

### Pass 2 — live production verification

- Full view: the map remains inside the approved two-column service-area section, with the ZIP check visually primary and the map secondary.
- Focused view: the branded pins, four persistent city labels, coverage outline, legend, instructions, and controls are legible without obscuring the Google basemap.
- Selection: Greenville, Greer, and Spartanburg were checked; the map pans and reveals the local ZIP card with `Request repair` and `Call` actions.
- Mobile: 390 × 844 viewport, expanded map open and closed, town changed while expanded, no horizontal overflow.
- Accessibility: marker controls expose town-specific accessible names; Escape closes the expanded map and focus returns to the expand control.
- ZIP qualification: `29301` resolves to Spartanburg and preserves the service-area message.
- Console: no current production errors. One historical Google Maps warning from the previous deployment remained in the browser log; the shipped implementation uses the recommended `gmp-click` event.

## Severity findings

- P0: none.
- P1: none.
- P2: none.
- P3: none required for this release.

## Footer refinement QA

- Reference: client screenshot from September 8, 2026.
- Checked at a 2048 px desktop viewport and the default mobile browser viewport.
- The maker mark reads `Website crafted by ProgressorAI` on one line.
- Its text is 8.32 px, its logo is 13 px wide, and its desktop centerline matches the service links and copyright line.
- The mobile footer has no horizontal overflow.
- No unrelated interface section was changed.

## Final result

passed
