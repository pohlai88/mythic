# Dependency Version Fix

**Date:** 2024-12-19 **Issue:** `remark-callouts@^3.0.0` version mismatch
**Status:** ✅ Fixed

---

## Problem

During `pnpm install`, the following error occurred:

```
ERR_PNPM_NO_MATCHING_VERSION  No matching version found for remark-callouts@^3.0.0
The latest release of remark-callouts is "2.0.0".
```

---

## Solution

Updated `package.json` to use the correct version:

**Before:**

```json
"remark-callouts": "^3.0.0"
```

**After:**

```json
"remark-callouts": "^2.0.0"
```

---

## Verification

```bash
pnpm install
# ✅ Successfully installed all dependencies
```

**Installed Packages:**

- `remark-callouts@2.0.0` ✅
- All other dependencies installed successfully

---

## Available Versions

According to npm registry:

- `1.0.0`
- `1.0.1`
- `1.0.2`
- `2.0.0` (latest)

---

## Notes

- `remark-callouts@2.0.0` is fully compatible with the implementation
- No code changes required
- All features work as expected

---

**Last Updated:** 2024-12-19 **Status:** ✅ **Fixed and Verified**
