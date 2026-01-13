/**
 * Developer Guides Layout
 *
 * DOCTRINE: Documentation Surface uses DocShell.
 */

import { DocShell } from "@/components"

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocShell
      meta={{
        id: "DOC-GUIDE-INDEX",
        status: "ratified",
        version: "1.0.0",
        lastUpdated: "2026-01-13",
      }}
      headingCount={4}
    >
      {children}
    </DocShell>
  )
}
