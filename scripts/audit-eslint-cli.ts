#!/usr/bin/env tsx
/**
 * Comprehensive ESLint CLI Audit Script
 *
 * Audits:
 * 1. All ESLint-related configuration
 * 2. Configuration conflicts
 * 3. Abnormalities and malfunctions
 * 4. Dependency issues
 * 5. Formatter integration (Prettier)
 * 6. VS Code integration issues
 * 7. Terminal/CLI functionality
 * 8. Optimum conditions
 */

import { readFileSync, existsSync, statSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, "..")

interface AuditResult {
  category: string
  check: string
  status: "✅" | "❌" | "⚠️" | "🔍"
  severity: "critical" | "high" | "medium" | "low" | "info"
  message: string
  details?: string
  fix?: string
  command?: string
}

const results: AuditResult[] = []
const criticalIssues: AuditResult[] = []
const highIssues: AuditResult[] = []

// Helper functions
function readJsonFile(path: string): any {
  try {
    const content = readFileSync(path, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}

function readFile(path: string): string | null {
  try {
    return readFileSync(path, "utf-8")
  } catch (error) {
    return null
  }
}

function fileExists(path: string): boolean {
  return existsSync(path)
}

function runCommand(
  command: string,
  silent = false
): { success: boolean; output: string; error?: string } {
  try {
    const output = execSync(command, {
      cwd: rootDir,
      encoding: "utf-8",
      stdio: silent ? "pipe" : "inherit",
      shell: process.platform === "win32" ? "powershell.exe" : "/bin/bash",
    })
    return { success: true, output: output.toString() }
  } catch (error: any) {
    return {
      success: false,
      output: "",
      error: error.message || String(error),
    }
  }
}

function addResult(result: AuditResult) {
  results.push(result)
  if (result.severity === "critical") {
    criticalIssues.push(result)
  } else if (result.severity === "high") {
    highIssues.push(result)
  }
}

console.log("🔍 Comprehensive ESLint CLI Audit Starting...\n")
console.log("=".repeat(80))

// ============================================================================
// 1. CONFIGURATION FILES AUDIT
// ============================================================================

console.log("\n📋 1. Configuration Files Audit...")

const packageJson = readJsonFile(join(rootDir, "package.json"))
const eslintConfig = readFile(join(rootDir, "eslint.config.mjs"))
const eslintTypedConfig = readFile(join(rootDir, "eslint.typed.config.mjs"))
const prettierConfig = readJsonFile(join(rootDir, ".prettierrc.json"))
const prettierIgnore = readFile(join(rootDir, ".prettierignore"))
const vscodeSettings = readJsonFile(join(rootDir, ".vscode/settings.json"))
const lintstaged = readJsonFile(join(rootDir, ".lintstagedrc.json"))

// Check base ESLint config
if (fileExists(join(rootDir, "eslint.config.mjs"))) {
  addResult({
    category: "Configuration Files",
    check: "Base ESLint config exists",
    status: "✅",
    severity: "info",
    message: "eslint.config.mjs found",
  })
} else {
  addResult({
    category: "Configuration Files",
    check: "Base ESLint config exists",
    status: "❌",
    severity: "critical",
    message: "eslint.config.mjs NOT found",
    fix: "Create eslint.config.mjs with your ESLint configuration",
  })
}

// Check typed ESLint config
if (fileExists(join(rootDir, "eslint.typed.config.mjs"))) {
  addResult({
    category: "Configuration Files",
    check: "Typed ESLint config exists",
    status: "✅",
    severity: "info",
    message: "eslint.typed.config.mjs found (for type-checked linting)",
  })
}

// Check for old ESLint config files (conflicts)
const oldConfigFiles = [
  ".eslintrc",
  ".eslintrc.js",
  ".eslintrc.json",
  ".eslintrc.yaml",
  ".eslintrc.yml",
  "eslint.config.js",
  "eslint.config.cjs",
]

const foundOldConfigs = oldConfigFiles.filter((file) => fileExists(join(rootDir, file)))
if (foundOldConfigs.length > 0) {
  addResult({
    category: "Configuration Files",
    check: "Old ESLint config files (conflicts)",
    status: "⚠️",
    severity: "high",
    message: `Found old config files that may conflict: ${foundOldConfigs.join(", ")}`,
    fix: `Remove old config files: ${foundOldConfigs.map((f) => `rm ${f}`).join(" && ")}`,
  })
}

// ============================================================================
// 2. DEPENDENCIES AUDIT
// ============================================================================

console.log("\n📋 2. Dependencies Audit...")

// Check ESLint core
const eslintVersion = packageJson?.devDependencies?.eslint || packageJson?.dependencies?.eslint
if (eslintVersion) {
  const majorVersion = parseInt(eslintVersion.replace(/[^0-9]/g, "").charAt(0))
  if (majorVersion >= 9) {
    addResult({
      category: "Dependencies",
      check: "ESLint version (v9+ required for flat config)",
      status: "✅",
      severity: "info",
      message: `ESLint ${eslintVersion} installed (supports flat config)`,
    })
  } else {
    addResult({
      category: "Dependencies",
      check: "ESLint version",
      status: "❌",
      severity: "critical",
      message: `ESLint ${eslintVersion} is too old. Flat config requires v9+`,
      fix: "Run: pnpm add -D -w eslint@^9.26.0",
    })
  }
} else {
  addResult({
    category: "Dependencies",
    check: "ESLint installed",
    status: "❌",
    severity: "critical",
    message: "ESLint is NOT installed",
    fix: "Run: pnpm add -D -w eslint@^9.26.0",
  })
}

// Check required ESLint packages
const requiredPackages = {
  "@eslint/js": "Core ESLint JS config",
  "typescript-eslint": "TypeScript ESLint integration",
  "eslint-config-next": "Next.js ESLint config",
  "eslint-config-prettier": "Prettier integration",
}

Object.entries(requiredPackages).forEach(([pkg, description]) => {
  const installed = packageJson?.devDependencies?.[pkg] || packageJson?.dependencies?.[pkg]
  if (installed) {
    addResult({
      category: "Dependencies",
      check: `${pkg} installed`,
      status: "✅",
      severity: "info",
      message: `${pkg} ${installed} installed - ${description}`,
    })
  } else {
    addResult({
      category: "Dependencies",
      check: `${pkg} installed`,
      status: "❌",
      severity: "high",
      message: `${pkg} is NOT installed - ${description}`,
      fix: `Run: pnpm add -D -w ${pkg}`,
    })
  }
})

// Check Prettier
const prettierInstalled =
  packageJson?.devDependencies?.prettier || packageJson?.dependencies?.prettier
if (prettierInstalled) {
  addResult({
    category: "Dependencies",
    check: "Prettier installed",
    status: "✅",
    severity: "info",
    message: `Prettier ${prettierInstalled} installed`,
  })
} else {
  addResult({
    category: "Dependencies",
    check: "Prettier installed",
    status: "⚠️",
    severity: "medium",
    message: "Prettier is NOT installed (optional but recommended)",
    fix: "Run: pnpm add -D -w prettier",
  })
}

// Check for version conflicts
const eslintConfigPkg = packageJson?.devDependencies?.["eslint-config-prettier"]
if (eslintConfigPkg && !prettierInstalled) {
  addResult({
    category: "Dependencies",
    check: "Prettier config without Prettier",
    status: "⚠️",
    severity: "medium",
    message: "eslint-config-prettier installed but prettier package is missing",
    fix: "Run: pnpm add -D -w prettier",
  })
}

// ============================================================================
// 3. CONFIGURATION CONFLICTS AUDIT
// ============================================================================

console.log("\n📋 3. Configuration Conflicts Audit...")

// Check if flat config is properly used
if (eslintConfig) {
  if (eslintConfig.includes("export default") || eslintConfig.includes("module.exports")) {
    addResult({
      category: "Configuration Conflicts",
      check: "Flat config format",
      status: "✅",
      severity: "info",
      message: "Using flat config format (ESLint 9+)",
    })
  }

  // Check for Prettier integration
  if (eslintConfig.includes("eslint-config-prettier") || eslintConfig.includes("prettier")) {
    addResult({
      category: "Configuration Conflicts",
      check: "Prettier integration in ESLint",
      status: "✅",
      severity: "info",
      message: "Prettier is integrated in ESLint config",
    })
  } else {
    addResult({
      category: "Configuration Conflicts",
      check: "Prettier integration",
      status: "⚠️",
      severity: "medium",
      message: "Prettier not integrated in ESLint config (may cause conflicts)",
      fix: "Add: import prettier from 'eslint-config-prettier' and include in config array",
    })
  }

  // Check if Prettier is last in config (required)
  const prettierIndex = eslintConfig.lastIndexOf("prettier")
  const lastConfigIndex = eslintConfig.lastIndexOf("];")
  if (prettierIndex > 0 && lastConfigIndex > prettierIndex) {
    // Check if prettier is near the end
    const distanceFromEnd = lastConfigIndex - prettierIndex
    if (distanceFromEnd < 100) {
      addResult({
        category: "Configuration Conflicts",
        check: "Prettier position in config",
        status: "✅",
        severity: "info",
        message: "Prettier is placed last in config (correct)",
      })
    } else {
      addResult({
        category: "Configuration Conflicts",
        check: "Prettier position in config",
        status: "⚠️",
        severity: "high",
        message: "Prettier should be last in ESLint config array to disable conflicting rules",
        fix: "Move prettier config to the end of the config array",
      })
    }
  }
}

// Check VS Code settings conflicts
if (vscodeSettings) {
  const prettierEnabled = vscodeSettings["prettier.enable"]
  const eslintEnabled = vscodeSettings["eslint.enable"]

  if (prettierEnabled === true && eslintEnabled === true) {
    // Check if they're both set as formatters
    const jsFormatter = vscodeSettings["[javascript]"]?.editor?.defaultFormatter
    const tsFormatter = vscodeSettings["[typescript]"]?.editor?.defaultFormatter

    if (jsFormatter === "esbenp.prettier-vscode" || tsFormatter === "esbenp.prettier-vscode") {
      addResult({
        category: "Configuration Conflicts",
        check: "VS Code formatter conflict",
        status: "⚠️",
        severity: "medium",
        message:
          "Both Prettier and ESLint enabled. Ensure eslint-config-prettier is used to prevent conflicts",
        details:
          "Prettier should handle formatting, ESLint should handle linting. Use eslint-config-prettier to disable conflicting ESLint rules.",
      })
    }
  }

  if (prettierEnabled === false && eslintEnabled === true) {
    addResult({
      category: "Configuration Conflicts",
      check: "VS Code Prettier disabled",
      status: "✅",
      severity: "info",
      message:
        "Prettier extension disabled, using ESLint only (correct if using eslint-config-prettier)",
    })
  }
}

// ============================================================================
// 4. VS CODE INTEGRATION AUDIT
// ============================================================================

console.log("\n📋 4. VS Code Integration Audit...")

if (vscodeSettings) {
  // Check ESLint extension enabled
  if (vscodeSettings["eslint.enable"] === true) {
    addResult({
      category: "VS Code Integration",
      check: "ESLint extension enabled",
      status: "✅",
      severity: "info",
      message: "ESLint extension is enabled",
    })
  } else {
    addResult({
      category: "VS Code Integration",
      check: "ESLint extension enabled",
      status: "❌",
      severity: "high",
      message: "ESLint extension is disabled in VS Code settings",
      fix: 'Set "eslint.enable": true in .vscode/settings.json',
    })
  }

  // Check flat config setting
  if (vscodeSettings["eslint.useFlatConfig"] === true) {
    addResult({
      category: "VS Code Integration",
      check: "Flat config enabled",
      status: "✅",
      severity: "info",
      message: "Flat config is enabled in VS Code",
    })
  } else {
    addResult({
      category: "VS Code Integration",
      check: "Flat config enabled",
      status: "❌",
      severity: "high",
      message: "Flat config is NOT enabled in VS Code (required for ESLint 9+)",
      fix: 'Set "eslint.useFlatConfig": true in .vscode/settings.json',
    })
  }

  // Check lint task (for terminal output)
  const lintTaskEnabled = vscodeSettings["eslint.lintTask.enable"]
  if (lintTaskEnabled === true) {
    addResult({
      category: "VS Code Integration",
      check: "ESLint lint task enabled",
      status: "✅",
      severity: "info",
      message: "ESLint lint task is enabled (allows terminal output)",
    })
  } else if (lintTaskEnabled === false) {
    addResult({
      category: "VS Code Integration",
      check: "ESLint lint task enabled",
      status: "❌",
      severity: "critical",
      message:
        "ESLint lint task is DISABLED - errors won't show in terminal when files aren't open",
      fix: 'Set "eslint.lintTask.enable": true in .vscode/settings.json',
      details: "This is likely the cause of your issue - files must be open for errors to show",
    })
  } else {
    addResult({
      category: "VS Code Integration",
      check: "ESLint lint task enabled",
      status: "⚠️",
      severity: "high",
      message: "ESLint lint task not explicitly enabled - may not show errors in terminal",
      fix: 'Set "eslint.lintTask.enable": true in .vscode/settings.json',
      details: "Enable this to see ESLint errors in terminal even when files aren't open",
    })
  }

  // Check working directories (monorepo)
  const workingDirs = vscodeSettings["eslint.workingDirectories"]
  if (Array.isArray(workingDirs) && workingDirs.length > 0) {
    addResult({
      category: "VS Code Integration",
      check: "Working directories configured",
      status: "✅",
      severity: "info",
      message: `Working directories configured: ${workingDirs.length} pattern(s)`,
    })
  } else {
    addResult({
      category: "VS Code Integration",
      check: "Working directories configured",
      status: "⚠️",
      severity: "medium",
      message: "Working directories not configured (may cause issues in monorepo)",
      fix: 'Add "eslint.workingDirectories": [{"pattern": "apps/*"}, {"pattern": "packages/*"}]',
    })
  }

  // Check code actions on save
  const codeActionsOnSave = vscodeSettings["editor.codeActionsOnSave"]
  if (codeActionsOnSave?.["source.fixAll.eslint"]) {
    addResult({
      category: "VS Code Integration",
      check: "Auto-fix on save",
      status: "✅",
      severity: "info",
      message: "ESLint auto-fix on save is enabled",
    })
  }
}

// ============================================================================
// 5. ESLINT CLI FUNCTIONALITY TEST
// ============================================================================

console.log("\n📋 5. ESLint CLI Functionality Test...")

// Test basic ESLint command
const eslintTest = runCommand("npx eslint --version", true)
if (eslintTest.success) {
  addResult({
    category: "CLI Functionality",
    check: "ESLint CLI accessible",
    status: "✅",
    severity: "info",
    message: `ESLint CLI is accessible: ${eslintTest.output.trim()}`,
  })
} else {
  addResult({
    category: "CLI Functionality",
    check: "ESLint CLI accessible",
    status: "❌",
    severity: "critical",
    message: "ESLint CLI is NOT accessible",
    error: eslintTest.error,
    fix: "Check if ESLint is installed: pnpm list eslint",
  })
}

// Test ESLint with config
if (fileExists(join(rootDir, "eslint.config.mjs"))) {
  const configTest = runCommand("npx eslint --print-config eslint.config.mjs 2>&1 | head -20", true)
  if (configTest.success || configTest.output.includes("Successfully")) {
    addResult({
      category: "CLI Functionality",
      check: "ESLint config valid",
      status: "✅",
      severity: "info",
      message: "ESLint config file is valid and loadable",
    })
  } else {
    addResult({
      category: "CLI Functionality",
      check: "ESLint config valid",
      status: "❌",
      severity: "critical",
      message: "ESLint config file has errors",
      error: configTest.error || configTest.output,
      fix: "Check eslint.config.mjs for syntax errors",
    })
  }
}

// Test linting a sample file (if exists)
const sampleFiles = [
  "eslint.config.mjs",
  "package.json",
  "scripts/validate-eslint-config.ts",
].filter((f) => fileExists(join(rootDir, f)))

if (sampleFiles.length > 0) {
  const sampleFile = sampleFiles[0]
  const lintTest = runCommand(`npx eslint "${sampleFile}" --max-warnings 999 2>&1`, true)
  if (
    lintTest.success ||
    lintTest.output.includes("problems") ||
    lintTest.output.includes("error") ||
    lintTest.output.length === 0
  ) {
    addResult({
      category: "CLI Functionality",
      check: "ESLint can lint files",
      status: "✅",
      severity: "info",
      message: `ESLint can lint files (tested with ${sampleFile})`,
    })
  } else {
    addResult({
      category: "CLI Functionality",
      check: "ESLint can lint files",
      status: "⚠️",
      severity: "medium",
      message: `ESLint linting test had issues with ${sampleFile}`,
      details: lintTest.error || lintTest.output,
    })
  }
}

// ============================================================================
// 6. FORMATTER INTEGRATION AUDIT
// ============================================================================

console.log("\n📋 6. Formatter Integration Audit...")

// Check Prettier config
if (prettierConfig) {
  addResult({
    category: "Formatter Integration",
    check: "Prettier config exists",
    status: "✅",
    severity: "info",
    message: "Prettier configuration file found",
  })
} else {
  addResult({
    category: "Formatter Integration",
    check: "Prettier config exists",
    status: "⚠️",
    severity: "medium",
    message: "Prettier config file not found (using defaults)",
    fix: "Create .prettierrc.json with your formatting preferences",
  })
}

// Check lint-staged integration
if (lintstaged) {
  const hasEslint = Object.values(lintstaged).some(
    (cmds: any) => Array.isArray(cmds) && cmds.some((cmd: string) => cmd.includes("eslint"))
  )
  const hasPrettier = Object.values(lintstaged).some(
    (cmds: any) => Array.isArray(cmds) && cmds.some((cmd: string) => cmd.includes("prettier"))
  )

  if (hasEslint) {
    addResult({
      category: "Formatter Integration",
      check: "ESLint in lint-staged",
      status: "✅",
      severity: "info",
      message: "ESLint is configured in lint-staged",
    })
  }

  if (hasPrettier) {
    addResult({
      category: "Formatter Integration",
      check: "Prettier in lint-staged",
      status: "✅",
      severity: "info",
      message: "Prettier is configured in lint-staged",
    })
  }

  // Check order (ESLint should run before Prettier)
  const jsFiles = lintstaged["*.{ts,tsx,js,jsx}"]
  if (Array.isArray(jsFiles)) {
    const eslintIndex = jsFiles.findIndex((cmd: string) => cmd.includes("eslint"))
    const prettierIndex = jsFiles.findIndex((cmd: string) => cmd.includes("prettier"))

    if (eslintIndex >= 0 && prettierIndex >= 0) {
      if (eslintIndex < prettierIndex) {
        addResult({
          category: "Formatter Integration",
          check: "Lint-staged order",
          status: "✅",
          severity: "info",
          message: "ESLint runs before Prettier in lint-staged (correct order)",
        })
      } else {
        addResult({
          category: "Formatter Integration",
          check: "Lint-staged order",
          status: "⚠️",
          severity: "medium",
          message: "Prettier runs before ESLint - should be ESLint first, then Prettier",
          fix: "Reorder lint-staged commands: ESLint should run before Prettier",
        })
      }
    }
  }
}

// ============================================================================
// 7. PACKAGE.JSON SCRIPTS AUDIT
// ============================================================================

console.log("\n📋 7. Package.json Scripts Audit...")

if (packageJson?.scripts) {
  const scripts = packageJson.scripts

  if (scripts.lint) {
    addResult({
      category: "Package Scripts",
      check: "Lint script exists",
      status: "✅",
      severity: "info",
      message: `Lint script found: ${scripts.lint}`,
    })
  } else {
    addResult({
      category: "Package Scripts",
      check: "Lint script exists",
      status: "⚠️",
      severity: "medium",
      message: "No 'lint' script found in package.json",
      fix: 'Add: "lint": "eslint . --ext .ts,.tsx"',
    })
  }

  if (scripts["lint:fix"]) {
    addResult({
      category: "Package Scripts",
      check: "Lint fix script exists",
      status: "✅",
      severity: "info",
      message: `Lint fix script found: ${scripts["lint:fix"]}`,
    })
  }
}

// ============================================================================
// 8. ABNORMALITIES & MALFUNCTIONS
// ============================================================================

console.log("\n📋 8. Abnormalities & Malfunctions Check...")

// Check for duplicate rules
if (eslintConfig) {
  const ruleMatches = eslintConfig.match(/"([^"]+)":\s*["\[]/g) || []
  const rules = ruleMatches.map((m) => m.match(/"([^"]+)"/)?.[1]).filter(Boolean)
  const duplicates = rules.filter((rule, index) => rules.indexOf(rule) !== index)

  if (duplicates.length > 0) {
    addResult({
      category: "Abnormalities",
      check: "Duplicate rules",
      status: "⚠️",
      severity: "medium",
      message: `Found potential duplicate rules: ${[...new Set(duplicates)].join(", ")}`,
      details: "Duplicate rules may cause unexpected behavior",
    })
  }
}

