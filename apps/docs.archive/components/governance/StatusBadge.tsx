/**
 * StatusBadge Component
 *
 * Displays status indicators for governance documents using
 * intelligence-driven styling and design system tokens.
 *
 * Statuses:
 * - sealed: Document is immutable and hash-verified
 * - ratified: Document has been formally approved
 * - draft: Document is still being developed
 * - deprecated: Document has been superseded
 */

import type React from 'react'
import { Badge } from '../shared'
import type { ProposalStatus } from '@mythic/shared-utils'

export type DocumentStatus = 'sealed' | 'ratified' | 'draft' | 'deprecated' | 'active'

interface StatusBadgeProps {
  status: DocumentStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

/**
 * Map document status to proposal status for intelligence-driven styling
 */
const statusToProposalStatus: Record<DocumentStatus, ProposalStatus> = {
  sealed: 'APPROVED', // Sealed = approved/immutable
  ratified: 'APPROVED', // Ratified = approved
  draft: 'DRAFT', // Draft = draft
  deprecated: 'ARCHIVED', // Deprecated = archived
  active: 'LISTENING', // Active = listening/in progress
}

const statusIcons: Record<DocumentStatus, string> = {
  sealed: '🔒',
  ratified: '✓',
  draft: '📝',
  deprecated: '⚠️',
  active: '⚡',
}

const statusLabels: Record<DocumentStatus, string> = {
  sealed: 'Sealed',
  ratified: 'Ratified',
  draft: 'Draft',
  deprecated: 'Deprecated',
  active: 'Active',
}

export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
}: StatusBadgeProps): React.ReactElement {
  const proposalStatus = statusToProposalStatus[status]
  const icon = statusIcons[status]
  const label = statusLabels[status]

  return (
    <Badge status={proposalStatus} size={size} variant="status">
      {showIcon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </Badge>
  )
}

export default StatusBadge
