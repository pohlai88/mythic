#!/usr/bin/env tsx
/**
 * Design System Sealing Validation Script
 *
 * Validates that the design-system package is not being modified
 * except through approved channels (Handoff sync, build operations).
 *
 * Usage:
 *   pnpm validate:design-system-sealed
 */

import { execSync } from "child_process"
import { readFileSync } from "fs"
import { join } from "path"

const DESIGN_SYSTEM_PATH = "packages/TailwindCSS-V4/Design-System"
const ALLOWED_FILES = [
  // Validation report (can be updated during re-validation)
  "packages/TailwindCSS-V4/Design-System/VALIDATION_REPORT.md",
]

const ALLOWED_PATTERNS = [
  // Handoff sync operations
  /handoff-colors\.ts$/,
  // Build artifacts
  /\.turbo\//,
  /tsconfig\.tsbuildinfo$/,
  /node_modules\//,
]

function getStagedFiles(): string[] {
  try {
    const output = execSync("git diff --cached --name-only", {
      encoding: "utf-8",
      stdio: "pipe",
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

function isDesignSystemFile(file: string): boolean {
  return file.startsWith(DESIGN_SYSTEM_PATH + "/")
}

function isAllowedFile(file: string): boolean {
  // Check exact matches
  if (ALLOWED_FILES.includes(file)) {
    return true
  }

  // Check pattern matches
  for (const pattern of ALLOWED_PATTERNS) {
    if (pattern.test(file)) {
      return true
    }
  }

  return false
}

function checkDesignSystemSealed(): { success: boolean; violations: string[] } {
  const stagedFiles = getStagedFiles()
  const violations: string[] = []

  for (const file of stagedFiles) {
    if (isDesignSystemFile(file) && !isAllowedFile(file)) {
      violations.push(file)
    }
  }

  return {
    success: violations.length === 0,
    violations,
  }
}

function main() {
  const { success, violations } = checkDesignSystemSealed()

  if (!success) {
    console.error("")
    console.error("❌ ERROR: Design system package is SEALED")
    console.error("")
    console.error("The packages/TailwindCSS-V4/Design-System package has been validated as ELITE-compliant")
    console.error("and is sealed to prevent unauthorized modifications.")
    console.error("")
    console.error("Violations found:")
    violations.forEach((file) => {
      console.error(`  - ${file}`)
    })
    console.error("")
    console.error("Allowed operations:")
    console.error("  ✅ Handoff sync: pnpm tokens:sync")
    console.error("  ✅ Update validation report: Re-validation process")
    console.error("")
    console.error("Documentation:")
    console.error("  - Validation Report: packages/TailwindCSS-V4/Design-System/VALIDATION_REPORT.md")
    console.error("  - Methodology: .cursor/docs/TAILWIND_ELITE_METHODOLOGY.md")
    console.error("  - Sealing Rule: .cursor/rules/032_design-system-sealed.mdc")
    console.error("")
    console.error("If you need to modify the design system:")
    console.error("  1. Document justification in exception request")
    console.error("  2. Get Design System Maintainer approval")
    console.error("  3. Re-validate after changes")
    console.error("")
    process.exit(1)
  }

  console.log("✅ Design system sealing validation passed")
  process.exit(0)
}

if (require.main === module) {
  main()
}

export { checkDesignSystemSealed }
