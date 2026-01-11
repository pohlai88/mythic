/**
 * BoardRoom Main Page
 *
 * The Apex - Executive Board Decision Engine
 * Dual-Screen Strategy: Pool Table (60%) + Strategy Drawer (40%)
 */

import { Suspense } from 'react'
import { BoardRoomClient } from './BoardRoomClient'
import { getProposals } from '@/app/actions/proposals'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BoardRoom',
  description: 'Executive Board Decision Engine - High-Frequency Decision Making',
  openGraph: {
    title: 'BoardRoom - Executive Decision Engine',
    description: 'High-Frequency Decision Engine for Executive Governance',
    type: 'website',
  },
}

export default async function BoardRoomPage() {
  // Fetch proposals server-side (React Server Component - zero client JS)
  let proposals: Awaited<ReturnType<typeof getProposals>> = []
  let error: Error | null = null

  try {
    proposals = await getProposals()
  } catch (err) {
    // Log error for debugging
    console.error('Error fetching proposals:', err)
    error = err instanceof Error ? err : new Error(String(err))
    // Continue with empty proposals array to show error state in UI
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen bg-void text-parchment">
          <div className="text-center">
            <div className="mx-auto mb-4 w-8 h-8 rounded-full border-2 animate-spin border-gold border-t-transparent" />
            <p className="text-sm text-ash">Loading BoardRoom...</p>
          </div>
        </div>
      }
    >
      <BoardRoomClient initialProposals={proposals} error={error} />
    </Suspense>
  )
}
