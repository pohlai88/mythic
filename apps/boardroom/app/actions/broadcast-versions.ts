/**
 * Server Actions for Broadcast Versions
 *
 * Manages version history and change tracking for broadcast announcements.
 * Provides audit trail for compliance purposes.
 */

"use server"

import { db } from "@/src/db"
import { broadcastVersions, insertBroadcastVersionSchema } from "@/src/db/schema"
import { broadcasts } from "@/src/db/schema"
import { eq, desc } from "drizzle-orm"
import { z as z4 } from "zod/v4"
import { validateActionInput } from "@/src/lib/actions/validate-action"

/**
 * Input schema for getting broadcast versions
 */
const getBroadcastVersionsInputSchema = z4.object({
  broadcastId: z4.string().uuid(),
})

/**
 * Input schema for creating broadcast version
 */
const createBroadcastVersionInputSchema = z4.object({
  broadcastId: z4.string().uuid(),
  changedBy: z4.string().uuid(),
  changeReason: z4.string().optional(),
})

/**
 * Broadcast version data interface
 */
export interface BroadcastVersionData {
  id: string
  broadcastId: string
  versionNumber: number
  title: string
  message: string | null
  audience: string
  type: string
  priority: string | null
  categories: string[] | null
  tags: string[] | null
  changedBy: string
  changedAt: Date
  changeReason: string | null
}

/**
 * Create a new version snapshot of a broadcast
 *
 * This is typically called automatically when a broadcast is updated.
 */
export async function createBroadcastVersion(
  input: unknown
): Promise<{ success: boolean; versionId?: string; error?: string }> {
  const inputResult = validateActionInput(input, createBroadcastVersionInputSchema)
  if (!inputResult.success) {
    return { success: false, error: "Invalid input" }
  }

  const { broadcastId, changedBy, changeReason } = inputResult.data

  try {
    // Get current broadcast
    const [broadcast] = await db
      .select()
      .from(broadcasts)
      .where(eq(broadcasts.id, broadcastId))
      .limit(1)

    if (!broadcast) {
      return { success: false, error: "Broadcast not found" }
    }

    // Get current max version number
    const existingVersions = await db
      .select()
      .from(broadcastVersions)
      .where(eq(broadcastVersions.broadcastId, broadcastId))
      .orderBy(desc(broadcastVersions.versionNumber))
      .limit(1)

    const nextVersionNumber =
      existingVersions.length > 0 ? Number(existingVersions[0].versionNumber) + 1 : 1

    // Create version snapshot
    const [version] = await db
      .insert(broadcastVersions)
      .values({
        broadcastId,
        versionNumber: nextVersionNumber.toString(),
        title: broadcast.title,
        message: broadcast.message,
        audience: broadcast.audience,
        type: broadcast.type,
        priority: broadcast.priority || null,
        categories: broadcast.categories ? JSON.stringify(broadcast.categories) : null,
        tags: broadcast.tags ? JSON.stringify(broadcast.tags) : null,
        changedBy,
        changeReason: changeReason || null,
      })
      .returning()

    if (!version) {
      return { success: false, error: "Failed to create version" }
    }

    return { success: true, versionId: version.id }
  } catch (error) {
    console.error("Error creating broadcast version:", error)
    return { success: false, error: "Failed to create version" }
  }
}

/**
 * Get all versions for a broadcast
 */
export async function getBroadcastVersions(
  input: unknown
): Promise<{ versions: BroadcastVersionData[]; error?: string }> {
  const inputResult = validateActionInput(input, getBroadcastVersionsInputSchema)
  if (!inputResult.success) {
    return { versions: [], error: "Invalid input" }
  }

  const { broadcastId } = inputResult.data

  try {
    const versions = await db
      .select()
      .from(broadcastVersions)
      .where(eq(broadcastVersions.broadcastId, broadcastId))
      .orderBy(desc(broadcastVersions.versionNumber))

    const versionsData: BroadcastVersionData[] = versions.map((v) => ({
      id: v.id,
      broadcastId: v.broadcastId,
      versionNumber: Number(v.versionNumber),
      title: v.title,
      message: v.message,
      audience: v.audience,
      type: v.type,
      priority: v.priority,
      categories: v.categories ? JSON.parse(v.categories) : null,
      tags: v.tags ? JSON.parse(v.tags) : null,
      changedBy: v.changedBy,
      changedAt: v.changedAt,
      changeReason: v.changeReason,
    }))

    return { versions: versionsData }
  } catch (error) {
    console.error("Error fetching broadcast versions:", error)
    return { versions: [], error: "Failed to fetch versions" }
  }
}

/**
 * Get a specific version by number
 */
export async function getBroadcastVersion(
  broadcastId: string,
  versionNumber: number
): Promise<BroadcastVersionData | null> {
  try {
    const [version] = await db
      .select()
      .from(broadcastVersions)
      .where(
        and(
          eq(broadcastVersions.broadcastId, broadcastId),
          eq(broadcastVersions.versionNumber, versionNumber.toString())
        )
      )
      .limit(1)

    if (!version) {
      return null
    }

    return {
      id: version.id,
      broadcastId: version.broadcastId,
      versionNumber: Number(version.versionNumber),
      title: version.title,
      message: version.message,
      audience: version.audience,
      type: version.type,
      priority: version.priority,
      categories: version.categories ? JSON.parse(version.categories) : null,
      tags: version.tags ? JSON.parse(version.tags) : null,
      changedBy: version.changedBy,
      changedAt: version.changedAt,
      changeReason: version.changeReason,
    }
  } catch (error) {
    console.error("Error fetching broadcast version:", error)
    return null
  }
}
