# Nextra 4: API & Component Changes Guide

**Date**: 2025-01-27
**Status**: ✅ **Documented - Changes Verified**

**Reference**: Nextra 4 Migration Guide - Various API Changes

---

## Overview

Nextra 4 introduces several API changes, component renames, and improvements. This guide documents all changes and verifies current implementation.

---

## 0. Next.js & TypeScript Requirements ✅

### Next.js Version Requirement

**Nextra 4 requires**: Next.js >= 14

**Current Status**: ✅ **COMPLIANT**

**File**: `package.json`
```json
{
  "dependencies": {
    "next": "^16.1.1"  // ✅ >= 14
  }
}
```

**Verification**: ✅ **PASS** - Meets requirement

### TypeScript Configuration Requirement

**Nextra 4 requires**: `moduleResolution: "bundler"` in `tsconfig.json`

**Reason**: `typesVersions` fields from Nextra packages were removed. TypeScript needs `bundler` resolution.

**Current Status**: ✅ **COMPLIANT**

**File**: `tsconfig.json`
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"  // ✅ Already configured
  }
}
```

**Verification**: ✅ **PASS** - No type errors

**Migration Note**: If you had `moduleResolution: "node"`, you would see:
```
Type error: Cannot find module 'nextra/components' or its corresponding type declarations.
```

**Solution**: Change to `moduleResolution: "bundler"`

---

## 1. Code Block Icons Changes ✅

### What Changed

**Nextra 4**: You can now customize icons for code blocks using `withIcons` HOC.

### How It Works

**Import**:
```tsx
import { Pre, withIcons } from 'nextra/components'
```

**Usage**:
```tsx
const docsComponents = getDocsMDXComponents({
  pre: withIcons(Pre, { js: MyCustomIcon })
})
```

### Icons Updates

1. **JSX/TSX Icons**: Now display React icon
2. **Diff Icons**: Automatically match file extension from `filename` attribute

### Current Implementation

**File**: `mdx-components.tsx`

**Status**: ⚠️ **NOT CONFIGURED** - Using defaults

**Current**:
```tsx
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

const docsComponents = getDocsMDXComponents()
```

**Optional Enhancement**: Can add custom icons:

```tsx
import { Pre, withIcons } from 'nextra/components'
import { MyCustomIcon } from './icons'

const docsComponents = getDocsMDXComponents({
  pre: withIcons(Pre, { js: MyCustomIcon, ts: MyCustomIcon })
})
```

**Status**: ⚠️ **OPTIONAL** - Default icons work fine

---

## 2. Markdown Links Changes ✅

### What Changed

**Nextra 4**: All external Markdown links in MDX files now:
- Open in new tab automatically
- Include `rel="noreferrer"` attribute
- Display visual ↗ suffix icon

### Example

**MDX File**:
```mdx
[dimaMachina](https://github.com/dimaMachina)
```

**Compiled HTML**:
```html
<a href="https://github.com/dimaMachina" target="_blank" rel="noreferrer">
  dimaMachina&thinsp;
  <LinkArrowIcon height="16" className="_inline _align-baseline" />
</a>
```

### Current Implementation

**Status**: ✅ **AUTOMATIC** - Works automatically for all external links

**Verification**: ✅ **PASS** - No action needed

---

## 3. ::selection Styles ✅

### What Changed

**Nextra 4**: `::selection` styles now use primary color from `color` prop on `<Head>` component.

### Current Implementation

**File**: `app/layout.tsx`

**Status**: ⚠️ **NOT CONFIGURED** - Using default selection color

**Current**:
```tsx
<Head backgroundColor={{ dark: '#0f172a', light: '#fefce8' }} />
```

**Optional Enhancement**: Can add `color` prop:

```tsx
<Head
  backgroundColor={{ dark: '#0f172a', light: '#fefce8' }}
  color={{
    hue: { dark: 120, light: 0 },
    saturation: { dark: 100, light: 100 }
  }}
/>
```

**Status**: ⚠️ **OPTIONAL** - Default selection color works fine

---

## 4. Table Component Changes ⚠️

### What Changed

**Nextra 4**: `<Th>`, `<Tr>`, and `<Td>` components removed and attached to `<Table>`.

### Migration

**Before (Nextra 3)**:
```tsx
import { Table, Th, Tr, Td } from 'nextra/components'

<Table>
  <thead>
    <Tr>
      <Th>Items</Th>
    </Tr>
  </thead>
</Table>
```

**After (Nextra 4)**:
```tsx
import { Table } from 'nextra/components'

<Table>
  <thead>
    <Table.Tr>
      <Table.Th>Items</Table.Th>
    </Table.Tr>
  </thead>
</Table>
```

### Current Implementation

**File**: `components/table.tsx`

**Status**: ✅ **CUSTOM COMPONENT** - Using custom Table implementation

**Current**:
```tsx
// Custom Table component with Table.Th, Table.Tr, Table.Td
export const Table = {
  Head: TableHead,
  Body: TableBody,
  Tr: TableRow,
  Th: TableHeader,
  Td: TableCell,
}
```

**Verification**: ✅ **PASS** - Custom component already uses correct pattern

**Note**: If using Nextra's Table component, would need to migrate to `Table.Th`, `Table.Tr`, `Table.Td`.

---

## 5. compileMdx Changes ⚠️

### What Changed

**Nextra 4**: `compileMdx` now returns `Promise<string>` instead of `Promise<object>`.

### Migration

**Before (Nextra 3)**:
```tsx
const { result: rawJs } = await compileMdx(rawMdx)
```

**After (Nextra 4)**:
```tsx
const rawJs = await compileMdx(rawMdx)
```

### Current Implementation

**File**: `app/remote/graphql-eslint/[[...slug]]/page.tsx`

**Status**: ✅ **CORRECT** - Already using new API

**Current**:
```tsx
const rawJs = await compileMdx(data, { filePath })
```

**Verification**: ✅ **PASS** - Using correct API

---

## 6. RemoteContent → MDXRemote Changes ⚠️

### What Changed

**Nextra 4**:
- `<RemoteContent>` renamed to `<MDXRemote>`
- Moved from `nextra/components` to `nextra/mdx-remote`
- No longer need to manually pass default components

### Migration

**Before (Nextra 3)**:
```tsx
import { RemoteContent } from 'nextra/components'

<RemoteContent
  compiledSource={...}
  components={{ ...defaultComponents, ...customComponents }}
/>
```

**After (Nextra 4)**:
```tsx
import { MDXRemote } from 'nextra/mdx-remote'

<MDXRemote
  compiledSource={...}
  components={{ ...customComponents }}
  // Default components automatically provided from mdx-components.jsx
/>
```

### Current Implementation

**File**: `lib/mdx-remote.tsx`

**Status**: ⚠️ **USING OLD API** - Uses `next-mdx-remote` directly

**Current**:
```tsx
import { MDXRemote } from 'next-mdx-remote'

export function serializeMDX(content: string) {
  return serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  })
}
```

**Note**: This is a custom implementation using `next-mdx-remote` directly, not Nextra's `MDXRemote`. This is fine for custom use cases.

**For Remote Docs**: Using `evaluate()` from `nextra/evaluate` which is correct.

**Status**: ✅ **PASS** - Remote docs use correct API (`evaluate`)

---

## 7. Optimized Imports ✅

### What Changed

**Nextra 4**: Imports from `nextra/components`, `nextra-theme-docs`, and `nextra-theme-blog` are now optimized internally with Next.js' `optimizePackageImports` option.

### Impact

**✅ Benefits**:
- Improved bundle size
- Better tree-shaking
- Faster builds

**Status**: ✅ **AUTOMATIC** - No action needed

---

## 8. useRouter Removed ⚠️

### What Changed

**Nextra 4**: Nextra's `useRouter` hook removed. Use Next.js' `useRouter` instead.

### Migration

**Before (Nextra 3)**:
```tsx
import { useRouter } from 'nextra/hooks'
```

**After (Nextra 4)**:
```tsx
import { useRouter } from 'next/navigation'
```

### Current Implementation

**Search Results**: No usage of `nextra/hooks` or `nextra` useRouter found

**Status**: ✅ **PASS** - No migration needed

---

## Verification Results ✅

### Code Search

```bash
# Check for old Table imports
$ grep -r "import.*Th.*Tr.*Td.*from.*nextra" .
# Result: No matches ✅

