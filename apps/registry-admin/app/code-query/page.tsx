"use client"

import { useState } from "react"
import { Search, Code, FileText, Filter } from "lucide-react"

interface CodeQueryResult {
  query: string
  results: Array<{
    file: string
    matches: Array<{
      line: number
      content: string
      type?: string
    }>
  }>
  total: number
  searchedFiles: number
}

export default function CodeQueryPage() {
  const [query, setQuery] = useState("")
  const [type, setType] = useState<"function" | "class" | "interface" | "type" | "all">("all")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<CodeQueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        q: query,
        type,
        limit: "50",
      })

      const response = await fetch(`/api/code-query?${params}`)

      if (!response.ok) {
        throw new Error("Failed to search codebase")
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            General Code Query
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Search across the entire codebase
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search codebase (e.g., 'validate', 'createUser', 'interface')..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="function">Functions</option>
                <option value="class">Classes</option>
                <option value="interface">Interfaces</option>
                <option value="type">Types</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Found {results.total} file(s) with matches (searched {results.searchedFiles} files)
            </div>

            <div className="space-y-4">
              {results.results.map((result, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                      {result.file}
                    </code>
                  </div>

                  <div className="space-y-2">
                    {result.matches.map((match, matchIdx) => (
                      <div
                        key={matchIdx}
                        className="bg-gray-50 dark:bg-gray-700 rounded p-3 flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 w-12 text-right text-xs text-gray-500 dark:text-gray-400">
                          {match.line}
                        </div>
                        <div className="flex-1">
                          {match.type && (
                            <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs mb-1">
                              {match.type}
                            </span>
                          )}
                          <code className="text-sm font-mono text-gray-900 dark:text-gray-100 block">
                            {match.content}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && !error && (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Enter a search query to search the codebase
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
