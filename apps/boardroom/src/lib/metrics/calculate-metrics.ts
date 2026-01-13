/**
 * Metrics Calculation
 *
 * Calculates dashboard metrics from proposal data
 * Replaces placeholder values with actual calculations
 */

import type { Proposal } from "@mythic/shared-types/boardroom"
import { getCurrentUser } from "@/src/lib/auth"

export interface DashboardMetrics {
  totalPending: number
  awaitingYourVote: number
  avgDecisionTime: number
  thisWeekApprovals: number
  atRiskProposals: number
}

/**
 * Calculate dashboard metrics from proposals
 */
export async function calculateMetrics(proposals: Proposal[]): Promise<DashboardMetrics> {
  const user = await getCurrentUser()
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const slaThreshold = 48 * 60 * 60 * 1000 // 48 hours in milliseconds

  return {
    totalPending: proposals.filter((p) => p.status === "LISTENING").length,
    awaitingYourVote: user
      ? proposals.filter(
          (p) =>
            p.status === "LISTENING" &&
            p.submitted_by !== user.userId &&
            !p.approved_by?.includes(user.userId)
        ).length
      : 0,
    avgDecisionTime: calculateAverageDecisionTime(proposals),
    thisWeekApprovals: proposals.filter(
      (p) => p.status === "APPROVED" && p.approved_at && new Date(p.approved_at) >= weekAgo
    ).length,
    atRiskProposals: proposals.filter((p) => {
      if (p.status !== "LISTENING") return false
      const timeSinceSubmission = now.getTime() - new Date(p.created_at).getTime()
      return timeSinceSubmission > slaThreshold
    }).length,
  }
}

/**
 * Calculate average decision time in days
 */
function calculateAverageDecisionTime(proposals: Proposal[]): number {
  const approvedProposals = proposals.filter(
    (p) => p.status === "APPROVED" && p.approved_at && p.created_at
  )

  if (approvedProposals.length === 0) {
    return 0
  }

  const totalTime = approvedProposals.reduce((sum, p) => {
    const decisionTime = new Date(p.approved_at!).getTime() - new Date(p.created_at).getTime()
    return sum + decisionTime
  }, 0)

  const avgMs = totalTime / approvedProposals.length
  // Convert to days, round to 1 decimal place
  return Math.round((avgMs / (24 * 60 * 60 * 1000)) * 10) / 10
}
