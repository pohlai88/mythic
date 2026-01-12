/**
 * Custom Documentation Layout Component
 *
 * Replaces Nextra Layout component with custom implementation
 * using design system tokens and ELITE practices
 */

'use client'

import { cn } from '@mythic/shared-utils'
import type { ReactNode } from 'react'

interface DocsLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  toc?: ReactNode
  className?: string
}

export function DocsLayout({ children, sidebar, toc, className }: DocsLayoutProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen bg-void text-parchment',
        className
      )}
    >
      {/* Sidebar */}
      {sidebar && (
        <aside
          className="
            hidden lg:block
            w-64 xl:w-72
            border-r border-charcoal/30
            bg-obsidian/50
            overflow-y-auto
            sticky top-0 h-screen
          "
          role="complementary"
          aria-label="Documentation navigation"
        >
          {sidebar}
        </aside>
      )}

      {/* Main Content */}
      <main
        className="
          flex-1
          min-w-0
          px-4 sm:px-6 md:px-8 lg:px-12
          py-6 sm:py-8 md:py-10
        "
        role="main"
      >
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </main>

      {/* Table of Contents */}
      {toc && (
        <aside
          className="
            hidden xl:block
            w-64
            border-l border-charcoal/30
            bg-obsidian/30
            overflow-y-auto
            sticky top-0 h-screen
            px-4 py-6
          "
          role="complementary"
          aria-label="Table of contents"
        >
          {toc}
        </aside>
      )}
    </div>
  )
}
