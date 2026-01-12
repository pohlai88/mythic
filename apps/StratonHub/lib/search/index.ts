/**
 * Search Module Exports
 */

export * from './types'
export * from './fuzzy'
export { buildSearchIndex, saveSearchIndex } from './index-builder'

// Re-export for convenience
export type { SearchIndex, SearchResult, SearchOptions } from './types'
export { search, createFuzzySearch, filterByAudience, filterByModule, filterByType } from './fuzzy'
