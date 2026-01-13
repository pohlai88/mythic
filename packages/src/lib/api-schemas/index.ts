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

import { z as z4 } from "zod/v4"

// ============================================================================
// Common Schemas
// ============================================================================

/**
 * Standard error response schema
 */
export const errorResponseSchema = z4.object({
  error: z4.string().describe("Error message"),
  code: z4.string().optional().describe("Error code"),
  details: z4.record(z4.string(), z4.unknown()).optional().describe("Additional error details"),
  timestamp: z4.string().datetime().describe("Error timestamp"),
})

export type ErrorResponse = z4.infer<typeof errorResponseSchema>

/**
 * Standard success response wrapper
 */
export const successResponseSchema = <T extends z4.ZodTypeAny>(dataSchema: T) =>
  z4
    .object({
      success: z4.boolean().default(true),
      data: dataSchema,
      message: z4.string().optional(),
    })
    .describe("Standard success response wrapper")

/**
 * Pagination parameters
 */
export const paginationParamsSchema = z4.object({
  page: z4.coerce.number().int().min(1).default(1).describe("Page number"),
  limit: z4.coerce.number().int().min(1).max(100).default(10).describe("Items per page"),
  sort: z4.string().optional().describe("Sort field"),
  order: z4.enum(["asc", "desc"]).default("asc").describe("Sort order"),
})

export type PaginationParams = z4.infer<typeof paginationParamsSchema>

/**
 * Paginated response
 */
export const paginatedResponseSchema = <T extends z4.ZodTypeAny>(itemSchema: T) =>
  z4
    .object({
      items: z4.array(itemSchema).describe("Array of items"),
      pagination: z4
        .object({
          page: z4.number().int().describe("Current page number"),
          limit: z4.number().int().describe("Items per page"),
          total: z4.number().int().describe("Total number of items"),
          totalPages: z4.number().int().describe("Total number of pages"),
          hasNext: z4.boolean().describe("Whether there is a next page"),
          hasPrev: z4.boolean().describe("Whether there is a previous page"),
        })
        .describe("Pagination metadata"),
    })
    .describe("Paginated response with items and pagination metadata")

// ============================================================================
// User Schemas
// ============================================================================

/**
 * User creation input schema
 */
export const createUserInputSchema = z4.object({
  email: z4.string().email().describe("User email address"),
  name: z4.string().min(1).max(255).describe("User full name"),
  password: z4.string().min(8).describe("User password (min 8 characters)"),
})

export type CreateUserInput = z4.infer<typeof createUserInputSchema>

/**
 * User update input schema
 */
export const updateUserInputSchema = z4
  .object({
    email: z4.string().email().optional().describe("User email address"),
    name: z4.string().min(1).max(255).optional().describe("User full name"),
    isActive: z4.boolean().optional().describe("User active status"),
  })
  .describe("User update input schema")

export type UpdateUserInput = z4.infer<typeof updateUserInputSchema>

/**
 * User ID parameter schema
 */
export const userIdParamsSchema = z4.object({
  id: z4.coerce.number().int().positive().describe("User ID"),
})

export type UserIdParams = z4.infer<typeof userIdParamsSchema>

/**
 * User response schema
 */
export const userResponseSchema = z4.object({
  id: z4.number().int().describe("User ID"),
  email: z4.string().email().describe("User email"),
  name: z4.string().nullable().describe("User name"),
  isActive: z4.boolean().describe("User active status"),
  createdAt: z4.string().datetime().describe("Creation timestamp"),
  updatedAt: z4.string().datetime().describe("Last update timestamp"),
})

export type UserResponse = z4.infer<typeof userResponseSchema>

/**
 * User list response schema
 */
export const userListResponseSchema = paginatedResponseSchema(userResponseSchema)

export type UserListResponse = z4.infer<typeof userListResponseSchema>

// ============================================================================
// Query Parameter Schemas
// ============================================================================

/**
 * User query parameters
 */
export const userQuerySchema = paginationParamsSchema.extend({
  search: z4.string().optional().describe("Search term for name or email"),
  isActive: z4.coerce.boolean().optional().describe("Filter by active status"),
})

export type UserQuery = z4.infer<typeof userQuerySchema>

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
