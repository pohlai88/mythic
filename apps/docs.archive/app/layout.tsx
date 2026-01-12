/**
 * Root Layout for Documentation App
 *
 * Custom implementation replacing Nextra
 * Uses design system tokens and ELITE practices
 */

import { DocsLayout, DocsNavbar, DocsFooter } from '@/components/layout'
import { Providers } from './providers'
import { AnalyticsWrapper } from '@/components/Analytics'
// Tailwind CSS v4 Design System - Import global styles
// Next.js Best Practice: Import from app/ directory
import './globals.css'

// Required for math rendering
import 'katex/dist/katex.min.css'

// ============================================================================
// Metadata API (replaces theme.config head)
// @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
// ============================================================================
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nexuscanon.dev'),
  title: {
    default: 'NexusCanon Documentation',
    template: '%s | NexusCanon',
  },
  description: 'Comprehensive governance and documentation',
  keywords: ['documentation', 'next.js', 'mdx', 'governance', 'nexuscanon'],
  authors: [{ name: 'NexusCanon' }],
  openGraph: {
    title: 'NexusCanon Documentation',
    description: 'Comprehensive governance and documentation',
    type: 'website',
    images: ['/og-image.png'],
    url: 'https://nexuscanon.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexusCanon Documentation',
    description: 'Comprehensive governance and documentation',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

// ============================================================================
// Viewport API (for themeColor and other viewport settings)
// @see https://nextjs.org/docs/app/api-reference/functions/generate-viewport
// ============================================================================
export const viewport = {
  themeColor: '#000000',
}

// ============================================================================
// Root Layout
// ============================================================================
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0a0a0b" />
        {/* Axis Visual Canon: Recommended fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-parchment">
        <Providers>
          <DocsNavbar />
          <DocsLayout>
            {children}
          </DocsLayout>
          <DocsFooter />
          <AnalyticsWrapper />
        </Providers>
      </body>
    </html>
  )
}
