/**
 * ARIA Pattern Utilities
 *
 * DRY: Reusable ARIA patterns for consistent accessibility
 * Provides type-safe ARIA attribute generators
 */

/**
 * ARIA patterns for common UI elements
 */
export const ariaPatterns = {
  status: (status: string) => ({
    role: 'status' as const,
    'aria-label': `Status: ${status}`,
  }),
  navigation: (label: string) => ({
    role: 'navigation' as const,
    'aria-label': label,
  }),
  alert: (message: string) => ({
    role: 'alert' as const,
    'aria-label': message,
  }),
  complementary: (label: string) => ({
    role: 'complementary' as const,
    'aria-label': label,
  }),
  region: (label: string) => ({
    role: 'region' as const,
    'aria-label': label,
  }),
  article: (title: string) => ({
    role: 'article' as const,
    'aria-label': title,
  }),
  button: (label: string) => ({
    'aria-label': label,
    type: 'button' as const,
  }),
  link: (destination: string) => ({
    'aria-label': `Navigate to ${destination}`,
  }),
} as const

/**
 * Focus management utilities
 */
export const focusStyles = {
  default: 'focus:outline-hidden focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-void',
  subtle: 'focus:outline-hidden focus:ring-1 focus:ring-gold/50 focus:ring-offset-1',
  strong: 'focus:outline-hidden focus:ring-2 focus:ring-gold focus:ring-offset-4',
} as const
