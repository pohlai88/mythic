/**
 * REST API Route - Get User by ID (App Router)
 * Migrated from pages/api/rest/users/[id].ts
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */

import { db } from '@/src/db'
import { users } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod/v4'

// Zod schema for validation
const getUserParamsSchema = z
  .object({
    id: z.string().transform(Number).describe('User ID parameter'),
  })
  .describe('REST API get user parameters schema')

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    // Validate and parse input
    const { id } = getUserParamsSchema.parse({ id: resolvedParams.id })

    // Database query with type safety
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1)

    if (!user[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user[0])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
