#!/usr/bin/env tsx
/**
 * Function and Script Registry Scanner
 *
 * Scans the codebase for functions and scripts, extracts JSDoc metadata,
 * and maintains a registry of all available functions and scripts with usage information.
 *
 * Features:
 * - Detects new functions and scripts
 * - Tracks modifications to existing items
 * - Extracts JSDoc comments for usage documentation
 * - Maintains registry with metadata (parameters, return types, examples)
 * - Supports both standalone scripts and exported functions
 *
 * Usage:
 *   pnpm registry:scan          # Scan and update registry
 *   pnpm registry:scan --watch   # Watch mode (auto-scan on changes)
 *   pnpm registry:scan --diff    # Show what changed since last scan
 */

import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { glob } from "glob"
import { Project } from "ts-morph"
import crypto from "node:crypto"

// ============================================================================
// Types
// ============================================================================

interface FunctionRegistry {
  version: string
  description: string
  lastUpdated: string
  functions: RegistryFunction[]
  scripts: RegistryScript[]
  metadata?: {
    totalItems: number
    totalFunctions: number
    totalScripts: number
    categories: Record<string, number>
    tags: Record<string, number>
  }
}

interface RegistryFunction {
  id: string
  name: string
  filePath: string
  description: string
  parameters: ParameterInfo[]
  returnType: string
  examples: string[]
  exported: boolean
  category: "utility" | "api" | "validation" | "generation" | "other"
  tags: string[]
  usage: string
  lastModified: string
  hash: string
  // Extended metadata (to be enhanced with dependency analysis)
  dependencies: Array<{ type: string; name: string; source: string }>
  lineage: { dependsOn: unknown[]; dependedBy: unknown[]; depth: number; circular: boolean }
  documentation: { hasJSDoc: boolean; hasExamples: boolean; hasUsage: boolean; completeness: number }
}

interface RegistryScript {
  id: string
  name: string
  filePath: string
  description: string
  usage: string
  examples: string[]
  category: "validation" | "generation" | "audit" | "migration" | "utility" | "other"
  tags: string[]
  shebang?: string
  lastModified: string
  hash: string
  // Extended metadata (to be enhanced with dependency analysis)
  dependencies: Array<{ type: string; name: string; source: string }>
  lineage: { dependsOn: unknown[]; dependedBy: unknown[]; depth: number; circular: boolean }
  executable: boolean
  documentation: { hasJSDoc: boolean; hasExamples: boolean; hasUsage: boolean; completeness: number }
}

interface ParameterInfo {
  name: string
  type: string
  description: string
  optional: boolean
  default?: string
}

interface ChangeReport {
  newFunctions: RegistryFunction[]
  modifiedFunctions: RegistryFunction[]
  deletedFunctions: string[]
  newScripts: RegistryScript[]
  modifiedScripts: RegistryScript[]
  deletedScripts: string[]
}

// ============================================================================
// Constants
// ============================================================================

const REGISTRY_PATH = join(process.cwd(), "scripts", "function-registry.json")
const SOURCE_PATHS = [
  "src/**/*.ts",
  "packages/**/src/**/*.ts",
  "apps/**/src/**/*.ts",
  "apps/**/lib/**/*.ts",
  "apps/**/components/**/*.ts",
]
const SCRIPT_PATHS = [
  "scripts/**/*.ts",
  "apps/**/scripts/**/*.ts",
]

const EXCLUDE_PATTERNS = [
  "node_modules",
  ".next",
  "dist",
  "build",
  ".turbo",
  ".test.ts",
  ".spec.ts",
  ".d.ts",
]

// Category detection keywords
const CATEGORY_KEYWORDS = {
  utility: ["utility", "helper", "util", "common"],
  api: ["api", "endpoint", "route", "handler"],
  validation: ["validate", "check", "verify", "audit"],
  generation: ["generate", "create", "build", "make"],
}

// ============================================================================
// Utility Functions
// ============================================================================

function computeHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex").substring(0, 16)
}

