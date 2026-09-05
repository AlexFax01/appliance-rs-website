export const business = {
  name: "Appliance RS",
  tagline: "Local. Trusted. Reliable.",
  phoneDisplay: "864-924-4349",
  phoneHref: "+18649244349",
  email: "appliansersl@gmail.com",
  googleProfile:
    "https://www.google.com/search?hl=en&kgmid=%2Fg%2F11z7t4g7sf&q=Appliance%20RS%20LLC",
  mapEmbed: "https://www.google.com/maps?q=Appliance%20RS%20LLC&output=embed",
};

export const appliances = [
  { value: "refrigerator-freezer", title: "Refrigerator / Freezer", image: "/images/services/refrigerator-freezer.avif", alt: "Stainless steel refrigerator and freezer in a bright kitchen" },
  { value: "ice-maker", title: "Ice Maker", image: "/images/services/ice-maker.avif", alt: "Residential under-counter ice maker" },
  { value: "washer-dryer", title: "Washer / Dryer", image: "/images/services/washer-dryer.avif", alt: "Front-loading washer and dryer" },
  { value: "dishwasher-disposal", title: "Dishwasher / Disposal", image: "/images/services/dishwasher-disposal.avif", alt: "Open stainless steel dishwasher" },
  { value: "oven-cooktop", title: "Oven / Cooktop", image: "/images/services/oven-cooktop.avif", alt: "Stainless steel range and oven" },
  { value: "microwave", title: "Microwave", image: "/images/services/microwave.avif", alt: "Built-in stainless steel microwave" },
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
  { question: "How much is the service call?", answer: "$85 flat service call. The diagnostic fee is waived when you approve the repair." },
  { question: "What brands do you repair?", answer: "We service most major residential appliance brands. Tell us the brand and model in your request so we can confirm before the visit." },
  { question: "Do you waive the diagnostic fee?", answer: "Yes. When you approve the repair, the diagnostic service-call fee is applied toward the work." },
  { question: "Do you offer warranties on repairs?", answer: "Repairs are warranty-backed. The exact coverage for parts and labor is confirmed with your quote before work begins." },
] as const;
