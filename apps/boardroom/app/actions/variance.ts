/**
 * Server Actions for Variance Tracking (The Oracle - Weapon 8)
 *
 * Fetches variance analysis data for proposals.
 * Enables intelligence-driven styling with real-time risk assessment.
 *
 * @see PRD Section 4.3 Weapon 8: The Oracle
 */

'use server'

import { db } from '@/src/db'
import { caseWhatifBudgets, caseWhatifMilestones } from '@/src/db/schema'
import { eq, asc } from 'drizzle-orm'
import { z as z4 } from 'zod/v4'
import { validateActionInput } from '@/src/lib/actions/validate-action'

/**
 * Input schema for getting variance data
 */
const getVarianceInputSchema = z4.object({
  proposalId: z4.string().uuid(),
})

/**
 * Variance data response type
 */
export interface VarianceData {
  budgeted: number
  planned: number | null
  actual: number | null
  budgetedAt: Date
  plannedAt: Date | null
  actualAt: Date | null
  variancePct: number | null
  varianceStatus: 'on_track' | 'warning' | 'overrun' | 'underrun' | 'critical' | null
  varianceReason: string | null
  budgetedBreakdown: Record<string, unknown> | null
  plannedMetrics: Record<string, unknown> | null
  actualBreakdown: Record<string, unknown> | null
  milestones: Array<{
    id: string
    milestoneKey: string | null
    milestoneLabel: string | null
    scheduledDate: Date | null
    actualDate: Date | null
    budgetToDate: number | null
    actualToDate: number | null
    variancePctToDate: number | null
    notes: string | null
    reviewedAt: Date | null
  }>
}

/**
 * Get variance data for a proposal
 *
 * Returns variance analysis including Budgeted/Planned/Actual values
 * and calculated variance percentage and status.
 */
export async function getVarianceData(
  input: unknown
): Promise<VarianceData | null> {
  // Validate input
  const inputResult = validateActionInput(input, getVarianceInputSchema)
  if (!inputResult.success) {
    console.error('Invalid getVarianceData input:', inputResult.issues)
    return null
  }

  const { proposalId } = inputResult.data

  try {
    // Fetch variance budget data
    const [varianceBudget] = await db
      .select()
      .from(caseWhatifBudgets)
      .where(eq(caseWhatifBudgets.proposalId, proposalId))
      .limit(1)

    if (!varianceBudget) {
      // No variance data exists yet - return null
      return null
    }

    // Fetch milestones
    const milestones = await db
      .select()
      .from(caseWhatifMilestones)
      .where(eq(caseWhatifMilestones.whatifBudgetId, varianceBudget.id))
      .orderBy(asc(caseWhatifMilestones.scheduledDate))

    // Parse numeric values
    const budgeted = parseFloat(varianceBudget.budgetedTotal || '0')
    const planned = varianceBudget.plannedTotal
      ? parseFloat(varianceBudget.plannedTotal)
      : null
    const actual = varianceBudget.actualTotal
      ? parseFloat(varianceBudget.actualTotal)
      : null

    // Calculate variance percentage if we have actual data
    let variancePct: number | null = null
    if (actual !== null && budgeted > 0) {
      variancePct = ((actual - budgeted) / budgeted) * 100
    }

    // Transform milestones
    const transformedMilestones = milestones.map((m) => ({
      id: m.id,
      milestoneKey: m.milestoneKey,
      milestoneLabel: m.milestoneLabel,
      scheduledDate: m.scheduledDate,
      actualDate: m.actualDate,
      budgetToDate: m.budgetToDate ? parseFloat(m.budgetToDate) : null,
      actualToDate: m.actualToDate ? parseFloat(m.actualToDate) : null,
      variancePctToDate: m.variancePctToDate
        ? parseFloat(m.variancePctToDate)
        : null,
      notes: m.notes,
      reviewedAt: m.reviewedAt,
    }))

    return {
      budgeted,
      planned,
      actual,
      budgetedAt: varianceBudget.budgetedAt,
      plannedAt: varianceBudget.plannedAt || null,
      actualAt: varianceBudget.lastActualAt || null,
      variancePct,
      varianceStatus:
        (varianceBudget.varianceStatus as VarianceData['varianceStatus']) || null,
      varianceReason: varianceBudget.varianceReason || null,
      budgetedBreakdown:
        (varianceBudget.budgetedBreakdown as Record<string, unknown>) || null,
      plannedMetrics:
        (varianceBudget.plannedMetrics as Record<string, unknown>) || null,
      actualBreakdown:
        (varianceBudget.actualBreakdown as Record<string, unknown>) || null,
      milestones: transformedMilestones,
    }
  } catch (error) {
    console.error('Error fetching variance data:', error)
    return null
  }
}

