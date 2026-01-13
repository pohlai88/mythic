/**
 * Domain Core - Proxy Pattern
 *
 * Standardized Proxy pattern for Next.js 16 Edge Runtime
 * Following KISS and DRY principles
 *
 * Usage:
 *   import { createDomainProxy } from '@mythic/domain-core/proxy'
 */

import { NextRequest, NextResponse } from "next/server"
import { z as z4 } from "zod/v4"
import type { ZodSchema } from "zod/v4"

/**
 * Proxy Config
 */
export interface ProxyConfig {
  /**
   * Request validation schema
   */
  requestSchema?: ZodSchema
  /**
   * Paths to exclude from proxy
   */
  excludePaths?: string[]
  /**
   * Custom handler
   */
  handler?: (request: NextRequest) => Promise<NextResponse | null> | NextResponse | null
}

/**
 * Create a domain proxy
 *
 * KISS: Simple proxy with validation
 * DRY: Reusable pattern for all domains
 */
export function createDomainProxy(config: ProxyConfig = {}) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Skip excluded paths
    if (config.excludePaths) {
      const pathname = request.nextUrl.pathname
      if (config.excludePaths.some((exclude) => pathname.startsWith(exclude))) {
        return NextResponse.next()
      }
    }

    // Validate request if schema provided
    if (config.requestSchema) {
      try {
        const requestData = {
          method: request.method,
          url: request.url,
          headers: Object.fromEntries(request.headers.entries()),
        }
        config.requestSchema.parse(requestData)
      } catch (error) {
        if (error instanceof z4.ZodError) {
          return NextResponse.json(
            {
              error: "Invalid request",
              issues: error.issues,
            },
            { status: 400 }
          )
        }
      }
    }

    // Call custom handler if provided
    if (config.handler) {
      const result = await config.handler(request)
      if (result) {
        return result
      }
    }

    // Add validation header
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-validated-by-proxy", "true")
    requestHeaders.set("x-request-id", crypto.randomUUID())

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
}
