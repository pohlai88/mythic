#!/usr/bin/env tsx
/**
 * Validate Zod Usage
 *
 * Ensures .parse() is only used in allowed scopes:
 * - Bootstrap/env files
 * - Test files
 * - Internal invariant layers
 *
 * All other code MUST use .safeParse()
 */

import { glob } from 'glob'
import { readFileSync } from 'fs'
import { join } from 'path'

interface ValidationResult {
  file: string
  line: number
  code: string
  allowed: boolean
  reason?: string
}

// Allowed .parse() usage patterns
const ALLOWED_PATTERNS = [
  // Bootstrap/env files
  /.*\/env\.ts$/,
  /.*\/env\..*\.ts$/,
  /.*\/config\.ts$/,
  /.*\/next\.config\..*/,
  /.*\/tailwind\.config\..*/,
  
  // Test files
  /.*\.test\.ts$/,
  /.*\.test\.tsx$/,
  /.*\.spec\.ts$/,
  /.*\.spec\.tsx$/,
  
  // Internal invariant layers (explicitly named validation functions)
  /.*\/validate-action\.ts$/,
  /.*\/assert.*\.ts$/,
  /.*\/validate.*\.ts$/,  // Any validate-*.ts file (internal invariant layer)
]

// Files that should NEVER use .parse()
const FORBIDDEN_PATTERNS = [
  /.*\/actions\/.*\.ts$/,  // Server actions (user input)
  /.*\/api\/.*\/route\.ts$/,  // API routes (external data)
  /.*\/components\/.*\.tsx$/,  // Components (user input)
  /.*\/forms\/.*\.ts$/,  // Forms (user input)
]

function isAllowed(filePath: string): boolean {
  return ALLOWED_PATTERNS.some(pattern => pattern.test(filePath))
}

function isForbidden(filePath: string): boolean {
  return FORBIDDEN_PATTERNS.some(pattern => pattern.test(filePath))
}

function validateFile(filePath: string): ValidationResult[] {
  const results: ValidationResult[] = []
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  
  // Check 1: Forbidden 'zod' import (must use 'zod/v4')
  if (content.includes("from 'zod'") || content.includes('from "zod"')) {
    const lineIndex = lines.findIndex(line => 
      line.includes("from 'zod'") || line.includes('from "zod"')
    )
    if (lineIndex >= 0) {
      results.push({
        file: filePath,
        line: lineIndex + 1,
        code: lines[lineIndex].trim(),
        allowed: false,
        reason: "MUST use 'zod/v4' import, not 'zod'",
      })
    }
  }

  // Check 2: Using 'z' instead of 'z4' as variable name
  if (content.includes("import { z } from 'zod/v4'") || content.includes('import { z } from "zod/v4"')) {
    const lineIndex = lines.findIndex(line => 
      (line.includes("import { z } from 'zod/v4'") || line.includes('import { z } from "zod/v4"')) &&
      !line.includes('z as z4')
    )
    if (lineIndex >= 0) {
      results.push({
        file: filePath,
        line: lineIndex + 1,
        code: lines[lineIndex].trim(),
        allowed: false,
        reason: "MUST use 'z as z4' import, not 'z'",
      })
    }
  }

  // Check 3: Using 'z.' instead of 'z4.' (but allow if already using z4)
  if (content.includes('zod/v4') && !content.includes('z as z4') && content.includes('z.')) {
    const lineIndex = lines.findIndex(line => 
      line.includes('z.') && !line.includes('z4.')
    )
    if (lineIndex >= 0) {
      results.push({
        file: filePath,
        line: lineIndex + 1,
        code: lines[lineIndex].trim(),
        allowed: false,
        reason: "MUST use 'z4.' instead of 'z.'",
      })
    }
  }
  
  // Check 4: Find all .parse( calls
  lines.forEach((line, index) => {
    const match = line.match(/\.parse\s*\(/)
    if (match) {
      const lineNumber = index + 1
      const allowed = isAllowed(filePath)
      const forbidden = isForbidden(filePath)
      
      let reason: string | undefined
      if (forbidden) {
        reason = 'File type requires .safeParse() (user input or external data)'
      } else if (!allowed) {
        reason = 'File not in allowed exception list - use .safeParse()'
      } else {
        reason = 'Allowed exception (bootstrap/test/internal invariant)'
      }
      
      results.push({
        file: filePath,
        line: lineNumber,
        code: line.trim(),
        allowed: allowed && !forbidden,
        reason,
      })
    }
  })
  
  return results
}

async function main() {
  const files = await glob('**/*.{ts,tsx}', {
    ignore: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.d.ts',
    ],
  })
  
  const allResults: ValidationResult[] = []
  
  for (const file of files) {
    const results = validateFile(file)
    allResults.push(...results)
  }
  
  const violations = allResults.filter(r => !r.allowed)
  const allowed = allResults.filter(r => r.allowed)
  
  console.log(`\n📊 Zod Usage Validation Results\n`)
  console.log(`Total .parse() calls found: ${allResults.length}`)
  console.log(`✅ Allowed: ${allowed.length}`)
  console.log(`❌ Violations: ${violations.length}\n`)
  
  if (violations.length > 0) {
    console.log('❌ Violations found:\n')
    violations.forEach(v => {
      console.log(`  ${v.file}:${v.line}`)
      console.log(`    ${v.code}`)
      console.log(`    Reason: ${v.reason}\n`)
    })
    process.exit(1)
  } else {
    console.log('✅ All .parse() usage is in allowed scopes\n')
    process.exit(0)
  }
}

main().catch(error => {
  console.error('Validation error:', error)
  process.exit(1)
})
