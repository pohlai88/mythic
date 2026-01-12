#!/usr/bin/env node
/**
 * Tech Debt Validation Script
 *
 * Validates codebase for prohibited patterns:
 * - TODO comments (unless linked to issue)
 * - Placeholder values
 * - Stub functions
 * - Console.log/info/debug
 * - Missing empty states
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'
import { handleFatalError, createScriptLogger } from '../src/lib/script-utils'

interface ValidationResult {
  file: string
  line: number
  pattern: string
  message: string
  severity: 'error' | 'warning'
}

const prohibitedPatterns = [
  {
    pattern: /\/\/\s*TODO(?!\(issue-|\d{4}-\d{2}-\d{2})/i,
    message: 'TODO comment without issue link or date',
    severity: 'error' as const,
  },
  {
    pattern: /\/\/\s*(FIXME|XXX|HACK|STUB|PLACEHOLDER)/i,
    message: 'Prohibited comment pattern (FIXME/XXX/HACK/STUB/PLACEHOLDER)',
    severity: 'error' as const,
  },
  {
    pattern: /['"](placeholder|Placeholder|PLACEHOLDER|current-user-id|TODO|replace\s+with\s+actual)['"]/,
    message: 'Placeholder value detected',
    severity: 'error' as const,
    exclude: /\.(test|spec)\.(ts|tsx|js|jsx)$/,
  },
  {
    pattern: /(writeFileSync|writeFile|createWriteStream|fs\.write).*['"](placeholder|Placeholder|PLACEHOLDER|TODO)['"]/gi,
    message: 'Script creates placeholder files - prohibited by Rule 031',
    severity: 'error' as const,
  },
  {
    pattern: /console\.(log|info|debug)\(/,
    message: 'console.log/info/debug not allowed (use console.error/warn or logger)',
    severity: 'error' as const,
    exclude: /(\/scripts\/|scripts\/|\.(test|spec|d)\.(ts|tsx|js|jsx)$)/,
  },
  {
    pattern: /return\s+(null|0|''|"")\s*;?\s*\/\/\s*(Stub|Placeholder)/i,
    message: 'Stub function detected',
    severity: 'error' as const,
    exclude: /\.(test|spec)\.(ts|tsx|js|jsx)$/,
  },
  {
    pattern: /if\s*\(!.*\)\s*\{\s*return\s+<div>Loading\.\.\.<\/div>/,
    message: 'Placeholder loading state - use LoadingState component',
    severity: 'error' as const,
  },
  {
    pattern: /if\s*\(.*\.length\s*===\s*0\)\s*\{\s*return\s+null/,
    message: 'Missing empty state - use EmptyState component',
    severity: 'error' as const,
  },
]

const errors: ValidationResult[] = []
const warnings: ValidationResult[] = []

function shouldExcludeFile(filePath: string, exclude?: RegExp): boolean {
  if (!exclude) return false
  // Normalize path separators for cross-platform compatibility
  const normalizedPath = filePath.replace(/\\/g, '/')
  return exclude.test(normalizedPath)
}

function validateFile(filePath: string): void {
  let content: string
  try {
    content = readFileSync(filePath, 'utf-8')
  } catch (error) {
    logger.debug({ file: filePath, error }, 'Skipping unreadable file')
    return
  }
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    prohibitedPatterns.forEach(({ pattern, message, severity, exclude }) => {
      if (shouldExcludeFile(filePath, exclude)) return

      if (pattern.test(line)) {
        const result: ValidationResult = {
          file: filePath,
          line: index + 1,
          pattern: pattern.toString(),
          message,
          severity,
        }

        if (severity === 'error') {
          errors.push(result)
        } else {
          warnings.push(result)
        }
      }
    })
  })
}

function checkStaticAssets(dir: string): void {
  const publicDirs = [
    join(dir, 'apps/docs/public'),
    join(dir, 'apps/boardroom/public'),
    join(dir, 'public'),
  ]

  const placeholderPatterns = [
    /^#\s*Placeholder/i,
    /\bplaceholder\b/i,
    /\bTODO\b|\bFIXME\b/i,
    /replace with actual/i,
    /this is a placeholder/i,
  ]

  const textExtensions = ['.txt', '.md', '.svg', '.xml', '.html', '.css', '.json']
  const binaryExtensions = ['.png', '.jpg', '.jpeg', '.ico', '.gif', '.webp']

  for (const publicDir of publicDirs) {
    if (!existsSync(publicDir)) continue

    try {
      const files = readdirSync(publicDir, { recursive: true, withFileTypes: true })

      for (const file of files) {
        if (!file.isFile()) continue

        const filePath = join(publicDir, file.name)
        const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase()

        // Check text files
        if (textExtensions.includes(ext)) {
          try {
            const content = readFileSync(filePath, 'utf-8')
            for (const pattern of placeholderPatterns) {
              if (pattern.test(content)) {
                errors.push({
                  file: filePath,
                  line: 1,
                  pattern: pattern.toString(),
                  message: `Placeholder content detected in static asset: ${file.name}`,
                  severity: 'error',
                })
                break
              }
            }
          } catch (error) {
            // Skip unreadable files - log but continue
            logger.debug({ file: filePath, error }, 'Skipping unreadable text file')
          }
        }

        // Check binary files (read first 1KB as text)
        if (binaryExtensions.includes(ext)) {
          try {
            const buffer = readFileSync(filePath)
            const textPreview = buffer.slice(0, 1024).toString('utf-8', 0, Math.min(1024, buffer.length))

            for (const pattern of placeholderPatterns) {
              if (pattern.test(textPreview)) {
                errors.push({
                  file: filePath,
                  line: 1,
                  pattern: pattern.toString(),
                  message: `Placeholder text detected in binary file: ${file.name}`,
                  severity: 'error',
                })
                break
              }
            }
          } catch {
            // Skip unreadable files
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be read - log but continue
      logger.debug({ directory: publicDir, error }, 'Skipping unreadable directory')
    }
  }
}

function walkDirectory(dir: string, extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']): void {
  const files = readdirSync(dir)

  files.forEach((file) => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (
        !file.startsWith('.') &&
        file !== 'node_modules' &&
        file !== '.next' &&
        file !== 'dist' &&
        file !== 'build'
      ) {
        walkDirectory(filePath, extensions)
      }
    } else if (stat.isFile()) {
      const ext = filePath.substring(filePath.lastIndexOf('.'))
      if (extensions.includes(ext)) {
        validateFile(filePath)
      }
    }
  })
}

// Main execution
const rootDir = process.argv[2] || process.cwd()
const targetDir = join(rootDir, 'apps/boardroom')
const logger = createScriptLogger('validate-tech-debt')

logger.info({ targetDir }, 'Validating tech debt patterns')

try {
  // Check code files
  walkDirectory(targetDir)

  // Check static assets
  logger.info('Checking static assets for placeholders')
  checkStaticAssets(rootDir)
} catch (error) {
  handleFatalError(error, {
    context: { script: 'validate-tech-debt', targetDir },
    logger,
  })
}

// Report results
if (warnings.length > 0) {
  console.log('⚠️  Warnings:')
  warnings.forEach(({ file, line, message }) => {
    console.log(`  ${file}:${line} - ${message}`)
  })
  console.log()
}

if (errors.length > 0) {
  console.error('❌ Errors:')
  errors.forEach(({ file, line, message }) => {
    console.error(`  ${file}:${line} - ${message}`)
  })
  console.error(`\n❌ Found ${errors.length} tech debt violations`)
  process.exit(1)
}

console.log('✅ No tech debt violations found')
process.exit(0)
