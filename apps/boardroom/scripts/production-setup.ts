/**
 * Production Setup Script for Neon + Drizzle
 * 
 * Validates and configures production-ready database setup:
 * - Validates connection string
 * - Checks security settings
 * - Verifies schema
 * - Runs migrations
 * - Performance testing
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join, resolve } from 'path'

interface ProductionConfig {
  projectId: string
  branch: string
  database: string
  role: string
  skipMigrations?: boolean
  skipValidation?: boolean
}

/**
 * Validate production connection string
 */
function validateProductionConnection(connectionString: string): boolean {
  const url = new URL(connectionString)

  // Check pooler endpoint
  if (!url.hostname.includes('-pooler.neon.tech')) {
    console.error('❌ ERROR: Must use pooler endpoint for production')
    console.error('   Current:', url.hostname)
    console.error('   Expected: ep-xxx-xxx-pooler.region.aws.neon.tech')
    return false
  }

  // Check SSL
  if (url.searchParams.get('sslmode') !== 'require') {
    console.error('❌ ERROR: SSL is required for production')
    console.error('   Add: ?sslmode=require')
    return false
  }

  // Check channel binding (recommended)
  if (!url.searchParams.has('channel_binding')) {
    console.warn('⚠️  WARNING: Channel binding not set (recommended for production)')
    console.warn('   Add: &channel_binding=require')
  }

  // Check connection timeout
  const timeout = url.searchParams.get('connect_timeout')
  if (!timeout || Number.parseInt(timeout) > 10) {
    console.warn('⚠️  WARNING: Connection timeout should be ≤ 10s for production')
  }

  return true
}

/**
 * Get production connection string from Neon
 */
function getProductionConnectionString(config: ProductionConfig): string {
  try {
    const args = [
      'connection-string',
      config.branch,
      '--project-id', config.projectId,
      '--pooled',
      '--ssl', 'require',
    ]

    if (config.database) {
      args.push('--database-name', config.database)
    }

    if (config.role) {
      args.push('--role-name', config.role)
    }

    const connectionString = execSync(`neonctl ${args.join(' ')}`, {
      encoding: 'utf-8',
    }).trim()

    return connectionString
  } catch (error) {
    throw new Error(`Failed to get production connection string: ${error}`)
  }
}

/**
 * Validate environment
 */
function validateEnvironment(): void {
  const nodeEnv = process.env.NODE_ENV
  if (nodeEnv !== 'production') {
    console.warn(`⚠️  WARNING: NODE_ENV is "${nodeEnv}", expected "production"`)
  }

  // Check for production indicators
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for production')
  }
}

/**
 * Run production migrations
 */
function runMigrations(): void {
  console.log('📦 Running production migrations...\n')
  try {
    execSync('pnpm db:migrate', { stdio: 'inherit' })
    console.log('\n✅ Migrations completed successfully')
  } catch (error) {
    throw new Error(`Migration failed: ${error}`)
  }
}

/**
 * Validate schema
 */
function validateSchema(): void {
  console.log('🔍 Validating schema...\n')
  try {
    execSync('pnpm validate:db', { stdio: 'inherit' })
  } catch (error) {
    throw new Error(`Schema validation failed: ${error}`)
  }
}

/**
 * Performance test
 */
function performanceTest(): void {
  console.log('⚡ Running performance tests...\n')
  try {
    execSync('pnpm test:db-performance', { stdio: 'inherit' })
  } catch (error) {
    console.warn('⚠️  Performance test failed (non-blocking)')
  }
}

/**
 * Main production setup
 */
