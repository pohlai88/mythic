/**
 * Broadcast Versions Schema
 *
 * Tracks version history for broadcast announcements.
 * Enables audit trail and change tracking for compliance.
 */

import { pgTable, text, timestamp, uuid, numeric } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z as z4 } from 'zod/v4'
import { broadcasts } from './broadcasts'

export const broadcastVersions = pgTable('broadcast_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  broadcastId: uuid('broadcast_id')
    .notNull()
    .references(() => broadcasts.id, { onDelete: 'cascade' }),
  versionNumber: numeric('version_number', { precision: 5, scale: 0 }).notNull(),
  title: text('title').notNull(),
  message: text('message'),
  audience: text('audience').notNull(),
  type: text('type').notNull(),
  priority: text('priority'),
  categories: text('categories'), // JSON string
  tags: text('tags'), // JSON string
  changedBy: uuid('changed_by').notNull(),
  changedAt: timestamp('changed_at').notNull().defaultNow(),
  changeReason: text('change_reason'),
})

// Zod schemas
export const insertBroadcastVersionSchema = createInsertSchema(broadcastVersions, {
  versionNumber: z4.coerce.number(),
  changeReason: z4.string().optional(),
})

export const selectBroadcastVersionSchema = createSelectSchema(broadcastVersions, {
  versionNumber: z4.coerce.number(),
  changeReason: z4.string().optional(),
})

// Relations
export const broadcastVersionsRelations = relations(broadcastVersions, ({ one }) => ({
  broadcast: one(broadcasts, {
    fields: [broadcastVersions.broadcastId],
    references: [broadcasts.id],
  }),
}))

// TypeScript types
export type BroadcastVersion = typeof broadcastVersions.$inferSelect
export type NewBroadcastVersion = typeof broadcastVersions.$inferInsert
