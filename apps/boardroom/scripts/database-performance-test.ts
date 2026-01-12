/**
 * Database Performance Test Suite
 *
 * Measures performance improvements from Drizzle/Neon/Zod optimization:
 * - Query latency (target: <50ms)
 * - Connection overhead (target: <5ms)
 * - Cold start time (target: <200ms)
 * - Relational queries vs manual joins
 * - Prepared statements vs regular queries
 *
 * Usage:
 *   pnpm test:db-performance
 *   tsx apps/boardroom/scripts/database-performance-test.ts
 */

import { performance } from 'perf_hooks'
import { db } from '../src/db'
import {
  getProposalById,
  getProposalWithRelations,
  getProposalsByCircleId,
  getCircleById,
  getCommentsByProposalId,
} from '../src/db/queries'
import { proposals, circles, boardComments } from '../src/db/schema'
import { eq } from 'drizzle-orm'

interface TestResult {
  name: string
  duration: number
  iterations: number
  avgDuration: number
  minDuration: number
  maxDuration: number
  p50: number
  p95: number
  p99: number
  target?: number
  passed: boolean
}

interface PerformanceReport {
  timestamp: string
  connection: {
    coldStart: TestResult
    connectionOverhead: TestResult
  }
  queries: {
    preparedStatement: TestResult
    regularQuery: TestResult
    relationalQuery: TestResult
    manualJoin: TestResult
  }
  summary: {
    totalTests: number
    passed: number
    failed: number
    avgQueryLatency: number
    avgConnectionOverhead: number
  }
}

/**
 * Measure execution time of a function
 */
async function measureExecution<T>(
  name: string,
  fn: () => Promise<T>,
  iterations: number = 10
): Promise<TestResult> {
  const durations: number[] = []

  // Warm-up run (not counted)
  try {
    await fn()
  } catch (error) {
    console.warn(`⚠️  Warm-up failed for ${name}:`, error)
  }

  // Actual measurements
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    try {
      await fn()
      const end = performance.now()
      durations.push(end - start)
    } catch (error) {
      console.error(`❌ Error in ${name} iteration ${i + 1}:`, error)
      durations.push(Infinity) // Mark as failed
    }
  }

  // Filter out failed runs
  const validDurations = durations.filter((d) => d !== Infinity && !Number.isNaN(d))

  if (validDurations.length === 0) {
    throw new Error(`All iterations failed for ${name}`)
  }

  // Calculate statistics
  const sorted = [...validDurations].sort((a, b) => a - b)
  const sum = validDurations.reduce((a, b) => a + b, 0)
  const avg = sum / validDurations.length
  const min = Math.min(...validDurations)
  const max = Math.max(...validDurations)
  const p50 = sorted[Math.floor(sorted.length * 0.5)]
  const p95 = sorted[Math.floor(sorted.length * 0.95)]
  const p99 = sorted[Math.floor(sorted.length * 0.99)]

  return {
    name,
    duration: sum,
    iterations: validDurations.length,
    avgDuration: avg,
    minDuration: min,
    maxDuration: max,
    p50,
    p95,
    p99,
    passed: true, // Will be set based on target
  }
}

/**
 * Test 1: Cold Start Time
 * Measures time to establish first database connection
 */
async function testColdStart(): Promise<TestResult> {
  console.log('🧪 Testing Cold Start...')

  // Clear any existing connections by creating a new db instance
  // Note: This is a simplified test - in real serverless, cold start includes module loading
  const start = performance.now()

  // Simulate cold start by measuring first query
  try {
    // Get a test ID (we'll use a simple query that should always work)
    await db.execute({ sql: 'SELECT 1', args: [] })
  } catch (error) {
    // If no data, that's okay - we're just testing connection
  }

  const end = performance.now()
  const duration = end - start

  return {
    name: 'Cold Start',
    duration,
    iterations: 1,
    avgDuration: duration,
    minDuration: duration,
    maxDuration: duration,
    p50: duration,
    p95: duration,
    p99: duration,
    target: 200, // 200ms target
    passed: duration < 200,
  }
}

