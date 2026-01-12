#!/usr/bin/env tsx
/**
 * Migrate Zod imports from 'z' to 'z4'
 * 
 * Replaces:
 * - import { z } from 'zod/v4' → import { z as z4 } from 'zod/v4'
 * - All usages of z. → z4.
 * - All usages of z.infer → z4.infer
 * - All type references z.ZodTypeAny → z4.ZodTypeAny
 */

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'
import { join } from 'path'

const CODE_DIRS = [
  'apps/boardroom/src/**/*.ts',
  'apps/boardroom/src/**/*.tsx',
  'packages/**/src/**/*.ts',
  'packages/**/src/**/*.tsx',
  'src/**/*.ts',
  'src/**/*.tsx',
  'scripts/**/*.ts',
]

const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
  '**/*.d.ts',
]

async function migrateFile(filePath: string): Promise<{ changed: boolean; errors: string[] }> {
  const errors: string[] = []
  let changed = false

  try {
    let content = readFileSync(filePath, 'utf-8')
    const originalContent = content

    // Skip if file doesn't use zod
    if (!content.includes('zod/v4') && !content.includes("from 'zod'") && !content.includes('from "zod"')) {
      return { changed: false, errors: [] }
    }

    // Check for forbidden 'zod' import (not 'zod/v4')
    if (content.includes("from 'zod'") || content.includes('from "zod"')) {
      errors.push(`File uses forbidden 'zod' import (must use 'zod/v4')`)
    }

    // Replace import statement
    // import { z } from 'zod/v4' → import { z as z4 } from 'zod/v4'
    // import { z } from "zod/v4" → import { z as z4 } from "zod/v4"
    content = content.replace(
      /import\s+\{\s*z\s*\}\s+from\s+['"]zod\/v4['"]/g,
      "import { z as z4 } from 'zod/v4'"
    )

    // Replace type imports
    // import type { z } from 'zod/v4' → import type { z as z4 } from 'zod/v4'
    content = content.replace(
      /import\s+type\s+\{\s*z\s*\}\s+from\s+['"]zod\/v4['"]/g,
      "import type { z as z4 } from 'zod/v4'"
    )

    // Replace all usages of z. with z4.
    // But be careful - we need to match word boundaries
    // z. → z4.
    // z.infer → z4.infer
    // z.ZodTypeAny → z4.ZodTypeAny
    // z.ZodError → z4.ZodError
    // etc.
    
    // Replace z. with z4. (but not z4. which is already correct)
    // Use word boundary to avoid replacing 'z' in variable names
    content = content.replace(/\bz\./g, 'z4.')

    // Replace standalone z references in type contexts
    // This is trickier - we'll handle common patterns
    // z: → z4: (in type annotations)
    // : z → : z4 (in type annotations)
    // <z → <z4 (in generics, but be careful)
    // We'll be conservative and only replace in clear contexts

    // Replace z as a type parameter: <z.ZodTypeAny> → <z4.ZodTypeAny>
    // This is already handled by z. replacement above

    // Replace z in type annotations: : z → : z4 (but only if it's a type, not a variable)
    // This is complex - we'll use a more targeted approach
    // Replace : z\b when followed by type-like patterns
    content = content.replace(/: z\b(?=\s*[<\[\(])/g, ': z4')

    // Replace z in generics: <z\b → <z4 (but be careful)
    // Only replace if it looks like a type reference
    content = content.replace(/<z\b(?=\s*[A-Z])/g, '<z4')

    if (content !== originalContent) {
      changed = true
      writeFileSync(filePath, content, 'utf-8')
    }
  } catch (error) {
    errors.push(`Error processing file: ${error instanceof Error ? error.message : String(error)}`)
  }

  return { changed, errors }
}

async function main() {
  console.log('🔄 Migrating Zod imports from "z" to "z4"...\n')

  const allFiles: string[] = []
  for (const pattern of CODE_DIRS) {
    const files = await glob(pattern, {
      ignore: EXCLUDE_PATTERNS,
    })
    allFiles.push(...files)
  }

  const uniqueFiles = [...new Set(allFiles)]
  console.log(`Found ${uniqueFiles.length} files to check\n`)

  let changedCount = 0
  let errorCount = 0
  const allErrors: Array<{ file: string; errors: string[] }> = []

  for (const file of uniqueFiles) {
    const result = await migrateFile(file)
    if (result.changed) {
      changedCount++
      console.log(`✅ Updated: ${file}`)
    }
    if (result.errors.length > 0) {
      errorCount++
      allErrors.push({ file, errors: result.errors })
      console.log(`⚠️  Errors in ${file}:`)
      result.errors.forEach(err => console.log(`   - ${err}`))
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Files checked: ${uniqueFiles.length}`)
  console.log(`   Files changed: ${changedCount}`)
  console.log(`   Files with errors: ${errorCount}`)

  if (allErrors.length > 0) {
    console.log(`\n❌ Errors found:`)
    allErrors.forEach(({ file, errors }) => {
      console.log(`\n   ${file}:`)
      errors.forEach(err => console.log(`     - ${err}`))
    })
    process.exit(1)
  } else {
    console.log(`\n✅ Migration complete!`)
    process.exit(0)
  }
}

main().catch(error => {
  console.error('Migration error:', error)
  process.exit(1)
})
