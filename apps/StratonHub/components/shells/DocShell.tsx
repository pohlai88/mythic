/**
 * DocShell - Documentation Content Wrapper
 *
 * DOCTRINE: Content wrapper ONLY. Does NOT create page structure.
 * The audience layout (users/developers/business) owns the page shell.
 *
 * This shell:
 * - Provides CONTEXT-AWARE right rail (only shows if content is complex)
 * - Integrates DocHeader for metadata (subordinate, thin preamble)
 * - Wraps content in ContentShell for prose typography
 *
 * LUXURY UX: Intelligent Right Rail
 * - Right rail only appears for complex documents (>= 3 headings)
 * - Computed ONCE server-side (no layout shift, no client computation)
 * - Pass headingCount from MDX parsing or set threshold manually
 *
 * NO className prop. Escape hatches are closed.
 */

import { ContentShell } from "./ContentShell"
import { DocHeader } from "../blocks/DocHeader"

type DocStatus = "draft" | "ratified" | "deprecated"

interface DocMeta {
  id: string
  status: DocStatus
  version?: string
  lastUpdated?: string
}

/** Minimum heading count to show right rail (Table of Contents) */
const RIGHT_RAIL_THRESHOLD = 3

interface DocShellProps {
  children: React.ReactNode
  meta?: DocMeta
  /**
   * Right rail content (Table of Contents, etc.)
   * Only rendered if headingCount >= RIGHT_RAIL_THRESHOLD
   */
  rightRail?: React.ReactNode
  /**
   * Number of headings in the document (computed server-side during MDX parsing)
   * Used to determine if right rail should be shown
   * If not provided, right rail is always shown when rightRail prop exists
   */
  headingCount?: number
  /**
   * Force right rail visibility regardless of heading count
   * Use sparingly - prefer letting the threshold decide
   */
  forceRightRail?: boolean
  // NO className prop - contracts are closed
}

export function DocShell({
  children,
  meta,
  rightRail,
  headingCount,
  forceRightRail = false,
}: DocShellProps) {
  // Context-aware right rail: only show for complex documents
  // Decision computed ONCE server-side (no hydration mismatch)
  const shouldShowRightRail =
    rightRail &&
    (forceRightRail ||
      headingCount === undefined || // If not provided, default to showing
      headingCount >= RIGHT_RAIL_THRESHOLD)

  return (
    <div className="flex gap-12">
      {/* Main content area - ContentShell owns prose width */}
      <div className="flex-1 min-w-0">
        {meta && <DocHeader {...meta} />}
        <ContentShell>{children}</ContentShell>
      </div>

      {/* Context-aware right rail - only for complex documents */}
      {shouldShowRightRail && (
        <aside
          className="hidden lg:block w-64 shrink-0 sticky top-32 self-start"
          aria-label="Document navigation"
        >
          {rightRail}
        </aside>
      )}
    </div>
  )
}
