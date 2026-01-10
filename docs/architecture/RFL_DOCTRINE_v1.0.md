# RFL (Read Fallback Layer) v1.0 — Doctrine + Interfaces + Directory Standard

**Status:** ✅ Sealed Specification  
**Version:** 1.0.0  
**Date:** 2026-01-06  
**Authority:** Prime Monad Architecture

---

## 1. Doctrine: Read Fallback Layer (RFL)

### 1.1 Definition

A domain-local subsystem that provides *last-known-good* read models for UX continuity and low latency.

**Purpose:**
- Enable offline/partial-offline UX
- Reduce server round-trips for read operations
- Provide instant UI feedback while backend syncs
- Maintain UX continuity during network issues

### 1.2 Non-Negotiable Boundary

**RFL = READ only**

**Transactional truth (writes) = Backend authority only**

**UI truth statement must always include:**
- `as_of_timestamp` - When the data was captured
- `staleness_state` - `"fresh" | "stale" | "expired"`
- `source` - `"local-cache" | "server"`

---

## 2. Monorepo Structure

### 2.1 Recommended Structure

```
packages/
  shared-types/        # RFL interfaces and shared types
  shared-utils/        # Shared utilities
  ui/                  # UI components (The Cobalt)
  
  domain-finance/      # Finance domain
  domain-procurement/  # Procurement domain
  domain-inventory/    # Inventory domain
  ...
```

### 2.2 Domain Package Structure

Each domain package contains a *read-only fallback module*:

```
packages/domain-finance/
  src/
    index.ts
    contracts/         # DTOs, events (read)
    read/              # Server reads (optional)
    rfl/               # READ FALLBACK LAYER (local)
      store.ts         # Local storage abstraction
      snapshot.ts      # Snapshot schema + migrations
      ttl.ts           # TTL/staleness logic
      gates.ts         # "Sensitive gate" checks
      sync.ts          # Sync client (pull only)
```

### 2.3 Dual-Kernel Migration Path

When Dual-Kernel arrives:

1. Extract common RFL engine pieces into:
   - `packages/kernel-readmodel/`
2. Domains keep adapters:
   - `packages/domain-finance/src/rfl-adapter/*`
3. Apps import:
   - `kernel-readmodel` + `domain-* adapters`

Because RFL is READ-only, this migration is safe and purely structural.

---

## 3. Hard Rules (Allowed vs Forbidden)

### 3.1 Allowed inside `domain-*/rfl`

✅ **Local caching** (IndexedDB/local storage abstraction)  
✅ **Search indexes** (local search over cached data)  
✅ **Snapshot schema + migrations** (versioned local schema)  
✅ **TTL/staleness logic** (determine if data is fresh/stale/expired)  
✅ **"Sensitive gate" checks** (must revalidate before showing)  
✅ **Sync clients that pull data** (fetch from server, never push)

**Example Allowed Patterns:**
```typescript
// ✅ Allowed: Local read operations
async function getCachedInvoice(id: string): Promise<Snapshot<Invoice>> {
  const cached = await store.get(id);
  return {
    data: cached.data,
    asOf: cached.timestamp,
    freshness: calculateFreshness(cached.timestamp),
    source: "local-cache",
    revalidateRequired: cached.freshness === "expired"
  };
}

// ✅ Allowed: Pull sync (read from server)
async function syncFromServer(): Promise<void> {
  const serverData = await fetch('/api/invoices');
  await store.set(serverData);
}
```

### 3.2 Forbidden inside `domain-*/rfl`

❌ **Any mutation that claims durability**  
❌ **Any write to transactional DB**  
❌ **"approve/post/pay" workflows**  
❌ **Any function named like `create/update/delete/execute/post/approve`**  
❌ **Storing secrets / tokens / private keys locally**  
❌ **Showing sensitive views without permission revalidation**

