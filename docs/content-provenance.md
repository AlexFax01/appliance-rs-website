# Content provenance — verified 2026-09-05

## Business identity and pricing

Source: https://appliancesc.com/ (phone 864-924-4349). Google knowledge ID `/g/11z7t4g7sf`; Maps CID `12206806783937162522`. The similarly named Colorado company is not this business. The classic embedded Google map was visually checked for the Upstate SC service area and Appliance RS LLC profile and uses native lazy loading. The separate service-area list and ZIP checker communicate the confirmed towns. The map is for showing where the technician works, not routing customers to a business location.

The source offers a flat $85 service call, waived diagnostics with approved repair, a quote before work, and payment after work. No guarantee period or final repair estimate has been invented. Shared wording lives in `src/content/site.ts`.

## Interactive map positions

`src/content/map-towns.ts` uses internal reference points from the [2025 Census South Carolina Gazetteer](https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_place_45.txt), checked September 7, 2026. Moore, which has no Census place entry, uses its GeoNames 29369 postal reference point (34.8646, -82.0215), CC BY 4.0. These are town reference locations, not technician positions, store addresses or surveyed service boundaries. No live geocoding requests are made. All 19 towns match the existing published list. Standard embed remains the fallback until API configuration is provided.

## ZIP lookup

GeoNames US postal dataset: https://download.geonames.org/export/zip/US.zip — retrieved 2026-09-05, CC BY 4.0, https://www.geonames.org/export/. Exact South Carolina postal-place matches for the 19 existing site towns were retained, including PO-box ZIPs. These are postal matches, not service boundaries. Unknown ZIPs remain eligible to request service; all addresses require scheduling confirmation.

## Service-area ordering

The published service places are ordered by 2020 Census population using the U.S. Census Bureau TIGERweb South Carolina incorporated-place and census-designated-place tables (POP100), checked 2026-09-07:

- https://tigerweb.geo.census.gov/tigerwebmain/Files/acs26/tigerweb_acs26_incplace_2020_tab20_sc.html
- https://tigerweb.geo.census.gov/tigerwebmain/Files/acs26/tigerweb_acs26_cdp_2020_tab20_sc.html

Greenville, Spartanburg, Greer, and Simpsonville are visually identified as the principal regional centers. Moore is an unincorporated community without a directly comparable Census-place population, so it follows the ranked places without a fabricated count.

## Google excerpts

Original English review bodies and five-star graphics were checked on the exact business profile. Each curated record in `src/content/service-reviews.ts` links to its author's Google Maps review page. The UI identifies these as selected excerpts, not a live feed or complete review count.

- Refrigerator: trishicart Icart, Ed Flower, Corinne Geller.
- Washer/dryer: ulrica Casey, Chad Porell, Corinne Geller.
- Ice maker: Amy Garcia, Larry & Kathy Stringer.
- Dishwasher: Roberta Nichols, jackie strawbridge.
- Oven/cooktop and microwave: no verified matching selection; generic Google link only.

Corinne's full review discusses refrigerator and washer repairs, despite appearing under Google's dishwasher tag. It is therefore excluded from dishwasher reviews. Amy's dryer-vent cleaning is not treated as dryer repair. Steven Schirmer's mention of cleaning around a stove is not enough evidence of a specific oven repair. Category choices follow the full text, not search tags.
