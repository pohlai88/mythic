/**
 * Zod Schemas for Stencil Validation
 *
 * Contract-First approach: Generate Zod schemas from stencil definitions
 * for runtime validation of proposal data.
 */

import { z as z4 } from "zod/v4"
import type { StencilField, StencilDefinition } from "@/src/codex"

/**
 * Create a Zod schema for a single stencil field
 */
function createFieldSchema(field: StencilField): z4.ZodTypeAny {
  let schema: z4.ZodTypeAny

  // Base type schema
  switch (field.type) {
    case "string":
      schema = z4.string()
      break
    case "number":
      schema = z4.number()
      break
    case "date":
      schema = z4
        .union([z4.string().datetime(), z4.string().date(), z4.date()])
        .transform((val) => {
          if (typeof val === "string") {
            return new Date(val)
          }
          return val
        })
      break
    case "enum":
      if (!field.options || field.options.length === 0) {
        throw new Error(`Enum field ${field.id} must have options`)
      }
      schema = z4.enum(field.options as [string, ...string[]])
      break
    case "jsonb":
      schema = z4.record(z4.string(), z4.unknown())
      break
    default:
      schema = z4.unknown()
  }

  // Apply required/optional
  if (!field.required) {
    schema = schema.optional()
  }

  // Apply validation rules
  if (field.validationRule) {
    schema = applyValidationRule(schema, field.validationRule, field.type)
  }

  return schema
}

/**
 * Apply validation rules from string format (e.g., "min:50000|max:500000")
 */
function applyValidationRule(
  schema: z4.ZodTypeAny,
  rule: string,
  fieldType: StencilField["type"]
): z4.ZodTypeAny {
  const rules = rule.split("|").map((r) => r.trim())

  for (const ruleStr of rules) {
    const parts = ruleStr.split(":").map((s) => s.trim())
    const ruleName = parts[0]
    const ruleValue = parts[1]

    if (!ruleName || !ruleValue) {
      continue // Skip invalid rules
    }

    switch (ruleName) {
      case "min":
        if (fieldType === "string") {
          const minValue = Number.parseInt(ruleValue, 10)
          if (!Number.isNaN(minValue)) {
            schema = (schema as z4.ZodString).min(minValue, {
              message: `Must be at least ${ruleValue} characters`,
            })
          }
        } else if (fieldType === "number") {
          const minValue = Number.parseFloat(ruleValue)
          if (!Number.isNaN(minValue)) {
            schema = (schema as z4.ZodNumber).min(minValue, {
              message: `Must be at least ${ruleValue}`,
            })
          }
        }
        break

      case "max":
        if (fieldType === "string") {
          const maxValue = Number.parseInt(ruleValue, 10)
          if (!Number.isNaN(maxValue)) {
            schema = (schema as z4.ZodString).max(maxValue, {
              message: `Must be at most ${ruleValue} characters`,
            })
          }
        } else if (fieldType === "number") {
          const maxValue = Number.parseFloat(ruleValue)
          if (!Number.isNaN(maxValue)) {
            schema = (schema as z4.ZodNumber).max(maxValue, {
              message: `Must be at most ${ruleValue}`,
            })
          }
        }
        break

      case "email":
        if (fieldType === "string") {
          schema = (schema as z4.ZodString).email({
            message: "Must be a valid email address",
          })
        }
        break

      case "url":
        if (fieldType === "string") {
          schema = (schema as z4.ZodString).url({
            message: "Must be a valid URL",
          })
        }
        break

      case "regex":
        if (fieldType === "string" && ruleValue) {
          try {
            const regex = new RegExp(ruleValue)
            schema = (schema as z4.ZodString).regex(regex, {
              message: `Must match pattern: ${ruleValue}`,
            })
          } catch {
            // Invalid regex, skip
          }
        }
        break
    }
  }

  return schema
}

/**
 * Create a Zod schema from a stencil definition
 *
 * Generates a schema that validates proposal data against the stencil's fields.
 */
export function createStencilSchema(
  stencil: StencilDefinition
): z4.ZodObject<Record<string, z4.ZodTypeAny>> {
  const shape: Record<string, z4.ZodTypeAny> = {}

  for (const field of stencil.fields) {
    shape[field.id] = createFieldSchema(field)
  }

  return z4.object(shape)
}

/**
 * Validate proposal data against a stencil using Zod
 *
 * Returns a result object with validation status and errors.
 */
export function validateProposalDataWithZod(
  data: Record<string, unknown>,
  stencil: StencilDefinition
): { valid: boolean; errors: string[]; zodError?: z4.ZodError } {
  const schema = createStencilSchema(stencil)
  const result = schema.safeParse(data)

  if (result.success) {
    return {
      valid: true,
      errors: [],
    }
  }

  // Format Zod errors into user-friendly messages
  const errors: string[] = []
  for (const issue of result.error.issues) {
    const fieldPath = issue.path[0]
    const field = fieldPath ? stencil.fields.find((f) => f.id === String(fieldPath)) : undefined
    const fieldLabel = field?.label || (fieldPath ? String(fieldPath) : "field")

    // Zod v4 error codes (string-based)
    if (issue.code === "invalid_type") {
      errors.push(`${fieldLabel} must be of type ${field?.type || "valid type"}`)
    } else if (issue.code === "too_small" && "type" in issue && issue.type === "string") {
      errors.push(`${fieldLabel} is required`)
    } else {
      errors.push(`${fieldLabel}: ${issue.message}`)
    }
  }

  return {
    valid: false,
    errors,
    zodError: result.error,
  }
}

/**
 * Type inference for proposal data from stencil
 */
export type ProposalDataFromStencil<T extends StencilDefinition> = z4.infer<
  ReturnType<typeof createStencilSchema>
>
