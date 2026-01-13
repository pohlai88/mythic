#!/usr/bin/env tsx
/**
 * Token Truth Validation Script
 *
 * Validates that apps comply with Design System Token Constitution.
 * Checks for:
 * - Duplicate tokens (conflicts with axis-theme.css)
 * - Override of core tokens
 * - Duplicate base styles (conflicts with axis-base.css)
 * - Duplicate utilities (conflicts with axis-base.css)
 *
 * Usage: pnpm validate:token-truth
 */

import { readFileSync, readdirSync, statSync } from "fs"
import { join, relative } from "path"

const ROOT = join(process.cwd())
const DESIGN_SYSTEM = join(ROOT, "packages/TailwindCSS-V4/Design-System/src/tokens")
const APPS = join(ROOT, "apps")

interface Violation {
  file: string
  line: number
  type: "CRITICAL" | "ERROR" | "WARNING" | "INFO"
  message: string
  action: string
}

const violations: Violation[] = []

// Read token files
const axisTheme = readFileSync(join(DESIGN_SYSTEM, "axis-theme.css"), "utf-8")
const axisBase = readFileSync(join(DESIGN_SYSTEM, "axis-base.css"), "utf-8")

// Extract tokens from axis-theme.css
const themeTokens = new Set<string>()
const themeTokenLines: Record<string, number> = {}

axisTheme.split("\n").forEach((line, index) => {
  const tokenMatch = line.match(/--([\w-]+):/)
  if (tokenMatch) {
    const token = tokenMatch[1]
    themeTokens.add(token)
    themeTokenLines[token] = index + 1
  }
})

// Extract base styles and utilities from axis-base.css
const baseSelectors = new Set<string>()
const utilityClasses = new Set<string>()

axisBase.split("\n").forEach((line) => {
  // Base layer selectors
  const baseMatch = line.match(/@layer base\s*\{[\s\S]*?([\w\s,]+)\s*\{/)
  if (baseMatch) {
    baseSelectors.add(baseMatch[1].trim())
  }

  // Utility classes
  const utilMatch = line.match(/\.([\w-]+)\s*\{/)
  if (utilMatch) {
    utilityClasses.add(utilMatch[1])
  }
})

// Find all globals.css files in apps
function findGlobalsFiles(dir: string): string[] {
  const files: string[] = []

  try {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...findGlobalsFiles(fullPath))
      } else if (entry === "globals.css") {
        files.push(fullPath)
      }
    }
  } catch (err) {
    // Directory doesn't exist or can't be read
  }

  return files
}

const globalsFiles = findGlobalsFiles(APPS)

