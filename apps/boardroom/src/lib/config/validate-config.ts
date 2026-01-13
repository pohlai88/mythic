/**
 * Configuration Validation Service
 *
 * Phase 17: Runtime validation for user and global config
 */

import { z as z4 } from "zod/v4"
import {
  userConfigSchema,
  globalConfigSchema,
  enforceGlobalConfigSecurity,
  type UserConfig,
  type GlobalConfig,
} from "./user-config-schema"

/**
 * Validate and parse user configuration
 *
 * @throws {Error} If config is invalid
 */
export function parseUserConfig(config: unknown): UserConfig {
  const result = userConfigSchema.safeParse(config)
  if (!result.success) {
    throw new Error(`Invalid user config: ${result.error.issues[0]?.message || "Unknown error"}`)
  }
  return result.data
}

/**
 * Validate and parse global configuration with security enforcement
 *
 * @throws {Error} If config is invalid
 */
export function parseGlobalConfig(config: unknown): GlobalConfig {
  const result = globalConfigSchema.safeParse(config)
  if (!result.success) {
    throw new Error(`Invalid global config: ${result.error.issues[0]?.message || "Unknown error"}`)
  }
  // Enforce security policies
  return enforceGlobalConfigSecurity(result.data)
}

/**
 * Safe parse user configuration (non-throwing)
 */
export function safeParseUserConfig(config: unknown) {
  return userConfigSchema.safeParse(config)
}

/**
 * Safe parse global configuration with security enforcement (non-throwing)
 */
export function safeParseGlobalConfig(config: unknown) {
  const result = globalConfigSchema.safeParse(config)
  if (result.success) {
    return {
      success: true as const,
      data: enforceGlobalConfigSecurity(result.data),
    }
  }
  return result
}

/**
 * Merge user customization with global defaults
 *
 * User preferences take precedence over global defaults
 */
export function mergeUserConfig(
  userCustomization: Partial<UserConfig>,
  globalDefaults: Partial<GlobalConfig>
): UserConfig {
  // Validate both inputs
  const userResult = userConfigSchema.partial().safeParse(userCustomization)
  if (!userResult.success) {
    throw new Error(
      `Invalid user customization: ${userResult.error.issues[0]?.message || "Unknown error"}`
    )
  }
  const validatedUser = userResult.data

  const globalResult = globalConfigSchema.partial().safeParse(globalDefaults)
  if (!globalResult.success) {
    throw new Error(
      `Invalid global defaults: ${globalResult.error.issues[0]?.message || "Unknown error"}`
    )
  }
  const validatedGlobal = globalResult.data

  // Start with defaults
  const defaults: UserConfig = {
    user_id: validatedUser.user_id || "",
    theme: validatedGlobal.theme || "system",
    default_view: "pool_table",
    cards_per_page: validatedGlobal.show_risk_scores ? 20 : 10,
    compact_mode: false,
    email_notifications: true,
    mention_alerts: "instant",
    approval_reminders: true,
    digest_frequency: "daily",
    show_future_vector: validatedGlobal.show_risk_scores ?? true,
    show_past_versions: true,
    auto_collapse_comments: false,
    link_to_dos_on_approval: false,
    to_do_default_assignee: null,
    to_do_default_due_days: 7,
    show_to_do_panel: true,
    filter_by_circle: [],
    filter_by_status: [],
    hide_archived: true,
    only_awaiting_my_vote: false,
    favorite_stencils: [],
    stencil_defaults: {},
  }

  // Merge with user preferences (user takes precedence)
  const mergedResult = userConfigSchema.safeParse({
    ...defaults,
    ...validatedUser,
  })
  if (!mergedResult.success) {
    throw new Error(
      `Invalid merged config: ${mergedResult.error.issues[0]?.message || "Unknown error"}`
    )
  }
  return mergedResult.data
}
