/**
 * Broadcast Banner Component (The Herald - Weapon 9)
 *
 * Displays sticky banner announcements with intelligence-driven styling.
 * Shows unread broadcasts at the top of the page.
 *
 * @see PRD Section 4.3 Weapon 9: The Herald
 */

'use client'

import { Card } from '@mythic/design-system'
import { cn, intelligentStatusStyles } from '@mythic/shared-utils'
import { badges } from '@/src/lib'
import { useState, useEffect, useCallback, memo } from 'react'
import { getActiveBroadcasts, markBroadcastRead, type BroadcastData } from '@/app/actions/broadcasts'
import { getCurrentUserIdAction } from '@/app/actions/session'
import { useBroadcastWebSocket } from '@/src/lib/realtime/use-broadcast-websocket'
import { BroadcastComments } from './BroadcastComments'
import { BroadcastReactions } from './BroadcastReactions'

interface BroadcastBannerProps {
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
      return 'VETOED' // Emergency uses warning/error styling
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

export const BroadcastBanner = memo(function BroadcastBanner({
  className,
}: BroadcastBannerProps) {
  const [broadcasts, setBroadcasts] = useState<BroadcastData[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // Load active broadcasts
  useEffect(() => {
    async function loadBroadcasts() {
      try {
        setLoading(true)
        const currentUserId = await getCurrentUserIdAction()
        if (!currentUserId) {
          setLoading(false)
          return
        }

        setUserId(currentUserId)
        // Get user's circles and role for advanced targeting
        // TODO: Fetch from user session/circle memberships
        const activeBroadcasts = await getActiveBroadcasts({
          userId: currentUserId,
          userCircles: [], // Will be populated from user session
          userRole: undefined, // Will be populated from user session
        })
        setBroadcasts(activeBroadcasts)
      } catch (error) {
        console.error('Error loading broadcasts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBroadcasts()
  }, [])

  // WebSocket subscription for real-time updates
  useBroadcastWebSocket({
    userId,
    enabled: !!userId,
    onBroadcastCreated: useCallback((broadcast: BroadcastData) => {
      // Add new broadcast to the list if it matches user's audience
      setBroadcasts((prev) => {
        // Check if broadcast already exists
        if (prev.some((b) => b.id === broadcast.id)) {
          return prev
        }
        // Add to beginning of list
        return [broadcast, ...prev]
      })
    }, []),
    onBroadcastUpdated: useCallback((broadcastId: string, changes: Partial<BroadcastData>) => {
      // Update existing broadcast in the list
      setBroadcasts((prev) =>
        prev.map((b) =>
          b.id === broadcastId ? { ...b, ...changes } : b
        )
      )
    }, []),
    onBroadcastRead: useCallback((broadcastId: string, readUserId: string) => {
      // If current user read it, remove from list
      if (readUserId === userId) {
        setBroadcasts((prev) => prev.filter((b) => b.id !== broadcastId))
      }
    }, [userId]),
  })

  // Mark broadcast as read
  const handleMarkRead = useCallback(
    async (broadcastId: string) => {
      if (!userId) return

      try {
        await markBroadcastRead({ broadcastId, userId })
        // Remove from local state
        setBroadcasts((prev) => prev.filter((b) => b.id !== broadcastId))
      } catch (error) {
        console.error('Error marking broadcast as read:', error)
      }
    },
    [userId]
  )

  // Don't render if no broadcasts
  if (loading || broadcasts.length === 0) {
    return null
  }

  return (
    <div className={cn('sticky top-0 z-40 space-y-2', className)}>
      {broadcasts.map((broadcast) => {
        const status = mapBroadcastTypeToStatus(broadcast.type)
        const icon = getBroadcastIcon(broadcast.type)

        return (
          <Card
            key={broadcast.id}
            elevation="md"
            className={cn(
              'p-4 border-l-4 transition-illuminate',
              intelligentStatusStyles(status, 'border'),
              intelligentStatusStyles(status, 'text')
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
                  {broadcast.priority === 'urgent' && (
                    <span className="text-xs text-ember animate-pulse font-mono">
                      URGENT
                    </span>
                  )}
                  {broadcast.priority === 'high' && (
                    <span className="text-xs text-gold font-mono">
                      HIGH PRIORITY
                    </span>
                  )}
                  {broadcast.categories && broadcast.categories.length > 0 && (
                    <div className="flex gap-1">
                      {broadcast.categories.map((cat) => (
                        <span
                          key={cat}
                          className={badges.category}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
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
                  {broadcast.imageUrl && (
                    <div className="mt-2 mb-2">
                      <img
                        src={broadcast.imageUrl}
                        alt={broadcast.title}
                        className="max-w-full rounded-xs border border-charcoal"
                      />
                    </div>
                  )}
                <div className="flex items-center gap-4 text-xs text-ash">
                  {broadcast.proposalId && (
                    <span className="font-mono">
                      Proposal: {broadcast.caseNumber || broadcast.proposalId.slice(0, 8)}
                    </span>
                  )}
                  <span>
                    {new Date(broadcast.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleMarkRead(broadcast.id)}
                className={intelligentStatusStyles(
                  status,
                  'badge',
                  'px-4 py-2 rounded-xs text-sm font-mono transition-hover-intelligent whitespace-nowrap'
                )}
                aria-label="Mark as read"
              >
                Mark Read
              </button>
            </div>
            {/* Reactions section */}
            <div className="mt-4 border-t border-charcoal pt-4">
              <BroadcastReactions broadcastId={broadcast.id} />
            </div>
            {/* Comments section */}
            <div className="mt-4 border-t border-charcoal pt-4">
              <BroadcastComments broadcastId={broadcast.id} />
            </div>
          </Card>
        )
      })}
    </div>
  )
})
