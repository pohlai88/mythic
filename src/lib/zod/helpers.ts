/**
 * Mandatory Zod v4 Helper Functions
 *
 * These helpers enforce mandatory patterns and provide
 * type-safe wrappers for common Zod v4 operations.
 *
 * @see https://zod.dev - Zod v4 Official Documentation
 */

import { z as z4 } from 'zod/v4'

/**
 * MANDATORY: Create string schema with required validations
 *
 * @example
 * const emailSchema = createMandatoryString({
 *   min: 1,
 *   max: 255,
 *   email: true,
 *   trim: true,
 *   description: 'User email address'
 * })
 */
export function createMandatoryString(options: {
  min?: number
  max?: number
  email?: boolean
  datetime?: boolean
  url?: boolean
  uuid?: boolean
  trim?: boolean
  toLowerCase?: boolean
  regex?: RegExp
  description: string
}) {
  let schema = z4.string()

  if (options.trim) {
    schema = schema.trim()
  }

  if (options.toLowerCase) {
    schema = schema.toLowerCase()
  }

  if (options.min !== undefined) {
    schema = schema.min(options.min)
  }

  if (options.max !== undefined) {
    schema = schema.max(options.max)
  }

  if (options.email) {
    schema = schema.email()
  }

  if (options.datetime) {
    schema = schema.datetime()
  }

  if (options.url) {
    schema = schema.url()
  }

  if (options.uuid) {
    schema = schema.uuid()
  }

  if (options.regex) {
    schema = schema.regex(options.regex)
  }

  return schema.describe(options.description)
}

/**
 * MANDATORY: Create number schema with required validations
 *
 * @example
 * const idSchema = createMandatoryNumber({
 *   int: true,
 *   positive: true,
 *   description: 'User ID'
 * })
 */
export function createMandatoryNumber(options: {
  min?: number
  max?: number
  int?: boolean
  positive?: boolean
  description: string
}) {
  let schema = z4.number()

  if (options.min !== undefined) {
    schema = schema.min(options.min)
  }

  if (options.max !== undefined) {
    schema = schema.max(options.max)
  }

  if (options.int) {
    schema = schema.int()
  }

  if (options.positive) {
    schema = schema.positive()
  }

  return schema.describe(options.description)
}

/**
 * MANDATORY: Create object schema with required patterns
 *
 * @example
 * const userSchema = createMandatoryObject({
 *   email: z.string().email(),
 *   name: z.string().min(1)
 * }, 'User object')
 */
export function createMandatoryObject<T extends z4.ZodRawShape>(shape: T, description: string) {
  return z4.object(shape).describe(description)
}

/**
 * MANDATORY: Create array schema with required patterns
 *
 * @example
 * const usersSchema = createMandatoryArray(
 *   userSchema,
 *   'Array of users'
 * )
 */
export function createMandatoryArray<T extends z4.ZodTypeAny>(itemSchema: T, description: string) {
  return z4.array(itemSchema).describe(description)
}

/**
 * MANDATORY: Create enum schema with required patterns
 *
 * Zod v4 uses readonly tuple for enum values
 *
 * @example
 * const orderSchema = createMandatoryEnum(
 *   ['asc', 'desc'] as const,
 *   'Sort order'
 * )
 */
export function createMandatoryEnum<const T extends readonly [string, ...string[]]>(
  values: T,
  description: string
) {
  return z4.enum(values).describe(description)
}

/**
 * MANDATORY: Safe parse wrapper
 * All parsing MUST use safeParse for error handling
 *
 * Zod v4: Uses .issues instead of .errors
 *
 * @example
 * const result = mandatorySafeParse(userSchema, input)
 * if (!result.success) {
 *   // Access issues with result.error.issues
 *   return handleError(result.error)
 * }
 */
export function mandatorySafeParse<T extends z4.ZodTypeAny>(schema: T, input: unknown) {
  const result = schema.safeParse(input)
  if (result.success) {
    return { success: true as const, data: result.data as z4.infer<T> }
  }
  return { success: false as const, error: result.error }
}

/**
 * MANDATORY: Async safe parse wrapper
 * Use for schemas with async refinements or transforms
 *
 * @example
 * const result = await mandatorySafeParseAsync(userSchema, input)
 * if (!result.success) {
 *   return handleError(result.error)
 * }
 */
export async function mandatorySafeParseAsync<T extends z4.ZodTypeAny>(
  schema: T,
  input: unknown
) {
  const result = await schema.safeParseAsync(input)
  if (result.success) {
    return { success: true as const, data: result.data as z4.infer<T> }
  }
  return { success: false as const, error: result.error }
}

/**
 * MANDATORY: Type inference helper
 * All types MUST use this pattern
 *
 * @example
 * type User = InferMandatory<typeof userSchema>
 */
export type InferMandatory<T extends z4.ZodTypeAny> = z4.infer<T>

/**
 * MANDATORY: Schema registry helper
 * All schemas MUST be registered
 *
 * @example
 * const registry = createMandatoryRegistry({
 *   user: userSchema,
 *   product: productSchema
 * })
 */
export function createMandatoryRegistry<T extends Record<string, z4.ZodTypeAny>>(schemas: T): T {
  return schemas
}

/**
 * MANDATORY: Record schema with explicit key and value types
 *
 * Zod v4 requires both key and value schemas for z.record()
 * Key must be a string-compatible schema (ZodString, ZodEnum, etc.)
 *
 * @example
 * const metadataSchema = createMandatoryRecord(
 *   z.string(),
 *   z.unknown(),
 *   'Metadata key-value pairs'
 * )
 */
export function createMandatoryRecord<V extends z4.ZodTypeAny>(valueSchema: V, description: string) {
  return z4.record(z4.string(), valueSchema).describe(description)
}
