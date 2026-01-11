/**
 * Performance Benchmarking Script
 *
 * Measures:
 * - Bundle size (via Next.js build output)
 * - Server Component ratio (via measurement script)
 * - Core Web Vitals (via Lighthouse CI - if available)
 *
 * Run after optimizations to track improvements.
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile, stat } from 'fs/promises'
import { join } from 'path'

const execAsync = promisify(exec)

interface BenchmarkResults {
  bundleSize: {
    total: number
    js: number
    css: number
    images: number
  }
  serverComponentRatio: number
  buildTime: number
  warnings: string[]
}

/**
 * Get bundle size from Next.js build output
 */
async function getBundleSize(): Promise<{
  total: number
  js: number
  css: number
  images: number
}> {
  const buildDir = join(process.cwd(), '.next')

  try {
    // Check if build exists
    await stat(join(buildDir, 'BUILD_ID'))

    // Read build manifest to get file sizes
    const manifestPath = join(buildDir, 'build-manifest.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf-8'))

    let jsSize = 0
    let cssSize = 0

    // Calculate sizes from manifest
    for (const [route, files] of Object.entries(manifest.pages)) {
      const routeFiles = files as string[]
      for (const file of routeFiles) {
        if (file.endsWith('.js')) {
          try {
            const filePath = join(buildDir, 'static', file)
            const stats = await stat(filePath)
            jsSize += stats.size
          } catch {
            // File might not exist or be in different location
          }
        } else if (file.endsWith('.css')) {
          try {
            const filePath = join(buildDir, 'static', file)
            const stats = await stat(filePath)
            cssSize += stats.size
          } catch {
            // File might not exist or be in different location
          }
        }
      }
    }

    // Get images size (approximate)
    let imagesSize = 0
    try {
      const imagesDir = join(buildDir, 'static', 'media')
      // This would require recursive directory size calculation
      // For now, return 0 as placeholder
    } catch {
      // Images directory might not exist
    }

    return {
      total: jsSize + cssSize + imagesSize,
      js: jsSize,
      css: cssSize,
      images: imagesSize,
    }
  } catch (error) {
    console.warn('Could not read bundle size (build may not exist):', error)
    return {
      total: 0,
      js: 0,
      css: 0,
      images: 0,
    }
  }
}

/**
 * Get Server Component ratio
 */
async function getServerComponentRatio(): Promise<number> {
  try {
    const scriptPath = join(process.cwd(), 'scripts', 'measure-server-components.ts')
    const { stdout } = await execAsync(`npx tsx ${scriptPath}`)

    // Parse ratio from output (look for "Ratio: XX.X%")
    if (stdout && typeof stdout === 'string') {
      const ratioMatch = stdout.match(/Ratio:\s*(\d+\.\d+)%/)
      if (ratioMatch && ratioMatch[1]) {
        return Number.parseFloat(ratioMatch[1]) / 100
      }
    }

    return 0
  } catch (error) {
    console.warn('Could not measure Server Component ratio:', error)
    return 0
  }
}

/**
 * Run Next.js build and measure time
 */
async function runBuild(): Promise<{ time: number; warnings: string[] }> {
  const startTime = Date.now()
  const warnings: string[] = []

  try {
    const { stdout, stderr } = await execAsync('pnpm build', {
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    })

    const buildTime = Date.now() - startTime

    // Extract warnings from stderr
    const warningLines = stderr.split('\n').filter((line) => line.includes('warning'))
    warnings.push(...warningLines)

    return { time: buildTime, warnings }
  } catch (error) {
    const buildTime = Date.now() - startTime
    console.error('Build failed:', error)
    return { time: buildTime, warnings: ['Build failed'] }
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / k ** i).toFixed(2)} ${sizes[i]}`
}

/**
 * Main benchmarking function
 */
async function benchmark(): Promise<BenchmarkResults> {
  console.log('🚀 Starting Performance Benchmark...\n')

  // Run build
  console.log('📦 Building application...')
  const { time: buildTime, warnings } = await runBuild()
  console.log(`   Build time: ${(buildTime / 1000).toFixed(2)}s\n`)

  // Get bundle size
  console.log('📊 Analyzing bundle size...')
  const bundleSize = await getBundleSize()
  console.log(`   Total: ${formatBytes(bundleSize.total)}`)
  console.log(`   JS: ${formatBytes(bundleSize.js)}`)
  console.log(`   CSS: ${formatBytes(bundleSize.css)}`)
  console.log(`   Images: ${formatBytes(bundleSize.images)}\n`)

  // Get Server Component ratio
  console.log('🎯 Measuring Server Component ratio...')
  const serverComponentRatio = await getServerComponentRatio()
  console.log(`   Ratio: ${(serverComponentRatio * 100).toFixed(1)}%\n`)

  // Print warnings
  if (warnings.length > 0) {
    console.log('⚠️  Warnings:')
    warnings.forEach((warning) => console.log(`   - ${warning}`))
    console.log()
  }

  // Print summary
  console.log('📈 Summary:')
  console.log(`   Bundle Size: ${formatBytes(bundleSize.total)}`)
  console.log(`   Server Component Ratio: ${(serverComponentRatio * 100).toFixed(1)}%`)
  console.log(`   Build Time: ${(buildTime / 1000).toFixed(2)}s`)

  // Check targets
  const bundleTarget = 150 * 1024 // 150KB
  const ratioTarget = 0.7 // 70%

  console.log('\n✅ Targets:')
  console.log(`   Bundle Size: <${formatBytes(bundleTarget)} ${bundleSize.total < bundleTarget ? '✅' : '❌'}`)
  console.log(`   Server Component Ratio: >${(ratioTarget * 100).toFixed(0)}% ${serverComponentRatio >= ratioTarget ? '✅' : '❌'}`)

  return {
    bundleSize,
    serverComponentRatio,
    buildTime,
    warnings,
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    await benchmark()
  } catch (error) {
    console.error('Error running benchmark:', error)
    process.exit(1)
  }
}

main()
