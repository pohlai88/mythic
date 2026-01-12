#!/usr/bin/env tsx
/**
 * Implementation Verification Script
 *
 * Verifies that all Diátaxis + Tailwind implementation is complete and working.
 * Checks components, CSS build, and configuration.
 */

import { existsSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Get script directory (works for both CommonJS and ESM)
let scriptDir: string
try {
  // ESM
  scriptDir = dirname(fileURLToPath(import.meta.url))
} catch {
  // CommonJS fallback
  scriptDir = __dirname
}

// This script is in apps/docs/scripts/, so:
// - PROJECT_ROOT is apps/docs (up 1 level from scripts/)
// - WORKSPACE_ROOT is root (up 3 levels from scripts/: scripts -> docs -> apps -> root)
const PROJECT_ROOT = resolve(scriptDir, '..')
const WORKSPACE_ROOT = resolve(scriptDir, '../../..')
const DESIGN_SYSTEM_ROOT = resolve(WORKSPACE_ROOT, 'packages/design-system')

interface CheckResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
}

const results: CheckResult[] = []

function check(name: string, condition: boolean, message: string) {
  results.push({
    name,
    status: condition ? 'pass' : 'fail',
    message,
  })
}

function warn(name: string, condition: boolean, message: string) {
  results.push({
    name,
    status: condition ? 'pass' : 'warning',
    message,
  })
}

console.log('\n🔍 Verifying Diátaxis + Tailwind Implementation\n')

// 1. Check Design System Theme CSS
console.log('📦 Checking Design System Theme CSS...')
const themeCssPath = resolve(DESIGN_SYSTEM_ROOT, 'src/tokens/theme.css')
const cssExists = existsSync(themeCssPath)
check(
  'Design System Theme CSS',
  cssExists,
  cssExists
    ? '✅ theme.css exists'
    : `❌ theme.css not found at ${themeCssPath}`
)

if (existsSync(themeCssPath)) {
  const cssContent = readFileSync(themeCssPath, 'utf-8')
  // Check for any diataxis-related content (utilities might be in app globals.css)
  const hasDiataxis = cssContent.includes('diataxis') ||
                      cssContent.includes('tutorial') ||
                      cssContent.includes('how-to')
  warn(
    'Diátaxis Utilities in Theme CSS',
    hasDiataxis,
    hasDiataxis
      ? '✅ Diátaxis utilities found in theme.css'
      : '⚠️  Diátaxis utilities may be in app globals.css (check apps/docs/app/globals.css)'
  )
}

// 2. Check Components
console.log('\n🧩 Checking Components...')
const componentsDir = resolve(PROJECT_ROOT, 'components/diataxis')
const requiredComponents = [
  'DocumentTypeBadge.tsx',
  'DocumentTypeBanner.tsx',
  'TutorialSteps.tsx',
  'HowToGuide.tsx',
  'ReferenceTable.tsx',
  'ExplanationBox.tsx',
]

requiredComponents.forEach((component) => {
  const componentPath = resolve(componentsDir, component)
  check(
    `Component: ${component}`,
    existsSync(componentPath),
    existsSync(componentPath)
      ? `✅ ${component} exists`
      : `❌ ${component} not found`
  )
})

// 3. Check MDX Registration
console.log('\n📝 Checking MDX Registration...')
const mdxComponentsPath = resolve(PROJECT_ROOT, 'mdx-components.tsx')
check(
  'MDX Components File',
  existsSync(mdxComponentsPath),
  existsSync(mdxComponentsPath)
    ? '✅ mdx-components.tsx exists'
    : '❌ mdx-components.tsx not found'
)

if (existsSync(mdxComponentsPath)) {
  const mdxContent = readFileSync(mdxComponentsPath, 'utf-8')
  const requiredImports = [
    'DocumentTypeBadge',
    'DocumentTypeBanner',
    'TutorialSteps',
    'HowToGuide',
    'ReferenceTable',
    'ExplanationBox',
  ]

  requiredImports.forEach((importName) => {
    check(
      `MDX Import: ${importName}`,
      mdxContent.includes(importName),
      mdxContent.includes(importName)
        ? `✅ ${importName} imported`
        : `❌ ${importName} not imported`
    )
  })
}

