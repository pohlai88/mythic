/**
 * Process Flows Layout — Business Audience
 *
 * Wraps process flow documentation with DocShell and canonical metadata.
 */

import { DocShell } from "@/components"
import type { ReactNode } from "react"

export const metadata = {
  title: "Process Flows · Business · StratonHub",
  description: "Operational workflows: Procure-to-Pay, Order-to-Cash, and more.",
}

export default function ProcessFlowsLayout({ children }: { children: ReactNode }) {
  return (
    <DocShell>
      {children}
    </DocShell>
  )
}
