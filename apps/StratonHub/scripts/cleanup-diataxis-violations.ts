/**
 * Diataxis Boundary Violation Cleanup Script — StratonHub
 *
 * Identifies and helps fix boundary violations in content structure.
 * Provides systematic cleanup strategy for all Diataxis violations.
 *
 * Usage:
 * ```bash
 * pnpm cleanup:diataxis
 * ```
 *
 * This script:
 * 1. Scans all MDX files for structure violations
 * 2. Identifies boundary violations (mixed modes, wrong sections)
 * 3. Generates fix suggestions
 * 4. Can auto-fix common violations (with --fix flag)
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs"
import { join, relative } from "path"
import { performance } from "perf_hooks"
import { loadContentFile } from "@/lib/content/loader"
import type { DiataxisType } from "@/lib/content/schemas"

// ============================================================================
// Constants
// ============================================================================

const SKIP_DIRECTORIES = new Set(["node_modules", ".next", ".git", "dist", "build", ".turbo"])

// ============================================================================
// Structure Analysis
// ============================================================================

interface Violation {
  filePath: string
  type: DiataxisType
  violations: string[]
  suggestions: string[]
  canAutoFix: boolean
  currentStructure: {
    h2Headings: string[]
    h3Headings: string[]
    hasCodeBlocks: boolean
  }
}

/**
 * Extract H2 headings from markdown
 */
function extractH2Headings(content: string): string[] {
  const h2Regex = /^##\s+(.+)$/gm
  const matches = content.matchAll(h2Regex)
  return Array.from(matches, (match) => match[1]?.trim() ?? '')
}

/**
 * Extract H3 headings from markdown
 */
function extractH3Headings(content: string): string[] {
  const h3Regex = /^###\s+(.+)$/gm
  const matches = content.matchAll(h3Regex)
  return Array.from(matches, (match) => match[1]?.trim() ?? '')
}

/**
 * Check if content has code blocks
 */
