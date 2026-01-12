/**
 * Search API Route
 *
 * API endpoint for search functionality
 * Returns search results from build-time index
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { createFuzzySearch, filterByAudience, filterByModule, search } from '@/lib/search'
import type { SearchIndex } from '@/lib/search/types'
import { NextResponse } from 'next/server'

/**
 * Load search index from public directory
 */
function loadSearchIndex(): SearchIndex[] {
  try {
    const cwd = process.cwd()
    // Determine correct path based on where app is running
    const indexPath = cwd.endsWith('apps/docs')
      ? join(cwd, 'public/search-index.json')
      : join(cwd, 'apps/docs/public/search-index.json')
    const indexData = readFileSync(indexPath, 'utf-8')
    return JSON.parse(indexData) as SearchIndex[]
  } catch {
    // Return empty array if index doesn't exist yet
    return []
  }
}

/**
 * GET /api/search
 *
 * Query parameters:
 * - q: Search query (required)
 * - audience: Filter by audience (optional)
 * - module: Filter by module (optional)
 * - limit: Maximum results (optional, default: 10)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const audience = searchParams.get('audience') as 'developers' | 'users' | 'business' | null
  const module = searchParams.get('module') || undefined
  const limit = Number.parseInt(searchParams.get('limit') || '10', 10)

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
  }

  // Load search index
  const index = loadSearchIndex()
  if (index.length === 0) {
    return NextResponse.json({ results: [] })
  }

  // Create fuzzy search instance
  const fuse = createFuzzySearch(index)

  // Perform search
  let results = search(fuse, query, { limit })

  // Apply filters
  if (audience) {
    results = filterByAudience(results, audience)
  }

  if (module) {
    results = filterByModule(results, module)
  }

  return NextResponse.json({
    results: results.map((r) => ({
      id: r.item.id,
      title: r.item.title,
      description: r.item.description,
      route: r.item.route,
      audience: r.item.audience,
      module: r.item.module,
      type: r.item.type,
      score: r.score,
    })),
    total: results.length,
  })
}
