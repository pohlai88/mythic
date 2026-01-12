/**
 * Test Utilities for Database Connection Testing
 *
 * Provides optimized helpers for connection pooling, cleanup, and test setup.
 */

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@/src/db/schema'

/**
 * Test database connection type
 */
export type TestConnection = ReturnType<typeof drizzle>

/**
 * Connection pool for test reuse
 */
let testConnectionPool: Map<string, TestConnection> = new Map()

/**
 * Create a test database connection
 *
 * Reuses connections from pool to optimize test performance.
 */
export function createTestConnection(
  connectionString: string,
  poolKey?: string
): TestConnection {
  const key = poolKey || connectionString

  // Reuse existing connection if available
  if (testConnectionPool.has(key)) {
    return testConnectionPool.get(key)!
  }

  // Create new connection
  const sql = neon(connectionString)
  const db = drizzle(sql, { schema })

  // Store in pool
  testConnectionPool.set(key, db)

  return db
}

/**
 * Clean up a test connection
 */
export async function cleanupTestConnection(
  connection: TestConnection,
  poolKey?: string
): Promise<void> {
  // Note: Neon HTTP connections don't need explicit cleanup
  // but we remove from pool
  if (poolKey) {
    testConnectionPool.delete(poolKey)
  }
}

/**
 * Clean up all test connections
 */
export function cleanupAllTestConnections(): void {
  testConnectionPool.clear()
}

/**
 * Create test environment variables
 *
 * @param overrides - Environment variables to set
 * @param setDefaults - Whether to set default values for unset variables (default: true)
 */
export function createTestEnv(overrides: Record<string, string> = {}, setDefaults: boolean = true): void {
  // Clear existing values first
  clearTestEnv()

  // Set default test environment only if not overridden
  process.env.NODE_ENV = 'test'

  // Check if individual DB_* variables are being set
  const hasIndividualDbVars =
    'DB_HOST' in overrides ||
    'DB_PORT' in overrides ||
    'DB_USER' in overrides ||
    'DB_PASSWORD' in overrides ||
    'DB_NAME' in overrides ||
    'DB_SSL' in overrides

  // Only set DATABASE_URL if it's explicitly provided or no individual vars are set
  if (setDefaults && !('DATABASE_URL' in overrides) && !hasIndividualDbVars) {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
  }

  // If individual DB_* vars are provided, ensure DATABASE_URL is not set
  // (so getConnectionString will build from individual vars)
  if (hasIndividualDbVars && !('DATABASE_URL' in overrides)) {
    delete process.env.DATABASE_URL
  }

  // Set defaults only if setDefaults is true
  if (setDefaults) {
    if (!('DB_HOST' in overrides)) {
      process.env.DB_HOST = 'localhost'
    }
    if (!('DB_PORT' in overrides)) {
      process.env.DB_PORT = '5432'
    }
    if (!('DB_USER' in overrides)) {
      process.env.DB_USER = 'test'
    }
    if (!('DB_PASSWORD' in overrides)) {
      process.env.DB_PASSWORD = 'test'
    }
    if (!('DB_NAME' in overrides)) {
      process.env.DB_NAME = 'test_db'
    }
    if (!('DB_SSL' in overrides)) {
      process.env.DB_SSL = 'false'
    }
  }

  // Apply overrides (this will override defaults)
  Object.entries(overrides).forEach(([key, value]) => {
    process.env[key] = value
  })
}

/**
 * Clear test environment variables
 */
export function clearTestEnv(): void {
  delete process.env.DATABASE_URL
  delete process.env.DB_HOST
  delete process.env.DB_PORT
  delete process.env.DB_USER
  delete process.env.DB_PASSWORD
  delete process.env.DB_NAME
  delete process.env.DB_SSL
}

/**
 * Wait for database to be ready
 */
export async function waitForDatabase(
  connection: TestConnection,
  maxRetries: number = 5,
  delayMs: number = 1000
): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Try a simple query using sql template
      const { sql } = await import('drizzle-orm')
      await connection.execute(sql`SELECT 1`)
      return true
    } catch (error) {
      if (i === maxRetries - 1) {
        return false
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
  return false
}

/**
 * Check if connection string is valid
 */
export function isValidConnectionString(connectionString: string): boolean {
  try {
    const url = new URL(connectionString)
    return url.protocol === 'postgresql:' || url.protocol === 'postgres:'
  } catch {
    return false
  }
}

/**
 * Get test connection string for Docker
 */
export function getDockerTestConnectionString(): string {
  return (
    process.env.TEST_DATABASE_URL ||
    `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'test_db'}`
  )
}

/**
 * Get test connection string for Neon
 */
export function getNeonTestConnectionString(): string {
  return (
    process.env.TEST_NEON_URL ||
    'postgresql://test:test@ep-test-pooler.region.aws.neon.tech/test?sslmode=require&channel_binding=require'
  )
}
