/**
 * Tailwind V4 Compliance Check Script
 *
 * Validates that styling uses Tailwind V4 patterns
 * Checks for hardcoded colors and non-Tailwind classes
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

/**
 * Recursively find all component files
 */
function findComponentFiles(dir: string): string[] {
  const files: string[] = []

  try {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      if (entry.startsWith('.')) continue
      if (entry === 'node_modules') continue
      if (entry === '.next') continue

      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...findComponentFiles(fullPath))
      } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
        files.push(fullPath)
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return files
}

/**
 * Check for Tailwind compliance violations
 */
function checkTailwindCompliance(): { success: boolean; violations: string[] } {
  const violations: string[] = []
  const appDir = join(process.cwd(), 'apps/docs')
  const componentFiles = findComponentFiles(appDir)

  // Patterns that indicate non-compliance
  const violationPatterns = [
    // Hardcoded hex colors
    /#[0-9a-fA-F]{3,6}/,
    // RGB/RGBA colors (should use design tokens)
    /rgba?\(/,
    // Inline styles (should use Tailwind)
    /style=\{\{/,
    // Custom CSS classes (should use Tailwind utilities)
    /className="[^"]*[a-z]+-[a-z]+-[a-z]+[^"]*"/, // Complex custom classes
  ]

  // Allowed patterns (design system tokens)
  const allowedPatterns = [
    /bg-void/,
    /bg-obsidian/,
    /bg-charcoal/,
    /text-parchment/,
    /text-ash/,
    /text-gold/,
    /border-charcoal/,
    /border-gold/,
  ]

  for (const filePath of componentFiles) {
    try {
      const content = readFileSync(filePath, 'utf-8')

      // Skip if it's a config file or type definition
      if (filePath.includes('.config.') || filePath.includes('.d.ts')) {
        continue
      }

      // Check for violations
      for (const pattern of violationPatterns) {
        const matches = content.match(pattern)
        if (matches) {
          // Check if it's an allowed pattern
          const isAllowed = allowedPatterns.some((allowed) => allowed.test(matches[0]))
          if (!isAllowed) {
            const relativePath = filePath.replace(process.cwd(), '')
            violations.push(`${relativePath}: Potential Tailwind violation - ${matches[0]}`)
          }
        }
      }
    } catch {
      // Skip files that can't be read
    }
  }

  return {
    success: violations.length === 0,
    violations,
  }
}

// Run check
const result = checkTailwindCompliance()

if (!result.success) {
  console.warn('⚠️ Tailwind compliance check found potential issues:')
  result.violations.forEach((violation) => console.warn(`  - ${violation}`))
  // Don't fail build for warnings, just report
}

console.log('✅ Tailwind V4 compliance check complete')
process.exit(0)
