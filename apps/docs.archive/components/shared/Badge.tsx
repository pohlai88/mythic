/**
 * Badge Component
 *
 * Generic badge component extending DocumentTypeBadge pattern
 * Supports status, priority, and custom variants
 */

'use client'

import { useMemo } from 'react'
import { cn } from '@mythic/shared-utils'
import type { ProposalStatus, PriorityLevel } from '@mythic/shared-utils'
import { focusStyles } from '../../lib/aria-patterns'
import { useBadgeIntelligenceStyles } from '../../lib/hooks/use-intelligence-styles'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'status' | 'priority' | 'custom'
  status?: ProposalStatus
  priority?: PriorityLevel
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Badge({
  variant = 'custom',
  status,
  priority,
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  // Intelligence-driven styling using composed hook
  const intelligenceStyles = useBadgeIntelligenceStyles({
    status,
    priority,
  })

  // Memoize size styles to prevent recalculation
  const sizeStyles = useMemo(
    () => ({
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    }),
    []
  )

  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center gap-1.5 rounded-xs border font-medium',
        // Size
        sizeStyles[size],
        // Intelligence styles (composed - includes transitions)
        intelligenceStyles.status,
        intelligenceStyles.priority,
        intelligenceStyles.transition,
        // Interactive states (no scale - gravitational time only)
        'hover:opacity-80',
        'focus:outline-hidden focus:ring-2 focus:ring-gold focus:ring-offset-2',
        className
      )}
      role="status"
      {...props}
    >
      {children}
    </span>
  )
}
