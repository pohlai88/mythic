#!/usr/bin/env tsx
/**
 * Documentation Naming Validation Script
 *
 * Enforces strict documentation naming conventions:
 * - DOC-[NUMBER]_descriptive-name.md (preferred)
 * - [HASH-8]_descriptive-name.md (SHA256 hash)
 * - v[VERSION]_descriptive-name.md (semantic version)
 * - TEMP-[DATETIME]_descriptive-name.md (temporary only)
 *
 * Blocks commits with invalid documentation names.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { glob } from "glob"
import chalk from "chalk"
import crypto from "node:crypto"

interface ValidationResult {
  valid: boolean
  violations: Violation[]
  warnings: Warning[]
  stats: Stats
}

interface Violation {
  file: string
  reason: string
  location: string
}

interface Warning {
  file: string
  message: string
}

interface Stats {
  total: number
  valid: number
  invalid: number
  temporary: number
  expired: number
}

// Allowed locations for documentation
const ALLOWED_LOCATIONS = ["docs/", ".cursor/docs/", "content/", ".temp-docs/"]

// Forbidden locations
const FORBIDDEN_LOCATIONS = [".vscode/", "scripts/", "src/", "app/", "components/", "lib/"]

// Root exceptions (only README.md allowed)
const ROOT_EXCEPTIONS = ["README.md"]

// Naming patterns
const PATTERNS = {
  doc: /^DOC-\d{4}_[a-z0-9-]+\.mdx?$/,
  hash: /^[a-f0-9]{8}_[a-z0-9-]+\.mdx?$/,
  version: /^v\d+\.\d+\.\d+_[a-z0-9-]+\.mdx?$/,
  temp: /^TEMP-\d{8}-\d{4}_[a-z0-9-]+\.mdx?$/,
}

// Temporary document expiration (7 days)
const TEMP_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000

async function validateDocumentation(): Promise<ValidationResult> {
  const violations: Violation[] = []
  const warnings: Warning[] = []
  const stats: Stats = {
    total: 0,
    valid: 0,
    invalid: 0,
    temporary: 0,
    expired: 0,
  }

  // Find all markdown files
  const files = await glob("**/*.{md,mdx}", {
    ignore: ["node_modules/**", ".next/**", "docs/migrations/**", "docs/changelog/**"],
  })

  for (const file of files) {
    stats.total++
    const filename = file.split("/").pop() || ""
    const location = file.substring(0, file.lastIndexOf("/") + 1)

    // Check if in root directory
    if (!location && !ROOT_EXCEPTIONS.includes(filename)) {
      violations.push({
        file,
        reason: `Documentation not allowed in root directory. Only these 3 files are allowed: ${ROOT_EXCEPTIONS.join(", ")}. Move to docs/, .cursor/docs/, or content/`,
        location: "root",
      })
      stats.invalid++
      continue
    }

    // Check if root exception
    if (!location && ROOT_EXCEPTIONS.includes(filename)) {
      stats.valid++
      continue
    }

    // Check if in forbidden location
    const inForbiddenLocation = FORBIDDEN_LOCATIONS.some((forbidden) => file.startsWith(forbidden))
    if (inForbiddenLocation) {
      violations.push({
        file,
        reason: "Documentation in forbidden location",
        location,
      })
      stats.invalid++
      continue
    }

    // Check if in allowed location
    const inAllowedLocation = ALLOWED_LOCATIONS.some((allowed) => file.startsWith(allowed))
    if (!inAllowedLocation) {
      violations.push({
        file,
        reason: "Documentation in non-allowed location",
        location,
      })
      stats.invalid++
      continue
    }

    // Validate naming pattern
    const hasValidPattern =
      PATTERNS.doc.test(filename) ||
      PATTERNS.hash.test(filename) ||
      PATTERNS.version.test(filename) ||
      PATTERNS.temp.test(filename)

    if (!hasValidPattern) {
      // Exception for content/ directory (Nextra routing)
      if (file.startsWith("content/") || file.includes("_meta")) {
        stats.valid++
        continue
      }

      violations.push({
        file,
        reason: "Invalid naming pattern (missing DOC-XXXX, hash, or version prefix)",
        location,
      })
      stats.invalid++
      continue
    }

    // Check temporary document expiration
    if (PATTERNS.temp.test(filename)) {
      stats.temporary++
      const match = filename.match(/TEMP-(\d{8})-(\d{4})_/)
      if (match) {
        const [, dateStr, timeStr] = match
        const year = Number.parseInt(dateStr.substring(0, 4), 10)
        const month = Number.parseInt(dateStr.substring(4, 6), 10) - 1
        const day = Number.parseInt(dateStr.substring(6, 8), 10)
        const hour = Number.parseInt(timeStr.substring(0, 2), 10)
        const minute = Number.parseInt(timeStr.substring(2, 4), 10)

        const created = new Date(year, month, day, hour, minute)
        const now = new Date()
        const age = now.getTime() - created.getTime()

        if (age > TEMP_EXPIRATION_MS) {
          violations.push({
            file,
            reason: `Temporary document expired (> 7 days old)`,
            location,
          })
          stats.expired++
          stats.invalid++
          continue
        }

        // Warn if approaching expiration (> 5 days)
        if (age > 5 * 24 * 60 * 60 * 1000) {
          warnings.push({
            file,
            message: `Temporary document expires soon (${Math.ceil((TEMP_EXPIRATION_MS - age) / (24 * 60 * 60 * 1000))} days remaining)`,
          })
        }
      }
    }

    stats.valid++
  }

  return {
    valid: violations.length === 0,
    violations,
    warnings,
    stats,
  }
}

