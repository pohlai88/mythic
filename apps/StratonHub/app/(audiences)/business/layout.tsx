/**
 * Business Layout — The Sovereign
 *
 * Unified audience layout using AudienceLayout shell.
 *
 * Note: This layout also includes enhanced metadata for SEO.
 */

import type { Metadata } from "next"
import { AudienceLayout } from "@/components/shells"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nexuscanon.com"

export const metadata: Metadata = {
  title: {
    default: "Sovereign",
    template: "%s · Sovereign · StratonHub",
  },
  description:
    "Sovereign-facing doctrine and governance guidance for NexusCanon and AXIS, including audit models and executive truth surfaces.",
  keywords: [
    "sovereign",
    "governance",
    "audit",
    "boardroom",
    "NexusCanon",
    "AXIS",
    "StratonHub",
    "Diataxis",
  ],
  openGraph: {
    title: "Sovereign · StratonHub",
    description: "Sovereign-facing governance and doctrine for NexusCanon and AXIS.",
    type: "website",
    url: `${siteUrl}/business`,
    siteName: "StratonHub",
    images: [{ url: "/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sovereign · StratonHub",
    description: "Sovereign-facing governance and doctrine for NexusCanon and AXIS.",
    images: ["/og"],
  },
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <AudienceLayout role="Sovereign">{children}</AudienceLayout>
}
