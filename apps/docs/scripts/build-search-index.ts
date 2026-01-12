/**
 * Build Search Index Script
 *
 * Generates search index at build time
 * Run this before building the app
 */

import { buildSearchIndex, saveSearchIndex } from '@/lib/search'  // Barrel export import

async function main() {
  console.log('Building search index...')

  try {
    const index = buildSearchIndex()
    console.log(`Found ${index.length} documents to index`)

    if (index.length > 0) {
      await saveSearchIndex(index)
      const cwd = process.cwd()
      const indexPath = cwd.endsWith('apps/docs')
        ? 'public/search-index.json'
        : 'apps/docs/public/search-index.json'
      console.log(`✅ Search index built: ${index.length} documents indexed`)
      console.log(`   Saved to: ${indexPath}`)
    } else {
      console.log('⚠️  No documents found to index')
      console.log('   Make sure MDX files exist in app/(audiences)/')
    }
  } catch (error) {
    console.error('❌ Failed to build search index:', error)
    if (error instanceof Error) {
      console.error('   Error message:', error.message)
      console.error('   Stack:', error.stack)
    }
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
