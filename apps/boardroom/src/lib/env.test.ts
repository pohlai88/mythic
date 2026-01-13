/**
 * Environment Variable Validation Tests
 *
 * Tests for environment variable validation and parsing utilities.
 */

import { describe, it, expect, beforeEach, vi } from "vitest"
import { safeParseEnv, getDatabaseConfig } from "./env"

describe("env utilities", () => {
  beforeEach(() => {
    // Reset environment variables before each test
    vi.resetModules()
  })

  describe("safeParseEnv", () => {
    it("should parse valid environment variables", () => {
      // Mock environment variables
      process.env.DATABASE_URL = "postgresql://user:pass@host:5432/db"
      process.env.NODE_ENV = "test"
      process.env.ANALYTICS_ENABLED = "true"

      const result = safeParseEnv()

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.DATABASE_URL).toBe("postgresql://user:pass@host:5432/db")
        expect(result.data.NODE_ENV).toBe("test")
        expect(result.data.ANALYTICS_ENABLED).toBe(true)
      }
    })

    it("should use default values when variables are not set", () => {
      // Clear environment variables
      delete process.env.DATABASE_URL
      delete process.env.DB_HOST
      delete process.env.DB_PORT
      delete process.env.DB_USER
      delete process.env.DB_NAME
      delete process.env.NODE_ENV

      const result = safeParseEnv()

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.DB_HOST).toBe("localhost")
        expect(result.data.DB_PORT).toBe(5432)
        expect(result.data.DB_USER).toBe("postgres")
        expect(result.data.DB_NAME).toBe("mythic")
        expect(result.data.NODE_ENV).toBe("development")
      }
    })

    it("should transform boolean strings correctly", () => {
      process.env.DB_SSL = "true"
      process.env.ANALYTICS_ENABLED = "false"

      const result = safeParseEnv()

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.DB_SSL).toBe(true)
        expect(result.data.ANALYTICS_ENABLED).toBe(false)
      }
    })

    it("should transform numeric strings correctly", () => {
      process.env.DB_PORT = "3306"
      process.env.ANALYTICS_RETENTION_DAYS = "30"

      const result = safeParseEnv()

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.DB_PORT).toBe(3306)
        expect(result.data.ANALYTICS_RETENTION_DAYS).toBe(30)
      }
    })
  })

  describe("getDatabaseConfig", () => {
    it("should parse DATABASE_URL correctly", () => {
      process.env.DATABASE_URL =
        "postgresql://user:password@host.example.com:5432/mydb?sslmode=require"

      const config = getDatabaseConfig()

      expect(config.host).toBe("host.example.com")
      expect(config.port).toBe(5432)
      expect(config.user).toBe("user")
      expect(config.password).toBe("password")
      expect(config.database).toBe("mydb")
      expect(config.ssl).toBe(true)
    })

    it("should use individual DB_* variables when DATABASE_URL is not set", async () => {
      delete process.env.DATABASE_URL
      process.env.DB_HOST = "custom-host"
      process.env.DB_PORT = "3306"
      process.env.DB_USER = "custom-user"
      process.env.DB_PASSWORD = "custom-pass"
      process.env.DB_NAME = "custom-db"
      process.env.DB_SSL = "true"

      // Re-import to get fresh module with new env vars
      vi.resetModules()
      const { getDatabaseConfig: getConfig } = await import("./env")

      const config = getConfig()

      expect(config.host).toBe("custom-host")
      expect(config.port).toBe(3306)
      expect(config.user).toBe("custom-user")
      expect(config.password).toBe("custom-pass")
      expect(config.database).toBe("custom-db")
      expect(config.ssl).toBe(true)
    })
  })
})
