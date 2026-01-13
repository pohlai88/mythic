/**
 * Transformation utilities for converting between Drizzle types and shared-types
 *
 * Drizzle uses camelCase in TypeScript (mapped from snake_case DB columns)
 * Shared-types uses snake_case to match API contracts
 */

import type { Proposal as DrizzleProposal } from "@/src/db/schema/proposals"
import type { Proposal as SharedProposal } from "@mythic/shared-types/boardroom"

/**
 * Transform Drizzle Proposal (camelCase) to shared-types Proposal (snake_case)
 */
export function transformProposalToShared(drizzleProposal: DrizzleProposal): SharedProposal {
  return {
    id: drizzleProposal.id,
    case_number: drizzleProposal.caseNumber,
    stencil_id: drizzleProposal.stencilId,
    circle_id: drizzleProposal.circleId,
    status: drizzleProposal.status as SharedProposal["status"],
    submitted_by: drizzleProposal.submittedBy,
    data: drizzleProposal.data as Record<string, unknown>,
    created_at: drizzleProposal.createdAt,
    updated_at: drizzleProposal.updatedAt,
    approved_at: drizzleProposal.approvedAt ?? undefined,
    vetoed_at: drizzleProposal.vetoedAt ?? undefined,
    approved_by: drizzleProposal.approvedBy ?? undefined,
    vetoed_by: drizzleProposal.vetoedBy ?? undefined,
    veto_reason: drizzleProposal.vetoReason ?? undefined,
  }
}
