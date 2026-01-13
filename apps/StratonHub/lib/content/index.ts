/**
 * Content Module Barrel Export
 *
 * Centralized exports for the StratonHub content module.
 * This barrel export enables clean imports from a single entry point.
 *
 * @example
 * ```ts
 * // Import schemas and types
 * import { frontmatterSelectSchema, type FrontmatterSelect } from '@/lib/content'
 *
 * // Import loader functions
 * import { loadContentFile, validateFrontmatter } from '@/lib/content'
 *
 * // Import types
 * import type { ContentFile, Audience, DiataxisType } from '@/lib/content'
 * ```
 *
 * ## Exports
 *
 * ### Schemas (from ./schemas)
 * - `surfaceSchema`, `audienceSchema`, `diataxisTypeSchema`, `statusSchema`
 * - `frontmatterSchema`, `frontmatterInsertSchema`, `frontmatterSelectSchema`
 *
 * ### Types (from ./schemas)
 * - `FrontmatterInsert`, `FrontmatterSelect`
 * - `Surface`, `Audience`, `DiataxisType`, `DocStatus`
 *
 * ### Loader Functions (from ./loader)
 * - `validateFrontmatter()` - Validate frontmatter data
 * - `loadContentFile()` - Load and validate a single content file
 * - `loadContentFiles()` - Load multiple content files with error tracking
 *
 * ### Loader Types (from ./loader)
 * - `ContentFile` - Single content file interface
 * - `LoadContentFilesResult` - Batch loading result interface
 */

// ============================================================================
// Schema Exports
// ============================================================================

/**
 * Export all schemas from schemas module
 *
 * Includes:
 * - Enum schemas: surfaceSchema, audienceSchema, diataxisTypeSchema, statusSchema
 * - Main schemas: frontmatterSchema, frontmatterInsertSchema, frontmatterSelectSchema
 */
export * from "./schemas"

// ============================================================================
// Loader Exports
// ============================================================================

/**
 * Export all loader functions and types from loader module
 *
 * Includes:
 * - Functions: validateFrontmatter, loadContentFile, loadContentFiles
 * - Types: ContentFile, LoadContentFilesResult
 */
export * from "./loader"

// ============================================================================
// Type Exports (Explicit)
// ============================================================================

/**
 * Explicit type exports for better IDE support and documentation
 *
 * Note: These are already exported via `export * from "./schemas"`,
 * but explicit exports provide:
 * - Better IDE autocomplete hints
 * - Clear documentation of available types
 * - Future-proofing for potential export restrictions
 */
export type {
  FrontmatterInsert,
  FrontmatterSelect,
  Surface,
  Audience,
  DiataxisType,
  DocStatus,
} from "./schemas"
