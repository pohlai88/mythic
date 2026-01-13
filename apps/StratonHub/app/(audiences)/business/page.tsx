/**
 * Sovereign Hub Page
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
  title: "Sovereign · StratonHub",
  description:
    "Sovereign-facing doctrine, governance, and executive truth surfaces for NexusCanon and AXIS.",
}

// Data only - no component definitions in pages
const sovereignCards = [
  {
    href: "/business/overview",
    eyebrow: "I · Orientation",
    title: "System Overview",
    body: "What NexusCanon is, how AXIS is governed, and what remains invariant across time and tooling.",
    action: "Open Module →",
  },
  {
    href: "/business/compliance",
    eyebrow: "II · Governance",
    title: "Compliance & Audit",
    body: "Audit models, trace discipline, override recording, and the rules that preserve accountability.",
    action: "Open Module →",
  },
  {
    href: "/business/kpis",
    eyebrow: "III · Metrics",
    title: "KPI Dictionary",
    body: "Canonical definitions for all Key Performance Indicators. Formulas, sources, and refresh schedules.",
    action: "Open Module →",
  },
  {
    href: "/business/process-flows",
    eyebrow: "IV · Operations",
    title: "Process Flows",
    body: "End-to-end business processes: Procure-to-Pay, Order-to-Cash, Record-to-Report, and more.",
    action: "Open Module →",
  },
  {
    href: "/business/training",
    eyebrow: "V · Induction",
    title: "Training",
    body: "Induction paths and operational literacy for decision-makers and stakeholders.",
    action: "Open Module →",
  },
] as const

export default function BusinessPage() {
  return (
    <AxisStack gap="authority">
      <AxisHero
        status="Role: Sovereign · Environment: Production"
        title="Sovereign"
        subtitle="Governance."
        description="StratonHub is the canonical record for NexusCanon and AXIS. This section defines the laws of governance, auditability, and executive truth surfaces."
      />

      <AxisCardGrid columns={3} density="comfortable" label="Sovereign documentation modules">
        {sovereignCards.map((card) => (
          <AxisCard key={card.href} {...card} />
        ))}
      </AxisCardGrid>
    </AxisStack>
  )
}
