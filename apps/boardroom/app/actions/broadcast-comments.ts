/**
 * Server Actions for Broadcast Comments
 *
 * Manages comments and threading for broadcast announcements.
 * Supports @mentions and parent/child relationships.
 */

"use server"

import { db } from "@/src/db"
import {
  broadcastComments,
  insertBroadcastCommentSchema,
  selectBroadcastCommentSchema,
} from "@/src/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { z as z4 } from "zod/v4"
import { validateActionInput } from "@/src/lib/actions/validate-action"

/**
 * Input schema for creating broadcast comment
 */
const createBroadcastCommentInputSchema = z4.object({
  broadcastId: z4.string().uuid(),
  userId: z4.string().uuid(),
  content: z4.string().min(1).max(5000),
  mode: z4.enum(["open_floor", "sovereign_consultation"]).default("open_floor"),
  mentionedUserId: z4.string().uuid().optional(),
  parentCommentId: z4.string().uuid().optional(),
})

/**
 * Input schema for getting broadcast comments
 */
const getBroadcastCommentsInputSchema = z4.object({
  broadcastId: z4.string().uuid(),
})

/**
 * Input schema for updating broadcast comment
 */
const updateBroadcastCommentInputSchema = z4.object({
  commentId: z4.string().uuid(),
  content: z4.string().min(1).max(5000).optional(),
})

/**
 * Input schema for deleting broadcast comment
 */
const deleteBroadcastCommentInputSchema = z4.object({
  commentId: z4.string().uuid(),
})

/**
 * Broadcast comment data interface
 */
export interface BroadcastCommentData {
  id: string
  broadcastId: string
  userId: string
  content: string
  mode: "open_floor" | "sovereign_consultation"
  mentionedUserId: string | null
  parentCommentId: string | null
  createdAt: Date
  updatedAt: Date
  replies?: BroadcastCommentData[]
}

/**
 * Create a new broadcast comment
 */
export async function createBroadcastComment(
  input: unknown
): Promise<{ success: boolean; commentId?: string; error?: string }> {
  const inputResult = validateActionInput(input, createBroadcastCommentInputSchema)
  if (!inputResult.success) {
    return { success: false, error: "Invalid input" }
  }

  const { broadcastId, userId, content, mode, mentionedUserId, parentCommentId } = inputResult.data

  try {
    const [comment] = await db
      .insert(broadcastComments)
      .values({
        broadcastId,
        userId,
        content,
        mode: mode || "open_floor",
        mentionedUserId: mentionedUserId || null,
        parentCommentId: parentCommentId || null,
      })
      .returning()

    if (!comment) {
      return { success: false, error: "Failed to create comment" }
    }

    return { success: true, commentId: comment.id }
  } catch (error) {
    console.error("Error creating broadcast comment:", error)
    return { success: false, error: "Failed to create comment" }
  }
}

/**
 * Get all comments for a broadcast (with threading)
 */
export async function getBroadcastComments(
  input: unknown
): Promise<{ comments: BroadcastCommentData[]; error?: string }> {
  const inputResult = validateActionInput(input, getBroadcastCommentsInputSchema)
  if (!inputResult.success) {
    return { comments: [], error: "Invalid input" }
  }

  const { broadcastId } = inputResult.data

  try {
    // Get all comments for this broadcast
    const allComments = await db
      .select()
      .from(broadcastComments)
      .where(eq(broadcastComments.broadcastId, broadcastId))
      .orderBy(desc(broadcastComments.createdAt))

    // Transform to BroadcastCommentData
    const commentsData: BroadcastCommentData[] = allComments.map((c) => ({
      id: c.id,
      broadcastId: c.broadcastId,
      userId: c.userId,
      content: c.content,
      mode: c.mode as "open_floor" | "sovereign_consultation",
      mentionedUserId: c.mentionedUserId,
      parentCommentId: c.parentCommentId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      replies: [],
    }))

    // Build threaded structure
    const commentMap = new Map<string, BroadcastCommentData>()
    const rootComments: BroadcastCommentData[] = []

    // First pass: create map
    for (const comment of commentsData) {
      commentMap.set(comment.id, comment)
    }

    // Second pass: build tree
    for (const comment of commentsData) {
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId)
        if (parent) {
          if (!parent.replies) {
            parent.replies = []
          }
          parent.replies.push(comment)
        }
      } else {
        rootComments.push(comment)
      }
    }

    return { comments: rootComments }
  } catch (error) {
    console.error("Error fetching broadcast comments:", error)
    return { comments: [], error: "Failed to fetch comments" }
  }
}

/**
 * Update a broadcast comment
 */
export async function updateBroadcastComment(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const inputResult = validateActionInput(input, updateBroadcastCommentInputSchema)
  if (!inputResult.success) {
    return { success: false, error: "Invalid input" }
  }

  const { commentId, content } = inputResult.data

  try {
    if (!content) {
      return { success: false, error: "Content is required" }
    }

    await db
      .update(broadcastComments)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(broadcastComments.id, commentId))

    return { success: true }
  } catch (error) {
    console.error("Error updating broadcast comment:", error)
    return { success: false, error: "Failed to update comment" }
  }
}

/**
 * Delete a broadcast comment
 */
export async function deleteBroadcastComment(
  input: unknown
): Promise<{ success: boolean; error?: string }> {
  const inputResult = validateActionInput(input, deleteBroadcastCommentInputSchema)
  if (!inputResult.success) {
    return { success: false, error: "Invalid input" }
  }

  const { commentId } = inputResult.data

  try {
    // Check if comment has replies
    const [comment] = await db
      .select()
      .from(broadcastComments)
      .where(eq(broadcastComments.id, commentId))
      .limit(1)

    if (!comment) {
      return { success: false, error: "Comment not found" }
    }

    // Check for replies
    const replies = await db
      .select()
      .from(broadcastComments)
      .where(eq(broadcastComments.parentCommentId, commentId))
      .limit(1)

    if (replies.length > 0) {
      // Soft delete: replace content with deletion notice
      await db
        .update(broadcastComments)
        .set({
          content: "[Comment deleted]",
          updatedAt: new Date(),
        })
        .where(eq(broadcastComments.id, commentId))
    } else {
      // Hard delete: no replies, safe to remove
      await db.delete(broadcastComments).where(eq(broadcastComments.id, commentId))
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting broadcast comment:", error)
    return { success: false, error: "Failed to delete comment" }
  }
}
