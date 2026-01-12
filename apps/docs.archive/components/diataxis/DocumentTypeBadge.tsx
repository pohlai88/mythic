/**
 * Diátaxis Document Type Badge
 *
 * Visual indicator for Diátaxis document types (Tutorial, How-To, Reference, Explanation)
 * Uses domain-specific theme colors from @theme directive
 */

import { cn } from '@mythic/shared-utils'
import { transitions } from '../../lib/transitions'

export type DiataxisType = 'tutorial' | 'how-to' | 'reference' | 'explanation'

interface DocumentTypeBadgeProps {
  type: DiataxisType
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const typeConfig: Record<
  DiataxisType,
  {
    label: string
    icon: string
    description: string
  }
> = {
  tutorial: {
    label: 'Tutorial',
    icon: '📖',
    description: 'Learning-oriented, step-by-step',
  },
  'how-to': {
    label: 'How-To',
    icon: '🔧',
    description: 'Problem-oriented, goal-focused',
  },
  reference: {
    label: 'Reference',
    icon: '📚',
    description: 'Information-oriented, technical',
  },
  explanation: {
    label: 'Explanation',
    icon: '💡',
    description: 'Understanding-oriented, conceptual',
  },
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

const typeClasses: Record<DiataxisType, string> = {
  tutorial: 'bg-diataxis-tutorial-bg text-diataxis-tutorial border-diataxis-tutorial-border',
  'how-to': 'bg-diataxis-howto-bg text-diataxis-howto border-diataxis-howto-border',
  reference: 'bg-diataxis-reference-bg text-diataxis-reference border-diataxis-reference-border',
  explanation: 'bg-diataxis-explanation-bg text-diataxis-explanation border-diataxis-explanation-border',
}

export function DocumentTypeBadge({
  type,
  className,
  size = 'md',
}: DocumentTypeBadgeProps) {
  const config = typeConfig[type]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xs border font-medium',
        // ELITE: Systematic variant usage with full state coverage
        // Gravitational time only - no scale transforms
        transitions.illuminate,
        'hover:opacity-80',
        'dark:hover:opacity-90',
        'focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-gold',
        // Responsive sizing
        'text-xs sm:text-sm md:text-base',
        typeClasses[type],
        sizeClasses[size],
        className
      )}
      title={config.description}
      role="status"
      aria-label={`Document type: ${config.label}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}
