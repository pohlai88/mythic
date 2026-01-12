/**
 * Search Index Types
 *
 * Type definitions for search indexing and fuzzy search
 */

export interface SearchIndex {
  id: string
  title: string
  description?: string
  content: string
  route: string
  audience: 'developers' | 'users' | 'business'
  module?: string
  type?: 'tutorial' | 'how-to' | 'reference' | 'explanation'
}

export interface SearchResult {
  item: SearchIndex
  score?: number
  matches?: Array<{
    key: string
    value: string
    indices: Array<[number, number]>
  }>
}

export interface SearchOptions {
  limit?: number
  threshold?: number
  minMatchCharLength?: number
}
