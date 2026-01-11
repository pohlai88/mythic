/**
 * Form Utilities Barrel Export
 *
 * Centralized exports for form-related utilities.
 * React Hook Form integration and validated form actions.
 *
 * @example
 * ```typescript
 * import { useStencilForm, useValidatedFormAction } from '@/src/lib/forms'
 * ```
 */

export { useStencilForm } from './use-stencil-form'

export {
  useValidatedFormAction,
  type FormActionResult,
  type FormActionState,
} from './validated-form-action'
