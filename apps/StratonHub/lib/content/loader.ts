/**
 * Content Loader — StratonHub
 *
 * Type-safe content loading functions for MDX files.
 * Validates frontmatter against Zod schemas.
 *
 * Performance Optimizations:
 * - Pre-compiled regex patterns (single compilation)
 * - File existence checks before reading (faster than readFileSync on non-existent files)
 * - Graceful error handling in batch operations
 * - Efficient string operations (slice vs replace)
 * - Clear, actionable error messages
 * - Type-safe validation with Zod
 *
 * Next.js Best Practices:
 * - Server Component compatible (no client-side code)
 * - Build-time validation (catches errors early)
 * - Type-safe frontmatter validation
 *
 * Reference:
 * - @lib/content/schemas.ts - Frontmatter schema definitions
 */

import { existsSync, readFileSync } from "fs"
import YAML from "yaml"
import type { FrontmatterSelect } from "@/lib/content/schemas"
import { frontmatterSelectSchema } from "@/lib/content/schemas"

export interface ContentFile {
  frontmatter: FrontmatterSelect
  content: string
  path: string
}

// Pre-compiled regex for frontmatter extraction (performance optimization)
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---/

/**
 * Extract frontmatter from MDX content
 *
 * @param source - Raw MDX file content
 * @returns Object with frontmatter string and content string
 */
function extractFrontmatter(source: string): {
  frontmatter: string
  content: string
} {
  const match = source.match(FRONTMATTER_REGEX)
  if (match && match[1]) {
    return {
      frontmatter: match[1],
      content: source.slice(match[0].length).trim(),
    }
  }
  return { frontmatter: "", content: source }
}

/**
 * Parse YAML frontmatter to object
 *
 * @param frontmatter - YAML frontmatter string
 * @returns Parsed object or empty object if invalid
 * @throws Error if YAML is malformed
 */
function parseFrontmatter(frontmatter: string): unknown {
  const trimmed = frontmatter.trim()
  if (!trimmed) return {}

  try {
    const parsed = YAML.parse(trimmed)
    // Ensure object-like output (not null, not array, etc.)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed
    }
    return {}
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    throw new Error(`Invalid YAML frontmatter: ${message}`)
  }
}

/**
 * Validate frontmatter using .safeParse() (REQUIRED for external data)
 *
 * Exception Rules Check:
 * - ❌ NOT Bootstrap/Startup: Frontmatter validation is runtime, not startup
 * - ❌ NOT Test Files: This is production code
 * - ❌ NOT Internal Invariant: Frontmatter comes from MDX files (external data)
 * - ✅ REQUIRED: User input & external data → Must use .safeParse()
 *
 * @param data - Parsed frontmatter object to validate
 * @returns Validation result with success flag and data or error
 */
export function validateFrontmatter(data: unknown):
  | { success: true; data: FrontmatterSelect }
  | {
      success: false
      error: NonNullable<ReturnType<typeof frontmatterSelectSchema.safeParse>["error"]>
    } {
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
 * Load and validate a single content file
 *
 * @param filePath - Path to the MDX file
 * @returns ContentFile with validated frontmatter and content
 * @throws Error if file doesn't exist or frontmatter is invalid
 *
 * @example
 * ```ts
 * const file = loadContentFile('./content/page.mdx')
 * console.log(file.frontmatter.title)
 * ```
 */
export function loadContentFile(filePath: string): ContentFile {
  // Check file existence first (faster than readFileSync on non-existent files)
  if (!existsSync(filePath)) {
    throw new Error(`Content file not found: ${filePath}`)
  }

  let source: string
  try {
    source = readFileSync(filePath, "utf-8")
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    throw new Error(`Failed to read file ${filePath}: ${message}`)
  }

  const { frontmatter: frontmatterText, content } = extractFrontmatter(source)

  let frontmatterObj: unknown
  try {
    frontmatterObj = parseFrontmatter(frontmatterText)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    throw new Error(`Failed to parse frontmatter in ${filePath}: ${message}`)
  }

  // ✅ REQUIRED: Use .safeParse() for frontmatter validation (external data)
  const validation = validateFrontmatter(frontmatterObj)

  if (!validation.success) {
    // format() returns structured object; stringify to avoid "[object Object]"
    // TypeScript knows error exists when success is false due to discriminated union
    const errorDetails = JSON.stringify(validation.error.format(), null, 2)
    throw new Error(`Invalid frontmatter in ${filePath}:\n${errorDetails}`)
  }

  return {
    frontmatter: validation.data,
    content,
    path: filePath,
  }
}

/**
 * Result of loading multiple content files (with error tracking)
 */
export interface LoadContentFilesResult {
  files: ContentFile[]
  errors: Array<{ path: string; error: string }>
}

/**
 * Load multiple content files with graceful error handling
 *
 * If a file fails to load, it's recorded in the errors array
 * but doesn't stop the loading of other files.
 *
 * @param filePaths - Array of file paths to load
 * @returns Object with successfully loaded files and any errors
 *
 * @example
 * ```ts
 * const { files, errors } = loadContentFiles(['file1.mdx', 'file2.mdx'])
 * if (errors.length > 0) {
 *   console.warn('Some files failed to load:', errors)
 * }
 * ```
 */
export function loadContentFiles(filePaths: string[]): LoadContentFilesResult {
  const files: ContentFile[] = []
  const errors: Array<{ path: string; error: string }> = []

  for (const path of filePaths) {
    try {
      const file = loadContentFile(path)
      files.push(file)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      errors.push({ path, error: errorMessage })
    }
  }

  return { files, errors }
}
