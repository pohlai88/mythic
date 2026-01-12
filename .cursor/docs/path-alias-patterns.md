# Path Alias Patterns Reference

**Purpose**: Canonical reference for path alias patterns in the boardroom app  
**Last Updated**: 2026-01-10  
**Related**: `@rules/027_path-alias-enforcement.mdc`

---

## Quick Reference

### Path Alias Hierarchy (Most Specific to Least)

1. `@/src/lib/*` - Library modules (auth, audit, config, etc.)
2. `@/src/db/*` - Database modules (schema, queries, etc.)
3. `@/components/*` - React components
4. `@/app/*` - Next.js App Router (pages, actions, routes)
5. `@/` - Root (use sparingly, only for root-level files)

---

## Path Alias Configuration

**File**: `apps/boardroom/tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/app/*": ["./app/*"],
      "@/src/*": ["./src/*"]
    }
  }
}
```

---

## Import Patterns

### ✅ Correct Patterns

#### 1. Library Modules (Most Specific)

```typescript
// ✅ CORRECT - Use barrel exports
import { checkPermission, validateRBACResult } from '@/src/lib/auth'
import { createAuditEvent, getAuditTrail } from '@/src/lib/audit'
import { getUserConfig, validateConfig } from '@/src/lib/config'
import { encryptDocument, decryptDocument } from '@/src/lib/vault'
```

#### 2. Database Modules

```typescript
// ✅ CORRECT - Use schema barrel export
import { db } from '@/src/db'
import { proposals, circles } from '@/src/db/schema'
import type { Proposal, Circle } from '@/src/db/schema'
```

#### 3. Components

```typescript
// ✅ CORRECT - Use component alias
import { PoolTable } from '@/components/PoolTable'
import { GoldenThumb } from '@/components/GoldenThumb'
import { LoadingState } from '@/components/LoadingState'
```

#### 4. App Router

```typescript
// ✅ CORRECT - Use app alias
import { getProposals } from '@/app/actions/proposals'
import { getCurrentUserIdAction } from '@/app/actions/session'
```

#### 5. Type-Only Imports

```typescript
// ✅ CORRECT - Use import type for types
import type { Proposal } from '@/src/db/schema'
import type { UserConfig } from '@/src/lib/config'
import { getProposals } from '@/app/actions/proposals' // Value import
```

---

### ❌ Incorrect Patterns

#### 1. Relative Imports (BANNED)

```typescript
// ❌ INCORRECT - Relative imports banned
import { db } from '../db'
import { PoolTable } from '../../components/PoolTable'
import { getProposals } from '../../../app/actions/proposals'
import { checkPermission } from '../lib/auth'
```

**Fix**: Convert to path aliases using the hierarchy above.

#### 2. Direct File Imports When Barrel Exists

```typescript
// ❌ INCORRECT - Direct import when barrel exists
import { checkPermission } from '@/src/lib/auth/rbac-service'
import { createAuditEvent } from '@/src/lib/audit/audit-service'
```

**Fix**: Use barrel export instead:
```typescript
// ✅ CORRECT
import { checkPermission } from '@/src/lib/auth'
import { createAuditEvent } from '@/src/lib/audit'
```

#### 3. Ambiguous Root Alias

```typescript
// ❌ INCORRECT - Ambiguous root alias
import { env } from '@/lib/env' // Which lib? src/lib or root lib?
```

**Fix**: Use most specific alias:
```typescript
// ✅ CORRECT
import { env } from '@/src/lib/env'
```

#### 4. Mixing Types and Values

```typescript
// ❌ INCORRECT - Mixing types and values
import { Proposal, getProposals } from '@/src/db/schema' // Proposal is type-only
```

**Fix**: Separate type and value imports:
```typescript
// ✅ CORRECT
import type { Proposal } from '@/src/db/schema'
import { getProposals } from '@/app/actions/proposals'
```

---

## Barrel Export Files

### Available Barrel Exports

Always use these barrel exports instead of direct file imports:

| Barrel Import | Actual File | Exports |
|--------------|-------------|---------|
| `@/src/lib/auth` | `src/lib/auth/index.ts` | Auth services, RBAC, session |
| `@/src/lib/audit` | `src/lib/audit/index.ts` | Audit services, event tracking |
| `@/src/lib/config` | `src/lib/config/index.ts` | Config schemas, validation |
| `@/src/lib/frontend` | `src/lib/frontend/index.ts` | Frontend customization |
| `@/src/lib/realtime` | `src/lib/realtime/index.ts` | WebSocket services |
| `@/src/lib/vault` | `src/lib/vault/index.ts` | Encryption services |
| `@/src/db/schema` | `src/db/schema/index.ts` | All database schemas |
| `@/src/db` | `src/db/index.ts` | Database connection |

### Barrel Export Pattern

Barrel files use named exports for functions/services:

```typescript
// src/lib/auth/index.ts
export {
  checkPermission,
  validateRBACResult,
  type RBACResult,
} from './rbac-service'

export {
  getSession,
  createSession,
  type Session,
} from './session'
```

For schemas, use `export *`:

```typescript
// src/db/schema/index.ts
export * from './proposals'
export * from './circles'
export * from './thanos'
```

---

## Migration Guide

### Converting Relative Imports to Aliases

#### Step 1: Identify the Import

```typescript
// Before
import { db } from '../db'
```

