/**
 * Analytics Utilities
 *
 * KISS: Simple analytics tracking
 * DRY: Reusable across all domains
 */

/**
 * Event Properties
 */
export type EventProperties = Record<string, unknown>

/**
 * Track event
 *
 * KISS: Simple event tracking
 */
export function trackEvent(event: string, properties?: EventProperties): void {
  const eventData = {
    timestamp: new Date().toISOString(),
    event,
    properties: properties || {},
  }

  // In production, send to analytics service
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${event}:`, properties || {})
  }
}
