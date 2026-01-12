/**
 * Content Frontmatter Schemas
 *
 * Zod schemas for content metadata validation
 * Follows Drizzle Zod pattern structure for consistency (file-based content)
 * Reference: apps/boardroom/src/db/schema/proposals.ts (for pattern reference)
 *
 * Note: For file-based content (not database tables), we use plain Zod schemas
 * but follow the same naming and structure pattern as Drizzle Zod schemas.
 */

import { z as z4 } from 'zod/v4'

/**
 * ERP Modules Enum
 */
export const erpModuleSchema = z4.enum([
  'boardroom',
  'accounting',
  'finance',
  'crm',
  'manufacturing',
  'supply-chain',
  'procurement',
  'marketing',
  'investor-relations',
  'global-config',
  'individual-config',
])

/**
 * Audience Enum
 */
export const audienceSchema = z4.enum(['developers', 'users', 'business'])

/**
 * Diataxis Document Type Enum
 */
export const diataxisTypeSchema = z4.enum([
  'tutorial',
  'how-to',
  'reference',
  'explanation',
])

/**
 * Content Metadata Structure
 * This is a virtual schema (not a database table) but uses Drizzle pattern
 */
const contentMetadataDefinition = {
  title: z4.string().min(1).max(255).describe('Document title'),
  description: z4.string().min(1).max(500).optional().describe('Document description'),
  audience: audienceSchema.describe('Target audience'),
  module: erpModuleSchema.optional().describe('ERP module this document covers'),
  type: diataxisTypeSchema.optional().describe('Diataxis document type'),
  published: z4.boolean().default(true).describe('Whether document is published'),
  lastUpdated: z4.string().datetime().optional().describe('Last update timestamp'),
}

/**
 * Create a virtual table-like structure for Drizzle pattern
 * Since we're using file-based content, we create a schema object
 */
const contentMetadataSchema = z4.object(contentMetadataDefinition)

/**
 * Insert Schema (for creating/validating new content)
 * Follows Drizzle pattern structure: insert schema (allows optional fields for creation)
 * Note: For file-based content, we use plain Zod (drizzle-zod requires database tables)
 */
export const frontmatterInsertSchema = z4
  .object(contentMetadataDefinition)
  .describe('Content frontmatter insert schema for validation')

/**
 * Select Schema (for reading/validating existing content)
 * Follows Drizzle pattern structure: select schema (all fields required as defined)
 * Note: For file-based content, we use plain Zod (drizzle-zod requires database tables)
 */
export const frontmatterSelectSchema = z4
  .object(contentMetadataDefinition)
  .describe('Content frontmatter select schema for validation')

/**
 * TypeScript Types
 */
export type FrontmatterInsert = z4.infer<typeof frontmatterInsertSchema>
export type FrontmatterSelect = z4.infer<typeof frontmatterSelectSchema>
export type ERPModule = z4.infer<typeof erpModuleSchema>
export type Audience = z4.infer<typeof audienceSchema>
export type DiataxisType = z4.infer<typeof diataxisTypeSchema>
