/**
 * Domain Core - Server Action Pattern
 *
 * Standardized Server Action pattern for Next.js 16
 * Following KISS and DRY principles
 *
 * Usage:
 *   import { createValidatedAction } from '@mythic/domain-core/server-action'
 */

import { z as z4 } from "zod/v4"
import type { ZodSchema } from "zod/v4"
import { revalidatePath } from "next/cache"

/**
 * Server Action Function
 */
export type ServerAction<TInput = unknown, TOutput = unknown> = (
  input: TInput
) => Promise<TOutput> | TOutput

/**
 * Server Action Options
 */
export interface ServerActionOptions {
  /**
   * Paths to revalidate after action completes
   */
  revalidatePaths?: string[]
  /**
   * Custom error handler
   */
  onError?: (error: unknown) => void
}

/**
 * Create a validated Server Action
 *
 * KISS: Simple wrapper that validates input and handles errors
 * DRY: Reusable pattern for all Server Actions
 */
export function createValidatedAction<TInput = unknown, TOutput = unknown>(
  inputSchema: ZodSchema<TInput>,
  handler: ServerAction<TInput, TOutput>,
  options?: ServerActionOptions
) {
  return async (input: unknown): Promise<TOutput> => {
    try {
      // Validate input
      const validatedInput = inputSchema.parse(input)

      // Call handler
      const result = await handler(validatedInput)

      // Revalidate paths if provided
      if (options?.revalidatePaths) {
        for (const path of options.revalidatePaths) {
          revalidatePath(path)
        }
      }

      return result
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z4.ZodError) {
        if (options?.onError) {
          options.onError(error)
        }
        throw new Error(`Validation failed: ${error.issues.map((i) => i.message).join(", ")}`)
      }

      // Handle other errors
      if (options?.onError) {
        options.onError(error)
      }
      throw error
    }
  }
}
