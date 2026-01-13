#!/usr/bin/env tsx
/**
 * Auto-Generate Nextra _meta.json from File Structure
 *
 * Scans the pages directory and automatically generates _meta.json files
 * for each directory to keep navigation in sync with file structure.
 *
 * Usage:
 *   pnpm generate:meta
 *   pnpm generate:meta:watch
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { basename, extname, join, relative } from "node:path"
import { createScriptLogger } from "../src/lib/logger"

const log = createScriptLogger("generate-meta")

interface MetaEntry {
  title?: string
  type?: "page" | "menu"
  href?: string
  // ✅ newWindow removed in Nextra 4 - external links automatically open in new tab with rel="noreferrer"
  items?: Record<string, string | MetaEntry> // Required for folder items in _meta.global
}

type MetaConfig = Record<string, string | MetaEntry>

/**
 * Convert filename to title
 * e.g., "api-example.mdx" -> "API Example"
 */
function filenameToTitle(filename: string): string {
  // Remove extension
  const name = basename(filename, extname(filename))

  // Skip special files
  if (name.startsWith("_") || name === "404" || name === "sitemap.xml") {
    return name
  }

  // Convert kebab-case to Title Case
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Check if file is a valid page file
 */
function isValidPageFile(filename: string): boolean {
  const validExtensions = [".mdx", ".md", ".tsx", ".ts", ".jsx", ".js"]
  const ext = extname(filename)

  // Skip special files
  if (filename.startsWith("_") || filename === "404.tsx" || filename === "sitemap.xml.ts") {
    return false
  }

  return validExtensions.includes(ext)
}

/**
 * Load existing _meta.json to preserve customizations
 */
function loadExistingMeta(metaPath: string): MetaConfig | null {
  if (existsSync(metaPath)) {
    try {
      const content = readFileSync(metaPath, "utf-8")
      return JSON.parse(content)
    } catch {
      return null
    }
  }
  return null
}

/**
 * Generate meta configuration for a directory
 */
function generateMetaForDirectory(dirPath: string, rootPath: string, isRoot = false): MetaConfig {
  const meta: MetaConfig = {}
  const entries = readdirSync(dirPath).sort()

  // Index file names for reference
  const indexFiles = ["index.mdx", "index.md", "index.tsx", "index.ts", "index.jsx", "index.js"]

  for (const entry of entries) {
    const fullPath = join(dirPath, entry)
    const stat = statSync(fullPath)

    // Skip hidden files and special files
    if (entry.startsWith(".") || entry === "_meta.json" || entry === "_meta.js") {
      continue
    }

    if (stat.isDirectory()) {
      // Check if directory has an index file
      const dirHasIndex = indexFiles.some((file) => existsSync(join(fullPath, file)))

      if (dirHasIndex) {
        // Directory with index file - treat as page
        meta[entry] = {
          title: filenameToTitle(entry),
          type: "page",
        }
      } else {
        // Directory without index - treat as menu/folder
        const subMeta = generateMetaForDirectory(fullPath, rootPath, false)
        if (Object.keys(subMeta).length > 0) {
          meta[entry] = {
            title: filenameToTitle(entry),
            type: "menu",
          }
          // Write nested _meta.json
          const nestedMetaPath = join(fullPath, "_meta.json")
          const existingNested = loadExistingMeta(nestedMetaPath)
          const finalNested = { ...existingNested, ...subMeta }
          writeFileSync(nestedMetaPath, JSON.stringify(finalNested, null, 2))
          log.info(
            { path: relative(rootPath, nestedMetaPath) },
            `  ✅ Generated: ${relative(rootPath, nestedMetaPath)}`
          )
        }
      }
    } else if (stat.isFile() && isValidPageFile(entry)) {
      const nameWithoutExt = basename(entry, extname(entry))

      // Special handling for index files
      if (nameWithoutExt === "index") {
        if (isRoot) {
          // Root index - add as "Introduction"
          meta.index = "Introduction"
        }
        // For nested directories, index is handled by directory entry
        continue
      }

      meta[nameWithoutExt] = filenameToTitle(entry)
    }
  }

  return meta
}

/**
 * Main function
 */
function main() {
  const pagesDir = join(process.cwd(), "pages")

  if (!existsSync(pagesDir)) {
    log.error("❌ pages directory not found!")
    process.exit(1)
  }

  log.info("🔍 Scanning pages directory...")

  // Load existing meta to preserve customizations
  const metaPath = join(pagesDir, "_meta.json")
  const existingMeta = loadExistingMeta(metaPath)

  // Generate root _meta.json
  const generatedMeta = generateMetaForDirectory(pagesDir, pagesDir, true)

  // Merge with existing (existing takes precedence for customizations)
  // This preserves manual customizations while adding new entries
  const rootMeta: MetaConfig = { ...generatedMeta }

  // Preserve existing customizations (overwrite generated with existing)
  if (existingMeta) {
    for (const [key, value] of Object.entries(existingMeta)) {
      // If it's a custom entry (not just a string), preserve it
      if (typeof value === "object" && value !== null) {
        rootMeta[key] = value
      } else if (typeof value === "string") {
        // Preserve custom string titles
        rootMeta[key] = value
      }
    }
  }

  // Ensure index is set if index file exists
  const indexFiles = ["index.mdx", "index.md", "index.tsx", "index.ts", "index.jsx", "index.js"]
  const hasIndex = indexFiles.some((file) => existsSync(join(pagesDir, file)))
  if (hasIndex && !rootMeta.index) {
    rootMeta.index = "Introduction"
  }

  // Write root _meta.json
  writeFileSync(metaPath, JSON.stringify(rootMeta, null, 2))

  log.info({ metaPath }, `✅ Generated: ${metaPath}`)
  log.info(
    { entryCount: Object.keys(rootMeta).length },
    `📊 Found ${Object.keys(rootMeta).length} top-level entries`
  )
  log.info("💡 Tip: Review and customize _meta.json files as needed")
  log.info("   Nextra will automatically pick up changes on next dev server restart")
}

main()
