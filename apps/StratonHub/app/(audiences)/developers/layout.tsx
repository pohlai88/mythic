/**
 * Developers Layout — The Architect
 *
 * Unified audience layout using AudienceLayout shell.
 */

import { AudienceLayout } from "@/components/shells"

export default function DevelopersLayout({ children }: { children: React.ReactNode }) {
  return <AudienceLayout role="Architect">{children}</AudienceLayout>
}
