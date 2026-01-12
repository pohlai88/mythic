/**
 * Server Actions for Broadcasts (The Herald - Weapon 9)
 *
 * Manages sticky banner announcements with read tracking.
 * Enables CEO/Admin to broadcast important announcements.
 *
 * @see PRD Section 4.3 Weapon 9: The Herald
 */

'use server'

import { db } from '@/src/db'
import { broadcasts, broadcastReads, broadcastTypeSchema } from '@/src/db/schema'
import { circles, circleMembers } from '@/src/db/schema/circles'
import { eq, and, gt, lte, or, isNull, desc, like } from 'drizzle-orm'
import { z as z4 } from 'zod/v4'
import { validateActionInput } from '@/src/lib/actions/validate-action'
import {
  createBroadcastCreatedMessage,
  createBroadcastUpdatedMessage,
  createBroadcastReadMessage,
  emitBroadcastEvent,
} from '@/src/lib/realtime/broadcast-events'
import { createBroadcastVersion } from './broadcast-versions'

/**
 * Input schema for creating broadcast
 */
const createBroadcastInputSchema = z4.object({
  createdBy: z4.string().uuid(),
  type: z4.enum(['approval', 'veto', 'announcement', 'poll', 'emergency']),
  title: z4.string().min(1),
  message: z4.string().optional(),
  proposalId: z4.string().uuid().optional(),
  caseNumber: z4.string().optional(),
  audience: z4.string().default('all'),
  sticky: z4.boolean().default(true),
  expiresAt: z4.date().optional(),
  scheduledFor: z4.date().optional(), // Schedule for future
  isDraft: z4.boolean().default(false), // Save as draft
  priority: z4.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  categories: z4.array(z4.string()).optional(),
  tags: z4.array(z4.string()).optional(),
  templateId: z4.string().uuid().optional(),
  imageUrl: z4.string().url().optional(),
  attachments: z4.array(z4.object({ url: z4.string().url(), name: z4.string() })).optional(),
})

/**
 * Input schema for getting active broadcasts
 */
const getActiveBroadcastsInputSchema = z4.object({
  userId: z4.string().uuid(),
  userCircles: z4.array(z4.string().uuid()).optional(), // User's circle IDs
  userRole: z4.enum(['sovereign', 'council', 'observer']).optional(), // User's role
})

/**
 * Input schema for getting broadcast history
 */
const getBroadcastHistoryInputSchema = z4.object({
  userId: z4.string().uuid(),
  limit: z4.number().int().positive().max(100).default(50),
  offset: z4.number().int().nonnegative().default(0),
  type: broadcastTypeSchema.optional(),
  search: z4.string().optional(), // Search in title and message
})

/**
 * Input schema for updating broadcast
 */
const updateBroadcastInputSchema = z4.object({
  broadcastId: z4.string().uuid(),
  title: z4.string().min(1).optional(),
  message: z4.string().optional(),
  audience: z4.string().optional(),
  sticky: z4.boolean().optional(),
  expiresAt: z4.date().nullable().optional(),
  scheduledFor: z4.date().nullable().optional(),
  isDraft: z4.boolean().optional(),
  priority: z4.enum(['low', 'normal', 'high', 'urgent']).optional(),
  categories: z4.array(z4.string()).nullable().optional(),
  tags: z4.array(z4.string()).nullable().optional(),
  imageUrl: z4.string().url().nullable().optional(),
  attachments: z4.array(z4.object({ url: z4.string().url(), name: z4.string() })).nullable().optional(),
})

/**
 * Input schema for deleting broadcast
 */
const deleteBroadcastInputSchema = z4.object({
  broadcastId: z4.string().uuid(),
})

/**
 * Input schema for marking broadcast as read
 */
const markBroadcastReadInputSchema = z4.object({
  broadcastId: z4.string().uuid(),
  userId: z4.string().uuid(),
})

/**
 * Broadcast response type
 */
export interface BroadcastData {
  id: string
  createdBy: string
  type: 'approval' | 'veto' | 'announcement' | 'poll' | 'emergency'
  title: string
  message: string | null
  proposalId: string | null
  caseNumber: string | null
  audience: string
  sticky: boolean
  expiresAt: Date | null
  scheduledFor: Date | null
  isDraft: boolean
  priority: 'low' | 'normal' | 'high' | 'urgent'
  categories: string[] | null
  tags: string[] | null
  createdAt: Date
  isRead: boolean
  imageUrl?: string | null
  attachments?: Array<{ url: string; name: string }> | null
}

