/**
 * Build-Time Search Indexing
 *
 * Indexes all MDX content files at build time
 * Extracts frontmatter and content for search
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import type { SearchIndex } from '@/lib/search/types'  // Type-only import

/**
 * Get content directory path
 */
function getContentDir(): string {
  const cwd = process.cwd()

  // Check if we're running from monorepo root
  const monorepoPath = join(cwd, 'apps/docs/app')
  try {
    if (statSync(monorepoPath).isDirectory()) {
      return monorepoPath
    }
  } catch {
    // Not in monorepo root
  }

  // Check if we're running from apps/docs directory
  const appPath = join(cwd, 'app')
  try {
    if (statSync(appPath).isDirectory()) {
      return appPath
    }
  } catch {
    // Not in app directory
  }

  // Fallback to monorepo path
  return monorepoPath
}

/**
 * Recursively find all MDX files
 */
function findMdxFiles(dir: string, basePath = ''): string[] {
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
        // Recursively search subdirectories
        const subPath = basePath ? `${basePath}/${entry}` : entry
        files.push(...findMdxFiles(fullPath, subPath))
      } else if (entry.endsWith('.mdx')) {
        // Include all MDX files
        files.push(join(dir, entry))
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return files
}

/**
 * Extract content text from MDX (remove frontmatter and code blocks)
 */
function extractContentText(source: string): string {
  // Remove frontmatter
  let content = source.replace(/^---\n[\s\S]*?\n---/, '')

  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, '')

  // Remove inline code
  content = content.replace(/`[^`]+`/g, '')

  // Remove markdown links but keep text
  content = content.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')

  // Remove markdown headers
  content = content.replace(/^#+\s+/gm, '')

  // Remove markdown formatting
  content = content.replace(/\*\*([^\*]+)\*\*/g, '$1')
  content = content.replace(/\*([^\*]+)\*/g, '$1')

  return content.trim()
}

/**
 * Generate route from file path
 */
function generateRoute(filePath: string, contentDir: string): string {
  const relativePath = filePath.replace(contentDir, '').replace(/\\/g, '/')
  const route = relativePath
    .replace(/^\/app\//, '/')
    .replace(/\.mdx$/, '')
    .replace(/\/page$/, '')
    .replace(/\/index$/, '')

  return route || '/'
}

/**
 * Build search index from all MDX files
 */
export function buildSearchIndex(): SearchIndex[] {
  const contentDir = getContentDir()
  const mdxFiles = findMdxFiles(contentDir)
  const index: SearchIndex[] = []

  for (const filePath of mdxFiles) {
    try {
      // Read file and extract frontmatter manually (simpler approach)
      const source = readFileSync(filePath, 'utf-8')
      const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---/)

      if (!frontmatterMatch) continue

      const frontmatterText = frontmatterMatch[1]
      const contentText = extractContentText(source)
      const route = generateRoute(filePath, contentDir)

      // Parse frontmatter
      const frontmatter: Record<string, unknown> = {}
      const lines = frontmatterText.split('\n')

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

      // Generate unique ID from route
      const id = route.replace(/\//g, '-').replace(/^-/, '') || 'home'

      index.push({
        id,
        title: (frontmatter.title as string) || 'Untitled',
        description: (frontmatter.description as string) || undefined,
        content: contentText,
        route,
        audience: (frontmatter.audience as 'developers' | 'users' | 'business') || 'users',
        module: (frontmatter.module as string) || undefined,
        type:
          (frontmatter.type as 'tutorial' | 'how-to' | 'reference' | 'explanation') || undefined,
      })
    } catch (error) {
      // Skip files that can't be loaded
      console.warn(`Skipping file ${filePath}:`, error)
    }
  }

  return index
}

/**
 * Save search index to JSON file (for build-time generation)
 */
export async function saveSearchIndex(index: SearchIndex[]): Promise<void> {
  const fs = await import('fs/promises')
  const path = await import('path')

  const cwd = process.cwd()

  // Determine correct path based on where script is run from
  let indexPath: string
  if (cwd.endsWith('apps/docs')) {
    // Running from apps/docs directory
    indexPath = path.join(cwd, 'public/search-index.json')
  } else {
    // Running from monorepo root
    indexPath = path.join(cwd, 'apps/docs/public/search-index.json')
  }

  // Ensure directory exists
  const dir = path.dirname(indexPath)
  await fs.mkdir(dir, { recursive: true })

  await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf-8')
}
