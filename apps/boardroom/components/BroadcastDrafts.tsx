/**
 * Broadcast Drafts Component
 *
 * Displays and manages draft broadcasts.
 * Allows publishing, editing, and deleting drafts.
 */

"use client"

import { Card } from "@mythic/tailwindcss-v4-design-system"
import { cn, intelligentStatusStyles, intelligentButtonStyles } from "@mythic/nextjs-shared-utils"
import { badges } from "@/src/lib"
import { useState, useEffect, useCallback, memo } from "react"
import { getBroadcastDrafts, publishDraft } from "@/app/actions/broadcast-drafts"
import { getCurrentUserIdAction } from "@/app/actions/session"
import { LoadingState } from "./LoadingState"
import { EmptyState } from "./EmptyState"
import { updateBroadcast, deleteBroadcast } from "@/app/actions/broadcasts"

interface BroadcastDraftsProps {
  className?: string
}

interface Draft {
  id: string
  title: string
  type: string
  createdAt: Date
  updatedAt: Date
}

export const BroadcastDrafts = memo(function BroadcastDrafts({ className }: BroadcastDraftsProps) {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const pageSize = 20

  const loadDrafts = useCallback(async () => {
    try {
      setLoading(true)
      const userId = await getCurrentUserIdAction()
      if (!userId) {
        setLoading(false)
        return
      }

      const result = await getBroadcastDrafts({
        userId,
        limit: pageSize,
        offset: page * pageSize,
      })

      setDrafts(result.drafts)
      setTotal(result.total)
    } catch (error) {
      console.error("Error loading drafts:", error)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    loadDrafts()
  }, [loadDrafts])

  const handlePublish = useCallback(
    async (draftId: string) => {
      try {
        const result = await publishDraft({ broadcastId: draftId, sticky: true })
        if (result.success) {
          // Reload drafts
          loadDrafts()
        }
      } catch (error) {
        console.error("Error publishing draft:", error)
      }
    },
    [loadDrafts]
  )

  const handleDelete = useCallback(
    async (draftId: string) => {
      try {
        const result = await deleteBroadcast({ broadcastId: draftId }, true)
        if (result.success) {
          // Reload drafts
          loadDrafts()
        }
      } catch (error) {
        console.error("Error deleting draft:", error)
      }
    },
    [loadDrafts]
  )

  if (loading && drafts.length === 0) {
    return (
      <div className={cn("p-6", className)}>
        <LoadingState message="Loading drafts..." />
      </div>
    )
  }

  if (drafts.length === 0) {
    return (
      <div className={cn("p-6", className)}>
        <EmptyState title="No drafts" description="You don't have any draft broadcasts yet" />
      </div>
    )
  }

  const totalPages = Math.ceil(total / pageSize)

  const getTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      approval: "✅",
      veto: "❌",
      announcement: "📢",
      poll: "🗳️",
      emergency: "🚨",
    }
    return icons[type] || "📢"
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-gold font-serif text-xl">Draft Broadcasts</h2>
        <div className="text-sm text-ash">
          {total} draft{total !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Draft List */}
      <div className="space-y-3">
        {drafts.map((draft) => (
          <Card key={draft.id} elevation="sm" className="p-4 border-l-4 border-ash">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getTypeIcon(draft.type)}</span>
                  <span className="text-xs text-ash font-mono uppercase">{draft.type}</span>
                  <span className={badges.category}>DRAFT</span>
                </div>
                <h3 className="font-serif text-lg mb-1">{draft.title}</h3>
                <div className="text-xs text-ash">
                  Created: {new Date(draft.createdAt).toLocaleString()}
                  {draft.updatedAt !== draft.createdAt && (
                    <> • Updated: {new Date(draft.updatedAt).toLocaleString()}</>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePublish(draft.id)}
                  className={intelligentStatusStyles(
                    "APPROVED",
                    "badge",
                    "px-4 py-2 rounded-xs text-sm font-mono transition-hover-intelligent"
                  )}
                >
                  Publish
                </button>
                <button
                  onClick={() => handleDelete(draft.id)}
                  className={intelligentStatusStyles(
                    "VETOED",
                    "badge",
                    "px-4 py-2 rounded-xs text-sm font-mono transition-hover-intelligent"
                  )}
                >
                  Delete
                </button>
              </div>
            </div>
          </Card>
        ))}
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
              className={intelligentButtonStyles(
                "secondary",
                "md",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className={intelligentButtonStyles(
                "secondary",
                "md",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
})
