/**
 * Domain Core - Query Pattern
 *
 * Standardized Query pattern for database queries
 * Following KISS and DRY principles
 *
 * Usage:
 *   import { createQuery } from '@mythic/domain-core/query'
 */

/**
 * Query Function
 */
export type QueryFunction<TResult = unknown> = () => Promise<TResult> | TResult

/**
 * Query Options
 */
export interface QueryOptions {
  /**
   * Cache key for query result
   */
  cacheKey?: string
  /**
   * Cache time in seconds
   */
  cacheTime?: number
}

/**
 * Create a query function
 *
 * KISS: Simple wrapper for query functions
 * DRY: Reusable pattern for all queries
 *
 * Note: Caching is handled by React Query or Next.js cache
 * This is just a type-safe wrapper
 */
export function createQuery<TResult = unknown>(
  queryFn: QueryFunction<TResult>,
  options?: QueryOptions
): QueryFunction<TResult> {
  return async () => {
    try {
      return await queryFn()
    } catch (error) {
      // Re-throw error for caller to handle
      throw error
    }
  }
}
