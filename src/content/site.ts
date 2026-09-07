import problemCatalog from "./problems.json";
export { problemCatalog };
export const pricing = {
  fee: "$85",
  summary: "The service call is a flat $85, and diagnostics are waived when you approve the repair.",
  steps: ["A flat $85 service call covers the visit and diagnosis.", "Diagnostics are waived when you approve the repair.", "You receive clear pricing before work begins and pay after the work is completed."],
};
export const business = {
  name: "Appliance RS",
  tagline: "Local. Trusted. Reliable.",
  phoneDisplay: "864-924-4349",
  phoneHref: "+18649244349",
  email: "appliansersl@gmail.com",
  googleProfile:
    "https://www.google.com/search?hl=en&kgmid=%2Fg%2F11z7t4g7sf&q=Appliance%20RS%20LLC",
  mapEmbed: "https://maps.google.com/maps?cid=12206806783937162522&output=embed&hl=en",
};

export const appliances = [
  {
    value: "refrigerator-freezer",
    title: "Refrigerator / Freezer",
    image: "/images/services/refrigerator-freezer.avif",
    alt: "Stainless steel refrigerator and freezer in a bright kitchen",
    problems: ["Not cooling or freezing", "Ice buildup or leaking water", "Noisy compressor or fan", "Door seal or temperature-control issues"],
  },
  {
    value: "ice-maker",
    title: "Ice Maker",
    image: "/images/services/ice-maker.avif",
    alt: "Residential under-counter ice maker",
    problems: ["Not making ice", "Small or misshapen ice cubes", "Water leaks or a frozen supply line", "Dispenser or inlet-valve issues"],
  },
  {
    value: "washer-dryer",
    title: "Washer / Dryer",
    image: "/images/services/washer-dryer.avif",
    alt: "Front-loading washer and dryer",
    problems: ["Washer not draining or spinning", "Dryer not heating or taking too long", "Belt, drum, pump, or bearing replacement", "Leaks, vibration, or unusual noise"],
  },
  {
    value: "dishwasher-disposal",
    title: "Dishwasher / Disposal",
    image: "/images/services/dishwasher-disposal.avif",
    alt: "Open stainless steel dishwasher",
    problems: ["Dishes stay dirty or wet", "Dishwasher not draining or leaking", "Pump, spray-arm, or seal problems", "Disposal jam, leak, or motor failure"],
  },
  {
    value: "oven-cooktop",
    title: "Oven / Cooktop",
    image: "/images/services/oven-cooktop.avif",
    alt: "Stainless steel range and oven",
    problems: ["Oven not heating evenly", "Burner or element not working", "Igniter, thermostat, or sensor replacement", "Temperature-control or electrical issues"],
  },
  {
    value: "microwave",
    title: "Microwave",
    image: "/images/services/microwave.avif",
    alt: "Built-in stainless steel microwave",
    problems: ["Not heating", "Turntable, light, or fan not working", "Door switch or control-panel issues", "Unusual noise, sparks, or shutdowns"],
  },
] as const;

// 2020 Census place populations, largest first. Moore is an unincorporated
// community without a directly comparable Census-place count, so it follows
// the ranked places. The four regional centers receive stronger visual weight.
export const serviceAreas = [
  { name: "Greenville", population: 70_720, primary: true },
  { name: "Spartanburg", population: 38_732, primary: true },
  { name: "Greer", population: 35_308, primary: true },
  { name: "Simpsonville", population: 23_354, primary: true },
  { name: "Taylors", population: 23_222, primary: false },
  { name: "Boiling Springs", population: 10_405, primary: false },
  { name: "Travelers Rest", population: 7_788, primary: false },
  { name: "Lyman", population: 6_173, primary: false },
  { name: "Duncan", population: 4_041, primary: false },
  { name: "Wellford", population: 3_293, primary: false },
  { name: "Arcadia", population: 3_246, primary: false },
  { name: "Inman", population: 2_990, primary: false },
  { name: "Landrum", population: 2_481, primary: false },
  { name: "Roebuck", population: 2_357, primary: false },
  { name: "Reidville", population: 1_634, primary: false },
  { name: "Drayton", population: 1_115, primary: false },
  { name: "Chesnee", population: 829, primary: false },
  { name: "Campobello", population: 675, primary: false },
  { name: "Moore", population: null, primary: false },
] as const;

export const reviews = [
  {
    name: "Cindy Kennemore",
    date: "1 month ago",
    text: "This company showed up 30 minutes after I called and fixed my problem on a Sunday. Was very professional and knowledgeable. Will recommend this company to anyone in need of their services",
  },
  {
    name: "Amy Garcia",
    date: "2 months ago",
    text: "Serhii did a wonderful job. He came out 1hr after I placed the call. He fixed my ice maker and cleaned my dryer vent. Serhii was very professional and reasonably priced. I would highly recommend him!",
  },
  {
    name: "Steven Schirmer",
    date: "2 months ago",
    text: "Great Job! He even swept and cleaned around the stove which I’ve never seen by any repairman. Highly recommend them.",
  },
] as const;

export const faqs = [
  { question: "How much is the service call?", answer: pricing.summary },
  { question: "What brands do you repair?", answer: "We service most major residential appliance brands. Tell us the brand and model in your request so we can confirm before the visit." },
  { question: "Do you waive the diagnostic fee?", answer: pricing.steps[1] },
  { question: "Do you offer warranties on repairs?", answer: "Repairs are warranty-backed. The exact coverage for parts and labor is confirmed with your quote before work begins." },
] as const;