/**
 * Calculate variance percentage from budgeted and actual
 */
export function calculateVariancePct(budgeted: number, actual: number): number {
  if (budgeted === 0) return 0
  return ((actual - budgeted) / budgeted) * 100
}

/**
 * Calculate risk status from variance percentage
 */
export function calculateRiskStatusFromVariance(
  variancePct: number
): 'on_track' | 'warning' | 'overrun' | 'underrun' | 'critical' {
  if (variancePct >= 20) return 'critical'
  if (variancePct >= 10) return 'overrun'
  if (variancePct >= 5) return 'warning'
  if (variancePct <= -10) return 'underrun'
  return 'on_track'
}

/**
 * Input schema for creating variance budget
 */
const createVarianceBudgetInputSchema = z4.object({
  proposalId: z4.string().uuid(),
  caseNumber: z4.string(),
  stencilId: z4.string(),
  budgetedTotal: z4.number().positive(),
  budgetedBreakdown: z4.record(z4.string(), z4.unknown()).optional(),
  budgetedBy: z4.string().uuid(),
})

/**
 * Create variance budget for a proposal
 *
 * Creates initial budgeted values when proposal is created or approved.
 */
export async function createVarianceBudget(
  input: unknown
): Promise<{ success: boolean; varianceBudgetId?: string; error?: string }> {
  const inputResult = validateActionInput(input, createVarianceBudgetInputSchema)
  if (!inputResult.success) {
    console.error('Invalid createVarianceBudget input:', inputResult.issues)
    return { success: false, error: 'Invalid input' }
  }

  const { proposalId, caseNumber, stencilId, budgetedTotal, budgetedBreakdown, budgetedBy } =
    inputResult.data

  try {
    // Check if variance budget already exists
    const [existing] = await db
      .select()
      .from(caseWhatifBudgets)
      .where(eq(caseWhatifBudgets.proposalId, proposalId))
      .limit(1)

    if (existing) {
      return { success: false, error: 'Variance budget already exists for this proposal' }
    }

    // Create variance budget
    const [varianceBudget] = await db
      .insert(caseWhatifBudgets)
      .values({
        proposalId,
        caseNumber,
        stencilId,
        budgetedTotal: budgetedTotal.toString(),
        budgetedBreakdown: budgetedBreakdown || null,
        budgetedBy,
        budgetedAt: new Date(),
      })
      .returning()

    if (!varianceBudget) {
      return { success: false, error: 'Failed to create variance budget' }
    }

    return { success: true, varianceBudgetId: varianceBudget.id }
  } catch (error) {
    console.error('Error creating variance budget:', error)
    return { success: false, error: 'Failed to create variance budget' }
  }
}

/**
 * Input schema for updating variance budget
 */
const updateVarianceBudgetInputSchema = z4.object({
  proposalId: z4.string().uuid(),
  plannedTotal: z4.number().positive().optional(),
  plannedMetrics: z4.record(z4.string(), z4.unknown()).optional(),
  plannedNotes: z4.string().optional(),
  actualTotal: z4.number().optional(),
  actualBreakdown: z4.record(z4.string(), z4.unknown()).optional(),
  actualMetrics: z4.record(z4.string(), z4.unknown()).optional(),
  varianceReason: z4.string().optional(),
})

