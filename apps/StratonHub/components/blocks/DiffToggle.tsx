/**
 * DiffToggle - Diff/Clean Code Toggle
 *
 * CONCIERGE FEATURE: For migration and update documentation.
 * - "Diff" view shows what changed (red/green lines)
 * - "Clean" view shows the final code only
 * - Respects user intent: understand vs. implement
 */
"use client"

import { useState } from "react"
import { cn } from "@mythic/nextjs-shared-utils"

interface DiffToggleProps {
  diffContent: string
  newContent: string
  language?: string
  filename?: string
}

export function DiffToggle({ diffContent, newContent, language, filename }: DiffToggleProps) {
  const [showDiff, setShowDiff] = useState(true)

  return (
    <div className="relative">
      {/* Header with filename and toggle */}
      <div className="flex items-center justify-between px-4 py-2 bg-charcoal border border-divider border-b-0">
        {filename && <span className="font-mono text-micro text-muted">{filename}</span>}
        {!filename && <span />}

        <div className="flex gap-2">
          <button
            onClick={() => setShowDiff(true)}
            className={cn("btn-axis text-micro", showDiff ? "opacity-100" : "opacity-50")}
            aria-pressed={showDiff}
          >
            Diff
          </button>
          <button
            onClick={() => setShowDiff(false)}
            className={cn("btn-axis text-micro", !showDiff ? "opacity-100" : "opacity-50")}
            aria-pressed={!showDiff}
          >
            Clean
          </button>
        </div>
      </div>

      {/* Code block */}
      <pre className="bg-surface border border-divider border-t-0 p-6 overflow-x-auto font-mono text-sm">
        {showDiff ? (
          <code className="block">
            {diffContent.split("\n").map((line, i) => (
              <span
                key={i}
                className={cn(
                  "block",
                  line.startsWith("+") &&
                    !line.startsWith("+++") &&
                    "bg-emerald-500/10 text-emerald-400",
                  line.startsWith("-") && !line.startsWith("---") && "bg-ember/10 text-ember"
                )}
              >
                {line}
              </span>
            ))}
          </code>
        ) : (
          <code className="block text-parchment">{newContent}</code>
        )}
      </pre>
    </div>
  )
}