function setupProduction(config: ProductionConfig): void {
  console.log('🚀 Production Setup for Neon + Drizzle\n')
  console.log('=' .repeat(60))
  console.log()

  // Step 1: Validate environment
  console.log('📋 Step 1: Validating environment...')
  validateEnvironment()
  console.log('✅ Environment validated\n')

  // Step 2: Get production connection string
  console.log('🔗 Step 2: Getting production connection string...')
  const connectionString = getProductionConnectionString(config)
  console.log('✅ Connection string retrieved\n')

  // Step 3: Validate connection string
  console.log('🔒 Step 3: Validating production security...')
  if (!validateProductionConnection(connectionString)) {
    throw new Error('Production connection string validation failed')
  }
  console.log('✅ Security validation passed\n')

  // Step 4: Update .env
  console.log('📝 Step 4: Updating .env file...')
  const cwd = process.cwd()
  const rootEnv = resolve(cwd, '..', '..', '.env')
  const appEnv = join(cwd, '.env')
  const envPath = existsSync(rootEnv) ? rootEnv : appEnv

  if (existsSync(envPath)) {
    let envContent = readFileSync(envPath, 'utf-8')
    
    // Update DATABASE_URL
    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(
        /DATABASE_URL=.*/,
        `DATABASE_URL=${connectionString}`
      )
    } else {
      envContent += `\nDATABASE_URL=${connectionString}\n`
    }

    // Ensure NODE_ENV is production
    if (!envContent.includes('NODE_ENV=')) {
      envContent += 'NODE_ENV=production\n'
    } else {
      envContent = envContent.replace(/NODE_ENV=.*/, 'NODE_ENV=production')
    }

    require('fs').writeFileSync(envPath, envContent, 'utf-8')
    console.log(`✅ Updated .env file: ${envPath}\n`)
  } else {
    console.warn(`⚠️  .env file not found at ${envPath}`)
    console.warn('   Please create .env file with DATABASE_URL\n')
  }

  // Step 5: Validate schema (if not skipped)
  if (!config.skipValidation) {
    console.log('🔍 Step 5: Validating schema...')
    validateSchema()
    console.log('✅ Schema validated\n')
  }

  // Step 6: Run migrations (if not skipped)
  if (!config.skipMigrations) {
    console.log('📦 Step 6: Running migrations...')
    runMigrations()
    console.log('✅ Migrations completed\n')
  }

  // Step 7: Performance test
  console.log('⚡ Step 7: Performance testing...')
  performanceTest()
  console.log('✅ Performance tests completed\n')

  console.log('=' .repeat(60))
  console.log('✅ Production setup completed successfully!\n')
  console.log('📋 Next steps:')
  console.log('   1. Verify connection: pnpm validate:db')
  console.log('   2. Monitor performance: pnpm test:db-performance')
  console.log('   3. Check logs for any issues')
  console.log('   4. Set up monitoring/alerts\n')
}

/**
 * CLI interface
 */
function main() {
  const args = process.argv.slice(2)
  const config: ProductionConfig = {
    projectId: '',
    branch: 'main',
    database: 'neondb',
    role: 'neondb_owner',
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    switch (arg) {
      case '--project-id':
        config.projectId = args[++i]
        break
      case '--branch':
        config.branch = args[++i]
        break
      case '--database':
        config.database = args[++i]
        break
      case '--role':
        config.role = args[++i]
        break
      case '--skip-migrations':
        config.skipMigrations = true
        break
      case '--skip-validation':
        config.skipValidation = true
        break
      case '--help':
        console.log(`
Production Setup for Neon + Drizzle

Usage:
  tsx scripts/production-setup.ts [options]

Options:
  --project-id <id>     Neon project ID (required)
  --branch <name>       Branch name (default: main)
  --database <name>     Database name (default: neondb)
  --role <name>         Role name (default: neondb_owner)
  --skip-migrations     Skip running migrations
  --skip-validation     Skip schema validation
  --help                Show this help

Examples:
  # Full production setup
  tsx scripts/production-setup.ts --project-id <id>

  # Setup without migrations
  tsx scripts/production-setup.ts --project-id <id> --skip-migrations
        `)
        process.exit(0)
    }
  }

  if (!config.projectId) {
    console.error('❌ ERROR: --project-id is required')
    console.error('   Run: tsx scripts/production-setup.ts --project-id <id>')
    process.exit(1)
  }

  try {
    setupProduction(config)
  } catch (error) {
    console.error('❌ Production setup failed:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { setupProduction, validateProductionConnection }
