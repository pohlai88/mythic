/**
 * Root Layout for BoardRoom App
 *
 * The Apex - Executive Board Decision Engine
 * AXIS Luxury Business Operating System
 */

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Providers } from './providers'
import { ToastProvider } from '@mythic/design-system'
import type { Metadata } from 'next'
// Tailwind CSS v4 - Design System
// Next.js Best Practice: Import from app/ directory
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://axis.dev'),
  title: {
    default: 'The Apex - Executive Board Decision Engine',
    template: '%s | AXIS',
  },
  description: 'High-Frequency Decision Engine for Executive Governance',
  keywords: ['executive', 'decision', 'boardroom', 'governance', 'axis'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
