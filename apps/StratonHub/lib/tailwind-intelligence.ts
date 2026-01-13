/**
 * Tailwind Intelligence Re-export
 *
 * Re-exports Tailwind Intelligence utilities from @mythic/nextjs-shared-utils
 * to enable @/ path alias imports.
 *
 * @example
 * ```typescript
 * // ✅ Now available via @/ path alias
 * import { intelligentRiskStyles, intelligentStatusStyles } from '@/lib/tailwind-intelligence'
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
