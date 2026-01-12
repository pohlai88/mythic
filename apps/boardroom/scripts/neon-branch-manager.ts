/**
 * Neon Branch Manager for Multi-Environment Development
 * 
 * Manages Neon branches for dev/staging/prod environments
 * Integrates with Drizzle for schema management
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

interface BranchConfig {
  name: string
  environment: 'development' | 'staging' | 'production'
  projectId: string
  database?: string
  autoSync?: boolean
}

/**
 * Create a Neon branch
 */
function createBranch(config: BranchConfig): string {
  try {
    const args = [
      'branches', 'create',
      '--project-id', config.projectId,
      '--name', config.name,
    ]

    const output = execSync(`neonctl ${args.join(' ')} --output json`, {
      encoding: 'utf-8',
    })

    const branch = JSON.parse(output)
    console.log(`✅ Created branch: ${config.name} (${branch.id})`)
    return branch.id
  } catch (error) {
    throw new Error(`Failed to create branch: ${error}`)
  }
}

/**
 * Get branch connection string
 */
function getBranchConnectionString(config: BranchConfig): string {
  try {
    const args = [
      'connection-string',
      config.name,
      '--project-id', config.projectId,
      '--pooled',
      '--ssl', 'require',
    ]

    if (config.database) {
      args.push('--database-name', config.database)
    }

    const connectionString = execSync(`neonctl ${args.join(' ')}`, {
      encoding: 'utf-8',
    }).trim()

    return connectionString
  } catch (error) {
    throw new Error(`Failed to get branch connection string: ${error}`)
  }
}

/**
 * Switch to branch and update .env
 */
function switchToBranch(config: BranchConfig): void {
  console.log(`🔄 Switching to branch: ${config.name}`)
  console.log(`Environment: ${config.environment}\n`)

  const connectionString = getBranchConnectionString(config)

  // Update .env file
  const cwd = process.cwd()
  const rootEnv = resolve(cwd, '..', '..', '.env')
  const appEnv = join(cwd, '.env')
  const envPath = existsSync(rootEnv) ? rootEnv : appEnv

  let envContent = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : ''

  // Update DATABASE_URL
  if (envContent.includes('DATABASE_URL=')) {
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL=${connectionString}`
    )
  } else {
    envContent += `\nDATABASE_URL=${connectionString}\n`
  }

  // Add environment marker
  if (!envContent.includes('NODE_ENV=')) {
    envContent += `NODE_ENV=${config.environment}\n`
  } else {
    envContent = envContent.replace(
      /NODE_ENV=.*/,
      `NODE_ENV=${config.environment}`
    )
  }

  writeFileSync(envPath, envContent, 'utf-8')
  console.log(`✅ Updated .env for ${config.environment} environment`)

  if (config.autoSync) {
    console.log('\n📤 Pushing schema to branch...')
    try {
      execSync('pnpm db:push', { stdio: 'inherit' })
      console.log('✅ Schema synced to branch')
    } catch (error) {
      console.warn('⚠️  Schema push failed (branch may need initial setup)')
    }
  }
}

/**
 * List all branches
 */
function listBranches(projectId: string): void {
  try {
    const output = execSync(
      `neonctl branches list --project-id ${projectId} --output json`,
      { encoding: 'utf-8' }
    )

    const branches = JSON.parse(output)
    console.log('📋 Available Branches:\n')
    branches.forEach((branch: any) => {
      console.log(`  - ${branch.name} (${branch.id})`)
    })
  } catch (error) {
    throw new Error(`Failed to list branches: ${error}`)
  }
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case 'create':
      const name = args.find(arg => arg.startsWith('--name'))?.split('=')[1] || args[args.indexOf('--name') + 1]
      const env = args.find(arg => arg.startsWith('--env'))?.split('=')[1] || args[args.indexOf('--env') + 1] || 'development'
      const projectId = args.find(arg => arg.startsWith('--project-id'))?.split('=')[1] || args[args.indexOf('--project-id') + 1]

      if (!name || !projectId) {
        console.error('❌ Required: --name and --project-id')
        process.exit(1)
      }

      const branchConfig: BranchConfig = {
        name,
        environment: env as BranchConfig['environment'],
        projectId,
        autoSync: args.includes('--auto-sync'),
      }

      createBranch(branchConfig)
      switchToBranch(branchConfig)
      break

    case 'switch':
      const switchName = args.find(arg => arg.startsWith('--name'))?.split('=')[1] || args[args.indexOf('--name') + 1]
      const switchProjectId = args.find(arg => arg.startsWith('--project-id'))?.split('=')[1] || args[args.indexOf('--project-id') + 1]
      const switchEnv = args.find(arg => arg.startsWith('--env'))?.split('=')[1] || args[args.indexOf('--env') + 1] || 'development'

      if (!switchName || !switchProjectId) {
        console.error('❌ Required: --name and --project-id')
        process.exit(1)
      }

      switchToBranch({
        name: switchName,
        environment: switchEnv as BranchConfig['environment'],
        projectId: switchProjectId,
        autoSync: args.includes('--auto-sync'),
      })
      break

    case 'list':
      const listProjectId = args.find(arg => arg.startsWith('--project-id'))?.split('=')[1] || args[args.indexOf('--project-id') + 1]
      if (!listProjectId) {
        console.error('❌ Required: --project-id')
        process.exit(1)
      }
      listBranches(listProjectId)
      break

    default:
      console.log(`
Neon Branch Manager

Usage:
  tsx scripts/neon-branch-manager.ts <command> [options]

Commands:
  create              Create a new branch
  switch              Switch to existing branch
  list                List all branches

Examples:
  # Create dev branch
  tsx scripts/neon-branch-manager.ts create --name dev --project-id <id> --env development --auto-sync

  # Switch to staging
  tsx scripts/neon-branch-manager.ts switch --name staging --project-id <id> --env staging

  # List branches
  tsx scripts/neon-branch-manager.ts list --project-id <id>
      `)
  }
}

if (require.main === module) {
  main()
}

export { createBranch, switchToBranch, listBranches }
