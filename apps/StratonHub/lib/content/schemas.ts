/**
 * Content Frontmatter Schemas — StratonHub
 *
 * Zod v4 schemas for content metadata validation (file-based content).
 *
 * Performance Optimizations:
 * - Pre-compiled regex patterns
 * - Reusable enum constants
 * - Efficient schema composition
 *
 * Canon enforcement:
 * - Audience is required
 * - Diataxis type is required
 * - Surface (optional) replaces legacy "ERP module"
 * - last_updated (snake_case) is canonical in MDX frontmatter
 */

import { z as z4 } from "zod/v4"

// ============================================================================
// Constants
// ============================================================================

/**
 * Pre-compiled regex for date validation (YYYY-MM-DD format)
 * Extracted for performance and reusability
 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

/**
 * Surface/Domain values (formerly "ERP Modules")
 * Keep values stable; rename the concept to remove legacy drift.
 */
const SURFACE_VALUES = [
  "boardroom",
  "accounting",
  "finance",
  "crm",
  "manufacturing",
  "supply-chain",
  "procurement",
  "marketing",
  "investor-relations",
  "global-config",
  "individual-config",
] as const

/**
 * Audience values
 */
const AUDIENCE_VALUES = ["developers", "users", "business"] as const

/**
 * Diataxis Document Type values (REQUIRED)
 */
const DIATAXIS_TYPE_VALUES = ["tutorial", "how-to", "reference", "explanation"] as const

/**
 * Publication status values
 */
const STATUS_VALUES = ["DRAFT", "CANONICAL", "DEPRECATED"] as const

// ============================================================================
// Schema Definitions
// ============================================================================

/**
 * Surfaces / Domains Enum Schema
 *
 * @example
 * ```ts
 * const result = surfaceSchema.safeParse("boardroom")
 * ```
 */
export const surfaceSchema = z4.enum(SURFACE_VALUES)

/**
 * Audience Enum Schema
 *
 * @example
 * ```ts
 * const result = audienceSchema.safeParse("developers")
 * ```
 */
export const audienceSchema = z4.enum(AUDIENCE_VALUES)

/**
 * Diataxis Document Type Enum Schema (REQUIRED)
 *
 * @example
 * ```ts
 * const result = diataxisTypeSchema.safeParse("tutorial")
 * ```
 */
export const diataxisTypeSchema = z4.enum(DIATAXIS_TYPE_VALUES)

/**
 * Canonical publication status schema (recommended)
 *
 * @example
 * ```ts
 * const result = statusSchema.safeParse("CANONICAL")
 * ```
 */
export const statusSchema = z4.enum(STATUS_VALUES)

/**
 * Content Metadata Structure (Frontmatter)
 *
 * Canonical frontmatter keys:
 * - last_updated (snake_case) - YYYY-MM-DD format
 *
 * Required fields:
 * - title: Document title (1-255 characters)
 * - audience: Target audience (developers, users, business)
 * - type: Diataxis document type (tutorial, how-to, reference, explanation)
 *
 * Optional fields:
 * - description: Document description (1-500 characters)
 * - surface: Surface/domain this document covers
 * - published: Whether document is published (default: true)
 * - status: Lifecycle status (default: CANONICAL)
 * - last_updated: Last updated date in YYYY-MM-DD format
 */
const contentMetadataDefinition = {
  title: z4
    .string()
    .min(1, "Title must be at least 1 character")
    .max(255, "Title must be at most 255 characters")
    .describe("Document title"),

  description: z4
    .string()
    .min(1, "Description must be at least 1 character")
    .max(500, "Description must be at most 500 characters")
    .optional()
    .describe("Document description"),

  // StratonHub laws (required)
  audience: audienceSchema.describe("Target audience"),

  type: diataxisTypeSchema.describe("Diataxis document type"),

  // Optional classification
  surface: surfaceSchema.optional().describe("Surface/domain this document covers"),

  // Publication controls
  published: z4.boolean().default(true).describe("Whether document is published"),

  status: statusSchema.default("CANONICAL").describe("Lifecycle status"),

  // Canonical date key (matches your MDX templates)
  last_updated: z4
    .string()
    .regex(DATE_REGEX, "Date must be in YYYY-MM-DD format")
    .optional()
    .describe("Last updated date (YYYY-MM-DD)"),
}

/**
 * Main frontmatter schema
 *
 * Note: For file-based content, insert/select are effectively the same.
 * Uses `.strict()` to prevent unknown properties.
 *
 * @example
 * ```ts
 * const result = frontmatterSchema.safeParse({
 *   title: "My Document",
 *   audience: "developers",
 *   type: "tutorial"
 * })
 * ```
 */
export const frontmatterSchema = z4
  .object(contentMetadataDefinition)
  .strict()
  .describe("StratonHub frontmatter schema")

/**
 * Frontmatter insert schema
 *
 * Alias for frontmatterSchema with descriptive name for insert operations.
 * In practice, insert and select are the same for file-based content.
 */
export const frontmatterInsertSchema = frontmatterSchema.describe("Frontmatter insert schema")

/**
 * Frontmatter select schema
 *
 * Alias for frontmatterSchema with descriptive name for select operations.
 * In practice, insert and select are the same for file-based content.
 *
 * This is the primary schema used for validation in loadContentFile().
 */
export const frontmatterSelectSchema = frontmatterSchema.describe("Frontmatter select schema")

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Inferred TypeScript types from Zod schemas
 *
 * These types are automatically generated from the schemas above,
 * ensuring type safety and consistency between runtime validation and compile-time types.
 */

/**
 * Frontmatter type for insert operations
 */
export type FrontmatterInsert = z4.infer<typeof frontmatterInsertSchema>

/**
 * Frontmatter type for select operations
 */
export type FrontmatterSelect = z4.infer<typeof frontmatterSelectSchema>

/**
 * Surface/Domain type
 */
export type Surface = z4.infer<typeof surfaceSchema>

/**
 * Audience type
 *
 * Note: This type is also defined in @/lib/search/types.ts.
 * Consider consolidating to avoid duplication.
 */
export type Audience = z4.infer<typeof audienceSchema>

/**
 * Diataxis document type
 *
 * Note: This type is also defined in @/lib/search/types.ts.
 * Consider consolidating to avoid duplication.
 */
export type DiataxisType = z4.infer<typeof diataxisTypeSchema>

/**
 * Document status type
 */
export type DocStatus = z4.infer<typeof statusSchema>
