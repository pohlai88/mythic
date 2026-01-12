/**
 * API Documentation Page (App Router)
 * Migrated from pages/api-docs.tsx
 *
 * Displays interactive Swagger UI for API documentation
 * Auto-generated from Zod schemas
 * Enhanced with Tailwind Intelligence-driven styling
 */

'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import {
  intelligentStatusStyles,
  intelligentButtonStyles,
  intelligentTransitionStyles,
} from '@mythic/shared-utils'

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

  // Use intelligence-driven styling
  const loadingStyles = intelligentStatusStyles('LISTENING', 'border')
  const errorStyles = intelligentStatusStyles('VETOED', 'border')
  const transitionStyles = intelligentTransitionStyles('illuminate')

  if (loading) {
    return (
      <div
        className={`
          flex min-h-screen items-center justify-center
          px-4 py-8 sm:py-12
          ${transitionStyles}
        `}
        role="status"
        aria-label="Loading API documentation"
      >
        <div
          className={`
            w-full max-w-md rounded-lg border
            p-6 sm:p-8
            ${loadingStyles}
            bg-obsidian/50
          `}
        >
          <div className="text-center">
            <div className="mb-4 text-base sm:text-lg md:text-xl font-serif font-semibold text-parchment">
              Loading API Documentation...
            </div>
            <div className="text-xs sm:text-sm text-ash">
              Generating from Zod schemas...
            </div>
            {/* Loading skeleton */}
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-charcoal/30" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-charcoal/30" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-charcoal/30" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`
          flex min-h-screen items-center justify-center
          px-4 py-8 sm:py-12
          ${transitionStyles}
        `}
        role="alert"
        aria-label="Error loading API documentation"
      >
        <div
          className={`
            w-full max-w-md rounded-lg border
            p-6 sm:p-8
            ${errorStyles}
            bg-obsidian/50
          `}
        >
          <div className="text-center">
            <div className="mb-4 text-base sm:text-lg md:text-xl font-serif font-semibold text-error-600 dark:text-error-400">
              Error Loading Documentation
            </div>
            <div className="mb-4 text-xs sm:text-sm text-ash">{error}</div>
            <div className="mt-4 text-xs sm:text-sm text-ash">
              Run{' '}
              <code
                className="
                  rounded-xs bg-void px-2 py-1 font-mono text-parchment
                  border border-charcoal
                "
              >
                pnpm generate:api-docs
              </code>{' '}
              to generate the OpenAPI spec
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void text-parchment">
      {/* Header - ELITE: Full responsive design */}
      <div className="border-b border-charcoal bg-obsidian px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-serif text-xl font-bold text-parchment sm:text-2xl md:text-3xl">
            API Documentation
          </h1>
          <p className="mt-1 text-xs text-ash sm:text-sm md:text-base">
            Auto-generated from Zod schemas • Always up-to-date
          </p>
        </div>
      </div>
      {/* Content - ELITE: Responsive padding and overflow handling */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
        <div className="overflow-x-auto">
          {spec && <SwaggerUI spec={spec} />}
        </div>
      </div>
    </div>
  )
}
