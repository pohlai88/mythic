/**
 * CodeBlock - White-Glove Clipboard
 *
 * CONCIERGE FEATURE: Copies clean code without terminal prompts or line numbers.
 * - Strips $ % > prompts from bash/shell
 * - Strips line numbers if present
 * - User pastes exactly what they need to run
 */
"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@mythic/nextjs-shared-utils"

interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
}

export function CodeBlock({ children, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const cleanCode = useCallback(
    (code: string): string => {
      let cleaned = code

      // Strip terminal prompts for shell languages
      if (language === "bash" || language === "sh" || language === "shell" || language === "zsh") {
        cleaned = cleaned
          .split("\n")
          .map((line) => line.replace(/^[\$%>]\s*/, ""))
          .join("\n")
      }

      // Strip line numbers if present (format: "  1 | code" or "1| code")
      cleaned = cleaned
        .split("\n")
        .map((line) => line.replace(/^\s*\d+\s*\|\s*/, ""))
        .join("\n")

      return cleaned.trim()
    },
    [language]
  )

  const handleCopy = useCallback(async () => {
    const cleaned = cleanCode(children)
    await navigator.clipboard.writeText(cleaned)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [children, cleanCode])

  return (
    <div className="relative group">
      {/* Filename header */}
      {filename && (
        <div className="flex items-center gap-2 px-4 py-2 bg-charcoal border border-divider border-b-0 font-mono text-micro text-muted">
          <span>{filename}</span>
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={cn(
          "absolute right-4 top-4 z-10 btn-axis text-micro opacity-0 group-hover:opacity-100 transition-opacity duration-700",
          copied && "text-emerald-400"
        )}
        aria-label="Copy code"
      >
        {copied ? "Copied" : "Copy"}
      </button>

      {/* Code block */}
      <pre
        ref={preRef}
        className={cn(
          "bg-surface border border-divider p-6 overflow-x-auto font-mono text-sm text-parchment",
          filename && "border-t-0"
        )}
      >
        <code>{children}</code>
      </pre>
    </div>
  )
}
