/**
 * Stencil Input Schemas
 *
 * Contract-First approach: All server action inputs validated with Zod
 * Ensures type safety and runtime validation for all stencil action inputs.
 */

import { z as z4 } from 'zod/v4'

/**
 * Get stencil input schema
 */
export const getStencilInputSchema = z4.object({
  stencilId: z4.string().min(1).max(100).describe('Stencil ID to fetch'),
}).describe('Get stencil input validation schema')

export type GetStencilInput = z4.infer<typeof getStencilInputSchema>
