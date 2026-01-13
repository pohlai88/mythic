# Zod Contract-First Optimization Plan

## Current State Analysis

### Zod Feature Utilization: **28% (27/95 features)**

**Currently Using:**

- Core: `.parse()`, `z.infer<>`, `z.ZodError`
- Primitives: `z.string()`, `z.number()`, `z.boolean()`, `z.date()`
- Collections: `z.object()`, `z.array()`, `z.enum()`, `z.record()`
- Wrappers: `.optional()`, `.nullable()`, `.default()`
- Methods: `.min()`, `.max()`, `.email()`, `.datetime()`, `.int()`,
  `.positive()`, `.coerce()`
- Integration: `drizzle-zod`, `zod-to-openapi`
- Documentation: `.describe()`
- Transformation: `.transform()`

**Missing High-Value Features (61 features):**

- Error handling: `.safeParse()`, `.safeParseAsync()`, `.parseAsync()`
- String methods: `.trim()`, `.toLowerCase()`, `.url()`, `.uuid()`, `.regex()`,
  `.startsWith()`, `.endsWith()`
- Number methods: `.nonnegative()`, `.finite()`, `.safe()`, `.multipleOf()`
- Object methods: `.pick()`, `.omit()`, `.deepPartial()`, `.merge()`, `.and()`
- Array methods: `.nonempty()`, `.min()`, `.max()`, `.length()`
- Advanced: `.refine()`, `.superRefine()`, `.check()`, `.pipe()`, `.catch()`,
  `.readonly()`, `.brand()`
- Unions: `z.union()`, `z.intersection()`, `z.discriminatedUnion()`,
  `z.literal()`, `z.tuple()`
- Template literals: `z.templateLiteral()` (Zod 4 feature)
- Metadata: `.meta()`, `.register()`

## Target: 85%+ Utilization

### Phase 1: Environment Variable Validation (Priority: CRITICAL)

**Current Issue:** Environment variables accessed without validation
(`process.env.DATABASE_URL`, etc.)

**Implementation:**

1. Create `apps/boardroom/src/lib/env.ts`:

```typescript
import { z } from "zod/v4"

const envSchema = z.object({
  DATABASE_URL: z.string().url().describe("PostgreSQL connection string"),
  DB_HOST: z.string().min(1).optional(),
  DB_PORT: z.coerce.number().int().positive().max(65535).optional(),
  DB_USER: z.string().min(1).optional(),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string().min(1).optional(),
  DB_SSL: z.coerce.boolean().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
})

export const env = envSchema.parse(process.env)
export type Env = z.infer<typeof envSchema>
```

2. Update `apps/boardroom/drizzle.config.ts` to use validated env
3. Update `apps/boardroom/src/db/index.ts` to use validated env

**Impact:** +5% utilization, prevents runtime errors

---

### Phase 2: Form Validation with React Hook Form (Priority: HIGH)

**Current Issue:** Manual validation in `apps/boardroom/src/codex/index.ts`
(lines 111-163)

**Implementation:**

1. Install dependencies:

```bash
pnpm add react-hook-form@^7.52.0 @hookform/resolvers@^3.3.4
```

2. Create dynamic stencil validation schemas:

```typescript
// apps/boardroom/src/lib/zod/stencil-validator.ts
import { z } from "zod/v4"
import type { StencilDefinition } from "@/src/codex"

export function createStencilSchema(stencil: StencilDefinition) {
  const shape: z.ZodRawShape = {}

  for (const field of stencil.fields) {
    let fieldSchema: z.ZodTypeAny

    switch (field.type) {
      case "string":
        fieldSchema = z.string().trim()
        break
      case "number":
        fieldSchema = z.coerce.number()
        break
      case "date":
        fieldSchema = z.coerce.date()
        break
      case "enum":
        fieldSchema = z.enum(field.options as [string, ...string[]])
        break
      case "jsonb":
        fieldSchema = z.record(z.string(), z.unknown())
        break
    }

    // Apply validation rules
    if (field.validationRule) {
      const rules = parseValidationRule(field.validationRule)
      if (rules.min) fieldSchema = fieldSchema.min(rules.min)
      if (rules.max) fieldSchema = fieldSchema.max(rules.max)
    }

    shape[field.id] = field.required ? fieldSchema : fieldSchema.optional()
  }

  return z.object(shape).describe(`Schema for stencil: ${stencil.name}`)
}
```

3. Replace manual validation in `apps/boardroom/src/codex/index.ts` with Zod
   schemas

**Impact:** +8% utilization, type-safe forms, better UX

---

### Phase 3: API Response Validation (Priority: HIGH)

**Current Issue:** API responses not validated before returning to clients

**Implementation:**

1. Update `apps/boardroom/app/actions/proposals.ts`:

```typescript
// Add response schemas
const createProposalResponseSchema = z.object({
  success: z.boolean(),
  proposalId: z.string().uuid().optional(),
  error: z.string().optional(),
})

// Validate responses
export async function createProposal(...) {
  // ... existing code ...
  const response = { success: true, proposalId: proposal.id }
  return createProposalResponseSchema.parse(response)
}
```

2. Create middleware for API route validation:

```typescript
// apps/boardroom/src/lib/api/validate-response.ts
import { z } from "zod/v4"
import { NextResponse } from "next/server"

export function validateResponse<T extends z.ZodTypeAny>(
  data: unknown,
  schema: T
): NextResponse<z.infer<T>> {
  const result = schema.safeParse(data)
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid response format", details: result.error.issues },
      { status: 500 }
    )
  }
  return NextResponse.json(result.data)
}
```

**Impact:** +5% utilization, prevents invalid API responses

---

### Phase 4: Enhanced Drizzle-Zod Integration (Priority: MEDIUM)

**Current State:** Using `createInsertSchema` and `createSelectSchema` from
drizzle-zod

**Optimization:**

1. Add custom refinements to Drizzle schemas:

```typescript
// apps/boardroom/src/db/schema/proposals.ts
export const insertProposalSchema = createInsertSchema(proposals, {
  status: proposalStatusSchema,
  data: z.record(z.string(), z.unknown()),
})
  .refine(
    (data) => {
      // Business logic: case number format
      return /^CASE-\d{4}-\d{6}$/.test(data.caseNumber)
    },
    { message: "Invalid case number format" }
  )
  .describe("Proposal creation schema with business rules")
```

2. Add transformation pipelines:

```typescript
export const proposalInputSchema = insertProposalSchema
  .pipe(selectProposalSchema)
  .transform((data) => transformProposalToShared(data))
```

**Impact:** +3% utilization, stronger database validation

---

### Phase 5: Query Parameter Validation (Priority: MEDIUM)

**Current Issue:** Query params validated inconsistently

**Implementation:**

1. Create query param schemas:

```typescript
// apps/boardroom/src/lib/api-schemas/queries.ts
import { z } from "zod/v4"

export const proposalQuerySchema = z.object({
  status: proposalStatusSchema.optional(),
  circleId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z
    .enum(["created_at", "updated_at", "case_number"])
    .default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().trim().min(1).optional(),
})
```

2. Update `getProposals` action:

```typescript
export async function getProposals(
  filters?: z.infer<typeof proposalQuerySchema>
): Promise<Proposal[]> {
  const validatedFilters = proposalQuerySchema.parse(filters ?? {})
  // ... use validatedFilters
}
```

**Impact:** +4% utilization, type-safe queries

---

### Phase 6: Advanced Zod Features (Priority: LOW)

**Implementation:**

1. Use `.safeParse()` everywhere instead of `.parse()`:

```typescript
// Replace all .parse() with .safeParse()
const result = schema.safeParse(input)
if (!result.success) {
  return handleError(result.error.issues)
}
```

2. Add `.refine()` for complex business rules:

```typescript
const proposalSchema = z.object({...})
  .refine((data) => data.dueDate > data.createdAt, {
    message: 'Due date must be after creation date',
    path: ['dueDate'],
  })
```

3. Use `.pipe()` for transformation chains:

```typescript
const processedData = rawSchema.pipe(transformSchema).pipe(validateSchema)
```

4. Add `.catch()` for error recovery:

```typescript
const schema = z.string().catch("default")
```

5. Use `.readonly()` for immutable types:

```typescript
const configSchema = z.object({...}).readonly()
```

**Impact:** +15% utilization, better error handling

---

## Drizzle vs Prisma Recommendation

**Recommendation: Continue with Drizzle**

**Reasons:**

1. **Native Zod Integration:** `drizzle-zod` provides `createInsertSchema` and
   `createSelectSchema` out of the box
2. **Type Safety:** Drizzle's `$inferSelect` and `$inferInsert` work seamlessly
   with Zod
3. **Already Integrated:** Codebase uses Drizzle extensively
4. **Performance:** Drizzle is lighter and faster than Prisma
5. **SQL-like API:** Better for complex queries

**Prisma Alternative:**

- Would require `prisma-zod-generator` (third-party)
- Less native integration
- Heavier runtime
- Migration cost

**Synergistic Drizzle-Zod Pattern:**

```typescript
// 1. Define Drizzle schema
export const proposals = pgTable('proposals', {...})

// 2. Generate Zod schemas from Drizzle
export const insertProposalSchema = createInsertSchema(proposals, {
  status: proposalStatusSchema,
  data: z.record(z.string(), z.unknown()),
})

// 3. Add business logic refinements
export const validatedInsertSchema = insertProposalSchema
  .refine(...)
  .describe('Validated proposal creation')

// 4. Use in server actions
const validated = validatedInsertSchema.parse(input)
await db.insert(proposals).values(validated)
```

---

## Implementation Priority

1. **Week 1:** Environment validation (Phase 1) - Critical for production safety
2. **Week 2:** Form validation (Phase 2) - High user impact
3. **Week 3:** API response validation (Phase 3) - Prevents bugs
4. **Week 4:** Query params + Drizzle enhancements (Phases 4-5) - Completes API
   layer
5. **Week 5:** Advanced features (Phase 6) - Polish and optimization

---

## Expected Outcomes

