/**
 * Drizzle Configuration for BoardRoom App
 *
 * Uses validated environment variables via Zod schema.
 */

import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"
import { existsSync } from "fs"
import { resolve } from "path"

// Load environment variables from root .env ONLY
// All environment variables must be in C:\AI-BOS\mythic\.env
const rootEnv = resolve(process.cwd(), "..", "..", ".env")
if (existsSync(rootEnv)) {
  config({ path: rootEnv })
} else {
  throw new Error(
    "Root .env file not found at C:\\AI-BOS\\mythic\\.env\n" +
      "All environment variables must be in the root .env file.\n" +
      "See: .cursor/rules/060_security-secrets.mdc"
  )
}

// Use DATABASE_URL directly if available, otherwise use getDatabaseConfig
let dbCredentials: any

if (process.env.DATABASE_URL) {
  // Parse DATABASE_URL for drizzle
  try {
    const url = new URL(process.env.DATABASE_URL)
    dbCredentials = {
      url: process.env.DATABASE_URL, // Drizzle supports connection string directly
    }
  } catch {
    // Fallback to parsed config
    const { getDatabaseConfig } = require("./src/lib/env")
    dbCredentials = getDatabaseConfig()
  }
} else {
  const { getDatabaseConfig } = require("./src/lib/env")
  dbCredentials = getDatabaseConfig()
}

export default defineConfig({
  schema: "./src/db/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials,
  verbose: true,
  strict: true,
  // Advanced migration management
  migrations: {
    table: "drizzle_migrations",
    schema: "public", // Optional: specify schema
  },
  // Enhanced error messages and debugging
  breakpoints: true,
  // Schema introspection (for pulling existing schemas)
  schemaFilter: ["public"], // Only process public schema
  // Performance optimizations
  // Note: Drizzle automatically optimizes queries
})
