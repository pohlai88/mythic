/**
 * Structured Logging
 *
 * KISS: Simple logging utilities
 * DRY: Reusable across all domains
 */

/**
 * Log Level
 */
export type LogLevel = "debug" | "info" | "warn" | "error"

/**
 * Logger Config
 */
export interface LoggerConfig {
  domain: string
  level?: LogLevel
}

/**
 * Create domain-specific logger
 *
 * KISS: Simple logger with context
 */
export function createLogger(config: LoggerConfig) {
  const { domain, level = "info" } = config

  const log = (logLevel: LogLevel, message: string, data?: Record<string, unknown>) => {
    // Only log if level is enabled
    const levels: LogLevel[] = ["debug", "info", "warn", "error"]
    if (levels.indexOf(logLevel) < levels.indexOf(level)) {
      return
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      domain,
      level: logLevel,
      message,
      ...data,
    }

    // In production, send to logging service
    // In development, use console
    if (process.env.NODE_ENV === "development") {
      const consoleMethod = logLevel === "error" ? "error" : logLevel === "warn" ? "warn" : "log"
      console[consoleMethod](`[${domain}] ${logLevel.toUpperCase()}:`, message, data || "")
    }
  }

  return {
    debug: (message: string, data?: Record<string, unknown>) => log("debug", message, data),
    info: (message: string, data?: Record<string, unknown>) => log("info", message, data),
    warn: (message: string, data?: Record<string, unknown>) => log("warn", message, data),
    error: (message: string, data?: Record<string, unknown>) => log("error", message, data),
  }
}