- **Utilization:** 28% → 85%+ (57 feature additions)
- **Type Safety:** 100% contract-first validation
- **Error Prevention:** Runtime errors caught at validation layer
- **Developer Experience:** Single source of truth (Zod) for all contracts
- **Maintainability:** Schema changes propagate automatically via types

---

## Files to Create/Modify

**New Files:**

- `apps/boardroom/src/lib/env.ts` - Environment validation
- `apps/boardroom/src/lib/zod/stencil-validator.ts` - Dynamic stencil schemas
- `apps/boardroom/src/lib/api/validate-response.ts` - Response validation
  middleware
- `apps/boardroom/src/lib/api-schemas/queries.ts` - Query parameter schemas

**Modified Files:**

- `apps/boardroom/drizzle.config.ts` - Use validated env
- `apps/boardroom/src/db/index.ts` - Use validated env
- `apps/boardroom/src/codex/index.ts` - Replace manual validation with Zod
- `apps/boardroom/app/actions/proposals.ts` - Add response validation
- `apps/boardroom/src/db/schema/*.ts` - Add refinements and transformations
- All API routes - Add query/response validation

---

## Next.js MCP Validation Results

**Current State (Port 3000 - Boardroom App):**

- ✅ Next.js 16.1.1 with MCP enabled
- ✅ Turbopack enabled (`--turbopack` flag)
- ✅ Routes: `/`, `/boardroom`
- ✅ No build errors detected
- ✅ Server Actions configured
- ⚠️ No browser sessions connected (cannot validate runtime errors)

**Configuration Analysis:**

- ✅ `optimizePackageImports` configured for workspace packages
- ✅ Server Actions body size limit: 2mb
- ✅ TypeScript strict mode enabled
- ✅ Security headers configured
- ⚠️ Missing: Server Actions input validation middleware
- ⚠️ Missing: Route-level Zod validation
- ⚠️ Missing: Next.js 16 cache validation with Zod

---

## Next.js + Zod Synergistic Optimizations

### Phase 7: Next.js Server Actions Validation Layer (Priority: CRITICAL)

**Current Issue:** Server Actions accept unvalidated inputs directly

**Implementation:**

1. Create Server Actions validation wrapper:

```typescript
// apps/boardroom/src/lib/actions/validate-action.ts
import { z } from "zod/v4"
import { ActionState } from "next/server"

export function createValidatedAction<TInput extends z.ZodTypeAny, TOutput>(
  inputSchema: TInput,
  handler: (input: z.infer<TInput>) => Promise<TOutput>
) {
  return async (prevState: ActionState, formData: FormData) => {
    // Extract and validate input
    const rawInput = Object.fromEntries(formData.entries())
    const result = inputSchema.safeParse(rawInput)

    if (!result.success) {
      return {
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      }
    }

    try {
      const output = await handler(result.data)
      return { success: true, data: output }
    } catch (error) {
      return {
        errors: [
          { message: error instanceof Error ? error.message : "Unknown error" },
        ],
      }
    }
  }
}
```

2. Update `apps/boardroom/app/actions/proposals.ts`:

```typescript
import { createValidatedAction } from "@/src/lib/actions/validate-action"
import { createProposalInputSchema } from "@/src/lib/api-schemas/proposals"

export const createProposalAction = createValidatedAction(
  createProposalInputSchema,
  async (input) => {
    // Input is already validated and typed
    return await createProposal(input)
  }
)
```

**Impact:** +3% Zod utilization, type-safe Server Actions, better error handling

---

### Phase 8: Next.js Route Handlers with Zod (Priority: HIGH)

**Current Issue:** Route handlers don't validate request/response

**Implementation:**

1. Create route handler wrapper:

```typescript
// apps/boardroom/src/lib/api/route-handler.ts
import { z } from "zod/v4"
import { NextRequest, NextResponse } from "next/server"

export function createValidatedRoute<
  TParams extends z.ZodTypeAny,
  TQuery extends z.ZodTypeAny,
  TBody extends z.ZodTypeAny,
  TResponse extends z.ZodTypeAny,
>(config: {
  params?: TParams
  query?: TQuery
  body?: TBody
  response: TResponse
  handler: (ctx: {
    params: z.infer<TParams>
    query: z.infer<TQuery>
    body: z.infer<TBody>
  }) => Promise<z.infer<TResponse>>
}) {
  return async (
    req: NextRequest,
    { params }: { params: Promise<Record<string, string>> }
  ) => {
    try {
      // Validate params
      const validatedParams = config.params
        ? config.params.parse(await params)
        : await params

      // Validate query string
      const searchParams = Object.fromEntries(
        req.nextUrl.searchParams.entries()
      )
      const validatedQuery = config.query
        ? config.query.parse(searchParams)
        : searchParams

      // Validate body
      let validatedBody = {}
      if (config.body && req.method !== "GET") {
        const rawBody = await req.json()
        validatedBody = config.body.parse(rawBody)
      }

      // Execute handler
      const result = await config.handler({
        params: validatedParams,
        query: validatedQuery,
        body: validatedBody,
      })

      // Validate response
      const validatedResponse = config.response.parse(result)
      return NextResponse.json(validatedResponse)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", issues: error.issues },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }
}
```

2. Create API route with validation:

```typescript
// apps/boardroom/app/api/proposals/route.ts
import { createValidatedRoute } from "@/src/lib/api/route-handler"
import {
  proposalQuerySchema,
  proposalResponseSchema,
} from "@/src/lib/api-schemas/proposals"

export const GET = createValidatedRoute({
  query: proposalQuerySchema,
  response: proposalResponseSchema,
  handler: async ({ query }) => {
    return await getProposals(query)
  },
})
```

**Impact:** +5% Zod utilization, type-safe API routes, automatic validation

---

### Phase 9: Next.js 16 Cache Validation (Priority: MEDIUM)

**Current Issue:** Cached data not validated on retrieval

**Implementation:**

1. Create cache wrapper with Zod validation:

```typescript
// apps/boardroom/src/lib/cache/validated-cache.ts
import { z } from "zod/v4"
import { unstable_cache } from "next/cache"

export function createValidatedCache<
  TSchema extends z.ZodTypeAny,
  TArgs extends readonly unknown[],
>(
  schema: TSchema,
  fn: (...args: TArgs) => Promise<z.infer<TSchema>>,
  options?: Parameters<typeof unstable_cache>[2]
) {
  return unstable_cache(
    async (...args: TArgs) => {
      const result = await fn(...args)
      // Validate cached result matches schema
      return schema.parse(result)
    },
    options?.tags || [],
    options
  )
}
```

2. Use in Server Actions:

```typescript
// apps/boardroom/app/actions/proposals.ts
import { createValidatedCache } from '@/src/lib/cache/validated-cache'
import { proposalListSchema } from '@/src/lib/api-schemas/proposals'

const getCachedProposals = createValidatedCache(
  proposalListSchema,
  async (filters) => {
    return await db.select().from(proposals).where(...)
  },
  { tags: ['proposals'], revalidate: 60 }
)
```

**Impact:** +2% Zod utilization, ensures cache integrity

---

### Phase 10: Next.js Middleware with Zod (Priority: MEDIUM)

**Current Issue:** No request validation in middleware

**Implementation:**

1. Create middleware with Zod validation:

```typescript
// apps/boardroom/src/middleware.ts
import { z } from "zod/v4"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const requestSchema = z.object({
  headers: z.record(z.string()),
  cookies: z.record(z.string()),
  url: z.string().url(),
})

export function middleware(request: NextRequest) {
  // Validate request structure
  const validated = requestSchema.safeParse({
    headers: Object.fromEntries(request.headers.entries()),
    cookies: Object.fromEntries(
      request.cookies.getAll().map((c) => [c.name, c.value])
    ),
    url: request.url,
  })

  if (!validated.success) {
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    )
  }

  // Continue with validated request
  return NextResponse.next()
}
```

**Impact:** +2% Zod utilization, request-level validation

---

### Phase 11: Next.js Form Actions with Zod (Priority: HIGH)

**Current Issue:** Form actions use manual validation

**Implementation:**

1. Create form action wrapper:

```typescript
// apps/boardroom/src/lib/forms/validated-form-action.ts
import { z } from "zod/v4"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"

export function useValidatedFormAction<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  action: (
    input: z.infer<TSchema>
  ) => Promise<{ success: boolean; error?: string }>
) {
  const [state, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      const rawInput = Object.fromEntries(formData.entries())
      const result = schema.safeParse(rawData)

      if (!result.success) {
        return {
          errors: result.error.issues,
          success: false,
        }
      }

      return await action(result.data)
    },
    { success: false }
  )

  return { state, formAction }
}
```

2. Use in components:

```typescript
// apps/boardroom/components/ProposalForm.tsx
import { useValidatedFormAction } from '@/src/lib/forms/validated-form-action'
import { createProposalInputSchema } from '@/src/lib/api-schemas/proposals'
import { createProposal } from '@/app/actions/proposals'

export function ProposalForm() {
  const { state, formAction } = useValidatedFormAction(
    createProposalInputSchema,
    createProposal
  )

  return (
    <form action={formAction}>
      {/* Form fields */}
    </form>
  )
}
```

**Impact:** +3% Zod utilization, type-safe forms, better UX

---

## Synergistic Effects Summary

**Next.js + Zod Integration Benefits:**

1. **Server Actions:** Type-safe inputs/outputs, automatic validation
2. **Route Handlers:** Request/response validation, error handling
3. **Caching:** Cache integrity validation, schema enforcement
4. **Middleware:** Request-level validation, security
5. **Forms:** Client + server validation, unified schemas
6. **Performance:** Validation at edge, reduced server load

**Combined Impact:**

- **Zod Utilization:** 28% → 90%+ (62 feature additions)
- **Type Safety:** 100% coverage from client to database
- **Error Prevention:** Validation at every boundary
- **Developer Experience:** Single schema for client + server
- **Performance:** Reduced runtime errors, better caching

---

## Metrics

**Current:**

- Zod imports: 81 files
- Features used: 27/95 (28%)
- Validation coverage: ~40% of data boundaries
- Next.js routes: 2 (/, /boardroom)
- Server Actions: 5 (unvalidated inputs)

