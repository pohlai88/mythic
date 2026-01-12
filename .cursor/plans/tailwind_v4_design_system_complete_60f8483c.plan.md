---
name: Tailwind v4 Design System Complete
overview: Build a complete, robust design system based on Tailwind CSS v4 and Next.js best practices, including comprehensive design tokens, full component library, utility functions, and proper TypeScript support.
todos: []
---

# Complete Tailwind v4 Design System Implementation Plan

## Overview

This plan builds a production-ready design system using Tailwind CSS v4's CSS-first configuration and Next.js 16 best practices. The system will be comprehensive, type-safe, and follow ELITE methodology principles.

---

## Architecture Overview

```
packages/design-system/
├── src/
│   ├── tokens/
│   │   ├── input.css          # ✅ Enhanced with complete token system
│   │   ├── tokens.ts           # ✅ TypeScript token exports
│   │   └── types.ts            # ✅ NEW: Type definitions
│   ├── components/
│   │   ├── ui/                 # ✅ NEW: Core UI components
│   │   ├── forms/              # ✅ NEW: Form components
│   │   ├── layout/             # ✅ NEW: Layout components
│   │   ├── feedback/           # ✅ NEW: Feedback components
│   │   └── navigation/         # ✅ NEW: Navigation components
│   ├── lib/
│   │   ├── utils.ts            # ✅ NEW: cn() and class utilities
│   │   ├── variants.ts         # ✅ NEW: Variant system
│   │   └── server.ts            # ✅ NEW: Server component helpers
│   └── hooks/                  # ✅ NEW: React hooks
└── docs/                       # ✅ NEW: Component documentation
```

---

## Phase 1: Enhanced Design Tokens System

### 1.1 Complete Color System

**File**: `packages/design-system/src/tokens/input.css`

**Enhancements**:

- ✅ Keep existing BEASTMODE Gold palette
- ✅ Add complete 50-950 scale for semantic colors (success, warning, error, info)
- ✅ Add neutral grayscale system
- ✅ Add opacity modifiers system
- ✅ Add color utilities for gradients

**Implementation**:

```css
@theme {
  /* Existing BEASTMODE Gold palette - KEEP */
  --color-void: 240 10% 4%;
  --color-obsidian: 240 8% 8%;
  /* ... existing colors ... */

  /* NEW: Complete semantic color scales (50-950) */
  --color-success-50: 142 76% 97%;
  --color-success-100: 142 76% 90%;
  /* ... through 950 ... */
  --color-success-500: 142 76% 47%; /* Base */
  --color-success-950: 142 76% 10%;

  /* NEW: Warning scale */
  --color-warning-50 through --color-warning-950;

  /* NEW: Error scale */
  --color-error-50 through --color-error-950;

  /* NEW: Info scale */
  --color-info-50 through --color-info-950;

  /* NEW: Neutral grayscale */
  --color-neutral-50 through --color-neutral-950;
}
```

### 1.2 Complete Typography System

**Enhancements**:

- ✅ Font size scale (xs to 9xl with rem values)
- ✅ Font weight scale (100-900)
- ✅ Line height scale
- ✅ Letter spacing scale
- ✅ Font family tokens (already exist, enhance)

**Implementation**:

```css
@theme {
  /* Font sizes (rem-based) */
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;      /* 18px */
  --font-size-xl: 1.25rem;       /* 20px */
  --font-size-2xl: 1.5rem;       /* 24px */
  --font-size-3xl: 1.875rem;    /* 30px */
  --font-size-4xl: 2.25rem;      /* 36px */
  --font-size-5xl: 3rem;         /* 48px */
  --font-size-6xl: 3.75rem;      /* 60px */
  --font-size-7xl: 4.5rem;       /* 72px */
  --font-size-8xl: 6rem;        /* 96px */
  --font-size-9xl: 8rem;         /* 128px */

  /* Font weights */
  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Line heights */
  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  /* Letter spacing */
  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;
}
```

### 1.3 Complete Spacing System

**Enhancements**:

- ✅ 4px base unit system (0-96 scale)
- ✅ Container max-widths
- ✅ Gap utilities

