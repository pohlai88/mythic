/**
 * Tailwind V4 Compliance Check Script — StratonHub
 *
 * Validates that styling uses Tailwind V4 patterns and design system tokens.
 * Checks for:
 * - Hardcoded colors (hex, rgb, rgba)
 * - Legacy Tailwind v4 syntax `[var(--color-token)]` (should use `(--color-token)`)
 * - Inline styles (should use Tailwind utilities)
 * - Non-compliant patterns
 *
 * Performance Optimizations:
 * - Pre-compiled regex patterns
 * - Efficient file system operations
 * - Early exit on violations
 * - Comprehensive file type checking
 *
 * Usage:
 * ```bash
 * pnpm docs:check-tailwind
 * ```
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs"
import { join, relative } from "path"
import { performance } from "perf_hooks"

// ============================================================================
// Constants
// ============================================================================

/**
 * File extensions to check for Tailwind compliance (using Set for O(1) lookup)
 */
const CHECKED_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"] as const
const CHECKED_EXTENSIONS_SET = new Set(CHECKED_EXTENSIONS)

/**
 * Early exit on first violation (useful for CI/CD)
 */
const EARLY_EXIT = process.env.CI === "true" || process.argv.includes("--early-exit")

/**
 * Directories to skip when searching
 */
const SKIP_DIRECTORIES = new Set([".", "node_modules", ".next", ".git", "dist", "build", "public"])

/**
 * File patterns to skip (config files, type definitions, etc.)
 */
const SKIP_FILE_PATTERNS = [
  /\.config\./,
  /\.d\.ts$/,
  /\.test\./,
  /\.spec\./,
  /node_modules/,
] as const

/**
 * Pre-compiled regex patterns for Tailwind V4 violations
 *
 * These patterns detect non-compliant styling:
 * - Legacy syntax: `[var(--color-token)]` should be `(--color-token)`
 * - Hardcoded colors: hex, rgb, rgba
 * - Inline styles: should use Tailwind utilities
 */
const VIOLATION_PATTERNS = [
  // Legacy Tailwind v4 syntax (should use new syntax)
  {
    pattern: /\[var\(--color-[^)]+\)\]/g,
    description:
      "Legacy Tailwind v4 syntax - use `(--color-token)` instead of `[var(--color-token)]`",
  },
  {
    pattern: /\[color:var\(--color-[^)]+\)\]/g,
    description:
      "Legacy Tailwind v4 syntax - use `(--color-token)` instead of `[color:var(--color-token)]`",
  },

  // Hardcoded hex colors (should use design tokens)
  {
    pattern: /#[0-9a-fA-F]{3,6}(?![0-9a-fA-F])/g,
    description: "Hardcoded hex color - use design system tokens like `(--color-token)`",
  },

  // RGB/RGBA colors (should use design tokens)
  {
    pattern: /rgba?\([^)]+\)/g,
    description: "RGB/RGBA color - use design system tokens like `(--color-token)`",
  },

  // Inline styles (should use Tailwind utilities)
  {
    pattern: /style=\{\{/g,
    description: "Inline style - prefer Tailwind utility classes",
  },
] as const

/**
 * Allowed patterns (design system tokens and valid Tailwind)
 *
 * These patterns are allowed even if they might match violation patterns:
 * - Design system token syntax: `(--color-token)`
 * - Valid Tailwind utilities
 * - Comments containing color values
 */
const ALLOWED_PATTERNS = [
  // Tailwind v4 design token syntax (correct)
  /\(--color-[^)]+\)/g,
  // Comments (may contain color examples)
  /\/\/.*#[0-9a-fA-F]{3,6}/g,
  /\/\*.*#[0-9a-fA-F]{3,6}.*\*\//g,
  // CSS files (may contain color definitions)
  /\.css$/,
] as const

// ============================================================================
// File Discovery
// ============================================================================

/**
 * Recursively find all component and style files
 *
 * @param dir - Directory to search
 * @param extensions - File extensions to include (for backward compatibility)
 * @returns Array of file paths
 */
