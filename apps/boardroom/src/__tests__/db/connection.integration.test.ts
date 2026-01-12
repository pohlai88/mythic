/**
 * Integration Tests for Database Connection Validation
 *
 * Tests with real database connections (Docker or Neon).
 * These tests run sequentially to avoid connection conflicts.
 * Requires actual database setup.
 *
 * To run these tests:
 * 1. Start Docker: pnpm docker:up
 * 2. Or configure Neon: Set TEST_NEON_URL in .env.test
 * 3. Run: pnpm test:db:integration
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import {
  validateConnection,
  validateDockerConnection,
  validateDirectConnection,
  detectConnectionMethod,
  type ValidationResult,
} from '../../../scripts/validate-db-connection'
import {
  createTestConnection,
  cleanupAllTestConnections,
  createTestEnv,
  clearTestEnv,
  getDockerTestConnectionString,
  getNeonTestConnectionString,
  waitForDatabase,
} from './helpers'
import { expectedTables } from './fixtures'

/**
 * Skip integration tests if no database is configured
 */
const hasTestDatabase =
  process.env.TEST_DATABASE_URL ||
  process.env.TEST_NEON_URL ||
  (process.env.DB_HOST && process.env.DB_HOST !== 'localhost')

const skipIfNoDb = hasTestDatabase ? describe : describe.skip

skipIfNoDb('Database Connection Validation - Integration Tests', () => {
  beforeAll(() => {
    // Set up test environment
    createTestEnv()
  })

  afterAll(() => {
    // Clean up
    cleanupAllTestConnections()
    clearTestEnv()
  })

  describe('Connection Method Detection', () => {
    it('should correctly detect connection method from environment', () => {
      const method = detectConnectionMethod()
      expect(['docker', 'direct', 'unknown']).toContain(method)
    })
  })

  describe('Docker Connection (if configured)', () => {
    it('should successfully connect to Docker PostgreSQL', async () => {
      // Only run if Docker is configured
      if (process.env.DB_HOST === 'localhost' || process.env.TEST_DATABASE_URL) {
        const result = await validateDockerConnection()

        expect(result.method).toBe('docker')
        expect(result.success).toBe(true)
        expect(result.connectionTime).toBeGreaterThan(0)
        expect(result.databaseInfo.database).toBeTruthy()
        expect(result.databaseInfo.user).toBeTruthy()
        expect(result.databaseInfo.version).toContain('PostgreSQL')
      }
    }, 30000)

    it('should list existing tables', async () => {
      if (process.env.DB_HOST === 'localhost' || process.env.TEST_DATABASE_URL) {
        const result = await validateDockerConnection()

        if (result.success && result.schemaExists) {
          expect(result.tables.length).toBeGreaterThan(0)
          // Check for expected tables
          const hasProposals = result.tables.some((t) => t.includes('proposal'))
          expect(hasProposals).toBe(true)
        }
      }
    }, 30000)
  })

  describe('Neon Connection (if configured)', () => {
    it('should successfully connect to Neon PostgreSQL', async () => {
      // Only run if Neon is configured
      if (process.env.DATABASE_URL?.includes('.neon.tech') || process.env.TEST_NEON_URL) {
        const result = await validateDirectConnection()

        expect(result.method).toBe('direct')
        expect(result.success).toBe(true)
        expect(result.connectionTime).toBeGreaterThan(0)
        expect(result.connectionTime).toBeLessThan(5000) // Should be < 5s
        expect(result.databaseInfo.database).toBeTruthy()
        expect(result.databaseInfo.user).toBeTruthy()
      }
    }, 30000)

    it('should detect channel binding when present', async () => {
      if (process.env.DATABASE_URL?.includes('.neon.tech') || process.env.TEST_NEON_URL) {
        const result = await validateDirectConnection()

        if (result.success) {
          const hasChannelBinding = result.connectionString.includes('channel_binding=require')
          if (hasChannelBinding) {
            // Should not have warning about missing channel binding
            const hasWarning = result.warnings.some((w) => w.includes('channel binding'))
            expect(hasWarning).toBe(false)
          }
        }
      }
    }, 30000)

    it('should measure connection time accurately', async () => {
      if (process.env.DATABASE_URL?.includes('.neon.tech') || process.env.TEST_NEON_URL) {
        const result = await validateDirectConnection()

        if (result.success) {
          // Connection time should be reasonable (< 5s for Neon)
          expect(result.connectionTime).toBeGreaterThan(0)
          expect(result.connectionTime).toBeLessThan(5000)
        }
      }
    }, 30000)
  })

  describe('Full Connection Workflow', () => {
    it('should complete full validation workflow', async () => {
      const result = await validateConnection()

      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('method')
      expect(result).toHaveProperty('connectionTime')
      expect(result).toHaveProperty('databaseInfo')
      expect(result).toHaveProperty('tables')
      expect(result).toHaveProperty('schemaExists')
      expect(result).toHaveProperty('errors')
      expect(result).toHaveProperty('warnings')
    }, 30000)

    it('should provide helpful error messages on failure', async () => {
      // Temporarily break connection
      const originalUrl = process.env.DATABASE_URL
      const originalHost = process.env.DB_HOST

      process.env.DATABASE_URL = 'postgresql://wrong:wrong@invalid:5432/wrong'
      delete process.env.DB_HOST

      try {
        const result = await validateConnection()

        if (!result.success) {
          expect(result.errors.length).toBeGreaterThan(0)
          expect(result.errors[0]).toBeTruthy()
        }
      } finally {
        // Restore
        if (originalUrl) process.env.DATABASE_URL = originalUrl
        if (originalHost) process.env.DB_HOST = originalHost
      }
    }, 30000)
  })

  describe('Schema Validation', () => {
    it('should detect if schema exists', async () => {
      const result = await validateConnection()

      if (result.success) {
        expect(result.schemaExists).toBe(result.tables.length > 0)
      }
    }, 30000)

    it('should list all expected tables when schema exists', async () => {
      const result = await validateConnection()

      if (result.success && result.schemaExists) {
        // Check for some expected tables
        const tableNames = result.tables.map((t) => t.toLowerCase())
        const hasProposals = tableNames.some((t) => t.includes('proposal'))
        const hasCircles = tableNames.some((t) => t.includes('circle'))

        // At least some expected tables should exist
        expect(hasProposals || hasCircles).toBe(true)
      }
    }, 30000)
  })

  describe('Performance', () => {
    it('should connect within reasonable time (< 5s)', async () => {
      const result = await validateConnection()

      if (result.success) {
        expect(result.connectionTime).toBeLessThan(5000)
      }
    }, 30000)

    it('should have consistent connection times', async () => {
      const times: number[] = []

      for (let i = 0; i < 3; i++) {
        const result = await validateConnection()
        if (result.success) {
          times.push(result.connectionTime)
        }
        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      if (times.length > 1) {
        // Connection times should be relatively consistent
        const avg = times.reduce((a, b) => a + b, 0) / times.length
        const variance = times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / times.length
        const stdDev = Math.sqrt(variance)

        // Standard deviation should be reasonable (< 50% of average)
        expect(stdDev).toBeLessThan(avg * 0.5)
      }
    }, 60000)
  })
})