**Implementation**:

```css
@theme {
  /* Spacing scale (4px base unit) */
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-0\.5: 0.125rem;  /* 2px */
  --spacing-1: 0.25rem;      /* 4px */
  --spacing-1\.5: 0.375rem;  /* 6px */
  --spacing-2: 0.5rem;       /* 8px */
  /* ... through 96 ... */

  /* Container max-widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

### 1.4 Shadow/Elevation System

**Enhancements**:

- ✅ 8 elevation levels (xs to 2xl)
- ✅ Colored shadows for semantic states
- ✅ Inner shadows

**Implementation**:

```css
@theme {
  /* Shadow elevations */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-base: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);

  /* Colored shadows (semantic) */
  --shadow-primary: 0 10px 15px -3px hsl(var(--color-primary) / 0.3);
  --shadow-success: 0 10px 15px -3px hsl(var(--color-success-500) / 0.3);
  --shadow-error: 0 10px 15px -3px hsl(var(--color-error-500) / 0.3);
}
```

### 1.5 Animation/Transition System

**Enhancements**:

- ✅ Duration scale
- ✅ Timing functions
- ✅ Property-specific transitions
- ✅ Keep existing intelligence-driven transitions

**Implementation**:

```css
@theme {
  /* Durations */
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;      /* Hover (existing) */
  --duration-1618: 1618ms;      /* Commit (existing) */

  /* Timing functions */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-gravity: cubic-bezier(0.4, 0, 0.2, 1); /* Existing */
}
```

### 1.6 TypeScript Token Types

**File**: `packages/design-system/src/tokens/types.ts` (NEW)

**Implementation**:

```typescript
export type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'
export type FontWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
export type Spacing = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64 | 72 | 80 | 96
export type Shadow = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | 'inner'
export type Radius = 'none' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
```

---

## Phase 2: Core Utility Functions

### 2.1 Class Name Utility (cn)

**File**: `packages/design-system/src/lib/utils.ts` (NEW)

**Implementation**:

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Dependencies**: Add `clsx` and `tailwind-merge` to package.json

### 2.2 Variant System

**File**: `packages/design-system/src/lib/variants.ts` (NEW)

**Implementation**:

```typescript
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from './utils'

// Button variants example
export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-gold text-void hover:bg-gold/90',
        destructive: 'bg-error-500 text-white hover:bg-error-600',
        outline: 'border border-charcoal bg-transparent hover:bg-obsidian',
        secondary: 'bg-obsidian text-parchment hover:bg-obsidian/80',
        ghost: 'hover:bg-obsidian hover:text-parchment',
        link: 'text-gold underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
