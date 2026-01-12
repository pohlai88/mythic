/**
 * Validate Docs App Dependencies
 *
 * Ensures:
 * 1. No Nextra dependencies (UI conflicts with Tailwind CSS v4)
 * 2. Tailwind CSS v4 only (no v3)
 * 3. Correct PostCSS plugin for Tailwind v4
 *
 * Run: pnpm validate:docs:deps
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const docsPackageJsonPath = join(process.cwd(), 'apps/docs/package.json')

if (!existsSync(docsPackageJsonPath)) {
  console.error('❌ apps/docs/package.json not found')
  process.exit(1)
}

const packageJson = JSON.parse(
  readFileSync(docsPackageJsonPath, 'utf-8')
)

const errors: string[] = []
const warnings: string[] = []

// Check for forbidden Nextra dependencies
const forbiddenDeps = ['nextra', 'nextra-theme-docs']
const allDeps = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
}

for (const dep of forbiddenDeps) {
  if (allDeps[dep]) {
    errors.push(
      `❌ FORBIDDEN dependency found: ${dep}\n` +
      `   Nextra conflicts with Tailwind CSS v4 design system.\n` +
      `   Remove: pnpm remove ${dep}`
    )
  }
}

// Check Tailwind CSS version (must be v4)
const tailwindVersion = allDeps.tailwindcss
if (tailwindVersion) {
  if (!tailwindVersion.startsWith('^4.') && !tailwindVersion.startsWith('4.')) {
    errors.push(
      `❌ Tailwind CSS must be v4, found: ${tailwindVersion}\n` +
      `   Update: pnpm add -D tailwindcss@^4.1.18`
    )
  } else {
    console.log(`✅ Tailwind CSS version: ${tailwindVersion}`)
  }
} else {
  warnings.push('⚠️  tailwindcss not found in dependencies')
}

// Check PostCSS plugin (must be @tailwindcss/postcss for v4)
const postcssPlugin = allDeps['@tailwindcss/postcss']
if (postcssPlugin) {
  if (!postcssPlugin.startsWith('^4.') && !postcssPlugin.startsWith('4.')) {
    errors.push(
      `❌ @tailwindcss/postcss must be v4, found: ${postcssPlugin}\n` +
      `   Update: pnpm add -D @tailwindcss/postcss@^4.1.18`
    )
  } else {
    console.log(`✅ @tailwindcss/postcss version: ${postcssPlugin}`)
  }
} else {
  warnings.push('⚠️  @tailwindcss/postcss not found (required for Tailwind v4)')
}

// Check for old Tailwind v3 PostCSS plugin
if (allDeps['tailwindcss']) {
  // If using @tailwindcss/postcss, should not have autoprefixer/postcss separately
  // This is fine, just checking
}

// Validate next.config.mjs doesn't have Nextra wrapper
const nextConfigPath = join(process.cwd(), 'apps/docs/next.config.mjs')
if (existsSync(nextConfigPath)) {
  const nextConfig = readFileSync(nextConfigPath, 'utf-8')
  if (nextConfig.includes('nextra(') || nextConfig.includes('withNextra')) {
    errors.push(
      `❌ next.config.mjs contains Nextra wrapper\n` +
      `   Remove nextra() wrapper from next.config.mjs`
    )
  } else {
    console.log('✅ next.config.mjs has no Nextra wrapper')
  }
}

// Validate postcss.config.mjs uses @tailwindcss/postcss
const postcssConfigPath = join(process.cwd(), 'apps/docs/postcss.config.mjs')
if (existsSync(postcssConfigPath)) {
  const postcssConfig = readFileSync(postcssConfigPath, 'utf-8')
  if (!postcssConfig.includes("@tailwindcss/postcss")) {
    warnings.push(
      '⚠️  postcss.config.mjs may not be using @tailwindcss/postcss\n' +
      '   Ensure: plugins: { "@tailwindcss/postcss": {} }'
    )
  } else {
    console.log('✅ postcss.config.mjs uses @tailwindcss/postcss')
  }
} else {
  warnings.push('⚠️  postcss.config.mjs not found (may be using default config)')
}

// Report results
console.log('\n' + '='.repeat(60))
if (errors.length > 0) {
  console.error('\n❌ VALIDATION FAILED\n')
  errors.forEach(error => console.error(error))
  console.error('\n' + '='.repeat(60))
  process.exit(1)
}

if (warnings.length > 0) {
  console.warn('\n⚠️  WARNINGS\n')
  warnings.forEach(warning => console.warn(warning))
}

console.log('\n✅ Docs app dependencies validated successfully')
console.log('='.repeat(60))
process.exit(0)
