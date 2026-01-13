/**
 * Users Layout — The Operator
 *
 * Unified audience layout using AudienceLayout shell.
 */

import { AudienceLayout } from "@/components/shells"

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <AudienceLayout role="Operator">{children}</AudienceLayout>
}
