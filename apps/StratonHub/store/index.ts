/**
 * Store Barrel Export
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️  CLIENT-ONLY STORES (RFC-2119 MANDATORY)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ALL stores in this directory are CLIENT-ONLY.
 *
 * ❌ NEVER import from:
 *    - Server Components (RSC)
 *    - generateMetadata
 *    - generateStaticParams
 *    - Route handlers (app/api/*)
 *
 * ✅ ONLY import from:
 *    - 'use client' components
 *    - Client-side hooks
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * DOCTRINE: Zustand for ephemeral UI state only.
 * - useReaderPrefs: Reading preferences (width, scale, code wrap)
 *
 * Server state lives in TanStack Query.
 * UI state lives here.
 */

export { useReaderPrefs } from "./use-reader-prefs"
