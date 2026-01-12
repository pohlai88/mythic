/**
 * Transition Pattern Utilities
 *
 * DRY: Centralized transition patterns using intelligence utilities
 * Standardizes transition styles across the application
 *
 * ELITE Practice: Use intelligence functions directly - they already include
 * proper durations and timing functions. No need for redundant combinations.
 */

import { intelligentTransitionStyles } from '@mythic/shared-utils'

/**
 * Standardized transition patterns
 * Use these directly - they include all necessary properties
 */
export const transitions = {
  hover: intelligentTransitionStyles('hover'),
  illuminate: intelligentTransitionStyles('illuminate'),
  commit: intelligentTransitionStyles('commit'),
} as const
