/**
 * Broadcast Drafts Management
 *
 * Handles draft broadcasts - broadcasts saved but not yet published.
 */

"use server"

import { db } from "@/src/db"
import { broadcasts } from "@/src/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { z as z4 } from "zod/v4"
import { validateActionInput } from "@/src/lib/actions/validate-action"

/**
 * Input schema for getting drafts
 */
const getDraftsInputSchema = z4.object({
  userId: z4.string().uuid(),
  limit: z4.number().int().positive().max(100).default(50),
  offset: z4.number().int().nonnegative().default(0),
})

/**
 * Input schema for publishing draft
 */
const publishDraftInputSchema = z4.object({
  broadcastId: z4.string().uuid(),
  sticky: z4.boolean().default(true),
})

/**
 * Get draft broadcasts for a user
 */
export async function getBroadcastDrafts(input: unknown) {
  const inputResult = validateActionInput(input, getDraftsInputSchema)
  if (!inputResult.success) {
    return { drafts: [], total: 0 }
  }

  const { userId, limit, offset } = inputResult.data

  try {
    const drafts = await db
      .select()
      .from(broadcasts)
      .where(and(eq(broadcasts.createdBy, userId), eq(broadcasts.isDraft, true)))
      .orderBy(desc(broadcasts.createdAt))
      .limit(limit)
      .offset(offset)

    const totalResult = await db
      .select()
      .from(broadcasts)
      .where(and(eq(broadcasts.createdBy, userId), eq(broadcasts.isDraft, true)))

    return {
      drafts: drafts.map((d) => ({
        id: d.id,
        title: d.title,
        type: d.type,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
      total: totalResult.length,
    }
  } catch (error) {
    console.error("Error fetching drafts:", error)
    return { drafts: [], total: 0 }
  }
}

/**
 * Publish a draft broadcast
 *
 * Sets isDraft to false and sticky to true (or specified value).
 */
export async function publishDraft(input: unknown): Promise<{ success: boolean; error?: string }> {
  const inputResult = validateActionInput(input, publishDraftInputSchema)
  if (!inputResult.success) {
    return { success: false, error: "Invalid input" }
  }

  const { broadcastId, sticky } = inputResult.data

  try {
    await db
      .update(broadcasts)
      .set({
        isDraft: false,
        sticky: sticky ?? true,
        updatedAt: new Date(),
      })
      .where(eq(broadcasts.id, broadcastId))

    return { success: true }
  } catch (error) {
    console.error("Error publishing draft:", error)
    return { success: false, error: "Failed to publish draft" }
  }
}
