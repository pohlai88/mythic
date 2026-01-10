/**
 * HashVerification Component
 *
 * Displays SHA-256 hash with copy functionality for document verification.
 * Used to verify the integrity of sealed governance documents.
 */

'use client'

import type React from 'react'
import { useState } from 'react'

interface HashVerificationProps {
  hash: string
  algorithm?: 'sha256' | 'sha512'
  showCopyButton?: boolean
  truncate?: boolean
  label?: string
}

export function HashVerification({
  hash,
  algorithm = 'sha256',
  showCopyButton = true,
  truncate = true,
  label = 'Document Hash',
}: HashVerificationProps): React.ReactElement {
  const [copied, setCopied] = useState(false)

  const displayHash = truncate ? `${hash.slice(0, 16)}...${hash.slice(-8)}` : hash

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = hash
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="my-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {algorithm.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 break-all rounded bg-gray-100 px-3 py-2 font-mono text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          {displayHash}
        </code>
        {showCopyButton && (
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            title="Copy full hash"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>
      {truncate && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Click "Copy" to get the full hash for verification
        </p>
      )}
    </div>
  )
}

export default HashVerification
