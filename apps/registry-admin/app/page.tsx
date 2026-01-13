"use client"

import Link from "next/link"
import { Code, Database, Search } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Registry Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage and explore your codebase registry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Registry Dashboard */}
          <Link
            href="/registry"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Registry Dashboard
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Browse functions and scripts
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              View and search the function and script registry with detailed metadata,
              dependencies, and usage information.
            </p>
          </Link>

          {/* Code Query */}
          <Link
            href="/code-query"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Code Query
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Search entire codebase
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Search across all TypeScript/JavaScript files in the codebase.
              Find functions, classes, interfaces, and more.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
