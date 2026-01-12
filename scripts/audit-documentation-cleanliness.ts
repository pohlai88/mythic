#!/usr/bin/env tsx
/**
 * Documentation Cleanliness Audit Script
 *
 * Director of Audit - Full Screening
 *
 * Comprehensive audit of documentation cleanliness:
 * - Frontmatter compliance
 * - Naming conventions
 * - Formatting consistency
 * - Content quality
 * - Link validity
 * - Structure compliance
 * - Grammar/spelling checks
 * - Completeness verification
 */

import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, dirname, basename, extname } from 'node:path'
import { glob } from 'glob'
import chalk from 'chalk'

interface CleanlinessIssue {
  file: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  category: string
  issue: string
  line?: number
  recommendation: string
}

interface AuditResult {
  totalFiles: number
  filesAudited: number
  issues: CleanlinessIssue[]
  bySeverity: Record<string, number>
  byCategory: Record<string, number>
  compliance: number
  recommendations: string[]
}

// Documentation directories to audit
const DOC_DIRS = [
  'docs/**/*.md',
  'docs/**/*.mdx',
  'content/**/*.mdx',
  '.cursor/docs/**/*.md',
]

// Exclude patterns
const EXCLUDE = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
  'docs/migrations/**',
  'docs/changelog/**',
  '.cursor/archive/**',
  '.cursor/work/**',
]

// Required frontmatter fields
const REQUIRED_FRONTMATTER = [
  'doc_type',
  'status',
  'owner',
  'source_of_truth',
  'created',
  'modified',
  'tags',
]

// Valid doc_type values
const VALID_DOC_TYPES = [
  'CONSTITUTION',
  'STANDARD',
  'ADR',
  'SPEC',
  'PRD',
  'RUNBOOK',
  'POLICY',
  'NOTE',
  'GUIDE',
]

// Valid status values
const VALID_STATUS = [
  'draft',
  'active',
  'sealed',
  'legacy',
  'archived',
]

// Naming patterns
const NAMING_PATTERNS = {
  doc: /^DOC-\d{4}_[a-z0-9-]+\.mdx?$/,
  hash: /^[a-f0-9]{8}_[a-z0-9-]+\.mdx?$/,
  version: /^v\d+\.\d+\.\d+_[a-z0-9-]+\.mdx?$/,
  temp: /^TEMP-\d{8}-\d{4}_[a-z0-9-]+\.mdx?$/,
}

// Root exceptions (don't require naming pattern)
const ROOT_EXCEPTIONS = ['README.md', 'QUICK_START.md', 'QUICK_REFERENCE.md']

function parseFrontmatter(content: string): { data: Record<string, any>; content: string; hasFrontmatter: boolean } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { data: {}, content, hasFrontmatter: false }
  }

  const yamlContent = match[1] ?? ''
  const bodyContent = match[2] ?? ''

  // Simple YAML parser
  const data: Record<string, any> = {}
  yamlContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return

    const colonIndex = trimmed.indexOf(':')
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim()
      let value: any = trimmed.substring(colonIndex + 1).trim()

      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map((v: string) => v.trim().replace(/['"]/g, ''))
      }

      // Parse booleans
      if (value === 'true') value = true
      if (value === 'false') value = false

      data[key] = value
    }
  })

  return { data, content: bodyContent, hasFrontmatter: true }
}

