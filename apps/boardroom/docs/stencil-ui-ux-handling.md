# How UI/UX Handles Frontend Stencils

## Executive Summary

The BoardRoom application uses a **contract-first, schema-driven approach** for
handling stencils in the UI/UX layer. Stencils are **living schema templates**
that dynamically generate:

1. **Type-safe form schemas** (via Zod)
2. **React Hook Form integration** (for form state management)
3. **Real-time validation** (onChange mode)
4. **Visual stencil viewers** (for displaying schema definitions)

---

## Architecture Flow

```
StencilDefinition (Database/Codex)
    ↓
createStencilSchema() → Zod Schema
    ↓
useStencilForm() → React Hook Form
    ↓
UI Components → Dynamic Form Fields
    ↓
Validation → Real-time Error Display
```

---

## Evidence & Implementation Details

### 1. Stencil Definition Structure

**Location:** `apps/boardroom/src/codex/index.ts:25-31`

```typescript
export interface StencilDefinition {
  id: string
  name: string
  version: number
  fields: StencilField[]
  requiredApprovers: string[]
}

export interface StencilField {
  id: string
  label: string
  type: "string" | "number" | "date" | "enum" | "jsonb"
  required: boolean
  validationRule?: string // e.g., "min:50000|max:500000"
  options?: string[] // For enum type
}
```

**Reasoning:**

- **Machine-readable structure** enables programmatic form generation
- **Versioned** to support schema evolution
- **Validation rules** stored as strings for flexibility
- **Type-safe** via TypeScript interfaces

**Evidence:** See default stencils in
`apps/boardroom/src/codex/index.ts:134-209`:

- `hiring_request_v2` with fields: `job_title`, `level`, `annual_salary`,
  `department`, `justification`
- `budget_expansion_v1` with fields: `department`, `amount`, `quarter`, `reason`

---

### 2. Zod Schema Generation (Contract-First)

**Location:** `apps/boardroom/src/lib/zod/stencil-schemas.ts:158-166`

```typescript
export function createStencilSchema(
  stencil: StencilDefinition
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of stencil.fields) {
    shape[field.id] = createFieldSchema(field)
  }

  return z.object(shape)
}
```

**How it works:**

1. **Iterates through stencil fields**
   (`apps/boardroom/src/lib/zod/stencil-schemas.ts:14-61`)
2. **Maps field types to Zod schemas:**
   - `string` → `z.string()`
   - `number` → `z.number()`
   - `date` → `z.union([z.string().datetime(), z.string().date(), z.date()])`
   - `enum` → `z.enum(field.options)`
   - `jsonb` → `z.record(z.string(), z.unknown())`
3. **Applies validation rules**
   (`apps/boardroom/src/lib/zod/stencil-schemas.ts:66-151`):
   - Parses `validationRule` string (e.g., `"min:50000|max:500000"`)
   - Applies Zod validators: `.min()`, `.max()`, `.email()`, `.url()`,
     `.regex()`
4. **Handles required/optional** via `.optional()` modifier

**Reasoning:**

- **Single source of truth:** Stencil definition → Zod schema → TypeScript types
- **Runtime validation** ensures data integrity before submission
- **Type inference** via `z.infer<>` provides compile-time safety

**Evidence:** See validation rule parsing in
`apps/boardroom/src/lib/zod/stencil-schemas.ts:82-98`:

```typescript
case 'min':
  if (fieldType === 'number') {
    const minValue = Number.parseFloat(ruleValue)
    if (!Number.isNaN(minValue)) {
      schema = (schema as z.ZodNumber).min(minValue, {
        message: `Must be at least ${ruleValue}`,
      })
    }
  }
```

---

### 3. React Hook Form Integration

**Location:** `apps/boardroom/src/lib/forms/use-stencil-form.ts:26-36`

```typescript
export function useStencilForm<T extends StencilDefinition>(stencil: T) {
  const schema = createStencilSchema(stencil)

  const form = useForm<ProposalDataFromStencil<T>>({
    resolver: zodResolver(schema),
    mode: "onChange", // Validate on change for better UX
    defaultValues: getDefaultValues(stencil),
  })

  return form
}
```

**How it works:**

1. **Generates Zod schema** from stencil definition
2. **Integrates with React Hook Form** via `zodResolver`
3. **Sets validation mode** to `onChange` for real-time feedback
4. **Provides default values** based on field types
   (`apps/boardroom/src/lib/forms/use-stencil-form.ts:41-65`):
   - `string` → `''`
   - `number` → `0`
   - `date` → `YYYY-MM-DD` format
   - `enum` → first option
   - `jsonb` → `{}`

