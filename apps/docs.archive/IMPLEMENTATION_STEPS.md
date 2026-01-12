# React Version Fix - Implementation Steps

## ✅ Configuration Files Updated

All configuration files have been updated:
- ✅ `apps/docs/next.config.mjs` - Added React aliases to Turbopack
- ✅ `apps/docs/package.json` - Fixed swagger-ui-react version (^5.31.0)
- ✅ `.npmrc` - Added React hoisting patterns

## 🚀 Implementation Steps

### Step 1: Clean Dependencies

**From monorepo root**, run:

```bash
# Remove root node_modules and lock file
rm -rf node_modules
rm -rf pnpm-lock.yaml

# Remove app-level node_modules
rm -rf apps/docs/node_modules
rm -rf apps/boardroom/node_modules

# Remove package-level node_modules
rm -rf packages/*/node_modules
```

**Or use PowerShell (Windows):**
```powershell
# From monorepo root
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force pnpm-lock.yaml -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\docs\node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\boardroom\node_modules -ErrorAction SilentlyContinue
Get-ChildItem -Path packages -Directory | ForEach-Object { Remove-Item -Recurse -Force "$($_.FullName)\node_modules" -ErrorAction SilentlyContinue }
```

### Step 2: Reinstall Dependencies

**From monorepo root**, run:

```bash
pnpm install
```

This will:
- Install all dependencies with new hoisting configuration
- Hoist React packages to root node_modules
- Ensure single React instance across all packages

### Step 3: Clear Next.js Cache

**From apps/docs directory**, run:

```bash
cd apps/docs
rm -rf .next
```

**Or PowerShell:**
```powershell
cd apps\docs
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

### Step 4: Verify React Installation

**Check that React is hoisted to root:**

```bash
# From monorepo root
ls node_modules/react
ls node_modules/react-dom
```

**Or PowerShell:**
```powershell
Test-Path node_modules\react
Test-Path node_modules\react-dom
```

Both should return `True` - React should be in root node_modules, not in app/package node_modules.

### Step 5: Start Dev Server

**From apps/docs directory**, run:

```bash
cd apps/docs
pnpm dev
```

### Step 6: Verify Fix

1. **Open browser**: Navigate to `http://localhost:3000/`
2. **Check console**: Should NOT see React version mismatch errors
3. **Test routes**: Navigate to different pages to ensure everything works

## 🔍 Verification Checklist

- [ ] Dependencies reinstalled successfully
- [ ] React is in root `node_modules` (not in apps/docs/node_modules)
- [ ] `.next` cache cleared
- [ ] Dev server starts without errors
- [ ] No React version mismatch errors in browser console
- [ ] Root route (`/`) loads correctly
- [ ] Other routes work correctly

## 🐛 Troubleshooting

### If React errors persist:

1. **Check pnpm-lock.yaml**: Ensure it was regenerated
   ```bash
   ls -la pnpm-lock.yaml
   ```

2. **Verify hoisting**: Check `.npmrc` has the hoisting patterns
   ```bash
   cat .npmrc
   ```

3. **Check Turbopack config**: Verify React aliases are in `next.config.mjs`
   ```bash
   grep -A 5 "turbopack:" apps/docs/next.config.mjs
   ```

4. **Force reinstall**:
   ```bash
   pnpm install --force
   ```

### If swagger-ui-react errors:

1. **Verify version**: Check `apps/docs/package.json` has `^5.31.0`
2. **Reinstall**: `pnpm install` from root

## 📝 Summary

After completing these steps:
- ✅ Single React instance across monorepo
- ✅ Turbopack resolves React correctly
- ✅ All packages use same React version
- ✅ No version mismatch errors

---

**Status**: Ready for implementation
**Next**: Follow steps 1-6 above
