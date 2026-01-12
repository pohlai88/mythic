# DRY Handoff Architecture: Single Source of Truth

**Status**: ✅ **MANDATORY ARCHITECTURE**
**Date**: 2026-01-11
**Version**: 3.0.0 (Final - No More Mistakes)

---

## Core Principle: DRY with Handoff

**RULE**: **ONLY TAILWIND ALLOWED** - Everything else is IGNORED or KILLED

**PRIORITY**: **TAILWIND IS THE PRIORITY**

---

## Derivative System Architecture

### Flow (Single Direction - No Loops)

```
1. Handoff (Figma)                    ← ROOT SOURCE
   ↓
2. input.css                         ← Design Tokens (@theme)
   ↓ (PostCSS compilation)
3. style.css                         ← Compiled Tailwind
   ↓
4. globals.css (shared)              ← Shared Base
   ↓
5. globals.css (app-specific)        ← App Derivative
   ↓
6. Components (Tailwind classes only) ← Final Usage
```

**CRITICAL**: This is a **DERIVATIVE SYSTEM** - each layer derives from the previous. No loops, no conflicts.

---

## File Structure

### 1. Root Source: Handoff

**Location**: `packages/design-system/src/tokens/handoff-colors.ts`

**Purpose**: Single source of truth from Figma/Handoff

**Action**: Auto-sync from Handoff
```bash
pnpm tokens:sync
```

---

### 2. Design Tokens: input.css

**Location**: `packages/design-system/src/tokens/input.css`

**Purpose**: Tailwind v4 `@theme` directive with Handoff colors

**Rule**: ✅ **ONLY TAILWIND @theme** - No CSS rules, no selectors

**Example**:
```css
@theme {
  /* ✅ CORRECT: Design tokens only */
  --color-void: 240 10% 4%;
  --color-gold: 40 45% 55%;
  
  /* ❌ FORBIDDEN: No CSS rules */
  /* body { ... } ❌ */
  /* * { ... } ❌ */
}
```

**Build**:
```bash
cd packages/design-system
pnpm build:css
```

---

### 3. Compiled Output: style.css

**Location**: `packages/design-system/src/tokens/style.css`

**Purpose**: PostCSS-compiled Tailwind CSS

**Rule**: ✅ **GENERATED FILE** - Never edit directly

**Action**: Auto-generated from `input.css`

---

### 4. Shared Base: globals.css

**Location**: `apps/styles/globals.css`

**Purpose**: Shared base styles for all apps

**Rule**: ✅ **ONLY IMPORTS** - No custom CSS

**Content**:
```css
/* ✅ CORRECT: Only imports */
@import "@mythic/design-system/tokens/style.css";
```

**❌ FORBIDDEN**:
- No CSS rules
- No selectors
- No !important
- No custom styles

---

### 5. App Derivative: globals.css

**Location**: `apps/[app]/styles/globals.css`

**Purpose**: App-specific Tailwind extensions

**Rule**: ✅ **ONLY @theme EXTENSIONS** - No CSS rules

**Example**:
```css
/* ✅ CORRECT: Extend theme only */
@import "../../styles/globals.css";

@theme {
  /* App-specific tokens */
  --custom-token: value;
}
```

**❌ FORBIDDEN**:
- No CSS rules
- No selectors
- No !important
- No custom styles

---

### 6. Components: Tailwind Classes Only

**Location**: `apps/[app]/components/**/*.tsx`

**Purpose**: React components using Tailwind

**Rule**: ✅ **ONLY TAILWIND CLASSES** - No inline styles, no CSS modules

**Example**:
```tsx
// ✅ CORRECT: Tailwind classes only
<div className="bg-void text-parchment p-4">
  Content
</div>

// ❌ FORBIDDEN: Inline styles
<div style={{ backgroundColor: '#000' }}> ❌

// ❌ FORBIDDEN: CSS modules
<div className={styles.container}> ❌
```

---

## Forbidden Patterns

### ❌ **KILL THESE**:

1. **CSS Files with Rules**:
   - ❌ `axis-theme.css` (has CSS rules)
   - ❌ Any CSS with selectors
   - ❌ Any CSS with `!important`

2. **Inline Styles**:
   - ❌ `style={{ ... }}`
   - ✅ Use Tailwind classes instead

3. **CSS Modules**:
   - ❌ `*.module.css`
   - ✅ Use Tailwind classes instead

4. **Hardcoded Colors**:
   - ❌ `bg-emerald-500` (hardcoded)
   - ✅ `bg-success` (design token)

5. **Non-Tailwind CSS Rules**:
   - ❌ `body { ... }`
   - ❌ `* { ... }`
   - ❌ Any CSS selectors

---

## Enforcement Rules

### Rule 1: Handoff is Root

**ALL** colors must come from Handoff → input.css → Tailwind utilities

**NO** hardcoded colors anywhere

### Rule 2: Tailwind Only

**ALL** styling must use Tailwind classes

**NO** inline styles, CSS modules, or custom CSS

### Rule 3: Derivative System

**EACH** layer derives from previous

**NO** loops, conflicts, or overrides

### Rule 4: No !important

**NEVER** use `!important`

**ALWAYS** use Tailwind specificity

### Rule 5: No Conflicts

**NEVER** override Tailwind classes

**ALWAYS** extend or compose

---

## Migration Checklist

### Phase 1: Remove Conflicts ✅

- [ ] Remove `axis-theme.css` (or convert to Tailwind)
- [ ] Remove all `!important` rules
- [ ] Remove all inline styles
- [ ] Remove all CSS modules

### Phase 2: Align Design Tokens ✅

- [ ] Update intelligence functions to use design tokens
- [ ] Remove hardcoded colors
- [ ] Ensure Handoff sync works

### Phase 3: Verify Architecture ✅

- [ ] Verify Handoff → input.css flow
- [ ] Verify input.css → style.css compilation
- [ ] Verify style.css → globals.css import
- [ ] Verify globals.css → components usage

### Phase 4: Audit & Test ✅

- [ ] Audit all CSS files
- [ ] Test Tailwind classes work
- [ ] Test intelligence functions work
- [ ] Verify no conflicts

---

## File Audit

### ✅ Allowed Files

| File | Status | Purpose |
|------|--------|---------|
| `input.css` | ✅ Allowed | Design tokens only |
| `style.css` | ✅ Allowed | Generated output |
| `globals.css` (shared) | ✅ Allowed | Imports only |
| `globals.css` (app) | ✅ Allowed | Theme extensions only |

### ❌ Forbidden Files

| File | Status | Action |
|------|--------|--------|
| `axis-theme.css` | ❌ Forbidden | Convert to Tailwind or remove |
| `*.module.css` | ❌ Forbidden | Remove, use Tailwind |
| Any CSS with rules | ❌ Forbidden | Remove or convert |

---

## Success Criteria

### ✅ Architecture Correct When:

1. **Handoff** is single source of truth
2. **input.css** has only `@theme` tokens
3. **style.css** is generated (never edited)
4. **globals.css** has only imports
5. **Components** use only Tailwind classes
6. **No conflicts** between layers
7. **No !important** anywhere
8. **No inline styles** anywhere
9. **No hardcoded colors** anywhere
10. **Tailwind works** everywhere

---

**Status**: ✅ **MANDATORY - ENFORCE STRICTLY**
**Version**: 3.0.0
**Last Updated**: 2026-01-11
