/**
 * Design Token Utilities
 *
 * DRY: Type-safe token references for design system tokens
 * Provides consistent access to design system colors, spacing, and typography
 *
 * Following apps/docs pattern for Tailwind intelligence optimization
 */

/**
 * Color token utilities
 * Maps design system tokens to Tailwind utility classes
 */
export const tokens = {
  colors: {
    void: 'bg-void text-void',
    obsidian: 'bg-obsidian text-obsidian',
    charcoal: 'bg-charcoal text-charcoal border-charcoal',
    parchment: 'bg-parchment text-parchment',
    ash: 'bg-ash text-ash',
    gold: 'bg-gold text-gold border-gold',
    ember: 'bg-ember text-ember border-ember',
  },
  text: {
    primary: 'text-parchment',
    secondary: 'text-ash',
    accent: 'text-gold',
    warning: 'text-ember',
    muted: 'text-ash',
  },
  background: {
    default: 'bg-void',
    surface: 'bg-obsidian',
    elevated: 'bg-obsidian',
  },
  border: {
    default: 'border-charcoal',
    accent: 'border-gold',
    warning: 'border-ember',
    subtle: 'border-charcoal/30',
  },
  spacing: {
    section: 'py-6 sm:py-8 md:py-10',
    container: 'px-4 sm:px-6 md:px-8',
    card: 'p-4 sm:p-6',
    cardSmall: 'p-3',
    cardLarge: 'p-8',
  },
} as const

/**
 * Status-specific color tokens (for intelligence-driven styling)
 */
export const statusColors = {
  DRAFT: {
    text: 'text-ash',
    bg: 'bg-obsidian',
    border: 'border-charcoal',
  },
  LISTENING: {
    text: 'text-gold',
    bg: 'bg-obsidian',
    border: 'border-gold',
  },
  APPROVED: {
    text: 'text-parchment',
    bg: 'bg-obsidian',
    border: 'border-gold',
  },
  VETOED: {
    text: 'text-ember',
    bg: 'bg-obsidian',
    border: 'border-ember',
  },
} as const

/**
 * Priority-specific color tokens
 */
export const priorityColors = {
  low: {
    text: 'text-ash',
    border: 'border-charcoal',
  },
  normal: {
    text: 'text-parchment',
    border: 'border-charcoal',
  },
  high: {
    text: 'text-gold',
    border: 'border-gold',
  },
  urgent: {
    text: 'text-ember',
    border: 'border-ember',
  },
} as const
