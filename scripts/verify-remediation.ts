#!/usr/bin/env tsx
/**
 * Verification Script for Documentation Remediation
 *
 * Quick verification that all remediation tasks completed successfully
 */

import { readFileSync, existsSync } from "node:fs"
import { glob } from "glob"

interface VerificationResult {
  file: string
  hasFrontmatter: boolean
  correctNaming: boolean
  issues: string[]
}

const FILES_TO_VERIFY = [
  "docs/architecture/DOC-0114_rfl-doctrine-v1.0.md",
  "docs/architecture/DOC-0118_consistency-sustainability-audit.md",
  "docs/api/DOC-0115_api-autogeneration-strategy.md",
  "docs/api/DOC-0116_api-autogeneration-implementation.md",
  "docs/api/DOC-0117_api-autogeneration-quick-reference.md",
  "docs/reference/DOC-0119_turbopack-quick-reference.md",
  "docs/reference/DOC-0120_turbopack-support.md",
  "docs/reference/DOC-0121_turborepo-quick-start.md",
]

function parseFrontmatter(content: string): { hasFrontmatter: boolean; data: Record<string, any> } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { hasFrontmatter: false, data: {} }
  }

  const yamlContent = match[1]
  const data: Record<string, any> = {}

  yamlContent.split("\n").forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) return

    const colonIndex = trimmed.indexOf(":")
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim()
      let value = trimmed.substring(colonIndex + 1).trim()

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      if (value === "true") value = true
      if (value === "false") value = false

      data[key] = value
    }
  })

  return { hasFrontmatter: true, data }
}

function verifyFile(file: string): VerificationResult {
  const result: VerificationResult = {
    file,
    hasFrontmatter: false,
    correctNaming: false,
    issues: [],
  }

  if (!existsSync(file)) {
    result.issues.push("File does not exist")
    return result
  }

  const content = readFileSync(file, "utf-8")
  const { hasFrontmatter, data } = parseFrontmatter(content)

  result.hasFrontmatter = hasFrontmatter

  // Check naming convention
  const filename = file.split("/").pop() || ""
  const docPattern = /^DOC-\d{4}_[a-z0-9-]+\.mdx?$/
  result.correctNaming = docPattern.test(filename)

  if (!hasFrontmatter) {
    result.issues.push("Missing frontmatter")
  } else {
    // Check required fields
    const required = [
      "doc_type",
      "status",
      "owner",
      "source_of_truth",
      "created",
      "modified",
      "tags",
    ]
    for (const field of required) {
      if (!(field in data)) {
        result.issues.push(`Missing required field: ${field}`)
      }
    }
  }

  if (!result.correctNaming) {
    result.issues.push(`Invalid naming: ${filename} (should be DOC-XXXX_name.md)`)
  }

  return result
}

async function main() {
  console.log("\n📋 Documentation Remediation Verification\n")
  console.log("Verifying remediation implementation...\n")

  const results: VerificationResult[] = []

  for (const file of FILES_TO_VERIFY) {
    const result = verifyFile(file)
    results.push(result)

    if (result.issues.length === 0) {
      console.log(`✅ ${file}`)
    } else {
      console.log(`❌ ${file}`)
      result.issues.forEach((issue) => {
        console.log(`   - ${issue}`)
      })
    }
  }

  console.log("\n")

  // Summary
  const total = results.length
  const passed = results.filter((r) => r.issues.length === 0).length
  const failed = total - passed

  console.log("Summary:")
  console.log(`  Total files: ${total}`)
  console.log(`  ✅ Passed: ${passed}`)
  console.log(`  ❌ Failed: ${failed}`)

  // Detailed breakdown
  const withFrontmatter = results.filter((r) => r.hasFrontmatter).length
  const withCorrectNaming = results.filter((r) => r.correctNaming).length

  console.log("\nCompliance:")
  console.log(
    `  Frontmatter: ${withFrontmatter}/${total} (${Math.round((withFrontmatter / total) * 100)}%)`
  )
  console.log(
    `  Naming: ${withCorrectNaming}/${total} (${Math.round((withCorrectNaming / total) * 100)}%)`
  )

  if (failed === 0) {
    console.log("\n✅ All files verified successfully!")
    process.exit(0)
  } else {
    console.log("\n⚠️  Some files need attention")
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("\n❌ Verification failed:", error)
  process.exit(1)
})
