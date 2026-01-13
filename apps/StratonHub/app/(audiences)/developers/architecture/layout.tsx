/**
 * Architecture Reference Layout
 *
 * DOCTRINE: Documentation Surface uses DocShell.
 */

import { DocShell } from "@/components"

export default function ArchitectureLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocShell
      meta={{
        id: "DOC-ARCH-010",
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
