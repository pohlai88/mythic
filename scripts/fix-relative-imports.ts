#!/usr/bin/env tsx
/**
 * Fix Relative Imports: Replace relative imports with alias-based imports
 *
 * This script:
 * 1. Replaces relative imports (../, ../../) with @ alias imports
 * 2. Maps paths based on tsconfig.json path aliases
 *
 * Rules:
 * - @/app/* → app/*
 * - @/components/* → components/*
 * - @/src/* → src/*
 * - @/* → root files
 */

import { readFileSync, writeFileSync } from "fs"
import { glob } from "glob"
import { relative, dirname, resolve, normalize } from "path"

interface ImportReplacement {
  from: string
  to: string
  file: string
}

// Base directory for the boardroom app
const BOARDROOM_ROOT = "apps/boardroom"

// Path mappings based on tsconfig
const PATH_ALIASES = {
  "@/app/": "app/",
  "@/components/": "components/",
  "@/src/": "src/",
  "@/": "", // root
}

function resolveRelativePath(filePath: string, importPath: string): string | null {
  // Remove quotes
  const cleanPath = importPath.replace(/['"]/g, "")

  // Skip if already using alias
  if (cleanPath.startsWith("@/")) {
    return null
  }

  // Skip if external package
  if (!cleanPath.startsWith(".")) {
    return null
  }

  // Get absolute paths
  const fileDir = dirname(filePath)
  const resolvedPath = resolve(fileDir, cleanPath)
  const boardroomRoot = resolve(BOARDROOM_ROOT)

  // Check if path is within boardroom root
  if (!resolvedPath.startsWith(boardroomRoot)) {
    return null // External to boardroom
  }

  // Get relative path from boardroom root
  let relativeFromRoot = normalize(relative(boardroomRoot, resolvedPath)).replace(/\\/g, "/")

  // Remove file extension for import (TypeScript doesn't need it)
  relativeFromRoot = relativeFromRoot.replace(/\.(ts|tsx|js|jsx)$/, "")

  // Remove /index if present (TypeScript resolves it automatically)
  if (relativeFromRoot.endsWith("/index")) {
    relativeFromRoot = relativeFromRoot.slice(0, -6)
  }

  // Determine which alias to use
  if (relativeFromRoot.startsWith("app/")) {
    return `@/app/${relativeFromRoot.slice(4)}`
  } else if (relativeFromRoot.startsWith("components/")) {
    return `@/components/${relativeFromRoot.slice(11)}`
  } else if (relativeFromRoot.startsWith("src/")) {
    return `@/src/${relativeFromRoot.slice(4)}`
  } else if (relativeFromRoot) {
    // Root level
    return `@/${relativeFromRoot}`
  }

  return null
}

function fixImportsInFile(filePath: string): ImportReplacement[] {
  const content = readFileSync(filePath, "utf-8")
  const lines = content.split("\n")
  const replacements: ImportReplacement[] = []
  let modified = false
  const newLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Match import/export statements with relative paths
    // Handles: import ... from '../path' or import ... from './path'
    const importMatch = line.match(/(import|export)(.*?)\s+from\s+(['"])(\.\.?\/[^'"]+)(['"])/)
    if (importMatch) {
      const prefix = importMatch[1]
      const imports = importMatch[2].trim()
      const quote = importMatch[3]
      const importPath = importMatch[4]
      const endQuote = importMatch[5]

      const aliasPath = resolveRelativePath(filePath, importPath)

      if (aliasPath) {
        const newLine = `${prefix}${imports ? ` ${imports}` : ""} from ${quote}${aliasPath}${endQuote}`
        newLines.push(newLine)
        replacements.push({
          from: importPath,
          to: aliasPath,
          file: filePath,
        })
        modified = true
      } else {
        newLines.push(line)
      }
    } else {
      newLines.push(line)
    }
  }

  if (modified) {
    writeFileSync(filePath, newLines.join("\n"), "utf-8")
  }

  return replacements
}

async function main() {
  const files = await glob(`${BOARDROOM_ROOT}/**/*.{ts,tsx}`, {
    ignore: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/*.d.ts"],
  })

  console.log(`Found ${files.length} files to check\n`)

  let totalChanged = 0
  const allReplacements: ImportReplacement[] = []

  for (const file of files) {
    try {
      const replacements = fixImportsInFile(file)
      if (replacements.length > 0) {
        totalChanged++
        console.log(`✅ Fixed: ${file}`)
        replacements.forEach((r) => {
          console.log(`   ${r.from} → ${r.to}`)
          allReplacements.push(r)
        })
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error)
    }
  }

  console.log(`\n📊 Fixed ${totalChanged} files`)
  console.log(`📊 Total replacements: ${allReplacements.length}`)

  if (totalChanged === 0) {
    console.log("\n⚠️  No files were changed. Checking if files exist...")
    console.log(`Sample files found: ${files.slice(0, 5).join(", ")}`)
  }
}

main().catch(console.error)
