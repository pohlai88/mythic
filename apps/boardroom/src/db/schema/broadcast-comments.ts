/**
 * Broadcast Comments Schema
 *
 * Comments and threading for broadcast announcements.
 * Supports @mentions and parent/child relationships for threaded discussions.
 */

import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z as z4 } from 'zod/v4'
import { broadcasts } from './broadcasts'

export const broadcastComments = pgTable('broadcast_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  broadcastId: uuid('broadcast_id')
    .notNull()
    .references(() => broadcasts.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(), // Author
  content: text('content').notNull(),
  mode: varchar('mode', { length: 20 }).notNull().default('open_floor'), // open_floor, sovereign_consultation
  mentionedUserId: uuid('mentioned_user_id'), // For @mentions
  parentCommentId: uuid('parent_comment_id'), // For threaded comments
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Zod schemas
export const insertBroadcastCommentSchema = createInsertSchema(broadcastComments, {
  mode: z4.enum(['open_floor', 'sovereign_consultation']),
  content: z4.string().min(1).max(5000),
})

export const selectBroadcastCommentSchema = createSelectSchema(broadcastComments, {
  mode: z4.enum(['open_floor', 'sovereign_consultation']),
  content: z4.string().min(1).max(5000),
})

// Relations for Drizzle relational queries API
export const broadcastCommentsRelations = relations(broadcastComments, ({ one, many }) => ({
  broadcast: one(broadcasts, {
    fields: [broadcastComments.broadcastId],
    references: [broadcasts.id],
  }),
  parent: one(broadcastComments, {
    fields: [broadcastComments.parentCommentId],
    references: [broadcastComments.id],
    relationName: 'parentComment',
  }),
  replies: many(broadcastComments, {
    relationName: 'parentComment',
  }),
  // Note: userId and mentionedUserId reference users table which may not exist yet
}))

// TypeScript types
export type BroadcastComment = typeof broadcastComments.$inferSelect
export type NewBroadcastComment = typeof broadcastComments.$inferInsert
