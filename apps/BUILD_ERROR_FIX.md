# Build Error Fix - Font Utility Classes

**Date**: 2026-01-11
**Status**: ✅ **FIXED**

---

## Error

```
CssSyntaxError: tailwindcss: Cannot apply unknown utility class `font-sans`
```

---

## Root Cause

In Tailwind CSS v4, font utilities (`font-sans`, `font-serif`, `font-mono`) are generated from `@theme` variables using the naming convention `--font-*`, not `--font-family-*`.

**Incorrect** (Tailwind v3 style):
```css
@theme {
  --font-family-sans: ...;
  --font-family-serif: ...;
  --font-family-mono: ...;
}
```

**Correct** (Tailwind v4 style):
```css
@theme {
  --font-sans: ...;
  --font-serif: ...;
  --font-mono: ...;
}
```

---

## Fix Applied

### 1. ✅ Fixed `apps/docs/styles/globals.css`

**Before**:
```css
--font-family-sans: ui-sans-serif, system-ui, ...;
--font-family-serif: "Cormorant Garamond", ...;
--font-family-mono: "JetBrains Mono", ...;
```

**After**:
```css
--font-sans: ui-sans-serif, system-ui, ...;
--font-serif: "Cormorant Garamond", ...;
--font-mono: "JetBrains Mono", ...;
```

### 2. ✅ Fixed `apps/boardroom/styles/globals.css`

**Before**:
```css
--font-family-serif: 'Cormorant Garamond', serif;
--font-family-sans: 'Inter', sans-serif;
--font-family-mono: 'JetBrains Mono', monospace;
```

**After**:
```css
--font-serif: 'Cormorant Garamond', serif;
--font-sans: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

---

## Files Modified

1. ✅ `apps/docs/styles/globals.css` - Fixed font variable naming
2. ✅ `apps/boardroom/styles/globals.css` - Fixed font variable naming (preventive)

---

## Verification

- ✅ `font-sans` utility now recognized
- ✅ `font-serif` utility now recognized
- ✅ `font-mono` utility now recognized
- ✅ All `@apply` statements using font utilities will work

---

## Note

The `packages/design-system/src/tokens/input.css` still uses `--font-family-*` naming, but this is acceptable because:
1. It's not used directly in `@apply` statements
2. It's used as a reference variable that can be overridden
3. The actual font utilities are generated from `--font-*` variables in app-level `@theme` blocks

If needed, the design-system package can be updated later, but it's not causing build errors.

---

**Status**: ✅ **BUILD ERROR RESOLVED**
