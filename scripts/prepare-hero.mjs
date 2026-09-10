import sharp from "sharp";
for (const width of [480, 800, 1200, 1600]) {
  const image = sharp("assets/source/appliance-rs-hero.png").resize({width, withoutEnlargement: true});
  await image.clone().avif({quality: 55}).toFile(`public/images/hero/hero-${width}.avif`);
  await image.clone().webp({quality: 80}).toFile(`public/images/hero/hero-${width}.webp`);
}
