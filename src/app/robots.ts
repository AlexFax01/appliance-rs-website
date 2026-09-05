import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_SITE_STAGE === "production";
  return {
    rules: isProduction ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: isProduction ? `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://appliancesc.com"}/sitemap.xml` : undefined,
  };
}
