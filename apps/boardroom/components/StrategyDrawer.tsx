/**
 * Strategy Drawer Component
 *
 * Right Panel (40% of viewport) with 4 tabs:
 * 1. The Thanos Trace (Default) - Past/Present/Future vectors
 * 2. The BoardDialog - Chat/Collaboration
 * 3. The Codex - Schema Definition
 * 4. Linked To-Dos - Decision Enablement
 *
 * @see PRD Section 4.1.2
 */

"use client"

import { Card } from "@mythic/tailwindcss-v4-design-system"
import {
  cn,
  intelligentRiskStyles,
  intelligentStatusStyles,
  calculateRiskStatus,
} from "@mythic/nextjs-shared-utils"
import {
  spacing,
  typography,
  tokens,
  buttons,
  borders,
  transitions,
  margins,
  alignment,
  layout,
} from "@/src/lib"
import { useState, useEffect, useCallback, memo, useMemo } from "react"
import dynamic from "next/dynamic"
import { getStencil } from "@/app/actions/stencils"
import { getVarianceData, type VarianceData } from "@/app/actions/variance"
import { CodexStencilViewer } from "./CodexStencilViewer"
import { LoadingState } from "./LoadingState"
import { ErrorState } from "./ErrorState"
import { EmptyState } from "./EmptyState"
import type { Proposal } from "@mythic/shared-types/boardroom"
import type { StencilDefinition } from "@/src/codex"

interface StrategyDrawerProps {
  proposal: Proposal | null
  className?: string
}

type TabId = "trace" | "dialog" | "codex" | "todos"

export const StrategyDrawer = memo(
  function StrategyDrawer({ proposal, className }: StrategyDrawerProps) {
    const [activeTab, setActiveTab] = useState<TabId>("trace")

    // Memoize tab change handler
    const handleTabChange = useCallback((tabId: TabId) => {
      setActiveTab(tabId)
    }, [])

    if (!proposal) {
      return (
        <EmptyState
          title="Select a proposal"
          description="Choose a proposal from the Pool Table to view details"
          className={className}
        />
      )
    }

    return (
      <div className={cn("flex flex-col h-full", className)}>
        {/* Tabs */}
        <div className="flex border-b border-obsidian mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2",
                transitions.default,
                activeTab === tab.id
                  ? cn(borders.accent, tokens.text.primary)
                  : "border-transparent text-ash hover:text-parchment"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "trace" && <ThanosTrace proposal={proposal} />}
          {activeTab === "dialog" && <BoardDialog proposal={proposal} />}
          {activeTab === "codex" && <Codex proposal={proposal} />}
          {activeTab === "todos" && <LinkedTodos proposal={proposal} />}
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Only re-render if proposal changes
    return prevProps.proposal?.id === nextProps.proposal?.id
  }
)

const tabs: { id: TabId; label: string }[] = [
  { id: "trace", label: "The Thanos Trace" },
  { id: "dialog", label: "The BoardDialog" },
  { id: "codex", label: "The Codex" },
  { id: "todos", label: "Linked To-Dos" },
]