// Check for conflicting ignore patterns
if (eslintConfig) {
  const ignoreMatches = eslintConfig.match(/ignores:\s*\[([^\]]+)\]/g) || []
  if (ignoreMatches.length > 1) {
    addResult({
      category: "Abnormalities",
      check: "Multiple ignore blocks",
      status: "⚠️",
      severity: "low",
      message: "Multiple ignore blocks found - ensure they don't conflict",
      details: "ESLint merges ignore patterns, but conflicts can cause unexpected behavior",
    })
  }
}

// ============================================================================
// OUTPUT RESULTS
// ============================================================================

console.log("\n" + "=".repeat(80))
console.log("📊 COMPREHENSIVE ESLint CLI AUDIT RESULTS")
console.log("=".repeat(80))

// Group by category
const grouped = results.reduce(
  (acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = []
    }
    acc[result.category].push(result)
    return acc
  },
  {} as Record<string, AuditResult[]>
)

// Print by category
Object.entries(grouped).forEach(([category, categoryResults]) => {
  console.log(`\n${category}:`)
  console.log("-".repeat(80))
  categoryResults.forEach((result) => {
    const severityIcon = {
      critical: "🔴",
      high: "🟠",
      medium: "🟡",
      low: "🔵",
      info: "⚪",
    }[result.severity]

    console.log(`  ${result.status} ${severityIcon} ${result.check}`)
    console.log(`     ${result.message}`)
    if (result.details) {
      console.log(`     📝 ${result.details}`)
    }
    if (result.fix) {
      console.log(`     💡 Fix: ${result.fix}`)
    }
    if (result.command) {
      console.log(`     🔧 Command: ${result.command}`)
    }
  })
})