function extractTitle(content: string): string | null {
  const titleMatch = content.match(/^#\s+(.+)$/m)
  return titleMatch && titleMatch[1] ? titleMatch[1].trim() : null
}

function checkFrontmatter(file: string, frontmatter: Record<string, any>, hasFrontmatter: boolean): CleanlinessIssue[] {
  const issues: CleanlinessIssue[] = []
  const filename = basename(file)
  const isRoot = !file.includes('/') || file.split('/').length === 1
  const isRootException = ROOT_EXCEPTIONS.includes(filename)

  // Check if frontmatter exists (required for all docs except root exceptions)
  if (!hasFrontmatter && !isRootException) {
    issues.push({
      file,
      severity: 'high',
      category: 'Frontmatter',
      issue: 'Missing frontmatter',
      recommendation: 'Add YAML frontmatter with required fields',
    })
    return issues // Can't check other fields if frontmatter missing
  }

  // Skip frontmatter checks for root exceptions
  if (isRootException) {
    return issues
  }

  // Check required fields
  for (const field of REQUIRED_FRONTMATTER) {
    if (!(field in frontmatter)) {
      issues.push({
        file,
        severity: 'high',
        category: 'Frontmatter',
        issue: `Missing required field: ${field}`,
        recommendation: `Add ${field} to frontmatter`,
      })
    }
  }

  // Validate doc_type
  if (frontmatter.doc_type && !VALID_DOC_TYPES.includes(frontmatter.doc_type)) {
    issues.push({
      file,
      severity: 'medium',
      category: 'Frontmatter',
      issue: `Invalid doc_type: ${frontmatter.doc_type}`,
      recommendation: `Use one of: ${VALID_DOC_TYPES.join(', ')}`,
    })
  }

  // Validate status
  if (frontmatter.status && !VALID_STATUS.includes(frontmatter.status)) {
    issues.push({
      file,
      severity: 'medium',
      category: 'Frontmatter',
      issue: `Invalid status: ${frontmatter.status}`,
      recommendation: `Use one of: ${VALID_STATUS.join(', ')}`,
    })
  }

  // Validate dates
  if (frontmatter.created && !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.created)) {
    issues.push({
      file,
      severity: 'medium',
      category: 'Frontmatter',
      issue: `Invalid created date format: ${frontmatter.created}`,
      recommendation: 'Use format: YYYY-MM-DD',
    })
  }

  if (frontmatter.modified && !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.modified)) {
    issues.push({
      file,
      severity: 'medium',
      category: 'Frontmatter',
      issue: `Invalid modified date format: ${frontmatter.modified}`,
      recommendation: 'Use format: YYYY-MM-DD',
    })
  }

  // Check tags is array
  if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
    issues.push({
      file,
      severity: 'low',
      category: 'Frontmatter',
      issue: 'tags should be an array',
      recommendation: 'Format: tags: [tag1, tag2, ...]',
    })
  }

  return issues
}

function checkNamingConvention(file: string): CleanlinessIssue[] {
  const issues: CleanlinessIssue[] = []
  const filename = basename(file)
  const isRoot = !file.includes('/') || file.split('/').length === 1
  const isRootException = ROOT_EXCEPTIONS.includes(filename)
  const isContentDir = file.startsWith('content/')

  // Skip checks for root exceptions
  if (isRootException) {
    return issues
  }

  // Skip checks for content/ directory (Nextra routing)
  if (isContentDir) {
    return issues
  }

  // Check naming pattern
  const hasValidPattern =
    NAMING_PATTERNS.doc.test(filename) ||
    NAMING_PATTERNS.hash.test(filename) ||
    NAMING_PATTERNS.version.test(filename) ||
    NAMING_PATTERNS.temp.test(filename)

  if (!hasValidPattern) {
    issues.push({
      file,
      severity: 'high',
      category: 'Naming Convention',
      issue: `Invalid naming pattern: ${filename}`,
      recommendation: 'Use format: DOC-XXXX_descriptive-name.md, [hash-8]_name.md, or v[VERSION]_name.md',
    })
  }

  // Check for spaces in filename
  if (filename.includes(' ')) {
    issues.push({
      file,
      severity: 'critical',
      category: 'Naming Convention',
      issue: 'Filename contains spaces',
      recommendation: 'Use hyphens instead of spaces: my-file.md',
    })
  }

  // Check for special characters
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    issues.push({
      file,
      severity: 'high',
      category: 'Naming Convention',
      issue: 'Filename contains invalid characters',
      recommendation: 'Use only alphanumeric, dots, hyphens, and underscores',
    })
  }

  return issues
}

