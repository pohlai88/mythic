/**
 * TanStack Query Hooks Barrel Export
 *
 * Centralized exports for all query hooks.
 * Server state management for proposals data.
 *
 * @example
 * ```typescript
 * import { useProposals, useProposal, proposalKeys } from '@/src/lib/queries'
 * ```
 */

export {
  proposalKeys,
  useProposals,
  useProposal,
  useApproveProposal,
  useVetoProposal,
} from './proposals'

export type {
  // Types are re-exported from proposals.ts via named exports
  // Import types directly from the module if needed
} from './proposals'