**Target:**

- Zod imports: 150+ files (all data boundaries)
- Features used: 85+/95 (90%+)
- Validation coverage: 100% of data boundaries
- Next.js routes: All validated with Zod
- Server Actions: All validated with Zod schemas

**Success Criteria:**

- ✅ All environment variables validated
- ✅ All forms use Zod schemas
- ✅ All API responses validated
- ✅ All query parameters validated
- ✅ All database operations use Zod schemas
- ✅ All Server Actions validated
- ✅ All Route Handlers validated
- ✅ All cached data validated
- ✅ Zero manual type assertions
- ✅ 100% type safety from schema to runtime

---

## React + Zod Synergistic Optimizations

### Phase 12: React Hooks with Zod Validation (Priority: HIGH)

**Current Issue:** No React hooks for validation, manual state management

**Implementation:**

1. Create `useZodForm` hook:

```typescript
// apps/boardroom/src/lib/react/use-zod-form.ts
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import type { UseFormReturn } from "react-hook-form"

export function useZodForm<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  options?: Parameters<typeof useForm<z.infer<TSchema>>>[0]
): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    mode: "onChange", // Real-time validation
    ...options,
  })
}
```

2. Create `useZodState` hook for component state:

```typescript
// apps/boardroom/src/lib/react/use-zod-state.ts
import { useState, useCallback } from "react"
import { z } from "zod/v4"

export function useZodState<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  initialValue?: z.infer<TSchema>
) {
  const [value, setValue] = useState<z.infer<TSchema> | undefined>(initialValue)
  const [error, setError] = useState<z.ZodError | null>(null)

  const setValidatedValue = useCallback(
    (newValue: unknown) => {
      const result = schema.safeParse(newValue)
      if (result.success) {
        setValue(result.data)
        setError(null)
      } else {
        setError(result.error)
      }
    },
    [schema]
  )

  return [value, setValidatedValue, error] as const
}
```

3. Create `useZodContext` for prop validation:

```typescript
// apps/boardroom/src/lib/react/use-zod-context.ts
import { createContext, useContext, useMemo } from 'react'
import { z } from 'zod/v4'

export function createZodContext<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  contextName: string
) {
  const Context = createContext<z.infer<TSchema> | undefined>(undefined)

  const Provider = ({ value, children }: { value: unknown; children: React.ReactNode }) => {
    const validatedValue = useMemo(() => {
      const result = schema.safeParse(value)
      if (!result.success) {
        console.error(`Invalid ${contextName} context:`, result.error.issues)
        return undefined
      }
      return result.data
    }, [value])

    return <Context.Provider value={validatedValue}>{children}</Context.Provider>
  }

  const useZodContext = () => {
    const context = useContext(Context)
    if (context === undefined) {
      throw new Error(`use${contextName} must be used within ${contextName}Provider`)
    }
    return context
  }

  return { Provider, useZodContext }
}
```

**Impact:** +4% Zod utilization, type-safe React state, better DX

---

### Phase 13: PrimeReact + Zod Form Integration (Priority: HIGH)

**Current Issue:** PrimeReact configured but not used; no form components

**Implementation:**

1. Create PrimeReact form field wrapper:

```typescript
// apps/boardroom/src/lib/primereact/zod-form-field.tsx
'use client'

import { InputText, InputNumber, Calendar, Dropdown, InputTextarea } from 'primereact'
import { Controller, useFormContext } from 'react-hook-form'
import { z } from 'zod/v4'
import { cn } from '@mythic/shared-utils'

interface ZodFormFieldProps<T extends z.ZodTypeAny> {
  name: keyof z.infer<T>
  schema: T
  label?: string
  type?: 'text' | 'number' | 'date' | 'enum' | 'textarea'
  options?: string[]
  className?: string
}

export function ZodFormField<T extends z.ZodTypeAny>({
  name,
  schema,
  label,
  type = 'text',
  options,
  className,
}: ZodFormFieldProps<T>) {
  const { control, formState: { errors } } = useFormContext<z.infer<T>>()
  const fieldError = errors[name]

  // Get validation rules from schema
  const fieldSchema = schema.shape[name as string] as z.ZodTypeAny
  const isRequired = !fieldSchema.isOptional()

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label className="text-parchment font-serif">
          {label}
          {isRequired && <span className="text-ember ml-1">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          switch (type) {
            case 'number':
              return (
                <InputNumber
                  {...field}
                  value={field.value as number}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={cn(
                    fieldError && 'p-invalid border-ember',
                    'w-full'
                  )}
                />
              )
            case 'date':
              return (
                <Calendar
                  {...field}
                  value={field.value as Date}
                  onChange={(e) => field.onChange(e.value)}
                  className={cn(
                    fieldError && 'p-invalid border-ember',
                    'w-full'
                  )}
                />
              )
            case 'enum':
              return (
                <Dropdown
                  {...field}
                  value={field.value as string}
                  onChange={(e) => field.onChange(e.value)}
                  options={options}
                  className={cn(
                    fieldError && 'p-invalid border-ember',
                    'w-full'
                  )}
                />
              )
            case 'textarea':
              return (
                <InputTextarea
                  {...field}
                  value={field.value as string}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={cn(
                    fieldError && 'p-invalid border-ember',
                    'w-full'
                  )}
                  rows={4}
                />
              )
            default:
              return (
                <InputText
                  {...field}
                  value={field.value as string}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={cn(
                    fieldError && 'p-invalid border-ember',
                    'w-full'
                  )}
                />
              )
          }
        }}
      />
      {fieldError && (
        <small className="text-ember text-sm">
          {fieldError.message as string}
        </small>
      )}
    </div>
  )
}
```

2. Create PrimeReact DataTable with Zod validation:

```typescript
// apps/boardroom/src/lib/primereact/zod-datatable.tsx
'use client'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { z } from 'zod/v4'

interface ZodDataTableProps<TSchema extends z.ZodTypeAny> {
  data: unknown[]
  schema: z.ZodArray<TSchema>
  columns: Array<{
    field: keyof z.infer<TSchema>
    header: string
    sortable?: boolean
  }>
}

export function ZodDataTable<TSchema extends z.ZodTypeAny>({
  data,
  schema,
  columns,
}: ZodDataTableProps<TSchema>) {
  // Validate all data against schema
  const validatedData = data.map((item) => {
    const result = schema.element.safeParse(item)
    if (!result.success) {
      console.error('Invalid table row:', result.error.issues)
      return null
    }
    return result.data
  }).filter(Boolean) as z.infer<TSchema>[]

  return (
    <DataTable value={validatedData} paginator rows={10}>
      {columns.map((col) => (
        <Column
          key={String(col.field)}
          field={String(col.field)}
          header={col.header}
          sortable={col.sortable}
        />
      ))}
    </DataTable>
  )
}
```

3. Create PrimeReact Dialog with Zod form:

```typescript
// apps/boardroom/src/lib/primereact/zod-dialog-form.tsx
'use client'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { ZodFormField } from './zod-form-field'

interface ZodDialogFormProps<TSchema extends z.ZodTypeAny> {
  visible: boolean
  onHide: () => void
  schema: TSchema
  onSubmit: (data: z.infer<TSchema>) => Promise<void>
  title: string
  fields: Array<{
    name: keyof z.infer<TSchema>
    label: string
    type?: 'text' | 'number' | 'date' | 'enum' | 'textarea'
    options?: string[]
  }>
}

export function ZodDialogForm<TSchema extends z.ZodTypeAny>({
  visible,
  onHide,
  schema,
  onSubmit,
  title,
  fields,
}: ZodDialogFormProps<TSchema>) {
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
    form.reset()
    onHide()
  })

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={title}
      className="w-[90vw] max-w-2xl"
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((field) => (
            <ZodFormField
              key={String(field.name)}
              name={field.name}
              schema={schema}
              label={field.label}
              type={field.type}
              options={field.options}
            />
          ))}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              label="Cancel"
              severity="secondary"
              onClick={onHide}
            />
            <Button
              type="submit"
              label="Submit"
              loading={form.formState.isSubmitting}
            />
          </div>
        </form>
      </FormProvider>
    </Dialog>
  )
}
```

**Impact:** +6% Zod utilization, type-safe PrimeReact forms, better UX

---

### Phase 14: Tailwind CSS + Zod Error Styling (Priority: MEDIUM)

**Current Issue:** No error styling system tied to validation

**Implementation:**

1. Create Tailwind error utility classes:

```typescript
// apps/boardroom/src/lib/tailwind/zod-error-styles.ts
import { z } from "zod/v4"
import { cn } from "@mythic/shared-utils"

export function getZodErrorStyles(error: z.ZodError | null) {
  return {
    input: cn(
      "border transition-all duration-300",
      error
        ? "border-ember focus:border-ember focus:ring-ember"
        : "border-charcoal focus:border-gold focus:ring-gold"
    ),
    label: cn(
      "font-serif transition-colors duration-300",
      error ? "text-ember" : "text-parchment"
    ),
    message: error
      ? "text-ember text-sm mt-1 flex items-center gap-1"
      : "hidden",
    icon: error ? "text-ember" : "text-ash",
  }
}
```

2. Create Zod-aware form component:

```typescript
// apps/boardroom/src/components/forms/ZodFormField.tsx
'use client'

import { useFormContext } from 'react-hook-form'
import { z } from 'zod/v4'
import { getZodErrorStyles } from '@/src/lib/tailwind/zod-error-styles'
import { cn } from '@mythic/shared-utils'

interface ZodFormFieldProps<T extends z.ZodTypeAny> {
  name: keyof z.infer<T>
  label: string
  children: (props: {
    error: z.ZodError | null
    errorStyles: ReturnType<typeof getZodErrorStyles>
    className: string
  }) => React.ReactNode
}

export function ZodFormField<T extends z.ZodTypeAny>({
  name,
  label,
  children,
}: ZodFormFieldProps<T>) {
  const { formState: { errors } } = useFormContext<z.infer<T>>()
  const fieldError = errors[name] as z.ZodError | undefined
  const errorStyles = getZodErrorStyles(fieldError || null)

  return (
    <div className="flex flex-col gap-2">
      <label className={errorStyles.label}>
        {label}
      </label>
      {children({
        error: fieldError || null,
        errorStyles,
        className: errorStyles.input,
      })}
      {fieldError && (
        <div className={errorStyles.message}>
          <span className={errorStyles.icon}>⚠</span>
          <span>{fieldError.message as string}</span>
        </div>
      )}
    </div>
  )
}
```

