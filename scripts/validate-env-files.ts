/**
 * Environment File Validation Script
 *
 * Validates that only root .env file exists (or is allowed).
 * Blocks all other .env files in apps/ and packages/ directories.
 *
 * Usage:
 * ```bash
 * pnpm validate:env-files
 * ```
 */

import { glob } from "glob"
import { resolve } from "path"
import { existsSync } from "fs"

const ROOT_ENV = resolve(process.cwd(), ".env")

function validateEnvFiles(): {
  success: boolean
  violations: string[]
  rootEnvExists: boolean
} {
  const violations: string[] = []

  // Find all .env* files
  const envFiles = glob.sync("**/.env*", {
    ignore: ["node_modules/**", ".git/**", ".next/**", "dist/**", "build/**", ".turbo/**"],
  })

  // Filter out root .env (allowed)
  const forbiddenFiles = envFiles.filter((file) => {
    const fullPath = resolve(process.cwd(), file)
    return fullPath !== ROOT_ENV
  })

  if (forbiddenFiles.length > 0) {
    violations.push(
      ...forbiddenFiles.map(
        (file) =>
          `Found forbidden .env file: ${file}\n` +
          `  → All environment variables must be in root .env: ${ROOT_ENV}`
      )
    )
  }

  const rootEnvExists = existsSync(ROOT_ENV)

  return {
    success: violations.length === 0,
    violations,
    rootEnvExists,
  }
}

function main(): void {
  console.log("🔍 Validating environment file policy...\n")

  const result = validateEnvFiles()

  if (!result.success) {
    console.error("❌ Environment file validation failed:\n")
    result.violations.forEach((violation) => {
      console.error(`   ${violation}\n`)
    })
    console.error("💡 Action required:")
    console.error("   1. Merge variables from these files into root .env")
    console.error(`   2. Delete these .env files`)
    console.error(`   3. All environment variables must be in: ${ROOT_ENV}`)
    console.error("   4. See: .cursor/rules/060_security-secrets.mdc")
    process.exit(1)
  }

  if (!result.rootEnvExists) {
    console.warn("⚠️  Root .env file not found")
    console.warn(`   Expected location: ${ROOT_ENV}`)
    console.warn("   This is OK if you are setting up the project for the first time")
  } else {
    console.log("✅ Root .env file exists")
  }

  console.log("✅ Environment file policy: Compliant")
  console.log(`\n📋 Policy:`)
  console.log(`   ✓ Only root .env is allowed: ${ROOT_ENV}`)
  console.log(`   ✓ No .env files in apps/ or packages/`)
  console.log(`   ✓ No .env.local, .env.development, etc.`)
  process.exit(0)
}

if (require.main === module) {
  main()
}
