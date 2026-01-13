#!/usr/bin/env tsx
/**
 * Registry Dashboard Launcher
 *
 * One-command solution to:
 * 1. Scan and update registry
 * 2. Start the dashboard on a custom port
 *
 * Usage:
 *   pnpm registry:dashboard        # Scan and start dashboard on default port (3000)
 *   pnpm registry:dashboard --port 4000  # Use custom port
 */

import { spawn } from "node:child_process"
import { join } from "node:path"

const DEFAULT_PORT = 3000
const args = process.argv.slice(2)
const portArg = args.find((arg) => arg.startsWith("--port"))
const port = portArg ? portArg.split("=")[1] || DEFAULT_PORT : DEFAULT_PORT

async function main() {
  console.log("🔍 Step 1: Scanning registry...")
  
  // Step 1: Scan registry
  const scanProcess = spawn("pnpm", ["registry:scan"], {
    stdio: "inherit",
    shell: true,
    cwd: process.cwd(),
  })

  await new Promise<void>((resolve, reject) => {
    scanProcess.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Registry scan complete!\n")
        resolve()
      } else {
        reject(new Error(`Registry scan failed with code ${code}`))
      }
    })
  })

  console.log(`🚀 Step 2: Starting dashboard on port ${port}...`)
  console.log(`📊 Dashboard will be available at: http://localhost:${port}/registry\n`)

  // Step 2: Start dashboard
  const dashboardProcess = spawn("pnpm", ["dev", "--port", port.toString()], {
    stdio: "inherit",
    shell: true,
    cwd: join(process.cwd(), "apps", "StratonHub"),
  })

  dashboardProcess.on("close", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`❌ Dashboard exited with code ${code}`)
      process.exit(code)
    }
  })

  // Handle Ctrl+C gracefully
  process.on("SIGINT", () => {
    console.log("\n\n🛑 Shutting down dashboard...")
    dashboardProcess.kill()
    process.exit(0)
  })
}

main().catch((error) => {
  console.error("❌ Error:", error)
  process.exit(1)
})
