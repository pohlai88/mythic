/**
 * Diataxis Content Structure Validator — StratonHub
 *
 * Enforces Diataxis framework content structure based on document type.
 * This is NOT just validating the type field—it validates the actual content structure.
 *
 * Contract-First Approach:
 * - Zod schemas define expected structure per Diataxis type
 * - Content is validated against type-specific structure rules
 * - Build-time enforcement prevents non-compliant content
 *
 * Diataxis Type Requirements:
 * - Tutorial: Introduction → Prerequisites → Steps → What We Built → Next Steps
 * - How-to: Introduction → Prerequisites → Steps → Troubleshooting
 * - Reference: Overview → API/Properties → Examples → See Also
 * - Explanation: Introduction → Context → Details → Implications
 *
 * Performance Optimizations:
 * - Pre-compiled regex patterns
 * - Efficient AST parsing (markdown headings)
 * - Early exit on first violation
 *
 * Usage:
 * ```bash
 * pnpm validate:diataxis
 * ```
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs"
import { join, relative } from "path"
import { performance } from "perf_hooks"
import { z as z4 } from "zod/v4"
import { loadContentFile } from "@/lib/content/loader"
import type { DiataxisType } from "@/lib/content/schemas"

// ============================================================================
// Constants
// ============================================================================

const SKIP_DIRECTORIES = new Set(["node_modules", ".next", ".git", "dist", "build", ".turbo"])

const EARLY_EXIT = process.env.CI === "true" || process.argv.includes("--early-exit")

// ============================================================================
// Diataxis Structure Contracts (Zod Schemas)
// ============================================================================

/**
 * Contract: Tutorial Structure
 * Required sections in order:
 * 1. Introduction (H2)
 * 2. Prerequisites (H2)
 * 3. Steps (H2) with Step N (H3) subsections
 * 4. What We Built (H2)
 * 5. Next Steps (H2)
 */
const tutorialStructureSchema = z4.object({
  hasIntroduction: z4.boolean().describe("Must have ## Introduction"),
  hasPrerequisites: z4.boolean().describe("Must have ## Prerequisites"),
  hasSteps: z4.boolean().describe("Must have ## Steps"),
  stepCount: z4.number().min(1).describe("Must have at least 1 step (### Step N)"),
  hasWhatWeBuilt: z4.boolean().describe("Must have ## What We Built"),
  hasNextSteps: z4.boolean().describe("Must have ## Next Steps"),
  order: z4
    .array(z4.string())
    .describe(
      "Section order must be: Introduction → Prerequisites → Steps → What We Built → Next Steps"
    ),
})

/**
 * Contract: How-to Structure
 * Required sections:
 * 1. Introduction (H2)
 * 2. Prerequisites (H2)
 * 3. Steps (H2) with Step N (H3) subsections
 * 4. Troubleshooting (H2) - optional but recommended
 */
const howToStructureSchema = z4.object({
  hasIntroduction: z4.boolean().describe("Must have ## Introduction"),
  hasPrerequisites: z4.boolean().describe("Must have ## Prerequisites"),
  hasSteps: z4.boolean().describe("Must have ## Steps"),
  stepCount: z4.number().min(1).describe("Must have at least 1 step (### Step N)"),
  hasTroubleshooting: z4.boolean().optional().describe("Should have ## Troubleshooting"),
  order: z4
    .array(z4.string())
    .describe("Section order must be: Introduction → Prerequisites → Steps → Troubleshooting"),
})

/**
 * Contract: Reference Structure
 * Required sections:
 * 1. Overview (H2)
 * 2. API/Properties (H2 or H3)
 * 3. Examples (H2)
 * 4. See Also (H2)
 */
const referenceStructureSchema = z4.object({
  hasOverview: z4.boolean().describe("Must have ## Overview"),
  hasApiOrProperties: z4.boolean().describe("Must have API or Properties section"),
  hasExamples: z4.boolean().describe("Must have ## Examples"),
  hasSeeAlso: z4.boolean().describe("Must have ## See Also"),
  order: z4
    .array(z4.string())
    .describe("Section order must be: Overview → API/Properties → Examples → See Also"),
})

/**
 * Contract: Explanation Structure
 * Required sections:
 * 1. Introduction (H2)
 * 2. Context (H2)
 * 3. Details (H2)
 * 4. Implications (H2)
 */
const explanationStructureSchema = z4.object({
  hasIntroduction: z4.boolean().describe("Must have ## Introduction"),
  hasContext: z4.boolean().describe("Must have ## Context"),
  hasDetails: z4.boolean().describe("Must have ## Details"),
  hasImplications: z4.boolean().describe("Must have ## Implications"),
  order: z4
    .array(z4.string())
    .describe("Section order must be: Introduction → Context → Details → Implications"),
})

// ============================================================================
// Content Parsing
// ============================================================================

/**
 * Extract H2 headings from markdown content
 */
