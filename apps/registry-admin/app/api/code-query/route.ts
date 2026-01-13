/**
 * General Code Query API Route
 *
 * Searches the entire codebase (not just registry)
 * Supports semantic search across all TypeScript/JavaScript files
 */

import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { glob } from "glob"
import { NextResponse } from "next/server"
import { getMonorepoRoot } from "@/lib/path-resolver"

export const dynamic = "force-dynamic"
export const revalidate = 300 // Revalidate every 5 minutes

interface CodeQueryParams {
  q?: string
  type?: "function" | "class" | "interface" | "type" | "all"
  file?: string
  limit?: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") || "all"
    const filePattern = searchParams.get("file") || "**/*.{ts,tsx,js,jsx}"
    const limit = parseInt(searchParams.get("limit") || "50", 10)

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      )
    }

    const monorepoRoot = getMonorepoRoot()

    // Fix: glob pattern should be relative to cwd, not absolute
    const files = await glob(filePattern, {
      ignore: [
        "**/node_modules/**",
        "**/.next/**",
        "**/dist/**",
        "**/build/**",
        "**/.turbo/**",
      ],
      cwd: monorepoRoot,
      absolute: false,
    })

    const results: Array<{
      file: string
      matches: Array<{
        line: number
        content: string
        type?: string
      }>
    }> = []

    // Search in files
    for (const file of files.slice(0, 100)) {
      // Limit file scanning for performance
      const filePath = join(monorepoRoot, file)

      if (!existsSync(filePath)) continue

      try {
        const content = readFileSync(filePath, "utf-8")
        const lines = content.split("\n")
        const fileMatches: Array<{ line: number; content: string; type?: string }> = []

        lines.forEach((line, index) => {
          const lowerLine = line.toLowerCase()
          const lowerQuery = query.toLowerCase()

          // Simple text matching (can be enhanced with semantic search)
          if (lowerLine.includes(lowerQuery)) {
            // Detect type
            let matchType: string | undefined
            if (line.includes("function ") || line.includes("const ") && line.includes("=>")) {
              matchType = "function"
            } else if (line.includes("class ")) {
              matchType = "class"
            } else if (line.includes("interface ")) {
              matchType = "interface"
            } else if (line.includes("type ") && line.includes("=")) {
              matchType = "type"
            }

            // Filter by type if specified
            if (type !== "all" && matchType !== type) {
              return
            }

            fileMatches.push({
              line: index + 1,
              content: line.trim(),
              type: matchType,
            })
          }
        })

        if (fileMatches.length > 0) {
          results.push({
            file,
            matches: fileMatches.slice(0, 10), // Limit matches per file
          })
        }
      } catch {
        // Skip files that can't be read
        continue
      }

      if (results.length >= limit) break
    }

    return NextResponse.json(
      {
        query,
        results,
        total: results.length,
        searchedFiles: files.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    )
  } catch (error) {
    console.error("Error in code query:", error)
    return NextResponse.json(
      { error: "Failed to query codebase" },
      { status: 500 }
    )
  }
}
