# Turbopack Quick Reference

## ✅ Current Status

- **Turbopack**: ✅ Enabled (`next dev --turbopack`)
- **Configuration**: ✅ Compatible (JSON-serializable only)
- **Custom Plugins**: ❌ Not supported (use Webpack if needed)

## Quick Commands

```bash
# Development with Turbopack (current)
pnpm dev

# Development with Webpack (if plugins needed)
# Edit package.json: "dev": "next dev"
pnpm dev
```

## Configuration Rules

### ✅ Allowed (Turbopack Compatible)

```javascript
const withNextra = nextra({
  // Booleans
  defaultShowCopyCode: true,
  readingTime: true,
  latex: true,

  // Strings
  contentDirBasePath: '/',

  // Objects (serializable)
  search: {
    codeblocks: false,
  },
})
```

### ❌ Not Allowed (Breaks Turbopack)

```javascript
const withNextra = nextra({
  // ❌ Functions are NOT serializable
  mdxOptions: {
    remarkPlugins: [myPlugin],      // ❌ Function
    rehypePlugins: [myPlugin],      // ❌ Function
    recmaPlugins: [myPlugin]        // ❌ Function
  }
})
```

## Error Messages

### "does not have serializable options"

**Fix**: Remove custom plugins from `next.config.mjs`

## Built-in Features (No Plugins Needed)

- ✅ Math support (`latex: true`)
- ✅ Code highlighting (built-in)
- ✅ Reading time (`readingTime: true`)
- ✅ Copy code button (`defaultShowCopyCode: true`)
- ✅ Search (`search: { codeblocks: false }`)

## When to Use Webpack

Only if you need:
- Custom remark plugins
- Custom rehype plugins
- Custom recma plugins

**Trade-off**: Slower builds, but full plugin support

---

**See**: `TURBOPACK_SUPPORT.md` for complete documentation
