/**
 * Broadcast Templates Schema
 *
 * Pre-defined templates for common broadcast types.
 * Enables quick creation of standardized announcements.
 */

import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z as z4 } from "zod/v4"
import { broadcastTypeSchema } from "./broadcasts"

/**
 * Broadcast Templates Table
 *
 * Stores reusable templates for common broadcast types
 */
export const broadcastTemplates = pgTable("broadcast_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // Template name
  type: text("type").notNull(), // Broadcast type
  titleTemplate: text("title_template").notNull(), // Title with variables (e.g., "Approved: {proposalTitle}")
  messageTemplate: text("message_template"), // Message with variables
  defaultAudience: text("default_audience").default("all"), // Default audience
  defaultSticky: text("default_sticky").default("true"), // Default sticky flag
  variables: jsonb("variables"), // Available variables and their descriptions
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Zod schemas
export const insertBroadcastTemplateSchema = createInsertSchema(broadcastTemplates, {
  type: broadcastTypeSchema,
})

export const selectBroadcastTemplateSchema = createSelectSchema(broadcastTemplates, {
  type: broadcastTypeSchema,
})

// TypeScript types
export type BroadcastTemplate = typeof broadcastTemplates.$inferSelect
export type NewBroadcastTemplate = typeof broadcastTemplates.$inferInsert
