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
import '../styles/globals.css'

export const metadata: Metadata = {
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
