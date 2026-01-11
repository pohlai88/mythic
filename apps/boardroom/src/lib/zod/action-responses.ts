/**
 * Server Action Response Schemas
 * 
 * Contract-First approach: All server action responses validated with Zod
 * Ensures type safety and runtime validation for all action responses.
 */

import { z as z4 } from 'zod/v4'
import { proposalSchema, type Proposal } from '@mythic/shared-types/boardroom'

/**
 * Base response schema for actions that return success/error
 */
export const actionResponseSchema = z4.object({
  success: z4.boolean(),
  error: z4.string().optional(),
})

/**
 * Create proposal response schema
 */
export const createProposalResponseSchema = actionResponseSchema.extend({
  proposalId: z4.string().uuid().optional(),
})

export type CreateProposalResponse = z4.infer<typeof createProposalResponseSchema>

/**
 * Approve proposal response schema
 */
export const approveProposalResponseSchema = actionResponseSchema

export type ApproveProposalResponse = z4.infer<typeof approveProposalResponseSchema>

/**
 * Veto proposal response schema
 */
export const vetoProposalResponseSchema = actionResponseSchema

export type VetoProposalResponse = z4.infer<typeof vetoProposalResponseSchema>

/**
 * Proposal list response schema
 * Uses the shared proposalSchema to ensure consistency
 */
export const proposalListResponseSchema = z4.array(proposalSchema)

export type ProposalListResponse = z4.infer<typeof proposalListResponseSchema>

/**
 * Single proposal response schema
 * Uses the shared proposalSchema to ensure consistency
 */
export const proposalResponseSchema = proposalSchema.nullable()

export type ProposalResponse = z4.infer<typeof proposalResponseSchema>

/**
 * Validate action response
 * 
 * Generic helper to validate any action response against a schema.
 */
export function validateActionResponse<T extends z4.ZodTypeAny>(
  response: unknown,
  schema: T
): ReturnType<typeof schema.safeParse> {
  return schema.safeParse(response)
}
