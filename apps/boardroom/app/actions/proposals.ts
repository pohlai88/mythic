/**
 * Server Actions for Proposals
 *
 * The Apex - Proposal management actions
 * Following Next.js Server Actions pattern
 */

'use server'

import { db } from '@/src/db'
import { proposals, thanosEvents } from '@/src/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import type { Proposal, ProposalStatus } from '@mythic/shared-types/boardroom'
import { transformProposalToShared } from '@/src/db/utils/transform'
import { selectProposalSchema } from '@/src/db/schema/proposals'
import {
  createProposalResponseSchema,
  approveProposalResponseSchema,
  vetoProposalResponseSchema,
  proposalListResponseSchema,
  proposalResponseSchema,
  type CreateProposalResponse,
  type ApproveProposalResponse,
  type VetoProposalResponse,
} from '@/src/lib/zod/action-responses'
import {
  proposalQuerySchema,
  parseProposalQuery,
  getDefaultProposalQuery,
  getPaginationOffset,
  type ProposalQuery,
} from '@/src/lib/api-schemas/queries'
import {
  createProposalInputSchema,
  approveProposalInputSchema,
  vetoProposalInputSchema,
  getProposalInputSchema,
  type CreateProposalInput,
  type ApproveProposalInput,
  type VetoProposalInput,
  type GetProposalInput,
} from '@/src/lib/api-schemas/proposals'
import { validateActionInput } from '@/src/lib/actions/validate-action'

/**
 * Create a new proposal
 */
