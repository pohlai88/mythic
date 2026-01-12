/**
 * Next.js Configuration for BoardRoom App
 *
 * The Apex - Executive Board Decision Engine
 * Following NexusCanon v4.0.0 + Olympian v1.0.0 architecture
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,

  // Next.js 16 optimizations
  // Note: swcMinify is deprecated in Next.js 16 - SWC minification is enabled by default
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  experimental: {
    // ⭐ ELITE: Optimize workspace packages + external packages
    optimizePackageImports: [
      // Workspace packages
      '@mythic/design-system',
      '@mythic/shared-utils',
      '@mythic/shared-types',
      '@mythic/domain-core',
      '@mythic/performance',
      '@mythic/monitoring',
      // External packages
      '@tanstack/react-query',
      '@radix-ui/react-*',
      'lucide-react',
    ],
    // ⭐ ELITE: Server Actions optimization
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000', '*.vercel.app'],
    },
    // Next.js 16: Optimize server components
    optimizeCss: true,
    // Partial prerendering (when available)
    ppr: false,
  },

  // Security headers
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // TypeScript strict enforcement
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
