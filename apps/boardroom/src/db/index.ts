/**
 * Database Connection for BoardRoom App
 *
 * The Apex - Executive Board Decision Engine
 *
 * Uses validated environment variables via Zod schema.
 * Uses Neon Serverless Driver for optimal serverless performance.
 */

import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { getDatabaseUrl } from "@/src/lib/env"
import * as schema from "./schema"

// Configure Neon for optimal serverless performance
// Production-ready configuration
neonConfig.pipelineConnect = false // Required for Drizzle compatibility
// Note: fetchConnectionCache is always enabled (deprecated option removed)
// Connection pooling is handled automatically by Neon pooler endpoint

// Production optimizations
if (process.env.NODE_ENV === "production") {
  // Production-specific optimizations can be added here
  // Neon automatically handles connection pooling via pooler endpoint
}

// Get connection string with validation
let connectionString: string
try {
  connectionString = getDatabaseUrl()
} catch (error) {
  // Provide helpful error message if configuration is missing
  if (error instanceof Error && error.message.includes("required")) {
    throw new Error(
      "Database configuration is missing. Please set DATABASE_URL in your .env file.\n\n" +
        "Option 1 (Recommended): Set DATABASE_URL\n" +
        "  DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require\n\n" +
        "Option 2: Set individual variables\n" +
        "  DB_HOST=localhost\n" +
        "  DB_PORT=5432\n" +
        "  DB_USER=postgres\n" +
        "  DB_PASSWORD=your_password\n" +
        "  DB_NAME=mythic\n" +
        "  DB_SSL=false\n\n" +
        "See docs/architecture/ENVIRONMENT_VARIABLES.md for more details."
    )
  }
  throw error
}

// Create Neon serverless SQL client
// Neon handles connection pooling automatically
const sql = neon(connectionString)

export const db = drizzle(sql, { schema })

// Export types
export type Database = typeof db
export * from "./schema"
