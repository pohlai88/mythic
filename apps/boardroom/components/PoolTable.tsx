/**
 * Pool Table Component
 *
 * The Pool Table is a live operational dashboard (60% of viewport)
 * Combines proposal visibility with decision velocity metrics
 *
 * @see PRD Section 4.1.1
 */

'use client'

import { Card } from '@mythic/design-system'
import { cn } from '@mythic/shared-utils'
import { useMemo, memo, useCallback } from 'react'
import { EmptyState } from './EmptyState'
import type { Proposal } from '@mythic/shared-types/boardroom'

interface PoolTableProps {
  proposals: Proposal[]
  selectedProposalId?: string
  onSelectProposal: (proposalId: string) => void
  className?: string
}

interface DashboardMetrics {
  totalPending: number
  awaitingYourVote: number
  avgDecisionTime: number // days
  thisWeekApprovals: number
  atRiskProposals: number
}

export function PoolTable({
  proposals,
  selectedProposalId,
  onSelectProposal,
  className,
}: PoolTableProps) {
  // Calculate dashboard metrics with memoization (synchronous calculation)
  const metrics = useMemo(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const slaThreshold = 48 * 60 * 60 * 1000 // 48 hours

    // Calculate average decision time
    const approvedProposals = proposals.filter(
      (p) => p.status === 'APPROVED' && p.approved_at && p.created_at
    )
    let avgDecisionTime = 0
    if (approvedProposals.length > 0) {
      const totalTime = approvedProposals.reduce((sum, p) => {
        const decisionTime =
          new Date(p.approved_at!).getTime() - new Date(p.created_at).getTime()
        return sum + decisionTime
      }, 0)
      const avgMs = totalTime / approvedProposals.length
      avgDecisionTime = Math.round((avgMs / (24 * 60 * 60 * 1000)) * 10) / 10
    }

    return {
      totalPending: proposals.filter((p) => p.status === 'LISTENING').length,
      awaitingYourVote: proposals.filter((p) => p.status === 'LISTENING').length, // Will be filtered by user in server component
      avgDecisionTime,
      thisWeekApprovals: proposals.filter(
        (p) =>
          p.status === 'APPROVED' &&
          p.approved_at &&
          new Date(p.approved_at) >= weekAgo
      ).length,
      atRiskProposals: proposals.filter((p) => {
        if (p.status !== 'LISTENING') return false
        const timeSinceSubmission = now.getTime() - new Date(p.created_at).getTime()
        return timeSinceSubmission > slaThreshold
      }).length,
    }
  }, [proposals])

  // Handle empty state
  if (proposals.length === 0) {
    return (
      <EmptyState
        title="No proposals found"
        description="Create your first proposal to get started"
        className={className}
      />
    )
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Dashboard Metrics Header */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <MetricCard label="Total Pending" value={metrics.totalPending} />
        <MetricCard label="Awaiting Your Vote" value={metrics.awaitingYourVote} />
        <MetricCard label="Avg Decision Time" value={`${metrics.avgDecisionTime}d`} />
        <MetricCard label="This Week's Approvals" value={metrics.thisWeekApprovals} />
        <MetricCard label="At-Risk Proposals" value={metrics.atRiskProposals} variant="warning" />
      </div>

      {/* Proposal List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {proposals.map((proposal) => (
            <ProposalRow
              key={proposal.id}
              proposal={proposal}
              isSelected={proposal.id === selectedProposalId}
              onSelect={onSelectProposal}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const MetricCard = memo(function MetricCard({
  label,
  value,
  variant = 'default',
}: {
  label: string
  value: string | number
  variant?: 'default' | 'warning'
}) {
  return (
    <Card elevation="sm" className="p-3" hover={false}>
      <div className="text-ash text-sm mb-1">{label}</div>
      <div
        className={cn(
          'text-2xl font-mono',
          variant === 'warning' ? 'text-ember' : 'text-parchment'
        )}
      >
        {value}
      </div>
    </Card>
  )
})

const ProposalRow = memo(function ProposalRow({
  proposal,
  isSelected,
  onSelect,
}: {
  proposal: Proposal
  isSelected: boolean
  onSelect: (proposalId: string) => void
}) {
  const statusColors = {
    DRAFT: 'text-ash',
    LISTENING: 'text-gold',
    APPROVED: 'text-success',
    VETOED: 'text-ember',
    ARCHIVED: 'text-ash opacity-50',
  }

  const handleClick = useCallback(() => {
    onSelect(proposal.id)
  }, [proposal.id, onSelect])

  // Extract title once
  const title = useMemo(() => {
    if (typeof proposal.data === 'object' && proposal.data !== null) {
      return (proposal.data as { title?: string }).title || 'Untitled Proposal'
    }
    return 'Untitled Proposal'
  }, [proposal.data])

  // Format date once
  const formattedDate = useMemo(() => {
    return new Date(proposal.created_at).toLocaleDateString()
  }, [proposal.created_at])

  return (
    <Card
      elevation={isSelected ? 'md' : 'sm'}
      className={cn(
        'p-4 cursor-pointer transition-all duration-1200',
        isSelected && 'border-gold'
      )}
      hover
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm text-ash">{proposal.case_number}</span>
            <span
              className={cn(
                'text-xs font-medium px-2 py-1 rounded-xs',
                statusColors[proposal.status]
              )}
            >
              {proposal.status}
            </span>
          </div>
          <div className="text-parchment font-serif">{title}</div>
        </div>
        <div className="text-right">
          <div className="text-ash text-sm">{formattedDate}</div>
        </div>
      </div>
    </Card>
  )
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if proposal data or selection changed
  return (
    prevProps.proposal.id === nextProps.proposal.id &&
    prevProps.proposal.status === nextProps.proposal.status &&
    prevProps.proposal.data === nextProps.proposal.data &&
    prevProps.proposal.created_at === nextProps.proposal.created_at &&
    prevProps.isSelected === nextProps.isSelected
  )
})
