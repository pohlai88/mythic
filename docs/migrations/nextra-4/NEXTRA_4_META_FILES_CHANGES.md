# Nextra 4: \_meta Files Changes Guide

**Date**: 2025-01-27 **Status**: ✅ **Documented - Changes Verified**

**Reference**: Nextra 4 Migration Guide - Various Changes

---

## Overview

Nextra 4 introduces several changes to `_meta` files, including server component
requirements, zod parsing, deprecated fields removal, and a new `_meta.global`
file option.

---

## 1. Server Component Requirement ✅

### What Changed

**Nextra 4**: `_meta` files must be **server component files** without
`'use client'` directive.

### Current Implementation

**File**: `content/_meta.js`

**Status**: ✅ **CORRECT** - No `'use client'` directive found

```javascript
// ✅ Correct - Server component
export default {
  // ... meta configuration
}
```

**Verification**: ✅ **PASS** - No client directive found

---

## 2. Zod Parsing & Transformation ✅

### What Changed

**Nextra 4**: Zod now parses and transforms `_meta` files on the server to:

- Improve Developer Experience (DX)
- Avoid typos
- Provide better error messages

### Impact

**✅ Benefits**:

- Type validation at build time
- Better error messages for invalid configurations
- Automatic transformation of valid data

**⚠️ Action Required**: None - Automatic improvement

**Status**: ✅ **AUTOMATIC** - No code changes needed

---

## 3. Deprecated Fields Removed ⚠️

### Removed Fields

| Field                 | Status     | Replacement                |
| --------------------- | ---------- | -------------------------- |
| `newWindow`           | ❌ Removed | Automatic (external links) |
| `theme.topContent`    | ❌ Removed | Use layout components      |
| `theme.bottomContent` | ❌ Removed | Use layout components      |
| `theme.layout: 'raw'` | ❌ Removed | Use `page.{jsx,tsx}` files |

### Verification

**Search Results**:

```bash
# Check for deprecated fields
$ grep -r "newWindow\|topContent\|bottomContent\|layout.*raw" .
# Result: No matches found ✅
```

**Status**: ✅ **PASS** - No deprecated fields found

---

## 4. External Links Behavior ✅

### What Changed

**Nextra 4**: All external links declared in `_meta` files now:

- Open in a new tab automatically
- Include `rel="noreferrer"` attribute
- Display visual ↗ suffix icon

### Before (Nextra 3)

```javascript
export default {
  external: {
    type: "page",
    title: "External Link",
    href: "https://example.com",
    newWindow: true, // ❌ Removed in Nextra 4
  },
}
```

### After (Nextra 4)

```javascript
export default {
  external: {
    type: "page",
    title: "External Link",
    href: "https://example.com",
    // ✅ Automatically opens in new tab with rel="noreferrer" and ↗ icon
  },
}
```

**Status**: ✅ **AUTOMATIC** - No code changes needed

---

## 5. theme.layout: 'raw' Removal ⚠️

### What Changed

**Nextra 4**: `theme.layout: 'raw'` option removed.

### Replacement

**Instead of**:

```javascript
// ❌ NO LONGER SUPPORTED
export default {
  page: {
    type: "page",
    title: "Raw Page",
    theme: {
      layout: "raw", // ❌ Removed
    },
  },
}
```

**Use**:

```tsx
// ✅ Use page.{jsx,tsx} files instead
// app/page.tsx
export default function Page() {
  return <div>Raw page content</div>
}
```

**Status**: ✅ **NOT USED** - No migration needed

---

## 6. \_meta.global File (New Feature) ⚠️

### What Changed

**Nextra 4**: You can now define all pages in a single `_meta.global` file.

### Benefits

- ✅ **Single file** for all navigation
- ✅ **Easier maintenance** - One place to manage
- ✅ **Same API** as folder-specific \_meta files

### Example: Folder-Specific \_meta Files

**Structure**:

```
app/
├── _meta.js
└── docs/
    └── _meta.js
```

**app/\_meta.js**:

```javascript
export default {
  docs: {
    type: "page",
    title: "Documentation",
  },
}
```

**app/docs/\_meta.js**:

```javascript
export default {
  items: {
    index: "Getting Started",
  },
}
```

### Example: Single \_meta.global File

**Structure**:

```
app/
└── _meta.global.js
```

