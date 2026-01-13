#!/usr/bin/env tsx
/**
 * Figma Code Connect Helper
 *
 * Helper script for using @figma/code-connect to link code components
 * to Figma designs.
 *
 * Usage:
 *   pnpm figma:code-connect --init
 *   pnpm figma:code-connect --link --component=Button --figma-node=1:2
 */

import { execSync } from "child_process"

async function codeConnect(args: string[]): Promise<void> {
  console.log("\n🔗 Figma Code Connect\n")

  // Use npx to run @figma/code-connect (works cross-platform)
  // This avoids PATH issues on Windows
  const command = "npx -y @figma/code-connect"

  try {
    // Verify it's available
    execSync(`${command} --version`, { stdio: "pipe" })
  } catch (error) {
    console.error("❌ @figma/code-connect not available via npx")
    console.log("\nThis should work automatically. If not, try:")
    console.log("  npm install -g @figma/code-connect@latest")
    process.exit(1)
  }

  try {
    // Pass through all arguments to figma-code-connect
    execSync(`${command} ${args.join(" ")}`, {
      stdio: "inherit",
    })
  } catch (error) {
    console.error("\n❌ Code Connect command failed")
    process.exit(1)
  }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log("Usage:")
    console.log("  pnpm figma:code-connect --init")
    console.log("  pnpm figma:code-connect --link --component=Button --figma-node=1:2")
    console.log("  pnpm figma:code-connect --validate")
    console.log("\nFor more info: https://developers.figma.com/docs/code-connect")
    process.exit(0)
  }

  await codeConnect(args)
}

main().catch((error) => {
  console.error("Code Connect error:", error)
  process.exit(1)
})
