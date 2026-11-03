import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Vercel-da TypeScript xatolariga qaramay saytni yig'ishga ruxsat beradi
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint ogohlantirishlarini e'tiborsiz qoldiradi
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;