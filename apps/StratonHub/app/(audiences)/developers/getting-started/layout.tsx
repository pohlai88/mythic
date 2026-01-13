/**
 * Getting Started Layout — Developer Audience
 *
 * Wraps getting-started pages with DocShell and canonical metadata.
 */

import { DocShell } from "@/components"
import type { ReactNode } from "react"

export const metadata = {
  title: "Getting Started · Developers · StratonHub",
  description: "Environment setup, repository structure, and development workflow.",
}

export default function GettingStartedLayout({ children }: { children: ReactNode }) {
  return (
    <DocShell>
      {children}
    </DocShell>
  )
}
