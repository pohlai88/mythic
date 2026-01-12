# Next.js in Monorepo: Patterns & Anti-Patterns

**Common patterns and what to avoid when using Next.js in a monorepo**

---

## ✅ Patterns (DO)

### 1. Server Components for Data Fetching

```typescript
// ✅ GOOD: Server Component fetches data
// app/boardroom/page.tsx
import { getProposals } from './actions/proposals'

export default async function BoardRoomPage() {
  const proposals = await getProposals()
  return <BoardRoomClient initialProposals={proposals} />
}
```

**Why:**
- Runs on server (faster)
- No client-side data fetching
- Better SEO
- Smaller client bundle

### 2. Client Components for Interactivity

```typescript
// ✅ GOOD: Client Component for interactivity
// components/BoardRoomClient.tsx
'use client'

import { useState } from 'react'

export function BoardRoomClient({ initialProposals }) {
  const [selected, setSelected] = useState(null)
  // Interactive logic here
}
```

**Why:**
- Only add 'use client' when needed
- Keep most components as Server Components
- Better performance

### 3. Server Actions for Mutations

```typescript
// ✅ GOOD: Server Action
// app/actions/proposals.ts
'use server'

import { db } from '@/src/db'
import { revalidatePath } from 'next/cache'

export async function approveProposal(id: string) {
  await db.update(proposals).set({ status: 'APPROVED' })
  revalidatePath('/boardroom')
  return { success: true }
}
```

**Why:**
- Type-safe
- No API routes needed
- Automatic revalidation
- Progressive enhancement

### 4. Workspace Package Imports

```typescript
// ✅ GOOD: Use workspace packages
import { cn } from '@mythic/shared-utils'
import { Button } from '@mythic/design-system'
import { Proposal } from '@mythic/shared-types/boardroom'
```

**Why:**
- Clear dependencies
- Type-safe
- Easy refactoring
- Better IDE support

### 5. TypeScript Path Aliases

```json
// ✅ GOOD: tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@mythic/shared-utils": ["../../packages/shared-utils/src"]
    }
  }
}
```

**Why:**
- Clean imports
- Easy to refactor
- Works with TypeScript

---

## ❌ Anti-Patterns (DON'T)

### 1. Client-Side Data Fetching in Server Components

```typescript
// ❌ BAD: Fetching in Client Component
'use client'

export default function Page() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/proposals').then(r => r.json()).then(setData)
  }, [])

  return <div>{data?.map(...)}</div>
}

// ✅ GOOD: Fetch in Server Component
export default async function Page() {
  const data = await getProposals()
  return <div>{data.map(...)}</div>
}
```

**Why Avoid:**
- Slower (client-side fetch)
- Worse SEO
- Larger bundle
- More complex state management

### 2. Relative Path Imports

```typescript
// ❌ BAD: Relative paths
import { cn } from '../../../packages/shared-utils/src'
import { Button } from '../../../../packages/design-system/src'

// ✅ GOOD: Workspace packages
import { cn } from '@mythic/shared-utils'
import { Button } from '@mythic/design-system'
```

**Why Avoid:**
- Breaks on refactoring
- Hard to read
- No type safety
- Fragile

### 3. Mixing Server and Client Code

```typescript
// ❌ BAD: Server code in Client Component
'use client'

import { db } from '@/src/db'  // ❌ Can't use in client

export function Component() {
  const data = await db.select()  // ❌ Can't await in client
}

// ✅ GOOD: Separate concerns
// Server Component
export default async function Page() {
  const data = await db.select()
  return <ClientComponent data={data} />
}

// Client Component
'use client'
export function ClientComponent({ data }) {
  // Use data here
}
```

**Why Avoid:**
- Runtime errors
- Security issues
- Performance problems

### 4. Not Using Server Actions

