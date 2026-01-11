/**
 * API Documentation Page (App Router)
 * Migrated from pages/api-docs.tsx
 *
 * Displays interactive Swagger UI for API documentation
 * Auto-generated from Zod schemas
 */

'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamically import Swagger UI (client-side only)
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load OpenAPI spec
    fetch('/openapi.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load OpenAPI specification')
        }
        return res.json()
      })
      .then((data) => {
        setSpec(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold">Loading API Documentation...</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Generating from Zod schemas...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold text-red-600">Error Loading Documentation</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{error}</div>
          <div className="mt-4 text-xs text-gray-500">
            Run{' '}
            <code className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">
              pnpm generate:api-docs
            </code>{' '}
            to generate the OpenAPI spec
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">API Documentation</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Auto-generated from Zod schemas • Always up-to-date
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8">{spec && <SwaggerUI spec={spec} />}</div>
    </div>
  )
}
