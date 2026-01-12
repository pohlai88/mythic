/**
 * Fuzzy Search Implementation
 *
 * Client-side fuzzy search using fuse.js
 */

import Fuse from 'fuse.js'
import type { SearchIndex, SearchOptions, SearchResult } from '@/lib/search/types'  // Type-only import

/**
 * Default search options
 */
const defaultOptions: SearchOptions = {
  limit: 10,
  threshold: 0.3, // Lower = more strict matching
  minMatchCharLength: 2,
}

/**
 * Create fuzzy search instance
 */
export function createFuzzySearch(index: SearchIndex[]): Fuse<SearchIndex> {
  return new Fuse(index, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'content', weight: 0.2 },
      { name: 'module', weight: 0.1 },
    ],
    threshold: defaultOptions.threshold || 0.3,
    minMatchCharLength: defaultOptions.minMatchCharLength || 2,
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    findAllMatches: true,
  })
}

/**
 * Perform fuzzy search
 */
export function search(
  fuse: Fuse<SearchIndex>,
  query: string,
  options?: SearchOptions
): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return []
  }

  const limit = options?.limit || defaultOptions.limit
  const results = fuse.search(query, { limit })

  return results.map((result) => ({
    item: result.item,
    score: result.score,
    matches: result.matches?.map((match) => ({
      key: match.key || '',
      value: match.value || '',
      indices: match.indices || [],
    })),
  }))
}

/**
 * Filter search results by audience
 */
export function filterByAudience(
  results: SearchResult[],
  audience?: 'developers' | 'users' | 'business'
): SearchResult[] {
  if (!audience) return results
  return results.filter((result) => result.item.audience === audience)
}

/**
 * Filter search results by module
 */
export function filterByModule(results: SearchResult[], module?: string): SearchResult[] {
  if (!module) return results
  return results.filter((result) => result.item.module === module)
}

/**
 * Filter search results by type
 */
export function filterByType(
  results: SearchResult[],
  type?: 'tutorial' | 'how-to' | 'reference' | 'explanation'
): SearchResult[] {
  if (!type) return results
  return results.filter((result) => result.item.type === type)
}
