/**
 * Domain Core - Route Handler Pattern
 *
 * Standardized Route Handler pattern for Next.js 16 App Router
 * Following KISS and DRY principles
 *
 * Usage:
 *   import { createValidatedRoute } from '@mythic/domain-core/route-handler'
 */

import { NextRequest, NextResponse } from "next/server"
import { z as z4 } from "zod/v4"
import type { ZodSchema, ZodTypeAny } from "zod/v4"

/**
 * Route Handler Schema
 */
export interface RouteSchema<
  TParams = unknown,
  TQuery = unknown,
  TBody = unknown,
  TResponse = unknown,
> {
  params?: ZodSchema<TParams>
  query?: ZodSchema<TQuery>
  body?: ZodSchema<TBody>
  response?: ZodSchema<TResponse>
}

/**
 * Route Handler Context
 */
export interface RouteContext<TParams = unknown, TQuery = unknown, TBody = unknown> {
  params: TParams
  query: TQuery
  body: TBody
  request: NextRequest
}

/**
 * Route Handler Error (for custom error responses)
 */
export class RouteHandlerError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public data?: Record<string, unknown>
  ) {
    super(message)
    this.name = "RouteHandlerError"
  }
}

/**
 * Route Handler Function
 */
export type RouteHandler<
  TParams = unknown,
  TQuery = unknown,
  TBody = unknown,
  TResponse = unknown,
> = (context: RouteContext<TParams, TQuery, TBody>) => Promise<TResponse> | TResponse

/**
 * Create a validated Route Handler
 *
 * KISS: Simple wrapper that validates and handles errors
 * DRY: Reusable pattern for all Route Handlers
 */
export function createValidatedRoute<
  TParams = unknown,
  TQuery = unknown,
  TBody = unknown,
  TResponse = unknown,
>(
  schema: RouteSchema<TParams, TQuery, TBody, TResponse>,
  handler: RouteHandler<TParams, TQuery, TBody, TResponse>
) {
  return async (
    request: NextRequest,
    { params }: { params: Promise<Record<string, string>> | Record<string, string> }
  ): Promise<NextResponse> => {
    try {
      // Parse params (Next.js 16: params is a Promise)
      const resolvedParams = params instanceof Promise ? await params : params
      const validatedParams = (
        schema.params
          ? (schema.params.parse(resolvedParams) as TParams)
          : (resolvedParams as TParams)
      ) as TParams

      // Parse query string
      const { searchParams } = new URL(request.url)
      const queryObj = Object.fromEntries(searchParams.entries())
      const validatedQuery = schema.query
        ? (schema.query.parse(queryObj) as TQuery)
        : (queryObj as TQuery)

      // Parse body (if POST/PUT/PATCH)
      let validatedBody = undefined as TBody | undefined
      if (["POST", "PUT", "PATCH"].includes(request.method)) {
        const body = await request.json().catch(() => ({}))
        validatedBody = schema.body ? (schema.body.parse(body) as TBody) : (body as TBody)
      }

      // Call handler
      const result = await handler({
        params: validatedParams,
        query: validatedQuery,
        body: validatedBody as TBody,
        request,
      })

      // If handler returns NextResponse, return it directly
      if (result instanceof NextResponse) {
        return result
      }

      // Validate response if schema provided
      if (schema.response) {
        const validatedResponse = schema.response.parse(result)
        return NextResponse.json(validatedResponse)
      }

      return NextResponse.json(result)
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z4.ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            issues: error.issues,
          },
          { status: 400 }
        )
      }

      // Handle other errors
      if (error instanceof Error) {
        return NextResponse.json(
          {
            error: "Internal server error",
            message: error.message,
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          error: "Internal server error",
          message: "Unknown error occurred",
        },
        { status: 500 }
      )
    }
  }
}
