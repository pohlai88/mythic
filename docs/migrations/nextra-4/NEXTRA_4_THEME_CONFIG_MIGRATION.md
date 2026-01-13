# Nextra 4: Theme Config Migration Guide

**Status**: ✅ Migration Complete **Date**: 2025-01-27

## Overview

Nextra 4 **discontinues support** for `theme.config.tsx` files. Theme
configuration options are now passed directly as props to components in
`app/layout.tsx`.

## What Changed

### ❌ Removed in Nextra 4

```javascript
// ❌ NO LONGER SUPPORTED
const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
})
```

### ✅ New Approach in Nextra 4

Theme options are now passed as **props** to components in `app/layout.tsx`:

- `<Layout>` - Layout configuration
- `<Navbar>` - Navbar configuration
- `<Footer>` - Footer configuration
- `<Search>` - Search configuration
- `<Banner>` - Banner configuration

## Current Implementation

### ✅ Configuration Status

Our project is **already migrated** to Nextra 4:

1. **next.config.mjs**: ✅ No `theme` or `themeConfig` options
2. **app/layout.tsx**: ✅ Theme options passed as component props
3. **No theme.config.tsx**: ✅ File doesn't exist (not needed)

### Current Layout Configuration

**app/layout.tsx**:

```tsx
import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-docs'
import { Banner, Head, Search } from 'nextra/components'

// Banner component
const banner = (
  <Banner storageKey="nexuscanon-v4">
    🎉 NexusCanon Governance Docs are now live!
  </Banner>
)

// Footer component
const footer = (
  <Footer>
    {new Date().getFullYear()} © NexusCanon. Powered by Nextra
  </Footer>
)

// Layout with props
<Layout
  pageMap={pageMap}
  banner={banner}
  docsRepositoryBase="https://github.com/..."
  sidebar={{
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
    autoCollapse: true,
  }}
  toc={{
    backToTop: true,
  }}
  navigation={{
    prev: true,
    next: true,
  }}
>
  <Navbar
    logo={<div>NexusCanon</div>}
    projectLink="https://github.com/..."
  >
    <Search />
    <ThemeSwitch />
  </Navbar>

  {children}

  {footer}
</Layout>
```

## Migration Guide

### If You Have theme.config.tsx

If migrating from Nextra 3 with `theme.config.tsx`:

#### Step 1: Remove from next.config.mjs

```javascript
// ❌ Remove these
const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
})
```

#### Step 2: Move Options to app/layout.tsx

**Old theme.config.tsx**:

```tsx
const config = {
  logo: <span>My Docs</span>,
  project: {
    link: "https://github.com/...",
  },
  docsRepositoryBase: "https://github.com/...",
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  footer: {
    text: "© 2025 My Docs",
  },
}
```

**New app/layout.tsx**:

```tsx
<Layout
  docsRepositoryBase="https://github.com/..."
  sidebar={{
    defaultMenuCollapseLevel: 1,
  }}
>
  <Navbar logo={<span>My Docs</span>} projectLink="https://github.com/...">
    <Search />
    <ThemeSwitch />
  </Navbar>

  {children}

  <Footer>© 2025 My Docs</Footer>
</Layout>
```

#### Step 3: Delete theme.config.tsx

```bash
rm theme.config.tsx  # No longer needed
```

## Component Props Reference

### `<Layout>` Props

```tsx
<Layout
  pageMap={pageMap} // Required: Page map from getPageMap()
  banner={<Banner>...</Banner>} // Optional: Banner component
  docsRepositoryBase="https://..." // Optional: Docs repo base URL
  sidebar={{
    // Optional: Sidebar config
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
    autoCollapse: true,
  }}
  toc={{
    // Optional: TOC config
    backToTop: true,
  }}
  navigation={{
    // Optional: Navigation config
    prev: true,
    next: true,
  }}
>
  {children}
</Layout>
```

### `<Navbar>` Props

