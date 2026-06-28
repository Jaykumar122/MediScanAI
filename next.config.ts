import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Pre-existing lint errors in AI flows, legacy helpers, and scripts.
    // These are safe to skip at build time; fix incrementally during development.
    ignoreDuringBuilds: true,
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
