/**
 * Prepared Statements for Frequently Used Queries
 *
 * Prepared statements improve performance by:
 * - Reducing query parsing overhead
 * - Enabling query plan caching
 * - Better for serverless (fewer roundtrips)
 *
 * Usage:
 *   import { getProposalById } from '@/src/db/queries'
 *   const proposal = await getProposalById.execute({ id: '...' })
 */

import { db } from "./index"
import { proposals, circles, boardComments, thanosEvents } from "./schema"
import { eq } from "drizzle-orm"
import { sql } from "drizzle-orm"

/**
 * Get proposal by ID (prepared statement)
 */
export const getProposalById = db
  .select()
  .from(proposals)
  .where(eq(proposals.id, sql.placeholder("id")))
  .prepare()

/**
 * Get proposal with relations
 * Uses relational queries API for nested data (single query)
 * Note: Relational queries don't support .prepare(), but they're already optimized
 */
export async function getProposalWithRelations(id: string) {
  return db.query.proposals.findFirst({
    where: eq(proposals.id, id),
    with: {
      circle: true,
      stencil: true,
      comments: true,
      events: true,
    },
  })
}

/**
 * Get proposals by circle ID (prepared statement)
 */
export const getProposalsByCircleId = db
  .select()
  .from(proposals)
  .where(eq(proposals.circleId, sql.placeholder("circleId")))
  .prepare()

/**
 * Get proposals by status (prepared statement)
 */
export const getProposalsByStatus = db
  .select()
  .from(proposals)
  .where(eq(proposals.status, sql.placeholder("status")))
  .prepare()

/**
 * Get circle by ID (prepared statement)
 */
export const getCircleById = db
  .select()
  .from(circles)
  .where(eq(circles.id, sql.placeholder("id")))
  .prepare()

/**
 * Get circle with relations
 * Uses relational queries API for nested data (single query)
 */
export async function getCircleWithRelations(id: string) {
  return db.query.circles.findFirst({
    where: eq(circles.id, id),
    with: {
      parent: true,
      children: true,
      proposals: true,
      members: true,
    },
  })
}

/**
 * Get comments for a proposal (prepared statement)
 */
export const getCommentsByProposalId = db
  .select()
  .from(boardComments)
  .where(eq(boardComments.proposalId, sql.placeholder("proposalId")))
  .prepare()

/**
 * Get events for a proposal (prepared statement)
 */
export const getEventsByProposalId = db
  .select()
  .from(thanosEvents)
  .where(eq(thanosEvents.proposalId, sql.placeholder("proposalId")))
  .prepare()
