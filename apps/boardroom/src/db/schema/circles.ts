/**
 * Circles Schema
 *
 * Organizational hierarchy (circles) for The Apex
 */

import { jsonb, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z as z4 } from 'zod/v4'
import { proposals } from './proposals'

export const circles = pgTable('circles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  parentId: uuid('parent_id'), // For nested hierarchies
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const circleMembers = pgTable('circle_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  circleId: uuid('circle_id').notNull().references(() => circles.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(), // References users table
  role: varchar('role', { length: 20 }).notNull().default('observer'), // sovereign, council, observer
  adminHat: jsonb('admin_hat'), // Granted capabilities array
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Zod schemas
export const insertCircleSchema = createInsertSchema(circles)
export const selectCircleSchema = createSelectSchema(circles)

export const insertCircleMemberSchema = createInsertSchema(circleMembers, {
  role: z4.enum(['sovereign', 'council', 'observer']),
  adminHat: z4.array(z4.string()).optional(),
})

export const selectCircleMemberSchema = createSelectSchema(circleMembers, {
  role: z4.enum(['sovereign', 'council', 'observer']),
  adminHat: z4.array(z4.string()).optional(),
})

// Relations for Drizzle relational queries API
export const circlesRelations = relations(circles, ({ one, many }) => ({
  parent: one(circles, {
    fields: [circles.parentId],
    references: [circles.id],
    relationName: 'parentCircle',
  }),
  children: many(circles, {
    relationName: 'parentCircle',
  }),
  proposals: many(proposals),
  members: many(circleMembers),
}))

export const circleMembersRelations = relations(circleMembers, ({ one }) => ({
  circle: one(circles, {
    fields: [circleMembers.circleId],
    references: [circles.id],
  }),
  // Note: userId references users table which may not exist yet
}))

// TypeScript types
export type Circle = typeof circles.$inferSelect
export type NewCircle = typeof circles.$inferInsert
export type CircleMember = typeof circleMembers.$inferSelect
export type NewCircleMember = typeof circleMembers.$inferInsert
