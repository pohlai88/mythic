/**
 * App Providers
 *
 * Central provider setup for:
 * - TanStack Query (server state management)
 * - Other global providers
 *
 * Note: Client state (UI, form state) should use Zustand, not TanStack Query.
 */

"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: How long data is considered fresh
            staleTime: 30 * 1000, // 30 seconds (frequent updates for decision engine)
            // Garbage collection time: How long unused data stays in cache
            gcTime: 5 * 60 * 1000, // 5 minutes
            // Retry failed requests once
            retry: 1,
            // Refetch on window focus (good for real-time decision updates)
            refetchOnWindowFocus: true,
            // Refetch on reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools only in development */}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
