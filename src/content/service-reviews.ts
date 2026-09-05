// Curated from the exact Google profile /g/11z7t4g7sf, verified September 5, 2026.
// Excerpts preserve the customer's wording; categories follow the text, not Google's topic tags.
export const reviewsVerifiedAt = "September 5, 2026";
export const serviceReviews = [
  { id: "trishicart", name: "trishicart Icart", rating: 5, categories: ["refrigerator-freezer"], text: "Absolutely professional! Arrived on time and fixed the problem with the refrigerator.", source: "https://www.google.com/maps/contrib/106560051330990998524/reviews?hl=en" },
  { id: "ed-flower", name: "Ed Flower", rating: 5, categories: ["refrigerator-freezer"], text: "He was knowledgeable, clean, worked quickly and fixed my refrigerator. I would definitely call him again.", source: "https://www.google.com/maps/contrib/108536102598023081612/reviews?hl=en" },
  { id: "corinne-fridge", name: "Corinne Geller", rating: 5, categories: ["refrigerator-freezer"], text: "He fixed our refrigerator and it has run perfectly for the past 7 years!", source: "https://www.google.com/maps/contrib/111577580289407015897/reviews?hl=en" },
  { id: "ulrica", name: "ulrica Casey", rating: 5, categories: ["washer-dryer"], text: "The service on my washer was quick. He did a great job, came in did a diagnostic and fixed it with no problem.", source: "https://www.google.com/maps/contrib/112981841074727230489/reviews?hl=en" },
  { id: "chad", name: "Chad Porell", rating: 5, categories: ["washer-dryer"], text: "Serhii came through and fixed my dryer within under 20 minutes! Very knowledgeable and respectful handy man", source: "https://www.google.com/maps/contrib/102944518175600258686/reviews?hl=en" },
  { id: "corinne-washer", name: "Corinne Geller", rating: 5, categories: ["washer-dryer"], text: "This time he did an amazing job fixing our washing machine.", source: "https://www.google.com/maps/contrib/111577580289407015897/reviews?hl=en" },
  { id: "amy-ice", name: "Amy Garcia", rating: 5, categories: ["ice-maker"], text: "He fixed my ice maker and cleaned my dryer vent. Serhii was very professional and reasonably priced. I would highly recommend him!", source: "https://www.google.com/maps/contrib/109981883516273038880/reviews?hl=en" },
  { id: "stringer", name: "Larry & Kathy Stringer", rating: 5, categories: ["ice-maker"], text: "Serhii diagnosed and replaced our icemaker in just a few minutes. He is very knowledgeable and efficient.", source: "https://www.google.com/maps/contrib/111436807362168798268/reviews?hl=en" },
  { id: "roberta", name: "Roberta Nichols", rating: 5, categories: ["dishwasher-disposal"], text: "He did an excellent job and was finished in an hour. Everything was left clean and neat.", source: "https://www.google.com/maps/contrib/115184015930612211610/reviews?hl=en" },
  { id: "jackie", name: "jackie strawbridge", rating: 5, categories: ["dishwasher-disposal"], text: "He repaired my dishwasher for a whole lot less than it would have cost me to replace.", source: "https://www.google.com/maps/contrib/105693898791569153436/reviews?hl=en" },
];
export function reviewsFor(appliance: string) { return serviceReviews.filter(review => review.categories.includes(appliance)).slice(0, 4); }
