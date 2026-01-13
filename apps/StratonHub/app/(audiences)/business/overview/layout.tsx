/**
 * Business Overview Documentation Layout
 *
 * DOCTRINE: Documentation Surface uses DocShell.
 * Wraps MDX content in canonical documentation posture.
 */

import { DocShell } from "@/components"

export default function BusinessOverviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocShell
      meta={{
        id: "DOC-BIZ-001",
        status: "ratified",
        version: "1.0.0",
        lastUpdated: "2026-01-13",
      }}
      headingCount={6}
    >
      {children}
    </DocShell>
  )
}
