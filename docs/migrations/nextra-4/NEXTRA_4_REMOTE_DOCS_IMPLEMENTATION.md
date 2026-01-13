# Nextra 4: Remote Docs Implementation Guide

**Status**: ✅ **Infrastructure Ready** **Date**: 2025-01-27

## Overview

Nextra 4 supports loading documentation from **remote GitHub repositories**.
This allows you to include external documentation in your site without
maintaining copies locally.

---

## Implementation Status

### ✅ Infrastructure Created

1. **Remote Docs Pages**
   - ✅ `app/remote/graphql-eslint/[[...slug]]/page.tsx` - GraphQL ESLint remote
     docs
   - ✅ `app/remote/graphql-yoga/[[...slug]]/page.tsx` - GraphQL Yoga remote
     docs

2. **Configuration Files**
   - ✅ `nextra-remote-filepaths/graphql-eslint.json` - GraphQL ESLint config
   - ✅ `nextra-remote-filepaths/graphql-yoga.json` - GraphQL Yoga config

3. **Layout Integration**
   - ✅ Layout updated with remote docs merging (commented out, ready to enable)
   - ✅ Page map merging logic prepared

---

## How Remote Docs Work

### Process Flow

1. **Configuration**: JSON file defines repo, branch, and file paths
2. **Page Map Generation**: `convertToPageMap()` creates page map from file
   paths
3. **Metadata Merging**: `mergeMetaWithPageMap()` adds sidebar metadata
4. **Content Fetching**: Fetches MDX from GitHub raw content
5. **Compilation**: `compileMdx()` compiles MDX to JavaScript
6. **Evaluation**: `evaluate()` renders with components
7. **Layout Merging**: Remote page maps merged into main page map

---

## File Structure

```
mythic/
├── app/
│   ├── layout.tsx                    ✅ Updated with remote docs support
│   └── remote/
│       ├── graphql-eslint/
│       │   └── [[...slug]]/
│       │       └── page.tsx          ✅ Remote docs page
│       └── graphql-yoga/
│           └── [[...slug]]/
│               └── page.tsx          ✅ Remote docs page
├── nextra-remote-filepaths/
│   ├── graphql-eslint.json           ✅ Repo configuration
│   └── graphql-yoga.json             ✅ Repo configuration
└── mdx-components.tsx                ✅ MDX components registry
```

---

## Configuration Files

### GraphQL ESLint Example

**File**: `nextra-remote-filepaths/graphql-eslint.json`

```json
{
  "user": "B2o5T",
  "repo": "graphql-eslint",
  "branch": "master",
  "docsPath": "docs/",
  "filePaths": [
    "README.md",
    "getting-started/index.md",
    "getting-started/parser-options.md",
    "getting-started/parser.md",
    "configs.md",
    "custom-rules.md"
  ]
}
```

### GraphQL Yoga Example

**File**: `nextra-remote-filepaths/graphql-yoga.json`

```json
{
  "user": "dotansimha",
  "repo": "graphql-yoga",
  "branch": "main",
  "docsPath": "website/src/pages/docs/",
  "filePaths": [
    "README.md",
    "getting-started/index.md",
    "api-reference/index.md"
  ]
}
```

---

## Remote Docs Page Structure

### Example: `app/remote/graphql-eslint/[[...slug]]/page.tsx`

