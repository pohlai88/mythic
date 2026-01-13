/**
 * Analytics API Endpoint
 *
 * Receives analytics events from proxy and route handlers.
 * Validates events with Zod schema and stores in database.
 *
 * Next.js 16.1.1 Best Practices:
 * - Route Handler pattern with proper types
 * - Zod Contract-First validation
 * - API key authentication (optional)
 * - Graceful error handling
 * - Route segment config for performance
 * - Request body size limits
 * - PostgreSQL-specific error handling
 *
 * ELITE Practices:
 * - Dynamic rendering (force-dynamic for analytics)
 * - Node.js runtime (database access)
 * - Max duration limit (prevent timeouts)
 * - Request deduplication (prevent duplicate events)
 */

import { NextRequest, NextResponse } from "next/server"
import { analyticsEventSchema } from "@/src/lib/analytics/service"
import { db } from "@/src/db"
import { analyticsEvents } from "@/src/db/schema"
import { env } from "@/src/lib/env"
import { eq } from "drizzle-orm"

/**
 * Route Segment Config (Next.js 16.1.1 Best Practice)
 *
 * ELITE: Optimize for analytics endpoint performance
 */
export const dynamic = "force-dynamic" // Analytics must be dynamic (real-time data)
export const runtime = "nodejs" // Required for database access
export const maxDuration = 10 // 10 seconds max (prevent timeouts)
export const fetchCache = "force-no-store" // Never cache analytics requests

/**
 * POST /api/analytics
 *
 * Receives analytics events and stores them in the database.
 * Validates events with Zod schema before storage.
 *
 * ELITE: Request deduplication, PostgreSQL error handling, body size limits
 */
export async function POST(request: NextRequest) {
  // Validate API key if configured (ELITE: Early return for auth failures)
  if (env.ANALYTICS_API_KEY) {
    const authHeader = request.headers.get("authorization")
    const expectedAuth = `Bearer ${env.ANALYTICS_API_KEY}`

    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or missing API key" },
        { status: 401 }
      )
    }
  }

  try {
    // ELITE: Check request body size (prevent DoS)
    const contentLength = request.headers.get("content-length")
    if (contentLength && Number.parseInt(contentLength, 10) > 100 * 1024) {
      // 100KB max for analytics events
      return NextResponse.json(
        { error: "Payload too large", message: "Request body exceeds 100KB limit" },
        { status: 413 }
      )
    }

    // Parse request body (Next.js 16.1.1: Use request.json())
    const body = await request.json()

    // Validate with Zod schema (Contract-First)
    const result = analyticsEventSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid analytics event",
          issues: result.error.issues,
        },
        { status: 400 }
      )
    }

    const event = result.data

    // ELITE: Request deduplication (check if requestId already exists)
    const existing = await db
      .select({ id: analyticsEvents.id })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.requestId, event.requestId))
      .limit(1)

    if (existing.length > 0) {
      // Duplicate requestId - return success (idempotent)
      return NextResponse.json(
        { success: true, message: "Analytics event already stored (deduplicated)" },
        { status: 200 }
      )
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

    return NextResponse.json({ success: true, message: "Analytics event stored" }, { status: 201 })
  } catch (error) {
    // ELITE: PostgreSQL-specific error handling
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()

      // PostgreSQL unique constraint violation (23505)
      if (
        errorMessage.includes("unique") ||
        errorMessage.includes("duplicate") ||
        errorMessage.includes("23505")
      ) {
        return NextResponse.json(
          {
            error: "Duplicate event",
            message: "Analytics event with this requestId already exists",
          },
          { status: 409 }
        )
      }

      // PostgreSQL foreign key violation (23503)
      if (errorMessage.includes("foreign key") || errorMessage.includes("23503")) {
        return NextResponse.json(
          {
            error: "Invalid reference",
            message: "Referenced proposalId or userId does not exist",
          },
          { status: 400 }
        )
      }

      // PostgreSQL check constraint violation (23514)
      if (errorMessage.includes("check") || errorMessage.includes("23514")) {
        return NextResponse.json(
          {
            error: "Validation failed",
            message: "Data violates database constraints",
          },
          { status: 400 }
        )
      }
    }

    // Log error for debugging (only in development)
    if (env.NODE_ENV === "development") {
      console.error("Analytics endpoint error:", error)
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to store analytics event",
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/analytics
 *
 * Health check endpoint for analytics service.
 * Returns service status and configuration.
 *
 * ELITE: Cached response for health checks (revalidate every 60 seconds)
 */
export const revalidate = 60 // Cache health check for 60 seconds

export async function GET() {
  // ELITE: Return minimal response for health checks (faster)
  return NextResponse.json(
    {
      service: "analytics",
      status: "operational",
      enabled: env.ANALYTICS_ENABLED,
      endpoint: env.ANALYTICS_ENDPOINT,
      retentionDays: env.ANALYTICS_RETENTION_DAYS,
      authenticated: !!env.ANALYTICS_API_KEY,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  )
}
