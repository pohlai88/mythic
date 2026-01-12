/**
 * HashVerification Component
 *
 * Displays SHA-256 hash with copy functionality for document verification.
 * Used to verify the integrity of sealed governance documents.
 */

'use client'

import type React from 'react'
import { useState } from 'react'
import { cn } from '@mythic/shared-utils'
import { Badge } from '../shared'
import { Button } from '../shared'

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
    <div className={cn(
      'my-4 rounded-lg border',
      'bg-obsidian/50 border-charcoal/30 p-4'
    )}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-medium text-parchment">{label}</span>
        <Badge status="LISTENING" size="sm" className="font-mono">
          {algorithm.toUpperCase()}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <code className={cn(
          'flex-1 break-all rounded-xs bg-void px-3 py-2',
          'font-mono text-sm text-parchment',
          'border border-charcoal/30'
        )}>
          {displayHash}
        </code>
        {showCopyButton && (
          <Button
            type="button"
            onClick={handleCopy}
            variant="secondary"
            size="sm"
            title="Copy full hash"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </Button>
        )}
      </div>
      {truncate && (
        <p className="mt-2 text-xs text-ash">
          Click "Copy" to get the full hash for verification
        </p>
      )}
    </div>
  )
}

export default HashVerification
