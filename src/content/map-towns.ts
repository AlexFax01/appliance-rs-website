import { serviceAreas } from "./site";
import { zipTowns } from "./coverage";

// Census Gazetteer internal points, not coverage boundaries or street addresses.
// Moore has no Census place: use its GeoNames postal reference point instead.
export const mapCoordinateSources = {
  census: "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_place_45.txt",
  moore: "https://download.geonames.org/export/zip/US.zip",
  checkedAt: "2026-09-07",
};
const coordinates: Record<(typeof serviceAreas)[number]["name"], [number, number]> = {
  Greenville: [34.836902, -82.362997], Spartanburg: [34.945627, -81.925944],
  Greer: [34.931799, -82.229115], Simpsonville: [34.728538, -82.256377],
  Taylors: [34.914312, -82.313906], "Boiling Springs": [35.04501, -81.977929],
  "Travelers Rest": [34.960031, -82.445009], Lyman: [34.968001, -82.136688],
  Duncan: [34.930707, -82.143754], Wellford: [34.950776, -82.107529],
  Arcadia: [34.961075, -81.993118], Inman: [35.046134, -82.089808],
  Landrum: [35.175225, -82.182604], Roebuck: [34.878987, -81.964442],
  Reidville: [34.865805, -82.11064], Drayton: [34.976469, -81.902312],
  Chesnee: [35.146269, -81.863031], Campobello: [35.125765, -82.14933],
  Moore: [34.8646, -82.0215],
};
export const mapTowns = serviceAreas.map(town => ({
  ...town,
  position: { lat: coordinates[town.name][0], lng: coordinates[town.name][1] },
  zips: Object.entries(zipTowns).filter(([, name]) => name === town.name).map(([zip]) => zip),
}));
export type MapTown = (typeof mapTowns)[number];

// A single, deliberately approximate visual envelope around the published towns.
// It is not presented as an exact boundary: the ZIP checker and scheduling remain authoritative.
export const serviceAreaOutline = [
  coordinates["Travelers Rest"],
  coordinates.Landrum,
  coordinates.Campobello,
  coordinates.Chesnee,
  coordinates.Drayton,
  coordinates.Spartanburg,
  coordinates.Roebuck,
  coordinates.Moore,
  coordinates.Reidville,
  coordinates.Simpsonville,
  coordinates.Greenville,
].map(([lat, lng]) => ({ lat, lng }));
