#!/usr/bin/env tsx
/**
 * UX Regression Checker
 *
 * Automated checks for UX regression in the Luxury UX system.
 * Validates frozen patterns, accessibility requirements, and governance compliance.
 *
 * Usage:
 *   pnpm --filter @mythic/straton-hub check:ux-regression
 *
 * @see docs/governance/UX_REGRESSION_CHECKLIST.md
 */

import * as fs from "node:fs"
import * as path from "node:path"
import { glob } from "glob"

const ROOT = path.resolve(__dirname, "..")

interface CheckResult {
  name: string
  passed: boolean
  message: string
  severity: "error" | "warning" | "info"
}

interface RegressionReport {
  passed: boolean
  checks: CheckResult[]
  summary: {
    total: number
    passed: number
    failed: number
    warnings: number
  }
}

/**
 * Check: Reduced motion guard is present in globals.css
 */
async function checkReducedMotion(): Promise<CheckResult> {
  const globalsPath = path.join(ROOT, "app/globals.css")

  if (!fs.existsSync(globalsPath)) {
    return {
      name: "Reduced Motion Guard",
      passed: false,
      message: "globals.css not found",
      severity: "error",
    }
  }

  const content = fs.readFileSync(globalsPath, "utf-8")
  const hasReducedMotion = content.includes("prefers-reduced-motion")

  return {
    name: "Reduced Motion Guard",
    passed: hasReducedMotion,
    message: hasReducedMotion
      ? "prefers-reduced-motion guard is present"
      : "MISSING: prefers-reduced-motion guard in globals.css",
    severity: hasReducedMotion ? "info" : "error",
  }
}

/**
 * Check: Breathing rhythm CSS is present
 */
async function checkBreathingRhythm(): Promise<CheckResult> {
  const globalsPath = path.join(ROOT, "app/globals.css")

  if (!fs.existsSync(globalsPath)) {
    return {
      name: "Breathing Rhythm",
      passed: false,
      message: "globals.css not found",
      severity: "error",
    }
  }

  const content = fs.readFileSync(globalsPath, "utf-8")
  const hasBreathingRhythm =
    content.includes("animation-timeline: scroll()") && content.includes("@keyframes breathe")

  return {
    name: "Breathing Rhythm",
    passed: hasBreathingRhythm,
    message: hasBreathingRhythm
      ? "Breathing rhythm animation is present"
      : "MISSING: Breathing rhythm animation in globals.css",
    severity: hasBreathingRhythm ? "info" : "warning",
  }
}

/**
 * Check: Authority pause CSS is present
 */
async function checkAuthorityPause(): Promise<CheckResult> {
  const globalsPath = path.join(ROOT, "app/globals.css")

  if (!fs.existsSync(globalsPath)) {
    return {
      name: "Authority Pause",
      passed: false,
      message: "globals.css not found",
      severity: "error",
    }
  }

  const content = fs.readFileSync(globalsPath, "utf-8")
  const hasAuthorityPause =
    content.includes("pause-authority") || content.includes("h1:first-child")

  return {
    name: "Authority Pause",
    passed: hasAuthorityPause,
    message: hasAuthorityPause
      ? "Authority pause spacing is present"
      : "MISSING: Authority pause spacing in globals.css",
    severity: hasAuthorityPause ? "info" : "warning",
  }
}

/**
 * Check: Zustand stores are not imported in Server Components
 */
async function checkStoreClientOnly(): Promise<CheckResult> {
  // Find all .tsx files that don't have 'use client'
  const files = await glob("**/*.tsx", {
    cwd: ROOT,
    ignore: ["node_modules/**", ".next/**", "**/*.test.tsx", "store/**"],
  })

  const violations: string[] = []

  for (const file of files) {
    const filePath = path.join(ROOT, file)
    const content = fs.readFileSync(filePath, "utf-8")

    // Check if file imports from store
    const importsStore = content.includes("from '@/store'") || content.includes("from '@/store/")

    if (importsStore) {
      // Check if file has 'use client' directive (can be preceded by comments)
      // The directive must appear before any imports
      const hasUseClient =
        content.includes("'use client'") &&
        content.indexOf("'use client'") < content.indexOf("import ")

      if (!hasUseClient) {
        violations.push(file)
      }
    }
  }

  return {
    name: "Store Client-Only",
    passed: violations.length === 0,
    message:
      violations.length === 0
        ? "All store imports are in client components"
        : `VIOLATION: Store imported in Server Components: ${violations.join(", ")}`,
    severity: violations.length === 0 ? "info" : "error",
  }
}

/**
 * Check: No className props in Shell interfaces
 */
async function checkShellEscapeHatches(): Promise<CheckResult> {
  const shellFiles = await glob("components/shells/*.tsx", { cwd: ROOT })
  const violations: string[] = []

  for (const file of shellFiles) {
    const filePath = path.join(ROOT, file)
    const content = fs.readFileSync(filePath, "utf-8")

    // Check for className or style in interface
    if (content.includes("className?:") || content.includes("style?:")) {
      violations.push(file)
    }
  }

  return {
    name: "Shell Escape Hatches",
    passed: violations.length === 0,
    message:
      violations.length === 0
        ? "No escape hatches in Shell interfaces"
        : `VIOLATION: Escape hatches found in: ${violations.join(", ")}`,
    severity: violations.length === 0 ? "info" : "error",
  }
}

/**
 * Check: Refuse List patterns are not present
 */
