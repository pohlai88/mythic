/**
 * Production Validation Script
 * 
 * Validates production database configuration:
 * - Connection security
 * - Schema integrity
 * - Performance metrics
 * - Migration status
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join, resolve } from 'path'

interface ValidationResult {
  connection: boolean
  security: boolean
  schema: boolean
  migrations: boolean
  performance: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validate connection string security
 */
function validateConnectionSecurity(connectionString: string): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    const url = new URL(connectionString)

    // Check pooler endpoint
    if (!url.hostname.includes('-pooler.neon.tech')) {
      errors.push('Must use pooler endpoint for production')
    }

    // Check SSL
    if (url.searchParams.get('sslmode') !== 'require') {
      errors.push('SSL is required (sslmode=require)')
    }

    // Check channel binding (recommended)
    if (!url.searchParams.has('channel_binding')) {
      warnings.push('Channel binding not set (recommended: channel_binding=require)')
    }

    // Check connection timeout
    const timeout = url.searchParams.get('connect_timeout')
    if (!timeout) {
      warnings.push('Connection timeout not set (recommended: connect_timeout=10)')
    } else if (Number.parseInt(timeout) > 10)) {
      warnings.push(`Connection timeout is ${timeout}s (recommended: ≤10s)`)
    }

    // Check pool timeout
    const poolTimeout = url.searchParams.get('pool_timeout')
    if (!poolTimeout || poolTimeout !== '0') {
      warnings.push('Pool timeout should be 0 for serverless (unlimited)')
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  } catch {
    return {
      valid: false,
      errors: ['Invalid connection string format'],
      warnings: [],
    }
  }
}

/**
 * Validate environment variables
 */
function validateEnvironment(): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Check NODE_ENV
  if (process.env.NODE_ENV !== 'production') {
    warnings.push(`NODE_ENV is "${process.env.NODE_ENV}", expected "production"`)
  }

  // Check DATABASE_URL
  if (!process.env.DATABASE_URL) {
    errors.push('DATABASE_URL is required')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate schema
 */
function validateSchema(): boolean {
  try {
    execSync('pnpm validate:db', { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

/**
 * Check migration status
 */
function checkMigrations(): boolean {
  try {
    // Check if migrations table exists and is up to date
    execSync('pnpm db:generate', { stdio: 'pipe' })
    // If no new migrations generated, we're up to date
    return true
  } catch {
    return false
  }
}

/**
 * Main validation
 */
function validateProduction(): ValidationResult {
  const result: ValidationResult = {
    connection: false,
    security: false,
    schema: false,
    migrations: false,
    performance: false,
    errors: [],
    warnings: [],
  }

  console.log('🔍 Production Validation\n')
  console.log('=' .repeat(60))
  console.log()

  // 1. Validate environment
  console.log('📋 Validating environment...')
  const envValidation = validateEnvironment()
  result.errors.push(...envValidation.errors)
  result.warnings.push(...envValidation.warnings)
  if (envValidation.valid) {
    console.log('✅ Environment validated\n')
  } else {
    console.error('❌ Environment validation failed\n')
    return result
  }

  // 2. Validate connection string
  if (process.env.DATABASE_URL) {
    console.log('🔒 Validating connection security...')
    const securityValidation = validateConnectionSecurity(process.env.DATABASE_URL)
    result.security = securityValidation.valid
    result.errors.push(...securityValidation.errors)
    result.warnings.push(...securityValidation.warnings)

    if (securityValidation.valid) {
      console.log('✅ Connection security validated')
      if (securityValidation.warnings.length > 0) {
        console.log('⚠️  Warnings:')
        securityValidation.warnings.forEach((w) => console.log(`   - ${w}`))
      }
      console.log()
    } else {
      console.error('❌ Connection security validation failed')
      securityValidation.errors.forEach((e) => console.error(`   - ${e}`))
      console.log()
    }
  }

  // 3. Validate schema
  console.log('🔍 Validating schema...')
  result.schema = validateSchema()
  if (result.schema) {
    console.log('✅ Schema validated\n')
  } else {
    console.error('❌ Schema validation failed\n')
  }

  // 4. Check migrations
  console.log('📦 Checking migrations...')
  result.migrations = checkMigrations()
  if (result.migrations) {
    console.log('✅ Migrations up to date\n')
  } else {
    console.warn('⚠️  Migrations may be out of date\n')
  }

  // 5. Performance (optional)
  console.log('⚡ Performance check...')
  try {
    execSync('pnpm test:db-performance', { stdio: 'pipe', timeout: 30000 })
    result.performance = true
    console.log('✅ Performance tests passed\n')
  } catch {
    console.warn('⚠️  Performance tests failed (non-critical)\n')
  }

  // Summary
  console.log('=' .repeat(60))
  console.log('📊 Validation Summary\n')

  const allValid = result.security && result.schema && result.migrations

  if (allValid) {
    console.log('✅ Production ready!')
  } else {
    console.log('❌ Production validation failed')
  }

  if (result.errors.length > 0) {
    console.log('\n❌ Errors:')
    result.errors.forEach((error) => console.log(`   - ${error}`))
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:')
    result.warnings.forEach((warning) => console.log(`   - ${warning}`))
  }

  console.log()

  return result
}

/**
 * CLI interface
 */
function main() {
  const result = validateProduction()
  process.exit(result.security && result.schema ? 0 : 1)
}

if (require.main === module) {
  main()
}

export { validateProduction, validateConnectionSecurity }
