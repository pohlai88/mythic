# Root `src/` Directory Migration Plan

**Status**: ⚠️ CRITICAL VIOLATION | **Date**: 2026-01-13

---

## Problem Statement

**Root `src/` directory violates monorepo boundaries:**

1. ❌ **Boundary Violation**: Root should only have config files
2. ❌ **Duplicates**: `src/lib/utils.ts` duplicates `packages/NextJS/Shared-Utils/src/cn.ts`
3. ❌ **Orphans**: Code that doesn't belong anywhere
4. ❌ **Wrong Assumptions**: Scripts import from `../src/lib/` creating confusion

---

## Current Root `src/` Structure

```
src/
├── generated/              # Generated files (should be in .gitignore)
├── lib/
│   ├── utils.ts            # ❌ DUPLICATE of packages/NextJS/Shared-Utils/src/cn.ts
│   ├── logger.ts           # Pino logger (used by scripts)
│   ├── error-handler.ts    # Error handling (used by scripts)
│   ├── script-utils.ts     # Script utilities
│   ├── api-schemas/        # API schemas
│   │   ├── index.ts
│   │   └── patterns.ts
│   └── zod/                # Zod helpers
│       ├── helpers.ts
│       └── types.ts
```

---

## Migration Plan

### 1. Delete Duplicates

**`src/lib/utils.ts`** → ❌ **DELETE**
- **Reason**: Duplicate of `packages/NextJS/Shared-Utils/src/cn.ts`
- **Action**: Remove file, update imports to use `@mythic/shared-utils`

### 2. Move to `packages/NextJS/Shared-Utils/src/`

**`src/lib/error-handler.ts`** → `packages/NextJS/Shared-Utils/src/error-handler.ts`
- **Reason**: Shared utility used by scripts
- **Action**: Move, export from `packages/NextJS/Shared-Utils/src/index.ts`

**`src/lib/script-utils.ts`** → `packages/NextJS/Shared-Utils/src/script-utils.ts`
- **Reason**: Shared utility used by scripts
- **Action**: Move, export from `packages/NextJS/Shared-Utils/src/index.ts`

**`src/lib/zod/`** → `packages/NextJS/Shared-Utils/src/zod/`
- **Reason**: Zod helpers are shared utilities
- **Action**: Move directory, export from `packages/NextJS/Shared-Utils/src/index.ts`

### 3. Move to `packages/NodeJS/Monitoring/src/` OR Create `packages/script-utils/`

**`src/lib/logger.ts`** → Decision needed:
- **Option A**: `packages/NodeJS/Monitoring/src/logger.ts` (if compatible)
- **Option B**: `packages/script-utils/src/logger.ts` (new package)
- **Reason**: Logger used by scripts, but `packages/monitoring` has different logger
- **Action**: Compare loggers, decide on merge or separate package

### 4. Move to `packages/TypeScript/Shared-Types/src/`

**`src/lib/api-schemas/`** → `packages/TypeScript/Shared-Types/src/api-schemas/`
- **Reason**: API schemas are shared types
- **Action**: Move directory, export from `packages/TypeScript/Shared-Types/src/index.ts`

### 5. Handle Generated Files

**`src/generated/`** → `.gitignore` or `packages/*/generated/`
- **Reason**: Generated files shouldn't be in source
- **Action**: Add to `.gitignore` or move to appropriate package

---

## Import Updates Required

### Scripts (15 files need updates)

**Current**:
```typescript
import { createScriptLogger } from "../src/lib/logger"
import { handleFatalError } from "../src/lib/script-utils"
import { apiSchemas } from "../src/lib/api-schemas"
```

**After Migration**:
```typescript
import { createScriptLogger } from "@mythic/nextjs-shared-utils"
import { handleFatalError } from "@mythic/nextjs-shared-utils"
import { apiSchemas } from "@mythic/shared-types/api-schemas"
```

**Files to Update**:
- `scripts/validate-zod-schemas.ts`
- `scripts/validate-tech-debt.ts`
- `scripts/migrate-zod-imports.ts`
- `scripts/generate-type-docs.ts`
- `scripts/generate-meta.ts`
- `scripts/generate-meta-with-deps.ts`
- `scripts/generate-living-schema.ts`
- `scripts/generate-function-docs.ts`
- `scripts/generate-docs-watch.ts`
- `scripts/generate-component-docs.ts`
- `scripts/generate-api-docs.ts`
- `scripts/generate-all-docs.ts`
- `scripts/elite-gate.ts`

---

## Migration Steps

### Step 1: Analyze Dependencies

```bash
# Check what imports root src/
grep -r "from.*['\"]\.\.\/src" scripts/
grep -r "from.*['\"]@\/src" .
```

### Step 2: Move Files

```bash
# Move to packages/shared-utils
mv src/lib/error-handler.ts packages/NextJS/Shared-Utils/src/
mv src/lib/script-utils.ts packages/NextJS/Shared-Utils/src/
mv src/lib/zod packages/NextJS/Shared-Utils/src/

# Move to packages/shared-types
mv src/lib/api-schemas packages/TypeScript/Shared-Types/src/

# Handle logger (decision needed)
# Option A: packages/NodeJS/Monitoring/src/logger.ts
# Option B: packages/script-utils/src/logger.ts
```

### Step 3: Update Exports

**`packages/NextJS/Shared-Utils/src/index.ts`**:
```typescript
export { cn } from "./cn"
export * from "./error-handler"
export * from "./script-utils"
export * from "./zod/helpers"
export * from "./zod/types"
```

**`packages/TypeScript/Shared-Types/src/index.ts`**:
```typescript
export * from "./api-schemas"
```

### Step 4: Update Script Imports

Replace all `../src/lib/` imports with workspace packages:
- `@mythic/shared-utils`
- `@mythic/shared-types`

### Step 5: Delete Root `src/`

```bash
# After all files moved and imports updated
rm -rf src/
```

### Step 6: Update `.gitignore`

```bash
# Add generated files
echo "**/generated/" >> .gitignore
```

---

## Validation

After migration, verify:

1. ✅ No `src/` at root
2. ✅ All scripts use workspace packages
3. ✅ No duplicate utilities
4. ✅ All imports resolve correctly
5. ✅ Build passes: `pnpm build`

---

## Impact Assessment

### Files Affected
- **15 scripts** need import updates
- **6 files** need to be moved
- **1 duplicate** needs deletion

### Risk Level
- **Low**: Scripts only (not production code)
- **Reversible**: Git history preserves old structure

---

**Status**: ⚠️ Action Required
**Priority**: HIGH (boundary violation)
**Last Updated**: 2026-01-13
