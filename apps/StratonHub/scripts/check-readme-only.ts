/**
 * README-Only Policy Check Script
 *
 * Ensures README-only policy compliance
 * Checks for non-README .md files in apps/ and packages/
 */

import { readdirSync, statSync } from 'fs'
import { join } from 'path'

/**
 * Excluded directories (dot-directories)
 */
const EXCLUDED_DIRS = [
  '.cursor',
  '.vscode',
  '.github',
  '.temp-docs',
  '.husky',
  'node_modules',
  '.next',
  '.git',
]

/**
 * Check if directory should be excluded
 */
function isExcluded(dir: string): boolean {
  return EXCLUDED_DIRS.includes(dir) || dir.startsWith('.')
}

/**
 * Recursively check for non-README .md files
 */
function checkDirectory(dir: string, basePath: string = ''): string[] {
  const violations: string[] = []

  try {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      // Skip excluded directories
      if (isExcluded(entry)) {
        continue
      }

      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        // Recursively check subdirectories
        const subPath = basePath ? `${basePath}/${entry}` : entry
        violations.push(...checkDirectory(fullPath, subPath))
      } else if (entry.endsWith('.md') && entry !== 'README.md') {
        // Found non-README .md file
        const relativePath = basePath ? `${basePath}/${entry}` : entry
        violations.push(relativePath)
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return violations
}

/**
 * Check README-only policy
 */
function checkReadmeOnly(): { success: boolean; violations: string[] } {
  const appsDir = join(process.cwd(), 'apps')
  const packagesDir = join(process.cwd(), 'packages')

  const appsViolations = checkDirectory(appsDir, 'apps')
  const packagesViolations = checkDirectory(packagesDir, 'packages')

  const allViolations = [...appsViolations, ...packagesViolations]

  return {
    success: allViolations.length === 0,
    violations: allViolations,
  }
}

// Run check
const result = checkReadmeOnly()

if (!result.success) {
  console.error('❌ README-only policy violations:')
  result.violations.forEach((violation) => {
    console.error(`  - ${violation}`)
  })
  console.error('\nAction: Move content to README.md, then delete file')
  process.exit(1)
}

console.log('✅ README-only policy: Compliant')
process.exit(0)
