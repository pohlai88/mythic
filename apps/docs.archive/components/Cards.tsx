/**
 * Cards Component
 *
 * Custom card grid component replacing Nextra's Cards
 * Uses shared Card component with intelligence-driven styling
 * Implements container queries for responsive layout
 *
 * Optimized with React.memo() for performance
 */

'use client'

import { memo, useMemo } from 'react'
import { cn } from '@mythic/shared-utils'
import { Card } from './shared'
import { Link } from './shared'
import { gridCols, spacing } from '../lib/tailwind-utils'
import { transitions } from '../lib/transitions'

interface CardItem {
  title: string
  description?: string
  href: string
  icon?: React.ReactNode
  status?: 'DRAFT' | 'LISTENING' | 'APPROVED' | 'VETOED' | 'ARCHIVED'
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface CardsProps {
  items: CardItem[]
  columns?: 1 | 2 | 3 | 4
  className?: string
}

// Memoized card item component to prevent unnecessary re-renders
const CardItem = memo(function CardItem({ item }: { item: CardItem }) {
  return (
    <Link href={item.href}>
      <Card
        status={item.status}
        priority={item.priority}
        className="h-full group"
      >
        {item.icon && (
          <div className={cn('mb-3 text-2xl text-gold group-hover:text-parchment', transitions.illuminate)}>
            {item.icon}
          </div>
        )}
        <Card.Title className={cn('group-hover:text-gold', transitions.illuminate)}>
          {item.title}
        </Card.Title>
        {item.description && (
          <Card.Content>{item.description}</Card.Content>
        )}
      </Card>
    </Link>
  )
})

export function Cards({ items, columns = 3, className }: CardsProps) {
  // Memoize grid classes to prevent recalculation
  const gridClasses = useMemo(
    () =>
      cn(
        // Container query support
        '@container',
        'grid',
        spacing.gap.md,
        gridCols[columns],
        // Container query variants
        '@md:grid-cols-2 @lg:grid-cols-3',
        transitions.illuminate,
        className
      ),
    [columns, className]
  )

  return (
    <div className={gridClasses}>
      {items.map((item) => (
        <CardItem key={item.href} item={item} />
      ))}
    </div>
  )
}