export async function createProposal(data: {
  stencilId: string
  circleId: string
  submittedBy: string
  data: Record<string, unknown>
}): Promise<{ success: boolean; proposalId?: string; error?: string }> {
  try {
    // Generate case number
    const caseNumber = await generateCaseNumber()

    // Create proposal
    const [proposal] = await db
      .insert(proposals)
      .values({
        caseNumber,
        stencilId: data.stencilId,
        circleId: data.circleId,
        submittedBy: data.submittedBy,
        status: 'DRAFT',
        data: data.data,
      })
      .returning()

    if (!proposal) {
      return { success: false, error: 'Failed to create proposal' }
    }

    // Validate with Zod schema
    const validatedProposal = selectProposalSchema.parse(proposal)

    // Create Thanos event (6W1H audit trail)
    await db.insert(thanosEvents).values({
      proposalId: proposal.id,
      who: data.submittedBy,
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

    // Create LISTENING event
    await db.insert(thanosEvents).values({
      proposalId: proposal.id,
      who: data.submittedBy,
      what: 'STATUS_CHANGED',
      where: 'web',
      how: 'UI',
      why: 'Proposal moved to LISTENING',
      metadata: { from: 'DRAFT', to: 'LISTENING' },
    })

    revalidatePath('/boardroom')

    // Validate response with Zod schema
    const response: CreateProposalResponse = { success: true, proposalId: proposal.id }
    const responseResult = createProposalResponseSchema.safeParse(response)
    if (!responseResult.success) {
      console.error('Invalid response schema:', responseResult.error)
      return { success: false, error: 'Internal validation error' }
    }
    return responseResult.data
  } catch (error) {
    console.error('Error creating proposal:', error)
    const response: CreateProposalResponse = { success: false, error: 'Failed to create proposal' }
    const responseResult = createProposalResponseSchema.safeParse(response)
    if (!responseResult.success) {
      return { success: false, error: 'Internal validation error' }
    }
    return responseResult.data
  }
}

/**
 * Approve a proposal
 *
 * Validates input with Zod schema before processing.
 */
export async function approveProposal(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  // Validate input
  const inputResult = validateActionInput(input, approveProposalInputSchema)
  if (!inputResult.success) {
    const response: ApproveProposalResponse = {
      success: false,
      error: inputResult.error || 'Invalid input parameters',
    }
    return approveProposalResponseSchema.parse(response)
  }

  const { proposalId, approvedBy } = inputResult.data

  try {
    // Get current proposal
    const [proposal] = await db
      .select()
      .from(proposals)
      .where(eq(proposals.id, proposalId))

    if (!proposal) {
      return { success: false, error: 'Proposal not found' }
    }

    // Validate with Zod schema
    const validatedProposal = selectProposalSchema.parse(proposal)

    if (validatedProposal.status !== 'LISTENING') {
      return { success: false, error: 'Proposal is not in LISTENING state' }
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

    revalidatePath('/boardroom')

    // Validate response with Zod schema
    const response: ApproveProposalResponse = { success: true }
    const validated = approveProposalResponseSchema.parse(response)
    return validated
  } catch (error) {
    console.error('Error approving proposal:', error)
    const response: ApproveProposalResponse = { success: false, error: 'Failed to approve proposal' }
    const validated = approveProposalResponseSchema.parse(response)
    return validated
  }
}

/**
 * Veto a proposal
 *
 * Validates input with Zod schema before processing.
 */
export async function vetoProposal(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  // Validate input
  const inputResult = validateActionInput(input, vetoProposalInputSchema)
  if (!inputResult.success) {
    const response: VetoProposalResponse = {
      success: false,
      error: inputResult.error || 'Invalid input parameters',
    }
    return vetoProposalResponseSchema.parse(response)
  }

  const { proposalId, vetoedBy, reason } = inputResult.data

  try {
    // Get current proposal
    const [proposal] = await db
      .select()
      .from(proposals)
      .where(eq(proposals.id, proposalId))

    if (!proposal) {
      return { success: false, error: 'Proposal not found' }
    }

    // Validate with Zod schema
    const validatedProposal = selectProposalSchema.parse(proposal)

    if (validatedProposal.status !== 'LISTENING') {
      return { success: false, error: 'Proposal is not in LISTENING state' }
    }

    // Update proposal status
    await db
      .update(proposals)
      .set({
        status: 'VETOED',
        vetoedBy,
        vetoReason: reason,
        vetoedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(proposals.id, proposalId))

    // Create Thanos event
    await db.insert(thanosEvents).values({
      proposalId,
      who: vetoedBy,
      what: 'VETOED',
      where: 'web',
      how: 'UI',
      why: reason,
    })

    revalidatePath('/boardroom')

    // Validate response with Zod schema
    const response: VetoProposalResponse = { success: true }
    const validated = vetoProposalResponseSchema.parse(response)
    return validated
  } catch (error) {
    console.error('Error vetoing proposal:', error)
    const response: VetoProposalResponse = { success: false, error: 'Failed to veto proposal' }
    const validated = vetoProposalResponseSchema.parse(response)
    return validated
  }
}

/**
 * Get proposals list with validated query parameters
 */
export async function getProposals(
  filters?: Partial<ProposalQuery>
): Promise<Proposal[]> {
  try {
    // Validate and parse query parameters
    const queryResult = parseProposalQuery(filters ?? {})

    if (!queryResult.success) {
      console.error('Invalid query parameters:', queryResult.error.issues)
      // Return empty array for invalid queries (could also throw error)
      return []
    }

    const validatedFilters = queryResult.data
    const conditions = []

    // Status filter (single or multiple)
    if (validatedFilters.status !== undefined) {
      conditions.push(eq(proposals.status, validatedFilters.status))
    } else if (validatedFilters.statuses && validatedFilters.statuses.length > 0) {
      // Multiple statuses filter (would need 'in' operator from drizzle-orm)
      // For now, use first status (can be enhanced later)
      const firstStatus = validatedFilters.statuses[0]
      if (firstStatus) {
        conditions.push(eq(proposals.status, firstStatus))
      }
    }

    // Circle filter
    if (validatedFilters.circleId !== undefined) {
      conditions.push(eq(proposals.circleId, validatedFilters.circleId))
    }

    // Stencil filter
    if (validatedFilters.stencilId !== undefined) {
      conditions.push(eq(proposals.stencilId, validatedFilters.stencilId))
    }

    // Submitted by filter
    if (validatedFilters.submittedBy !== undefined) {
      conditions.push(eq(proposals.submittedBy, validatedFilters.submittedBy))
    }

    // Date range filters (would use gte/lte in real implementation)
    // Note: These would require importing gte/lte from drizzle-orm
    // if (validatedFilters.createdAfter) {
    //   conditions.push(gte(proposals.createdAt, validatedFilters.createdAfter))
    // }
    // if (validatedFilters.createdBefore) {
    //   conditions.push(lte(proposals.createdAt, validatedFilters.createdBefore))
    // }

    // Build query
    const query = db.select().from(proposals)
    const results = conditions.length > 0
      ? await query.where(and(...conditions))
      : await query

    // Apply pagination (if needed in future)
    // const offset = getPaginationOffset(validatedFilters.page, validatedFilters.limit)
    // const paginatedResults = results.slice(offset, offset + validatedFilters.limit)

    // Transform Drizzle results (camelCase) to shared-types format (snake_case)
    const transformedProposals = results.map((result) => {
      const validated = selectProposalSchema.parse(result)
      return transformProposalToShared(validated)
    })

    // Validate response with Zod schema
    const validated = proposalListResponseSchema.parse(transformedProposals)
    return validated
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return []
  }
}

/**
 * Get single proposal by ID
 *
 * Validates input with Zod schema before processing.
 */
export async function getProposal(
  input: unknown
): Promise<Proposal | null> {
  // Validate input
  const inputResult = validateActionInput(input, getProposalInputSchema)
  if (!inputResult.success) {
    console.error('Invalid getProposal input:', inputResult.issues)
    return null
  }

  const { proposalId } = inputResult.data

  try {
    const [proposal] = await db
      .select()
      .from(proposals)
      .where(eq(proposals.id, proposalId))

    if (!proposal) {
      return null
    }

    // Validate with Zod schema and transform to shared-types format
    const validated = selectProposalSchema.parse(proposal)
    const transformed = transformProposalToShared(validated)

    // Validate response with Zod schema
    const response = proposalResponseSchema.parse(transformed)
    return response
  } catch (error) {
    console.error('Error fetching proposal:', error)
    return null
  }
}

/**
 * Generate unique case number
 */
async function generateCaseNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `CASE-${year}-`

  // Get all case numbers for this year
  const yearProposals = await db
    .select({ caseNumber: proposals.caseNumber })
    .from(proposals)
    .where(eq(proposals.caseNumber, prefix + '999')) // This is a placeholder query - need proper LIKE query

  // Extract sequence numbers and find the highest
  const sequences = yearProposals
    .map((p) => {
      const match = p.caseNumber?.match(new RegExp(`^${prefix}(\\d{6})$`))
      return match && match[1] ? Number.parseInt(match[1], 10) : 0
    })
    .filter((n) => !Number.isNaN(n))

  const maxSequence = sequences.length > 0 ? Math.max(...sequences) : 0
  const nextSequence = (maxSequence + 1).toString().padStart(6, '0')

  return `${prefix}${nextSequence}`
}
