#!/usr/bin/env tsx
/**
 * Nextra Navigation Auto-Generator
 *
 * Uses external dependencies for robust file watching and navigation generation:
 * - chokidar: Cross-platform file watching
 * - fast-glob: Fast file pattern matching
 * - gray-matter: Frontmatter parsing
 *
 * Usage:
 *   pnpm generate:meta
 *   pnpm generate:meta:watch
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative } from 'node:path'
import chokidar from 'chokidar'
import fg from 'fast-glob'
import matter from 'gray-matter'
import { createScriptLogger } from '../src/lib/logger'

const log = createScriptLogger('generate-meta-with-deps')

interface MetaEntry {
  title?: string
  type?: 'page' | 'menu'
  href?: string
  // ✅ newWindow removed in Nextra 4 - external links automatically open in new tab with rel="noreferrer"
  items?: Record<string, string | MetaEntry> // Required for folder items in _meta.global
}

type MetaConfig = Record<string, string | MetaEntry>

interface PageInfo {
  path: string
  name: string
  title: string
  frontmatter?: Record<string, unknown>
}

/**
 * Get frontmatter title from file if available
 */
async function getPageInfo(filePath: string): Promise<PageInfo> {
  const name = basename(filePath, extname(filePath))
  let title = name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Try to read frontmatter
  try {
    const content = readFileSync(filePath, 'utf-8')
    const parsed = matter(content)

    if (parsed.data.title) {
      title = String(parsed.data.title)
    } else if (parsed.data.name) {
      title = String(parsed.data.name)
    }
  } catch {
    // If file can't be read or has no frontmatter, use filename
  }

  return {
    path: filePath,
    name,
    title,
  }
}

/**
 * Find all page files in directory
 */
async function findPages(dir: string): Promise<PageInfo[]> {
  const patterns = [
    join(dir, '**/*.mdx'),
    join(dir, '**/*.md'),
    join(dir, '**/*.tsx'),
    join(dir, '**/*.ts'),
    join(dir, '**/*.jsx'),
    join(dir, '**/*.js'),
  ]

  const files = await fg(patterns, {
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/_meta.json',
      '**/_meta.js',
      '**/404.*',
      '**/sitemap.xml.*',
      '**/_app.*',
      '**/_document.*',
    ],
    onlyFiles: true,
    absolute: true,
  })

  // Filter out files starting with underscore (except index)
  const filteredFiles = files.filter((file) => {
    const fileName = basename(file, extname(file))
    // Skip _app, _document, _meta files, but keep index files
    if (fileName.startsWith('_') && fileName !== 'index') {
      return false
    }
    return true
  })

  const pages = await Promise.all(filteredFiles.map(getPageInfo))
  return pages.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Generate meta configuration for a directory
 */
async function generateMetaForDirectory(
  dirPath: string,
  rootPath: string,
  allPages: PageInfo[],
  isRoot = false
): Promise<MetaConfig> {
  const meta: MetaConfig = {}

  // Normalize paths for comparison
  const normalizedDirPath = dirPath.replace(/\\/g, '/')

  // Get pages in this directory (exact match)
  const currentDirPages = allPages.filter((page) => {
    const pageDir = dirname(page.path).replace(/\\/g, '/')
    return pageDir === normalizedDirPath
  })

  // Process files in current directory
  for (const page of currentDirPages) {
    const name = page.name

    // Skip index files (handled separately)
    if (name === 'index') {
      if (isRoot) {
        meta.index = 'Introduction'
      }
      continue
    }

    meta[name] = page.title
  }

  // Get subdirectories by finding unique parent directories
  const subdirs = new Set<string>()
  for (const page of allPages) {
    const pageDir = dirname(page.path).replace(/\\/g, '/')
    if (pageDir.startsWith(`${normalizedDirPath}/`) && pageDir !== normalizedDirPath) {
      const relPath = pageDir.substring(normalizedDirPath.length + 1)
      const firstPart = relPath.split('/')[0]
      if (firstPart) {
        subdirs.add(join(dirPath, firstPart))
      }
    }
  }

  // Process subdirectories
  for (const subdir of Array.from(subdirs).sort()) {
    const dirName = basename(subdir)
    const normalizedSubdir = subdir.replace(/\\/g, '/')

    const subdirPages = allPages.filter((page) => {
      const pageDir = dirname(page.path).replace(/\\/g, '/')
      return pageDir.startsWith(`${normalizedSubdir}/`) || pageDir === normalizedSubdir
    })

    // Check if subdirectory has index file
    const hasIndex = subdirPages.some((page) => {
      const pageDir = dirname(page.path).replace(/\\/g, '/')
      return pageDir === normalizedSubdir && page.name === 'index'
    })

    if (hasIndex) {
      // Directory with index - treat as page
      const indexPage = subdirPages.find((page) => {
        const pageDir = dirname(page.path).replace(/\\/g, '/')
        return pageDir === normalizedSubdir && page.name === 'index'
      })
      meta[dirName] = {
        title: indexPage?.title || dirName,
        type: 'page',
      }
    } else if (subdirPages.length > 0) {
      // Directory without index - treat as menu
      const subMeta = await generateMetaForDirectory(subdir, rootPath, subdirPages, false)

      if (Object.keys(subMeta).length > 0) {
        meta[dirName] = {
          title: dirName
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          type: 'menu',
        }

        // Write nested _meta.json
        const nestedMetaPath = join(subdir, '_meta.json')
        const existingNested = loadExistingMeta(nestedMetaPath)
        const finalNested = { ...existingNested, ...subMeta }
        writeFileSync(nestedMetaPath, JSON.stringify(finalNested, null, 2))
        log.info(
          { path: relative(rootPath, nestedMetaPath) },
          `  ✅ Generated: ${relative(rootPath, nestedMetaPath)}`
        )
      }
    }
  }

  return meta
}

