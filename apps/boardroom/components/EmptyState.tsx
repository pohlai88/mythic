/**
 * Empty State Component
 *
 * Displays user-friendly empty states for lists, data, and actions
 * Required by tech debt prevention rules - no placeholder empty states allowed
 */

'use client'

import { Card } from '@mythic/design-system'
import { cn, intelligentStatusStyles } from '@mythic/shared-utils'
import { spacing, typography, tokens, margins, alignment, layout, borders } from '@/src/lib'
import { memo, useMemo } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  variant?: 'default' | 'error' | 'warning' | 'info'
  className?: string
}

export const EmptyState = memo(function EmptyState({
  title,
  description,
  icon,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  // Map variant to proposal status for intelligence-driven styling
  const statusMap: Record<'default' | 'error' | 'warning' | 'info', 'DRAFT' | 'VETOED' | 'LISTENING' | 'APPROVED'> = {
    default: 'DRAFT',
    error: 'VETOED',
    warning: 'LISTENING',
    info: 'APPROVED',
  }

  // Use intelligence-driven styling for variants
  const variantStyles = useMemo(() => {
    return intelligentStatusStyles(statusMap[variant], 'border', borders.dashed)
  }, [variant])

  const textStyles = useMemo(() => {
    return intelligentStatusStyles(statusMap[variant], 'text')
  }, [variant])

  return (
    <Card
      elevation="sm"
      className={cn(
        spacing.cardLarge,
        alignment.center,
        variantStyles,
        textStyles,
        className
      )}
    >
      {icon && <div className={cn(margins.bottom.md, layout.flexCenter)}>{icon}</div>}
      <h3 className={cn(typography.heading.sm, margins.bottom.sm)}>{title}</h3>
      {description && (
        <p className={cn(typography.body.md, tokens.text.secondary, margins.bottom.lg, 'max-w-md mx-auto')}>{description}</p>
      )}
      {action && <div className={layout.flexCenter}>{action}</div>}
    </Card>
  )
})
