/**
 * Tailwind Utility Functions
 *
 * DRY: Centralized responsive utilities and common Tailwind patterns
 * KISS: Simple, reusable utility functions for consistent styling
 *
 * Following apps/docs pattern for Tailwind intelligence optimization
 */

/**
 * Responsive container utilities
 * Full breakpoint system: sm, md, lg, xl, 2xl
 */
export const responsive = {
  container: "mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16",
  section: "py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16",
  text: {
    heading: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
    body: "text-base sm:text-lg md:text-xl",
    small: "text-xs sm:text-sm md:text-base",
  },
} as const

/**
 * Grid column utilities
 * Full breakpoint system for responsive grids
 */
export const gridCols = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
} as const

/**
 * Spacing utilities
 * Full breakpoint system for consistent spacing
 */
export const spacing = {
  card: "p-4 sm:p-6 md:p-8",
  cardSmall: "p-3 sm:p-4",
  cardLarge: "p-8 sm:p-10 md:p-12",
  section: "py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16",
  container: "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16",
  gap: {
    sm: "gap-2 sm:gap-3 md:gap-4",
    md: "gap-4 sm:gap-6 md:gap-8",
    lg: "gap-6 sm:gap-8 md:gap-10 lg:gap-12",
  },
  space: {
    sm: "space-y-2 sm:space-y-3",
    md: "space-y-4 sm:space-y-6",
    lg: "space-y-6 sm:space-y-8 md:space-y-10",
  },
} as const

/**
 * Typography utilities
 */
export const typography = {
  heading: {
    sm: "text-lg font-serif",
    md: "text-xl font-serif",
    lg: "text-2xl font-serif",
  },
  body: {
    sm: "text-xs text-ash",
    md: "text-sm text-ash",
    lg: "text-base text-parchment",
  },
  mono: {
    sm: "text-xs font-mono",
    md: "text-sm font-mono",
    lg: "text-base font-mono",
  },
} as const

/**
 * Button utilities
 * Use intelligentButtonStyles() for dynamic buttons
 * Use these constants only for static utility references
 */
export const buttons = {
  primary:
    "px-6 py-2 bg-gold text-void rounded-xs font-mono text-sm hover:bg-ember transition-all duration-1618 disabled:opacity-50",
  secondary:
    "px-4 py-2 bg-obsidian text-parchment border border-charcoal rounded-xs font-mono text-sm hover:border-gold transition-all duration-1618 disabled:opacity-50",
  small: "px-4 py-2 rounded-xs text-sm font-mono",
  badge: "px-2 py-1 rounded-xs text-xs font-medium",
} as const

/**
 * Badge/tag utilities
 * Consistent styling for category tags, labels, etc.
 */
export const badges = {
  default: "text-xs text-ash bg-obsidian px-2 py-1 rounded-xs font-mono",
  category: "text-xs text-ash bg-obsidian px-2 py-1 rounded-xs font-mono",
  tag: "text-xs text-ash bg-obsidian px-2 py-1 rounded-xs font-mono",
} as const

/**
 * Input utilities
 * NOTE: Use intelligentInputStyles() for actual component usage
 * These constants are for reference only - prefer intelligence functions
 */
export const inputs = {
  default:
    "flex-1 bg-obsidian border border-charcoal rounded-xs px-4 py-2 text-parchment placeholder-ash focus:outline-hidden focus:border-gold transition-all duration-1200",
  textarea:
    "flex-1 bg-obsidian border border-charcoal rounded-xs px-4 py-2 text-parchment placeholder-ash focus:outline-hidden focus:border-gold transition-all duration-1200 resize-y",
} as const

/**
 * Border utilities
 */
export const borders = {
  default: "border border-charcoal",
  accent: "border border-gold",
  left: "border-l-4",
  dashed: "border-2 border-dashed",
  bottom: "border-b border-charcoal",
} as const

/**
 * Transition utilities
 * NOTE: Use intelligentTransitionStyles() for actual component usage
 * These constants reference @utility directives from design-system
 */
export const transitions = {
  default: "transition-illuminate", // 1200ms via @utility
  hover: "transition-hover-intelligent", // 700ms via @utility
  illuminate: "transition-illuminate", // 1200ms via @utility
  commit: "transition-commit", // 1618ms via @utility
} as const

/**
 * Layout utilities
 */
export const layout = {
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexStart: "flex items-start",
  flexCol: "flex flex-col",
  flexColCenter: "flex flex-col items-center",
  flexWrap: "flex flex-wrap",
  grid: "grid",
} as const

/**
 * Margin utilities
 */
export const margins = {
  bottom: {
    sm: "mb-2",
    md: "mb-4",
    lg: "mb-6",
  },
  top: {
    sm: "mt-2",
    md: "mt-4",
    lg: "mt-6",
  },
  all: {
    sm: "m-2",
    md: "m-4",
    lg: "m-6",
  },
} as const

/**
 * Alignment utilities
 */
export const alignment = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const
