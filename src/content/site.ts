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

export const serviceAreas = [
  "Moore", "Greer", "Lyman", "Roebuck", "Duncan", "Arcadia", "Drayton",
  "Taylors", "Greenville", "Inman", "Reidville", "Wellford", "Chesnee",
  "Campobello", "Landrum", "Simpsonville", "Spartanburg", "Travelers Rest",
  "Boiling Springs",
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
