/**
 * TanStack Query Hooks for Proposals
 *
 * Server state management for proposals data.
 * Client state (UI, form state) should use Zustand, not TanStack Query.
 */

'use client'

import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query'
import { getProposals, getProposal, approveProposal, vetoProposal } from '@/app/actions/proposals'
import type { Proposal } from '@mythic/shared-types/boardroom'

/**
 * Query keys for proposals
 */
export const proposalKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...proposalKeys.lists(), filters] as const,
  details: () => [...proposalKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalKeys.details(), id] as const,
}

/**
 * Fetch proposals list
 */
export function useProposals(
  filters?: Record<string, unknown>,
  initialData?: Proposal[]
): UseQueryResult<Proposal[], Error> {
  return useQuery({
    queryKey: proposalKeys.list(filters),
    queryFn: () => getProposals(filters),
    initialData,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Fetch single proposal
 */
export function useProposal(proposalId: string | undefined): UseQueryResult<Proposal | null, Error> {
  return useQuery({
    queryKey: proposalKeys.detail(proposalId ?? ''),
    queryFn: () => {
      if (!proposalId) return null
      return getProposal({ proposalId })
    },
    enabled: !!proposalId,
    staleTime: 30 * 1000,
  })
}

/**
 * Approve proposal mutation with optimistic updates
 */
export function useApproveProposal(): UseMutationResult<{ success: boolean; error?: string }, Error, { proposalId: string; approvedBy: string }> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { proposalId: string; approvedBy: string }) =>
      approveProposal(input),
    // Optimistic update: Update UI immediately before server responds
    onMutate: async ({ proposalId, approvedBy }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: proposalKeys.all })

      // Snapshot the previous value
      const previousProposals = queryClient.getQueryData<Proposal[]>(proposalKeys.list())

      // Optimistically update the proposals list
      if (previousProposals) {
        queryClient.setQueryData<Proposal[]>(
          proposalKeys.list(),
          previousProposals.map((p) =>
            p.id === proposalId
              ? { ...p, status: 'APPROVED' as const, approved_by: approvedBy, approved_at: new Date() }
              : p
          )
        )
      }

      // Optimistically update the single proposal if it's being viewed
      const previousProposal = queryClient.getQueryData<Proposal>(proposalKeys.detail(proposalId))
      if (previousProposal) {
        queryClient.setQueryData<Proposal>(proposalKeys.detail(proposalId), {
          ...previousProposal,
          status: 'APPROVED' as const,
          approved_by: approvedBy,
          approved_at: new Date(),
        })
      }

      // Return context with snapshot for rollback
      return { previousProposals, previousProposal }
    },
    // On error, roll back to previous state
    onError: (error, variables, context) => {
      if (context?.previousProposals) {
        queryClient.setQueryData(proposalKeys.list(), context.previousProposals)
      }
      if (context?.previousProposal) {
        queryClient.setQueryData(proposalKeys.detail(variables.proposalId), context.previousProposal)
      }
    },
    // Always refetch after error or success to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.all })
    },
  })
}

/**
 * Veto proposal mutation with optimistic updates
 */
export function useVetoProposal(): UseMutationResult<{ success: boolean; error?: string }, Error, { proposalId: string; vetoedBy: string; reason: string }> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { proposalId: string; vetoedBy: string; reason: string }) =>
      vetoProposal(input),
    // Optimistic update: Update UI immediately before server responds
    onMutate: async ({ proposalId, vetoedBy, reason }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: proposalKeys.all })

      // Snapshot the previous value
      const previousProposals = queryClient.getQueryData<Proposal[]>(proposalKeys.list())

      // Optimistically update the proposals list
      if (previousProposals) {
        queryClient.setQueryData<Proposal[]>(
          proposalKeys.list(),
          previousProposals.map((p) =>
            p.id === proposalId
              ? {
                  ...p,
                  status: 'VETOED' as const,
                  vetoed_by: vetoedBy,
                  veto_reason: reason,
                  vetoed_at: new Date(),
                }
              : p
          )
        )
      }

      // Optimistically update the single proposal if it's being viewed
      const previousProposal = queryClient.getQueryData<Proposal>(proposalKeys.detail(proposalId))
      if (previousProposal) {
        queryClient.setQueryData<Proposal>(proposalKeys.detail(proposalId), {
          ...previousProposal,
          status: 'VETOED' as const,
          vetoed_by: vetoedBy,
          veto_reason: reason,
          vetoed_at: new Date(),
        })
      }

      // Return context with snapshot for rollback
      return { previousProposals, previousProposal }
    },
    // On error, roll back to previous state
    onError: (error, variables, context) => {
      if (context?.previousProposals) {
        queryClient.setQueryData(proposalKeys.list(), context.previousProposals)
      }
      if (context?.previousProposal) {
        queryClient.setQueryData(proposalKeys.detail(variables.proposalId), context.previousProposal)
      }
    },
    // Always refetch after error or success to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.all })
    },
  })
}
