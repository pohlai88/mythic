# Tailwind Design Tokens Reference

**Version**: 1.0.0
**Last Updated**: 2026-01-11
**Status**: ✅ **Active**

---

## Overview

Complete reference for all design tokens available in the `@mythic/design-system` package. All tokens are defined using Tailwind CSS v4's CSS-first configuration via the `@theme` directive.

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Border Radius](#border-radius)
4. [Intelligence-Driven Utilities](#intelligence-driven-utilities)
5. [Usage Examples](#usage-examples)
6. [Auto-Generated Utilities](#auto-generated-utilities)

---

## Color System

### BEASTMODE Gold Palette

The primary brand color palette representing material states, not UI states.

#### Primary Palette (Material Truth)

```css
--color-void: 240 10% 4%;        /* Absence / Authority - Deepest black */
--color-obsidian: 240 8% 8%;      /* Surface / Weight - Dark surface */
--color-charcoal: 240 3% 17%;     /* Border / Divider - Subtle border */
```

#### Accent Palette (BEASTMODE Gold)

```css
--color-parchment: 40 20% 96%;    /* Knowledge - Warm off-white (NOT pure white) */
--color-ash: 40 10% 82%;          /* Commentary - Neutral gray */
--color-gold: 40 45% 55%;         /* Ratified Authority - Primary accent */
--color-ember: 35 40% 45%;        /* Consequence - Secondary accent */
```

#### Semantic Color Mappings

```css
--color-primary: var(--color-gold);
--color-secondary: var(--color-ember);
--color-background: var(--color-void);
--color-surface: var(--color-obsidian);
--color-text: var(--color-parchment);
--color-text-muted: var(--color-ash);
--color-border: var(--color-charcoal);
```

### Full Color Scale System

For apps that need complete 50-950 scales:

#### Primary Colors
```css
--color-primary-50 through --color-primary-950
```

#### Secondary Colors
```css
--color-secondary-50 through --color-secondary-950
```

#### Semantic Colors
- **Success**: `--color-success-50` through `--color-success-950`
- **Warning**: `--color-warning-50` through `--color-warning-950`
- **Error**: `--color-error-50` through `--color-error-950`
- **Neutral**: `--color-neutral-50` through `--color-neutral-950`

### Usage in Components

```tsx
// Background colors
<div className="bg-void">        {/* Deepest black */}
<div className="bg-obsidian">    {/* Dark surface */}
<div className="bg-gold">        {/* Primary accent */}

// Text colors
<p className="text-parchment">  {/* Primary text */}
<p className="text-ash">         {/* Muted text */}
<p className="text-gold">        {/* Accent text */}

// Border colors
<div className="border border-charcoal">  {/* Subtle border */}
<div className="border border-gold">      {/* Accent border */}

// Opacity modifiers (Tailwind v4 feature)
<div className="bg-void/50">     {/* 50% opacity */}
<div className="text-gold/75">   {/* 75% opacity */}
```

### Dark Mode

Dark mode variants are automatically applied when using the `.dark` class:

```css
.dark {
  --color-void: 240 10% 2%;      /* Even darker */
  --color-obsidian: 240 8% 4%;
  --color-parchment: 40 20% 10%;  /* Darker text */
  --color-gold: 40 45% 65%;       /* Brighter gold */
  /* ... */
}
```

---

## Typography

### Font Families

#### System Fonts (Default)
```css
--font-family-sans: ui-sans-serif, system-ui, ...;
--font-family-serif: ui-serif, Georgia, ...;
--font-family-mono: ui-monospace, SFMono-Regular, ...;
```

#### Custom Fonts
```css
--font-family-serif-custom: 'Cormorant Garamond', serif;
--font-family-sans-custom: 'Inter', sans-serif;
--font-family-mono-custom: 'JetBrains Mono', monospace;
```

### Usage

```tsx
// Serif (Editorial Authority)
<h1 className="font-serif">Heading</h1>

// Sans-serif (Modern Authority)
<p className="font-sans">Body text</p>

// Monospace (Forensic Data)
<code className="font-mono">Code or numbers</code>
```

---

## Border Radius

### Available Values

```css
--radius-none: 0;                /* 0px - No rounding */
--radius-xs: 0.0625rem;          /* 1px - Minimal rounding */
--radius-sm: 0.125rem;           /* 2px */
--radius-base: 0.25rem;          /* 4px */
--radius-md: 0.375rem;           /* 6px */
--radius-lg: 0.5rem;             /* 8px */
--radius-xl: 0.75rem;            /* 12px */
--radius-2xl: 1rem;              /* 16px */
--radius-3xl: 1.5rem;            /* 24px */
--radius-full: 9999px;           /* Fully rounded (circle) */
```

### Usage Patterns

**Most Common**: `rounded-xs` (1px) - Used extensively for buttons, inputs, badges
```tsx
<button className="rounded-xs">Button</button>
<input className="rounded-xs" />
<span className="px-2 py-1 rounded-xs">Badge</span>
```

**Other Common**:
- `rounded-full` - Circular elements (avatars, spinners)
- `rounded-lg` - Cards, containers

### Usage Statistics

Based on codebase analysis:
- `rounded-xs`: **41 uses** (most common)
- `rounded-full`: Used for circular elements
- `rounded-lg`: Used for cards/containers
- Other sizes: Less frequently used

---

## Intelligence-Driven Utilities

### Risk Status Utilities

Context-aware styling based on variance percentages and risk assessment.

```tsx
// Risk-based styling
<div className="risk-on-track">   {/* On track */}
<div className="risk-warning">    {/* Warning threshold */}
<div className="risk-overrun">    {/* Over budget */}
<div className="risk-underrun">   {/* Under budget */}
<div className="risk-critical">   {/* Critical threshold */}
```

### Status-Based Utilities

Proposal and document status styling.

```tsx
// Status-based styling
<span className="status-draft">      {/* DRAFT */}
<span className="status-listening">  {/* LISTENING */}
<span className="status-approved">   {/* APPROVED */}
<span className="status-vetoed">      {/* VETOED */}
<span className="status-archived">    {/* ARCHIVED */}
```

### Priority Utilities

Priority level indicators.

```tsx
<span className="priority-high">    {/* HIGH priority */}
<span className="priority-medium">  {/* MEDIUM priority */}
<span className="priority-low">     {/* LOW priority */}
```

### Transition Utilities

Axis Visual Canon compliant transitions.

```tsx
// Hover transitions (700ms)
<div className="transition-hover-intelligent">Hover me</div>

// Illuminate transitions (1200ms)
<div className="transition-illuminate">Illuminated</div>

// Commit transitions (1618ms - Golden ratio)
<div className="transition-commit">Committed action</div>
```

### Gradient Utilities

Intelligence-driven gradients.

```tsx
<div className="gradient-approved">  {/* Approved gradient */}
<div className="gradient-vetoed">    {/* Vetoed gradient */}
<div className="gradient-warning">   {/* Warning gradient */}
<div className="gradient-success">   {/* Success gradient */}
<div className="gradient-neutral">   {/* Neutral gradient */}
```

### Vector Utilities

Tri-vector display utilities (past, present, future).

```tsx
<div className="vector-past">    {/* Past vector */}
<div className="vector-present"> {/* Present vector */}
<div className="vector-future">  {/* Future vector */}
```

---

## Auto-Generated Utilities

### How It Works

Tailwind v4 **automatically generates** utilities from `@theme` color definitions. You do NOT need to define them manually.

### Auto-Generated Color Utilities

All colors defined in `@theme` automatically create utilities:

**Background**:
- `bg-void`, `bg-obsidian`, `bg-charcoal`
- `bg-parchment`, `bg-ash`, `bg-gold`, `bg-ember`
- `bg-primary-50` through `bg-primary-950`
- `bg-success-*`, `bg-warning-*`, `bg-error-*`, `bg-neutral-*`

**Text**:
- `text-parchment`, `text-ash`, `text-gold`, `text-ember`
- `text-primary-*`, `text-success-*`, etc.

**Border**:
- `border-charcoal`, `border-gold`
- `border-primary-*`, etc.

### Opacity Modifiers

All color utilities support opacity modifiers:

```tsx
<div className="bg-void/50">      {/* 50% opacity */}
<div className="text-gold/75">     {/* 75% opacity */}
<div className="border-charcoal/30"> {/* 30% opacity */}
```

### Variants

All utilities work with Tailwind variants:

```tsx
<div className="hover:bg-gold">        {/* Hover state */}
<div className="dark:bg-void">         {/* Dark mode */}
<div className="focus:border-gold">   {/* Focus state */}
<div className="lg:text-parchment">   {/* Responsive */}
```

---

## Usage Examples

### Complete Component Example

```tsx
import { intelligentStatusStyles } from '@mythic/shared-utils'

function ProposalCard({ proposal }) {
  return (
    <div className="bg-obsidian border border-charcoal rounded-lg p-4">
      <h3 className="font-serif text-parchment text-lg mb-2">
        {proposal.title}
      </h3>

      <span className={intelligentStatusStyles(proposal.status, 'badge', 'px-2 py-1 rounded-xs text-xs')}>
        {proposal.status}
      </span>

      <p className="text-ash text-sm mt-2">
        {proposal.description}
      </p>

      <button className="mt-4 px-4 py-2 bg-gold text-void rounded-xs font-mono text-sm hover:bg-ember transition-hover-intelligent">
        View Details
      </button>
    </div>
  )
}
```

### Form Input Example

```tsx
<input
  type="text"
  className="w-full bg-obsidian border border-charcoal rounded-xs px-3 py-2 text-parchment text-sm focus:outline-hidden focus:border-gold transition-hover-intelligent"
  placeholder="Enter text..."
/>
```

### Badge Example

```tsx
<span className="px-2 py-1 bg-obsidian border border-gold rounded-xs text-gold text-xs font-mono">
  Badge
</span>
```

---

## TypeScript Support

### Importing Tokens

```typescript
import { colors, typography, spacing, borderRadius } from '@mythic/design-system/tokens'

// Type-safe access
const primaryColor = colors.gold
const fontSize = typography.modern.fontSize
```

### Type Exports

```typescript
import type { ColorName, Spacing, BorderRadius } from '@mythic/design-system/tokens'
```

---

## Best Practices

### ✅ DO

- Use semantic color names (`bg-void`, `text-parchment`) for brand consistency
- Use intelligence-driven utilities for context-aware styling
- Leverage opacity modifiers (`bg-void/50`) for transparency
- Use `rounded-xs` for most UI elements (buttons, inputs, badges)
- Use `transition-hover-intelligent` for interactive elements

### ❌ DON'T

- Don't define simple color utilities with `@utility` (Tailwind auto-generates)
- Don't use hardcoded colors (use design tokens)
- Don't mix color systems (stick to BEASTMODE Gold palette)
- Don't use `@utility` for simple mappings (let Tailwind generate)

---

## Migration Guide

### From Custom CSS Variables

**Before**:
```css
:root {
  --color-void: #0a0a0b;
}
```

**After**:
```css
@theme {
  --color-void: 240 10% 4%;  /* HSL format */
}
```

### From Tailwind v3

**Before** (v3):
```tsx
<div className="bg-[#0a0a0b]">
```

**After** (v4):
```tsx
<div className="bg-void">  {/* Auto-generated from @theme */}
```

---

## File Locations

- **Source**: `packages/design-system/src/tokens/input.css`
- **Compiled**: `packages/design-system/src/tokens/style.css`
- **TypeScript**: `packages/design-system/src/tokens.ts`
- **Documentation**: `packages/design-system/src/tokens/README.md`

---

## Handoff Integration

### Syncing from Figma

Design tokens can be synced from Figma using Handoff CLI:

```bash
# Sync tokens from Figma
pnpm tokens:sync

# Validate synced tokens
pnpm tokens:validate

# Update CSS (convert HEX → HSL)
pnpm tokens:update-css

# Rebuild CSS
pnpm tokens:rebuild

# Complete workflow
pnpm tokens:full-sync
```

**See**: [Handoff Integration Guide](../guides/HANDOFF_INTEGRATION.md) for complete setup and usage.

---

## Related Documentation

- [Handoff Integration Guide](../guides/HANDOFF_INTEGRATION.md) - Figma → Code sync
- [Tailwind Intelligence-Driven Styling](./TAILWIND_INTELLIGENCE_DRIVEN.md)
- [Design System Architecture](../architecture/DESIGN_SYSTEM.md)
- [Tailwind v4 Quick Start](../_system/DOC-0127_tailwind-v4-quick-start.md)

---

## Support

For questions or issues:
1. Check this reference guide
2. Review `packages/design-system/src/tokens/README.md`
3. Consult Tailwind v4 documentation: https://tailwindcss.com/docs/v4-beta

---

**Last Updated**: 2026-01-11
**Maintained By**: Architecture Team
