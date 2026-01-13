/**
 * Command Palette — StratonHub
 *
 * Cmd+K palette for canonical search.
 * Uses cmdk: https://cmdk.paco.me/
 *
 * Performance Optimizations:
 * - Memoized callbacks and computed values
 * - Debounced search requests (250ms)
 * - Pre-computed className variants
 * - Tailwind v4 token syntax
 * - Early return when closed
 */

"use client"

import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { cn } from "@mythic/nextjs-shared-utils"
import type { Audience, DiataxisType } from "@/lib/search/types"

// Search result interface (matches API response)
interface SearchResult {
  id: string
  title: string
  description?: string
  route: string
  audience: Audience
  surface?: string
  type: DiataxisType
  score?: number
}

// Display result with computed labels
interface DisplayResult extends SearchResult {
  role: string
  typeDisplay: string
  surfaceDisplay: string
}

// Constants
const SEARCH_DEBOUNCE_MS = 250
const SEARCH_LIMIT = 10

// Label mapping functions (pure, can be extracted)
const AUDIENCE_ROLES: Record<Audience, string> = {
  users: "Operator",
  developers: "Architect",
  business: "Sovereign",
} as const

const DIATAXIS_LABELS: Record<DiataxisType, string> = {
  tutorial: "Induction",
  "how-to": "Protocol",
  reference: "Codex",
  explanation: "Doctrine",
} as const

/**
 * Get audience role label
 */
function audienceRoleLabel(audience: Audience): string {
  return AUDIENCE_ROLES[audience]
}

/**
 * Get Diataxis type label
 */
function typeLabel(type: DiataxisType): string {
  return DIATAXIS_LABELS[type]
}

/**
 * Format surface name (slug → title case)
 */
function surfaceLabel(surface?: string): string {
  if (!surface) return ""
  const s = surface.replace(/-/g, " ").trim()
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : ""
}

// Pre-computed className variants
const commandClasses = [
  "overflow-hidden",
  "border border-(--color-divider) bg-(--color-surface)",
  "shadow-(--shadow-soft)",
]

const inputClasses = [
  "flex h-12 w-full bg-transparent",
  "text-(--color-text) placeholder:text-(--color-muted)",
  "outline-none text-sm",
]

const itemBaseClasses = [
  "cursor-pointer outline-none",
  "border border-transparent",
  "px-3 py-3",
  "transition-colors",
]

const itemSelectedClasses = [
  "aria-selected:border-(--color-accent)",
  "aria-selected:bg-(--color-surface)",
  "hover:border-(--color-divider)",
  "hover:bg-(--color-surface)",
]

const badgeClasses = [
  "border border-(--color-divider)",
  "bg-(--color-bg)",
  "px-2 py-0.5 text-xs",
  "text-(--color-muted)",
  "rounded-none",
]

export function CommandPalette() {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // Memoized trimmed query
  const trimmedQuery = useMemo(() => query.trim(), [query])
  const hasQuery = trimmedQuery.length > 0

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to toggle
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
      // Escape to close
      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  // Prevent background scroll when open
  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  // Search when query changes (debounced)
  useEffect(() => {
    if (!open || !hasQuery) {
      setResults([])
      return
    }

    let cancelled = false

    const performSearch = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}&limit=${SEARCH_LIMIT}`
        )

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`)
        }

        const data = (await response.json()) as { results?: SearchResult[] }

        if (!cancelled) {
          setResults(data.results || [])
        }
      } catch (error) {
        if (!cancelled) {
          console.error("[CommandPalette] Search error:", error)
          setResults([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    const timeoutId = setTimeout(performSearch, SEARCH_DEBOUNCE_MS)
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [trimmedQuery, open, hasQuery])

  // Memoized handle select callback
  const handleSelect = useCallback(
    (route: string) => {
      router.push(route)
      setOpen(false)
      setQuery("")
    },
    [router]
  )

  // Memoized display results with computed labels
  const displayResults = useMemo<DisplayResult[]>(() => {
    return results.map((r) => ({
      ...r,
      role: audienceRoleLabel(r.audience),
      typeDisplay: typeLabel(r.type),
      surfaceDisplay: surfaceLabel(r.surface),
    }))
  }, [results])

  // Early return when closed (performance optimization)
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh]"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search StratonHub documentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-(--color-bg) opacity-85"
        style={{
          background: "color-mix(in oklab, var(--color-bg) 55%, black)",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <Command className={cn(...commandClasses)}>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-(--color-divider) px-4">
            <div className="micro-status py-4">
              <span className="opacity-80">StratonHub</span>
            </div>

            <Command.Input
              placeholder="Search the canon…"
              value={query}
              onValueChange={setQuery}
              className={cn(...inputClasses)}
              autoFocus
              aria-label="Search query input"
            />

            <kbd
              className="pointer-events-none hidden md:inline-flex h-6 select-none items-center gap-1 border border-(--color-divider) bg-(--color-bg) px-2 font-mono text-[10px] font-medium text-(--color-muted)"
              aria-label="Keyboard shortcut"
            >
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          {/* List */}
          <Command.List className="max-h-[420px] overflow-y-auto p-2">
            {loading && (
              <Command.Loading>
                <div className="py-6 text-center text-sm text-(--color-muted)">Searching…</div>
              </Command.Loading>
            )}

            {!loading && hasQuery && displayResults.length === 0 && (
              <Command.Empty className="py-6 text-center text-sm text-(--color-muted)">
                No results found.
              </Command.Empty>
            )}

            {!loading && !hasQuery && (
              <Command.Empty className="py-6 text-center text-sm text-(--color-muted)">
                Type to search the canon…
              </Command.Empty>
            )}

            {!loading &&
              displayResults.map((result) => (
                <Command.Item
                  key={result.id}
                  value={result.title}
                  onSelect={() => handleSelect(result.route)}
                  className={cn(...itemBaseClasses, ...itemSelectedClasses)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-(--color-text)">{result.title}</span>
                    <span className="micro-status opacity-70" aria-label={result.role}>
                      {result.role}
                    </span>
                  </div>

                  {result.description && (
                    <div className="mt-1 text-xs text-(--color-muted) line-clamp-1">
                      {result.description}
                    </div>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {result.surfaceDisplay && (
                      <span className={cn(...badgeClasses)}>{result.surfaceDisplay}</span>
                    )}
                    <span className={cn(...badgeClasses)}>{result.typeDisplay}</span>
                  </div>
                </Command.Item>
              ))}
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
