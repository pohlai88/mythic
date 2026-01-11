/**
 * Next.js Route Handler Validation
 *
 * Contract-First approach: Validate all route handler inputs and outputs
 * Provides type-safe wrappers for Next.js Route Handlers with Zod validation.
 */

import { z as z4 } from 'zod/v4'
import { NextRequest, NextResponse } from 'next/server'
import { trackResponseMetrics } from '@/src/lib/analytics/tracking'

/**
 * Route handler context with validated inputs
 */
export interface RouteHandlerContext<
  TParams = Record<string, string>,
  TQuery = Record<string, unknown>,
  TBody = unknown
> {
  params: TParams
  query: TQuery
  body: TBody
  request: NextRequest
}

/**
 * Route handler configuration
 */
export interface RouteHandlerConfig<
  TParams extends z4.ZodTypeAny = z4.ZodTypeAny,
  TQuery extends z4.ZodTypeAny = z4.ZodTypeAny,
  TBody extends z4.ZodTypeAny = z4.ZodTypeAny,
  TResponse extends z4.ZodTypeAny = z4.ZodTypeAny
> {
  params?: TParams
  query?: TQuery
  body?: TBody
  response: TResponse
  handler: (
    ctx: RouteHandlerContext<
      TParams extends z4.ZodTypeAny ? z4.infer<TParams> : Record<string, string>,
      TQuery extends z4.ZodTypeAny ? z4.infer<TQuery> : Record<string, unknown>,
      TBody extends z4.ZodTypeAny ? z4.infer<TBody> : unknown
    >
  ) => Promise<z4.infer<TResponse>>
}

/**
 * Create a validated route handler
 *
 * Wraps a Next.js route handler with input and output validation.
 * Validates params, query string, body, and response.
 *
 * @example
 * ```typescript
 * export const GET = createValidatedRoute({
 *   query: proposalQuerySchema,
 *   response: proposalListResponseSchema,
 *   handler: async ({ query }) => {
 *     return await getProposals(query)
 *   },
 * })
 * ```
 */
export function createValidatedRoute<
  TParams extends z4.ZodTypeAny = z4.ZodTypeAny,
  TQuery extends z4.ZodTypeAny = z4.ZodTypeAny,
  TBody extends z4.ZodTypeAny = z4.ZodTypeAny,
  TResponse extends z4.ZodTypeAny = z4.ZodTypeAny