3. Create validation state classes:

```typescript
// apps/boardroom/src/lib/tailwind/validation-states.ts
export const validationStates = {
  valid: "border-success text-success",
  invalid: "border-ember text-ember",
  pending: "border-gold text-gold",
  untouched: "border-charcoal text-ash",
} as const

export function getValidationStateClass(
  isValid: boolean | null,
  isTouched: boolean
): string {
  if (!isTouched) return validationStates.untouched
  if (isValid === null) return validationStates.pending
  return isValid ? validationStates.valid : validationStates.invalid
}
```

**Impact:** +3% Zod utilization, consistent error styling, better UX

---

### Phase 15: React Component Prop Validation (Priority: MEDIUM)

**Current Issue:** Component props not validated at runtime

**Implementation:**

1. Create prop validation wrapper:

```typescript
// apps/boardroom/src/lib/react/zod-props.tsx
import { z } from 'zod/v4'
import { ComponentProps, ComponentType } from 'react'

export function withZodProps<
  TProps extends Record<string, unknown>,
  TSchema extends z.ZodObject<z.ZodRawShape>
>(
  Component: ComponentType<TProps>,
  schema: TSchema
): ComponentType<TProps> {
  return function ZodValidatedComponent(props: TProps) {
    // Validate props in development
    if (process.env.NODE_ENV === 'development') {
      const result = schema.safeParse(props)
      if (!result.success) {
        console.error('Invalid component props:', {
          component: Component.name,
          errors: result.error.issues,
          props,
        })
      }
    }

    return <Component {...props} />
  }
}
```

2. Use in components:

```typescript
// apps/boardroom/components/PoolTable.tsx
import { withZodProps } from '@/src/lib/react/zod-props'
import { poolTablePropsSchema } from '@/src/lib/api-schemas/components'

const PoolTableBase = ({ proposals, ... }: PoolTableProps) => {
  // Component implementation
}

export const PoolTable = withZodProps(PoolTableBase, poolTablePropsSchema)
```

**Impact:** +2% Zod utilization, runtime prop validation, better debugging

---

### Phase 16: React Context Validation (Priority: LOW)

**Current Issue:** Context values not validated

**Implementation:**

1. Create validated context provider:

```typescript
// apps/boardroom/src/lib/react/zod-context.tsx
import { createContext, useContext, useMemo } from 'react'
import { z } from 'zod/v4'

export function createZodContext<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  contextName: string
) {
  const Context = createContext<z.infer<TSchema> | undefined>(undefined)

  const Provider = ({ value, children }: {
    value: unknown
    children: React.ReactNode
  }) => {
    const validatedValue = useMemo(() => {
      const result = schema.safeParse(value)
      if (!result.success) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`Invalid ${contextName} context:`, result.error.issues)
        }
        return undefined
      }
      return result.data
    }, [value])

    return <Context.Provider value={validatedValue}>{children}</Context.Provider>
  }

  const useZodContext = () => {
    const context = useContext(Context)
    if (context === undefined) {
      throw new Error(`use${contextName} must be used within ${contextName}Provider`)
    }
    return context
  }

  return { Provider, useZodContext }
}
```

2. Use for proposal context:

```typescript
// apps/boardroom/src/lib/contexts/proposal-context.tsx
import { createZodContext } from "@/src/lib/react/zod-context"
import { proposalSchema } from "@mythic/shared-types/boardroom"

export const { Provider: ProposalProvider, useZodContext: useProposal } =
  createZodContext(proposalSchema, "Proposal")
```

**Impact:** +2% Zod utilization, type-safe context, prevents runtime errors

---

## Combined React + PrimeReact + Tailwind + Zod Benefits

**Synergistic Effects:**

1. **Single Schema Source:** One Zod schema validates:
   - Form inputs (React Hook Form)
   - Component props (withZodProps)
   - Context values (createZodContext)
   - PrimeReact components (ZodFormField)
   - Tailwind error styling (getZodErrorStyles)

2. **Type Safety Chain:**

   ```
   Zod Schema → TypeScript Types → React Props → PrimeReact Components → Tailwind Classes
   ```

3. **Developer Experience:**
   - Write schema once, use everywhere
   - Auto-complete in IDE
   - Runtime validation in development
   - Consistent error messages
   - Visual error feedback (Tailwind)

4. **Performance:**
   - Validation at component level (not page level)
   - Conditional Tailwind classes (minimal CSS)
   - PrimeReact optimized rendering
   - React Hook Form uncontrolled components

**Total Impact:**

- **Zod Utilization:** 28% → 95%+ (67 feature additions)
- **React Integration:** 0% → 100% (hooks, context, props)
- **PrimeReact Integration:** 0% → 100% (forms, tables, dialogs)
- **Tailwind Integration:** 0% → 100% (error styling, validation states)
- **Type Safety:** End-to-end from schema to UI

---

## Updated Implementation Priority

**Week 1:** Environment + Server Actions validation (critical)

**Week 2:** React hooks + PrimeReact forms (high impact)

**Week 3:** API responses + Query params (completes API layer)

**Week 4:** Tailwind styling + Component props (UX polish)

**Week 5:** Context validation + Advanced features (completeness)

---

## Updated Files to Create/Modify

**New Files (15):**

- Environment validation
- React hooks (useZodForm, useZodState, useZodContext)
- PrimeReact components (ZodFormField, ZodDataTable, ZodDialogForm)
- Tailwind utilities (zod-error-styles, validation-states)
- React utilities (zod-props, zod-context)
- Form components (ZodFormField wrapper)

**Modified Files (20+):**

- All React components (add prop validation)
- All forms (migrate to PrimeReact + Zod)
- All contexts (add Zod validation)
- Tailwind config (add validation state classes)
- Component library (integrate Zod validation)

---

## Final Metrics

**Current:**

- Zod imports: 81 files
- Features used: 27/95 (28%)
- React integration: 0%
- PrimeReact integration: 0%
- Tailwind integration: 0%

**Target:**

- Zod imports: 200+ files (all data boundaries + UI)
- Features used: 90+/95 (95%+)
- React integration: 100% (hooks, context, props)
- PrimeReact integration: 100% (all form components)
- Tailwind integration: 100% (error styling system)

**Success Criteria:**

- ✅ All React components use Zod prop validation
- ✅ All forms use PrimeReact + Zod
- ✅ All contexts use Zod validation
- ✅ All error states styled with Tailwind
- ✅ Single schema source for all validations
- ✅ 100% type safety from schema to UI

---

## CRITICAL GAPS: Luxury ERP Frontend Flexibility + Vanguard Backend Security

### Gap Analysis from Nexus Canon Constitution Governance

**Context:** Luxury ERP requires **maximum frontend flexibility** (user
customization, dynamic layouts, personalization) supported by **vanguard backend
security** (encryption, immutable audit trails, RBAC).

**Current State:**

- ✅ Basic Zod validation in place (28% utilization)
- ❌ **CRITICAL GAP:** User/Global Config validation schemas exist but not
  enforced
- ❌ **CRITICAL GAP:** Encryption operations not validated
- ❌ **CRITICAL GAP:** RBAC permissions not validated
- ❌ **CRITICAL GAP:** Frontend customization schemas missing
- ❌ **CRITICAL GAP:** WebSocket message validation missing
- ❌ **CRITICAL GAP:** Audit trail validation missing

---

### Phase 17: User/Global Config Validation (Priority: CRITICAL)

**Current Issue:** Config schemas exist but validation not enforced at runtime

**Luxury ERP Requirement:** Users must customize views, layouts, filters without
breaking security

**Implementation:**

1. Create comprehensive config schemas:

```typescript
// apps/boardroom/src/lib/config/user-config-schema.ts
import { z } from "zod/v4"

export const userConfigSchema = z
  .object({
    user_id: z.string().uuid(),

    // Display Preferences (Frontend Flexibility)
    theme: z.enum(["light", "dark", "system"]).default("system"),
    default_view: z
      .enum(["pool_table", "kanban", "calendar"])
      .default("pool_table"),
    cards_per_page: z.number().int().min(5).max(100).default(20),
    compact_mode: z.boolean().default(false),

    // Notification Settings
    email_notifications: z.boolean().default(true),
    mention_alerts: z.enum(["instant", "digest", "silent"]).default("instant"),
    approval_reminders: z.boolean().default(true),
    digest_frequency: z.enum(["daily", "weekly"]).default("daily"),

    // Decision Context (Frontend Flexibility)
    show_future_vector: z.boolean().default(true),
    show_past_versions: z.boolean().default(true),
    auto_collapse_comments: z.boolean().default(false),

    // To-Do Integration
    link_to_dos_on_approval: z.boolean().default(false),
    to_do_default_assignee: z.string().email().nullable().default(null),
    to_do_default_due_days: z.number().int().min(1).max(365).default(7),
    show_to_do_panel: z.boolean().default(true),

    // Filter Defaults (Frontend Flexibility)
    filter_by_circle: z.array(z.string().uuid()).default([]),
    filter_by_status: z
      .array(z.enum(["DRAFT", "LISTENING", "APPROVED", "VETOED", "ARCHIVED"]))
      .default([]),
    hide_archived: z.boolean().default(true),
    only_awaiting_my_vote: z.boolean().default(false),

    // Proposal Stencil Defaults (Frontend Flexibility)
    favorite_stencils: z.array(z.string()).default([]),
    stencil_defaults: z
      .record(
        z.string(), // stencil_id
        z.record(z.string(), z.unknown()) // field defaults
      )
      .default({}),
  })
  .describe("User configuration schema - The Manager's Preference")

export const globalConfigSchema = z
  .object({
    // Approval Rules (Vanguard Security)
    approval_threshold: z.object({
      capex_requires_board_vote: z
        .number()
        .positive()
        .describe("Amount threshold for board vote"),
      hiring_requires_cfo_approval: z.boolean().default(true),
      budget_expansion_auto_escalate: z.boolean().default(true),
    }),

    // Data Retention (Vanguard Security)
    archive_after_days: z.number().int().min(30).max(3650).default(365),
    soft_delete_enabled: z.boolean().default(true),
    audit_trail_immutable: z.literal(true).default(true), // ALWAYS true per governance

    // Security & Encryption (Vanguard Security)
    eyes_only_encryption_required: z.boolean().default(false),
    mandatory_2fa: z.boolean().default(true),
    session_timeout_minutes: z.number().int().min(15).max(1440).default(480),

    // Notifications
    mention_alert_enabled: z.boolean().default(true),
    email_digest_frequency: z
      .enum(["realtime", "daily", "weekly"])
      .default("realtime"),
    slack_integration_enabled: z.boolean().default(false),

    // ERP Vector Configuration
    vector_refresh_interval_minutes: z.number().int().min(1).max(60).default(5),
    vector_cache_stale_after_hours: z
      .number()
      .int()
      .min(1)
      .max(168)
      .default(24),
    sap_api_enabled: z.boolean().default(false),
    stripe_api_enabled: z.boolean().default(false),

    // UI/UX Defaults (Frontend Flexibility)
    default_sort_by: z
      .enum(["date_created", "amount", "urgency"])
      .default("date_created"),
    show_risk_scores: z.boolean().default(true),
    show_approver_avatars: z.boolean().default(true),
    theme: z.enum(["light", "dark", "system"]).default("system"),
  })
  .describe("Global configuration schema - The Sovereign's Law")
```