```typescript
import { compileMdx } from 'nextra/compile'
import { evaluate } from 'nextra/evaluate'
import { convertToPageMap, mergeMetaWithPageMap, normalizePageMap } from 'nextra/page-map'
import { useMDXComponents } from '../../../../mdx-components'
import json from '../../../../nextra-remote-filepaths/graphql-eslint.json'

// Convert file paths to page map
const { mdxPages, pageMap } = convertToPageMap({
  filePaths: json.filePaths,
  basePath: 'remote/graphql-eslint',
})

// Merge metadata for sidebar
const eslintPageMap = mergeMetaWithPageMap(pageMap[0], {
  index: 'Introduction',
  'getting-started': { title: 'Getting Started' },
})

export const pageMap = normalizePageMap(eslintPageMap)

// Page component
export default async function Page({ params }) {
  const route = (await params).slug?.join('/') || ''
  const filePath = mdxPages[route]

  // Fetch from GitHub
  const response = await fetch(
    `https://raw.githubusercontent.com/${json.user}/${json.repo}/${json.branch}/${json.docsPath}${filePath}`
  )
  const data = await response.text()

  // Compile and evaluate
  const rawJs = await compileMdx(data, { filePath })
  const { default: MDXContent, toc, metadata } = evaluate(rawJs, components)

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent />
    </Wrapper>
  )
}
```

---

## Layout Integration

### Merging Remote Page Maps

**File**: `app/layout.tsx`

```typescript
import { pageMap as graphqlEslintPageMap } from './remote/graphql-eslint/[[...slug]]/page'
import { pageMap as graphqlYogaPageMap } from './remote/graphql-yoga/[[...slug]]/page'

export default async function RootLayout({ children }) {
  let pageMap = await getPageMap()

  // Merge remote docs into page map
  pageMap = [
    ...pageMap,
    {
      name: 'remote',
      route: '/remote',
      children: [graphqlEslintPageMap, graphqlYogaPageMap],
    },
  ]

  return (
    <Layout pageMap={pageMap}>
      {children}
    </Layout>
  )
}
```

**Current Status**: Code is prepared but commented out. Uncomment when ready to
enable remote docs.

---

## Adding New Remote Docs

### Step 1: Create Configuration File

**File**: `nextra-remote-filepaths/my-repo.json`

```json
{
  "user": "username",
  "repo": "repository-name",
  "branch": "main",
  "docsPath": "docs/",
  "filePaths": ["README.md", "getting-started.md", "api-reference.md"]
}
```

### Step 2: Create Remote Docs Page

**File**: `app/remote/my-repo/[[...slug]]/page.tsx`

```typescript
import { compileMdx } from 'nextra/compile'
import { evaluate } from 'nextra/evaluate'
import { convertToPageMap, mergeMetaWithPageMap, normalizePageMap } from 'nextra/page-map'
import { useMDXComponents } from '../../../../mdx-components'
import json from '../../../../nextra-remote-filepaths/my-repo.json'

const { mdxPages, pageMap: _pageMap } = convertToPageMap({
  filePaths: json.filePaths,
  basePath: 'remote/my-repo',
})

export const [myRepoPage] = _pageMap[0]?.children || []

const myRepoPageMap = mergeMetaWithPageMap(myRepoPage, {
  index: 'Introduction',
  // Add metadata for sidebar
})

export const pageMap = normalizePageMap(myRepoPageMap)

const { wrapper: Wrapper, ...components } = useMDXComponents({
  Callout,
  Tabs,
})

export default async function Page({ params }) {
  const route = (await params).slug?.join('/') || ''
  const filePath = mdxPages[route]

  if (!filePath) {
    notFound()
  }

  const response = await fetch(
    `https://raw.githubusercontent.com/${json.user}/${json.repo}/${json.branch}/${json.docsPath}${filePath}`
  )
  const data = await response.text()
  const rawJs = await compileMdx(data, { filePath })
  const { default: MDXContent, toc, metadata } = evaluate(rawJs, components)

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent />
    </Wrapper>
  )
}

export function generateStaticParams() {
  return Object.keys(mdxPages).map((route) => ({
    ...(route && { slug: route.split('/') }),
  }))
}
```

### Step 3: Update Layout

**File**: `app/layout.tsx`

```typescript
import { pageMap as myRepoPageMap } from "./remote/my-repo/[[...slug]]/page"

