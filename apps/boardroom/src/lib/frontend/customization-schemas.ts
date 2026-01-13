/**
 * Frontend Customization Schemas
 *
 * Phase 20: Frontend customization validation with Zod
 * Luxury ERP Requirement: Users must customize layouts, views, filters safely
 */

import { z as z4 } from "zod/v4"

/**
 * Layout Configuration Schema
 *
 * Frontend Flexibility: Layout customization
 */
export const layoutConfigSchema = z4
  .object({
    leftPanelWidth: z4.number().int().min(300).max(800).default(600), // 60% of 1000px
    rightPanelWidth: z4.number().int().min(200).max(700).default(400), // 40% of 1000px
    showMetrics: z4.boolean().default(true),
    metricsPosition: z4.enum(["top", "bottom", "sidebar"]).default("top"),
    compactMode: z4.boolean().default(false),
  })
  .describe("Layout customization schema")

/**
 * View Configuration Schema
 *
 * Frontend Flexibility: View customization
 */
export const viewConfigSchema = z4
  .object({
    viewType: z4.enum(["pool_table", "kanban", "calendar", "timeline"]).default("pool_table"),
    sortBy: z4.enum(["date_created", "amount", "urgency", "status"]).default("date_created"),
    sortOrder: z4.enum(["asc", "desc"]).default("desc"),
    groupBy: z4.enum(["circle", "status", "stencil", "none"]).default("none"),
    filters: z4
      .object({
        status: z4
          .array(z4.enum(["DRAFT", "LISTENING", "APPROVED", "VETOED", "ARCHIVED"]))
          .default([]),
        circleIds: z4.array(z4.string().uuid()).default([]),
        dateRange: z4
          .object({
            start: z4.date().optional(),
            end: z4.date().optional(),
          })
          .optional(),
        amountRange: z4
          .object({
            min: z4.number().nonnegative().optional(),
            max: z4.number().nonnegative().optional(),
          })
          .optional(),
      })
      .default(() => ({ status: [], circleIds: [] })),
  })
  .describe("View customization schema")

/**
 * Component Configuration Schema
 *
 * Frontend Flexibility: Component customization
 */
export const componentConfigSchema = z4
  .object({
    showAvatars: z4.boolean().default(true),
    showRiskScores: z4.boolean().default(true),
    showFutureVector: z4.boolean().default(true),
    showPastVersions: z4.boolean().default(true),
    autoCollapseComments: z4.boolean().default(false),
    cardsPerPage: z4.number().int().min(5).max(100).default(20),
  })
  .describe("Component customization schema")

/**
 * Complete Frontend Customization Schema
 *
 * Frontend Flexibility: Combined customization schema
 */
export const frontendCustomizationSchema = z4
  .object({
    layout: layoutConfigSchema,
    view: viewConfigSchema,
    components: componentConfigSchema,
    theme: z4.enum(["light", "dark", "system"]).default("system"),
  })
  .describe("Complete frontend customization schema")

/**
 * Type exports
 */
export type LayoutConfig = z4.infer<typeof layoutConfigSchema>
export type ViewConfig = z4.infer<typeof viewConfigSchema>
export type ComponentConfig = z4.infer<typeof componentConfigSchema>
export type FrontendCustomization = z4.infer<typeof frontendCustomizationSchema>
