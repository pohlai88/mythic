/**
 * Session Actions
 *
 * Server Actions for session management
 * Can be called from client components
 */

"use server"

import { getCurrentUserId, getCurrentUser } from "@/src/lib/auth"

/**
 * Get current user ID (Server Action)
 *
 * Can be called from client components
 */
export async function getCurrentUserIdAction(): Promise<string | null> {
  return await getCurrentUserId()
}

/**
 * Get current user (Server Action)
 *
 * Can be called from client components
 */
export async function getCurrentUserAction() {
  return await getCurrentUser()
}
