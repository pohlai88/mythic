/**
 * Frontend Customization Service
 *
 * Phase 20: Frontend customization with validated schemas
 */

import { z as z4 } from 'zod/v4'
import {
  frontendCustomizationSchema,
  type FrontendCustomization,
} from './customization-schemas'

/**
 * Validate frontend customization
 */
export function validateCustomization(
  customization: unknown
): FrontendCustomization {
  return frontendCustomizationSchema.parse(customization)
}

/**
 * Merge user customization with global defaults
 *
 * User preferences take precedence over global defaults
 */
export function mergeCustomization(
  userCustomization: Partial<FrontendCustomization>,
  globalDefaults: FrontendCustomization
): FrontendCustomization {
  // Validate both inputs
  const userResult = frontendCustomizationSchema.partial().safeParse(userCustomization)
  if (!userResult.success) {
    throw new Error(`Invalid user customization: ${userResult.error.issues[0]?.message || 'Unknown error'}`)
  }
  const validatedUser = userResult.data

  const globalResult = frontendCustomizationSchema.safeParse(globalDefaults)
  if (!globalResult.success) {
    throw new Error(`Invalid global defaults: ${globalResult.error.issues[0]?.message || 'Unknown error'}`)
  }
  const validatedGlobal = globalResult.data

  // Merge with user preferences taking precedence
  const mergedResult = frontendCustomizationSchema.safeParse({
    ...validatedGlobal,
    ...validatedUser,
    layout: { ...validatedGlobal.layout, ...validatedUser.layout },
    view: { ...validatedGlobal.view, ...validatedUser.view },
    components: { ...validatedGlobal.components, ...validatedUser.components },
  })
  if (!mergedResult.success) {
    throw new Error(`Invalid merged customization: ${mergedResult.error.issues[0]?.message || 'Unknown error'}`)
  }
  return mergedResult.data
}

/**
 * Safe parse customization (non-throwing)
 */
export function safeParseCustomization(customization: unknown) {
  return frontendCustomizationSchema.safeParse(customization)
}
