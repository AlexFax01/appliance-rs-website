import problemCatalog from "./problems.json";

export { problemCatalog };

export const siteUrl = "https://appliancesc.com";
export const contentUpdatedAt = "2026-09-10";

export const pricing = {
  fee: "$85",
  summary: "The service call is a flat $85, and diagnostics are waived when you approve the repair.",
  steps: [
    "A flat $85 service call covers the visit and diagnosis.",
    "Diagnostics are waived when you approve the repair.",
    "You receive clear pricing before work begins and pay after the work is completed.",
  ],
};

export const business = {
  name: "Appliance RS",
  legalName: "Appliance RS LLC",
  tagline: "Local. Trusted. Reliable.",
  callPhone: { display: "864-924-4349", e164: "+18649244349" },
  // The owner uses this personal number only for service requests prepared by the website form.
  smsRecipient: { e164: "+18644976563" },
  email: "appliancersl@gmail.com",
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:30", closes: "18:00" },
    { days: ["Saturday"], opens: "08:00", closes: "17:00" },
  ],
  googleProfile:
    "https://www.google.com/search?hl=en&kgmid=%2Fg%2F11z7t4g7sf&q=Appliance%20RS%20LLC",
  mapEmbed: "https://maps.google.com/maps?cid=12206806783937162522&output=embed&hl=en",
};

export const appliances = [
  {
    value: "refrigerator-freezer",
    slug: "refrigerator-freezer-repair",
    title: "Refrigerator / Freezer",
    pageTitle: "Refrigerator & Freezer Repair in Upstate South Carolina",
    metaDescription: "Local refrigerator and freezer repair across Greenville, Spartanburg, Greer, Simpsonville, and nearby Upstate South Carolina communities.",
    intro: "A refrigerator that runs warm, leaks, freezes food, or makes new noises can quickly disrupt a household. Appliance RS diagnoses residential refrigerator and freezer problems in homes across Upstate South Carolina.",
    checks: ["Temperature controls, sensors, and airflow", "Fans, compressor operation, and start components", "Door seals, drains, water lines, and ice buildup", "Cooling performance after the repair"],
    image: "/images/services/refrigerator-freezer.avif",
    alt: "Stainless steel refrigerator and freezer in a bright kitchen",
    problems: ["Not cooling or freezing", "Ice buildup or leaking water", "Noisy compressor or fan", "Door seal or temperature-control issues"],
  },
  {
    value: "ice-maker",
    slug: "ice-maker-repair",
    title: "Ice Maker",
    pageTitle: "Ice Maker Repair in Upstate South Carolina",
    metaDescription: "In-home ice maker diagnosis and repair for no-ice, leaking, frozen-line, inlet-valve, and dispenser problems in Upstate South Carolina.",
    intro: "When an ice maker stops producing ice or begins leaking, the cause may involve the water supply, inlet valve, temperature, controls, or the ice-making assembly. Appliance RS checks the complete system before recommending a repair.",
    checks: ["Water supply, filter, and inlet valve", "Freezer temperature and fill cycle", "Ice-making assembly and sensors", "Leaks and normal production after service"],
    image: "/images/services/ice-maker.avif",
    alt: "Residential under-counter ice maker",
    problems: ["Not making ice", "Small or misshapen ice cubes", "Water leaks or a frozen supply line", "Dispenser or inlet-valve issues"],
  },
  {
    value: "washer-dryer",
    slug: "washer-dryer-repair",
    title: "Washer / Dryer",
    pageTitle: "Washer & Dryer Repair in Upstate South Carolina",
    metaDescription: "Washer and dryer repair for draining, spinning, heating, belt, drum, pump, leak, vibration, and noise problems across Upstate South Carolina.",
    intro: "Laundry problems rarely wait for a convenient time. Appliance RS diagnoses washers that will not drain or spin and dryers that will not heat, tumble, or finish a cycle normally.",
    checks: ["Drain, pump, spin, and water-flow operation", "Dryer airflow, heat, and safety components", "Belts, drums, bearings, and drive systems", "Leaks, vibration, and a complete test cycle"],
    image: "/images/services/washer-dryer.avif",
    alt: "Front-loading washer and dryer",
    problems: ["Washer not draining or spinning", "Dryer not heating or taking too long", "Belt, drum, pump, or bearing replacement", "Leaks, vibration, or unusual noise"],
  },
  {
    value: "dishwasher-disposal",
    slug: "dishwasher-disposal-repair",
    title: "Dishwasher / Disposal",
    pageTitle: "Dishwasher & Disposal Repair in Upstate South Carolina",
    metaDescription: "Local dishwasher and garbage disposal repair for cleaning, draining, leaking, pump, spray-arm, jam, and motor issues in Upstate South Carolina.",
    intro: "Standing water, leaks, poor cleaning, and a jammed disposal can stop a kitchen routine. Appliance RS checks the appliance, connections, and operating cycle so the proposed repair addresses the actual fault.",
    checks: ["Drain path, pump, filter, and spray arms", "Door seal, inlet, and visible leak points", "Electrical controls and complete wash cycle", "Disposal jam, switch, leak, and motor operation"],
    image: "/images/services/dishwasher-disposal.avif",
    alt: "Open stainless steel dishwasher",
    problems: ["Dishes stay dirty or wet", "Dishwasher not draining or leaking", "Pump, spray-arm, or seal problems", "Disposal jam, leak, or motor failure"],
  },
  {
    value: "oven-cooktop",
    slug: "oven-cooktop-repair",
    title: "Oven / Cooktop",
    pageTitle: "Oven & Cooktop Repair in Upstate South Carolina",
    metaDescription: "Oven and cooktop repair for heating, burner, element, igniter, thermostat, sensor, and temperature-control issues across Upstate South Carolina.",
    intro: "Uneven heat, a burner that will not ignite, or an oven that misses its set temperature can affect both safety and everyday cooking. Appliance RS diagnoses residential ovens and cooktops before any work begins.",
    checks: ["Heating elements, burners, and igniters", "Temperature sensors and controls", "Visible wiring and safe electrical operation", "Heating performance after service"],
    image: "/images/services/oven-cooktop.avif",
    alt: "Stainless steel range and oven",
    problems: ["Oven not heating evenly", "Burner or element not working", "Igniter, thermostat, or sensor replacement", "Temperature-control or electrical issues"],
  },
  {
    value: "microwave",
    slug: "microwave-repair",
    title: "Microwave",
    pageTitle: "Microwave Repair in Upstate South Carolina",
    metaDescription: "Built-in microwave diagnosis and repair for heating, turntable, fan, door-switch, control-panel, noise, spark, and shutdown problems.",
    intro: "A built-in microwave that stops heating, sparks, shuts down, or develops a door problem needs careful diagnosis. Appliance RS evaluates the symptoms and explains whether a practical repair is available.",
    checks: ["Door switches and control response", "Turntable, light, and ventilation fan", "Heating operation and abnormal sounds", "Safe operation after the repair"],
    image: "/images/services/microwave.avif",
    alt: "Built-in stainless steel microwave",
    problems: ["Not heating", "Turntable, light, or fan not working", "Door switch or control-panel issues", "Unusual noise, sparks, or shutdowns"],
  },
] as const;

export type Appliance = (typeof appliances)[number];
export const serviceBySlug = Object.fromEntries(appliances.map((service) => [service.slug, service])) as Record<Appliance["slug"], Appliance>;

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
