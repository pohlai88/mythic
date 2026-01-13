# src/ Directory Boundary Rule

**Status**: ✅ MANDATORY | **Version**: 1.0.0 | **Date**: 2026-01-13

---

## Rule: No `src/` in Apps

### ✅ CORRECT Structure

```
apps/
├── StratonHub/          # ✅ NO src/ directory
│   ├── app/            # Next.js App Router
│   ├── components/      # App-specific components
│   ├── lib/            # App-specific utilities
│   ├── hooks/          # App-specific hooks
│   └── store/          # App-specific state
│
└── boardroom/          # ❌ VIOLATION: Has src/ directory
    ├── app/            # Next.js App Router
    ├── src/            # ❌ WRONG: Creates confusion
    │   ├── db/         # Should be at root or in packages/
    │   ├── lib/        # Should be at root or in packages/
    │   └── codex/      # Should be at root or in packages/
    └── components/      # App-specific components

packages/
├── shared-utils/        # ✅ CORRECT: Uses src/
│   └── src/
│       └── index.ts
└── design-system/      # ✅ CORRECT: Uses src/
    └── src/
        └── index.ts
```

---

## Why No `src/` in Apps?

### 1. **Next.js Convention**
- Next.js App Router expects `app/` at root or `src/app/`
- Using `src/` for non-app code creates confusion
- Files should be at app root or in `packages/`

### 2. **Clear Boundaries**
- **`packages/`** = Shared code (uses `src/`)
- **`apps/`** = App-specific code (NO `src/`, files at root)
- **No ambiguity** about where files belong

### 3. **Prevents Wrong Assumptions**
- `src/` suggests package structure
- Creates confusion: "Is this shared or app-specific?"
- Violates monorepo boundary rules

---

## Enforcement

### ✅ ALLOWED

```
apps/my-app/
├── app/              # Next.js App Router
├── components/       # App-specific
├── lib/             # App-specific
├── hooks/           # App-specific
└── store/           # App-specific
```

### ❌ FORBIDDEN

```
apps/my-app/
├── app/
├── src/              # ❌ FORBIDDEN in apps
│   ├── db/
│   ├── lib/
│   └── utils/
└── components/
```

### ✅ PACKAGES (Different Rule)

```
packages/my-package/
└── src/              # ✅ REQUIRED for packages
    └── index.ts
```

---

## Migration Path

If an app has `src/`, decide:

1. **App-specific code** → Move to app root
   ```bash
   apps/boardroom/src/lib/ → apps/boardroom/lib/
   apps/boardroom/src/db/ → apps/boardroom/db/
   ```

2. **Shared code** → Move to `packages/`
   ```bash
   apps/boardroom/src/lib/shared-utils/ → packages/NextJS/Shared-Utils/src/
   ```

---

## Current Violations

### ❌ **ROOT `src/`** (CRITICAL)

**Location**: `C:\AI-BOS\mythic\src/`

**Contents**:
- `src/lib/utils.ts` - ❌ DUPLICATE of `packages/NextJS/Shared-Utils/src/cn.ts`
- `src/lib/logger.ts` - Pino logger (should be in `packages/monitoring` or `packages/script-utils`)
- `src/lib/error-handler.ts` - Should be in `packages/shared-utils`
- `src/lib/script-utils.ts` - Should be in `packages/shared-utils`
- `src/lib/api-schemas/` - Should be in `packages/shared-types`
- `src/lib/zod/` - Should be in `packages/shared-utils`
- `src/generated/` - Generated files (should be in `.gitignore`)

**Problems**:
1. ❌ Boundary violation (root should only have configs)
2. ❌ Duplicates (`utils.ts` vs `cn.ts`)
3. ❌ Orphans (code doesn't belong anywhere)
4. ❌ Wrong assumptions (scripts import from `../src/lib/`)

**Action Required**: See `docs/architecture/ROOT_SRC_MIGRATION_PLAN.md`

### ❌ `apps/boardroom/src/`

**Contents**:
- `src/db/` - Database code (app-specific)
- `src/lib/` - Utilities (app-specific)
- `src/codex/` - Codex logic (app-specific)
- `src/__tests__/` - Tests (app-specific)

**Action Required**:
- Move `src/db/` → `db/` (at app root)
- Move `src/lib/` → `lib/` (at app root)
- Move `src/codex/` → `codex/` (at app root)
- Move `src/__tests__/` → `__tests__/` (at app root)

---

## Rule Summary

| Location | `src/` Allowed? | Reason |
|----------|----------------|--------|
| `apps/*/` | ❌ **NO** | Next.js convention, clear boundaries |
| `packages/*/` | ✅ **YES** | Standard package structure |

**Principle**: If it's in `apps/`, it's app-specific and belongs at root. If it's shared, it belongs in `packages/`.

---

**Status**: ✅ Enforced
**Last Updated**: 2026-01-13
