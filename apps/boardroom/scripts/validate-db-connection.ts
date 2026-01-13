/**
 * Database Connection Validation Script
 *
 * Validates database connection for both:
 * - Option 1: Docker Desktop (local PostgreSQL)
 * - Option 2: Direct Database (Neon, local PostgreSQL, or other)
 *
 * Usage:
 *   pnpm validate:db
 *   tsx apps/boardroom/scripts/validate-db-connection.ts
 */

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { config } from "dotenv"
import { existsSync } from "fs"
import { join, resolve } from "path"
import * as schema from "../src/db/schema"

// Load environment variables
// Try multiple locations: root .env, apps/boardroom/.env, and current working directory
const cwd = process.cwd()
// Always try root first: go up from apps/boardroom to root
const rootEnv = resolve(cwd, "..", "..", ".env")
const appEnv = join(cwd, ".env")
const rootEnvExists = existsSync(rootEnv)
const appEnvExists = existsSync(appEnv)

// Try root .env first (most common location), then app .env
if (rootEnvExists) {
  config({ path: rootEnv })
} else if (appEnvExists) {
  config({ path: appEnv })
} else {
  // Fallback to default behavior (current working directory)
  config()
}

export interface ValidationResult {
  success: boolean
  method: "docker" | "direct" | "unknown"
  connectionString: string
  connectionTime: number
  databaseInfo: {
    version: string
    database: string
    user: string
  }
  tables: string[]
  schemaExists: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Detect connection method from environment
 */
export function detectConnectionMethod(): "docker" | "direct" | "unknown" {
  const dbUrl = process.env.DATABASE_URL || ""
  const dbHost = process.env.DB_HOST

  // Priority 1: Check DATABASE_URL first (most reliable indicator)
  if (dbUrl) {
    // Check for Neon (direct cloud connection)
    if (dbUrl.includes(".neon.tech") || dbUrl.includes("neon")) {
      return "direct"
    }

    // Check for other cloud providers
    if (
      dbUrl.includes("amazonaws.com") ||
      dbUrl.includes("supabase.co") ||
      dbUrl.includes("railway.app")
    ) {
      return "direct"
    }

    // If DATABASE_URL contains localhost, it's Docker
    if (dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1")) {
      return "docker"
    }

    // If DATABASE_URL is set but not localhost, assume direct
    return "direct"
  }

  // Priority 2: Check DB_HOST (only if DATABASE_URL is not set)
  if (dbHost) {
    if (dbHost === "localhost" || dbHost === "127.0.0.1") {
      return "docker"
    }
    // If DB_HOST is set but not localhost, assume direct
    return "direct"
  }

  // No connection info provided
  return "unknown"
}

/**
 * Get connection string from environment
 */
export function getConnectionString(): string {
  // Try DATABASE_URL first
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  // Build from individual components
  const host = process.env.DB_HOST || "localhost"
  const port = process.env.DB_PORT || "5432"
  const user = process.env.DB_USER || "postgres"
  const password = process.env.DB_PASSWORD || ""
  const database = process.env.DB_NAME || "mythic"
  const ssl = process.env.DB_SSL === "true" ? "?sslmode=require" : ""

  return `postgresql://${user}:${password}@${host}:${port}/${database}${ssl}`
}

/**
 * Validate Docker Desktop connection
 */
export async function validateDockerConnection(): Promise<ValidationResult> {
  const result: ValidationResult = {
    success: false,
    method: "docker",
    connectionString: getConnectionString(),
    connectionTime: 0,
    databaseInfo: {
      version: "",
      database: "",
      user: "",
    },
    tables: [],
    schemaExists: false,
    errors: [],
    warnings: [],
  }

  console.log("🐳 Validating Docker Desktop Connection...\n")

  // Check if Docker is running
  try {
    const { exec } = await import("child_process")
    const { promisify } = await import("util")
    const execAsync = promisify(exec)

    try {
      await execAsync("docker ps")
      console.log("✅ Docker Desktop is running\n")
    } catch {
      result.warnings.push("Docker Desktop may not be running")
      console.log("⚠️  Could not verify Docker Desktop is running")
      console.log("   Make sure Docker Desktop is started\n")
    }
  } catch {
    // Docker check failed, but continue with connection test
    result.warnings.push("Could not check Docker status")
  }

  // Test connection
  const startTime = performance.now()
  try {
    const neonSql = neon(result.connectionString)
    const db = drizzle(neonSql, { schema })

    // Test basic connection using neon client directly (template literal syntax)
    const versionResult = await neonSql`SELECT version()`
    const version =
      Array.isArray(versionResult) && versionResult[0]
        ? (versionResult[0] as { version: string }).version
        : "Unknown"

    const dbInfoResult = await neonSql`SELECT current_database() as database, current_user as user`
    const dbInfo =
      Array.isArray(dbInfoResult) && dbInfoResult[0]
        ? (dbInfoResult[0] as { database: string; user: string })
        : { database: "Unknown", user: "Unknown" }

    result.connectionTime = performance.now() - startTime
    result.databaseInfo = {
      version,
      database: dbInfo.database,
      user: dbInfo.user,
    }

    // Check for tables using neon client directly
    const tablesResult = (await neonSql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `) as Array<{ table_name: string }>

    result.tables = tablesResult.map((t) => t.table_name)
    result.schemaExists = result.tables.length > 0

    result.success = true

    console.log("✅ Docker Desktop Connection Successful!\n")
    console.log(`   Connection Time: ${result.connectionTime.toFixed(2)}ms`)
    console.log(`   Database: ${result.databaseInfo.database}`)
    console.log(`   User: ${result.databaseInfo.user}`)
    console.log(
      `   PostgreSQL Version: ${result.databaseInfo.version.split(" ")[0]} ${result.databaseInfo.version.split(" ")[1]}`
    )
    console.log(`   Tables Found: ${result.tables.length}\n`)

    if (result.tables.length > 0) {
      console.log("📋 Existing Tables:")
      result.tables.forEach((table) => {
        console.log(`   - ${table}`)
      })
      console.log()
    } else {
      result.warnings.push("No tables found - schema may need to be created")
      console.log("⚠️  No tables found")
      console.log("   Run: pnpm db:push\n")
    }
  } catch (error) {
    result.connectionTime = performance.now() - startTime
    result.success = false
    const errorMessage = error instanceof Error ? error.message : String(error)
    result.errors.push(errorMessage)

    console.error("❌ Docker Desktop Connection Failed\n")
    console.error("   Error:", errorMessage)
    console.error("\n💡 Troubleshooting:")
    console.error("   1. Ensure Docker Desktop is running")
    console.error("   2. Check if PostgreSQL container is started:")
    console.error("      docker ps | grep postgres")
    console.error("   3. Verify connection string in .env:")
    console.error(`      DATABASE_URL=${result.connectionString.replace(/:[^:@]+@/, ":****@")}`)
    console.error("   4. For local PostgreSQL (not Docker), use:")
    console.error("      DB_HOST=localhost")
    console.error("      DB_PORT=5432")
    console.error("      DB_USER=postgres")
    console.error("      DB_PASSWORD=your_password")
    console.error("      DB_NAME=mythic")
    console.error("      DB_SSL=false\n")
  }

  return result
}

/**
 * Validate Direct Database connection
 */
export async function validateDirectConnection(): Promise<ValidationResult> {
  const result: ValidationResult = {
    success: false,
    method: "direct",
    connectionString: getConnectionString(),
    connectionTime: 0,
    databaseInfo: {
      version: "",
      database: "",
      user: "",
    },
    tables: [],
    schemaExists: false,
    errors: [],
    warnings: [],
  }

  console.log("🔌 Validating Direct Database Connection...\n")

  // Detect connection type
  const isNeon = result.connectionString.includes(".neon.tech")
  const isLocal =
    result.connectionString.includes("localhost") || result.connectionString.includes("127.0.0.1")

  if (isNeon) {
    console.log("   Detected: Neon PostgreSQL (Serverless)\n")
  } else if (isLocal) {
    console.log("   Detected: Local PostgreSQL\n")
  } else {
    console.log("   Detected: Remote PostgreSQL\n")
  }

  // Test connection
  const startTime = performance.now()
  try {
    const neonSql = neon(result.connectionString)
    const db = drizzle(neonSql, { schema })

    // Test basic connection using neon client directly (template literal syntax)
    const versionResult = await neonSql`SELECT version()`
    const version =
      Array.isArray(versionResult) && versionResult[0]
        ? (versionResult[0] as { version: string }).version
        : "Unknown"

    const dbInfoResult = await neonSql`SELECT current_database() as database, current_user as user`
    const dbInfo =
      Array.isArray(dbInfoResult) && dbInfoResult[0]
        ? (dbInfoResult[0] as { database: string; user: string })
        : { database: "Unknown", user: "Unknown" }

    result.connectionTime = performance.now() - startTime
    result.databaseInfo = {
      version,
      database: dbInfo.database,
      user: dbInfo.user,
    }

    // Check for tables using neon client directly
    const tablesResult = (await neonSql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `) as Array<{ table_name: string }>

    result.tables = tablesResult.map((t) => t.table_name)
    result.schemaExists = result.tables.length > 0

    result.success = true

    console.log("✅ Direct Database Connection Successful!\n")
    console.log(`   Connection Time: ${result.connectionTime.toFixed(2)}ms`)
    console.log(`   Database: ${result.databaseInfo.database}`)
    console.log(`   User: ${result.databaseInfo.user}`)
    console.log(
      `   PostgreSQL Version: ${result.databaseInfo.version.split(" ")[0]} ${result.databaseInfo.version.split(" ")[1]}`
    )
    console.log(`   Tables Found: ${result.tables.length}\n`)

    if (isNeon) {
      console.log("✨ Neon Serverless Features:")
      console.log("   - Connection pooling: Enabled")
      console.log("   - Serverless optimized: Yes")
      console.log("   - HTTP-based: Yes")

      // Check for channel binding
      const hasChannelBinding = result.connectionString.includes("channel_binding=require")
      if (hasChannelBinding) {
        console.log("   - Channel binding: ✅ Enabled (secure)")
      } else {
        console.log("   - Channel binding: ⚠️  Not set (recommended for production)")
        result.warnings.push(
          "Channel binding not enabled - consider adding channel_binding=require for enhanced security"
        )
      }
      console.log()
    }

    if (result.tables.length > 0) {
      console.log("📋 Existing Tables:")
      result.tables.forEach((table) => {
        console.log(`   - ${table}`)
      })
      console.log()
    } else {
      result.warnings.push("No tables found - schema may need to be created")
      console.log("⚠️  No tables found")
      console.log("   Run: pnpm db:push\n")
    }
  } catch (error) {
    result.connectionTime = performance.now() - startTime
    result.success = false
    const errorMessage = error instanceof Error ? error.message : String(error)
    result.errors.push(errorMessage)

    console.error("❌ Direct Database Connection Failed\n")
    console.error("   Error:", errorMessage)
    console.error("\n💡 Troubleshooting:")

    if (isNeon) {
      console.error("   For Neon Database:")
      console.error("   1. Verify DATABASE_URL in .env file")
      console.error("   2. Check if connection string uses pooler endpoint:")
      console.error("      Should include: -pooler.neon.tech")
      console.error("   3. Ensure SSL is enabled: ?sslmode=require")
      console.error("   4. Consider adding channel binding: &channel_binding=require")
      console.error("   5. Check Neon dashboard for connection status")
      console.error("   6. Verify credentials haven't been rotated\n")
    } else {
      console.error("   1. Verify database is running and accessible")
      console.error("   2. Check connection string in .env:")
      console.error(`      DATABASE_URL=${result.connectionString.replace(/:[^:@]+@/, ":****@")}`)
      console.error("   3. Verify network/firewall allows connection")
      console.error("   4. Check database credentials\n")
    }
  }

  return result
}

/**
 * Main validation function
 */
async function validateConnection(): Promise<ValidationResult> {
  console.log("🔍 Database Connection Validation\n")
  console.log("=".repeat(50))
  console.log()

  // Check for .env file (already loaded at top of file)
  const rootEnv = join(process.cwd(), ".env")
  const appEnv = join(process.cwd(), "apps", "boardroom", ".env")
  const envPath = existsSync(appEnv) ? appEnv : existsSync(rootEnv) ? rootEnv : null
  if (envPath) {
    console.log(`📄 Using .env file: ${envPath}\n`)
  } else {
    console.warn("⚠️  .env file not found")
    console.warn("   Create .env file with DATABASE_URL or DB_* variables")
    console.warn("   Location: .env (root) or apps/boardroom/.env")
    console.warn("   Continuing with environment variables from process.env...\n")
  }

  // Detect connection method
  const method = detectConnectionMethod()
  console.log(
    `📡 Connection Method: ${method === "docker" ? "Docker Desktop" : method === "direct" ? "Direct Database" : "Unknown"}\n`
  )

  // Validate based on method
  if (method === "docker") {
    return validateDockerConnection()
  } else if (method === "direct") {
    return validateDirectConnection()
  } else {
    console.error("❌ Could not detect connection method")
    console.error("   Please set DATABASE_URL or DB_* environment variables\n")
    process.exit(1)
  }
}

/**
 * Print setup instructions
 */
function printSetupInstructions(method: "docker" | "direct") {
  console.log("\n📚 Setup Instructions:\n")

  if (method === "docker") {
    console.log("🐳 Docker Desktop Setup:")
    console.log("   1. Start Docker Desktop")
    console.log("   2. Run PostgreSQL container:")
    console.log("      docker run -d \\")
    console.log("        --name postgres-mythic \\")
    console.log("        -e POSTGRES_PASSWORD=your_password \\")
    console.log("        -e POSTGRES_DB=mythic \\")
    console.log("        -p 5432:5432 \\")
    console.log("        postgres:15")
    console.log("   3. Update .env file:")
    console.log("      DB_HOST=localhost")
    console.log("      DB_PORT=5432")
    console.log("      DB_USER=postgres")
    console.log("      DB_PASSWORD=your_password")
    console.log("      DB_NAME=mythic")
    console.log("      DB_SSL=false")
    console.log("   4. Run: pnpm validate:db\n")
  } else {
    console.log("🔌 Direct Database Setup:")
    console.log("   Option A: Neon (Recommended for Serverless)")
    console.log("   1. Sign up at https://neon.tech")
    console.log("   2. Create a new project")
    console.log("   3. Copy connection string to .env:")
    console.log(
      "      DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.neon.tech/db?sslmode=require"
    )
    console.log("   4. Run: pnpm validate:db\n")
    console.log("   Option B: Local PostgreSQL")
    console.log("   1. Install PostgreSQL 15+")
    console.log("   2. Create database: CREATE DATABASE mythic;")
    console.log("   3. Update .env file:")
    console.log("      DB_HOST=localhost")
    console.log("      DB_PORT=5432")
    console.log("      DB_USER=postgres")
    console.log("      DB_PASSWORD=your_password")
    console.log("      DB_NAME=mythic")
    console.log("      DB_SSL=false")
    console.log("   4. Run: pnpm validate:db\n")
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    const result = await validateConnection()

    // Print summary
    console.log("\n" + "=".repeat(50))
    console.log("📊 Validation Summary\n")
    console.log(`   Method: ${result.method === "docker" ? "Docker Desktop" : "Direct Database"}`)
    console.log(`   Status: ${result.success ? "✅ Success" : "❌ Failed"}`)
    console.log(`   Connection Time: ${result.connectionTime.toFixed(2)}ms`)
    console.log(`   Tables Found: ${result.tables.length}`)
    console.log(`   Schema Exists: ${result.schemaExists ? "✅" : "❌"}`)

    if (result.warnings.length > 0) {
      console.log("\n   ⚠️  Warnings:")
      result.warnings.forEach((warning) => {
        console.log(`      - ${warning}`)
      })
    }

    if (result.errors.length > 0) {
      console.log("\n   ❌ Errors:")
      result.errors.forEach((error) => {
        console.log(`      - ${error}`)
      })
    }

    if (!result.success) {
      printSetupInstructions(result.method)
      process.exit(1)
    }

    if (!result.schemaExists) {
      console.log("\n💡 Next Steps:")
      console.log("   1. Create schema: pnpm db:push")
      console.log("   2. Verify: pnpm validate:db\n")
    } else {
      console.log("\n✅ Database is ready to use!\n")
    }
  } catch (error) {
    console.error("❌ Validation failed:", error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

// Functions are already exported above, no need to re-export
