/**
 * Intelligence Styles Hook
 *
 * DRY: Centralized hook for composing intelligence-driven styles
 * Reduces code duplication across components
 *
 * @example
 * ```tsx
 * const styles = useIntelligenceStyles({
 *   status: 'APPROVED',
 *   priority: 'HIGH',
 *   transition: 'illuminate'
 * })
 *
 * <div className={cn(styles.status, styles.priority, styles.transition)}>
 * ```
 */

import { useMemo } from 'react'
import {
  intelligentStatusStyles,
  intelligentPriorityStyles,
  intelligentGradientStyles,
  intelligentTransitionStyles,
} from '@mythic/shared-utils'
import type { ProposalStatus, PriorityLevel } from '@mythic/shared-utils'

interface UseIntelligenceStylesConfig {
  status?: ProposalStatus
  priority?: PriorityLevel
  gradient?: 'approved' | 'vetoed' | 'warning' | 'success' | 'neutral'
  transition?: 'hover' | 'illuminate' | 'commit'
  variant?: 'border' | 'text' | 'card' | 'badge'
}

interface IntelligenceStyles {
  status: string
  priority: string
  gradient: string
  transition: string
}

/**
 * Composes intelligence-driven styles into a single object
 *
 * @param config - Configuration object for intelligence styles
 * @returns Object containing composed style strings
 */
export function useIntelligenceStyles(
  config: UseIntelligenceStylesConfig = {}
): IntelligenceStyles {
  return useMemo(() => {
    const variant = config.variant || 'border'

    // Map variant to valid types for intelligence functions
    const statusVariant = variant === 'badge' ? 'border' : variant === 'card' ? 'border' : variant
    const priorityVariant = config.variant === 'text' ? 'text' : 'border'

    return {
      status: config.status
        ? intelligentStatusStyles(config.status, statusVariant as 'border' | 'text' | 'card')
        : '',
      priority: config.priority
        ? intelligentPriorityStyles(config.priority, priorityVariant as 'text' | 'badge' | 'indicator')
        : '',
      gradient: config.gradient
        ? intelligentGradientStyles(config.gradient)
        : '',
      transition: config.transition
        ? intelligentTransitionStyles(config.transition)
        : '',
    }
  }, [config.status, config.priority, config.gradient, config.transition, config.variant])
}

/**
 * Composes intelligence styles for card components
 *
 * @param config - Card-specific intelligence configuration
 * @returns Composed styles object
 */
export function useCardIntelligenceStyles(config: {
  status?: ProposalStatus
  priority?: PriorityLevel
  gradient?: 'approved' | 'vetoed' | 'warning' | 'success' | 'neutral'
}) {
  return useIntelligenceStyles({
    ...config,
    transition: 'illuminate',
    variant: 'border',
  })
}

/**
 * Composes intelligence styles for button components
 *
 * @param config - Button-specific intelligence configuration
 * @returns Composed styles object
 */
export function useButtonIntelligenceStyles(config: {
  status?: ProposalStatus
  priority?: PriorityLevel
}) {
  return useIntelligenceStyles({
    ...config,
    transition: 'hover',
    variant: 'border',
  })
}

/**
 * Composes intelligence styles for badge components
 *
 * @param config - Badge-specific intelligence configuration
 * @returns Composed styles object
 */
export function useBadgeIntelligenceStyles(config: {
  status?: ProposalStatus
  priority?: PriorityLevel
}) {
  return useIntelligenceStyles({
    ...config,
    transition: 'illuminate',
    variant: 'border',
  })
}
