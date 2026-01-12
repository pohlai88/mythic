#!/usr/bin/env tsx
/**
 * Comprehensive Tech Debt Audit Script
 *
 * Detects and reports all tech debt patterns:
 * - TODO/FIXME/XXX/HACK comments (unless properly linked)
 * - Placeholder values
 * - Stub functions
 * - Empty state placeholders
 * - Console.log usage
 * - Incomplete error handling
 * - Placeholder files (static assets)
 *
 * Complies with Rule 031: Tech Debt Prevention
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join, extname, resolve } from 'path'
import { glob } from 'glob'
import chalk from 'chalk'

interface TechDebtIssue {
  category: string
  severity: 'error' | 'warning' | 'info'
  file: string
  line?: number
  message: string
  pattern: string
  fix?: string
}

const issues: TechDebtIssue[] = []
const rootDir = resolve(process.cwd())

// ============================================================================
// Patterns to Detect
// ============================================================================

const patterns = {
  // TODO comments (unless properly linked)
  todo: {
    // Match TODO/FIXME/etc. that are actual todos, not comment headers
    // Exclude patterns like "// TODO comments" or "// Placeholder values"
    pattern: /\/\/\s*(TODO|FIXME|XXX|HACK|STUB|PLACEHOLDER)\s*:?\s+(?!comments|values|functions|states|usage|handling|loading|empty)[^(\n]*/gi,
    allowed: /TODO\((issue-\d+|[\d]{4}-[\d]{2}-[\d]{2})\)/i,
    category: 'TODO Comments',
    severity: 'error' as const,
  },

  // Placeholder values in code
  placeholderValues: {
    pattern: /['"](placeholder|Placeholder|PLACEHOLDER|current-user-id|TODO|FIXME|replace\s+with\s+actual)['"]/g,
    allowed: /test|mock|fixture|example/i,
    category: 'Placeholder Values',
    severity: 'error' as const,
  },

  // Scripts that create placeholder files
  createsPlaceholders: {
    pattern: /(writeFileSync|writeFile|createWriteStream|fs\.write).*['"](placeholder|Placeholder|PLACEHOLDER|TODO)['"]/gi,
    category: 'Placeholder Creation',
    severity: 'error' as const,
  },

  // Stub functions
  stubFunctions: {
    pattern: /function\s+\w+[^{]*\{[^}]*\b(return\s+(null|0|''|""|\[\]|\{\})\s*;?\s*\/\/\s*(Stub|Placeholder)|throw\s+new\s+Error\(['"]Not\s+implemented|throw\s+new\s+Error\(['"]Stub)/gi,
    allowed: /test|mock|spec/i,
    category: 'Stub Functions',
    severity: 'error' as const,
  },

  // Console.log usage (except error/warn and scripts)
  consoleLog: {
    pattern: /console\.(log|info|debug|trace)\(/g,
    allowed: /(scripts[\/\\]|\.(test|spec|d)\.(ts|tsx|js|jsx)$)/,
    category: 'Console Usage',
    severity: 'error' as const,
  },

  // Empty catch blocks
  emptyCatch: {
    pattern: /catch\s*\([^)]*\)\s*\{[^}]*\}/gs,
    empty: /catch\s*\([^)]*\)\s*\{\s*\}/,
    category: 'Error Handling',
    severity: 'error' as const,
  },

  // Placeholder loading states
  placeholderLoading: {
    pattern: /return\s+<div[^>]*>(Loading\.\.\.|loading\.\.\.|Loading|loading)<\/div>/i,
    category: 'Loading States',
    severity: 'error' as const,
  },

  // Placeholder empty states
  placeholderEmpty: {
    pattern: /return\s+(null|undefined)\s*;?\s*\/\/\s*(Missing|Placeholder|TODO)/i,
    category: 'Empty States',
    severity: 'error' as const,
  },
}

// ============================================================================
// Static Asset Placeholder Detection
// ============================================================================

function detectPlaceholderFiles() {
  const publicDirs = [
    'apps/docs/public',
    'apps/boardroom/public',
    'public',
  ]

  const placeholderPatterns = [
    /^#\s*Placeholder/i,
    /\bplaceholder\b/i,
    /\bTODO\b|\bFIXME\b/i,
    /replace with actual/i,
    /this is a placeholder/i,
    /placeholder\s+(file|image|icon|asset)/i,
  ]

  // Text-based file extensions that can contain placeholder text
  const textExtensions = ['.txt', '.md', '.svg', '.xml', '.html', '.css', '.json']
  // Binary file extensions that might have placeholder text in metadata
  const binaryExtensions = ['.png', '.jpg', '.jpeg', '.ico', '.gif', '.webp']

  for (const dir of publicDirs) {
    const dirPath = join(rootDir, dir)
    if (!existsSync(dirPath)) continue

    try {
      const files = readdirSync(dirPath, { recursive: true, withFileTypes: true })

      for (const file of files) {
        if (!file.isFile()) continue

        const filePath = join(dirPath, file.name)
        const ext = extname(file.name).toLowerCase()

        // Check text files
        if (textExtensions.includes(ext)) {
          try {
            const content = readFileSync(filePath, 'utf-8')
            for (const pattern of placeholderPatterns) {
              if (pattern.test(content)) {
                issues.push({
                  category: 'Placeholder Files',
                  severity: 'error',
                  file: filePath.replace(rootDir + '/', ''),
                  message: `Placeholder content detected in ${file.name}`,
                  pattern: pattern.source,
                  fix: `Remove placeholder file or replace with actual asset`,
                })
                break
              }
            }
          } catch {
            // Skip unreadable files
          }
        }

        // Check binary files (read as text to check for embedded placeholder text)
        if (binaryExtensions.includes(ext)) {
          try {
            // Try reading first 1KB as text to detect placeholder text in metadata
            const buffer = readFileSync(filePath)
            const textPreview = buffer.slice(0, 1024).toString('utf-8', 0, Math.min(1024, buffer.length))

            for (const pattern of placeholderPatterns) {
              if (pattern.test(textPreview)) {
                issues.push({
                  category: 'Placeholder Files',
                  severity: 'error',
                  file: filePath.replace(rootDir + '/', ''),
                  message: `Placeholder text detected in binary file: ${file.name}`,
                  pattern: pattern.source,
                  fix: `Remove placeholder file or replace with actual asset`,
                })
                break
              }
            }
          } catch {
            // Skip unreadable files
          }
        }
      }
    } catch {
      // Skip directories that can't be read
    }
  }
}

// ============================================================================
// Code Analysis
// ============================================================================

function analyzeCodeFiles() {
  const codeFiles = glob.sync('**/*.{ts,tsx,js,jsx}', {
    cwd: rootDir,
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/.turbo/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
    ],
  })

  for (const file of codeFiles) {
    const filePath = join(rootDir, file)
    if (!existsSync(filePath)) continue

    try {
      const content = readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      // Check each pattern
      // Normalize file path for cross-platform compatibility
      const normalizedFilePath = file.replace(/\\/g, '/')

      for (const [key, config] of Object.entries(patterns)) {
        const matches = [...content.matchAll(new RegExp(config.pattern.source, config.pattern.flags))]

        for (const match of matches) {
          // Skip if in allowed context
          // For console.log, check file path; for TODO, check match content
          if (key === 'consoleLog') {
            // Check if file is in scripts directory or is a test file
            if (config.allowed && config.allowed.test(normalizedFilePath)) {
              continue
            }
          } else if (key === 'todo') {
            // Check if TODO is properly linked
            const todoMatch = match[0]
            if (config.allowed && config.allowed.test(todoMatch)) {
              continue // Properly linked TODO, skip
            }
          } else if (config.allowed && config.allowed.test(match[0])) {
            // For other patterns, check match content
            continue
          }

          // Find line number
          const lineNumber = content.substring(0, match.index).split('\n').length

          issues.push({
            category: config.category,
            severity: config.severity,
            file,
            line: lineNumber,
            message: `${config.category} detected: ${match[0].substring(0, 100)}`,
            pattern: config.pattern.source,
            fix: getFixSuggestion(key, match[0], file),
          })
        }

        // Special handling for empty catch blocks
        if (key === 'emptyCatch') {
          const catchBlocks = [...content.matchAll(new RegExp(config.empty.source, config.empty.flags))]
          for (const match of catchBlocks) {
            const lineNumber = content.substring(0, match.index).split('\n').length
            issues.push({
              category: config.category,
              severity: config.severity,
              file,
              line: lineNumber,
              message: 'Empty catch block detected',
              pattern: config.empty.source,
              fix: 'Add proper error handling in catch block',
            })
          }
        }
      }
    } catch (error) {
      // Skip files that can't be read - log but continue
      const message = error instanceof Error ? error.message : String(error)
      console.warn(`⚠️  Skipping unreadable file: ${message}`)
    }
  }
}

// ============================================================================
// Fix Suggestions
// ============================================================================

function getFixSuggestion(pattern: string, match: string, file: string): string {
  switch (pattern) {
    case 'todo':
      return 'Link TODO to issue: TODO(issue-123): Description or remove if implemented'
    case 'placeholderValues':
      return 'Replace placeholder with actual implementation or environment variable'
    case 'stubFunctions':
      return 'Implement function or remove if not needed'
    case 'consoleLog':
      return 'Use proper logging service instead of console.log'
    case 'emptyCatch':
      return 'Add proper error handling in catch block'
    case 'placeholderLoading':
      return 'Use <LoadingState /> component instead'
    case 'placeholderEmpty':
      return 'Use <EmptyState /> component instead'
    default:
      return 'Remove placeholder/stub and implement properly'
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  console.log(chalk.bold.cyan('\n🔍 Starting Tech Debt Audit...\n'))
  console.log(chalk.blue('Scanning for tech debt patterns...\n'))

  detectPlaceholderFiles()
  analyzeCodeFiles()

  // ============================================================================
  // Report Results
  // ============================================================================

  console.log(chalk.bold.cyan('\n📊 Tech Debt Audit Results\n'))

  const errors = issues.filter(i => i.severity === 'error')
  const warnings = issues.filter(i => i.severity === 'warning')
  const infos = issues.filter(i => i.severity === 'info')

  console.log(chalk.red(`❌ Errors: ${errors.length}`))
  console.log(chalk.yellow(`⚠️  Warnings: ${warnings.length}`))
  console.log(chalk.blue(`ℹ️  Info: ${infos.length}`))
  console.log(chalk.bold(`\n📋 Total Issues: ${issues.length}\n`))

  // Group by category
  const byCategory = issues.reduce((acc, issue) => {
    if (!acc[issue.category]) {
      acc[issue.category] = []
    }
    acc[issue.category].push(issue)
    return acc
  }, {} as Record<string, TechDebtIssue[]>)

  for (const [category, categoryIssues] of Object.entries(byCategory)) {
    console.log(chalk.bold(`\n${category} (${categoryIssues.length} issues)`))
    console.log('─'.repeat(60))

    for (const issue of categoryIssues.slice(0, 20)) { // Limit to 20 per category
      const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️'
      const color = issue.severity === 'error' ? chalk.red : issue.severity === 'warning' ? chalk.yellow : chalk.blue

      console.log(color(`${icon} ${issue.message}`))
      console.log(chalk.gray(`   File: ${issue.file}${issue.line ? `:${issue.line}` : ''}`))
      if (issue.fix) {
        console.log(chalk.green(`   Fix: ${issue.fix}`))
      }
      console.log()
    }

    if (categoryIssues.length > 20) {
      console.log(chalk.gray(`   ... and ${categoryIssues.length - 20} more issues\n`))
    }
  }

  // Exit with error code if there are errors
  if (errors.length > 0) {
    console.log(chalk.bold.red('\n❌ Tech debt audit found errors. Please fix the issues above.\n'))
    console.log(chalk.yellow('💡 Tip: Run with --fix to auto-fix some issues (coming soon)\n'))
    process.exit(1)
  } else if (warnings.length > 0) {
    console.log(chalk.bold.yellow('\n⚠️  Tech debt audit completed with warnings.\n'))
    process.exit(0)
  } else {
    console.log(chalk.bold.green('\n✅ Tech debt audit passed! No issues found.\n'))
    process.exit(0)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
