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

'use client'

import { Card } from '@mythic/design-system'
import { cn } from '@mythic/shared-utils'
import { useState, useEffect, useCallback, memo } from 'react'
import dynamic from 'next/dynamic'
import { getStencil } from '@/src/codex'
import { CodexStencilViewer } from './CodexStencilViewer'
import { LoadingState } from './LoadingState'
import { ErrorState } from './ErrorState'
import { EmptyState } from './EmptyState'
import type { Proposal } from '@mythic/shared-types/boardroom'
import type { StencilDefinition } from '@/src/codex'

interface StrategyDrawerProps {
  proposal: Proposal | null
  className?: string
}

type TabId = 'trace' | 'dialog' | 'codex' | 'todos'

export const StrategyDrawer = memo(function StrategyDrawer({ proposal, className }: StrategyDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabId>('trace')

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
    <div className={cn('flex flex-col h-full', className)}>
      {/* Tabs */}
      <div className="flex border-b border-obsidian mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'px-6 py-3 text-sm font-medium transition-all duration-1200 border-b-2',
              activeTab === tab.id
                ? 'border-gold text-parchment'
                : 'border-transparent text-ash hover:text-parchment'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'trace' && <ThanosTrace proposal={proposal} />}
        {activeTab === 'dialog' && <BoardDialog proposal={proposal} />}
        {activeTab === 'codex' && <Codex proposal={proposal} />}
        {activeTab === 'todos' && <LinkedTodos proposal={proposal} />}
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Only re-render if proposal changes
  return prevProps.proposal?.id === nextProps.proposal?.id
})

const tabs: { id: TabId; label: string }[] = [
  { id: 'trace', label: 'The Thanos Trace' },
  { id: 'dialog', label: 'The BoardDialog' },
  { id: 'codex', label: 'The Codex' },
  { id: 'todos', label: 'Linked To-Dos' },
]

function ThanosTrace({ proposal }: { proposal: Proposal }) {
  return (
    <div className="space-y-4">
      <Card elevation="sm" className="p-4">
        <h3 className="text-gold font-serif mb-4">Past Vector (Forensic)</h3>
        <div className="space-y-2 text-sm">
          <div className="text-ash">
            Proposal submitted {new Date(proposal.created_at).toLocaleString()}
          </div>
          <div className="text-ash">
            Last updated {new Date(proposal.updated_at).toLocaleString()}
          </div>
          <div className="text-ash text-xs mt-2 italic">
            Version history feature coming soon
          </div>
        </div>
      </Card>

      <Card elevation="sm" className="p-4">
        <h3 className="text-gold font-serif mb-4">Present Vector (Pulse)</h3>
        <div className="space-y-2 text-sm text-ash">
          <div>Real-time viewers: Not available</div>
          <div>Last activity: {new Date(proposal.updated_at).toLocaleString()}</div>
          <div className="text-xs mt-2 italic">
            WebSocket real-time updates coming soon
          </div>
        </div>
      </Card>

      <Card elevation="sm" className="p-4">
        <h3 className="text-gold font-serif mb-4">Future Vector (Prediction)</h3>
        <div className="space-y-2 text-sm text-ash">
          <div>Calculated impact: Not available</div>
          <div>Risk Score: MEDIUM</div>
          <div>Affected downstream systems: 3</div>
          <div className="text-xs mt-2 italic">
            Impact analysis feature coming soon
          </div>
        </div>
      </Card>
    </div>
  )
}

function BoardDialog({ proposal }: { proposal: Proposal }) {
  return (
    <div className="space-y-4">
      <Card elevation="sm" className="p-4">
        <div className="text-ash text-sm mb-4">Comment thread for proposal discussion</div>
        <div className="space-y-3">
          <EmptyState
            title="No comments yet"
            description="Start the conversation by adding the first comment"
            variant="info"
            className="p-4"
          />
        </div>
      </Card>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 bg-obsidian border border-charcoal rounded-xs px-4 py-2 text-parchment placeholder-ash focus:outline-hidden focus:border-gold transition-all duration-1200"
          disabled
          aria-label="Comment input (coming soon)"
        />
        <button
          className="px-6 py-2 bg-gold text-void rounded-xs font-mono text-sm hover:bg-ember transition-all duration-1618 disabled:opacity-50"
          disabled
          aria-label="Post comment (coming soon)"
        >
          POST
        </button>
      </div>
      <div className="text-xs text-ash italic">
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
        const loadedStencil = await getStencil(proposal.stencil_id)
        setStencil(loadedStencil)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load stencil'))
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
    <div className="space-y-4">
      <Card elevation="sm" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gold font-serif">Linked To-Dos</h3>
          <button
            className="px-4 py-2 bg-gold text-void rounded-xs text-sm font-mono hover:bg-ember transition-all duration-1618 disabled:opacity-50"
            disabled
            aria-label="Create to-do (coming soon)"
          >
            + Create To-Do
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <EmptyState
            title="No to-dos linked"
            description="Link to-dos to track action items for this proposal"
            variant="info"
            className="p-4"
          />
          <div className="text-xs text-ash italic mt-2">
            To-do integration coming soon
          </div>
        </div>
      </Card>
    </div>
  )
}
