/**
 * SealedDocument Component
 *
 * Displays sealed status, hash, and ledger link for governance documents.
 * Uses design system tokens and shared components
 */

import type React from 'react'
import { cn } from '@mythic/shared-utils'
import { Card } from '../shared'
import { Badge } from '../shared'
import { HashVerification } from './HashVerification'
import { LedgerLink } from './LedgerLink'
import { StatusBadge } from './StatusBadge'
import { tokens } from '../../lib/design-tokens'

interface SealedDocumentProps {
  title: string
  hash: string
  ledgerEntryId: string
  effectiveDate: string
  layer: 'L0' | 'L1' | 'L2'
  version?: string
  showFullHash?: boolean
}

const layerLabels: Record<string, { label: string; description: string }> = {
  l0: {
    label: 'Layer 0 - Foundational',
    description: 'Core philosophical principles and immutable values',
  },
  l1: {
    label: 'Layer 1 - Constitutional',
    description: 'Governance rules and operational frameworks',
  },
  l2: {
    label: 'Layer 2 - Operational',
    description: 'Active planning and implementation documents',
  },
}

export function SealedDocument({
  title,
  hash,
  ledgerEntryId,
  effectiveDate,
  layer,
  version = '1.0',
  showFullHash = false,
}: SealedDocumentProps): React.ReactElement {
  const layerInfo = layerLabels[layer.toLowerCase()] ?? {
    label: `Layer ${layer}`,
    description: 'Document layer information',
  }

  return (
    <Card
      status="APPROVED"
      className={cn(
        'not-prose my-6 overflow-hidden',
        'border-2 border-gold/50',
        'bg-gradient-to-br from-gold/10 to-obsidian/50'
      )}
    >
      {/* Header */}
      <Card.Header className={cn('border-b', tokens.borders.accent, 'bg-gold/10')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">🔒</span>
            <div>
              <Card.Title>{title}</Card.Title>
              <p className="text-sm text-gold">
                Version {version} • Sealed {effectiveDate}
              </p>
            </div>
          </div>
          <StatusBadge status="sealed" size="lg" />
        </div>
      </Card.Header>

      {/* Layer Info */}
      <Card.Content className={cn('border-b', tokens.borders.subtle)}>
        <div className="flex items-center gap-2">
          <Badge status="APPROVED" size="sm">
            {layer}
          </Badge>
          <span className="text-sm font-medium text-parchment">
            {layerInfo.label}
          </span>
        </div>
        <p className="mt-1 text-sm text-ash">{layerInfo.description}</p>
      </Card.Content>

      {/* Hash Verification */}
      <Card.Content>
        <HashVerification hash={hash} truncate={!showFullHash} label="Integrity Hash" />
      </Card.Content>

      {/* Ledger Link */}
      <Card.Footer className={cn('bg-gold/5')}>
        <LedgerLink entryId={ledgerEntryId} label="View in Public Ledger" />
      </Card.Footer>
    </Card>
  )
}

export default SealedDocument
