#!/usr/bin/env node

/**
 * Rule Configuration Validator
 *
 * Validates Cursor rule files for:
 * - Proper alwaysApply usage (only 3 allowed)
 * - Required glob patterns
 * - Naming conventions
 * - Priority conflicts
 * - Performance budget
 *
 * Usage:
 *   pnpm validate:rules              # Validate all rules
 *   pnpm validate:rules --fix        # Auto-fix violations
 *   pnpm validate:rules --strict     # Fail on warnings
 */

import * as fs from "fs"
import * as path from "path"
import { glob } from "glob"

interface RuleFrontmatter {
  description?: string
  globs?: string
  alwaysApply?: boolean
  priority?: number
}

interface RuleFile {
  path: string
  filename: string
  frontmatter: RuleFrontmatter | null
  content: string
}

interface ValidationResult {
  file: string
  errors: string[]
  warnings: string[]
  fixed: boolean
}

const ALLOWED_ALWAYS_APPLY = [
  "000_RULE_GOVERNANCE.mdc",
  "000_master-cursor-defaults.mdc",
  "001_core-safety.mdc",
  "099_token-budget-documentation-block.mdc",
]

const RULES_DIR = path.join(process.cwd(), ".cursor", "rules")
const LOG_FILE = path.join(process.cwd(), ".cursor", "rule-audit.log")