function detectCategory(name: string, description: string, filePath: string): RegistryFunction["category"] {
  const searchText = `${name} ${description} ${filePath}`.toLowerCase()

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => searchText.includes(keyword))) {
      return category as RegistryFunction["category"]
    }
  }

  return "other"
}

function detectScriptCategory(name: string, description: string): RegistryScript["category"] {
  const searchText = `${name} ${description}`.toLowerCase()

  if (searchText.includes("validate") || searchText.includes("check") || searchText.includes("audit")) {
    return "validation"
  }
  if (searchText.includes("generate") || searchText.includes("create")) {
    return "generation"
  }
  if (searchText.includes("audit")) {
    return "audit"
  }
  if (searchText.includes("migrate") || searchText.includes("migration")) {
    return "migration"
  }
  if (searchText.includes("utility") || searchText.includes("helper")) {
    return "utility"
  }

  return "other"
}

function calculateDocCompleteness(description: string, examples: string[], usage: string): number {
  let score = 0
  if (description) score += 40
  if (examples.length > 0) score += 30
  if (usage) score += 30
  return score
}

function extractTags(description: string, filePath: string): string[] {
  const tags: string[] = []
  const text = `${description} ${filePath}`.toLowerCase()

  // Extract common tags
  if (text.includes("zod")) tags.push("zod")
  if (text.includes("typescript")) tags.push("typescript")
  if (text.includes("nextjs") || text.includes("next.js")) tags.push("nextjs")
  if (text.includes("react")) tags.push("react")
  if (text.includes("database") || text.includes("drizzle")) tags.push("database")
  if (text.includes("validation")) tags.push("validation")
  if (text.includes("generation")) tags.push("generation")

  return tags
}

// ============================================================================
// JSDoc Extraction
// ============================================================================

function extractJSDocComment(node: {
  getJsDocs(): Array<{
    getComment(): string
    getTags(): Array<{ getTagName(): string; getComment(): string; getName?(): string }>
  }>
}): {
  description: string
  examples: string[]
  usage: string
  tags: string[]
} {
  const jsDocs = node.getJsDocs()
  if (jsDocs.length === 0) return { description: "", examples: [], usage: "", tags: [] }

  const firstDoc = jsDocs[0]
  const description = firstDoc?.getComment() || ""
  const examples: string[] = []
  let usage = ""
  const tags: string[] = []

  firstDoc?.getTags().forEach((tag) => {
    const tagName = tag.getTagName()
    const comment = tag.getComment()

    if (tagName === "example") {
      if (comment) examples.push(comment)
    } else if (tagName === "usage") {
      usage = comment || ""
    } else if (tagName === "tag" || tagName === "tags") {
      if (comment) tags.push(...comment.split(",").map((t) => t.trim()))
    }
  })

  return { description, examples, usage, tags }
}

function extractParameterInfo(
  func: { getParameters(): Array<{ getName(): string; getType(): { getText(): string }; hasInitializer(): boolean; isOptional(): boolean; getInitializer(): { getText(): string } | undefined }> },
  jsDoc: { getTags(): Array<{ getTagName(): string; getName?(): string; getComment(): string }> }
): ParameterInfo[] {
  return func.getParameters().map((param) => {
    const paramName = param.getName()
    const paramType = param.getType().getText()
    const isOptional = param.hasInitializer() || param.isOptional()
    const defaultValue = param.getInitializer()?.getText()

    // Extract param docs from JSDoc
    let paramDescription = ""
    const paramTag = jsDoc.getTags().find((tag) => {
      try {
        return tag.getTagName() === "param" && tag.getName?.() === paramName
      } catch {
        return false
      }
    })
    if (paramTag) {
      paramDescription = paramTag.getComment() || ""
    }

    return {
      name: paramName,
      type: paramType,
      description: paramDescription,
      optional: isOptional,
      default: defaultValue,
    }
  })
}

// ============================================================================
// Function Scanning
// ============================================================================