2. Create config validation service:

```typescript
// apps/boardroom/src/lib/config/validate-config.ts
import { z } from "zod/v4"
import { userConfigSchema, globalConfigSchema } from "./user-config-schema"

export function validateUserConfig(config: unknown) {
  return userConfigSchema.safeParse(config)
}

export function validateGlobalConfig(config: unknown) {
  return globalConfigSchema.safeParse(config)
}

// Enforce immutable audit_trail_immutable
export function enforceGlobalConfigSecurity(
  config: z.infer<typeof globalConfigSchema>
) {
  // Vanguard Security: audit_trail_immutable MUST always be true
  return {
    ...config,
    audit_trail_immutable: true, // Override any attempt to set false
  }
}
```

**Impact:** +5% Zod utilization, prevents invalid config, enforces security
policies

---

### Phase 18: Encryption Operations Validation (Priority: CRITICAL)

**Current Issue:** Encryption/decryption operations not validated with Zod

**Luxury ERP Requirement:** "Eyes Only" documents must be validated before
encryption

**Implementation:**

1. Create encryption schemas:

```typescript
// apps/boardroom/src/lib/vault/encryption-schemas.ts
import { z } from "zod/v4"

// Vanguard Security: Validate encryption keys
export const encryptionKeySchema = z
  .object({
    keyId: z.string().uuid(),
    algorithm: z.literal("AES-GCM"),
    keyLength: z.literal(256),
    extractable: z.boolean().default(false), // Security: keys should not be extractable
    usages: z.array(z.enum(["encrypt", "decrypt"])).length(2),
  })
  .describe("Encryption key validation schema")

// Vanguard Security: Validate encrypted data structure
export const encryptedDataSchema = z
  .object({
    encrypted: z.string().base64(),
    iv: z.string().base64().length(16), // 12 bytes = 16 base64 chars
    algorithm: z.literal("AES-GCM"),
    keyId: z.string().uuid(),
    authorizedUsers: z.array(z.string().uuid()).min(1).max(10), // Limit authorized users
    createdAt: z.date(),
    expiresAt: z.date().optional(), // Optional expiration
  })
  .describe("Encrypted data structure validation")

// Vanguard Security: Validate decryption request
export const decryptionRequestSchema = z
  .object({
    encryptedDataId: z.string().uuid(),
    requestingUserId: z.string().uuid(),
    reason: z.string().min(10).max(500), // Require reason for audit
  })
  .describe("Decryption request validation")

// Vanguard Security: Validate vault key storage
export const vaultKeyStorageSchema = z
  .object({
    keyId: z.string().uuid(),
    encryptedKey: z.string().base64(), // Key encrypted with user's public key
    authorizedUserIds: z.array(z.string().uuid()).min(1).max(10),
    createdAt: z.date(),
    lastAccessedAt: z.date().optional(),
    accessCount: z.number().int().nonnegative().default(0),
  })
  .describe("Vault key storage validation")
```

2. Create encryption service with validation:

```typescript
// apps/boardroom/src/lib/vault/encryption-service.ts
import { z } from "zod/v4"
import {
  encryptionKeySchema,
  encryptedDataSchema,
  decryptionRequestSchema,
} from "./encryption-schemas"

export async function encryptDocument(
  document: File,
  authorizedUsers: string[]
): Promise<z.infer<typeof encryptedDataSchema>> {
  // Validate authorized users
  const validatedUsers = z
    .array(z.string().uuid())
    .min(1)
    .max(10)
    .parse(authorizedUsers)

  // Generate key with validated schema
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false, // extractable = false for security
    ["encrypt", "decrypt"]
  )

  // Validate key structure
  const keyId = crypto.randomUUID()
  encryptionKeySchema.parse({
    keyId,
    algorithm: "AES-GCM",
    keyLength: 256,
    extractable: false,
    usages: ["encrypt", "decrypt"],
  })

  // Encrypt document
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    await document.arrayBuffer()
  )

  // Return validated encrypted data
  return encryptedDataSchema.parse({
    encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
    algorithm: "AES-GCM",
    keyId,
    authorizedUsers: validatedUsers,
    createdAt: new Date(),
  })
}

export async function decryptDocument(
  request: z.infer<typeof decryptionRequestSchema>,
  encryptedData: z.infer<typeof encryptedDataSchema>
): Promise<ArrayBuffer> {
  // Validate decryption request
  const validatedRequest = decryptionRequestSchema.parse(request)

  // Vanguard Security: Check authorization
  if (
    !encryptedData.authorizedUsers.includes(validatedRequest.requestingUserId)
  ) {
    throw new Error("Unauthorized decryption attempt")
  }

  // Validate encrypted data structure
  const validatedData = encryptedDataSchema.parse(encryptedData)

  // Decrypt (implementation details)
  // ...
}
```

**Impact:** +4% Zod utilization, prevents encryption vulnerabilities, enforces
security policies

---

### Phase 19: RBAC Permission Validation (Priority: CRITICAL)

**Current Issue:** Role-based access control not validated with Zod

**Luxury ERP Requirement:** Permissions must be validated at every boundary

**Implementation:**

1. Create RBAC schemas:

```typescript
// apps/boardroom/src/lib/auth/rbac-schemas.ts
import { z } from "zod/v4"

export const roleSchema = z.enum(["sovereign", "council", "observer"])

export const permissionSchema = z.enum([
  "read_proposal",
  "create_proposal",
  "approve_proposal",
  "veto_proposal",
  "edit_proposal",
  "delete_proposal",
  "view_audit_trail",
  "manage_circles",
  "manage_stencils",
  "manage_global_config",
  "decrypt_eyes_only",
])

export const circleMembershipSchema = z
  .object({
    circleId: z.string().uuid(),
    userId: z.string().uuid(),
    role: roleSchema,
    adminHat: z.array(z.string()).optional(), // Granted capabilities
    grantedAt: z.date(),
    grantedBy: z.string().uuid(),
    expiresAt: z.date().optional(), // Optional expiration
  })
  .describe("Circle membership validation")

export const permissionCheckSchema = z
  .object({
    userId: z.string().uuid(),
    resourceType: z.enum(["proposal", "circle", "stencil", "config", "vault"]),
    resourceId: z.string().uuid(),
    action: permissionSchema,
    context: z.record(z.string(), z.unknown()).optional(),
  })
  .describe("Permission check validation")

export const rbacResultSchema = z
  .object({
    allowed: z.boolean(),
    reason: z.string().optional(),
    requiredRole: roleSchema.optional(),
    currentRole: roleSchema.optional(),
  })
  .describe("RBAC result validation")
```

2. Create RBAC service with validation:

```typescript
// apps/boardroom/src/lib/auth/rbac-service.ts
import { z } from "zod/v4"
import {
  permissionCheckSchema,
  rbacResultSchema,
  circleMembershipSchema,
} from "./rbac-schemas"

export async function checkPermission(
  check: z.infer<typeof permissionCheckSchema>
): Promise<z.infer<typeof rbacResultSchema>> {
  // Validate permission check input
  const validated = permissionCheckSchema.parse(check)

  // Vanguard Security: Enforce permission rules
  // Implementation...

  return rbacResultSchema.parse({
    allowed: true,
    currentRole: "sovereign",
  })
}
```

**Impact:** +3% Zod utilization, prevents unauthorized access, enforces security
boundaries

---

### Phase 20: Frontend Customization Schema Validation (Priority: HIGH)

**Current Issue:** Frontend customization not validated

**Luxury ERP Requirement:** Users must customize layouts, views, filters safely

**Implementation:**

1. Create frontend customization schemas:

