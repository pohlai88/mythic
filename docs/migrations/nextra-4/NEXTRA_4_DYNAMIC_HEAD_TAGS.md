# Nextra 4: Dynamic Head Tags Migration Guide

**Date**: 2025-01-27 **Status**: ✅ **Migrated - Using Next.js Metadata API**

**Reference**:
[Next.js Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)

---

## Overview

Nextra 4 migrates from the `head` theme config option to **Next.js Metadata
API** for dynamic `<head>` tags. This provides better SEO, type safety, and
integration with Next.js App Router.

---

## What Changed

### ❌ Removed in Nextra 4

**Nextra 3** (deprecated):

```javascript
// ❌ NO LONGER SUPPORTED
const withNextra = nextra({
  themeConfig: {
    head: (
      <>
        <title>My Site</title>
        <meta name="description" content="..." />
      </>
    ),
  },
})
```

### ✅ New Approach in Nextra 4

**Nextra 4** (current):

```tsx
// ✅ Use Next.js Metadata API
export const metadata = {
  title: {
    default: "NexusCanon Documentation",
    template: "%s | NexusCanon",
  },
  description: "Comprehensive governance and documentation",
  openGraph: {
    url: "https://nexuscanon.dev",
    siteName: "NexusCanon",
    locale: "en_US",
    type: "website",
  },
}
```

---

## Current Implementation ✅

### Root Layout Metadata

**File**: `app/layout.tsx`

**Status**: ✅ **FULLY MIGRATED**

```tsx
export const metadata = {
  title: {
    default: "NexusCanon Documentation",
    template: "%s | NexusCanon",
  },
  description: "Comprehensive governance and documentation powered by Nextra",
  keywords: [
    "documentation",
    "nextra",
    "next.js",
    "mdx",
    "governance",
    "nexuscanon",
  ],
  authors: [{ name: "NexusCanon" }],
  openGraph: {
    title: "NexusCanon Documentation",
    description: "Comprehensive governance and documentation powered by Nextra",
    type: "website",
    images: ["/og-image.png"],
    url: "https://nexuscanon.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusCanon Documentation",
    description: "Comprehensive governance and documentation powered by Nextra",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#000000",
}
```

**Verification**: ✅ **PASS** - Using Next.js Metadata API correctly

---

## MDX Front Matter Metadata ✅

### How It Works

Nextra 4 automatically extracts metadata from MDX front matter:

**MDX File** (`app/page.mdx`):

```mdx
---
title: Hello Nextra 4
description: Make beautiful websites with Next.js & MDX.
---

# Hello Nextra 4
```

**Generated HTML**:

```html
<head>
  <title>Hello Nextra 4 | NexusCanon</title>
  <meta property="og:title" content="Hello Nextra 4 | NexusCanon" />
  <meta
    name="description"
    content="Make beautiful websites with Next.js &amp; MDX."
  />
  <meta
    property="og:description"
    content="Make beautiful websites with Next.js &amp; MDX."
  />
</head>
```

### Current Implementation

**File**: `app/[[...mdxPath]]/page.tsx`

**Status**: ✅ **USING NEXTRA'S IMPORT PAGE API**

```tsx
export async function generateMetadata(props: {
  params: Promise<{ mdxPath?: string[] }>
}) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}
```

**How It Works**:

1. Nextra's `importPage()` extracts front matter from MDX
2. Front matter `title` → `<title>` and `<meta property="og:title">`
3. Front matter `description` → `<meta name="description">` and
   `<meta property="og:description">`
4. First `<h1>` heading used if no `title` in front matter

**Verification**: ✅ **PASS** - Using Nextra's metadata extraction

---

## Example MDX Files ✅

### Page File Convention Example

**File**: `app/docs/page-file-convention/page.mdx`

```mdx
---
title: "Page File Convention Documentation"
description: "Complete guide to using Page File Convention in Nextra v4"
---

# Page File Convention Guide
```

**Generated Metadata**:

- `<title>`: "Page File Convention Documentation | NexusCanon"
- `<meta name="description">`: "Complete guide to using Page File Convention in
  Nextra v4"
- `<meta property="og:title">`: "Page File Convention Documentation |
  NexusCanon"
- `<meta property="og:description">`: "Complete guide to using Page File
  Convention in Nextra v4"

**Verification**: ✅ **PASS** - Front matter correctly formatted

---

## Metadata API Features ✅

### Static Metadata

**Current Usage**: ✅ Root layout uses static metadata

```tsx
export const metadata: Metadata = {
  title: { default: '...', template: '...' },
  description: '...',
  openGraph: { ... },
  twitter: { ... },
}
```

### Dynamic Metadata

**Current Usage**: ✅ MDX pages use dynamic metadata via `generateMetadata`

```tsx
export async function generateMetadata({ params }) {
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}
```

### Metadata Template

**Current Usage**: ✅ Title template configured

```tsx
title: {
  default: 'NexusCanon Documentation',
  template: '%s | NexusCanon'  // ✅ Template for page-specific titles
}
```

