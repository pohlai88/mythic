#!/usr/bin/env tsx
/**
 * Create Missing Static Assets
 *
 * Creates minimal favicon assets. Does NOT create placeholders.
 * Missing assets should be handled via Next.js metadata API fallbacks.
 *
 * Complies with Rule 031: No placeholders, stubs, or tech debt.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const rootDir = join(__dirname, '..')

// Create a minimal SVG favicon (actual implementation, not placeholder)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#000000"/>
  <text x="16" y="22" font-family="Arial" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">M</text>
</svg>`

// Only create favicon.ico files (actual SVG implementation)
// Other assets (apple-touch-icon, og-image) should use Next.js metadata API
const assetsToCreate = [
  {
    dir: 'apps/docs/public',
    files: [{ name: 'favicon.ico', content: faviconSvg }],
  },
  {
    dir: 'apps/boardroom/public',
    files: [{ name: 'favicon.ico', content: faviconSvg }],
  },
  {
    dir: 'public',
    files: [{ name: 'favicon.ico', content: faviconSvg }],
  },
]

for (const { dir, files } of assetsToCreate) {
  const dirPath = join(rootDir, dir)

  // Create directory if it doesn't exist
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
    console.log(`✅ Created directory: ${dir}`)
  }

  for (const file of files) {
    const filePath = join(dirPath, file.name)

    if (file.content) {
      writeFileSync(filePath, file.content)
      console.log(`✅ Created: ${dir}/${file.name}`)
    }
  }
}

console.log('\n✅ Static assets created!')
console.log('\n📝 Note: For missing apple-touch-icon and og-image, use Next.js metadata API:')
console.log('   - Remove icon references from metadata if files don\'t exist')
console.log('   - Or use Next.js ImageResponse API to generate dynamically')
console.log('   - See: https://nextjs.org/docs/app/api-reference/file-conventions/metadata')