# Check for old useRouter
$ grep -r "from 'nextra/hooks'" .
# Result: No matches ✅

# Check for RemoteContent
$ grep -r "RemoteContent" .
# Result: No matches ✅

# Check for compileMdx usage
$ grep -r "compileMdx" app/
# Result: Found in remote docs pages ✅
```

**Status**: ✅ **PASS** - No deprecated patterns found

---

## Migration Checklist ✅

### Required Changes

- [x] ✅ Verify no `Th`, `Tr`, `Td` imports from `nextra/components`
- [x] ✅ Verify no `useRouter` from `nextra/hooks`
- [x] ✅ Verify no `RemoteContent` usage
- [x] ✅ Verify `compileMdx` returns `Promise<string>`

### Optional Enhancements

- [ ] ⚠️ Add custom code block icons with `withIcons`
- [ ] ⚠️ Add `color` prop to `<Head>` for selection styles
- [ ] ⚠️ Migrate to Nextra's `MDXRemote` (if using custom remote MDX)

---

## Best Practices ✅

### ✅ Do

1. ✅ **Use `Table.Th`, `Table.Tr`, `Table.Td`** - New pattern
2. ✅ **Use Next.js `useRouter`** - From `next/navigation`
3. ✅ **Use `compileMdx` directly** - Returns `Promise<string>`
4. ✅ **Use `MDXRemote` from `nextra/mdx-remote`** - If needed

### ❌ Don't

1. ❌ **Don't use** `Th`, `Tr`, `Td` as separate imports
2. ❌ **Don't use** `useRouter` from `nextra/hooks`
3. ❌ **Don't use** `RemoteContent` (renamed to `MDXRemote`)
4. ❌ **Don't destructure** `compileMdx` result (returns string directly)

---

## Summary

### ✅ Current Status

**Migration**: ✅ **COMPLETE** (no deprecated patterns found)

1. ✅ **Table Components**: Custom implementation (correct pattern)
2. ✅ **useRouter**: Not used (no migration needed)
3. ✅ **compileMdx**: Using correct API
4. ✅ **MDXRemote**: Not using (custom implementation)
5. ⚠️ **Code Block Icons**: Not configured (optional)
6. ⚠️ **Selection Styles**: Not configured (optional)

### 🎯 Implementation Quality

- ✅ **Compliant**: No deprecated patterns found
- ✅ **Best Practices**: Following Nextra 4 guidelines
- ✅ **Optional Features**: Available but not required

---

## References

- Current implementation: `app/layout.tsx`, `mdx-components.tsx`
- Remote docs: `app/remote/` directory
- Custom components: `components/` directory
- Nextra 4 Migration Guide

---

**Last Updated**: 2025-01-27
**Status**: ✅ **COMPLIANT** - All required changes verified
