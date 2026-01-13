/**
 * Roles & Permissions Layout — User Audience
 *
 * Wraps roles/permissions documentation with DocShell and canonical metadata.
 */

import { DocShell } from "@/components"
import type { ReactNode } from "react"

export const metadata = {
  title: "Roles & Permissions · Operator · StratonHub",
  description: "Role definitions and permission matrix for operators.",
}

export default function RolesPermissionsLayout({ children }: { children: ReactNode }) {
  return (
    <DocShell>
      {children}
    </DocShell>
  )
}
