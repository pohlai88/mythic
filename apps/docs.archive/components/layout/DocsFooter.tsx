/**
 * Custom Documentation Footer Component
 *
 * Replaces Nextra Footer component with custom implementation
 * using design system tokens and ELITE practices
 */

'use client'

import { cn } from '@mythic/shared-utils'
import { transitions } from '../../lib/transitions'
import { responsive } from '../../lib/tailwind-utils'

interface DocsFooterProps {
  children?: React.ReactNode
  className?: string
}

export function DocsFooter({ children, className }: DocsFooterProps) {
  return (
    <footer
      className={cn(
        'border-t border-charcoal/30 bg-obsidian/50',
        responsive.container,
        responsive.section,
        transitions.illuminate,
        className
      )}
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl text-center">
        {children || (
          <p className="text-xs sm:text-sm text-ash">
            {new Date().getFullYear()} © NexusCanon. Built with Next.js and Tailwind CSS.
          </p>
        )}
      </div>
    </footer>
  )
}
