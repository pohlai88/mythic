/**
 * Page Map Utilities
 *
 * Custom page map generation replacing Nextra's content automation
 * - Replaces Nextra's getPageMap (content discovery)
 * - Replaces Nextra's createIndexPage (index generation)
 *
 * UI: 100% Tailwind CSS (handled by Cards component)
 * Automation: Custom file system scanning (replaces Nextra)
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

export interface PageMapItem {
  name: string
  route: string
  title?: string
  description?: string
  children?: PageMapItem[]
}

/**
 * Get page map for a specific route
 */
export async function getPageMap(basePath: string): Promise<PageMapItem[]> {
  const contentDir = join(process.cwd(), 'apps/docs/content')
  const routePath = basePath.replace(/^\//, '').replace(/\/$/, '')
  const targetDir = join(contentDir, routePath)

  try {
    const items = readDirectory(targetDir, contentDir, routePath)
    return items
  } catch {
    return []
  }
}

/**
 * Read directory and generate page map
 */
function readDirectory(
  dirPath: string,
  contentDir: string,
  routePrefix: string
): PageMapItem[] {
  const items: PageMapItem[] = []

  try {
    const entries = readdirSync(dirPath)

    for (const entry of entries) {
      const fullPath = join(dirPath, entry)
      const stat = statSync(fullPath)

      // Skip hidden files and directories
      if (entry.startsWith('.')) {
        continue
      }

      if (stat.isDirectory()) {
        const childRoute = join(routePrefix, entry).replace(/\\/g, '/')
        const children = readDirectory(fullPath, contentDir, childRoute)
        const indexPath = join(fullPath, 'index.mdx')

        // Try to get metadata from index.mdx
        let title = entry
        let description: string | undefined

        try {
          const indexContent = readFileSync(indexPath, 'utf-8')
          const frontmatter = extractFrontmatter(indexContent)
          title = frontmatter.title || entry
          description = frontmatter.description
        } catch {
          // No index.mdx, use directory name
        }

        items.push({
          name: entry,
          route: childRoute,
          title,
          description,
          children: children.length > 0 ? children : undefined,
        })
      } else if (entry.endsWith('.mdx') && entry !== 'index.mdx') {
        const route = join(routePrefix, entry.replace(/\.mdx$/, '')).replace(/\\/g, '/')
        const content = readFileSync(fullPath, 'utf-8')
        const frontmatter = extractFrontmatter(content)

        items.push({
          name: entry.replace(/\.mdx$/, ''),
          route,
          title: frontmatter.title || entry.replace(/\.mdx$/, ''),
          description: frontmatter.description,
        })
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return items.sort((a, b) => {
    // Sort directories first, then files
    if (a.children && !b.children) return -1
    if (!a.children && b.children) return 1
    return a.name.localeCompare(b.name)
  })
}

/**
 * Extract frontmatter from MDX content
 */
function extractFrontmatter(content: string): {
  title?: string
  description?: string
  [key: string]: unknown
} {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)

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
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      frontmatter[key] = value
    }
  }

  return frontmatter
}

/**
 * Create index page data from page map
 * Returns card items for the Cards component
 */
export function createIndexPage(pageMap: PageMapItem[]): Array<{
  title: string
  description?: string
  href: string
}> {
  const items: Array<{ title: string; description?: string; href: string }> = []

  function processItems(mapItems: PageMapItem[]) {
    for (const item of mapItems) {
      // Only include items with routes (skip parent directories without content)
      if (item.route) {
        items.push({
          title: item.title || item.name,
          description: item.description,
          href: `/${item.route}`,
        })
      }

      // Process children recursively
      if (item.children) {
        processItems(item.children)
      }
    }
  }

  processItems(pageMap)
  return items
}
