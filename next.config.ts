import type { NextConfig } from "next";

const isClientHost = process.env.DEPLOY_TARGET === "client-php";

const nextConfig: NextConfig = {
  // Small landing-page stylesheet: avoid an extra render-blocking round trip.
  experimental: { inlineCss: true },
  // Playwright uses the loopback IP while Next's dev server advertises localhost.
  // Keep local hydration available for controlled browser QA only.
  allowedDevOrigins: ["127.0.0.1"],
  output: isClientHost ? "export" : undefined,
  trailingSlash: true,
  images: { unoptimized: isClientHost },
};

export default nextConfig;
