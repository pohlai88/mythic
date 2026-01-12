/**
 * Proposal Stencils Schema
 *
 * Living Schema templates (The Codex) for The Apex
 */

import { jsonb, pgTable, integer, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z as z4 } from 'zod/v4'
import { proposals } from './proposals'

export const proposalStencils = pgTable('proposal_stencils', {
  id: varchar('id', { length: 100 }).primaryKey(), // e.g., "hiring_request_v2"
  name: varchar('name', { length: 255 }).notNull(),
  version: integer('version').notNull().default(1),
  fields: jsonb('fields').notNull(), // Array of field definitions
  requiredApprovers: jsonb('required_approvers').notNull(), // Array of approver roles
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Field definition schema
const fieldSchema = z4.object({
  id: z4.string(),
  label: z4.string(),
  type: z4.enum(['string', 'number', 'date', 'enum', 'jsonb']),
  required: z4.boolean(),
  validationRule: z4.string().optional(),
})

// Zod schemas
export const insertProposalStencilSchema = createInsertSchema(proposalStencils, {
  fields: z4.array(fieldSchema),
  requiredApprovers: z4.array(z4.string()),
})

export const selectProposalStencilSchema = createSelectSchema(proposalStencils, {
  fields: z4.array(fieldSchema),
  requiredApprovers: z4.array(z4.string()),
})

// Relations for Drizzle relational queries API
export const proposalStencilsRelations = relations(proposalStencils, ({ many }) => ({
  proposals: many(proposals),
}))

// TypeScript types
export type ProposalStencil = typeof proposalStencils.$inferSelect
export type NewProposalStencil = typeof proposalStencils.$inferInsert
