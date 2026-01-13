/**
 * RBAC Service with Zod Validation
 *
 * Phase 19: Role-based access control with validated schemas
 * Vanguard Security: All permission checks validated
 */

import { z as z4 } from "zod/v4"
import {
  permissionCheckSchema,
  rbacResultSchema,
  circleMembershipSchema,
  roleSchema,
  permissionSchema,
  type PermissionCheck,
  type RBACResult,
  type CircleMembership,
  type Role,
  type Permission,
} from "./rbac-schemas"
import { db } from "@/src/db"
import { circleMembers } from "@/src/db/schema/circles"
import { eq, and } from "drizzle-orm"

/**
 * Check if user has permission
 *
 * Validates all inputs and outputs with Zod schemas
 */
export async function checkPermission(check: PermissionCheck): Promise<RBACResult> {
  // Validate permission check input
  const validatedResult = permissionCheckSchema.safeParse(check)
  if (!validatedResult.success) {
    throw new Error(
      `Invalid permission check: ${validatedResult.error.issues[0]?.message || "Unknown error"}`
    )
  }
  const validated = validatedResult.data

  // Vanguard Security: Enforce permission rules
  // This is a simplified implementation - in production, you would:
  // 1. Check user's role in the relevant circle
  // 2. Check if the action is allowed for that role
  // 3. Check any additional context-specific rules

  // Get user's role in the relevant circle
  const userRole = await getUserRoleInCircle(
    validated.userId,
    validated.resourceType === "circle" ? validated.resourceId : undefined
  )

  // Check permission based on role
  const allowed = await isActionAllowedForRole(validated.action, userRole, validated.resourceType)

  const resultData = {
    allowed,
    currentRole: userRole,
    requiredRole: getRequiredRoleForAction(validated.action),
    reason: allowed
      ? undefined
      : `Action ${validated.action} requires ${getRequiredRoleForAction(validated.action)} role`,
  }
  const result = rbacResultSchema.safeParse(resultData)
  if (!result.success) {
    throw new Error(`Invalid RBAC result: ${result.error.issues[0]?.message || "Unknown error"}`)
  }
  return result.data
}

/**
 * Get user's role in a circle
 */
async function getUserRoleInCircle(userId: string, circleId?: string): Promise<Role> {
  if (!circleId) {
    // Default to observer if no circle specified
    return "observer"
  }

  // Query database for circle membership
  const [membership] = await db
    .select()
    .from(circleMembers)
    .where(and(eq(circleMembers.circleId, circleId), eq(circleMembers.userId, userId)))
    .limit(1)

  if (!membership) {
    return "observer"
  }

  // Parse and validate membership role
  const validated = circleMembershipSchema.safeParse({
    circleId: membership.circleId,
    userId: membership.userId,
    role: (membership.role as "sovereign" | "council" | "observer") || "observer",
    grantedAt: membership.createdAt || new Date(),
    grantedBy: membership.userId, // Use userId as grantedBy for now
  })

  if (validated.success) {
    return validated.data.role
  }

  return "observer"
}

/**
 * Check if action is allowed for role
 */
async function isActionAllowedForRole(
  action: Permission,
  role: Role,
  resourceType: PermissionCheck["resourceType"]
): Promise<boolean> {
  // Permission matrix
  const permissions: Record<Role, Permission[]> = {
    sovereign: [
      "read_proposal",
      "create_proposal",
      "approve_proposal",
      "veto_proposal",
      "edit_proposal",
      "delete_proposal",
      "view_audit_trail",
      "manage_circles",
      "manage_stencils",
      "manage_global_config",
      "decrypt_eyes_only",
    ],
    council: [
      "read_proposal",
      "create_proposal",
      "approve_proposal",
      "edit_proposal",
      "view_audit_trail",
      "manage_stencils",
    ],
    observer: ["read_proposal", "view_audit_trail"],
  }

  return permissions[role]?.includes(action) ?? false
}

/**
 * Get required role for action
 */
function getRequiredRoleForAction(action: Permission): Role {
  const roleRequirements: Record<Permission, Role> = {
    read_proposal: "observer",
    create_proposal: "council",
    approve_proposal: "sovereign",
    veto_proposal: "sovereign",
    edit_proposal: "council",
    delete_proposal: "sovereign",
    view_audit_trail: "observer",
    manage_circles: "sovereign",
    manage_stencils: "council",
    manage_global_config: "sovereign",
    decrypt_eyes_only: "sovereign",
  }

  return roleRequirements[action] || "observer"
}

/**
 * Validate permission check
 */
export function validatePermissionCheck(check: unknown): PermissionCheck {
  return permissionCheckSchema.parse(check)
}

/**
 * Validate RBAC result
 */
export function validateRBACResult(result: unknown): RBACResult {
  return rbacResultSchema.parse(result)
}

/**
 * Validate circle membership
 */
export function validateCircleMembership(membership: unknown): CircleMembership {
  return circleMembershipSchema.parse(membership)
}