function ThanosTrace({ proposal }: { proposal: Proposal }) {
  const [varianceData, setVarianceData] = useState<VarianceData | null>(null)
  const [varianceLoading, setVarianceLoading] = useState(true)
  const [varianceError, setVarianceError] = useState<Error | null>(null)

  // Fetch variance data
  useEffect(() => {
    async function loadVarianceData() {
      try {
        setVarianceLoading(true)
        setVarianceError(null)
        const data = await getVarianceData({ proposalId: proposal.id })
        setVarianceData(data)
      } catch (err) {
        setVarianceError(err instanceof Error ? err : new Error("Failed to load variance data"))
      } finally {
        setVarianceLoading(false)
      }
    }

    loadVarianceData()
  }, [proposal.id])

  // Calculate variance percentage from real data or fallback to mock
  const variancePct = useMemo(() => {
    if (varianceData?.variancePct !== null && varianceData?.variancePct !== undefined) {
      return varianceData.variancePct
    }
    // Fallback: try to extract from proposal data if no variance record exists
    if (typeof proposal.data === "object" && proposal.data !== null) {
      const data = proposal.data as Record<string, unknown>
      if (typeof data.amount === "number" && typeof data.budgeted === "number") {
        const budgeted = data.budgeted as number
        const actual = data.amount as number
        if (budgeted > 0) {
          return ((actual - budgeted) / budgeted) * 100
        }
      }
    }
    return null // No variance data available
  }, [varianceData, proposal.data])

  // Calculate risk status from variance
  const riskStatus = useMemo(() => {
    if (variancePct === null) return "on_track" // Default if no data
    return calculateRiskStatus(variancePct)
  }, [variancePct])

  return (
    <div className={spacing.space.md}>
      {/* Past Vector - Forensic History */}
      <Card
        elevation="sm"
        className={intelligentRiskStyles("on_track", "past", cn(spacing.card, borders.left))}
      >
        <h3 className={cn(tokens.text.accent, typography.heading.sm, margins.bottom.md)}>
          📋 Past Vector (Forensic)
        </h3>
        <div className={cn(spacing.space.sm, typography.body.md)}>
          <div className={tokens.text.secondary}>
            Proposal submitted {new Date(proposal.created_at).toLocaleString()}
          </div>
          <div className={tokens.text.secondary}>
            Last updated {new Date(proposal.updated_at).toLocaleString()}
          </div>
          <div className={cn(tokens.text.secondary, typography.body.sm, margins.top.sm, "italic")}>
            Version history feature coming soon
          </div>
        </div>
      </Card>

      {/* Present Vector - Real-Time Pulse */}
      <Card
        elevation="sm"
        className={intelligentRiskStyles("on_track", "present", cn(spacing.card, borders.left))}
      >
        <h3 className={cn(tokens.text.accent, typography.heading.sm, margins.bottom.md)}>
          📊 Present Vector (Pulse)
        </h3>
        <div className={cn(spacing.space.sm, typography.body.md, tokens.text.secondary)}>
          <div>Real-time viewers: Not available</div>
          <div>Last activity: {new Date(proposal.updated_at).toLocaleString()}</div>
          <div className={cn(typography.body.sm, margins.top.sm, "italic")}>
            WebSocket real-time updates coming soon
          </div>
        </div>
      </Card>

      {/* Future Vector - Risk Prediction (Intelligence-Driven) */}
      <Card
        elevation="sm"
        className={intelligentRiskStyles(
          variancePct !== null ? variancePct : "on_track",
          "future",
          cn(spacing.card, borders.left)
        )}
      >
        <h3 className={cn(tokens.text.accent, typography.heading.sm, margins.bottom.md)}>
          🎯 Future Vector (Prediction)
        </h3>
        {varianceLoading ? (
          <LoadingState message="Loading variance analysis..." size="sm" />
        ) : varianceError ? (
          <div className={cn(typography.body.md, tokens.text.secondary)}>
            <div className={tokens.text.warning}>Error loading variance data</div>
            <div className={cn(typography.body.sm, margins.top.sm, "italic")}>
              {varianceError.message}
            </div>
          </div>
        ) : varianceData ? (
          <div className={cn(spacing.space.sm, typography.body.md)}>
            {varianceData.budgeted > 0 && (
              <div className={tokens.text.secondary}>
                Budgeted: ${varianceData.budgeted.toLocaleString()}
              </div>
            )}
            {varianceData.planned !== null && (
              <div className={tokens.text.secondary}>
                Planned: ${varianceData.planned.toLocaleString()}
              </div>
            )}
            {varianceData.actual !== null && (
              <div className={tokens.text.secondary}>
                Actual: ${varianceData.actual.toLocaleString()}
              </div>
            )}
            {variancePct !== null && (
              <div className={cn(layout.flexCenter, spacing.gap.sm, margins.top.sm)}>
                <span className={tokens.text.secondary}>Risk Score:</span>
                <span className={intelligentRiskStyles(riskStatus, "future", buttons.badge)}>
                  {riskStatus.toUpperCase().replace("_", " ")}
                </span>
                <span className={intelligentRiskStyles(variancePct, "future", typography.mono.sm)}>
                  ({variancePct > 0 ? "+" : ""}
                  {variancePct.toFixed(1)}%)
                </span>
              </div>
            )}
            {varianceData.varianceReason && (
              <div
                className={cn(typography.body.sm, tokens.text.secondary, margins.top.sm, "italic")}
              >
                Reason: {varianceData.varianceReason}
              </div>
            )}
            {varianceData.milestones.length > 0 && (
              <div className={cn(typography.body.sm, tokens.text.secondary, margins.top.sm)}>
                Milestones: {varianceData.milestones.length} review(s)
              </div>
            )}
          </div>
        ) : (
          <div className={cn(spacing.space.sm, typography.body.md, tokens.text.secondary)}>
            <div>No variance data available</div>
            <div className={cn(typography.body.sm, margins.top.sm, "italic")}>
              Variance tracking will be available once budget data is recorded
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

function BoardDialog({ proposal }: { proposal: Proposal }) {
  return (
    <div className={spacing.space.md}>
      <Card elevation="sm" className={spacing.card}>
        <div className={cn(typography.body.md, tokens.text.secondary, margins.bottom.md)}>
          Comment thread for proposal discussion
        </div>
        <div className={spacing.space.sm}>
          <EmptyState
            title="No comments yet"
            description="Start the conversation by adding the first comment"
            variant="info"
            className={spacing.card}
          />
        </div>
      </Card>

      <div className={cn(layout.flexCenter, spacing.gap.sm)}>
        <input
          type="text"
          placeholder="Add a comment..."
          className={inputs.default}
          disabled
          aria-label="Comment input (coming soon)"
        />
        <button className={buttons.primary} disabled aria-label="Post comment (coming soon)">
          POST
        </button>
      </div>
      <div className={cn(typography.body.sm, tokens.text.secondary, "italic")}>
        Commenting feature coming soon
      </div>
    </div>
  )
}

function Codex({ proposal }: { proposal: Proposal }) {
  const [stencil, setStencil] = useState<StencilDefinition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadStencil() {
      try {
        setLoading(true)
        setError(null)
        const loadedStencil = await getStencil({ stencilId: proposal.stencil_id })
        setStencil(loadedStencil)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load stencil"))
      } finally {
        setLoading(false)
      }
    }

    if (proposal.stencil_id) {
      loadStencil()
    } else {
      setLoading(false)
    }
  }, [proposal.stencil_id])

  if (loading) {
    return (
      <Card elevation="sm" className="p-4">
        <LoadingState message="Loading stencil definition..." size="sm" />
      </Card>
    )
  }

  if (error) {
    return (
      <Card elevation="sm" className="p-4">
        <ErrorState
          title="Failed to load stencil"
          message={error.message}
          onRetry={() => window.location.reload()}
        />
      </Card>
    )
  }

  if (!stencil) {
    return (
      <Card elevation="sm" className="p-4">
        <EmptyState
          title="Stencil not found"
          description={`Stencil ID: ${proposal.stencil_id}`}
          variant="warning"
        />
      </Card>
    )
  }

  return (
    <Card elevation="sm" className="p-4">
      <CodexStencilViewer stencil={stencil} />
    </Card>
  )
}

function LinkedTodos({ proposal }: { proposal: Proposal }) {
  return (
    <div className={spacing.space.md}>
      <Card elevation="sm" className={spacing.card}>
        <div className={cn(layout.flexBetween, margins.bottom.md)}>
          <h3 className={cn(tokens.text.accent, typography.heading.sm)}>Linked To-Dos</h3>
          <button className={buttons.small} disabled aria-label="Create to-do (coming soon)">
            + Create To-Do
          </button>
        </div>
        <div className={cn(spacing.space.sm, typography.body.md)}>
          <EmptyState
            title="No to-dos linked"
            description="Link to-dos to track action items for this proposal"
            variant="info"
            className={spacing.card}
          />
          <div className={cn(typography.body.sm, tokens.text.secondary, "italic mt-2")}>
            To-do integration coming soon
          </div>
        </div>
      </Card>
    </div>
  )
}
