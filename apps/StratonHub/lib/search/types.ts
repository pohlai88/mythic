/**
 * Search Index Types — StratonHub
 *
 * Type definitions for search indexing and fuzzy search functionality.
 *
 * Note: These types are runtime types used for search operations.
 * For Zod schema validation, see @/lib/content/schemas.ts
 *
 * Type Duplication Notice:
 * - `Audience` and `DiataxisType` are also defined in @/lib/content/schemas.ts
 * - Consider consolidating to a single source of truth in the future
 * - Current usage: search/types.ts for runtime, content/schemas.ts for validation
 */

// ============================================================================
// Base Types
// ============================================================================

/**
 * Target audience for documentation content
 *
 * @example
 * ```typescript
 * const audience: Audience = "developers"
 * ```
 */
export type Audience = "developers" | "users" | "business"

/**
 * Diataxis document type classification
 *
 * Diataxis framework categories:
 * - tutorial: Learning-oriented, step-by-step guidance
 * - how-to: Task-oriented, procedural instructions
 * - reference: Information-oriented, factual documentation
 * - explanation: Understanding-oriented, conceptual explanations
 *
 * @example
 * ```typescript
 * const docType: DiataxisType = "tutorial"
 * ```
 */
export type DiataxisType = "tutorial" | "how-to" | "reference" | "explanation"

// ============================================================================
// Search Index Interface
// ============================================================================

/**
 * Search index entry representing a single document
 *
 * This interface represents the structure of documents in the search index.
 * Each entry contains metadata and content for fuzzy search operations.
 *
 * @example
 * ```typescript
 * const indexEntry: SearchIndex = {
 *   id: "users-boardroom",
 *   title: "BoardRoom User Guide",
 *   description: "Complete guide to using BoardRoom",
 *   content: "BoardRoom is a...",
 *   route: "/users/boardroom",
 *   audience: "users",
 *   surface: "boardroom",
 *   type: "tutorial"
 * }
 * ```
 */
export interface SearchIndex {
  /** Unique identifier for the document (derived from route) */
  id: string

  /** Document title (required) */
  title: string

  /** Document description (optional) */
  description?: string

  /** Searchable content text (frontmatter and markdown removed) */
  content: string

  /** Route path to the document (e.g., "/users/boardroom") */
  route: string

  /** Target audience (required) */
  audience: Audience

  /** Surface/domain this document covers (optional) */
  surface?: string

  /**
   * Diataxis document type (required)
   * Canon: Required for all documentation
   */
  type: DiataxisType
}

// ============================================================================
// Search Result Interface
// ============================================================================

/**
 * Search result with match information
 *
 * Returned by fuzzy search operations, includes the original document
 * plus relevance score and match details.
 *
 * @example
 * ```typescript
 * const result: SearchResult = {
 *   item: { id: "users-boardroom", title: "User Guide", ... },
 *   score: 0.35,
 *   matches: [{
 *     key: "title",
 *     value: "User Guide",
 *     indices: [[0, 3], [5, 8]]
 *   }]
 * }
 * ```
 */
export interface SearchResult {
  /** Original search index entry */
  item: SearchIndex

  /**
   * Relevance score (0 = perfect match, 1 = no match)
   * Lower scores indicate better matches
   */
  score?: number

  /**
   * Match details showing where query matched in the document
   * Each match shows the field, matched text, and character indices
   */
  matches?: Array<{
    /** Field name where match occurred (e.g., "title", "content") */
    key: string

    /** Matched text value */
    value: string

    /** Character index ranges where match occurred */
    indices: Array<[number, number]>
  }>
}

// ============================================================================
// Search Options Interface
// ============================================================================

/**
 * Search options for Fuse.js + custom filtering
 *
 * Configures fuzzy search behavior and result filtering.
 *
 * @example
 * ```typescript
 * const options: SearchOptions = {
 *   limit: 20,
 *   threshold: 0.3,
 *   minMatchCharLength: 2,
 *   maxScore: 0.5
 * }
 * ```
 */
export interface SearchOptions {
  /** Maximum number of results to return */
  limit?: number

  /**
   * Match threshold (0.0 = exact match, 1.0 = match anything)
   * Lower values = stricter matching
   */
  threshold?: number

  /** Minimum character length required for a match */
  minMatchCharLength?: number

  /**
   * Maximum score threshold for filtering weak matches
   * Forensic discipline: Filter out weak matches (higher = noisier)
   * Lower values = stricter filtering (0.3-0.6 typical range)
   */
  maxScore?: number
}
