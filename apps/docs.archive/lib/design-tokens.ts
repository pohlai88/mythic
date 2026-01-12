/**
 * Design Token Utilities
 *
 * DRY: Type-safe token references for design system tokens
 * Provides consistent access to design system colors, spacing, and typography
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
  spacing: {
    section: 'py-6 sm:py-8 md:py-10',
    container: 'px-4 sm:px-6 md:px-8',
    card: 'p-4 sm:p-6',
  },
  borders: {
    default: 'border border-charcoal/30',
    subtle: 'border border-charcoal/20',
    accent: 'border border-gold/30',
  },
} as const

/**
 * Diátaxis document type color tokens
 */
export const diataxisColors = {
  tutorial: {
    bg: 'bg-diataxis-tutorial-bg',
    text: 'text-diataxis-tutorial',
    border: 'border-diataxis-tutorial-border',
  },
  'how-to': {
    bg: 'bg-diataxis-howto-bg',
    text: 'text-diataxis-howto',
    border: 'border-diataxis-howto-border',
  },
  reference: {
    bg: 'bg-diataxis-reference-bg',
    text: 'text-diataxis-reference',
    border: 'border-diataxis-reference-border',
  },
  explanation: {
    bg: 'bg-diataxis-explanation-bg',
    text: 'text-diataxis-explanation',
    border: 'border-diataxis-explanation-border',
  },
} as const
