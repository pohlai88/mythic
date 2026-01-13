/**
 * Mock Implementations for Database Connection Testing
 *
 * Provides optimized mocks for Neon and Docker connections
 * to enable fast unit tests without real database dependencies.
 */

import { vi } from "vitest"

/**
 * Mock Neon client response
 */
export interface MockNeonResponse {
  version?: string
  database?: string
  user?: string
  tables?: Array<{ table_name: string }>
}

/**
 * Create a mock Neon client
 *
 * Neon client uses template literal syntax: neon`SELECT ...`
 * This mock handles both template literal and direct calls
 */
export function createMockNeonClient(
  mockResponses: {
    version?: MockNeonResponse
    dbInfo?: MockNeonResponse
    tables?: MockNeonResponse
  } = {}
) {
  const defaultVersion = mockResponses.version || {
    version: "PostgreSQL 15.3 on x86_64-pc-linux-gnu",
  }

  const defaultDbInfo = mockResponses.dbInfo || {
    database: "test_db",
    user: "test_user",
  }

  const defaultTables = mockResponses.tables || {
    tables: [{ table_name: "proposals" }, { table_name: "circles" }, { table_name: "broadcasts" }],
  }

  // Create a function that handles template literal calls
  const mockClient = vi.fn(async (strings: TemplateStringsArray | string, ...values: any[]) => {
    // Handle template literal: neon`SELECT ...`
    let query = ""
    if (typeof strings === "string") {
      query = strings
    } else if (Array.isArray(strings)) {
      query = strings.join("")
    }

    if (query.includes("version()")) {
      return [defaultVersion]
    }
    if (query.includes("current_database") || query.includes("current_user")) {
      return [defaultDbInfo]
    }
    if (query.includes("information_schema.tables")) {
      return Array.isArray(defaultTables.tables) ? defaultTables.tables : []
    }
    return []
  })

  return mockClient
}

/**
 * Mock Neon module
 */
export function mockNeonModule() {
  const mockClient = createMockNeonClient()

  return {
    neon: vi.fn(() => mockClient),
    neonConfig: {
      pipelineConnect: false,
    },
  }
}

/**
 * Mock Docker connection check
 */
export function mockDockerCheck(isRunning: boolean = true) {
  return vi.fn(async () => {
    if (isRunning) {
      return { stdout: "CONTAINER ID", stderr: "" }
    }
    throw new Error("Docker is not running")
  })
}

/**
 * Mock database connection error
 */
export function createMockConnectionError(message: string = "Connection failed") {
  return new Error(message)
}

/**
 * Mock validation result
 */
export function createMockValidationResult(
  overrides: Partial<{
    success: boolean
    method: "docker" | "direct" | "unknown"
    connectionTime: number
    tables: string[]
    errors: string[]
    warnings: string[]
  }> = {}
) {
  return {
    success: true,
    method: "docker" as const,
    connectionString: "postgresql://user:pass@localhost:5432/test",
    connectionTime: 10,
    databaseInfo: {
      version: "PostgreSQL 15.3",
      database: "test_db",
      user: "test_user",
    },
    tables: ["proposals", "circles"],
    schemaExists: true,
    errors: [],
    warnings: [],
    ...overrides,
  }
}
