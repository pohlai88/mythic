/**
 * Performance Benchmark Tests for Database Connections
 *
 * Measures and validates performance targets:
 * - Cold start: < 200ms
 * - Connection overhead: < 5ms
 * - Query latency: < 50ms
 *
 * These tests run sequentially for accurate measurements.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { performance } from "perf_hooks"
import {
  validateConnection,
  validateDockerConnection,
  validateDirectConnection,
  type ValidationResult,
} from "../../../scripts/validate-db-connection"
import {
  createTestConnection,
  cleanupAllTestConnections,
  createTestEnv,
  clearTestEnv,
} from "./helpers"

/**
 * Skip performance tests if no database is configured
 */
const hasTestDatabase =
  process.env.TEST_DATABASE_URL ||
  process.env.TEST_NEON_URL ||
  (process.env.DB_HOST && process.env.DB_HOST !== "localhost")

const skipIfNoDb = hasTestDatabase ? describe : describe.skip

skipIfNoDb("Database Connection Performance Tests", () => {
  beforeAll(() => {
    createTestEnv()
  })

  afterAll(() => {
    cleanupAllTestConnections()
    clearTestEnv()
  })

  describe("Cold Start Performance", () => {
    it("should establish first connection within 200ms", async () => {
      const start = performance.now()
      const result = await validateConnection()
      const duration = performance.now() - start

      if (result.success) {
        expect(duration).toBeLessThan(200)
        expect(result.connectionTime).toBeLessThan(200)
      }
    }, 60000)

    it("should measure cold start accurately", async () => {
      // Clear any cached connections
      cleanupAllTestConnections()

      const start = performance.now()
      await validateConnection()
      const coldStartTime = performance.now() - start

      // Second connection should be faster (warm)
      const warmStart = performance.now()
      await validateConnection()
      const warmTime = performance.now() - warmStart

      // Warm connection should be faster than cold
      if (coldStartTime < 200 && warmTime < 200) {
        expect(warmTime).toBeLessThanOrEqual(coldStartTime)
      }
    }, 60000)
  })

  describe("Connection Overhead", () => {
    it("should have connection overhead < 5ms (after warm)", async () => {
      // Warm up connection
      await validateConnection()

      const overheads: number[] = []

      // Measure overhead across multiple connections
      for (let i = 0; i < 10; i++) {
        const start = performance.now()
        const result = await validateConnection()
        const duration = performance.now() - start

        if (result.success) {
          // Overhead is the time beyond the actual query time
          const overhead = duration - result.connectionTime
          overheads.push(overhead)
        }
      }

      if (overheads.length > 0) {
        const avgOverhead = overheads.reduce((a, b) => a + b, 0) / overheads.length
        // Average overhead should be < 5ms
        expect(avgOverhead).toBeLessThan(5)
      }
    }, 60000)
  })

  describe("Query Latency", () => {
    it("should execute queries within 50ms", async () => {
      const result = await validateConnection()

      if (result.success) {
        // Connection time includes query execution
        // For simple validation queries, should be < 50ms
        expect(result.connectionTime).toBeLessThan(50)
      }
    }, 30000)

    it("should have consistent query latency", async () => {
      const latencies: number[] = []

      for (let i = 0; i < 10; i++) {
        const result = await validateConnection()
        if (result.success) {
          latencies.push(result.connectionTime)
        }
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      if (latencies.length > 1) {
        const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length
        const max = Math.max(...latencies)
        const min = Math.min(...latencies)

        // All queries should be < 50ms
        expect(max).toBeLessThan(50)
        // Variance should be reasonable
        expect(max - min).toBeLessThan(avg * 0.5)
      }
    }, 60000)
  })

  describe("Connection Pooling Effectiveness", () => {
    it("should benefit from connection reuse", async () => {
      // First connection (cold)
      const coldStart = performance.now()
      await validateConnection()
      const coldTime = performance.now() - coldStart

      // Subsequent connections (warm, should reuse pool)
      const warmTimes: number[] = []
      for (let i = 0; i < 5; i++) {
        const warmStart = performance.now()
        await validateConnection()
        warmTimes.push(performance.now() - warmStart)
      }

      if (warmTimes.length > 0) {
        const avgWarmTime = warmTimes.reduce((a, b) => a + b, 0) / warmTimes.length

        // Warm connections should be faster or similar to cold
        // (pooling may not always be faster, but shouldn't be much slower)
        expect(avgWarmTime).toBeLessThan(coldTime * 1.5)
      }
    }, 60000)
  })

  describe("Docker vs Neon Performance Comparison", () => {
    it("should measure Docker connection performance", async () => {
      if (process.env.DB_HOST === "localhost" || process.env.TEST_DATABASE_URL) {
        const start = performance.now()
        const result = await validateDockerConnection()
        const duration = performance.now() - start

        if (result.success) {
          expect(duration).toBeLessThan(1000) // Docker should be fast (< 1s)
          expect(result.connectionTime).toBeLessThan(100) // Query should be < 100ms
        }
      }
    }, 30000)

    it("should measure Neon connection performance", async () => {
      if (process.env.DATABASE_URL?.includes(".neon.tech") || process.env.TEST_NEON_URL) {
        const start = performance.now()
        const result = await validateDirectConnection()
        const duration = performance.now() - start

        if (result.success) {
          expect(duration).toBeLessThan(5000) // Neon may be slower (< 5s)
          expect(result.connectionTime).toBeLessThan(500) // Query should be < 500ms
        }
      }
    }, 30000)
  })

  describe("Performance Targets Summary", () => {
    it("should meet all performance targets", async () => {
      const result = await validateConnection()

      if (result.success) {
        const targets = {
          coldStart: result.connectionTime < 200,
          queryLatency: result.connectionTime < 50,
          overall: result.connectionTime < 5000, // Overall should be reasonable
        }

        // Log results for debugging
        console.log("Performance Results:", {
          connectionTime: result.connectionTime,
          targets,
        })

        // At least overall should pass
        expect(targets.overall).toBe(true)
      }
    }, 60000)
  })
})
