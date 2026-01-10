# Turbopack Support in Nextra 4

**Status**: ✅ Enabled and Configured
**Date**: 2025-01-27

## Overview

Nextra 4 finally supports **Turbopack**, the Rust-based incremental bundler that provides significantly faster development builds compared to Webpack.

## Current Configuration

### ✅ Turbopack Enabled

**package.json**:
```json
{
  "scripts": {
    "dev": "next dev --turbopack"
  }
}
```

**Status**: Turbopack is active when running `pnpm dev`

### ✅ Configuration Compatibility

**next.config.mjs**:
- ✅ Only JSON-serializable values passed to `nextra()`
- ✅ No custom plugins (functions) that would break Turbopack
- ✅ All configuration values are serializable

## Critical Warning: Plugin Limitations

### ⚠️ What You CANNOT Do with Turbopack

**DO NOT** add custom plugins as functions to `next.config.mjs`:

```javascript
// ❌ THIS WILL BREAK WITH TURBOPACK
const withNextra = nextra({
  mdxOptions: {
    remarkPlugins: [myRemarkPlugin],      // ❌ Function - NOT serializable
    rehypePlugins: [myRehypePlugin],      // ❌ Function - NOT serializable
    recmaPlugins: [myRecmaPlugin]         // ❌ Function - NOT serializable
  }
})
```

**Error you'll get**:
```
Error: loader nextra/loader for match "./{src/app,app}/**/page.{md,mdx}"
does not have serializable options.
Ensure that options passed are plain JavaScript objects and values.
```

### ✅ What You CAN Do with Turbopack

**All JSON-serializable values are supported**:

```javascript
// ✅ THIS WORKS WITH TURBOPACK
const withNextra = nextra({
  // Boolean values
  defaultShowCopyCode: true,
  readingTime: true,
  latex: true,

  // String values
  contentDirBasePath: '/',

  // Object values (with serializable properties)
  search: {
    codeblocks: false,
  },

  // Arrays of strings (not functions)
  // Note: Plugin arrays must be empty or contain only string references
})
```

## Switching Between Turbopack and Webpack

### Using Turbopack (Current - Recommended)

```json
{
  "scripts": {
    "dev": "next dev --turbopack"
  }
}
```

**Benefits**:
- ⚡ Faster incremental builds
- ⚡ Faster hot module replacement (HMR)
- ⚡ Better performance for large projects
- ⚡ Rust-based, more efficient

**Limitations**:
- ❌ Cannot use custom MDX plugins (functions)
- ❌ Only JSON-serializable configuration

### Using Webpack (Fallback)

If you need custom plugins:

```json
{
  "scripts": {
    "dev": "next dev"
  }
}
```

**Then you can add plugins**:

```javascript
// ✅ THIS WORKS WITH WEBPACK
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'

const withNextra = nextra({
  mdxOptions: {
    remarkPlugins: [remarkGfm],      // ✅ Works with Webpack
    rehypePlugins: [rehypePrism],    // ✅ Works with Webpack
  }
})
```

**Trade-offs**:
- ⚠️ Slower builds compared to Turbopack
- ✅ Full plugin support
- ✅ More flexible configuration

## Current Project Status

### ✅ Turbopack-Compatible Configuration

Our `next.config.mjs` is fully compatible with Turbopack:

```javascript
const withNextra = nextra({
  // All values are JSON-serializable
  contentDirBasePath: '/',
  defaultShowCopyCode: true,
  readingTime: true,
  latex: true,
  search: {
    codeblocks: false,
  },
  // No mdxOptions with custom plugins ✅
})
```

### ✅ MDX Features Available

Even without custom plugins, Nextra 4 provides many built-in features:

- ✅ **Math Support**: `latex: true` enables KaTeX rendering
- ✅ **Code Highlighting**: Built-in syntax highlighting
- ✅ **Reading Time**: Automatic reading time calculation
- ✅ **Copy Code**: Copy button for code blocks
- ✅ **Search**: Pagefind search integration
- ✅ **Custom Components**: MDX components work fine

