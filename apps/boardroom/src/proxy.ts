/**
 * Next.js Proxy with Zod Validation
 *
 * Contract-First approach: Validate all incoming requests with Zod
 * Provides request-level validation and security checks.
 *
 * Note: In Next.js 16+, "middleware" has been renamed to "proxy" to better
 * reflect its purpose as a network boundary in front of the app.
 */

import { z as z4 } from 'zod/v4'
import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'
import { createDomainProxy } from '@mythic/domain-core/proxy'
import { env } from '@/src/lib/env'
import { analyticsEventSchema, createAnalyticsEvent } from '@/src/lib/analytics/service'
import { hashIPSync } from '@/src/lib/analytics/privacy'
import { extractProposalId, extractUserId, getIPAddress } from '@/src/lib/analytics/utils'

/**
 * Request validation schema
 *
 * Validates the structure of incoming requests for security and consistency.
 * Following Next.js best practices for proxy validation.
 */
const requestSchema = z4.object({
  headers: z4.record(z4.string(), z4.string()).describe('Request headers'),
  cookies: z4.record(z4.string(), z4.string()).describe('Request cookies'),
  url: z4.string().url().describe('Request URL'),
  method: z4.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']).describe('HTTP method'),
  pathname: z4.string().describe('Request pathname'),
})

/**
 * Proxy function
 *
 * ⭐ ELITE: Enhanced proxy with analytics background tasks
 * Note: Using custom implementation because domain-core proxy is too simple
 * for analytics background tasks. This follows KISS - keep it simple but functional.
 *
 * Validates incoming requests and applies security checks.
 * Returns early with 400 error if request structure is invalid.
 *
 * Following Next.js 16 best practices:
 * - Runs at Edge Runtime by default (faster, closer to users)
 * - Validates request structure before processing
 * - Excludes static assets and Next.js internals via matcher
 */
export function proxy(request: NextRequest, event?: NextFetchEvent) {
  // Early return for static assets and Next.js internals (handled by matcher, but double-check)
  const pathname = request.nextUrl.pathname

  // Skip validation for Next.js internals (extra safety)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next()
  }

  // Validate request structure
  const validationResult = requestSchema.safeParse({
    headers: Object.fromEntries(request.headers.entries()),
    cookies: Object.fromEntries(
      request.cookies.getAll().map((c) => [c.name, c.value])
    ),
    url: request.url,
    method: request.method,
    pathname: request.nextUrl.pathname,
  })

  if (!validationResult.success) {
    // Invalid request structure - reject early
    if (process.env.NODE_ENV === 'development') {
      console.warn('Invalid request structure:', validationResult.error.issues)
    }

    return NextResponse.json(
      {
        error: 'Invalid request format',
        issues: validationResult.error.issues,
      },
      { status: 400 }
    )
  }

  // Clone the request headers and add validation status
  // Following Next.js best practice: Set request headers for downstream handlers
  const requestHeaders = new Headers(request.headers)
  const requestId = crypto.randomUUID()
  requestHeaders.set('x-validated-by-proxy', 'true')
  requestHeaders.set('x-request-id', requestId)

  // Background tasks using waitUntil (non-blocking)
  // Following Next.js best practice: Use waitUntil for analytics/logging
  // Self-hosting compliant: Uses Zod schema, IP hashing, and correlation IDs
  if (event && env.ANALYTICS_ENABLED) {
    event.waitUntil(
      (async () => {
        try {
          // Get IP address and hash it for privacy (GDPR/CCPA compliant)
          const ipAddress = getIPAddress(request.headers)
          const ipHash = hashIPSync(ipAddress)

          // Extract correlation IDs
          const proposalId = extractProposalId(pathname)
          const userId = extractUserId(request.headers)

          // Create analytics event with Zod schema validation
          // Type narrowing: validationResult.success is true here (we're inside the if block)
          const validationErrors: string[] | undefined = undefined // Always valid at this point

          const analyticsEvent = createAnalyticsEvent({
            requestId,
            pathname,
            method: request.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS',
            timestamp: new Date().toISOString(),
            userAgent: request.headers.get('user-agent') || undefined,
            ipHash,
            isValidRequest: true, // Always true here (validation passed)
            validationErrors,
            proposalId,
            userId,
          })

          // Validate with Zod schema (contract-first)
          const eventResult = analyticsEventSchema.safeParse(analyticsEvent)
          if (!eventResult.success) {
            console.error('Analytics event validation failed:', eventResult.error.issues)
            return // Don't send invalid events
          }
          const validatedEvent = eventResult.data

          // Send to self-hosted analytics endpoint
          await fetch(env.ANALYTICS_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(env.ANALYTICS_API_KEY && {
                Authorization: `Bearer ${env.ANALYTICS_API_KEY}`,
              }),
            },
            body: JSON.stringify(validatedEvent),
          })
        } catch (error) {
          // Don't throw - background task failures shouldn't affect response
          if (env.NODE_ENV === 'development') {
            console.error('Analytics logging failed:', error)
          }
        }
      })()
    )
  }

  // Continue with validated request
  // Following Next.js best practice: Forward request headers to downstream handlers
  const response = NextResponse.next({
    request: {
      // New request headers (available to route handlers and Server Components)
      headers: requestHeaders,
    },
  })

  // Set response headers (available to client)
  // Following Next.js best practice: Set response headers for client
  response.headers.set('x-proxy-validated', 'true')
  response.headers.set('x-request-id', requestHeaders.get('x-request-id')!)

  return response
}

/**
 * Proxy configuration
 *
 * Defines which routes the proxy should run on.
 * Following Next.js best practices for matcher patterns.
 *
 * Best practices:
 * - Exclude API routes (handled separately)
 * - Exclude static files (_next/static)
 * - Exclude image optimization (_next/image)
 * - Exclude metadata files (favicon, robots, sitemap)
 * - Exclude Next.js data routes (_next/data) for security
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled by route handlers)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/data (Next.js data routes - excluded for security)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|_next/data|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