```typescript
// apps/boardroom/src/lib/frontend/customization-schemas.ts
import { z } from "zod/v4"

// Frontend Flexibility: Layout customization
export const layoutConfigSchema = z
  .object({
    leftPanelWidth: z.number().int().min(300).max(800).default(600), // 60% of 1000px
    rightPanelWidth: z.number().int().min(200).max(700).default(400), // 40% of 1000px
    showMetrics: z.boolean().default(true),
    metricsPosition: z.enum(["top", "bottom", "sidebar"]).default("top"),
    compactMode: z.boolean().default(false),
  })
  .describe("Layout customization schema")

// Frontend Flexibility: View customization
export const viewConfigSchema = z
  .object({
    viewType: z
      .enum(["pool_table", "kanban", "calendar", "timeline"])
      .default("pool_table"),
    sortBy: z
      .enum(["date_created", "amount", "urgency", "status"])
      .default("date_created"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    groupBy: z.enum(["circle", "status", "stencil", "none"]).default("none"),
    filters: z
      .object({
        status: z
          .array(
            z.enum(["DRAFT", "LISTENING", "APPROVED", "VETOED", "ARCHIVED"])
          )
          .default([]),
        circleIds: z.array(z.string().uuid()).default([]),
        dateRange: z
          .object({
            start: z.date().optional(),
            end: z.date().optional(),
          })
          .optional(),
        amountRange: z
          .object({
            min: z.number().nonnegative().optional(),
            max: z.number().nonnegative().optional(),
          })
          .optional(),
      })
      .default({}),
  })
  .describe("View customization schema")

// Frontend Flexibility: Component customization
export const componentConfigSchema = z
  .object({
    showAvatars: z.boolean().default(true),
    showRiskScores: z.boolean().default(true),
    showFutureVector: z.boolean().default(true),
    showPastVersions: z.boolean().default(true),
    autoCollapseComments: z.boolean().default(false),
    cardsPerPage: z.number().int().min(5).max(100).default(20),
  })
  .describe("Component customization schema")

// Combined frontend customization
export const frontendCustomizationSchema = z
  .object({
    layout: layoutConfigSchema,
    view: viewConfigSchema,
    components: componentConfigSchema,
    theme: z.enum(["light", "dark", "system"]).default("system"),
  })
  .describe("Complete frontend customization schema")
```

2. Create customization service:

```typescript
// apps/boardroom/src/lib/frontend/customization-service.ts
import { z } from "zod/v4"
import { frontendCustomizationSchema } from "./customization-schemas"

export function validateCustomization(
  customization: unknown
): z.infer<typeof frontendCustomizationSchema> {
  return frontendCustomizationSchema.parse(customization)
}

export function mergeCustomization(
  userCustomization: Partial<z.infer<typeof frontendCustomizationSchema>>,
  globalDefaults: z.infer<typeof frontendCustomizationSchema>
): z.infer<typeof frontendCustomizationSchema> {
  // Validate both inputs
  const validatedUser = frontendCustomizationSchema
    .partial()
    .parse(userCustomization)
  const validatedGlobal = frontendCustomizationSchema.parse(globalDefaults)

  // Merge with user preferences taking precedence
  return frontendCustomizationSchema.parse({
    ...validatedGlobal,
    ...validatedUser,
    layout: { ...validatedGlobal.layout, ...validatedUser.layout },
    view: { ...validatedGlobal.view, ...validatedUser.view },
    components: { ...validatedGlobal.components, ...validatedUser.components },
  })
}
```

**Impact:** +4% Zod utilization, enables safe frontend customization, prevents
invalid layouts

---

### Phase 21: WebSocket Message Validation (Priority: HIGH)

**Current Issue:** Real-time messages not validated

**Luxury ERP Requirement:** WebSocket messages must be validated for security

**Implementation:**

1. Create WebSocket message schemas:

```typescript
// apps/boardroom/src/lib/realtime/websocket-schemas.ts
import { z } from "zod/v4"

export const websocketMessageSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal("proposal_updated"),
      proposalId: z.string().uuid(),
      changes: z.record(z.string(), z.unknown()),
      timestamp: z.date(),
    }),
    z.object({
      type: z.literal("comment_added"),
      proposalId: z.string().uuid(),
      commentId: z.string().uuid(),
      authorId: z.string().uuid(),
      content: z.string().min(1).max(5000),
      mentions: z.array(z.string().uuid()).default([]),
      timestamp: z.date(),
    }),
    z.object({
      type: z.literal("presence_update"),
      userId: z.string().uuid(),
      proposalId: z.string().uuid().optional(),
      status: z.enum(["viewing", "editing", "idle"]),
      timestamp: z.date(),
    }),
    z.object({
      type: z.literal("approval_status_changed"),
      proposalId: z.string().uuid(),
      status: z.enum(["DRAFT", "LISTENING", "APPROVED", "VETOED", "ARCHIVED"]),
      approvedBy: z.string().uuid().optional(),
      timestamp: z.date(),
    }),
  ])
  .describe("WebSocket message validation schema")
```

2. Create WebSocket handler with validation:

```typescript
// apps/boardroom/src/lib/realtime/websocket-handler.ts
import { z } from "zod/v4"
import { websocketMessageSchema } from "./websocket-schemas"

export function validateWebSocketMessage(message: unknown) {
  return websocketMessageSchema.safeParse(message)
}

export function handleWebSocketMessage(message: unknown, userId: string) {
  const result = validateWebSocketMessage(message)
  if (!result.success) {
    // Vanguard Security: Reject invalid messages
    throw new Error(
      `Invalid WebSocket message: ${result.error.issues[0].message}`
    )
  }

  // Process validated message
  // ...
}
```

**Impact:** +3% Zod utilization, prevents WebSocket attacks, ensures message
integrity

---

### Phase 22: Audit Trail Validation (Priority: CRITICAL)

**Current Issue:** Audit trail entries not validated

**Luxury ERP Requirement:** Immutable 6W1H audit trail must be validated

**Implementation:**

1. Create audit trail schemas:

```typescript
// apps/boardroom/src/lib/audit/audit-schemas.ts
import { z } from "zod/v4"

// Vanguard Security: 6W1H audit trail validation
export const thanosEventSchema = z
  .object({
    id: z.string().uuid(),
    proposalId: z.string().uuid(),
    who: z.string().uuid(), // Actor ID
    what: z.string().min(1).max(50), // Action type
    when: z.date(), // Timestamp
    where: z.enum(["web", "api", "webhook", "batch"]), // Source
    why: z.string().min(1).max(1000).optional(), // Reason
    which: z.string().max(500).optional(), // Alternatives considered
    how: z.enum(["UI", "API", "batch", "automated"]), // Method
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .describe("6W1H audit trail event validation")

// Vanguard Security: Immutable audit trail
export const immutableAuditTrailSchema = z
  .object({
    events: z.array(thanosEventSchema).min(1),
    proposalId: z.string().uuid(),
    createdAt: z.date(),
    lastUpdated: z.date(),
    // Vanguard Security: Immutability flag
    immutable: z.literal(true).default(true),
  })
  .readonly()
  .describe("Immutable audit trail validation")
```

2. Create audit service:

```typescript
// apps/boardroom/src/lib/audit/audit-service.ts
import { z } from "zod/v4"
import { thanosEventSchema, immutableAuditTrailSchema } from "./audit-schemas"

export async function createAuditEvent(
  event: z.infer<typeof thanosEventSchema>
): Promise<z.infer<typeof thanosEventSchema>> {
  // Validate event
  const validated = thanosEventSchema.parse({
    ...event,
    when: new Date(), // Always use current timestamp
  })

  // Vanguard Security: Ensure immutability
  // Store in database with immutable flag
  // ...

  return validated
}
```

**Impact:** +3% Zod utilization, ensures audit trail integrity, prevents
tampering

---

### Phase 23: Dynamic Form Generation from Stencils (Priority: HIGH)

**Current Issue:** Manual validation in codex/index.ts

**Luxury ERP Requirement:** Dynamic forms must be generated from stencils with
Zod validation

**Implementation:**

1. Create dynamic form schema generator:

```typescript
// apps/boardroom/src/lib/forms/dynamic-stencil-form.ts
import { z } from "zod/v4"
import type { StencilDefinition } from "@/src/codex"

export function generateStencilFormSchema(stencil: StencilDefinition) {
  const shape: z.ZodRawShape = {}

  for (const field of stencil.fields) {
    let fieldSchema: z.ZodTypeAny

    switch (field.type) {
      case "string":
        fieldSchema = z.string().trim()
        break
      case "number":
        fieldSchema = z.coerce.number()
        break
      case "date":
        fieldSchema = z.coerce.date()
        break
      case "enum":
        fieldSchema = z.enum(field.options as [string, ...string[]])
        break
      case "jsonb":
        fieldSchema = z.record(z.string(), z.unknown())
        break
    }

    // Apply validation rules from stencil
    if (field.validationRule) {
      const rules = parseValidationRule(field.validationRule)
      if (rules.min !== undefined) {
        if (field.type === "string") {
          fieldSchema = (fieldSchema as z.ZodString).min(rules.min)
        } else if (field.type === "number") {
          fieldSchema = (fieldSchema as z.ZodNumber).min(rules.min)
        }
      }
      if (rules.max !== undefined) {
        if (field.type === "string") {
          fieldSchema = (fieldSchema as z.ZodString).max(rules.max)
        } else if (field.type === "number") {
          fieldSchema = (fieldSchema as z.ZodNumber).max(rules.max)
        }
      }
    }

    // Apply required/optional
    shape[field.id] = field.required ? fieldSchema : fieldSchema.optional()
  }

  return z
    .object(shape)
    .describe(`Dynamic form schema for stencil: ${stencil.name}`)
}
```

2. Create React component for dynamic forms:

```typescript
// apps/boardroom/components/forms/DynamicStencilForm.tsx
'use client'

import { useZodForm } from '@/src/lib/react/use-zod-form'
import { generateStencilFormSchema } from '@/src/lib/forms/dynamic-stencil-form'
import { ZodFormField } from '@/src/components/forms/ZodFormField'
import type { StencilDefinition } from '@/src/codex'

export function DynamicStencilForm({
  stencil,
  onSubmit,
}: {
  stencil: StencilDefinition
  onSubmit: (data: unknown) => Promise<void>
}) {
  const schema = generateStencilFormSchema(stencil)
  const form = useZodForm(schema)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {stencil.fields.map((field) => (
        <ZodFormField
          key={field.id}
          name={field.id}
          schema={schema}
          label={field.label}
        >
          {({ error, errorStyles, className }) => (
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              className={className}
              {...form.register(field.id)}
            />
          )}
        </ZodFormField>
      ))}
    </form>
  )
}
```

**Impact:** +5% Zod utilization, enables dynamic forms, replaces manual
validation

---

