/**
 * API Schema Registry
 *
 * Single source of truth for all API schemas using Zod.
 * These schemas are used for:
 * - Request/Response validation
 * - Type generation
 * - OpenAPI documentation
 * - Client SDK generation
 */

import { z } from 'zod/v4'

// ============================================================================
// Common Schemas
// ============================================================================

/**
 * Standard error response schema
 */
export const errorResponseSchema = z.object({
  error: z.string().describe('Error message'),
  code: z.string().optional().describe('Error code'),
  details: z.record(z.string(), z.unknown()).optional().describe('Additional error details'),
  timestamp: z.string().datetime().describe('Error timestamp'),
})

export type ErrorResponse = z.infer<typeof errorResponseSchema>

/**
 * Standard success response wrapper
 */
export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z
    .object({
      success: z.boolean().default(true),
      data: dataSchema,
      message: z.string().optional(),
    })
    .describe('Standard success response wrapper')

/**
 * Pagination parameters
 */
export const paginationParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).describe('Page number'),
  limit: z.coerce.number().int().min(1).max(100).default(10).describe('Items per page'),
  sort: z.string().optional().describe('Sort field'),
  order: z.enum(['asc', 'desc']).default('asc').describe('Sort order'),
})

export type PaginationParams = z.infer<typeof paginationParamsSchema>

/**
 * Paginated response
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z
    .object({
      items: z.array(itemSchema).describe('Array of items'),
      pagination: z
        .object({
          page: z.number().int().describe('Current page number'),
          limit: z.number().int().describe('Items per page'),
          total: z.number().int().describe('Total number of items'),
          totalPages: z.number().int().describe('Total number of pages'),
          hasNext: z.boolean().describe('Whether there is a next page'),
          hasPrev: z.boolean().describe('Whether there is a previous page'),
        })
        .describe('Pagination metadata'),
    })
    .describe('Paginated response with items and pagination metadata')

// ============================================================================
// User Schemas
// ============================================================================

/**
 * User creation input schema
 */
export const createUserInputSchema = z.object({
  email: z.string().email().describe('User email address'),
  name: z.string().min(1).max(255).describe('User full name'),
  password: z.string().min(8).describe('User password (min 8 characters)'),
})

export type CreateUserInput = z.infer<typeof createUserInputSchema>

/**
 * User update input schema
 */
export const updateUserInputSchema = z
  .object({
    email: z.string().email().optional().describe('User email address'),
    name: z.string().min(1).max(255).optional().describe('User full name'),
    isActive: z.boolean().optional().describe('User active status'),
  })
  .describe('User update input schema')

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>

/**
 * User ID parameter schema
 */
export const userIdParamsSchema = z.object({
  id: z.coerce.number().int().positive().describe('User ID'),
})

export type UserIdParams = z.infer<typeof userIdParamsSchema>

/**
 * User response schema
 */
export const userResponseSchema = z.object({
  id: z.number().int().describe('User ID'),
  email: z.string().email().describe('User email'),
  name: z.string().nullable().describe('User name'),
  isActive: z.boolean().describe('User active status'),
  createdAt: z.string().datetime().describe('Creation timestamp'),
  updatedAt: z.string().datetime().describe('Last update timestamp'),
})

export type UserResponse = z.infer<typeof userResponseSchema>

/**
 * User list response schema
 */
export const userListResponseSchema = paginatedResponseSchema(userResponseSchema)

export type UserListResponse = z.infer<typeof userListResponseSchema>

// ============================================================================
// Query Parameter Schemas
// ============================================================================

/**
 * User query parameters
 */
export const userQuerySchema = paginationParamsSchema.extend({
  search: z.string().optional().describe('Search term for name or email'),
  isActive: z.coerce.boolean().optional().describe('Filter by active status'),
})

export type UserQuery = z.infer<typeof userQuerySchema>

// ============================================================================
// Export all schemas for autogeneration
// ============================================================================

export const apiSchemas = {
  // Common
  errorResponse: errorResponseSchema,
  paginationParams: paginationParamsSchema,

  // User
  createUserInput: createUserInputSchema,
  updateUserInput: updateUserInputSchema,
  userIdParams: userIdParamsSchema,
  userResponse: userResponseSchema,
  userListResponse: userListResponseSchema,
  userQuery: userQuerySchema,
} as const
