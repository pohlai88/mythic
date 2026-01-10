#!/usr/bin/env tsx
/**
 * Zod Import Migration Script
 *
 * Migrates all Zod imports from 'zod' to 'zod/v4'
 *
 * Usage:
 *   pnpm migrate:zod-imports
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { glob } from 'fast-glob'
import { createScriptLogger } from '../src/lib/logger'

const log = createScriptLogger('migrate-zod-imports')

interface MigrationResult {
  file: string
  changed: boolean
  changes: string[]
}

const results: MigrationResult[] = []

/**
 * Migrate imports in a single file
 */
function migrateFile(file: string): MigrationResult {
  const content = readFileSync(file, 'utf-8')
  const changes: string[] = []
  let newContent = content
  let changed = false

  // Migrate import statements
  const importPatterns = [
    { from: /from\s+['"]zod['"]/g, to: "from 'zod/v4'" },
    { from: /from\s+["']zod["']/g, to: 'from "zod/v4"' },
    { from: /require\(['"]zod['"]\)/g, to: "require('zod/v4')" },
    { from: /require\(["']zod["']\)/g, to: 'require("zod/v4")' },
  ]

  for (const pattern of importPatterns) {
    if (pattern.from.test(newContent)) {
      newContent = newContent.replace(pattern.from, pattern.to)
      changes.push(`Updated import to 'zod/v4'`)
      changed = true
    }
  }

  if (changed) {
    writeFileSync(file, newContent, 'utf-8')
  }

  return { file, changed, changes }
}

/**
 * Main migration function
 */
async function migrateImports() {
  log.info('🔄 Migrating Zod imports to zod/v4...')

  // Find all TypeScript files
  const files = await glob(['**/*.{ts,tsx}'], {
    ignore: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      '*.d.ts',
      'scripts/migrate-zod-imports.ts', // Exclude self
    ],
  })

  // Migrate each file
  for (const file of files) {
    const content = readFileSync(file, 'utf-8')
    // Only process files that use zod
    if (content.includes('zod') || content.includes('from') || content.includes('import')) {
      const result = migrateFile(file)
      if (result.changed) {
        results.push(result)
      }
    }
  }

  // Report results
  log.info({ filesProcessed: files.length }, `📊 Processed ${files.length} files`)

  if (results.length > 0) {
    log.info('✅ Migrated files:')
    for (const result of results) {
      log.info({ file: result.file }, `   ${result.file}`)
      for (const change of result.changes) {
        log.debug({ change }, `     - ${change}`)
      }
    }
    log.info({ migratedCount: results.length }, `✅ Successfully migrated ${results.length} files!`)
  } else {
    log.info('✅ All imports are already using zod/v4!')
  }
}

// Run migration
migrateImports().catch((error) => {
  log.error({ error }, '❌ Migration error')
  process.exit(1)
})
