/**
 * Broadcast Categories Management
 *
 * Manages broadcast categories and tags.
 * Provides utilities for category/tag operations.
 */

"use server"

import { db } from "@/src/db"
import { broadcasts } from "@/src/db/schema"
import { sql } from "drizzle-orm"

/**
 * Get all unique categories from broadcasts
 */
export async function getAllCategories(): Promise<string[]> {
  try {
    const result = await db
      .select({
        categories: broadcasts.categories,
      })
      .from(broadcasts)
      .where(sql`${broadcasts.categories} IS NOT NULL`)

    const categorySet = new Set<string>()
    for (const row of result) {
      if (row.categories && Array.isArray(row.categories)) {
        for (const cat of row.categories as string[]) {
          categorySet.add(cat)
        }
      }
    }

    return Array.from(categorySet).sort()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

/**
 * Get all unique tags from broadcasts
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const result = await db
      .select({
        tags: broadcasts.tags,
      })
      .from(broadcasts)
      .where(sql`${broadcasts.tags} IS NOT NULL`)

    const tagSet = new Set<string>()
    for (const row of result) {
      if (row.tags && Array.isArray(row.tags)) {
        for (const tag of row.tags as string[]) {
          tagSet.add(tag)
        }
      }
    }

    return Array.from(tagSet).sort()
  } catch (error) {
    console.error("Error fetching tags:", error)
    return []
  }
}

/**
 * Get broadcasts by category
 */
export async function getBroadcastsByCategory(
  category: string
): Promise<Array<{ id: string; title: string; type: string }>> {
  try {
    const result = await db
      .select({
        id: broadcasts.id,
        title: broadcasts.title,
        type: broadcasts.type,
      })
      .from(broadcasts)
      .where(sql`${broadcasts.categories} @> ${JSON.stringify([category])}`)

    return result.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
    }))
  } catch (error) {
    console.error("Error fetching broadcasts by category:", error)
    return []
  }
}

/**
 * Get broadcasts by tag
 */
export async function getBroadcastsByTag(
  tag: string
): Promise<Array<{ id: string; title: string; type: string }>> {
  try {
    const result = await db
      .select({
        id: broadcasts.id,
        title: broadcasts.title,
        type: broadcasts.type,
      })
      .from(broadcasts)
      .where(sql`${broadcasts.tags} @> ${JSON.stringify([tag])}`)

    return result.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
    }))
  } catch (error) {
    console.error("Error fetching broadcasts by tag:", error)
    return []
  }
}
