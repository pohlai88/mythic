/**
 * Diátaxis Intelligence Utilities
 *
 * Intelligence-driven utilities specifically for Diátaxis document types
 * Maps document types to intelligence-driven styling functions
 */

import {
  intelligentStatusStyles,
  intelligentGradientStyles,
  intelligentTransitionStyles,
  type ProposalStatus,
} from '@mythic/shared-utils'
import type { DiataxisType } from '../components/diataxis/DocumentTypeBadge'

/**
 * Map Diátaxis document types to proposal statuses for intelligence-driven styling
 */
export const diataxisTypeToStatus: Record<DiataxisType, ProposalStatus> = {
  tutorial: 'APPROVED', // Learning-oriented = positive/approved state
  'how-to': 'APPROVED', // Problem-solving = approved/successful approach
  reference: 'LISTENING', // Information = neutral/listening state
  explanation: 'LISTENING', // Understanding = neutral/listening state
}

/**
 * Map Diátaxis document types to gradient types
 */
export const diataxisTypeToGradient: Record<
  DiataxisType,
  'approved' | 'success' | 'neutral' | 'warning'
> = {
  tutorial: 'success',
  'how-to': 'approved',
  reference: 'neutral',
  explanation: 'warning',
}

/**
 * Get intelligence-driven styles for a Diátaxis document type
 */
export function getDiataxisIntelligenceStyles(
  type: DiataxisType,
  variant: 'badge' | 'card' | 'border' | 'text' = 'badge'
): string {
  const status = diataxisTypeToStatus[type]
  return intelligentStatusStyles(status, variant)
}

/**
 * Get intelligence-driven gradient for a Diátaxis document type
 */
export function getDiataxisGradientStyles(type: DiataxisType): string {
  const gradientType = diataxisTypeToGradient[type]
  return intelligentGradientStyles(gradientType)
}

/**
 * Get intelligence-driven transition for Diátaxis components
 */
export function getDiataxisTransitionStyles(
  type: 'hover' | 'commit' | 'illuminate' = 'illuminate'
): string {
  return intelligentTransitionStyles(type)
}

/**
 * Combined intelligence styles for Diátaxis document types
 */
export function getDiataxisCombinedStyles(
  type: DiataxisType,
  options?: {
    includeGradient?: boolean
    includeTransition?: boolean
    transitionType?: 'hover' | 'commit' | 'illuminate'
    variant?: 'badge' | 'card' | 'border' | 'text'
  }
): string {
  const classes: string[] = []

  // Base status styles
  const variant = options?.variant || 'border'
  classes.push(getDiataxisIntelligenceStyles(type, variant))

  // Optional gradient
  if (options?.includeGradient) {
    classes.push(getDiataxisGradientStyles(type))
  }

  // Optional transition
  if (options?.includeTransition !== false) {
    const transitionType = options?.transitionType || 'illuminate'
    classes.push(getDiataxisTransitionStyles(transitionType))
  }

  return classes.join(' ')
}
