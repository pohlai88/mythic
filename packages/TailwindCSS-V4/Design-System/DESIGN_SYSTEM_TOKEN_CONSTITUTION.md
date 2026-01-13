# Design System Token Constitution

**Status**: MANDATORY - Single Source of Truth **Authority**: Overrides all
other design/styling rules **Version**: 1.0.0 **Date**: 2026-01-12

---

## ⚠️ CONSTITUTION RULE

**Any conflict, duplicate, or overlay will flag errors as breaking the TRUTH.**

This constitution establishes the **Visual Single Source of Truth** for the
design system.

---

## 1. Token Files (Single Source of Truth)

### 1.1 Core Token Files

```
packages/design-system/src/tokens/
├── axis-theme.css    ← SINGLE SOURCE OF TRUTH for all design tokens
└── axis-base.css     ← Base styles and utilities (uses tokens from axis-theme.css)
```

### 1.2 File Responsibilities

**axis-theme.css**:

- ✅ **ONLY** design tokens (`@theme` directive)
- ✅ Colors (HSL format)
- ✅ Typography (fonts, sizes, weights, line heights, tracking)
- ✅ Spacing & Layout
- ✅ Motion/Easing
- ❌ **NO** CSS rules
- ❌ **NO** base styles
- ❌ **NO** utilities

**axis-base.css**:

- ✅ Base styles (`@layer base`)
- ✅ Utility classes (`@layer utilities`)
- ✅ **Intelligence CSS classes** (`.role-sovereign`, `.broadcast-approval`,
  etc.) - SOURCE OF TRUTH
- ✅ References tokens from `axis-theme.css` only
- ❌ **NO** new tokens (must use tokens from axis-theme.css)

---

## 2. Import Rules (MANDATORY)

### 2.1 Required Import Order

```css
/* apps/[app]/app/globals.css */

/* Step 1: Import Tailwind CSS (processes first) */
@import "tailwindcss";

/* Step 2: Import design system tokens (SINGLE SOURCE OF TRUTH) */
@import "@mythic/design-system/tokens/axis-theme.css";

/* Step 3: Import base styles and utilities */
@import "@mythic/design-system/tokens/axis-base.css";

/* Step 4: Scan packages for utilities */
@source "../../packages/design-system";
```

### 2.2 App-Specific Overrides (ALLOWED)

```css
/* Step 5: App-specific theme overrides (ONLY domain-specific tokens) */
@theme {
  /* ✅ ALLOWED: Domain-specific tokens */
  --color-domain-specific: 200 50% 50%;
  --font-domain-custom: "Custom Font", sans-serif;

  /* ❌ FORBIDDEN: Duplicating tokens from axis-theme.css */
  /* --color-void: 240 5% 4%;  ← BREAKS TRUTH */
  /* --color-gold: 42 49% 58%;  ← BREAKS TRUTH */
}
```

---

## 3. Forbidden Patterns (BREAKS TRUTH)

### ❌ FORBIDDEN: Duplicate Tokens

```css
/* ❌ WRONG: Duplicating tokens from axis-theme.css */
@theme {
  --color-void: 240 5% 4%; /* BREAKS TRUTH - already in axis-theme.css */
  --color-gold: 42 49% 58%; /* BREAKS TRUTH - already in axis-theme.css */
  --font-sans: Inter, ...; /* BREAKS TRUTH - already in axis-theme.css */
}
```

**Error**: Token already defined in `axis-theme.css` - use import instead.

### ❌ FORBIDDEN: Override Core Tokens

```css
/* ❌ WRONG: Overriding core tokens */
@theme {
  --color-void: 240 10% 4%; /* BREAKS TRUTH - different value */
  --color-gold: 40 45% 55%; /* BREAKS TRUTH - different value */
}
```

**Error**: Core tokens cannot be overridden - they are the SINGLE SOURCE OF
TRUTH.

### ❌ FORBIDDEN: Duplicate Base Styles

```css
/* ❌ WRONG: Duplicating base styles from axis-base.css */
@layer base {
  body {
    background: hsl(
      var(--color-bg)
    ); /* BREAKS TRUTH - already in axis-base.css */
    color: hsl(var(--color-text)); /* BREAKS TRUTH - already in axis-base.css */
  }
}
```