**Reasoning:**

- **Type-safe form state** via `ProposalDataFromStencil<T>` type
- **Real-time validation** improves UX (errors shown immediately)
- **Uncontrolled components** reduce re-renders (React Hook Form pattern)
- **Automatic error handling** via Zod error messages

**Evidence:** See example usage in
`apps/boardroom/src/lib/forms/use-stencil-form.ts:16-24`:

```typescript
const { register, handleSubmit, formState: { errors } } = useStencilForm(stencil)

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('job_title')} />
  {errors.job_title && <span>{errors.job_title.message}</span>}
</form>
```

---

### 4. Visual Stencil Viewer Component

**Location:** `apps/boardroom/components/CodexStencilViewer.tsx:18-60`

```typescript
export function CodexStencilViewer({ stencil, className }: CodexStencilViewerProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-gold font-serif text-lg mb-2">{stencil.name}</h3>
        <div className="text-ash text-sm">
          Version {stencil.version} • ID: <span className="font-mono">{stencil.id}</span>
        </div>
      </div>

      <Card elevation="sm" className="p-4">
        <h4 className="text-parchment font-serif mb-3">Fields</h4>
        <div className="space-y-3">
          {stencil.fields.map((field) => (
            <FieldDefinition key={field.id} field={field} />
          ))}
        </div>
      </Card>

      <Card elevation="sm" className="p-4">
        <h4 className="text-parchment font-serif mb-3">Required Approvers</h4>
        <div className="flex flex-wrap gap-2">
          {stencil.requiredApprovers.map((approver) => (
            <span key={approver} className="px-3 py-1 bg-obsidian border border-gold rounded-xs text-gold text-sm font-mono">
              {approver}
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}
```

**How it works:**

1. **Displays stencil metadata:** name, version, ID
2. **Renders field definitions** with:
   - Field label and type
   - Required indicator
   - Validation rules (if present)
   - Enum options (if present)
3. **Shows required approvers** as badges

**Reasoning:**

- **Transparency:** Users can see what fields are required before filling the
  form
- **Documentation:** Visual representation of schema structure
- **Debugging:** Helps developers understand stencil structure

**Evidence:** See `FieldDefinition` component in
`apps/boardroom/components/CodexStencilViewer.tsx:62-88`:

```typescript
function FieldDefinition({ field }: { field: StencilField }) {
  return (
    <div className="border-b border-charcoal pb-3 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-parchment font-medium">{field.label}</span>
        <div className="flex items-center gap-2">
          {field.required && (
            <span className="text-xs text-ember font-mono">REQUIRED</span>
          )}
          <span className="text-xs text-ash font-mono bg-obsidian px-2 py-1 rounded">
            {field.type}
          </span>
        </div>
      </div>
      {field.validationRule && (
        <div className="text-xs text-ash font-mono mt-1">
          Rule: {field.validationRule}
        </div>
      )}
      {field.options && (
        <div className="text-xs text-ash mt-1">
          Options: {field.options.join(', ')}
        </div>
      )}
    </div>
  )
}
```

---

### 5. Validation Error Handling

**Location:** `apps/boardroom/src/lib/zod/stencil-schemas.ts:173-209`

```typescript
export function validateProposalDataWithZod(
  data: Record<string, unknown>,
  stencil: StencilDefinition
): { valid: boolean; errors: string[]; zodError?: z.ZodError } {
  const schema = createStencilSchema(stencil)
  const result = schema.safeParse(data)

  if (result.success) {
    return { valid: true, errors: [] }
  }

  // Format Zod errors into user-friendly messages
  const errors: string[] = []
  for (const issue of result.error.issues) {
    const fieldPath = issue.path[0]
    const field = fieldPath
      ? stencil.fields.find((f) => f.id === String(fieldPath))
      : undefined
    const fieldLabel = field?.label || (fieldPath ? String(fieldPath) : "field")

    if (issue.code === "invalid_type") {
      errors.push(
        `${fieldLabel} must be of type ${field?.type || "valid type"}`
      )
    } else if (
      issue.code === "too_small" &&
      "type" in issue &&
      issue.type === "string"
    ) {
      errors.push(`${fieldLabel} is required`)
    } else {
      errors.push(`${fieldLabel}: ${issue.message}`)
    }
  }

  return { valid: false, errors, zodError: result.error }
}
```

