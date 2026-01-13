/**
 * Tailwind Intelligence Re-export
 *
 * ⚠️ SOURCE OF TRUTH: packages/NextJS/Shared-Utils/src/tailwind-intelligence.ts
 * This file is a convenience re-export for @/ path alias imports.
 *
 * CSS Classes Source of Truth: packages/TailwindCSS-V4/Design-System/src/tokens/axis-base.css
 * All intelligence CSS classes (e.g., .role-sovereign, .broadcast-approval) are defined
 * in the design system, not here. This file only re-exports TypeScript functions.
 *
 * @example
 * ```typescript
 * // ✅ Now available via @/ path alias
 * import { intelligentRiskStyles, intelligentStatusStyles } from '@/src/lib/tailwind-intelligence'
 *
 * // ✅ Also available via barrel export
 * import { intelligentRiskStyles } from '@/src/lib'
 *
 * // ✅ Direct import (preferred for clarity)
 * import { intelligentRiskStyles } from '@mythic/nextjs-shared-utils'
 * ```
 */

export {
  // Core functions
  intelligentRiskStyles,
  intelligentStatusStyles,
  intelligentVarianceStyles,
  intelligentPriorityStyles,
  intelligentButtonStyles,
  intelligentInputStyles,
  intelligentTransitionStyles,
  intelligentStyles,
  calculateRiskStatus,
  createIntelligentStyles,
  // Types
  type RiskStatus,
  type ProposalStatus,
  type PriorityLevel,
  type VectorType,
  type StatusVariant,
  type ButtonVariant,
  type ButtonSize,
  type VarianceVariant,
  type PriorityVariant,
} from "@mythic/nextjs-shared-utils"
