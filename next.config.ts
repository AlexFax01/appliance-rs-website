import type { NextConfig } from "next";

const isClientHost = process.env.DEPLOY_TARGET === "client-php";

const nextConfig: NextConfig = {
  // Small landing-page stylesheet: avoid an extra render-blocking round trip.
  experimental: { inlineCss: true },
  output: isClientHost ? "export" : undefined,
  trailingSlash: isClientHost,
  images: { unoptimized: isClientHost },
};

export default nextConfig;
