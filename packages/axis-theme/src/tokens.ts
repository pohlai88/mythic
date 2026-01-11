/**
 * Axis Visual Canon - BEASTMODE Gold Palette
 *
 * Material Truth color system for AXIS Luxury Business Operating System
 * These colors represent material states, not UI states.
 *
 * BEASTMODE: Supreme Luxury Gold (#c9a961) + Comfortable Reading White (Parchment #f8f6f0)
 */

// Import from design-system package
// Note: We import the handoff colors directly to avoid circular dependency
// In the future, we could move tokens to a shared location
const handoffColors = {
  void: { value: '#0a0a0b' },
  obsidian: { value: '#141416' },
  parchment: { value: '#f8f6f0' }, // BEASTMODE: Comfortable reading white
  ash: { value: '#d4cfc4' },
  gold: { value: '#c9a961' }, // BEASTMODE: Supreme luxury gold
  ember: { value: '#9d7a4a' },
  charcoal: { value: '#2a2a2c' },
} as const

/**
 * BEASTMODE Gold Palette
 *
 * Supreme luxury gold for ratified authority
 * Comfortable reading white (NOT pure white)
 */
export const axisColors = {
  void: handoffColors.void.value, // #0a0a0b - Absence / Authority
  obsidian: handoffColors.obsidian.value, // #141416 - Surface / Weight
  parchment: handoffColors.parchment.value, // #f8f6f0 - Knowledge (NOT pure white)
  ash: handoffColors.ash.value, // #d4cfc4 - Commentary
  gold: handoffColors.gold.value, // #c9a961 - Supreme luxury gold (BEASTMODE)
  ember: handoffColors.ember.value, // #9d7a4a - Consequence
  charcoal: handoffColors.charcoal.value, // #2a2a2c - Border / Divider
} as const

/**
 * Color token types
 */
export type AxisColorName = keyof typeof axisColors

/**
 * Get color value by name
 */
export function getAxisColor(name: AxisColorName): string {
  return axisColors[name]
}

/**
 * Validate no pure white (#FFFFFF) usage
 * Parchment (#f8f6f0) is the comfortable reading white
 */
export const FORBIDDEN_PURE_WHITE = '#FFFFFF'

/**
 * Check if color is pure white (forbidden)
 */
export function isPureWhite(color: string): boolean {
  return color.toUpperCase() === FORBIDDEN_PURE_WHITE
}
