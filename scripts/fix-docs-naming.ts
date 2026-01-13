#!/usr/bin/env tsx
/**
 * Documentation Naming Auto-Fix Script
 *
 * Automatically fixes documentation naming violations:
 * - Renames files to DOC-XXXX format
 * - Finds next available DOC number
 * - Updates internal references
 * - Preserves git history with git mv
 */

import { existsSync, readFileSync, writeFileSync, renameSync } from "node:fs"
import { join, dirname, basename, extname } from "node:path"
import { glob } from "glob"
import chalk from "chalk"
import { execSync } from "node:child_process"

interface FixResult {
  file: string
  oldName: string
  newName: string
  docId: string
  fixed: boolean
  error?: string
}

// Naming patterns
const PATTERNS = {
  doc: /^DOC-(\d{4})_[a-z0-9-]+\.mdx?$/,
  hash: /^[a-f0-9]{8}_[a-z0-9-]+\.mdx?$/,
  version: /^v\d+\.\d+\.\d+_[a-z0-9-]+\.mdx?$/,
  temp: /^TEMP-\d{8}-\d{4}_[a-z0-9-]+\.mdx?$/,
}

// Root exceptions (don't fix)
const ROOT_EXCEPTIONS = ["README.md"]

// Exclude patterns
const EXCLUDE = [
  "node_modules/**",
  ".next/**",
  "dist/**",
  "build/**",
  "docs/migrations/**",
  "docs/changelog/**",
  "content/**", // Nextra routing files
]

function findHighestDocNumber(files: string[]): number {
  let highest = 0

  for (const file of files) {
    const filename = basename(file)
    const match = filename.match(PATTERNS.doc)
    if (match) {
      const num = parseInt(match[1], 10)
      if (num > highest) {
        highest = num
      }
    }
  }

  return highest
}

function generateDocId(currentHighest: number): string {
  const next = currentHighest + 1
  return `DOC-${next.toString().padStart(4, "0")}`
}

function sanitizeFilename(name: string): string {
  // Remove extension
  const withoutExt = name.replace(/\.(md|mdx)$/, "")

  // Convert to lowercase
  let sanitized = withoutExt.toLowerCase()

  // Replace spaces and underscores with hyphens
  sanitized = sanitized.replace(/[\s_]+/g, "-")

  // Remove special characters (keep only alphanumeric and hyphens)
  sanitized = sanitized.replace(/[^a-z0-9-]/g, "")

  // Remove multiple consecutive hyphens
  sanitized = sanitized.replace(/-+/g, "-")

  // Remove leading/trailing hyphens
  sanitized = sanitized.replace(/^-+|-+$/g, "")

  // Limit length
  if (sanitized.length > 50) {
    sanitized = sanitized.substring(0, 50)
  }

  return sanitized
}

function generateNewName(file: string, docId: string): string {
  const dir = dirname(file)
  const oldName = basename(file)
  const ext = extname(oldName)

  // Get descriptive name from old filename
  const descriptiveName = sanitizeFilename(oldName)

  const newName = `${docId}_${descriptiveName}${ext}`
  return join(dir, newName)
}