**app/\_meta.global.js**:

```javascript
export default {
  docs: {
    type: "page",
    title: "Documentation",
    items: {
      // ✅ Required for folder items
      index: "Getting Started",
    },
  },
}
```

### Important: API Difference

**Folder items must include `items` field** in `_meta.global`:

```javascript
// ✅ Correct - includes items field
export default {
  docs: {
    type: "page",
    title: "Documentation",
    items: {
      // ✅ Required
      index: "Getting Started",
    },
  },
}
```

### Warning

**⚠️ You can't use both `_meta.global` and `_meta` files together.**

Choose one approach:

- ✅ Use `_meta.global` for single-file navigation
- ✅ Use folder-specific `_meta` files for distributed navigation

**Status**: ⚠️ **NOT USED** - Current project uses folder-specific \_meta files

---

## Current Project Status ✅

### \_meta Files Found

**File**: `content/_meta.js`

**Status**: ✅ **VERIFIED**

```javascript
// ✅ Server component (no 'use client')
export default {
  // ... configuration
}
```

**Verification**:

- ✅ No `'use client'` directive
- ✅ No deprecated fields (`newWindow`, `topContent`, `bottomContent`,
  `layout: 'raw'`)
- ✅ Server component format

### App Router Usage

**Note**: This project uses **App Router** with `getPageMap()` API, which may
use different navigation mechanisms than `_meta` files.

**Current Navigation**:

- ✅ Using `getPageMap()` from `nextra/page-map`
- ✅ Page map generated from file structure
- ✅ `_meta` files may be used for additional metadata

**Status**: ✅ **COMPATIBLE** - No conflicts found

---

## Migration Checklist ✅

### Required Changes

- [x] ✅ Verify no `'use client'` in \_meta files
- [x] ✅ Remove `newWindow` field (if used)
- [x] ✅ Remove `theme.topContent` (if used)
- [x] ✅ Remove `theme.bottomContent` (if used)
- [x] ✅ Remove `theme.layout: 'raw'` (if used)
- [x] ✅ Update external links (automatic behavior)

### Optional Enhancements

- [ ] ⚠️ Consider migrating to `_meta.global` (if desired)
- [ ] ⚠️ Review external links (now auto-open in new tab)

---

## Verification Results ✅

### Code Search

```bash
# Check for 'use client' in _meta files
$ grep -r "use client" content/_meta.js
# Result: No matches ✅

# Check for deprecated fields
$ grep -r "newWindow\|topContent\|bottomContent\|layout.*raw" .
# Result: No matches ✅
```

**Status**: ✅ **PASS** - No deprecated patterns found

---

## Best Practices ✅

### ✅ Do

1. ✅ **Use server components** - No `'use client'` in \_meta files
2. ✅ **Let zod validate** - Automatic parsing and transformation
3. ✅ **Use external links** - Automatic new tab behavior
4. ✅ **Choose one approach** - Either `_meta.global` or folder-specific \_meta
   files

### ❌ Don't

1. ❌ **Don't use `'use client'`** in \_meta files
2. ❌ **Don't use `newWindow`** - Removed, automatic behavior
3. ❌ **Don't use `theme.topContent/bottomContent`** - Removed
4. ❌ **Don't use `theme.layout: 'raw'`** - Use `page.{jsx,tsx}` instead
5. ❌ **Don't mix** `_meta.global` and folder-specific \_meta files

---

## Summary

### ✅ Current Status

**Migration**: ✅ **COMPLETE** (no deprecated fields found)

1. ✅ **Server Components**: No `'use client'` found
2. ✅ **Zod Parsing**: Automatic (no action needed)
3. ✅ **Deprecated Fields**: None found
4. ✅ **External Links**: Automatic behavior
5. ✅ **Layout Raw**: Not used
6. ⚠️ **\_meta.global**: Not used (optional)

### 🎯 Implementation Quality

- ✅ **Compliant**: No deprecated patterns
- ✅ **Server Components**: Correct format
- ✅ **Best Practices**: Following Nextra 4 guidelines

---

## References

- Current implementation: `content/_meta.js`
- Nextra 4 Migration Guide
- App Router navigation: `app/layout.tsx` (uses `getPageMap()`)

---

**Last Updated**: 2025-01-27 **Status**: ✅ **COMPLIANT** - No deprecated
patterns found
