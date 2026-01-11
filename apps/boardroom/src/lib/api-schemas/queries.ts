/**
 * Query Parameter Validation Schemas
 * 
 * Contract-First approach: All query parameters validated with Zod
 * Ensures type safety and runtime validation for all API queries.
 */

import { z as z4 } from 'zod/v4'
import { proposalStatusSchema } from '@mythic/shared-types/boardroom'

/**
 * Proposal query parameter schema
 * 
 * Validates filters, pagination, sorting, and search parameters
 * for proposal list queries.
 */
export const proposalQuerySchema = z4.object({
  // Filter parameters
  status: proposalStatusSchema.optional(),
  circleId: z4.string().uuid().optional(),
  stencilId: z4.string().optional(),
  submittedBy: z4.string().uuid().optional(),
  
  // Pagination parameters
  page: z4.coerce.number().int().positive().default(1).describe('Page number (1-based)'),
  limit: z4.coerce.number().int().min(1).max(100).default(10).describe('Items per page (1-100)'),
  
  // Sorting parameters
  sort: z4.enum(['created_at', 'updated_at', 'case_number', 'status']).default('created_at').describe('Field to sort by'),
  order: z4.enum(['asc', 'desc']).default('desc').describe('Sort order'),
  
  // Search parameters with error recovery
  search: z4.string().trim().min(1).max(500).catch('').optional().describe('Search query (searches case number and data)'),
  
  // Date range filters
  createdAfter: z4.coerce.date().optional().describe('Filter proposals created after this date'),
  createdBefore: z4.coerce.date().optional().describe('Filter proposals created before this date'),
  
  // Status filters (array for multiple statuses)
  statuses: z4.array(proposalStatusSchema).optional().describe('Filter by multiple statuses'),
}).describe('Proposal query parameters schema')

export type ProposalQuery = z4.infer<typeof proposalQuerySchema>

/**
 * Validate and parse query parameters
 * 
 * Helper function to safely parse query parameters from URL search params
 * or request body.
 */
export function parseProposalQuery(
  input: unknown
): ReturnType<typeof proposalQuerySchema.safeParse> {
  return proposalQuerySchema.safeParse(input)
}

/**
 * Get default query parameters
 * 
 * Returns default values for proposal queries.
 */
export function getDefaultProposalQuery(): ProposalQuery {
  return {
    page: 1,
    limit: 10,
    sort: 'created_at',
    order: 'desc',
  }
}

/**
 * Calculate pagination offset from page and limit
 */
export function getPaginationOffset(page: number, limit: number): number {
  return (page - 1) * limit
}
