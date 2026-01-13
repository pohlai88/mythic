/**
 * Fuzzy Search Implementation — StratonHub
 *
 * Client-side fuzzy search using fuse.js with performance optimizations.
 *
 * Performance Optimizations:
 * - Pre-configured Fuse.js options
 * - Efficient result filtering and mapping
 * - Normalized string matching for deterministic results
 * - Type-safe result transformation
 *
 * Features:
 * - Weighted field matching (title, description, content, surface)
 * - Configurable score thresholds
 * - Result filtering by audience, surface, and type
 */

import Fuse from "fuse.js"
import type { SearchIndex, SearchOptions, SearchResult } from "@/lib/search/types"

// ============================================================================
// Constants
// ============================================================================

/**
 * Default search options
 *
 * - limit: Maximum number of results (10)
 * - threshold: Match threshold (0.3 = strict matching)
 * - minMatchCharLength: Minimum characters to match (2)
 */
const DEFAULT_OPTIONS: Required<Pick<SearchOptions, "limit" | "threshold" | "minMatchCharLength">> =
  {
    limit: 10,
    threshold: 0.3, // Lower = more strict matching
    minMatchCharLength: 2,
  } as const

/**
 * Default maximum score for filtering weak matches
 *
 * Lower values = stricter filtering (0.3-0.6 typical range)
 */
const DEFAULT_MAX_SCORE = 0.55

/**
 * Field weights for search relevance
 *
 * Higher weight = more important in search ranking
 */
const FIELD_WEIGHTS = {
  title: 0.4,
  description: 0.3,
  content: 0.2,
  surface: 0.1,
} as const

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Normalize strings for deterministic matching
 *
 * Converts to lowercase and trims whitespace for consistent comparison.
 *
 * @param v - Value to normalize (string, number, null, undefined)
 * @returns Normalized string (empty string if input is falsy)
 *
 * @example
 * ```ts
 * norm("  Hello World  ") // "hello world"
 * norm(null) // ""
 * norm(123) // "123"
 * ```
 */
function norm(v: unknown): string {
  return String(v ?? "")
    .trim()
    .toLowerCase()
}

// ============================================================================
// Search Functions
// ============================================================================

/**
 * Create fuzzy search instance with optimized configuration
 *
 * Configures Fuse.js with:
 * - Weighted field matching (title > description > content > surface)
 * - Score and match information included
 * - Location-agnostic matching
 * - All matches found (not just first)
 *
 * @param index - Array of search index items to search through
 * @returns Configured Fuse.js instance ready for searching
 *
 * @example
 * ```ts
 * const fuse = createFuzzySearch(searchIndex)
 * const results = search(fuse, "user guide")
 * ```
 */
export function createFuzzySearch(index: SearchIndex[]): Fuse<SearchIndex> {
  return new Fuse(index, {
    keys: [
      { name: "title", weight: FIELD_WEIGHTS.title },
      { name: "description", weight: FIELD_WEIGHTS.description },
      { name: "content", weight: FIELD_WEIGHTS.content },
      { name: "surface", weight: FIELD_WEIGHTS.surface },
    ],
    threshold: DEFAULT_OPTIONS.threshold,
    minMatchCharLength: DEFAULT_OPTIONS.minMatchCharLength,
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    findAllMatches: true,
  })
}

/**
 * Perform fuzzy search with optional score filtering
 *
 * Filters out weak matches based on score threshold to avoid "noisy truth".
 * Lower maxScore = stricter filtering (0.3-0.6 typical range).
 *
 * @param fuse - Configured Fuse.js instance
 * @param query - Search query string
 * @param options - Optional search configuration
 * @param options.limit - Maximum number of results (default: 10)
 * @param options.maxScore - Maximum score threshold (default: 0.55)
 * @returns Array of search results with scores and matches
 *
 * @example
 * ```ts
 * const results = search(fuse, "user guide", { limit: 20, maxScore: 0.4 })
 * ```
 */
export function search(
  fuse: Fuse<SearchIndex>,
  query: string,
  options?: SearchOptions & { maxScore?: number }
): SearchResult[] {
  const trimmedQuery = query?.trim()
  if (!trimmedQuery) {
    return []
  }

  const limit = options?.limit ?? DEFAULT_OPTIONS.limit
  const maxScore = options?.maxScore ?? DEFAULT_MAX_SCORE

  // Perform search with validated limit (ensure it's a number)
  const fuseResults = fuse.search(trimmedQuery, {
    limit: typeof limit === "number" ? limit : DEFAULT_OPTIONS.limit,
  })

  // Filter and transform results
  return fuseResults
    .filter((result) => {
      // Filter out results without scores or with scores above threshold
      return typeof result.score === "number" && result.score <= maxScore
    })
    .map((result) => {
      // Transform Fuse.js result to SearchResult format
      const searchResult: SearchResult = {
        item: result.item,
        score: result.score ?? undefined, // Ensure score is number or undefined
        matches: result.matches
          ? result.matches.map((match) => ({
              key: match.key || "",
              value: match.value || "",
              // Convert readonly RangeTuple[] to mutable [number, number][]
              indices: (match.indices || []).map((tuple): [number, number] => [tuple[0], tuple[1]]),
            }))
          : undefined,
      }

      return searchResult
    })
}

// ============================================================================
// Filter Functions
// ============================================================================

/**
 * Filter search results by audience
 *
 * @param results - Search results to filter
 * @param audience - Target audience (developers, users, business)
 * @returns Filtered results matching the specified audience
 *
 * @example
 * ```ts
 * const developerResults = filterByAudience(results, "developers")
 * ```
 */
export function filterByAudience(
  results: SearchResult[],
  audience?: "developers" | "users" | "business"
): SearchResult[] {
  if (!audience) {
    return results
  }
  return results.filter((result) => result.item.audience === audience)
}

/**
 * Filter search results by surface (normalized comparison)
 *
 * Uses normalized string comparison for case-insensitive matching.
 *
 * @param results - Search results to filter
 * @param surface - Surface/domain name to filter by
 * @returns Filtered results matching the specified surface
 *
 * @example
 * ```ts
 * const boardroomResults = filterBySurface(results, "boardroom")
 * ```
 */
export function filterBySurface(results: SearchResult[], surface?: string): SearchResult[] {
  const normalizedSurface = norm(surface)
  if (!normalizedSurface) {
    return results
  }

  return results.filter((result) => {
    const resultSurface = result.item.surface
    return resultSurface && norm(resultSurface) === normalizedSurface
  })
}

/**
 * Filter search results by Diataxis document type
 *
 * @param results - Search results to filter
 * @param type - Document type (tutorial, how-to, reference, explanation)
 * @returns Filtered results matching the specified type
 *
 * @example
 * ```ts
 * const tutorialResults = filterByType(results, "tutorial")
 * ```
 */
export function filterByType(
  results: SearchResult[],
  type?: "tutorial" | "how-to" | "reference" | "explanation"
): SearchResult[] {
  if (!type) {
    return results
  }
  return results.filter((result) => result.item.type === type)
}
