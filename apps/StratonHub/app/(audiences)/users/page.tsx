/**
 * Users Hub Page — The Operator
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
import { titleCaseSlug } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Operator · StratonHub",
  description:
    "Operator-facing induction and protocols for deterministic execution across AXIS surfaces.",
}

// Data only - no component definitions in pages
// NOTE: Only include surfaces with published routes. Other surfaces pending implementation.
// See: apps/StratonHub/.360audit.implementation.md for upgrade plan
const activeSurfaces = [
  {
    slug: "boardroom",
    description: "Executive decisions and governance protocols.",
  },
] as const

// Surface cards data - mapped to AxisCard format
const surfaceCards = activeSurfaces.map((surface, index) => ({
  href: `/users/${surface.slug}`,
  eyebrow: `${String(index + 1).padStart(2, "0")} · Surface`,
  title: titleCaseSlug(surface.slug),
  body: surface.description,
  action: "Enter Surface →",
  ariaLabel: `Navigate to ${titleCaseSlug(surface.slug)} surface`,
}))

// Induction cards data
const inductionCards = [
  {
    href: "/users/training",
    documentId: "DOC-TRAIN-001",
    eyebrow: "// Induction",
    title: "Training",
    body: "Guided onboarding and operational literacy for consistent execution.",
    action: "Enter Module →",
  },
  {
    href: "/users/roles-permissions",
    documentId: "DOC-ROLES-002",
    eyebrow: "// Access",
    title: "Roles & Permissions",
    body: "Understand your access level, what actions you can perform, and how to request changes.",
    action: "Enter Module →",
  },
  {
    href: "/users/boardroom",
    documentId: "DOC-BOARD-010",
    eyebrow: "// Priority Surface",
    title: "BoardRoom",
    body: "The observation deck: render truth, inspect trace, act with confidence.",
    action: "Enter Module →",
  },
] as const

export default function UsersPage() {
  return (
    <AxisStack gap="authority">
      <AxisHero
        status="Role: Operator · Environment: Production"
        title="Operator"
        subtitle="Protocols for deterministic execution."
        description="This section provides deterministic execution paths: do the work, produce the trace, and enact decisions. No ambiguity. No drift."
      />

      {/* AXIS Surfaces Grid */}
      <AxisCardGrid columns={3} density="tight" label="AXIS Surfaces">
        {surfaceCards.map((card) => (
          <AxisCard key={card.href} {...card} />
        ))}
      </AxisCardGrid>

      {/* Induction & Priority Cards */}
      <AxisCardGrid columns={2} density="comfortable" label="Induction documentation modules">
        {inductionCards.map((card) => (
          <AxisCard key={card.href} {...card} />
        ))}
      </AxisCardGrid>
    </AxisStack>
  )
}
