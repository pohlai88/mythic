---
doc_type: STANDARD
status: active
owner: architecture
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [architecture, nextjs, monorepo, audit, rfl, turborepo]
related_docs:
  - DOC-0100_system-architecture.md
  - DOC-0123_turborepo-optimization-complete.md
  - TURBOREPO_OPTIMIZATION.md
---

# Next.js Monorepo Architecture Audit & Optimization

**Audit Date**: 2026-01-10 **Plan Reviewed**:
`next.js_architecture_review_e5fb76a8.plan.md` **Next.js Version**: 16+ (App
Router) **Monorepo Tool**: Turborepo 2.3.3 **Status**: ✅ **APPROVED WITH
RECOMMENDATIONS**

---

## Executive Summary

This audit reviews the proposed Next.js architecture plan against Next.js 16
best practices and monorepo optimization standards. The plan demonstrates
**strong alignment** with modern Next.js patterns, with specific recommendations
for scalability, consistency, and production readiness.

### Key Findings

✅ **STRONG ALIGNMENT**:

- Server Components as RFL boundary (matches Next.js read-only pattern)
- Route Handlers for sync operations (Next.js-native API pattern)
- Monorepo structure aligns with Turborepo best practices
- Type safety enforcement (TypeScript + Zod)

⚠️ **RECOMMENDATIONS**:

- Clarify client-side RFL implementation details
- Optimize monorepo structure for scalability
- Enhance caching strategy alignment
- Add production-ready patterns

---

## 1. Next.js 16 Best Practices Alignment

### 1.1 Server Components Pattern ✅ APPROVED

**Plan Proposal**:

```typescript
// Server Component reading RFL
import { getInvoice } from '@mythic/domain-finance/rfl/server'

export default async function InvoicePage({ params }) {
  const snapshot = await getInvoice(params.id)
  return <InvoiceDisplay snapshot={snapshot} />
}
```

**Next.js 16 Best Practice**: ✅ **ALIGNED**

**Validation**:

- ✅ Server Components are default (no `'use client'` needed)
- ✅ Async/await for data fetching (replaces `getServerSideProps`)
- ✅ Zero client JavaScript for read-only views
- ✅ Automatic streaming with Suspense

**Recommendation**: **APPROVE** - This pattern is optimal for Next.js 16.

---

### 1.2 Route Handlers Pattern ✅ APPROVED WITH ENHANCEMENT

**Plan Proposal**:

```typescript
// app/api/invoices/[id]/sync/route.ts
export async function POST(request: Request, { params }) {
  const { id } = await params
  const snapshot = await invoiceRFL.sync(id)
  return NextResponse.json(snapshot)
}
```

**Next.js 16 Best Practice**: ✅ **ALIGNED** with enhancement needed

**Validation**:

- ✅ Route Handlers are the modern API pattern (replaces Pages Router API
  routes)
- ✅ Async params handling (`await params`) is Next.js 16 requirement
- ✅ Proper HTTP method usage (POST for mutations)

**Enhancement Required**:

```typescript
// ✅ ENHANCED: Add proper error handling and caching
import { NextResponse } from "next/server"
import { invoiceRFL } from "@mythic/domain-finance/rfl"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate input
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 })
    }

    const snapshot = await invoiceRFL.sync(id)

    // Configure caching for sync operations
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "no-store, must-revalidate", // Sync is always fresh
      },
    })
  } catch (error) {
    console.error("RFL sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
```

**Recommendation**: **APPROVE** with error handling and caching headers.

---

### 1.3 Server Actions Pattern ✅ APPROVED

**Plan Proposal**:

```typescript
// app/invoices/[id]/actions.ts
"use server"
export async function approveInvoice(id: string) {
  await invoiceLoom.approve(id)
  revalidateTag("invoices")
}
```

**Next.js 16 Best Practice**: ✅ **ALIGNED**

**Validation**:

- ✅ Server Actions are the write boundary (replaces API routes for mutations)
- ✅ `revalidateTag` for cache invalidation (Next.js 16 feature)
- ✅ Clear separation: RFL (read) vs Loom (write)

**Enhancement Recommended**:

