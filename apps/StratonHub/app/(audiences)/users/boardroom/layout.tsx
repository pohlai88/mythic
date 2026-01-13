/**
 * Boardroom Documentation Layout
 *
 * DOCTRINE: Documentation Surface uses DocShell.
 * Wraps MDX content in canonical documentation posture.
 */

import { DocShell } from "@/components"

export default function BoardroomLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocShell
      meta={{
        id: "DOC-BOARD-001",
        status: "ratified",
        version: "1.0.0",
        lastUpdated: "2026-01-13",
      }}
      headingCount={5}
    >
      {children}
    </DocShell>
  )
}
