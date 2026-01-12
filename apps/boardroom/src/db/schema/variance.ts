/**
 * Variance Tracking Schema (The Oracle - Weapon 8)
 *
 * Tracks Budgeted/Planned/Actual variance analysis for proposals.
 * Enables intelligence-driven decision making with real-time risk assessment.
 *
 * @see PRD Section 4.3 Weapon 8: The Oracle
 */

import { date, jsonb, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z as z4 } from 'zod/v4'
import { proposals } from './proposals'

/**
 * Variance Status Schema
 */
export const varianceStatusSchema = z4.enum([
  'on_track',
  'warning',
  'overrun',
  'underrun',
  'critical',
])

export type VarianceStatus = z4.infer<typeof varianceStatusSchema>

/**
 * Case What-If Budgets Table
 *
 * Tracks the progression: Budgeted → Planned → Actual
 */
export const caseWhatifBudgets = pgTable('case_whatif_budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  proposalId: uuid('proposal_id')
    .notNull()
    .references(() => proposals.id, { onDelete: 'cascade' }),
  caseNumber: text('case_number').notNull(), // Link to Case
  stencilId: text('stencil_id').notNull(), // Which template

  // BUDGETED (from proposal/case creation)
  budgetedTotal: numeric('budgeted_total', { precision: 12, scale: 2 }).notNull(),
  budgetedBreakdown: jsonb('budgeted_breakdown'), // { salary: 150000, benefits: 45000, ... }
  budgetedBy: uuid('budgeted_by').notNull(), // Manager who created
  budgetedAt: timestamp('budgeted_at').notNull().defaultNow(),

  // PLANNED (manager's expectation at approval time)
  plannedTotal: numeric('planned_total', { precision: 12, scale: 2 }),
  plannedMetrics: jsonb('planned_metrics'), // { ttp: 60, roi: 9, retention: 85, ... }
  plannedNotes: text('planned_notes'),
  plannedAt: timestamp('planned_at'),

  // ACTUAL (tracking against reality)
  actualTotal: numeric('actual_total', { precision: 12, scale: 2 }),
  actualBreakdown: jsonb('actual_breakdown'), // Populated as time progresses
  actualMetrics: jsonb('actual_metrics'),
  actualReviewCount: numeric('actual_review_count', { precision: 5, scale: 0 }).default('0'),
  lastActualAt: timestamp('last_actual_at'),

  // VARIANCE ANALYSIS
  variancePct: numeric('variance_pct', { precision: 5, scale: 2 }), // (actual - budgeted) / budgeted * 100
  varianceReason: text('variance_reason'), // Why did it vary? Free-form or category
  varianceStatus: text('variance_status'), // "on_track" | "warning" | "overrun" | "underrun" | "critical"

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

/**
 * Milestone Reviews Table
 *
 * Tracks milestone reviews (30-day, Q1, annual) with variance tracking
 */
export const caseWhatifMilestones = pgTable('case_whatif_milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  whatifBudgetId: uuid('whatif_budget_id')
    .notNull()
    .references(() => caseWhatifBudgets.id, { onDelete: 'cascade' }),

  milestoneKey: text('milestone_key'), // "onboarded", "q1_review", "30_day", "annual"
  milestoneLabel: text('milestone_label'), // "Employee Onboarded", "Q1 Review", "30-Day Review"

  scheduledDate: date('scheduled_date'), // When it should happen
  actualDate: date('actual_date'), // When it actually happened

  budgetToDate: numeric('budget_to_date', { precision: 12, scale: 2 }), // Cumulative budgeted spend
  actualToDate: numeric('actual_to_date', { precision: 12, scale: 2 }), // Cumulative actual spend
  variancePctToDate: numeric('variance_pct_to_date', { precision: 5, scale: 2 }), // Variance at this milestone

  notes: text('notes'), // Reviewer observations
  reviewedBy: uuid('reviewed_by'),
  reviewedAt: timestamp('reviewed_at'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Zod schemas for validation
export const insertCaseWhatifBudgetSchema = createInsertSchema(caseWhatifBudgets, {
  varianceStatus: varianceStatusSchema.optional(),
  budgetedBreakdown: z4.record(z4.string(), z4.unknown()).optional(),
  plannedMetrics: z4.record(z4.string(), z4.unknown()).optional(),
  actualBreakdown: z4.record(z4.string(), z4.unknown()).optional(),
  actualMetrics: z4.record(z4.string(), z4.unknown()).optional(),
})

export const selectCaseWhatifBudgetSchema = createSelectSchema(caseWhatifBudgets, {
  varianceStatus: varianceStatusSchema.optional(),
  budgetedBreakdown: z4.record(z4.string(), z4.unknown()).optional(),
  plannedMetrics: z4.record(z4.string(), z4.unknown()).optional(),
  actualBreakdown: z4.record(z4.string(), z4.unknown()).optional(),
  actualMetrics: z4.record(z4.string(), z4.unknown()).optional(),
})

export const insertCaseWhatifMilestoneSchema = createInsertSchema(caseWhatifMilestones)

export const selectCaseWhatifMilestoneSchema = createSelectSchema(caseWhatifMilestones)

// TypeScript types
export type CaseWhatifBudget = typeof caseWhatifBudgets.$inferSelect
export type NewCaseWhatifBudget = typeof caseWhatifBudgets.$inferInsert
export type CaseWhatifMilestone = typeof caseWhatifMilestones.$inferSelect
export type NewCaseWhatifMilestone = typeof caseWhatifMilestones.$inferInsert
