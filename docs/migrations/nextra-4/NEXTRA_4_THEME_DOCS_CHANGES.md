# Nextra 4: Theme Docs Changes & Migration Guide

**Date**: 2025-01-27
**Status**: ✅ **Documented - Ready for Migration**

---

## Overview

This document covers the latest changes in `nextra-theme-docs` that may affect your implementation:

1. **Zustand Migration** - React context → Zustand
2. **Tailwind CSS 4** - Prefix change from `_` to `x:`
3. **Heading :target Animation** - New animation for targeted headings
4. **Enhanced NotFoundPage** - Built-in component with issue creation URL

---

## 1. Zustand Migration ✅

### What Changed

All React context usages in `nextra-theme-docs` have been migrated to **Zustand** for better state management, except for places requiring dependency injection.

### Exceptions

These hooks still use React context (for dependency injection):
- `useConfig` - Needs to initialize state with props
- `useThemeConfig` - Needs to initialize state with props

### Impact on Your Code

**✅ No Action Required** - If you're using Nextra's built-in components, this change is transparent.

**⚠️ If You're Using Internal Hooks**:
- If you're accessing internal Nextra hooks directly, they may now use Zustand internally
- The API remains the same, so no code changes needed
- Performance may improve due to Zustand's optimization

### Verification

```bash
# Check if you're using any internal Nextra hooks
grep -r "useConfig\|useThemeConfig" app/ components/
```

**Current Status**: ✅ No usage found in codebase - No migration needed

---

## 2. Tailwind CSS 4 Migration ⚠️

### What Changed

`nextra-theme-docs` has been updated to **Tailwind CSS 4**. The previously used Tailwind CSS prefix `_` has been replaced with `x:`.

### Prefix Change

**Before (Tailwind CSS 3)**:
```css
._text-primary-600 { ... }
._bg-primary-100 { ... }
._border-primary-200 { ... }
```

**After (Tailwind CSS 4)**:
```css
.x\:text-primary-600 { ... }
.x\:bg-primary-100 { ... }
.x\:border-primary-200 { ... }
```

### Impact on Your Code

**⚠️ Action Required** - If you have custom CSS that overrides Nextra's theme classes:

1. **Search for old prefix**:
   ```bash
   grep -r "_text-\|_bg-\|_border-\|_\." styles/ components/
   ```

2. **Update CSS files**:
   ```css
   /* Before */
   ._text-primary-600 { ... }

   /* After */
   .x\:text-primary-600 { ... }
   ```

3. **Update HTML/JSX** (if using inline styles):
   ```tsx
   // Before
   <div className="_text-primary-600">...</div>

   // After
   <div className="x:text-primary-600">...</div>
   ```

### Current Status

**✅ No Overrides Found** - Your codebase doesn't appear to override Nextra's theme classes with the old `_` prefix.

**Verification**:
```bash
$ grep -r "_text-\|_bg-\|_border-\|_\." styles/ components/
# No matches found ✅
```

**Conclusion**: ✅ **No migration needed** - Your custom styles don't conflict with Nextra's theme classes.

---

## 3. Heading :target Animation ✅

### What Changed

All headings now have animation for `:target` state. When a heading is targeted (via anchor link), it will animate to draw attention.

### How It Works

When you navigate to a heading via anchor link (e.g., `/docs#section-name`), the heading will animate to highlight it.

**Example**:
```markdown
## Section Name {#section-name}
```

When accessed via `/docs#section-name`, the heading will animate.

### Impact on Your Code

**✅ No Action Required** - This is automatic and works out of the box.

**Optional Enhancement**:
- You can customize the animation in your CSS if needed
- Default animation is subtle and accessible

### Customization (Optional)

If you want to customize the animation:

```css
/* Custom :target animation */
h1:target,
h2:target,
h3:target,
h4:target,
h5:target,
h6:target {
  animation: your-custom-animation 0.3s ease-in-out;
}
```

**Current Status**: ✅ **Automatic** - No changes needed

---

## 4. Enhanced NotFoundPage ⚠️

