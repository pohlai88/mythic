/**
 * Server Actions for Broadcast Templates
 *
 * Manages reusable templates for common broadcast types.
 */

"use server"

import { db } from "@/src/db"
import { broadcastTemplates } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import { z as z4 } from "zod/v4"
import { validateActionInput } from "@/src/lib/actions/validate-action"
import type { BroadcastTemplate } from "@/src/db/schema/broadcast-templates"

/**
 * Input schema for creating template
 */
const createTemplateInputSchema = z4.object({
  name: z4.string().min(1),
  type: z4.enum(["approval", "veto", "announcement", "poll", "emergency"]),
  titleTemplate: z4.string().min(1),
  messageTemplate: z4.string().optional(),
  defaultAudience: z4.string().default("all"),
  defaultSticky: z4.boolean().default(true),
  variables: z4.record(z4.string()).optional(),
})

/**
 * Input schema for using template
 */
const useTemplateInputSchema = z4.object({
  templateId: z4.string().uuid(),
  variables: z4.record(z4.string()),
})

/**
 * Get all templates
 */
export async function getBroadcastTemplates() {
  try {
    const templates = await db.select().from(broadcastTemplates).orderBy(broadcastTemplates.name)

    return templates
  } catch (error) {
    console.error("Error fetching templates:", error)
    return []
  }
}

/**
 * Get template by ID
 */
export async function getBroadcastTemplate(templateId: string) {
  try {
    const [template] = await db
      .select()
      .from(broadcastTemplates)
      .where(eq(broadcastTemplates.id, templateId))
      .limit(1)

    return template || null
  } catch (error) {
    console.error("Error fetching template:", error)
    return null
  }
}

/**
 * Create a new template
 */
export async function createBroadcastTemplate(
  input: unknown
): Promise<{ success: boolean; templateId?: string; error?: string }> {
  const inputResult = validateActionInput(input, createTemplateInputSchema)
  if (!inputResult.success) {
    return { success: false, error: "Invalid input" }
  }

  try {
    const [template] = await db
      .insert(broadcastTemplates)
      .values({
        name: inputResult.data.name,
        type: inputResult.data.type,
        titleTemplate: inputResult.data.titleTemplate,
        messageTemplate: inputResult.data.messageTemplate || null,
        defaultAudience: inputResult.data.defaultAudience,
        defaultSticky: inputResult.data.defaultSticky,
        variables: inputResult.data.variables || null,
      })
      .returning()

    if (!template) {
      return { success: false, error: "Failed to create template" }
    }

    return { success: true, templateId: template.id }
  } catch (error) {
    console.error("Error creating template:", error)
    return { success: false, error: "Failed to create template" }
  }
}

/**
 * Render template with variables
 */
export function renderTemplate(
  template: BroadcastTemplate,
  variables: Record<string, string>
): { title: string; message: string | null } {
  let title = template.titleTemplate
  let message = template.messageTemplate || null

  // Replace variables in title
  for (const [key, value] of Object.entries(variables)) {
    title = title.replace(new RegExp(`\\{${key}\\}`, "g"), value)
  }

  // Replace variables in message
  if (message) {
    for (const [key, value] of Object.entries(variables)) {
      message = message.replace(new RegExp(`\\{${key}\\}`, "g"), value)
    }
  }

  return { title, message }
}

/**
 * Use template to create broadcast
 */
export async function useBroadcastTemplate(
  input: unknown
): Promise<{
  title: string
  message: string | null
  type: string
  audience: string
  sticky: boolean
} | null> {
  const inputResult = validateActionInput(input, useTemplateInputSchema)
  if (!inputResult.success) {
    return null
  }

  const template = await getBroadcastTemplate(inputResult.data.templateId)
  if (!template) {
    return null
  }

  const rendered = renderTemplate(template, inputResult.data.variables)

  return {
    title: rendered.title,
    message: rendered.message,
    type: template.type,
    audience: template.defaultAudience,
    sticky: template.defaultSticky ?? true,
  }
}
