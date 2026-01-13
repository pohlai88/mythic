/**
 * Search Module Barrel Export — StratonHub
 *
 * Centralized exports for the StratonHub search module.
 * This barrel export enables clean imports from a single entry point.
 *
 * @example
 * ```typescript
 * // Import types
 * import type { SearchIndex, SearchResult, Audience } from '@/lib/search'
 *
 * // Import fuzzy search functions
 * import { createFuzzySearch, search, filterByAudience } from '@/lib/search'
 *
 * // Import index builder functions
 * import { buildSearchIndex, saveSearchIndex } from '@/lib/search'
 * ```
 *
 * ## Exports
 *
 * ### Types (from ./types)
 * - `Audience`, `DiataxisType` - Base type definitions
 * - `SearchIndex` - Search index entry interface
 * - `SearchResult` - Search result with match information
 * - `SearchOptions` - Search configuration options
 *
 * ### Fuzzy Search Functions (from ./fuzzy)
 * - `createFuzzySearch()` - Create Fuse.js search instance
 * - `search()` - Perform fuzzy search with score filtering
 * - `filterByAudience()` - Filter results by audience
 * - `filterBySurface()` - Filter results by surface/domain
 * - `filterByType()` - Filter results by Diataxis type
 *
 * ### Index Builder Functions (from ./index-builder)
 * - `buildSearchIndex()` - Build search index from MDX files
 * - `saveSearchIndex()` - Save search index to JSON file
 */

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Export all types from types module
 *
 * Includes:
 * - Base types: Audience, DiataxisType
 * - Interfaces: SearchIndex, SearchResult, SearchOptions
 */
export * from "./types"

// ============================================================================
// Fuzzy Search Exports
// ============================================================================

/**
 * Export all fuzzy search functions from fuzzy module
 *
 * Includes:
 * - createFuzzySearch: Create configured Fuse.js instance
 * - search: Perform fuzzy search with filtering
 * - filterByAudience: Filter by target audience
 * - filterBySurface: Filter by surface/domain
 * - filterByType: Filter by Diataxis document type
 */
export * from "./fuzzy"

// ============================================================================
// Index Builder Exports
// ============================================================================

/**
 * Export index builder functions from index-builder module
 *
 * Includes:
 * - buildSearchIndex: Build search index from MDX files
 * - saveSearchIndex: Save index to JSON file
 */
export { buildSearchIndex, saveSearchIndex } from "./index-builder"

// ============================================================================
// Type Re-exports (Explicit)
// ============================================================================

/**
 * Explicit type exports for better IDE support and documentation
 *
 * Note: These are already exported via `export * from "./types"`,
 * but explicit exports provide:
 * - Better IDE autocomplete hints
 * - Clear documentation of available types
 * - Future-proofing for potential export restrictions
 * - Stable API surface for type-only imports
 */
export type { SearchIndex, SearchResult, SearchOptions } from "./types"
