/**
 * Content Loader
 *
 * Type-safe content loading functions
 * Validates frontmatter against Drizzle Zod schemas
 */

import { existsSync, readFileSync } from 'fs'
import type { FrontmatterSelect } from '@/lib/content/schemas' // Type-only import
import { frontmatterSelectSchema } from '@/lib/content/schemas' // Barrel export import

export interface ContentFile {
  frontmatter: FrontmatterSelect
  content: string
  path: string
}

/**
 * Extract frontmatter from MDX content
 */
function extractFrontmatter(source: string): {
  frontmatter: string
  content: string
} {
  const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---/)
  if (frontmatterMatch && frontmatterMatch[1]) {
    return {
      frontmatter: frontmatterMatch[1],
      content: source.slice(frontmatterMatch[0].length).trim(),
    }
  }
  return { frontmatter: '', content: source }
}

/**
 * Parse frontmatter YAML to object
 */
function parseFrontmatter(frontmatter: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const lines = frontmatter.split('\n')

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
        result[key] = true
      } else if (value === 'false') {
        result[key] = false
      } else {
        result[key] = value
      }
    }
  }

  return result
}

/**
 * Validate frontmatter using .safeParse() (REQUIRED for external data)
 *
 * Exception Rules Check:
 * - ❌ NOT Bootstrap/Startup: Frontmatter validation is runtime, not startup
 * - ❌ NOT Test Files: This is production code
 * - ❌ NOT Internal Invariant: Frontmatter comes from MDX files (external data)
 * - ✅ REQUIRED: User input & external data → Must use .safeParse()
 */
export function validateFrontmatter(
  data: unknown
):
  | { success: true; data: FrontmatterSelect }
  | { success: false; error: ReturnType<typeof frontmatterSelectSchema.safeParse>['error'] } {
  // ✅ REQUIRED: Use .safeParse() for MDX frontmatter (external data)
  const result = frontmatterSelectSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    }
  }

  return {
    success: true,
    data: result.data,
  }
}

/**
 * Load and validate content file
 */
export function loadContentFile(filePath: string): ContentFile {
  if (!existsSync(filePath)) {
    throw new Error(`Content file not found: ${filePath}`)
  }

  const source = readFileSync(filePath, 'utf-8')
  const { frontmatter: frontmatterText, content } = extractFrontmatter(source)
  const frontmatterObj = parseFrontmatter(frontmatterText)

  // ✅ REQUIRED: Use .safeParse() for frontmatter validation (external data)
  const validation = validateFrontmatter(frontmatterObj)

  if (!validation.success) {
    throw new Error(`Invalid frontmatter in ${filePath}: ${validation.error.format()}`)
  }

  return {
    frontmatter: validation.data,
    content,
    path: filePath,
  }
}

/**
 * Load multiple content files
 */
export function loadContentFiles(filePaths: string[]): ContentFile[] {
  return filePaths.map((path) => loadContentFile(path))
}
