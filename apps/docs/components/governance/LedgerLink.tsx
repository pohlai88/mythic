/**
 * LedgerLink Component
 *
 * Links to ledger entries with entry ID for governance tracking.
 * Provides quick access to the public ledger entry for a document.
 */

import type React from 'react'

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

  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
    >
      {showIcon && <span className="text-lg">📋</span>}
      <span>{label}</span>
      <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-800">
        {entryId.length > 20 ? `${entryId.slice(0, 8)}...${entryId.slice(-6)}` : entryId}
      </code>
    </a>
  )
}

export default LedgerLink