**Error**: Base styles already defined in `axis-base.css` - use import instead.

### ❌ FORBIDDEN: Duplicate Utilities

```css
/* ❌ WRONG: Duplicating utilities from axis-base.css */
@layer utilities {
  .card-axis {
    /* BREAKS TRUTH - already in axis-base.css */
    background: hsl(var(--color-surface));
  }
}
```

**Error**: Utility already defined in `axis-base.css` - use import instead.

---

## 4. Allowed Patterns (COMPLIANT)

### ✅ ALLOWED: App-Specific Domain Tokens

```css
@theme {
  /* ✅ OK: Domain-specific tokens not in axis-theme.css */
  --color-diataxis-tutorial: 204 96% 48%;
  --color-diataxis-howto: 142 76% 47%;
  --spacing-doc-section: 2rem;
}
```

### ✅ ALLOWED: App-Specific Base Extensions

```css
@layer base {
  /* ✅ OK: Extending base styles (not duplicating) */
  h1,
  h2,
  h3 {
    @apply font-serif font-bold;
  }
}
```

### ✅ ALLOWED: App-Specific Utilities

```css
@layer utilities {
  /* ✅ OK: New utilities (not duplicating) */
  .doc-card {
    @apply card-axis p-6;
  }
}
```

---

## 5. Validation Rules

### 5.1 Pre-Commit Validation

**Checks**:

1. ✅ No duplicate tokens (compare with axis-theme.css)
2. ✅ No override of core tokens
3. ✅ No duplicate base styles (compare with axis-base.css)
4. ✅ No duplicate utilities (compare with axis-base.css)
5. ✅ All imports use correct paths

### 5.2 Build-Time Validation

**Checks**:

1. ✅ axis-theme.css contains only tokens
2. ✅ axis-base.css references tokens correctly
3. ✅ No hardcoded colors (use tokens)
4. ✅ No hardcoded spacing (use tokens)

---

## 6. Error Reporting

### 6.1 Error Format

```
❌ TRUTH VIOLATION: [File] [Line] [Issue]

Example:
❌ TRUTH VIOLATION: apps/StratonHub/app/globals.css:20
   Duplicate token: --color-void already defined in axis-theme.css:33
   Action: Remove duplicate, use import instead
```

### 6.2 Error Severity

- **CRITICAL**: Duplicate core tokens → Blocks commit
- **ERROR**: Override core tokens → Blocks commit
- **WARNING**: Duplicate base/utilities → Warns, allows commit
- **INFO**: Missing imports → Warns, allows commit

---

## 7. Enforcement

### 7.1 Pre-Commit Hook

```bash
# .husky/pre-commit
pnpm validate:token-truth

# If violations found:
# ❌ Commit blocked
# ✅ Fix violations and retry
```

### 7.2 CI/CD Validation

```bash
# GitHub Actions / CI
pnpm validate:token-truth --strict

# If violations found:
# ❌ Build fails
# ✅ Fix violations and retry
```

---

## 8. Migration Guide

### 8.1 Renaming (apex → axis)

**Old**:

```css
@import "@mythic/design-system/tokens/theme.css";
@import "@mythic/design-system/tokens/apex-base.css";
.track-apex { ... }
.card-apex { ... }
```

**New**:

```css
@import "@mythic/design-system/tokens/axis-theme.css";
@import "@mythic/design-system/tokens/axis-base.css";
.track-axis { ... }
.card-axis { ... }
```

### 8.2 Token Renaming

**Old**:

```css
--tracking-apex: -0.03em;
--container-apex: 920px;
```

**New**:

```css
--tracking-axis: -0.03em;
--container-axis: 920px;
```

---

## 9. Quick Reference

### ✅ DO

