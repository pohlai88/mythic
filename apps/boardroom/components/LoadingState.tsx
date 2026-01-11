/**
 * Loading State Component
 *
 * Displays loading indicators for async operations
 * Required by tech debt prevention rules - no placeholder loading states allowed
 */

'use client'

import { Card } from '@mythic/design-system'
import { cn } from '@mythic/shared-utils'
import { memo } from 'react'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingState = memo(function LoadingState({
  message = 'Loading...',
  size = 'md',
  className,
}: LoadingStateProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <Card elevation="sm" className={cn('p-8 text-center', className)}>
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            'border-2 border-gold border-t-transparent rounded-full animate-spin',
            sizeStyles[size]
          )}
          role="status"
          aria-label="Loading"
        />
        <p className="text-sm text-ash">{message}</p>
      </div>
    </Card>
  )
})
