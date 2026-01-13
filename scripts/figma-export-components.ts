#!/usr/bin/env tsx
/**
 * Export Figma Components
 *
 * Exports components from Figma file to codebase using @figma-export/cli
 *
 * Usage:
 *   pnpm figma:export-components
 *   pnpm figma:export-components --file-key=<key>
 */

import { execSync } from "child_process"
import { existsSync } from "fs"
import { resolve } from "path"

const PROJECT_ROOT = resolve(__dirname, "..")

async function exportComponents(fileKey?: string): Promise<void> {
  console.log("\n🎨 Exporting Figma Components\n")

  // Get file key from argument or environment
  const figmaFileKey = fileKey || process.env.FIGMA_FILE_KEY

  if (!figmaFileKey) {
    console.error("❌ Missing Figma file key")
    console.log("\nUsage:")
    console.log("  pnpm figma:export-components --file-key=<key>")
    console.log("  Or set FIGMA_FILE_KEY environment variable")
    process.exit(1)
  }

  // Check if @figma-export/cli is installed
  const figmaExportCli = resolve(PROJECT_ROOT, "node_modules/.bin/figma-export")
  if (!existsSync(figmaExportCli)) {
    console.error("❌ @figma-export/cli not found")
    console.log("\nInstall it with:")
    console.log("  pnpm add -D -w @figma-export/cli")
    process.exit(1)
  }

  try {
    console.log(`📦 Exporting components from file: ${figmaFileKey}\n`)

    // Export components
    execSync(
      `FIGMA_FILE_KEY=${figmaFileKey} ${figmaExportCli} --config .config/figma-export.config.js components`,
      {
        stdio: "inherit",
        cwd: PROJECT_ROOT,
        env: {
          ...process.env,
          FIGMA_FILE_KEY: figmaFileKey,
          FIGMA_API_TOKEN: process.env.FIGMA_API_TOKEN,
        },
      }
    )

    console.log("\n✅ Components exported successfully!")
    console.log("📁 Output: packages/TailwindCSS-V4/Design-System/src/figma/components/")
  } catch (error) {
    console.error("\n❌ Export failed:", error)
    process.exit(1)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const fileKeyArg = args.find((arg) => arg.startsWith("--file-key="))
  const fileKey = fileKeyArg ? fileKeyArg.split("=")[1] : undefined

  await exportComponents(fileKey)
}

main().catch((error) => {
  console.error("Export error:", error)
  process.exit(1)
})