// In RootLayout:
pageMap = [
  ...pageMap,
  {
    name: "remote",
    route: "/remote",
    children: [
      // ... existing remote docs
      myRepoPageMap,
    ],
  },
]
```

---

## API Reference

### `convertToPageMap()`

Converts file paths to page map structure.

```typescript
const { mdxPages, pageMap } = convertToPageMap({
  filePaths: ["README.md", "docs/getting-started.md"],
  basePath: "remote/my-repo",
})
```

**Returns**:

- `mdxPages`: Object mapping routes to file paths
- `pageMap`: Page map structure for navigation

### `mergeMetaWithPageMap()`

Merges metadata with page map for sidebar navigation.

```typescript
const pageMapWithMeta = mergeMetaWithPageMap(pageMap, {
  index: "Introduction",
  "getting-started": {
    title: "Getting Started",
    items: {
      index: "Overview",
    },
  },
})
```

### `normalizePageMap()`

Normalizes page map structure.

```typescript
const normalizedPageMap = normalizePageMap(pageMapWithMeta)
```

### `compileMdx()`

Compiles MDX string to JavaScript.

```typescript
const rawJs = await compileMdx(mdxString, { filePath })
```

### `evaluate()`

Evaluates compiled MDX with components.

```typescript
const { default: MDXContent, toc, metadata } = evaluate(rawJs, components)
```

---

## Best Practices

### ✅ Do

- ✅ Use JSON config files for repo information
- ✅ Handle errors gracefully (notFound for missing files)
- ✅ Use `generateStaticParams()` for static generation
- ✅ Merge page maps in layout for sidebar navigation
- ✅ Use `useMDXComponents()` for consistent components

### ❌ Don't

- ❌ Hardcode GitHub URLs in components
- ❌ Skip error handling for fetch failures
- ❌ Forget to merge page maps in layout
- ❌ Use client components for remote docs
- ❌ Skip static params generation

---

## Troubleshooting

### Remote Docs Not Showing

**Problem**: Remote docs don't appear in sidebar

**Solutions**:

1. Check page map is exported from remote page
2. Verify layout merges remote page maps
3. Check configuration file paths are correct
4. Verify GitHub URLs are accessible

### Content Not Loading

**Problem**: Remote content fails to load

**Solutions**:

1. Check GitHub URL is correct
2. Verify branch exists
3. Check file paths in config match repo structure
4. Verify GitHub allows raw content access
5. Check network/firewall settings

### Build Errors

**Problem**: Build fails with remote docs

**Solutions**:

1. Check `generateStaticParams()` returns valid params
2. Verify all imports are correct
3. Check TypeScript types
4. Verify MDX compilation works

---

## Current Status

### ✅ Created

- ✅ Remote docs page structure
- ✅ Configuration files (examples)
- ✅ Layout integration code (commented, ready)
- ✅ Documentation

### ⚠️ Not Enabled

- ⚠️ Remote docs merging in layout (commented out)
- ⚠️ Requires uncommenting and customization

---

## Enabling Remote Docs

### Step 1: Uncomment Layout Code

**File**: `app/layout.tsx`

```typescript
// Uncomment these imports:
import { pageMap as graphqlEslintPageMap } from "./remote/graphql-eslint/[[...slug]]/page"
import { pageMap as graphqlYogaPageMap } from "./remote/graphql-yoga/[[...slug]]/page"

// Uncomment merging code in RootLayout
```

### Step 2: Customize Configuration

Update `nextra-remote-filepaths/*.json` files with your repos.

### Step 3: Test

```bash
pnpm build
# Check for errors
pnpm dev
# Test remote docs routes
```

---

## Example Routes

After enabling, these routes will be available:

- `/remote/graphql-eslint` - GraphQL ESLint docs
- `/remote/graphql-eslint/getting-started` - Getting started
- `/remote/graphql-yoga` - GraphQL Yoga docs
- `/remote/graphql-yoga/getting-started` - Getting started

---

## References

- [Nextra 4 Migration Guide](https://the-guild.dev/blog/nextra-4)
- [Nextra Remote Docs Example](https://github.com/shuding/nextra/tree/main/examples/swr-site)
- Current implementation: `app/remote/` directory

---

## Summary

✅ **Infrastructure Ready**: Remote docs pages and configs created ✅ **Layout
Integration**: Code prepared (commented, ready to enable) ✅ **Documentation**:
Complete guide provided ⚠️ **Not Enabled**: Requires uncommenting layout code

**Status**: ✅ **Ready to Enable** (when needed)

---

**Last Updated**: 2025-01-27 **Next Action**: Uncomment layout code when remote
docs needed
