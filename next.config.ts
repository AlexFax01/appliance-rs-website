import type { NextConfig } from "next";

const isClientHost = process.env.DEPLOY_TARGET === "client-php";

const nextConfig: NextConfig = {
  output: isClientHost ? "export" : undefined,
  trailingSlash: isClientHost,
  images: { unoptimized: isClientHost },
};

export default nextConfig;
