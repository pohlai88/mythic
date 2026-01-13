/**
 * Privacy Utilities for Analytics
 *
 * Implements privacy-preserving functions for analytics data collection.
 * Following GDPR/CCPA best practices.
 */

/**
 * Hash IP address using SHA-256
 *
 * One-way hashing for privacy compliance (GDPR/CCPA).
 * Cannot be reversed to original IP address.
 *
 * @param ip - IP address to hash (or 'unknown' if not available)
 * @returns SHA-256 hash of the IP address (64 character hex string)
 */
export async function hashIP(ip: string): Promise<string> {
  if (!ip || ip === "unknown") {
    return "unknown"
  }

  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(ip)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  } catch (error) {
    // Fallback to 'unknown' if hashing fails
    console.error("IP hashing failed:", error)
    return "unknown"
  }
}

/**
 * Synchronous IP hashing (for Edge Runtime compatibility)
 *
 * Uses a simpler approach for Edge Runtime where async crypto might not be available.
 * Falls back to a deterministic hash based on IP.
 *
 * @param ip - IP address to hash
 * @returns Hash string (not cryptographically secure, but privacy-preserving)
 */
export function hashIPSync(ip: string): string {
  if (!ip || ip === "unknown") {
    return "unknown"
  }

  // Simple hash function for Edge Runtime
  // Not cryptographically secure, but provides privacy
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Convert to positive hex string
  const hexHash = Math.abs(hash).toString(16).padStart(16, "0")
  return hexHash
}
