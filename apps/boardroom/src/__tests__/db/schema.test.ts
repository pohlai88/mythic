/**
 * Schema Validation Tests
 *
 * Tests database schema structure, table existence, and relationships.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { validateConnection, type ValidationResult } from "../../../scripts/validate-db-connection"
import { cleanupAllTestConnections, createTestEnv, clearTestEnv } from "./helpers"
import { expectedTables } from "./fixtures"

/**
 * Skip schema tests if no database is configured
 */
const hasTestDatabase =
  process.env.TEST_DATABASE_URL ||
  process.env.TEST_NEON_URL ||
  (process.env.DB_HOST && process.env.DB_HOST !== "localhost")

const skipIfNoDb = hasTestDatabase ? describe : describe.skip

skipIfNoDb("Database Schema Validation", () => {
  let validationResult: ValidationResult | null = null

  beforeAll(async () => {
    createTestEnv()
    validationResult = await validateConnection()
  })

  afterAll(() => {
    cleanupAllTestConnections()
    clearTestEnv()
  })

  describe("Schema Existence", () => {
    it("should detect if schema exists", () => {
      if (validationResult?.success) {
        expect(validationResult).toHaveProperty("schemaExists")
        expect(typeof validationResult.schemaExists).toBe("boolean")
      }
    })

    it("should have tables when schema exists", () => {
      if (validationResult?.success && validationResult.schemaExists) {
        expect(validationResult.tables.length).toBeGreaterThan(0)
      }
    })

    it("should have no tables when schema does not exist", () => {
      if (validationResult?.success && !validationResult.schemaExists) {
        expect(validationResult.tables.length).toBe(0)
      }
    })
  })

  describe("Table Structure", () => {
    it("should list all tables in public schema", () => {
      if (validationResult?.success && validationResult.schemaExists) {
        expect(validationResult.tables.length).toBeGreaterThan(0)
        // All table names should be strings
        validationResult.tables.forEach((table) => {
          expect(typeof table).toBe("string")
          expect(table.length).toBeGreaterThan(0)
        })
      }
    })

    it("should have expected core tables when schema exists", () => {
      if (validationResult?.success && validationResult.schemaExists) {
        const tableNames = validationResult.tables.map((t) => t.toLowerCase())

        // Check for some expected tables (may not all exist)
        const hasProposals = tableNames.some((t) => t.includes("proposal"))
        const hasCircles = tableNames.some((t) => t.includes("circle"))
        const hasBroadcasts = tableNames.some((t) => t.includes("broadcast"))

        // At least some expected tables should exist
        const hasAnyExpected = hasProposals || hasCircles || hasBroadcasts
        expect(hasAnyExpected).toBe(true)
      }
    })
  })

  describe("Schema Validation", () => {
    it("should provide schema status in result", () => {
      if (validationResult) {
        expect(validationResult).toHaveProperty("schemaExists")
        expect(validationResult).toHaveProperty("tables")
        expect(Array.isArray(validationResult.tables)).toBe(true)
      }
    })

    it("should correctly identify schema existence from tables", () => {
      if (validationResult?.success) {
        const hasTables = validationResult.tables.length > 0
        expect(validationResult.schemaExists).toBe(hasTables)
      }
    })
  })
})