#### Step 2: Determine the Correct Alias

1. Find the file being imported: `src/db/index.ts`
2. Check which alias category it belongs to: `@/src/db/*`
3. Remove the file path prefix: `db` → `@/src/db`

#### Step 3: Replace the Import

```typescript
// After
import { db } from '@/src/db'
```

### Common Migration Patterns

| Relative Path | Correct Alias | Notes |
|--------------|---------------|-------|
| `../db` | `@/src/db` | Database connection |
| `../../components/PoolTable` | `@/components/PoolTable` | Component |
| `../../../app/actions/proposals` | `@/app/actions/proposals` | App Router action |
| `../lib/auth` | `@/src/lib/auth` | Library module (use barrel) |
| `../schema/proposals` | `@/src/db/schema` | Schema (use barrel) |

---

## Common Mistakes and Fixes

### Mistake 1: Using Relative Paths

**Error**:
```typescript
import { PoolTable } from '../../components/PoolTable'
```

**Fix**:
```typescript
import { PoolTable } from '@/components/PoolTable'
```

### Mistake 2: Direct File Import When Barrel Exists

**Error**:
```typescript
import { checkPermission } from '@/src/lib/auth/rbac-service'
```

**Fix**:
```typescript
import { checkPermission } from '@/src/lib/auth'
```

### Mistake 3: Wrong Alias Level

**Error**:
```typescript
import { env } from '@/lib/env' // Ambiguous
```

**Fix**:
```typescript
import { env } from '@/src/lib/env' // Most specific
```

### Mistake 4: Not Using Barrel for Schemas

**Error**:
```typescript
import { proposals } from '@/src/db/schema/proposals'
```

**Fix**:
```typescript
import { proposals } from '@/src/db/schema' // Use barrel
```

---

## Validation

### Running Validation

```bash
# Validate all imports
pnpm validate:imports

# This will:
# - Check for relative imports (../, ./)
# - Verify alias usage
# - Report violations with suggestions
```

### Pre-commit Hook

The pre-commit hook automatically runs validation:

```bash
# Runs automatically on git commit
# Blocks commit if violations found
```

### CI/CD Integration

Add to GitHub Actions:

```yaml
- name: Validate imports
  run: pnpm validate:imports
```

---

## Examples

### Example 1: Component File

```typescript
// apps/boardroom/components/PoolTable.tsx
import { useBoardRoomStore } from '@/src/lib/stores/boardroom-store'
import type { Proposal } from '@/src/db/schema'
import { useToast } from '@mythic/design-system'
```

### Example 2: Server Action

```typescript
// apps/boardroom/app/actions/proposals.ts
import { db } from '@/src/db'
import { proposals } from '@/src/db/schema'
import { checkPermission } from '@/src/lib/auth'
import { createAuditEvent } from '@/src/lib/audit'
```

### Example 3: Client Component

```typescript
// apps/boardroom/app/boardroom/BoardRoomClient.tsx
import { PoolTable } from '@/components/PoolTable'
import { getCurrentUserIdAction } from '@/app/actions/session'
import { useBoardRoomStore } from '@/src/lib/stores/boardroom-store'
import { useProposals } from '@/src/lib/queries/proposals'
```

### Example 4: Library Module

```typescript
// apps/boardroom/src/lib/queries/proposals.ts
import { getProposals } from '@/app/actions/proposals'
import type { Proposal } from '@mythic/shared-types/boardroom'
```

---

## Exceptions

### Allowed Exceptions

1. **Config Files**: `next.config.mjs`, `tailwind.config.ts`, `drizzle.config.ts`
   - May use relative imports for internal config resolution

2. **Test Files**: `*.test.ts`, `*.spec.ts`
   - May use relative imports for test fixtures

3. **Legacy Code**: During migration period
   - Document exceptions with comments:
   ```typescript
   // EXCEPTION: Relative import allowed - Config file (see rule 9)
   import { getDatabaseConfig } from './src/lib/env'
   ```

---

## Best Practices

1. **Always use most specific alias available**
   - Prefer `@/src/lib/auth` over `@/lib/auth`

2. **Use barrel exports when available**
   - Prefer `@/src/lib/auth` over `@/src/lib/auth/rbac-service`

3. **Separate type and value imports**
   - Use `import type` for types
   - Use `import` for values

4. **Run validation before committing**
   - `pnpm validate:imports` catches violations early

5. **Check barrel files when creating new modules**
   - Add exports to appropriate barrel file
   - Use consistent export patterns

---

## Troubleshooting

### Issue: TypeScript can't resolve alias

**Solution**: Check `tsconfig.json` paths configuration matches file structure.

### Issue: Import works in IDE but fails at runtime

**Solution**: Ensure Next.js config includes path alias resolution (usually automatic).

### Issue: Circular dependency detected

**Solution**: Review import structure, use barrel exports to break cycles.

---

## Related Documentation

- **Rule**: `.cursor/rules/027_path-alias-enforcement.mdc` - Enforcement rules
- **Plan**: `.cursor/plans/PATH_ALIAS_CURSOR_MAINTENANCE.md` - Maintenance strategy
- **Validation**: `scripts/validate-imports.ts` - Validation script
- **Config**: `apps/boardroom/tsconfig.json` - Path alias configuration

---

**Last Updated**: 2026-01-10  
**Maintained By**: Cursor AI + Development Team