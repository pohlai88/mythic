/**
 * Analytics API Endpoint - Refactored with @mythic/domain-core
 *
 * ⭐ ELITE: Demonstrates DRY principle using shared Route Handler pattern
 * This is a reference implementation showing how to use @mythic/domain-core
 *
 * Original: apps/boardroom/app/api/analytics/route.ts
 * Refactored: Using createValidatedRoute from @mythic/domain-core
 */

import { NextRequest, NextResponse } from 'next/server'
import { createValidatedRoute } from '@mythic/domain-core/route-handler'
import { z as z4 } from 'zod/v4'
import { analyticsEventSchema } from '@/src/lib/analytics/service'
import { db } from '@/src/db'
import { analyticsEvents } from '@/src/db/schema'
import { env } from '@/src/lib/env'
import { eq } from 'drizzle-orm'

/**
 * Route Segment Config (Next.js 16.1.1 Best Practice)
 */
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 10
export const fetchCache = 'force-no-store'

/**
 * Route Handler Schema
 */
const routeSchema = {
  body: analyticsEventSchema,
  response: z4.object({
    success: z4.boolean(),
    message: z4.string(),
  }),
}

/**
 * POST /api/analytics
 *
 * ⭐ ELITE: Using createValidatedRoute from @mythic/domain-core
 * Following DRY principle - shared pattern across all domains
 */
export const POST = createValidatedRoute(routeSchema, async ({ body, request }) => {
  // Validate API key if configured (before processing)
  if (env.ANALYTICS_API_KEY) {
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${env.ANALYTICS_API_KEY}`

    if (!authHeader || authHeader !== expectedAuth) {
      // Return error response (domain-core will handle it)
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or missing API key' },
        { status: 401 }
      )
    }
  }

  // Check request body size (prevent DoS)
  const contentLength = request.headers.get('content-length')
  if (contentLength && Number.parseInt(contentLength, 10) > 100 * 1024) {
    return NextResponse.json(
      { error: 'Payload too large', message: 'Request body exceeds 100KB limit' },
      { status: 413 }
    )
  }

  const event = body

  // Request deduplication (check if requestId already exists)
  const existing = await db
    .select({ id: analyticsEvents.id })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.requestId, event.requestId))
    .limit(1)

  if (existing.length > 0) {
    // Duplicate requestId - return success (idempotent)
    return {
      success: true,
      message: 'Analytics event already stored (deduplicated)',
    }
  }

  // Store in database
  await db.insert(analyticsEvents).values({
    requestId: event.requestId,
    pathname: event.pathname,
    method: event.method,
    timestamp: new Date(event.timestamp),
    responseTime: event.responseTime,
    statusCode: event.statusCode,
    userAgent: event.userAgent,
    ipHash: event.ipHash,
    country: event.country,
    isValidRequest: event.isValidRequest,
    validationErrors: event.validationErrors,
    proposalId: event.proposalId,
    userId: event.userId,
    metadata: event.metadata,
  })

  return {
    success: true,
    message: 'Analytics event stored',
  }
})

/**
 * GET /api/analytics
 *
 * Health check endpoint
 */
export const revalidate = 60

export async function GET() {
  return Response.json(
    {
      service: 'analytics',
      status: 'operational',
      enabled: env.ANALYTICS_ENABLED,
      endpoint: env.ANALYTICS_ENDPOINT,
      retentionDays: env.ANALYTICS_RETENTION_DAYS,
      authenticated: !!env.ANALYTICS_API_KEY,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    }
  )
}
