/**
 * TanStack Query Hooks for Registry
 *
 * Provides type-safe data fetching with caching and refetching
 */

import { useQuery } from "@tanstack/react-query"
import type { FunctionRegistry, RegistryQueryResponse } from "../types/registry.types"

const REGISTRY_QUERY_KEY = ["registry"] as const

/**
 * Fetch registry data
 */
async function fetchRegistry(): Promise<RegistryQueryResponse> {
  const response = await fetch("/api/registry")

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to fetch registry")
  }

  return response.json()
}

/**
 * Hook to fetch registry data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useRegistry()
 * ```
 */
export function useRegistry() {
  return useQuery({
    queryKey: REGISTRY_QUERY_KEY,
    queryFn: fetchRegistry,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  })
}

/**
 * Hook to get registry stats
 */
export function useRegistryStats() {
  const { data } = useRegistry()

  return {
    stats: data?.stats,
    isLoading: !data,
  }
}

/**
 * Hook to get functions
 */
export function useRegistryFunctions() {
  const { data } = useRegistry()

  return {
    functions: data?.registry.functions ?? [],
    isLoading: !data,
  }
}

/**
 * Hook to get scripts
 */
export function useRegistryScripts() {
  const { data } = useRegistry()

  return {
    scripts: data?.registry.scripts ?? [],
    isLoading: !data,
  }
}
