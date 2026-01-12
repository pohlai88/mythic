/**
 * AmendmentHistory Component
 *
 * Displays amendment chain visualization for governance documents.
 * Uses shared components and design system tokens
 */

import type React from 'react'
import { cn } from '@mythic/shared-utils'
import { Card } from '../shared'
import { Link } from '../shared'
import { StatusBadge } from './StatusBadge'
import type { DocumentStatus } from './StatusBadge'
import { tokens } from '../../lib/design-tokens'
import { spacing } from '../../lib/tailwind-utils'

interface Amendment {
  id: string
  title: string
  date: string
  status: DocumentStatus
  summary: string
  href?: string
}

interface AmendmentHistoryProps {
  documentTitle: string
  amendments: Amendment[]
  showTimeline?: boolean
}

export function AmendmentHistory({
  documentTitle,
  amendments,
  showTimeline = true,
}: AmendmentHistoryProps): React.ReactElement {
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <Card.Header>
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">📜</span>
          <Card.Title>Amendment History</Card.Title>
        </div>
        <p className="mt-1 text-sm text-ash">
          Tracking changes to: {documentTitle}
        </p>
      </Card.Header>

      {/* Amendment List */}
      <Card.Content>
        <div className={cn('divide-y', tokens.borders.subtle)}>
          {amendments.length === 0 ? (
            <div className={cn('px-4 py-6 text-center text-ash')}>
              No amendments recorded
            </div>
          ) : (
            amendments.map((amendment, index) => (
              <div key={amendment.id} className="relative flex gap-4 px-4 py-4">
                {/* Timeline */}
                {showTimeline && (
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border-2',
                      'bg-gold/20 border-gold text-gold text-sm font-bold'
                    )}>
                      {amendments.length - index}
                    </div>
                    {index < amendments.length - 1 && (
                      <div className={cn('mt-2 h-full w-0.5 bg-charcoal/30')} />
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {amendment.href ? (
                        <Link href={amendment.href} variant="primary" className="font-medium">
                          {amendment.title}
                        </Link>
                      ) : (
                        <span className="font-medium text-parchment">
                          {amendment.title}
                        </span>
                      )}
                      <p className="mt-0.5 text-xs text-ash">
                        {amendment.id} • {amendment.date}
                      </p>
                    </div>
                    <StatusBadge status={amendment.status} size="sm" />
                  </div>
                  <p className="mt-2 text-sm text-ash">{amendment.summary}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card.Content>

      {/* Footer */}
      {amendments.length > 0 && (
        <Card.Footer>
          <p className="text-sm text-ash">
            Total Amendments: {amendments.length}
          </p>
        </Card.Footer>
      )}
    </Card>
  )
}

export default AmendmentHistory
