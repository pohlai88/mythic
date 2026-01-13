/**
 * Build-Time Search Indexing — StratonHub
 *
 * Indexes all MDX content files at build time.
 * Extracts YAML frontmatter + content for search.
 *
 * Performance Optimizations:
 * - Pre-compiled regex patterns (single compilation, reused)
 * - Set-based directory exclusion (O(1) lookup)
 * - Efficient file system operations (existsSync checks)
 * - Optimized content text extraction (single-pass where possible)
 * - Graceful error handling (continues on individual file errors)
 * - Path normalization optimization
 *
 * Next.js Best Practices:
 * - Build-time execution (no runtime overhead)
 * - Server Component compatible
 * - Follows Next.js App Router conventions
 *
 * Reference:
 * - @lib/search/types.ts - SearchIndex type definitions
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs"
import { join, dirname, relative } from "path"
import YAML from "yaml"
import type { SearchIndex, Audience, DiataxisType } from "@/lib/search/types"

// ============================================================================
// Constants
// ============================================================================

/**
 * Pre-compiled regex patterns for content extraction
 */
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---/
const FRONTMATTER_REPLACE_REGEX = /^---\n[\s\S]*?\n---/
const CODE_BLOCK_REGEX = /```[\s\S]*?```/g
const INLINE_CODE_REGEX = /`[^`]+`/g
const LINK_REGEX = /\[([^\]]+)\]\([^\)]+\)/g
const HEADING_REGEX = /^#+\s+/gm
const BOLD_REGEX = /\*\*([^\*]+)\*\*/g
const ITALIC_REGEX = /\*([^\*]+)\*/g
const ROUTE_SLASH_REGEX = /\//g
const ROUTE_LEADING_DASH_REGEX = /^-/

/**
 * Directory names to skip when searching for MDX files
 * Using Set for O(1) lookup performance
 */
const SKIP_DIRECTORIES = new Set([".", "node_modules", ".next", ".git", "dist", "build", ".turbo"])

/**
 * File extensions to process
 */
const MDX_EXTENSION = ".mdx"

/**
 * Default route ID for home page
 */
const HOME_ROUTE_ID = "home"

/**
 * Path segments to remove from routes (Next.js conventions)
 */
const ROUTE_REMOVALS = ["/page", "/index"] as const

// ============================================================================
// Path Resolution
// ============================================================================

/**
 * Get StratonHub app directory
 *
 * Handles both monorepo and standalone execution contexts.
 *
 * @returns Path to the app directory containing MDX files
 */
/**
 * Get StratonHub app directory
 *
 * Handles both monorepo and standalone execution contexts.
 * Uses existsSync for faster checks before statSync.
 *
 * @returns Path to the app directory containing MDX files
 */
function getContentDir(): string {
  const cwd = process.cwd()

  // Monorepo root → apps/StratonHub/app
  const monorepoPath = join(cwd, "apps/StratonHub/app")
  if (existsSync(monorepoPath)) {
    try {
      if (statSync(monorepoPath).isDirectory()) {
        return monorepoPath
      }
    } catch {
      // Directory exists but can't be accessed
    }
  }

  // Running from apps/StratonHub → app
  const appPath = join(cwd, "app")
  if (existsSync(appPath)) {
    try {
      if (statSync(appPath).isDirectory()) {
        return appPath
      }
    } catch {
      // Directory exists but can't be accessed
    }
  }

  // Fallback to monorepo path
  return monorepoPath
}

// ============================================================================
// File Discovery
// ============================================================================

/**
 * Recursively find all MDX files in a directory
 *
 * Skips hidden directories and node_modules.
 *
 * @param dir - Directory to search
 * @returns Array of absolute paths to MDX files
 */
/**
 * Recursively find all MDX files in a directory
 *
 * Skips hidden directories and excluded directories.
 * Uses existsSync for faster checks before statSync.
 *
 * @param dir - Directory to search
 * @returns Array of absolute paths to MDX files
 */
function findMdxFiles(dir: string): string[] {
  const files: string[] = []

  // Validate directory exists before processing
  if (!existsSync(dir)) {
    return files
  }

  try {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      // Skip hidden files/directories and excluded directories
      if (entry.startsWith(".") || SKIP_DIRECTORIES.has(entry)) {
        continue
      }

      const fullPath = join(dir, entry)

      try {
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
          // Recursively search subdirectories
          files.push(...findMdxFiles(fullPath))
        } else if (entry.endsWith(MDX_EXTENSION)) {
          files.push(fullPath)
        }
      } catch (error) {
        // File/directory can't be accessed, skip
        if (
          error instanceof Error &&
          "code" in error &&
          (error as NodeJS.ErrnoException).code !== "ENOENT"
        ) {
          console.warn(`⚠️  Warning: Could not stat ${fullPath}: ${error.message}`)
        }
        continue
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code !== "ENOENT"
    ) {
      console.warn(`⚠️  Warning: Could not read directory ${dir}: ${error.message}`)
    }
  }

  return files
}

// ============================================================================
// Content Extraction
// ============================================================================

/**
 * Extract YAML frontmatter block from MDX source
 *
 * @param source - Raw MDX file content
 * @returns Frontmatter YAML string or null if not found
 */
function extractFrontmatterBlock(source: string): string | null {
  const match = source.match(FRONTMATTER_REGEX)
  if (!match || !match[1]) {
    return null
  }
  return match[1]
}

/**
 * Parse YAML frontmatter to object
 *
 * @param yamlText - YAML frontmatter string
 * @returns Parsed object or empty object if invalid
 */
function parseFrontmatterYaml(yamlText: string | null): Record<string, unknown> {
  if (!yamlText?.trim()) {
    return {}
  }

  try {
    const parsed = YAML.parse(yamlText)
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {}
  } catch {
    // Invalid YAML, return empty object
    return {}
  }
}

/**
 * Extract searchable content text from MDX
 *
 * Removes:
 * - YAML frontmatter
 * - Code blocks (```...```)
 * - Inline code (`...`)
 * - Markdown links (keeps text only)
 * - Markdown headings (removes # symbols)
 * - Bold/italic formatting (keeps text only)
 *
 * Performance: Uses pre-compiled regex patterns for efficient processing.
 *
 * @param source - Raw MDX file content
 * @returns Cleaned, searchable text content
 */
function extractContentText(source: string): string {
  // Remove frontmatter (most common, do first)
  let content = source.replace(FRONTMATTER_REPLACE_REGEX, "")

  // Remove code blocks (large blocks, do early)
  content = content.replace(CODE_BLOCK_REGEX, "")

  // Remove inline code
  content = content.replace(INLINE_CODE_REGEX, "")

  // Extract link text (remove markdown link syntax, keep text)
  content = content.replace(LINK_REGEX, "$1")

  // Remove heading markers
  content = content.replace(HEADING_REGEX, "")

  // Remove bold formatting (keep text)
  content = content.replace(BOLD_REGEX, "$1")

  // Remove italic formatting (keep text)
  content = content.replace(ITALIC_REGEX, "$1")

  // Trim and normalize whitespace
  return content.trim().replace(/\s+/g, " ")
}

// ============================================================================
// Route Generation
// ============================================================================

/**
 * Generate route from file path
 *
 * StratonHub MDX lives under app/** and uses Next.js conventions:
 * - /page.mdx → route folder
 * - /index.mdx → route folder
 *
 * @param filePath - Absolute path to MDX file
 * @param contentDir - Base content directory path
 * @returns Route path (e.g., "/users/boardroom" or "/" for home)
 */
/**
 * Generate route from file path
 *
 * StratonHub MDX lives under app/** and uses Next.js conventions:
 * - /page.mdx → route folder
 * - /index.mdx → route folder
 *
 * Uses path.relative for better cross-platform support.
 *
 * @param filePath - Absolute path to MDX file
 * @param contentDir - Base content directory path
 * @returns Route path (e.g., "/users/boardroom" or "/" for home)
 */
function generateRoute(filePath: string, contentDir: string): string {
  // Get relative path using path.relative (better than string replace)
  let route = relative(contentDir, filePath).replace(/\\/g, "/")

  // Remove .mdx extension
  route = route.replace(/\.mdx$/, "")

  // Remove Next.js route conventions
  for (const removal of ROUTE_REMOVALS) {
    route = route.replace(removal, "")
  }

  // Return "/" for home, otherwise the route
  return route === "" ? "/" : route
}

/**
 * Generate search index ID from route
 *
 * @param route - Route path (e.g., "/users/boardroom")
 * @returns Search index ID (e.g., "users-boardroom" or "home")
 */
function generateId(route: string): string {
  if (route === "/") {
    return HOME_ROUTE_ID
  }

  // Replace slashes with dashes and remove leading dash
  return route.replace(ROUTE_SLASH_REGEX, "-").replace(ROUTE_LEADING_DASH_REGEX, "")
}

// ============================================================================
// Index Building
// ============================================================================

/**
 * Build search index from all MDX files
 *
 * Processes all MDX files in the content directory, extracts frontmatter
 * and content, and builds a searchable index.
 *
 * @returns Array of search index entries
 *
 * @example
 * ```ts
 * const index = buildSearchIndex()
 * console.log(`Indexed ${index.length} documents`)
 * ```
 */
export function buildSearchIndex(): SearchIndex[] {
  const contentDir = getContentDir()
  const mdxFiles = findMdxFiles(contentDir)
  const index: SearchIndex[] = []

  for (const filePath of mdxFiles) {
    try {
      // Read file content
      const source = readFileSync(filePath, "utf-8")

      // Extract frontmatter
      const yamlBlock = extractFrontmatterBlock(source)
      if (!yamlBlock) {
        // Skip files without frontmatter
        continue
      }

      // Parse frontmatter
      const frontmatter = parseFrontmatterYaml(yamlBlock)

      // Extract searchable content
      const contentText = extractContentText(source)

      // Generate route and ID
      const route = generateRoute(filePath, contentDir)
      const id = generateId(route)

      // Validate required frontmatter fields
      const title = (frontmatter.title as string) || ""
      const audience = frontmatter.audience as Audience | undefined
      const type = frontmatter.type as DiataxisType | undefined

      if (!title || !audience || !type) {
        // Build missing fields list for warning
        const missingFields = [
          !title ? "title" : null,
          !audience ? "audience" : null,
          !type ? "type" : null,
        ]
          .filter((field): field is string => field !== null)
          .join(", ")

        console.warn(`Skipping (non-canonical frontmatter) ${filePath}: missing ${missingFields}`)
        continue
      }

      // TypeScript: type is guaranteed to be non-undefined after the check above
      index.push({
        id,
        title,
        description: (frontmatter.description as string) || undefined,
        content: contentText,
        route,
        audience: audience as Audience,
        surface: (frontmatter.surface as string) || undefined,
        type: type as DiataxisType,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.warn(`Skipping file ${filePath}: ${errorMessage}`)
    }
  }

  return index
}

// ============================================================================
// Index Persistence
// ============================================================================

/**
 * Save search index to JSON file (build-time generation)
 *
 * Output is always StratonHub:
 * - monorepo root → apps/StratonHub/public/search-index.json
 * - apps/StratonHub → public/search-index.json
 *
 * @param index - Search index array to save
 * @returns Promise that resolves when index is saved
 *
 * @example
 * ```ts
 * const index = buildSearchIndex()
 * await saveSearchIndex(index)
 * ```
 */
export async function saveSearchIndex(index: SearchIndex[]): Promise<void> {
  // Dynamic imports for Node.js ESM compatibility
  const fs = await import("fs/promises")
  const path = await import("path")

  const cwd = process.cwd()

  // Determine output path based on execution context
  const indexPath = cwd.endsWith("apps/StratonHub")
    ? path.join(cwd, "public/search-index.json")
    : path.join(cwd, "apps/StratonHub/public/search-index.json")

  // Ensure directory exists
  await fs.mkdir(dirname(indexPath), { recursive: true })

  // Write index as formatted JSON
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2), "utf-8")
}
