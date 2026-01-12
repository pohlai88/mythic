#!/usr/bin/env tsx
/**
 * Next.js Routing Validation Script
 *
 * Validates:
 * - Route file structure
 * - Dynamic route configuration
 * - generateStaticParams implementation
 * - Route parameter handling
 * - Content file mapping
 *
 * Usage:
 *   pnpm validate:routing
 *   tsx scripts/validate-routing.ts
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { glob } from 'glob'

interface RouteValidation {
  route: string
  status: 'valid' | 'invalid' | 'missing'
  issues: string[]
  contentFile?: string
}

interface ValidationResult {
  totalRoutes: number
  validRoutes: number
  invalidRoutes: number
  missingRoutes: number
  routes: RouteValidation[]
  issues: string[]
}

// Resolve paths relative to script location
const SCRIPT_DIR = __dirname
const APP_DIR = join(SCRIPT_DIR, '..')
const APP_APP_DIR = join(APP_DIR, 'app')
const CONTENT_DIR = join(APP_DIR, 'content')

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(60))
  log(title, 'cyan')
  console.log('='.repeat(60))
}

/**
 * Validate route file structure
 */
function validateRouteStructure(): {
  valid: boolean
  issues: string[]
} {
  const issues: string[] = []
  let valid = true

  // Check root layout
  const layoutPath = join(APP_APP_DIR, 'layout.tsx')
  if (!existsSync(layoutPath)) {
    issues.push('Missing root layout.tsx')
    valid = false
  }

  // Check not-found page
  const notFoundPath = join(APP_APP_DIR, 'not-found.tsx')
  if (!existsSync(notFoundPath)) {
    issues.push('Missing not-found.tsx')
    valid = false
  }

  // Check catch-all route
  const catchAllPath = join(APP_APP_DIR, '[[...mdxPath]]', 'page.tsx')
  if (!existsSync(catchAllPath)) {
    issues.push('Missing catch-all route: app/[[...mdxPath]]/page.tsx')
    valid = false
  }

  return { valid, issues }
}

/**
 * Validate catch-all route implementation
 */
function validateCatchAllRoute(): {
  valid: boolean
  issues: string[]
  hasGenerateStaticParams: boolean
  hasGenerateMetadata: boolean
  paramsType: 'promise' | 'direct' | 'unknown'
} {
  const issues: string[] = []
  let valid = true
  let hasGenerateStaticParams = false
  let hasGenerateMetadata = false
  let paramsType: 'promise' | 'direct' | 'unknown' = 'unknown'

  const catchAllPath = join(APP_APP_DIR, '[[...mdxPath]]', 'page.tsx')
  if (!existsSync(catchAllPath)) {
    return { valid: false, issues: ['Catch-all route file not found'], hasGenerateStaticParams: false, hasGenerateMetadata: false, paramsType: 'unknown' }
  }

  const content = readFileSync(catchAllPath, 'utf-8')

  // Check for generateStaticParams
  if (content.includes('generateStaticParams')) {
    hasGenerateStaticParams = true
    // Check if it returns empty array for root
    if (!content.includes('mdxPath: []')) {
      issues.push('generateStaticParams should return { mdxPath: [] } for root route')
      valid = false
    }
  } else {
    issues.push('Missing generateStaticParams function')
    valid = false
  }

  // Check for generateMetadata
  if (content.includes('generateMetadata')) {
    hasGenerateMetadata = true
  }

  // Check params type (Next.js 15+ requires Promise)
  if (content.includes('params: Promise<')) {
    paramsType = 'promise'
    // Check if params are awaited
    if (!content.includes('await props.params') && !content.includes('await params')) {
      issues.push('Params Promise must be awaited in Next.js 15+')
      valid = false
    }
  } else if (content.includes('params: {')) {
    paramsType = 'direct'
    issues.push('Params should be Promise<{ mdxPath?: string[] }> in Next.js 15+')
    valid = false
  }

  // Check for notFound() import
  if (!content.includes("from 'next/navigation'") && !content.includes('from "next/navigation"')) {
    issues.push('Missing notFound import from next/navigation')
    valid = false
  }

  return { valid, issues, hasGenerateStaticParams, hasGenerateMetadata, paramsType }
}

