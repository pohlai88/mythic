# Nextra 4: Built-In Search Component Guide

**Date**: 2025-01-27 **Status**: ✅ **Implemented Correctly**

**Reference**: Nextra 4 Blog Theme Migration Guide

---

## Overview

Nextra 4 introduces built-in `<Search>` component support for both
`nextra-theme-docs` and `nextra-theme-blog`. This guide documents the
implementation and usage.

---

## Current Implementation ✅

### Docs Theme (Current Project)

**File**: `app/layout.tsx`

**Status**: ✅ **CORRECTLY IMPLEMENTED**

```tsx
import { Search } from 'nextra/components'
import { Navbar } from 'nextra-theme-docs'

<Navbar
  logo={...}
  projectLink="..."
>
  <Search />
  <ThemeSwitch />
</Navbar>
```

**Verification**: ✅ **PASS** - Using built-in Search component correctly

---

## Blog Theme (Reference Only)

**Note**: This project uses `nextra-theme-docs`, not `nextra-theme-blog`. The
following is for reference.

### Blog Theme Example

**File**: `app/layout.jsx` (blog theme)

```tsx
import { Footer, Layout, Navbar, ThemeSwitch } from "nextra-theme-blog"
import { Banner, Head, Search } from "nextra/components"
import { getPageMap } from "nextra/page-map"
import "nextra-theme-blog/style.css"

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head backgroundColor={{ dark: "#0f172a", light: "#fefce8" }} />
      <body>
        <Layout banner={banner}>
          <Navbar pageMap={await getPageMap()}>
            <Search />
            <ThemeSwitch />
          </Navbar>

          {children}

          <Footer>{new Date().getFullYear()} © Author.</Footer>
        </Layout>
      </body>
    </html>
  )
}
```

---

## Search Component Usage ✅

### Import

```tsx
import { Search } from "nextra/components"
```

### Placement

**✅ Correct**: Place as child of `<Navbar>`

```tsx
<Navbar>
  <Search />
  <ThemeSwitch />
</Navbar>
```

**❌ Incorrect**: Don't place outside Navbar

```tsx
// ❌ Wrong
<Layout>
  <Search /> {/* Don't do this */}
  <Navbar>...</Navbar>
</Layout>
```

---

## Search Setup Steps ✅

### 1. Install Pagefind (Already Done)

**Status**: ✅ **INSTALLED**

```json
{
  "devDependencies": {
    "pagefind": "^1.4.0"
  }
}
```

### 2. Configure Postbuild Script (Already Done)

**Status**: ✅ **CONFIGURED**

```json
{
  "scripts": {
    "postbuild": "pagefind --site .next/server/app --output-path public/_pagefind"
  }
}
```

### 3. Enable Pre/Post Scripts (Already Done)

**Status**: ✅ **CONFIGURED**

**File**: `.npmrc`

```
enable-pre-post-scripts=true
```

### 4. Add Search Component (Already Done)

**Status**: ✅ **IMPLEMENTED**

**File**: `app/layout.tsx`

```tsx
<Navbar>
  <Search />
  <ThemeSwitch />
</Navbar>
```

### 5. Configure Search Options (Optional)

**Status**: ⚠️ **OPTIONAL** - Can be enhanced

```tsx
<Search
  placeholder="Search documentation..."
  loading="Loading search..."
  errorText="Failed to load search results"
  emptyResult="No results found"
/>
```

**Current**: Using default props (works fine)

---

## Search Features ✅

### Built-In Features

1. ✅ **Full-text search** - Searches all content
2. ✅ **Code block search** - Configurable via `next.config.mjs`
3. ✅ **Remote MDX indexing** - Indexes remote GitHub content
4. ✅ **Dynamic content** - Indexes dynamic/async content
5. ✅ **Keyboard shortcut** - `Cmd/Ctrl + K` to open

### Configuration

**File**: `next.config.mjs`

```javascript
const withNextra = nextra({
  search: {
    codeblocks: false, // Set to true to enable code block search
  },
})
```

**Current**: ✅ **CONFIGURED** - Code blocks search disabled (can enable if
needed)

---

## Comparison: Docs vs Blog Theme