/**
 * Create a new broadcast announcement
 *
 * Only CEO/Admin can create broadcasts.
 */
export async function createBroadcast(
  input: unknown
): Promise<{ success: boolean; broadcastId?: string; error?: string }> {
  const inputResult = validateActionInput(input, createBroadcastInputSchema)
  if (!inputResult.success) {
    console.error('Invalid createBroadcast input:', inputResult.issues)
    return { success: false, error: 'Invalid input' }
  }

    const {
      createdBy,
      type,
      title,
      message,
      proposalId,
      caseNumber,
      audience,
      sticky,
      expiresAt,
      scheduledFor,
      isDraft,
      priority,
      categories,
      tags,
      templateId,
      imageUrl,
      attachments,
    } = inputResult.data

  try {
    const [broadcast] = await db
      .insert(broadcasts)
      .values({
        createdBy,
        type,
        title,
        message: message || null,
        proposalId: proposalId || null,
        caseNumber: caseNumber || null,
        audience,
        sticky: isDraft ? false : (sticky ?? true), // Drafts are not sticky
        expiresAt: expiresAt || null,
        scheduledFor: scheduledFor || null,
        isDraft: isDraft ?? false,
        priority: priority || 'normal',
        categories: categories || null,
        tags: tags || null,
        templateId: templateId || null,
        imageUrl: imageUrl || null,
        attachments: attachments || null,
      })
      .returning()

    if (!broadcast) {
      return { success: false, error: 'Failed to create broadcast' }
    }

    // Send email notifications (async, non-blocking)
    // TODO: Queue email sending in production
    if (process.env.ENABLE_BROADCAST_EMAILS === 'true') {
      import('./broadcast-email')
        .then(({ sendBroadcastEmail, getEmailRecipients }) => {
          getEmailRecipients(audience).then((recipients) => {
            if (recipients.length > 0) {
              sendBroadcastEmail({
                broadcastId: broadcast.id,
                recipientEmails: recipients,
              }).catch((err) => {
                console.error('Error sending broadcast emails:', err)
              })
            }
          })
        })
        .catch((err) => {
          console.error('Error loading email module:', err)
        })
    }

    return { success: true, broadcastId: broadcast.id }
  } catch (error) {
    console.error('Error creating broadcast:', error)
    return { success: false, error: 'Failed to create broadcast' }
  }
}

/**
 * Check if user matches broadcast audience
 */
async function matchesAudience(
  broadcast: typeof broadcasts.$inferSelect,
  userId: string,
  userCircles?: string[],
  userRole?: 'sovereign' | 'council' | 'observer'
): Promise<boolean> {
  // "all" audience - everyone sees it
  if (broadcast.audience === 'all') {
    return true
  }

  // "circle:{id}" audience - check if user is in circle
  if (broadcast.audience.startsWith('circle:')) {
    const circleId = broadcast.audience.replace('circle:', '')
    if (!userCircles) {
      // Fetch user's circles if not provided
      const memberships = await db
        .select()
        .from(circleMembers)
        .where(eq(circleMembers.userId, userId))
      const userCircleIds = memberships.map((m) => m.circleId)
      return userCircleIds.includes(circleId)
    }
    return userCircles.includes(circleId)
  }

  // "role:{role}" audience - check if user has role
  if (broadcast.audience.startsWith('role:')) {
    const requiredRole = broadcast.audience.replace('role:', '') as
      | 'sovereign'
      | 'council'
      | 'observer'
    if (!userRole) {
      // Fetch user's highest role if not provided
      const memberships = await db
        .select()
        .from(circleMembers)
        .where(eq(circleMembers.userId, userId))
      const roles = memberships.map((m) => m.role as 'sovereign' | 'council' | 'observer')
      // Check if user has required role or higher
      const roleHierarchy = { sovereign: 3, council: 2, observer: 1 }
      const userMaxRole = Math.max(...roles.map((r) => roleHierarchy[r] || 0))
      return userMaxRole >= roleHierarchy[requiredRole]
    }
    const roleHierarchy = { sovereign: 3, council: 2, observer: 1 }
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  }

  // Unknown audience format - default to false for security
  return false
}

