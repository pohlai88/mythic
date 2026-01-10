# Nextra 4: Pagefind Search Engine Migration

**Status**: ✅ Migrated and Configured
**Date**: 2025-01-27

## Overview

Nextra 4 migrates from **FlexSearch** (JavaScript) to **Pagefind** (Rust-powered) search engine. Pagefind provides significantly faster search and superior results.

## What Changed

### ❌ Removed: FlexSearch

- FlexSearch is no longer used in Nextra 4
- All FlexSearch configurations are deprecated

### ✅ New: Pagefind

- **Rust-powered** search engine
- **Faster** than FlexSearch
- **Better search results**
- **More features** (see below)

## Benefits of Pagefind

### 1. ⚡ Performance

- **Faster indexing**: Rust-based indexing is significantly faster
- **Faster search**: Near-instant search results
- **Lower memory usage**: More efficient than JavaScript-based search

### 2. 🎯 Better Results

- **Superior search quality**: Better relevance ranking
- **Fuzzy matching**: Handles typos and variations
- **Context-aware**: Better understanding of content

### 3. 🚀 Advanced Features

Pagefind can index content that FlexSearch couldn't:

- ✅ **Remote MDX content** (async components)
- ✅ **Dynamic content** (computed values)
- ✅ **Imported JavaScript/MDX files**
- ✅ **Static pages** (with `data-pagefind-body`)

## Current Configuration

### ✅ Search Configuration

**next.config.mjs**:
```javascript
const withNextra = nextra({
  search: {
    codeblocks: false, // Set to true to enable code block search
  },
})
```

### ✅ Search Component

**app/layout.tsx**:
```tsx
import { Search } from 'nextra/components'

<Navbar>
  <Search />
  <ThemeSwitch />
</Navbar>
```

**No additional configuration needed** - Pagefind works automatically!

## Pagefind Features

### 1. Indexing Remote MDX Content

Pagefind can index content from async components:

**Example: `content/example.mdx`**
```mdx
import { Callout } from 'nextra/components'

export async function Stars() {
  const response = await fetch('https://api.github.com/repos/shuding/nextra')
  const repo = await response.json()
  const stars = repo.stargazers_count
  return <b>{stars}</b>
}

export async function getUpdatedAt() {
  const response = await fetch('https://api.github.com/repos/shuding/nextra')
  const repo = await response.json()
  const updatedAt = repo.updated_at
  return new Date(updatedAt).toLocaleDateString()
}

<Callout emoji="🏆">
  {/* Stars count will be indexed 🎉 */}
  Nextra has <Stars /> stars on GitHub!

  {/* Last update time will be indexed 🎉 */}
  Last repository update _{await getUpdatedAt()}_.
</Callout>
```

**Result**: Both `Stars` and `getUpdatedAt()` content will be indexed and searchable!

### 2. Indexing Dynamic Content

Pagefind indexes dynamic content written in Markdown/MDX:

**Example: `content/copyright.mdx`**
```mdx
{/* Current year will be indexed 🎉 */}
MIT {new Date().getFullYear()} © Nextra.
```

**Result**: The current year value will be indexed and searchable!

### 3. Indexing Imported Files

Pagefind can index content from imported JavaScript or MDX files:

**File: `components/reused-js-component.js`**
```javascript
export function ReusedJsComponent() {
  return <strong>My content will be indexed</strong>
}
```

**File: `components/reused-mdx-component.mdx`**
```mdx
**My content will be indexed as well**
```

**File: `content/page.mdx`**
```mdx
import { ReusedJsComponent } from '../components/reused-js-component.js'
import ReusedMdxComponent from '../components/reused-mdx-component.mdx'

<ReusedJsComponent />
<ReusedMdxComponent />
```

**Result**: Content from both imported files will be indexed!

### 4. Indexing Static Pages

For JavaScript/TypeScript pages, add `data-pagefind-body` attribute:

**Example: `app/about/page.tsx`**
```tsx
export default function AboutPage() {
  return (
    // All content of tags with `data-pagefind-body` attribute will be indexed
    <ul data-pagefind-body>
      <li>Nextra 4 is the best MDX Next.js library</li>
      {/* Except for tags with `data-pagefind-ignore` attribute */}
      <li data-pagefind-ignore>Nextra 3 is the best MDX Next.js library</li>
    </ul>
  )
}
```

**Result**: Content inside `data-pagefind-body` will be indexed, but content with `data-pagefind-ignore` will be excluded.

### 5. Ignoring Content

Use `data-pagefind-ignore` to exclude content from search:

**Example:**
```mdx
<div data-pagefind-body>
  <p>This will be indexed</p>
  <nav data-pagefind-ignore>
    <a href="/">Navigation links won't be indexed</a>
  </nav>
</div>
```

## Configuration Options

### Search Configuration

**next.config.mjs**:
```javascript
const withNextra = nextra({
  search: {
    codeblocks: false, // Enable/disable code block search
  },
})
```

