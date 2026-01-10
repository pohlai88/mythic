/**
 * SealedDocument Component
 *
 * Displays sealed status, hash, and ledger link for governance documents.
 * This is the primary component for indicating a document's sealed status.
 */

import type React from 'react'
import { HashVerification } from './HashVerification'
import { LedgerLink } from './LedgerLink'
import { StatusBadge } from './StatusBadge'

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
  const layerInfo = layerLabels[layer.toLowerCase()]

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border-2 border-emerald-200 bg-linear-to-br from-emerald-50 to-white dark:border-emerald-800 dark:from-emerald-950 dark:to-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-200 bg-emerald-100/50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-900/30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">{title}</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Version {version} • Sealed {effectiveDate}
            </p>
          </div>
        </div>
        <StatusBadge status="sealed" size="lg" />
      </div>

      {/* Layer Info */}
      <div className="border-b border-emerald-200 px-4 py-3 dark:border-emerald-800">
        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200">
            {layer}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {layerInfo.label}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{layerInfo.description}</p>
      </div>

      {/* Hash Verification */}
      <div className="px-4 py-3">
        <HashVerification hash={hash} truncate={!showFullHash} label="Integrity Hash" />
      </div>

      {/* Ledger Link */}
      <div className="border-t border-emerald-200 bg-emerald-50/50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-900/20">
        <LedgerLink entryId={ledgerEntryId} label="View in Public Ledger" />
      </div>
    </div>
  )
}

export default SealedDocument
