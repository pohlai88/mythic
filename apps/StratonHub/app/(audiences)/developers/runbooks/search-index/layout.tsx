/**
 * Search Index Runbook Layout — Developer Audience
 *
 * Wraps the search index runbook with DocShell and canonical metadata.
 */

import { DocShell } from "@/components"
import type { ReactNode } from "react"

export const metadata = {
  title: "Search Index Pipeline · Runbooks · StratonHub",
  description: "How to build and deploy the search index.",
}

export default function SearchIndexRunbookLayout({ children }: { children: ReactNode }) {
  return (
    <DocShell>
      {children}
    </DocShell>
  )
}
