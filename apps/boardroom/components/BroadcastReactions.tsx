/**
 * Broadcast Reactions Component
 *
 * Displays and manages emoji reactions for broadcast announcements.
 */

"use client"

import { Card } from "@mythic/tailwindcss-v4-design-system"
import { cn } from "@mythic/nextjs-shared-utils"
import { useState, useEffect, useCallback, memo } from "react"
import {
  getBroadcastReactions,
  toggleBroadcastReaction,
  type ReactionData,
} from "@/app/actions/broadcast-reactions"
import { getCurrentUserIdAction } from "@/app/actions/session"

interface BroadcastReactionsProps {
  broadcastId: string
  className?: string
}

const EMOJI_OPTIONS = ["👍", "❤️", "🎉", "👏", "🔥", "💯"] as const

export const BroadcastReactions = memo(function BroadcastReactions({
  broadcastId,
  className,
}: BroadcastReactionsProps) {
  const [reactions, setReactions] = useState<ReactionData[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null) // Emoji being toggled

  // Load reactions
  useEffect(() => {
    async function loadReactions() {
      try {
        setLoading(true)
        const currentUserId = await getCurrentUserIdAction()
        setUserId(currentUserId)

        const result = await getBroadcastReactions({ broadcastId })
        if (result.reactions) {
          setReactions(result.reactions)
        }
      } catch (error) {
        console.error("Error loading reactions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReactions()
  }, [broadcastId])

  // Reload reactions
  const reloadReactions = useCallback(async () => {
    try {
      const result = await getBroadcastReactions({ broadcastId })
      if (result.reactions) {
        setReactions(result.reactions)
      }
    } catch (error) {
      console.error("Error reloading reactions:", error)
    }
  }, [broadcastId])

  // Toggle reaction
  const handleToggleReaction = useCallback(
    async (emoji: string) => {
      if (!userId || toggling) return

      setToggling(emoji)
      try {
        const result = await toggleBroadcastReaction({
          broadcastId,
          userId,
          emoji,
        })

        if (result.success) {
          await reloadReactions()
        }
      } catch (error) {
        console.error("Error toggling reaction:", error)
      } finally {
        setToggling(null)
      }
    },
    [broadcastId, userId, toggling, reloadReactions]
  )

  // Check if user has reacted with emoji
  const hasUserReacted = useCallback(
    (emoji: string): boolean => {
      if (!userId) return false
      const reaction = reactions.find((r) => r.emoji === emoji)
      return reaction ? reaction.users.includes(userId) : false
    },
    [userId, reactions]
  )

  if (loading) {
    return (
      <Card elevation="sm" className={cn("p-2", className)}>
        <div className="text-ash text-xs">Loading reactions...</div>
      </Card>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Reaction buttons */}
      {EMOJI_OPTIONS.map((emoji) => {
        const reaction = reactions.find((r) => r.emoji === emoji)
        const count = reaction?.count || 0
        const isActive = hasUserReacted(emoji)
        const isToggling = toggling === emoji

        return (
          <button
            key={emoji}
            onClick={() => handleToggleReaction(emoji)}
            disabled={!userId || isToggling}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-xs border transition-hover-intelligent",
              isActive
                ? "border-gold bg-obsidian text-gold"
                : "border-charcoal hover:border-gold text-ash",
              isToggling && "opacity-50 cursor-wait"
            )}
            aria-label={`React with ${emoji}`}
          >
            <span className="text-base">{emoji}</span>
            {count > 0 && <span className="text-xs font-mono">{count}</span>}
          </button>
        )
      })}

      {/* Show additional reactions not in default list */}
      {reactions
        .filter((r) => !EMOJI_OPTIONS.includes(r.emoji as (typeof EMOJI_OPTIONS)[number]))
        .map((reaction) => {
          const isActive = hasUserReacted(reaction.emoji)
          const isToggling = toggling === reaction.emoji

          return (
            <button
              key={reaction.emoji}
              onClick={() => handleToggleReaction(reaction.emoji)}
              disabled={!userId || isToggling}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-xs border transition-hover-intelligent",
                isActive
                  ? "border-gold bg-obsidian text-gold"
                  : "border-charcoal hover:border-gold text-ash",
                isToggling && "opacity-50 cursor-wait"
              )}
              aria-label={`React with ${reaction.emoji}`}
            >
              <span className="text-base">{reaction.emoji}</span>
              <span className="text-xs font-mono">{reaction.count}</span>
            </button>
          )
        })}
    </div>
  )
})