/**
 * Load existing _meta.json to preserve customizations
 */
function loadExistingMeta(metaPath: string): MetaConfig | null {
  if (existsSync(metaPath)) {
    try {
      const content = readFileSync(metaPath, 'utf-8')
      return JSON.parse(content)
    } catch {
      return null
    }
  }
  return null
}

/**
 * Generate navigation meta files
 */
async function generateMeta() {
  const pagesDir = join(process.cwd(), 'pages')

  if (!existsSync(pagesDir)) {
    log.error('❌ pages directory not found!')
    process.exit(1)
  }

  log.info('🔍 Scanning pages directory...')

  // Find all pages
  const allPages = await findPages(pagesDir)
  log.info({ pageCount: allPages.length }, `📄 Found ${allPages.length} page files`)
  if (allPages.length === 0) {
    log.warn('⚠️  Warning: No page files found. Check file patterns and ignore rules.')
  }

  // Load existing meta to preserve customizations
  const metaPath = join(pagesDir, '_meta.json')
  const existingMeta = loadExistingMeta(metaPath)

  // Generate root _meta.json
  const generatedMeta = await generateMetaForDirectory(pagesDir, pagesDir, allPages, true)

  // Merge with existing (existing takes precedence for customizations)
  const rootMeta: MetaConfig = { ...generatedMeta }

  // Preserve existing customizations
  if (existingMeta) {
    for (const [key, value] of Object.entries(existingMeta)) {
      if (typeof value === 'object' && value !== null) {
        rootMeta[key] = value
      } else if (typeof value === 'string') {
        rootMeta[key] = value
      }
    }
  }

  // Ensure index is set if index file exists
  const hasIndex = allPages.some((page) => dirname(page.path) === pagesDir && page.name === 'index')
  if (hasIndex && !rootMeta.index) {
    rootMeta.index = 'Introduction'
  }

  // Write root _meta.json
  writeFileSync(metaPath, JSON.stringify(rootMeta, null, 2))

  log.info({ metaPath }, `✅ Generated: ${metaPath}`)
  log.info(
    { entryCount: Object.keys(rootMeta).length },
    `📊 Found ${Object.keys(rootMeta).length} top-level entries`
  )
  log.info({ pageCount: allPages.length }, `📄 Scanned ${allPages.length} page files`)
  log.info('💡 Tip: Review and customize _meta.json files as needed')
  log.info('   Nextra will automatically pick up changes on next dev server restart')
}

/**
 * Watch mode - auto-regenerate on file changes
 */
async function watchMode() {
  const pagesDir = join(process.cwd(), 'pages')

  if (!existsSync(pagesDir)) {
    log.error('❌ pages directory not found!')
    process.exit(1)
  }

  log.info('👀 Watching pages directory for changes...')
  log.info('   Press Ctrl+C to stop')

  // Initial generation
  await generateMeta()

  // Watch for changes
  const watcher = chokidar.watch(
    [
      join(pagesDir, '**/*.mdx'),
      join(pagesDir, '**/*.md'),
      join(pagesDir, '**/*.tsx'),
      join(pagesDir, '**/*.ts'),
      join(pagesDir, '**/*.jsx'),
      join(pagesDir, '**/*.js'),
    ],
    {
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        '**/_meta.json',
        '**/_meta.js',
        '**/404.*',
        '**/sitemap.xml.*',
      ],
      ignoreInitial: true,
      persistent: true,
    }
  )

  let debounceTimer: NodeJS.Timeout | null = null

  watcher.on('all', async (event, path) => {
    if (event === 'add' || event === 'unlink' || event === 'change') {
      // Debounce rapid changes
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      debounceTimer = setTimeout(async () => {
        log.info(
          { event, path: relative(pagesDir, path) },
          `🔄 File ${event}: ${relative(pagesDir, path)}`
        )
        await generateMeta()
      }, 500)
    }
  })

  watcher.on('error', (error) => {
    log.error({ error }, '❌ Watcher error')
  })
}

// Main execution
const args = process.argv.slice(2)
const isWatch = args.includes('--watch') || args.includes('-w')

if (isWatch) {
  watchMode().catch((error) => log.error({ error }, 'Watch mode error'))
} else {
  generateMeta().catch((error) => log.error({ error }, 'Generation error'))
}