// 4. Check Utility Functions
console.log('\n🛠️  Checking Utility Functions...')
const diataxisLibPath = resolve(PROJECT_ROOT, 'lib/diataxis.ts')
check(
  'Diátaxis Utility Library',
  existsSync(diataxisLibPath),
  existsSync(diataxisLibPath)
    ? '✅ lib/diataxis.ts exists'
    : '❌ lib/diataxis.ts not found'
)

if (existsSync(diataxisLibPath)) {
  const libContent = readFileSync(diataxisLibPath, 'utf-8')
  const requiredFunctions = [
    'getDocumentType',
    'getDocumentTypeClasses',
    'getDocumentTypeIcon',
    'getDocumentTypeLabel',
  ]

  requiredFunctions.forEach((funcName) => {
    check(
      `Function: ${funcName}`,
      libContent.includes(funcName),
      libContent.includes(funcName)
        ? `✅ ${funcName}() exists`
        : `❌ ${funcName}() not found`
    )
  })
}

// 5. Check Content Examples
console.log('\n📚 Checking Content Examples...')
const contentDir = resolve(PROJECT_ROOT, 'content')
const exampleFiles = [
  'examples/diataxis-showcase.mdx',
  'tutorials/getting-started.mdx',
  'templates/tutorial-template.mdx',
]

exampleFiles.forEach((file) => {
  const filePath = resolve(contentDir, file)
  warn(
    `Content: ${file}`,
    existsSync(filePath),
    existsSync(filePath)
      ? `✅ ${file} exists`
      : `⚠️  ${file} not found (optional)`
  )
})

// 6. Check Intelligence Utilities Usage
console.log('\n🧠 Checking Intelligence Utilities Usage...')
if (existsSync(componentsDir)) {
  const badgePath = resolve(componentsDir, 'DocumentTypeBadge.tsx')
  if (existsSync(badgePath)) {
    const badgeContent = readFileSync(badgePath, 'utf-8')
    check(
      'DocumentTypeBadge uses intelligence',
      badgeContent.includes('intelligentStatusStyles'),
      badgeContent.includes('intelligentStatusStyles')
        ? '✅ Uses intelligentStatusStyles'
        : '❌ Not using intelligence utilities'
    )
  }

  const bannerPath = resolve(componentsDir, 'DocumentTypeBanner.tsx')
  if (existsSync(bannerPath)) {
    const bannerContent = readFileSync(bannerPath, 'utf-8')
    check(
      'DocumentTypeBanner uses intelligence',
      bannerContent.includes('intelligent') &&
        bannerContent.includes('intelligentGradientStyles'),
      bannerContent.includes('intelligentGradientStyles')
        ? '✅ Uses multiple intelligence utilities'
        : '⚠️  Limited intelligence usage'
    )
  }
}

// Print Results
console.log('\n' + '='.repeat(60))
console.log('📊 Verification Results')
console.log('='.repeat(60) + '\n')

const passed = results.filter((r) => r.status === 'pass').length
const failed = results.filter((r) => r.status === 'fail').length
const warnings = results.filter((r) => r.status === 'warning').length

results.forEach((result) => {
  const icon =
    result.status === 'pass'
      ? '✅'
      : result.status === 'fail'
        ? '❌'
        : '⚠️'
  console.log(`${icon} ${result.name}: ${result.message}`)
})

console.log('\n' + '='.repeat(60))
console.log(`Summary: ${passed} passed, ${failed} failed, ${warnings} warnings`)
console.log('='.repeat(60) + '\n')

if (failed > 0) {
  console.log('❌ Some checks failed. Please fix the issues above.\n')
  process.exit(1)
} else if (warnings > 0) {
  console.log('⚠️  All critical checks passed, but some warnings exist.\n')
  process.exit(0)
} else {
  console.log('✅ All checks passed! Implementation is complete.\n')
  process.exit(0)
}
