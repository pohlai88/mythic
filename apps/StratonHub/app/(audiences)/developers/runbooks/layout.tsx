/**
 * Runbooks Layout — Developer Audience
 *
 * Wraps operational runbooks with DocShell and canonical metadata.
 */

import { DocShell } from "@/components"
import type { ReactNode } from "react"

export const metadata = {
  title: "Runbooks · Developers · StratonHub",
  description: "Operational runbooks for system maintenance and troubleshooting.",
}

export default function RunbooksLayout({ children }: { children: ReactNode }) {
  return (
    <DocShell>
      {children}
    </DocShell>
  )
}