/**
 * Get active broadcasts for a user
 *
 * Returns broadcasts that:
 * - Haven't expired (expiresAt > now or null)
 * - User hasn't read yet
 * - Match user's audience (all, circle, role)
 */
export async function getActiveBroadcasts(
  input: unknown
): Promise<BroadcastData[]> {
  const inputResult = validateActionInput(input, getActiveBroadcastsInputSchema)
  if (!inputResult.success) {
    console.error('Invalid getActiveBroadcasts input:', inputResult.issues)
    return []
  }

  const { userId, userCircles, userRole } = inputResult.data

  try {
    const now = new Date()

    // Get all active broadcasts (not expired, not scheduled for future, not drafts)
    const activeBroadcasts = await db
      .select()
      .from(broadcasts)
      .where(
        and(
          or(gt(broadcasts.expiresAt, now), isNull(broadcasts.expiresAt)),
          or(isNull(broadcasts.scheduledFor), lte(broadcasts.scheduledFor, now)),
          eq(broadcasts.sticky, true),
          eq(broadcasts.isDraft, false) // Exclude drafts
        )
      )
      .orderBy(desc(broadcasts.createdAt))

    // Get read status for each broadcast
    const readStatuses = await db
      .select()
      .from(broadcastReads)
      .where(eq(broadcastReads.userId, userId))

    const readBroadcastIds = new Set(readStatuses.map((r) => r.broadcastId))

    // Filter by audience and read status
    const matchingBroadcasts: BroadcastData[] = []
    for (const broadcast of activeBroadcasts) {
      // Skip if already read
      if (readBroadcastIds.has(broadcast.id)) {
        continue
      }

      // Check audience match
      const matches = await matchesAudience(broadcast, userId, userCircles, userRole)
      if (!matches) {
        continue
      }

      matchingBroadcasts.push({
        id: broadcast.id,
        createdBy: broadcast.createdBy,
        type: broadcast.type as BroadcastData['type'],
        title: broadcast.title,
        message: broadcast.message,
        proposalId: broadcast.proposalId,
        caseNumber: broadcast.caseNumber,
        audience: broadcast.audience,
        sticky: broadcast.sticky ?? true,
        expiresAt: broadcast.expiresAt,
        scheduledFor: broadcast.scheduledFor,
        isDraft: broadcast.isDraft ?? false,
        priority: (broadcast.priority as 'low' | 'normal' | 'high' | 'urgent') || 'normal',
        categories: (broadcast.categories as string[]) || null,
        tags: (broadcast.tags as string[]) || null,
        createdAt: broadcast.createdAt,
        isRead: false,
        imageUrl: broadcast.imageUrl || null,
        attachments: (broadcast.attachments as Array<{ url: string; name: string }>) || null,
      })
    }

    return matchingBroadcasts
  } catch (error) {
    console.error('Error fetching active broadcasts:', error)
    return []
  }
}

/**
 * Get broadcast history
 *
 * Returns paginated list of past broadcasts (read and unread)
 */
