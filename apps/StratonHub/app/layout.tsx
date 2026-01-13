/**
 * Root Layout for Documentation System
 *
 * "The Shell"
 * Performance: Self-hosted fonts, Server Components, Zero-Layout Shift.
 * Philosophy: The container must be as rigid as the void it occupies.
 */

import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Providers } from "./providers"
import { CommandPalette } from "@/components/docs"
import "./globals.css"

// ============================================================================
// TYPOGRAPHY INGESTION
// ============================================================================
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // Injected into Axis Theme
  display: "swap",
  preload: true,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono", // Injected into Axis Theme
  display: "swap",
  preload: true,
})

// Site configuration
const SITE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nexuscanon.com",
  name: "StratonHub",
  description:
    "StratonHub is the canonical documentation hub for NexusCanon and AXIS, structured by the Diataxis framework.",
  shortDescription: "Canonical documentation hub for NexusCanon and AXIS.",
} as const

// Metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s · ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: ["NexusCanon", "AXIS", "StratonHub", "Diataxis", "governance", "documentation"],
  authors: [{ name: "NexusCanon" }],
  creator: "NexusCanon",
  publisher: "NexusCanon",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.shortDescription,
    type: "website",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Documentation Hub`,
      },
    ],
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.shortDescription,
    images: ["/og"],
    creator: "@nexuscanon",
  },
  // Icons configuration removed - using Next.js 16 file conventions
  // Next.js automatically handles favicon.ico when placed in /app directory
  // To enable: Move /public/favicon.ico to /app/favicon.ico
  // Next.js will automatically generate the appropriate <link> tags
  // For additional icons, add to /app directory:
  // - icon.png, icon.svg (for standard icons)
  // - apple-icon.png (for Apple touch icons)
  // Reference: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
  alternates: {
    canonical: SITE_CONFIG.url,
  },
}

// Viewport configuration
export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

// ============================================================================
// ROOT SHELL
// ============================================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-GB"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh antialiased selection:bg-gold/30 selection:text-signal">
        <Providers>
          {/* Main Stacking Context */}
          <div className="relative flex min-h-dvh flex-col">{children}</div>

          {/* Global Overlays */}
          <CommandPalette />
        </Providers>
      </body>
    </html>
  )
}
