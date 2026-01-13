#!/usr/bin/env tsx
/**
 * Documentation Audit Script
 *
 * Performs 360-degree documentation audit:
 * - Scans all documentation files
 * - Identifies duplicates
 * - Detects DRY violations
 * - Generates registry
 * - Provides consolidation recommendations
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { glob } from "glob"
import chalk from "chalk"

// Simple frontmatter parser (basic YAML parsing)
function parseFrontmatter(content: string): { data: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { data: {}, content }
  }

  const yamlContent = match[1]
  const bodyContent = match[2]

  // Simple YAML parser (basic key-value pairs)
  const data: Record<string, any> = {}
  yamlContent.split("\n").forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) return

    const colonIndex = trimmed.indexOf(":")
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim()
      let value = trimmed.substring(colonIndex + 1).trim()

      // Remove quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      // Parse arrays
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((v) => v.trim().replace(/['"]/g, ""))
      }

      // Parse booleans
      if (value === "true") value = true
      if (value === "false") value = false

      data[key] = value
    }
  })

  return { data, content: bodyContent }
}

interface DocMetadata {
  path: string
  title: string
  category: string
  tags: string[]
  purpose: string
  sourceOfTruth: boolean
  duplicates: string[]
  similarTopics: string[]
}

interface AuditResult {
  total: number
  byCategory: Record<string, number>
  duplicates: DuplicateCluster[]
  dryViolations: DRYViolation[]
  missingCrossReferences: string[]
  recommendations: Recommendation[]
}

interface DuplicateCluster {
  topic: string
  files: string[]
  similarity: "high" | "medium" | "low"
  recommendation: string
}

interface DRYViolation {
  content: string
  locations: string[]
  severity: "high" | "medium" | "low"
  recommendation: string
}

interface Recommendation {
  type: "consolidate" | "cross-reference" | "archive" | "split"
  priority: "high" | "medium" | "low"
  files: string[]
  description: string
}

// Documentation directories to scan
const DOC_DIRS = ["docs/**/*.md", "docs/**/*.mdx", "content/**/*.mdx", ".cursor/docs/**/*.md"]

// Exclude patterns
const EXCLUDE = [
  "**/node_modules/**",
  "**/.next/**",
  "**/dist/**",
  "**/build/**",
  "docs/migrations/**",
  "docs/changelog/**",
  ".cursor/archive/**",
  ".cursor/work/**",
]

