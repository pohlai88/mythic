/**
 * Audit Trail Schemas
 *
 * Phase 22: 6W1H audit trail validation with Zod
 * Vanguard Security: Immutable audit trail validation
 */

import { z as z4 } from 'zod/v4'

/**
 * Thanos Event Schema (6W1H)
 *
 * Vanguard Security: 6W1H audit trail event validation
 */
export const thanosEventSchema = z4.object({
  id: z4.string().uuid(),
  proposalId: z4.string().uuid(),
  who: z4.string().uuid(), // Actor ID
  what: z4.string().min(1).max(50), // Action type
  when: z4.date(), // Timestamp
  where: z4.enum(['web', 'api', 'webhook', 'batch']), // Source
  why: z4.string().min(1).max(1000).optional(), // Reason
  which: z4.string().max(500).optional(), // Alternatives considered
  how: z4.enum(['UI', 'API', 'batch', 'automated']), // Method
  metadata: z4.record(z4.string(), z4.unknown()).optional(),
}).describe('6W1H audit trail event validation')

/**
 * Immutable Audit Trail Schema
 *
 * Vanguard Security: Immutable audit trail
 */
export const immutableAuditTrailSchema = z4.object({
  events: z4.array(thanosEventSchema).min(1),
  proposalId: z4.string().uuid(),
  createdAt: z4.date(),
  lastUpdated: z4.date(),
  // Vanguard Security: Immutability flag
  immutable: z4.literal(true).default(true),
}).readonly().describe('Immutable audit trail validation')

/**
 * Audit Event Creation Schema
 *
 * For creating new audit events (without id, which is auto-generated)
 */
export const createAuditEventSchema = thanosEventSchema.omit({ id: true })

/**
 * Type exports
 */
export type ThanosEvent = z4.infer<typeof thanosEventSchema>
export type ImmutableAuditTrail = z4.infer<typeof immutableAuditTrailSchema>
export type CreateAuditEvent = z4.infer<typeof createAuditEventSchema>