async function checkRefuseListPatterns(): Promise<CheckResult> {
  const files = await glob("**/*.tsx", {
    cwd: ROOT,
    ignore: ["node_modules/**", ".next/**"],
  })

  const refusedPatterns = [
    { pattern: /<Toast/g, name: "Toast component" },
    { pattern: /scrollToTop/gi, name: "Scroll to top" },
    { pattern: /<ProgressBar/g, name: "Progress bar" },
    { pattern: /<ShareButton/g, name: "Share button" },
    { pattern: /<Newsletter/gi, name: "Newsletter popup" },
  ]

  const violations: string[] = []

  for (const file of files) {
    const filePath = path.join(ROOT, file)
    const content = fs.readFileSync(filePath, "utf-8")

    for (const { pattern, name } of refusedPatterns) {
      if (pattern.test(content)) {
        violations.push(`${file}: ${name}`)
      }
    }
  }

  return {
    name: "Refuse List Patterns",
    passed: violations.length === 0,
    message:
      violations.length === 0
        ? "No Refuse List patterns detected"
        : `VIOLATION: Refuse List patterns found: ${violations.join(", ")}`,
    severity: violations.length === 0 ? "info" : "warning",
  }
}

/**
 * Check: Quiet links CSS is present
 */
async function checkQuietLinks(): Promise<CheckResult> {
  const globalsPath = path.join(ROOT, "app/globals.css")

  if (!fs.existsSync(globalsPath)) {
    return {
      name: "Quiet Links",
      passed: false,
      message: "globals.css not found",
      severity: "error",
    }
  }

  const content = fs.readFileSync(globalsPath, "utf-8")
  // Look for quiet link styling (underline opacity pattern)
  const hasQuietLinks =
    content.includes("decoration-") && (content.includes("/30") || content.includes("opacity"))

  return {
    name: "Quiet Links",
    passed: hasQuietLinks,
    message: hasQuietLinks
      ? "Quiet links styling is present"
      : "MISSING: Quiet links styling (30% opacity underlines)",
    severity: hasQuietLinks ? "info" : "warning",
  }
}

/**
 * Check: Animation durations are >= 500ms (Rush Veto)
 */
async function checkAnimationDurations(): Promise<CheckResult> {
  const files = await glob("**/*.{css,tsx}", {
    cwd: ROOT,
    ignore: ["node_modules/**", ".next/**"],
  })

  const violations: string[] = []
  const durationRegex = /duration[-:]?\s*(\d+)(ms)?/gi

  for (const file of files) {
    const filePath = path.join(ROOT, file)
    const content = fs.readFileSync(filePath, "utf-8")

    let match
    while ((match = durationRegex.exec(content)) !== null) {
      const durationStr = match[1]
      if (!durationStr) continue
      const duration = parseInt(durationStr, 10)
      // If no 'ms' suffix, assume it's in seconds for Tailwind (e.g., duration-500 = 500ms)
      // But for CSS, 500 without ms would be 500ms
      if (duration < 500 && duration > 0) {
        violations.push(`${file}: ${duration}ms`)
      }
    }
  }

  return {
    name: "Animation Duration (Rush Veto)",
    passed: violations.length === 0,
    message:
      violations.length === 0
        ? "All animations >= 500ms"
        : `WARNING: Short animations found: ${violations.slice(0, 3).join(", ")}${violations.length > 3 ? "..." : ""}`,
    severity: violations.length === 0 ? "info" : "warning",
  }
}

/**
 * Run all regression checks
 */
async function runRegressionChecks(): Promise<RegressionReport> {
  const checks = await Promise.all([
    checkReducedMotion(),
    checkBreathingRhythm(),
    checkAuthorityPause(),
    checkQuietLinks(),
    checkStoreClientOnly(),
    checkShellEscapeHatches(),
    checkRefuseListPatterns(),
    checkAnimationDurations(),
  ])

  const passed = checks.filter((c) => c.passed).length
  const failed = checks.filter((c) => !c.passed && c.severity === "error").length
  const warnings = checks.filter((c) => !c.passed && c.severity === "warning").length

  return {
    passed: failed === 0,
    checks,
    summary: {
      total: checks.length,
      passed,
      failed,
      warnings,
    },
  }
}

/**
 * Format check result for console
 */
function formatCheck(check: CheckResult): string {
  const icon = check.passed ? "✅" : check.severity === "error" ? "❌" : "⚠️"
  return `${icon} ${check.name}: ${check.message}`
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log("╔════════════════════════════════════════════════╗")
  console.log("║         UX REGRESSION CHECKER                  ║")
  console.log("╚════════════════════════════════════════════════╝")
  console.log()

  const report = await runRegressionChecks()

  console.log("📋 CHECKS:")
  console.log()

  for (const check of report.checks) {
    console.log(`   ${formatCheck(check)}`)
  }

  console.log()
  console.log("━".repeat(50))
  console.log()
  console.log(
    `Summary: ${report.summary.passed}/${report.summary.total} passed, ${report.summary.failed} errors, ${report.summary.warnings} warnings`
  )
  console.log()

  if (report.passed) {
    console.log("✅ UX regression check PASSED")
  } else {
    console.log("❌ UX regression check FAILED")
    console.log()
    console.log("See: docs/governance/UX_REGRESSION_CHECKLIST.md for manual review steps")
    process.exit(1)
  }
}

main().catch(console.error)
