/**
 * Example: i18n Layout for Nextra 4 RSC
 *
 * This is an EXAMPLE file showing how to implement i18n with Nextra 4.
 * To enable i18n, rename this file to layout.tsx and move it to app/[lang]/
 *
 * IMPORTANT: This requires restructuring your app directory:
 * - Move app/layout.tsx → app/[lang]/layout.tsx
 * - Move app/[[...mdxPath]] → app/[lang]/[[...mdxPath]]
 * - Update all routes to include [lang] parameter
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/internationalization
 * @see https://the-guild.dev/blog/nextra-4
 */

import { type Locale, getDictionary, getDirection } from '@/lib/i18n/get-dictionary'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Footer, LastUpdated, Layout, Navbar, ThemeSwitch } from 'nextra-theme-docs'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
// Required for theme styles
import 'nextra-theme-docs/style.css'
import 'katex/dist/katex.min.css'
import '../../styles/globals.css'

// ============================================================================
// Metadata API (replaces theme.config head)
// @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
// ============================================================================
export async function generateMetadata(props: { params: Promise<{ lang: Locale }> }) {
  const { lang: _lang } = await props.params
  // Prefix with _ to indicate intentionally unused (example file)
  // In real usage, use _lang for locale-specific metadata

  return {
    title: {
      default: 'NexusCanon Documentation',
      template: '%s | NexusCanon',
    },
    // lang can be used for locale-specific metadata
    // Example: description: lang === 'fr' ? 'Description en français' : 'English description',
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
      apple: '/apple-touch-icon.png',
    },
    themeColor: '#000000',
  }
}

// ============================================================================
// Root Layout with i18n Support
// ============================================================================
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const pageMap = await getPageMap(lang)
  const direction = getDirection(lang)
  const dictionary = await getDictionary(lang)

  // Banner component with translation
  const banner = (
    <Banner storageKey="nexuscanon-v4">
      {dictionary.banner}{' '}
      <a href="/governance" style={{ textDecoration: 'underline' }}>
        {dictionary.bannerLink}
      </a>
    </Banner>
  )

  // Footer component with translation
  const footer = (
    <Footer>{dictionary.footer.replace('{year}', new Date().getFullYear().toString())}</Footer>
  )

  return (
    <html
      lang={lang}
      dir={direction}
      // Suggested by `next-themes` package
      suppressHydrationWarning
    >
      <Head backgroundColor={{ dark: '#0f172a', light: '#fefce8' }} />
      <body>
        <Layout
          pageMap={pageMap}
          banner={banner}
          docsRepositoryBase="https://github.com/shuding/nextra-docs-template"
          editLink={dictionary.editPage}
          feedback={{ content: dictionary.feedback }}
          footer={footer}
          i18n={[
            { locale: 'en', name: 'English' },
            { locale: 'fr', name: 'Français' },
            { locale: 'es', name: 'Español' },
            { locale: 'de', name: 'Deutsch' },
            { locale: 'zh', name: '中文' },
            { locale: 'ja', name: '日本語' },
            { locale: 'ru', name: 'Русский' },
            { locale: 'he', name: 'עברית' },
          ]}
          lastUpdated={<LastUpdated>{dictionary.lastUpdated}</LastUpdated>}
          sidebar={{
            defaultMenuCollapseLevel: 1,
            toggleButton: true,
            autoCollapse: true,
          }}
          toc={{
            backToTop: dictionary.backToTop,
            title: dictionary.tocTitle,
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
            <Search
              emptyResult={dictionary.searchEmptyResult}
              errorText={dictionary.searchError}
              loading={dictionary.searchLoading}
              placeholder={dictionary.searchPlaceholder}
            />
            <ThemeSwitch />
          </Navbar>

          {children}
        </Layout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
