/**
 * API Reference Layout
 *
 * DOCTRINE: Documentation Surface uses DocShell.
 */

import { DocShell } from "@/components"

export default function ApiReferenceLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocShell
      meta={{
        id: "DOC-API-INDEX",
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
