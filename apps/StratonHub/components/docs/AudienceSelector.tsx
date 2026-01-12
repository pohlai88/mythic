/**
 * Audience Selector Component
 *
 * Component for switching between audience views
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@mythic/shared-utils'

const audiences = [
  { id: 'developers', label: '👨‍💻 Developers', path: '/developers' },
  { id: 'users', label: '👥 Users', path: '/users' },
  { id: 'business', label: '🏢 Business', path: '/business' },
] as const

export function AudienceSelector() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2 border-b border-charcoal pb-4 mb-4">
      {audiences.map((audience) => {
        const isActive = pathname?.startsWith(audience.path)
        return (
          <Link
            key={audience.id}
            href={audience.path}
            className={cn(
              'px-4 py-2 rounded-xs text-sm font-medium transition-colors',
              isActive
                ? 'bg-gold text-void'
                : 'text-ash hover:text-parchment hover:bg-charcoal'
            )}
          >
            {audience.label}
          </Link>
        )
      })}
    </div>
  )
}