/**
 * Test 2: Connection Overhead
 * Measures overhead of establishing connections
 */
async function testConnectionOverhead(): Promise<TestResult> {
  console.log('🧪 Testing Connection Overhead...')

  return measureExecution('Connection Overhead', async () => {
    // Simple query to measure connection overhead
    await db.execute({ sql: 'SELECT 1', args: [] })
  }, 20)
}

/**
 * Test 3: Prepared Statement Performance
 */
async function testPreparedStatement(proposalId?: string): Promise<TestResult> {
  console.log('🧪 Testing Prepared Statement...')

  // Get a real proposal ID if available
  let testId = proposalId
  if (!testId) {
    try {
      const [firstProposal] = await db.select({ id: proposals.id }).from(proposals).limit(1)
      testId = firstProposal?.id
    } catch {
      // If no proposals exist, skip this test
      return {
        name: 'Prepared Statement',
        duration: 0,
        iterations: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        target: 50,
        passed: false,
      }
    }
  }

  if (!testId) {
    console.warn('⚠️  No proposals found, skipping prepared statement test')
    return {
      name: 'Prepared Statement',
      duration: 0,
      iterations: 0,
      avgDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      p50: 0,
      p95: 0,
      p99: 0,
      target: 50,
      passed: false,
    }
  }

  const result = await measureExecution(
    'Prepared Statement',
    async () => {
      await getProposalById.execute({ id: testId! })
    },
    20
  )

  result.target = 50 // 50ms target
  result.passed = result.avgDuration < 50

  return result
}

/**
 * Test 4: Regular Query Performance
 */
async function testRegularQuery(proposalId?: string): Promise<TestResult> {
  console.log('🧪 Testing Regular Query...')

  let testId = proposalId
  if (!testId) {
    try {
      const [firstProposal] = await db.select({ id: proposals.id }).from(proposals).limit(1)
      testId = firstProposal?.id
    } catch {
      return {
        name: 'Regular Query',
        duration: 0,
        iterations: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        target: 50,
        passed: false,
      }
    }
  }

  if (!testId) {
    console.warn('⚠️  No proposals found, skipping regular query test')
    return {
      name: 'Regular Query',
      duration: 0,
      iterations: 0,
      avgDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      p50: 0,
      p95: 0,
      p99: 0,
      target: 50,
      passed: false,
    }
  }

  const result = await measureExecution(
    'Regular Query',
    async () => {
      await db.select().from(proposals).where(eq(proposals.id, testId!)).limit(1)
    },
    20
  )

  result.target = 50 // 50ms target
  result.passed = result.avgDuration < 50

  return result
}

/**
 * Test 5: Relational Query Performance
 */
async function testRelationalQuery(proposalId?: string): Promise<TestResult> {
  console.log('🧪 Testing Relational Query...')

  let testId = proposalId
  if (!testId) {
    try {
      const [firstProposal] = await db.select({ id: proposals.id }).from(proposals).limit(1)
      testId = firstProposal?.id
    } catch {
      return {
        name: 'Relational Query',
        duration: 0,
        iterations: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        target: 100, // Higher target due to nested data
        passed: false,
      }
    }
  }

  if (!testId) {
    console.warn('⚠️  No proposals found, skipping relational query test')
    return {
      name: 'Relational Query',
      duration: 0,
      iterations: 0,
      avgDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      p50: 0,
      p95: 0,
      p99: 0,
      target: 100,
      passed: false,
    }
  }

  const result = await measureExecution(
    'Relational Query',
    async () => {
      await getProposalWithRelations(testId!)
    },
    20
  )

  result.target = 100 // 100ms target (includes nested data)
  result.passed = result.avgDuration < 100

  return result
}

