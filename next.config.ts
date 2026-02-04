import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev access from local network (mobile testing)
  allowedDevOrigins: ["192.168.1.154"],

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avtfailpzsnelebpvebz.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
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
