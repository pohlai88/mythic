/**
 * Session Management
 *
 * Handles user session retrieval and validation
 * Replaces placeholder user IDs with proper session management
 */

import { cookies } from 'next/headers'
import { z as z4 } from 'zod/v4'

const sessionSchema = z4.object({
  userId: z4.string().uuid(),
  email: z4.string().email(),
  role: z4.enum(['sovereign', 'council', 'observer']),
  name: z4.string().optional(),
})

export type Session = z4.infer<typeof sessionSchema>

/**
 * Get current authenticated user from session
 *
 * @returns Session data or null if not authenticated
 */
export async function getCurrentUser(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')

    if (!sessionToken) {
      return null
    }

    // Decode and validate session token
    // In production, this would verify JWT signature
    const decoded = JSON.parse(sessionToken.value)
    const session = sessionSchema.safeParse(decoded)

    if (!session.success) {
      return null
    }

    return session.data
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get current user ID (convenience function)
 *
 * @returns User ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.userId ?? null
}
