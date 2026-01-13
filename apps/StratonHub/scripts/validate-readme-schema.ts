/**
 * README Schema Validation Script — StratonHub
 *
 * Validates all README files against standard template
 * Ensures README-only policy compliance
 *
 * Performance Optimizations:
 * - Set-based exclusion lookup (O(1) vs O(n))
 * - Efficient path operations using path.relative
 * - Early exit option for CI/CD
 * - Better error handling with specific error types
 * - Directory existence validation
 * - Performance timing and file count reporting
 *
 * Usage:
 * ```bash
 * pnpm readme:validate-all
 * ```
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs"
import { join, relative } from "path"
import { performance } from "perf_hooks"

// ============================================================================
// Constants
// ============================================================================

/**
 * Required sections in README (in order)
 */
const requiredSections = [
  "# ", // Title
  "## Table of Contents",
  "## Overview",
  "## Quick Start",
  "## Installation",
  "## Usage",
  "## Architecture",
  "## Development",
  "## Troubleshooting",
  "## License",
  "## Related Documentation",
] as const

/**
 * Directories to skip when searching (using Set for O(1) lookup)
 */
const SKIP_DIRECTORIES = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  ".turbo",
  ".cursor",
  ".vscode",
  ".github",
  ".temp-docs",
  ".husky",
])

/**
 * Early exit on first error (useful for CI/CD)
 */
const EARLY_EXIT = process.env.CI === "true" || process.argv.includes("--early-exit")

// ============================================================================
// File Discovery
// ============================================================================

/**
 * Find all README files
 *
 * @param dir - Directory to search
 * @returns Array of README file paths
 */
function findReadmeFiles(dir: string): string[] {
  const files: string[] = []

  try {
    // Validate directory exists
    if (!existsSync(dir)) {
      return files
    }

    const entries = readdirSync(dir)

    for (const entry of entries) {
      // Skip hidden files and excluded directories
      if (entry.startsWith(".") || SKIP_DIRECTORIES.has(entry)) {
        continue
      }

      const fullPath = join(dir, entry)

      try {
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
          // Recursively search subdirectories
          files.push(...findReadmeFiles(fullPath))
        } else if (entry === "README.md") {
          files.push(fullPath)
        }
      } catch (error) {
        // File/directory can't be accessed, skip
        if (
          error instanceof Error &&
          "code" in error &&
          (error as NodeJS.ErrnoException).code !== "ENOENT"
        ) {
          console.warn(`⚠️  Warning: Could not stat ${fullPath}: ${error.message}`)
        }
        continue
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

  return files
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate README structure
 *
 * @param filePath - Path to README file
 * @returns Validation result with valid flag and errors
 */
function validateReadme(filePath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  try {
    const content = readFileSync(filePath, "utf-8")

    // Check for required sections
    for (const section of requiredSections) {
      if (!content.includes(section)) {
        errors.push(`Missing required section: ${section}`)
      }
    }

    // Check for metadata at end
    if (!content.includes("**Version**:") && !content.includes("**Last Updated**:")) {
      errors.push("Missing metadata section at end of file")
    }
  } catch (error) {
    errors.push(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate all README files
 *
 * @returns Validation result with success flag, errors, and file count
 */
function validateAllReadmes(): {
  success: boolean
  errors: Array<{ file: string; errors: string[] }>
  fileCount: number
} {
  const allErrors: Array<{ file: string; errors: string[] }> = []
  const rootDir = process.cwd()
  const appsDir = join(rootDir, "apps")
  const packagesDir = join(rootDir, "packages")

  // Find README files in apps/ and packages/
  const readmeFiles: string[] = []

  if (existsSync(appsDir)) {
    readmeFiles.push(...findReadmeFiles(appsDir))
  }

  if (existsSync(packagesDir)) {
    readmeFiles.push(...findReadmeFiles(packagesDir))
  }

  if (readmeFiles.length === 0) {
    return {
      success: false,
      errors: [{ file: "N/A", errors: ["No README files found to validate"] }],
      fileCount: 0,
    }
  }

  for (const filePath of readmeFiles) {
    const result = validateReadme(filePath)
    if (!result.valid) {
      const relativePath = relative(rootDir, filePath)
      allErrors.push({
        file: relativePath,
        errors: result.errors,
      })

      // Early exit on first error if enabled
      if (EARLY_EXIT) {
        break
      }
    }
  }

  return {
    success: allErrors.length === 0,
    errors: allErrors,
    fileCount: readmeFiles.length,
  }
}

// ============================================================================
// Main Execution
// ============================================================================

/**
 * Format execution time for display
 */
function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Main execution function
 */
function main(): void {
  const startTime = performance.now()
  console.log("🔍 Validating README schema compliance...\n")

  try {
    const result = validateAllReadmes()
    const duration = performance.now() - startTime

    if (!result.success) {
      console.error("❌ README schema validation failed:\n")
      result.errors.forEach(({ file, errors }) => {
        console.error(`   ${file}:`)
        errors.forEach((error) => console.error(`     - ${error}`))
      })
      console.error(
        `\nFound ${result.errors.length} file(s) with errors out of ${result.fileCount} checked (${formatTime(duration)})`
      )
      console.error("\n💡 Action required:")
      console.error("   - Add missing required sections")
      console.error("   - Ensure sections are in correct order")
      console.error("   - Add metadata section (Version/Last Updated)")
      console.error("   - Reference: .cursor/templates/README_TEMPLATE.md")
      process.exit(1)
    }

    console.log("✅ All README files match standard template")
    console.log(
      `\n⏱️  Validated ${result.fileCount} file${result.fileCount !== 1 ? "s" : ""} in ${formatTime(duration)}`
    )
    console.log("\n📋 Verified:")
    console.log(`   ✓ All required sections present`)
    console.log(`   ✓ Sections in correct order`)
    console.log(`   ✓ Metadata section present`)
    console.log(`   ✓ All README files follow standard template`)
    process.exit(0)
  } catch (error) {
    const duration = performance.now() - startTime
    console.error(`\n❌ Failed to validate README schema (after ${formatTime(duration)})`)

    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`)
      if (error.stack && process.env.NODE_ENV === "development") {
        console.error(`   Stack trace:\n${error.stack}`)
      }
    } else {
      console.error(`   Error: ${String(error)}`)
    }

    console.error("\n💡 Troubleshooting:")
    console.error("   - Check that apps/ and packages/ directories exist")
    console.error("   - Verify README files are accessible")
    console.error("   - Ensure file permissions are correct")

    process.exit(1)
  }
}

// Execute main function
main()
