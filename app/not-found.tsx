/**
 * Not Found Page (App Router)
 * Migrated from pages/404.tsx
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        {/* 404 Number */}
        <h1 className="mb-4 text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>

        {/* Error Message */}
        <h2 className="mb-4 text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Page Not Found
        </h2>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Go to Homepage
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <p className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            Popular Pages:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              Home
            </Link>
            <Link
              href="/features"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Features
            </Link>
            <Link
              href="/api-example"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              API Reference
            </Link>
            <Link
              href="/about"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              About
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Try searching for what you need:
          </p>
          <div className="flex items-center justify-center">
            <kbd className="rounded border border-gray-300 bg-gray-100 px-3 py-1 text-sm font-mono text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
              Cmd/Ctrl + K
            </kbd>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">to open search</span>
          </div>
        </div>
      </div>
    </div>
  )
}
