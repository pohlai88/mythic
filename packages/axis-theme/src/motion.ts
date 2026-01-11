/**
 * Axis Visual Canon - Motion Physics
 *
 * Gravitational time transitions (not UI speed)
 * No bounce, snap, or elastic easing
 * Motion communicates consequence
 */

/**
 * Motion durations (gravitational time)
 *
 * Hover: 700-1200ms (earned illumination)
 * Commitment: 1618ms (golden ratio - decision must be felt)
 */
export const axisMotion = {
  hover: {
    min: 700,
    max: 1200,
    default: 1000,
  },
  commitment: 1618, // Golden ratio - decision must be felt before execution
} as const

/**
 * Motion easing (no bounce, snap, elastic)
 *
 * Gravitational easing - smooth, natural deceleration
 */
export const axisEasing = {
  gravitational: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth deceleration
  // Forbidden: 'ease-out', 'ease-in-out', 'bounce', 'elastic'
} as const

/**
 * Get hover transition duration
 */
export function getHoverDuration(custom?: number): number {
  if (custom !== undefined) {
    // Clamp between min and max
    return Math.max(axisMotion.hover.min, Math.min(axisMotion.hover.max, custom))
  }
  return axisMotion.hover.default
}

/**
 * Get commitment transition duration (1618ms)
 */
export function getCommitmentDuration(): number {
  return axisMotion.commitment
}

/**
 * Get transition string for CSS
 */
export function getTransition(
  properties: string | string[],
  duration: number = axisMotion.hover.default,
  easing: string = axisEasing.gravitational
): string {
  const props = Array.isArray(properties) ? properties.join(', ') : properties
  return `${props} ${duration}ms ${easing}`
}

/**
 * Get hover transition (1000ms default)
 */
export function getHoverTransition(properties: string | string[]): string {
  return getTransition(properties, getHoverDuration())
}

/**
 * Get commitment transition (1618ms)
 */
export function getCommitmentTransition(properties: string | string[]): string {
  return getTransition(properties, getCommitmentDuration())
}
