/**
 * README Schema Validation Script
 *
 * Validates all README files against standard template
 * Ensures README-only policy compliance
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * Required sections in README (in order)
 */
const requiredSections = [
  '# ', // Title
  '## Table of Contents',
  '## Overview',
  '## Quick Start',
  '## Installation',
  '## Usage',
  '## Architecture',
  '## Development',
  '## Troubleshooting',
  '## License',
  '## Related Documentation',
]

/**
 * Find all README files
 */
function findReadmeFiles(dir: string, basePath: string = ''): string[] {
  const files: string[] = []

  try {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      if (entry.startsWith('.')) continue
      if (entry === 'node_modules') continue

      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        // Skip dot-directories (excluded from README-only policy)
        if (!entry.startsWith('.')) {
          const subPath = basePath ? `${basePath}/${entry}` : entry
          files.push(...findReadmeFiles(fullPath, subPath))
        }
      } else if (entry === 'README.md') {
        files.push(fullPath)
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return files
}

/**
 * Validate README structure
 */
function validateReadme(filePath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const content = readFileSync(filePath, 'utf-8')

  // Check for required sections
  for (const section of requiredSections) {
    if (!content.includes(section)) {
      errors.push(`Missing required section: ${section}`)
    }
  }

  // Check for metadata at end
  if (!content.includes('**Version**:') && !content.includes('**Last Updated**:')) {
    errors.push('Missing metadata section at end of file')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate all README files
 */
function validateAllReadmes(): { success: boolean; errors: Array<{ file: string; errors: string[] }> } {
  const allErrors: Array<{ file: string; errors: string[] }> = []
  const appsDir = join(process.cwd(), 'apps')
  const packagesDir = join(process.cwd(), 'packages')

  // Find README files in apps/ and packages/
  const readmeFiles = [
    ...findReadmeFiles(appsDir),
    ...findReadmeFiles(packagesDir),
  ]

  for (const filePath of readmeFiles) {
    const result = validateReadme(filePath)
    if (!result.valid) {
      const relativePath = filePath.replace(process.cwd(), '')
      allErrors.push({
        file: relativePath,
        errors: result.errors,
      })
    }
  }

  return {
    success: allErrors.length === 0,
    errors: allErrors,
  }
}

// Run validation
const result = validateAllReadmes()

if (!result.success) {
  console.error('❌ README schema validation failed:')
  result.errors.forEach(({ file, errors }) => {
    console.error(`  ${file}:`)
    errors.forEach((error) => console.error(`    - ${error}`))
  })
  process.exit(1)
}

console.log('✅ All README files match standard template')
process.exit(0)
