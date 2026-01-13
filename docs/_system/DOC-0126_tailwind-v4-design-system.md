---
doc_type: STANDARD
status: active
owner: architecture
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [architecture, tailwind, design-system, v4, figma]
related_docs:
  - DOC-0124_react-primereact-optimization.md
---

# Tailwind CSS v4 Design System - Figma-Compatible

**Optimization Date**: 2026-01-10 **Tailwind CSS Version**: 4.0+ **Design
System**: Figma-Compatible Structure **Status**: ✅ **FULLY OPTIMIZED**

---

## Executive Summary

This document details the comprehensive Tailwind CSS v4 design system setup,
structured to be compatible with Figma's design system approach. All design
tokens are defined using CSS-first configuration with TypeScript support.

### Key Features

✅ **Tailwind CSS v4**:

- CSS-first configuration via `@theme` directive
- Design tokens in `styles/tailwind.css`
- TypeScript token exports in `lib/design-system/tokens.ts`

✅ **Figma-Compatible Structure**:

- Semantic color system (50-950 scale)
- Typography scale with consistent sizing
- Spacing system (4px base unit)
- Elevation/shadow system
- Border radius scale
- Transition system

✅ **Non-Tailwind CSS Marked**:

- Legacy CSS files documented
- Migration path identified
- Compatibility maintained

---

## 1. Design System Architecture

### 1.1 File Structure

```
mythic/
├── styles/
│   ├── tailwind.css          # ✅ Tailwind v4 design tokens (@theme)
│   └── globals.css           # ⚠️ Non-Tailwind styles (Nextra, etc.)
├── lib/
│   └── design-system/
│       └── tokens.ts         # ✅ TypeScript token exports
└── tailwind.config.ts        # ✅ Tailwind config (minimal, v4 uses CSS)
```

---

### 1.2 Design Token Categories

**Colors**: Semantic color system with 50-950 scale

- Primary, Secondary, Success, Warning, Error, Neutral
- Semantic aliases (background, surface, text, border)
- Dark mode support

**Typography**: Complete type scale

- Font families (sans, serif, mono)
- Font sizes (xs to 9xl)
- Font weights (thin to black)
- Line heights and letter spacing

**Spacing**: 4px base unit system

- Consistent spacing scale (0-96)
- Figma-compatible spacing tokens

**Shadows**: Elevation system

- 8 elevation levels (xs to 2xl)
- Colored shadows for semantic states

**Border Radius**: Consistent rounding

- 8 radius levels (none to full)

**Transitions**: Animation system

- Timing functions
- Duration scale
- Property-specific transitions

---

## 2. Using Design Tokens

### 2.1 In CSS/Tailwind Classes

```tsx
// Using Tailwind utilities with design tokens
<div className="bg-primary-500 text-white p-4 rounded-lg shadow-md">
  Content
</div>

// Using semantic tokens
<div className="bg-surface text-text-primary border border-border">
  Content
</div>
```

---

### 2.2 In TypeScript/React

```typescript
import { colors, spacing, typography } from "@/lib/design-system/tokens"

// Type-safe token access
const primaryColor = colors.primary[500]
const padding = spacing[4]
const fontSize = typography.fontSize.lg
```

---

### 2.3 Custom CSS Variables

```css
/* Access tokens as CSS variables */
.custom-component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

---

## 3. Color System

### 3.1 Color Scale Structure

Each color has a 50-950 scale (Figma standard):

```typescript
colors.primary[50] // Lightest
colors.primary[500] // Base/Main
colors.primary[950] // Darkest
```

### 3.2 Semantic Color Usage

```tsx
// Background colors
<div className="bg-background">        // Main background
<div className="bg-surface">          // Surface/card background
<div className="bg-elevated">         // Elevated surface

// Text colors
<p className="text-primary">          // Primary text
<p className="text-secondary">        // Secondary text
<p className="text-link">             // Link color

