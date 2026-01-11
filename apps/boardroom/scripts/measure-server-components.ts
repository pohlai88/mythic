/**
 * Server Component Ratio Measurement Script
 *
 * Measures the ratio of Server Components vs Client Components in the boardroom app.
 * Target: >70% Server Components
 *
 * Only counts route-level components:
 * - app directory page.tsx files
 * - app directory layout.tsx files
 * - app directory components tsx files
 *
 * Excludes:
 * - utils and lib directories
 * - MDX files and index files
 * - Shared components outside app directory
 */

import { readdir, readFile } from 'fs/promises'
import { join, extname } from 'path'

interface ComponentMetric {
  path: string
  type: 'server' | 'client' | 'unknown'
  isRouteComponent: boolean
}

interface Metrics {
  totalComponents: number
  serverComponents: number
  clientComponents: number
  unknownComponents: number
  routeComponents: {
    server: number
    client: number
    total: number
  }
  ratio: number
}

const APP_DIR = join(process.cwd(), 'app')
const COMPONENTS_DIR = join(process.cwd(), 'components')

/**
 * Check if a file is a route component
 */
function isRouteComponent(filePath: string): boolean {
  // Route components are in app directory
  if (!filePath.includes('app/')) {
    return false
  }

  // Exclude utilities, lib, MDX, index files
  if (
    filePath.includes('/utils/') ||
    filePath.includes('/lib/') ||
    filePath.endsWith('.mdx') ||
    filePath.endsWith('/index.ts') ||
    filePath.endsWith('/index.tsx')
  ) {
    return false
  }

  // Include page.tsx, layout.tsx, and components in app directory
  return (
    filePath.endsWith('/page.tsx') ||
    filePath.endsWith('/layout.tsx') ||
    (filePath.includes('/components/') && filePath.endsWith('.tsx'))
  )
}

/**
 * Check if a component is a Client Component
 */
async function checkComponentType(filePath: string): Promise<'server' | 'client' | 'unknown'> {
  try {
    const content = await readFile(filePath, 'utf-8')

    // Check for 'use client' directive
    if (content.includes("'use client'") || content.includes('"use client"')) {
      return 'client'
    }

    // Check for 'use server' directive (Server Actions)
    if (content.includes("'use server'") || content.includes('"use server"')) {
      return 'server'
    }

    // Default to server for route components (Next.js default)
    // Unknown for other files
    return isRouteComponent(filePath) ? 'server' : 'unknown'
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return 'unknown'
  }
}

/**
 * Recursively find all TypeScript/TSX files
 */
async function findTSXFiles(dir: string, basePath: string = dir): Promise<string[]> {
  const files: string[] = []

  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      const relativePath = fullPath.replace(basePath, '').replace(/\\/g, '/')

      if (entry.isDirectory()) {
        // Skip node_modules, .next, etc.
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          const subFiles = await findTSXFiles(fullPath, basePath)
          files.push(...subFiles)
        }
      } else if (entry.isFile()) {
        const ext = extname(entry.name)
        if (ext === '.tsx' || ext === '.ts') {
          files.push(fullPath)
        }
      }
    }
  } catch (error) {
    // Directory might not exist or be accessible
    console.warn(`Could not read directory ${dir}:`, error)
  }

  return files
}

/**
 * Measure Server Component ratio
 */
async function measureServerComponents(): Promise<Metrics> {
  const appFiles = await findTSXFiles(APP_DIR, APP_DIR)
  const componentFiles = await findTSXFiles(COMPONENTS_DIR, COMPONENTS_DIR)
  const allFiles = [...appFiles, ...componentFiles]

  const components: ComponentMetric[] = []

  for (const file of allFiles) {
    const relativePath = file.replace(process.cwd(), '').replace(/\\/g, '/')
    const type = await checkComponentType(file)
    const isRoute = isRouteComponent(relativePath)

    components.push({
      path: relativePath,
      type,
      isRouteComponent: isRoute,
    })
  }

  // Calculate metrics
  const routeComponents = components.filter((c) => c.isRouteComponent)
  const serverComponents = routeComponents.filter((c) => c.type === 'server')
  const clientComponents = routeComponents.filter((c) => c.type === 'client')

  const totalRouteComponents = routeComponents.length
  const serverCount = serverComponents.length
  const clientCount = clientComponents.length
  const ratio = totalRouteComponents > 0 ? serverCount / totalRouteComponents : 0

  return {
    totalComponents: components.length,
    serverComponents: components.filter((c) => c.type === 'server').length,
    clientComponents: components.filter((c) => c.type === 'client').length,
    unknownComponents: components.filter((c) => c.type === 'unknown').length,
    routeComponents: {
      server: serverCount,
      client: clientCount,
      total: totalRouteComponents,
    },
    ratio,
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('📊 Measuring Server Component Ratio...\n')

  const metrics = await measureServerComponents()

  console.log('📈 Results:')
  console.log(`   Total Components: ${metrics.totalComponents}`)
  console.log(`   Server Components: ${metrics.serverComponents}`)
  console.log(`   Client Components: ${metrics.clientComponents}`)
  console.log(`   Unknown: ${metrics.unknownComponents}\n`)

  console.log('🎯 Route Components (app/**/*.tsx):')
  console.log(`   Server: ${metrics.routeComponents.server}`)
  console.log(`   Client: ${metrics.routeComponents.client}`)
  console.log(`   Total: ${metrics.routeComponents.total}`)
  console.log(`   Ratio: ${(metrics.ratio * 100).toFixed(1)}%\n`)

  const targetRatio = 0.7
  const passed = metrics.ratio >= targetRatio

  console.log(`✅ Target: >${(targetRatio * 100).toFixed(0)}% Server Components`)
  console.log(`${passed ? '✅' : '❌'} Status: ${passed ? 'PASSED' : 'FAILED'}\n`)

  if (!passed) {
    console.log('💡 Recommendations:')
    console.log('   - Convert unnecessary Client Components to Server Components')
    console.log('   - Use Server Actions instead of API routes where possible')
    console.log('   - Move client-side logic to leaf components only')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Error measuring Server Components:', error)
  process.exit(1)
})
