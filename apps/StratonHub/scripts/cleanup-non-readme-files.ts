/**
 * Cleanup Non-README Files Script
 *
 * Identifies and reports non-README .md files
 * Does NOT delete files automatically - requires manual review
 */

import { readdirSync, statSync } from "fs"
import { join } from "path"

/**
 * Excluded directories
 */
const EXCLUDED_DIRS = [
  ".cursor",
  ".vscode",
  ".github",
  ".temp-docs",
  ".husky",
  "node_modules",
  ".next",
  ".git",
]

/**
 * Check if directory should be excluded
 */
function isExcluded(dir: string): boolean {
  return EXCLUDED_DIRS.includes(dir) || dir.startsWith(".")
}

/**
 * Recursively find non-README .md files
 */
function findNonReadmeFiles(dir: string, basePath: string = ""): string[] {
  const files: string[] = []

  try {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      if (isExcluded(entry)) {
        continue
      }

      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        const subPath = basePath ? `${basePath}/${entry}` : entry
        files.push(...findNonReadmeFiles(fullPath, subPath))
      } else if (entry.endsWith(".md") && entry !== "README.md") {
        const relativePath = basePath ? `${basePath}/${entry}` : entry
        files.push(relativePath)
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return files
}

/**
 * Find all non-README .md files
 */
function findNonReadmeFilesInWorkspace(): string[] {
  const appsDir = join(process.cwd(), "apps")
  const packagesDir = join(process.cwd(), "packages")

  const appsFiles = findNonReadmeFiles(appsDir, "apps")
  const packagesFiles = findNonReadmeFiles(packagesDir, "packages")

  return [...appsFiles, ...packagesFiles]
}

// Run cleanup check
const files = findNonReadmeFilesInWorkspace()

if (files.length > 0) {
  console.log("⚠️ Found non-README .md files:")
  files.forEach((file) => console.log(`  - ${file}`))
  console.log("")
  console.log("Action required:")
  console.log("1. Review each file")
  console.log("2. Move relevant content to README.md")
  console.log("3. Delete the file")
  console.log("")
  console.log("This script does NOT delete files automatically.")
  process.exit(1)
}

console.log("✅ No non-README .md files found")
process.exit(0)
