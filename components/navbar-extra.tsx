'use client'

import Link from 'next/link'

/**
 * Custom Navbar Extra Content Component
 * This component can be used to add custom content to the navbar
 * in Nextra 4 by adding it as children to <Navbar> in app/layout.tsx
 *
 * Example:
 * <Navbar>
 *   <NavbarExtra />
 *   <Search />
 *   <ThemeSwitch />
 * </Navbar>
 */
export function NavbarExtra() {
  return (
    <div className="flex items-center gap-4">
      {/* Example: Version Badge */}
      <span className="hidden rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 sm:inline-block">
        v1.0.0
      </span>

      {/* Example: Custom Link */}
      <Link
        href="/changelog"
        className="hidden text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 sm:inline-block"
      >
        Changelog
      </Link>
    </div>
  )
}