- ✅ Import `axis-theme.css` for tokens
- ✅ Import `axis-base.css` for base/utilities
- ✅ Use tokens from `axis-theme.css`
- ✅ Add app-specific domain tokens
- ✅ Extend base styles (don't duplicate)

### ❌ DON'T

- ❌ Duplicate tokens from `axis-theme.css`
- ❌ Override core tokens
- ❌ Duplicate base styles from `axis-base.css`
- ❌ Duplicate utilities from `axis-base.css`
- ❌ Hardcode colors/values (use tokens)

---

## 10. Intelligence CSS Classes (MANDATORY)

### 10.1 Source of Truth

All Tailwind Intelligence CSS classes MUST be defined in `axis-base.css`:

**Rule**: Intelligence functions in `@mythic/shared-utils` reference CSS classes
from `@mythic/design-system`.

**Classes Required**:

- ✅ Vector classes: `.vector-past`, `.vector-present`, `.vector-future`
- ✅ Risk classes: `.risk-on-track`, `.risk-warning`, `.risk-overrun`,
  `.risk-underrun`, `.risk-critical`
- ✅ Status classes: `.status-draft`, `.status-listening`, `.status-approved`,
  `.status-vetoed`, `.status-archived`
- ✅ Priority classes: `.priority-high`, `.priority-medium`, `.priority-low`,
  `.priority-normal`, `.priority-urgent`
- ✅ Role classes: `.role-sovereign`, `.role-council`, `.role-observer`
- ✅ Broadcast classes: `.broadcast-approval`, `.broadcast-veto`,
  `.broadcast-announcement`, `.broadcast-poll`, `.broadcast-emergency`
- ✅ Workflow classes: `.workflow-pending`, `.workflow-in-progress`,
  `.workflow-completed`, `.workflow-blocked`, `.workflow-cancelled`
- ✅ Validation classes: `.validation-valid`, `.validation-invalid`,
  `.validation-warning`, `.validation-pending`
- ✅ Data state classes: `.data-loading`, `.data-loaded`, `.data-error`,
  `.data-empty`, `.data-refreshing`
- ✅ Financial classes: `.financial-profitable`, `.financial-break-even`,
  `.financial-loss`, `.financial-projected`
- ✅ Inventory classes: `.inventory-in-stock`, `.inventory-low-stock`,
  `.inventory-out-of-stock`, `.inventory-backordered`
- ✅ Order classes: `.order-pending`, `.order-confirmed`, `.order-processing`,
  `.order-shipped`, `.order-delivered`, `.order-cancelled`, `.order-returned`
- ✅ Payment classes: `.payment-pending`, `.payment-processing`,
  `.payment-completed`, `.payment-failed`, `.payment-refunded`
- ✅ Approval classes: `.approval-submitted`, `.approval-under-review`,
  `.approval-approved`, `.approval-rejected`, `.approval-requires-changes`
- ✅ Notification classes: `.notification-info`, `.notification-success`,
  `.notification-warning`, `.notification-error`, `.notification-system`
- ✅ Module classes: `.module-active`, `.module-inactive`,
  `.module-maintenance`, `.module-deprecated`
- ✅ Transition classes: `.transition-illuminate`, `.transition-commit`,
  `.transition-hover-intelligent`
- ✅ Gradient classes: `.gradient-approved`, `.gradient-vetoed`,
  `.gradient-warning`, `.gradient-success`, `.gradient-neutral`

**Violation**: Missing classes = BREAKS TRUTH

### 10.2 Validation

**Pre-Commit Validation**:

```bash
pnpm validate:intelligence-classes
```

**Checks**:

1. ✅ All intelligence CSS classes exist in `axis-base.css`
2. ✅ No missing classes referenced by intelligence functions
3. ✅ All classes use design system tokens

**If violations found**:

- ❌ Commit blocked
- ✅ Fix violations (add missing classes to `axis-base.css`)
- ✅ Retry commit

---

## 11. Summary

**SINGLE SOURCE OF TRUTH**:

- `axis-theme.css` = All design tokens
- `axis-base.css` = Base styles, utilities, and **intelligence CSS classes**

**CONSTITUTION RULE**:

- Any conflict, duplicate, or overlay = BREAKS TRUTH
- Missing intelligence CSS classes = BREAKS TRUTH
- Validation blocks commits/builds
- Fix violations before proceeding

**Status**: MANDATORY - Enforced via validation

---

**Authority**: This constitution overrides all other design/styling rules.
**Version**: 1.1.0 **Created**: 2026-01-12 **Updated**: 2026-01-13 (Added
Intelligence CSS Classes section)
