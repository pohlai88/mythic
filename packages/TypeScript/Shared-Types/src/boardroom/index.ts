/**
 * BoardRoom Domain Types
 *
 * Types for The Apex (Executive Board Decision Engine)
 * Based on PRD_Decision_BoardRoom_MVP.md
 */

import { z as z4 } from "zod/v4"

/**
 * Proposal Status
 */
export const proposalStatusSchema = z4.enum([
  "DRAFT",
  "LISTENING",
  "APPROVED",
  "VETOED",
  "ARCHIVED",
])

export type ProposalStatus = z4.infer<typeof proposalStatusSchema>

/**
 * User Role in Circle
 */
export const circleRoleSchema = z4.enum([
  "sovereign", // CEO / Board Chair
  "council", // C-Suite Manager
  "observer", // Read-only access
])

export type CircleRole = z4.infer<typeof circleRoleSchema>

/**
 * Proposal Stencil (Living Schema)
 */
export const proposalStencilSchema = z4.object({
  id: z4.string(),
  name: z4.string(),
  version: z4.number(),
  fields: z4.array(
    z4.object({
      id: z4.string(),
      label: z4.string(),
      type: z4.enum(["string", "number", "date", "enum", "jsonb"]),
      required: z4.boolean(),
      validation_rule: z4.string().optional(),
    })
  ),
  required_approvers: z4.array(z4.string()),
})

export type ProposalStencil = z4.infer<typeof proposalStencilSchema>

/**
 * Proposal
 */
export const proposalSchema = z4.object({
  id: z4.string().uuid(),
  case_number: z4.string(),
  stencil_id: z4.string(),
  circle_id: z4.string().uuid(),
  status: proposalStatusSchema,
  submitted_by: z4.string().uuid(),
  data: z4.record(z4.string(), z4.unknown()), // Structured proposal data
  created_at: z4.date(),
  updated_at: z4.date(),
  approved_at: z4.date().optional(),
  vetoed_at: z4.date().optional(),
  approved_by: z4.string().uuid().optional(),
  vetoed_by: z4.string().uuid().optional(),
  veto_reason: z4.string().optional(),
})

export type Proposal = z4.infer<typeof proposalSchema>

/**
 * Thanos Event (6W1H Audit Trail)
 */
export const thanosEventSchema = z4.object({
  id: z4.string().uuid(),
  proposal_id: z4.string().uuid(),
  who: z4.string().uuid(), // Actor ID
  what: z4.string(), // Action type
  when: z4.date(), // Timestamp
  where: z4.string(), // Source (web, api, webhook)
  why: z4.string().optional(), // Reason
  which: z4.string().optional(), // Alternatives considered
  how: z4.string(), // Method (UI click, API call, batch)
  metadata: z4.record(z4.string(), z4.unknown()).optional(),
})

export type ThanosEvent = z4.infer<typeof thanosEventSchema>

/**
 * Circle (Organizational Hierarchy)
 */
export const circleSchema = z4.object({
  id: z4.string().uuid(),
  name: z4.string(),
  parent_id: z4.string().uuid().optional(),
  created_at: z4.date(),
  updated_at: z4.date(),
})

export type Circle = z4.infer<typeof circleSchema>

/**
 * Circle Member
 */
export const circleMemberSchema = z4.object({
  id: z4.string().uuid(),
  circle_id: z4.string().uuid(),
  user_id: z4.string().uuid(),
  role: circleRoleSchema,
  admin_hat: z4.array(z4.string()).optional(), // Granted capabilities
  created_at: z4.date(),
})

export type CircleMember = z4.infer<typeof circleMemberSchema>