/**
 * Update variance budget (planned or actual values)
 *
 * Automatically calculates variance percentage and status when actual values are updated.
 */
export async function updateVarianceBudget(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const inputResult = validateActionInput(input, updateVarianceBudgetInputSchema)
  if (!inputResult.success) {
    console.error('Invalid updateVarianceBudget input:', inputResult.issues)
    return { success: false, error: 'Invalid input' }
  }

  const {
    proposalId,
    plannedTotal,
    plannedMetrics,
    plannedNotes,
    actualTotal,
    actualBreakdown,
    actualMetrics,
    varianceReason,
  } = inputResult.data

  try {
    // Fetch existing variance budget
    const [existing] = await db
      .select()
      .from(caseWhatifBudgets)
      .where(eq(caseWhatifBudgets.proposalId, proposalId))
      .limit(1)

    if (!existing) {
      return { success: false, error: 'Variance budget not found' }
    }

    // Build update object
    const updateData: {
      plannedTotal?: string
      plannedMetrics?: Record<string, unknown>
      plannedNotes?: string
      plannedAt?: Date
      actualTotal?: string
      actualBreakdown?: Record<string, unknown>
      actualMetrics?: Record<string, unknown>
      lastActualAt?: Date
      actualReviewCount?: string
      variancePct?: string
      varianceStatus?: string
      varianceReason?: string
      updatedAt: Date
    } = {
      updatedAt: new Date(),
    }

    // Update planned values
    if (plannedTotal !== undefined) {
      updateData.plannedTotal = plannedTotal.toString()
      updateData.plannedAt = new Date()
    }
    if (plannedMetrics !== undefined) {
      updateData.plannedMetrics = plannedMetrics
    }
    if (plannedNotes !== undefined) {
      updateData.plannedNotes = plannedNotes
    }

    // Update actual values
    if (actualTotal !== undefined) {
      updateData.actualTotal = actualTotal.toString()
      updateData.lastActualAt = new Date()
      // Increment review count
      const currentCount = parseFloat(existing.actualReviewCount || '0')
      updateData.actualReviewCount = (currentCount + 1).toString()
    }
    if (actualBreakdown !== undefined) {
      updateData.actualBreakdown = actualBreakdown
    }
    if (actualMetrics !== undefined) {
      updateData.actualMetrics = actualMetrics
    }
    if (varianceReason !== undefined) {
      updateData.varianceReason = varianceReason
    }

    // Calculate variance if we have both budgeted and actual
    const budgeted = parseFloat(existing.budgetedTotal || '0')
    const actual = actualTotal !== undefined ? actualTotal : parseFloat(existing.actualTotal || '0')

    if (budgeted > 0 && actual !== null && !isNaN(actual)) {
      const variancePct = calculateVariancePct(budgeted, actual)
      updateData.variancePct = variancePct.toFixed(2)
      updateData.varianceStatus = calculateRiskStatusFromVariance(variancePct)
    }

    // Update variance budget
    await db
      .update(caseWhatifBudgets)
      .set(updateData)
      .where(eq(caseWhatifBudgets.proposalId, proposalId))

    return { success: true }
  } catch (error) {
    console.error('Error updating variance budget:', error)
    return { success: false, error: 'Failed to update variance budget' }
  }
}

/**
 * Input schema for creating milestone
 */
const createMilestoneInputSchema = z4.object({
  proposalId: z4.string().uuid(),
  milestoneKey: z4.string(),
  milestoneLabel: z4.string(),
  scheduledDate: z4.date(),
  budgetToDate: z4.number().optional(),
  actualToDate: z4.number().optional(),
})

/**
 * Create milestone review for variance tracking
 */
