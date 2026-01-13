#!/usr/bin/env tsx
/**
 * Document Organization Script
 *
 * Automatically categorizes and organizes markdown files in the repository.
 * Moves files from root directory to appropriate subdirectories based on patterns.
 *
 * Usage:
 *   pnpm organize-docs              # Execute organization
 *   pnpm organize-docs --dry-run   # Preview changes without applying
 */

import { existsSync } from "node:fs"
import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import { basename, dirname, join } from "node:path"
import chalk from "chalk"
import { glob } from "glob"

interface FileMove {
  from: string
  to: string
  category: string
  reason: string
}

interface OrganizationStats {
  total: number
  moved: number
  skipped: number
  errors: number
}

// Files to keep in root
const ROOT_KEEP_FILES = ["README.md"]

// Categorization rules: pattern → { category, destination }
const CATEGORIZATION_RULES: Array<{
  pattern: RegExp
  category: string
  destination: string
  reason: string
}> = [
  // Nextra 4 migrations
  {
    pattern: /^NEXTRA_4_/i,
    category: "migration",
    destination: "docs/migrations/nextra-4",
    reason: "Nextra 4 migration documentation",
  },
  {
    pattern: /^NEXTRA_(?!4_)/i,
    category: "migration",
    destination: "docs/migrations/nextra",
    reason: "Nextra migration documentation",
  },
  // Zod migrations
  {
    pattern: /^ZOD_/i,
    category: "migration",
    destination: "docs/migrations/zod-v4",
    reason: "Zod v4 migration documentation",
  },
  // Validation migrations
  {
    pattern: /^VALIDATION_/i,
    category: "migration",
    destination: "docs/migrations/validation",
    reason: "Validation migration documentation",
  },
  // Implementation summaries
  {
    pattern: /_SUMMARY\.md$/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Implementation summary",
  },
  {
    pattern: /_COMPLETE\.md$/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Completion summary",
  },
  // Guides
  {
    pattern: /_GUIDE\.md$/i,
    category: "guide",
    destination: "docs/guides",
    reason: "How-to guide",
  },
  {
    pattern: /^POST_CLONE_SETUP\.md$/i,
    category: "guide",
    destination: "docs/guides",
    reason: "Setup guide",
  },
  // API documentation
  {
    pattern: /^API_/i,
    category: "api",
    destination: "docs/api",
    reason: "API documentation",
  },
  // Reference documentation
  {
    pattern: /_REFERENCE\.md$/i,
    category: "reference",
    destination: "docs/reference",
    reason: "Reference documentation",
  },
  {
    pattern: /^KPI_REFERENCE\.md$/i,
    category: "reference",
    destination: "docs/reference",
    reason: "KPI reference",
  },
  // Architecture
  {
    pattern: /^CONSISTENCY_/i,
    category: "architecture",
    destination: "docs/architecture",
    reason: "Architecture documentation",
  },
  {
    pattern: /^GOVERNANCE_/i,
    category: "architecture",
    destination: "docs/architecture",
    reason: "Governance documentation",
  },
  // Turbopack/Turborepo
  {
    pattern: /^TURBOPACK_/i,
    category: "reference",
    destination: "docs/reference",
    reason: "Turbopack reference",
  },
  {
    pattern: /^TURBOREPO_/i,
    category: "reference",
    destination: "docs/reference",
    reason: "Turborepo reference",
  },
  // Node version management
  {
    pattern: /^NODE_VERSION_/i,
    category: "reference",
    destination: "docs/reference",
    reason: "Node version reference",
  },
  // VS Code integration
  {
    pattern: /^VSCODE_/i,
    category: "reference",
    destination: "docs/reference",
    reason: "VS Code integration reference",
  },
  // Feature checklists
  {
    pattern: /^FEATURES_/i,
    category: "reference",
    destination: "docs/reference",
    reason: "Features checklist",
  },
  // Best practices reports
  {
    pattern: /_BEST_PRACTICES.*\.md$/i,
    category: "reference",
    destination: "docs/reference",
    reason: "Best practices documentation",
  },
  // Implementation reports
  {
    pattern: /^IMPLEMENTATION_/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Implementation report",
  },
  {
    pattern: /^CUSTOMIZATION_/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Customization report",
  },
  {
    pattern: /^AUTO_DETECTION_/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Auto-detection report",
  },
  {
    pattern: /^DOCUMENT_EVALUATION\.md$/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Document evaluation",
  },
  {
    pattern: /^WORKSPACE_OPTIMIZATION_/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Workspace optimization",
  },
  {
    pattern: /^EXTERNAL_DEPS?_.*\.md$/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Dependency solution",
  },
  {
    pattern: /^DEPENDENCY_FIX\.md$/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Dependency fix",
  },
  {
    pattern: /^REACT_VERSION_/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "React version compatibility",
  },
  {
    pattern: /^PAGE_FILE_CONVENTION_/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Page file convention review",
  },
  {
    pattern: /^OPTIMIZATION_/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Optimization summary",
  },
  {
    pattern: /^V3_ENHANCEMENTS_/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "V3 enhancements",
  },
  {
    pattern: /^PAGEFIND_SETUP_/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Pagefind setup",
  },
  {
    pattern: /^THEME_FEATURES_/i,
    category: "changelog",
    destination: "docs/changelog/2025-01",
    reason: "Theme features summary",
  },
]

