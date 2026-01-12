# Monorepo CSS Strategy - Next.js + Tailwind v4 Best Practices

## Executive Summary

Replace the current complex CSS import chain with a **battle-proven Next.js + Tailwind v4 monorepo strategy** that:
- ✅ Respects DRY principles (single source of truth for tokens)
- ✅ Maintains consistency across apps
- ✅ Eliminates intermediate compiled files
- ✅ Follows Next.js and Tailwind v4 official recommendations
- ✅ Fixes the `@apply` error naturally

---

## Current System Problems

### Issues with Current Architecture

1. **Auto-Generated Files**: `apps/docs/app/global.css` is marked "DO NOT EDIT MANUALLY" but needs customization
2. **Complex Import Chain**: `input.css` → `style.css` → `apps/styles/global.css` → `app/global.css` (4 layers)
3. **Build Dependency**: Must build design system CSS before apps can build
4. **@apply Failures**: Import order causes `@apply` to fail (processes before imports)
5. **DRY Violation**: Intermediate files duplicate information

---

## Battle-Proven Strategy: Next.js + Tailwind v4 Monorepo

### Core Principles

1. **Each App Processes Tailwind Independently**: Each Next.js app has its own Tailwind processing
2. **Shared Tokens via Direct Import**: Design tokens imported directly from source (not compiled)
3. **@source for Shared Packages**: Each app scans shared packages for utilities
4. **No Intermediate Files**: Use source CSS files directly, no pre-compilation needed
5. **Single Source of Truth**: Tokens defined once in design system package

---

## Proposed Architecture

### File Structure

```
packages/design-system/
├── src/
│   └── tokens/
│       └── theme.css          # Source tokens (NOT compiled)
│           ├── @theme { ... }  # Design tokens
│           └── @layer components { ... }  # Shared patterns
│
apps/docs/
├── app/
│   ├── globals.css            # App-specific (editable)
│   │   ├── @import "tailwindcss"
│   │   ├── @import "@mythic/design-system/tokens/theme.css"
│   │   ├── @source "../../packages/design-system"
│   │   └── @theme { ... }     # App-specific overrides
│   └── layout.tsx
│       └── import './globals.css'
│
apps/boardroom/
└── app/
    └── globals.css             # Same pattern
```

### Key Changes

1. **Rename `input.css` → `theme.css`**: Clearer name, indicates it's a theme file
2. **Remove `style.css` compilation**: No pre-compilation needed
3. **Remove `apps/styles/global.css`**: No intermediate file needed
4. **Each app imports directly**: `@import "@mythic/design-system/tokens/theme.css"`
5. **Each app processes Tailwind**: Each app has its own PostCSS processing

---

## Implementation Plan

### Phase 1: Create Shared Theme File

**File**: `packages/design-system/src/tokens/theme.css`

**Content**: Extract all `@theme` tokens and `@layer components` from `input.css` to `theme.css`

```css
/**
 * Design System Theme - Shared Tokens
 *
 * This file contains all shared design tokens and component patterns.
 * Apps import this file directly - no compilation needed.
 *
 * @version 1.0.0
 */

/* NOTE: Do NOT include @import "tailwindcss" here */
/* Each app will import Tailwind independently */

/**
 * ============================================================================
 * DESIGN TOKENS - Tailwind v4 @theme Directive
 * ============================================================================
 */
@theme {
  /* Colors */
  --color-void: 240 10% 4%;
  --color-obsidian: 240 8% 8%;
  --color-charcoal: 240 3% 17%;
  --color-parchment: 40 20% 96%;
  --color-ash: 40 10% 82%;
  --color-gold: 40 45% 55%;
  --color-ember: 35 40% 45%;
  --color-signal-white: 40 20% 99%;

  /* Fonts */
  --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  /* ... all other tokens from input.css ... */
}

/**
 * ============================================================================
 * SHARED COMPONENT PATTERNS
 * ============================================================================
 */
@layer components {
  .card-base {
    @apply rounded-lg border border-charcoal bg-surface p-6 shadow-base;
  }

  /* ... other shared patterns from input.css ... */
}
```

