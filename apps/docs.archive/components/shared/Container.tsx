/**
 * Container Component
 *
 * Responsive container with consistent spacing
 * DRY: Centralized container patterns
 *
 * Server Component - No interactivity needed
 */

import { cn } from '@mythic/shared-utils'
import { responsive } from '../../lib/tailwind-utils'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'narrow' | 'wide' | 'full'
  children: React.ReactNode
}

export function Container({
  variant = 'default',
  className,
  children,
  ...props
}: ContainerProps) {
  const variantStyles = {
    default: responsive.container,
    narrow: 'mx-auto px-4 sm:px-6 max-w-2xl',
    wide: 'mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-6xl',
    full: 'w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
  }

  return (
    <div className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </div>
  )
}
