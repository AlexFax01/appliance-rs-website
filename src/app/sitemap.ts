import type { MetadataRoute } from "next";
import { appliances, contentUpdatedAt, siteUrl } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${contentUpdatedAt}T00:00:00.000Z`);
  const services = appliances.map((service) => ({
    url: `${siteUrl}/${service.slug}/`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    ...services,
    { url: `${siteUrl}/service-areas/`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/privacy/`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