**Package Export**: Update `packages/design-system/package.json`

```json
{
  "exports": {
    "./tokens/theme.css": "./src/tokens/theme.css"
  }
}
```

---

### Phase 2: Update Each App's globals.css

**File**: `apps/docs/app/globals.css` (rename from `global.css`)

**Content**:

```css
/**
 * Docs App Global Styles
 *
 * Battle-Proven Pattern: Each app processes Tailwind independently
 * and imports shared tokens directly from design system.
 */

/* Step 1: Import Tailwind CSS (processes first) */
@import "tailwindcss";

/* Step 2: Import shared design tokens */
@import "@mythic/design-system/tokens/theme.css";

/* Step 3: Scan shared packages for utilities */
@source "../../packages/design-system";

/**
 * ============================================================================
 * APP-SPECIFIC THEME OVERRIDES
 * ============================================================================
 */
@theme {
  /* App-specific tokens only */
  --color-diataxis-tutorial: 204 96% 48%;
  --color-diataxis-howto: 142 76% 47%;
  --color-diataxis-reference: 0 0% 45%;
  --color-diataxis-explanation: 48 96% 47%;

  /* Motion */
  --duration-hover: 1000ms;
  --duration-commit: 1618ms;
  --ease-gravity: cubic-bezier(0.4, 0, 0.2, 1);
}

/**
 * ============================================================================
 * BASE STYLES
 * ============================================================================
 */
@layer base {
  body {
    @apply bg-void text-parchment font-sans;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-sans font-bold;
    color: hsl(var(--color-signal-white));
  }

  .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
    @apply text-parchment;
  }

  code, pre, kbd, samp {
    @apply font-mono;
  }

  a, button, [role='button'] {
    transition-property: all;
    transition-duration: var(--duration-hover);
    transition-timing-function: var(--ease-gravity);
  }

  button[type='submit'],
  button[data-commitment='true'] {
    transition-property: all;
    transition-duration: var(--duration-commit);
    transition-timing-function: var(--ease-gravity);
  }
}
```

**Why This Works**:
- ✅ `@import "tailwindcss"` processes Tailwind first
- ✅ `@import "@mythic/design-system/tokens/theme.css"` brings in tokens
- ✅ `@source` scans shared packages for utilities
- ✅ `@apply` works because Tailwind is already processed
- ✅ No build dependency - each app processes independently

---

### Phase 3: Update PostCSS Configuration

**File**: `apps/docs/postcss.config.mjs`

**Content** (should already be correct):

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**Why**: Each app processes Tailwind independently. No special config needed.

---

### Phase 4: Update Package Exports

**File**: `packages/design-system/package.json`

