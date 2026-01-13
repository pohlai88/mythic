/**
 * User and Global Configuration Schemas
 *
 * Phase 17: Comprehensive config validation with Zod
 * Luxury ERP Requirement: Frontend flexibility + Vanguard backend security
 *
 * - User Config: The Manager's Preference (frontend customization)
 * - Global Config: The Sovereign's Law (security policies)
 */

import { z as z4 } from "zod/v4"

/**
 * User Configuration Schema
 *
 * The Manager's Preference - Frontend flexibility for user customization
 */
export const userConfigSchema = z4
  .object({
    user_id: z4.string().uuid(),

    // Display Preferences (Frontend Flexibility)
    theme: z4.enum(["light", "dark", "system"]).default("system"),
    default_view: z4.enum(["pool_table", "kanban", "calendar"]).default("pool_table"),
    cards_per_page: z4.number().int().min(5).max(100).default(20),
    compact_mode: z4.boolean().default(false),

    // Notification Settings
    email_notifications: z4.boolean().default(true),
    mention_alerts: z4.enum(["instant", "digest", "silent"]).default("instant"),
    approval_reminders: z4.boolean().default(true),
    digest_frequency: z4.enum(["daily", "weekly"]).default("daily"),

    // Decision Context (Frontend Flexibility)
    show_future_vector: z4.boolean().default(true),
    show_past_versions: z4.boolean().default(true),
    auto_collapse_comments: z4.boolean().default(false),

    // To-Do Integration
    link_to_dos_on_approval: z4.boolean().default(false),
    to_do_default_assignee: z4.string().email().nullable().default(null),
    to_do_default_due_days: z4.number().int().min(1).max(365).default(7),
    show_to_do_panel: z4.boolean().default(true),

    // Filter Defaults (Frontend Flexibility)
    filter_by_circle: z4.array(z4.string().uuid()).default([]),
    filter_by_status: z4
      .array(z4.enum(["DRAFT", "LISTENING", "APPROVED", "VETOED", "ARCHIVED"]))
      .default([]),
    hide_archived: z4.boolean().default(true),
    only_awaiting_my_vote: z4.boolean().default(false),

    // Proposal Stencil Defaults (Frontend Flexibility)
    favorite_stencils: z4.array(z4.string()).default([]),
    stencil_defaults: z4
      .record(
        z4.string(), // stencil_id
        z4.record(z4.string(), z4.unknown()) // field defaults
      )
      .default({}),
  })
  .describe("User configuration schema - The Manager's Preference")

/**
 * Global Configuration Schema
 *
 * The Sovereign's Law - Vanguard backend security policies
 */
export const globalConfigSchema = z4
  .object({
    // Approval Rules (Vanguard Security)
    approval_threshold: z4
      .object({
        capex_requires_board_vote: z4
          .number()
          .positive()
          .describe("Amount threshold for board vote"),
        hiring_requires_cfo_approval: z4.boolean().default(true),
        budget_expansion_auto_escalate: z4.boolean().default(true),
      })
      .default({
        capex_requires_board_vote: 100000,
        hiring_requires_cfo_approval: true,
        budget_expansion_auto_escalate: true,
      }),

    // Data Retention (Vanguard Security)
    archive_after_days: z4.number().int().min(30).max(3650).default(365),
    soft_delete_enabled: z4.boolean().default(true),
    audit_trail_immutable: z4.literal(true).default(true), // ALWAYS true per governance

    // Security & Encryption (Vanguard Security)
    eyes_only_encryption_required: z4.boolean().default(false),
    mandatory_2fa: z4.boolean().default(true),
    session_timeout_minutes: z4.number().int().min(15).max(1440).default(480),

    // Notifications
    mention_alert_enabled: z4.boolean().default(true),
    email_digest_frequency: z4.enum(["realtime", "daily", "weekly"]).default("realtime"),
    slack_integration_enabled: z4.boolean().default(false),

    // ERP Vector Configuration
    vector_refresh_interval_minutes: z4.number().int().min(1).max(60).default(5),
    vector_cache_stale_after_hours: z4.number().int().min(1).max(168).default(24),
    sap_api_enabled: z4.boolean().default(false),
    stripe_api_enabled: z4.boolean().default(false),

    // UI/UX Defaults (Frontend Flexibility)
    default_sort_by: z4.enum(["date_created", "amount", "urgency"]).default("date_created"),
    show_risk_scores: z4.boolean().default(true),
    show_approver_avatars: z4.boolean().default(true),
    theme: z4.enum(["light", "dark", "system"]).default("system"),
  })
  .describe("Global configuration schema - The Sovereign's Law")

/**
 * Validate user configuration
 */
export function validateUserConfig(config: unknown) {
  return userConfigSchema.safeParse(config)
}

/**
 * Validate global configuration
 */
export function validateGlobalConfig(config: unknown) {
  return globalConfigSchema.safeParse(config)
}

/**
 * Enforce global config security policies
 *
 * Vanguard Security: Ensures audit_trail_immutable is always true
 */
export function enforceGlobalConfigSecurity(
  config: z4.infer<typeof globalConfigSchema>
): z4.infer<typeof globalConfigSchema> {
  // Vanguard Security: audit_trail_immutable MUST always be true
  return {
    ...config,
    audit_trail_immutable: true, // Override any attempt to set false
  }
}

/**
 * Type exports
 */
export type UserConfig = z4.infer<typeof userConfigSchema>
export type GlobalConfig = z4.infer<typeof globalConfigSchema>
