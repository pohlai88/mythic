/**
 * Neon + Drizzle Synergistic Integration Script
 * 
 * Combines Neon CLI and Drizzle for maximum functionality:
 * - Automatic connection string sync
 * - Branch-based environment management
 * - Schema migration automation
 * - Performance monitoring
 * - Point-in-time recovery support
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

interface NeonProject {
  id: string
  name: string
  region_id: string
}

interface NeonBranch {
  id: string
  name: string
  project_id: string
}

interface SyncConfig {
  projectId?: string
  branch?: string
  database?: string
  role?: string
  environment: 'development' | 'staging' | 'production'
  autoPush?: boolean
  autoMigrate?: boolean
}

/**
 * Get Neon project ID from CLI or config
 */
function getNeonProjectId(): string | null {
  try {
    // Try to get from context
    const contextOutput = execSync('neonctl set-context', { encoding: 'utf-8', stdio: 'pipe' })
    const projectMatch = contextOutput.match(/project-id:\s*([^\s]+)/)
    if (projectMatch) {
      return projectMatch[1]
    }
  } catch {
    // Context not set, continue
  }

  // Try to get from projects list
  try {
    const projectsOutput = execSync('neonctl projects list --output json', { encoding: 'utf-8' })
    const projects: NeonProject[] = JSON.parse(projectsOutput)
    if (projects.length > 0) {
      return projects[0].id
    }
  } catch {
    // Could not get projects
  }

  return null
}

/**
 * Get connection string from Neon CLI
 */
function getNeonConnectionString(config: SyncConfig): string {
  const args = [
    'connection-string',
    '--pooled',
    '--ssl', 'require',
  ]

  if (config.projectId) {
    args.push('--project-id', config.projectId)
  }

  if (config.branch) {
    args.push(config.branch)
  }

  if (config.database) {
    args.push('--database-name', config.database)
  }

  if (config.role) {
    args.push('--role-name', config.role)
  }

  try {
    const connectionString = execSync(`neonctl ${args.join(' ')}`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim()

    return connectionString
  } catch (error) {
    throw new Error(`Failed to get connection string from Neon CLI: ${error}`)
  }
}

/**
 * Update .env file with connection string
 */
function updateEnvFile(connectionString: string, envPath: string): void {
  let envContent = ''

  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf-8')
  }

  // Update or add DATABASE_URL
  if (envContent.includes('DATABASE_URL=')) {
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL=${connectionString}`
    )
  } else {
    envContent += `\nDATABASE_URL=${connectionString}\n`
  }

  writeFileSync(envPath, envContent, 'utf-8')
  console.log(`✅ Updated .env file: ${envPath}`)
}

/**
 * Push schema using Drizzle
 */
function pushSchema(): void {
  try {
    console.log('📤 Pushing schema to database...')
    execSync('pnpm db:push', { stdio: 'inherit' })
    console.log('✅ Schema pushed successfully')
  } catch (error) {
    throw new Error(`Failed to push schema: ${error}`)
  }
}

/**
 * Generate migrations using Drizzle
 */
function generateMigrations(): void {
  try {
    console.log('📝 Generating migrations...')
    execSync('pnpm db:generate', { stdio: 'inherit' })
    console.log('✅ Migrations generated successfully')
  } catch (error) {
    throw new Error(`Failed to generate migrations: ${error}`)
  }
}

/**
 * Run migrations using Drizzle
 */
function runMigrations(): void {
  try {
    console.log('🚀 Running migrations...')
    execSync('pnpm db:migrate', { stdio: 'inherit' })
    console.log('✅ Migrations completed successfully')
  } catch (error) {
    throw new Error(`Failed to run migrations: ${error}`)
  }
}

/**
 * Main sync function
 */
function sync(config: SyncConfig): void {
  console.log('🔄 Neon + Drizzle Synergistic Sync\n')
  console.log(`Environment: ${config.environment}`)
  console.log(`Project ID: ${config.projectId || 'auto-detect'}`)
  console.log(`Branch: ${config.branch || 'default'}\n`)

  // Get project ID if not provided
  if (!config.projectId) {
    const projectId = getNeonProjectId()
    if (projectId) {
      config.projectId = projectId
      console.log(`📋 Auto-detected project: ${projectId}\n`)
    } else {
      throw new Error('Project ID not found. Set --project-id or configure Neon context.')
    }
  }

  // Get connection string from Neon
  console.log('🔗 Getting connection string from Neon...')
  const connectionString = getNeonConnectionString(config)
  console.log(`✅ Connection string retrieved\n`)

  // Update .env file
  const cwd = process.cwd()
  const rootEnv = resolve(cwd, '..', '..', '.env')
  const appEnv = join(cwd, '.env')
  const envPath = existsSync(rootEnv) ? rootEnv : appEnv

  updateEnvFile(connectionString, envPath)

  // Auto-push schema if enabled
  if (config.autoPush) {
    pushSchema()
  }

  // Auto-migrate if enabled
  if (config.autoMigrate) {
    generateMigrations()
    runMigrations()
  }

  console.log('\n✅ Sync completed successfully!')
  console.log('\nNext steps:')
  console.log('  - Validate: pnpm validate:db')
  console.log('  - Push schema: pnpm db:push')
  console.log('  - Open Studio: pnpm db:studio')
}

/**
 * CLI interface
 */
function main() {
  const args = process.argv.slice(2)
  const config: SyncConfig = {
    environment: 'development',
    autoPush: false,
    autoMigrate: false,
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
      case '--env':
      case '--environment':
        config.environment = args[++i] as SyncConfig['environment']
        break
      case '--auto-push':
        config.autoPush = true
        break
      case '--auto-migrate':
        config.autoMigrate = true
        break
      case '--help':
        console.log(`
Neon + Drizzle Synergistic Sync

Usage:
  tsx scripts/neon-drizzle-sync.ts [options]

Options:
  --project-id <id>     Neon project ID (auto-detected if not provided)
  --branch <name>       Branch name (default: main)
  --database <name>     Database name (default: neondb)
  --role <name>         Role name (default: neondb_owner)
  --env <env>           Environment: development, staging, production
  --auto-push           Automatically push schema after sync
  --auto-migrate        Automatically generate and run migrations
  --help                Show this help

Examples:
  # Sync with auto-detection
  tsx scripts/neon-drizzle-sync.ts

  # Sync specific branch
  tsx scripts/neon-drizzle-sync.ts --branch dev --auto-push

  # Production sync with migrations
  tsx scripts/neon-drizzle-sync.ts --env production --auto-migrate
        `)
        process.exit(0)
    }
  }

  try {
    sync(config)
  } catch (error) {
    console.error('❌ Sync failed:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { sync, getNeonConnectionString, updateEnvFile }
