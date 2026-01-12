/**
 * Custom Documentation Navbar Component
 *
 * Replaces Nextra Navbar component with custom implementation
 * using design system tokens and ELITE practices
 */

'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { cn } from '@mythic/shared-utils'
import { Link } from '../shared'
import { transitions } from '../../lib/transitions'
import { focusStyles } from '../../lib/aria-patterns'

interface DocsNavbarProps {
  logo?: React.ReactNode
  projectLink?: string
  className?: string
}

export function DocsNavbar({ logo, projectLink, className }: DocsNavbarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Memoize theme toggle handler
  const handleThemeToggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  // Memoize nav classes
  const navClasses = useMemo(
    () =>
      cn(
        'sticky top-0 z-50 border-b border-charcoal/30 bg-obsidian/95 backdrop-blur-sm',
        transitions.illuminate,
        className
      ),
    [className]
  )

  // Memoize button classes
  const buttonClasses = useMemo(
    () =>
      cn(
        'rounded-xs border border-charcoal/30',
        'bg-obsidian/50 p-2 text-ash',
        'hover:text-parchment hover:border-gold/30',
        transitions.hover,
        focusStyles.default
      ),
    []
  )

  return (
    <nav
      className={navClasses}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          {logo || (
            <Link
              href="/"
              variant="primary"
              className="font-semibold text-base sm:text-lg md:text-xl"
            >
              NexusCanon
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <button
              type="button"
              onClick={handleThemeToggle}
              className={buttonClasses}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}

          {/* Project Link */}
          {projectLink && (
            <Link
              href={projectLink}
              variant="muted"
              className="text-xs sm:text-sm rounded-xs px-2 py-1"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
