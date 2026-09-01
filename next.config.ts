import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is enabled by default in Next.js 16.
  // Three.js isolation is handled via dynamic({ ssr: false }) imports in page.tsx.
  turbopack: {},
};

export default nextConfig;