async function updateReferences(file: string, oldName: string, newName: string): Promise<void> {
  const oldBasename = basename(oldName)
  const newBasename = basename(newName)

  // Find all markdown files that might reference this file
  const files = await glob("**/*.{md,mdx}", {
    ignore: ["node_modules/**", ".next/**", "dist/**", "build/**"],
  })

  for (const refFile of files) {
    if (refFile === file || refFile === newName) continue

    try {
      let content = readFileSync(refFile, "utf-8")
      let updated = false

      // Update various link patterns
      const patterns = [
        // Markdown links: [text](./old-name.md)
        new RegExp(
          `(\\([^)]*[/\\\\])${oldBasename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\))`,
          "g"
        ),
        // Markdown links: [text](old-name.md)
        new RegExp(
          `(\\([^)]*[/\\\\])${oldBasename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\))`,
          "g"
        ),
        // Direct references: old-name.md
        new RegExp(`\\b${oldBasename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g"),
      ]

      for (const pattern of patterns) {
        if (pattern.test(content)) {
          content = content.replace(pattern, (match) => {
            return match.replace(oldBasename, newBasename)
          })
          updated = true
        }
      }

      if (updated) {
        writeFileSync(refFile, content, "utf-8")
        console.log(chalk.gray(`  ↳ Updated references in ${refFile}`))
      }
    } catch (error) {
      // Skip files that can't be read
    }
  }
}

async function fixNaming(autoFix: boolean = false): Promise<FixResult[]> {
  const results: FixResult[] = []

  // Find all markdown files
  const allFiles = await glob("**/*.{md,mdx}", {
    ignore: EXCLUDE,
  })

  // Find files with invalid naming
  const invalidFiles: string[] = []

  for (const file of allFiles) {
    const filename = basename(file)
    const location = dirname(file)

    // Skip root exceptions
    if (!location && ROOT_EXCEPTIONS.includes(filename)) {
      continue
    }

    // Skip content/ directory (Nextra routing)
    if (file.startsWith("content/") || file.includes("_meta")) {
      continue
    }

    // Check if has valid pattern
    const hasValidPattern =
      PATTERNS.doc.test(filename) ||
      PATTERNS.hash.test(filename) ||
      PATTERNS.version.test(filename) ||
      PATTERNS.temp.test(filename)

    if (!hasValidPattern) {
      invalidFiles.push(file)
    }
  }

  if (invalidFiles.length === 0) {
    console.log(chalk.green("✅ All files have valid naming"))
    return results
  }

  // Find highest DOC number
  const highestDoc = findHighestDocNumber(allFiles)

  console.log(chalk.bold(`\n📋 Found ${invalidFiles.length} files with invalid naming\n`))

  if (!autoFix) {
    console.log(chalk.yellow("Run with --fix to automatically rename files\n"))
    for (const file of invalidFiles) {
      console.log(chalk.yellow(`  ✗ ${file}`))
    }
    return results
  }

  // Auto-fix each file
  for (const file of invalidFiles) {
    try {
      const currentHighest = findHighestDocNumber(allFiles)
      const docId = generateDocId(currentHighest)
      const newPath = generateNewName(file, docId)

      // Check if new path already exists
      if (existsSync(newPath)) {
        results.push({
          file,
          oldName: basename(file),
          newName: basename(newPath),
          docId,
          fixed: false,
          error: "Target file already exists",
        })
        continue
      }

      // Use git mv if in git repo, otherwise regular rename
      try {
        execSync(`git mv "${file}" "${newPath}"`, { stdio: "ignore" })
      } catch {
        // Not in git or git mv failed, use regular rename
        renameSync(file, newPath)
      }

      // Update references
      await updateReferences(newPath, file, newPath)

      results.push({
        file: newPath,
        oldName: basename(file),
        newName: basename(newPath),
        docId,
        fixed: true,
      })

      console.log(chalk.green(`  ✅ ${basename(file)} → ${basename(newPath)}`))

      // Update allFiles list for next iteration
      allFiles.push(newPath)
      const index = allFiles.indexOf(file)
      if (index > -1) {
        allFiles.splice(index, 1)
      }
    } catch (error) {
      results.push({
        file,
        oldName: basename(file),
        newName: "",
        docId: "",
        fixed: false,
        error: error instanceof Error ? error.message : String(error),
      })
      console.log(chalk.red(`  ❌ ${file}: ${error}`))
    }
  }

  return results
}

async function main() {
  const args = process.argv.slice(2)
  const autoFix = args.includes("--fix") || args.includes("--auto-fix")

  console.log(chalk.bold("\n🔧 Documentation Naming Auto-Fix\n"))

  if (autoFix) {
    console.log(chalk.yellow("⚠️  AUTO-FIX MODE: Files will be renamed automatically\n"))
  }

  const results = await fixNaming(autoFix)

  if (results.length === 0 && !autoFix) {
    return
  }

  if (autoFix) {
    const fixed = results.filter((r) => r.fixed).length
    const failed = results.filter((r) => !r.fixed).length

    console.log(chalk.bold("\n📊 Summary:\n"))
    console.log(`  ✅ Fixed: ${fixed}`)
    if (failed > 0) {
      console.log(`  ❌ Failed: ${failed}`)
    }

    if (fixed > 0) {
      console.log(chalk.green("\n✅ Naming fixes complete!\n"))
      console.log(chalk.yellow("Next steps:"))
      console.log(chalk.cyan("  1. Review the changes"))
      console.log(chalk.cyan("  2. Verify references were updated"))
      console.log(chalk.cyan("  3. Commit the changes\n"))
    }
  }
}

main().catch((error) => {
  console.error(chalk.red("\n❌ Auto-fix failed:"), error)
  process.exit(1)
})
