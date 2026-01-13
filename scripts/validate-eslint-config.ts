#!/usr/bin/env tsx
/**
 * ESLint Configuration Validation Script
 *
 * Validates ESLint integration with:
 * 1. Prettier
 * 2. TypeScript
 * 3. Markdown
 *
 * Also checks for any ESLint-related packages that are not configured.
 */

import { readFileSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, "..")

interface ValidationResult {
  category: string
  check: string
  status: "✅" | "❌" | "⚠️"
  message: string
  fix?: string
}

const results: ValidationResult[] = []

// Helper to read JSON file
function readJsonFile(path: string): any {
  try {
    const content = readFileSync(path, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}

// Helper to read file as string
function readFile(path: string): string | null {
  try {
    return readFileSync(path, "utf-8")
  } catch (error) {
    return null
  }
}

// Check if file exists
function fileExists(path: string): boolean {
  return existsSync(path)
}

console.log("🔍 Validating ESLint Configuration...\n")

// ============================================================================
// 1. PRETTIER INTEGRATION
// ============================================================================

console.log("📋 Checking Prettier Integration...")

const packageJson = readJsonFile(join(rootDir, "package.json"))
const eslintConfig = readFile(join(rootDir, "eslint.config.mjs"))
const eslintTypedConfig = readFile(join(rootDir, "eslint.typed.config.mjs"))

// Check if prettier package is installed
const prettierInstalled =
  packageJson?.devDependencies?.prettier || packageJson?.dependencies?.prettier
if (prettierInstalled) {
  results.push({
    category: "Prettier",
    check: "Prettier package installed",
    status: "✅",
    message: `Prettier ${prettierInstalled} is installed`,
  })
} else {
  results.push({
    category: "Prettier",
    check: "Prettier package installed",
    status: "❌",
    message: "Prettier package is NOT installed",
    fix: "Run: pnpm add -D prettier",
  })
}

// Check if eslint-config-prettier is installed
const prettierConfigInstalled = packageJson?.devDependencies?.["eslint-config-prettier"]
if (prettierConfigInstalled) {
  results.push({
    category: "Prettier",
    check: "eslint-config-prettier installed",
    status: "✅",
    message: `eslint-config-prettier ${prettierConfigInstalled} is installed`,
  })
} else {
  results.push({
    category: "Prettier",
    check: "eslint-config-prettier installed",
    status: "❌",
    message: "eslint-config-prettier is NOT installed",
    fix: "Run: pnpm add -D eslint-config-prettier",
  })
}

// Check if prettier is imported in ESLint config
if (eslintConfig?.includes("eslint-config-prettier") || eslintConfig?.includes("prettier")) {
  results.push({
    category: "Prettier",
    check: "Prettier integrated in ESLint config",
    status: "✅",
    message: "Prettier is imported and used in eslint.config.mjs",
  })
} else {
  results.push({
    category: "Prettier",
    check: "Prettier integrated in ESLint config",
    status: "❌",
    message: "Prettier is NOT imported in eslint.config.mjs",
    fix: "Add: import prettier from 'eslint-config-prettier' and include it in config array",
  })
}

// Check if prettier config file exists
const prettierConfigFiles = [
  ".prettierrc",
  ".prettierrc.json",
  ".prettierrc.js",
  ".prettierrc.mjs",
  ".prettierrc.cjs",
  "prettier.config.js",
  "prettier.config.mjs",
  "prettier.config.cjs",
]

const prettierConfigExists = prettierConfigFiles.some((file) => fileExists(join(rootDir, file)))
if (prettierConfigExists) {
  const foundFile = prettierConfigFiles.find((file) => fileExists(join(rootDir, file)))
  results.push({
    category: "Prettier",
    check: "Prettier config file exists",
    status: "✅",
    message: `Prettier config found: ${foundFile}`,
  })
} else {
  results.push({
    category: "Prettier",
    check: "Prettier config file exists",
    status: "⚠️",
    message: "No Prettier config file found (using defaults)",
    fix: "Create .prettierrc.json with your formatting preferences",
  })
}

// ============================================================================
// 2. TYPESCRIPT INTEGRATION
// ============================================================================

console.log("📋 Checking TypeScript Integration...")

// Check if typescript-eslint is installed
const tsEslintInstalled = packageJson?.devDependencies?.["typescript-eslint"]
if (tsEslintInstalled) {
  results.push({
    category: "TypeScript",
    check: "typescript-eslint installed",
    status: "✅",
    message: `typescript-eslint ${tsEslintInstalled} is installed`,
  })
} else {
  results.push({
    category: "TypeScript",
    check: "typescript-eslint installed",
    status: "❌",
    message: "typescript-eslint is NOT installed",
    fix: "Run: pnpm add -D typescript-eslint",
  })
}

// Check if TypeScript is installed
const typescriptInstalled =
  packageJson?.devDependencies?.typescript || packageJson?.dependencies?.typescript
if (typescriptInstalled) {
  results.push({
    category: "TypeScript",
    check: "TypeScript package installed",
    status: "✅",
    message: `TypeScript ${typescriptInstalled} is installed`,
  })
} else {
  results.push({
    category: "TypeScript",
    check: "TypeScript package installed",
    status: "❌",
    message: "TypeScript is NOT installed",
    fix: "Run: pnpm add -D typescript",
  })
}

// Check if TypeScript ESLint is configured in base config
if (eslintConfig?.includes("typescript-eslint") || eslintConfig?.includes("tseslint")) {
  results.push({
    category: "TypeScript",
    check: "TypeScript ESLint in base config",
    status: "✅",
    message: "TypeScript ESLint is configured in eslint.config.mjs",
  })
} else {
  // Check if it's in typed config
  if (eslintTypedConfig?.includes("typescript-eslint") || eslintTypedConfig?.includes("tseslint")) {
    results.push({
      category: "TypeScript",
      check: "TypeScript ESLint in typed config",
      status: "✅",
      message: "TypeScript ESLint is configured in eslint.typed.config.mjs",
    })
  } else {
    results.push({
      category: "TypeScript",
      check: "TypeScript ESLint configured",
      status: "❌",
      message: "TypeScript ESLint is NOT configured in either config file",
      fix: "Add typescript-eslint configuration to eslint.config.mjs or eslint.typed.config.mjs",
    })
  }
}

// Check if typed config exists
if (fileExists(join(rootDir, "eslint.typed.config.mjs"))) {
  results.push({
    category: "TypeScript",
    check: "Typed ESLint config exists",
    status: "✅",
    message: "eslint.typed.config.mjs exists for type-checked linting",
  })
} else {
  results.push({
    category: "TypeScript",
    check: "Typed ESLint config exists",
    status: "⚠️",
    message: "eslint.typed.config.mjs not found (optional, for CI/type-checked linting)",
  })
}

// ============================================================================
// 3. MARKDOWN INTEGRATION
// ============================================================================

console.log("📋 Checking Markdown Integration...")

// Check if @eslint/markdown is installed
const markdownPluginInstalled =
  packageJson?.devDependencies?.["@eslint/markdown"] ||
  packageJson?.devDependencies?.["eslint-plugin-markdown"]
if (markdownPluginInstalled) {
  results.push({
    category: "Markdown",
    check: "ESLint Markdown plugin installed",
    status: "✅",
    message: `ESLint Markdown plugin is installed`,
  })
} else {
  results.push({
    category: "Markdown",
    check: "ESLint Markdown plugin installed",
    status: "⚠️",
    message: "ESLint Markdown plugin is NOT installed (using markdownlint-cli2 instead)",
    fix: "Run: pnpm add -D @eslint/markdown (optional if using markdownlint-cli2)",
  })
}

// Check if markdown is configured in ESLint
if (
  eslintConfig?.includes("@eslint/markdown") ||
  eslintConfig?.includes("eslint-plugin-markdown") ||
  eslintConfig?.includes("markdown")
) {
  results.push({
    category: "Markdown",
    check: "Markdown configured in ESLint",
    status: "✅",
    message: "Markdown is configured in ESLint config",
  })
} else {
  // Check if markdownlint-cli2 is used instead
  const lintstaged = readJsonFile(join(rootDir, ".lintstagedrc.json"))
  if (lintstaged?.["*.{md,mdx,mdc}"]?.some((cmd: string) => cmd.includes("markdownlint"))) {
    results.push({
      category: "Markdown",
      check: "Markdown linting configured",
      status: "✅",
      message: "Markdown linting configured via markdownlint-cli2 in .lintstagedrc.json",
    })
  } else {
    results.push({
      category: "Markdown",
      check: "Markdown configured in ESLint",
      status: "⚠️",
      message: "Markdown is NOT configured in ESLint (using separate markdownlint tool)",
      fix: "Consider adding @eslint/markdown for unified linting or keep markdownlint-cli2",
    })
  }
}

// ============================================================================
// 4. MISSING ESLINT PACKAGES
// ============================================================================

console.log("📋 Checking for Missing ESLint Packages...")

// Check for commented-out plugins in config (these are intentionally commented)
// Only flag if they're actually used in the config (not commented)
const commentedPlugins: string[] = []
if (eslintConfig) {
  const importMatch = eslintConfig.match(/\/\/\s*import\s+(\w+)\s+from\s+["']([^"']+)["']/g)
  if (importMatch) {
    importMatch.forEach((match) => {
      const pluginMatch = match.match(/["']([^"']+)["']/)
      if (pluginMatch) {
        const packageName = pluginMatch[1]
        commentedPlugins.push(packageName)
      }
    })
  }
}

// Check if commented plugins are actually used (not commented) in the config
const actuallyUsedPlugins: string[] = []
commentedPlugins.forEach((plugin) => {
  // Check if plugin is used in non-commented code
  const pluginName = plugin.replace("eslint-plugin-", "").replace("eslint-config-", "")
  const usedPattern = new RegExp(`(?:plugins|extends|rules).*["']${pluginName}["']`, "m")
  const lines = eslintConfig?.split("\n") || []
  let isUsed = false
  for (const line of lines) {
    const trimmed = line.trim()
    // Skip commented lines
    if (trimmed.startsWith("//")) continue
    if (usedPattern.test(line)) {
      isUsed = true
      break
    }
  }
  if (isUsed) {
    const packageInstalled =
      packageJson?.devDependencies?.[plugin] || packageJson?.dependencies?.[plugin]
    if (!packageInstalled) {
      actuallyUsedPlugins.push(plugin)
    }
  }
})

if (commentedPlugins.length > 0 && actuallyUsedPlugins.length === 0) {
  results.push({
    category: "Missing Packages",
    check: "Commented plugins (intentional)",
    status: "✅",
    message: `Found ${commentedPlugins.length} commented plugin(s) - these are intentionally disabled`,
  })
} else if (actuallyUsedPlugins.length > 0) {
  results.push({
    category: "Missing Packages",
    check: "Plugins used but not installed",
    status: "❌",
    message: `Plugins used in config but not installed: ${actuallyUsedPlugins.join(", ")}`,
    fix: `Install missing packages: pnpm add -D ${actuallyUsedPlugins.join(" ")}`,
  })
}

// Check for common ESLint plugins that might be missing (only if actually used, not commented)
const commonPlugins = [
  "eslint-plugin-react",
  "eslint-plugin-react-hooks",
  "eslint-plugin-import",
  "eslint-plugin-jsx-a11y",
]

const missingCommonPlugins: string[] = []
commonPlugins.forEach((plugin) => {
  const installed = packageJson?.devDependencies?.[plugin] || packageJson?.dependencies?.[plugin]
  if (!installed) {
    // Check if it's referenced in config (not commented)
    const pluginName = plugin.replace("eslint-plugin-", "").replace("eslint-config-", "")
    const configs = [eslintConfig, eslintTypedConfig].filter(Boolean)
    for (const config of configs) {
      if (!config) continue
      const lines = config.split("\n")
      let isUsed = false
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmed = line.trim()
        // Skip fully commented lines
        if (trimmed.startsWith("//")) continue

        // Check if plugin is actually used (not just in a comment)
        // Look for plugin name in non-commented code
        const commentIndex = line.indexOf("//")
        const pluginMatch = line.match(new RegExp(`["']${pluginName}["']|${plugin}`, "i"))

        if (pluginMatch) {
          const matchIndex = line.indexOf(pluginMatch[0])
          // If there's a comment, make sure the plugin reference comes before it
          if (commentIndex === -1 || matchIndex < commentIndex) {
            // Also check if the line itself is not part of a commented block
            // Look backwards to see if we're in a commented section
            let inCommentBlock = false
            for (let j = i - 1; j >= 0 && j >= i - 5; j--) {
              const prevLine = lines[j].trim()
              if (prevLine.startsWith("//")) {
                // Check if it's a block comment start
                if (prevLine.includes("Optional") || prevLine.includes("only if")) {
                  inCommentBlock = true
                  break
                }
              }
            }
            if (!inCommentBlock) {
              isUsed = true
              break
            }
          }
        }
      }
      if (isUsed) {
        missingCommonPlugins.push(plugin)
        break
      }
    }
  }
})

if (missingCommonPlugins.length > 0) {
  results.push({
    category: "Missing Packages",
    check: "Referenced plugins not installed",
    status: "❌",
    message: `Plugins referenced in config but not installed: ${missingCommonPlugins.join(", ")}`,
    fix: `Install missing plugins: pnpm add -D ${missingCommonPlugins.join(" ")}`,
  })
} else {
  results.push({
    category: "Missing Packages",
    check: "Referenced plugins check",
    status: "✅",
    message: "All referenced plugins are installed or properly commented out",
  })
}

// ============================================================================
// 5. ESLINT CONFIG FILE VALIDATION
// ============================================================================

console.log("📋 Validating ESLint Config Files...")

// Check if base config exists
if (fileExists(join(rootDir, "eslint.config.mjs"))) {
  results.push({
    category: "Config Files",
    check: "Base ESLint config exists",
    status: "✅",
    message: "eslint.config.mjs exists",
  })
} else {
  results.push({
    category: "Config Files",
    check: "Base ESLint config exists",
    status: "❌",
    message: "eslint.config.mjs does NOT exist",
    fix: "Create eslint.config.mjs with your ESLint configuration",
  })
}

// Check if config uses flat config format (ESLint 9+)
if (eslintConfig?.includes("export default") || eslintConfig?.includes("module.exports")) {
  results.push({
    category: "Config Files",
    check: "Flat config format",
    status: "✅",
    message: "Config uses flat config format (ESLint 9+)",
  })
} else if (eslintConfig) {
  results.push({
    category: "Config Files",
    check: "Flat config format",
    status: "⚠️",
    message: "Config format unclear - ensure it's using flat config for ESLint 9+",
  })
}

// ============================================================================
// OUTPUT RESULTS
// ============================================================================

console.log("\n" + "=".repeat(80))
console.log("📊 VALIDATION RESULTS")
console.log("=".repeat(80) + "\n")

// Group results by category
const groupedResults = results.reduce(
  (acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = []
    }
    acc[result.category].push(result)
    return acc
  },
  {} as Record<string, ValidationResult[]>
)

// Print results by category
Object.entries(groupedResults).forEach(([category, categoryResults]) => {
  console.log(`\n${category}:`)
  console.log("-".repeat(80))
  categoryResults.forEach((result) => {
    console.log(`  ${result.status} ${result.check}`)
    console.log(`     ${result.message}`)
    if (result.fix) {
      console.log(`     💡 Fix: ${result.fix}`)
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

if (failed > 0) {
  console.log("\n❌ Validation FAILED - Please fix the issues above")
  process.exit(1)
} else if (warnings > 0) {
  console.log("\n⚠️  Validation PASSED with warnings - Review recommendations above")
  process.exit(0)
} else {
  console.log("\n✅ Validation PASSED - All checks successful!")
  process.exit(0)
}
