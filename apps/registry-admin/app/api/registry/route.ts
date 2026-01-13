/**
 * Registry API Route
 *
 * Serves the function and script registry data
 * Uses dynamic path resolution (no hardcoding)
 * Optimized for TanStack Query
 */

import { readFileSync } from "node:fs"
import { NextResponse } from "next/server"
import { getRegistryFilePath, registryFileExists } from "@/lib/path-resolver"
import { FunctionRegistrySchema } from "@/types/registry.types"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  try {
    // Dynamic path resolution
    const registryPath = getRegistryFilePath()
    const exists = registryFileExists()

    // Debug logging
    console.log("Registry path:", registryPath)
    console.log("Registry exists:", exists)
    console.log("CWD:", process.cwd())

    if (!exists) {
      return NextResponse.json(
        {
          error: "Registry not found",
          message: "Run 'pnpm registry:scan' first",
          path: registryPath,
          cwd: process.cwd(),
        },
        { status: 404 }
      )
    }

    // Read and parse registry
    const registryContent = readFileSync(registryPath, "utf-8")
    const registryData = JSON.parse(registryContent)

    // Contract-first: Validate with Zod schema (safeParse for external data)
    const result = FunctionRegistrySchema.safeParse(registryData)
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid registry data",
          message: result.error.message,
        },
        { status: 500 }
      )
    }
    const registry = result.data

    // Calculate stats
    const stats = {
      totalItems: registry.functions.length + registry.scripts.length,
      totalFunctions: registry.functions.length,
      totalScripts: registry.scripts.length,
      categories: {
        ...registry.functions.reduce((acc, f) => {
          acc[f.category] = (acc[f.category] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        ...registry.scripts.reduce((acc, s) => {
          acc[s.category] = (acc[s.category] || 0) + 1
          return acc
        }, {} as Record<string, number>),
      },
      tags: {
        ...registry.functions.reduce((acc, f) => {
          f.tags.forEach((tag) => {
            acc[tag] = (acc[tag] || 0) + 1
          })
          return acc
        }, {} as Record<string, number>),
        ...registry.scripts.reduce((acc, s) => {
          s.tags.forEach((tag) => {
            acc[tag] = (acc[tag] || 0) + 1
          })
          return acc
        }, {} as Record<string, number>),
      },
      lastUpdated: registry.lastUpdated,
    }

    return NextResponse.json(
      { registry, stats },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    )
  } catch (error) {
    console.error("Error reading registry:", error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to read registry",
          message: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Failed to read registry" },
      { status: 500 }
    )
  }
}