### ⚠️ Remote MDX Note

The `lib/mdx-remote.tsx` file uses `next-mdx-remote` which has its own plugin configuration. This is **separate** from Nextra's configuration and doesn't affect Turbopack compatibility.

## Best Practices

### 1. Prefer Turbopack for Development

Use Turbopack by default for faster development experience:

```json
{
  "scripts": {
    "dev": "next dev --turbopack"
  }
}
```

### 2. Use Built-in Features

Leverage Nextra's built-in features instead of custom plugins when possible:

- ✅ `latex: true` for math support
- ✅ `readingTime: true` for reading time
- ✅ `defaultShowCopyCode: true` for code copying
- ✅ Built-in code highlighting

### 3. Custom Components Over Plugins

Instead of plugins, use custom MDX components:

```tsx
// ✅ Works with Turbopack
export function CustomComponent({ children }) {
  return <div className="custom">{children}</div>
}
```

### 4. Switch to Webpack Only When Needed

Only switch to Webpack if you absolutely need custom plugins:

1. Remove `--turbopack` flag
2. Add plugins to `next.config.mjs`
3. Document why Webpack is needed

## Performance Comparison

### Turbopack Benefits

- **Cold Start**: ~2-3x faster than Webpack
- **Incremental Builds**: ~5-10x faster than Webpack
- **Hot Module Replacement**: Near-instant updates
- **Memory Usage**: Lower memory footprint

### When Webpack Might Be Better

- Need custom MDX plugins
- Complex plugin configurations
- Legacy plugin dependencies

## Troubleshooting

### Error: "does not have serializable options"

**Cause**: Custom plugins (functions) in `next.config.mjs`

**Solution**:
1. Remove custom plugins from `next.config.mjs`
2. Use built-in Nextra features instead
3. Or switch to Webpack (remove `--turbopack` flag)

### Slow Development Builds

**Check**:
- Is `--turbopack` flag present in dev script?
- Are there any custom plugins breaking Turbopack?

**Solution**:
- Ensure `--turbopack` is enabled
- Remove any non-serializable configuration

## Migration Guide

### From Webpack to Turbopack

1. **Add Turbopack flag**:
   ```json
   {
     "scripts": {
       "dev": "next dev --turbopack"
     }
   }
   ```

2. **Remove custom plugins** from `next.config.mjs`:
   ```javascript
   // Remove this:
   mdxOptions: {
     remarkPlugins: [...],
     rehypePlugins: [...],
   }
   ```

3. **Use built-in features** or custom components instead

4. **Test**: Run `pnpm dev` and verify everything works

### From Turbopack to Webpack

1. **Remove Turbopack flag**:
   ```json
   {
     "scripts": {
       "dev": "next dev"
     }
   }
   ```

2. **Add custom plugins** to `next.config.mjs`:
   ```javascript
   import remarkGfm from 'remark-gfm'

   const withNextra = nextra({
     mdxOptions: {
       remarkPlugins: [remarkGfm],
     }
   })
   ```

3. **Test**: Run `pnpm dev` and verify plugins work

## References

- [Nextra 4 Migration Guide](https://the-guild.dev/blog/nextra-4)
- [Next.js Turbopack Documentation](https://nextjs.org/docs/app/api-reference/next-cli#turbopack)
- [Turbopack GitHub](https://github.com/vercel/turbopack)

## Summary

✅ **Turbopack is enabled** and working
✅ **Configuration is compatible** with Turbopack
✅ **No custom plugins** that would break Turbopack
✅ **All built-in features** are available

**Recommendation**: Continue using Turbopack for faster development builds. Only switch to Webpack if you need custom MDX plugins.

---

**Last Updated**: 2025-01-27
**Status**: ✅ Production Ready
