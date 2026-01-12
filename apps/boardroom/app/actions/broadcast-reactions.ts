/**
 * Server Actions for Broadcast Reactions
 *
 * Manages emoji reactions for broadcast announcements.
 * Supports adding, removing, and viewing reactions.
 */

'use server'

import { db } from '@/src/db'
import { broadcastReactions } from '@/src/db/schema'
import { eq, and } from 'drizzle-orm'
import { z as z4 } from 'zod/v4'
import { validateActionInput } from '@/src/lib/actions/validate-action'

/**
 * Input schema for adding reaction
 */
const addReactionInputSchema = z4.object({
  broadcastId: z4.string().uuid(),
  userId: z4.string().uuid(),
  emoji: z4.string().min(1).max(10),
})

/**
 * Input schema for removing reaction
 */
const removeReactionInputSchema = z4.object({
  broadcastId: z4.string().uuid(),
  userId: z4.string().uuid(),
  emoji: z4.string().min(1).max(10),
})

/**
 * Input schema for getting reactions
 */
const getReactionsInputSchema = z4.object({
  broadcastId: z4.string().uuid(),
})

/**
 * Reaction data interface
 */
export interface ReactionData {
  emoji: string
  count: number
  users: string[] // User IDs who reacted
}

/**
 * Add a reaction to a broadcast
 */
export async function addBroadcastReaction(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const inputResult = validateActionInput(input, addReactionInputSchema)
  if (!inputResult.success) {
    return { success: false, error: 'Invalid input' }
  }

  const { broadcastId, userId, emoji } = inputResult.data

  try {
    // Check if user already reacted with this emoji
    const [existing] = await db
      .select()
      .from(broadcastReactions)
      .where(
        and(
          eq(broadcastReactions.broadcastId, broadcastId),
          eq(broadcastReactions.userId, userId),
          eq(broadcastReactions.emoji, emoji)
        )
      )
      .limit(1)

    if (existing) {
      // Already reacted, return success (idempotent)
      return { success: true }
    }

    // Add reaction
    await db.insert(broadcastReactions).values({
      broadcastId,
      userId,
      emoji,
    })

    return { success: true }
  } catch (error) {
    console.error('Error adding broadcast reaction:', error)
    return { success: false, error: 'Failed to add reaction' }
  }
}

/**
 * Remove a reaction from a broadcast
 */
export async function removeBroadcastReaction(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const inputResult = validateActionInput(input, removeReactionInputSchema)
  if (!inputResult.success) {
    return { success: false, error: 'Invalid input' }
  }

  const { broadcastId, userId, emoji } = inputResult.data

  try {
    await db
      .delete(broadcastReactions)
      .where(
        and(
          eq(broadcastReactions.broadcastId, broadcastId),
          eq(broadcastReactions.userId, userId),
          eq(broadcastReactions.emoji, emoji)
        )
      )

    return { success: true }
  } catch (error) {
    console.error('Error removing broadcast reaction:', error)
    return { success: false, error: 'Failed to remove reaction' }
  }
}

/**
 * Get all reactions for a broadcast
 */
export async function getBroadcastReactions(
  input: unknown
): Promise<{ reactions: ReactionData[]; error?: string }> {
  const inputResult = validateActionInput(input, getReactionsInputSchema)
  if (!inputResult.success) {
    return { reactions: [], error: 'Invalid input' }
  }

  const { broadcastId } = inputResult.data

  try {
    const allReactions = await db
      .select()
      .from(broadcastReactions)
      .where(eq(broadcastReactions.broadcastId, broadcastId))

    // Group by emoji
    const reactionMap = new Map<string, string[]>()
    for (const reaction of allReactions) {
      const users = reactionMap.get(reaction.emoji) || []
      users.push(reaction.userId)
      reactionMap.set(reaction.emoji, users)
    }

    // Convert to ReactionData array
    const reactions: ReactionData[] = Array.from(reactionMap.entries()).map(([emoji, users]) => ({
      emoji,
      count: users.length,
      users,
    }))

    // Sort by count (descending)
    reactions.sort((a, b) => b.count - a.count)

    return { reactions }
  } catch (error) {
    console.error('Error fetching broadcast reactions:', error)
    return { reactions: [], error: 'Failed to fetch reactions' }
  }
}

/**
 * Toggle a reaction (add if not exists, remove if exists)
 */
export async function toggleBroadcastReaction(
  input: unknown
): Promise<{ success: boolean; added: boolean; error?: string }> {
  const inputResult = validateActionInput(input, addReactionInputSchema)
  if (!inputResult.success) {
    return { success: false, added: false, error: 'Invalid input' }
  }

  const { broadcastId, userId, emoji } = inputResult.data

  try {
    // Check if reaction exists
    const [existing] = await db
      .select()
      .from(broadcastReactions)
      .where(
        and(
          eq(broadcastReactions.broadcastId, broadcastId),
          eq(broadcastReactions.userId, userId),
          eq(broadcastReactions.emoji, emoji)
        )
      )
      .limit(1)

    if (existing) {
      // Remove reaction
      await removeBroadcastReaction({ broadcastId, userId, emoji })
      return { success: true, added: false }
    } else {
      // Add reaction
      await addBroadcastReaction({ broadcastId, userId, emoji })
      return { success: true, added: true }
    }
  } catch (error) {
    console.error('Error toggling broadcast reaction:', error)
    return { success: false, added: false, error: 'Failed to toggle reaction' }
  }
}