**Example Forbidden Patterns:**
```typescript
// ❌ FORBIDDEN: Write operations
async function createInvoice(data: InvoiceData): Promise<Invoice> {
  // NO - writes must go through backend
}

// ❌ FORBIDDEN: Mutations
async function updateInvoice(id: string, data: Partial<Invoice>): Promise<void> {
  // NO - mutations must go through backend
}

// ❌ FORBIDDEN: Approval workflows
async function approveInvoice(id: string): Promise<void> {
  // NO - approvals must go through backend
}

// ❌ FORBIDDEN: Storing secrets
async function storeAuthToken(token: string): Promise<void> {
  // NO - secrets must never be in RFL
}
```

**Simple Test:** If the method changes external truth, it's not RFL.

---

## 4. Prime Monad Dependency Law

### 4.1 One-Direction Dependency Graph

```
shared-* (no domain deps)
  ↓
domain-* (can depend on shared-* and ui)
  ↓
apps/* (can depend on domain-* and kernels later)
```

**Rules:**
- `shared-*` has **no domain deps**
- `domain-*` can depend on `shared-*` and `ui` (optional)
- `apps/*` can depend on `domain-*` and kernels later
- `domain-*` must **never** import from `apps/*`

### 4.2 No Cross-Domain Imports

**Do NOT do:**
```typescript
// ❌ FORBIDDEN: Cross-domain import
import { Invoice } from '@mythic/domain-finance';
// In domain-procurement
```

**Instead:**
```typescript
// ✅ CORRECT: Use shared-types bridge
import { Invoice } from '@mythic/shared-types';
// In domain-procurement
```

**Cross-cutting types go in `shared-types`**  
**Cross-cutting utilities go in `shared-utils`**  
**Later: Introduce "domain-bridge" only if absolutely needed**

This is the single biggest monorepo health rule.

---

## 5. Operational Truth UX

### 5.1 RFL Payload Requirements

Every RFL-exposed read payload **MUST** include:

```typescript
interface Snapshot<T> {
  data: T;
  asOf: string;              // ISO timestamp
  freshness: "fresh" | "stale" | "expired";
  revalidateRequired: boolean;
  source: "local" | "server";
}
```

### 5.2 UI Requirements

The UI **MUST**:

- ✅ Show "As of {timestamp}" for all RFL-sourced data
- ✅ Disable authoritative actions when `freshness === "stale" | "expired"`
- ✅ Disable authoritative actions when `revalidateRequired === true`
- ✅ Disable authoritative actions when backend is down
- ✅ Never display "current balance / final approval" from local-only data
- ✅ Show visual indicators for stale/expired data
- ✅ Provide "Refresh" action to revalidate

**Example UI Pattern:**
```tsx
function InvoiceDisplay({ invoice }: { invoice: Snapshot<Invoice> }) {
  const isStale = invoice.freshness !== "fresh";
  const needsRefresh = invoice.revalidateRequired;
  
  return (
    <div>
      <InvoiceData data={invoice.data} />
      <div className="metadata">
        <span>As of: {invoice.asOf}</span>
        {isStale && <Badge variant="warning">Stale Data</Badge>}
        {needsRefresh && <Button onClick={refresh}>Refresh</Button>}
      </div>
      {isStale && (
        <Alert>
          This data may be outdated. Some actions may be disabled.
        </Alert>
      )}
    </div>
  );
}
```

---

## 6. RFL Interfaces (TypeScript)

### 6.1 Core Interfaces

**Location:** `packages/shared-types/src/rfl.ts`

