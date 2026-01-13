/**
 * Loading State Component
 *
 * Displays loading indicators for async operations
 * Required by tech debt prevention rules - no placeholder loading states allowed
 */

"use client"

import { Card } from "@mythic/tailwindcss-v4-design-system"
import { cn } from "@mythic/nextjs-shared-utils"
import { spacing, typography, tokens } from "@/src/lib"
import { memo } from "react"

interface LoadingStateProps {
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export const LoadingState = memo(function LoadingState({
  message = "Loading...",
  size = "md",
  className,
}: LoadingStateProps) {
  const sizeStyles = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <Card elevation="sm" className={cn(spacing.cardLarge, "text-center", className)}>
      <div className={cn("flex flex-col items-center", spacing.gap.md)}>
        <div
          className={cn(
            "border-2 border-gold border-t-transparent rounded-full animate-spin",
            sizeStyles[size]
          )}
          role="status"
          aria-label="Loading"
        />
        <p className={cn(typography.body.md, tokens.text.secondary)}>{message}</p>
      </div>
    </Card>
  )
})
