/**
 * Error State Component
 *
 * Displays error states for failed operations
 * Required by tech debt prevention rules - proper error handling required
 */

"use client"

import { Card } from "@mythic/tailwindcss-v4-design-system"
import { cn, intelligentStatusStyles } from "@mythic/nextjs-shared-utils"
import { tokens, buttons } from "@/src/lib"
import { memo } from "react"
import { EmptyState } from "./EmptyState"

interface ErrorStateProps {
  title?: string
  message: string
  error?: Error | unknown
  onRetry?: () => void
  className?: string
}

export const ErrorState = memo(function ErrorState({
  title = "Something went wrong",
  message,
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : String(error || message)

  return (
    <EmptyState
      title={title}
      description={errorMessage}
      variant="error"
      icon={
        <svg className="w-12 h-12 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      }
      action={
        onRetry ? (
          <button
            onClick={onRetry}
            className={intelligentStatusStyles(
              "VETOED",
              "badge",
              cn(buttons.small, "transition-hover-intelligent")
            )}
          >
            Retry
          </button>
        ) : undefined
      }
      className={className}
    />
  )
})