## Luxury ERP Critical Gap Summary

**Missing Validations (CRITICAL):**

1. ❌ User/Global Config - Schemas exist but not enforced
2. ❌ Encryption Operations - No validation for keys/data
3. ❌ RBAC Permissions - No validation for access checks
4. ❌ WebSocket Messages - No validation for real-time data
5. ❌ Audit Trail - No validation for 6W1H events
6. ❌ Frontend Customization - No schemas for layouts/views
7. ❌ Dynamic Forms - Manual validation instead of Zod

**Security Risks:**

- Invalid config could disable security features
- Unvalidated encryption could expose data
- Unvalidated permissions could allow unauthorized access
- Unvalidated WebSocket messages could be attack vectors
- Unvalidated audit trails could be tampered with

**Frontend Flexibility Gaps:**

- No schema for layout customization
- No schema for view customization
- No schema for component customization
- No validation for user preferences
- No dynamic form generation from stencils

---

## Updated Implementation Priority (Luxury ERP Focus)

**Week 1 (CRITICAL - Security):**

- Phase 17: User/Global Config validation
- Phase 18: Encryption operations validation
- Phase 19: RBAC permission validation
- Phase 22: Audit trail validation

**Week 2 (HIGH - Frontend Flexibility):**

- Phase 20: Frontend customization schemas
- Phase 23: Dynamic form generation
- Phase 12: React hooks with Zod

**Week 3 (MEDIUM - Integration):**

- Phase 21: WebSocket message validation
- Phase 13: PrimeReact + Zod forms
- Phase 14: Tailwind error styling

---

## Final Luxury ERP Metrics

**Zod Utilization:** 28% → 98%+ (70 feature additions)

**Security Coverage:**

- ✅ Config validation: 0% → 100%
- ✅ Encryption validation: 0% → 100%
- ✅ RBAC validation: 0% → 100%
- ✅ Audit trail validation: 0% → 100%
- ✅ WebSocket validation: 0% → 100%

**Frontend Flexibility Coverage:**

- ✅ Layout customization: 0% → 100%
- ✅ View customization: 0% → 100%
- ✅ Component customization: 0% → 100%
- ✅ Dynamic forms: 0% → 100%
- ✅ User preferences: 0% → 100%

**Success Criteria:**

- ✅ All security operations validated with Zod
- ✅ All frontend customizations validated with Zod
- ✅ Zero manual validation in codebase
- ✅ 100% type safety from schema to UI to security
- ✅ Immutable audit trails enforced
- ✅ Encryption operations validated
- ✅ RBAC permissions validated

---

## Cursor Capabilities: Maximizing Dev Experience & Maintaining Consistency

### Overview

This section documents Cursor's capabilities and features that maximize
developer experience, improve accuracy, avoid drift, and maintain consistency in
the Luxury ERP codebase.

**Current Setup Analysis:**

- ✅ 39 rule files configured (`.cursor/rules/*.mdc`)
- ✅ Rule governance system in place (priority hierarchy)
- ✅ Documentation indexing strategy implemented
- ✅ Planning mode templates available
- ✅ Custom hooks for automation (`.cursor/hooks/`)
- ✅ Reference system configured

---

### Category 1: Rules System (Prevents Drift, Maintains Consistency)

**Capability:** Rule-based code generation and enforcement

**Features:**

1. **Rule Priority Hierarchy**
   - Priority 0-2: Always applied (governance, master defaults, safety)
   - Priority 3-9: Framework rules (conditional)
   - Priority 10+: Feature-specific rules (conditional)
   - **Benefit:** Prevents rule conflicts, ensures consistent application

2. **Glob Pattern Matching**
   - Scoped rules: `globs: "*.ts,*.tsx"` for TypeScript files
   - Path-specific: `globs: "app/api/**/*.ts"` for API routes
   - **Benefit:** Rules apply only where needed, reducing overhead

3. **Rule Validation Script**
   - Auto-fixes `alwaysApply: true` violations
   - Validates naming conventions (`[NNN]_name.mdc`)
   - Checks for missing glob patterns
   - **Benefit:** Prevents configuration drift

4. **Rule References**
   - Cross-reference: `@rules/010_planning.mdc`
   - Documentation links: `@docs/architecture/system-overview.md`
   - **Benefit:** Maintains consistency across rules

**Current Implementation:**

- ✅ 39 rules organized by priority
- ✅ Rule governance enforced
- ✅ Validation script in place
- ✅ Reference system active

**Optimization Opportunities:**

- Add Zod-specific rules for validation patterns
- Create Luxury ERP-specific rules (encryption, RBAC)
- Add frontend flexibility rules (customization schemas)

---

### Category 2: Documentation Indexing (Improves Accuracy)

**Capability:** External and internal documentation integration

**Features:**

1. **External Documentation Indexing**
   - Index framework docs (Next.js, React, TypeScript)
   - Version-specific URLs
   - Auto-updates when frameworks change
   - **Benefit:** AI uses latest framework knowledge

2. **Local Documentation System**
   - Store in `.cursor/docs/`
   - Reference in rules: `@docs/architecture/system-overview.md`
   - Not indexed separately (referenced via rules)
   - **Benefit:** Project-specific patterns always available

3. **Three-Layer Documentation Model**
   - Layer 1: External framework docs (always available)
   - Layer 2: Project-specific external docs (selective)
   - Layer 3: Internal project docs (referenced in rules)
   - **Benefit:** Optimal context management

4. **@ Mention System**
   - `@Docs` - External documentation
   - `@Codebase` - Codebase search
   - `@Rules` - Cursor rules
   - `@Files` - Specific files
   - `@Memories` - Saved memories
   - **Benefit:** Precise context targeting

**Current Implementation:**

- ✅ Documentation indexing guide in place
- ✅ Quick start guide available
- ✅ Best practices documented
- ⚠️ Need to verify external docs are indexed

**Optimization Opportunities:**

- Index Zod documentation (for validation patterns)
- Index PrimeReact documentation (for form components)
- Index Tailwind CSS documentation (for styling)
- Create Luxury ERP architecture docs

---

### Category 3: Codebase Indexing (Improves Accuracy)

**Capability:** Intelligent codebase search and context

**Features:**

1. **Incremental Indexing**
   - Updates on file changes
   - Focuses on frequently accessed files
   - Optimizes index size
   - **Benefit:** Fast, accurate codebase searches

2. **Targeted Searches**
   - Use `@Codebase` for pattern discovery
   - Semantic search across codebase
   - File-type filtering
   - **Benefit:** Finds relevant code quickly

3. **Index Configuration**
   - Include patterns: `app/**`, `components/**`, `lib/**`
   - Exclude patterns: `node_modules/**`, `.next/**`, `build/**`
   - **Benefit:** Focuses on source code, not artifacts

4. **Large Codebase Optimization**
   - Module-based development
   - Lazy loading patterns
   - Code splitting strategies
   - **Benefit:** Handles large monorepos efficiently

**Current Implementation:**

- ✅ Indexing strategy documented
- ✅ Include/exclude patterns configured
- ✅ Large repo performance rules in place

**Optimization Opportunities:**

- Optimize for monorepo structure (apps/, packages/)
- Add workspace package indexing
- Configure Turborepo-aware indexing

---

### Category 4: Agent Modes (Maximizes Dev Experience)

**Capability:** Different interaction modes for different tasks

**Features:**

1. **Ask Mode**
   - Quick questions, code explanations
   - Simple queries
   - Information requests
   - **Benefit:** Fast answers without tool overhead

2. **Manual Mode**
   - Precise control over tool usage
   - For risky operations (database, deletions)
   - Step-by-step execution
   - **Benefit:** Safety for critical operations

3. **Custom Mode**
   - Project-specific workflows
   - Repeated task patterns
   - Automated sequences
   - **Benefit:** Efficiency for common tasks

4. **Planning Mode** (Current Focus)
   - Complex features (3+ steps)
   - Multi-file changes
   - Integration work
   - **Benefit:** Structured approach, prevents mistakes

**Current Implementation:**

- ✅ Planning mode guidelines in place
- ✅ Planning templates available
  - API endpoint plan
  - Component plan
  - Migration plan
- ✅ Mode selection criteria documented

**Optimization Opportunities:**

- Create Luxury ERP-specific custom modes
  - Encryption workflow mode
  - RBAC validation mode
  - Frontend customization mode
- Add planning templates for:
  - Security feature implementation
  - Frontend flexibility features

---

### Category 5: Tools & Context (Improves Accuracy)

**Capability:** Intelligent tool selection and context management

**Features:**

1. **File Operations (Preferred)**
   - Read, write, search files
   - Surgical edits over rewrites
   - Batch operations
   - **Benefit:** Precise code changes

2. **Terminal Operations (Selective)**
   - Package management
   - Builds, tests, migrations
   - Not for code changes
   - **Benefit:** Appropriate tool usage

3. **Browser Automation**
   - Web testing
   - E2E validation
   - **Benefit:** Real-world testing

4. **MCP Tools**
   - Next.js MCP (error detection, routes)
   - GitHub integration
   - Vercel deployment
   - **Benefit:** Framework-specific capabilities

5. **Context Management**
   - Read relevant files first
   - Point to exact file(s) and lines
   - Prefer surgical edits
   - **Benefit:** Accurate, targeted changes

**Current Implementation:**

- ✅ Tool usage rules documented
  - File operations for code
  - Terminal for builds/tests
  - Browser for testing
- ✅ Context use guidelines in place

**Optimization Opportunities:**

- Leverage Next.js MCP for:
  - Real-time error detection
  - Route validation
  - Build optimization
- Use GitHub MCP for:
  - Code review automation
  - Issue tracking
  - PR management

---

### Category 6: Planning & Templates (Prevents Drift)

**Capability:** Structured planning and reusable templates

**Features:**

1. **Planning Discipline**
   - State goal in 1-2 lines
   - List smallest steps
   - Define verification method
   - **Benefit:** Clear execution path

2. **Planning Templates**
   - API endpoint plan
   - Component plan
   - Migration plan
   - **Benefit:** Consistent planning structure

