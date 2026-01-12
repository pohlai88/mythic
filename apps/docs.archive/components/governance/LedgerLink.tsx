/**
 * LedgerLink Component
 *
 * Links to ledger entries with entry ID for governance tracking.
 * Uses shared Link component and design system tokens.
 */

import type React from 'react'
import { Link } from '../shared'
import { Badge } from '../shared'
import { cn } from '@mythic/shared-utils'

interface LedgerLinkProps {
  entryId: string
  ledgerUrl?: string
  showIcon?: boolean
  label?: string
}

export function LedgerLink({
  entryId,
  ledgerUrl = '/governance/ledger',
  showIcon = true,
  label = 'View Ledger Entry',
}: LedgerLinkProps): React.ReactElement {
  const href = `${ledgerUrl}#${entryId}`
  const displayId = entryId.length > 20 ? `${entryId.slice(0, 8)}...${entryId.slice(-6)}` : entryId

  return (
    <Link
      href={href}
      variant="primary"
      className={cn(
        'inline-flex items-center gap-2',
        'rounded-xs border border-gold/30 bg-obsidian/50',
        'px-3 py-2 text-sm font-medium',
        'hover:bg-obsidian/70'
      )}
    >
      {showIcon && <span className="text-lg" aria-hidden="true">📋</span>}
      <span>{label}</span>
      <Badge status="LISTENING" size="sm" className="font-mono">
        {displayId}
      </Badge>
    </Link>
  )
}

export default LedgerLink
