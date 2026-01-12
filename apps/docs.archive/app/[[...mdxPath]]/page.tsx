/**
 * Catch-All MDX Page Route
 *
 * Custom MDX handler replacing Nextra's importPage
 * Uses next-mdx-remote for MDX processing
 */

import { MDXRemote } from 'next-mdx-remote/rsc'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { useMDXComponents } from '@/mdx-components'

// Get MDX components (useMDXComponents is a regular function, not a hook)
const mdxComponents = useMDXComponents()

// Robust content directory resolution for monorepo
function getContentDir(): string {
  const cwd = process.cwd()
  // Try monorepo root path first (when running from root)
  const monorepoPath = join(cwd, 'apps/docs/content')
  if (existsSync(monorepoPath)) {
    return monorepoPath
  }
  // Try app directory path (when running from apps/docs)
  const appPath = join(cwd, 'content')
  if (existsSync(appPath)) {
    return appPath
  }
  // Fallback to monorepo path (most common case)
  return monorepoPath
}

// Generate static params for all MDX pages
export async function generateStaticParams() {
  const { glob } = await import('glob')
  const contentDir = getContentDir()
  const files = glob.sync('**/*.mdx', { cwd: contentDir })
  const params: Array<{ mdxPath?: string[] }> = []

  // Add root route for home.mdx
  params.push({ mdxPath: [] })

  // Add all other routes
  files.forEach((file) => {
    const route = file
      .replace(/\.mdx$/, '')
      .replace(/\/index$/, '')
      .split('/')
      .filter(Boolean)

    // Skip 'home.mdx' as we already added root route
    if (route.length === 1 && route[0] === 'home') {
      return
    }

    if (route.length > 0) {
      params.push({ mdxPath: route })
    }
  })

  return params
}

// Generate metadata for each page
export async function generateMetadata(props: {
  params: Promise<{ mdxPath?: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  // Use 'home' for root path (empty array), otherwise use the route
  const route = (params.mdxPath && params.mdxPath.length > 0)
    ? params.mdxPath.join('/')
    : 'home'
  const contentDir = getContentDir()
  const filePath = join(contentDir, `${route}.mdx`)

  try {
    const source = readFileSync(filePath, 'utf-8')
    const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---/)

    if (frontmatterMatch && frontmatterMatch[1]) {
      const frontmatter = frontmatterMatch[1]
      const titleMatch = frontmatter.match(/title:\s*(.+)/)
      const descMatch = frontmatter.match(/description:\s*(.+)/)

      return {
        title: titleMatch?.[1]?.replace(/['"]/g, '') || 'NexusCanon Documentation',
        description:
          descMatch?.[1]?.replace(/['"]/g, '') ||
          'Comprehensive governance and documentation',
      }
    }
  } catch {
    // File doesn't exist or can't be read
  }

  return {
    title: 'NexusCanon Documentation',
    description: 'Comprehensive governance and documentation',
  }
}

// Page component
export default async function Page(props: { params: Promise<{ mdxPath?: string[] }> }) {
  const params = await props.params
  // Use 'home' for root path (empty array), otherwise use the route
  const route = (params.mdxPath && params.mdxPath.length > 0)
    ? params.mdxPath.join('/')
    : 'home'
  const contentDir = getContentDir()
  const filePath = join(contentDir, `${route}.mdx`)

  let source: string
  try {
    source = readFileSync(filePath, 'utf-8')
  } catch {
    notFound()
  }

  // Extract frontmatter (MDXRemote RSC handles this automatically)
  const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---/)
  const mdxContent = frontmatterMatch ? source.slice(frontmatterMatch[0].length) : source

  try {
    return (
      <article className="prose prose-invert max-w-none">
        <MDXRemote source={mdxContent} components={mdxComponents} />
      </article>
    )
  } catch (error) {
    throw error
  }
}
