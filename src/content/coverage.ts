// GeoNames US postal-code dataset (CC BY 4.0), filtered to SC and the
// 19 published service towns. Postal association is not an address guarantee.
export const coverageSource = {
  url: "https://download.geonames.org/export/zip/",
  dataset: "https://download.geonames.org/export/zip/US.zip",
  verifiedAt: "2026-09-05",
};
const groups: [string, string[]][] = [
  ["Greenville", ["29601","29602","29603","29604","29605","29606","29607","29608","29609","29610","29611","29612","29613","29614","29615","29616","29617"]],
  ["Greer", ["29650","29651","29652"]], ["Simpsonville", ["29680","29681"]],
  ["Taylors", ["29687"]], ["Travelers Rest", ["29690"]],
  ["Spartanburg", ["29301","29302","29303","29304","29305","29306","29307","29319"]],
  ["Boiling Springs", ["29316"]], ["Arcadia", ["29320"]], ["Campobello", ["29322"]],
  ["Chesnee", ["29323"]], ["Drayton", ["29333"]], ["Duncan", ["29334"]],
  ["Inman", ["29349"]], ["Landrum", ["29356"]], ["Lyman", ["29365"]],
  ["Moore", ["29369"]], ["Reidville", ["29375"]], ["Roebuck", ["29376"]], ["Wellford", ["29385"]],
];
export const zipTowns: Record<string, string> = Object.fromEntries(groups.flatMap(([town, zips]) => zips.map(zip => [zip, town])));
export function checkCoverage(zip: string) {
  const value = zip.trim();
  if (!/^\d{5}(?:-\d{4})?$/.test(value)) return { status: "invalid" as const, zip: value };
  const town = zipTowns[value.slice(0, 5)];
  return { status: town ? "listed" as const : "unconfirmed" as const, zip: value, town };
}
