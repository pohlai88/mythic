/**
 * KPIs Layout — Business Audience
 *
 * Wraps KPI documentation with DocShell and canonical metadata.
 */

import { DocShell } from "@/components"
import type { ReactNode } from "react"

export const metadata = {
  title: "KPI Dictionary · Business · StratonHub",
  description: "Key Performance Indicator definitions and reporting logic.",
}

export default function KPIsLayout({ children }: { children: ReactNode }) {
  return (
    <DocShell>
      {children}
    </DocShell>
  )
}
