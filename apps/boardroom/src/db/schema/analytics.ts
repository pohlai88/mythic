/**
 * Analytics Events Schema
 *
 * Infrastructure analytics for monitoring, performance tracking, and security.
 * Separate from Thanos Events (business audit trail).
 *
 * Best Practices:
 * - Self-hosted analytics (no third-party dependencies)
 * - Privacy-compliant (IP hashed, no PII)
 * - Time-series optimized (indexed by timestamp)
 * - Correlates with Thanos events via proposalId
 */

import { jsonb, pgTable, text, timestamp, uuid, varchar, integer, boolean } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z as z4 } from 'zod/v4'

export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').notNull().unique(),
  pathname: varchar('pathname', { length: 500 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  timestamp: timestamp('timestamp').notNull(),
  
  // Performance metrics
  responseTime: integer('response_time'), // milliseconds
  statusCode: integer('status_code'), // HTTP status code (100-599)
  
  // User context (anonymized)
  userAgent: text('user_agent'),
  ipHash: varchar('ip_hash', { length: 64 }), // SHA-256 hash (privacy-preserving)
  country: varchar('country', { length: 2 }), // ISO 3166-1 alpha-2
  
  // Security context
  isValidRequest: boolean('is_valid_request').notNull(),
  validationErrors: jsonb('validation_errors'), // Array of error messages
  
  // Correlation IDs
  proposalId: uuid('proposal_id'), // Foreign key to proposals (for correlation with Thanos)
  userId: uuid('user_id'), // Foreign key to users (if authenticated)
  
  // Custom metadata
  metadata: jsonb('metadata'),
  
  // Audit fields
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Zod schemas for validation
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents, {
  method: z4.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']),
  responseTime: z4.number().int().positive().optional(),
  statusCode: z4.number().int().min(100).max(599).optional(),
  ipHash: z4.string().length(64).optional(),
  country: z4.string().length(2).optional(),
  validationErrors: z4.array(z4.string()).optional(),
  metadata: z4.record(z4.string(), z4.unknown()).optional(),
})

export const selectAnalyticsEventSchema = createSelectSchema(analyticsEvents, {
  method: z4.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']),
  responseTime: z4.number().int().positive().optional(),
  statusCode: z4.number().int().min(100).max(599).optional(),
  ipHash: z4.string().length(64).optional(),
  country: z4.string().length(2).optional(),
  validationErrors: z4.array(z4.string()).optional(),
  metadata: z4.record(z4.string(), z4.unknown()).optional(),
})

// TypeScript types
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert

/**
 * Database Indexes (to be created via migration)
 * 
 * Recommended indexes for performance:
 * 
 * CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
 * CREATE INDEX idx_analytics_events_proposal_id ON analytics_events(proposal_id) WHERE proposal_id IS NOT NULL;
 * CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id) WHERE user_id IS NOT NULL;
 * CREATE INDEX idx_analytics_events_pathname ON analytics_events(pathname);
 * CREATE INDEX idx_analytics_events_status_code ON analytics_events(status_code) WHERE status_code >= 400;
 * 
 * Note: Indexes should be created via Drizzle migrations, not in schema file.
 */
