/**
 * AxisStack - Vertical Rhythm Block
 *
 * DOCTRINE: DRY layout spacing.
 * Pages use AxisStack for section spacing instead of margin utilities.
 *
 * LUXURY UX: Intentional Pause
 * - 'authority': Maximum pause (after hero/H1 content)
 * - 'section': Major section breaks
 * - 'block': Standard content blocks
 * - 'tight': Compact groupings
 *
 * Usage:
 *   <AxisStack gap="authority">
 *     <AxisHero ... />
 *     <ContentSection />
 *   </AxisStack>
 */

import { cn } from "@mythic/nextjs-shared-utils"

interface AxisStackProps {
  children: React.ReactNode
  /**
   * Spacing rhythm between children
   * - authority: 5rem (80px) - After hero, major page sections
   * - section: 3rem (48px) - Between content sections
   * - block: 2rem (32px) - Between related blocks
   * - tight: 1rem (16px) - Compact groupings
   */
  gap?: "authority" | "section" | "block" | "tight"
  /** Add pause after first child (Intentional Pause pattern) */
  pauseAfterFirst?: boolean
}

const gapClasses = {
  authority: "space-y-20", // 5rem - Maximum pause
  section: "space-y-12", // 3rem - Section breaks
  block: "space-y-8", // 2rem - Content blocks
  tight: "space-y-4", // 1rem - Compact
} as const

export function AxisStack({ children, gap = "section", pauseAfterFirst = false }: AxisStackProps) {
  return (
    <div
      className={cn(
        gapClasses[gap],
        pauseAfterFirst && "[&>*:first-child]:mb-20 [&>*:first-child+*]:mt-0"
      )}
    >
      {children}
    </div>
  )
}