export async function createMilestone(
  input: unknown
): Promise<{ success: boolean; milestoneId?: string; error?: string }> {
  const inputResult = validateActionInput(input, createMilestoneInputSchema)
  if (!inputResult.success) {
    console.error('Invalid createMilestone input:', inputResult.issues)
    return { success: false, error: 'Invalid input' }
  }

  const { proposalId, milestoneKey, milestoneLabel, scheduledDate, budgetToDate, actualToDate } =
    inputResult.data

  try {
    // Fetch variance budget to get whatifBudgetId
    const [varianceBudget] = await db
      .select()
      .from(caseWhatifBudgets)
      .where(eq(caseWhatifBudgets.proposalId, proposalId))
      .limit(1)

    if (!varianceBudget) {
      return { success: false, error: 'Variance budget not found for this proposal' }
    }

    // Calculate variance percentage if we have both values
    let variancePctToDate: string | undefined
    if (budgetToDate !== undefined && actualToDate !== undefined && budgetToDate > 0) {
      const variancePct = calculateVariancePct(budgetToDate, actualToDate)
      variancePctToDate = variancePct.toFixed(2)
    }

    // Create milestone
    const [milestone] = await db
      .insert(caseWhatifMilestones)
      .values({
        whatifBudgetId: varianceBudget.id,
        milestoneKey,
        milestoneLabel,
        scheduledDate,
        budgetToDate: budgetToDate?.toString(),
        actualToDate: actualToDate?.toString(),
        variancePctToDate,
      })
      .returning()

    if (!milestone) {
      return { success: false, error: 'Failed to create milestone' }
    }

    return { success: true, milestoneId: milestone.id }
  } catch (error) {
    console.error('Error creating milestone:', error)
    return { success: false, error: 'Failed to create milestone' }
  }
}

/**
 * Input schema for updating milestone
 */
const updateMilestoneInputSchema = z4.object({
  milestoneId: z4.string().uuid(),
  actualDate: z4.date().optional(),
  budgetToDate: z4.number().optional(),
  actualToDate: z4.number().optional(),
  notes: z4.string().optional(),
  reviewedBy: z4.string().uuid().optional(),
})

/**
 * Update milestone review
 */
export async function updateMilestone(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const inputResult = validateActionInput(input, updateMilestoneInputSchema)
  if (!inputResult.success) {
    console.error('Invalid updateMilestone input:', inputResult.issues)
    return { success: false, error: 'Invalid input' }
  }

  const { milestoneId, actualDate, budgetToDate, actualToDate, notes, reviewedBy } =
    inputResult.data

  try {
    // Build update object
    const updateData: {
      actualDate?: Date
      budgetToDate?: string
      actualToDate?: string
      variancePctToDate?: string
      notes?: string
      reviewedBy?: string
      reviewedAt?: Date
      updatedAt: Date
    } = {
      updatedAt: new Date(),
    }

    if (actualDate !== undefined) {
      updateData.actualDate = actualDate
    }
    if (budgetToDate !== undefined) {
      updateData.budgetToDate = budgetToDate.toString()
    }
    if (actualToDate !== undefined) {
      updateData.actualToDate = actualToDate.toString()
    }
    if (notes !== undefined) {
      updateData.notes = notes
    }
    if (reviewedBy !== undefined) {
      updateData.reviewedBy = reviewedBy
      updateData.reviewedAt = new Date()
    }

    // Calculate variance percentage if we have both values
    if (budgetToDate !== undefined && actualToDate !== undefined && budgetToDate > 0) {
      const variancePct = calculateVariancePct(budgetToDate, actualToDate)
      updateData.variancePctToDate = variancePct.toFixed(2)
    }

    // Update milestone
    await db
      .update(caseWhatifMilestones)
      .set(updateData)
      .where(eq(caseWhatifMilestones.id, milestoneId))

    return { success: true }
  } catch (error) {
    console.error('Error updating milestone:', error)
    return { success: false, error: 'Failed to update milestone' }
  }
}
