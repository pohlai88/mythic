/**
 * README-Only Policy Check Script
 *
 * Ensures README-only policy compliance
 * Checks for non-README .md files in apps/ and packages/
 *
 * Performance Optimizations:
 * - Set-based exclusion lookup (O(1) vs O(n))
 * - Efficient path operations using path.relative
 * - Early exit option for CI/CD
 * - Better error handling with specific error types
 * - Directory existence validation
 *
 * Usage:
 * ```bash
 * pnpm check:readme-only
 * ```
 */

import { readdirSync, statSync, existsSync } from "fs"
import { join, relative } from "path"
import { performance } from "perf_hooks"

// ============================================================================
// Constants
// ============================================================================

/**
 * Excluded directories (using Set for O(1) lookup)
 */
const EXCLUDED_DIRS = new Set([
  ".cursor",
  ".vscode",
  ".github",
  ".temp-docs",
  ".husky",
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  ".turbo",
])

/**
 * Early exit on first violation (useful for CI/CD)
 */
const EARLY_EXIT = process.env.CI === "true" || process.argv.includes("--early-exit")

// ============================================================================
// File Discovery
// ============================================================================

/**
 * Check if directory should be excluded
 */
function isExcluded(dir: string): boolean {
  return EXCLUDED_DIRS.has(dir) || dir.startsWith(".")
}

/**
 * Recursively check for non-README .md files
 *
 * @param dir - Directory to check
 * @param rootDir - Root directory for relative path calculation
 * @param violations - Array to collect violations (mutated for early exit)
 * @returns true if should continue checking, false if early exit triggered
 */
function checkDirectory(dir: string, rootDir: string, violations: string[]): boolean {
  try {
    // Validate directory exists
    if (!existsSync(dir)) {
      return true // Continue checking other directories
    }

    const entries = readdirSync(dir)

    for (const entry of entries) {
      // Skip excluded directories
      if (isExcluded(entry)) {
        continue
      }

      const fullPath = join(dir, entry)

      try {
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
          // Recursively check subdirectories
          const shouldContinue = checkDirectory(fullPath, rootDir, violations)
          if (!shouldContinue) {
            return false // Early exit triggered
          }
        } else if (entry.endsWith(".md") && entry !== "README.md") {
          // Found non-README .md file
          const relativePath = relative(rootDir, fullPath)
          violations.push(relativePath)

          // Early exit if enabled
          if (EARLY_EXIT) {
            return false
          }
        }
      } catch (error) {
        // Skip files that can't be stat'd (symlinks, permissions, etc.)
        if (
          error instanceof Error &&
          "code" in error &&
          (error as NodeJS.ErrnoException).code !== "ENOENT"
        ) {
          console.warn(`⚠️  Warning: Could not stat ${fullPath}: ${error.message}`)
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code !== "ENOENT"
    ) {
      console.warn(`⚠️  Warning: Could not read directory ${dir}: ${error.message}`)
    }
  }

  return true
}

// ============================================================================
// Main Check Function
// ============================================================================

/**
 * Check README-only policy
 */
function checkReadmeOnly(): { success: boolean; violations: string[] } {
  const rootDir = process.cwd()
  const appsDir = join(rootDir, "apps")
  const packagesDir = join(rootDir, "packages")

  const violations: string[] = []

  // Check apps directory
  if (existsSync(appsDir)) {
    checkDirectory(appsDir, rootDir, violations)
  }

  // Check packages directory (only if early exit not triggered)
  if (violations.length === 0 || !EARLY_EXIT) {
    if (existsSync(packagesDir)) {
      checkDirectory(packagesDir, rootDir, violations)
    }
  }

  return {
    success: violations.length === 0,
    violations,
  }
}

// ============================================================================
// Execution
// ============================================================================

/**
 * Main execution function
 */
function main(): void {
  const startTime = performance.now()

  try {
    const result = checkReadmeOnly()
    const duration = performance.now() - startTime

    if (!result.success) {
      console.error("❌ README-only policy violations:")
      result.violations.forEach((violation) => {
        console.error(`  - ${violation}`)
      })
      console.error(`\nFound ${result.violations.length} violation(s) in ${duration.toFixed(2)}ms`)
      console.error("\nAction: Move content to README.md, then delete file")
      process.exit(1)
    }

    console.log(`✅ README-only policy: Compliant (checked in ${duration.toFixed(2)}ms)`)
    process.exit(0)
  } catch (error) {
    const duration = performance.now() - startTime
    console.error(`\n❌ Failed to check README-only policy (after ${duration.toFixed(2)}ms)`)

    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`)
      if (error.stack && process.env.NODE_ENV === "development") {
        console.error(`   Stack trace:\n${error.stack}`)
      }
    } else {
      console.error(`   Error: ${String(error)}`)
    }

    process.exit(1)
  }
}

// Run check
main()
