/**
 * Root Layout for Nextra 4 App Router
 *
 * Following official Nextra 4 migration guide:
 * @see https://the-guild.dev/blog/nextra-4
 */

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-docs'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { Providers } from './providers'
// Tailwind CSS v4 Design System - Import shared base
import '../styles/globals.css'

// Required for theme styles, previously was imported under the hood
import 'nextra-theme-docs/style.css'
import 'katex/dist/katex.min.css'

// ⚠️ SPECIAL THEME: Nextra-specific theme integration (not Tailwind)
// This is a special case for Nextra documentation theme
import '../styles/axis-theme.css'

// Import shared utilities
import { cn } from '@mythic/shared-utils'

// ============================================================================
// Metadata API (replaces theme.config head)
// @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
// ============================================================================
export const metadata = {
  title: {
    default: 'NexusCanon Documentation',
    template: '%s | NexusCanon',
  },
  description: 'Comprehensive governance and documentation powered by Nextra',
  keywords: ['documentation', 'nextra', 'next.js', 'mdx', 'governance', 'nexuscanon'],
  authors: [{ name: 'NexusCanon' }],
  openGraph: {
    title: 'NexusCanon Documentation',
    description: 'Comprehensive governance and documentation powered by Nextra',
    type: 'website',
    images: ['/og-image.png'],
    url: 'https://nexuscanon.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexusCanon Documentation',
    description: 'Comprehensive governance and documentation powered by Nextra',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    // apple: '/apple-touch-icon.png', // Removed - file doesn't exist. Use Next.js ImageResponse API to generate dynamically if needed.
  },
  themeColor: '#000000',
}

// ============================================================================
// Banner Component (new banner prop on <Layout>)
// ============================================================================
const banner = (
  <Banner storageKey="nexuscanon-v4">
    🎉 NexusCanon Governance Docs are now live!{' '}
    <a href="/governance" style={{ textDecoration: 'underline' }}>
      Explore →
    </a>
  </Banner>
)

// ============================================================================
// Footer Component (provide as last child of <Layout>)
// ============================================================================
const footer = (
  <Footer>
    {new Date().getFullYear()} © NexusCanon. Powered by{' '}
    <a href="https://nextra.site" target="_blank" rel="noreferrer">
      Nextra
    </a>
  </Footer>
)

// ============================================================================
// Remote Docs Page Maps
// Import remote page maps for sidebar navigation
// ============================================================================
// Uncomment when remote docs are configured:
// import { pageMap as graphqlEslintPageMap } from './remote/graphql-eslint/[[...slug]]/page'
// import { pageMap as graphqlYogaPageMap } from './remote/graphql-yoga/[[...slug]]/page'

// ============================================================================
// Root Layout
// ============================================================================
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap()

  // Merge remote docs into page map for sidebar navigation
  // Uncomment when remote docs are configured:
  // try {
  //   const { pageMap: graphqlEslintPageMap } = await import('./remote/graphql-eslint/[[...slug]]/page')
  //   const { pageMap: graphqlYogaPageMap } = await import('./remote/graphql-yoga/[[...slug]]/page')
  //
  //   pageMap = [
  //     ...pageMap,
  //     {
  //       name: 'remote',
  //       route: '/remote',
  //       children: [graphqlEslintPageMap, graphqlYogaPageMap],
  //     },
  //   ]
  // } catch (error) {
  //   // Remote docs not available, use default page map
  //   console.warn('Remote docs not available:', error)
  // }

  return (
    <html
      lang="en"
      dir="ltr"
      // Suggested by `next-themes` package
      suppressHydrationWarning
    >
      {/* ⭐ ELITE: Axis Visual Canon - BEASTMODE Gold colors */}
      <Head backgroundColor={{ dark: '#0a0a0b', light: '#f8f6f0' }} />
      <body>
        <Providers>
          <Layout
            pageMap={pageMap}
            banner={banner}
            docsRepositoryBase="https://github.com/shuding/nextra-docs-template"
            sidebar={{
              defaultMenuCollapseLevel: 1,
              toggleButton: true,
              autoCollapse: true,
            }}
            toc={{
              backToTop: true,
            }}
            navigation={{
              prev: true,
              next: true,
            }}
          >
            <Navbar
              logo={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '18px' }}>NexusCanon</span>
                </div>
              }
              projectLink="https://github.com/shuding/nextra-docs-template"
            >
              <Search />
              <ThemeSwitch />
            </Navbar>

            {children}

            {footer}
          </Layout>
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