async function scanFunctions(): Promise<RegistryFunction[]> {
  const project = new Project({
    tsConfigFilePath: join(process.cwd(), "tsconfig.json"),
  })

  // Add source files
  for (const pattern of SOURCE_PATHS) {
    const files = await glob(pattern, {
      ignore: EXCLUDE_PATTERNS.map((p) => `**/${p}/**`),
      cwd: process.cwd(),
    })
    files.forEach((file) => {
      if (!EXCLUDE_PATTERNS.some((pattern) => file.includes(pattern))) {
        try {
          project.addSourceFileAtPath(file)
        } catch {
          // Skip files that can't be parsed
        }
      }
    })
  }

  const functions: RegistryFunction[] = []
  const processed = new Set<string>()

  project.getSourceFiles().forEach((sourceFile) => {
    const filePath = relative(process.cwd(), sourceFile.getFilePath())

    // Skip excluded files
    if (EXCLUDE_PATTERNS.some((pattern) => filePath.includes(pattern))) {
      return
    }

    // Extract functions
    sourceFile.getFunctions().forEach((func) => {
      const name = func.getName()
      if (!name) return

      const uniqueKey = `${filePath}:${name}`
      if (processed.has(uniqueKey)) return
      processed.add(uniqueKey)

      const jsDoc = extractJSDocComment(func)
      const description = jsDoc.description || `Function: ${name}`
      const examples = jsDoc.examples
      const usage = jsDoc.usage || `import { ${name} } from '${filePath}'`
      const docTags = jsDoc.tags

      const params = extractParameterInfo(func, func.getJsDocs()[0] || { getTags: () => [] })
      const returnType = func.getReturnType().getText()
      const isExported = func.isExported()

      // Only include exported functions or functions with JSDoc
      if (!isExported && !jsDoc.description) {
        return
      }

      const fileContent = sourceFile.getFullText()
      const hash = computeHash(fileContent)
      const stats = statSync(sourceFile.getFilePath())
      const category = detectCategory(name, description, filePath)
      const tags = [...docTags, ...extractTags(description, filePath)]

      // Calculate documentation completeness
      const docCompleteness = calculateDocCompleteness(jsDoc.description, examples, usage)

      functions.push({
        id: `${filePath.replace(/[^a-zA-Z0-9]/g, "_")}_${name}`,
        name,
        filePath,
        description,
        parameters: params,
        returnType,
        examples,
        exported: isExported,
        category,
        tags: [...new Set(tags)], // Remove duplicates
        usage,
        lastModified: stats.mtime.toISOString(),
        hash,
        // Extended metadata (dependencies analysis to be enhanced)
        dependencies: [], // TODO: Analyze imports and function calls
        lineage: { dependsOn: [], dependedBy: [], depth: 0, circular: false },
        documentation: {
          hasJSDoc: !!jsDoc.description,
          hasExamples: examples.length > 0,
          hasUsage: !!usage,
          completeness: docCompleteness,
        },
      })
    })
  })

  return functions
}

// ============================================================================
// Script Scanning
// ============================================================================

