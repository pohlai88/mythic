/**
 * Server Action Validation Utilities
 * 
 * Contract-First approach: Validate all server action inputs and outputs
 * Provides type-safe wrappers and validation helpers for Next.js Server Actions.
 */

import { z as z4 } from 'zod/v4'

/**
 * Action result type for validated actions
 */
export type ActionResult<TData = unknown> =
  | { success: true; data: TData }
  | { success: false; error: string; issues?: z4.ZodIssue[] }

/**
 * Validate action input
 * 
 * Helper function to validate action inputs with Zod schemas.
 * Returns a result object that can be checked for success/error.
 */
export function validateActionInput<TSchema extends z4.ZodTypeAny>(
  input: unknown,
  schema: TSchema
): ActionResult<z4.infer<TSchema>> {
  const result = schema.safeParse(input)

  if (result.success) {
    return {
      success: true,
      data: result.data,
    }
  }

  return {
    success: false,
    error: 'Invalid input parameters',
    issues: result.error.issues,
  }
}

/**
 * Validate action output
 * 
 * Helper function to validate action outputs with Zod schemas.
 * Throws if output is invalid (should not happen in production).
 */
export function validateActionOutput<TSchema extends z4.ZodTypeAny>(
  output: unknown,
  schema: TSchema
): z4.infer<TSchema> {
  const result = schema.safeParse(output)

  if (!result.success) {
    // Log error in development, throw in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Invalid action output:', result.error.issues)
    }
    throw new Error('Invalid action output format')
  }

  return result.data
}

/**
 * Create a validated action handler
 * 
 * Wraps an action handler with input and output validation.
 * 
 * @example
 * ```typescript
 * const createProposalAction = createValidatedAction(
 *   createProposalInputSchema,
 *   createProposalResponseSchema,
 *   async (input) => {
 *     // Input is already validated and typed
 *     const result = await createProposal(input)
 *     return result
 *   }
 * )
 * ```
 */
export function createValidatedAction<
  TInputSchema extends z4.ZodTypeAny,
  TOutputSchema extends z4.ZodTypeAny,
>(
  inputSchema: TInputSchema,
  outputSchema: TOutputSchema,
  handler: (input: z4.infer<TInputSchema>) => Promise<z4.infer<TOutputSchema>>
) {
  return async (input: unknown): Promise<z4.infer<TOutputSchema>> => {
    // Validate input
    const inputResult = validateActionInput(input, inputSchema)
    if (!inputResult.success) {
      // Return error response matching output schema
      const errorResponse = outputSchema.safeParse({
        success: false,
        error: inputResult.error,
        issues: inputResult.issues,
      })
      
      if (errorResponse.success) {
        return errorResponse.data as z4.infer<TOutputSchema>
      }
      
      // Fallback error response
      throw new Error(`Input validation failed: ${inputResult.error}`)
    }

    try {
      // Execute handler with validated input
      const output = await handler(inputResult.data)
      
      // Validate output
      return validateActionOutput(output, outputSchema)
    } catch (error) {
      // Handle errors and return validated error response
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const errorResponse = outputSchema.safeParse({
        success: false,
        error: errorMessage,
      })
      
      if (errorResponse.success) {
        return errorResponse.data as z4.infer<TOutputSchema>
      }
      
      throw error
    }
  }
}

/**
 * Safe parse action input (non-throwing)
 * 
 * Returns a result object that can be checked without try/catch.
 */
export function safeParseActionInput<TSchema extends z4.ZodTypeAny>(
  input: unknown,
  schema: TSchema
): ReturnType<typeof schema.safeParse> {
  return schema.safeParse(input)
}
