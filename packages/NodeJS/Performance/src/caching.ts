/**
 * Caching Strategies
 *
 * KISS: Simple caching utilities
 * DRY: Reusable across all domains
 */

/**
 * Cache Strategy Config
 */
export interface CacheConfig {
  /**
   * Cache key prefix
   */
  keyPrefix?: string
  /**
   * Cache time in seconds
   */
  cacheTime?: number
  /**
   * Stale time in seconds
   */
  staleTime?: number
}

/**
 * Create cache strategy
 *
 * KISS: Simple cache configuration
 * Note: Actual caching is handled by React Query or Next.js cache
 * This is just a configuration helper
 */
export function createCacheStrategy(config: CacheConfig = {}) {
  return {
    keyPrefix: config.keyPrefix || "cache",
    cacheTime: config.cacheTime || 5 * 60, // 5 minutes default
    staleTime: config.staleTime || 1 * 60, // 1 minute default
    getKey: (key: string): string => {
      return `${config.keyPrefix || "cache"}:${key}`
    },
  }
}
