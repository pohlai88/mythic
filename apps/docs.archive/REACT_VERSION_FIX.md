# React Version Mismatch Fix

## Issue
Runtime error: "A React Element from an older version of React was rendered"

## Root Causes

1. **Turbopack Missing React Aliases**: React resolution aliases were only in webpack config, but Turbopack is being used
2. **swagger-ui-react Version Mismatch**: App had `^5.17.14` while root had `^5.31.0`
3. **Missing Hoisting Configuration**: React packages not properly hoisted in monorepo

## Fixes Applied

### 1. Added React Aliases to Turbopack Config
**File**: `apps/docs/next.config.mjs`

```javascript
turbopack: {
  resolveAlias: {
    // ... existing aliases
    // Fix React version mismatch - ensure single React instance
    'react': require.resolve('react'),
    'react-dom': require.resolve('react-dom'),
    'react/jsx-runtime': require.resolve('react/jsx-runtime'),
    'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
  },
}
```

### 2. Fixed swagger-ui-react Version
**File**: `apps/docs/package.json`

Changed from `^5.17.14` to `^5.31.0` to match root package.json

### 3. Added Hoisting Configuration
**File**: `.npmrc`

Added public hoist patterns to ensure React packages are hoisted to root:
```
public-hoist-pattern[]=*react*
public-hoist-pattern[]=*react-dom*
public-hoist-pattern[]=*react/jsx-runtime*
public-hoist-pattern[]=*react/jsx-dev-runtime*
```

## Next Steps

### 1. Clean Install Dependencies
```bash
# Remove node_modules and lock file
rm -rf node_modules pnpm-lock.yaml
rm -rf apps/*/node_modules packages/*/node_modules

# Reinstall with new hoisting config
pnpm install
```

### 2. Clear Next.js Cache
```bash
cd apps/docs
rm -rf .next
```

### 3. Restart Dev Server
```bash
cd apps/docs
pnpm dev
```

## Verification

After applying fixes, verify:
1. ✅ No React version mismatch errors
2. ✅ Single React instance in node_modules (check root)
3. ✅ All packages resolve to same React version

## Why This Happens

In monorepos with pnpm:
- Each package can have its own node_modules
- Without hoisting, multiple React instances can exist
- Libraries like `swagger-ui-react` might bundle React
- Turbopack needs explicit aliases (unlike webpack which uses require.resolve automatically)

## Prevention

1. ✅ Use pnpm overrides in root package.json (already configured)
2. ✅ Use public-hoist-pattern for React packages (now added)
3. ✅ Configure both webpack AND Turbopack aliases (now fixed)
4. ✅ Keep dependency versions in sync across packages