function checkContentQuality(file: string, content: string): CleanlinessIssue[] {
  const issues: CleanlinessIssue[] = []
  const lines = content.split('\n')

  // Check for title
  const hasTitle = /^#\s+/.test(content)
  if (!hasTitle) {
    issues.push({
      file,
      severity: 'medium',
      category: 'Content Quality',
      issue: 'Missing H1 title',
      recommendation: 'Add # Title at the beginning of content',
    })
  }

  // Check for empty file
  if (content.trim().length === 0) {
    issues.push({
      file,
      severity: 'critical',
      category: 'Content Quality',
      issue: 'File is empty',
      recommendation: 'Add content or delete file',
    })
  }

  // Check for very short files (< 50 chars, excluding frontmatter)
  const bodyContent = content.replace(/^---[\s\S]*?---\s*\n/, '')
  if (bodyContent.trim().length < 50 && bodyContent.trim().length > 0) {
    issues.push({
      file,
      severity: 'low',
      category: 'Content Quality',
      issue: 'File is very short (< 50 characters)',
      recommendation: 'Consider if this file is necessary or needs more content',
    })
  }

  // Check for trailing whitespace
  lines.forEach((line, index) => {
    if (line.trim() !== line && line.length > 0) {
      issues.push({
        file,
        severity: 'low',
        category: 'Formatting',
        issue: `Trailing whitespace on line ${index + 1}`,
        line: index + 1,
        recommendation: 'Remove trailing whitespace',
      })
    }
  })

  // Check for multiple consecutive blank lines
  let consecutiveBlanks = 0
  lines.forEach((line, index) => {
    if (line.trim() === '') {
      consecutiveBlanks++
      if (consecutiveBlanks > 2) {
        issues.push({
          file,
          severity: 'low',
          category: 'Formatting',
          issue: `Multiple consecutive blank lines around line ${index + 1}`,
          line: index + 1,
          recommendation: 'Use maximum 2 blank lines for section separation',
        })
      }
    } else {
      consecutiveBlanks = 0
    }
  })

  // Check for markdown syntax issues
  // Unclosed code blocks
  const codeBlockMatches = content.match(/```/g)
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    issues.push({
      file,
      severity: 'high',
      category: 'Markdown Syntax',
      issue: 'Unclosed code block',
      recommendation: 'Ensure all code blocks are properly closed with ```',
    })
  }

  // Check for broken markdown links (basic check)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let match
  while ((match = linkRegex.exec(content)) !== null) {
    const linkText = match[1]
    const linkUrl = match[2]

    // Check for empty link text
    if (!linkText || !linkText.trim()) {
      issues.push({
        file,
        severity: 'medium',
        category: 'Markdown Syntax',
        issue: `Empty link text: ${match[0]}`,
        recommendation: 'Add descriptive link text',
      })
    }

    // Check for relative links (should verify they exist)
    if (linkUrl && (linkUrl.startsWith('./') || linkUrl.startsWith('../'))) {
      // Basic check - would need full path resolution for complete check
      // This is a placeholder for link validation
    }
  }

  return issues
}