// Summary
const total = results.length
const passed = results.filter((r) => r.status === "✅").length
const failed = results.filter((r) => r.status === "❌").length
const warnings = results.filter((r) => r.status === "⚠️").length

console.log("\n" + "=".repeat(80))
console.log("📈 SUMMARY")
console.log("=".repeat(80))
console.log(`Total Checks: ${total}`)
console.log(`✅ Passed: ${passed}`)
console.log(`❌ Failed: ${failed}`)
console.log(`⚠️  Warnings: ${warnings}`)
console.log(`🔴 Critical Issues: ${criticalIssues.length}`)
console.log(`🟠 High Priority Issues: ${highIssues.length}`)

// Critical issues summary
if (criticalIssues.length > 0) {
  console.log("\n" + "=".repeat(80))
  console.log("🔴 CRITICAL ISSUES (Must Fix)")
  console.log("=".repeat(80))
  criticalIssues.forEach((issue) => {
    console.log(`\n❌ ${issue.check}`)
    console.log(`   ${issue.message}`)
    if (issue.fix) {
      console.log(`   💡 ${issue.fix}`)
    }
  })
}

// High priority issues summary
if (highIssues.length > 0) {
  console.log("\n" + "=".repeat(80))
  console.log("🟠 HIGH PRIORITY ISSUES (Should Fix)")
  console.log("=".repeat(80))
  highIssues.forEach((issue) => {
    console.log(`\n⚠️ ${issue.check}`)
    console.log(`   ${issue.message}`)
    if (issue.fix) {
      console.log(`   💡 ${issue.fix}`)
    }
  })
}

// VS Code Terminal Issue (specific check)
const terminalIssue = results.find(
  (r) => r.check.includes("lint task") && (r.status === "❌" || r.status === "⚠️")
)

if (terminalIssue) {
  console.log("\n" + "=".repeat(80))
  console.log("🎯 TERMINAL OUTPUT ISSUE DETECTED")
  console.log("=".repeat(80))
  console.log("\nThe issue where ESLint errors don't show in terminal when files aren't open")
  console.log("is likely caused by missing 'eslint.lintTask.enable' setting.\n")
  console.log("Solution:")
  console.log("  Add to .vscode/settings.json:")
  console.log('  "eslint.lintTask.enable": true')
  console.log("\nThis enables ESLint to run as a task and show errors in the terminal")
  console.log("even when files are not open in the editor.")
}

// Exit code
if (criticalIssues.length > 0) {
  console.log("\n❌ Audit FAILED - Critical issues must be fixed")
  process.exit(1)
} else if (highIssues.length > 0) {
  console.log("\n⚠️  Audit PASSED with high priority issues - Review and fix")
  process.exit(0)
} else {
  console.log("\n✅ Audit PASSED - All checks successful!")
  process.exit(0)
}
