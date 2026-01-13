/**
 * App Providers
 *
 * Client-side providers for documentation app
 *
 * Provides:
 * - TanStack Query (React Query) for server state management
 * - Theme provider (next-themes) for dark mode
 *
 * Performance Optimizations:
 * - QueryClient created once per app instance (useState lazy init)
 * - ReactQueryDevtools only loaded in development
 * - Optimized query defaults for documentation app
 *
 * Note: React Query is configured but not currently used.
 * Ready for future implementation of search, analytics, or other data fetching.
 */

"use client"

import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import { useState, type ReactNode } from "react"

// Lazy load ReactQueryDevtools (only in development, reduces production bundle)
const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then((mod) => ({
      default: mod.ReactQueryDevtools,
    })),
  { ssr: false }
)

// Query configuration constants
const QUERY_CONFIG = {
  // Stale time: How long data is considered fresh (1 minute for docs)
  staleTime: 60 * 1000,
  // Garbage collection time: How long unused data stays in cache (5 minutes)
  gcTime: 5 * 60 * 1000,
  // Retry failed requests once (fail fast for documentation)
  retry: 1,
  // Don't refetch on window focus (docs are relatively static)
  refetchOnWindowFocus: false,
  // Refetch on reconnect (good for offline scenarios)
  refetchOnReconnect: true,
} as const

/**
 * Create QueryClient with optimized defaults for documentation app
 *
 * Configuration is optimized for:
 * - Static/semi-static content (documentation)
 * - Minimal network requests
 * - Fast fail on errors
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_CONFIG.staleTime,
        gcTime: QUERY_CONFIG.gcTime,
        retry: QUERY_CONFIG.retry,
        refetchOnWindowFocus: QUERY_CONFIG.refetchOnWindowFocus,
        refetchOnReconnect: QUERY_CONFIG.refetchOnReconnect,
        // Network mode: prefer online, fallback to cache
        networkMode: "online",
      },
      mutations: {
        // Retry failed mutations once
        retry: QUERY_CONFIG.retry,
        // Network mode: prefer online
        networkMode: "online",
      },
    },
  })
}

interface ProvidersProps {
  children: ReactNode
}

/**
 * Root Providers Component
 *
 * Wraps app with necessary client-side providers:
 * 1. QueryClientProvider - React Query for server state
 * 2. ThemeProvider - Dark mode theme management
 *
 * Note: Providers are client components but children can be server components
 */
export function Providers({ children }: ProvidersProps) {
  // Lazy initialization: QueryClient created only once per app instance
  // This prevents recreation on every render
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
      </ThemeProvider>
      {/* Devtools only in development (lazy loaded, reduces production bundle size) */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
