/**
 * Frontend Customization Module Exports
 *
 * Phase 20: Centralized frontend customization exports
 */

export {
  layoutConfigSchema,
  viewConfigSchema,
  componentConfigSchema,
  frontendCustomizationSchema,
  type LayoutConfig,
  type ViewConfig,
  type ComponentConfig,
  type FrontendCustomization,
} from './customization-schemas'

export {
  validateCustomization,
  mergeCustomization,
  safeParseCustomization,
} from './customization-service'
