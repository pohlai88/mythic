/**
 * Board Comments Schema
 *
 * The BoardDialog - Real-time collaboration comments
 */

import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z as z4 } from "zod/v4"
import { proposals } from "./proposals"

export const boardComments = pgTable("board_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  proposalId: uuid("proposal_id").notNull(), // References proposals.id
  userId: uuid("user_id").notNull(), // Author
  content: text("content").notNull(),
  mode: varchar("mode", { length: 20 }).notNull().default("open_floor"), // open_floor, sovereign_consultation, whisper
  mentionedUserId: uuid("mentioned_user_id"), // For @mentions
  parentCommentId: uuid("parent_comment_id"), // For threaded comments
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Zod schemas
export const insertBoardCommentSchema = createInsertSchema(boardComments, {
  mode: z4.enum(["open_floor", "sovereign_consultation", "whisper"]),
  content: z4.string().min(1),
})

export const selectBoardCommentSchema = createSelectSchema(boardComments, {
  mode: z4.enum(["open_floor", "sovereign_consultation", "whisper"]),
  content: z4.string().min(1),
})

// Relations for Drizzle relational queries API
export const boardCommentsRelations = relations(boardComments, ({ one, many }) => ({
  proposal: one(proposals, {
    fields: [boardComments.proposalId],
    references: [proposals.id],
  }),
  parent: one(boardComments, {
    fields: [boardComments.parentCommentId],
    references: [boardComments.id],
    relationName: "parentComment",
  }),
  replies: many(boardComments, {
    relationName: "parentComment",
  }),
  // Note: userId and mentionedUserId reference users table which may not exist yet
}))

// TypeScript types
export type BoardComment = typeof boardComments.$inferSelect
export type NewBoardComment = typeof boardComments.$inferInsert