### What Changed

The built-in `<NotFoundPage>` component now includes a URL for creating an issue with the referrer URL included. This makes it easier to identify broken pages.

### Current Implementation

**Your Current File**: `app/not-found.tsx`

You're using a **custom NotFoundPage** implementation, not Nextra's built-in component.

### Option 1: Keep Custom Implementation ✅

**Current Status**: ✅ Your custom NotFoundPage works fine.

**Pros**:
- Full control over design
- Custom functionality
- No dependency on Nextra's component

**Cons**:
- Missing automatic issue creation URL
- Manual maintenance required

### Option 2: Use Nextra's Built-in Component ⚠️

If you want to use Nextra's enhanced NotFoundPage:

**Migration Steps**:

1. **Import NotFoundPage**:
   ```tsx
   import { NotFoundPage } from 'nextra-theme-docs'
   ```

2. **Update app/not-found.tsx**:
   ```tsx
   import { NotFoundPage } from 'nextra-theme-docs'

   export default function NotFound() {
     return (
       <NotFoundPage
         issueUrl="https://github.com/your-org/your-repo/issues/new"
         referrerUrl={typeof window !== 'undefined' ? window.location.href : ''}
       />
     )
   }
   ```

3. **Benefits**:
   - Automatic issue creation URL
   - Includes referrer URL for debugging
   - Consistent with Nextra theme

**Current Status**: ⚠️ **Custom Implementation** - Consider migrating if you want automatic issue reporting

---

## Migration Checklist

### ✅ Completed

- [x] ✅ Zustand migration - No impact (not using internal hooks)
- [x] ✅ Tailwind CSS 4 - No overrides found, no migration needed
- [x] ✅ Heading :target animation - Automatic, no changes needed

### ⚠️ Optional

- [ ] ⚠️ NotFoundPage - Consider migrating to built-in component for issue reporting

---

## Verification Commands

### Check for Old Tailwind Prefix

```bash
# Search for old prefix usage
grep -r "_text-\|_bg-\|_border-\|_\." styles/ components/ app/

# Expected: No matches (or only in documentation)
```

### Check for Internal Hook Usage

```bash
# Check for Nextra internal hooks
grep -r "useConfig\|useThemeConfig" app/ components/

# Expected: No matches (unless intentionally using)
```

### Check NotFoundPage Usage

```bash
# Check current NotFoundPage implementation
cat app/not-found.tsx

# Expected: Custom implementation (not using Nextra's component)
```

---

## Summary

| Change                        | Status                  | Action Required                  |
| ----------------------------- | ----------------------- | -------------------------------- |
| **Zustand Migration**         | ✅ No Impact             | None - Transparent change        |
| **Tailwind CSS 4**            | ✅ No Overrides          | None - No custom overrides found |
| **Heading :target Animation** | ✅ Automatic             | None - Works automatically       |
| **Enhanced NotFoundPage**     | ⚠️ Custom Implementation | Optional - Consider migrating    |

---

## Recommendations

### ✅ Current State

Your codebase is **compatible** with the latest `nextra-theme-docs` changes:

1. ✅ **No Tailwind prefix conflicts** - Your custom styles don't override Nextra's theme
2. ✅ **No internal hook usage** - Not affected by Zustand migration
3. ✅ **Heading animations** - Automatic, no changes needed
4. ⚠️ **NotFoundPage** - Using custom implementation (consider migrating)

### 🎯 Optional Improvements

1. **Migrate NotFoundPage** (if desired):
   - Use Nextra's built-in component
   - Get automatic issue creation URL
   - Include referrer URL for debugging

2. **Customize Heading Animation** (if desired):
   - Add custom CSS for :target state
   - Enhance accessibility

---

## References

- [Nextra Theme Docs](https://nextra.site/docs)
- [Tailwind CSS 4 Migration](https://tailwindcss.com/docs/upgrade-guide)
- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
- Current implementation: `app/not-found.tsx`

---

**Last Updated**: 2025-01-27
**Status**: ✅ **Compatible** - No required migrations
