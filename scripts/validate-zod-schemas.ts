#!/usr/bin/env tsx
/**
 * Zod Schema Validation Script
 *
 * Validates that all Zod schemas comply with mandatory requirements:
 * - Uses 'zod/v4' import
 * - Uses z.infer for types
 * - Located in src/lib/api-schemas/
 * - Uses mandatory patterns
 *
 * Validates Zod schema compliance with mandatory requirements.
 * Run this: pnpm validate:zod
 *
 * Usage:
 *   pnpm validate:zod
 */

import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { glob } from "fast-glob"
import { createScriptLogger } from "../src/lib/logger"

const log = createScriptLogger("validate-zod-schemas")

interface ValidationResult {
  file: string
  errors: string[]
  warnings: string[]
}

const results: ValidationResult[] = []

/**
 * Check if file uses 'zod/v4' import
 */
function checkImportPath(content: string, _file: string): string[] {
  const errors: string[] = []

  // Check for old import
  if (content.includes("from 'zod'") || content.includes('from "zod"')) {
    errors.push("MUST use 'zod/v4' import instead of 'zod'")
  }

  // Only check for correct import if file uses zod
  if (content.includes("zod") || content.includes("z.")) {
    if (!(content.includes("from 'zod/v4'") || content.includes('from "zod/v4"'))) {
      errors.push("MUST import from 'zod/v4'")
    }
  }

  return errors
}

/**
 * Check if file uses z.infer for types
 */
function checkTypeInference(content: string, _file: string): string[] {
  const errors: string[] = []

  // Check for manual type definitions that should use z.infer
  const hasZodSchema =
    content.includes("z.object") || content.includes("z.string") || content.includes("z.number")

  if (hasZodSchema && !content.includes("z.infer")) {
    // Check if there are manual types that should be inferred
    const schemaExports = content.match(/export\s+const\s+\w+Schema\s*=/g)
    const typeExports = content.match(/export\s+type\s+\w+\s*=/g)

    if (schemaExports && typeExports && schemaExports.length > 0) {
      // Check if types are using z.infer
      const inferCount = (content.match(/z\.infer/g) || []).length
      if (inferCount < typeExports.length) {
        errors.push("MUST use z.infer<typeof schema> for all types derived from schemas")
      }
    }
  }

  return errors
}

/**
 * Check if schema is in correct location
 */
function checkSchemaLocation(file: string): string[] {
  const errors: string[] = []

  // Schemas should be in src/lib/api-schemas/
  if (!file.includes("src/lib/api-schemas/") && file.includes("Schema")) {
    errors.push("MUST be located in src/lib/api-schemas/")
  }

  return errors
}

/**
 * Check if schema uses mandatory patterns
 */
function checkMandatoryPatterns(
  content: string,
  _file: string
): { errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Check for .describe() usage
  if (content.includes("z.object") && !content.includes(".describe(")) {
    warnings.push("SHOULD use .describe() for schema documentation")
  }

  // Check for .parse() usage (should use .safeParse())
  if (content.includes(".parse(") && !content.includes(".safeParse(")) {
    warnings.push("SHOULD use .safeParse() instead of .parse() for better error handling")
  }

  // Check for mandatory string patterns
  if (content.includes("z.string()") && !content.includes(".min(") && !content.includes(".max(")) {
    warnings.push("SHOULD use .min() and .max() for string validation")
  }

  // Check for mandatory number patterns
  if (
    content.includes("z.number()") &&
    !content.includes(".int(") &&
    !content.includes(".positive(")
  ) {
    warnings.push("SHOULD use .int() and .positive() for ID validation")
  }

  return { errors, warnings }
}

/**
 * Validate a single file
 */
function validateFile(file: string): ValidationResult {
  const content = readFileSync(file, "utf-8")
  const errors: string[] = []
  const warnings: string[] = []

  // Only validate TypeScript files with Zod usage
  if (!(content.includes("zod") || content.includes("z."))) {
    return { file, errors: [], warnings: [] }
  }

  // Run all checks
  errors.push(...checkImportPath(content, file))
  errors.push(...checkTypeInference(content, file))
  errors.push(...checkSchemaLocation(file))

  const patternResults = checkMandatoryPatterns(content, file)
  errors.push(...patternResults.errors)
  warnings.push(...patternResults.warnings)

  return { file, errors, warnings }
}

/**
 * Main validation function
 */
async function validateSchemas() {
  log.info("🔍 Validating Zod schemas...")

  // Run Zod validation
  log.info("📋 Running Zod validation...")

  // Find all TypeScript files
  const files = await glob(["**/*.{ts,tsx}"], {
    ignore: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "*.d.ts",
      "scripts/validate-zod-schemas.ts", // Exclude self
    ],
  })

  // Validate each file
  for (const file of files) {
    const result = validateFile(file)
    if (result.errors.length > 0 || result.warnings.length > 0) {
      results.push(result)
    }
  }

  // Report results
  log.info({ filesValidated: files.length }, `📊 Validated ${files.length} files`)

  let totalErrors = 0
  let totalWarnings = 0

  for (const result of results) {
    if (result.errors.length > 0 || result.warnings.length > 0) {
      log.info({ file: result.file }, `📄 ${result.file}`)

      if (result.errors.length > 0) {
        log.error("  ❌ Errors:")
        for (const error of result.errors) {
          log.error({ error }, `    - ${error}`)
          totalErrors++
        }
      }

      if (result.warnings.length > 0) {
        log.warn("  ⚠️  Warnings:")
        for (const warning of result.warnings) {
          log.warn({ warning }, `    - ${warning}`)
          totalWarnings++
        }
      }
    }
  }

  // Summary
  log.info("=".repeat(60))
  log.info(
    {
      filesWithIssues: results.length,
      totalErrors,
      totalWarnings,
    },
    "📊 Validation Summary"
  )
  log.info("=".repeat(60))

  if (totalErrors > 0) {
    log.error("❌ Validation failed! Please fix errors before committing.")
    log.info("💡 Next steps:")
    log.info("   1. Review and fix Zod validation errors")
    log.info("   2. Run `pnpm validate:zod` again to verify")
    process.exit(1)
  } else if (totalWarnings > 0) {
    log.warn("⚠️  Validation passed with warnings.")
    log.info("💡 Consider addressing warnings for best practices.")
    process.exit(0)
  } else {
    log.info("✅ All schemas comply with mandatory requirements!")
    process.exit(0)
  }
}

// Run validation
validateSchemas().catch((error) => {
  log.error({ error }, "❌ Validation error")
  process.exit(1)
})
