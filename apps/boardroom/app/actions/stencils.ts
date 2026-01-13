/**
 * Server Actions for Stencils
 *
 * The Codex - Stencil management actions
 * Following Next.js Server Actions pattern
 */

"use server"

import { getStencil as getStencilFromCodex } from "@/src/codex"
import { getStencilInputSchema } from "@/src/lib/api-schemas/stencils"
import { stencilResponseSchema } from "@/src/lib/zod/action-responses"
import { validateActionInput } from "@/src/lib/actions/validate-action"
import type { StencilDefinition } from "@/src/codex"

/**
 * Get stencil by ID
 *
 * Validates input with Zod schema before processing.
 */
export async function getStencil(input: unknown): Promise<StencilDefinition | null> {
  // Validate input
  const inputResult = validateActionInput(input, getStencilInputSchema)
  if (!inputResult.success) {
    console.error("Invalid getStencil input:", inputResult.issues)
    return null
  }

  const { stencilId } = inputResult.data

  try {
    const stencil = await getStencilFromCodex(stencilId)

    if (!stencil) {
      return null
    }

    // Validate response with Zod schema
    const response = stencilResponseSchema.parse(stencil)
    return response
  } catch (error) {
    console.error("Error fetching stencil:", error)
    return null
  }
}
