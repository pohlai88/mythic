#!/usr/bin/env tsx
/**
 * Unified Documentation Generator
 *
 * Orchestrates all documentation generators:
 * - API docs (Zod schemas → OpenAPI)
 * - Type docs (TypeScript types → MDX)
 * - Component docs (React components → MDX)
 * - Function docs (Functions with JSDoc → MDX)
 *
 * Usage:
 *   pnpm generate:docs
 */

import { execSync } from "child_process"
import { createScriptLogger } from "../src/lib/logger"

const log = createScriptLogger("generate-all-docs")

async function generateAllDocs(): Promise<void> {
  log.info("📚 Starting comprehensive documentation generation...\n")

  const generators = [
    {
      name: "Type Documentation",
      script: "generate:type-docs",
      description: "Generating type documentation from TypeScript...",
      required: true,
    },
    {
      name: "Component Documentation",
      script: "generate:component-docs",
      description: "Generating component documentation from React components...",
      required: true,
    },
    {
      name: "Function Documentation",
      script: "generate:function-docs",
      description: "Generating function documentation from JSDoc...",
      required: true,
    },
    {
      name: "API Documentation",
      script: "generate:api-docs",
      description: "Generating API documentation from Zod schemas...",
      required: false, // Optional - may fail if dependencies missing
    },
  ]

  const results: Array<{ name: string; success: boolean; error?: string }> = []

  for (const generator of generators) {
    try {
      log.info(`\n${generator.description}`)
      log.info(`Running: pnpm ${generator.script}\n`)

      execSync(`pnpm ${generator.script}`, {
        stdio: "inherit",
        cwd: process.cwd(),
      })

      results.push({ name: generator.name, success: true })
      log.info(`✅ ${generator.name} generated successfully\n`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.push({ name: generator.name, success: false, error: errorMessage })
      log.error({ error: errorMessage }, `❌ ${generator.name} generation failed`)
    }
  }

  // Summary
  log.info("\n" + "=".repeat(60))
  log.info("📊 Documentation Generation Summary")
  log.info("=".repeat(60) + "\n")

  const successful = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  results.forEach((result) => {
    if (result.success) {
      log.info(`✅ ${result.name}`)
    } else {
      log.error(`❌ ${result.name}: ${result.error}`)
    }
  })

  log.info(`\n✅ Successful: ${successful}/${results.length}`)
  if (failed > 0) {
    log.warn(`❌ Failed: ${failed}/${results.length}`)
  }

  log.info("\n" + "=".repeat(60))

  // Only fail if required generators failed
  const requiredFailed = results.filter(
    (r) => !r.success && generators.find((g) => g.name === r.name)?.required !== false
  ).length
  if (requiredFailed > 0) {
    log.error("Required documentation generators failed. Check the errors above.")
    process.exit(1)
  }

  if (failed > 0) {
    log.warn("Some optional documentation generators failed (this is OK).")
  }

  log.info("✅ All documentation generated successfully!")
  log.info("📖 View documentation at: http://localhost:3000/docs")
}

// Run generator
generateAllDocs().catch((error) => {
  log.error({ error }, "Failed to generate documentation")
  process.exit(1)
})
