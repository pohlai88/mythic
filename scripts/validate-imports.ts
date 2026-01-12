#!/usr/bin/env tsx
/**
 * Validate Import Paths
 *
 * Ensures all imports use path aliases (@/) instead of relative paths (../, ./)
 * Validates barrel export usage and path alias hierarchy
 */

import { glob } from 'glob'
import { readFileSync } from 'fs'
import { relative, dirname, resolve } from 'path'

interface ValidationResult {
  file: string
  line: number
  code: string
  violation: string
  suggestion: string
}

interface ValidationStats {
  total: number
  violations: number
  passed: number
}

// Allowed exceptions (config files, test fixtures)
const ALLOWED_EXCEPTIONS = [
  /.*\/next\.config\..*/,
  /.*\/tailwind\.config\..*/,
  /.*\/drizzle\.config\..*/,
  /.*\.config\.(ts|js|mjs)$/,
  /.*\.test\.(ts|tsx)$/,
  /.*\.spec\.(ts|tsx)$/,
]

// Paths that should use aliases
const SOURCE_PATHS = [
  'apps/boardroom/src',
  'apps/boardroom/app',
  'apps/boardroom/components',
]

function isAllowedException(filePath: string): boolean {
  return ALLOWED_EXCEPTIONS.some(pattern => pattern.test(filePath))
}

function isSourceFile(filePath: string): boolean {
  return SOURCE_PATHS.some(path => filePath.includes(path))
}

function validateFile(filePath: string): ValidationResult[] {
  const results: ValidationResult[] = []
  
  // Skip exceptions
  if (isAllowedException(filePath)) {
    return results
  }
  
  // Only validate source files
  if (!isSourceFile(filePath)) {
    return results
  }
  
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  
  // Match import/export statements with relative paths
  const relativeImportRegex = /(import|export)(.*?)\s+from\s+(['"])(\.\.?\/[^'"]+)(['"])/g
  
  lines.forEach((line, index) => {
    const matches = [...line.matchAll(relativeImportRegex)]
    
    for (const match of matches) {
      const importPath = match[4]
      const lineNumber = index + 1
      
      // Skip if already using alias
      if (importPath.startsWith('@/')) {
        continue
      }
      
      // Skip external packages
      if (!importPath.startsWith('.')) {
        continue
      }
      
      // Resolve to absolute path
      const fileDir = dirname(filePath)
      const resolvedPath = resolve(fileDir, importPath)
      const boardroomRoot = resolve('apps/boardroom')
      
      // Check if path is within boardroom
      if (!resolvedPath.startsWith(boardroomRoot)) {
        continue // External to boardroom
      }
      
      // Get relative path from boardroom root
      const relativeFromRoot = relative(boardroomRoot, resolvedPath).replace(/\\/g, '/')
      
      // Remove file extension
      let aliasPath = relativeFromRoot.replace(/\.(ts|tsx|js|jsx)$/, '')
      
      // Remove /index if present
      if (aliasPath.endsWith('/index')) {
        aliasPath = aliasPath.slice(0, -6)
      }
      
      // Determine alias
      let suggestedAlias: string
      if (aliasPath.startsWith('app/')) {
        suggestedAlias = `@/app/${aliasPath.slice(4)}`
      } else if (aliasPath.startsWith('components/')) {
        suggestedAlias = `@/components/${aliasPath.slice(11)}`
      } else if (aliasPath.startsWith('src/')) {
        suggestedAlias = `@/src/${aliasPath.slice(4)}`
      } else if (aliasPath) {
        suggestedAlias = `@/${aliasPath}`
      } else {
        continue // Skip root-level
      }
      
      results.push({
        file: filePath,
        line: lineNumber,
        code: line.trim(),
        violation: `Relative import: ${importPath}`,
        suggestion: `Use alias: ${suggestedAlias}`,
      })
    }
  })
  
  return results
}

async function main() {
  const files = await glob('apps/boardroom/**/*.{ts,tsx}', {
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/*.d.ts',
      '**/scripts/**',
    ],
  })
  
  console.log(`\n🔍 Validating imports in ${files.length} files...\n`)
  
  const allResults: ValidationResult[] = []
  
  for (const file of files) {
    const results = validateFile(file)
    allResults.push(...results)
  }
  
  const stats: ValidationStats = {
    total: files.length,
    violations: allResults.length,
    passed: files.length - allResults.length,
  }
  
  console.log(`📊 Validation Results:`)
  console.log(`   Total files: ${stats.total}`)
  console.log(`   ✅ Passed: ${stats.passed}`)
  console.log(`   ❌ Violations: ${stats.violations}\n`)
  
  if (allResults.length > 0) {
    console.log('❌ Violations found:\n')
    
    // Group by file
    const byFile = new Map<string, ValidationResult[]>()
    for (const result of allResults) {
      if (!byFile.has(result.file)) {
        byFile.set(result.file, [])
      }
      byFile.get(result.file)!.push(result)
    }
    
    // Print violations
    for (const [file, results] of byFile.entries()) {
      console.log(`  ${file}:`)
      for (const result of results) {
        console.log(`    Line ${result.line}: ${result.violation}`)
        console.log(`      ${result.code}`)
        console.log(`      → ${result.suggestion}\n`)
      }
    }
    
    console.log('\n💡 To fix violations:')
    console.log('   1. Run: pnpm migrate:imports (if script exists)')
    console.log('   2. Or manually replace relative imports with aliases')
    console.log('   3. Run: pnpm validate:imports (to verify)\n')
    
    process.exit(1)
  } else {
    console.log('✅ All imports use path aliases correctly!\n')
    process.exit(0)
  }
}

main().catch(error => {
  console.error('Validation error:', error)
  process.exit(1)
})