---

## Head Component ✅

### Nextra's Head Component

**Current Usage**: ✅ Using Nextra's `<Head>` component for theme-specific head
tags

**File**: `app/layout.tsx`

```tsx
import { Head } from "nextra/components"

;<Head backgroundColor={{ dark: "#0f172a", light: "#fefce8" }} />
```

**Purpose**:

- Theme-specific head tags (background colors, etc.)
- Complements Next.js Metadata API
- Not for general metadata (use Metadata API instead)

**Verification**: ✅ **PASS** - Correct usage

---

## Migration Checklist ✅

### Required Migrations

- [x] ✅ Removed `head` from theme config (if existed)
- [x] ✅ Added `metadata` export to root layout
- [x] ✅ Configured title template
- [x] ✅ Added Open Graph metadata
- [x] ✅ Added Twitter Card metadata
- [x] ✅ Added favicon/icons metadata
- [x] ✅ Using `generateMetadata` for MDX pages
- [x] ✅ MDX front matter includes `title` and `description`

### Optional Enhancements

- [ ] ⚠️ Add `opengraph-image.jpg` for static OG images
- [ ] ⚠️ Add `opengraph-image.tsx` for dynamic OG images
- [ ] ⚠️ Add `favicon.ico` file (if not present)
- [ ] ⚠️ Add `apple-icon.jpg` for Apple touch icons
- [ ] ⚠️ Add `icon.jpg` for additional icon formats

---

## Verification Results ✅

### Code Search

```bash
# Check for old head config
$ grep -r "head:" next.config.mjs theme.config.tsx
# Result: No matches ✅

# Check for Metadata API usage
$ grep -r "export const metadata" app/
# Result: Found in app/layout.tsx ✅

# Check for generateMetadata usage
$ grep -r "generateMetadata" app/
# Result: Found in app/[[...mdxPath]]/page.tsx ✅
```

**Status**: ✅ **PASS** - No deprecated patterns found

---

## Best Practices ✅

### ✅ Do

1. ✅ **Use Metadata API** for all metadata
2. ✅ **Use front matter** in MDX files for page-specific metadata
3. ✅ **Use title template** for consistent titles
4. ✅ **Use generateMetadata** for dynamic metadata
5. ✅ **Use Head component** only for theme-specific tags

### ❌ Don't

1. ❌ **Don't use** `head` theme config option
2. ❌ **Don't manually** add `<head>` tags in components
3. ❌ **Don't duplicate** metadata in multiple places
4. ❌ **Don't forget** front matter in MDX files

---

## MDX Front Matter Format ✅

### Required Fields (Optional but Recommended)

```yaml
---
title: "Page Title" # Sets <title> and og:title
description: "Page description" # Sets meta description and og:description
---
```

### Optional Fields

```yaml
---
title: "Page Title"
description: "Page description"
author: "Author Name"
date: "2025-01-27"
tags: ["tag1", "tag2"]
---
```

**Note**: Nextra extracts `title` and `description` automatically. Other fields
may be used by custom components.

---

## Comparison: Nextra 3 vs Nextra 4

| Feature            | Nextra 3               | Nextra 4                    | Status        |
| ------------------ | ---------------------- | --------------------------- | ------------- |
| **Head Config**    | `head` in theme.config | Removed                     | ✅ Migrated   |
| **Metadata**       | Manual `<head>` tags   | Metadata API                | ✅ Migrated   |
| **Title Template** | Manual                 | `metadata.title.template`   | ✅ Configured |
| **OG Tags**        | Manual                 | `metadata.openGraph`        | ✅ Configured |
| **MDX Metadata**   | Front matter           | Front matter + Metadata API | ✅ Working    |
| **Type Safety**    | None                   | TypeScript types            | ✅ Enhanced   |

---

## Summary

### ✅ Current Status

**Migration**: ✅ **COMPLETE**

1. ✅ **Root Layout**: Using Next.js Metadata API
2. ✅ **MDX Pages**: Using `generateMetadata` with Nextra's `importPage`
3. ✅ **Front Matter**: Correctly formatted in MDX files
4. ✅ **Head Component**: Used only for theme-specific tags
5. ✅ **No Deprecated Patterns**: No `head` config found

### 🎯 Implementation Quality

- ✅ **Type Safety**: TypeScript types for Metadata
- ✅ **SEO Optimized**: Complete Open Graph and Twitter Card metadata
- ✅ **Template Support**: Title template for consistent branding
- ✅ **Dynamic Metadata**: Support for page-specific metadata
- ✅ **Best Practices**: Following Next.js and Nextra 4 guidelines

---

## References

- [Next.js Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Nextra 4 Migration Guide](https://the-guild.dev/blog/nextra-4)
- Current implementation: `app/layout.tsx`
- MDX metadata: `app/[[...mdxPath]]/page.tsx`

---

**Last Updated**: 2025-01-27 **Status**: ✅ **FULLY MIGRATED** - Using Next.js
Metadata API
