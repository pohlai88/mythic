/**
 * SDKs & Kits Layout
 *
 * DOCTRINE: Documentation Surface uses DocShell.
 */

import { DocShell } from "@/components"

export default function SdksLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocShell
      meta={{
        id: "DOC-SDK-030",
        status: "draft",
        version: "0.1.0",
        lastUpdated: "2026-01-13",
      }}
      headingCount={5}
    >
      {children}
    </DocShell>
  )
}
