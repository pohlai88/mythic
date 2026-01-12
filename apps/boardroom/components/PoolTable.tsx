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
import { cn, intelligentStatusStyles, intelligentStyles } from '@mythic/shared-utils'
import { useMemo, memo, useCallback } from 'react'
import { gridCols, spacing, typography, tokens, margins, alignment, layout, buttons } from '@/src/lib'
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
    <div className={cn(layout.flexCol, 'h-full', className)}>
      {/* Dashboard Metrics Header */}
      <div className={cn('grid', gridCols[5], spacing.gap.md, margins.bottom.lg)}>
        <MetricCard label="Total Pending" value={metrics.totalPending} />
        <MetricCard label="Awaiting Your Vote" value={metrics.awaitingYourVote} />
        <MetricCard label="Avg Decision Time" value={`${metrics.avgDecisionTime}d`} />
        <MetricCard label="This Week's Approvals" value={metrics.thisWeekApprovals} />
        <MetricCard label="At-Risk Proposals" value={metrics.atRiskProposals} variant="warning" />
      </div>

      {/* Proposal List */}
      <div className="flex-1 overflow-y-auto">
        <div className={spacing.space.sm}>
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
  // Use intelligence-driven styling for warning variant
  const valueStyles = useMemo(() => {
    if (variant === 'warning') {
      return intelligentStyles({
        isUrgent: true,
        className: cn(typography.mono.lg, tokens.text.warning),
      })
    }
    return cn(typography.mono.lg, tokens.text.primary)
  }, [variant])

  return (
    <Card elevation="sm" className={spacing.cardSmall} hover={false}>
      <div className={cn(typography.body.md, margins.bottom.sm)}>{label}</div>
      <div className={valueStyles}>{value}</div>
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

  // Calculate if proposal is at risk (exceeds SLA threshold)
  const isAtRisk = useMemo(() => {
    if (proposal.status !== 'LISTENING') return false
    const now = new Date()
    const timeSinceSubmission = now.getTime() - new Date(proposal.created_at).getTime()
    const slaThreshold = 48 * 60 * 60 * 1000 // 48 hours
    return timeSinceSubmission > slaThreshold
  }, [proposal.status, proposal.created_at])

  // Use intelligence-driven styling
  const cardStyles = intelligentStyles({
    status: proposal.status,
    isSelected,
    isUrgent: isAtRisk,
    className: cn(spacing.card, 'cursor-pointer transition-illuminate'),
  })

  return (
    <Card
      elevation={isSelected ? 'md' : 'sm'}
      className={cardStyles}
      hover
      onClick={handleClick}
    >
      <div className={layout.flexBetween}>
        <div className="flex-1">
          <div className={cn(layout.flexCenter, spacing.gap.md, margins.bottom.sm)}>
            <span className={cn(typography.mono.md, tokens.text.secondary)}>{proposal.case_number}</span>
            <span
              className={intelligentStatusStyles(proposal.status, 'badge', buttons.badge)}
            >
              {proposal.status}
            </span>
            {isAtRisk && (
              <span className={cn(typography.body.sm, tokens.text.warning, 'animate-pulse')}>⚠️ At Risk</span>
            )}
          </div>
          <div className={cn(tokens.text.primary, typography.heading.sm)}>{title}</div>
        </div>
        <div className={alignment.right}>
          <div className={cn(typography.body.md, tokens.text.secondary)}>{formattedDate}</div>
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
