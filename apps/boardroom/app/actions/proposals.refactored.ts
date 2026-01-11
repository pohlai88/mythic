/**
 * Server Actions for Proposals - Refactored with @mythic/domain-core
 *
 * ⭐ ELITE: Demonstrates DRY principle using shared Server Action pattern
 * This is a reference implementation showing how to use @mythic/domain-core
 *
 * Original: apps/boardroom/app/actions/proposals.ts
 * Refactored: Using createValidatedAction from @mythic/domain-core
 */

'use server'

import { createValidatedAction } from '@mythic/domain-core/server-action'
import { z as z4 } from 'zod/v4'
import { db } from '@/src/db'
import { proposals, thanosEvents } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { createProposalInputSchema, approveProposalInputSchema } from '@/src/lib/api-schemas/proposals'
import {
  createProposalResponseSchema,
  approveProposalResponseSchema,
} from '@/src/lib/zod/action-responses'

/**
 * Create a new proposal
 *
 * ⭐ ELITE: Using createValidatedAction from @mythic/domain-core
 * Following DRY principle - shared pattern across all domains
 */
export const createProposal = createValidatedAction(
  createProposalInputSchema,
  async (input) => {
    // Generate case number (simplified for example)
    const caseNumber = `CASE-${Date.now()}`

    // Create proposal
    const [proposal] = await db
      .insert(proposals)
      .values({
        caseNumber,
        stencilId: input.stencilId,
        circleId: input.circleId,
        submittedBy: input.submittedBy,
        status: 'DRAFT',
        data: input.data,
      })
      .returning()

    if (!proposal) {
      throw new Error('Failed to create proposal')
    }

    // Create Thanos event (6W1H audit trail)
    await db.insert(thanosEvents).values({
      proposalId: proposal.id,
      who: input.submittedBy,
      what: 'CREATED',
      where: 'web',
      how: 'UI',
      why: 'New proposal submitted',
    })

    // Move to LISTENING status
    await db
      .update(proposals)
      .set({
        status: 'LISTENING',
        updatedAt: new Date(),
      })
      .where(eq(proposals.id, proposal.id))

    return {
      success: true,
      proposalId: proposal.id,
    }
  },
  {
    revalidatePaths: ['/boardroom'],
  }
)

/**
 * Approve a proposal
 *
 * ⭐ ELITE: Using createValidatedAction from @mythic/domain-core
 */
export const approveProposal = createValidatedAction(
  approveProposalInputSchema,
  async (input) => {
    const { proposalId, approvedBy } = input

    // Get current proposal
    const [proposal] = await db
      .select()
      .from(proposals)
      .where(eq(proposals.id, proposalId))

    if (!proposal) {
      throw new Error('Proposal not found')
    }

    if (proposal.status !== 'LISTENING') {
      throw new Error('Proposal is not in LISTENING state')
    }

    // Update proposal status
    await db
      .update(proposals)
      .set({
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(proposals.id, proposalId))

    // Create Thanos event
    await db.insert(thanosEvents).values({
      proposalId,
      who: approvedBy,
      what: 'APPROVED',
      where: 'web',
      how: 'UI',
      why: 'Proposal approved by sovereign',
    })

    return {
      success: true,
    }
  },
  {
    revalidatePaths: ['/boardroom'],
  }
)
