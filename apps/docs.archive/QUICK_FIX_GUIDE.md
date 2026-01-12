# Quick Fix Guide - React Version Mismatch

## ✅ All Configuration Files Updated

The following files have been automatically updated:
- ✅ `apps/docs/next.config.mjs` - React aliases added to Turbopack
- ✅ `apps/docs/package.json` - swagger-ui-react version fixed (^5.31.0)
- ✅ `.npmrc` - React hoisting patterns added
- ✅ `apps/docs/.next` - Cache cleared

## 🚀 Quick Implementation (3 Steps)

### Step 1: Clean Dependencies

**Option A: Use the cleanup script (Recommended)**
```bash
# From monorepo root
# Windows PowerShell:
.\scripts\fix-react-version.ps1

# Linux/Mac:
chmod +x scripts/fix-react-version.sh
./scripts/fix-react-version.sh
```

**Option B: Manual cleanup**
```bash
# From monorepo root
rm -rf node_modules pnpm-lock.yaml
rm -rf apps/*/node_modules packages/*/node_modules
```

### Step 2: Reinstall Dependencies

```bash
# From monorepo root
pnpm install
```

This will:
- Install all dependencies with new hoisting configuration
- Hoist React packages to root node_modules
- Ensure single React instance across all packages

### Step 3: Start Dev Server

```bash
cd apps/docs
pnpm dev
```

## ✅ Verification

After starting the dev server:
1. Open `http://localhost:3000/`
2. Check browser console - should NOT see React version mismatch errors
3. Navigate to different pages - everything should work

## 🔍 What Was Fixed

### 1. Turbopack React Aliases
Added React resolution aliases to Turbopack config to ensure single React instance:
```javascript
turbopack: {
  resolveAlias: {
    'react': require.resolve('react'),
    'react-dom': require.resolve('react-dom'),
    'react/jsx-runtime': require.resolve('react/jsx-runtime'),
    'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
  },
}
```

### 2. Dependency Version Sync
Fixed `swagger-ui-react` version mismatch:
- Before: `^5.17.14` (in apps/docs)
- After: `^5.31.0` (matches root)

### 3. Hoisting Configuration
Added to `.npmrc`:
```
public-hoist-pattern[]=*react*
public-hoist-pattern[]=*react-dom*
public-hoist-pattern[]=*react/jsx-runtime*
public-hoist-pattern[]=*react/jsx-dev-runtime*
```

This ensures React is hoisted to root `node_modules` instead of being duplicated in each package.

## 🐛 Troubleshooting

### If errors persist after pnpm install:

1. **Verify hoisting worked**:
   ```bash
   # React should be in root, not in apps/docs/node_modules
   ls node_modules/react
   ls node_modules/react-dom
   ```

2. **Check pnpm-lock.yaml was regenerated**:
   ```bash
   ls -la pnpm-lock.yaml
   ```

3. **Force reinstall**:
   ```bash
   pnpm install --force
   ```

4. **Verify config files**:
   - Check `.npmrc` has hoisting patterns
   - Check `apps/docs/next.config.mjs` has Turbopack React aliases
   - Check `apps/docs/package.json` has correct swagger-ui-react version

## 📊 Expected Results

After completing the steps:
- ✅ Single React instance in `node_modules/react` (root)
- ✅ No React in `apps/docs/node_modules`
- ✅ No React version mismatch errors in console
- ✅ All routes work correctly
- ✅ Dev server runs without errors

---

**Status**: Ready to implement
**Time Required**: ~5-10 minutes (mostly pnpm install)