async function scanScripts(): Promise<RegistryScript[]> {
  const scripts: RegistryScript[] = []

  for (const pattern of SCRIPT_PATHS) {
    const files = await glob(pattern, {
      ignore: EXCLUDE_PATTERNS.map((p) => `**/${p}/**`),
      cwd: process.cwd(),
    })

    for (const file of files) {
      if (EXCLUDE_PATTERNS.some((pattern) => file.includes(pattern))) {
        continue
      }

      const filePath = relative(process.cwd(), file)
      const content = readFileSync(file, "utf-8")
      const hash = computeHash(content)
      const stats = statSync(file)

      // Extract script name from filename
      const name = file.split("/").pop()?.replace(/\.ts$/, "") || "unknown"

      // Extract shebang
      const shebangMatch = content.match(/^#!([^\n]+)/)
      const shebang = shebangMatch ? shebangMatch[1] : undefined

      // Extract JSDoc from top of file
      const jsDocMatch = content.match(/\/\*\*([\s\S]*?)\*\//)
      let description = `Script: ${name}`
      let usage = `pnpm ${name.replace(/\.ts$/, "")}`
      const examples: string[] = []
      const tags: string[] = []

      if (jsDocMatch) {
        const jsDoc = jsDocMatch[1]
        description = jsDoc
          .split("\n")
          .map((line) => line.replace(/^\s*\*?\s?/, "").trim())
          .filter((line) => !line.startsWith("@"))
          .join(" ")
          .trim() || description

        // Extract @usage tag
        const usageMatch = jsDoc.match(/@usage\s+(.+)/i)
        if (usageMatch) {
          usage = usageMatch[1].trim()
        }

        // Extract @example tags
        const exampleMatches = jsDoc.matchAll(/@example\s+([^\n@]+)/gi)
        for (const match of exampleMatches) {
          examples.push(match[1].trim())
        }

        // Extract @tag tags
        const tagMatches = jsDoc.matchAll(/@tag\s+([^\n@]+)/gi)
        for (const match of tagMatches) {
          tags.push(...match[1].split(",").map((t) => t.trim()))
        }
      }

      const category = detectScriptCategory(name, description)
      const allTags = [...tags, ...extractTags(description, filePath)]

      // Calculate documentation completeness
      const hasJSDoc = !!jsDocMatch
      const docCompleteness = calculateDocCompleteness(description, examples, usage)

      scripts.push({
        id: filePath.replace(/[^a-zA-Z0-9]/g, "_"),
        name,
        filePath,
        description,
        usage,
        examples,
        category,
        tags: [...new Set(allTags)],
        shebang,
        lastModified: stats.mtime.toISOString(),
        hash,
        // Extended metadata (dependencies analysis to be enhanced)
        dependencies: [], // TODO: Analyze imports
        lineage: { dependsOn: [], dependedBy: [], depth: 0, circular: false },
        executable: !!shebang,
        documentation: {
          hasJSDoc,
          hasExamples: examples.length > 0,
          hasUsage: !!usage && usage !== `pnpm ${name.replace(/\.ts$/, "")}`,
          completeness: docCompleteness,
        },
      })
    }
  }

  return scripts
}

// ============================================================================
// Registry Management
// ============================================================================

function loadRegistry(): FunctionRegistry {
  if (!existsSync(REGISTRY_PATH)) {
    return {
      version: "1.0.0",
      description: "Function and Script Registry",
      lastUpdated: new Date().toISOString(),
      functions: [],
      scripts: [],
    }
  }

  const content = readFileSync(REGISTRY_PATH, "utf-8")
  return JSON.parse(content) as FunctionRegistry
}

function saveRegistry(registry: FunctionRegistry): void {
  registry.lastUpdated = new Date().toISOString()
  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf-8")
}

function compareRegistries(
  oldRegistry: FunctionRegistry,
  newFunctions: RegistryFunction[],
  newScripts: RegistryScript[]
): ChangeReport {
  const report: ChangeReport = {
    newFunctions: [],
    modifiedFunctions: [],
    deletedFunctions: [],
    newScripts: [],
    modifiedScripts: [],
    deletedScripts: [],
  }

  // Compare functions
  const oldFunctionMap = new Map(oldRegistry.functions.map((f) => [f.id, f]))
  const newFunctionMap = new Map(newFunctions.map((f) => [f.id, f]))

  // Find new and modified functions
  for (const newFunc of newFunctions) {
    const oldFunc = oldFunctionMap.get(newFunc.id)
    if (!oldFunc) {
      report.newFunctions.push(newFunc)
    } else if (oldFunc.hash !== newFunc.hash) {
      report.modifiedFunctions.push(newFunc)
    }
  }

  // Find deleted functions
  for (const oldFunc of oldRegistry.functions) {
    if (!newFunctionMap.has(oldFunc.id)) {
      report.deletedFunctions.push(oldFunc.id)
    }
  }

  // Compare scripts
  const oldScriptMap = new Map(oldRegistry.scripts.map((s) => [s.id, s]))
  const newScriptMap = new Map(newScripts.map((s) => [s.id, s]))

  // Find new and modified scripts
  for (const newScript of newScripts) {
    const oldScript = oldScriptMap.get(newScript.id)
    if (!oldScript) {
      report.newScripts.push(newScript)
    } else if (oldScript.hash !== newScript.hash) {
      report.modifiedScripts.push(newScript)
    }
  }

  // Find deleted scripts
  for (const oldScript of oldRegistry.scripts) {
    if (!newScriptMap.has(oldScript.id)) {
      report.deletedScripts.push(oldScript.id)
    }
  }

  return report
}

function printChangeReport(report: ChangeReport): void {
  console.log("\n📊 Registry Change Report\n")
  console.log("=" .repeat(50))

  if (report.newFunctions.length > 0) {
    console.log(`\n✨ New Functions (${report.newFunctions.length}):`)
    report.newFunctions.forEach((f) => {
      console.log(`  • ${f.name} (${f.filePath})`)
    })
  }

  if (report.modifiedFunctions.length > 0) {
    console.log(`\n🔄 Modified Functions (${report.modifiedFunctions.length}):`)
    report.modifiedFunctions.forEach((f) => {
      console.log(`  • ${f.name} (${f.filePath})`)
    })
  }

  if (report.deletedFunctions.length > 0) {
    console.log(`\n❌ Deleted Functions (${report.deletedFunctions.length}):`)
    report.deletedFunctions.forEach((id) => {
      console.log(`  • ${id}`)
    })
  }

  if (report.newScripts.length > 0) {
    console.log(`\n✨ New Scripts (${report.newScripts.length}):`)
    report.newScripts.forEach((s) => {
      console.log(`  • ${s.name} (${s.filePath})`)
    })
  }

  if (report.modifiedScripts.length > 0) {
    console.log(`\n🔄 Modified Scripts (${report.modifiedScripts.length}):`)
    report.modifiedScripts.forEach((s) => {
      console.log(`  • ${s.name} (${s.filePath})`)
    })
  }

  if (report.deletedScripts.length > 0) {
    console.log(`\n❌ Deleted Scripts (${report.deletedScripts.length}):`)
    report.deletedScripts.forEach((id) => {
      console.log(`  • ${id}`)
    })
  }

  const totalChanges =
    report.newFunctions.length +
    report.modifiedFunctions.length +
    report.deletedFunctions.length +
    report.newScripts.length +
    report.modifiedScripts.length +
    report.deletedScripts.length

  if (totalChanges === 0) {
    console.log("\n✅ No changes detected")
  } else {
    console.log(`\n📈 Total Changes: ${totalChanges}`)
  }

  console.log("\n" + "=".repeat(50))
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const showDiff = args.includes("--diff")
  const watchMode = args.includes("--watch")

  console.log("🔍 Scanning codebase for functions and scripts...")

  const oldRegistry = loadRegistry()
  const functions = await scanFunctions()
  const scripts = await scanScripts()

  if (showDiff) {
    const report = compareRegistries(oldRegistry, functions, scripts)
    printChangeReport(report)
  }

  const newRegistry: FunctionRegistry = {
    version: "1.0.0",
    description: "Function and Script Registry - Tracks all functions and scripts with usage information",
    lastUpdated: new Date().toISOString(),
    functions,
    scripts,
  }

  saveRegistry(newRegistry)

  console.log(`\n✅ Registry updated!`)
  console.log(`   Functions: ${functions.length}`)
  console.log(`   Scripts: ${scripts.length}`)
  console.log(`   Registry saved to: ${REGISTRY_PATH}`)

  if (watchMode) {
    console.log("\n👀 Watch mode enabled. Press Ctrl+C to stop.")
    // TODO: Implement file watching
  }
}

main().catch((error) => {
  console.error("❌ Error:", error)
  process.exit(1)
})
