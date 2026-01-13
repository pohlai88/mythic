# Clear Boundaries - Registry Admin App

## Boundary Rules (MANDATORY)

### Top Level: `app/` (Next.js App Router)
**Purpose**: Routes, pages, API routes, components

**CAN**:
- ✅ Import from `shared/` (bottom level)
- ✅ Import from external packages
- ✅ Import from workspace packages (`@mythic/*`)

**CANNOT**:
- ❌ Import from other `app/` subdirectories (use relative imports within same directory only)
- ❌ Be imported by `shared/` (violates boundary)

**Structure**:
```
app/
├── api/              # API routes (server-side)
├── components/       # React components (client/server)
├── registry/         # Page routes
├── code-query/       # Page routes
├── layout.tsx        # Root layout
├── page.tsx          # Home page
└── providers.tsx     # Client providers
```

### Bottom Level: `shared/` (Shared Code)
**Purpose**: Reusable utilities, hooks, types, config

**CAN**:
- ✅ Import from other `shared/` modules
- ✅ Import from external packages
- ✅ Import from workspace packages (`@mythic/*`)

**CANNOT**:
- ❌ Import from `app/` (violates boundary - creates circular dependency)
- ❌ Import Next.js-specific code (should be framework-agnostic when possible)

**Structure**:
```
shared/
├── config/          # Configuration (env + defaults)
├── hooks/           # React hooks (TanStack Query)
├── lib/             # Utilities (path resolution, etc.)
└── types/           # TypeScript types (Zod schemas)
```

## Import Rules

### ✅ CORRECT Patterns

```typescript
// app/ can import from shared/
// app/api/registry/route.ts
import { getRegistryFilePath } from "@/shared/lib/path-resolver"
import { FunctionRegistrySchema } from "@/shared/types/registry.types"

// app/registry/page.tsx
import { useRegistry } from "@/shared/hooks/use-registry"

// shared/ can import from other shared/
// shared/lib/path-resolver.ts
import { getRegistryConfig } from "../config/registry.config"

// shared/hooks/use-registry.ts
import type { FunctionRegistry } from "../types/registry.types"
```

### ❌ FORBIDDEN Patterns

```typescript
// ❌ shared/ CANNOT import from app/
// shared/hooks/use-registry.ts
import { something } from "@/app/components/..." // FORBIDDEN

// ❌ app/ should not import from other app/ subdirectories
// app/registry/page.tsx
import { Component } from "@/app/code-query/..." // Use relative or move to shared/
```

## Boundary Verification

### Current Status: ✅ COMPLIANT

**Checked**:
- ✅ `shared/` has NO imports from `app/`
- ✅ `app/` correctly imports from `shared/`
- ✅ No circular dependencies
- ✅ Clear separation of concerns

**Import Graph**:
```
app/
  └─→ shared/ (✅ Allowed)
      ├─→ config/
      ├─→ hooks/
      ├─→ lib/
      └─→ types/
```

## Enforcement

### TypeScript Path Aliases

```json
{
  "paths": {
    "@/*": ["./*"],           // Root (app/)
    "@/shared/*": ["./shared/*"],  // Shared code
    "@/app/*": ["./app/*"]    // Explicit app reference
  }
}
```

### Linting Rules (Future)

Should enforce:
- `shared/**` cannot import from `app/**`
- `app/**` can import from `shared/**`
- No relative imports across boundaries

## Migration Notes

If you need to share code between `app/` directories:
1. **Move to `shared/`** if it's reusable
2. **Use relative imports** if it's truly app-specific and co-located
3. **Create a package** if it's shared across multiple apps
