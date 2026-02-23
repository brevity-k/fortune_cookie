import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disabled: Pixi.js/Matter.js/GSAP cause issues with strict mode double-renders
  poweredByHeader: false,
  trailingSlash: false,
};

export default nextConfig;
