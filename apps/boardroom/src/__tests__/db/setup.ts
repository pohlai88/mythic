/**
 * Database Test Setup
 *
 * Global setup and teardown for database connection tests.
 * Handles connection pooling and cleanup.
 */

import { beforeAll, afterAll, beforeEach, afterEach } from "vitest"
import { cleanupAllTestConnections, clearTestEnv } from "./helpers"

/**
 * Global setup - runs once before all tests
 */
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = "test"
})

/**
 * Global teardown - runs once after all tests
 */
afterAll(() => {
  // Clean up all test connections
  cleanupAllTestConnections()

  // Clear test environment
  clearTestEnv()
})

/**
 * Per-test setup - runs before each test
 */
beforeEach(() => {
  // Reset any test-specific state
})

/**
 * Per-test teardown - runs after each test
 */
afterEach(() => {
  // Clean up test-specific state
  // Note: Connections are pooled and reused, so we don't clean them here
})
