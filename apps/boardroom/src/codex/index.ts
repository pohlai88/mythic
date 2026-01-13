/**
 * The Codex - Living Schema
 *
 * Proposal templates (stencils) with versioned schemas
 * Machine-readable fields for structured proposals
 *
 * @see PRD Section 4.3.1
 */

import { db } from "@/src/db"
import { proposalStencils } from "@/src/db/schema"
import { eq } from "drizzle-orm"
import type { ProposalStencil } from "@/src/db/schema"
import { validateProposalDataWithZod } from "@/src/lib/zod/stencil-schemas"

export interface StencilField {
  id: string
  label: string
  type: "string" | "number" | "date" | "enum" | "jsonb"
  required: boolean
  validationRule?: string
  options?: string[] // For enum type
}

export interface StencilDefinition {
  id: string
  name: string
  version: number
  fields: StencilField[]
  requiredApprovers: string[]
}

/**
 * Get stencil by ID
 */
export async function getStencil(stencilId: string): Promise<StencilDefinition | null> {
  try {
    const [stencil] = await db
      .select()
      .from(proposalStencils)
      .where(eq(proposalStencils.id, stencilId))

    if (!stencil) return null

    return {
      id: stencil.id,
      name: stencil.name,
      version: stencil.version,
      fields: stencil.fields as StencilField[],
      requiredApprovers: stencil.requiredApprovers as string[],
    }
  } catch (error) {
    console.error("Error fetching stencil:", error)
    return null
  }
}

/**
 * Get all stencils
 */
export async function getAllStencils(): Promise<StencilDefinition[]> {
  try {
    const results = await db.select().from(proposalStencils)
    return results.map((stencil) => ({
      id: stencil.id,
      name: stencil.name,
      version: stencil.version,
      fields: stencil.fields as StencilField[],
      requiredApprovers: stencil.requiredApprovers as string[],
    }))
  } catch (error) {
    console.error("Error fetching stencils:", error)
    return []
  }
}

/**
 * Create or update stencil
 */
export async function upsertStencil(stencil: StencilDefinition): Promise<boolean> {
  try {
    await db
      .insert(proposalStencils)
      .values({
        id: stencil.id,
        name: stencil.name,
        version: stencil.version,
        fields: stencil.fields,
        requiredApprovers: stencil.requiredApprovers,
      })
      .onConflictDoUpdate({
        target: proposalStencils.id,
        set: {
          name: stencil.name,
          version: stencil.version,
          fields: stencil.fields,
          requiredApprovers: stencil.requiredApprovers,
          updatedAt: new Date(),
        },
      })

    return true
  } catch (error) {
    console.error("Error upserting stencil:", error)
    return false
  }
}

// Re-export Zod validation functions (recommended approach)
export { validateProposalDataWithZod, createStencilSchema } from "@/src/lib/zod/stencil-schemas"
export type { ProposalDataFromStencil } from "@/src/lib/zod/stencil-schemas"

/**
 * Default stencils (seed data)
 */
export const defaultStencils: StencilDefinition[] = [
  {
    id: "hiring_request_v2",
    name: "Hiring Request",
    version: 2,
    fields: [
      {
        id: "job_title",
        label: "Job Title",
        type: "string",
        required: true,
      },
      {
        id: "level",
        label: "Seniority Level",
        type: "enum",
        required: true,
        options: ["junior", "mid", "senior", "principal"],
      },
      {
        id: "annual_salary",
        label: "Annual Salary (USD)",
        type: "number",
        required: true,
        validationRule: "min:50000|max:500000",
      },
      {
        id: "department",
        label: "Department",
        type: "string",
        required: true,
      },
      {
        id: "justification",
        label: "Justification",
        type: "string",
        required: false,
      },
    ],
    requiredApprovers: ["CTO", "CFO", "CEO"],
  },
  {
    id: "budget_expansion_v1",
    name: "Budget Expansion",
    version: 1,
    fields: [
      {
        id: "department",
        label: "Department",
        type: "string",
        required: true,
      },
      {
        id: "amount",
        label: "Amount (USD)",
        type: "number",
        required: true,
        validationRule: "min:1000",
      },
      {
        id: "quarter",
        label: "Quarter",
        type: "enum",
        required: true,
        options: ["Q1", "Q2", "Q3", "Q4"],
      },
      {
        id: "reason",
        label: "Reason",
        type: "string",
        required: true,
      },
    ],
    requiredApprovers: ["CFO", "CEO"],
  },
]
