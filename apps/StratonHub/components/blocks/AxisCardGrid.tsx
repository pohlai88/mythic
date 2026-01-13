/**
 * AxisCardGrid - THE DRY WIN
 *
 * DOCTRINE: Grid layout for cards. Owns columns and spacing.
 * Pages never define grid layouts directly.
 */

import { cn } from "@mythic/nextjs-shared-utils"

interface AxisCardGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  density?: "comfortable" | "tight"
  label?: string
}

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const

const densityClasses = {
  comfortable: "gap-8",
  tight: "gap-4",
} as const

export function AxisCardGrid({
  children,
  columns = 3,
  density = "comfortable",
  label,
}: AxisCardGridProps) {
  return (
    <section
      className={cn("grid", columnClasses[columns], densityClasses[density])}
      aria-label={label}
    >
      {children}
    </section>
  )
}