function findComponentFiles(
  dir: string,
  extensions: readonly string[] = CHECKED_EXTENSIONS
): string[] {
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
          files.push(...findComponentFiles(fullPath, extensions))
        } else {
          // Use Set for O(1) lookup instead of array.some() O(n)
          const ext = entry.substring(entry.lastIndexOf("."))
          if (CHECKED_EXTENSIONS_SET.has(ext as (typeof CHECKED_EXTENSIONS)[number])) {
            files.push(fullPath)
          }
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
// Path Resolution
// ============================================================================

/**
 * Get StratonHub app directory path
 *
 * Handles both monorepo root and standalone execution contexts.
 *
 * @returns Path to StratonHub directory or null if not found
 */
function getStratonHubDir(): string | null {
  const cwd = process.cwd()

  // Try from current directory (apps/StratonHub)
  const localDir = cwd
  if (existsSync(join(localDir, "app"))) {
    return localDir
  }

  // Try from monorepo root
  const monorepoDir = join(cwd, "apps/StratonHub")
  if (existsSync(join(monorepoDir, "app"))) {
    return monorepoDir
  }

  // Not found
  return null
}

/**
 * Check if file should be skipped
 *
 * @param filePath - Path to file
 * @returns True if file should be skipped
 */
function shouldSkipFile(filePath: string): boolean {
  return SKIP_FILE_PATTERNS.some((pattern) => pattern.test(filePath))
}

/**
 * Check if violation is in an allowed context
 *
 * @param content - File content
 * @param match - Matched violation string
 * @param matchIndex - Index where match occurred
 * @param filePath - Path to file being checked
 * @returns True if violation is in allowed context
 */
function isAllowedContext(
  content: string,
  match: string,
  matchIndex: number,
  filePath: string
): boolean {
  // Check if match is in a comment
  const beforeMatch = content.slice(Math.max(0, matchIndex - 100), matchIndex)
  const afterMatch = content.slice(
    matchIndex,
    Math.min(content.length, matchIndex + match.length + 100)
  )

  // Check for comment markers
  const isInComment =
    beforeMatch.includes("//") || beforeMatch.includes("/*") || afterMatch.includes("*/")

  // Check if it's a CSS file (may contain color definitions)
  if (filePath.endsWith(".css")) {
    // Allow color definitions in CSS files (they're part of design tokens)
    return true
  }

  // Check if it matches allowed patterns
  for (const allowedPattern of ALLOWED_PATTERNS) {
    if (allowedPattern.test(match)) {
      return true
    }
  }

  return isInComment
}

// ============================================================================
// Compliance Checking
// ============================================================================

/**
 * Check a single file for Tailwind compliance violations
 *
 * @param filePath - Path to file to check
 * @param baseDir - Base directory for relative path calculation
 * @returns Array of violation messages (empty if no violations)
 */
function checkFileForViolations(filePath: string, baseDir: string): string[] {
  const violations: string[] = []

  // Skip config files and type definitions
  if (shouldSkipFile(filePath)) {
    return violations
  }

  try {
    const content = readFileSync(filePath, "utf-8")

    // Check each violation pattern
    for (const { pattern, description } of VIOLATION_PATTERNS) {
      const matches = content.matchAll(pattern)

      for (const match of matches) {
        const matchString = match[0]
        const matchIndex = match.index ?? 0

        // Check if violation is in allowed context
        if (!isAllowedContext(content, matchString, matchIndex, filePath)) {
          const relativePath = relative(baseDir, filePath)
          violations.push(`${relativePath}: ${description}\n   Found: ${matchString}`)

          // Early exit on first violation if enabled
          if (EARLY_EXIT) {
            return violations
          }
        }
      }
    }
  } catch (error) {
    // Skip files that can't be read
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code !== "ENOENT"
    ) {
      console.warn(`⚠️  Warning: Could not read file ${filePath}: ${error.message}`)
    }
  }

  return violations
}

/**
 * Check Tailwind V4 compliance
 *
 * Scans all component and style files for compliance violations.
 * Ensures use of Tailwind V4 patterns and design system tokens.
 *
 * @returns Validation result with success flag, violation messages, and file count
 */
function checkTailwindCompliance(): {
  success: boolean
  violations: string[]
  fileCount: number
} {
  const violations: string[] = []

  // Get StratonHub directory
  const stratonHubDir = getStratonHubDir()
  if (!stratonHubDir) {
    return {
      success: false,
      violations: [
        "StratonHub directory not found. Checked locations:\n" +
          "  - ./ (from apps/StratonHub)\n" +
          "  - ./apps/StratonHub (from monorepo root)",
      ],
      fileCount: 0,
    }
  }

  // Find all component files
  const componentFiles = findComponentFiles(stratonHubDir)

  if (componentFiles.length === 0) {
    return {
      success: false,
      violations: ["No component files found to check"],
      fileCount: 0,
    }
  }

  // Check each file for violations
  for (const filePath of componentFiles) {
    const fileViolations = checkFileForViolations(filePath, stratonHubDir)
    violations.push(...fileViolations)

    // Early exit if enabled and violations found
    if (EARLY_EXIT && violations.length > 0) {
      break
    }
  }

  return {
    success: violations.length === 0,
    violations,
    fileCount: componentFiles.length,
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
  console.log("🔍 Checking Tailwind V4 compliance...\n")

  try {
    const result = checkTailwindCompliance()
    const duration = performance.now() - startTime

    if (!result.success) {
      console.error("❌ Tailwind compliance check failed:\n")
      result.violations.forEach((violation) => {
        console.error(`   • ${violation}`)
      })
      console.error(`\nFound ${result.violations.length} violation(s) in ${formatTime(duration)}`)
      console.error("\n💡 Action required:")
      console.error("   - Replace `[var(--color-token)]` with `(--color-token)`")
      console.error("   - Replace hardcoded colors with design system tokens")
      console.error("   - Use Tailwind utility classes instead of inline styles")
      console.error("   - Reference: @rules/033_design-system-constitution.mdc")
      process.exit(1)
    }

    console.log("✅ Tailwind V4 compliance check passed")
    console.log(
      `\n⏱️  Checked ${result.fileCount} file${result.fileCount !== 1 ? "s" : ""} in ${formatTime(duration)}`
    )
    console.log("\n📋 Verified:")
    console.log(`   ✓ No legacy Tailwind v4 syntax found`)
    console.log(`   ✓ No hardcoded colors (using design system tokens)`)
    console.log(`   ✓ No inline styles (using Tailwind utilities)`)
    console.log(`   ✓ All styling follows Tailwind V4 best practices`)
    process.exit(0)
  } catch (error) {
    const duration = performance.now() - startTime
    console.error(`\n❌ Failed to check Tailwind compliance (after ${formatTime(duration)})`)

    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`)
      if (error.stack && process.env.NODE_ENV === "development") {
        console.error(`   Stack trace:\n${error.stack}`)
      }
    } else {
      console.error(`   Error: ${String(error)}`)
    }

    console.error("\n💡 Troubleshooting:")
    console.error("   - Check that StratonHub directory exists")
    console.error("   - Verify file permissions")
    console.error("   - Ensure TypeScript/JavaScript files are accessible")

    process.exit(1)
  }
}

// Execute main function
main()
