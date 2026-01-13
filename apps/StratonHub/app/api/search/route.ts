/**
 * Search API Route
 *
 * API endpoint for search functionality
 * Returns search results from build-time index
 *
 * Performance optimizations:
 * - In-memory index caching (module-level)
 * - Input validation and sanitization
 * - Efficient filtering order
 */

import { readFileSync } from "fs"
import { join } from "path"
import { createFuzzySearch, filterByAudience, filterBySurface, search } from "@/lib/search"
import type { SearchIndex } from "@/lib/search/types"
import { NextResponse } from "next/server"

// Constants
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50
const MIN_LIMIT = 1

// Valid audience types
const VALID_AUDIENCES = ["developers", "users", "business"] as const
type ValidAudience = (typeof VALID_AUDIENCES)[number]

// Module-level cache for search index (persists across requests)
let cachedIndex: SearchIndex[] | null = null
let indexLoadError: Error | null = null

/**
 * Get the correct path to search index
 */
function getIndexPath(): string {
  const cwd = process.cwd()
  // Check if we're in the StratonHub directory or at monorepo root
  if (cwd.endsWith("apps/StratonHub") || cwd.endsWith("apps\\StratonHub")) {
    return join(cwd, "public", "search-index.json")
  }
  // Assume we're at monorepo root
  return join(cwd, "apps", "StratonHub", "public", "search-index.json")
}

/**
 * Load search index from public directory
 * Uses module-level caching to avoid repeated file I/O
 */
function loadSearchIndex(): SearchIndex[] {
  // Return cached index if available
  if (cachedIndex !== null) {
    return cachedIndex
  }

  // Return empty array if we previously failed to load
  if (indexLoadError !== null) {
    return []
  }

  try {
    const indexPath = getIndexPath()
    const indexData = readFileSync(indexPath, "utf-8")
    const parsed = JSON.parse(indexData) as SearchIndex[]

    // Validate parsed data is an array
    if (!Array.isArray(parsed)) {
      throw new Error("Search index must be an array")
    }

    // Cache the index
    cachedIndex = parsed
    return cachedIndex
  } catch (error) {
    // Log error for debugging (only once)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    indexLoadError = new Error(`Failed to load search index: ${errorMessage}`)

    // In production, you might want to log this to a monitoring service
    if (process.env.NODE_ENV === "development") {
      console.error("[Search API]", indexLoadError.message)
    }

    return []
  }
}

/**
 * Validate and sanitize query parameters
 */
function validateParams(
  query: string | null,
  audience: string | null,
  surface: string | null,
  limit: string | null
): {
  valid: boolean
  query?: string
  audience?: ValidAudience
  surface?: string
  limit?: number
  error?: string
} {
  // Query is required
  const trimmedQuery = query?.trim()
  if (!trimmedQuery || trimmedQuery.length === 0) {
    return { valid: false, error: 'Query parameter "q" is required' }
  }

  // Validate audience
  let validAudience: ValidAudience | undefined
  if (audience) {
    if (!VALID_AUDIENCES.includes(audience as ValidAudience)) {
      return {
        valid: false,
        error: `Invalid audience. Must be one of: ${VALID_AUDIENCES.join(", ")}`,
      }
    }
    validAudience = audience as ValidAudience
  }

  // Validate limit
  let validLimit = DEFAULT_LIMIT
  if (limit) {
    const parsed = Number.parseInt(limit, 10)
    if (Number.isNaN(parsed) || parsed < MIN_LIMIT) {
      return {
        valid: false,
        error: `Invalid limit. Must be a number >= ${MIN_LIMIT}`,
      }
    }
    validLimit = Math.min(parsed, MAX_LIMIT) // Cap at MAX_LIMIT
  }

  // Sanitize surface (trim whitespace)
  const sanitizedSurface = surface?.trim() || undefined

  return {
    valid: true,
    query: trimmedQuery,
    audience: validAudience,
    surface: sanitizedSurface,
    limit: validLimit,
  }
}

/**
 * GET /api/search
 *
 * Query parameters:
 * - q: Search query (required)
 * - audience: Filter by audience (optional, one of: developers, users, business)
 * - surface: Filter by surface (optional)
 * - limit: Maximum results (optional, default: 10, max: 50)
 *
 * Performance: Uses cached search index, efficient filtering order
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const audience = searchParams.get("audience")
    const surface = searchParams.get("surface")
    const limit = searchParams.get("limit")

    // Validate and sanitize parameters
    const validation = validateParams(query, audience, surface, limit)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Load search index (cached after first load)
    const index = loadSearchIndex()
    if (index.length === 0) {
      return NextResponse.json({ results: [], total: 0 })
    }

    // Create fuzzy search instance
    const fuse = createFuzzySearch(index)

    // Perform search with validated limit
    let results = search(fuse, validation.query!, { limit: validation.limit })

    // Apply filters in order of selectivity (most selective first)
    // Filter by audience first (more selective than surface)
    if (validation.audience) {
      results = filterByAudience(results, validation.audience)
    }

    // Then filter by surface
    if (validation.surface) {
      results = filterBySurface(results, validation.surface)
    }

    // Map results to response format
    const responseResults = results.map((r) => ({
      id: r.item.id,
      title: r.item.title,
      description: r.item.description,
      route: r.item.route,
      audience: r.item.audience,
      surface: r.item.surface,
      type: r.item.type,
      score: r.score,
    }))

    return NextResponse.json({
      results: responseResults,
      total: responseResults.length,
    })
  } catch (error) {
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : "Internal server error"

    if (process.env.NODE_ENV === "development") {
      console.error("[Search API] Unexpected error:", error)
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
