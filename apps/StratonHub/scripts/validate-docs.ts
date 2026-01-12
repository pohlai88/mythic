/**
 * Documentation Validation Script
 *
 * Validates all MDX files against Drizzle Zod schemas
 * Build-time validation for content compliance
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { validateFrontmatter } from '@/lib/content' // Barrel export import

/**
 * Recursively find all MDX files
 */
function findMdxFiles(dir: string): string[] {
  const files: string[] = []

  try {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      // Skip hidden files and directories
      if (entry.startsWith('.')) continue
      if (entry === 'node_modules') continue

      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...findMdxFiles(fullPath))
      } else if (entry.endsWith('.mdx')) {
        files.push(fullPath)
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return files
}

/**
 * Extract and parse frontmatter
 */
function parseFrontmatter(source: string): Record<string, unknown> {
  const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch || !frontmatterMatch[1]) {
    return {}
  }

  const frontmatter: Record<string, unknown> = {}
  const lines = frontmatterMatch[1].split('\n')

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/)
    if (match && match[1] && match[2]) {
      const key = match[1]
      let value = match[2].trim()

      // Remove quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      // Parse boolean
      if (value === 'true') {
        frontmatter[key] = true
      } else if (value === 'false') {
        frontmatter[key] = false
      } else {
        frontmatter[key] = value
      }
    }
  }

  return frontmatter
}

/**
 * Validate all MDX files
 */
function validateDocs(): { success: boolean; errors: string[] } {
  const errors: string[] = []
  const appDir = join(process.cwd(), 'apps/docs/app')
  const mdxFiles = findMdxFiles(appDir)

  for (const filePath of mdxFiles) {
    try {
      const source = readFileSync(filePath, 'utf-8')
      const frontmatter = parseFrontmatter(source)

      // ✅ REQUIRED: Use .safeParse() for MDX frontmatter (external data)
      const result = validateFrontmatter(frontmatter)

      if (!result.success) {
        const relativePath = filePath.replace(process.cwd(), '')
        errors.push(`${relativePath}: ${result.error.format()}`)
      }
    } catch (error) {
      const relativePath = filePath.replace(process.cwd(), '')
      errors.push(
        `${relativePath}: Failed to read file - ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  return {
    success: errors.length === 0,
    errors,
  }
}

// Run validation
const result = validateDocs()

if (!result.success) {
  console.error('❌ Documentation validation failed:')
  result.errors.forEach((error) => console.error(`  - ${error}`))
  process.exit(1)
}

console.log('✅ All documentation files validate against schema')
process.exit(0)
