/**
 * Broadcast Scheduler
 *
 * Handles scheduled broadcasts - broadcasts that should be published at a future time.
 * Can be used with cron jobs or scheduled tasks to publish broadcasts automatically.
 */

'use server'

import { db } from '@/src/db'
import { broadcasts } from '@/src/db/schema'
import { eq, and, lte, isNull } from 'drizzle-orm'

/**
 * Get scheduled broadcasts that are ready to be published
 *
 * Returns broadcasts where scheduledFor <= now and sticky is false (not yet published)
 */
export async function getScheduledBroadcasts(): Promise<
  Array<{
    id: string
    title: string
    scheduledFor: Date
  }>
> {
  try {
    const now = new Date()

    const scheduled = await db
      .select({
        id: broadcasts.id,
        title: broadcasts.title,
        scheduledFor: broadcasts.scheduledFor,
      })
      .from(broadcasts)
      .where(
        and(
          isNull(broadcasts.sticky), // Not yet published
          lte(broadcasts.scheduledFor, now) // Scheduled time has passed
        )
      )

    return scheduled.map((b) => ({
      id: b.id,
      title: b.title,
      scheduledFor: b.scheduledFor!,
    }))
  } catch (error) {
    console.error('Error fetching scheduled broadcasts:', error)
    return []
  }
}

/**
 * Publish scheduled broadcast
 *
 * Sets sticky to true, making the broadcast visible to users.
 */
export async function publishScheduledBroadcast(
  broadcastId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(broadcasts)
      .set({
        sticky: true,
        updatedAt: new Date(),
      })
      .where(eq(broadcasts.id, broadcastId))

    return { success: true }
  } catch (error) {
    console.error('Error publishing scheduled broadcast:', error)
    return { success: false, error: 'Failed to publish broadcast' }
  }
}

/**
 * Publish all ready scheduled broadcasts
 *
 * Automatically publishes all broadcasts whose scheduledFor time has passed.
 * This should be called periodically (e.g., via cron job).
 */
export async function publishAllScheduledBroadcasts(): Promise<{
  published: number
  errors: number
}> {
  const scheduled = await getScheduledBroadcasts()
  let published = 0
  let errors = 0

  for (const broadcast of scheduled) {
    const result = await publishScheduledBroadcast(broadcast.id)
    if (result.success) {
      published++
    } else {
      errors++
    }
  }

  return { published, errors }
}
