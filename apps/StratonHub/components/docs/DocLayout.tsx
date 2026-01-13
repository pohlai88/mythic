/**
 * DocLayout - Reading Mode Memory
 *
 * Client component that applies reader preferences via data-attributes.
 *
 * HYDRATION-SAFE PATTERN:
 * - Uses data-attributes instead of conditional rendering
 * - CSS handles layout changes instantly (no flash)
 * - Zustand hydrates after mount (no mismatch)
 *
 * DOCTRINE: Don't use conditional rendering for preferences.
 * Map state to data-attributes, let CSS do the work.
 */
"use client"

import { useEffect } from "react"
import { useReaderPrefs } from "@/store/use-reader-prefs"

interface DocLayoutProps {
  children: React.ReactNode
}

export function DocLayout({ children }: DocLayoutProps) {
  const { width, scale, codeWrap } = useReaderPrefs()

  // Hydrate Zustand store on mount (SSR safe)
  useEffect(() => {
    useReaderPrefs.persist.rehydrate()
  }, [])

  return (
    <main
      data-width={width}
      data-scale={scale}
      data-code-wrap={codeWrap}
      className="doc-layout transition-[max-width,font-size] duration-[800ms] ease-[var(--ease-gravity)]"
    >
      {children}
    </main>
  )
}
