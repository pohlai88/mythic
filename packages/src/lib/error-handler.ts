/**
 * Error Handler Utility
 *
 * Centralized error handling for scripts and application code.
 * Provides consistent error handling patterns following Rule 031.
 *
 * @see .cursor/rules/031_tech-debt-prevention.mdc
 */

import { createScriptLogger } from "./logger"

/**
 * Error handling result type
 */
export interface ErrorResult {
  success: false
  error: string
  context?: Record<string, unknown>
}

/**
 * Error handling options
 */
export interface HandleErrorOptions {
  /**
   * Context information for logging
   */
  context?: Record<string, unknown>
  /**
   * Whether to exit the process (for fatal errors)
   */
  exit?: boolean
  /**
   * Exit code (default: 1)
   */
  exitCode?: number
  /**
   * Logger instance (optional, will create default if not provided)
   */
  logger?: ReturnType<typeof createScriptLogger>
}

/**
 * Handle an error with proper logging and context
 *
 * @example
 * ```typescript
 * try {
 *   await operation()
 * } catch (error) {
 *   return handleError(error, {
 *     context: { file: 'example.ts', operation: 'readFile' }
 *   })
 * }
 * ```
 */
export function handleError(error: unknown, options: HandleErrorOptions = {}): ErrorResult {
  const { context = {}, exit = false, exitCode = 1, logger } = options

  // Extract error message
  const message = error instanceof Error ? error.message : String(error || "Unknown error")

  // Create logger if not provided
  const log = logger || createScriptLogger("error-handler")

  // Log error with context
  log.error(
    {
      error: message,
      ...context,
      ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
    },
    "Operation failed"
  )

  // Exit if fatal
  if (exit) {
    process.exit(exitCode)
  }

  return {
    success: false,
    error: message,
    context,
  }
}

/**
 * Handle error and exit process (for fatal errors)
 *
 * @example
 * ```typescript
 * try {
 *   await criticalOperation()
 * } catch (error) {
 *   handleFatalError(error, {
 *     context: { script: 'setup-database' }
 *   })
 * }
 * ```
 */
export function handleFatalError(
  error: unknown,
  options: Omit<HandleErrorOptions, "exit"> = {}
): never {
  handleError(error, { ...options, exit: true })
  // This will never be reached, but TypeScript needs it
  process.exit(1)
}

/**
 * Handle error and return result (for recoverable errors)
 *
 * @example
 * ```typescript
 * try {
 *   await operation()
 * } catch (error) {
 *   return handleRecoverableError(error, {
 *     context: { file: 'example.ts' }
 *   })
 * }
 * ```
 */
export function handleRecoverableError(
  error: unknown,
  options: Omit<HandleErrorOptions, "exit"> = {}
): ErrorResult {
  return handleError(error, { ...options, exit: false })
}

/**
 * Wrap an async function with error handling
 *
 * @example
 * ```typescript
 * const safeOperation = withErrorHandling(async () => {
 *   await operation()
 * }, { context: { operation: 'processFile' } })
 *
 * const result = await safeOperation()
 * if (!result.success) {
 *   // Handle error
 * }
 * ```
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options: HandleErrorOptions = {}
): Promise<{ success: true; data: T } | ErrorResult> {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (error) {
    return handleRecoverableError(error, options)
  }
}

/**
 * Wrap a sync function with error handling
 *
 * @example
 * ```typescript
 * const safeOperation = withErrorHandlingSync(() => {
 *   return processFile()
 * }, { context: { file: 'example.ts' } })
 *
 * const result = safeOperation()
 * if (!result.success) {
 *   // Handle error
 * }
 * ```
 */
export function withErrorHandlingSync<T>(
  fn: () => T,
  options: HandleErrorOptions = {}
): { success: true; data: T } | ErrorResult {
  try {
    const data = fn()
    return { success: true, data }
  } catch (error) {
    return handleRecoverableError(error, options)
  }
}
