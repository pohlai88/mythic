/**
 * Analytics Utility Functions
 *
 * Helper functions for extracting data from requests for analytics.
 */

/**
 * Extract proposal ID from pathname
 *
 * Matches patterns like:
 * - /boardroom/proposal/{uuid}
 * - /api/proposals/{uuid}
 * - /proposals/{uuid}
 *
 * @param pathname - Request pathname
 * @returns Proposal ID (UUID) or undefined
 */
export function extractProposalId(pathname: string): string | undefined {
  // Match UUID pattern in pathname
  const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

  // Check common proposal paths
  if (pathname.includes("/proposal/") || pathname.includes("/proposals/")) {
    const match = pathname.match(uuidPattern)
    return match?.[0]
  }

  return undefined
}

/**
 * Extract user ID from request headers
 *
 * Looks for user ID in common header locations:
 * - x-user-id
 * - x-user-uuid
 * - authorization (JWT token - requires parsing)
 *
 * @param headers - Request headers
 * @returns User ID (UUID) or undefined
 */
export function extractUserId(headers: Headers): string | undefined {
  // Check common user ID headers
  const userId = headers.get("x-user-id") || headers.get("x-user-uuid")

  if (userId) {
    // Validate UUID format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (uuidPattern.test(userId)) {
      return userId
    }
  }

  return undefined
}

/**
 * Get IP address from request headers
 *
 * Checks common proxy headers in order:
 * - x-forwarded-for (first IP in chain)
 * - x-real-ip
 * - cf-connecting-ip (Cloudflare)
 *
 * @param headers - Request headers
 * @returns IP address or 'unknown'
 */
export function getIPAddress(headers: Headers): string {
  // Check x-forwarded-for (may contain multiple IPs, take first)
  const forwardedFor = headers.get("x-forwarded-for")
  if (forwardedFor && forwardedFor.trim()) {
    return forwardedFor.split(",")[0]!.trim()
  }

  // Check x-real-ip
  const realIP = headers.get("x-real-ip")
  if (realIP) {
    return realIP.trim()
  }

  // Check Cloudflare header
  const cfIP = headers.get("cf-connecting-ip")
  if (cfIP) {
    return cfIP.trim()
  }

  return "unknown"
}
