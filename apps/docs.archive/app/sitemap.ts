/**
 * Sitemap Generator (App Router)
 *
 * Dynamically generates sitemap from content files
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from 'next'
import { readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'

interface SitemapEntry {
  url: string
  lastModified: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

/**
 * Recursively scan content directory for MDX files
 */
function scanContentDirectory(dir: string, basePath: string = ''): SitemapEntry[] {
  const entries: SitemapEntry[] = []
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexuscanon.dev'

  try {
    const items = readdirSync(dir)

    for (const item of items) {
      // Skip hidden files and directories
      if (item.startsWith('.')) continue

      const fullPath = join(dir, item)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        const subPath = basePath ? `${basePath}/${item}` : item
        entries.push(...scanContentDirectory(fullPath, subPath))
      } else if (item.endsWith('.mdx')) {
        // Generate URL from file path
        const route = basePath ? `/${basePath}/${item.replace(/\.mdx$/, '')}` : `/${item.replace(/\.mdx$/, '')}`
        const url = `${baseUrl}${route === '/index' ? '' : route}`

        // Get file modification time
        const lastModified = stat.mtime.toISOString()

        // Determine priority based on path
        let priority = 0.7
        let changeFrequency: SitemapEntry['changeFrequency'] = 'weekly'

        if (basePath.includes('governance')) {
          priority = 0.9
          changeFrequency = 'weekly'
        } else if (basePath.includes('guides') || basePath.includes('tutorials')) {
          priority = 0.8
          changeFrequency = 'monthly'
        } else if (basePath.includes('reference')) {
          priority = 0.7
          changeFrequency = 'monthly'
        } else if (!basePath || basePath === '') {
          priority = 1.0
          changeFrequency = 'daily'
        }

        entries.push({
          url,
          lastModified,
          changeFrequency,
          priority,
        })
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return entries
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexuscanon.dev'
  const contentDir = join(process.cwd(), 'apps/docs/content')
  const currentDate = new Date().toISOString()

  // Start with homepage
  const entries: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  // Scan content directory
  try {
    const contentEntries = scanContentDirectory(contentDir)
    entries.push(...contentEntries)
  } catch (error) {
    // If content directory scan fails, return just homepage
    console.warn('Failed to scan content directory for sitemap:', error)
  }

  return entries
}