async function scanDocumentation(): Promise<DocMetadata[]> {
  const files = await glob(DOC_DIRS, { ignore: EXCLUDE })
  const metadata: DocMetadata[] = []

  for (const file of files) {
    try {
      const content = readFileSync(file, "utf-8")
      const parsed = parseFrontmatter(content)
      const frontmatter = parsed.data

      // Extract category from path
      const category = extractCategory(file)

      // Extract title
      const title =
        frontmatter.title || extractTitle(content) || file.split("/").pop() || "Untitled"

      // Extract tags
      const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : []

      metadata.push({
        path: file,
        title,
        category,
        tags,
        purpose: frontmatter.purpose || frontmatter.description || "",
        sourceOfTruth: frontmatter.source_of_truth === true,
        duplicates: [],
        similarTopics: [],
      })
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  Could not parse ${file}: ${error}`))
    }
  }

  return metadata
}

function extractCategory(path: string): string {
  if (path.includes("/architecture/")) return "Architecture"
  if (path.includes("/api/")) return "API"
  if (path.includes("/guides/")) return "Guides"
  if (path.includes("/reference/")) return "Reference"
  if (path.includes("/governance/")) return "Governance"
  if (path.includes("/_system/")) return "System"
  if (path.includes("/content/")) return "Public"
  if (path.startsWith("docs/")) return "Documentation"
  return "Other"
}

function extractTitle(content: string): string | null {
  const titleMatch = content.match(/^#\s+(.+)$/m)
  return titleMatch ? titleMatch[1].trim() : null
}

function detectDuplicates(metadata: DocMetadata[]): DuplicateCluster[] {
  const clusters: DuplicateCluster[] = []
  const topics = new Map<string, string[]>()

  // Group by topic (simplified - based on title/keywords)
  for (const doc of metadata) {
    const topic = extractTopic(doc)
    if (!topics.has(topic)) {
      topics.set(topic, [])
    }
    topics.get(topic)!.push(doc.path)
  }

  // Find clusters with multiple files
  for (const [topic, files] of topics.entries()) {
    if (files.length > 1) {
      const similarity = determineSimilarity(files, metadata)
      clusters.push({
        topic,
        files,
        similarity,
        recommendation: generateRecommendation(topic, files, similarity),
      })
    }
  }

  return clusters
}

function extractTopic(doc: DocMetadata): string {
  // Extract topic from title or path
  const title = doc.title.toLowerCase()
  const path = doc.path.toLowerCase()

  // Common topics
  if (title.includes("turbopack") || path.includes("turbopack")) return "Turbopack"
  if (title.includes("turborepo") || path.includes("turborepo")) return "Turborepo"
  if (title.includes("getting started") || title.includes("quick start")) return "Getting Started"
  if (title.includes("migration") || path.includes("migration")) return "Migration"
  if (title.includes("organization") || title.includes("strategy"))
    return "Documentation Organization"
  if (title.includes("architecture") || path.includes("architecture")) return "Architecture"
  if (title.includes("api") || path.includes("/api/")) return "API"

  // Default: use first significant word from title
  const words = doc.title.split(/\s+/).filter((w) => w.length > 3)
  return words[0]?.toLowerCase() || "other"
}

function determineSimilarity(files: string[], metadata: DocMetadata[]): "high" | "medium" | "low" {
  // Simplified similarity detection
  // In production, use more sophisticated text similarity algorithms
  const titles = files.map((f) => {
    const doc = metadata.find((m) => m.path === f)
    return doc?.title.toLowerCase() || ""
  })

  // Check for exact matches or high similarity
  const uniqueTitles = new Set(titles)
  if (uniqueTitles.size === 1) return "high"
  if (uniqueTitles.size < titles.length) return "medium"
  return "low"
}

function generateRecommendation(
  topic: string,
  files: string[],
  similarity: "high" | "medium" | "low"
): string {
  if (similarity === "high") {
    return `CONSOLIDATE: Merge ${files.length} files into single source of truth`
  }
  if (similarity === "medium") {
    return `CROSS-REFERENCE: Add links between ${files.length} related files`
  }
  return `REVIEW: ${files.length} files cover similar topic - verify distinct purposes`
}

function detectDRYViolations(metadata: DocMetadata[]): DRYViolation[] {
  const violations: DRYViolation[] = []

  // Check for repeated content patterns
  const contentMap = new Map<string, string[]>()

  for (const doc of metadata) {
    // Simplified: check for common repeated phrases
    const commonPhrases = [
      "getting started",
      "quick start",
      "installation",
      "configuration",
      "best practices",
    ]

    for (const phrase of commonPhrases) {
      if (doc.title.toLowerCase().includes(phrase) || doc.purpose.toLowerCase().includes(phrase)) {
        if (!contentMap.has(phrase)) {
          contentMap.set(phrase, [])
        }
        contentMap.get(phrase)!.push(doc.path)
      }
    }
  }

  // Find violations (same phrase in multiple files)
  for (const [content, locations] of contentMap.entries()) {
    if (locations.length > 1) {
      violations.push({
        content,
        locations,
        severity: locations.length > 2 ? "high" : "medium",
        recommendation: `Ensure ${content} content is not duplicated - use cross-references or shared snippets`,
      })
    }
  }

  return violations
}

function generateRecommendations(
  duplicates: DuplicateCluster[],
  violations: DRYViolation[]
): Recommendation[] {
  const recommendations: Recommendation[] = []

  // High priority: consolidate duplicates
  for (const cluster of duplicates) {
    if (cluster.similarity === "high") {
      recommendations.push({
        type: "consolidate",
        priority: "high",
        files: cluster.files,
        description: cluster.recommendation,
      })
    }
  }

  // Medium priority: add cross-references
  for (const cluster of duplicates) {
    if (cluster.similarity === "medium") {
      recommendations.push({
        type: "cross-reference",
        priority: "medium",
        files: cluster.files,
        description: cluster.recommendation,
      })
    }
  }

  // High priority: fix DRY violations
  for (const violation of violations) {
    if (violation.severity === "high") {
      recommendations.push({
        type: "consolidate",
        priority: "high",
        files: violation.locations,
        description: violation.recommendation,
      })
    }
  }

  return recommendations
}

async function main() {
  console.log(chalk.bold("\n📋 Documentation 360° Audit\n"))

  console.log(chalk.cyan("Scanning documentation files..."))
  const metadata = await scanDocumentation()

  console.log(chalk.cyan("Detecting duplicates..."))
  const duplicates = detectDuplicates(metadata)

  console.log(chalk.cyan("Detecting DRY violations..."))
  const violations = detectDRYViolations(metadata)

  console.log(chalk.cyan("Generating recommendations..."))
  const recommendations = generateRecommendations(duplicates, violations)

  // Generate report
  const result: AuditResult = {
    total: metadata.length,
    byCategory: {},
    duplicates,
    dryViolations: violations,
    missingCrossReferences: [],
    recommendations,
  }

  // Count by category
  for (const doc of metadata) {
    result.byCategory[doc.category] = (result.byCategory[doc.category] || 0) + 1
  }

  // Print summary
  console.log(chalk.bold("\n📊 Audit Summary\n"))
  console.log(`Total Documents: ${result.total}`)
  console.log(`Categories: ${Object.keys(result.byCategory).length}`)
  console.log(`Duplicate Clusters: ${chalk.yellow(result.duplicates.length)}`)
  console.log(`DRY Violations: ${chalk.yellow(result.violations.length)}`)
  console.log(`Recommendations: ${chalk.green(result.recommendations.length)}`)

  // Print duplicates
  if (result.duplicates.length > 0) {
    console.log(chalk.bold("\n⚠️  Duplicate Clusters\n"))
    for (const cluster of result.duplicates) {
      console.log(chalk.yellow(`Topic: ${cluster.topic}`))
      console.log(`  Files: ${cluster.files.length}`)
      console.log(`  Similarity: ${cluster.similarity}`)
      console.log(`  Recommendation: ${cluster.recommendation}`)
      cluster.files.forEach((f) => console.log(`    - ${f}`))
      console.log()
    }
  }

  // Print DRY violations
  if (result.violations.length > 0) {
    console.log(chalk.bold("\n⚠️  DRY Violations\n"))
    for (const violation of result.violations) {
      console.log(chalk.red(`Content: ${violation.content}`))
      console.log(`  Severity: ${violation.severity}`)
      console.log(`  Locations: ${violation.locations.length}`)
      console.log(`  Recommendation: ${violation.recommendation}`)
      violation.locations.forEach((l) => console.log(`    - ${l}`))
      console.log()
    }
  }

  // Print recommendations
  if (result.recommendations.length > 0) {
    console.log(chalk.bold("\n💡 Recommendations\n"))
    const byPriority = {
      high: result.recommendations.filter((r) => r.priority === "high"),
      medium: result.recommendations.filter((r) => r.priority === "medium"),
      low: result.recommendations.filter((r) => r.priority === "low"),
    }

    if (byPriority.high.length > 0) {
      console.log(chalk.red.bold("HIGH PRIORITY\n"))
      byPriority.high.forEach((r) => {
        console.log(chalk.red(`  ${r.type.toUpperCase()}: ${r.description}`))
        r.files.forEach((f) => console.log(`    - ${f}`))
      })
      console.log()
    }

    if (byPriority.medium.length > 0) {
      console.log(chalk.yellow.bold("MEDIUM PRIORITY\n"))
      byPriority.medium.forEach((r) => {
        console.log(chalk.yellow(`  ${r.type.toUpperCase()}: ${r.description}`))
        r.files.forEach((f) => console.log(`    - ${f}`))
      })
      console.log()
    }
  }

  // Save report
  const reportPath = "docs/_system/AUDIT_REPORT.json"
  writeFileSync(reportPath, JSON.stringify(result, null, 2))
  console.log(chalk.green(`\n✅ Audit report saved to ${reportPath}\n`))

  // Exit with error if violations found
  if (result.duplicates.length > 0 || result.violations.length > 0) {
    console.log(chalk.yellow("⚠️  Issues detected. Review recommendations above.\n"))
    process.exit(1)
  }

  console.log(chalk.green("✅ No issues detected. Documentation is DRY-compliant.\n"))
  process.exit(0)
}

main().catch((error) => {
  console.error(chalk.red("\n❌ Audit failed:"), error)
  process.exit(1)
})