**Options**:
- `codeblocks: true` - Include code blocks in search
- `codeblocks: false` - Exclude code blocks from search (default)

### MDX Pages (Automatic)

**No configuration needed** for MDX pages when using `nextra-theme-docs` or `nextra-theme-blog` - Pagefind automatically indexes MDX content!

### Static Pages (Manual)

Add `data-pagefind-body` to the main content area:

```tsx
export default function Page() {
  return (
    <main data-pagefind-body>
      {/* Content will be indexed */}
    </main>
  )
}
```

## Migration from FlexSearch

### If You Had FlexSearch Configuration

**Old (Nextra 3)**:
```javascript
// No longer needed - FlexSearch was automatic
```

**New (Nextra 4)**:
```javascript
// Pagefind is automatic - just configure search options
const withNextra = nextra({
  search: {
    codeblocks: false,
  },
})
```

### No Code Changes Needed

- ✅ Search component works the same: `<Search />`
- ✅ No API changes
- ✅ Better results automatically
- ✅ More content indexed automatically

## Examples

### Example 1: Dynamic Copyright

**File: `content/copyright.mdx`**
```mdx
---
title: 'Copyright'
---

MIT {new Date().getFullYear()} © Nextra.

{/* The year will be indexed and searchable! */}
```

### Example 2: API Data

**File: `content/stats.mdx`**
```mdx
---
title: 'Statistics'
---

export async function RepoStats() {
  const res = await fetch('https://api.github.com/repos/shuding/nextra')
  const data = await res.json()
  return (
    <div>
      <p>Stars: {data.stargazers_count}</p>
      <p>Forks: {data.forks_count}</p>
    </div>
  )
}

<RepoStats />

{/* All stats will be indexed! */}
```

### Example 3: Imported Components

**File: `components/feature-list.tsx`**
```tsx
export function FeatureList() {
  return (
    <ul>
      <li>Fast search</li>
      <li>Better results</li>
      <li>Indexes dynamic content</li>
    </ul>
  )
}
```

**File: `content/features.mdx`**
```mdx
import { FeatureList } from '../components/feature-list'

<FeatureList />

{/* Feature list content will be indexed! */}
```

### Example 4: Excluding Navigation

**File: `app/about/page.tsx`**
```tsx
export default function AboutPage() {
  return (
    <div>
      <nav data-pagefind-ignore>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>

      <main data-pagefind-body>
        <h1>About Us</h1>
        <p>This content will be indexed.</p>
      </main>
    </div>
  )
}
```

## Best Practices

### 1. Use `data-pagefind-body` for Static Pages

Always wrap main content in a tag with `data-pagefind-body`:

```tsx
<main data-pagefind-body>
  {/* Main content */}
</main>
```

### 2. Exclude Navigation and UI Elements

Use `data-pagefind-ignore` for navigation, headers, footers:

```tsx
<nav data-pagefind-ignore>
  {/* Navigation won't be indexed */}
</nav>
```

### 3. Enable Code Block Search When Needed

If you want code blocks searchable:

```javascript
search: {
  codeblocks: true, // Enable code block search
}
```

### 4. Leverage Dynamic Content Indexing

Use async components for dynamic content - Pagefind will index it automatically!

## Troubleshooting

### Search Not Working

**Check**:
1. `<Search />` component is in `app/layout.tsx`
2. Search configuration in `next.config.mjs`
3. Build completes successfully (Pagefind indexes during build)

**Solution**: Run `pnpm build` to regenerate search index

### Content Not Indexed

**For MDX pages**:
- ✅ Automatic - no action needed
- ✅ Works with imported components
- ✅ Works with dynamic content

**For static pages**:
- ⚠️ Must add `data-pagefind-body` attribute
- ⚠️ Content without attribute won't be indexed

**Solution**: Add `data-pagefind-body` to main content area

### Code Blocks Not Searchable

**Check**: `codeblocks` setting in `next.config.mjs`

**Solution**: Set `codeblocks: true` to enable code block search

## Performance Comparison

### FlexSearch (Old)

- ⚠️ JavaScript-based (slower)
- ⚠️ Limited indexing capabilities
- ⚠️ Couldn't index remote/dynamic content

### Pagefind (New)

- ✅ Rust-based (faster)
- ✅ Superior indexing capabilities
- ✅ Indexes remote/dynamic content
- ✅ Better search results

## References

- [Nextra 4 Migration Guide](https://the-guild.dev/blog/nextra-4)
- [Pagefind Documentation](https://pagefind.app/)
- Current configuration: `next.config.mjs`
- Search component: `app/layout.tsx`

## Summary

✅ **Migration Complete**: Pagefind is configured and working
✅ **Better Performance**: Faster search than FlexSearch
✅ **More Features**: Indexes remote/dynamic content
✅ **No Breaking Changes**: Search component works the same

**Status**: ✅ Production Ready

---

**Last Updated**: 2025-01-27
**Next Review**: After Pagefind updates
