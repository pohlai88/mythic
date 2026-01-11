/**
 * Empty State Component
 *
 * Displays user-friendly empty states for lists, data, and actions
 * Required by tech debt prevention rules - no placeholder empty states allowed
 */

'use client'

import { Card } from '@mythic/design-system'
import { cn } from '@mythic/shared-utils'
import { memo } from 'react'

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
  const variantStyles = {
    default: 'text-parchment border-charcoal',
    error: 'text-ember border-ember',
    warning: 'text-gold border-gold',
    info: 'text-ash border-ash',
  }

  return (
    <Card
      elevation="sm"
      className={cn(
        'p-8 text-center border-2 border-dashed',
        variantStyles[variant],
        className
      )}
    >
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-lg font-serif mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-ash mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && <div className="flex justify-center">{action}</div>}
    </Card>
  )
})
