/**
 * Next.js Cache Validation
 *
 * Contract-First approach: Validate all cached data with Zod
 * Ensures cache integrity by validating data against schemas on retrieval.
 */

import { z as z4 } from "zod/v4"
import { unstable_cache } from "next/cache"

/**
 * Cache options type
 */
export type CacheOptions = Parameters<typeof unstable_cache>[2]

/**
 * Create a validated cache wrapper
 *
 * Wraps Next.js unstable_cache with Zod validation to ensure
 * cached data matches the expected schema.
 *
 * @example
 * ```typescript
 * const getCachedProposals = createValidatedCache(
 *   proposalListResponseSchema,
 *   async (filters) => {
 *     return await db.select().from(proposals).where(...)
 *   },
 *   { tags: ['proposals'], revalidate: 60 }
 * )
 * ```
 */
export function createValidatedCache<
  TSchema extends z4.ZodTypeAny,
  TArgs extends readonly unknown[],
>(schema: TSchema, fn: (...args: TArgs) => Promise<z4.infer<TSchema>>, options?: CacheOptions) {
  return unstable_cache(
    async (...args: TArgs) => {
      const result = await fn(...args)

      // Validate cached result matches schema
      const validationResult = schema.safeParse(result)

      if (!validationResult.success) {
        // Log error in development, throw in production
        if (process.env.NODE_ENV === "development") {
          console.error("Cache validation failed:", validationResult.error.issues)
        }
        // Re-throw to prevent invalid cached data from being used
        throw new Error(
          `Cache validation failed: ${validationResult.error.issues[0]?.message || "Invalid cached data"}`
        )
      }

      return validationResult.data
    },
    options?.tags || [],
    options
  )
}

/**
 * Create a validated cache with error recovery
 *
 * Similar to createValidatedCache but uses .catch() to provide
 * a fallback value if validation fails.
 */
export function createValidatedCacheWithFallback<
  TSchema extends z4.ZodTypeAny,
  TArgs extends readonly unknown[],
>(
  schema: TSchema,
  fn: (...args: TArgs) => Promise<z4.infer<TSchema>>,
  fallback: z4.infer<TSchema>,
  options?: CacheOptions
) {
  return unstable_cache(
    async (...args: TArgs) => {
      try {
        const result = await fn(...args)
        const validationResult = schema.safeParse(result)

        if (!validationResult.success) {
          console.warn("Cache validation failed, using fallback:", validationResult.error.issues)
          return fallback
        }

        return validationResult.data
      } catch (error) {
        console.error("Cache function error, using fallback:", error)
        return fallback
      }
    },
    options?.tags || [],
    options
  )
}
