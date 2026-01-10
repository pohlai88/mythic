# Quick Reference Guide

## 🚀 Type Generation Commands

```bash
# Generate all types (Drizzle + GraphQL)
pnpm types:generate

# Watch mode (auto-regenerate on changes)
pnpm types:watch

# Individual type generation
pnpm db:types          # Drizzle database types
pnpm graphql:codegen   # GraphQL types
```

## 📦 Database Commands

```bash
# Generate migration from schema changes
pnpm db:generate

# Push schema changes directly (dev only)
pnpm db:push

# Run migrations
pnpm db:migrate

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## 🎨 Adding Shadcn Components

```bash
# Add a component
pnpm dlx shadcn@latest add button

# Add multiple components
pnpm dlx shadcn@latest add button card input
```

## 🔧 Development Workflow

1. **Define Schema** (Drizzle):

   ```typescript
   // src/db/schema/users.ts
   export const users = pgTable('users', { ... })
   ```

2. **Generate Types**:

   ```bash
   pnpm types:generate
   ```

3. **Use Types** (automatic):
   ```typescript
   import { User } from '@/db/schema'
   // User type is automatically available
   ```

## 📝 Type Inference Examples

### Zod Types

```typescript
const schema = z.object({ email: z.string().email() })
type User = z.infer<typeof schema> // Automatic!
```

### Drizzle Types

```typescript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

### tRPC Types

```typescript
// Server
export const appRouter = router({ ... })
export type AppRouter = typeof appRouter

// Client (automatic inference)
const { data } = trpc.getUser.useQuery({ id: 1 })
```

### GraphQL Types

```typescript
// Auto-generated from schema
import { useGetUsersQuery } from '@/generated/graphql'
const { data } = useGetUsersQuery() // Fully typed!
```

## 🎯 API Endpoints

- **tRPC**: `/api/trpc`
- **REST**: `/api/rest/*`
- **GraphQL**: `/api/graphql`

## 📚 Key Files

- `drizzle.config.ts` - Database configuration
- `codegen.yml` - GraphQL code generation
- `components.json` - Shadcn/ui configuration
- `tailwind.config.ts` - Tailwind CSS v4 config
- `src/server/trpc/` - tRPC router
- `src/db/schema/` - Database schemas
