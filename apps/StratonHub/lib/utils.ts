/**
 * Utility Functions for StratonHub
 *
 * Shared helpers extracted from pages to avoid duplication.
 */

/**
 * Convert a slug to title case.
 * Example: "supply-chain" → "Supply Chain"
 */
export function titleCaseSlug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}
