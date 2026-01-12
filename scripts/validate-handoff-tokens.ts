#!/usr/bin/env tsx
/**
 * Validate Handoff Design Tokens
 *
 * Validates that Handoff tokens are:
 * - Present (all required tokens exist)
 * - Valid format (HSL CSS variables)
 * - Referenced in CSS (CSS variables exist)
 *
 * Provides fallback strategy if validation fails.
 */

import { readFileSync, existsSync } from 'fs'
import { join, resolve } from 'path'

interface TokenValidation {
  valid: boolean
  errors: string[]
  warnings: string[]
  tokens: {
    name: string
    value: string
    valid: boolean
    error?: string
  }[]
}

const REQUIRED_TOKENS = [
  'void',
  'obsidian',
  'parchment',
  'ash',
  'gold',
  'ember',
  'charcoal',
]

// Resolve paths relative to project root
// __dirname in ES modules: use import.meta.url
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Resolve paths relative to project root (scripts directory is in root)
const PROJECT_ROOT = resolve(__dirname, '..')
const TOKEN_FILE = resolve(PROJECT_ROOT, 'packages/design-system/src/tokens/handoff-colors.ts')
const FALLBACK_FILE = resolve(PROJECT_ROOT, 'packages/design-system/src/tokens/fallback.ts')
const CSS_FILE = resolve(PROJECT_ROOT, 'packages/design-system/src/tokens/theme.css')

function loadTokens(filePath: string): Record<string, string> | null {
  if (!existsSync(filePath)) {
    return null
  }

  try {
    const content = readFileSync(filePath, 'utf-8')
    const tokens: Record<string, string> = {}

    // Match Handoff format: void: { value: '#0a0a0b', description: '...' }
    const tokenRegex = /(\w+):\s*\{\s*value:\s*['"]([^'"]+)['"]/g
    let match
    while ((match = tokenRegex.exec(content)) !== null) {
      tokens[match[1]] = match[2]
    }

    return tokens
  } catch (error) {
    console.error(`Error loading tokens from ${filePath}:`, error)
    return null
  }
}

function extractCSSVars(cssPath: string): Set<string> {
  if (!existsSync(cssPath)) {
    return new Set()
  }

  try {
    const content = readFileSync(cssPath, 'utf-8')
    const vars = new Set<string>()

    // Match CSS variable definitions: --color-primary-50: 210 40% 98%;
    const varRegex = /--color-([\w-]+):/g
    let match
    while ((match = varRegex.exec(content)) !== null) {
      vars.add(`--color-${match[1]}`)
    }

    return vars
  } catch (error) {
    console.error(`Error extracting CSS vars from ${cssPath}:`, error)
    return new Set()
  }
}

function validateTokenFormat(value: string): { valid: boolean; error?: string } {
  // Handoff provides HEX format (#0a0a0b)
  // We validate HEX format here, conversion to HSL happens in update-css script
  if (!value.startsWith('#')) {
    return {
      valid: false,
      error: 'Handoff token must be in HEX format: #RRGGBB',
    }
  }

  // Validate HEX format: #RRGGBB (6 hex digits)
  const hexRegex = /^#[0-9A-Fa-f]{6}$/
  if (!hexRegex.test(value)) {
    return {
      valid: false,
      error: 'Invalid HEX format. Expected: #RRGGBB (6 hex digits)',
    }
  }

  return { valid: true }
}

function validateHandoffTokens(): TokenValidation {
  const tokens = loadTokens(TOKEN_FILE)
  const cssVars = extractCSSVars(CSS_FILE)
  const errors: string[] = []
  const warnings: string[] = []
  const tokenResults: TokenValidation['tokens'] = []

  if (!tokens) {
    errors.push(`Token file not found: ${TOKEN_FILE}`)
    return {
      valid: false,
      errors,
      warnings,
      tokens: [],
    }
  }

  // Check 1: All required tokens present
  for (const required of REQUIRED_TOKENS) {
    if (!tokens[required]) {
      errors.push(`Missing required token: ${required}`)
    }
  }

  // Check 2: Validate token format and CSS variable existence
  for (const [name, value] of Object.entries(tokens)) {
    const formatCheck = validateTokenFormat(value)

    if (!formatCheck.valid) {
      errors.push(`Invalid token format for ${name}: ${formatCheck.error}`)
      tokenResults.push({
        name,
        value,
        valid: false,
        error: formatCheck.error,
      })
      continue
    }

    // Check if corresponding CSS variable exists in theme.css
    // Handoff token name maps to CSS variable: void → --color-void
    const cssVarName = `--color-${name}`
    if (!cssVars.has(cssVarName)) {
      warnings.push(`CSS variable missing: ${cssVarName} (for Handoff token ${name})`)
    }

    tokenResults.push({
      name,
      value,
      valid: formatCheck.valid,
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    tokens: tokenResults,
  }
}

function checkFallback(): boolean {
  return existsSync(FALLBACK_FILE)
}

async function main() {
  console.log('\n🎨 Handoff Token Validation\n')

  const validation = validateHandoffTokens()
  const hasFallback = checkFallback()

  // Show relative paths for readability
  const relativeTokenFile = TOKEN_FILE.replace(PROJECT_ROOT + '\\', '').replace(PROJECT_ROOT + '/', '')
  const relativeCssFile = CSS_FILE.replace(PROJECT_ROOT + '\\', '').replace(PROJECT_ROOT + '/', '')
  const relativeFallbackFile = FALLBACK_FILE.replace(PROJECT_ROOT + '\\', '').replace(PROJECT_ROOT + '/', '')

  console.log(`Token File: ${relativeTokenFile}`)
  console.log(`CSS File: ${relativeCssFile}`)
  console.log(`Fallback File: ${hasFallback ? '✅ Exists' : '❌ Missing'}\n`)

  if (validation.errors.length > 0) {
    console.log('❌ Validation Errors:\n')
    validation.errors.forEach(error => {
      console.log(`  - ${error}`)
    })
    console.log('')
  }

  if (validation.warnings.length > 0) {
    console.log('⚠️  Warnings:\n')
    validation.warnings.forEach(warning => {
      console.log(`  - ${warning}`)
    })
    console.log('')
  }

  console.log(`Tokens Validated: ${validation.tokens.length}`)
  console.log(`Valid Tokens: ${validation.tokens.filter(t => t.valid).length}`)
  console.log(`Invalid Tokens: ${validation.tokens.filter(t => !t.valid).length}\n`)

  if (validation.valid) {
    console.log('✅ Token validation passed\n')

    if (!hasFallback) {
      console.log('⚠️  Warning: Fallback tokens file not found')
      console.log('   Consider creating fallback tokens for failure containment\n')
    }

    process.exit(0)
  } else {
    console.log('❌ Token validation failed\n')

    if (hasFallback) {
      console.log('💡 Fallback tokens available - using fallback strategy\n')
    } else {
      console.log('⚠️  No fallback tokens available - build may fail\n')
    }

    process.exit(1)
  }
}

main().catch(error => {
  console.error('Validation error:', error)
  process.exit(1)
})
