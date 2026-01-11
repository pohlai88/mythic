/**
 * Error Tracking
 *
 * KISS: Simple error tracking
 * DRY: Reusable across all domains
 */

/**
 * Error Context
 */
export interface ErrorContext {
  domain: string
  userId?: string
  requestId?: string
  metadata?: Record<string, unknown>
}

/**
 * Track error
 *
 * KISS: Simple error tracking
 */
export function trackError(error: Error, context: ErrorContext): void {
  const errorData = {
    timestamp: new Date().toISOString(),
    domain: context.domain,
    message: error.message,
    stack: error.stack,
    name: error.name,
    userId: context.userId,
    requestId: context.requestId,
    metadata: context.metadata,
  }

  // In production, send to error tracking service (e.g., Sentry)
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error Tracking] ${context.domain}:`, errorData)
  }
}
