/**
 * Configuration Module Exports
 *
 * Phase 17: Centralized config exports
 */

export {
  userConfigSchema,
  globalConfigSchema,
  validateUserConfig,
  validateGlobalConfig,
  enforceGlobalConfigSecurity,
  type UserConfig,
  type GlobalConfig,
} from "./user-config-schema"

export {
  parseUserConfig,
  parseGlobalConfig,
  safeParseUserConfig,
  safeParseGlobalConfig,
  mergeUserConfig,
} from "./validate-config"
