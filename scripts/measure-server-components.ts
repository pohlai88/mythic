#!/usr/bin/env tsx
/**
 * Measure Server Component Ratio
 *
 * Measures actual rendered route components, not all files.
 * Excludes: utilities, MDX, re-exports, shared components.
 *
 * Target: > 70% of rendered route components are Server Components
 */

import { glob } from "glob"
import { readFileSync } from "fs"
import { join, relative } from "path"

interface ComponentMetric {
  route: string
  serverComponents: number
  clientComponents: number
  ratio: number
  components: {
    file: string
    isServer: boolean
    isClient: boolean
  }[]
}

// Route-level component patterns (rendered in route tree)
const ROUTE_COMPONENT_PATTERNS = [
  /^apps\/.*\/app\/.*\/page\.tsx$/, // Page components
  /^apps\/.*\/app\/.*\/layout\.tsx$/, // Layout components
  /^apps\/.*\/app\/.*\/loading\.tsx$/, // Loading components
  /^apps\/.*\/app\/.*\/error\.tsx$/, // Error components
  /^apps\/.*\/app\/.*\/not-found\.tsx$/, // Not-found components
  /^apps\/.*\/components\/.*\.tsx$/, // Route-specific components
]

// Exclude patterns (utilities, MDX, re-exports, shared)
const EXCLUDE_PATTERNS = [
  /.*\/utils\/.*/, // Utility functions
  /.*\/lib\/.*/, // Library code
  /.*\.mdx$/, // MDX files
  /.*\/index\.ts$/, // Re-exports
  /.*\/index\.tsx$/, // Re-exports
  /.*\.d\.ts$/, // Type definitions
  /.*\/types\/.*/, // Type files
  /.*\/helpers\/.*/, // Helper functions
  /.*\/constants\/.*/, // Constants
  /.*\/hooks\/.*/, // Hooks (usually client)
  /.*\/stores\/.*/, // Stores (client state)
  /.*\/queries\/.*/, // Query hooks (client)
]

function isRouteComponent(filePath: string): boolean {
  if (EXCLUDE_PATTERNS.some((pattern) => pattern.test(filePath))) {
    return false
  }
  return ROUTE_COMPONENT_PATTERNS.some((pattern) => pattern.test(filePath))
}

function isServerComponent(filePath: string): boolean {
  const content = readFileSync(filePath, "utf-8")
  // Server Component if no 'use client' directive
  return !content.includes("'use client'") && !content.includes('"use client"')
}

function isClientComponent(filePath: string): boolean {
  const content = readFileSync(filePath, "utf-8")
  return content.includes("'use client'") || content.includes('"use client"')
}

function extractRoute(filePath: string): string {
  // Extract route from file path
  // apps/boardroom/app/boardroom/page.tsx -> /boardroom
  const match = filePath.match(
    /apps\/[^/]+\/app\/(.+?)\/(page|layout|loading|error|not-found)\.tsx$/
  )
  if (match) {
    return `/${match[1]}`
  }

  // Component files: apps/boardroom/components/PoolTable.tsx -> /boardroom/components
  const componentMatch = filePath.match(/apps\/[^/]+\/(components|app)\/(.+?)\.tsx$/)
  if (componentMatch) {
    return `/${componentMatch[2]}`
  }

  return filePath
}

async function measureRouteComponents(): Promise<ComponentMetric[]> {
  const files = await glob("apps/**/*.{ts,tsx}", {
    ignore: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
    ],
  })

  const routeMap = new Map<string, ComponentMetric>()

  for (const file of files) {
    if (!isRouteComponent(file)) {
      continue
    }

    const route = extractRoute(file)
    const isServer = isServerComponent(file)
    const isClient = isClientComponent(file)

    if (!routeMap.has(route)) {
      routeMap.set(route, {
        route,
        serverComponents: 0,
        clientComponents: 0,
        ratio: 0,
        components: [],
      })
    }

    const metric = routeMap.get(route)!

    if (isServer) {
      metric.serverComponents++
    } else if (isClient) {
      metric.clientComponents++
    }

    metric.components.push({
      file,
      isServer,
      isClient,
    })
  }

  // Calculate ratios
  const results: ComponentMetric[] = []
  for (const metric of routeMap.values()) {
    const total = metric.serverComponents + metric.clientComponents
    metric.ratio = total > 0 ? metric.serverComponents / total : 0
    results.push(metric)
  }

  return results.sort((a, b) => b.ratio - a.ratio)
}

async function main() {
  const metrics = await measureRouteComponents()

  const totalServer = metrics.reduce((sum, m) => sum + m.serverComponents, 0)
  const totalClient = metrics.reduce((sum, m) => sum + m.clientComponents, 0)
  const overallRatio = totalServer + totalClient > 0 ? totalServer / (totalServer + totalClient) : 0

  console.log("\n📊 Server Component Ratio Measurement\n")
  console.log(`Total Routes Analyzed: ${metrics.length}`)
  console.log(`Total Server Components: ${totalServer}`)
  console.log(`Total Client Components: ${totalClient}`)
  console.log(`Overall Ratio: ${(overallRatio * 100).toFixed(1)}%`)
  console.log(`Target: > 70%\n`)

  if (overallRatio >= 0.7) {
    console.log("✅ Target met: Server Component ratio > 70%\n")
  } else {
    console.log(
      `⚠️  Target not met: Server Component ratio is ${(overallRatio * 100).toFixed(1)}%\n`
    )
  }

  console.log("Route-level breakdown:\n")
  metrics.forEach((metric) => {
    const status = metric.ratio >= 0.7 ? "✅" : "⚠️"
    console.log(`${status} ${metric.route}`)
    console.log(
      `   Server: ${metric.serverComponents}, Client: ${metric.clientComponents}, Ratio: ${(metric.ratio * 100).toFixed(1)}%`
    )
  })

  console.log("\n")

  // Exit with error if target not met
  if (overallRatio < 0.7) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Measurement error:", error)
  process.exit(1)
})
