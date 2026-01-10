# Nextra v4: Page File Convention Implementation

## ✅ Implementation Complete

This document describes the **Page File Convention** implementation for Nextra v4, following the official migration guide.

## Overview

Nextra v4 supports two routing conventions:

1. **Content Directory Convention** (Currently Active)
   - Uses `content/` directory
   - Single catch-all route: `app/[[...mdxPath]]/page.tsx`
   - All MDX files in `content/` directory

2. **Page File Convention** (Implemented)
   - Uses `page.{md,mdx}` files in `app/` directory
   - Direct file-based routing
   - Better for colocation

**Both conventions can coexist!**

## File Structure

```
mythic/
├── app/
│   ├── [[...mdxPath]]/
│   │   └── page.tsx              ← Content Directory Convention (catch-all)
│   ├── example-page-convention/
│   │   └── page.mdx              ← Page File Convention example
│   ├── guides/
│   │   └── getting-started/
│   │       └── page.mdx          ← Page File Convention example
│   └── docs/
│       └── page-file-convention/
│           └── page.mdx          ← Page File Convention example
├── content/                       ← Content Directory Convention
│   ├── about.mdx
│   ├── governance/
│   └── ...
└── next.config.mjs
```

## Required: Metadata Export

**⚠️ Warning**: All `page.{jsx,tsx,md,mdx}` files **must** export metadata.

### Method 1: Frontmatter (MDX)

```yaml
---
title: 'Page Title'
description: 'Page description'
---
```

### Method 2: Export Statement (JSX/TSX)

```typescript
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
}
```

## Example Pages Created

### 1. `/example-page-convention`
- **File**: `app/example-page-convention/page.mdx`
- **Purpose**: Basic example of Page File Convention
- **Metadata**: Exported via frontmatter

### 2. `/guides/getting-started`
- **File**: `app/guides/getting-started/page.mdx`
- **Purpose**: Guide page using Page File Convention
- **Metadata**: Exported via frontmatter

### 3. `/docs/page-file-convention`
- **File**: `app/docs/page-file-convention/page.mdx`
- **Purpose**: Complete documentation of Page File Convention
- **Metadata**: Exported via frontmatter

## Benefits of Page File Convention

### ✅ Colocation
Keep assets with pages:

```
app/
└── guides/
    └── getting-started/
        ├── page.mdx
        ├── diagram.png          ← Colocated asset
        └── code-example.ts     ← Colocated code
```

### ✅ Faster Compilation
- Each page compiles independently
- No need to process all files at once
- Better for large projects

### ✅ Better Organization
- Organize by feature or section
- Clear file structure
- Easy to navigate

## Trade-offs Comparison

| Aspect | Page File Convention | Content Directory Convention |
|--------|---------------------|----------------------------|
| **Compilation** | ✅ Faster (per-page) | ⚠️ Slower (all files) |
| **Colocation** | ✅ Excellent | ❌ Limited |
| **Organization** | ✅ Flexible | ✅ Simple |
| **Setup** | ⚠️ More files | ✅ Single catch-all |
| **Hot Reload** | ✅ Works | ✅ Works |
| **Import Statements** | ✅ Works | ✅ Works |
| **Static Images** | ✅ Works | ✅ Works |

## When to Use Each Convention

### Use Page File Convention When:
- ✅ Complex pages with many assets
- ✅ Pages that need custom layouts
- ✅ Pages with specific routing needs
- ✅ Better organization for large projects
- ✅ Need faster compilation times

### Use Content Directory Convention When:
- ✅ Simple documentation sites
- ✅ Many similar pages
- ✅ Quick setup needed
- ✅ Content-focused sites

## Coexistence

**Both conventions work together!**

- Content Directory: Handles `content/` directory via catch-all route
- Page File Convention: Handles `app/**/page.mdx` files directly
- Nextra's `getPageMap()` automatically discovers both

## Official Examples

- [Nextra Website](https://nextra.site) - Uses Page File Convention
- [Nextra Blog Example](https://github.com/shuding/nextra/tree/main/examples/blog) - Page File Convention

## Verification

✅ All example pages created with metadata exports
✅ TypeScript validation passes
✅ Both conventions configured
✅ Layout supports both approaches

## Next Steps

1. **Test the pages**: Visit `/example-page-convention`, `/guides/getting-started`, `/docs/page-file-convention`
2. **Create new pages**: Use `app/your-route/page.mdx` format
3. **Export metadata**: Always include frontmatter with `title` and `description`
4. **Colocate assets**: Keep related files in the same directory

## Migration Path

If migrating from Content Directory to Page File Convention:

1. **Keep existing setup**: Content Directory continues to work
2. **Add new pages**: Use Page File Convention for new pages
3. **Gradually migrate**: Move pages as needed
4. **Both work**: No need to choose one or the other

---

**Status**: ✅ Page File Convention implemented and ready to use!
