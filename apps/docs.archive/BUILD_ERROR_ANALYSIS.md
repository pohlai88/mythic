# Build Error Analysis - apps/docs

**Generated**: 2026-01-12
**Build Command**: `pnpm build`
**Status**: ❌ **FAILED** (1 blocker, 1 non-blocker)

---

## 🔴 BLOCKER ERRORS (Must Fix)

### Error #1: Unknown Tailwind Utility Class `bg-void`

**Error Message:**
```
Error: Cannot apply unknown utility class `bg-void`
CssSyntaxError: tailwindcss: C:\AI-BOS\mythic\apps\docs\app\global.css:1:1: Cannot apply unknown utility class `bg-void`
```

**Location:**
- File: `apps/docs/app/global.css`
- Line: 160
- Code: `@apply bg-void text-parchment font-sans;`

**Root Cause:**
The `bg-void` utility class is defined in the compiled design system CSS (`packages/design-system/src/tokens/style.css` line 1801), but Tailwind CSS v4 is not recognizing it during the build process. This occurs because:

1. **CSS Import Chain Issue**: The design system CSS is imported via `@import "../../styles/global.css"` which imports `packages/design-system/src/tokens/style.css`, but Tailwind v4 processes `@apply` directives before it processes `@import` statements.

2. **Tailwind v4 Processing Order**: In Tailwind v4, `@apply` requires the utility class to already exist in the generated utilities. However, when using `@import` to bring in external CSS, Tailwind may not have scanned those files for utility class definitions.

3. **Missing @source Directive**: While the design system's `input.css` has `@source` directives pointing to the apps, the docs app's `global.css` doesn't have a corresponding `@source` directive that tells Tailwind to scan the design system package.

**Impact:**
- ❌ Build completely fails
- ❌ Cannot deploy to production
- ❌ Affects 23+ files using `bg-void` class

**Files Affected:**
- `apps/docs/app/global.css` (line 160)
- `apps/docs/app/layout.tsx` (line 76)
- `apps/docs/app/not-found.tsx` (lines 24, 101)
- `apps/docs/components/api-reference.tsx` (line 122)
- `apps/docs/components/diataxis/TutorialSteps.tsx` (line 66)
- `apps/docs/components/diataxis/HowToGuide.tsx` (lines 72, 177)
- `apps/docs/components/layout/DocsLayout.tsx` (line 24)
- `apps/docs/components/governance/HashVerification.tsx` (line 66)
- `apps/docs/mdx-components.tsx` (lines 59, 62)
- `apps/docs/app/api-docs/page.tsx` (lines 119, 134)
- `apps/docs/lib/design-tokens.ts` (line 14)

**Recommended Solutions:**

**Option 1: Use CSS Variable Directly (Quick Fix)**
Replace `@apply bg-void` with direct CSS:
```css
@layer base {
  body {
    background-color: hsl(var(--color-void));
    color: hsl(var(--color-parchment));
    font-family: var(--font-sans);
  }
}
```

**Option 2: Add @source Directive (Proper Fix)**
Add `@source` directive to `apps/docs/app/global.css`:
```css
@source "../../packages/design-system";
@import "../../styles/global.css" layer(theme);
```

**Option 3: Rebuild Design System CSS**
Ensure design system CSS is built before docs app build:
```bash
cd packages/design-system && pnpm build:css
cd ../../apps/docs && pnpm build
```

**Priority**: 🔴 **CRITICAL** - Blocks all builds

---

## ⚠️ NON-BLOCKER ERRORS (Should Fix)

### Error #2: TypeScript Type Error - Possibly Undefined Value

**Error Message:**
```
../../packages/shared-utils/src/intelligence-generator.ts(51,28): error TS18048: 'value' is possibly 'undefined'.
```

**Location:**
- File: `packages/shared-utils/src/intelligence-generator.ts`
- Line: 51
- Code: `const variantValue = value[variant as keyof typeof value] || ''`

**Root Cause:**
TypeScript strict mode is detecting that `value[variant as keyof typeof value]` could potentially return `undefined`, even though there's a fallback `|| ''`. The type system doesn't recognize the fallback as sufficient.

**Impact:**
- ⚠️ Type checking fails
- ⚠️ May cause runtime issues if value is actually undefined
- ⚠️ Blocks type-safe builds

**Recommended Solution:**
Add explicit undefined check:
```typescript
const variantValue = (value[variant as keyof typeof value] ?? '') as string
```

Or use optional chaining:
```typescript
const variantValue = (value?.[variant as keyof typeof value] ?? '') as string
```

**Priority**: ⚠️ **HIGH** - Should fix for type safety

---

## 📊 Error Summary

| Category           | Count | Status              |
| ------------------ | ----- | ------------------- |
| Blocker Errors     | 1     | ❌ Must Fix          |
| Non-Blocker Errors | 1     | ⚠️ Should Fix        |
| **Total Errors**   | **2** | **❌ Build Failing** |

---

## 🔧 Recommended Fix Order

1. **Fix Error #1 (Blocker)**: Resolve `bg-void` utility class issue
   - Quick fix: Replace `@apply bg-void` with direct CSS variable
   - Proper fix: Add `@source` directive or rebuild design system CSS

2. **Fix Error #2 (Non-Blocker)**: Resolve TypeScript type error
   - Add explicit undefined check or optional chaining

3. **Verify Build**: Run `pnpm build` again to confirm all errors resolved

---

## 🔍 Additional Notes

### Design System CSS Status
- ✅ `packages/design-system/src/tokens/style.css` exists and contains `bg-void` class (line 1801)
- ✅ `--color-void` CSS variable is defined (line 119)
- ✅ Color token is properly defined in `input.css` (line 55)
- ❌ Tailwind v4 not recognizing utility during build

### Build Dependencies
The build process requires:
1. Design system CSS to be built first (`pnpm build:css` in design-system package)
2. Proper CSS import chain to be maintained
3. Tailwind v4 to scan all source files for utility classes

### Related Files
- `apps/docs/app/global.css` - Main CSS file with error
- `apps/styles/global.css` - Shared base CSS
- `packages/design-system/src/tokens/style.css` - Compiled design system CSS
- `packages/design-system/src/tokens/input.css` - Source design tokens

---

**Next Steps:**
1. Apply quick fix for Error #1 to unblock build
2. Fix TypeScript error for type safety
3. Consider proper long-term solution for CSS import chain
4. Re-run build to verify fixes
