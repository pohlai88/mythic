/**
 * Pollution Check Script
 *
 * Checks for any references to apps/docs.archive in the codebase
 * Ensures zero pollution from archived content
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

/**
 * Recursively find all TypeScript/JavaScript files
 */
function findCodeFiles(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx', '.mjs']): string[] {
  const files: string[] = []

  try {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      // Skip hidden files and directories
      if (entry.startsWith('.')) continue
      if (entry === 'node_modules') continue
      if (entry === '.next') continue

      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...findCodeFiles(fullPath, extensions))
      } else if (extensions.some((ext) => entry.endsWith(ext))) {
        files.push(fullPath)
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return files
}

/**
 * Check for archive references
 */
function checkPollution(): { success: boolean; violations: string[] } {
  const violations: string[] = []
  const appDir = join(process.cwd(), 'apps/docs')
  const codeFiles = findCodeFiles(appDir)

  const archivePatterns = [
    /apps\/docs\.archive/,
    /docs\.archive/,
    /docs\.archive/,
    /from.*docs\.archive/,
    /import.*docs\.archive/,
    /require.*docs\.archive/,
  ]

  for (const filePath of codeFiles) {
    try {
      const content = readFileSync(filePath, 'utf-8')

      for (const pattern of archivePatterns) {
        if (pattern.test(content)) {
          const relativePath = filePath.replace(process.cwd(), '')
          violations.push(`${relativePath}: Contains reference to archived content`)
          break // Only report once per file
        }
      }
    } catch {
      // Skip files that can't be read
    }
  }

  return {
    success: violations.length === 0,
    violations,
  }
}

// Run check
const result = checkPollution()

if (!result.success) {
  console.error('❌ Pollution check failed - Archive references found:')
  result.violations.forEach((violation) => console.error(`  - ${violation}`))
  process.exit(1)
}

console.log('✅ No archive references found - Zero pollution compliance')
process.exit(0)
