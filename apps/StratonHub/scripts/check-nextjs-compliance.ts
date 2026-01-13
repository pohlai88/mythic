/**
 * Next.js Compliance Check Script — StratonHub
 *
 * Validates that routing follows Next.js App Router best practices.
 * Checks required files, route structure, and App Router conventions.
 *
 * Performance Optimizations:
 * - Efficient file system operations
 * - Early exit on critical errors
 * - Clear error reporting
 *
 * Reference: https://nextjs.org/docs/app
 *
 * Usage:
 * ```bash
 * pnpm docs:check-nextjs
 * ```
 */

import { existsSync } from "fs"
import { join } from "path"

// ============================================================================
// Constants
// ============================================================================

/**
 * Required root-level files in app directory
 */
const REQUIRED_ROOT_FILES = ["layout.tsx", "page.tsx"] as const

/**
 * Required audience directories
 */
const REQUIRED_AUDIENCES = ["developers", "users", "business"] as const

/**
 * Route group name for audiences
 */
const AUDIENCES_ROUTE_GROUP = "(audiences)"

// ============================================================================
// Path Resolution
// ============================================================================

/**
 * Get app directory path
 *
 * Handles both monorepo root and standalone execution contexts.
 *
 * @returns Path to app directory or null if not found
 */
function getAppDirectory(): string | null {
  const cwd = process.cwd()

  // Try from current directory (apps/StratonHub)
  const localAppDir = join(cwd, "app")
  if (existsSync(localAppDir)) {
    return localAppDir
  }

  // Try from monorepo root
  const monorepoAppDir = join(cwd, "apps/StratonHub/app")
  if (existsSync(monorepoAppDir)) {
    return monorepoAppDir
  }

  // Not found
  return null
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Check for required root-level files
 *
 * @param appDir - Path to app directory
 * @returns Array of error messages (empty if all files exist)
 */
function checkRequiredFiles(appDir: string): string[] {
  const errors: string[] = []

  for (const file of REQUIRED_ROOT_FILES) {
    const filePath = join(appDir, file)
    if (!existsSync(filePath)) {
      errors.push(`Missing required file: app/${file}`)
    }
  }

  return errors
}

/**
 * Check route group structure
 *
 * @param appDir - Path to app directory
 * @returns Array of error messages (empty if structure is valid)
 */
function checkRouteGroupStructure(appDir: string): string[] {
  const errors: string[] = []
  const audiencesDir = join(appDir, AUDIENCES_ROUTE_GROUP)

  if (!existsSync(audiencesDir)) {
    errors.push(`Route group ${AUDIENCES_ROUTE_GROUP}/ does not exist`)
    return errors // Early exit if route group doesn't exist
  }

  // Check each required audience directory
  for (const audience of REQUIRED_AUDIENCES) {
    const audienceDir = join(audiencesDir, audience)

    if (!existsSync(audienceDir)) {
      errors.push(`Missing audience directory: ${AUDIENCES_ROUTE_GROUP}/${audience}/`)
      continue
    }

    // Check for layout.tsx in each audience directory
    const layoutPath = join(audienceDir, "layout.tsx")
    if (!existsSync(layoutPath)) {
      errors.push(`Missing layout.tsx in ${AUDIENCES_ROUTE_GROUP}/${audience}/`)
    }
  }

  return errors
}

/**
 * Check App Router structure compliance
 *
 * Validates:
 * - App directory exists
 * - Required root files (layout.tsx, page.tsx)
 * - Route group structure (audiences)
 * - Audience directories and layouts
 *
 * @returns Validation result with success flag and error messages
 */
function checkAppRouterStructure(): {
  success: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check app directory exists
  const appDir = getAppDirectory()
  if (!appDir) {
    errors.push(
      "app/ directory does not exist. Checked locations:\n" +
        "  - ./app (from apps/StratonHub)\n" +
        "  - ./apps/StratonHub/app (from monorepo root)"
    )
    return { success: false, errors }
  }

  // Check required root files
  errors.push(...checkRequiredFiles(appDir))

  // Check route group structure
  errors.push(...checkRouteGroupStructure(appDir))

  return {
    success: errors.length === 0,
    errors,
  }
}

// ============================================================================
// Main Execution
// ============================================================================

/**
 * Main execution function
 */
function main(): void {
  console.log("🔍 Checking Next.js App Router compliance...\n")

  const result = checkAppRouterStructure()

  if (!result.success) {
    console.error("❌ Next.js compliance check failed:\n")
    result.errors.forEach((error) => {
      console.error(`   • ${error}`)
    })
    console.error("\n💡 Expected structure:")
    console.error("   app/")
    console.error("   ├── layout.tsx (required)")
    console.error("   ├── page.tsx (required)")
    console.error("   └── (audiences)/")
    console.error("       ├── developers/")
    console.error("       │   └── layout.tsx (required)")
    console.error("       ├── users/")
    console.error("       │   └── layout.tsx (required)")
    console.error("       └── business/")
    console.error("           └── layout.tsx (required)")
    process.exit(1)
  }

  console.log("✅ Next.js App Router structure is compliant")
  console.log("\n📋 Verified:")
  console.log(`   ✓ app/ directory exists`)
  console.log(`   ✓ Required root files (${REQUIRED_ROOT_FILES.join(", ")})`)
  console.log(`   ✓ Route group ${AUDIENCES_ROUTE_GROUP}/ exists`)
  console.log(`   ✓ All audience directories (${REQUIRED_AUDIENCES.join(", ")}) with layouts`)
  process.exit(0)
}

// Execute main function
main()
