/**
 * Documentation Validation Script — StratonHub
 *
 * Validates all MDX files against StratonHub frontmatter schema.
 * Build-time validation for content compliance.
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
 * pnpm docs:validate
 * ```
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs"
import { join, relative } from "path"
import { performance } from "perf_hooks"
import YAML from "yaml"
import { validateFrontmatter } from "@/lib/content"

// ============================================================================
// Constants
// ============================================================================

/**
 * Directories to skip when searching (using Set for O(1) lookup)
 */
const SKIP_DIRECTORIES = new Set(["node_modules", ".next", ".git", "dist", "build", ".turbo"])

/**
 * Early exit on first error (useful for CI/CD)
 */
const EARLY_EXIT = process.env.CI === "true" || process.argv.includes("--early-exit")

// ============================================================================
// File Discovery
// ============================================================================

/**
 * Recursively find all MDX files
 *
 * @param dir - Directory to search
 * @returns Array of MDX file paths
 */
function findMdxFiles(dir: string): string[] {
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
          files.push(...findMdxFiles(fullPath))
        } else if (entry.endsWith(".mdx")) {
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
// Frontmatter Processing
// ============================================================================

/**
 * Extract YAML frontmatter block
 *
 * @param source - MDX file content
 * @returns YAML frontmatter string or null if not found
 */
function extractFrontmatterBlock(source: string): string | null {
  const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch || !frontmatterMatch[1]) return null
  return frontmatterMatch[1]
}

/**
 * Parse YAML frontmatter to object
 *
 * @param yamlText - YAML frontmatter string
 * @returns Parsed object or empty object if invalid
 */
function parseFrontmatterYaml(yamlText: string | null): unknown {
  if (!yamlText?.trim()) return {}
  const parsed = YAML.parse(yamlText)
  return parsed && typeof parsed === "object" ? parsed : {}
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate all MDX files
 *
 * @returns Validation result with success flag, errors, and file count
 */
function validateDocs(): {
  success: boolean
  errors: string[]
  fileCount: number
} {
  const errors: string[] = []
  const rootDir = process.cwd()

  // ✅ Handle both monorepo root and apps/StratonHub execution contexts
  function getAppDir(): string {
    const monorepoPath = join(rootDir, "apps/StratonHub/app")
    if (existsSync(monorepoPath)) {
      return monorepoPath
    }
    const appPath = join(rootDir, "app")
    if (existsSync(appPath)) {
      return appPath
    }
    return monorepoPath
  }

  const appDir = getAppDir()

  // Validate app directory exists
  if (!existsSync(appDir)) {
    return {
      success: false,
      errors: [`App directory not found: ${appDir}`],
      fileCount: 0,
    }
  }

  const mdxFiles = findMdxFiles(appDir)

  if (mdxFiles.length === 0) {
    return {
      success: false,
      errors: ["No MDX files found to validate"],
      fileCount: 0,
    }
  }

  for (const filePath of mdxFiles) {
    try {
      const source = readFileSync(filePath, "utf-8")

      const yamlBlock = extractFrontmatterBlock(source)
      const frontmatter = parseFrontmatterYaml(yamlBlock)

      const result = validateFrontmatter(frontmatter)

      if (!result.success) {
        const relativePath = relative(rootDir, filePath)
        errors.push(`${relativePath}: ${JSON.stringify(result.error.format(), null, 2)}`)

        // Early exit on first error if enabled
        if (EARLY_EXIT) {
          break
        }
      }
    } catch (error) {
      const relativePath = relative(rootDir, filePath)
      errors.push(
        `${relativePath}: Failed to validate - ${
          error instanceof Error ? error.message : String(error)
        }`
      )

      // Early exit on first error if enabled
      if (EARLY_EXIT) {
        break
      }
    }
  }

  return {
    success: errors.length === 0,
    errors,
    fileCount: mdxFiles.length,
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
  console.log("🔍 Validating StratonHub MDX frontmatter...\n")

  try {
    const result = validateDocs()
    const duration = performance.now() - startTime

    if (!result.success) {
      console.error("❌ Documentation validation failed:\n")
      result.errors.forEach((error) => {
        console.error(`   • ${error}\n`)
      })
      console.error(
        `Found ${result.errors.length} error(s) in ${result.fileCount} file(s) (${formatTime(duration)})`
      )
      console.error("\n💡 Action required:")
      console.error("   - Fix frontmatter schema violations")
      console.error("   - Ensure all required fields are present")
      console.error("   - Verify YAML syntax is correct")
      console.error("   - Reference: @lib/content/schemas.ts")
      process.exit(1)
    }

    console.log("✅ All StratonHub MDX frontmatter validates against schema")
    console.log(
      `\n⏱️  Validated ${result.fileCount} file${result.fileCount !== 1 ? "s" : ""} in ${formatTime(duration)}`
    )
    console.log("\n📋 Verified:")
    console.log(`   ✓ All frontmatter matches schema`)
    console.log(`   ✓ All required fields present`)
    console.log(`   ✓ All enum values valid`)
    console.log(`   ✓ All date formats correct`)
    process.exit(0)
  } catch (error) {
    const duration = performance.now() - startTime
    console.error(`\n❌ Failed to validate documentation (after ${formatTime(duration)})`)

    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`)
      if (error.stack && process.env.NODE_ENV === "development") {
        console.error(`   Stack trace:\n${error.stack}`)
      }
    } else {
      console.error(`   Error: ${String(error)}`)
    }

    console.error("\n💡 Troubleshooting:")
    console.error("   - Check that apps/StratonHub/app directory exists")
    console.error("   - Verify MDX files are accessible")
    console.error("   - Ensure @/lib/content module is available")
    console.error("   - Check file permissions")

    process.exit(1)
  }
}

// Execute main function
main()