```

**Dependencies**: Add `class-variance-authority` to package.json

---

## Phase 3: Core UI Components

### 3.1 Button Component (Enhanced)

**File**: `packages/design-system/src/components/ui/button.tsx` (NEW)

**Features**:

- ✅ Variant system (default, destructive, outline, secondary, ghost, link)
- ✅ Size variants (sm, default, lg, icon)
- ✅ Loading state
- ✅ Icon support
- ✅ Server/Client component support
- ✅ Accessibility (ARIA attributes)

### 3.2 Input Component

**File**: `packages/design-system/src/components/ui/input.tsx` (NEW)

**Features**:

- ✅ Variants (default, error, success)
- ✅ Sizes (sm, default, lg)
- ✅ Label support
- ✅ Error message display
- ✅ Icon support (left/right)
- ✅ Type-safe props

### 3.3 Textarea Component

**File**: `packages/design-system/src/components/ui/textarea.tsx` (NEW)

**Features**:

- ✅ Auto-resize option
- ✅ Character count
- ✅ Same variants as Input

### 3.4 Select Component

**File**: `packages/design-system/src/components/ui/select.tsx` (NEW)

**Features**:

- ✅ Native select with styling
- ✅ Option groups
- ✅ Searchable select (advanced)
- ✅ Multi-select support (advanced)

### 3.5 Checkbox Component

**File**: `packages/design-system/src/components/ui/checkbox.tsx` (NEW)

**Features**:

- ✅ Controlled/uncontrolled
- ✅ Indeterminate state
- ✅ Label integration
- ✅ Accessibility

### 3.6 Radio Component

**File**: `packages/design-system/src/components/ui/radio.tsx` (NEW)

**Features**:

- ✅ Radio group support
- ✅ Label integration
- ✅ Accessibility

### 3.7 Switch Component

**File**: `packages/design-system/src/components/ui/switch.tsx` (NEW)

**Features**:

- ✅ Toggle functionality
- ✅ Label support
- ✅ Accessibility

### 3.8 Badge Component

**File**: `packages/design-system/src/components/ui/badge.tsx` (NEW)

**Features**:

- ✅ Variants (default, secondary, destructive, outline)
- ✅ Sizes (sm, default)
- ✅ Dot indicator support

### 3.9 Alert Component

**File**: `packages/design-system/src/components/ui/alert.tsx` (NEW)

**Features**:

- ✅ Variants (default, success, warning, error, info)
- ✅ Icon support
- ✅ Dismissible option
- ✅ Title and description

### 3.10 Card Component (Enhanced)

**File**: `packages/design-system/src/components/ui/card.tsx` (NEW)

**Features**:

- ✅ Header, body, footer sections
- ✅ Variants (default, elevated, outlined)
- ✅ Hover effects
- ✅ Clickable option

---

## Phase 4: Layout Components

### 4.1 Container Component

**File**: `packages/design-system/src/components/layout/container.tsx` (NEW)

**Features**:

- ✅ Max-width variants
- ✅ Padding options
- ✅ Centered content

### 4.2 Stack Component

**File**: `packages/design-system/src/components/layout/stack.tsx` (NEW)

**Features**:

- ✅ Vertical/horizontal stacking
- ✅ Gap spacing
- ✅ Alignment options

### 4.3 Grid Component

**File**: `packages/design-system/src/components/layout/grid.tsx` (NEW)

**Features**:

- ✅ Responsive columns
- ✅ Gap spacing
- ✅ Auto-fit/auto-fill

### 4.4 Divider Component

**File**: `packages/design-system/src/components/layout/divider.tsx` (NEW)

**Features**:

- ✅ Horizontal/vertical
- ✅ Text label option
- ✅ Variants (solid, dashed, dotted)

---

## Phase 5: Feedback Components

### 5.1 Loading/Spinner Component

**File**: `packages/design-system/src/components/feedback/loading.tsx` (NEW)

**Features**:

- ✅ Size variants
- ✅ Color variants
- ✅ Text option

### 5.2 Progress Component

**File**: `packages/design-system/src/components/feedback/progress.tsx` (NEW)

**Features**:

- ✅ Linear progress
- ✅ Circular progress (optional)
- ✅ Variants (default, success, error)
- ✅ Indeterminate state

### 5.3 Skeleton Component

**File**: `packages/design-system/src/components/feedback/skeleton.tsx` (NEW)

**Features**:

- ✅ Animated shimmer
- ✅ Size variants
- ✅ Shape variants (text, circle, rectangle)

### 5.4 Toast Component (Enhanced)

**File**: `packages/design-system/src/components/feedback/toast.tsx` (Enhanced)

**Features**:

- ✅ Position variants
- ✅ Duration control
- ✅ Action buttons
- ✅ Stacking support

---

## Phase 6: Navigation Components

### 6.1 Tabs Component

**File**: `packages/design-system/src/components/navigation/tabs.tsx` (NEW)

**Features**:

- ✅ Horizontal/vertical tabs
- ✅ Variants (default, underlined, pills)
- ✅ Keyboard navigation
- ✅ Controlled/uncontrolled

### 6.2 Breadcrumbs Component

**File**: `packages/design-system/src/components/navigation/breadcrumbs.tsx` (NEW)

**Features**:

- ✅ Separator customization
- ✅ Link support
- ✅ Icon support

### 6.3 Pagination Component

**File**: `packages/design-system/src/components/navigation/pagination.tsx` (NEW)

**Features**:

- ✅ Page navigation
- ✅ Page size selector
- ✅ Total count display
- ✅ Ellipsis for large ranges

---

## Phase 7: Data Display Components

### 7.1 Table Component

**File**: `packages/design-system/src/components/data/table.tsx` (NEW)

**Features**:

- ✅ Sortable columns
- ✅ Selectable rows
- ✅ Responsive design
- ✅ Empty state

### 7.2 List Component

**File**: `packages/design-system/src/components/data/list.tsx` (NEW)

**Features**:

- ✅ Ordered/unordered
- ✅ Icon support
- ✅ Nested lists
- ✅ Variants (default, bordered, divided)

### 7.3 Avatar Component

**File**: `packages/design-system/src/components/data/avatar.tsx` (NEW)

**Features**:

- ✅ Image support
- ✅ Fallback initials
- ✅ Size variants
- ✅ Group display

### 7.4 Tooltip Component

**File**: `packages/design-system/src/components/data/tooltip.tsx` (NEW)

**Features**:

- ✅ Position variants
- ✅ Delay options
- ✅ Arrow support
- ✅ Accessibility

### 7.5 Popover Component

**File**: `packages/design-system/src/components/data/popover.tsx` (NEW)

**Features**:

- ✅ Trigger variants
- ✅ Position control
- ✅ Portal rendering
- ✅ Accessibility

---

## Phase 8: Advanced Components

### 8.1 Modal/Dialog Component

**File**: `packages/design-system/src/components/ui/modal.tsx` (NEW)

**Features**:

- ✅ Size variants
- ✅ Backdrop blur
- ✅ Close on escape
- ✅ Focus trap
- ✅ Portal rendering

### 8.2 Dropdown Menu Component

**File**: `packages/design-system/src/components/ui/dropdown.tsx` (NEW)

**Features**:

- ✅ Trigger variants
- ✅ Position control
- ✅ Submenu support
- ✅ Keyboard navigation

### 8.3 Accordion Component

**File**: `packages/design-system/src/components/ui/accordion.tsx` (NEW)

**Features**:

- ✅ Single/multiple open
- ✅ Icon customization
- ✅ Animated transitions

---

## Phase 9: Form Components & Helpers

### 9.1 Form Field Component

**File**: `packages/design-system/src/components/forms/field.tsx` (NEW)

**Features**:

- ✅ Label integration
- ✅ Error display
- ✅ Help text
- ✅ Required indicator

### 9.2 Form Group Component

**File**: `packages/design-system/src/components/forms/group.tsx` (NEW)

**Features**:

- ✅ Field grouping
- ✅ Spacing control
- ✅ Validation state

### 9.3 Label Component

**File**: `packages/design-system/src/components/forms/label.tsx` (NEW)

**Features**:

- ✅ Required indicator
- ✅ Error state styling
- ✅ Accessibility

---

## Phase 10: React Hooks

### 10.1 useMediaQuery Hook

**File**: `packages/design-system/src/hooks/use-media-query.ts` (NEW)

**Purpose**: Responsive design detection

### 10.2 useClickOutside Hook

**File**: `packages/design-system/src/hooks/use-click-outside.ts` (NEW)

**Purpose**: Close modals/dropdowns on outside click

### 10.3 useDebounce Hook

**File**: `packages/design-system/src/hooks/use-debounce.ts` (NEW)

**Purpose**: Debounce values for search/input

---

## Phase 11: Server Component Helpers

### 11.1 Server Utilities

**File**: `packages/design-system/src/lib/server.ts` (NEW)

**Implementation**:

```typescript
export function isServerComponent() {
  return typeof window === 'undefined'
}

