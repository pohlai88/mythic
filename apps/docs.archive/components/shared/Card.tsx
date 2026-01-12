/**
 * Card Component
 *
 * Status-aware card component with intelligence-driven styling
 * Supports compound component pattern for flexible composition
 *
 * Client Component - Needs hover states and focus-within
 */

'use client'

import { memo, useMemo } from 'react'
import { cn } from '@mythic/shared-utils'
import type { ProposalStatus, PriorityLevel } from '@mythic/shared-utils'
import { focusStyles } from '../../lib/aria-patterns'
import { spacing } from '../../lib/tailwind-utils'
import { tokens } from '../../lib/design-tokens'
import { useCardIntelligenceStyles } from '../../lib/hooks/use-intelligence-styles'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: ProposalStatus
  priority?: PriorityLevel
  gradient?: 'approved' | 'vetoed' | 'warning' | 'success' | 'neutral'
  hover?: boolean
  children: React.ReactNode
}

const CardRoot = memo(function CardRoot({
  status,
  priority,
  gradient,
  hover = true,
  className,
  children,
  ...props
}: CardProps) {
  // Intelligence-driven styling using composed hook
  const intelligenceStyles = useCardIntelligenceStyles({
    status,
    priority,
    gradient,
  })

  // Memoize className computation
  const cardClassName = useMemo(
    () =>
      cn(
        // Base styles
        'rounded-lg border',
        tokens.borders.default,
        'bg-obsidian/50',
        spacing.card,
        // Intelligence styles (composed)
        intelligenceStyles.status,
        intelligenceStyles.priority,
        intelligenceStyles.gradient,
        intelligenceStyles.transition,
        // Interactive states
        hover && 'hover:border-gold/30 hover:bg-obsidian/70 hover:shadow-md',
        // Focus
        'focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2',
        className
      ),
    [intelligenceStyles, hover, className]
  )

  return (
    <div className={cardClassName} {...props}>
      {children}
    </div>
  )
})

function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'font-serif text-lg sm:text-xl font-semibold text-parchment',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-sm sm:text-base text-ash leading-relaxed', className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-charcoal/20', className)} {...props}>
      {children}
    </div>
  )
}

// Compound component pattern
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Content: CardContent,
  Footer: CardFooter,
})
