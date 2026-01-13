/**
 * Mandatory Zod v4 Schema Patterns
 *
 * These patterns MUST be used for all schema definitions.
 * They enforce mandatory Zod v4 features and ensure consistency.
 *
 * @see https://zod.dev - Zod v4 Official Documentation
 */

import { z as z4 } from "zod/v4"
import {
  createMandatoryArray,
  createMandatoryEnum,
  createMandatoryNumber,
  createMandatoryObject,
  createMandatoryString,
} from "../zod/helpers"

// ============================================================================
// MANDATORY PATTERNS - Use these as templates
// ============================================================================

/**
 * MANDATORY PATTERN: String with validation
 *
 * MUST include: min, max, email (if applicable), describe
 */
export const mandatoryStringPattern = {
  email: () =>
    createMandatoryString({
      min: 1,
      max: 255,
      email: true,
      description: "Email address",
    }),

  name: () =>
    createMandatoryString({
      min: 1,
      max: 255,
      description: "Name",
    }),

  password: () =>
    createMandatoryString({
      min: 8,
      max: 255,
      description: "Password",
    }),

  datetime: () =>
    createMandatoryString({
      datetime: true,
      description: "ISO datetime string",
    }),
} as const

/**
 * MANDATORY PATTERN: Number with validation
 *
 * MUST include: int (if applicable), positive (if applicable), describe
 */
export const mandatoryNumberPattern = {
  id: () =>
    createMandatoryNumber({
      int: true,
      positive: true,
      description: "ID",
    }),

  page: () =>
    createMandatoryNumber({
      int: true,
      positive: true,
      min: 1,
      description: "Page number",
    }),

  limit: () =>
    createMandatoryNumber({
      int: true,
      positive: true,
      min: 1,
      max: 100,
      description: "Items per page",
    }),
} as const

/**
 * MANDATORY PATTERN: Enum
 *
 * MUST include: describe
 * Zod v4: Use 'as const' for proper type inference
 */
export const mandatoryEnumPattern = {
  order: () => createMandatoryEnum(["asc", "desc"] as const, "Sort order"),

  status: () => createMandatoryEnum(["active", "inactive", "pending"] as const, "Status"),
} as const

/**
 * MANDATORY PATTERN: Object schema
 *
 * MUST include: describe, use extend for extensions, use partial for updates
 */
export const mandatoryObjectPattern = {
  /**
   * Base object with description
   */
  base: <T extends z4.ZodRawShape>(shape: T, description: string) =>
    createMandatoryObject(shape, description),

  /**
   * Extended object (MUST use extend)
   */
  extended: <T extends z4.ZodRawShape, E extends z4.ZodRawShape>(
    base: z4.ZodObject<T>,
    extension: E,
    description: string
  ) => base.extend(extension).describe(description),

  /**
   * Partial object for updates (MUST use partial)
   */
  partial: <T extends z4.ZodRawShape>(base: z4.ZodObject<T>, description: string) =>
    base.partial().describe(description),
} as const

/**
 * MANDATORY PATTERN: Array schema
 *
 * MUST include: describe
 */
export const mandatoryArrayPattern = {
  /**
   * Array with description
   */
  array: <T extends z4.ZodTypeAny>(itemSchema: T, description: string) =>
    createMandatoryArray(itemSchema, description),
} as const

/**
 * MANDATORY PATTERN: Coercion
 *
 * MUST use z.coerce.number() for query parameters
 */
export const mandatoryCoercionPattern = {
  /**
   * Coerce number from string (MUST use for query params)
   */
  number: (options: {
    int?: boolean
    positive?: boolean
    min?: number
    max?: number
    description: string
  }) => {
    let schema = z4.coerce.number()
    if (options.int) schema = schema.int()
    if (options.positive) schema = schema.positive()
    if (options.min !== undefined) schema = schema.min(options.min)
    if (options.max !== undefined) schema = schema.max(options.max)
    return schema.describe(options.description)
  },
} as const

/**
 * MANDATORY PATTERN: Wrapper methods
 *
 * MUST use: optional, nullable, default
 *
 * Note: For default values, use schema.default() directly as Zod v4
 * has strict type requirements that are difficult to wrap generically.
 */
export const mandatoryWrapperPattern = {
  /**
   * Optional field (MUST use for optional fields)
   */
  optional: <T extends z4.ZodTypeAny>(schema: T) => schema.optional(),

  /**
   * Nullable field (MUST use for nullable fields)
   */
  nullable: <T extends z4.ZodTypeAny>(schema: T) => schema.nullable(),

  /**
   * Nullish field (optional + nullable)
   */
  nullish: <T extends z4.ZodTypeAny>(schema: T) => schema.nullish(),
} as const

/**
 * MANDATORY PATTERN: Type inference
 *
 * MUST use z.infer<typeof schema> for all types
 */
export type MandatoryInfer<T extends z4.ZodTypeAny> = z4.infer<T>

/**
 * MANDATORY PATTERN: Error handling
 *
 * Zod v4: Use .issues instead of .errors
 */
export type MandatoryError = z4.ZodError

/**
 * MANDATORY PATTERN: Safe parse
 *
 * MUST use safeParse instead of parse for better error handling
 */
export function mandatorySafeParse<T extends z4.ZodTypeAny>(schema: T, input: unknown) {
  const result = schema.safeParse(input)
  if (result.success) {
    return { success: true as const, data: result.data as z4.infer<T> }
  }
  return { success: false as const, error: result.error }
}
