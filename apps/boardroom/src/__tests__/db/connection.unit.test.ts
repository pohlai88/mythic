/**
 * Unit Tests for Database Connection Validation
 *
 * Fast unit tests using mocks - no real database connections required.
 * Tests connection detection, error handling, and validation logic.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  detectConnectionMethod,
  getConnectionString,
  validateDockerConnection,
  validateDirectConnection,
  type ValidationResult,
} from '../../../scripts/validate-db-connection'
import {
  createMockNeonClient,
  mockNeonModule,
  createMockValidationResult,
} from './mocks'
import { createTestEnv, clearTestEnv } from './helpers'
import { dockerConnectionStrings, neonConnectionStrings, invalidConnectionStrings } from './fixtures'

// Mock Neon module - inline factory to avoid hoisting issues
vi.mock('@neondatabase/serverless', async () => {
  const { vi } = await import('vitest')
  const mockClient = vi.fn(async (strings: TemplateStringsArray | string) => {
    const query = typeof strings === 'string' ? strings : strings.join('')
    if (query.includes('version()')) {
      return [{ version: 'PostgreSQL 15.3' }]
    }
    if (query.includes('current_database') || query.includes('current_user')) {
      return [{ database: 'test_db', user: 'test_user' }]
    }
    if (query.includes('information_schema.tables')) {
      return [{ table_name: 'proposals' }, { table_name: 'circles' }]
    }
    return []
  })
  return {
    neon: vi.fn(() => mockClient),
    neonConfig: { pipelineConnect: false },
  }
})

// Mock child_process for Docker check
vi.mock('child_process', () => ({
  exec: vi.fn(),
}))

describe('Database Connection Validation - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearTestEnv()
  })

  afterEach(() => {
    clearTestEnv()
  })

  describe('detectConnectionMethod', () => {
    it('should detect Docker connection for localhost', () => {
      createTestEnv({ DB_HOST: 'localhost' })
      expect(detectConnectionMethod()).toBe('docker')
    })

    it('should detect Docker connection for 127.0.0.1', () => {
      createTestEnv({ DB_HOST: '127.0.0.1' })
      expect(detectConnectionMethod()).toBe('docker')
    })

    it('should detect direct connection for Neon', () => {
      createTestEnv({
        DATABASE_URL: neonConnectionStrings.withChannelBinding,
      })
      expect(detectConnectionMethod()).toBe('direct')
    })

    it('should detect direct connection for other cloud providers', () => {
      createTestEnv({
        DATABASE_URL: 'postgresql://user:pass@db.example.com:5432/db',
      })
      expect(detectConnectionMethod()).toBe('direct')
    })

    it('should return unknown when no connection info provided', () => {
      clearTestEnv()
      expect(detectConnectionMethod()).toBe('unknown')
    })
  })

  describe('getConnectionString', () => {
    it('should return DATABASE_URL if provided', () => {
      const url = neonConnectionStrings.withChannelBinding
      createTestEnv({ DATABASE_URL: url })
      expect(getConnectionString()).toBe(url)
    })

    it('should construct connection string from individual variables', () => {
      createTestEnv({
        DB_HOST: 'localhost',
        DB_PORT: '5432',
        DB_USER: 'postgres',
        DB_PASSWORD: 'password',
        DB_NAME: 'mythic',
        DB_SSL: 'false',
      })
      const result = getConnectionString()
      expect(result).toContain('postgresql://postgres:password@localhost:5432/mythic')
    })

    it('should include SSL parameter when DB_SSL is true', () => {
      createTestEnv({
        DB_HOST: 'localhost',
        DB_USER: 'postgres',
        DB_PASSWORD: 'password',
        DB_NAME: 'mythic',
        DB_SSL: 'true',
      })
      const result = getConnectionString()
      expect(result).toContain('sslmode=require')
    })

    it('should use default values when variables are missing', () => {
      // Don't set defaults so getConnectionString() can use its own defaults
      createTestEnv({
        DB_HOST: 'localhost',
      }, false) // setDefaults = false
      const result = getConnectionString()
      expect(result).toContain('localhost')
      expect(result).toContain('5432')
      expect(result).toContain('postgres')
      expect(result).toContain('mythic')
    })
  })

  describe('validateDockerConnection', () => {
    it('should successfully validate Docker connection with mocks', async () => {
      createTestEnv({
        DB_HOST: 'localhost',
        DB_PORT: '5432',
        DB_USER: 'postgres',
        DB_PASSWORD: 'password',
        DB_NAME: 'mythic',
      })

      // Mock successful Docker check
      const { exec } = await import('child_process')
      const mockExec = vi.mocked(exec)
      mockExec.mockImplementation((command, callback) => {
        if (callback) {
          // @ts-expect-error - callback signature
          callback(null, { stdout: 'CONTAINER ID', stderr: '' }, '')
        }
        return {} as any
      })

      // Mock Neon client for connection test
      const mockClient = createMockNeonClient({
        version: { version: 'PostgreSQL 15.3' },
        dbInfo: { database: 'mythic', user: 'postgres' },
        tables: {
          tables: [{ table_name: 'proposals' }, { table_name: 'circles' }],
        },
      })

      const { neon } = await import('@neondatabase/serverless')
      const mockNeon = vi.mocked(neon)
      mockNeon.mockReturnValue(mockClient as any)

      const result = await validateDockerConnection()

      expect(result.success).toBe(true)
      expect(result.method).toBe('docker')
      expect(result.databaseInfo.database).toBe('mythic')
      expect(result.tables.length).toBeGreaterThan(0)
    })

    it('should handle connection errors gracefully', async () => {
      createTestEnv({
        DB_HOST: 'localhost',
        DB_PORT: '5432',
        DB_USER: 'postgres',
        DB_PASSWORD: 'wrong_password',
        DB_NAME: 'mythic',
      })

      // Mock connection error
      const { neon } = await import('@neondatabase/serverless')
      const mockNeon = vi.mocked(neon)
      mockNeon.mockImplementation(() => {
        throw new Error('Connection failed')
      })

      const result = await validateDockerConnection()

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should detect when Docker is not running', async () => {
      createTestEnv({
        DB_HOST: 'localhost',
      })

      // Mock Docker check failure
      const { exec } = await import('child_process')
      const mockExec = vi.mocked(exec)
      mockExec.mockImplementation((command, callback) => {
        if (callback) {
          // @ts-expect-error - callback signature
          callback(new Error('Docker not running'), { stdout: '', stderr: 'error' }, '')
        }
        return {} as any
      })

      const result = await validateDockerConnection()

      // Should still attempt connection but may fail
      expect(result.method).toBe('docker')
    })
  })

  describe('validateDirectConnection', () => {
    it('should successfully validate Neon connection with channel binding', async () => {
      createTestEnv({
        DATABASE_URL: neonConnectionStrings.withChannelBinding,
      })

      const mockClient = createMockNeonClient({
        version: { version: 'PostgreSQL 15.3' },
        dbInfo: { database: 'neondb', user: 'neondb_owner' },
        tables: {
          tables: [{ table_name: 'proposals' }, { table_name: 'circles' }],
        },
      })

      const { neon } = await import('@neondatabase/serverless')
      const mockNeon = vi.mocked(neon)
      mockNeon.mockReturnValue(mockClient as any)

      const result = await validateDirectConnection()

      expect(result.success).toBe(true)
      expect(result.method).toBe('direct')
      expect(result.connectionString).toContain('channel_binding=require')
      expect(result.warnings.length).toBe(0) // Channel binding enabled
    })

    it('should warn when channel binding is missing', async () => {
      createTestEnv({
        DATABASE_URL: neonConnectionStrings.withoutChannelBinding,
      })

      const mockClient = createMockNeonClient({
        version: { version: 'PostgreSQL 15.3' },
        dbInfo: { database: 'neondb', user: 'neondb_owner' },
      })

      const { neon } = await import('@neondatabase/serverless')
      const mockNeon = vi.mocked(neon)
      mockNeon.mockReturnValue(mockClient as any)

      const result = await validateDirectConnection()

      expect(result.success).toBe(true)
      // Should have warning about channel binding (case-insensitive check)
      const hasChannelBindingWarning = result.warnings.some((w) =>
        w.toLowerCase().includes('channel binding')
      )
      expect(hasChannelBindingWarning).toBe(true)
    })

    it('should handle connection timeout errors', async () => {
      createTestEnv({
        DATABASE_URL: neonConnectionStrings.withChannelBinding,
      })

      // Mock timeout error
      const { neon } = await import('@neondatabase/serverless')
      const mockNeon = vi.mocked(neon)
      mockNeon.mockImplementation(() => {
        const mockClient = vi.fn(async () => {
          throw new Error('Connection timeout')
        })
        return mockClient as any
      })

      const result = await validateDirectConnection()

      expect(result.success).toBe(false)
      expect(result.errors.some((e) => e.includes('timeout'))).toBe(true)
    })

    it('should handle authentication failures', async () => {
      createTestEnv({
        DATABASE_URL: 'postgresql://wrong:wrong@ep-test.neon.tech/db?sslmode=require',
      })

      // Mock auth error
      const { neon } = await import('@neondatabase/serverless')
      const mockNeon = vi.mocked(neon)
      mockNeon.mockImplementation(() => {
        const mockClient = vi.fn(async () => {
          throw new Error('Authentication failed')
        })
        return mockClient as any
      })

      const result = await validateDirectConnection()

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle missing DATABASE_URL and DB_* variables', () => {
      clearTestEnv()
      expect(() => getConnectionString()).not.toThrow()
      // Should construct with defaults
      const result = getConnectionString()
      expect(result).toContain('localhost')
    })

    it('should handle invalid connection string format', async () => {
      createTestEnv({
        DATABASE_URL: invalidConnectionStrings.malformed,
      })

      const { neon } = await import('@neondatabase/serverless')
      const mockNeon = vi.mocked(neon)
      mockNeon.mockImplementation(() => {
        throw new Error('Invalid connection string')
      })

      const result = await validateDirectConnection()
      expect(result.success).toBe(false)
    })
  })
})
