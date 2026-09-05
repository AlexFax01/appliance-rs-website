import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://appliancesc.com";
  const lastModified = new Date("2026-09-05T00:00:00.000Z");
  return [
    { url: base, lastModified, priority: 1 },
    { url: `${base}/privacy`, lastModified, priority: 0.3 },
  ];
}
