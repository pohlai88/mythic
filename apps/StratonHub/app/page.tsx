/**
 * Home Page - StratonHub
 *
 * DOCTRINE: Pages must not paint.
 * This page composes: PageShell + AxisStack + AxisHero + AxisCardGrid + AxisCard
 * Data only. No layout primitives. No local component definitions.
 */

import type { Metadata } from "next"
import { PageShell, AxisStack, AxisHero, AxisCardGrid, AxisCard } from "@/components"

const SITE_CONFIG = {
  name: "StratonHub",
  subtitle: "Governance.",
  description:
    "The canonical chamber of NexusCanon. Structured by Diataxis. Engineered for clarity. Built to endure long hours and hard truths.",
} as const

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — NexusCanon`,
  description: "Precision in typography. Authority in gold. The system is awake.",
}

// Data only - no component definitions in pages
const audienceCards = [
  {
    href: "/developers",
    eyebrow: "01 · Architecture",
    title: "Developers",
    body: "Encode governance into logic. Contracts, schemas, and boundaries—engineered to hold under pressure, immune to distortion.",
    ariaLabel: "Navigate to Developer documentation",
  },
  {
    href: "/users",
    eyebrow: "02 · Operations",
    title: "Users",
    body: "Execute with certainty. Standard operating procedures that function like rituals—repeatable, auditable, and exact.",
    ariaLabel: "Navigate to User documentation",
  },
  {
    href: "/business",
    eyebrow: "03 · Sovereignty",
    title: "Business",
    body: "Decisions anchored in truth. Governance, audit, and command—documents that command presence when stakes are high.",
    ariaLabel: "Navigate to Business documentation",
  },
] as const

export default function HomePage() {
  return (
    <PageShell preset="landing">
      <AxisStack gap="authority">
        <AxisHero
          status="System Online"
          title={SITE_CONFIG.name}
          subtitle={SITE_CONFIG.subtitle}
          description={SITE_CONFIG.description}
        />

        <AxisCardGrid columns={3} label="Documentation audience selection">
          {audienceCards.map((card) => (
            <AxisCard key={card.href} {...card} />
          ))}
        </AxisCardGrid>
      </AxisStack>
    </PageShell>
  )
}
