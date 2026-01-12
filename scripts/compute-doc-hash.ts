#!/usr/bin/env tsx

/**
 * Compute SHA-256 hash for document sealing
 *
 * Usage:
 *   pnpm tsx scripts/compute-doc-hash.ts <file-path>
 */

import { createHash } from 'crypto'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: pnpm tsx scripts/compute-doc-hash.ts <file-path>')
  process.exit(1)
}

const fullPath = join(process.cwd(), filePath)

if (!existsSync(fullPath)) {
  console.error(`❌ Error: File not found: ${fullPath}`)
  process.exit(1)
}

try {
  const content = readFileSync(fullPath, 'utf-8')
  const hash = createHash('sha256').update(content).digest('hex')

  console.log(`SHA-256 Hash: ${hash}`)
  console.log(`File: ${filePath}`)
  console.log(`\nTo update frontmatter, replace 'sha256:TO_BE_COMPUTED' with:`)
  console.log(`document_hash: sha256:${hash}`)
} catch (error) {
  console.error(`❌ Error: Failed to read file`)
  console.error(`   ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
