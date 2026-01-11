/**
 * Golden Thumb Component
 *
 * Fixed approval mechanism in bottom-right "Thumb Zone"
 * Actions: APPROVE, VETO, CONSULT
 *
 * The Watermark Engine: Optimistic UI (16ms client-side, async server-side)
 *
 * @see PRD Section 4.2
 */

'use client'

import { Button } from '@mythic/design-system'
import { getCommitmentTransition, getHoverTransition } from '@mythic/axis-theme/motion'
import { useState } from 'react'
import type { Proposal } from '@mythic/shared-types/boardroom'

interface GoldenThumbProps {
  proposal: Proposal | null
  onApprove: (proposalId: string) => Promise<void>
  onVeto: (proposalId: string, reason: string) => Promise<void>
  onConsult: (proposalId: string, assignTo: string) => Promise<void>
}

export function GoldenThumb({
  proposal,
  onApprove,
  onVeto,
  onConsult,
}: GoldenThumbProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showVetoDialog, setShowVetoDialog] = useState(false)
  const [vetoReason, setVetoReason] = useState('')

  if (!proposal || proposal.status !== 'LISTENING') {
    return null // Only show for proposals in LISTENING state
  }

  const handleApprove = async () => {
    if (isProcessing) return
    setIsProcessing(true)
    try {
      // Optimistic UI: Instant watermark
      // Server-side: Async persistence
      await onApprove(proposal.id)
    } catch (error) {
      console.error('Approval failed:', error)
      // UI will roll back on error
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVeto = async () => {
    if (!vetoReason.trim()) return
    setIsProcessing(true)
    try {
      await onVeto(proposal.id, vetoReason)
      setShowVetoDialog(false)
      setVetoReason('')
    } catch (error) {
      console.error('Veto failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Fixed Position - Bottom Right Thumb Zone */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleApprove}
          disabled={isProcessing}
          className="min-w-[200px]"
        >
          {isProcessing ? 'SIGNING...' : 'APPROVE'}
        </Button>

        <Button
          variant="danger"
          size="lg"
          onClick={() => setShowVetoDialog(true)}
          disabled={isProcessing}
          className="min-w-[200px]"
        >
          VETO
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={async () => {
            if (isProcessing) return
            setIsProcessing(true)
            try {
              // TODO(issue-consult-dialog): Implement consult dialog UI - See https://github.com/mythic/monorepo/issues/consult-dialog
              // For now, using default assignee
              await onConsult(proposal.id, 'default-assignee')
            } catch (error) {
              console.error('Consult action failed:', error)
            } finally {
              setIsProcessing(false)
            }
          }}
          disabled={isProcessing}
          className="min-w-[200px]"
        >
          CONSULT
        </Button>
      </div>

      {/* Veto Dialog */}
      {showVetoDialog && (
        <div className="fixed inset-0 bg-void/75 flex items-center justify-center z-50">
          <div className="bg-obsidian border border-gold rounded-lg p-6 max-w-md w-full">
            <h3 className="text-gold font-serif text-xl mb-4">Veto Proposal</h3>
            <p className="text-ash text-sm mb-4">
              Please provide a reason for vetoing this proposal. This will be recorded in the audit trail.
            </p>
            <textarea
              value={vetoReason}
              onChange={(e) => setVetoReason(e.target.value)}
              placeholder="Enter veto reason..."
              className="w-full bg-void border border-charcoal rounded-xs px-4 py-2 text-parchment placeholder-ash focus:outline-hidden focus:border-gold transition-all duration-1200 min-h-[100px] mb-4"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowVetoDialog(false)
                  setVetoReason('')
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleVeto}
                disabled={!vetoReason.trim() || isProcessing}
              >
                Confirm Veto
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