// Validate each globals.css file
for (const file of globalsFiles) {
  const content = readFileSync(file, "utf-8")
  const lines = content.split("\n")
  const relativePath = relative(ROOT, file)

  // Check for duplicate tokens (report dark mode overrides as INFO)
  let inDarkMode = false
  let braceDepth = 0
  let themeLayerDepth = 0
  const darkModeOverrides: Array<{ token: string; line: number }> = []

  lines.forEach((line, index) => {
    // Track @layer theme blocks
    if (line.includes("@layer theme")) {
      themeLayerDepth = 1
      braceDepth = 0
    }

    // Track .dark blocks (must be within @layer theme)
    if (themeLayerDepth > 0 && line.includes(".dark") && line.includes("{")) {
      inDarkMode = true
    }

    // Track brace depth
    const openBraces = (line.match(/\{/g) || []).length
    const closeBraces = (line.match(/\}/g) || []).length
    braceDepth += openBraces - closeBraces

    // Exit dark mode when .dark block closes (brace depth returns to theme layer level)
    if (inDarkMode && braceDepth <= 0) {
      inDarkMode = false
    }

    // Exit theme layer when @layer theme block closes
    if (themeLayerDepth > 0 && braceDepth <= 0) {
      themeLayerDepth = 0
      inDarkMode = false
    }

    // Check for duplicate tokens
    const tokenMatch = line.match(/--([\w-]+):/)
    if (tokenMatch) {
      const token = tokenMatch[1]
      if (themeTokens.has(token)) {
        if (inDarkMode) {
          // Report dark mode overrides as INFO (visible, but allowed)
          darkModeOverrides.push({ token, line: index + 1 })
        } else {
          // Report duplicates outside dark mode as CRITICAL
          violations.push({
            file: relativePath,
            line: index + 1,
            type: "CRITICAL",
            message: `Duplicate token: --${token} already defined in axis-theme.css:${themeTokenLines[token]}`,
            action:
              "Remove duplicate, use import from axis-theme.css instead (dark mode overrides allowed in .dark scope)",
          })
        }
      }
    }
  })

  // Report dark mode overrides as INFO (truth visible, not hidden)
  if (darkModeOverrides.length > 0) {
    darkModeOverrides.forEach(({ token, line }) => {
      violations.push({
        file: relativePath,
        line: line,
        type: "INFO",
        message: `Dark mode override: --${token} (allowed in .dark scope, but overrides axis-theme.css:${themeTokenLines[token]})`,
        action:
          "This is allowed per constitution (scoped exception), but documented for transparency",
      })
    })
  }

  // Check for correct imports
  const hasAxisTheme = content.includes('@import "@mythic/design-system/tokens/axis-theme.css"')
  const hasAxisBase = content.includes('@import "@mythic/design-system/tokens/axis-base.css"')
  const hasOldTheme = content.includes('@import "@mythic/design-system/tokens/theme.css"')
  const hasOldApex = content.includes('@import "@mythic/design-system/tokens/apex-base.css"')

  if (!hasAxisTheme && !hasOldTheme) {
    violations.push({
      file: relativePath,
      line: 1,
      type: "ERROR",
      message: "Missing import: axis-theme.css",
      action: 'Add: @import "@mythic/design-system/tokens/axis-theme.css";',
    })
  }

  if (!hasAxisBase && !hasOldApex) {
    violations.push({
      file: relativePath,
      line: 1,
      type: "WARNING",
      message: "Missing import: axis-base.css",
      action: 'Add: @import "@mythic/design-system/tokens/axis-base.css";',
    })
  }

  if (hasOldTheme) {
    violations.push({
      file: relativePath,
      line: content.indexOf("theme.css"),
      type: "ERROR",
      message: "Using deprecated theme.css (renamed to axis-theme.css)",
      action: 'Update to: @import "@mythic/design-system/tokens/axis-theme.css";',
    })
  }

  if (hasOldApex) {
    violations.push({
      file: relativePath,
      line: content.indexOf("apex-base.css"),
      type: "ERROR",
      message: "Using deprecated apex-base.css (renamed to axis-base.css)",
      action: 'Update to: @import "@mythic/design-system/tokens/axis-base.css";',
    })
  }

  // Check for old apex references
  if (content.includes("apex") || content.includes("Apex") || content.includes("APEX")) {
    const apexLines = lines
      .map((line, index) => ({ line, index: index + 1 }))
      .filter(({ line }) => line.includes("apex") || line.includes("Apex") || line.includes("APEX"))

    apexLines.forEach(({ line, index }) => {
      violations.push({
        file: relativePath,
        line: index,
        type: "WARNING",
        message: `Found "apex" reference (should be "axis"): ${line.trim()}`,
        action: 'Replace "apex" with "axis" throughout the file',
      })
    })
  }

  // Check for hardcoded colors (hex, rgb, rgba) - should use tokens
  const hardcodedColorPatterns = [
    /#[0-9a-fA-F]{3,6}/g, // Hex colors
    /rgb\([^)]+\)/g, // RGB colors
    /rgba\([^)]+\)/g, // RGBA colors
  ]

  lines.forEach((line, index) => {
    // Skip comments and strings that are clearly documentation
    if (
      line.trim().startsWith("/*") ||
      line.trim().startsWith("*") ||
      line.trim().startsWith("//")
    ) {
      return
    }

    // Skip if in dark mode (already reported as INFO)
    // We'll check this more carefully
    let isInComment = false
    let commentStart = line.indexOf("/*")
    let commentEnd = line.indexOf("*/")
    if (commentStart !== -1 && (commentEnd === -1 || commentEnd < commentStart)) {
      isInComment = true
    }

    if (!isInComment) {
      hardcodedColorPatterns.forEach((pattern) => {
        const matches = line.match(pattern)
        if (matches) {
          // Check if it's in a comment
          const commentIndex = line.indexOf("/*")
          matches.forEach((match) => {
            const matchIndex = line.indexOf(match)
            if (commentIndex === -1 || matchIndex < commentIndex) {
              // Not in comment - this is a violation
              violations.push({
                file: relativePath,
                line: index + 1,
                type: "WARNING",
                message: `Hardcoded color found: ${match} (should use design system tokens)`,
                action: "Replace with token from axis-theme.css (e.g., hsl(var(--color-gold)))",
              })
            }
          })
        }
      })
    }
  })

  // Check for duplicate base styles (compare with axis-base.css)
  const baseStylePattern = /@layer base\s*\{/
  if (baseStylePattern.test(content)) {
    // Extract selectors from base layer
    const baseLayerMatch = content.match(/@layer base\s*\{([\s\S]*?)\}/)
    if (baseLayerMatch) {
      const baseContent = baseLayerMatch[1]
      const selectors = baseContent.match(/([a-z0-9\s,:#.\[\]()]+)\s*\{/g)
      if (selectors) {
        selectors.forEach((selector) => {
          const cleanSelector = selector.replace(/\s*\{$/, "").trim()
          // Check if this selector exists in axis-base.css
          if (
            axisBase.includes(cleanSelector) &&
            !cleanSelector.includes("::") &&
            !cleanSelector.includes(":")
          ) {
            violations.push({
              file: relativePath,
              line: content.indexOf(cleanSelector),
              type: "WARNING",
              message: `Base style selector "${cleanSelector}" may duplicate axis-base.css`,
              action: "Review if this duplicates base styles - consider using import instead",
            })
          }
        })
      }
    }
  }

  // Check for duplicate utilities (compare with axis-base.css)
  const utilityPattern = /@layer utilities\s*\{/
  if (utilityPattern.test(content)) {
    const utilityLayerMatch = content.match(/@layer utilities\s*\{([\s\S]*?)\}/)
    if (utilityLayerMatch) {
      const utilityContent = utilityLayerMatch[1]
      const appUtilityMatches = utilityContent.match(/\.([\w-]+)\s*\{/g)
      if (appUtilityMatches) {
        appUtilityMatches.forEach((util) => {
          const className = util.replace(/^\./, "").replace(/\s*\{$/, "")
          if (utilityClasses.has(className)) {
            violations.push({
              file: relativePath,
              line: content.indexOf(util),
              type: "WARNING",
              message: `Utility class ".${className}" may duplicate axis-base.css`,
              action: "Review if this duplicates utilities - consider using import instead",
            })
          }
        })
      }
    }
  }
}

// Report violations
const critical = violations.filter((v) => v.type === "CRITICAL")
const errors = violations.filter((v) => v.type === "ERROR")
const warnings = violations.filter((v) => v.type === "WARNING")
const info = violations.filter((v) => v.type === "INFO")
const hasBlocking = critical.length > 0 || errors.length > 0

if (violations.length === 0) {
  console.log("✅ Token Truth Validation: PASSED")
  console.log("   No violations found. All apps comply with Design System Token Constitution.")
  process.exit(0)
} else if (!hasBlocking) {
  // Only INFO/WARNING - show but don't block
  console.log("✅ Token Truth Validation: PASSED (with informational notes)")
  if (info.length > 0) {
    console.log(`\nℹ️  INFORMATIONAL (${info.length}):`)
    info.forEach((v) => {
      console.log(`   ${v.file}:${v.line}`)
      console.log(`   ${v.message}`)
      console.log(`   ${v.action}\n`)
    })
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`)
    warnings.forEach((v) => {
      console.log(`   ${v.file}:${v.line}`)
      console.log(`   ${v.message}`)
      console.log(`   ${v.action}\n`)
    })
  }
  console.log(
    `\n📊 Summary: 0 critical, 0 errors, ${warnings.length} warnings, ${info.length} info`
  )
  console.log("✅ No blocking violations. Commit allowed.")
  process.exit(0)
} else {
  console.error("❌ Token Truth Validation: FAILED")
  console.error(`   Found ${violations.length} violation(s):\n`)

  if (critical.length > 0) {
    console.error("🔴 CRITICAL VIOLATIONS (Blocks commit):")
    critical.forEach((v) => {
      console.error(`   ${v.file}:${v.line}`)
      console.error(`   ${v.message}`)
      console.error(`   Action: ${v.action}\n`)
    })
  }

  if (errors.length > 0) {
    console.error("❌ ERRORS (Blocks commit):")
    errors.forEach((v) => {
      console.error(`   ${v.file}:${v.line}`)
      console.error(`   ${v.message}`)
      console.error(`   Action: ${v.action}\n`)
    })
  }

  if (warnings.length > 0) {
    console.error("⚠️  WARNINGS:")
    warnings.forEach((v) => {
      console.error(`   ${v.file}:${v.line}`)
      console.error(`   ${v.message}`)
      console.error(`   Action: ${v.action}\n`)
    })
  }

  if (info.length > 0) {
    console.error("ℹ️  INFO:")
    info.forEach((v) => {
      console.error(`   ${v.file}:${v.line}`)
      console.error(`   ${v.message}`)
      console.error(`   Action: ${v.action}\n`)
    })
  }

  console.error(
    `\n📊 Summary: ${critical.length} critical, ${errors.length} errors, ${warnings.length} warnings, ${info.length} info`
  )

  if (hasBlocking) {
    console.error("\n❌ Commit blocked. Fix violations and retry.")
    process.exit(1)
  } else {
    console.error("\n⚠️  Warnings found. Review and fix when possible.")
    process.exit(0)
  }
}
