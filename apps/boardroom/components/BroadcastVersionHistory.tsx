/**
 * Broadcast Version History Component
 *
 * Displays version history for broadcast announcements.
 * Shows change tracking and audit trail.
 */

'use client'

import { Card } from '@mythic/design-system'
import { cn } from '@mythic/shared-utils'
import { badges } from '@/src/lib'
import { useState, useEffect, memo } from 'react'
import {
  getBroadcastVersions,
  type BroadcastVersionData,
} from '@/app/actions/broadcast-versions'

interface BroadcastVersionHistoryProps {
  broadcastId: string
  className?: string
}

export const BroadcastVersionHistory = memo(function BroadcastVersionHistory({
  broadcastId,
  className,
}: BroadcastVersionHistoryProps) {
  const [versions, setVersions] = useState<BroadcastVersionData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)

  useEffect(() => {
    async function loadVersions() {
      try {
        setLoading(true)
        const result = await getBroadcastVersions({ broadcastId })
        if (result.versions) {
          setVersions(result.versions)
          // Select latest version by default
          if (result.versions.length > 0) {
            setSelectedVersion(result.versions[0].versionNumber)
          }
        }
      } catch (error) {
        console.error('Error loading versions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVersions()
  }, [broadcastId])

  if (loading) {
    return (
      <Card elevation="sm" className={cn('p-4', className)}>
        <div className="text-ash text-sm">Loading version history...</div>
      </Card>
    )
  }

  if (versions.length === 0) {
    return (
      <Card elevation="sm" className={cn('p-4', className)}>
        <div className="text-ash text-sm">No version history available.</div>
      </Card>
    )
  }

  const selectedVersionData = versions.find((v) => v.versionNumber === selectedVersion)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-parchment">Version History</h3>
        <span className="text-sm text-ash">{versions.length} version(s)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Version list */}
        <Card elevation="sm" className="p-4">
          <h4 className="text-sm font-mono text-gold mb-3">Versions</h4>
          <div className="space-y-2">
            {versions.map((version) => (
              <button
                key={version.id}
                onClick={() => setSelectedVersion(version.versionNumber)}
                className={cn(
                  'w-full text-left p-3 rounded-xs border transition-hover-intelligent',
                  selectedVersion === version.versionNumber
                    ? 'border-gold bg-obsidian'
                    : 'border-charcoal hover:border-gold'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-mono text-parchment">
                    v{version.versionNumber}
                  </span>
                  <span className="text-xs text-ash">
                    {new Date(version.changedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-ash">
                  Changed by: User {version.changedBy.slice(0, 8)}
                </div>
                {version.changeReason && (
                  <div className="text-xs text-ash mt-1 italic">
                    {version.changeReason}
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Version details */}
        {selectedVersionData && (
          <Card elevation="sm" className="p-4">
            <h4 className="text-sm font-mono text-gold mb-3">
              Version {selectedVersionData.versionNumber} Details
            </h4>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-ash mb-1">Title</div>
                <div className="text-sm text-parchment">{selectedVersionData.title}</div>
              </div>
              {selectedVersionData.message && (
                <div>
                  <div className="text-xs text-ash mb-1">Message</div>
                  <div className="text-sm text-parchment whitespace-pre-wrap">
                    {selectedVersionData.message}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs text-ash mb-1">Audience</div>
                <div className="text-sm text-parchment font-mono">
                  {selectedVersionData.audience}
                </div>
              </div>
              <div>
                <div className="text-xs text-ash mb-1">Type</div>
                <div className="text-sm text-parchment">{selectedVersionData.type}</div>
              </div>
              {selectedVersionData.priority && (
                <div>
                  <div className="text-xs text-ash mb-1">Priority</div>
                  <div className="text-sm text-parchment">{selectedVersionData.priority}</div>
                </div>
              )}
              {selectedVersionData.categories && selectedVersionData.categories.length > 0 && (
                <div>
                  <div className="text-xs text-ash mb-1">Categories</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedVersionData.categories.map((cat) => (
                      <span
                        key={cat}
                        className={badges.category}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedVersionData.tags && selectedVersionData.tags.length > 0 && (
                <div>
                  <div className="text-xs text-ash mb-1">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedVersionData.tags.map((tag) => (
                      <span
                        key={tag}
                        className={badges.category}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs text-ash mb-1">Changed At</div>
                <div className="text-sm text-parchment">
                  {new Date(selectedVersionData.changedAt).toLocaleString()}
                </div>
              </div>
              {selectedVersionData.changeReason && (
                <div>
                  <div className="text-xs text-ash mb-1">Change Reason</div>
                  <div className="text-sm text-parchment italic">
                    {selectedVersionData.changeReason}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
})
