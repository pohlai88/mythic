/**
 * Next.js Configuration for Nextra 4
 *
 * Nextra 4 requires App Router. This configuration:
 * - Uses content/ directory for MDX files
 * - Enables Turbopack for faster builds (via --turbopack flag in dev script)
 * - Configures Pagefind search
 *
 * ⚠️ NEXTRA 4 CHANGES:
 * 1. theme.config.tsx is NO LONGER SUPPORTED
 *    - Removed: theme and themeConfig options from nextra()
 *    - Theme options now passed as props to components in app/layout.tsx
 *    - See app/layout.tsx for Layout, Navbar, Footer, Search, Banner props
 *
 * 2. TURBOPACK COMPATIBILITY:
 *    - Only JSON-serializable values can be passed to nextra() function
 *    - Custom remarkPlugins, rehypePlugins, or recmaPlugins (functions) are NOT supported
 *    - If you need custom plugins, you must use Webpack (remove --turbopack flag)
 *
 * @see https://the-guild.dev/blog/nextra-4
 */

import nextra from 'nextra'
import bundleAnalyzer from '@next/bundle-analyzer'

const withNextra = nextra({
  // Content directory configuration (Nextra 4)
  // MDX files are loaded from content/ directory
  contentDirBasePath: '/',

  // Nextra 4 features (all JSON-serializable - Turbopack compatible)
  defaultShowCopyCode: true,
  readingTime: true,
  latex: true,

  // Search configuration (Pagefind - Rust-powered search engine)
  // Pagefind replaces FlexSearch in Nextra 4
  // Benefits: Faster, better results, indexes remote MDX, dynamic content, imported files
  search: {
    codeblocks: false, // Set to true to enable code block search
  },
})

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
      '@mythic/axis-theme',
      // External packages
      'nextra',
      'nextra-theme-docs',
      'katex',
    ],
    // ⭐ ELITE: Server Actions optimization
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000', '*.vercel.app'],
    },
  },

  // Turbopack configuration (root level, not in experimental)
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx',
      '@mythic/shared-utils': '../../packages/shared-utils/src',
      '@mythic/shared-types': '../../packages/shared-types/src',
      '@mythic/design-system': '../../packages/design-system/src',
      '@mythic/axis-theme': '../../packages/axis-theme/src',
    },
  },

  // ⭐ ELITE: Webpack optimizations (fallback when not using Turbopack)
  webpack: (config, { dev, isServer }) => {
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

export default withBundleAnalyzer(withNextra(nextConfig))