```typescript
// ✅ ENHANCED: Add input validation and error handling
"use server"
import { z } from "zod"
import { invoiceLoom } from "@mythic/domain-finance/loom"
import { revalidateTag } from "next/cache"

const approveInvoiceSchema = z.object({
  id: z.string().min(1),
})

export async function approveInvoice(input: unknown) {
  try {
    const { id } = approveInvoiceSchema.parse(input)

    await invoiceLoom.approve(id)
    revalidateTag("invoices")

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input" }
    }
    throw error // Re-throw for error boundary
  }
}
```

**Recommendation**: **APPROVE** with Zod validation.

---

### 1.4 Client-Side RFL Pattern ⚠️ NEEDS CLARIFICATION

**Plan Proposal**:

```typescript
"use client"
import { useInvoiceRFL } from "@mythic/domain-finance/rfl/client"

export default function InvoiceClientPage({ id }) {
  const { snapshot, sync, isLoading } = useInvoiceRFL(id)
  // ...
}
```

**Next.js 16 Best Practice**: ⚠️ **NEEDS SPECIFICATION**

**Gap Identified**:

- Storage technology not specified (IndexedDB vs localStorage)
- Hook implementation details missing
- Error handling pattern unclear
- Loading state management undefined

**Recommendation**: **SPECIFY** implementation details:

```typescript
// ✅ RECOMMENDED: Complete client-side RFL pattern

// packages/domain-finance/src/rfl/client/store.ts
export class ClientRFLStore {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    // Initialize IndexedDB for production
    // Fallback to localStorage for development
  }

  async get<T>(key: string): Promise<Snapshot<T> | null> {
    // Read from IndexedDB/localStorage
  }

  async set<T>(key: string, snapshot: Snapshot<T>): Promise<void> {
    // Write to IndexedDB/localStorage
  }
}

// packages/domain-finance/src/rfl/client/hooks.ts
;("use client")
import { useQuery } from "@tanstack/react-query"
import { clientRFLStore } from "./store"

export function useInvoiceRFL(id: string) {
  const query = useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      // Check local cache first
      const cached = await clientRFLStore.get(id)
      if (cached && !isExpired(cached)) {
        return cached
      }

      // Fetch from server
      const response = await fetch(`/api/invoices/${id}/sync`, {
        method: "POST",
      })
      const snapshot = await response.json()

      // Update local cache
      await clientRFLStore.set(id, snapshot)

      return snapshot
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    snapshot: query.data,
    isLoading: query.isLoading,
    sync: () => query.refetch(),
  }
}
```

**Recommendation**: **SPECIFY** complete client-side implementation.

---

## 2. Monorepo Structure Optimization

### 2.1 Current Structure Analysis

**Current State**:

```
mythic/
├── app/                    # Next.js app (root level)
├── components/             # Shared components
├── packages/               # ❌ Not created yet
└── apps/                   # ❌ Not created yet
```

**Proposed Structure**:

```
mythic/
├── apps/
│   └── web/               # Next.js app
├── packages/
│   ├── domain-*/          # Domain packages with RFL
│   └── shared-*/          # Shared primitives
```

**Turborepo Best Practice**: ✅ **ALIGNED**

---

### 2.2 Recommended Monorepo Structure

**Optimized Structure** (Scalable, Consistent):

