/**
 * Broadcast History Component
 *
 * Displays paginated history of all broadcasts (read and unread).
 * Includes filtering by type and search functionality.
 */

'use client'

import { Card } from '@mythic/design-system'
import { cn, intelligentStatusStyles, intelligentInputStyles, intelligentButtonStyles } from '@mythic/shared-utils'
import { useState, useEffect, useCallback, memo } from 'react'
import { getBroadcastHistory, type BroadcastData } from '@/app/actions/broadcasts'
import { getCurrentUserIdAction } from '@/app/actions/session'
import { LoadingState } from './LoadingState'
import { EmptyState } from './EmptyState'

interface BroadcastHistoryProps {
  className?: string
}

/**
 * Map broadcast type to proposal status for intelligence-driven styling
 */
function mapBroadcastTypeToStatus(
  type: BroadcastData['type']
): 'DRAFT' | 'LISTENING' | 'APPROVED' | 'VETOED' {
  switch (type) {
    case 'approval':
      return 'APPROVED'
    case 'veto':
      return 'VETOED'
    case 'announcement':
    case 'poll':
      return 'LISTENING'
    case 'emergency':
      return 'VETOED'
    default:
      return 'LISTENING'
  }
}

/**
 * Get icon for broadcast type
 */
function getBroadcastIcon(type: BroadcastData['type']): string {
  switch (type) {
    case 'approval':
      return '✅'
    case 'veto':
      return '❌'
    case 'announcement':
      return '📢'
    case 'poll':
      return '🗳️'
    case 'emergency':
      return '🚨'
    default:
      return '📢'
  }
}

export const BroadcastHistory = memo(function BroadcastHistory({
  className,
}: BroadcastHistoryProps) {
  const [broadcasts, setBroadcasts] = useState<BroadcastData[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [filterType, setFilterType] = useState<BroadcastData['type'] | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const pageSize = 20

  // Load broadcast history
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true)
      const userId = await getCurrentUserIdAction()
      if (!userId) {
        setLoading(false)
        return
      }

      const result = await getBroadcastHistory({
        userId,
        limit: pageSize,
        offset: page * pageSize,
        type: filterType === 'all' ? undefined : filterType,
        search: searchQuery || undefined,
      })

      setBroadcasts(result.broadcasts)
      setTotal(result.total)
    } catch (error) {
      console.error('Error loading broadcast history:', error)
    } finally {
      setLoading(false)
    }
  }, [page, filterType])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // Reset page when search or filter changes
  useEffect(() => {
    setPage(0)
  }, [searchQuery, filterType])

  if (loading && broadcasts.length === 0) {
    return (
      <div className={cn('p-6', className)}>
        <LoadingState message="Loading broadcast history..." />
      </div>
    )
  }

  if (broadcasts.length === 0) {
    return (
      <div className={cn('p-6', className)}>
        <EmptyState
          title="No broadcasts found"
          description="No broadcast announcements have been created yet"
        />
      </div>
    )
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <label className="text-sm text-ash whitespace-nowrap">Filter by type:</label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as BroadcastData['type'] | 'all')
            }}
            className={intelligentInputStyles()}
          >
            <option value="all">All Types</option>
            <option value="approval">Approvals</option>
            <option value="veto">Vetoes</option>
            <option value="announcement">Announcements</option>
            <option value="poll">Polls</option>
            <option value="emergency">Emergencies</option>
          </select>
        </div>
        <div className="flex-1 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search broadcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={intelligentInputStyles('w-full')}
          />
        </div>
      </div>

      {/* Broadcast List */}
      <div className="space-y-3">
        {broadcasts.map((broadcast) => {
          const status = mapBroadcastTypeToStatus(broadcast.type)
          const icon = getBroadcastIcon(broadcast.type)

          return (
            <Card
              key={broadcast.id}
              elevation="sm"
              className={cn(
                'p-4 border-l-4',
                intelligentStatusStyles(status, 'border'),
                intelligentStatusStyles(status, 'text'),
                broadcast.isRead && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{icon}</span>
                    <span
                      className={intelligentStatusStyles(
                        status,
                        'badge',
                        'text-xs font-medium px-2 py-1 rounded-xs'
                      )}
                    >
                      {broadcast.type.toUpperCase()}
                    </span>
                    {broadcast.isRead && (
                      <span className="text-xs text-ash font-mono">READ</span>
                    )}
                    {broadcast.type === 'emergency' && (
                      <span className="text-xs text-ember font-mono">URGENT</span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg mb-1">{broadcast.title}</h3>
                  {broadcast.message && (
                    <div
                      className="text-sm text-ash mb-2 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: broadcast.message.replace(/\n/g, '<br />'),
                      }}
                    />
                  )}
                  <div className="flex items-center gap-4 text-xs text-ash">
                    {broadcast.proposalId && (
                      <span className="font-mono">
                        Proposal: {broadcast.caseNumber || broadcast.proposalId.slice(0, 8)}
                      </span>
                    )}
                    <span>Audience: {broadcast.audience}</span>
                    <span>{new Date(broadcast.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-charcoal">
          <div className="text-sm text-ash">
            Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, total)} of {total}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className={intelligentButtonStyles('secondary', 'md', 'disabled:opacity-50 disabled:cursor-not-allowed')}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className={intelligentButtonStyles('secondary', 'md', 'disabled:opacity-50 disabled:cursor-not-allowed')}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
})
