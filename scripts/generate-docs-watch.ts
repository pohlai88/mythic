#!/usr/bin/env tsx
/**
 * Documentation Generator Watch Mode
 *
 * Watches for code changes and automatically regenerates documentation.
 *
 * Usage:
 *   pnpm generate:docs:watch
 */

import { watch } from 'chokidar'
import { execSync } from 'child_process'
import { createScriptLogger } from '../src/lib/logger'

const log = createScriptLogger('generate-docs-watch')

const watchPaths = [
  'src/lib/api-schemas/**/*.ts',
  'src/**/*.ts',
  'components/**/*.tsx',
  'apps/**/components/**/*.tsx',
  'apps/**/src/**/*.ts',
  'packages/**/src/**/*.ts',
]

const ignorePatterns = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
  '**/*.test.ts',
  '**/*.spec.ts',
  '**/*.test.tsx',
  '**/*.spec.tsx',
]

function determineGenerator(path: string): string | null {
  if (path.includes('api-schemas')) {
    return 'generate:api-docs'
  }
  if (path.includes('components') || path.endsWith('.tsx')) {
    return 'generate:component-docs'
  }
  if (path.endsWith('.ts')) {
    // Could be types or functions - regenerate both
    return null // Will trigger all
  }
  return null
}

function runGenerator(generator: string | null) {
  if (generator) {
    log.info(`🔄 Regenerating: ${generator}`)
    try {
      execSync(`pnpm ${generator}`, { stdio: 'inherit' })
      log.info(`✅ ${generator} completed\n`)
    } catch (error) {
      log.error({ error }, `❌ ${generator} failed`)
    }
  } else {
    // Regenerate all
    log.info('🔄 Regenerating all documentation...')
    try {
      execSync('pnpm generate:docs', { stdio: 'inherit' })
      log.info('✅ All documentation regenerated\n')
    } catch (error) {
      log.error({ error }, '❌ Documentation regeneration failed')
    }
  }
}

async function startWatchMode(): Promise<void> {
  log.info('👀 Starting documentation watch mode...')
  log.info('Watching for changes in:')
  watchPaths.forEach((path) => log.info(`  - ${path}`))
  log.info('\nPress Ctrl+C to stop\n')

  // Initial generation
  log.info('📚 Generating initial documentation...\n')
  try {
    execSync('pnpm generate:docs', { stdio: 'inherit' })
    log.info('✅ Initial documentation generated\n')
  } catch (error) {
    log.error({ error }, '❌ Initial documentation generation failed')
    process.exit(1)
  }

  // Set up watcher
  const watcher = watch(watchPaths, {
    ignored: ignorePatterns,
    persistent: true,
    ignoreInitial: true,
  })

  let debounceTimer: NodeJS.Timeout | null = null
  const DEBOUNCE_MS = 1000 // Wait 1 second after last change

  watcher.on('change', (path) => {
    log.info(`📝 File changed: ${path}`)

    // Debounce: wait for file changes to settle
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      const generator = determineGenerator(path)
      runGenerator(generator)
      debounceTimer = null
    }, DEBOUNCE_MS)
  })

  watcher.on('add', (path) => {
    log.info(`➕ File added: ${path}`)
    const generator = determineGenerator(path)
    runGenerator(generator)
  })

  watcher.on('unlink', (path) => {
    log.info(`🗑️  File removed: ${path}`)
    const generator = determineGenerator(path)
    runGenerator(generator)
  })

  watcher.on('error', (error) => {
    log.error({ error }, 'Watcher error')
  })

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log.info('\n\n👋 Stopping watch mode...')
    watcher.close()
    process.exit(0)
  })

  process.on('SIGTERM', () => {
    log.info('\n\n👋 Stopping watch mode...')
    watcher.close()
    process.exit(0)
  })
}

// Check if chokidar is available
try {
  startWatchMode().catch((error) => {
    log.error({ error }, 'Failed to start watch mode')
    process.exit(1)
  })
} catch (error) {
  log.error(
    { error },
    'chokidar not found. Install it with: pnpm add -D chokidar'
  )
  process.exit(1)
}
