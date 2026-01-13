/**
 * Main Library Barrel Export
 *
 * Centralized exports for all lib modules.
 * Use specific imports for tree-shaking in production.
 *
 * @example
 * ```typescript
 * // ✅ Preferred: Specific imports (better tree-shaking)
 * import { checkPermission } from '@/src/lib/auth'
 * import { createAuditEvent } from '@/src/lib/audit'
 *
 * // ✅ Acceptable: Main barrel (convenience, less tree-shaking)
 * import { checkPermission, createAuditEvent } from '@/src/lib'
 * ```
 */

// Auth/RBAC Module
export * from "./auth"

// Audit Trail Module
export * from "./audit"

// Configuration Module
export * from "./config"

// Frontend Customization Module
export * from "./frontend"

// Realtime/WebSocket Module
export * from "./realtime"

// Vault/Encryption Module
export * from "./vault"

// Tailwind Utilities (design tokens and responsive utilities)
export * from "./tailwind-utils"
export * from "./design-tokens"

// Tailwind Intelligence (re-exported from @mythic/shared-utils)
export * from "./tailwind-intelligence"

// Note: Other modules (analytics, api, cache, metrics, stores, zod)
// are not exported here to encourage specific imports for better tree-shaking.
// Import directly from their specific paths when needed.
