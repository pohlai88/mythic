/**
 * Performance Monitoring Utilities
 *
 * KISS: Simple performance tracking
 * DRY: Reusable across all domains
 */

/**
 * Performance Budget
 */
export interface PerformanceBudget {
  metric: string
  threshold: number
  unit: "ms" | "kb" | "score"
}

/**
 * Track performance metric
 *
 * KISS: Simple metric tracking
 */
export function trackPerformance(
  metric: string,
  value: number,
  unit: "ms" | "kb" | "score" = "ms"
): void {
  // In production, this would send to monitoring service
  if (typeof window !== "undefined" && "performance" in window) {
    // Browser: Use Performance API
    performance.mark(`${metric}-${value}`)
  }

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${metric}: ${value}${unit}`)
  }
}

/**
 * Create performance budget
 *
 * KISS: Simple budget validation
 */
export function createPerformanceBudget(budgets: PerformanceBudget[]) {
  return {
    check: (metric: string, value: number): boolean => {
      const budget = budgets.find((b) => b.metric === metric)
      if (!budget) {
        return true // No budget defined, pass
      }

      const passes = value <= budget.threshold
      if (!passes) {
        trackPerformance(`${metric}-budget-violation`, value, budget.unit)
      }

      return passes
    },
    budgets,
  }
}

/**
 * Measure function execution time
 */
export async function measurePerformance<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start
    trackPerformance(name, duration, "ms")
    return result
  } catch (error) {
    const duration = performance.now() - start
    trackPerformance(`${name}-error`, duration, "ms")
    throw error
  }
}