async function findMarkdownFiles(rootDir: string): Promise<string[]> {
  // Use glob to find markdown files in root directory only (not subdirectories)
  // VS Code glob patterns use '/' to separate paths (even on Windows)
  // Pattern '*.md' matches files in root only (no '**' prefix means current directory)
  // According to VS Code glob patterns: patterns are evaluated relative to workspace folder
  // glob v11 returns Promise<string[]>
  const fileArray = await glob("*.md", {
    cwd: rootDir,
    absolute: true, // Return absolute paths directly
    ignore: [
      "node_modules/**",
      ".git/**",
      ".next/**",
      "**/node_modules/**",
      ".cursor/**", // Exclude .cursor directory
    ],
  })

  // Filter to ensure files are in root directory only
  // Normalize paths using '/' separator (VS Code glob pattern requirement)
  const normalizedRootDir = rootDir.replace(/\\/g, "/").toLowerCase()

  return fileArray.filter((file) => {
    // Normalize file path to use '/' separator (VS Code requirement)
    const normalizedFile = file.replace(/\\/g, "/")
    const fileDir = dirname(normalizedFile).toLowerCase()

    // Only include files directly in root (not in subdirectories)
    if (fileDir !== normalizedRootDir) {
      return false
    }

    // Exclude files that should stay in root
    const filename = basename(file)
    return !ROOT_KEEP_FILES.includes(filename)
  })
}

function categorizeFile(filename: string): {
  category: string
  destination: string
  reason: string
} | null {
  for (const rule of CATEGORIZATION_RULES) {
    if (rule.pattern.test(filename)) {
      return {
        category: rule.category,
        destination: rule.destination,
        reason: rule.reason,
      }
    }
  }
  return null
}

async function createDirectoryIfNeeded(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true })
    console.log(chalk.gray(`Created directory: ${dirPath}`))
  }
}

// Reserved for future link updating functionality
// @ts-expect-error - Reserved for future use
async function _updateInternalLinks(
  filePath: string,
  oldPath: string,
  newPath: string
): Promise<void> {
  try {
    const content = await readFile(filePath, "utf-8")
    const relativeOldPath = oldPath.replace(process.cwd(), "").replace(/\\/g, "/")
    const relativeNewPath = newPath.replace(process.cwd(), "").replace(/\\/g, "/")

    // Update markdown links
    const updatedContent = content
      .replace(
        new RegExp(
          `\\[([^\\]]+)\\]\\(${relativeOldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)`,
          "g"
        ),
        `[$1](${relativeNewPath})`
      )
      .replace(
        new RegExp(`\\[([^\\]]+)\\]\\(\./${basename(oldPath)}\\)`, "g"),
        `[$1](${relativeNewPath})`
      )

    if (updatedContent !== content) {
      await writeFile(filePath, updatedContent, "utf-8")
      console.log(chalk.gray(`  Updated links in: ${filePath}`))
    }
  } catch (error) {
    console.error(chalk.red(`  Error updating links in ${filePath}:`, error))
  }
}