**How it works:**

1. **Validates data** against generated Zod schema
2. **Maps Zod errors** to user-friendly messages
3. **Uses field labels** instead of field IDs for better UX
4. **Returns structured error object** for UI display

**Reasoning:**

- **User-friendly messages:** Field labels instead of technical IDs
- **Structured errors:** Can be displayed per-field in forms
- **Type-safe:** Returns `zodError` for programmatic handling

---

## Current Implementation Status

### ✅ Implemented:

1. **Stencil definition structure** (`apps/boardroom/src/codex/index.ts`)
2. **Zod schema generation** (`apps/boardroom/src/lib/zod/stencil-schemas.ts`)
3. **React Hook Form integration**
   (`apps/boardroom/src/lib/forms/use-stencil-form.ts`)
4. **Visual stencil viewer**
   (`apps/boardroom/components/CodexStencilViewer.tsx`)
5. **Validation error handling**
   (`apps/boardroom/src/lib/zod/stencil-schemas.ts:173-209`)

### ⚠️ Partially Implemented:

1. **Dynamic form field rendering:** Hook exists but no component that
   automatically renders fields
   - **Evidence:** `useStencilForm` provides form state, but no
     `<DynamicStencilForm>` component found
   - **Gap:** Need component that maps `stencil.fields` to actual form inputs

2. **Stencil loading in UI:** `StrategyDrawer` has TODO comments
   - **Evidence:** `apps/boardroom/components/StrategyDrawer.tsx:139-149`:
     ```typescript
     // TODO: Load stencil definition from server
     // TODO: Load and display stencil using CodexStencilViewer
     ```

### ❌ Missing:

1. **Dynamic form field component** that:
   - Takes `stencil` and `useStencilForm` hook
   - Renders appropriate input types based on `field.type`
   - Displays validation errors inline
   - Handles enum dropdowns, date pickers, etc.

2. **Form submission integration** with Server Actions
   - Need to connect `useStencilForm` to `createProposal` action

---

## Recommended Next Steps

### 1. Create Dynamic Form Component

```typescript
// apps/boardroom/components/DynamicStencilForm.tsx
'use client'

import { useStencilForm } from '@/src/lib/forms/use-stencil-form'
import type { StencilDefinition } from '@/src/codex'

export function DynamicStencilForm({
  stencil,
  onSubmit,
}: {
  stencil: StencilDefinition
  onSubmit: (data: unknown) => Promise<void>
}) {
  const form = useStencilForm(stencil)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {stencil.fields.map((field) => (
        <div key={field.id}>
          <label>{field.label}</label>
          {field.type === 'enum' ? (
            <select {...form.register(field.id)}>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              {...form.register(field.id)}
            />
          )}
          {form.formState.errors[field.id] && (
            <span>{form.formState.errors[field.id]?.message}</span>
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  )
}
```

### 2. Integrate with PrimeReact (Per Phase 13 Plan)

Use PrimeReact components for better UX:

- `InputText` for strings
- `InputNumber` for numbers
- `Calendar` for dates
- `Dropdown` for enums

### 3. Connect to Server Actions

Use `useValidatedFormAction` from
`apps/boardroom/src/lib/forms/validated-form-action.ts` to connect form
submission to `createProposal` action.

---

## Summary

**How UI/UX handles frontend stencils:**

1. **Schema-Driven:** Stencils define structure → Zod schemas provide validation
   → React Hook Form manages state
2. **Type-Safe:** TypeScript types inferred from Zod schemas ensure compile-time
   safety
3. **Real-Time Validation:** `onChange` mode provides immediate feedback
4. **Visual Transparency:** `CodexStencilViewer` displays schema structure
5. **User-Friendly Errors:** Validation errors use field labels, not technical
   IDs

**Evidence Chain:**

- ✅ Stencil definitions exist (`apps/boardroom/src/codex/index.ts`)
- ✅ Zod schema generation works
  (`apps/boardroom/src/lib/zod/stencil-schemas.ts`)
- ✅ React Hook Form integration complete
  (`apps/boardroom/src/lib/forms/use-stencil-form.ts`)
- ✅ Visual viewer component exists
  (`apps/boardroom/components/CodexStencilViewer.tsx`)
- ⚠️ Dynamic form rendering component missing (needs implementation)

**Architecture Pattern:** Contract-First → Schema Generation → Form State → UI
Rendering
