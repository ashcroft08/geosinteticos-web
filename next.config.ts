import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Formatos que Next/Image usará al servir imágenes optimizadas */
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