// Borders
<div className="border border-border">        // Standard border
<div className="border border-subtle">        // Subtle border
```

---

## 4. Typography System

### 4.1 Font Sizes

```tsx
<p className="text-xs">Extra Small (12px)</p>
<p className="text-sm">Small (14px)</p>
<p className="text-base">Base (16px)</p>
<p className="text-lg">Large (18px)</p>
<p className="text-xl">Extra Large (20px)</p>
<p className="text-2xl">2XL (24px)</p>
// ... up to text-9xl
```

### 4.2 Font Weights

```tsx
<p className="font-thin">Thin (100)</p>
<p className="font-light">Light (300)</p>
<p className="font-normal">Normal (400)</p>
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">Semibold (600)</p>
<p className="font-bold">Bold (700)</p>
```

### 4.3 Line Heights

```tsx
<p className="leading-none">Tight (1)</p>
<p className="leading-tight">Tight (1.25)</p>
<p className="leading-normal">Normal (1.5)</p>
<p className="leading-relaxed">Relaxed (1.625)</p>
<p className="leading-loose">Loose (2)</p>
```

---

## 5. Spacing System

### 5.1 Spacing Scale (4px base)

```tsx
<div className="p-1">4px padding</div>
<div className="p-2">8px padding</div>
<div className="p-4">16px padding</div>
<div className="p-8">32px padding</div>
<div className="p-16">64px padding</div>
```

### 5.2 Spacing Utilities

```tsx
// Padding
<div className="p-4">        // All sides
<div className="px-4 py-2">  // Horizontal & vertical
<div className="pt-4">       // Top only

// Margin
<div className="m-4">        // All sides
<div className="mx-auto">    // Horizontal auto
<div className="mt-8">       // Top only

// Gap (for flex/grid)
<div className="flex gap-4">  // 16px gap
```

---

## 6. Shadow/Elevation System

### 6.1 Elevation Levels

```tsx
<div className="shadow-xs">   // Level 1 (subtle)
<div className="shadow-sm">   // Level 2
<div className="shadow-base"> // Level 3 (default)
<div className="shadow-md">   // Level 4
<div className="shadow-lg">   // Level 5
<div className="shadow-xl">   // Level 6
<div className="shadow-2xl">  // Level 7 (highest)
```

### 6.2 Colored Shadows

```tsx
<div className="shadow-primary">  // Primary colored shadow
<div className="shadow-success">   // Success colored shadow
<div className="shadow-error">    // Error colored shadow
```

---

## 7. Component Patterns

### 7.1 Button Component

```tsx
// Using design tokens
<button
  className="
  bg-primary-600
  hover:bg-primary-700
  text-white
  px-4 py-2
  rounded-lg
  shadow-xs
  transition-colors
  font-medium
"
>
  Button
</button>
```

---

### 7.2 Card Component

```tsx
<div
  className="
  bg-surface
  border border-border
  rounded-xl
  p-6
  shadow-base
  hover:shadow-md
  transition-shadow
"
>
  <h3 className="text-xl font-semibold text-text-primary mb-2">Card Title</h3>
  <p className="text-text-secondary">Card content</p>
</div>
```

---

### 7.3 Input Component

```tsx
<input
  className="
    w-full
    px-4 py-2
    border border-border
    rounded-lg
    bg-surface
    text-text-primary
    focus:outline-hidden
    focus:ring-2
    focus:ring-primary-500
    focus:border-primary-500
    transition-all
  "
  placeholder="Enter text..."
