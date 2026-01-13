/**
 * Script Utilities
 *
 * Shared utilities for script development.
 * Provides common patterns and helpers for scripts.
 */

import { createScriptLogger } from "./logger"
import { handleError, handleFatalError, handleRecoverableError } from "./error-handler"

/**
 * Script context for logging and error handling
 */
export interface ScriptContext {
  scriptName: string
  logger: ReturnType<typeof createScriptLogger>
}

/**
 * Initialize script context
 *
 * @example
 * ```typescript
 * const ctx = initScript('validate-docs')
 * ctx.logger.info('Starting validation...')
 * ```
 */
export function initScript(scriptName: string): ScriptContext {
  const logger = createScriptLogger(scriptName)
  return { scriptName, logger }
}

/**
 * Run script with error handling
 *
 * @example
 * ```typescript
 * const ctx = initScript('validate-docs')
 * await runScript(ctx, async () => {
 *   await validateAll()
 * })
 * ```
 */
export async function runScript(ctx: ScriptContext, fn: () => Promise<void>): Promise<void> {
  try {
    await fn()
    ctx.logger.info("Script completed successfully")
  } catch (error) {
    handleFatalError(error, {
      context: { script: ctx.scriptName },
      logger: ctx.logger,
    })
  }
}

/**
 * Re-export error handling utilities for convenience
 */
export {
  handleError,
  handleFatalError,
  handleRecoverableError,
  withErrorHandling,
  withErrorHandlingSync,
} from "./error-handler"

/**
 * Re-export logger utilities for convenience
 */
export { createScriptLogger } from "./logger"
