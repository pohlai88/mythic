/**
 * Analytics Tracking Utilities
 *
 * Provides utilities for tracking performance metrics (response time, status code)
 * in route handlers and sending to analytics service.
 */

import { env } from "@/src/lib/env"
import { analyticsEventSchema, createAnalyticsEvent } from "./service"
import { hashIPSync } from "./privacy"
import { extractProposalId, extractUserId, getIPAddress } from "./utils"
import type { NextRequest, NextResponse } from "next/server"

/**
 * Track response metrics and send to analytics
 *
 * This function should be called from route handlers after processing the request.
 * It captures response time and status code, then sends to analytics service.
 *
 * @param options - Tracking options
 * @returns Promise that resolves when analytics is sent (non-blocking)
 */
export async function trackResponseMetrics(options: {
  requestId: string
  pathname: string
  method: string
  statusCode: number
  responseTime: number
  requestHeaders?: Headers
  startTime?: number
}): Promise<void> {
  // Skip if analytics disabled
  if (!env.ANALYTICS_ENABLED) {
    return
  }

  try {
    // Get request headers (must be provided - cannot use headers() in this context)
    if (!options.requestHeaders) {
      // Cannot use headers() here - requestHeaders must be provided
      return
    }
    const requestHeaders = options.requestHeaders

    // Get IP address and hash it for privacy
    const ipAddress = getIPAddress(requestHeaders)
    const ipHash = hashIPSync(ipAddress)

    // Extract correlation IDs
    const proposalId = extractProposalId(options.pathname)
    const userId = extractUserId(requestHeaders)

    // Create analytics event with performance metrics
    const analyticsEvent = createAnalyticsEvent({
      requestId: options.requestId,
      pathname: options.pathname,
      method: options.method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS",
      timestamp: new Date().toISOString(),
      responseTime: options.responseTime,
      statusCode: options.statusCode,
      userAgent: requestHeaders.get("user-agent") || undefined,
      ipHash,
      isValidRequest: true, // If we got here, request was valid
      proposalId,
      userId,
    })

    // Validate with Zod schema
    const result = analyticsEventSchema.safeParse(analyticsEvent)
    if (!result.success) {
      // Log error but don't throw - analytics failures shouldn't break the app
      console.error("Analytics event validation failed:", result.error.issues)
      return
    }
    const validatedEvent = result.data

    // Send to analytics endpoint (non-blocking)
    await fetch(env.ANALYTICS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(env.ANALYTICS_API_KEY && {
          Authorization: `Bearer ${env.ANALYTICS_API_KEY}`,
        }),
      },
      body: JSON.stringify(validatedEvent),
    })
  } catch (error) {
    // Don't throw - analytics failures shouldn't affect response
    if (env.NODE_ENV === "development") {
      console.error("Analytics tracking failed:", error)
    }
  }
}

/**
 * Create a performance tracking wrapper for route handlers
 *
 * Wraps a route handler function to automatically track response time and status code.
 *
 * @example
 * ```typescript
 * export const GET = withPerformanceTracking(async (req, { params }) => {
 *   // Your handler code
 *   return NextResponse.json({ data: 'result' })
 * })
 * ```
 */
export function withPerformanceTracking<
  T extends (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ) => Promise<NextResponse>,
>(handler: T): T {
  return (async (req, context) => {
    const startTime = Date.now()
    const requestId = req.headers.get("x-request-id") || crypto.randomUUID()
    const pathname = req.nextUrl.pathname
    const method = req.method

    try {
      // Execute handler
      const response = await handler(req, context)

      // Calculate response time
      const responseTime = Date.now() - startTime

      // Get status code from response
      const statusCode = response.status

      // Track metrics (non-blocking - don't await)
      trackResponseMetrics({
        requestId,
        pathname,
        method,
        statusCode,
        responseTime,
        startTime,
      }).catch((error) => {
        // Silently fail - analytics shouldn't affect response
        if (env.NODE_ENV === "development") {
          console.error("Background analytics tracking failed:", error)
        }
      })

      return response
    } catch (error) {
      // Calculate response time even on error
      const responseTime = Date.now() - startTime

      // Track error (non-blocking)
      trackResponseMetrics({
        requestId,
        pathname,
        method,
        statusCode: 500, // Error status
        responseTime,
        startTime,
      }).catch(() => {
        // Silently fail
      })

      // Re-throw error to be handled by route handler
      throw error
    }
  }) as T
}
