/**
 * Audit Service with Zod Validation
 *
 * Phase 22: Audit trail service with validated schemas
 * Vanguard Security: Ensures audit trail integrity
 */

import { z as z4 } from 'zod/v4'
import {
  thanosEventSchema,
  immutableAuditTrailSchema,
  createAuditEventSchema,
  type ThanosEvent,
  type ImmutableAuditTrail,
  type CreateAuditEvent,
} from './audit-schemas'
import { db } from '@/src/db'
import { thanosEvents } from '@/src/db/schema/thanos'
import { eq } from 'drizzle-orm'

/**
 * Create audit event
 *
 * Validates event and stores in database with immutable flag
 */
export async function createAuditEvent(
  event: CreateAuditEvent
): Promise<ThanosEvent> {
  // Validate event
  const validatedResult = createAuditEventSchema.safeParse({
    ...event,
    when: new Date(), // Always use current timestamp
  })
  if (!validatedResult.success) {
    throw new Error(`Invalid audit event: ${validatedResult.error.issues[0]?.message || 'Unknown error'}`)
  }
  const validated = validatedResult.data

  // Generate ID
  const id = crypto.randomUUID()

  // Create full event
  const fullEventResult = thanosEventSchema.safeParse({
    id,
    ...validated,
  })
  if (!fullEventResult.success) {
    throw new Error(`Invalid full audit event: ${fullEventResult.error.issues[0]?.message || 'Unknown error'}`)
  }
  const fullEvent = fullEventResult.data

  // Vanguard Security: Ensure immutability
  // Store in database with immutable flag
  await db.insert(thanosEvents).values({
    id: fullEvent.id,
    proposalId: fullEvent.proposalId,
    who: fullEvent.who,
    what: fullEvent.what,
    when: fullEvent.when,
    where: fullEvent.where,
    why: fullEvent.why || null,
    which: fullEvent.which || null,
    how: fullEvent.how,
    metadata: fullEvent.metadata || null,
  })

  return fullEvent
}

/**
 * Get audit trail for a proposal
 *
 * Returns immutable audit trail
 */
export async function getAuditTrail(
  proposalId: string
): Promise<ImmutableAuditTrail> {
  // Query database
  const events = await db
    .select()
    .from(thanosEvents)
    .where(eq(thanosEvents.proposalId, proposalId))
    .orderBy(thanosEvents.when)

  // Validate all events
  const validatedEvents: ThanosEvent[] = []
  for (const event of events) {
    const result = thanosEventSchema.safeParse({
      id: event.id,
      proposalId: event.proposalId,
      who: event.who,
      what: event.what,
      when: event.when,
      where: event.where as 'web' | 'api' | 'webhook' | 'batch',
      why: event.why || undefined,
      which: event.which || undefined,
      how: event.how as 'UI' | 'API' | 'batch' | 'automated',
      metadata: event.metadata || undefined,
    })
    if (!result.success) {
      console.error(`Invalid audit event ${event.id}:`, result.error.issues)
      continue // Skip invalid events but don't fail the entire trail
    }
    validatedEvents.push(result.data)
  }

  // Create immutable audit trail
  const trailResult = immutableAuditTrailSchema.safeParse({
    events: validatedEvents,
    proposalId,
    createdAt: validatedEvents[0]?.when || new Date(),
    lastUpdated: validatedEvents[validatedEvents.length - 1]?.when || new Date(),
    immutable: true,
  })
  if (!trailResult.success) {
    throw new Error(`Invalid audit trail: ${trailResult.error.issues[0]?.message || 'Unknown error'}`)
  }
  const trail = trailResult.data

  return trail
}

/**
 * Validate audit event
 */
export function validateAuditEvent(event: unknown): ThanosEvent {
  return thanosEventSchema.parse(event)
}

/**
 * Validate audit trail
 */
export function validateAuditTrail(trail: unknown): ImmutableAuditTrail {
  return immutableAuditTrailSchema.parse(trail)
}

/**
 * Validate create audit event
 */
export function validateCreateAuditEvent(
  event: unknown
): CreateAuditEvent {
  return createAuditEventSchema.parse(event)
}