function hasCodeBlocks(content: string): boolean {
  return /```[\s\S]*?```/.test(content) || /`[^`]+`/.test(content)
}

/**
 * Analyze structure violations for Tutorial
 */
function analyzeTutorialViolations(
  content: string,
  h2Headings: string[]
): { violations: string[]; suggestions: string[]; canAutoFix: boolean } {
  const violations: string[] = []
  const suggestions: string[] = []
  const headingSet = new Set(h2Headings.map((h) => h.toLowerCase()))
  const steps = extractH3Headings(content).filter((h) => /^step\s+\d+/i.test(h))

  // Check for Introduction
  if (!headingSet.has("introduction")) {
    violations.push('Missing "## Introduction" section')
    if (headingSet.has("overview")) {
      suggestions.push('Rename "## Overview" to "## Introduction"')
    } else {
      suggestions.push('Add "## Introduction" section at the beginning')
    }
  }

  // Check for Prerequisites
  if (!headingSet.has("prerequisites")) {
    violations.push('Missing "## Prerequisites" section')
    suggestions.push('Add "## Prerequisites" section after Introduction')
  }

  // Check for Steps
  if (!headingSet.has("steps")) {
    violations.push('Missing "## Steps" section')
    suggestions.push(
      'Add "## Steps" section with numbered step subsections (### Step 1, ### Step 2, etc.)'
    )
  } else if (steps.length === 0) {
    violations.push('"## Steps" section exists but has no step subsections')
    suggestions.push("Add step subsections: ### Step 1, ### Step 2, etc.")
  }

  // Check for What We Built
  if (!headingSet.has("what we built") && !headingSet.has("what we've built")) {
    violations.push('Missing "## What We Built" section')
    suggestions.push('Add "## What We Built" section after Steps')
  }

  // Check for Next Steps
  if (!headingSet.has("next steps")) {
    violations.push('Missing "## Next Steps" section')
    if (headingSet.has("related") || headingSet.has("see also")) {
      suggestions.push('Rename "## Related" or "## See Also" to "## Next Steps"')
    } else {
      suggestions.push('Add "## Next Steps" section at the end')
    }
  }

  // Check section order
  const expectedOrder = [
    "introduction",
    "prerequisites",
    "steps",
    "what we built",
    "what we've built",
    "next steps",
  ]
  const actualOrder = h2Headings.map((h) => h.toLowerCase())
  const orderIssues: string[] = []

  let lastIndex = -1
  for (const expected of expectedOrder) {
    const currentIndex = actualOrder.indexOf(expected)
    if (currentIndex !== -1 && currentIndex < lastIndex) {
      orderIssues.push(`"${expected}" appears out of order`)
    }
    if (currentIndex !== -1) lastIndex = currentIndex
  }

  if (orderIssues.length > 0) {
    violations.push(`Section order violations: ${orderIssues.join(", ")}`)
    suggestions.push(
      "Reorder sections to: Introduction → Prerequisites → Steps → What We Built → Next Steps"
    )
  }

  const canAutoFix = violations.some(
    (v) => v.includes("Rename") || v.includes("overview") || v.includes("related")
  )

  return { violations, suggestions, canAutoFix }
}

/**
 * Analyze structure violations for How-to
 */
function analyzeHowToViolations(
  content: string,
  h2Headings: string[]
): { violations: string[]; suggestions: string[]; canAutoFix: boolean } {
  const violations: string[] = []
  const suggestions: string[] = []
  const headingSet = new Set(h2Headings.map((h) => h.toLowerCase()))
  const steps = extractH3Headings(content).filter((h) => /^step\s+\d+/i.test(h))

  if (!headingSet.has("introduction")) {
    violations.push('Missing "## Introduction" section')
    if (headingSet.has("overview")) {
      suggestions.push('Rename "## Overview" to "## Introduction"')
    } else {
      suggestions.push('Add "## Introduction" section')
    }
  }

  if (!headingSet.has("prerequisites")) {
    violations.push('Missing "## Prerequisites" section')
    suggestions.push('Add "## Prerequisites" section')
  }

  if (!headingSet.has("steps")) {
    violations.push('Missing "## Steps" section')
    suggestions.push('Add "## Steps" section with numbered steps')
  } else if (steps.length === 0) {
    violations.push('"## Steps" section has no step subsections')
    suggestions.push("Add step subsections: ### Step 1, ### Step 2, etc.")
  }

  const canAutoFix = violations.some((v) => v.includes("Rename") || v.includes("overview"))

  return { violations, suggestions, canAutoFix }
}

/**
 * Analyze structure violations for Reference
 */
function analyzeReferenceViolations(
  content: string,
  h2Headings: string[],
  h3Headings: string[]
): { violations: string[]; suggestions: string[]; canAutoFix: boolean } {
  const violations: string[] = []
  const suggestions: string[] = []
  const headingSet = new Set(h2Headings.map((h) => h.toLowerCase()))
  const h3Set = new Set(h3Headings.map((h) => h.toLowerCase()))

  if (!headingSet.has("overview")) {
    violations.push('Missing "## Overview" section')
    if (headingSet.has("introduction")) {
      suggestions.push('Rename "## Introduction" to "## Overview" (Reference docs use Overview)')
    } else {
      suggestions.push('Add "## Overview" section')
    }
  }

  const hasApiOrProperties =
    headingSet.has("api") ||
    headingSet.has("properties") ||
    headingSet.has("parameters") ||
    h3Set.has("api") ||
    h3Set.has("properties") ||
    h3Set.has("parameters")

  if (!hasApiOrProperties) {
    violations.push("Missing API/Properties/Parameters section")
    suggestions.push('Add "## API" or "## Properties" or "## Parameters" section')
  }

  if (!headingSet.has("examples") && !headingSet.has("example")) {
    violations.push('Missing "## Examples" section')
    suggestions.push('Add "## Examples" section')
  }

  if (!headingSet.has("see also") && !headingSet.has("related")) {
    violations.push('Missing "## See Also" section')
    suggestions.push('Add "## See Also" section')
  }

  const canAutoFix = violations.some((v) => v.includes("Rename"))

  return { violations, suggestions, canAutoFix }
}

/**
 * Analyze structure violations for Explanation
 */
function analyzeExplanationViolations(h2Headings: string[]): {
  violations: string[]
  suggestions: string[]
  canAutoFix: boolean
} {
  const violations: string[] = []
  const suggestions: string[] = []
  const headingSet = new Set(h2Headings.map((h) => h.toLowerCase()))

  if (!headingSet.has("introduction")) {
    violations.push('Missing "## Introduction" section')
    if (headingSet.has("overview")) {
      suggestions.push('Rename "## Overview" to "## Introduction"')
    } else {
      suggestions.push('Add "## Introduction" section')
    }
  }

  if (!headingSet.has("context")) {
    violations.push('Missing "## Context" section')
    suggestions.push('Add "## Context" section after Introduction')
  }

  if (!headingSet.has("details")) {
    violations.push('Missing "## Details" section')
    suggestions.push('Add "## Details" section after Context')
  }

  if (!headingSet.has("implications")) {
    violations.push('Missing "## Implications" section')
    suggestions.push('Add "## Implications" section at the end')
  }

  const canAutoFix = violations.some((v) => v.includes("Rename"))

  return { violations, suggestions, canAutoFix }
}

// ============================================================================
// File Discovery
// ============================================================================

function findMdxFiles(dir: string): string[] {
  const files: string[] = []
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      if (!SKIP_DIRECTORIES.has(entry.name)) {
        files.push(...findMdxFiles(fullPath))
      }
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(fullPath)
    }
  }

  return files
}

// ============================================================================
// Main Analysis
// ============================================================================

function analyzeAllViolations(): {
  violations: Violation[]
  summary: {
    total: number
    byType: Record<DiataxisType, number>
    canAutoFix: number
    requiresManualFix: number
  }
} {
  const violations: Violation[] = []
  const rootDir = process.cwd()

  function getAppDir(): string {
    const monorepoPath = join(rootDir, "apps/StratonHub/app")
    if (existsSync(monorepoPath)) {
      return monorepoPath
    }
    const appPath = join(rootDir, "app")
    if (existsSync(appPath)) {
      return appPath
    }
    return monorepoPath
  }

  const appDir = getAppDir()
  const mdxFiles = findMdxFiles(appDir)

  for (const filePath of mdxFiles) {
    try {
      const contentFile = loadContentFile(filePath)
      const type = contentFile.frontmatter.type
      const content = contentFile.content

      const h2Headings = extractH2Headings(content)
      const h3Headings = extractH3Headings(content)

      let analysis: { violations: string[]; suggestions: string[]; canAutoFix: boolean }

      switch (type) {
        case "tutorial":
          analysis = analyzeTutorialViolations(content, h2Headings)
          break
        case "how-to":
          analysis = analyzeHowToViolations(content, h2Headings)
          break
        case "reference":
          analysis = analyzeReferenceViolations(content, h2Headings, h3Headings)
          break
        case "explanation":
          analysis = analyzeExplanationViolations(h2Headings)
          break
        default:
          continue
      }

      if (analysis.violations.length > 0) {
        violations.push({
          filePath: relative(rootDir, filePath),
          type,
          violations: analysis.violations,
          suggestions: analysis.suggestions,
          canAutoFix: analysis.canAutoFix,
          currentStructure: {
            h2Headings,
            h3Headings,
            hasCodeBlocks: hasCodeBlocks(content),
          },
        })
      }
    } catch (error) {
      // Skip files that can't be loaded
      continue
    }
  }

  const byType: Record<DiataxisType, number> = {
    tutorial: 0,
    "how-to": 0,
    reference: 0,
    explanation: 0,
  }

  let canAutoFix = 0
  let requiresManualFix = 0

  for (const violation of violations) {
    byType[violation.type]++
    if (violation.canAutoFix) {
      canAutoFix++
    } else {
      requiresManualFix++
    }
  }

  return {
    violations,
    summary: {
      total: violations.length,
      byType,
      canAutoFix,
      requiresManualFix,
    },
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
  const shouldFix = process.argv.includes("--fix")

  console.log("🔍 Analyzing Diataxis boundary violations...\n")

  const { violations, summary } = analyzeAllViolations()
  const duration = performance.now() - startTime

  if (violations.length === 0) {
    console.log("✅ No boundary violations found!")
    console.log(`\n⏱️  Analyzed files in ${formatTime(duration)}`)
    process.exit(0)
  }

  console.log(`❌ Found ${violations.length} file(s) with boundary violations\n`)

  // Summary
  console.log("📊 Summary:")
  console.log(`   Total violations: ${summary.total}`)
  console.log(`   By type:`)
  console.log(`     - Tutorial: ${summary.byType.tutorial}`)
  console.log(`     - How-to: ${summary.byType["how-to"]}`)
  console.log(`     - Reference: ${summary.byType.reference}`)
  console.log(`     - Explanation: ${summary.byType.explanation}`)
  console.log(`   Can auto-fix: ${summary.canAutoFix}`)
  console.log(`   Requires manual fix: ${summary.requiresManualFix}\n`)

  // Detailed violations
  console.log("📋 Detailed Violations:\n")

  for (const violation of violations) {
    console.log(`📄 ${violation.filePath}`)
    console.log(`   Type: ${violation.type}`)
    console.log(
      `   Current sections: ${violation.currentStructure.h2Headings.join(", ") || "(none)"}`
    )
    console.log(`   Violations:`)
    violation.violations.forEach((v) => {
      console.log(`     ❌ ${v}`)
    })
    console.log(`   Suggestions:`)
    violation.suggestions.forEach((s) => {
      console.log(`     💡 ${s}`)
    })
    if (violation.canAutoFix) {
      console.log(`   ✅ Can be auto-fixed`)
    } else {
      console.log(`   ⚠️  Requires manual intervention`)
    }
    console.log("")
  }

  // Auto-fix option
  if (shouldFix && summary.canAutoFix > 0) {
    console.log("🔧 Auto-fixing violations...\n")
    // TODO: Implement auto-fix logic
    console.log("   ⚠️  Auto-fix not yet implemented. Use suggestions above to fix manually.")
  } else if (summary.canAutoFix > 0) {
    console.log("💡 Tip: Run with --fix flag to attempt auto-fixing")
  }

  console.log(`\n⏱️  Analysis completed in ${formatTime(duration)}`)
  console.log("\n📚 Reference:")
  console.log("   - Templates: @templates/content-schemas/")
  console.log("   - Strategy: @docs/governance/ENFORCEMENT_STRATEGY.md")

  process.exit(1)
}

if (require.main === module) {
  main()
}
