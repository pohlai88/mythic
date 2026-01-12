/**
 * Tailwind Utility Functions
 *
 * DRY: Centralized responsive utilities and common Tailwind patterns
 * KISS: Simple, reusable utility functions for consistent styling
 */

/**
 * Responsive container utilities
 * Full breakpoint system: sm, md, lg, xl, 2xl
 */
export const responsive = {
  container: 'mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
  section: 'py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16',
  text: {
    heading: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
    body: 'text-base sm:text-lg md:text-xl',
    small: 'text-xs sm:text-sm md:text-base',
  },
} as const

/**
 * Grid column utilities
 * Full breakpoint system for responsive grids
 */
export const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
} as const

/**
 * Spacing utilities
 * Full breakpoint system for consistent spacing
 */
export const spacing = {
  card: 'p-4 sm:p-6 md:p-8',
  section: 'py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16',
  container: 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
  gap: {
    sm: 'gap-2 sm:gap-3 md:gap-4',
    md: 'gap-4 sm:gap-6 md:gap-8',
    lg: 'gap-6 sm:gap-8 md:gap-10 lg:gap-12',
  },
} as const
