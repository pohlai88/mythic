/**
 * Link Component
 *
 * Intelligent link component with transition styles
 * Extends Next.js Link with intelligence-driven styling
 *
 * Note: Next.js Link handles client-side navigation,
 * this wrapper can be a server component
 */

import NextLink from 'next/link'
import { cn } from '@mythic/shared-utils'
import { intelligentTransitionStyles } from '@mythic/shared-utils'
import { focusStyles } from '../../lib/aria-patterns'
import { transitions } from '../../lib/transitions'

interface LinkProps extends React.ComponentProps<typeof NextLink> {
  variant?: 'default' | 'primary' | 'muted'
  children: React.ReactNode
}

export function Link({ variant = 'default', className, children, ...props }: LinkProps) {
  const transitionStyles = intelligentTransitionStyles('illuminate')

  const variantStyles = {
    default: 'text-parchment hover:text-gold',
    primary: 'text-gold hover:text-parchment font-semibold',
    muted: 'text-ash hover:text-parchment',
  }

  return (
    <NextLink
      className={cn(
        // Base styles (intelligence function includes transition properties)
        transitionStyles,
        // Variant
        variantStyles[variant],
        // Focus
        focusStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </NextLink>
  )
}