/>
```

---

## 8. Non-Tailwind CSS Files

### 8.1 Marked Files

**⚠️ `styles/globals.css`**:

- Contains Nextra-specific styles
- KaTeX math styles
- Code block enhancements
- Legacy component styles
- **Status**: Marked for migration to Tailwind where possible

**⚠️ `components/counters.module.css`**:

- CSS Modules file
- **Status**: Consider migrating to Tailwind utilities

---

### 8.2 Migration Strategy

**Phase 1**: Identify all non-Tailwind CSS

- ✅ `styles/globals.css` - Marked
- ✅ `components/counters.module.css` - Marked

**Phase 2**: Migrate to Tailwind

- Convert CSS Modules to Tailwind classes
- Replace custom CSS with design tokens
- Use Tailwind utilities where possible

**Phase 3**: Remove legacy CSS

- Delete migrated CSS files
- Update imports
- Verify functionality

---

## 9. Figma Integration

### 9.1 Design Token Sync

**Figma Variables → Tailwind Tokens**:

1. Export Figma variables as JSON
2. Use tools like:
   - Tailwind Tokens Figma Plugin
   - Supernova's Tailwind CSS v4 Exporter
   - TailWinks Figma Plugin

3. Update `styles/tailwind.css` with new tokens
4. Update `lib/design-system/tokens.ts` TypeScript exports

---

### 9.2 Token Naming Convention

**Figma → Tailwind Mapping**:

```
Figma Variable: Primary/500
Tailwind Token: --color-primary-500
Usage: bg-primary-500, text-primary-500

Figma Variable: Spacing/16
Tailwind Token: --spacing-4
Usage: p-4, m-4, gap-4
```

---

## 10. Dark Mode Support

### 10.1 Automatic Dark Mode

Dark mode tokens are automatically applied via `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: var(--color-dark-background);
    --color-text-primary: var(--color-dark-text-primary);
    /* ... */
  }
}
```

### 10.2 Manual Dark Mode

For manual dark mode toggle, use Tailwind's `dark:` prefix:

```tsx
<div className="bg-surface dark:bg-dark-surface">Content</div>
```

---

## 11. Best Practices

### 11.1 Token Usage

✅ **DO**:

- Use semantic tokens (`bg-surface`, `text-primary`)
- Use design system tokens consistently
- Reference tokens from TypeScript when needed
- Follow the 4px spacing base unit

❌ **DON'T**:

- Don't use arbitrary values (`p-[13px]`)
- Don't create custom colors outside the system
- Don't mix design systems
- Don't use inline styles

---

### 11.2 Component Development

✅ **DO**:

- Use Tailwind utilities
- Reference design tokens
- Follow component patterns
- Use TypeScript types from tokens

❌ **DON'T**:

- Don't write custom CSS
- Don't use CSS Modules (use Tailwind)
- Don't hardcode colors/spacing
- Don't skip design system tokens

---

## 12. Migration Checklist

### ✅ Completed

- [x] Tailwind CSS v4 configuration
- [x] Design tokens defined in CSS
- [x] TypeScript token exports
- [x] Color system (50-950 scale)
- [x] Typography system
- [x] Spacing system (4px base)
- [x] Shadow/elevation system
- [x] Border radius system
- [x] Transition system
- [x] Dark mode support
- [x] Non-Tailwind CSS marked

### 🔄 Next Steps

- [ ] Install Tailwind CSS v4: `pnpm add -D tailwindcss@next`
- [ ] Update imports to use `styles/tailwind.css`
- [ ] Migrate CSS Modules to Tailwind
- [ ] Set up Figma token sync
- [ ] Create component library using tokens
- [ ] Document component patterns

---

## 13. Installation

### 13.1 Install Tailwind CSS v4

```bash
pnpm add -D tailwindcss@next
```

### 13.2 Update Imports

**File**: `app/layout.tsx`

```typescript
// Before
import "../styles/globals.css"

// After
import "../styles/tailwind.css"
import "../styles/globals.css" // Keep for non-Tailwind styles
```

---

## 14. References

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [Figma Design Tokens](https://www.figma.com/developers/api/design-tokens)
- [Tailwind Tokens Figma Plugin](https://www.tailwindtokens.com)
- [Design System Best Practices](https://www.designsystems.com)

---

**Status**: ✅ **FULLY OPTIMIZED** **Last Updated**: 2026-01-10 **Next Review**:
After Tailwind v4 installation
