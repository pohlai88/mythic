/**
 * Analytics Service Schema
 *
 * Contract-First approach: All analytics events validated with Zod
 * Following the analytics service architecture for self-hosting.
 */

import { z as z4 } from "zod/v4"

/**
 * Analytics Event Schema
 *
 * Validates all analytics events before sending to analytics service.
 * Ensures type safety and data consistency.
 */
export const analyticsEventSchema = z4.object({
  // Request metadata
  requestId: z4.string().uuid().describe("Unique request identifier"),
  pathname: z4.string().describe("Request pathname"),
  method: z4
    .enum(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])
    .describe("HTTP method"),
  timestamp: z4.string().datetime().describe("ISO 8601 timestamp"),

  // Performance metrics
  responseTime: z4.number().optional().describe("Response time in milliseconds"),
  statusCode: z4.number().int().min(100).max(599).optional().describe("HTTP status code"),

  // User context (anonymized)
  userAgent: z4.string().optional().describe("User agent string"),
  ipHash: z4.string().optional().describe("SHA-256 hash of IP address (privacy-preserving)"),
  country: z4.string().length(2).optional().describe("ISO 3166-1 alpha-2 country code"),

  // Security context
  isValidRequest: z4.boolean().describe("Whether request passed validation"),
  validationErrors: z4.array(z4.string()).optional().describe("Validation error messages"),

  // Correlation IDs
  proposalId: z4.string().uuid().optional().describe("Link to Thanos events (proposal ID)"),
  userId: z4.string().uuid().optional().describe("Link to user (if authenticated)"),

  // Custom metadata
  metadata: z4.record(z4.string(), z4.unknown()).optional().describe("Additional metadata"),
})

export type AnalyticsEvent = z4.infer<typeof analyticsEventSchema>

/**
 * Validate analytics event
 *
 * @param event - Event data to validate
 * @returns Validation result
 */
export function validateAnalyticsEvent(event: unknown) {
  return analyticsEventSchema.safeParse(event)
}

/**
 * Create analytics event from request data
 *
 * Helper function to create a properly formatted analytics event.
 */
export function createAnalyticsEvent(data: {
  requestId: string
  pathname: string
  method: string
  timestamp?: string
  responseTime?: number
  statusCode?: number
  userAgent?: string
  ipHash?: string
  country?: string
  isValidRequest: boolean
  validationErrors?: string[]
  proposalId?: string
  userId?: string
  metadata?: Record<string, unknown>
}): AnalyticsEvent {
  return {
    requestId: data.requestId,
    pathname: data.pathname,
    method: data.method as AnalyticsEvent["method"],
    timestamp: data.timestamp || new Date().toISOString(),
    responseTime: data.responseTime,
    statusCode: data.statusCode,
    userAgent: data.userAgent,
    ipHash: data.ipHash,
    country: data.country,
    isValidRequest: data.isValidRequest,
    validationErrors: data.validationErrors,
    proposalId: data.proposalId,
    userId: data.userId,
    metadata: data.metadata,
  }
}