/**
 * Test 6: Manual Join Performance (for comparison)
 */
async function testManualJoin(proposalId?: string): Promise<TestResult> {
  console.log('🧪 Testing Manual Join (Comparison)...')

  let testId = proposalId
  if (!testId) {
    try {
      const [firstProposal] = await db.select({ id: proposals.id }).from(proposals).limit(1)
      testId = firstProposal?.id
    } catch {
      return {
        name: 'Manual Join',
        duration: 0,
        iterations: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        target: 150, // Higher target (multiple queries)
        passed: false,
      }
    }
  }

  if (!testId) {
    console.warn('⚠️  No proposals found, skipping manual join test')
    return {
      name: 'Manual Join',
      duration: 0,
      iterations: 0,
      avgDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      p50: 0,
      p95: 0,
      p99: 0,
      target: 150,
      passed: false,
    }
  }

  const result = await measureExecution(
    'Manual Join',
    async () => {
      // Simulate manual join with multiple queries
      const [proposal] = await db.select().from(proposals).where(eq(proposals.id, testId!)).limit(1)
      if (proposal) {
        await db.select().from(circles).where(eq(circles.id, proposal.circleId)).limit(1)
        await db.select().from(boardComments).where(eq(boardComments.proposalId, testId!)).limit(10)
      }
    },
    20
  )

  result.target = 150 // 150ms target (multiple queries)
  result.passed = result.avgDuration < 150

  return result
}

/**
 * Format duration in milliseconds
 */
function formatDuration(ms: number): string {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(2)}μs`
  }
  if (ms < 1000) {
    return `${ms.toFixed(2)}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Print test result
 */
function printResult(result: TestResult): void {
  const status = result.passed ? '✅' : '❌'
  const targetStr = result.target ? ` (target: <${formatDuration(result.target)})` : ''

  console.log(`\n${status} ${result.name}${targetStr}`)
  console.log(`   Iterations: ${result.iterations}`)
  console.log(`   Average: ${formatDuration(result.avgDuration)}`)
  console.log(`   Min: ${formatDuration(result.minDuration)}`)
  console.log(`   Max: ${formatDuration(result.maxDuration)}`)
  console.log(`   P50: ${formatDuration(result.p50)}`)
  console.log(`   P95: ${formatDuration(result.p95)}`)
  console.log(`   P99: ${formatDuration(result.p99)}`)
}

/**
 * Generate performance report
 */
