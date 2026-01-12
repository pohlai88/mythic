#!/usr/bin/env tsx
/**
 * Fix Zod imports: Replace 'z' with 'z4' globally
 * 
 * This script:
 * 1. Replaces `import { z } from 'zod/v4'` with `import { z as z4 } from 'zod/v4'`
 * 2. Replaces all `z.` with `z4.`
 * 3. Replaces `z.infer` with `z4.infer`
 * 4. Replaces type references like `z.ZodTypeAny` with `z4.ZodTypeAny`
 */

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

async function main() {
  const FILES = await glob('apps/boardroom/src/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  })

  console.log(`Found ${FILES.length} files to check\n`)

  let totalChanged = 0

  for (const file of FILES) {
  let content = readFileSync(file, 'utf-8')
  const original = content

  // Skip if no zod usage
  if (!content.includes('zod/v4') && !content.includes('zod')) {
    continue
  }

  // Replace import: import { z } from 'zod/v4' → import { z as z4 } from 'zod/v4'
  content = content.replace(
    /import\s+\{\s*z\s*\}\s+from\s+['"]zod\/v4['"]/g,
    "import { z as z4 } from 'zod/v4'"
  )

  // Replace type import: import type { z } from 'zod/v4' → import type { z as z4 } from 'zod/v4'
  content = content.replace(
    /import\s+type\s+\{\s*z\s*\}\s+from\s+['"]zod\/v4['"]/g,
    "import type { z as z4 } from 'zod/v4'"
  )

  // Replace all z. with z4. (but not z4. which is already correct)
  // Use word boundary to avoid replacing 'z' in variable names
  content = content.replace(/\bz\./g, 'z4.')

  // Replace z in type annotations: : z → : z4 (when followed by type-like patterns)
  content = content.replace(/: z\b(?=\s*[<\[\(])/g, ': z4')

  // Replace z in generics: <z\b → <z4 (when followed by capital letter)
  content = content.replace(/<z\b(?=\s*[A-Z])/g, '<z4')

  if (content !== original) {
    writeFileSync(file, content, 'utf-8')
    totalChanged++
    console.log(`✅ Fixed: ${file}`)
  }
  }

  console.log(`\n📊 Fixed ${totalChanged} files`)
}

main().catch(console.error)
