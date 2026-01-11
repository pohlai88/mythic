# @mythic/domain-core

Shared Next.js 16 Patterns for All Domains

Following KISS and DRY principles - standardized patterns to prevent duplication across 10 pillars.

## Usage

### Route Handler

```typescript
import { createValidatedRoute } from '@mythic/domain-core/route-handler'
import { z as z4 } from 'zod/v4'

const schema = {
  params: z4.object({ id: z4.string() }),
  query: z4.object({ page: z4.number().optional() }),
  body: z4.object({ name: z4.string() }),
}

export const POST = createValidatedRoute(schema, async ({ params, query, body }) => {
  // Your handler logic
  return { success: true }
})
```

### Server Action

```typescript
import { createValidatedAction } from '@mythic/domain-core/server-action'
import { z as z4 } from 'zod/v4'

const schema = z4.object({ name: z4.string() })

export const createResource = createValidatedAction(
  schema,
  async (input) => {
    // Your action logic
    return { id: '123' }
  },
  { revalidatePaths: ['/resources'] }
)
```

### Query

```typescript
import { createQuery } from '@mythic/domain-core/query'

export const getResources = createQuery(async () => {
  // Your query logic
  return []
})
```

### Proxy

```typescript
import { createDomainProxy } from '@mythic/domain-core/proxy'

export const proxy = createDomainProxy({
  excludePaths: ['/api', '/_next'],
  requestSchema: z4.object({ /* ... */ }),
})
```
