/**
 * Pino Logger Configuration
 *
 * Centralized logging infrastructure using Pino.
 * Best practices:
 * - Use structured logging with context
 * - Use appropriate log levels
 * - Use pino-pretty in development
 * - Use JSON format in production
 *
 * @see https://getpino.io/#/
 */

import pino from "pino"

/**
 * Determine if running in development mode
 */
const isDevelopment = process.env.NODE_ENV !== "production"

/**
 * Base logger configuration
 */
const baseConfig: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
}

/**
 * Development transport configuration (pino-pretty)
 */
const developmentTransport: pino.TransportSingleOptions = {
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "SYS:standard",
    ignore: "pid,hostname",
  },
}

/**
 * Create the logger instance
 *
 * - Development: Uses pino-pretty for human-readable output
 * - Production: Uses JSON format for log aggregation
 */
export const logger = isDevelopment
  ? pino(baseConfig, pino.transport(developmentTransport))
  : pino(baseConfig)

/**
 * Create a child logger with context
 *
 * @example
 * const scriptLogger = createLogger({ script: 'migrate-zod-imports' })
 * scriptLogger.info('Starting migration...')
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context)
}

/**
 * Script-specific logger factory
 *
 * @example
 * const log = createScriptLogger('generate-api-docs')
 * log.info('Generating API docs...')
 */
export function createScriptLogger(scriptName: string) {
  return createLogger({ script: scriptName })
}

/**
 * Log levels for reference:
 * - fatal: Application is about to crash
 * - error: Unrecoverable error occurred
 * - warn: Potential issue or degraded functionality
 * - info: Normal operation, significant events
 * - debug: Detailed debugging information
 * - trace: Very detailed tracing information
 */
export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace"

export default logger
