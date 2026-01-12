---
name: Next.js Architecture Review
overview: Comprehensive Next.js-specific analysis of the Prime Monad Architecture paper, identifying alignment opportunities, potential conflicts, and Next.js-native patterns that enhance the RFL doctrine.
todos:
  - id: review-nextjs-alignment
    content: Review Next.js alignment analysis and identify any missing considerations
    status: completed
  - id: draft-paper-amendments
    content: Draft specific amendments to add to Prime Monad paper (Next.js integration section, RFL storage decisions)
    status: in_progress
  - id: create-implementation-guide
    content: Create Next.js-specific RFL implementation guide with code examples
    status: pending
  - id: validate-monorepo-structure
    content: Validate proposed monorepo structure against existing Next.js patterns
    status: pending
---

# Next.js Architecture Review: Prime Monad RFL Paper

## Executive Summary

The Prime Monad Architecture aligns well with Next.js App Router patterns, with opportunities to leverage Next.js-native features for RFL implementation. Key findings:

- **Strong Alignment**: Server Components, Route Handlers, and monorepo structure match Next.js best practices
- **RFL Enhancement Opportunity**: Next.js caching, streaming, and Server Components can enhance RFL without violating doctrine
- **Minor Gaps**: Need to clarify RFL placement in Next.js app structure and client-side RFL boundaries
- **Future-Ready**: Dual-Kernel strategy compatible with Next.js evolution

---

## 1. Alignment Analysis

### 1.1 Server Components as RFL Boundary (STRONG ALIGNMENT)

**Current Paper**: RFL is domain-embedded, READ-ONLY

**Next.js Reality**: Server Components are READ-ONLY by default

**Recommendation**:

- Server Components in `app/` can serve as RFL consumers
- Domain RFL packages (`packages/domain-*/src/rfl/`) provide data
- Server Components fetch from RFL, never mutate

**Pattern**:

```typescript
// packages/domain-finance/src/rfl/store.ts (Domain RFL)
export async function getInvoice(id: string): Promise<Snapshot<Invoice>> {
  // RFL read logic
}

// app/invoices/[id]/page.tsx (Next.js Server Component)
import { getInvoice } from '@mythic/domain-finance/rfl'

export default async function InvoicePage({ params }) {
  const snapshot = await getInvoice(params.id)
  // Server Component renders - no client JS for read-only views
  return <InvoiceDisplay snapshot={snapshot} />
}
```

**Benefits**:

- Zero client JavaScript for read-only pages
- Automatic streaming with Suspense
- Server-side caching via Next.js Data Cache

---

### 1.2 Route Handlers vs BFF (CLARIFICATION NEEDED)

**Current Paper**: "BFF necessity vs Next Route Handlers" marked as RESERVED

**Next.js Recommendation**:

- Use Route Handlers (`app/api/**/route.ts`) for RFL sync operations
- Route Handlers can call domain RFL `sync()` methods
- No separate BFF needed for simple cases

**Pattern**:

```typescript
// app/api/invoices/[id]/sync/route.ts
import { invoiceRFL } from '@mythic/domain-finance/rfl'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const snapshot = await invoiceRFL.sync(id) // Pull + update local cache
  return NextResponse.json(snapshot)
}
```

**Decision Point**:

- Simple sync: Route Handlers sufficient
- Complex orchestration: Consider BFF package (`packages/bff/`)

---

### 1.3 Client-Side RFL (GAP IDENTIFIED)

**Current Paper**: RFL placement is domain-embedded, but doesn't specify client vs server

**Next.js Reality**:

- Server Components: Can directly import domain RFL
- Client Components: Need different pattern (IndexedDB, React Query, etc.)

**Recommendation**: Clarify RFL layers:

```
packages/domain-finance/src/rfl/
├── server/          # Server-side RFL (Node.js)
│   ├── store.ts     # Server cache (memory/Redis)
│   └── sync.ts      # Server sync logic
└── client/          # Client-side RFL (Browser)
    ├── store.ts    # IndexedDB/localStorage
    └── sync.ts      # Client sync (fetch to Route Handlers)
```

**Client Component Pattern**:

```typescript
// app/invoices/[id]/client-page.tsx
'use client'
import { useInvoiceRFL } from '@mythic/domain-finance/rfl/client'

export default function InvoiceClientPage({ id }) {
  const { snapshot, sync, isLoading } = useInvoiceRFL(id)

  if (snapshot.freshness === 'expired') {
    return <ExpiredWarning onSync={() => sync()} />
  }

  return <InvoiceDisplay snapshot={snapshot} />
}
```

---

## 2. Next.js Native Features Enhancing RFL

### 2.1 Next.js Data Cache (AUTOMATIC RFL ENHANCEMENT)

**Opportunity**: Next.js `fetch` caching can serve as RFL layer automatically

**Pattern**:

```typescript
// Server Component with Next.js cache
export default async function InvoicePage({ params }) {
  // Next.js automatically caches this fetch
  const response = await fetch(`/api/invoices/${params.id}`, {
    next: {
      revalidate: 60, // TTL in seconds
      tags: ['invoices'] // Cache tags for invalidation
    }
  })
  const invoice = await response.json()

  // This matches RFL Snapshot concept:
  // - asOf: implicit (cache timestamp)
  // - freshness: derived from revalidate
  // - source: "server" (cached)
}
```

