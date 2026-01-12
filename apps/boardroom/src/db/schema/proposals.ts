/**
 * Proposals Schema
 *
 * Core proposal table for The Apex Decision Engine
 */

import { boolean, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z as z4 } from 'zod/v4'
import { proposalStatusSchema } from '@mythic/shared-types/boardroom'
import { circles } from './circles'
import { boardComments } from './comments'
import { thanosEvents } from './thanos'
import { proposalStencils } from './stencils'

export const proposals = pgTable('proposals', {
  id: uuid('id').primaryKey().defaultRandom(),
  caseNumber: varchar('case_number', { length: 50 }).notNull().unique(),
  stencilId: varchar('stencil_id', { length: 100 }).notNull(),
  circleId: uuid('circle_id').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('DRAFT'),
  submittedBy: uuid('submitted_by').notNull(),
  data: jsonb('data').notNull(), // Structured proposal data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  approvedAt: timestamp('approved_at'),
  vetoedAt: timestamp('vetoed_at'),
  approvedBy: uuid('approved_by'),
  vetoedBy: uuid('vetoed_by'),
  vetoReason: text('veto_reason'),
})

// Base Zod schemas from Drizzle
const baseInsertProposalSchema = createInsertSchema(proposals, {
  status: proposalStatusSchema,
  data: z4.record(z4.string(), z4.unknown()),
})

const baseSelectProposalSchema = createSelectSchema(proposals, {
  status: proposalStatusSchema,
  data: z4.record(z4.string(), z4.unknown()),
})

// Enhanced insert schema with business logic refinements
export const insertProposalSchema = baseInsertProposalSchema
  .refine(
    (data) => {
      // Business logic: case number format validation
      if (data.caseNumber) {
        return /^CASE-\d{4}-\d{6}$/.test(data.caseNumber)
      }
      return true // Allow undefined (will be generated)
    },
    {
      message: 'Case number must match format: CASE-YYYY-NNNNNN',
      path: ['caseNumber'],
    }
  )
  .refine(
    (data) => {
      // Business logic: status transitions
      // DRAFT can be created, but other statuses require specific conditions
      if (data.status && data.status !== 'DRAFT') {
        // If status is not DRAFT, ensure required fields are present
        if (data.status === 'APPROVED' && !data.approvedBy) {
          return false
        }
        if (data.status === 'VETOED' && (!data.vetoedBy || !data.vetoReason)) {
          return false
        }
      }
      return true
    },
    {
      message: 'Invalid status transition or missing required fields',
      path: ['status'],
    }
  )
  .describe('Proposal creation schema with business rules validation')

// Enhanced select schema with additional refinements
export const selectProposalSchema = baseSelectProposalSchema
  .refine(
    (data) => {
      // Business logic: ensure timestamps are valid
      if (data.createdAt && data.updatedAt) {
        return data.updatedAt >= data.createdAt
      }
      return true
    },
    {
      message: 'Updated timestamp must be after creation timestamp',
      path: ['updatedAt'],
    }
  )
  .refine(
    (data) => {
      // Business logic: if approved, must have approvedBy and approvedAt
      if (data.status === 'APPROVED') {
        return !!(data.approvedBy && data.approvedAt)
      }
      return true
    },
    {
      message: 'Approved proposals must have approvedBy and approvedAt',
      path: ['status'],
    }
  )
  .refine(
    (data) => {
      // Business logic: if vetoed, must have vetoedBy, vetoReason, and vetoedAt
      if (data.status === 'VETOED') {
        return !!(data.vetoedBy && data.vetoReason && data.vetoedAt)
      }
      return true
    },
    {
      message: 'Vetoed proposals must have vetoedBy, vetoReason, and vetoedAt',
      path: ['status'],
    }
  )
  .describe('Proposal selection schema for database queries with business rules')

// Transformation pipeline: Insert → Select → Shared Types
// This allows chaining validations and transformations
export const proposalInputSchema = insertProposalSchema
  .pipe(selectProposalSchema)
  .describe('Proposal input transformation pipeline')

// Relations for Drizzle relational queries API
export const proposalsRelations = relations(proposals, ({ one, many }) => ({
  circle: one(circles, {
    fields: [proposals.circleId],
    references: [circles.id],
  }),
  stencil: one(proposalStencils, {
    fields: [proposals.stencilId],
    references: [proposalStencils.id],
  }),
  comments: many(boardComments),
  events: many(thanosEvents),
  // Note: submittedBy, approvedBy, vetoedBy reference users table
  // which may not exist yet - these can be added when users table is created
}))

// TypeScript types
export type Proposal = typeof proposals.$inferSelect
export type NewProposal = typeof proposals.$inferInsert
