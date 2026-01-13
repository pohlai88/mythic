/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,

  // Environment variables
  env: {
    REGISTRY_ADMIN_PORT: process.env.REGISTRY_ADMIN_PORT || "4000",
  },

  // Experimental features
  experimental: {
    optimizePackageImports: [
      "@tanstack/react-query",
      "@mythic/tailwindcss-v4-design-system",
      "@mythic/nextjs-shared-utils",
    ],
  },
}

export default nextConfig
