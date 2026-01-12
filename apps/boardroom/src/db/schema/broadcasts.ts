/**
 * Broadcasts Schema (The Herald - Weapon 9)
 *
 * Sticky banner announcements with read tracking.
 * Enables CEO/Admin to broadcast important announcements to the organization.
 *
 * @see PRD Section 4.3 Weapon 9: The Herald
 */

import { boolean, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z as z4 } from 'zod/v4'
import { proposals } from './proposals'

/**
 * Broadcast Type Schema
 */
export const broadcastTypeSchema = z4.enum([
  'approval',
  'veto',
  'announcement',
  'poll',
  'emergency',
])

export type BroadcastType = z4.infer<typeof broadcastTypeSchema>

/**
 * Broadcasts Table
 *
 * Stores sticky banner announcements created by CEO/Admin
 */
export const broadcasts = pgTable('broadcasts', {
  id: uuid('id').primaryKey().defaultRandom(),

  // WHO
  createdBy: uuid('created_by').notNull(), // CEO/Admin only

  // WHAT
  type: text('type').notNull(), // "approval" | "veto" | "announcement" | "poll" | "emergency"
  title: text('title').notNull(),
  message: text('message'), // Full explanation (supports markdown)
  templateId: text('template_id'), // Reference to broadcast template

  // LINKED TO
  proposalId: uuid('proposal_id').references(() => proposals.id, { onDelete: 'set null' }), // If about a proposal
  caseNumber: text('case_number'), // If about a ticket/case

  // TARGETING
  audience: text('audience').notNull(), // "all" | "circle:{id}" | "role:{role}"

  // VISIBILITY
  sticky: boolean('sticky').default(true), // Non-dismissible?
  expiresAt: timestamp('expires_at'), // Auto-remove after N days
  scheduledFor: timestamp('scheduled_for'), // Schedule broadcast for future
  isDraft: boolean('is_draft').default(false), // Draft mode (not published)
  priority: text('priority').default('normal'), // 'low' | 'normal' | 'high' | 'urgent'
  categories: jsonb('categories'), // Array of category strings
  tags: jsonb('tags'), // Array of tag strings

  // ATTACHMENTS
  imageUrl: text('image_url'), // URL to attached image
  attachments: jsonb('attachments'), // Array of attachment metadata

  // TRACKING
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

/**
 * Broadcast Reads Table
 *
 * Tracks who has read each broadcast (for read tracking and compliance)
 */
export const broadcastReads = pgTable('broadcast_reads', {
  id: uuid('id').primaryKey().defaultRandom(),
  broadcastId: uuid('broadcast_id')
    .notNull()
    .references(() => broadcasts.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  readAt: timestamp('read_at').notNull().defaultNow(),
})

// Zod schemas for validation
export const insertBroadcastSchema = createInsertSchema(broadcasts, {
  type: broadcastTypeSchema,
})

export const selectBroadcastSchema = createSelectSchema(broadcasts, {
  type: broadcastTypeSchema,
})

export const insertBroadcastReadSchema = createInsertSchema(broadcastReads)

export const selectBroadcastReadSchema = createSelectSchema(broadcastReads)

// TypeScript types
export type Broadcast = typeof broadcasts.$inferSelect
export type NewBroadcast = typeof broadcasts.$inferInsert
export type BroadcastRead = typeof broadcastReads.$inferSelect
export type NewBroadcastRead = typeof broadcastReads.$inferInsert
