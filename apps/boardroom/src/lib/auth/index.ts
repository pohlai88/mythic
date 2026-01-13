/**
 * Auth/RBAC Module Exports
 *
 * Phase 19: Centralized RBAC exports
 */

export {
  roleSchema,
  permissionSchema,
  circleMembershipSchema,
  permissionCheckSchema,
  rbacResultSchema,
  type Role,
  type Permission,
  type CircleMembership,
  type PermissionCheck,
  type RBACResult,
} from "./rbac-schemas"

export {
  checkPermission,
  validatePermissionCheck,
  validateRBACResult,
  validateCircleMembership,
} from "./rbac-service"

// Session Management
export { getCurrentUser, getCurrentUserId, type Session } from "./session"
