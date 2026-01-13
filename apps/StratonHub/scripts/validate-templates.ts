/**
 * Template Validation Script — StratonHub
 *
 * Validates that all content templates follow Diataxis structure contracts.
 * This ensures new content created from templates will be compliant.
 *
 * Usage:
 * ```bash
 * pnpm validate:templates
 * ```
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs"
import { join, relative } from "path"
import { performance } from "perf_hooks"
import { loadContentFile } from "@/lib/content/loader"
import type { DiataxisType } from "@/lib/content/schemas"

// Import validation functions (we'll duplicate the logic here for simplicity)
function extractH2Headings(content: string): string[] {
  const h2Regex = /^##\s+(.+)$/gm
  const matches = content.matchAll(h2Regex)
  return Array.from(matches, (match) => match[1]?.trim() ?? '')
}

function extractSteps(content: string): string[] {
  const h3Regex = /^###\s+(.+)$/gm
  const matches = content.matchAll(h3Regex)
  const h3Headings = Array.from(matches, (match) => match[1]?.trim() ?? '')
  return h3Headings.filter((heading) => /^Step\s+\d+/i.test(heading))
}

function validateTutorialStructure(content: string): { success: boolean; errors: string[] } {
  const h2Headings = extractH2Headings(content)
  const steps = extractSteps(content)
  const headingSet = new Set(h2Headings.map((h) => h.toLowerCase()))

  const errors: string[] = []

  if (!headingSet.has("introduction")) {
    errors.push('Missing "## Introduction" section')
  }
  if (!headingSet.has("prerequisites")) {
    errors.push('Missing "## Prerequisites" section')
  }
  if (!headingSet.has("steps")) {
    errors.push('Missing "## Steps" section')
  } else if (steps.length === 0) {
    errors.push('"## Steps" section has no step subsections')
  }
  if (!headingSet.has("what we built") && !headingSet.has("what we've built")) {
    errors.push('Missing "## What We Built" section')
  }
  if (!headingSet.has("next steps")) {
    errors.push('Missing "## Next Steps" section')
  }

  return { success: errors.length === 0, errors }
}

function validateHowToStructure(content: string): { success: boolean; errors: string[] } {
  const h2Headings = extractH2Headings(content)
  const steps = extractSteps(content)
  const headingSet = new Set(h2Headings.map((h) => h.toLowerCase()))

  const errors: string[] = []

  if (!headingSet.has("introduction")) {
    errors.push('Missing "## Introduction" section')
  }
  if (!headingSet.has("prerequisites")) {
    errors.push('Missing "## Prerequisites" section')
  }
  if (!headingSet.has("steps")) {
    errors.push('Missing "## Steps" section')
  } else if (steps.length === 0) {
    errors.push('"## Steps" section has no step subsections')
  }

  return { success: errors.length === 0, errors }
}

function validateReferenceStructure(content: string): { success: boolean; errors: string[] } {
  const h2Headings = extractH2Headings(content)
  const h3Headings = extractH3Headings(content)
  const headingSet = new Set(h2Headings.map((h) => h.toLowerCase()))
  const h3Set = new Set(h3Headings.map((h) => h.toLowerCase()))

  const hasApiOrProperties =
    headingSet.has("api") ||
    headingSet.has("properties") ||
    headingSet.has("parameters") ||
    h3Set.has("api") ||
    h3Set.has("properties") ||
    h3Set.has("parameters")

  const errors: string[] = []

  if (!headingSet.has("overview")) {
    errors.push('Missing "## Overview" section')
  }
  if (!hasApiOrProperties) {
    errors.push('Missing "## API" or "## Properties" or "## Parameters" section')
  }
  if (!headingSet.has("examples") && !headingSet.has("example")) {
    errors.push('Missing "## Examples" section')
  }
  if (!headingSet.has("see also") && !headingSet.has("related")) {
    errors.push('Missing "## See Also" section')
  }

  return { success: errors.length === 0, errors }
}

function extractH3Headings(content: string): string[] {
  const h3Regex = /^###\s+(.+)$/gm
  const matches = content.matchAll(h3Regex)
  return Array.from(matches, (match) => match[1]?.trim() ?? '')
}

function validateExplanationStructure(content: string): { success: boolean; errors: string[] } {
  const h2Headings = extractH2Headings(content)
  const headingSet = new Set(h2Headings.map((h) => h.toLowerCase()))

  const errors: string[] = []

  if (!headingSet.has("introduction")) {
    errors.push('Missing "## Introduction" section')
  }
  if (!headingSet.has("context")) {
    errors.push('Missing "## Context" section')
  }
  if (!headingSet.has("details")) {
    errors.push('Missing "## Details" section')
  }
  if (!headingSet.has("implications")) {
    errors.push('Missing "## Implications" section')
  }

  return { success: errors.length === 0, errors }
}

// ============================================================================
// Constants
// ============================================================================

const TEMPLATES_DIR = join(process.cwd(), "templates", "content-schemas")

// ============================================================================
// Template Validation
// ============================================================================

function validateTemplates(): {
  success: boolean
  errors: Array<{ template: string; errors: string[] }>
  templateCount: number
} {
  const errors: Array<{ template: string; errors: string[] }> = []

  if (!existsSync(TEMPLATES_DIR)) {
    return {
      success: false,
      errors: [{ template: TEMPLATES_DIR, errors: ["Templates directory not found"] }],
      templateCount: 0,
    }
  }

  const templateFiles = readdirSync(TEMPLATES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => join(TEMPLATES_DIR, file))

  if (templateFiles.length === 0) {
    return {
      success: false,
      errors: [{ template: TEMPLATES_DIR, errors: ["No template files found"] }],
      templateCount: 0,
    }
  }

  for (const templatePath of templateFiles) {
    try {
      const contentFile = loadContentFile(templatePath)
      const type = contentFile.frontmatter.type

      // Validate structure based on type
      let structureResult: { success: boolean; errors: string[] }
      switch (type) {
        case "tutorial":
          structureResult = validateTutorialStructure(contentFile.content)
          break
        case "how-to":
          structureResult = validateHowToStructure(contentFile.content)
          break
        case "reference":
          structureResult = validateReferenceStructure(contentFile.content)
          break
        case "explanation":
          structureResult = validateExplanationStructure(contentFile.content)
          break
        default:
          structureResult = {
            success: false,
            errors: [`Unknown Diataxis type: ${type}`],
          }
      }

      if (!structureResult.success) {
        errors.push({
          template: relative(process.cwd(), templatePath),
          errors: structureResult.errors,
        })
      }
    } catch (error) {
      errors.push({
        template: relative(process.cwd(), templatePath),
        errors: [error instanceof Error ? error.message : String(error)],
      })
    }
  }

  return {
    success: errors.length === 0,
    errors,
    templateCount: templateFiles.length,
  }
}

// ============================================================================
// Main Execution
// ============================================================================

function formatTime(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function main(): void {
  const startTime = performance.now()
  console.log("🔍 Validating content templates...\n")

  try {
    const result = validateTemplates()
    const duration = performance.now() - startTime

    if (!result.success) {
      console.error("❌ Template validation failed:\n")
      result.errors.forEach(({ template, errors }) => {
        console.error(`   📄 ${template}:`)
        errors.forEach((error) => {
          console.error(`      • ${error}`)
        })
        console.error("")
      })
      console.error(
        `Found ${result.errors.length} template(s) with violations in ${result.templateCount} total template(s) (${formatTime(duration)})`
      )
      console.error("\n💡 Action required:")
      console.error("   - Fix template structure to match Diataxis contracts")
      console.error("   - Ensure all required sections are present")
      console.error("   - Reference: @docs/governance/ENFORCEMENT_STRATEGY.md")
      process.exit(1)
    }

    console.log("✅ All templates follow Diataxis structure contracts")
    console.log(`\n⏱️  Validated ${result.templateCount} template(s) in ${formatTime(duration)}`)
    console.log("\n📋 Verified:")
    console.log("   ✓ Tutorial template has correct structure")
    console.log("   ✓ How-to template has correct structure")
    console.log("   ✓ Reference template has correct structure")
    console.log("   ✓ Explanation template has correct structure")
    process.exit(0)
  } catch (error) {
    const duration = performance.now() - startTime
    console.error(`\n❌ Validation failed after ${formatTime(duration)}`)
    console.error("Error:", error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
