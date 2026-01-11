/**
 * Database Connection for BoardRoom App
 *
 * The Apex - Executive Board Decision Engine
 * 
 * Uses validated environment variables via Zod schema.
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { getDatabaseUrl } from '@/src/lib/env'
import * as schema from './schema'

// Database connection using validated environment variables
const connectionString = getDatabaseUrl()

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(client, { schema })

// Export types
export type Database = typeof db
export * from './schema'
