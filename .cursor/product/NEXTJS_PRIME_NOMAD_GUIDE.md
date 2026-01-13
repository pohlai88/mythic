# Next.js PRIME NOMAD: Elite Best Practices Guide

**Single Backbone Architecture for Kernel, DB, Frontend, Backend**

> **Target**: Deno-level cleanliness with Next.js ecosystem power **Version**:
> 1.0.0 | **Status**: Production-Ready

---

## Table of Contents

1. [Core Architecture Principles](#1-core-architecture-principles)
2. [Next.js 16 App Router Patterns](#2-nextjs-16-app-router-patterns)
3. [Database Layer (Drizzle ORM)](#3-database-layer-drizzle-orm)
4. [API Layer (Server Actions + tRPC)](#4-api-layer-server-actions--trpc)
5. [Type Safety (Zod v4)](#5-type-safety-zod-v4)
6. [Performance Optimization](#6-performance-optimization)
7. [Monorepo Structure](#7-monorepo-structure)
8. [Essential Tools & Integrations](#8-essential-tools--integrations)

---

## 1. Core Architecture Principles

### 1.1 Server Components First (Default)

**Rule**: Default to Server Components. Only use `'use client'` when absolutely
necessary.

```typescript
// ✅ CORRECT: Server Component (default)
// app/boardroom/page.tsx
import { db } from '@/src/db'
import { proposals } from '@/src/db/schema'

export default async function BoardRoomPage() {
  // Direct database access - runs on server
  const data = await db.select().from(proposals)

  return (
    <div>
      <h1>Proposals</h1>
      <ProposalList initialData={data} />
    </div>
  )
}

// ✅ CORRECT: Client Component (only when needed)
// components/ProposalList.tsx
'use client'

import { useState } from 'react'

export function ProposalList({ initialData }) {
  const [selected, setSelected] = useState(null)
  // Interactive logic here
  return <div>...</div>
}
```

**Benefits**:

- Zero client JavaScript for read-only views
- Direct database access (no API layer needed)
- Better SEO and performance
- Smaller bundle size

### 1.2 Data Flow Pattern

```
Server Component (fetch) → Client Component (interactive) → Server Action (mutate)
```

**Example**:

```typescript
// 1. Server Component fetches data
// app/proposals/page.tsx
export default async function ProposalsPage() {
  const proposals = await getProposals() // Server-side
  return <ProposalsClient initialData={proposals} />
}

// 2. Client Component handles interactivity
// components/ProposalsClient.tsx
'use client'
export function ProposalsClient({ initialData }) {
  const { mutate } = useProposals()
  return <button onClick={() => mutate()}>Refresh</button>
}

// 3. Server Action handles mutations
// app/actions/proposals.ts
'use server'
export async function approveProposal(id: string) {
  await db.update(proposals).set({ status: 'APPROVED' })
  revalidatePath('/proposals')
}
```

---

## 2. Next.js 16 App Router Patterns

### 2.1 Route Structure (MANDATORY)

```
apps/your-app/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                 # Home page
│   ├── (routes)/                # Route groups (no URL impact)
│   │   ├── proposals/
│   │   │   ├── page.tsx         # GET /proposals
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx     # GET /proposals/:id
│   │   │   │   └── actions.ts   # Server Actions for this route
│   │   │   └── loading.tsx     # Loading UI
│   │   └── layout.tsx          # Shared layout
│   ├── api/                     # Route Handlers (REST/Webhooks)
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts    # POST /api/webhooks/stripe
│   └── providers.tsx            # React Query, tRPC providers
```

**Rules**:

- ✅ `app/` = Routes & Pages ONLY
- ✅ `app/actions/` = Server Actions (mutations)
- ✅ `app/api/` = Route Handlers (webhooks, external APIs)
- ❌ NO business logic in `app/`
- ❌ NO database queries in `app/` (use `src/`)

### 2.2 Server Actions (Mutations)

**Pattern**: Use Server Actions for all mutations. No API routes needed.

```typescript
// ✅ CORRECT: Server Action
// app/actions/proposals.ts
"use server"

import { db } from "@/src/db"
import { proposals } from "@/src/db/schema"
import { revalidatePath } from "next/cache"
import { z as z4 } from "zod/v4"
import { createValidatedAction } from "@mythic/domain-core/server-action"

const approveSchema = z4.object({
  id: z4.string().uuid(),
  reason: z4.string().min(10),
})

export const approveProposal = createValidatedAction(
  approveSchema,
  async ({ id, reason }) => {
    await db
      .update(proposals)
      .set({
        status: "APPROVED",
        approvedAt: new Date(),
        approvalReason: reason,
      })
      .where(eq(proposals.id, id))

    revalidatePath("/proposals")
    revalidatePath(`/proposals/${id}`)

    return { success: true, id }
  },
  { revalidatePaths: ["/proposals"] }
)
```

**Usage in Client Component**:

```typescript
'use client'

import { approveProposal } from '@/app/actions/proposals'

export function ApproveButton({ proposalId }) {
  const handleApprove = async () => {
    const result = await approveProposal({
      id: proposalId,
      reason: 'Meets all requirements',
    })
    // Handle result
  }

  return <button onClick={handleApprove}>Approve</button>
}
```

### 2.3 Route Handlers (API Routes)

**Pattern**: Use Route Handlers ONLY for:

- Webhooks (Stripe, GitHub, etc.)
- External API proxies
- Public REST endpoints

```typescript
// ✅ CORRECT: Route Handler for Webhook
// app/api/webhooks/stripe/route.ts
import { createValidatedRoute } from "@mythic/domain-core/route-handler"
import { z as z4 } from "zod/v4"
import { stripe } from "@/src/lib/stripe"

const webhookSchema = {
  body: z4.object({
    type: z4.string(),
    data: z4.object({
      object: z4.any(),
    }),
  }),
}

export const POST = createValidatedRoute(webhookSchema, async ({ body }) => {
  const event = await stripe.webhooks.constructEvent(
    body,
    headers.get("stripe-signature"),
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  // Handle event
  switch (event.type) {
    case "payment_intent.succeeded":
      // Process payment
      break
  }

  return { received: true }
})
```

### 2.4 Metadata API (SEO)

```typescript
// app/proposals/[id]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const proposal = await getProposal(id)

  return {
    title: proposal.title,
    description: proposal.description,
    openGraph: {
      title: proposal.title,
      description: proposal.description,
      images: [proposal.imageUrl],
    },
  }
}

export default async function ProposalPage({ params }) {
  const { id } = await params
  const proposal = await getProposal(id)
  return <ProposalDetail proposal={proposal} />
}
```

---

## 3. Database Layer (Drizzle ORM)

### 3.1 Database Connection (Single Source of Truth)

```typescript
// ✅ CORRECT: Single DB connection
// src/db/index.ts
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

// Export types for type-safe queries
export type Database = typeof db
```

### 3.2 Schema Definition

```typescript
// ✅ CORRECT: Drizzle schema
// src/db/schema/proposals.ts
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  pgEnum,
} from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

export const proposalStatusEnum = pgEnum("proposal_status", [
  "DRAFT",
  "LISTENING",
  "APPROVED",
  "VETOED",
  "ARCHIVED",
])

export const proposals = pgTable("proposals", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: proposalStatusEnum("status").notNull().default("DRAFT"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
```

### 3.3 Query Patterns

```typescript
// ✅ CORRECT: Type-safe queries
// src/db/queries/proposals.ts
import { db } from "@/src/db"
import { proposals } from "@/src/db/schema"
import { eq, desc, and } from "drizzle-orm"

export async function getProposals(filters?: {
  status?: string
  limit?: number
}) {
  const query = db.select().from(proposals)

  if (filters?.status) {
    query.where(eq(proposals.status, filters.status))
  }

  return query.orderBy(desc(proposals.createdAt)).limit(filters?.limit ?? 50)
}

export async function getProposal(id: string) {
  const [proposal] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, id))
    .limit(1)

  return proposal
}
```

### 3.4 Migration Pattern

```typescript
// ✅ CORRECT: Drizzle migrations
// drizzle.config.ts
import type { Config } from "drizzle-kit"

export default {
  schema: "./src/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
```

**Commands**:

```bash
pnpm db:generate    # Generate migration
pnpm db:push        # Push to database (dev)
pnpm db:migrate     # Run migrations (prod)
```

---

## 4. API Layer (Server Actions + tRPC)

### 4.1 Server Actions (Primary Pattern)

**Use Server Actions for**:

- Form submissions
- Mutations (create, update, delete)
- Internal operations

```typescript
// ✅ CORRECT: Server Action with validation
// app/actions/proposals.ts
"use server"

import { createValidatedAction } from "@mythic/domain-core/server-action"
import { z as z4 } from "zod/v4"
import { db } from "@/src/db"
import { proposals } from "@/src/db/schema"

const createSchema = z4.object({
  title: z4.string().min(1).max(255),
  description: z4.string().min(10),
})

export const createProposal = createValidatedAction(
  createSchema,
  async (input) => {
    const [proposal] = await db.insert(proposals).values(input).returning()

    revalidatePath("/proposals")
    return proposal
  },
  { revalidatePaths: ["/proposals"] }
)
```

### 4.2 tRPC (Type-Safe API)

**Use tRPC for**:

- Complex queries with filters
- Real-time subscriptions
- Shared API between multiple apps

```typescript
// ✅ CORRECT: tRPC router
// src/server/trpc/router.ts
import { router, publicProcedure } from "@/src/server/trpc"
import { z as z4 } from "zod/v4"
import { db } from "@/src/db"
import { proposals } from "@/src/db/schema"

export const appRouter = router({
  proposals: {
    list: publicProcedure
      .input(
        z4.object({
          status: z4.string().optional(),
          limit: z4.number().default(50),
        })
      )
      .query(async ({ input }) => {
        return await getProposals(input)
      }),

    byId: publicProcedure
      .input(z4.object({ id: z4.string() }))
      .query(async ({ input }) => {
        return await getProposal(input.id)
      }),
  },
})

export type AppRouter = typeof appRouter
```

**Client Usage**:

```typescript
'use client'

import { trpc } from '@/src/lib/trpc'

export function ProposalsList() {
  const { data, isLoading } = trpc.proposals.list.useQuery({
    status: 'APPROVED',
    limit: 20,
  })

  if (isLoading) return <div>Loading...</div>
  return <div>{data?.map(p => <div key={p.id}>{p.title}</div>)}</div>
}
```

### 4.3 Route Handlers (Webhooks Only)

```typescript
// ✅ CORRECT: Route Handler for webhook
// app/api/webhooks/stripe/route.ts
import { createValidatedRoute } from "@mythic/domain-core/route-handler"
import { headers } from "next/headers"

export const POST = createValidatedRoute(
  { body: stripeWebhookSchema },
  async ({ body, request }) => {
    const signature = headers().get("stripe-signature")!
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Handle event
    return { received: true }
  }
)
```

---

## 5. Type Safety (Zod v4)

### 5.1 Schema Definition

```typescript
// ✅ CORRECT: Zod v4 schemas
// src/lib/schemas/proposals.ts
import { z as z4 } from "zod/v4"

export const proposalSchema = z4.object({
  id: z4.string().uuid(),
  title: z4.string().min(1).max(255),
  description: z4.string().min(10),
  status: z4.enum(["DRAFT", "LISTENING", "APPROVED", "VETOED", "ARCHIVED"]),
  createdAt: z4.date(),
  updatedAt: z4.date(),
})

export type Proposal = z4.infer<typeof proposalSchema>
```

### 5.2 Validation Pattern

```typescript
// ✅ CORRECT: Validate everywhere
import { z as z4 } from "zod/v4"

// Server Action
export const createProposal = createValidatedAction(
  proposalSchema.omit({ id: true, createdAt: true, updatedAt: true }),
  async (input) => {
    // input is fully typed and validated
    return await db.insert(proposals).values(input)
  }
)

// Route Handler
export const POST = createValidatedRoute(
  { body: proposalSchema },
  async ({ body }) => {
    // body is fully typed and validated
    return { success: true }
  }
)
```

---

## 6. Performance Optimization

### 6.1 Next.js 16 Optimizations

```typescript
// ✅ CORRECT: next.config.mjs
const nextConfig = {
  experimental: {
    // Optimize workspace packages
    optimizePackageImports: [
      "@mythic/design-system",
      "@mythic/shared-utils",
      "@mythic/shared-types",
      "@tanstack/react-query",
      "lucide-react",
    ],
    // Server Actions optimization
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: ["localhost:3000", "*.vercel.app"],
    },
    // CSS optimization
    optimizeCss: true,
  },
}
```

### 6.2 Caching Strategy

```typescript
// ✅ CORRECT: Cache configuration
import { unstable_cache } from "next/cache"

export const getProposals = unstable_cache(
  async () => {
    return await db.select().from(proposals)
  },
  ["proposals"],
  {
    revalidate: 60, // 60 seconds
    tags: ["proposals"],
  }
)

// Revalidate on mutation
export const createProposal = createValidatedAction(schema, async (input) => {
  await db.insert(proposals).values(input)
  revalidateTag("proposals") // Invalidate cache
  return { success: true }
})
```

### 6.3 Streaming & Suspense

```typescript
// ✅ CORRECT: Streaming with Suspense
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <Suspense fallback={<ProposalsSkeleton />}>
        <ProposalsList />
      </Suspense>
      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics />
      </Suspense>
    </div>
  )
}

async function ProposalsList() {
  const proposals = await getProposals() // Can be slow
  return <div>{proposals.map(...)}</div>
}
```

---

## 7. Monorepo Structure

### 7.1 Directory Boundaries (STRICT)

```
mythic/
├── apps/                    # Applications ONLY
│   ├── boardroom/
│   │   ├── app/             # Routes & Pages
│   │   ├── components/      # UI Components
│   │   ├── src/             # Business Logic
│   │   │   ├── db/          # Database
│   │   │   ├── lib/         # Utilities
│   │   │   └── server/      # Server-only code
│   │   └── package.json
│   └── straton-hub/
│
├── packages/                # Shared Packages ONLY
│   ├── design-system/       # UI Components
│   ├── shared-utils/        # Utilities
│   ├── shared-types/        # Types & Schemas
│   ├── domain-core/         # Domain patterns
│   └── config/              # Configs
│
├── scripts/                 # Root scripts
├── docs/                    # Documentation
└── package.json             # Root package
```

**Rules**:

- ✅ Apps in `apps/`
- ✅ Packages in `packages/`
- ❌ NO root `src/` or `lib/`
- ❌ NO root `tailwind.config.ts`
- ❌ NO root `components.json`

### 7.2 Package Imports

```typescript
// ✅ CORRECT: Workspace imports
import { cn } from "@mythic/shared-utils"
import { Button } from "@mythic/design-system"
import { Proposal } from "@mythic/shared-types"
import { createValidatedAction } from "@mythic/domain-core/server-action"

// ❌ WRONG: Relative imports across apps
import { something } from "../../apps/other-app/src/lib"
```

---

## 8. Essential Tools & Integrations

### 8.1 Required Packages

```json
{
  "dependencies": {
    "next": "^16.1.1", // Framework
    "react": "^18.3.1", // UI
    "react-dom": "^18.3.1", // UI
    "drizzle-orm": "^0.45.1", // ORM
    "@neondatabase/serverless": "^0.10.0", // Database
    "zod": "^4.3.5", // Validation
    "@tanstack/react-query": "^5.56.0", // Client state
    "@trpc/server": "^11.8.1", // Type-safe API
    "@trpc/client": "^11.8.1", // Type-safe client
    "@trpc/react-query": "^11.8.1", // React Query integration
    "zustand": "^5.0.10", // Client state (simple)
    "react-hook-form": "^7.52.0", // Forms
    "@hookform/resolvers": "^3.3.4", // Zod + React Hook Form
    "tailwindcss": "^4.1.18", // Styling
    "clsx": "^2.1.0", // Class utilities
    "tailwind-merge": "^2.2.0" // Tailwind merge
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.8", // DB migrations
    "typescript": "^5.3.3", // Type safety
    "vitest": "^4.0.16", // Testing
    "@testing-library/react": "^16.3.1", // React testing
    "turbo": "^2.3.3" // Monorepo
  }
}
```

### 8.2 Development Tools

```json
{
  "scripts": {
    "dev": "next dev --turbopack", // Fast dev with Turbopack
    "build": "next build", // Production build
    "type-check": "tsc --noEmit", // Type checking
    "lint": "next lint", // Linting
    "test": "vitest run", // Testing
    "db:generate": "drizzle-kit generate", // DB migrations
    "db:push": "drizzle-kit push", // Push schema (dev)
    "db:migrate": "drizzle-kit migrate" // Run migrations (prod)
  }
}
```

### 8.3 Recommended VS Code Extensions

- **ESLint** - Linting
- **Prettier** - Formatting
- **TypeScript** - Type checking
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **Drizzle ORM** - Database schema highlighting

---

## 9. Best Practices Checklist

### ✅ Architecture

- [ ] Server Components by default
- [ ] Client Components only when needed
- [ ] Server Actions for mutations
- [ ] Route Handlers for webhooks only
- [ ] tRPC for complex queries
- [ ] Direct database access in Server Components

### ✅ Type Safety

- [ ] Zod v4 schemas for all inputs
- [ ] Type-safe database queries (Drizzle)
- [ ] Type-safe API (tRPC)
- [ ] No `any` types

### ✅ Performance

- [ ] `optimizePackageImports` configured
- [ ] Caching with `unstable_cache`
- [ ] Streaming with Suspense
- [ ] Image optimization
- [ ] Bundle analysis

### ✅ Monorepo

- [ ] Clear app/package boundaries
- [ ] No root-level code directories
- [ ] Workspace imports only
- [ ] Shared packages for common code

### ✅ Database

- [ ] Single DB connection
- [ ] Type-safe schemas (Drizzle)
- [ ] Migrations tracked
- [ ] Connection pooling (Neon)

---

## 10. Anti-Patterns (DON'T DO THIS)

### ❌ Don't: Mix Server and Client

```typescript
// ❌ WRONG: Server Component with client hooks
export default function Page() {
  const [state, setState] = useState() // ERROR: useState in Server Component
  return <div>...</div>
}

// ✅ CORRECT: Separate Server and Client
export default function Page() {
  return <ClientComponent />
}

'use client'
function ClientComponent() {
  const [state, setState] = useState() // OK
  return <div>...</div>
}
```

### ❌ Don't: API Routes for Internal Operations

```typescript
// ❌ WRONG: API route for internal mutation
// app/api/proposals/approve/route.ts
export async function POST(req) {
  await db.update(proposals).set({ status: "APPROVED" })
}

// ✅ CORRECT: Server Action
// app/actions/proposals.ts
;("use server")
export async function approveProposal(id: string) {
  await db.update(proposals).set({ status: "APPROVED" })
}
```

### ❌ Don't: Root-Level Code

```typescript
// ❌ WRONG: Root-level src/ or lib/
src / lib / utils.ts
lib / env.ts

// ✅ CORRECT: App-scoped or package-scoped
apps / boardroom / src / lib / utils.ts
packages / shared - utils / src / index.ts
```

---

## 11. Migration Path

### Step 1: Clean Boundaries

1. Move root `src/` → `apps/*/src/` or `packages/*/src/`
2. Move root `lib/` → `apps/*/lib/` or `packages/*/src/`
3. Delete root `tailwind.config.ts`
4. Delete root `components.json`

### Step 2: Standardize Patterns

1. Use `@mythic/domain-core` for Server Actions
2. Use `@mythic/domain-core` for Route Handlers
3. Use `@mythic/shared-utils` for utilities
4. Use `@mythic/shared-types` for types

### Step 3: Optimize

1. Enable `optimizePackageImports`
2. Add caching with `unstable_cache`
3. Use Suspense for streaming
4. Configure Turborepo caching

---

**Status**: ✅ Production-Ready **Last Updated**: 2026-01-13 **Version**: 1.0.0
