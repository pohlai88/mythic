#!/usr/bin/env tsx

/**
 * ELITE Verbatim Strategy - Validation Script
 *
 * Validates that critical config files match documented verbatim templates.
 * Fails fast on mismatches to prevent debugging hell.
 *
 * Usage:
 *   pnpm tsx scripts/validate-verbatim.ts
 */

import { readFileSync, existsSync } from "fs"
import { join } from "path"

// Read verbatim registry (from project root)
let verbatimRegistry: {
  version: string
  description: string
  files: Array<{
    path: string
    category: string
    template: string
    validation: string
    documentation: string
    description: string
  }>
}

try {
  const registryPath = join(process.cwd(), "scripts", "verbatim-registry.json")
  if (!existsSync(registryPath)) {
    console.error("❌ Error: verbatim-registry.json not found")
    console.error(`   Expected at: ${registryPath}`)
    process.exit(1)
  }
  verbatimRegistry = JSON.parse(readFileSync(registryPath, "utf-8"))
} catch (error) {
  console.error("❌ Error: Failed to read verbatim-registry.json")
  console.error(`   ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}

interface ValidationResult {
  file: string
  passed: boolean
  error?: string
  category?: string
}

function validateFile(file: {
  path: string
  template: string
  category: string
  description: string
}): ValidationResult {
  const filePath = join(process.cwd(), file.path)

  if (!existsSync(filePath)) {
    return {
      file: file.path,
      passed: false,
      category: file.category,
      error: `File not found: ${file.path}`,
    }
  }

  try {
    const actual = readFileSync(filePath, "utf-8").trim()
    const expected = file.template.trim()

    if (actual !== expected) {
      return {
        file: file.path,
        passed: false,
        category: file.category,
        error: `Content mismatch: File does not match verbatim template`,
      }
    }

    return {
      file: file.path,
      passed: true,
      category: file.category,
    }
  } catch (error) {
    return {
      file: file.path,
      passed: false,
      category: file.category,
      error: `Failed to read file: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

function validateNodeVersionConsistency(): ValidationResult[] {
  const results: ValidationResult[] = []

  try {
    const nodeVersion = readFileSync(".node-version", "utf-8").trim()
    const nvmrc = readFileSync(".nvmrc", "utf-8").trim()
    const packageJson = JSON.parse(readFileSync("package.json", "utf-8"))
    const enginesNode = packageJson.engines?.node

    // Check .node-version and .nvmrc match
    if (nodeVersion !== nvmrc) {
      results.push({
        file: ".node-version/.nvmrc",
        passed: false,
        category: "critical",
        error: `.node-version (${nodeVersion}) does not match .nvmrc (${nvmrc})`,
      })
    }

    // Check engines.node is compatible
    if (!enginesNode || !enginesNode.includes("20")) {
      results.push({
        file: "package.json",
        passed: false,
        category: "critical",
        error: `package.json engines.node (${enginesNode}) must include Node 20`,
      })
    }
  } catch (error) {
    results.push({
      file: "node-version-consistency",
      passed: false,
      category: "critical",
      error: `Failed to validate Node version consistency: ${error instanceof Error ? error.message : String(error)}`,
    })
  }

  return results
}

function validateWorkspaceDefinition(): ValidationResult[] {
  const results: ValidationResult[] = []

  try {
    const packageJson = JSON.parse(readFileSync("package.json", "utf-8"))

    // Check package.json does NOT have workspaces field
    if (packageJson.workspaces) {
      results.push({
        file: "package.json",
        passed: false,
        category: "critical",
        error:
          "package.json must NOT have workspaces field (use pnpm-workspace.yaml as single source of truth)",
      })
    }
  } catch (error) {
    results.push({
      file: "workspace-definition",
      passed: false,
      category: "critical",
      error: `Failed to validate workspace definition: ${error instanceof Error ? error.message : String(error)}`,
    })
  }

  return results
}

function main() {
  console.log("🔍 Validating verbatim config files...\n")

  const criticalFiles = verbatimRegistry.files.filter((f) => f.category === "critical")
  const fileResults = criticalFiles.map(validateFile)
  const consistencyResults = [...validateNodeVersionConsistency(), ...validateWorkspaceDefinition()]

  const allResults = [...fileResults, ...consistencyResults]
  const failures = allResults.filter((r) => !r.passed)

  if (failures.length > 0) {
    console.error("❌ Verbatim validation failed:\n")
    failures.forEach((f) => {
      console.error(`  ${f.file}`)
      console.error(`    Category: ${f.category}`)
      console.error(`    Error: ${f.error}\n`)
    })
    console.error(
      "💡 Fix: Update files to match verbatim templates in docs/architecture/ELITE_VERBATIM_STRATEGY.md\n"
    )
    process.exit(1)
  }

  const passed = allResults.filter((r) => r.passed).length
  console.log(`✅ All verbatim files validated (${passed} checks passed)`)
}

main()
