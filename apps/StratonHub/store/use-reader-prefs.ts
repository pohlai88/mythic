/**
 * Reader Preferences Store
 *
 * Zustand store for persisting reading preferences:
 * - Content width (prose-centered vs axis-wide)
 * - Font scale (normal vs relaxed for accessibility)
 * - Code wrap preference
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  CLIENT-ONLY ENFORCEMENT (RFC-2119 MANDATORY)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * RULE: Zustand stores are CLIENT-ONLY. NEVER import into Server Components.
 *
 * ❌ FORBIDDEN:
 *    - Importing this store in RSC (Server Components)
 *    - Reading store state during server render
 *    - Using store values in generateMetadata or generateStaticParams
 *
 * ✅ ALLOWED:
 *    - Import only in 'use client' components
 *    - Read state only after useEffect mount
 *    - Use skipHydration pattern (already configured)
 *
 * WHY: Zustand with persist uses localStorage which is browser-only.
 *      Server render has no localStorage → hydration mismatch → broken UI.
 *
 * ADVISORY: Reader preferences affect PRESENTATION only, never STRUCTURE.
 *           Content must never conditionally render based on these prefs.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * DOCTRINE: Zustand for ephemeral UI state only.
 * These are user preferences, not server state.
 *
 * Hydration-Safe Pattern:
 * - Store provides state via data-attributes
 * - CSS handles the layout changes (no conditional rendering)
 * - Prevents layout shift on hydration
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

type ContentWidth = "prose" | "axis"
type FontScale = "normal" | "relaxed"

interface ReaderPrefsState {
  // Layout preferences
  width: ContentWidth
  scale: FontScale
  codeWrap: boolean

  // Actions
  toggleWidth: () => void
  toggleScale: () => void
  setCodeWrap: (wrap: boolean) => void
  reset: () => void
}

const DEFAULT_PREFS = {
  width: "axis" as ContentWidth,
  scale: "normal" as FontScale,
  codeWrap: false,
}

export const useReaderPrefs = create<ReaderPrefsState>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFS,

      toggleWidth: () =>
        set((state) => ({
          width: state.width === "axis" ? "prose" : "axis",
        })),

      toggleScale: () =>
        set((state) => ({
          scale: state.scale === "normal" ? "relaxed" : "normal",
        })),

      setCodeWrap: (wrap) => set({ codeWrap: wrap }),

      reset: () => set(DEFAULT_PREFS),
    }),
    {
      name: "axis-reader-prefs",
      // Only persist on client (SSR safe)
      skipHydration: true,
    }
  )
)
