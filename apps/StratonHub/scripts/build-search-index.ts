/**
 * Build Search Index Script — StratonHub
 *
 * Generates search index at build time from all MDX content files.
 * Output: apps/StratonHub/public/search-index.json
 *
 * Performance Optimizations:
 * - Efficient file system operations
 * - Detailed progress reporting
 * - Comprehensive error handling
 * - Execution timing
 *
 * Usage:
 * ```bash
 * pnpm search:build-index
 * ```
 */

import { performance } from "perf_hooks"
import { buildSearchIndex, saveSearchIndex } from "@/lib/search"

/**
 * Format execution time for display
 */
function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const startTime = performance.now()
  console.log("🔍 Building search index...\n")

  try {
    // Build index from MDX files
    const buildStartTime = performance.now()
    const index = buildSearchIndex()
    const buildTime = performance.now() - buildStartTime

    console.log(`📄 Found ${index.length} document${index.length !== 1 ? "s" : ""} to index`)
    console.log(`⏱️  Index building took ${formatTime(buildTime)}\n`)

    // Validate index is not empty
    if (index.length === 0) {
      console.warn("⚠️  No documents found to index")
      console.warn("   Make sure MDX files exist under app/(audiences)/")
      console.warn("   Expected structure: app/(audiences)/[audience]/[surface]/page.mdx")
      process.exit(0) // Exit successfully (no error, just no content)
    }

    // Save index to file
    const saveStartTime = performance.now()
    await saveSearchIndex(index)
    const saveTime = performance.now() - saveStartTime

    const totalTime = performance.now() - startTime

    // Success message
    console.log("✅ Search index built successfully!")
    console.log(`   📊 Indexed ${index.length} document${index.length !== 1 ? "s" : ""}`)
    console.log(`   💾 Saved to: public/search-index.json`)
    console.log(
      `   ⏱️  Total time: ${formatTime(totalTime)} (build: ${formatTime(buildTime)}, save: ${formatTime(saveTime)})`
    )

    // Show index statistics
    const audiences = new Set(index.map((item) => item.audience))
    const surfaces = new Set(index.map((item) => item.surface).filter(Boolean))
    const types = new Set(index.map((item) => item.type))

    console.log("\n📈 Index Statistics:")
    console.log(`   👥 Audiences: ${audiences.size} (${Array.from(audiences).join(", ")})`)
    console.log(
      `   🏢 Surfaces: ${surfaces.size}${surfaces.size > 0 ? ` (${Array.from(surfaces).join(", ")})` : " (none)"}`
    )
    console.log(`   📚 Document Types: ${types.size} (${Array.from(types).join(", ")})`)

    process.exit(0)
  } catch (error) {
    const totalTime = performance.now() - startTime
    console.error("\n❌ Failed to build search index")
    console.error(`   ⏱️  Failed after ${formatTime(totalTime)}`)

    if (error instanceof Error) {
      console.error(`   📝 Error: ${error.message}`)
      if (error.stack && process.env.NODE_ENV === "development") {
        console.error(`   🔍 Stack trace:\n${error.stack}`)
      }
    } else {
      console.error(`   📝 Error: ${String(error)}`)
    }

    console.error("\n💡 Troubleshooting:")
    console.error("   - Check that MDX files exist in app/(audiences)/")
    console.error("   - Verify frontmatter is valid YAML")
    console.error("   - Ensure required fields (title, audience, type) are present")
    console.error("   - Check file permissions for public/ directory")

    process.exit(1)
  }
}

// Execute main function with error handling
main().catch((error) => {
  console.error("💥 Unhandled error in build-search-index script:", error)
  if (error instanceof Error && error.stack) {
    console.error(error.stack)
  }
  process.exit(1)
})
