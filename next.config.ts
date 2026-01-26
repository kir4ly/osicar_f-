import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avtfailpzsnelebpvebz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Optimize package imports for smaller bundles
  experimental: {
    optimizePackageImports: ["lucide-react", "radix-ui"],
  },

  // Compression
  compress: true,

  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Strict mode for better development
  reactStrictMode: true,

  // Reduce bundle size by removing console in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
