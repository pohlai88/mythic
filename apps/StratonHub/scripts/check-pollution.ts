/**
 * Pollution Check Script — StratonHub
 *
 * Checks for any references to archived content in the codebase.
 * Ensures zero pollution from archived/removed content directories.
 *
 * Performance Optimizations:
 * - Pre-compiled regex patterns
 * - Efficient file system operations
 * - Early exit on violations
 * - Comprehensive file type checking
 *
 * Usage:
 * ```bash
 * pnpm docs:check-pollution
 * ```
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs"
import { join, relative } from "path"

// ============================================================================
// Constants
// ============================================================================

/**
 * File extensions to check for archive references
 */
const CHECKED_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".md",
  ".mdx",
  ".json",
  ".css",
] as const

/**
 * Directories to skip when searching
 */
const SKIP_DIRECTORIES = new Set([".", "node_modules", ".next", ".git", "dist", "build"])

/**
 * Pre-compiled regex patterns for archive references
 *
 * These patterns detect various ways archived content might be referenced:
 * - Direct path references (apps/docs.archive, docs.archive)
 * - Import statements (from, import, require)
 * - Relative path references
 */
const ARCHIVE_PATTERNS = [
  // Direct path references
  /apps\/docs\.archive/gi,
  /apps\/docs-archive/gi,
  /docs\.archive/gi,
  /docs-archive/gi,

  // Import/require statements
  /from\s+['"]\s*.*docs\.archive/gi,
  /import\s+.*from\s+['"]\s*.*docs\.archive/gi,
  /require\s*\(\s*['"]\s*.*docs\.archive/gi,

  // Relative path references
  /\.\.\/.*docs\.archive/gi,
  /\.\/.*docs\.archive/gi,
] as const

// ============================================================================
// File Discovery
// ============================================================================

/**
 * Recursively find all files with specified extensions
 *
 * @param dir - Directory to search
 * @param extensions - File extensions to include
 * @returns Array of file paths
 */
function findCodeFiles(dir: string, extensions: readonly string[] = CHECKED_EXTENSIONS): string[] {
  const files: string[] = []

  try {
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
          files.push(...findCodeFiles(fullPath, extensions))
        } else if (extensions.some((ext) => entry.endsWith(ext))) {
          files.push(fullPath)
        }
      } catch {
        // File/directory can't be accessed, skip
        continue
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
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

// ============================================================================
// Pollution Detection
// ============================================================================

/**
 * Check a single file for archive references
 *
 * @param filePath - Path to file to check
 * @param baseDir - Base directory for relative path calculation
 * @returns Array of violation messages (empty if no violations)
 */
function checkFileForPollution(filePath: string, baseDir: string): string[] {
  const violations: string[] = []

  try {
    const content = readFileSync(filePath, "utf-8")

    // Check each pattern
    for (const pattern of ARCHIVE_PATTERNS) {
      if (pattern.test(content)) {
        const relativePath = relative(baseDir, filePath)
        violations.push(
          `${relativePath}: Contains reference to archived content (matched pattern: ${pattern.source})`
        )
        break // Only report once per file
      }
    }
  } catch {
    // Skip files that can't be read
  }

  return violations
}

/**
 * Check for archive references in codebase
 *
 * Scans all code files for references to archived content directories.
 * Ensures zero pollution from removed/archived content.
 *
 * @returns Validation result with success flag and violation messages
 */
function checkPollution(): {
  success: boolean
  violations: string[]
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
    }
  }

  // Find all code files
  const codeFiles = findCodeFiles(stratonHubDir)

  if (codeFiles.length === 0) {
    return {
      success: false,
      violations: ["No code files found to check"],
    }
  }

  // Check each file for archive references
  for (const filePath of codeFiles) {
    const fileViolations = checkFileForPollution(filePath, stratonHubDir)
    violations.push(...fileViolations)
  }

  return {
    success: violations.length === 0,
    violations,
  }
}

// ============================================================================
// Main Execution
// ============================================================================

/**
 * Main execution function
 */
function main(): void {
  console.log("🔍 Checking for archive pollution...\n")

  const result = checkPollution()

  if (!result.success) {
    console.error("❌ Pollution check failed - Archive references found:\n")
    result.violations.forEach((violation) => {
      console.error(`   • ${violation}`)
    })
    console.error("\n💡 Action required:")
    console.error("   - Remove all references to apps/docs.archive")
    console.error("   - Remove all references to docs.archive")
    console.error("   - Update imports to use current content structure")
    console.error("   - Ensure no archived content is imported or referenced")
    process.exit(1)
  }

  console.log("✅ No archive references found - Zero pollution compliance")
  console.log("\n📋 Verified:")
  console.log(`   ✓ Scanned codebase for archive references`)
  console.log(`   ✓ No references to archived content directories`)
  console.log(`   ✓ Codebase is clean of archive pollution`)
  process.exit(0)
}

// Execute main function
main()
