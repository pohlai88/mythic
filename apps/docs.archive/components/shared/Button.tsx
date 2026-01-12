/**
 * Button Component
 *
 * Intelligence-aware button component with standardized styling
 * Uses design system tokens and intelligence utilities
 */

'use client'

import { useMemo } from 'react'
import { cn } from '@mythic/shared-utils'
import type { ProposalStatus, PriorityLevel } from '@mythic/shared-utils'
import { focusStyles } from '../../lib/aria-patterns'
import { transitions } from '../../lib/transitions'
import { useButtonIntelligenceStyles } from '../../lib/hooks/use-intelligence-styles'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  status?: ProposalStatus
  priority?: PriorityLevel
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  status,
  priority,
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  // Intelligence-driven styling using composed hook
  const intelligenceStyles = useButtonIntelligenceStyles({
    status,
    priority,
  })

  // Memoize variant and size styles to prevent recalculation
  // Axis Visual Canon: Buttons ratify decisions - primary uses commitment duration (1618ms)
  const variantStyles = useMemo(
    () => ({
      primary: cn('bg-gold text-void hover:bg-gold/90 border border-gold', transitions.commit),
      secondary: cn('bg-obsidian text-parchment hover:bg-obsidian/80 border border-charcoal/30', transitions.hover),
      ghost: cn('bg-transparent text-parchment hover:bg-obsidian/50 border border-transparent hover:border-charcoal/30', transitions.hover),
    }),
    []
  )

  const sizeStyles = useMemo(
    () => ({
      sm: 'px-3 py-1.5 text-xs sm:text-sm',
      md: 'px-4 py-2 text-sm sm:text-base',
      lg: 'px-6 py-3 text-base sm:text-lg',
    }),
    []
  )

  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'rounded-xs font-medium',
        // Variant (includes proper transitions via intelligence functions)
        variantStyles[variant],
        // Size
        sizeStyles[size],
        // Intelligence styles (composed - transitions already included in variant)
        intelligenceStyles.status,
        intelligenceStyles.priority,
        // Interactive states (no scale - gravitational time only)
        'hover:opacity-90',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Focus
        focusStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
