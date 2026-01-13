/**
 * Broadcast Reactions Schema
 *
 * User reactions (emoji) for broadcast announcements.
 * Supports engagement tracking and user feedback.
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z as z4 } from "zod/v4"
import { broadcasts } from "./broadcasts"

export const broadcastReactions = pgTable("broadcast_reactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  broadcastId: uuid("broadcast_id")
    .notNull()
    .references(() => broadcasts.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  emoji: text("emoji").notNull(), // '👍', '❤️', '🎉', etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Zod schemas
export const insertBroadcastReactionSchema = createInsertSchema(broadcastReactions, {
  emoji: z4.string().min(1).max(10), // Emoji can be multiple characters
})

export const selectBroadcastReactionSchema = createSelectSchema(broadcastReactions, {
  emoji: z4.string().min(1).max(10),
})

// Relations
export const broadcastReactionsRelations = relations(broadcastReactions, ({ one }) => ({
  broadcast: one(broadcasts, {
    fields: [broadcastReactions.broadcastId],
    references: [broadcasts.id],
  }),
}))

// TypeScript types
export type BroadcastReaction = typeof broadcastReactions.$inferSelect
export type NewBroadcastReaction = typeof broadcastReactions.$inferInsert
