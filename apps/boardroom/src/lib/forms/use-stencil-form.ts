/**
 * React Hook Form integration for Stencil-based forms
 *
 * Provides a hook that combines React Hook Form with Zod validation
 * for stencil-based proposal forms.
 */

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createStencilSchema, type ProposalDataFromStencil } from "@/src/lib/zod/stencil-schemas"
import type { StencilDefinition } from "@/src/codex"

/**
 * Hook for managing stencil-based forms with React Hook Form + Zod
 *
 * @example
 * ```tsx
 * const { register, handleSubmit, formState: { errors } } = useStencilForm(stencil)
 *
 * <form onSubmit={handleSubmit(onSubmit)}>
 *   <input {...register('job_title')} />
 *   {errors.job_title && <span>{errors.job_title.message}</span>}
 * </form>
 * ```
 */
export function useStencilForm<T extends StencilDefinition>(stencil: T) {
  const schema = createStencilSchema(stencil)

  const form = useForm<ProposalDataFromStencil<T>>({
    resolver: zodResolver(schema),
    mode: "onChange", // Validate on change for better UX
    defaultValues: getDefaultValues(stencil),
  })

  return form
}

/**
 * Get default values for a stencil form
 */
function getDefaultValues(stencil: StencilDefinition): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}

  for (const field of stencil.fields) {
    switch (field.type) {
      case "string":
        defaults[field.id] = ""
        break
      case "number":
        defaults[field.id] = 0
        break
      case "date":
        defaults[field.id] = new Date().toISOString().split("T")[0] // YYYY-MM-DD
        break
      case "enum":
        defaults[field.id] = field.options?.[0] || ""
        break
      case "jsonb":
        defaults[field.id] = {}
        break
    }
  }

  return defaults
}

/**
 * Type helper for form data
 */
export type StencilFormData<T extends StencilDefinition> = ProposalDataFromStencil<T>
