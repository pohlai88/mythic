/**
 * Drizzle Configuration for BoardRoom App
 * 
 * Uses validated environment variables via Zod schema.
 */

import { defineConfig } from 'drizzle-kit'
import { getDatabaseConfig } from './src/lib/env'

// Get validated database configuration
const dbConfig = getDatabaseConfig()

export default defineConfig({
  schema: './src/db/schema/*.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: dbConfig,
  verbose: true,
  strict: true,
})