```typescript
/**
 * Freshness state of cached data
 */
export type Freshness = "fresh" | "stale" | "expired";

/**
 * Data source indicator
 */
export type DataSource = "local" | "server";

/**
 * Snapshot of data with metadata
 */
export interface Snapshot<T> {
  data: T;
  asOf: string;                    // ISO 8601 timestamp
  freshness: Freshness;
  revalidateRequired: boolean;
  source: DataSource;
}

/**
 * TTL configuration
 */
export interface TTLConfig {
  freshThreshold: number;          // milliseconds
  staleThreshold: number;           // milliseconds
  expiredThreshold: number;         // milliseconds
}

/**
 * Read Model Store interface
 */
export interface ReadModelStore<T> {
  get(id: string): Promise<Snapshot<T> | null>;
  getAll(): Promise<Snapshot<T>[]>;
  set(id: string, data: T, timestamp?: string): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Sync Client interface (pull only)
 */
export interface SyncClient<T> {
  pull(id: string): Promise<T>;
  pullAll(): Promise<T[]>;
  sync(id: string): Promise<Snapshot<T>>;
  syncAll(): Promise<Snapshot<T>[]>;
}

/**
 * Sensitive Gate interface
 */
export interface SensitiveGate {
  check(id: string): Promise<boolean>;  // true = can show, false = must revalidate
  revalidate(id: string): Promise<void>;
}
```

### 6.2 Implementation Example

**Location:** `packages/domain-finance/src/rfl/store.ts`

```typescript
import type { ReadModelStore, Snapshot, Freshness } from '@mythic/shared-types';
import { calculateFreshness } from './ttl';

export class FinanceStore<T> implements ReadModelStore<T> {
  private storage: Map<string, Snapshot<T>> = new Map();
  
  async get(id: string): Promise<Snapshot<T> | null> {
    const snapshot = this.storage.get(id);
    if (!snapshot) return null;
    
    // Recalculate freshness on read
    const freshness = calculateFreshness(snapshot.asOf);
    return {
      ...snapshot,
      freshness,
      revalidateRequired: freshness === "expired"
    };
  }
  
  async set(id: string, data: T, timestamp?: string): Promise<void> {
    const asOf = timestamp || new Date().toISOString();
    const freshness: Freshness = "fresh"; // New data is always fresh
    
    this.storage.set(id, {
      data,
      asOf,
      freshness,
      revalidateRequired: false,
      source: "local"
    });
  }
  
  // ... other methods
}
```

---

## 7. Directory Standard

### 7.1 Required Files in `domain-*/src/rfl/`

| File | Purpose | Required |
|------|---------|----------|
| `store.ts` | Local storage abstraction | ✅ Yes |
| `snapshot.ts` | Snapshot schema + migrations | ✅ Yes |
| `ttl.ts` | TTL/staleness logic | ✅ Yes |
| `gates.ts` | Sensitive gate checks | ⚠️ Optional |
| `sync.ts` | Sync client (pull only) | ⚠️ Optional |
| `index.ts` | Public exports | ✅ Yes |

### 7.2 File Responsibilities

**`store.ts`:**
- Implements `ReadModelStore<T>` interface
- Handles local storage (IndexedDB/localStorage abstraction)
- Manages snapshot lifecycle

**`snapshot.ts`:**
- Defines snapshot schema
- Handles schema migrations
- Validates snapshot structure

**`ttl.ts`:**
- Calculates freshness based on TTL config
- Determines if data is fresh/stale/expired
- Provides TTL configuration

**`gates.ts`:**
- Implements `SensitiveGate` interface
- Checks if sensitive data can be shown
- Triggers revalidation when needed

**`sync.ts`:**
- Implements `SyncClient<T>` interface
- Pulls data from server (never pushes)
- Updates local store with fresh data

---

## 8. Migration Path to Dual-Kernel

### 8.1 Current State (Per-Domain RFL)

```
packages/domain-finance/src/rfl/
  store.ts
  snapshot.ts
  ttl.ts
  gates.ts
  sync.ts
```

### 8.2 Future State (Dual-Kernel)

```
packages/kernel-readmodel/     # Shared RFL engine
  src/
    store/
    snapshot/
    ttl/
    sync/

packages/domain-finance/src/rfl-adapter/  # Domain-specific adapter
  finance-adapter.ts
```

### 8.3 Migration Steps

