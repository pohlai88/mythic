/**
 * RBAC Permission Schemas
 *
 * Phase 19: Role-based access control validation with Zod
 * Vanguard Security: Validate all permission checks
 */

import { z as z4 } from 'zod/v4'

/**
 * Role Schema
 */
export const roleSchema = z4.enum(['sovereign', 'council', 'observer'])

/**
 * Permission Schema
 */
export const permissionSchema = z4.enum([
  'read_proposal',
  'create_proposal',
  'approve_proposal',
  'veto_proposal',
  'edit_proposal',
  'delete_proposal',
  'view_audit_trail',
  'manage_circles',
  'manage_stencils',
  'manage_global_config',
  'decrypt_eyes_only',
])

/**
 * Circle Membership Schema
 *
 * Validates circle membership with role and permissions
 */
export const circleMembershipSchema = z4.object({
  circleId: z4.string().uuid(),
  userId: z4.string().uuid(),
  role: roleSchema,
  adminHat: z4.array(z4.string()).optional(), // Granted capabilities
  grantedAt: z4.date(),
  grantedBy: z4.string().uuid(),
  expiresAt: z4.date().optional(), // Optional expiration
}).describe('Circle membership validation')

/**
 * Permission Check Schema
 *
 * Validates permission check requests
 */
export const permissionCheckSchema = z4.object({
  userId: z4.string().uuid(),
  resourceType: z4.enum(['proposal', 'circle', 'stencil', 'config', 'vault']),
  resourceId: z4.string().uuid(),
  action: permissionSchema,
  context: z4.record(z4.string(), z4.unknown()).optional(),
}).describe('Permission check validation')

/**
 * RBAC Result Schema
 *
 * Validates permission check results
 */
export const rbacResultSchema = z4.object({
  allowed: z4.boolean(),
  reason: z4.string().optional(),
  requiredRole: roleSchema.optional(),
  currentRole: roleSchema.optional(),
}).describe('RBAC result validation')

/**
 * Type exports
 */
export type Role = z4.infer<typeof roleSchema>
export type Permission = z4.infer<typeof permissionSchema>
export type CircleMembership = z4.infer<typeof circleMembershipSchema>
export type PermissionCheck = z4.infer<typeof permissionCheckSchema>
export type RBACResult = z4.infer<typeof rbacResultSchema>