export async function getBroadcastHistory(
  input: unknown
): Promise<{ broadcasts: BroadcastData[]; total: number }> {
  const inputResult = validateActionInput(input, getBroadcastHistoryInputSchema)
  if (!inputResult.success) {
    console.error('Invalid getBroadcastHistory input:', inputResult.issues)
    return { broadcasts: [], total: 0 }
  }

  const { userId, limit, offset, type, search } = inputResult.data

  try {
    // Build where conditions
    const conditions = []
    if (type) {
      conditions.push(eq(broadcasts.type, type))
    }
    if (search) {
      // Search in title and message
      conditions.push(
        or(
          like(broadcasts.title, `%${search}%`),
          like(broadcasts.message, `%${search}%`)
        )
      )
    }
    // Exclude drafts from history (or make it optional)
    // For now, include drafts in history

    // Get broadcasts
    const historyBroadcasts = await db
      .select()
      .from(broadcasts)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(broadcasts.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalResult = await db
      .select({ count: broadcasts.id })
      .from(broadcasts)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    const total = totalResult.length

    // Get read status for each broadcast
    const readStatuses = await db
      .select()
      .from(broadcastReads)
      .where(eq(broadcastReads.userId, userId))

    const readBroadcastIds = new Set(readStatuses.map((r) => r.broadcastId))

    // Transform broadcasts
    const transformedBroadcasts = historyBroadcasts.map((b) => ({
      id: b.id,
      createdBy: b.createdBy,
      type: b.type as BroadcastData['type'],
      title: b.title,
      message: b.message,
      proposalId: b.proposalId,
      caseNumber: b.caseNumber,
      audience: b.audience,
      sticky: b.sticky ?? true,
      expiresAt: b.expiresAt,
      scheduledFor: b.scheduledFor,
      isDraft: b.isDraft ?? false,
      priority: (b.priority as 'low' | 'normal' | 'high' | 'urgent') || 'normal',
      categories: (b.categories as string[]) || null,
      tags: (b.tags as string[]) || null,
      createdAt: b.createdAt,
      isRead: readBroadcastIds.has(b.id),
      imageUrl: b.imageUrl || null,
      attachments: (b.attachments as Array<{ url: string; name: string }>) || null,
    }))

    return { broadcasts: transformedBroadcasts, total }
  } catch (error) {
    console.error('Error fetching broadcast history:', error)
    return { broadcasts: [], total: 0 }
  }
}

/**
 * Mark broadcast as read
 *
 * Records that a user has read a broadcast.
 */
export async function markBroadcastRead(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const inputResult = validateActionInput(input, markBroadcastReadInputSchema)
  if (!inputResult.success) {
    console.error('Invalid markBroadcastRead input:', inputResult.issues)
    return { success: false, error: 'Invalid input' }
  }

  const { broadcastId, userId } = inputResult.data

  try {
    // Check if already read
    const [existing] = await db
      .select()
      .from(broadcastReads)
      .where(
        and(
          eq(broadcastReads.broadcastId, broadcastId),
          eq(broadcastReads.userId, userId)
        )
      )
      .limit(1)

    if (existing) {
      // Already read, return success
      return { success: true }
    }

    // Mark as read
    await db.insert(broadcastReads).values({
      broadcastId,
      userId,
      readAt: new Date(),
    })

    // Emit WebSocket event for real-time updates (async, non-blocking)
    emitBroadcastEvent(createBroadcastReadMessage(broadcastId, userId)).catch((err) => {
      console.error('Error emitting broadcast_read event:', err)
    })

    return { success: true }
  } catch (error) {
    console.error('Error marking broadcast as read:', error)
    return { success: false, error: 'Failed to mark broadcast as read' }
  }
}

/**
 * Update broadcast
 *
 * Allows editing of broadcast content and settings.
 */
export async function updateBroadcast(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const inputResult = validateActionInput(input, updateBroadcastInputSchema)
  if (!inputResult.success) {
    return { success: false, error: 'Invalid input' }
  }

  const { broadcastId, ...updates } = inputResult.data

  try {
    // Remove undefined values
    const cleanUpdates: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value
      }
    }

    if (Object.keys(cleanUpdates).length === 0) {
      return { success: false, error: 'No updates provided' }
    }

    // Add updatedAt timestamp
    cleanUpdates.updatedAt = new Date()

    await db
      .update(broadcasts)
      .set(cleanUpdates)
      .where(eq(broadcasts.id, broadcastId))

    // Emit WebSocket event for real-time updates (async, non-blocking)
    emitBroadcastEvent(createBroadcastUpdatedMessage(broadcastId, cleanUpdates)).catch((err) => {
      console.error('Error emitting broadcast_updated event:', err)
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating broadcast:', error)
    return { success: false, error: 'Failed to update broadcast' }
  }
}

/**
 * Delete broadcast
 *
 * Soft delete by setting expiresAt to past date.
 * Hard delete removes from database (use with caution).
 */
export async function deleteBroadcast(
  input: unknown,
  hardDelete = false
): Promise<{ success: boolean; error?: string }> {
  const inputResult = validateActionInput(input, deleteBroadcastInputSchema)
  if (!inputResult.success) {
    return { success: false, error: 'Invalid input' }
  }

  const { broadcastId } = inputResult.data

  try {
    if (hardDelete) {
      // Hard delete - remove from database
      await db.delete(broadcasts).where(eq(broadcasts.id, broadcastId))
    } else {
      // Soft delete - set expiresAt to past
      await db
        .update(broadcasts)
        .set({
          expiresAt: new Date(0), // Epoch time - effectively expired
          updatedAt: new Date(),
        })
        .where(eq(broadcasts.id, broadcastId))
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting broadcast:', error)
    return { success: false, error: 'Failed to delete broadcast' }
  }
}

/**
 * Archive broadcast
 *
 * Marks broadcast as archived (non-sticky, expired).
 */
export async function archiveBroadcast(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const inputResult = validateActionInput(input, deleteBroadcastInputSchema)
  if (!inputResult.success) {
    return { success: false, error: 'Invalid input' }
  }

  const { broadcastId } = inputResult.data

  try {
    await db
      .update(broadcasts)
      .set({
        sticky: false,
        expiresAt: new Date(), // Expire immediately
        updatedAt: new Date(),
      })
      .where(eq(broadcasts.id, broadcastId))

    return { success: true }
  } catch (error) {
    console.error('Error archiving broadcast:', error)
    return { success: false, error: 'Failed to archive broadcast' }
  }
}

/**
 * Get broadcast analytics
 *
 * Returns statistics about broadcasts (read rates, engagement, etc.)
 */
export async function getBroadcastAnalytics(
  broadcastId?: string
): Promise<{
  totalBroadcasts: number
  totalReads: number
  averageReadRate: number
  byType: Record<string, { count: number; reads: number }>
  recentActivity: Array<{ date: string; count: number }>
}> {
  try {
    // Get total broadcasts
    const allBroadcasts = await db.select().from(broadcasts)
    const totalBroadcasts = allBroadcasts.length

    // Get total reads
    const allReads = await db.select().from(broadcastReads)
    const totalReads = allReads.length

    // Calculate average read rate
    const averageReadRate =
      totalBroadcasts > 0 ? (totalReads / totalBroadcasts) * 100 : 0

    // Group by type
    const byType: Record<string, { count: number; reads: number }> = {}
    for (const broadcast of allBroadcasts) {
      const type = broadcast.type || 'unknown'
      if (!byType[type]) {
        byType[type] = { count: 0, reads: 0 }
      }
      byType[type]!.count++

      const reads = allReads.filter((r) => r.broadcastId === broadcast.id).length
      byType[type]!.reads += reads
    }

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentBroadcasts = allBroadcasts.filter(
      (b) => new Date(b.createdAt) >= thirtyDaysAgo
    )

    // Group by date
    const activityByDate = new Map<string, number>()
    for (const broadcast of recentBroadcasts) {
      if (!broadcast.createdAt) continue
      const date = new Date(broadcast.createdAt).toISOString().split('T')[0]
      if (date) {
        activityByDate.set(date, (activityByDate.get(date) || 0) + 1)
      }
    }

    const recentActivity = Array.from(activityByDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return {
      totalBroadcasts,
      totalReads,
      averageReadRate: Math.round(averageReadRate * 10) / 10,
      byType,
      recentActivity,
    }
  } catch (error) {
    console.error('Error fetching broadcast analytics:', error)
    return {
      totalBroadcasts: 0,
      totalReads: 0,
      averageReadRate: 0,
      byType: {},
      recentActivity: [],
    }
  }
}

/**
 * Get broadcast read statistics
 *
 * Returns who has read a broadcast and when (for compliance/analytics)
 */
export async function getBroadcastReadStats(
  broadcastId: string
): Promise<Array<{ userId: string; readAt: Date }>> {
  try {
    const reads = await db
      .select({
        userId: broadcastReads.userId,
        readAt: broadcastReads.readAt,
      })
      .from(broadcastReads)
      .where(eq(broadcastReads.broadcastId, broadcastId))
      .orderBy(broadcastReads.readAt)

    return reads.map((r) => ({
      userId: r.userId,
      readAt: r.readAt,
    }))
  } catch (error) {
    console.error('Error fetching broadcast read stats:', error)
    return []
  }
}