export function getServerSideProps() {
  // Helper for server-side data fetching
}
```

---

## Phase 12: Documentation

### 12.1 Component Documentation

**Structure**:

```
packages/design-system/docs/
├── components/
│   ├── button.mdx
│   ├── input.mdx
│   └── ...
├── tokens/
│   ├── colors.mdx
│   ├── typography.mdx
│   └── ...
└── guides/
    ├── getting-started.mdx
    └── best-practices.mdx
```

**Content**:

- ✅ Usage examples
- ✅ API reference
- ✅ Variant documentation
- ✅ Accessibility notes
- ✅ Code examples

---

## Phase 13: Build & Export Configuration

### 13.1 Package Exports

**File**: `packages/design-system/package.json`

**Enhancements**:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./tokens": "./src/tokens.ts",
    "./components": "./src/components/index.ts",
    "./components/ui/*": "./src/components/ui/*.tsx",
    "./lib/utils": "./src/lib/utils.ts",
    "./lib/variants": "./src/lib/variants.ts",
    "./hooks": "./src/hooks/index.ts"
  }
}
```

### 13.2 TypeScript Configuration

**File**: `packages/design-system/tsconfig.json`

**Ensure**:

- ✅ Strict mode enabled
- ✅ Path aliases configured
- ✅ React types included

