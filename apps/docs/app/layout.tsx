/**
 * Root Layout for Documentation System
 *
 * Next.js App Router root layout
 * Reference: https://nextjs.org/docs/app/api-reference/file-conventions/layout
 */

import type { Metadata } from 'next'
import { Providers } from './providers'
import { CommandPalette } from '@/components/docs'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nexuscanon.dev'),
  title: {
    default: 'ERP Documentation',
    template: '%s | ERP Documentation',
  },
  description: 'Comprehensive ERP system documentation for developers, users, and business stakeholders',
  keywords: ['ERP', 'documentation', 'next.js', 'mdx', 'business'],
  authors: [{ name: 'Mythic ERP' }],
  openGraph: {
    title: 'ERP Documentation',
    description: 'Comprehensive ERP system documentation',
    type: 'website',
    url: 'https://nexuscanon.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ERP Documentation',
    description: 'Comprehensive ERP system documentation',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport = {
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0b" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-parchment">
        <Providers>
          {children}
          <CommandPalette />
        </Providers>
      </body>
    </html>
  )
}