async function main() {
  const args = process.argv.slice(2)
  const autoFix = args.includes("--fix") || args.includes("--auto-fix")

  console.log(chalk.bold("\n📋 Documentation Naming Validation\n"))

  const result = await validateDocumentation()

  // Auto-fix mode
  if (autoFix && result.violations.length > 0) {
    console.log(chalk.yellow("\n🔧 Auto-fix mode enabled\n"))
    console.log(chalk.cyan("Running auto-fix script...\n"))

    try {
      const { execSync } = require("child_process")
      execSync("tsx scripts/fix-docs-naming.ts --fix", { stdio: "inherit" })

      // Re-validate after fix
      console.log(chalk.cyan("\nRe-validating after fixes...\n"))
      const newResult = await validateDocumentation()

      if (newResult.violations.length === 0) {
        console.log(chalk.green.bold("✅ All violations fixed!\n"))
        process.exit(0)
      } else {
        console.log(chalk.yellow(`⚠️  ${newResult.violations.length} violations remain\n`))
      }
    } catch (error) {
      console.error(chalk.red("Auto-fix failed:"), error)
      process.exit(1)
    }
  }

  // Print statistics
  console.log(chalk.bold("Statistics:"))
  console.log(`  Total documents: ${result.stats.total}`)
  console.log(`  ${chalk.green("✓")} Valid: ${result.stats.valid}`)
  console.log(`  ${chalk.red("✗")} Invalid: ${result.stats.invalid}`)
  console.log(`  ${chalk.yellow("⏱")} Temporary: ${result.stats.temporary}`)
  if (result.stats.expired > 0) {
    console.log(`  ${chalk.red("⏰")} Expired: ${result.stats.expired}`)
  }
  console.log()

  // Print warnings
  if (result.warnings.length > 0) {
    console.log(chalk.yellow.bold(`\n⚠️  Warnings (${result.warnings.length}):\n`))
    for (const warning of result.warnings) {
      console.log(chalk.yellow(`  ⚠️  ${warning.file}`))
      console.log(chalk.yellow(`     ${warning.message}\n`))
    }
  }

  // Print violations
  if (result.violations.length > 0) {
    console.log(chalk.red.bold(`\n❌ Violations (${result.violations.length}):\n`))
    for (const violation of result.violations) {
      console.log(chalk.red(`  ✗ ${violation.file}`))
      console.log(chalk.red(`    Reason: ${violation.reason}`))
      console.log(chalk.red(`    Location: ${violation.location}\n`))
    }

    console.log(chalk.red.bold("\n🚫 COMMIT BLOCKED\n"))
    console.log(chalk.yellow("Fix violations before committing:\n"))
    console.log(chalk.cyan("  1. Move to allowed location (docs/, .cursor/docs/, .temp-docs/)"))
    console.log(chalk.cyan("  2. Rename with proper prefix (DOC-XXXX, hash, or version)"))
    console.log(chalk.cyan("  3. Or delete if unnecessary\n"))
    console.log(chalk.yellow("See .cursor/rules/022_documentation-governance.mdc for details\n"))

    process.exit(1)
  }

  console.log(chalk.green.bold("✅ All documentation complies with naming rules\n"))
  console.log(chalk.green("✓ Commit allowed\n"))
  process.exit(0)
}

main().catch((error) => {
  console.error(chalk.red("\n❌ Validation failed:"), error)
  process.exit(1)
})
