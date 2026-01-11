/**
 * Logger Utility
 *
 * ⭐ ELITE: Using @mythic/monitoring for shared logging
 * Following KISS and DRY principles
 */

import { createLogger } from '@mythic/monitoring/logger'

/**
 * Create script logger
 *
 * KISS: Simple wrapper for script logging
 */
export function createScriptLogger(scriptName: string) {
  return createLogger({ domain: `script:${scriptName}` })
}

/**
 * Create domain logger
 *
 * KISS: Simple wrapper for domain logging
 */
export function createDomainLogger(domain: string) {
  return createLogger({ domain })
}
