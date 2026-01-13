/**
 * BoardRoom Integration Guide Layout
 *
 * DOCTRINE: Documentation Surface uses DocShell.
 */

import { DocShell } from "@/components"

export default function BoardroomIntegrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocShell
      meta={{
        id: "DOC-DEV-GUIDE-001",
        status: "draft",
        version: "0.1.0",
        lastUpdated: "2026-01-13",
      }}
      headingCount={6}
    >
      {children}
    </DocShell>
  )
}
