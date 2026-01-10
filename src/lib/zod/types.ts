/**
 * Mandatory Zod v4 Type Definitions
 *
 * These types enforce mandatory Zod patterns at the type level.
 * All schemas MUST comply with these patterns.
 *
 * @see https://zod.dev - Zod v4 Official Documentation
 */

import type { z } from 'zod/v4'

/**
 * MANDATORY: All schema exports MUST use this type
 * Enforces that schemas are properly typed with z.infer
 */
export type MandatorySchema<T extends z.ZodTypeAny> = {
  schema: T
  type: z.infer<T>
}

/**
 * MANDATORY: Schema registry pattern
 * All schemas MUST be registered here
 */
export interface MandatorySchemaRegistry {
  [key: string]: z.ZodTypeAny
}

/**
 * MANDATORY: Error handling type
 * Zod v4 uses .issues instead of .errors
 */
export type MandatoryZodError = z.ZodError

/**
 * MANDATORY: Type inference helper
 * All types MUST use this pattern
 */
export type InferMandatorySchema<T extends z.ZodTypeAny> = z.infer<T>

/**
 * MANDATORY: Input/Output type inference
 * Use for form inputs vs validated outputs
 */
export type InferInput<T extends z.ZodTypeAny> = z.input<T>
export type InferOutput<T extends z.ZodTypeAny> = z.output<T>

/**
 * MANDATORY: Safe parse result type
 * Represents the result of safeParse operation
 */
export type SafeParseResult<T> = { success: true; data: T } | { success: false; error: z.ZodError }