---

## Implementation Checklist

### Design Tokens ✅

- [x] Existing BEASTMODE Gold palette (keep)
- [ ] Complete semantic color scales (50-950)
- [ ] Complete typography system
- [ ] Complete spacing system
- [ ] Shadow/elevation system
- [ ] Animation/transition system
- [ ] TypeScript token types

### Utilities ✅

- [ ] cn() function (clsx + tailwind-merge)
- [ ] Variant system (cva)
- [ ] Server component helpers

### Core UI Components ✅

- [x] Button (enhance existing)
- [x] Card (enhance existing)
- [ ] Input
- [ ] Textarea
- [ ] Select
- [ ] Checkbox
- [ ] Radio
- [ ] Switch
- [ ] Badge
- [ ] Alert
- [x] Toast (enhance existing)

### Layout Components ✅

- [ ] Container
- [ ] Stack
- [ ] Grid
- [ ] Divider

### Feedback Components ✅

- [ ] Loading/Spinner
- [ ] Progress
- [ ] Skeleton
- [x] Toast (enhance existing)

### Navigation Components ✅

- [ ] Tabs
- [ ] Breadcrumbs
- [ ] Pagination

### Data Display Components ✅

- [ ] Table
- [ ] List
- [ ] Avatar
- [ ] Tooltip
- [ ] Popover

### Advanced Components ✅

- [ ] Modal/Dialog
- [ ] Dropdown Menu
- [ ] Accordion

### Form Components ✅

- [ ] Form Field
- [ ] Form Group
- [ ] Label

### Hooks ✅

- [ ] useMediaQuery
- [ ] useClickOutside
- [ ] useDebounce

### Documentation ✅

- [ ] Component docs
- [ ] Token docs
- [ ] Getting started guide
- [ ] Best practices guide

---

## Dependencies to Add

```json
{
  "dependencies": {
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "class-variance-authority": "^0.7.0"
  }
}
```

---

## What Is Done

✅ **Existing Foundation**:

- Tailwind v4 CSS-first configuration
- BEASTMODE Gold color palette
- Basic design tokens (colors, fonts, border-radius)
- Intelligence-driven utilities
- Dark mode support
- Basic components (Button, Card, Toast)
- Domain-specific theming system

✅ **Architecture**:

- Monorepo structure
- Package exports configured
- PostCSS build process
- Handoff integration ready

---

## What Is Omitted (By Design)

❌ **Not Included**:

- Complex data visualization components (charts, graphs)
- Rich text editor components
- Date picker (use external library)
- File upload components (use external library)
- Calendar components (use external library)
- Advanced table features (sorting, filtering logic - implement in apps)

**Rationale**: These are domain-specific or require specialized libraries. The design system provides the foundation; apps extend with domain logic.

---

## Next Steps After Implementation

1. **Testing**: Add unit tests for components
2. **Storybook**: Set up component documentation (optional)
3. **Accessibility Audit**: Ensure WCAG 2.1 AA compliance
4. **Performance**: Optimize bundle size
5. **Migration Guide**: Document migration from existing components

---

## Success Criteria

✅ Complete design token system (colors, typography, spacing, shadows, animations)

✅ Full component library (30+ components)

✅ Type-safe utilities and variants

✅ Next.js 16 Server/Client component support

✅ Accessibility compliance (WCAG 2.1 AA)

✅ Comprehensive documentation

✅ Zero custom CSS (except intelligence utilities)

✅ Tailwind v4 CSS-first approach maintained
