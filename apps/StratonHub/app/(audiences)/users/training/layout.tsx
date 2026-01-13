/**
 * Training Documentation Layout
 *
 * DOCTRINE: Documentation Surface uses DocShell.
 * Wraps MDX content in canonical documentation posture.
 */

import { DocShell } from "@/components"

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocShell
      meta={{
        id: "DOC-TRAIN-001",
        status: "draft",
        version: "0.1.0",
        lastUpdated: "2026-01-13",
      }}
      headingCount={4}
    >
      {children}
    </DocShell>
  )
}