/**
 * Validate content files and route mapping
 */
async function validateContentMapping(): Promise<ValidationResult> {
  const routes: RouteValidation[] = []
  const issues: string[] = []

  // Get all MDX files
  const mdxFiles = glob.sync('**/*.mdx', { cwd: CONTENT_DIR })

  // Check root route (home.mdx)
  const homePath = join(CONTENT_DIR, 'home.mdx')
  if (existsSync(homePath)) {
    routes.push({
      route: '/',
      status: 'valid',
      issues: [],
      contentFile: 'home.mdx',
    })
  } else {
    routes.push({
      route: '/',
      status: 'missing',
      issues: ['Missing content/home.mdx for root route'],
    })
    issues.push('Missing content/home.mdx')
  }

  // Validate all MDX files
  for (const file of mdxFiles) {
    if (file === 'home.mdx') continue // Already handled

    const route = file
      .replace(/\.mdx$/, '')
      .replace(/\/index$/, '')
      .split('/')
      .filter(Boolean)

    const routePath = '/' + route.join('/')
    const filePath = join(CONTENT_DIR, file)

    if (existsSync(filePath)) {
      routes.push({
        route: routePath,
        status: 'valid',
        issues: [],
        contentFile: file,
      })
    } else {
      routes.push({
        route: routePath,
        status: 'missing',
        issues: [`Missing content file: ${file}`],
      })
      issues.push(`Missing content file: ${file}`)
    }
  }

  const validRoutes = routes.filter((r) => r.status === 'valid').length
  const invalidRoutes = routes.filter((r) => r.status === 'invalid').length
  const missingRoutes = routes.filter((r) => r.status === 'missing').length

  return {
    totalRoutes: routes.length,
    validRoutes,
    invalidRoutes,
    missingRoutes,
    routes,
    issues,
  }
}

/**
 * Validate generateStaticParams output
 */
async function validateStaticParams(): Promise<{
  valid: boolean
  issues: string[]
  params: Array<{ mdxPath?: string[] }>
}> {
  const issues: string[] = []
  let params: Array<{ mdxPath?: string[] }> = []

  try {
    // Dynamically import and execute generateStaticParams
    const catchAllPath = join(APP_APP_DIR, '[[...mdxPath]]', 'page.tsx')
    const content = readFileSync(catchAllPath, 'utf-8')

    // Extract generateStaticParams function
    // This is a simplified check - in production, you'd use a proper AST parser
    if (!content.includes('generateStaticParams')) {
      issues.push('generateStaticParams function not found')
      return { valid: false, issues, params: [] }
    }

    // Check if root route is included
    const hasRootRoute = content.includes('mdxPath: []')
    if (!hasRootRoute) {
      issues.push('generateStaticParams should include { mdxPath: [] } for root route')
    }

    // Try to actually run generateStaticParams
    // This requires importing the module, which might have side effects
    // For now, we'll validate the structure instead

    // Get all MDX files to validate against
    const mdxFiles = glob.sync('**/*.mdx', { cwd: CONTENT_DIR })
    const expectedRoutes = mdxFiles.length

    // Check if the function handles all files
    if (content.includes('glob.sync')) {
      // Function uses glob, which is good
    } else {
      issues.push('generateStaticParams should use glob to discover all MDX files')
    }

    // Validate that home.mdx is handled correctly
    if (content.includes("route[0] === 'home'")) {
      // Good - skips home.mdx duplicate
    } else {
      issues.push('generateStaticParams should skip home.mdx to avoid duplicate root route')
    }

    // For actual params, we'd need to execute the function
    // But that requires a full Next.js environment
    // Instead, we validate the structure

    return {
      valid: issues.length === 0,
      issues,
      params: [], // Would be populated in actual execution
    }
  } catch (error) {
    issues.push(`Error validating static params: ${error instanceof Error ? error.message : String(error)}`)
    return { valid: false, issues, params: [] }
  }
}

/**
 * Main validation function
 */