```tsx
<Navbar
  logo={<div>Logo</div>} // Optional: Logo component
  projectLink="https://..." // Optional: Project link
>
  <Search /> // Optional: Search component
  <ThemeSwitch /> // Optional: Theme switcher
</Navbar>
```

### `<Footer>` Props

```tsx
<Footer>{/* Footer content as children */}© 2025 My Docs</Footer>
```

### `<Banner>` Props

```tsx
<Banner storageKey="unique-key">
  {/* Banner content as children */}
  🎉 Announcement text
</Banner>
```

### `<Search>` Props

```tsx
<Search />
// No props needed - uses Nextra's built-in search
```

## Benefits of New Approach

### ✅ Better Type Safety

Props are typed, providing better TypeScript support and IDE autocomplete.

### ✅ More Flexible

Components can be conditionally rendered or customized per route.

### ✅ Clearer Structure

Configuration is co-located with components, making it easier to understand.

### ✅ App Router Compatible

Follows Next.js App Router patterns and conventions.

## Common Configurations

### Logo and Branding

```tsx
<Navbar
  logo={
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img src="/logo.png" alt="Logo" />
      <span style={{ fontWeight: 600 }}>My Docs</span>
    </div>
  }
  projectLink="https://github.com/user/repo"
>
  <Search />
  <ThemeSwitch />
</Navbar>
```

### Sidebar Configuration

```tsx
<Layout
  sidebar={{
    defaultMenuCollapseLevel: 1,  // Collapse level (0 = all open)
    toggleButton: true,           // Show toggle button
    autoCollapse: true,           // Auto-collapse on navigation
  }}
>
```

### Table of Contents

```tsx
<Layout
  toc={{
    backToTop: true,              // Show back to top button
  }}
>
```

### Navigation Links

```tsx
<Layout
  navigation={{
    prev: true,                   // Show previous page link
    next: true,                   // Show next page link
  }}
>
```

### Banner

```tsx
const banner = (
  <Banner storageKey="announcement-v1">
    🎉 New features available!{' '}
    <a href="/features" style={{ textDecoration: 'underline' }}>
      Learn more →
    </a>
  </Banner>
)

<Layout banner={banner}>
```

## Verification Checklist

- [x] ✅ Removed `theme` option from `next.config.mjs`
- [x] ✅ Removed `themeConfig` option from `next.config.mjs`
- [x] ✅ No `theme.config.tsx` file exists
- [x] ✅ Theme options configured in `app/layout.tsx`
- [x] ✅ Components receive props correctly
- [x] ✅ Layout renders correctly
- [x] ✅ Navbar configured with logo and links
- [x] ✅ Footer configured
- [x] ✅ Banner configured (if used)
- [x] ✅ Search and theme switcher working

## Troubleshooting

### Theme Options Not Working

**Problem**: Theme options from `theme.config.tsx` not applied

**Solution**:

1. Check `app/layout.tsx` - options should be props
2. Verify component imports from `nextra-theme-docs`
3. Ensure props are passed correctly

### TypeScript Errors

**Problem**: Type errors with component props

**Solution**:

1. Check imports: `import { Layout, Navbar } from 'nextra-theme-docs'`
2. Verify prop types match Nextra 4 API
3. Check Nextra 4 documentation for correct prop types

### Missing Features

**Problem**: Feature from `theme.config.tsx` not available

**Solution**:

1. Check Nextra 4 migration guide
2. Some features may have different prop names
3. Some features may be removed or replaced

## References

- [Nextra 4 Migration Guide](https://the-guild.dev/blog/nextra-4)
- [Nextra Theme Docs Components](https://nextra.site/docs/docs-theme/start)
- Current implementation: `app/layout.tsx`

## Summary

✅ **Migration Complete**: Theme config removed, options moved to component
props ✅ **Configuration Verified**: All theme options configured correctly ✅
**No Breaking Changes**: All features working as expected

**Status**: ✅ Production Ready

---

**Last Updated**: 2025-01-27 **Next Review**: After Nextra updates