3. **Plan Validation**
   - Reference architecture docs
   - Validate against existing patterns
   - Break down into actionable todos
   - **Benefit:** Prevents architectural drift

4. **Plan Execution**
   - Small commits/patches
   - Verify each step
   - Maintain consistency
   - **Benefit:** Incremental, safe changes

**Current Implementation:**

- ✅ Planning mode guidelines
- ✅ Planning templates in `.cursor/templates/plans/`
- ✅ Planning discipline rules
- ✅ Current plan: Zod optimization (this document)

**Optimization Opportunities:**

- Create Luxury ERP planning templates:
  - Security feature plan
  - Encryption implementation plan
  - Frontend customization plan
- Add plan validation checks:
  - Security compliance
  - Performance requirements
  - Governance adherence

---

### Category 7: Reference System (Maintains Consistency)

**Capability:** Cross-referencing documentation, rules, and code

**Features:**

1. **@ Mention Types**
   - `@Docs` - External documentation
   - `@Codebase` - Codebase search
   - `@Rules` - Cursor rules
   - `@Files` - Specific files
   - `@Memories` - Saved memories
   - **Benefit:** Precise context targeting

2. **Reference Format**
   - Include file paths: `app/api/users/route.ts`
   - Include line numbers: `app/components/UserCard.tsx:15-20`
   - Reference config blocks: `tsconfig.json` → `compilerOptions`
   - **Benefit:** Exact location targeting

3. **Reference Best Practices**
   - Use @Docs for framework questions
   - Use @Codebase for pattern discovery
   - Use @Rules for project standards
   - Use @Files for specific implementations
   - **Benefit:** Appropriate context selection

**Current Implementation:**

- ✅ Reference system rules in place
- ✅ Reference style guidelines
- ✅ @ mention patterns documented

**Optimization Opportunities:**

- Create Luxury ERP reference patterns:
  - `@docs/security/encryption-patterns.md`
  - `@docs/frontend/customization-guide.md`
  - `@rules/security/encryption-validation.mdc`

---

### Category 8: Custom Hooks (Automation, Consistency)

**Capability:** Pre/post-command hooks for automation

**Features:**

1. **Available Hooks** (`.cursor/hooks/`)
   - `audit-command.sh` - Command auditing
   - `format-code.sh` - Code formatting
   - `log-activity.sh` - Activity logging
   - `update-docs.sh` - Documentation updates
   - `validate-prompt.sh` - Prompt validation
   - **Benefit:** Automated consistency checks

2. **Hook Integration**
   - Pre-commit validation
   - Code formatting enforcement
   - Documentation updates
   - **Benefit:** Prevents manual errors

**Current Implementation:**

- ✅ 5 custom hooks available
- ✅ Hook scripts in place

**Optimization Opportunities:**

- Add Zod validation hook:
  - `validate-zod-schemas.sh` - Check Zod schema compliance
- Add security validation hook:
  - `validate-security-patterns.sh` - Check encryption/RBAC patterns
- Add frontend validation hook:
  - `validate-customization-schemas.sh` - Check customization schemas

---

### Category 9: Memories System (Persistent Context)

**Capability:** Save important context for future sessions

**Features:**

1. **Memory Types**
   - Project decisions
   - Architecture choices
   - Pattern preferences
   - **Benefit:** Context persists across sessions

2. **Memory Usage**
   - Reference with `@Memories`
   - Auto-included in relevant contexts
   - **Benefit:** Consistent decision application

**Current Implementation:**

- ⚠️ Memory system available but not extensively used

**Optimization Opportunities:**

- Create Luxury ERP memories:
  - "Zod is contract-first validation layer"
  - "Drizzle preferred over Prisma for Zod integration"
  - "Frontend flexibility via User Config schemas"
  - "Vanguard security via encryption validation"

---

### Category 10: Codebase Indexing Strategy (Large Repo Performance)

**Capability:** Optimized indexing for large monorepos

**Features:**

1. **Incremental Indexing**
   - Updates on file changes
   - Focuses on frequently accessed files
   - **Benefit:** Fast, efficient indexing

2. **Targeted Indexing**
   - Include: `app/**`, `components/**`, `lib/**`, `docs/**`
   - Exclude: `node_modules/**`, `.next/**`, `build/**`, `dist/**`
   - **Benefit:** Indexes only relevant code

3. **Performance Optimization**
   - Module-based development
   - Lazy loading patterns
   - Code splitting
   - **Benefit:** Handles large codebases efficiently

**Current Implementation:**

- ✅ Indexing strategy documented
- ✅ Include/exclude patterns configured
- ✅ Large repo performance rules

**Optimization Opportunities:**

- Optimize for Turborepo structure:
  - Index `apps/**` separately
  - Index `packages/**` separately
  - Shared code indexing strategy
- Add workspace-aware indexing

---

### Category 11: Rule Governance (Prevents Drift)

**Capability:** Automated rule validation and enforcement

**Features:**

1. **Rule Validation Script**
   - Auto-fixes `alwaysApply: true` violations
   - Validates naming conventions
   - Checks glob patterns
   - **Benefit:** Prevents configuration drift

2. **Priority Hierarchy**
   - Priority 0: Rule governance (configuration control)
   - Priority 1: Master defaults (core behavior)
   - Priority 2: Core safety (safety guardrails)
   - **Benefit:** Clear rule precedence

3. **Pre-commit Integration**
   - Validates rules before commit
   - Blocks invalid configurations
   - **Benefit:** Prevents rule drift

**Current Implementation:**

- ✅ Rule governance system in place
- ✅ Validation script configured
- ✅ Pre-commit hooks active

**Optimization Opportunities:**

- Add Zod rule validation:
  - Check for Zod import paths (`zod/v4`)
  - Validate schema patterns
  - Check for missing validations

---

### Category 12: Documentation Strategy (Improves Accuracy)

**Capability:** Three-layer documentation model

**Features:**

1. **External Docs (Indexed)**
   - Framework knowledge (Next.js, React)
   - API references
   - **Benefit:** Latest framework knowledge

2. **Local Docs (Referenced)**
   - Architecture decisions
   - Project patterns
   - Custom conventions
   - **Benefit:** Project-specific context

3. **Rules (Applied)**
   - Project standards
   - Conventions
   - Patterns
   - **Benefit:** Enforced consistency

**Current Implementation:**

- ✅ Documentation indexing guide
- ✅ Local docs in `.cursor/docs/`
- ✅ Rules reference local docs

**Optimization Opportunities:**

- Add Luxury ERP documentation:
  - Security patterns (encryption, RBAC)
  - Frontend customization guide
  - Zod validation patterns
- Index additional docs:
  - Zod documentation
  - PrimeReact documentation
  - Tailwind CSS documentation

---

## Cursor Optimization Checklist for Luxury ERP

### Immediate Actions (Week 1)

**Documentation:**

- [ ] Index Zod documentation (`https://zod.dev`)
- [ ] Index PrimeReact documentation (`https://primereact.org`)
- [ ] Index Tailwind CSS documentation (`https://tailwindcss.com/docs`)
- [ ] Create `.cursor/docs/security/encryption-patterns.md`
- [ ] Create `.cursor/docs/frontend/customization-guide.md`

**Rules:**

- [ ] Create `027_zod-validation-patterns.mdc` (Zod-specific rules)
- [ ] Create `028_security-validation.mdc` (Encryption, RBAC rules)
- [ ] Create `029_frontend-customization.mdc` (Layout, view rules)
- [ ] Update existing rules to reference new docs

**Memories:**

- [ ] Create memory: "Zod is contract-first validation layer"
- [ ] Create memory: "Drizzle preferred for Zod integration"
- [ ] Create memory: "Frontend flexibility via User Config"
- [ ] Create memory: "Vanguard security via encryption validation"

**Hooks:**

- [ ] Create `validate-zod-schemas.sh` hook
- [ ] Create `validate-security-patterns.sh` hook
- [ ] Integrate hooks into pre-commit

### Ongoing Optimization (Monthly)

**Review:**

- [ ] Review indexed docs relevance
- [ ] Update local documentation
- [ ] Test rule effectiveness
- [ ] Refine based on AI behavior

**Maintenance:**

- [ ] Remove outdated documentation
- [ ] Update rule globs if needed
- [ ] Add new rules for emerging patterns
- [ ] Validate rule compliance

---

## Cursor Capabilities Summary

**Maximize Dev Experience:**

- ✅ Agent modes (Ask, Manual, Custom, Planning)
- ✅ Intelligent tool selection
- ✅ Codebase indexing
- ✅ Documentation integration
- ✅ Custom hooks for automation

**Improve Accuracy:**

- ✅ Rule-based code generation
- ✅ Documentation indexing
- ✅ Codebase semantic search
- ✅ Context-aware suggestions
- ✅ Reference system (@ mentions)

**Avoid Drift:**

- ✅ Rule governance system
- ✅ Validation scripts
- ✅ Pre-commit hooks
- ✅ Planning templates
- ✅ Reference patterns

**Maintain Consistency:**

- ✅ Rule priority hierarchy
- ✅ Glob pattern matching
- ✅ Cross-referencing system
- ✅ Documentation strategy
- ✅ Memory system

---

## Integration with Zod Optimization Plan

**Synergistic Effects:**

1. **Zod Rules + Cursor Rules:**
   - Cursor rules enforce Zod patterns
   - Zod schemas validated via Cursor rules
   - **Result:** Double-layer consistency

2. **Documentation + Zod:**
   - Index Zod docs for validation patterns
   - Create local Zod pattern docs
   - **Result:** Accurate Zod implementation

3. **Planning + Zod:**
   - Use planning mode for Zod phases
   - Create Zod-specific planning templates
   - **Result:** Structured Zod implementation

4. **Memories + Zod:**
   - Save Zod decisions as memories
   - Reference Zod patterns consistently
   - **Result:** Persistent Zod knowledge

**Total Impact:**

- **Zod Utilization:** 28% → 98%+ (with Cursor optimization)
- **Accuracy:** Improved via documentation + rules
- **Consistency:** Maintained via governance + validation
- **Drift Prevention:** Automated via hooks + validation
