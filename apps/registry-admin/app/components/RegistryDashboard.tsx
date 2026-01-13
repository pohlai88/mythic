"use client"

import { useState } from "react"
import { Search, Code, FileText, Tag, Calendar, Hash, GitBranch } from "lucide-react"
import type { RegistryQueryResponse } from "@/types/registry.types"

interface RegistryDashboardProps {
  data: RegistryQueryResponse
}

type ViewMode = "functions" | "scripts" | "all"
type CategoryFilter = string | "all"

export function RegistryDashboard({ data }: RegistryDashboardProps) {
  const { registry, stats } = data
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("all")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [selectedItem, setSelectedItem] = useState<
    typeof registry.functions[0] | typeof registry.scripts[0] | null
  >(null)

  // Filter functions
  const filteredFunctions = registry.functions.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.filePath.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || f.category === categoryFilter
    const matchesView = viewMode === "functions" || viewMode === "all"
    return matchesSearch && matchesCategory && matchesView
  })

  // Filter scripts
  const filteredScripts = registry.scripts.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.filePath.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || s.category === categoryFilter
    const matchesView = viewMode === "scripts" || viewMode === "all"
    return matchesSearch && matchesCategory && matchesView
  })

  // Get unique categories
  const allCategories = [
    ...new Set([
      ...registry.functions.map((f) => f.category),
      ...registry.scripts.map((s) => s.category),
    ]),
  ].sort()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Function & Script Registry
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last updated: {new Date(registry.lastUpdated).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalItems}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Items</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.totalFunctions}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Functions</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.totalScripts}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Scripts</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search functions and scripts..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* View Mode */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  View Mode
                </label>
                <div className="space-y-2">
                  {(["all", "functions", "scripts"] as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        viewMode === mode
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stats */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Functions:</span>
                    <span className="font-medium">{filteredFunctions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scripts:</span>
                    <span className="font-medium">{filteredScripts.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Functions List */}
            {filteredFunctions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Functions ({filteredFunctions.length})
                </h2>
                <div className="space-y-3">
                  {filteredFunctions.map((func) => (
                    <div
                      key={func.id}
                      onClick={() => setSelectedItem(func)}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {func.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {func.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {func.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {func.filePath}
                            </span>
                            {func.exported && (
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                                Exported
                              </span>
                            )}
                            {func.dependencies.length > 0 && (
                              <span className="flex items-center gap-1">
                                <GitBranch className="h-3 w-3" />
                                {func.dependencies.length} deps
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scripts List */}
            {filteredScripts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Scripts ({filteredScripts.length})
                </h2>
                <div className="space-y-3">
                  {filteredScripts.map((script) => (
                    <div
                      key={script.id}
                      onClick={() => setSelectedItem(script)}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {script.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {script.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {script.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {script.filePath}
                            </span>
                            {script.shebang && (
                              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                                Executable
                              </span>
                            )}
                            {script.dependencies.length > 0 && (
                              <span className="flex items-center gap-1">
                                <GitBranch className="h-3 w-3" />
                                {script.dependencies.length} deps
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredFunctions.length === 0 && filteredScripts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No results found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedItem.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedItem.filePath}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedItem.description}</p>
                </div>

                {"parameters" in selectedItem && selectedItem.parameters.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Parameters
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.parameters.map((param) => (
                        <div
                          key={param.name}
                          className="bg-gray-50 dark:bg-gray-700 p-3 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm text-blue-600 dark:text-blue-400">
                              {param.name}
                            </code>
                            <code className="font-mono text-xs text-gray-500 dark:text-gray-400">
                              {param.type}
                            </code>
                            {param.optional && (
                              <span className="text-xs text-gray-500">optional</span>
                            )}
                          </div>
                          {param.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {param.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {"returnType" in selectedItem && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Returns</h3>
                    <code className="font-mono text-sm text-gray-700 dark:text-gray-300">
                      {selectedItem.returnType}
                    </code>
                  </div>
                )}

                {selectedItem.dependencies.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Dependencies ({selectedItem.dependencies.length})
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.dependencies.map((dep, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{dep.name}</span>
                            <span className="text-gray-500 dark:text-gray-400">({dep.type})</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">{dep.source}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Usage</h3>
                  <code className="block bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm font-mono">
                    {selectedItem.usage || "N/A"}
                  </code>
                </div>

                {selectedItem.examples.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Examples</h3>
                    <div className="space-y-2">
                      {selectedItem.examples.map((example, i) => (
                        <pre
                          key={i}
                          className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto"
                        >
                          <code>{example}</code>
                        </pre>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedItem.lastModified).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    {selectedItem.hash.substring(0, 8)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
