/**
 * Next.js Compliance Check Script
 *
 * Validates that routing follows Next.js App Router best practices
 * Reference: https://nextjs.org/docs/app
 */

import { readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * Check App Router structure
 */
function checkAppRouterStructure(): { success: boolean; errors: string[] } {
  const errors: string[] = []

  // Determine app directory path (works from monorepo root or apps/docs)
  let appDir = join(process.cwd(), 'app')
  if (!existsSync(appDir)) {
    // Try from monorepo root
    appDir = join(process.cwd(), 'apps/docs/app')
  }
  if (!existsSync(appDir)) {
    errors.push(`app/ directory does not exist (checked: ${appDir})`)
    return { success: false, errors }
  }

  // Check for required files
  const requiredFiles = ['layout.tsx', 'page.tsx']
  for (const file of requiredFiles) {
    const filePath = join(appDir, file)
    if (!existsSync(filePath)) {
      errors.push(`Missing required file: app/${file}`)
    }
  }

  // Check route groups
  const audiencesDir = join(appDir, '(audiences)')
  if (!existsSync(audiencesDir)) {
    errors.push('Route group (audiences)/ does not exist')
  } else {
    // Check for audience directories
    const requiredAudiences = ['developers', 'users', 'business']
    for (const audience of requiredAudiences) {
      const audienceDir = join(audiencesDir, audience)
      if (!existsSync(audienceDir)) {
        errors.push(`Missing audience directory: (audiences)/${audience}/`)
      } else {
        // Check for layout.tsx in each audience
        const layoutPath = join(audienceDir, 'layout.tsx')
        if (!existsSync(layoutPath)) {
          errors.push(`Missing layout.tsx in (audiences)/${audience}/`)
        }
      }
    }
  }

  return {
    success: errors.length === 0,
    errors,
  }
}

// Run check
const result = checkAppRouterStructure()

if (!result.success) {
  console.error('❌ Next.js compliance check failed:')
  result.errors.forEach((error) => console.error(`  - ${error}`))
  process.exit(1)
}

console.log('✅ Next.js App Router structure is compliant')
process.exit(0)
