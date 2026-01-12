# React Version Mismatch Fix - Turbopack Edition

## Issue
Runtime error: "A React Element from an older version of React was rendered"

This occurs when multiple React instances exist in the monorepo, causing version conflicts.

## Root Cause

The previous fix attempted to use `require.resolve()` in Turbopack's `resolveAlias`, but this doesn't work correctly with Turbopack. Turbopack handles module resolution differently than Webpack.

## Fixes Applied

### 1. Removed React Aliases from Turbopack Config
**File**: `apps/docs/next.config.mjs`

**Changed**: Removed the `require.resolve()` calls for React in Turbopack's `resolveAlias`. These don't work correctly with Turbopack and can cause resolution issues.

**Why**: Turbopack automatically uses pnpm's hoisted React instance when hoisting is properly configured. Manual aliases are unnecessary and can cause conflicts.

### 2. Verified pnpm Hoisting Configuration
**File**: `.npmrc`

**Status**: ✅ Already configured correctly
- `public-hoist-pattern[]=*react*` - Hoists all React packages
- `public-hoist-pattern[]=*react-dom*` - Hoists react-dom
- `public-hoist-pattern[]=*react/jsx-runtime*` - Hoists JSX runtime
- `public-hoist-pattern[]=*react/jsx-dev-runtime*` - Hoists JSX dev runtime

### 3. Verified pnpm Overrides
**File**: `package.json` (root)

**Status**: ✅ Already configured correctly
```json
"pnpm": {
  "overrides": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

## Next Steps (REQUIRED)

### Step 1: Clean Dependencies

**From monorepo root**, run:

```powershell
# Remove root node_modules and lock file
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force pnpm-lock.yaml -ErrorAction SilentlyContinue

# Remove app-level node_modules
Remove-Item -Recurse -Force apps\docs\node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\boardroom\node_modules -ErrorAction SilentlyContinue

# Remove package-level node_modules
Get-ChildItem -Path packages -Directory | ForEach-Object {
    Remove-Item -Recurse -Force "$($_.FullName)\node_modules" -ErrorAction SilentlyContinue
}
```

### Step 2: Reinstall Dependencies

**From monorepo root**, run:

```powershell
pnpm install
```

This will:
- Install all dependencies with hoisting configuration
- Hoist React packages to root `node_modules`
- Ensure single React instance across all packages
- Apply pnpm overrides to force React 18.3.1

### Step 3: Clear Next.js Cache

**From apps/docs directory**, run:

```powershell
cd apps\docs
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

### Step 4: Verify React Installation

**Check that React is hoisted to root:**

```powershell
# From monorepo root
Test-Path node_modules\react
Test-Path node_modules\react-dom
```

Both should return `True` - React should be in root `node_modules`, NOT in `apps/docs/node_modules` or `packages/*/node_modules`.

### Step 5: Start Dev Server

**From apps/docs directory**, run:

```powershell
cd apps\docs
pnpm dev
```

The error should now be resolved.

## Why This Works

1. **pnpm Hoisting**: The `public-hoist-pattern` in `.npmrc` ensures all React packages are hoisted to the root `node_modules`, creating a single React instance.

2. **pnpm Overrides**: The `overrides` in root `package.json` force all packages (including dependencies) to use React 18.3.1, preventing version conflicts.

3. **Turbopack Auto-Resolution**: Turbopack automatically resolves React from the hoisted location. Manual aliases are unnecessary and can cause issues.

4. **No Manual Aliases Needed**: Unlike Webpack, Turbopack doesn't need manual React aliases when hoisting is properly configured.

## Verification Checklist

After completing the steps above, verify:

- ✅ No React version mismatch errors in console
- ✅ Single React instance in `node_modules/react` (root)
- ✅ No React in `apps/docs/node_modules` or `packages/*/node_modules`
- ✅ Dev server starts without errors
- ✅ Pages render correctly

## Troubleshooting

### If error persists after reinstall:

1. **Check React versions**:
   ```powershell
   pnpm list react --depth=0
   ```

2. **Verify hoisting worked**:
   ```powershell
   # Should exist
   Test-Path node_modules\react

   # Should NOT exist
   Test-Path apps\docs\node_modules\react
   ```

3. **Clear all caches**:
   ```powershell
   # Next.js cache
   Remove-Item -Recurse -Force apps\docs\.next

   # Turbo cache
   Remove-Item -Recurse -Force .turbo

   # pnpm store (if needed)
   pnpm store prune
   ```

4. **Reinstall with clean slate**:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force pnpm-lock.yaml
   pnpm install
   ```

## Related Files

- `apps/docs/next.config.mjs` - Next.js configuration (Turbopack config updated)
- `.npmrc` - pnpm hoisting configuration
- `package.json` - pnpm overrides for React versions

## Notes

- This fix is specific to **Next.js 16.1.1 with Turbopack**
- The approach differs from Webpack-based solutions
- Turbopack handles module resolution automatically when hoisting is configured
- Manual React aliases in Turbopack can cause conflicts and should be avoided
