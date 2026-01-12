/**
 * Module Navigation Component
 *
 * Navigation component for ERP modules
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@mythic/shared-utils'

const modules = [
  'boardroom',
  'accounting',
  'finance',
  'crm',
  'manufacturing',
  'supply-chain',
  'procurement',
  'marketing',
  'investor-relations',
] as const

interface ModuleNavProps {
  audience?: 'developers' | 'users' | 'business'
  currentModule?: string
}

export function ModuleNav({ audience = 'users', currentModule }: ModuleNavProps) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      <h3 className="text-xs font-semibold text-ash uppercase tracking-wider mb-3">
        Modules
      </h3>
      {modules.map((module) => {
        const href = `/${audience}/${module}`
        const isActive = currentModule === module || pathname?.includes(`/${module}`)

        return (
          <Link
            key={module}
            href={href}
            className={cn(
              'block px-3 py-2 rounded-xs text-sm transition-colors',
              isActive
                ? 'bg-charcoal text-parchment'
                : 'text-ash hover:text-parchment hover:bg-charcoal'
            )}
          >
            <span className="capitalize">{module.replace('-', ' ')}</span>
          </Link>
        )
      })}
    </nav>
  )
}
