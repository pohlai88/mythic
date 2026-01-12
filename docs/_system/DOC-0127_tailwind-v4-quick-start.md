---
doc_type: GUIDE
status: active
owner: architecture
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [guide, tailwind, design-system, quick-start]
related_docs:
  - DOC-0126_tailwind-v4-design-system.md
---

# Tailwind CSS v4 Quick Start Guide

**Quick reference** for using the Tailwind CSS v4 design system.

---

## Installation

```bash
pnpm add -D tailwindcss@next
```

---

## Design Tokens Usage

### Colors

```tsx
// Primary colors
<div className="bg-primary-500 text-white">Primary</div>

// Semantic colors
<div className="bg-surface text-text-primary border border-border">
  Surface
</div>

// Color scale (50-950)
<div className="bg-primary-50">Lightest</div>
<div className="bg-primary-500">Base</div>
<div className="bg-primary-950">Darkest</div>
```

### Typography

```tsx
// Font sizes
<p className="text-xs">12px</p>
<p className="text-sm">14px</p>
<p className="text-base">16px</p>
<p className="text-lg">18px</p>
<p className="text-xl">20px</p>
<p className="text-2xl">24px</p>

// Font weights
<p className="font-normal">Normal</p>
<p className="font-medium">Medium</p>
<p className="font-semibold">Semibold</p>
<p className="font-bold">Bold</p>

// Line heights
<p className="leading-tight">Tight</p>
<p className="leading-normal">Normal</p>
<p className="leading-relaxed">Relaxed</p>
```

### Spacing (4px base)

```tsx
// Padding
<div className="p-1">4px</div>
<div className="p-2">8px</div>
<div className="p-4">16px</div>
<div className="p-8">32px</div>

// Margin
<div className="m-4">16px margin</div>
<div className="mx-auto">Auto horizontal</div>

// Gap
<div className="flex gap-4">16px gap</div>
```

### Shadows (Elevation)

```tsx
<div className="shadow-xs">Level 1</div>
<div className="shadow-sm">Level 2</div>
<div className="shadow-base">Level 3</div>
<div className="shadow-md">Level 4</div>
<div className="shadow-lg">Level 5</div>
<div className="shadow-xl">Level 6</div>
<div className="shadow-2xl">Level 7</div>
```

### Border Radius

```tsx
<div className="rounded-xs">2px</div>
<div className="rounded-md">6px</div>
<div className="rounded-lg">8px</div>
<div className="rounded-xl">12px</div>
<div className="rounded-2xl">16px</div>
<div className="rounded-full">Full</div>
```

---

## Component Examples

### Button

```tsx
import { Button } from '@/components/design-system'

<Button variant="primary" size="md">
  Click Me
</Button>
```

### Card

```tsx
import { Card } from '@/components/design-system'

<Card elevation="md" padding="lg" hover>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

---

## TypeScript Token Access

```typescript
import { colors, spacing, typography } from '@/lib/design-system/tokens'

const primaryColor = colors.primary[500]
const padding = spacing[4]
const fontSize = typography.fontSize.lg
```

---

## File Locations

- **Design Tokens (CSS)**: `styles/tailwind.css`
- **Design Tokens (TS)**: `lib/design-system/tokens.ts`
- **Components**: `components/design-system/`
- **Non-Tailwind CSS**: See `NON_TAILWIND_CSS.md`

---

## Quick Reference

| Category    | Token Range | Example          |
| ----------- | ----------- | ---------------- |
| Colors      | 50-950      | `bg-primary-500` |
| Spacing     | 0-96        | `p-4` (16px)     |
| Font Size   | xs-9xl      | `text-lg`        |
| Font Weight | thin-black  | `font-semibold`  |
| Shadows     | xs-2xl      | `shadow-md`      |
| Radius      | none-full   | `rounded-lg`     |

---

**See**: [DOC-0126_tailwind-v4-design-system.md](./DOC-0126_tailwind-v4-design-system.md) for complete documentation.
