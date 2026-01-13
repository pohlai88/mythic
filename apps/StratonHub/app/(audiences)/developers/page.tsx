/**
 * Developers Hub — Architect (TheEdge Grade)
 *
 * DOCTRINE: Pages must not paint.
 * This page composes: AxisStack + AxisHero + AxisCardGrid + AxisCard
 * Data only. No local component definitions.
 *
 * Note: The layout already provides the shell (header, nav, container).
 * This page provides content blocks only.
 */

import type { Metadata } from "next"
import { AxisStack, AxisHero, AxisCardGrid, AxisCard } from "@/components"

export const metadata: Metadata = {
  title: "Architect · StratonHub",
  description:
    "Engineering reference layer: contracts, boundaries, and governed integration standards for NexusCanon.",
}

// Data only - no component definitions in pages
const developerCards = [
  {
    href: "/developers/getting-started",
    documentId: "DOC-START-000",
    eyebrow: "// Onboarding",
    title: "Getting Started",
    body: "Environment setup, repository structure, and development workflow. Start here.",
    action: "Begin Setup →",
  },
  {
    href: "/developers/api",
    documentId: "DOC-API-001",
    eyebrow: "// Interfaces",
    title: "API Reference",
    body: "Endpoints, auth, rate limits, and error formats. Exact contracts and examples—no narrative.",
    action: "Open Reference →",
  },
  {
    href: "/developers/architecture",
    documentId: "DOC-ARCH-010",
    eyebrow: "// System",
    title: "Architecture",
    body: "Boundaries, invariants, and trade-offs. What is guaranteed, what is optional, and why.",
    action: "Open Reference →",
  },
  {
    href: "/developers/guides",
    documentId: "DOC-GUIDE-020",
    eyebrow: "// Operations",
    title: "Execution Guides",
    body: "Task-focused procedures: extending contracts, adding modules, running checks, and shipping safely.",
    action: "Open Reference →",
  },
  {
    href: "/developers/sdks",
    documentId: "DOC-SDK-030",
    eyebrow: "// Tooling",
    title: "SDKs & Kits",
    body: "Typed clients and pre-validated utilities. Standard patterns to move fast without breaking contracts.",
    action: "Open Reference →",
  },
] as const

export default function DevelopersPage() {
  return (
    <AxisStack gap="authority">
      <AxisHero
        status="Role: Architect · Environment: Production"
        title="Architect"
        subtitle="Contracts, boundaries, and integration standards."
        description="This is the engineering reference layer. Contracts define behavior, schemas prevent drift, and protocols keep integrations predictable across teams and environments."
      />

      <AxisCardGrid columns={2} density="comfortable" label="Architecture documentation modules">
        {developerCards.map((card) => (
          <AxisCard key={card.href} {...card} />
        ))}
      </AxisCardGrid>
    </AxisStack>
  )
}