**Recommendation**:

- Use Next.js cache for Server Component RFL
- Keep domain RFL for client-side and explicit control
- Document when to use each

---

### 2.2 Streaming & Suspense (RFL UX ENHANCEMENT)

**Opportunity**: Next.js streaming aligns with RFL "stale-aware" UX

**Pattern**:

```typescript
// app/invoices/page.tsx
import { Suspense } from 'react'
import { InvoiceList } from './invoice-list'

export default function InvoicesPage() {
  return (
    <div>
      <h1>Invoices</h1>
      {/* Show cached/stale data immediately */}
      <Suspense fallback={<InvoiceListSkeleton />}>
        <InvoiceList /> {/* Fetches from RFL, streams when ready */}
      </Suspense>
    </div>
  )
}
```

**Benefits**:

- Immediate stale data display (RFL cache)
- Progressive enhancement (fresh data streams in)
- Matches RFL "graceful degradation" doctrine

---

### 2.3 Server Actions (WRITE BOUNDARY CLARIFICATION)

**Current Paper**: "All WRITE authority remains outside RFL"

**Next.js Pattern**: Server Actions are the write boundary

**Recommendation**: Document Server Actions as write layer:

```typescript
// app/invoices/[id]/actions.ts (Server Actions - WRITE ONLY)
'use server'
import { invoiceLoom } from '@mythic/domain-finance/loom' // Write layer

export async function approveInvoice(id: string) {
  // This is WRITE - goes to Loom, not RFL
  await invoiceLoom.approve(id)
  // Invalidate RFL cache
  revalidateTag('invoices')
}
```

**Clear Separation**:

- RFL: Read fallback (domain packages)
- Server Actions: Write operations (app layer)
- Route Handlers: RFL sync endpoints (app/api)

---

## 3. Monorepo Structure Alignment

### 3.1 Current Structure (ALIGNED)

Your paper's structure matches Next.js monorepo best practices:

```
apps/
  web/              # Next.js app
packages/
  domain-*/         # Domain packages with RFL
  shared-*/         # Shared primitives
```

**Next.js Recommendation**:

- ✅ Keep this structure
- ✅ Apps consume domains (Prime Monad Law)
- ✅ Domains never import apps

---

### 3.2 App Router Structure (ENHANCEMENT)

**Recommendation**: Align app structure with RFL doctrine:

```
apps/web/
├── app/
│   ├── (routes)/           # Route groups
│   │   ├── invoices/       # Feature routes
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx        # Server Component (reads RFL)
│   │   │   │   └── actions.ts      # Server Actions (writes to Loom)
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   └── api/                # Route Handlers
│       └── invoices/
│           └── [id]/
│               └── sync/
│                   └── route.ts   # RFL sync endpoint
```

---

## 4. Potential Conflicts & Resolutions

### 4.1 Conflict: RFL Metadata vs Next.js Cache

**Issue**: RFL requires explicit `asOf`, `freshness` metadata, but Next.js cache is implicit

**Resolution**:

- Domain RFL: Explicit metadata (for client-side, explicit control)
- Next.js cache: Use for Server Components (implicit, automatic)
- Document when each is appropriate

---

### 4.2 Conflict: Client-Side RFL Storage

**Issue**: Paper doesn't specify RFL persistence technology (marked RESERVED)

**Next.js Recommendation**:

- **Development**: `localStorage` (simple, fast)
- **Production**: `IndexedDB` (larger capacity, async)
- **Server**: In-memory cache or Redis (for Server Components)

**Pattern**:

```typescript
// packages/domain-finance/src/rfl/client/store.ts
export class ClientRFLStore {
  // Use IndexedDB for production
  private db: IDBDatabase

  async get(id: string): Promise<Snapshot<Invoice> | null> {
    // Read from IndexedDB
  }

  async set(id: string, data: Invoice, timestamp: string): Promise<void> {
    // Write to IndexedDB (from sync, not mutation)
  }
}
```

---

## 5. Next.js-Specific Recommendations

### 5.1 Add to Paper: Next.js RFL Integration Patterns

**Section to Add**:

````markdown
## 11. Next.js Integration Patterns

### 11.1 Server Component RFL Consumption

Server Components can directly import domain RFL:

```typescript
// ✅ ALLOWED: Server Component reading RFL
import { getInvoice } from '@mythic/domain-finance/rfl/server'

export default async function InvoicePage({ params }) {
  const snapshot = await getInvoice(params.id)
  return <InvoiceDisplay snapshot={snapshot} />
}
````

### 11.2 Client Component RFL Consumption

Client Components use hooks or React Query:

```typescript
// ✅ ALLOWED: Client Component with RFL hook
'use client'
import { useInvoiceRFL } from '@mythic/domain-finance/rfl/client'