1. Extract common RFL engine pieces to `packages/kernel-readmodel/`
2. Keep domain-specific logic in `packages/domain-*/src/rfl-adapter/`
3. Update apps to import: `kernel-readmodel` + `domain-* adapters`
4. No rewrite needed - purely structural relocation

**Why This Works:**
- RFL is READ-only, so migration is safe
- Domain adapters remain unchanged
- Only import paths change

---

## 9. Enforcement

### 9.1 Cursor Rule

**File:** `.cursor/rules/025_rfl-doctrine-enforcement.mdc`

**Enforces:**
- Any file under `**/rfl/**` must not introduce "write verbs"
- Any change must keep `asOf/freshness/source` semantics
- Any contradiction is flagged, not auto-fixed

### 9.2 Pre-Commit Validation

**Script:** `scripts/validate-rfl-compliance.ts`

**Checks:**
- No write verbs in RFL files
- All RFL payloads include required metadata
- No cross-domain imports
- No secrets in RFL

### 9.3 Runtime Validation

**Type Safety:**
- TypeScript enforces `Snapshot<T>` interface
- Compile-time checks for required fields
- No implicit `any` in RFL code

---

## 10. Examples

### 10.1 Finance Domain RFL

**Location:** `packages/domain-finance/src/rfl/store.ts`

```typescript
import type { ReadModelStore, Snapshot, Invoice } from '@mythic/shared-types';
import { calculateFreshness } from './ttl';

export class InvoiceStore implements ReadModelStore<Invoice> {
  // ✅ Allowed: Read operations
  async get(id: string): Promise<Snapshot<Invoice> | null> {
    // Implementation
  }
  
  // ✅ Allowed: Local cache update (from sync)
  async set(id: string, data: Invoice, timestamp?: string): Promise<void> {
    // Implementation
  }
  
  // ❌ FORBIDDEN: Would be a write operation
  // async create(data: InvoiceData): Promise<Invoice> { }
}
```

### 10.2 Sync Client (Pull Only)

**Location:** `packages/domain-finance/src/rfl/sync.ts`

```typescript
import type { SyncClient, Snapshot, Invoice } from '@mythic/shared-types';
import { invoiceStore } from './store';

export class InvoiceSyncClient implements SyncClient<Invoice> {
  // ✅ Allowed: Pull from server
  async pull(id: string): Promise<Invoice> {
    const response = await fetch(`/api/invoices/${id}`);
    return response.json();
  }
  
  // ✅ Allowed: Sync and update local store
  async sync(id: string): Promise<Snapshot<Invoice>> {
    const data = await this.pull(id);
    await invoiceStore.set(id, data);
    return invoiceStore.get(id)!;
  }
  
  // ❌ FORBIDDEN: Would push to server
  // async push(id: string, data: Invoice): Promise<void> { }
}
```

---

## 11. Summary

### 11.1 Key Principles

1. **RFL = READ only** - No mutations, no writes, no approvals
2. **Backend Authority** - All writes go through `apps/api`
3. **Freshness Metadata** - Every payload includes `asOf`, `freshness`, `source`
4. **Prime Monad Law** - One-direction dependency graph
5. **No Cross-Domain** - Use `shared-types` bridge
6. **Dual-Kernel Ready** - Structure allows future extraction

### 11.2 Compliance Checklist

- [ ] All RFL files are read-only
- [ ] All RFL payloads include freshness metadata
- [ ] No write verbs in RFL code
- [ ] No secrets in RFL
- [ ] No cross-domain imports
- [ ] UI shows freshness indicators
- [ ] UI disables actions for stale data
- [ ] Cursor rule enforces RFL doctrine
- [ ] Pre-commit validation passes

---

**Status:** ✅ Sealed Specification v1.0  
**Last Updated:** 2026-01-06  
**Authority:** Prime Monad Architecture  
**Enforcement:** `.cursor/rules/025_rfl-doctrine-enforcement.mdc`
