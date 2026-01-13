#!/usr/bin/env tsx
/**
 * CSS File Locking Validation Script
 *
 * Validates that system-generated CSS files have not been manually edited.
 * Compares staged files against expected generated state.
 *
 * Usage:
 *   pnpm validate:css-files
 */

import { execSync } from "child_process"
import { readFileSync, existsSync } from "fs"
import { join, resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const WORKSPACE_ROOT = resolve(__dirname, "..")

// ⚠️ DEPRECATED: This script is deprecated as of the new CSS architecture.
// CSS files are now editable - no locking needed since apps import theme.css directly.
// This script is kept for reference but should not be used.

// No locked files in new architecture - all CSS files are editable
const LOCKED_CSS_FILES: string[] = []

// No partially locked files in new architecture
const PARTIALLY_LOCKED_CSS_FILES: string[] = []

/**
 * Get staged files from git
 */
function getStagedFiles(): string[] {
  try {
    const output = execSync("git diff --cached --name-only", {
      encoding: "utf-8",
      stdio: "pipe",
      cwd: WORKSPACE_ROOT,
    })
    return output
      .trim()
      .split("\n")
      .filter((line) => line.trim().length > 0)
  } catch (error) {
    // No staged files or not a git repo
    return []
  }
}

/**
 * Check if file has version header
 */
function hasVersionHeader(filePath: string): boolean {
  try {
    if (!existsSync(filePath)) {
      return false
    }

    const content = readFileSync(filePath, "utf-8")

    // Check for version header pattern
    const hasVersionTag = /@version\s+[\d.]+/i.test(content)
    const hasGeneratedTag = /@generated/i.test(content)
    const hasSystemGeneratedWarning = /SYSTEM GENERATED/i.test(content)

    return hasVersionTag && hasGeneratedTag && hasSystemGeneratedWarning
  } catch {
    return false
  }
}

/**
 * Check if version header was manually edited
 */
function isVersionHeaderManuallyEdited(filePath: string): boolean {
  try {
    if (!existsSync(filePath)) {
      return false
    }

    const content = readFileSync(filePath, "utf-8")

    // Check for manual edit indicators
    // If header exists but doesn't have proper format, it might be manually edited
    const headerMatch = content.match(/\/\*\*[\s\S]*?\*\//)

    if (!headerMatch) {
      return false // No header at all
    }

    const header = headerMatch[0]

    // Check if header has all required auto-generated fields
    const hasVersion = /@version\s+[\d.]+/i.test(header)
    const hasGeneratedFrom = /@generated-from/i.test(header)
    const hasBuildHash = /@build-hash/i.test(header)
    const hasGenerated = /@generated\s+\d{4}-\d{2}-\d{2}T/i.test(header)
    const hasWarning = /SYSTEM GENERATED/i.test(header)

    // If header exists but missing required fields, it might be manually edited
    if (hasVersion && !hasGeneratedFrom) {
      return true // Version tag but no @generated-from (manual edit)
    }

    if (hasVersion && !hasBuildHash) {
      return true // Version tag but no @build-hash (manual edit)
    }

    if (hasVersion && !hasWarning) {
      return true // Version tag but no warning (manual edit)
    }

    return false
  } catch {
    return false
  }
}

/**
 * Validate CSS file locking
 */
function validateCSSFiles(): { valid: boolean; violations: string[]; warnings: string[] } {
  const violations: string[] = []
  const warnings: string[] = []
  const stagedFiles = getStagedFiles()

  // Check fully locked files
  for (const lockedFile of LOCKED_CSS_FILES) {
    if (stagedFiles.includes(lockedFile)) {
      const fullPath = join(WORKSPACE_ROOT, lockedFile)

      // Check if file has proper version header
      if (!hasVersionHeader(fullPath)) {
        violations.push(
          `❌ ${lockedFile}: Missing or invalid version header. File must be generated via build process.`
        )
      } else if (isVersionHeaderManuallyEdited(fullPath)) {
        violations.push(
          `❌ ${lockedFile}: Version header appears to be manually edited. Header must be auto-generated.`
        )
      } else {
        // File is staged and has proper header - this is OK (it was regenerated)
        // But we should verify it matches the build output
        // For now, we'll just log it
        console.log(`✅ ${lockedFile}: Has proper version header`)
      }
    }
  }

  // Check partially locked files (header must be auto-generated)
  for (const partialFile of PARTIALLY_LOCKED_CSS_FILES) {
    if (stagedFiles.includes(partialFile)) {
      const fullPath = join(WORKSPACE_ROOT, partialFile)

      if (!hasVersionHeader(fullPath)) {
        // No warnings needed in new architecture - files are editable
      } else if (isVersionHeaderManuallyEdited(fullPath)) {
        violations.push(
          `❌ ${partialFile}: Version header appears to be manually edited. Header must be auto-generated.`
        )
      }
    }
  }

  return {
    valid: violations.length === 0,
    violations,
    warnings,
  }
}

/**
 * Main validation function
 */
function main() {
  console.log("🔒 Validating CSS file locking...\n")

  const result = validateCSSFiles()

  if (result.warnings.length > 0) {
    console.log("⚠️  Warnings:\n")
    result.warnings.forEach((warning) => {
      console.log(`  ${warning}`)
    })
    console.log("")
  }

  if (result.valid) {
    console.log("✅ CSS file locking validation passed\n")
    process.exit(0)
  } else {
    console.error("❌ CSS file locking validation failed:\n")
    result.violations.forEach((violation) => {
      console.error(`  ${violation}`)
    })
    console.error("")
    console.error("💡 Note: In the new architecture, CSS files are editable.")
    console.error("   Apps import theme.css directly - no build step needed.")
    console.error("")
    console.error("📖 See: .cursor/plans/MONOREPO_CSS_STRATEGY_PROPOSAL.md")
    console.error("")
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { validateCSSFiles }
