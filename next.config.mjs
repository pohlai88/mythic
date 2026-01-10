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

  // ⚠️ DO NOT ADD mdxOptions with custom plugins here!
  // Custom plugins (functions) are NOT serializable and will break Turbopack.
  // Example of what NOT to do:
  // mdxOptions: {
  //   remarkPlugins: [myRemarkPlugin],  // ❌ Function - NOT serializable
  //   rehypePlugins: [myRehypePlugin],  // ❌ Function - NOT serializable
  // }
  //
  // If you need custom plugins, use Webpack instead:
  // 1. Remove --turbopack from package.json dev script
  // 2. Then you can add mdxOptions with plugins
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  compress: true,

  // Turbopack configuration for MDX components
  // Required for Nextra 4 with Turbopack to resolve next-mdx-import-source-file
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx',
    },
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
  },

  // TypeScript strict enforcement
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default withBundleAnalyzer(withNextra(nextConfig))
