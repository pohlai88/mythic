# Root Route 404 Fix

## Issue
Getting `404 (Not Found)` when accessing `http://localhost:3000/`

## Root Cause
Path resolution in monorepo context can vary depending on where `next dev` is run from:
- If run from monorepo root: `process.cwd()` = monorepo root
- If run from `apps/docs`: `process.cwd()` = `apps/docs`

## Solution Applied
Added robust path resolution function `getContentDir()` that:
1. Tries monorepo path first: `join(cwd, 'apps/docs/content')`
2. Falls back to app directory path: `join(cwd, 'content')`
3. Uses `existsSync()` to verify path exists

## Files Modified
- `app/[[...mdxPath]]/page.tsx` - Added `getContentDir()` helper function

## Next Steps

### 1. Clear Next.js Cache
```bash
cd apps/docs
rm -rf .next
```

### 2. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
pnpm dev
```

### 3. Verify Root Route
Navigate to `http://localhost:3000/` - should now display `content/home.mdx`

## Alternative: If Still Not Working

If the issue persists, try running from the app directory:

```bash
cd apps/docs
pnpm dev
```

Instead of from the monorepo root.
