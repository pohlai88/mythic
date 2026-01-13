/**
 * Scroll Memory Hook
 *
 * CONCIERGE FEATURE: Remember and restore scroll position per page.
 * Returns user to their last-read heading when navigating back.
 *
 * DOCTRINE:
 * - Uses sessionStorage (per-session, not permanent)
 * - Throttled scroll listener (performance)
 * - Next.js usePathname for unique key
 * - Content hash validation (prevents jumping to wrong section)
 *
 * Implementation:
 * 1. On scroll: Find topmost visible heading, store its ID + content hash
 * 2. On mount: If stored ID exists AND hash matches, scroll to that heading
 * 3. If hash mismatch (content changed), ignore stored position
 */
"use client"

import { useEffect, useRef, useMemo, useCallback } from "react"
import { usePathname } from "next/navigation"

const SCROLL_STORAGE_PREFIX = "axis-scroll-"
const SCROLL_HASH_PREFIX = "axis-scroll-hash-"
const THROTTLE_MS = 150

/**
 * Generate a simple hash of the heading structure
 * Used to detect if content has changed between visits
 */
function generateContentHash(): string {
  const headings = document.querySelectorAll<HTMLElement>("h1[id], h2[id], h3[id], h4[id]")
  const headingIds = Array.from(headings)
    .map((h) => h.id)
    .join("|")

  // Simple hash: length + first 50 chars + last 50 chars
  // Fast and sufficient for detecting structural changes
  const len = headingIds.length
  const prefix = headingIds.slice(0, 50)
  const suffix = headingIds.slice(-50)

  return `${len}:${prefix}:${suffix}`
}

/**
 * Custom hook for throttled callback
 */
function useThrottledCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number,
  deps: React.DependencyList
): T {
  const lastCall = useRef(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, deps)

  return useMemo(() => {
    return ((...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall.current >= delay) {
        lastCall.current = now
        memoizedCallback(...args)
      }
    }) as T
  }, [memoizedCallback, delay])
}

/**
 * Find the topmost visible heading element
 */
function findTopmostVisibleHeading(): HTMLElement | null {
  const headings = document.querySelectorAll<HTMLElement>("h1[id], h2[id], h3[id], h4[id]")
  const viewportTop = window.scrollY
  const threshold = 100 // Consider "visible" if within 100px of viewport top

  const headingsArray = Array.from(headings)
  let lastVisibleHeading: HTMLElement | null = null

  for (const heading of headingsArray) {
    const rect = heading.getBoundingClientRect()
    const absoluteTop = rect.top + viewportTop

    // Heading is at or above viewport top (with threshold buffer)
    if (absoluteTop <= viewportTop + threshold) {
      lastVisibleHeading = heading
      continue
    }

    // First heading below the threshold - return the last visible one
    break
  }

  // Return last visible heading (could be last one if scrolled to bottom)
  return lastVisibleHeading
}

export function useScrollMemory() {
  const pathname = usePathname()
  const storageKey = `${SCROLL_STORAGE_PREFIX}${pathname}`
  const hashKey = `${SCROLL_HASH_PREFIX}${pathname}`
  const isInitialMount = useRef(true)

  // Throttled scroll handler - saves topmost heading ID + content hash
  const handleScroll = useThrottledCallback(
    () => {
      const heading = findTopmostVisibleHeading()
      if (heading?.id) {
        try {
          sessionStorage.setItem(storageKey, heading.id)
          sessionStorage.setItem(hashKey, generateContentHash())
        } catch {
          // sessionStorage may be unavailable (incognito, etc.)
        }
      }
    },
    THROTTLE_MS,
    [storageKey, hashKey]
  )

  // Restore scroll position on mount (with hash validation)
  useEffect(() => {
    if (!isInitialMount.current) return

    try {
      const savedId = sessionStorage.getItem(storageKey)
      const savedHash = sessionStorage.getItem(hashKey)

      if (savedId) {
        // Validate content hash - if mismatch, content changed, don't restore
        const currentHash = generateContentHash()
        if (savedHash && savedHash !== currentHash) {
          // Content structure changed - clear stale data and skip restore
          sessionStorage.removeItem(storageKey)
          sessionStorage.removeItem(hashKey)
          isInitialMount.current = false
          return
        }

        const element = document.getElementById(savedId)
        if (element) {
          // Delay to ensure content is rendered
          requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
          })
        }
      }
    } catch {
      // sessionStorage may be unavailable
    }

    isInitialMount.current = false
  }, [storageKey, hashKey])

  // Listen for scroll events
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Cleanup on pathname change
  useEffect(() => {
    isInitialMount.current = true
  }, [pathname])
}