**Update exports**:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./tokens/theme.css": "./src/tokens/theme.css",
    "./components": "./src/components/index.ts",
    "./lib": "./src/lib/index.ts",
    "./lib/utils": "./src/lib/utils.ts",
    "./lib/variants": "./src/lib/variants.ts",
    "./lib/server": "./src/lib/server.ts",
    "./lib/motion": "./src/lib/motion.ts",
    "./hooks": "./src/hooks/index.ts"
  }
}
```

---

### Phase 5: Remove Old Files

**Files to Remove**:
- ❌ `packages/design-system/src/tokens/input.css` (replaced by `theme.css`)
- ❌ `packages/design-system/src/tokens/style.css` (no compilation needed)
- ❌ `apps/styles/global.css` (no intermediate file needed)
- ❌ `apps/docs/app/global.css` (replaced by `globals.css`)

**Scripts to Remove**:
- ❌ `pnpm build:css` (no longer needed)
- ❌ `pnpm tokens:propagate-version` (no longer needed)

---

## Benefits of New Strategy

### ✅ DRY Compliance

- **Single Source of Truth**: Tokens defined once in `theme.css`
- **No Duplication**: No intermediate files duplicating tokens
- **Direct Import**: Apps import source directly, no compilation layer

### ✅ Consistency

- **Same Pattern**: All apps follow identical pattern
- **Shared Tokens**: All apps use same design tokens
- **Predictable**: Clear, simple import chain

### ✅ Battle-Proven

- **Next.js Recommended**: Each app processes CSS independently
- **Tailwind v4 Official**: Direct `@import` of shared tokens
- **Industry Standard**: Used by Vercel, Turborepo examples

### ✅ Fixes Build Errors

- **@apply Works**: Tailwind processed before `@apply` directives
- **No Build Dependency**: Apps can build independently
- **No Import Order Issues**: Clear processing order

### ✅ Developer Experience

- **Editable Files**: App CSS files are editable (not auto-generated)
- **Hot Reload**: Works in development without build step
- **Simple**: Less complexity, easier to understand

---

## Migration Steps

### Step 1: Create `theme.css`

1. Copy `@theme` and `@layer components` from `input.css` to `theme.css`
2. Remove `@source` directives (apps will add their own)
3. Remove `@import "tailwindcss"` (apps will add their own)

### Step 2: Update Each App

1. Create `apps/{app}/app/globals.css`
2. Add `@import "tailwindcss"`
3. Add `@import "@mythic/design-system/tokens/theme.css"`
4. Add `@source "../../packages/design-system"`
5. Add app-specific `@theme` overrides
6. Add `@layer base` styles

### Step 3: Update Layout Imports

1. Update `layout.tsx` to import `./globals.css` (not `./global.css`)

### Step 4: Remove Old Files

1. Delete `input.css`, `style.css`, `apps/styles/global.css`
2. Remove build scripts
3. Update documentation

### Step 5: Verify

1. Build each app: `cd apps/docs && pnpm build`
2. Verify no errors
3. Verify styles work correctly

---

## Comparison: Old vs New

| Aspect               | Old System                              | New System                       |
| -------------------- | --------------------------------------- | -------------------------------- |
| **Files**            | 4 layers (input → style → shared → app) | 2 layers (theme → app)           |
| **Build**            | Must build design system first          | No build dependency              |
| **Editable**         | App CSS auto-generated (not editable)   | App CSS fully editable           |
| **@apply**           | Fails (import order issue)              | Works (Tailwind processed first) |
| **DRY**              | Intermediate files duplicate            | Direct import, no duplication    |
| **Complexity**       | High (4 file chain)                     | Low (2 file chain)               |
| **Next.js Pattern**  | Custom (not recommended)                | Standard (recommended)           |
| **Tailwind Pattern** | Custom (pre-compilation)                | Standard (direct import)         |

---

## Success Criteria

✅ **Build Success**: All apps build without errors
✅ **@apply Works**: Base styles use `@apply` successfully
✅ **DRY Compliance**: Single source of truth, no duplication
✅ **Consistency**: All apps follow same pattern
✅ **Editable**: App CSS files are editable
✅ **No Build Dependency**: Apps build independently
✅ **Battle-Proven**: Follows Next.js + Tailwind v4 best practices

---

## References

- **Next.js CSS Documentation**: https://nextjs.org/docs/app/building-your-application/styling
- **Tailwind v4 Monorepo Guide**: https://tailwindcss.com/docs/installation/framework-guides
- **Turborepo + Tailwind v4 Example**: https://github.com/philipptpunkt/turbo-with-tailwind-v4
- **Vercel Monorepo Patterns**: Industry standard practices

---

## Notes

- **Backward Compatible**: Can migrate apps one at a time
- **Low Risk**: Simple changes, easy to rollback
- **Performance**: No performance impact (same final output)
- **Maintainability**: Much simpler to maintain