async function generateReport(): Promise<PerformanceReport> {
  console.log('🚀 Starting Database Performance Tests...\n')

  // Get a test proposal ID once
  let testProposalId: string | undefined
  try {
    const [firstProposal] = await db.select({ id: proposals.id }).from(proposals).limit(1)
    testProposalId = firstProposal?.id
  } catch (error) {
    console.warn('⚠️  Could not fetch test proposal ID:', error)
  }

  // Run all tests
  const coldStart = await testColdStart()
  printResult(coldStart)

  const connectionOverhead = await testConnectionOverhead()
  connectionOverhead.target = 5 // 5ms target
  connectionOverhead.passed = connectionOverhead.avgDuration < 5
  printResult(connectionOverhead)

  const preparedStatement = await testPreparedStatement(testProposalId)
  if (preparedStatement.iterations > 0) {
    printResult(preparedStatement)
  }

  const regularQuery = await testRegularQuery(testProposalId)
  if (regularQuery.iterations > 0) {
    printResult(regularQuery)
  }

  const relationalQuery = await testRelationalQuery(testProposalId)
  if (relationalQuery.iterations > 0) {
    printResult(relationalQuery)
  }

  const manualJoin = await testManualJoin(testProposalId)
  if (manualJoin.iterations > 0) {
    printResult(manualJoin)
  }

  // Calculate summary
  const allTests = [
    coldStart,
    connectionOverhead,
    preparedStatement,
    regularQuery,
    relationalQuery,
    manualJoin,
  ].filter((t) => t.iterations > 0)

  const passed = allTests.filter((t) => t.passed).length
  const failed = allTests.filter((t) => !t.passed).length

  const queryTests = [preparedStatement, regularQuery, relationalQuery, manualJoin].filter(
    (t) => t.iterations > 0
  )
  const avgQueryLatency =
    queryTests.length > 0
      ? queryTests.reduce((sum, t) => sum + t.avgDuration, 0) / queryTests.length
      : 0

  const report: PerformanceReport = {
    timestamp: new Date().toISOString(),
    connection: {
      coldStart,
      connectionOverhead,
    },
    queries: {
      preparedStatement,
      regularQuery,
      relationalQuery,
      manualJoin,
    },
    summary: {
      totalTests: allTests.length,
      passed,
      failed,
      avgQueryLatency,
      avgConnectionOverhead: connectionOverhead.avgDuration,
    },
  }

  // Print summary
  console.log('\n📊 Performance Summary:')
  console.log(`   Total Tests: ${report.summary.totalTests}`)
  console.log(`   Passed: ${report.summary.passed} ✅`)
  console.log(`   Failed: ${report.summary.failed} ${report.summary.failed > 0 ? '❌' : ''}`)
  console.log(`   Average Query Latency: ${formatDuration(report.summary.avgQueryLatency)}`)
  console.log(`   Average Connection Overhead: ${formatDuration(report.summary.avgConnectionOverhead)}`)

  // Performance comparison
  if (preparedStatement.iterations > 0 && regularQuery.iterations > 0) {
    const improvement = ((regularQuery.avgDuration - preparedStatement.avgDuration) / regularQuery.avgDuration) * 100
    console.log(`\n⚡ Prepared Statement Improvement: ${improvement.toFixed(1)}% faster`)
  }

  if (relationalQuery.iterations > 0 && manualJoin.iterations > 0) {
    const improvement = ((manualJoin.avgDuration - relationalQuery.avgDuration) / manualJoin.avgDuration) * 100
    console.log(`⚡ Relational Query Improvement: ${improvement.toFixed(1)}% faster than manual joins`)
  }

  // Targets check
  console.log('\n🎯 Target Compliance:')
  console.log(`   Query Latency: <50ms ${report.summary.avgQueryLatency < 50 ? '✅' : '❌'}`)
  console.log(`   Connection Overhead: <5ms ${report.summary.avgConnectionOverhead < 5 ? '✅' : '❌'}`)
  console.log(`   Cold Start: <200ms ${coldStart.avgDuration < 200 ? '✅' : '❌'}`)

  return report
}

/**
 * Main execution
 */
async function main() {
  try {
    // Check if database is configured
    try {
      await db.execute({ sql: 'SELECT 1', args: [] })
    } catch (error) {
      console.error('❌ Database connection failed. Please ensure:')
      console.error('   1. DATABASE_URL is set in your .env file')
      console.error('   2. Database is accessible')
      console.error('   3. Network/firewall allows connection')
      console.error('\n   Error:', error instanceof Error ? error.message : String(error))
      console.error('\n   See docs/architecture/ENVIRONMENT_VARIABLES.md for setup instructions.')
      process.exit(1)
    }

    const report = await generateReport()

    // Save report to file
    const fs = await import('fs/promises')
    const path = await import('path')
    const reportPath = path.join(process.cwd(), 'database-performance-report.json')
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8')
    console.log(`\n💾 Report saved to: ${reportPath}`)

    // Exit with appropriate code
    process.exit(report.summary.failed > 0 ? 1 : 0)
  } catch (error) {
    console.error('❌ Performance test failed:', error)
    if (error instanceof Error && error.message.includes('Database configuration')) {
      console.error('\n💡 Tip: Set DATABASE_URL in your .env file to run performance tests')
    }
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

export { generateReport, measureExecution, type PerformanceReport, type TestResult }