```typescript
// ❌ BAD: API route + client fetch
// app/api/proposals/route.ts
export async function POST(req) {
  // Handle mutation
}

// components/Form.tsx
'use client'
async function handleSubmit() {
  await fetch('/api/proposals', { method: 'POST' })
}

// ✅ GOOD: Server Action
'use server'
export async function createProposal(data) {
  // Handle mutation
}

// components/Form.tsx
'use client'
import { createProposal } from '@/app/actions'
async function handleSubmit() {
  await createProposal(data)
}
```

**Why Avoid:**
- More code
- Less type-safe
- More API routes to maintain
- No progressive enhancement

### 5. Not Optimizing Package Imports

```javascript
// ❌ BAD: No optimization
// next.config.mjs
const nextConfig = {
  // Missing optimizePackageImports
}

// ✅ GOOD: Optimize imports
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@mythic/design-system',
      '@radix-ui/react-accordion',
    ],
  },
}
```

**Why Avoid:**
- Larger bundles
- Slower builds
- Worse performance

---

## Common Patterns

### Pattern 1: Server Component + Client Component

```typescript
// Server Component (data fetching)
// app/boardroom/page.tsx
export default async function Page() {
  const data = await getData()
  return <ClientComponent initialData={data} />
}

// Client Component (interactivity)
// components/ClientComponent.tsx
'use client'
export function ClientComponent({ initialData }) {
  const [state, setState] = useState(initialData)
  // Interactive logic
}
```

### Pattern 2: Server Action + Optimistic UI

```typescript
// Server Action
'use server'
export async function approveProposal(id: string) {
  await db.update(proposals).set({ status: 'APPROVED' })
  revalidatePath('/boardroom')
}

// Client Component with Optimistic UI
'use client'
export function ApproveButton({ proposalId }) {
  const [optimistic, setOptimistic] = useOptimistic(false)

  async function handleClick() {
    setOptimistic(true)  // Optimistic update
    await approveProposal(proposalId)  // Server action
  }

  return <button onClick={handleClick}>Approve</button>
}
```

### Pattern 3: Shared Package Usage

```typescript
// packages/shared-utils/src/index.ts
export { cn } from './cn'
export { formatDate } from './date'

// apps/boardroom/components/Button.tsx
import { cn } from '@mythic/shared-utils'

export function Button({ className }) {
  return <button className={cn('base', className)} />
}
```

---

## Performance Tips

### 1. Use Server Components

- Default to Server Components
- Only add 'use client' when needed
- Fetch data in Server Components

### 2. Optimize Imports

```javascript
experimental: {
  optimizePackageImports: [
    '@mythic/design-system',
    'lucide-react',
  ],
}
```

### 3. Use Dynamic Imports

```typescript
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
})
```

### 4. Cache Data

```typescript
// Use Next.js cache
import { cache } from 'react'

export const getProposals = cache(async () => {
  return await db.select().from(proposals)
})
```

---

## Type Safety

### 1. Shared Types Package

```typescript
// packages/shared-types/src/boardroom/index.ts
export type Proposal = {
  id: string
  status: 'DRAFT' | 'LISTENING' | 'APPROVED'
}

// apps/boardroom/app/actions/proposals.ts
import type { Proposal } from '@mythic/shared-types/boardroom'

export async function getProposals(): Promise<Proposal[]> {
  // ...
}
```

### 2. Server Action Types

```typescript
'use server'

export async function createProposal(
  data: CreateProposalInput
): Promise<{ success: boolean; id?: string }> {
  // Type-safe server action
}
```

---

## Summary

**✅ DO:**
- Server Components for data fetching
- Client Components for interactivity
- Server Actions for mutations
- Workspace packages for sharing
- TypeScript path aliases

**❌ DON'T:**
- Client-side data fetching in Server Components
- Relative path imports
- Mixing server and client code
- API routes for simple mutations
- Skip package import optimization

**Result:** Fast, type-safe, maintainable Next.js apps in monorepo.
