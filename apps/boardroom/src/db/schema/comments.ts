/**
 * Board Comments Schema
 *
 * The BoardDialog - Real-time collaboration comments
 */

import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z as z4 } from 'zod/v4'

export const boardComments = pgTable('board_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  proposalId: uuid('proposal_id').notNull(), // References proposals.id
  userId: uuid('user_id').notNull(), // Author
  content: text('content').notNull(),
  mode: varchar('mode', { length: 20 }).notNull().default('open_floor'), // open_floor, sovereign_consultation, whisper
  mentionedUserId: uuid('mentioned_user_id'), // For @mentions
  parentCommentId: uuid('parent_comment_id'), // For threaded comments
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Zod schemas
export const insertBoardCommentSchema = createInsertSchema(boardComments, {
  mode: z4.enum(['open_floor', 'sovereign_consultation', 'whisper']),
  content: z4.string().min(1),
})

export const selectBoardCommentSchema = createSelectSchema(boardComments, {
  mode: z4.enum(['open_floor', 'sovereign_consultation', 'whisper']),
  content: z4.string().min(1),
})

// TypeScript types
export type BoardComment = typeof boardComments.$inferSelect
export type NewBoardComment = typeof boardComments.$inferInsert
