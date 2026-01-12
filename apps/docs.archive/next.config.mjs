/**
 * Next.js Configuration
 *
 * Custom documentation app configuration
 * No longer using Nextra - using custom MDX handling
 */

import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  compress: true,

  // Production build optimizations
  productionBrowserSourceMaps: false,

  // ⭐ ELITE: Experimental features for build optimization
  experimental: {
    // Optimize package imports (workspace + external)
    optimizePackageImports: [
      // Workspace packages
      '@mythic/shared-utils',
      '@mythic/shared-types',
      '@mythic/design-system',
      // External packages
      'katex',
      '@tanstack/react-query',
      '@vercel/analytics',
      '@vercel/speed-insights',
    ],
    // ⭐ ELITE: Server Actions optimization
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000', '*.vercel.app'],
    },
    // ⭐ ELITE: Optimize server components
    optimizeServerReact: true,
  },

  // Turbopack configuration (root level, not in experimental)
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx',
      '@mythic/shared-utils': '../../packages/shared-utils/src',
      '@mythic/shared-types': '../../packages/shared-types/src',
      '@mythic/design-system': '../../packages/design-system/src',
      // Note: React resolution is handled by pnpm hoisting (.npmrc)
      // and pnpm overrides (root package.json)
      // Turbopack will automatically use the hoisted React instance
    },
  },

  // ⭐ ELITE: Webpack optimizations (fallback when not using Turbopack)
  webpack: (config, { dev, isServer }) => {
    // Fix React version mismatch in monorepo
    config.resolve.alias = {
      ...config.resolve.alias,
      react: require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
    }

    // Production optimizations
    if (!dev && !isServer) {
      // ⭐ ELITE: Performance budgets
      config.performance = {
        maxAssetSize: 250000, // 250 KB
        maxEntrypointSize: 250000,
        hints: process.env.CI ? 'error' : 'warning', // Fail in CI, warn locally
      }

      // Optimize chunk splitting
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // ⭐ ELITE: Workspace packages chunk
            workspace: {
              name: 'workspace',
              test: /[\\/]packages[\\/]/,
              chunks: 'all',
              priority: 25,
              reuseExistingChunk: true,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      }
    }
    return config
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

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // TypeScript strict enforcement
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default withBundleAnalyzer(nextConfig)
