/**
 * Configuration Schema
 *
 * Global Config (The Sovereign's Law) and User Config (The Manager's Preference)
 */

import { jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z as z4 } from 'zod/v4'

export const globalConfig = pgTable('global_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: jsonb('value').notNull(),
  description: text('description'),
  updatedBy: uuid('updated_by').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const userConfigs = pgTable('user_configs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  config: jsonb('config').notNull(), // User preferences object
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Zod schemas for database operations
// Note: For comprehensive validation, use schemas from @/src/lib/config/user-config-schema
export const insertGlobalConfigSchema = createInsertSchema(globalConfig, {
  key: z4.string().min(1).max(100),
  value: z4.record(z4.string(), z4.unknown()), // Basic validation - use comprehensive schema for runtime validation
})

// Global config is immutable (read-only) - The Sovereign's Law
export const selectGlobalConfigSchema = createSelectSchema(globalConfig, {
  value: z4.record(z4.string(), z4.unknown()), // Basic validation - use comprehensive schema for runtime validation
}).readonly().describe('Immutable global configuration schema')

export const insertUserConfigSchema = createInsertSchema(userConfigs, {
  config: z4.record(z4.string(), z4.unknown()), // Basic validation - use comprehensive schema for runtime validation
})

// User config is immutable once set - The Manager's Preference
export const selectUserConfigSchema = createSelectSchema(userConfigs, {
  config: z4.record(z4.string(), z4.unknown()), // Basic validation - use comprehensive schema for runtime validation
}).readonly().describe('Immutable user configuration schema')

// TypeScript types
export type GlobalConfig = typeof globalConfig.$inferSelect
export type NewGlobalConfig = typeof globalConfig.$inferInsert
export type UserConfig = typeof userConfigs.$inferSelect
export type NewUserConfig = typeof userConfigs.$inferInsert