// Parse frontmatter from rule file
function parseFrontmatter(content: string): RuleFrontmatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null

  const frontmatter: RuleFrontmatter = {}
  const lines = match[1].split("\n")

  for (const line of lines) {
    const [key, ...valueParts] = line.split(":")
    if (!key || valueParts.length === 0) continue

    const value = valueParts.join(":").trim()
    const cleanKey = key.trim()

    if (cleanKey === "description") {
      frontmatter.description = value.replace(/^["']|["']$/g, "")
    } else if (cleanKey === "globs") {
      frontmatter.globs = value.replace(/^["']|["']$/g, "")
    } else if (cleanKey === "alwaysApply") {
      frontmatter.alwaysApply = value === "true"
    } else if (cleanKey === "priority") {
      frontmatter.priority = parseInt(value, 10)
    }
  }

  return frontmatter
}

// Validate a single rule file
function validateRule(ruleFile: RuleFile, autoFix: boolean): ValidationResult {
  const result: ValidationResult = {
    file: ruleFile.filename,
    errors: [],
    warnings: [],
    fixed: false,
  }

  // Check 1: Frontmatter exists
  if (!ruleFile.frontmatter) {
    result.errors.push("Missing frontmatter (should start with --- and end with ---)")
    return result
  }

  const fm = ruleFile.frontmatter

  // Check 2: Filename convention
  if (!/^\d{3}_[\w-]+\.mdc$/.test(ruleFile.filename)) {
    result.errors.push(
      `Invalid filename format. Expected: [NNN]_descriptive-name.mdc, got: ${ruleFile.filename}`
    )
  }

  // Check 3: alwaysApply enforcement
  if (fm.alwaysApply === true) {
    if (!ALLOWED_ALWAYS_APPLY.includes(ruleFile.filename)) {
      if (autoFix) {
        // Auto-fix: change alwaysApply to false
        const newContent = ruleFile.content.replace(/alwaysApply:\s*true/, "alwaysApply: false")
        fs.writeFileSync(ruleFile.path, newContent, "utf-8")
        result.fixed = true
        result.warnings.push("AUTO-FIXED: Changed alwaysApply from true to false")
        logAudit("AUTO_FIX", ruleFile.filename, "alwaysApply: true → false")
      } else {
        result.errors.push(
          `alwaysApply: true is only allowed for: ${ALLOWED_ALWAYS_APPLY.join(", ")}`
        )
      }
    }
  }

  // Check 4: Glob patterns required for conditional rules
  if (fm.alwaysApply === false || fm.alwaysApply === undefined) {
    if (!fm.globs) {
      result.errors.push("Missing globs pattern (required when alwaysApply is false)")
    }
  }

  // Check 5: Description required
  if (!fm.description) {
    result.warnings.push("Missing description field in frontmatter")
  }

  // Check 6: Priority bounds
  if (fm.priority !== undefined) {
    if (fm.priority < 0 || fm.priority > 100) {
      result.warnings.push(`Priority ${fm.priority} is outside recommended range (0-100)`)
    }
  }

  return result
}

// Check for priority conflicts
function checkPriorityConflicts(rules: RuleFile[]): string[] {
  const warnings: string[] = []
  const priorityMap = new Map<number, string[]>()

  for (const rule of rules) {
    if (rule.frontmatter?.priority !== undefined) {
      const priority = rule.frontmatter.priority
      if (!priorityMap.has(priority)) {
        priorityMap.set(priority, [])
      }
      priorityMap.get(priority)!.push(rule.filename)
    }
  }

  for (const [priority, files] of priorityMap.entries()) {
    if (files.length > 1) {
      warnings.push(
        `Priority conflict: ${files.length} rules have priority ${priority}: ${files.join(", ")}`
      )
    }
  }

  return warnings
}

// Log audit trail
function logAudit(action: string, file: string, change: string) {
  const timestamp = new Date().toISOString()
  const logEntry = `${timestamp} ${action} ${file} ${change}\n`
  fs.appendFileSync(LOG_FILE, logEntry, "utf-8")
}

// Main validation function
async function validateRules(autoFix: boolean, strict: boolean) {
  console.log("🔍 Validating rule configurations...\n")

  // Find all rule files
  const ruleFiles = await glob("**/*.mdc", { cwd: RULES_DIR })

  if (ruleFiles.length === 0) {
    console.error("❌ No rule files found in .cursor/rules/")
    process.exit(1)
  }

  console.log(`Found ${ruleFiles.length} rule files\n`)

  // Parse and validate each rule
  const rules: RuleFile[] = []
  const results: ValidationResult[] = []

  for (const file of ruleFiles) {
    const fullPath = path.join(RULES_DIR, file)
    const content = fs.readFileSync(fullPath, "utf-8")
    const frontmatter = parseFrontmatter(content)

    const ruleFile: RuleFile = {
      path: fullPath,
      filename: path.basename(file),
      frontmatter,
      content,
    }

    rules.push(ruleFile)
    const result = validateRule(ruleFile, autoFix)
    results.push(result)
  }

  // Check for priority conflicts
  const priorityWarnings = checkPriorityConflicts(rules)

  // Report results
  let hasErrors = false
  let hasWarnings = priorityWarnings.length > 0

  for (const result of results) {
    if (result.errors.length > 0) {
      hasErrors = true
      console.log(`❌ ${result.file}`)
      for (const error of result.errors) {
        console.log(`   ERROR: ${error}`)
      }
    }

    if (result.warnings.length > 0) {
      hasWarnings = true
      if (result.errors.length === 0) {
        console.log(`⚠️  ${result.file}`)
      }
      for (const warning of result.warnings) {
        console.log(`   WARNING: ${warning}`)
      }
    }

    if (result.fixed) {
      console.log(`   ✅ Auto-fixed`)
    }

    if (result.errors.length > 0 || result.warnings.length > 0) {
      console.log("")
    }
  }

  // Report priority conflicts
  if (priorityWarnings.length > 0) {
    console.log("⚠️  Priority Conflicts:")
    for (const warning of priorityWarnings) {
      console.log(`   ${warning}`)
    }
    console.log("")
  }

  // Report alwaysApply count
  const alwaysApplyCount = rules.filter((r) => r.frontmatter?.alwaysApply === true).length

  console.log(`📊 Summary:`)
  console.log(`   Total rules: ${rules.length}`)
  console.log(`   Always loaded: ${alwaysApplyCount} (target: ${ALLOWED_ALWAYS_APPLY.length})`)
  console.log(`   Conditional: ${rules.length - alwaysApplyCount}`)

  if (alwaysApplyCount > ALLOWED_ALWAYS_APPLY.length) {
    console.log(
      `   ⚠️  WARNING: ${alwaysApplyCount - ALLOWED_ALWAYS_APPLY.length} too many alwaysApply rules`
    )
  }

  // Exit codes
  if (hasErrors) {
    console.log("\n❌ Validation failed with errors")
    if (autoFix) {
      console.log("Some errors may require manual fixes")
    } else {
      console.log("Run with --fix to auto-fix some issues")
    }
    process.exit(1)
  }

  if (hasWarnings && strict) {
    console.log("\n⚠️  Validation failed with warnings (strict mode)")
    process.exit(1)
  }

  if (hasWarnings) {
    console.log("\n⚠️  Validation passed with warnings")
    process.exit(0)
  }

  console.log("\n✅ All rules validated successfully")
  logAudit("VALIDATE_SUCCESS", "All rules", `${rules.length} rules validated`)
}

// Parse CLI arguments
const args = process.argv.slice(2)
const autoFix = args.includes("--fix")
const strict = args.includes("--strict")

// Run validation
validateRules(autoFix, strict).catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
