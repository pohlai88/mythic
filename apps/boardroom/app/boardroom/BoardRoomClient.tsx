/**
 * BoardRoom Client Component
 *
 * Client-side wrapper for BoardRoom page
 */

"use client"

import { useCallback } from "react"
import dynamic from "next/dynamic"
import { PoolTable } from "@/components/PoolTable"
import { GoldenThumb } from "@/components/GoldenThumb"
import { LoadingState } from "@/components/LoadingState"
import { ErrorState } from "@/components/ErrorState"
import { BroadcastBanner } from "@/components/BroadcastBanner"
import { getCurrentUserIdAction } from "@/app/actions/session"
import { useBoardRoomStore } from "@/src/lib/stores/boardroom-store"
import { useToast } from "@mythic/tailwindcss-v4-design-system"
import { useProposals, useProposal, useApproveProposal, useVetoProposal } from "@/src/lib/queries"
import type { Proposal } from "@mythic/shared-types/boardroom"

// Code splitting: Load StrategyDrawer dynamically (large component with multiple tabs)
const StrategyDrawer = dynamic(
  () => import("@/components/StrategyDrawer").then((mod) => ({ default: mod.StrategyDrawer })),
  {
    loading: () => <LoadingState message="Loading strategy drawer..." size="sm" />,
    ssr: true,
  }
)

interface BoardRoomClientProps {
  initialProposals: Proposal[]
  error?: Error | null
}

export function BoardRoomClient({ initialProposals, error: serverError }: BoardRoomClientProps) {
  // Client state: Use Zustand for UI state
  const { selectedProposalId, setSelectedProposalId } = useBoardRoomStore()

  // Toast notifications
  const toast = useToast()

  // Server state: Use TanStack Query for server state management
  // Use initialProposals as initialData for SSR hydration
  const {
    data: proposals = initialProposals,
    isLoading,
    error: queryError,
  } = useProposals(undefined, initialProposals)
  const { data: selectedProposal } = useProposal(selectedProposalId)

  // Prefer server error over query error
  const error = serverError || queryError

  // Mutations
  const approveMutation = useApproveProposal()
  const vetoMutation = useVetoProposal()

  // Show loading only if we don't have initial data and are fetching
  const isInitialLoading = isLoading && !initialProposals.length

  // Memoize handlers to prevent unnecessary re-renders
  const handleApprove = useCallback(
    async (proposalId: string) => {
      try {
        const userId = await getCurrentUserIdAction()
        if (!userId) {
          throw new Error("User not authenticated")
        }

        // Use TanStack Query mutation with optimistic updates
        // Optimistic update happens immediately, rollback on error
        await approveMutation.mutateAsync({ proposalId, approvedBy: userId })
        // Success: UI already updated optimistically, server will refetch to ensure consistency
        toast.success("Proposal approved successfully")
      } catch (error) {
        // Error: Optimistic update automatically rolled back by TanStack Query
        const message = error instanceof Error ? error.message : "Failed to approve proposal"
        toast.error(message, "Approval Failed")
      }
    },
    [approveMutation, toast]
  )

  const handleVeto = useCallback(
    async (proposalId: string, reason: string) => {
      try {
        const userId = await getCurrentUserIdAction()
        if (!userId) {
          throw new Error("User not authenticated")
        }

        // Use TanStack Query mutation with optimistic updates
        // Optimistic update happens immediately, rollback on error
        await vetoMutation.mutateAsync({ proposalId, vetoedBy: userId, reason })
        // Success: UI already updated optimistically, server will refetch to ensure consistency
        toast.success("Proposal vetoed successfully")
      } catch (error) {
        // Error: Optimistic update automatically rolled back by TanStack Query
        const message = error instanceof Error ? error.message : "Failed to veto proposal"
        toast.error(message, "Veto Failed")
      }
    },
    [vetoMutation, toast]
  )

  const handleConsult = useCallback(
    async (proposalId: string, assignTo: string) => {
      try {
        const userId = await getCurrentUserIdAction()
        if (!userId) {
          throw new Error("User not authenticated")
        }

        // TODO(issue-consult): Implement consult action - See https://github.com/org/repo/issues/consult
        // For now, this is a placeholder that will be implemented in the next sprint
        throw new Error("Consult action not yet implemented")
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to consult on proposal"
        toast.error(message, "Consult Failed")
      }
    },
    [toast]
  )

  // Loading state (only show if no initial data)
  if (isInitialLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-void text-parchment">
        <LoadingState message="Loading proposals..." />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-void text-parchment p-6">
        <ErrorState
          title="Failed to load BoardRoom"
          message={
            error instanceof Error
              ? error.message
              : "An unexpected error occurred while loading proposals"
          }
          error={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-void text-parchment overflow-hidden">
      {/* Broadcast Banner (The Herald) - Sticky at top */}
      <div className="flex-shrink-0 px-4 lg:px-6 pt-4 lg:pt-6">
        <BroadcastBanner />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Pool Table (60%) */}
        <div className="w-full lg:w-3/5 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-obsidian overflow-hidden">
          <PoolTable
            proposals={proposals}
            selectedProposalId={selectedProposalId}
            onSelectProposal={setSelectedProposalId}
          />
        </div>

        {/* Right Panel: Strategy Drawer (40%) */}
        <div className="w-full lg:w-2/5 p-4 lg:p-6 overflow-hidden">
          <StrategyDrawer proposal={selectedProposal || null} />
        </div>
      </div>

      {/* Golden Thumb - Fixed Bottom Right */}
      <GoldenThumb
        proposal={selectedProposal || null}
        onApprove={handleApprove}
        onVeto={handleVeto}
        onConsult={handleConsult}
      />
    </div>
  )
}