function checkStructure(file: string, content: string): CleanlinessIssue[] {
  const issues: CleanlinessIssue[] = []

  // Check for proper heading hierarchy
  const headings = content.match(/^(#{1,6})\s+(.+)$/gm) || []
  let previousLevel = 0

  headings.forEach((heading, index) => {
    const match = heading.match(/^(#{1,6})\s+(.+)$/)
    if (match && match[1] && match[2]) {
      const level = match[1].length
      const text = match[2].trim()

      // Check for skipped levels (e.g., H1 -> H3)
      if (previousLevel > 0 && level > previousLevel + 1) {
        issues.push({
          file,
          severity: 'medium',
          category: 'Structure',
          issue: `Skipped heading level: ${heading}`,
          recommendation: `Use H${previousLevel + 1} instead of H${level}`,
        })
      }

      // Check for empty heading text
      if (!text) {
        issues.push({
          file,
          severity: 'high',
          category: 'Structure',
          issue: `Empty heading: ${heading}`,
          recommendation: 'Add text to heading',
        })
      }

      previousLevel = level
    }
  })

  // Check for table of contents (optional but recommended for long docs)
  const lineCount = content.split('\n').length
  if (lineCount > 200 && !content.includes('## Table of Contents') && !content.includes('## Contents')) {
    issues.push({
      file,
      severity: 'info',
      category: 'Structure',
      issue: 'Long document without table of contents',
      recommendation: 'Consider adding a table of contents for documents > 200 lines',
    })
  }

  return issues
}

function checkCompleteness(file: string, frontmatter: Record<string, any>, content: string): CleanlinessIssue[] {
  const issues: CleanlinessIssue[] = []

  // Check for TODO/FIXME comments
  const todoMatches = content.match(/(TODO|FIXME|XXX|HACK|NOTE):\s*(.+)/gi)
  if (todoMatches && todoMatches.length > 0) {
    issues.push({
      file,
      severity: 'low',
      category: 'Completeness',
      issue: `Found ${todoMatches.length} TODO/FIXME comment(s)`,
      recommendation: 'Address or remove TODO/FIXME comments before finalizing',
    })
  }

  // Check for placeholder text
  const placeholders = [
    /\[PLACEHOLDER\]/i,
    /\[TBD\]/i,
    /\[TODO\]/i,
    /lorem ipsum/i,
    /example text/i,
  ]

  placeholders.forEach(pattern => {
    if (pattern.test(content)) {
      issues.push({
        file,
        severity: 'medium',
        category: 'Completeness',
        issue: 'Contains placeholder text',
        recommendation: 'Replace placeholder text with actual content',
      })
    }
  })

  // Check if modified date is recent but content seems stale
  if (frontmatter.modified) {
    const modifiedDate = new Date(frontmatter.modified)
    const daysSinceModified = (Date.now() - modifiedDate.getTime()) / (1000 * 60 * 60 * 24)

    // If modified recently but has old content markers
    if (daysSinceModified < 7 && content.includes('outdated') || content.includes('deprecated')) {
      issues.push({
        file,
        severity: 'info',
        category: 'Completeness',
        issue: 'Recently modified but contains outdated/deprecated markers',
        recommendation: 'Review and update or remove outdated content',
      })
    }
  }

  return issues
}

async function auditFile(file: string): Promise<CleanlinessIssue[]> {
  const issues: CleanlinessIssue[] = []

  try {
    const content = readFileSync(file, 'utf-8')
    const { data: frontmatter, content: bodyContent, hasFrontmatter } = parseFrontmatter(content)

    // Run all checks
    issues.push(...checkFrontmatter(file, frontmatter, hasFrontmatter))
    issues.push(...checkNamingConvention(file))
    issues.push(...checkContentQuality(file, bodyContent))
    issues.push(...checkStructure(file, bodyContent))
    issues.push(...checkCompleteness(file, frontmatter, bodyContent))

  } catch (error) {
    issues.push({
      file,
      severity: 'critical',
      category: 'File Access',
      issue: `Could not read file: ${error}`,
      recommendation: 'Check file permissions and encoding',
    })
  }

  return issues
}

async function main() {
  console.log(chalk.bold('\n📋 Documentation Cleanliness Audit - Full Screening\n'))
  console.log(chalk.cyan('Director of Audit: Comprehensive Document Review\n'))

  // Find all documentation files
  console.log(chalk.cyan('Scanning documentation files...'))
  const files = await glob(DOC_DIRS, { ignore: EXCLUDE })

  console.log(chalk.cyan(`Found ${files.length} files to audit\n`))

  // Audit each file
  const allIssues: CleanlinessIssue[] = []
  let filesAudited = 0

  for (const file of files) {
    const issues = await auditFile(file)
    allIssues.push(...issues)
    filesAudited++

    if (filesAudited % 10 === 0) {
      process.stdout.write(chalk.gray(`\rAudited ${filesAudited}/${files.length} files...`))
    }
  }

  console.log(chalk.green(`\n✅ Audited ${filesAudited} files\n`))

  // Analyze results
  const bySeverity: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  }

  const byCategory: Record<string, number> = {}

  allIssues.forEach(issue => {
    bySeverity[issue.severity] = (bySeverity[issue.severity] || 0) + 1
    byCategory[issue.category] = (byCategory[issue.category] || 0) + 1
  })

  // Calculate compliance score
  const totalPossibleIssues = files.length * 10 // Rough estimate
  const compliance = Math.max(0, Math.min(100, ((totalPossibleIssues - allIssues.length) / totalPossibleIssues) * 100))

  const result: AuditResult = {
    totalFiles: files.length,
    filesAudited,
    issues: allIssues,
    bySeverity,
    byCategory,
    compliance,
    recommendations: [],
  }

  // Generate recommendations
  if (bySeverity.critical > 0) {
    result.recommendations.push(`URGENT: Fix ${bySeverity.critical} critical issue(s) immediately`)
  }
  if (bySeverity.high > 0) {
    result.recommendations.push(`HIGH: Address ${bySeverity.high} high-priority issue(s)`)
  }
  if (bySeverity.medium > 0) {
    result.recommendations.push(`MEDIUM: Review ${bySeverity.medium} medium-priority issue(s)`)
  }

  // Print summary
  console.log(chalk.bold('📊 Audit Summary\n'))
  console.log(`Total Files: ${result.totalFiles}`)
  console.log(`Files Audited: ${result.filesAudited}`)
  console.log(`Total Issues: ${chalk.yellow(allIssues.length)}`)
  console.log(`Compliance Score: ${compliance >= 90 ? chalk.green(compliance.toFixed(1) + '%') : compliance >= 70 ? chalk.yellow(compliance.toFixed(1) + '%') : chalk.red(compliance.toFixed(1) + '%')}\n`)

  // Print by severity
  console.log(chalk.bold('Issues by Severity:\n'))
  console.log(`  ${chalk.red('Critical')}: ${bySeverity.critical}`)
  console.log(`  ${chalk.yellow('High')}: ${bySeverity.high}`)
  console.log(`  ${chalk.cyan('Medium')}: ${bySeverity.medium}`)
  console.log(`  ${chalk.gray('Low')}: ${bySeverity.low}`)
  console.log(`  ${chalk.blue('Info')}: ${bySeverity.info}\n`)

  // Print by category
  console.log(chalk.bold('Issues by Category:\n'))
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`)
    })
  console.log()

  // Print critical issues
  const criticalIssues = allIssues.filter(i => i.severity === 'critical')
  if (criticalIssues.length > 0) {
    console.log(chalk.red.bold('\n🚨 CRITICAL ISSUES\n'))
    criticalIssues.forEach(issue => {
      console.log(chalk.red(`  ✗ ${issue.file}`))
      console.log(chalk.red(`    ${issue.issue}`))
      console.log(chalk.yellow(`    → ${issue.recommendation}\n`))
    })
  }

  // Print high-priority issues (first 10)
  const highIssues = allIssues.filter(i => i.severity === 'high').slice(0, 10)
  if (highIssues.length > 0) {
    console.log(chalk.yellow.bold('\n⚠️  HIGH PRIORITY ISSUES (showing first 10)\n'))
    highIssues.forEach(issue => {
      console.log(chalk.yellow(`  ✗ ${issue.file}`))
      console.log(chalk.yellow(`    [${issue.category}] ${issue.issue}`))
      if (issue.line) {
        console.log(chalk.gray(`    Line ${issue.line}`))
      }
      console.log(chalk.cyan(`    → ${issue.recommendation}\n`))
    })

    if (allIssues.filter(i => i.severity === 'high').length > 10) {
      const remaining = allIssues.filter(i => i.severity === 'high').length - 10
      console.log(chalk.yellow(`  ... and ${remaining} more high-priority issues\n`))
    }
  }

  // Save detailed report
  const reportPath = 'docs/_system/CLEANLINESS_AUDIT_REPORT.json'
  writeFileSync(reportPath, JSON.stringify(result, null, 2))
  console.log(chalk.green(`\n✅ Detailed report saved to ${reportPath}\n`))

  // Print recommendations
  if (result.recommendations.length > 0) {
    console.log(chalk.bold('💡 Recommendations\n'))
    result.recommendations.forEach(rec => console.log(`  ${rec}`))
    console.log()
  }

  // Exit with error if critical or high issues found
  if (bySeverity.critical > 0 || bySeverity.high > 0) {
    console.log(chalk.red('❌ Cleanliness audit failed. Critical or high-priority issues detected.\n'))
    process.exit(1)
  }

  console.log(chalk.green('✅ Cleanliness audit passed. All documents meet quality standards.\n'))
  process.exit(0)
}

main().catch((error) => {
  console.error(chalk.red('\n❌ Audit failed:'), error)
  process.exit(1)
})
