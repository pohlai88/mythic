/**
 * Thanos Events Schema
 *
 * 6W1H Forensic Audit Trail for The Apex
 */

import { jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z as z4 } from "zod/v4"
import { proposals } from "./proposals"

export const thanosEvents = pgTable("thanos_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  proposalId: uuid("proposal_id").notNull(), // References proposals.id
  who: uuid("who").notNull(), // Actor ID (user_id)
  what: varchar("what", { length: 50 }).notNull(), // Action type: CREATED, EDITED, APPROVED, COMMENTED, etc.
  when: timestamp("when").defaultNow().notNull(),
  where: varchar("where", { length: 50 }).notNull().default("web"), // Source: web, api, webhook
  why: text("why"), // Reason for action
  which: text("which"), // Alternatives considered
  how: varchar("how", { length: 50 }).notNull().default("UI"), // Method: UI click, API call, batch
  metadata: jsonb("metadata"), // Additional context
})

// Zod schemas
export const insertThanosEventSchema = createInsertSchema(thanosEvents, {
  what: z4.string().min(1).max(50),
  where: z4.enum(["web", "api", "webhook"]),
  how: z4.enum(["UI", "API", "batch"]),
  metadata: z4.record(z4.string(), z4.unknown()).optional(),
})

export const selectThanosEventSchema = createSelectSchema(thanosEvents, {
  what: z4.string().min(1).max(50),
  where: z4.enum(["web", "api", "webhook"]),
  how: z4.enum(["UI", "API", "batch"]),
  metadata: z4.record(z4.string(), z4.unknown()).optional(),
})

// Relations for Drizzle relational queries API
export const thanosEventsRelations = relations(thanosEvents, ({ one }) => ({
  proposal: one(proposals, {
    fields: [thanosEvents.proposalId],
    references: [proposals.id],
  }),
  // Note: who references users table which may not exist yet
}))

// TypeScript types
export type ThanosEvent = typeof thanosEvents.$inferSelect
export type NewThanosEvent = typeof thanosEvents.$inferInsert