| Feature              | Docs Theme          | Blog Theme          | Status          |
| -------------------- | ------------------- | ------------------- | --------------- |
| **Search Component** | ✅ Supported        | ✅ Supported (v4)   | ✅ Both support |
| **Import Path**      | `nextra/components` | `nextra/components` | ✅ Same         |
| **Placement**        | Child of `<Navbar>` | Child of `<Navbar>` | ✅ Same         |
| **Pagefind**         | ✅ Required         | ✅ Required         | ✅ Same         |
| **Postbuild Script** | ✅ Required         | ✅ Required         | ✅ Same         |

---

## Migration from Nextra 3

### Docs Theme

**Nextra 3**: Search was always built-in **Nextra 4**: Same pattern, enhanced
with Pagefind

**Status**: ✅ **No migration needed** - Already using correct pattern

### Blog Theme

**Nextra 3**: No built-in search **Nextra 4**: Built-in search added

**Migration Steps** (for blog theme users):

1. Import `<Search>` from `nextra/components`
2. Add as child of `<Navbar>`
3. Follow search setup steps (Pagefind, postbuild script)

**Status**: ⚠️ **Not applicable** - This project uses docs theme

---

## Verification ✅

### Current Implementation

**File**: `app/layout.tsx`

```tsx
// ✅ Correct import
import { Search } from "nextra/components"

// ✅ Correct placement
;<Navbar>
  <Search />
  <ThemeSwitch />
</Navbar>
```

**Verification**: ✅ **PASS** - Implementation matches Nextra 4 pattern

### Search Setup

- ✅ Pagefind installed
- ✅ Postbuild script configured
- ✅ Pre/post scripts enabled
- ✅ Search component added
- ✅ Search configured in `next.config.mjs`

**Status**: ✅ **COMPLETE** - All setup steps done

---

## Optional Enhancements ⚠️

### 1. Custom Search Props

```tsx
<Search
  placeholder="Search documentation..."
  loading="Loading search..."
  errorText="Failed to load search results"
  emptyResult="No results found"
/>
```

**Current**: Using defaults (works fine)

### 2. Enable Code Block Search

**File**: `next.config.mjs`

```javascript
search: {
  codeblocks: true, // Enable code block search
}
```

**Current**: Disabled (can enable if needed)

### 3. i18n Search Labels

If using i18n, pass translated strings:

```tsx
<Search
  placeholder={dictionary.searchPlaceholder}
  loading={dictionary.searchLoading}
  errorText={dictionary.searchError}
  emptyResult={dictionary.searchEmptyResult}
/>
```

**Current**: Not using i18n (can add if needed)

---

## Best Practices ✅

### ✅ Do

1. ✅ **Import from `nextra/components`** - Correct import path
2. ✅ **Place as child of `<Navbar>`** - Correct placement
3. ✅ **Use Pagefind** - Required for search to work
4. ✅ **Configure postbuild script** - Required for indexing
5. ✅ **Enable pre/post scripts** - Required for postbuild

### ❌ Don't

1. ❌ **Don't place outside Navbar** - Won't work correctly
2. ❌ **Don't skip Pagefind setup** - Search won't work
3. ❌ **Don't forget postbuild script** - Index won't be generated
4. ❌ **Don't use old search patterns** - Use built-in component

---

## Summary

### ✅ Current Status

**Implementation**: ✅ **CORRECT**

1. ✅ **Search Component**: Imported from `nextra/components`
2. ✅ **Placement**: Child of `<Navbar>`
3. ✅ **Setup**: Pagefind configured
4. ✅ **Postbuild**: Script configured
5. ✅ **Configuration**: Search options configured

### 🎯 Implementation Quality

- ✅ **Pattern**: Matches Nextra 4 best practices
- ✅ **Setup**: All required steps completed
- ✅ **Functionality**: Search working correctly
- ✅ **Documentation**: Complete guide provided

---

## References

- Current implementation: `app/layout.tsx`
- Search setup: `PAGEFIND_SETUP_COMPLETE.md`
- Nextra 4 migration: `NEXTRA_4_COMPLETE_IMPLEMENTATION.md`

---

**Last Updated**: 2025-01-27 **Status**: ✅ **IMPLEMENTED CORRECTLY** - Using
built-in Search component