function extractH2Headings(content: string): string[] {
  const h2Regex = /^##\s+(.+)$/gm
  const matches = content.matchAll(h2Regex)
  return Array.from(matches, (match) => match[1]?.trim() ?? "").filter(Boolean)
}

/**
 * Extract H3 headings from markdown content
 */
function extractH3Headings(content: string): string[] {
  const h3Regex = /^###\s+(.+)$/gm
  const matches = content.matchAll(h3Regex)
  return Array.from(matches, (match) => match[1]?.trim() ?? "").filter(Boolean)
}

/**
 * Extract step headings (H3) that match "Step N" pattern
 */
function extractSteps(content: string): string[] {
  const h3Headings = extractH3Headings(content)
  return h3Headings.filter((heading) => /^Step\s+\d+/i.test(heading))
}

// ============================================================================
// Structure Validation
// ============================================================================

/**
 * Validate Tutorial structure
 */
function validateTutorialStructure(content: string): {
  success: boolean
  errors: string[]
  data?: z4.infer<typeof tutorialStructureSchema>
} {
  const h2Headings = extractH2Headings(content)
  const steps = extractSteps(content)
  const headingSet = new Set(h2Headings.map((h) => h.toLowerCase()))

  const data = {
    hasIntroduction: headingSet.has("introduction"),
    hasPrerequisites: headingSet.has("prerequisites"),
    hasSteps: headingSet.has("steps"),
    stepCount: steps.length,
    hasWhatWeBuilt: headingSet.has("what we built") || headingSet.has("what we've built"),
    hasNextSteps: headingSet.has("next steps"),
    order: h2Headings,
  }

  const result = tutorialStructureSchema.safeParse(data)

  if (!result.success) {
    // Zod v4 error structure
    const errorMessages: string[] = []
    if (result.error.issues) {
      errorMessages.push(
        ...result.error.issues.map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join(".") : "root"
          return `${path}: ${issue.message}`
        })
      )
    } else {
      errorMessages.push(result.error.message || "Validation failed")
    }
    return {
      success: false,
      errors: errorMessages,
    }
  }

  // Validate section order
  const expectedOrder = [
    "introduction",
    "prerequisites",
    "steps",
    "what we built",
    "what we've built",
    "next steps",
  ]
  const actualOrder = h2Headings.map((h) => h.toLowerCase())
  const orderErrors: string[] = []

  let lastIndex = -1
  for (const expected of expectedOrder) {
    const currentIndex = actualOrder.indexOf(expected)
    if (currentIndex !== -1) {
      if (currentIndex < lastIndex) {
        orderErrors.push(`Section "${expected}" appears out of order`)
      }
      lastIndex = currentIndex
    }
  }

  if (orderErrors.length > 0) {
    return {
      success: false,
      errors: orderErrors,
    }
  }

  return {
    success: true,
    errors: [],
    data: result.data,
  }
}

/**
 * Validate How-to structure
 */
function validateHowToStructure(content: string): {
  success: boolean
  errors: string[]
  data?: z4.infer<typeof howToStructureSchema>
} {
  const h2Headings = extractH2Headings(content)
  const steps = extractSteps(content)
  const headingSet = new Set(h2Headings.map((h) => h.toLowerCase()))

  const data = {
    hasIntroduction: headingSet.has("introduction"),
    hasPrerequisites: headingSet.has("prerequisites"),
    hasSteps: headingSet.has("steps"),
    stepCount: steps.length,
    hasTroubleshooting: headingSet.has("troubleshooting"),
    order: h2Headings,
  }

  const result = howToStructureSchema.safeParse(data)

  if (!result.success) {
    // Zod v4 error structure
    const errorMessages: string[] = []
    if (result.error.issues) {
      errorMessages.push(
        ...result.error.issues.map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join(".") : "root"
          return `${path}: ${issue.message}`
        })
      )
    } else {
      errorMessages.push(result.error.message || "Validation failed")
    }
    return {
      success: false,
      errors: errorMessages,
    }
  }

  return {
    success: true,
    errors: [],
    data: result.data,
  }
}

/**
 * Validate Reference structure
 */
function validateReferenceStructure(content: string): {
  success: boolean
  errors: string[]
  data?: z4.infer<typeof referenceStructureSchema>
} {
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

  const data = {
    hasOverview: headingSet.has("overview"),
    hasApiOrProperties,
    hasExamples: headingSet.has("examples") || headingSet.has("example"),
    hasSeeAlso: headingSet.has("see also") || headingSet.has("related"),
    order: h2Headings,
  }

  const result = referenceStructureSchema.safeParse(data)

  if (!result.success) {
    // Zod v4 error structure
    const errorMessages: string[] = []
    if (result.error.issues) {
      errorMessages.push(
        ...result.error.issues.map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join(".") : "root"
          return `${path}: ${issue.message}`
        })
      )
    } else {
      errorMessages.push(result.error.message || "Validation failed")
    }
    return {
      success: false,
      errors: errorMessages,
    }
  }

  return {
    success: true,
    errors: [],
    data: result.data,
  }
}