```
mythic/
├── apps/
│   └── web/                           # [THE COBALT] Next.js App Router
│       ├── app/                      # Routes & Pages Only
│       │   ├── (routes)/             # Route groups
│       │   │   ├── invoices/         # Feature routes
│       │   │   │   ├── [id]/
│       │   │   │   │   ├── page.tsx        # Server Component (reads RFL)
│       │   │   │   │   ├── actions.ts      # Server Actions (writes to Loom)
│       │   │   │   │   └── loading.tsx     # Loading UI
│       │   │   │   └── page.tsx
│       │   │   └── layout.tsx
│       │   └── api/                  # Route Handlers
│       │       └── invoices/
│       │           └── [id]/
│       │               └── sync/
│       │                   └── route.ts     # RFL sync endpoint
│       │
│       ├── components/               # [THE COBALT] UI Library
│       │   ├── ui/                  # Atomic components (shadcn/ui)
│       │   └── features/            # Composite UI (Forms, Tables)
│       │
│       ├── server/                  # [THE PRIME MONAD] Server-Only
│       │   ├── actions/             # [THE LOOM] Write/Mutations (if needed)
│       │   ├── data/                # [THE PRISM] Read/Queries (if needed)
│       │   └── db/                  # [THE ATLAS] Persistence Config
│       │
│       ├── lib/                     # [THE ARGUS & CHRONOS]
│       │   ├── audit/              # [CHRONOS] Logging
│       │   ├── infra/              # [THE ATLAS] Adapters
│       │   └── utils.ts             # Generic Helpers
│       │
│       ├── public/                  # Static assets
│       ├── styles/                  # Global styles
│       ├── next.config.mjs          # Next.js config
│       ├── package.json
│       └── tsconfig.json
│
├── packages/                        # [THE IMMUTABLE CORE]
│   ├── domain-finance/             # Domain package example
│   │   ├── src/
│   │   │   ├── rfl/                # Read Fallback Layer
│   │   │   │   ├── server/         # Server-side RFL
│   │   │   │   │   ├── store.ts    # Server cache (memory/Redis)
│   │   │   │   │   └── sync.ts     # Server sync logic
│   │   │   │   └── client/         # Client-side RFL
│   │   │   │       ├── store.ts    # IndexedDB/localStorage
│   │   │   │       ├── sync.ts     # Client sync
│   │   │   │       └── hooks.ts    # React hooks
│   │   │   ├── loom/               # [THE LOOM] Write Operations
│   │   │   │   ├── schema.ts       # Drizzle schema
│   │   │   │   ├── mutations.ts    # Write operations
│   │   │   │   └── mod.ts
│   │   │   └── types.ts            # Domain types
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-types/               # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── rfl.ts              # RFL types
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── shared-ui/                  # Shared UI components (optional)
│   │   └── ...
│   │
│   └── eslint-config/              # Shared ESLint config
│       └── ...
│
├── turbo.json                      # Turborepo configuration
├── pnpm-workspace.yaml            # pnpm workspace config
├── package.json                   # Root package
└── tsconfig.json                  # Root TypeScript config
```

**Key Principles**:

1. ✅ **Apps consume packages** (Prime Monad Law)
2. ✅ **Packages never import apps** (Dependency direction)
3. ✅ **Domain packages are self-contained** (RFL + Loom + Types)
4. ✅ **Shared packages are minimal** (Types, configs only)

---

### 2.3 Turborepo Configuration Enhancement

**Current `turbo.json`**: ✅ **GOOD** - Already optimized

