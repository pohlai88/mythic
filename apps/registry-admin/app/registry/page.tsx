"use client"

import { useRegistry } from "@/hooks/use-registry"
import { RegistryDashboard } from "../components/RegistryDashboard"

export default function RegistryPage() {
  const { data, isLoading, error } = useRegistry()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading registry...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Registry Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : "Registry not found"}
          </p>
          <code className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded block text-sm">
            pnpm registry:scan
          </code>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No registry data available</p>
        </div>
      </div>
    )
  }

  return <RegistryDashboard data={data} />
}
