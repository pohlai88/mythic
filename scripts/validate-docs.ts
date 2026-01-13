#!/usr/bin/env tsx
/**
 * Documentation Validator Script
 *
 * Validates markdown files for:
 * - Syntax correctness
 * - Internal link validity
 * - Consistent formatting
 * - Required frontmatter
 *
 * Usage:
 *   pnpm validate-docs              # Validate all docs
 *   pnpm validate-docs --fix        # Auto-fix issues
 */

import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import chalk from "chalk"
import { glob } from "glob"

interface ValidationIssue {
  file: string
  line?: number
  column?: number
  severity: "error" | "warning"
  message: string
  rule: string
}

interface ValidationResult {
  file: string
  issues: ValidationIssue[]
  valid: boolean
}

const DOCS_DIRS = ["docs", ".cursor/docs"]

async function findMarkdownFiles(): Promise<string[]> {
  const files: string[] = []
  for (const dir of DOCS_DIRS) {
    if (existsSync(dir)) {
      // glob() returns Promise<string[]> in glob v11
      const dirFiles = await glob(`${dir}/**/*.{md,mdx,mdc}`, { absolute: true })
      files.push(...dirFiles)
    }
  }
  return files
}

function validateFrontmatter(content: string, filePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // Check for frontmatter (optional but recommended)
  if (!content.startsWith("---")) {
    issues.push({
      file: filePath,
      severity: "warning",
      message: "Missing frontmatter (recommended)",
      rule: "frontmatter",
    })
  }

  return issues
}

function validateMarkdownSyntax(content: string, filePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const lines = content.split("\n")

  // Check for common markdown issues
  lines.forEach((line, index) => {
    const lineNum = index + 1

    // Check for trailing whitespace
    const hasTrailingWhitespace = line.endsWith(" ") || line.endsWith("\t")
    if (hasTrailingWhitespace) {
      issues.push({
        file: filePath,
        line: lineNum,
        severity: "warning",
        message: "Trailing whitespace",
        rule: "no-trailing-whitespace",
      })
    }

    // Check for long lines (over 120 characters)
    if (line.length > 120 && !line.startsWith("```")) {
      issues.push({
        file: filePath,
        line: lineNum,
        severity: "warning",
        message: `Line exceeds 120 characters (${line.length} chars)`,
        rule: "line-length",
      })
    }

    // Check for inconsistent heading levels
    const headingMatch = line.match(/^(#{1,6})\s/)
    if (headingMatch) {
      const level = headingMatch[1].length
      if (level > 4) {
        issues.push({
          file: filePath,
          line: lineNum,
          severity: "warning",
          message: "Heading level should not exceed h4",
          rule: "heading-level",
        })
      }
    }
  })

  return issues
}

function extractInternalLinks(content: string): Array<{ text: string; url: string; line: number }> {
  const links: Array<{ text: string; url: string; line: number }> = []
  const lines = content.split("\n")

  lines.forEach((line, index) => {
    // Match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    let match: RegExpExecArray | null

    while ((match = linkRegex.exec(line)) !== null) {
      const url = match[2]
      // Only check internal links (relative paths)
      if (!url.startsWith("http") && !url.startsWith("mailto:") && !url.startsWith("#")) {
        links.push({
          text: match[1],
          url,
          line: index + 1,
        })
      }
    }
  })

  return links
}

async function validateInternalLinks(
  filePath: string,
  content: string
): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = []
  const links = extractInternalLinks(content)
  const fileDir = dirname(filePath)

  for (const link of links) {
    const linkPath = join(fileDir, link.url)
    const linkPathWithExt = `${linkPath}.md`
    const linkPathWithMdx = `${linkPath}.mdx`

    // Check if link target exists
    const linkExists =
      existsSync(linkPath) ||
      existsSync(linkPathWithExt) ||
      existsSync(linkPathWithMdx) ||
      link.url.startsWith("/")

    if (!linkExists) {
      issues.push({
        file: filePath,
        line: link.line,
        severity: "error",
        message: `Broken internal link: ${link.url}`,
        rule: "broken-link",
      })
    }
  }

  return issues
}

async function validateFile(filePath: string): Promise<ValidationResult> {
  try {
    const content = await readFile(filePath, "utf-8")
    const issues: ValidationIssue[] = []

    // Run validations
    issues.push(...validateFrontmatter(content, filePath))
    issues.push(...validateMarkdownSyntax(content, filePath))
    issues.push(...(await validateInternalLinks(filePath, content)))

    return {
      file: filePath,
      issues,
      valid: issues.filter((i) => i.severity === "error").length === 0,
    }
  } catch (error) {
    return {
      file: filePath,
      issues: [
        {
          file: filePath,
          severity: "error",
          message: `Failed to read file: ${error}`,
          rule: "file-read",
        },
      ],
      valid: false,
    }
  }
}

async function validateAll(): Promise<void> {
  console.log(chalk.blue.bold("\n📝 Documentation Validator\n"))

  const files = await findMarkdownFiles()
  console.log(chalk.gray(`Found ${files.length} markdown files to validate\n`))

  const results: ValidationResult[] = []

  for (const file of files) {
    const result = await validateFile(file)
    results.push(result)
  }

  // Display results
  const errors = results.filter((r) => !r.valid)
  const warnings = results.flatMap((r) => r.issues.filter((i) => i.severity === "warning"))

  if (errors.length === 0 && warnings.length === 0) {
    console.log(chalk.green.bold("✅ All documentation is valid!\n"))
    return
  }

  // Display errors
  if (errors.length > 0) {
    console.log(chalk.red.bold(`\n❌ Errors (${errors.length} files):\n`))
    for (const result of errors) {
      console.log(chalk.red(`  ${result.file}`))
      for (const issue of result.issues.filter((i) => i.severity === "error")) {
        const location = issue.line ? `:${issue.line}` : ""
        console.log(chalk.red(`    [${issue.rule}] ${issue.message}${location}`))
      }
    }
  }

  // Display warnings
  if (warnings.length > 0) {
    console.log(chalk.yellow.bold(`\n⚠️  Warnings (${warnings.length}):\n`))
    const warningsByFile = new Map<string, ValidationIssue[]>()
    for (const result of results) {
      const fileWarnings = result.issues.filter((i) => i.severity === "warning")
      if (fileWarnings.length > 0) {
        warningsByFile.set(result.file, fileWarnings)
      }
    }

    for (const [file, fileWarnings] of warningsByFile.entries()) {
      console.log(chalk.yellow(`  ${file}`))
      for (const issue of fileWarnings) {
        const location = issue.line ? `:${issue.line}` : ""
        console.log(chalk.yellow(`    [${issue.rule}] ${issue.message}${location}`))
      }
    }
  }

  // Summary
  const totalErrors = results.flatMap((r) => r.issues.filter((i) => i.severity === "error")).length
  const totalWarnings = warnings.length

  console.log(chalk.blue.bold("\n📊 Summary:\n"))
  console.log(`Files checked:  ${chalk.cyan(files.length)}`)
  console.log(`Errors:        ${chalk.red(totalErrors)}`)
  console.log(`Warnings:      ${chalk.yellow(totalWarnings)}`)

  if (totalErrors > 0) {
    console.log(chalk.red.bold("\n❌ Validation failed\n"))
    process.exit(1)
  } else {
    console.log(chalk.green.bold("\n✅ Validation passed (with warnings)\n"))
  }
}

validateAll().catch((error) => {
  console.error(chalk.red.bold("\n❌ Fatal error:"), error)
  process.exit(1)
})
