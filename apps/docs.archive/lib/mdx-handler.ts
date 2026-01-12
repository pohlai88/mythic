/**
 * Custom MDX Handler
 *
 * Replaces Nextra's importPage with custom MDX processing
 * Uses next-mdx-remote for MDX compilation
 */

import { serialize } from 'next-mdx-remote/serialize'
import { readFileSync } from 'fs'
import { join } from 'path'
import { glob } from 'glob'

interface PageMetadata {
  title?: string
  description?: string
  keywords?: string[]
  [key: string]: unknown
}

interface PageResult {
  default: React.ComponentType
  metadata?: PageMetadata
  toc?: Array<{ id: string; text: string; level: number }>
}

/**
 * Get all MDX files from content directory
 */
export function getMdxFiles(): string[] {
  const contentDir = join(process.cwd(), 'apps/docs/content')
  return glob.sync('**/*.mdx', { cwd: contentDir })
}

/**
 * Convert file path to route
 */
export function pathToRoute(filePath: string): string {
  return filePath
    .replace(/^content\//, '')
    .replace(/\.mdx$/, '')
    .replace(/\/index$/, '')
}

/**
 * Load and process MDX file
 */
export async function loadMdxPage(
  route: string
): Promise<PageResult | null> {
  const contentDir = join(process.cwd(), 'apps/docs/content')
  const filePath = join(contentDir, `${route}.mdx`)

  try {
    const source = readFileSync(filePath, 'utf-8')
    const mdxSource = await serialize(source, {
      parseFrontmatter: true,
    })

    // Extract metadata from frontmatter
    const metadata = mdxSource.frontmatter as PageMetadata

    return {
      default: () => null, // Will be handled by MDXRemote component
      metadata,
    }
  } catch (error) {
    console.error(`Error loading MDX page ${route}:`, error)
    return null
  }
}

/**
 * Generate page map for navigation
 */
export function generatePageMap(): Array<{
  name: string
  route: string
  children?: Array<unknown>
}> {
  const files = getMdxFiles()
  const routes = files.map(pathToRoute)

  // Simple flat structure - can be enhanced with nested structure
  return routes.map((route) => ({
    name: route.split('/').pop() || 'index',
    route: `/${route}`,
  }))
}