>(config: RouteHandlerConfig<TParams, TQuery, TBody, TResponse>) {
  return async (
    req: NextRequest,
    { params }: { params: Promise<Record<string, string>> }
  ) => {
    // Performance tracking: Start timer
    const startTime = Date.now()
    const requestId = req.headers.get('x-request-id') || crypto.randomUUID()
    const pathname = req.nextUrl.pathname
    const method = req.method

    try {
      // Validate params
      const rawParams = await params
      let validatedParams = rawParams
      if (config.params) {
        const paramsResult = config.params.safeParse(rawParams)
        if (!paramsResult.success) {
          const response = NextResponse.json(
            {
              error: 'Invalid route parameters',
              issues: paramsResult.error.issues,
            },
            { status: 400 }
          )
          trackResponseMetrics({
            requestId,
            pathname,
            method,
            statusCode: 400,
            responseTime: Date.now() - startTime,
            requestHeaders: req.headers,
            startTime,
          }).catch(() => {})
          return response
        }
        validatedParams = paramsResult.data as Record<string, string>
      }

      // Validate query string
      const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries())
      let validatedQuery: Record<string, unknown> = searchParams
      if (config.query) {
        const queryResult = config.query.safeParse(searchParams)
        if (!queryResult.success) {
          const response = NextResponse.json(
            {
              error: 'Invalid query parameters',
              issues: queryResult.error.issues,
            },
            { status: 400 }
          )
          trackResponseMetrics({
            requestId,
            pathname,
            method,
            statusCode: 400,
            responseTime: Date.now() - startTime,
            requestHeaders: req.headers,
            startTime,
          }).catch(() => {})
          return response
        }
        validatedQuery = queryResult.data as Record<string, unknown>
      }

      // Validate body (for POST, PUT, PATCH, etc.)
      let validatedBody: unknown = {}
      if (config.body && req.method !== 'GET' && req.method !== 'HEAD') {
        try {
          const rawBody = await req.json()
          const bodyResult = config.body.safeParse(rawBody)
          if (!bodyResult.success) {
            const response = NextResponse.json(
              {
                error: 'Invalid request body',
                issues: bodyResult.error.issues,
              },
              { status: 400 }
            )

            // Track metrics (non-blocking)
            trackResponseMetrics({
              requestId,
              pathname,
              method,
              statusCode: 400,
              responseTime: Date.now() - startTime,
              requestHeaders: req.headers,
              startTime,
            }).catch(() => {})

            return response
          }
          validatedBody = bodyResult.data
        } catch (error) {
          // If JSON parsing fails, return error
          const response = NextResponse.json(
            {
              error: 'Invalid JSON in request body',
              message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 400 }
          )

          // Track metrics (non-blocking)
          trackResponseMetrics({
            requestId,
            pathname,
            method,
            statusCode: 400,
            responseTime: Date.now() - startTime,
            requestHeaders: req.headers,
            startTime,
          }).catch(() => {})

          return response
        }
      }

      // Execute handler with validated inputs
      const result = await config.handler({
        params: validatedParams as any,
        query: validatedQuery as any,
        body: validatedBody as any,
        request: req,
      })

      // Validate response
      const responseResult = config.response.safeParse(result)
      if (!responseResult.success) {
        // Log validation error but don't expose to client
        console.error('Response validation failed:', responseResult.error.issues)
        const response = NextResponse.json(
          {
            error: 'Internal server error',
            message: 'Response validation failed',
          },
          { status: 500 }
        )

        trackResponseMetrics({
          requestId,
          pathname,
          method,
          statusCode: 500,
          responseTime: Date.now() - startTime,
          requestHeaders: req.headers,
          startTime,
        }).catch(() => {})

        return response
      }
      const response = NextResponse.json(responseResult.data)

      // Track metrics (non-blocking)
      trackResponseMetrics({
        requestId,
        pathname,
        method,
        statusCode: response.status,
        responseTime: Date.now() - startTime,
        requestHeaders: req.headers,
        startTime,
      }).catch(() => {
        // Silently fail
      })

      return response
    } catch (error) {
      // Calculate response time
      const responseTime = Date.now() - startTime
      let statusCode = 500

      // Handle Zod validation errors
      if (error instanceof z4.ZodError) {
        statusCode = 400
        const response = NextResponse.json(
          {
            error: 'Validation failed',
            issues: error.issues,
          },
          { status: statusCode }
        )

        // Track metrics (non-blocking)
        trackResponseMetrics({
          requestId,
          pathname,
          method,
          statusCode,
          responseTime,
          requestHeaders: req.headers,
          startTime,
        }).catch(() => {
          // Silently fail
        })

        return response
      }

      // Handle other errors
      console.error('Route handler error:', error)
      const response = NextResponse.json(
        {
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: statusCode }
      )

      // Track metrics (non-blocking)
      trackResponseMetrics({
        requestId,
        pathname,
        method,
        statusCode,
        responseTime,
        requestHeaders: req.headers,
        startTime,
      }).catch(() => {
        // Silently fail
      })

      return response
    }
  }
}

/**
 * Create a simple GET route handler with query validation
 */
export function createGetRoute<
  TQuery extends z4.ZodTypeAny = z4.ZodTypeAny,
  TResponse extends z4.ZodTypeAny = z4.ZodTypeAny
>(config: {
  query?: TQuery
  response: TResponse
  handler: (ctx: RouteHandlerContext<Record<string, string>, TQuery extends z4.ZodTypeAny ? z4.infer<TQuery> : Record<string, unknown>, never>) => Promise<z4.infer<TResponse>>
}) {
  return createValidatedRoute({
    query: config.query,
    response: config.response,
    handler: config.handler as any,
  })
}

/**
 * Create a simple POST route handler with body validation
 */
export function createPostRoute<
  TBody extends z4.ZodTypeAny = z4.ZodTypeAny,
  TResponse extends z4.ZodTypeAny = z4.ZodTypeAny
>(config: {
  body: TBody
  response: TResponse
  handler: (ctx: RouteHandlerContext<Record<string, string>, Record<string, unknown>, z4.infer<TBody>>) => Promise<z4.infer<TResponse>>
}) {
  return createValidatedRoute({
    body: config.body,
    response: config.response,
    handler: config.handler as any,
  })
}
