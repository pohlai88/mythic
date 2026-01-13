/**
 * Proposal Input Schemas
 *
 * Contract-First approach: All server action inputs validated with Zod
 * Ensures type safety and runtime validation for all action inputs.
 */

import { z as z4 } from "zod/v4"
import { proposalStatusSchema } from "@mythic/shared-types/boardroom"

/**
 * Create proposal input schema
 */
export const createProposalInputSchema = z4
  .object({
    stencilId: z4.string().min(1).max(100).describe("Stencil ID for the proposal"),
    circleId: z4.string().uuid().describe("Circle ID where proposal is submitted"),
    submittedBy: z4.string().uuid().describe("User ID submitting the proposal"),
    data: z4.record(z4.string(), z4.unknown()).describe("Structured proposal data from stencil"),
  })
  .describe("Create proposal input validation schema")

export type CreateProposalInput = z4.infer<typeof createProposalInputSchema>

/**
 * Approve proposal input schema
 */
export const approveProposalInputSchema = z4
  .object({
    proposalId: z4.string().uuid().describe("Proposal ID to approve"),
    approvedBy: z4.string().uuid().describe("User ID approving the proposal"),
  })
  .describe("Approve proposal input validation schema")

export type ApproveProposalInput = z4.infer<typeof approveProposalInputSchema>

/**
 * Veto proposal input schema
 */
export const vetoProposalInputSchema = z4
  .object({
    proposalId: z4.string().uuid().describe("Proposal ID to veto"),
    vetoedBy: z4.string().uuid().describe("User ID vetoing the proposal"),
    reason: z4.string().min(10).max(1000).describe("Reason for veto (10-1000 characters)"),
  })
  .describe("Veto proposal input validation schema")

export type VetoProposalInput = z4.infer<typeof vetoProposalInputSchema>

/**
 * Get proposal input schema
 */
export const getProposalInputSchema = z4
  .object({
    proposalId: z4.string().uuid().describe("Proposal ID to fetch"),
  })
  .describe("Get proposal input validation schema")

export type GetProposalInput = z4.infer<typeof getProposalInputSchema>