export default function InvoiceClientPage({ id }) {
  const { snapshot, sync } = useInvoiceRFL(id)
  // ...
}
```

### 11.3 Route Handler RFL Sync

Route Handlers provide sync endpoints:

```typescript
// ✅ ALLOWED: Route Handler for RFL sync
export async function POST(request, { params }) {
  const snapshot = await invoiceRFL.sync(params.id)
  return NextResponse.json(snapshot)
}
```

### 11.4 Server Actions (Write Boundary)

Server Actions are the write layer, never RFL:

```typescript
// ✅ CORRECT: Server Action writes to Loom
'use server'
export async function approveInvoice(id: string) {
  await invoiceLoom.approve(id) // Write, not RFL
  revalidateTag('invoices') // Invalidate RFL cache
}
```
````

---

### 5.2 Clarify RFL Placement in Next.js Context

**Current**: "RFL is implemented per domain"
**Clarification Needed**:
- Server RFL: `packages/domain-*/src/rfl/server/`
- Client RFL: `packages/domain-*/src/rfl/client/`
- Shared RFL types: `packages/shared-types/src/rfl.ts`

---

## 6. Future Dual-Kernel Compatibility

### 6.1 Kernel-ReadModel Extraction Path

**Current Paper**: Future extraction to `packages/kernel-readmodel/`

**Next.js Compatibility**: ✅ Fully compatible

**Migration Path**:
1. Extract shared RFL engine to `packages/kernel-readmodel/`
2. Domain RFL adapters remain (`packages/domain-*/src/rfl/adapters/`)
3. Next.js Server Components continue using domain RFL (no changes)
4. Client Components continue using domain RFL hooks (no changes)

**No Breaking Changes**: Next.js app layer doesn't need changes

---

## 7. Action Items for Paper

### 7.1 Immediate Clarifications

1. **Add Section 11**: Next.js Integration Patterns (see 5.1)
2. **Clarify RFL Layers**: Server vs Client RFL placement
3. **Document Route Handlers**: As RFL sync endpoints (not BFF)
4. **Specify RFL Storage**: IndexedDB for client, Redis/memory for server

### 7.2 Future Considerations (Keep RESERVED)

- Dual-Kernel timeline (already marked RESERVED ✅)
- BFF vs Route Handlers (document both options)
- Cross-domain read composition (Next.js Server Components can compose)

---

## 8. Next.js Best Practices Alignment

### ✅ Aligned

- Server Components by default (matches RFL read-only)
- Route Handlers for API (matches RFL sync)
- Monorepo structure (matches Prime Monad Law)
- Type safety with TypeScript (matches RFL enforcement)

### ⚠️ Needs Clarification

- Client-side RFL implementation details
- RFL persistence technology choice
- BFF necessity decision

### 🎯 Enhancement Opportunities

- Leverage Next.js Data Cache for Server Component RFL
- Use Streaming/Suspense for RFL UX
- Document Server Actions as write boundary

---

## 9. Recommended Paper Amendments

### Amendment 1: Next.js Integration Section

Add to Section 3 (RFL Doctrine):

```markdown
### 3.5 Next.js Integration (CLARIFICATION)

RFL integrates with Next.js in three layers:

1. **Server Components**: Import domain RFL directly
   - Pattern: `import { getX } from '@mythic/domain-X/rfl/server'`
   - Benefit: Zero client JS, automatic streaming

2. **Client Components**: Use RFL hooks
   - Pattern: `const { snapshot } = useXRFL(id)`
   - Storage: IndexedDB (client-side)

3. **Route Handlers**: Provide sync endpoints
   - Pattern: `POST /api/resource/[id]/sync`
   - Purpose: Client RFL sync to server

**Write Operations**: Use Server Actions, never RFL
````

### Amendment 2: RFL Storage Decision

Add to Section 9 (Open Items):

```markdown
### 9.1 RFL Persistence Technology (DECISION)

**Decision**:
- **Client RFL**: IndexedDB (production), localStorage (development)
- **Server RFL**: In-memory cache (dev), Redis (production)
- **Next.js Cache**: Use for Server Components (automatic)

**Rationale**:
- IndexedDB: Large capacity, async, persistent
- Redis: Fast, shared across instances, TTL support
- Next.js Cache: Zero config, automatic, streaming-ready
```

---

## 10. Conclusion

The Prime Monad Architecture paper is **highly compatible** with Next.js App Router patterns. Key strengths:

1. ✅ Server Components align with RFL read-only doctrine
2. ✅ Route Handlers provide RFL sync endpoints
3. ✅ Monorepo structure matches Next.js best practices
4. ✅ Type safety enforcement aligns with Next.js TypeScript-first approach

**Recommended Actions**:

1. **Add Next.js Integration Section** (Section 11) to paper
2. **Clarify RFL Layers** (server vs client)
3. **Document Route Handlers** as RFL sync pattern
4. **Keep Future Items RESERVED** (as currently marked)

**No Breaking Changes Required**: The paper's architecture is Next.js-ready as-is, with clarifications enhancing implementation guidance.

---

**Status**: Ready for implementation

**Next Steps**: Add clarifications to paper, then proceed with Next.js app structure