async function organizeDocuments(dryRun = false): Promise<void> {
  console.log(chalk.blue.bold("\n📚 Document Organization Script\n"))
  console.log(
    chalk.gray(
      `Mode: ${dryRun ? "DRY RUN (no changes will be made)" : "LIVE (changes will be applied)"}\n`
    )
  )

  const rootDir = process.cwd()
  const filesToMove: FileMove[] = []
  const stats: OrganizationStats = {
    total: 0,
    moved: 0,
    skipped: 0,
    errors: 0,
  }

  // Find all markdown files in root
  const markdownFiles = await findMarkdownFiles(rootDir)
  stats.total = markdownFiles.length

  console.log(chalk.yellow(`Found ${stats.total} markdown files in root directory\n`))

  // Categorize files
  for (const file of markdownFiles) {
    const filename = basename(file)
    const category = categorizeFile(filename)

    if (category) {
      const destination = join(rootDir, category.destination, filename)
      filesToMove.push({
        from: file,
        to: destination,
        category: category.category,
        reason: category.reason,
      })
    } else {
      console.log(chalk.yellow(`⚠️  No category found for: ${filename}`))
      stats.skipped++
    }
  }

  // Group by category
  const byCategory = new Map<string, FileMove[]>()
  for (const move of filesToMove) {
    if (!byCategory.has(move.category)) {
      byCategory.set(move.category, [])
    }
    byCategory.get(move.category)?.push(move)
  }

  // Display plan
  console.log(chalk.blue.bold("\n📋 Organization Plan:\n"))
  for (const [category, moves] of byCategory.entries()) {
    console.log(chalk.cyan.bold(`\n${category.toUpperCase()} (${moves.length} files):`))
    for (const move of moves) {
      const relativeFrom = move.from.replace(rootDir, ".").replace(/\\/g, "/")
      const relativeTo = move.to.replace(rootDir, ".").replace(/\\/g, "/")
      console.log(`  ${chalk.gray(relativeFrom)}`)
      console.log(`    → ${chalk.green(relativeTo)}`)
      console.log(`    ${chalk.dim(move.reason)}`)
    }
  }

  if (dryRun) {
    console.log(chalk.yellow.bold("\n\n🔍 DRY RUN - No changes made\n"))
    console.log(`Would move: ${filesToMove.length} files`)
    console.log(`Would skip: ${stats.skipped} files`)
    return
  }

  // Execute moves
  console.log(chalk.blue.bold("\n\n🚀 Executing moves...\n"))

  for (const move of filesToMove) {
    try {
      // Create destination directory
      await createDirectoryIfNeeded(dirname(move.to))

      // Move file
      await rename(move.from, move.to)
      console.log(chalk.green(`✓ Moved: ${basename(move.from)}`))

      stats.moved++

      // Note: Link updating would require full markdown parsing
      // For now, manual link updates may be needed
    } catch (error) {
      console.error(chalk.red(`✗ Error moving ${basename(move.from)}:`, error))
      stats.errors++
    }
  }

  // Summary
  console.log(chalk.blue.bold("\n\n📊 Summary:\n"))
  console.log(`Total files:     ${chalk.cyan(stats.total)}`)
  console.log(`Moved:          ${chalk.green(stats.moved)}`)
  console.log(`Skipped:        ${chalk.yellow(stats.skipped)}`)
  console.log(`Errors:         ${chalk.red(stats.errors)}`)

  if (stats.moved > 0) {
    console.log(chalk.green.bold("\n✅ Organization complete!\n"))
    console.log(chalk.yellow("Next steps:"))
    console.log("  1. Review moved files")
    console.log("  2. Update any remaining internal links")
    console.log("  3. Run: pnpm validate-docs")
    console.log("  4. Run: pnpm generate-docs-index")
  }
}

// Main execution
const dryRun: boolean = process.argv.includes("--dry-run") || process.argv.includes("-d")

organizeDocuments(dryRun).catch((error) => {
  console.error(chalk.red.bold("\n❌ Fatal error:"), error)
  process.exit(1)
})
