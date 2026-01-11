/**
 * Validated Form Actions with Zod
 * 
 * Contract-First approach: Validate form actions with Zod
 * Provides type-safe form actions using Next.js useActionState hook.
 */

'use client'

import { z as z4 } from 'zod/v4'
import { useActionState, useTransition } from 'react'

/**
 * Form action result type
 */
export type FormActionResult<TData = unknown> =
  | { success: true; data?: TData; error?: never; issues?: never }
  | { success: false; error: string; issues?: z4.ZodIssue[]; data?: never }

/**
 * Form action state
 */
export interface FormActionState {
  success: boolean
  error?: string
  issues?: z4.ZodIssue[]
  data?: unknown
}

/**
 * Hook for validated form actions
 * 
 * Wraps a server action with Zod validation for form inputs.
 * Provides type-safe form handling with validation errors.
 * 
 * @example
 * ```typescript
 * const { state, formAction, isPending } = useValidatedFormAction(
 *   createProposalInputSchema,
 *   createProposal
 * )
 * 
 * <form action={formAction}>
 *   {state.issues?.map(issue => (
 *     <div key={issue.path.join('.')}>{issue.message}</div>
 *   ))}
 * </form>
 * ```
 */
export function useValidatedFormAction<TSchema extends z4.ZodTypeAny>(
  schema: TSchema,
  action: (input: z4.infer<TSchema>) => Promise<FormActionResult>
) {
  const [isPending, startTransition] = useTransition()
  
  const [state, formAction] = useActionState(
    async (
      prevState: FormActionState,
      formData: FormData
    ): Promise<FormActionState> => {
      // Extract form data
      const rawInput = Object.fromEntries(formData.entries())
      
      // Validate with Zod schema
      const result = schema.safeParse(rawInput)
      
      if (!result.success) {
        // Return validation errors
        return {
          success: false,
          error: 'Validation failed',
          issues: result.error.issues,
        }
      }

      try {
        // Execute action with validated input
        const actionResult = await action(result.data)
        
        if (actionResult.success) {
          return {
            success: true,
            data: actionResult.data,
          }
        } else {
          return {
            success: false,
            error: actionResult.error,
            issues: actionResult.issues,
          }
        }
      } catch (error) {
        // Handle action errors
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },
    { success: false } // Initial state
  )

  return {
    state,
    formAction,
    isPending,
  }
}

/**
 * Helper to convert FormData to object with proper types
 * 
 * Handles multi-value fields and type coercion.
 */
export function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {}
  
  for (const [key, value] of formData.entries()) {
    // Handle multiple values for the same key
    if (obj[key]) {
      const existing = obj[key]
      if (Array.isArray(existing)) {
        existing.push(value)
      } else {
        obj[key] = [existing, value]
      }
    } else {
      obj[key] = value
    }
  }
  
  return obj
}
