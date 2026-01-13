/**
 * Broadcast Analytics Component
 *
 * Displays statistics and analytics about broadcasts.
 * Shows read rates, engagement, and activity trends.
 */

"use client"

import { Card } from "@mythic/tailwindcss-v4-design-system"
import { cn, intelligentStatusStyles } from "@mythic/nextjs-shared-utils"
import { useState, useEffect, memo } from "react"
import { getBroadcastAnalytics } from "@/app/actions/broadcasts"
import { LoadingState } from "./LoadingState"
import { ErrorState } from "./ErrorState"

interface BroadcastAnalyticsProps {
  className?: string
}

interface AnalyticsData {
  totalBroadcasts: number
  totalReads: number
  averageReadRate: number
  byType: Record<string, { count: number; reads: number }>
  recentActivity: Array<{ date: string; count: number }>
}

export const BroadcastAnalytics = memo(function BroadcastAnalytics({
  className,
}: BroadcastAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true)
        setError(null)
        const data = await getBroadcastAnalytics()
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load analytics"))
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className={cn("p-6", className)}>
        <LoadingState message="Loading analytics..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("p-6", className)}>
        <ErrorState title="Failed to load analytics" message={error.message} />
      </div>
    )
  }

  if (!analytics) {
    return null
  }

  const typeLabels: Record<string, string> = {
    approval: "Approvals",
    veto: "Vetoes",
    announcement: "Announcements",
    poll: "Polls",
    emergency: "Emergencies",
  }

  const typeIcons: Record<string, string> = {
    approval: "✅",
    veto: "❌",
    announcement: "📢",
    poll: "🗳️",
    emergency: "🚨",
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <Card elevation="sm" className="p-4">
          <div className="text-ash text-sm mb-1">Total Broadcasts</div>
          <div className="text-2xl font-mono text-parchment">{analytics.totalBroadcasts}</div>
        </Card>
        <Card elevation="sm" className="p-4">
          <div className="text-ash text-sm mb-1">Total Reads</div>
          <div className="text-2xl font-mono text-parchment">{analytics.totalReads}</div>
        </Card>
        <Card elevation="sm" className="p-4">
          <div className="text-ash text-sm mb-1">Average Read Rate</div>
          <div className="text-2xl font-mono text-parchment">{analytics.averageReadRate}%</div>
        </Card>
      </div>

      {/* By Type */}
      <Card elevation="sm" className="p-4">
        <h3 className="text-gold font-serif text-lg mb-4">Broadcasts by Type</h3>
        <div className="space-y-3">
          {Object.entries(analytics.byType).map(([type, stats]) => {
            const readRate = stats.count > 0 ? (stats.reads / stats.count) * 100 : 0
            const status =
              type === "approval"
                ? "APPROVED"
                : type === "veto" || type === "emergency"
                  ? "VETOED"
                  : "LISTENING"

            return (
              <div
                key={type}
                className="flex items-center justify-between p-3 border border-charcoal rounded-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{typeIcons[type] || "📢"}</span>
                  <div>
                    <div className="font-serif text-parchment">{typeLabels[type] || type}</div>
                    <div className="text-xs text-ash">
                      {stats.count} broadcast{stats.count !== 1 ? "s" : ""} • {stats.reads} read
                      {stats.reads !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={intelligentStatusStyles(
                      status,
                      "text",
                      "text-lg font-mono font-bold"
                    )}
                  >
                    {Math.round(readRate)}%
                  </div>
                  <div className="text-xs text-ash">read rate</div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      {analytics.recentActivity.length > 0 && (
        <Card elevation="sm" className="p-4">
          <h3 className="text-gold font-serif text-lg mb-4">Recent Activity (Last 30 Days)</h3>
          <div className="space-y-2">
            {analytics.recentActivity.map((activity) => (
              <div
                key={activity.date}
                className="flex items-center justify-between text-sm border-b border-charcoal pb-2 last:border-0"
              >
                <span className="text-ash font-mono">{activity.date}</span>
                <span className="text-parchment font-mono">
                  {activity.count} broadcast{activity.count !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
})