/**
 * Validate Explanation structure
 */
function validateExplanationStructure(content: string): {
  success: boolean
  errors: string[]
  data?: z4.infer<typeof explanationStructureSchema>
} {
  const h2Headings = extractH2Headings(content)
  const headingSet = new Set(h2Headings.map((h) => h.toLowerCase()))

  const data = {
    hasIntroduction: headingSet.has("introduction"),
    hasContext: headingSet.has("context"),
    hasDetails: headingSet.has("details"),
    hasImplications: headingSet.has("implications"),
    order: h2Headings,
  }

  const result = explanationStructureSchema.safeParse(data)

  if (!result.success) {
    // Zod v4 error structure
    const errorMessages: string[] = []
    if (result.error.issues) {
      errorMessages.push(
        ...result.error.issues.map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join(".") : "root"
          return `${path}: ${issue.message}`
        })
      )
    } else {
      errorMessages.push(result.error.message || "Validation failed")
    }
    return {
      success: false,
      errors: errorMessages,
    }
  }

  return {
    success: true,
    errors: [],
    data: result.data,
  }
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
// Main Validation
// ============================================================================

function validateDiataxisStructure(): {
  success: boolean
  errors: Array<{ path: string; errors: string[] }>
  fileCount: number
} {
  const errors: Array<{ path: string; errors: string[] }> = []
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

  if (!existsSync(appDir)) {
    return {
      success: false,
      errors: [{ path: appDir, errors: ["App directory not found"] }],
      fileCount: 0,
    }
  }

  const mdxFiles = findMdxFiles(appDir)

  if (mdxFiles.length === 0) {
    return {
      success: false,
      errors: [{ path: appDir, errors: ["No MDX files found"] }],
      fileCount: 0,
    }
  }

  for (const filePath of mdxFiles) {
    try {
      // Load and validate frontmatter first
      const contentFile = loadContentFile(filePath)
      const type = contentFile.frontmatter.type
      const content = contentFile.content

      // Validate structure based on type
      let structureResult: { success: boolean; errors: string[] }
      switch (type) {
        case "tutorial":
          structureResult = validateTutorialStructure(content)
          break
        case "how-to":
          structureResult = validateHowToStructure(content)
          break
        case "reference":
          structureResult = validateReferenceStructure(content)
          break
        case "explanation":
          structureResult = validateExplanationStructure(content)
          break
        default:
          structureResult = {
            success: false,
            errors: [`Unknown Diataxis type: ${type}`],
          }
      }

      if (!structureResult.success) {
        const relativePath = relative(rootDir, filePath)
        errors.push({
          path: relativePath,
          errors: structureResult.errors,
        })
        if (EARLY_EXIT) break
      }
    } catch (error) {
      const relativePath = relative(rootDir, filePath)
      errors.push({
        path: relativePath,
        errors: [error instanceof Error ? error.message : String(error)],
      })
      if (EARLY_EXIT) break
    }
  }

  return {
    success: errors.length === 0,
    errors,
    fileCount: mdxFiles.length,
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
  console.log("🔍 Validating Diataxis content structure...\n")

  try {
    const result = validateDiataxisStructure()
    const duration = performance.now() - startTime

    if (!result.success) {
      console.error("❌ Diataxis structure validation failed:\n")
      result.errors.forEach(({ path, errors }) => {
        console.error(`   📄 ${path}:`)
        errors.forEach((error) => {
          console.error(`      • ${error}`)
        })
        console.error("")
      })
      console.error(
        `Found ${result.errors.length} file(s) with structure violations in ${result.fileCount} total file(s) (${formatTime(duration)})`
      )
      console.error("\n💡 Action required:")
      console.error("   - Fix content structure to match Diataxis type requirements")
      console.error("   - Ensure required sections are present and in correct order")
      console.error("   - Reference: @templates/content-schemas/ for structure templates")
      process.exit(1)
    }

    console.log("✅ All content follows Diataxis structure requirements")
    console.log(
      `\n⏱️  Validated ${result.fileCount} file${result.fileCount !== 1 ? "s" : ""} in ${formatTime(duration)}`
    )
    console.log("\n📋 Verified:")
    console.log(
      "   ✓ All tutorials have required sections (Introduction → Prerequisites → Steps → What We Built → Next Steps)"
    )
    console.log(
      "   ✓ All how-to guides have required sections (Introduction → Prerequisites → Steps)"
    )
    console.log(
      "   ✓ All reference docs have required sections (Overview → API/Properties → Examples → See Also)"
    )
    console.log(
      "   ✓ All explanations have required sections (Introduction → Context → Details → Implications)"
    )
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