**Recommended Enhancement** for monorepo:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "package.json",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    "tsconfig.json",
    "turbo.json"
  ],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"], // ✅ Wait for dependencies
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "env": ["NODE_ENV", "NEXT_PUBLIC_*", "VERCEL_*"],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"], // ✅ Lint after dependencies build
      "outputs": [],
      "cache": true
    },
    "type-check": {
      "dependsOn": ["^build"], // ✅ Type-check after dependencies
      "outputs": [],
      "cache": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": true
    }
  },
  "remoteCache": {
    "enabled": false // ⚠️ Enable for team sharing
  }
}
```

**Key Changes**:

- ✅ `dependsOn: ["^build"]` ensures dependency order
- ✅ `outputs` includes `dist/**` for packages
- ✅ `env` tracks environment variables
- ⚠️ `remoteCache` ready for team sharing

---

## 3. RFL Integration Patterns

### 3.1 Server-Side RFL ✅ APPROVED

**Pattern**: Server Components → Domain RFL → Server Cache

**Implementation**:

```typescript
// packages/domain-finance/src/rfl/server/store.ts
import { Redis } from "ioredis"

export class ServerRFLStore {
  private cache: Map<string, Snapshot> | Redis

  async get<T>(key: string): Promise<Snapshot<T> | null> {
    // Development: In-memory cache
    // Production: Redis cache
  }

  async set<T>(key: string, snapshot: Snapshot<T>): Promise<void> {
    // Set with TTL
  }
}

// packages/domain-finance/src/rfl/server/index.ts
export async function getInvoice(id: string): Promise<Snapshot<Invoice>> {
  const cached = await serverRFLStore.get(`invoice:${id}`)
  if (cached && !isExpired(cached)) {
    return cached
  }

  // Fetch from source
  const fresh = await fetchInvoiceFromSource(id)
  await serverRFLStore.set(`invoice:${id}`, fresh)
  return fresh
}
```

**Recommendation**: **APPROVE** - Clear separation, scalable.

---

### 3.2 Client-Side RFL ⚠️ NEEDS SPECIFICATION

**Pattern**: Client Components → React Query → IndexedDB → Route Handlers

**Implementation Required**:

- Storage layer (IndexedDB vs localStorage)
- Sync strategy (polling vs manual)
- Error handling
- Offline support

**Recommendation**: **SPECIFY** complete implementation.

---

### 3.3 Next.js Cache Integration ✅ ENHANCED

**Plan Proposal**: Use Next.js Data Cache for Server Components

**Enhancement**:

```typescript
// ✅ ENHANCED: Combine Next.js cache with RFL
export default async function InvoicePage({ params }) {
  const { id } = await params

  // Option 1: Use Next.js cache (automatic)
  const response = await fetch(`/api/invoices/${id}`, {
    next: {
      revalidate: 60,              // TTL in seconds
      tags: ['invoices', `invoice:${id}`], // Cache tags
    },
  })
  const invoice = await response.json()

  // Option 2: Use domain RFL (explicit control)
  // const snapshot = await getInvoice(id)

  return <InvoiceDisplay invoice={invoice} />
}
```

**Recommendation**: **DOCUMENT** when to use each:

- **Next.js Cache**: Simple cases, automatic TTL
- **Domain RFL**: Complex logic, explicit control, client-side sync

---

## 4. Scalability Considerations

### 4.1 Package Organization ✅ APPROVED

**Principle**: One domain = One package

**Structure**:

```
packages/
├── domain-finance/      # Finance domain
├── domain-inventory/    # Inventory domain
├── domain-orders/      # Orders domain
└── shared-types/       # Shared types only
```

**Benefits**:

- ✅ Clear boundaries
- ✅ Independent versioning
- ✅ Parallel development
- ✅ Selective deployment

---

### 4.2 Dependency Management ✅ APPROVED

**Workspace Protocol**:

```json
{
  "dependencies": {
    "@mythic/domain-finance": "workspace:*",
    "@mythic/shared-types": "workspace:*"
  }
}
```

**Benefits**:

- ✅ Always latest version
- ✅ No manual versioning
- ✅ TypeScript path mapping works

---

### 4.3 Build Optimization ✅ APPROVED

**Turborepo Caching**:

- ✅ Build outputs cached
- ✅ Lint/type-check cached
- ✅ Parallel execution
- ✅ Incremental builds

**Recommendation**: Enable remote cache for team sharing.

---

## 5. Consistency Standards

### 5.1 TypeScript Configuration ✅ ENHANCED

**Current**: `strict: false` ⚠️

**Recommendation**: Enable strict mode:

```json
{
  "compilerOptions": {
    "strict": true, // ✅ Enable strict mode
    "noUncheckedIndexedAccess": true, // ✅ Safe array access
    "noImplicitReturns": true, // ✅ Explicit returns
    "noFallthroughCasesInSwitch": true // ✅ Complete switches
  }
}
```

**Migration Path**:

1. Enable in root `tsconfig.json`
2. Fix errors incrementally
3. Enforce in CI/CD

---

### 5.2 Code Style Consistency ✅ APPROVED

**Current**: Biome configured ✅

**Recommendation**: Ensure consistency across packages:

```json
// Root biome.json (shared)
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "extends": ["./packages/shared-config/biome.json"]
}
```

---

### 5.3 Import Path Consistency ✅ APPROVED

**Pattern**: Use workspace protocol + TypeScript paths

```typescript
// ✅ CORRECT
import { getInvoice } from "@mythic/domain-finance/rfl/server"
import type { Invoice } from "@mythic/typescript-shared-types"

// ❌ INCORRECT
import { getInvoice } from "../../../packages/domain-finance/src/rfl/server"
```

---

## 6. Production Readiness

### 6.1 Error Handling ✅ ENHANCED

**Recommendation**: Add comprehensive error handling:

```typescript
// ✅ ENHANCED: Error boundaries + error.tsx
// app/invoices/[id]/error.tsx
'use client'
export default function InvoiceError({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

---

### 6.2 Monitoring & Observability ✅ RECOMMENDED

**Add**:

- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- RFL cache hit/miss metrics
- Build time tracking

---

### 6.3 Testing Strategy ⚠️ MISSING

**Recommendation**: Add testing:

```typescript
// ✅ RECOMMENDED: Test structure
packages/domain-finance/
├── src/
└── __tests__/
    ├── rfl/
    │   ├── server.test.ts
    │   └── client.test.ts
    └── loom/
        └── mutations.test.ts
```

**Tools**:

- Vitest for unit tests
- Playwright for E2E tests
- React Testing Library for components

---

## 7. Migration Plan

### 7.1 Phase 1: Monorepo Structure (Week 1)

**Tasks**:

1. ✅ Create `apps/web/` directory
2. ✅ Move current app to `apps/web/`
3. ✅ Create `packages/` structure
4. ✅ Update `pnpm-workspace.yaml`
5. ✅ Update `turbo.json` for monorepo
6. ✅ Test build pipeline

**Validation**:

```bash
pnpm install
pnpm build
pnpm dev
```

---

### 7.2 Phase 2: Domain Package Creation (Week 2)

**Tasks**:

1. Create first domain package (`domain-finance`)
2. Extract RFL logic to package
3. Extract Loom logic to package
4. Update app imports
5. Test integration

---

### 7.3 Phase 3: RFL Implementation (Week 3-4)

**Tasks**:

1. Implement server-side RFL
2. Implement client-side RFL
3. Add Route Handlers for sync
4. Add Server Actions for writes
5. Test end-to-end flow

---

### 7.4 Phase 4: Optimization (Week 5)

**Tasks**:

1. Enable remote cache
2. Add monitoring
3. Performance optimization
4. Documentation
5. Team training

---

## 8. Recommendations Summary

### ✅ APPROVED (No Changes Needed)

1. **Server Components as RFL boundary** - Optimal pattern
2. **Route Handlers for sync** - Next.js-native approach
3. **Server Actions for writes** - Modern mutation pattern
4. **Monorepo structure** - Scalable and consistent
5. **Turborepo configuration** - Already optimized

### ⚠️ ENHANCEMENTS REQUIRED

1. **Client-side RFL** - Specify complete implementation
2. **Error handling** - Add comprehensive error boundaries
3. **TypeScript strict mode** - Enable for type safety
4. **Testing strategy** - Add unit and E2E tests
5. **Monitoring** - Add observability tools

### 📋 SPECIFICATIONS NEEDED

1. **RFL storage technology** - IndexedDB vs localStorage decision
2. **Sync strategy** - Polling vs manual vs event-driven
3. **Cache invalidation** - TTL vs tag-based vs manual
4. **Offline support** - PWA capabilities
5. **Error recovery** - Retry logic, fallback strategies

---

## 9. Success Criteria

### Technical Metrics

- ✅ Build time: < 2 minutes (cold), < 10 seconds (cached)
- ✅ Type-check time: < 30 seconds
- ✅ RFL cache hit rate: > 80%
- ✅ Server Component render: < 100ms
- ✅ Client-side hydration: < 200ms

### Code Quality Metrics

- ✅ TypeScript strict mode: 100% coverage
- ✅ Test coverage: > 80%
- ✅ Lint errors: 0
- ✅ Type errors: 0
- ✅ Build errors: 0

### Developer Experience

- ✅ Clear package boundaries
- ✅ Consistent import paths
- ✅ Fast feedback loops
- ✅ Comprehensive documentation
- ✅ Easy onboarding

---

## 10. Conclusion

The proposed Next.js architecture plan demonstrates **strong alignment** with
Next.js 16 best practices and monorepo optimization standards. The structure is
**scalable**, **consistent**, and **production-ready** with the recommended
enhancements.

### Approval Status

✅ **APPROVED** with the following conditions:

1. **Immediate**: Specify client-side RFL implementation
2. **Short-term**: Add error handling and testing
3. **Medium-term**: Enable TypeScript strict mode
4. **Long-term**: Add monitoring and observability

### Next Steps

1. Review this audit with the team
2. Prioritize enhancements
3. Begin Phase 1 migration
4. Track progress against success criteria

---

## References

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Turborepo Best Practices](https://turbo.build/repo/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

**Status**: ✅ **APPROVED WITH RECOMMENDATIONS** **Last Updated**: 2026-01-10
**Next Review**: After Phase 1 completion