async function main() {
  logSection('Next.js Routing Validation')
  log(`Validating: ${APP_DIR}`, 'blue')

  const results: {
    structure: ReturnType<typeof validateRouteStructure>
    catchAll: ReturnType<typeof validateCatchAllRoute>
    content: Awaited<ReturnType<typeof validateContentMapping>>
    staticParams: Awaited<ReturnType<typeof validateStaticParams>>
  } = {
    structure: validateRouteStructure(),
    catchAll: validateCatchAllRoute(),
    content: await validateContentMapping(),
    staticParams: await validateStaticParams(),
  }

  // Print results
  logSection('1. Route Structure Validation')
  if (results.structure.valid) {
    log('✅ Route structure is valid', 'green')
  } else {
    log('❌ Route structure has issues:', 'red')
    results.structure.issues.forEach((issue) => log(`  - ${issue}`, 'red'))
  }

  logSection('2. Catch-All Route Validation')
  if (results.catchAll.valid) {
    log('✅ Catch-all route is valid', 'green')
  } else {
    log('❌ Catch-all route has issues:', 'red')
    results.catchAll.issues.forEach((issue) => log(`  - ${issue}`, 'red'))
  }
  log(`  - generateStaticParams: ${results.catchAll.hasGenerateStaticParams ? '✅' : '❌'}`, results.catchAll.hasGenerateStaticParams ? 'green' : 'red')
  log(`  - generateMetadata: ${results.catchAll.hasGenerateMetadata ? '✅' : '❌'}`, results.catchAll.hasGenerateMetadata ? 'green' : 'red')
  log(`  - Params type: ${results.catchAll.paramsType}`, results.catchAll.paramsType === 'promise' ? 'green' : 'yellow')

  logSection('3. Content File Mapping')
  log(`Total routes: ${results.content.totalRoutes}`, 'blue')
  log(`Valid routes: ${results.content.validRoutes}`, 'green')
  if (results.content.missingRoutes > 0) {
    log(`Missing routes: ${results.content.missingRoutes}`, 'red')
  }
  if (results.content.invalidRoutes > 0) {
    log(`Invalid routes: ${results.content.invalidRoutes}`, 'red')
  }

  // Show first 10 routes
  log('\nFirst 10 routes:', 'cyan')
  results.content.routes.slice(0, 10).forEach((route) => {
    const status = route.status === 'valid' ? '✅' : route.status === 'missing' ? '⚠️' : '❌'
    log(`  ${status} ${route.route} → ${route.contentFile || 'N/A'}`, route.status === 'valid' ? 'green' : 'yellow')
  })

  if (results.content.routes.length > 10) {
    log(`  ... and ${results.content.routes.length - 10} more routes`, 'blue')
  }

  logSection('4. Static Params Generation')
  if (results.staticParams.valid) {
    log('✅ Static params generation is valid', 'green')
  } else {
    log('❌ Static params generation has issues:', 'red')
    results.staticParams.issues.forEach((issue) => log(`  - ${issue}`, 'red'))
  }

  // Summary
  logSection('Validation Summary')
  const allValid =
    results.structure.valid &&
    results.catchAll.valid &&
    results.content.missingRoutes === 0 &&
    results.staticParams.valid

  if (allValid) {
    log('✅ All routing validations passed!', 'green')
    console.log('\n')
    log('Next Steps:', 'cyan')
    log('1. Restart dev server: pnpm dev', 'blue')
    log('2. Clear cache if needed: rm -rf .next', 'blue')
    log('3. Test root route: http://localhost:3000/', 'blue')
    process.exit(0)
  } else {
    log('❌ Some routing validations failed', 'red')
    console.log('\n')
    log('Recommended Actions:', 'yellow')
    log('1. Fix the issues listed above', 'blue')
    log('2. Restart dev server: pnpm dev', 'blue')
    log('3. Clear Next.js cache: rm -rf .next', 'blue')
    process.exit(1)
  }
}

// Run validation
main().catch((error) => {
  log(`Fatal error: ${error instanceof Error ? error.message : String(error)}`, 'red')
  process.exit(1)
})
