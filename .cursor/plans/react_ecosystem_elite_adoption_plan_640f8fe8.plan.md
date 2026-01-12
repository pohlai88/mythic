---
name: React Ecosystem ELITE Adoption Plan (Next.js 16 Optimized)
overview: Comprehensive analysis of React ecosystem libraries with Next.js 16+ Server Components integration, Handoff design tokens, Tailwind v4 optimization, Diataxis documentation structure, and a KISS/DRY-based adoption strategy for achieving world-class ELITE practices in the workspace.
todos:
  - id: create-design-tokens
    content: Create Handoff-compatible design tokens system (colors, spacing, typography, shadows) with Tailwind v4 CSS variables
    status: pending
  - id: create-design-system-structure
    content: Create packages/design-system with Next.js 16 Server/Client component structure following KISS/DRY principles
    status: pending
  - id: implement-core-server-components
    content: Implement 5 Server Components (Card, Table, Form wrapper, Badge, Separator) - zero JS by default
    status: pending
  - id: implement-core-client-components
    content: Implement 5 Client Components (Button, Input, Dialog, Select, Toast) - interactivity required
    status: pending
  - id: update-nextjs-config
    content: Add @mythic/design-system to optimizePackageImports in next.config.mjs for both apps
    status: pending
  - id: create-migration-guide
    content: Create PrimeReact → Radix UI migration guide with Server/Client component examples
    status: pending
  - id: migrate-boardroom-app
    content: Migrate apps/boardroom to use shared design system with Server Components optimization
    status: pending
  - id: setup-diataxis-docs
    content: Set up Diataxis documentation structure (tutorials, how-to, reference, explanation) in apps/docs
    status: pending
  - id: performance-benchmarking
    content: Measure bundle size, Server Component ratio, and performance improvements after migration
    status: pending
---

# React Ecosystem: Functions, Features & ELITE Adoption Strategy

## Executive Summary

This plan provides a comprehensive analysis of React ecosystem libraries optimized for **Next.js 16+** with:

- **Server Components** by default (zero JS shipped)
- **Handoff design tokens** integration (Figma → Code workflow)
- **Tailwind CSS v4** with CSS variables
- **Diataxis documentation** framework (tutorials, how-to, reference, explanation)
- **KISS/DRY principles** throughout

**Key Innovation**: Server/Client component architecture that maximizes Next.js 16 capabilities while maintaining simplicity and reusability.

---

## 1. React Ecosystem Libraries Overview

### 1.1 React (Core Library)

**Purpose**: JavaScript library for building user interfaces

**Main Functions**:

- Component-based architecture
- Virtual DOM for efficient updates
- Unidirectional data flow
- Hooks API for state management
- Server Components (React 18+)

**Key Features**:

- `useState`, `useEffect`, `useContext`, `useRef` hooks
- Server Components (Next.js 13+)
- Concurrent rendering
- Suspense for data fetching
- Error boundaries

**Use Case**: Foundation for all React applications

---

### 1.2 React Native

**Purpose**: Mobile app development framework

**Main Functions**:

- Cross-platform mobile apps (iOS/Android)
- Native component rendering
- Platform-specific APIs access
- Hot reloading

**Key Features**:

- Native modules bridge
- Platform-specific components (`<View>`, `<Text>`, `<Image>`)
- Navigation libraries (React Navigation)
- Performance optimization (Hermes engine)

**Use Case**: Mobile applications, not web applications

**Difference from React**: Renders to native mobile components, not DOM

---

### 1.3 React Bootstrap

**Purpose**: Bootstrap components for React

**Main Functions**:

- Pre-built Bootstrap components
- Responsive grid system
- Form components
- Navigation components

**Key Features**:

- Bootstrap 5.3 compatibility
- Tree-shaking support (import individual components)
- TypeScript support
- RTL support
- Color modes (dark mode)

**Use Case**: Quick prototyping, Bootstrap-based designs

**Difference**: Wrapper around Bootstrap CSS framework

---

### 1.4 React Suite

**Purpose**: Enterprise-grade component library

**Main Functions**:

- 60+ production-ready components
- Internationalization (i18n)
- Accessibility (WAI-ARIA 1.1)
- Theme customization

**Key Features**:

- SCSS-based styling (v6+)
- CSS Logical Properties (RTL support)
- Date-fns v4 integration
- React 18+ required
- TypeScript-first

**Use Case**: Enterprise applications requiring i18n, accessibility

**Difference**: More enterprise-focused, better i18n support

---

### 1.5 PrimeReact

**Purpose**: Rich UI component library

**Main Functions**:

- 90+ components
- Data tables, charts, calendars
- Form components
- Layout components

**Key Features**:

- Multiple themes (Material, Bootstrap, PrimeOne)
- PrimeFlex CSS utilities
- PrimeIcons icon library
- DataTable with sorting/filtering/pagination
- Form validation integration

**Use Case**: Data-heavy applications, dashboards, admin panels

**Difference**: Most comprehensive component set, premium themes available

**Current Usage in Workspace**: ✅ Installed (`primereact@^10.9.7`)

---

### 1.6 Mantine React Table

**Purpose**: Advanced data table component

**Main Functions**:

- Complex table operations
- Sorting, filtering, pagination
- Row selection, editing
- Virtual scrolling
- Column resizing

**Key Features**:

- Built on TanStack Table (React Table)
- Mantine UI integration
- Server-side data support
- Column visibility toggles
- Export functionality

**Use Case**: Complex data tables, data grids

**Difference**: Specialized for tables, not a full component library

---

## 2. Comparison Matrix

| Feature             | React         | React Native  | React Bootstrap  | React Suite | PrimeReact | Mantine Table  |

| ------------------- | ------------- | ------------- | ---------------- | ----------- | ---------- | -------------- |

| **Platform**        | Web           | Mobile        | Web              | Web         | Web        | Web            |

| **Component Count** | 0 (core only) | 0 (core only) | ~30              | ~60         | ~90        | 1 (table)      |

| **Styling**         | None          | StyleSheet    | Bootstrap CSS    | SCSS        | CSS/Themes | Mantine CSS    |

| **TypeScript**      | ✅             | ✅             | ✅                | ✅           | ✅          | ✅              |

| **i18n Support**    | Manual        | Manual        | Limited          | ✅ Excellent | ✅ Good     | Limited        |

| **Accessibility**   | Manual        | Manual        | Bootstrap        | ✅ WAI-ARIA  | ✅ Good     | ✅ Good         |

| **Bundle Size**     | Small         | Medium        | Medium           | Medium      | Large      | Medium         |

| **Learning Curve**  | Medium        | Medium        | Low              | Medium      | Low        | Medium         |

| **Best For**        | Foundation    | Mobile apps   | Quick prototypes | Enterprise  | Data apps  | Complex tables |

---

## 3. Real-World Best Practices

### 3.1 Component Library Selection Strategy

**KISS Principle**: Choose ONE primary library per project

**Decision Tree**:

```
Need mobile app? → React Native
Need quick prototype? → React Bootstrap
Need enterprise features (i18n, a11y)? → React Suite
Need data-heavy app? → PrimeReact
Need complex tables? → Mantine React Table
Need custom design? → React + Radix UI (shadcn/ui)
```

**DRY Principle**: Don't mix multiple component libraries unnecessarily

---

### 3.2 Current Workspace Analysis

**Current Stack**:

- ✅ React 18.3.1 (core)
- ✅ PrimeReact 10.9.7 (installed)
- ✅ Radix UI primitives (shadcn/ui style)
- ✅ Next.js 16.1.1
- ✅ Tailwind CSS v4

**Current State**: Hybrid approach (PrimeReact + Radix UI)

**Recommendation**: Consolidate to ONE primary library

---

### 3.3 ELITE Best Practices

#### 3.3.1 Component Architecture (KISS)

**✅ DO**:

```tsx
// Single responsibility components
export function Button({ variant, children, ...props }) {
  return <button className={cn(variant)} {...props}>{children}</button>
}
```

**❌ DON'T**:

```tsx
// Mixed concerns
export function Button({ variant, children, onClick, onHover, onFocus, ... }) {
  // Too many responsibilities
}
```

#### 3.3.2 Reusability (DRY)

**✅ DO**: Create shared component library

```
packages/
  design-system/
    components/
      Button.tsx
      Card.tsx
      Input.tsx
```

**❌ DON'T**: Duplicate components across apps

#### 3.3.3 Performance Optimization

**✅ DO**:

- Use React.memo for expensive components
- Lazy load heavy components
- Code splitting per route
- Server Components where possible

**❌ DON'T**:

- Import entire libraries (`import * from 'primereact'`)
- Render large lists without virtualization

---

## 4. Next.js 16+ Integration Strategy

### 4.1 Next.js 16 Elite Features

**Key Capabilities**:

- Server Components (default, zero JS by default)
- Server Actions (type-safe mutations)
- Streaming SSR with Suspense
- Partial Prerendering (PPR)
- Optimized package imports
- Turbopack (faster builds)
- React Compiler (automatic optimization)

**Integration Points**:

- Design system components must support Server/Client boundaries
- Use Server Components for static content
- Use Client Components only when needed (interactivity, hooks, browser APIs)
- Leverage Server Actions for form submissions

---

## 5. Workspace Adoption Strategy

### 5.1 Current State Assessment

**Strengths**:

- ✅ Modern React 18.3.1
- ✅ Next.js 16.1.1 (latest) with optimizations
- ✅ TypeScript 5.3.3
- ✅ Monorepo structure (Turborepo)
- ✅ Component primitives (Radix UI)
- ✅ Tailwind CSS v4
- ✅ Next.js package import optimization configured
- ✅ Server Actions configured

**Gaps**:

- ⚠️ Mixed component libraries (PrimeReact + Radix UI)
- ⚠️ No unified design system package
- ⚠️ Components not optimized for Server/Client split
- ⚠️ No design tokens system (Handoff integration)
- ⚠️ No component documentation (Diataxis structure)

---

### 5.2 ELITE Adoption Roadmap (Next.js 16 Optimized)

#### Phase 1: Design Tokens & Foundation (Week 1)

**Goal**: Establish design token system with Handoff integration

**KISS Approach**: Start with core tokens only

**Structure**:

```
packages/
  design-system/
    tokens/
      colors.ts        # Handoff-compatible color tokens
      spacing.ts       # Spacing scale
      typography.ts    # Font scales
      shadows.ts       # Elevation system
      index.ts         # Export all tokens
    lib/
      utils.ts         # cn(), variants
      server.ts        # Server Component utilities
      client.ts        # Client Component utilities
```

**Handoff Integration**:

- Use Handoff token naming convention
- Export tokens as CSS variables (Tailwind v4 compatible)
- Support Figma → Code workflow
- Token types: color, spacing, typography, shadows

**Files to Create**:

- `packages/design-system/tokens/colors.ts`
- `packages/design-system/tokens/spacing.ts`
- `packages/design-system/tokens/typography.ts`
- `packages/design-system/tokens/index.ts`

---

#### Phase 2: Component Architecture (Week 2-3)

**Goal**: Create Next.js 16-optimized component library

**Structure** (KISS + DRY):

```
packages/
  design-system/
    components/
      ui/                    # shadcn/ui components (Server Components by default)
        button.tsx            # Server Component wrapper
        button-client.tsx     # Client Component (if needed)
        card.tsx
        input.tsx
        ...
      server/                 # Server-only components
      client/                 # Client-only components (marked with 'use client')
      composite/              # Complex components (Server + Client composition)
    lib/
      server-components.tsx   # Server Component utilities
      client-components.tsx   # Client Component utilities
```

**Next.js 16 Patterns**:

1. **Server Components by Default**:
   ```tsx
   // packages/design-system/components/ui/card.tsx
   // Server Component (no 'use client')
   export function Card({ children, ...props }) {
     return <div className={cn("rounded-lg border", props.className)}>{children}</div>
   }
   ```

2. **Client Components When Needed**:
   ```tsx
   // packages/design-system/components/ui/button-client.tsx
   'use client'
   import { Button } from './button'
   export { Button as ButtonClient }
   ```

3. **Composition Pattern**:
   ```tsx
   // Server Component composes Client Component
   import { ButtonClient } from './button-client'
   export function Form({ action }) {
     return (
       <form action={action}>
         <ButtonClient type="submit">Submit</ButtonClient>
       </form>
     )
   }
   ```


**Core Components (10)**:

1. Button (Server + Client variants)
2. Input (Server + Client variants)
3. Card (Server Component)
4. Dialog (Client Component - requires interactivity)
5. Select (Client Component)
6. Table (Server Component)
7. Form (Server Component with Server Actions)
8. Toast (Client Component)
9. Tabs (Client Component)
10. Accordion (Client Component)

**DRY Principle**: Single source of truth, Server/Client split only when necessary

---

#### Phase 3: Consolidation & Migration (Week 4-5)

**Goal**: Migrate from PrimeReact to unified design system

**Decision**:

- **Primary**: **Radix UI + shadcn/ui** (Next.js 16 optimized)
- **Reason**:
  - Already installed and configured
  - Better tree-shaking (Next.js optimizePackageImports)
  - Server/Client component support
  - Works with Tailwind CSS v4
  - Smaller bundle size

**Migration Strategy**:

1. **Audit**: Find all PrimeReact usage
   ```bash
   grep -r "from 'primereact" apps/
   ```

2. **Create Equivalents**: Build components in design system

3. **Gradual Migration**: Migrate one app at a time

4. **Remove**: Uninstall PrimeReact after migration complete

---

#### Phase 4: Documentation (Week 6)

**Goal**: Document using Diataxis framework

**Diataxis Structure** (KISS documentation):

```
docs/
  components/
    tutorials/          # Step-by-step guides
      getting-started.mdx
      building-forms.mdx
    how-to/             # Task-oriented guides
      customize-button.mdx
      create-variant.mdx
    reference/          # API documentation
      button.mdx
      card.mdx
      input.mdx
    explanation/        # Conceptual docs
      server-components.mdx
      design-tokens.mdx
```

**Documentation Principles**:

- **Tutorials**: "We will build X together"
- **How-to Guides**: "How to do Y"
- **Reference**: "Button component API"
- **Explanation**: "Why Server Components?"

**Tools**:

- Use Nextra (already installed) for documentation
- Component examples with live code
- TypeScript types auto-generated

---

### 5.3 Implementation Details (Next.js 16 Optimized)

#### 5.3.1 Design Tokens (Handoff Integration)

**File**: `packages/design-system/tokens/colors.ts`

```tsx
// Handoff-compatible color tokens
// Exported as CSS variables for Tailwind v4

export const colors = {
  // Semantic colors
  primary: {
    50: 'hsl(var(--color-primary-50))',
    100: 'hsl(var(--color-primary-100))',
    // ... full scale
    900: 'hsl(var(--color-primary-900))',
  },
  // ... other color scales
} as const

// CSS variables (in globals.css)
export const colorVariables = {
  '--color-primary-50': '210 40% 98%',
  '--color-primary-100': '210 40% 96%',
  // ... full scale
} as const
```

**File**: `packages/design-system/tokens/index.ts`

```tsx
// Single export point (DRY)
export * from './colors'
export * from './spacing'
export * from './typography'
export * from './shadows'
```

**KISS**: One import, all tokens available

---

#### 5.3.2 Server Component Example

**File**: `packages/design-system/components/ui/card.tsx`

```tsx
// Server Component (no 'use client')
import { cn } from '../lib/utils'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}>
      {children}
    </div>
  )
}

// Server Component - zero JS shipped to client
```

**KISS**: Simple, no client JS unless needed

---

#### 5.3.3 Client Component Example

**File**: `packages/design-system/components/ui/button.tsx`

```tsx
'use client' // Required for interactivity

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**KISS + DRY**: Reusable, type-safe, follows shadcn/ui patterns

---

#### 5.3.4 Server Action Form Example

**File**: `packages/design-system/components/composite/form-server.tsx`

```tsx
// Server Component with Server Action
import { Button } from '../ui/button'
import { Input } from '../ui/input'

async function submitForm(formData: FormData) {
  'use server'
  // Server Action - runs on server
  const name = formData.get('name')
  // Process form data
}

export function FormServer() {
  return (
    <form action={submitForm}>
      <Input name="name" placeholder="Name" />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

**Next.js 16**: Server Actions for type-safe mutations

---

#### 5.3.5 Shared Utilities (DRY)

**File**: `packages/design-system/lib/utils.ts`

```tsx
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Single utility for class merging (DRY)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**File**: `packages/design-system/lib/server.ts`

```tsx
// Server Component utilities
export function isServerComponent() {
  return typeof window === 'undefined'
}
```

**File**: `packages/design-system/lib/client.ts`

```tsx
'use client'
// Client Component utilities
export function useIsClient() {
  const [isClient, setIsClient] = React.useState(false)
  React.useEffect(() => setIsClient(true), [])
  return isClient
}
```

---

#### 5.3.6 Usage in Apps (Next.js 16)

**File**: `apps/boardroom/app/page.tsx`

```tsx
// Server Component (default)
import { Card } from "@mythic/design-system/components/ui/card"
import { ButtonClient } from "@mythic/design-system/components/ui/button-client"

export default function Page() {
  return (
    <Card>
      <h1>Server Component</h1>
      <ButtonClient>Client Button</ButtonClient>
    </Card>
  )
}
```

**Next.js 16**: Server Components by default, Client Components when needed

---

#### 5.3.7 Tailwind v4 Integration

**File**: `packages/design-system/styles/tokens.css`

```css
/* Tailwind v4 CSS variables */
@theme {
  --color-primary-50: 210 40% 98%;
  --color-primary-100: 210 40% 96%;
  /* ... full scale */

  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  /* ... full scale */
}
```

**File**: `apps/boardroom/tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/design-system/**/*.{ts,tsx}', // Include design system
  ],
  theme: {
    extend: {
      // Design tokens automatically available via CSS variables
    },
  },
}

export default config
```

**KISS**: Tokens defined once, used everywhere

---

### 5.4 Next.js 16 Best Practices Checklist

#### Component Architecture (KISS)

- [ ] Server Components by default (no 'use client' unless needed)
- [ ] Client Components only for interactivity, hooks, browser APIs
- [ ] Use Server Actions for form submissions
- [ ] Compose Server + Client components when needed
- [ ] TypeScript for all components (strict mode)

#### Design Tokens (DRY)

- [ ] Handoff-compatible token naming
- [ ] CSS variables for Tailwind v4
- [ ] Single source of truth (`packages/design-system/tokens/`)
- [ ] Token types: color, spacing, typography, shadows

#### Performance (Next.js 16)

- [ ] Leverage `optimizePackageImports` in next.config.mjs
- [ ] Use Server Components for static content
- [ ] Code split per route (automatic with Next.js)
- [ ] Lazy load heavy Client Components
- [ ] Use `React.memo` only when necessary (React Compiler handles most cases)

#### Accessibility

- [ ] Use semantic HTML
- [ ] Radix UI provides ARIA attributes automatically
- [ ] Support keyboard navigation
- [ ] Test with screen readers

#### Documentation (Diataxis)

- [ ] Tutorials: Step-by-step guides
- [ ] How-to Guides: Task-oriented
- [ ] Reference: API documentation
- [ ] Explanation: Conceptual understanding

#### Testing

- [ ] Unit tests for components
- [ ] Integration tests for Server Actions
- [ ] Visual regression tests
- [ ] Server/Client boundary tests

---

## 5. Migration Strategy

### 5.1 PrimeReact → Radix UI Equivalents

| PrimeReact | Radix UI Equivalent             | Status             |

| ---------- | ------------------------------- | ------------------ |

| Button     | `@radix-ui/react-slot` + custom | ✅ Available        |

| Dialog     | `@radix-ui/react-dialog`        | ✅ Installed        |

| Dropdown   | `@radix-ui/react-dropdown-menu` | ✅ Installed        |

| Select     | `@radix-ui/react-select`        | ✅ Installed        |

| Table      | Custom (TanStack Table)         | ⚠️ Need to add      |

| DataTable  | Mantine React Table (if needed) | ⚠️ Need to evaluate |

### 5.2 Migration Steps

1. **Audit**: Find all PrimeReact usage
   ```bash
   grep -r "from 'primereact" apps/
   ```

2. **Replace**: Create equivalents in design system

3. **Test**: Verify functionality

4. **Remove**: Uninstall PrimeReact if not needed

---

## 6. Next.js 16 Optimization Configuration

### 6.1 next.config.mjs Updates

**File**: `apps/boardroom/next.config.mjs` (already optimized)

```js
experimental: {
  // ✅ Already configured
  optimizePackageImports: [
    '@mythic/design-system',  // Add after creation
    '@radix-ui/react-*',       // Already optimized
    'lucide-react',            // Already optimized
  ],
  serverActions: {
    bodySizeLimit: '2mb',
    allowedOrigins: ['localhost:3000', '*.vercel.app'],
  },
  optimizeCss: true,
}
```

**Action**: Add `@mythic/design-system` to `optimizePackageImports` after package creation

---

## 7. Success Metrics

### 7.1 Performance (Next.js 16)

- Bundle size reduction: Target 40% smaller (Server Components reduce JS)
- First Contentful Paint: < 1.0s (Server Components)
- Time to Interactive: < 2.5s
- Server Component ratio: > 70% of components

### 7.2 Developer Experience

- Component reuse rate: > 85%
- Time to create new component: < 20 min (with templates)
- Documentation coverage: 100% (Diataxis structure)
- Design token usage: 100% (no hardcoded values)

### 7.3 Code Quality

- TypeScript coverage: 100%
- Test coverage: > 80%
- Zero duplicate components
- Server/Client boundary clarity: 100%

---

## 8. Risk Mitigation

### 8.1 Potential Issues

**Issue**: PrimeReact has unique components (DataTable)

**Mitigation**:

- Use TanStack Table (already in workspace via @tanstack/react-query)
- Create wrapper component in design system
- Server-side data fetching with Server Components

**Issue**: Server/Client boundary confusion

**Mitigation**:

- Clear naming conventions (`-client.tsx` suffix)
- Documentation with examples
- TypeScript errors guide developers

**Issue**: Migration takes longer than expected

**Mitigation**:

- Gradual migration (one app at a time)
- Keep PrimeReact temporarily
- Feature flags for gradual rollout

**Issue**: Design tokens not syncing with Figma

**Mitigation**:

- Use Handoff for Figma → Code workflow
- Automated token generation
- Regular sync schedule

---

## 9. Implementation Checklist

### Phase 1: Foundation (Week 1)

- [ ] Create `packages/design-system` structure
- [ ] Set up design tokens (Handoff-compatible)
- [ ] Configure Tailwind v4 CSS variables
- [ ] Create utility functions (`cn`, etc.)

### Phase 2: Core Components (Week 2-3)

- [ ] Implement 10 core components (Server/Client split)
- [ ] Add TypeScript types
- [ ] Create component templates
- [ ] Test Server/Client boundaries

### Phase 3: Integration (Week 4-5)

- [ ] Update `next.config.mjs` with `optimizePackageImports`
- [ ] Migrate `apps/boardroom` to design system
- [ ] Migrate `apps/docs` to design system
- [ ] Remove PrimeReact dependencies

### Phase 4: Documentation (Week 6)

- [ ] Set up Diataxis documentation structure
- [ ] Write tutorials (getting started)
- [ ] Write how-to guides (common tasks)
- [ ] Write reference docs (API)
- [ ] Write explanations (concepts)

### Phase 5: Optimization (Week 7)

- [ ] Performance benchmarking
- [ ] Bundle size analysis
- [ ] Server Component ratio measurement
- [ ] Documentation review

---

## 10. References

### Core Technologies

- React Documentation: https://react.dev
- Next.js 16 Documentation: https://nextjs.org/docs
- Radix UI: https://www.radix-ui.com
- shadcn/ui: https://ui.shadcn.com

### Design & Tokens

- Handoff: https://www.handoff.com/docs
- Tailwind CSS v4: https://tailwindcss.com/docs
- Design Tokens: https://www.handoff.com/docs/tokens

### Documentation

- Diataxis Framework: https://diataxis.fr
- Nextra (Documentation): https://nextra.site

### Component Libraries (Reference)

- PrimeReact: https://primereact.org
- React Suite: https://rsuitejs.com
- Mantine React Table: https://www.mantine-react-table.com

---

## 11. Quick Start Commands

```bash
# 1. Create design system package
mkdir -p packages/design-system/{components,tokens,lib}

# 2. Install dependencies (if needed)
pnpm add -w class-variance-authority clsx tailwind-merge

# 3. Add to next.config.mjs
# Add '@mythic/design-system' to optimizePackageImports

# 4. Create first component
# Copy shadcn/ui button component to packages/design-system/components/ui/button.tsx

# 5. Test in app
# Import from '@mythic/design-system/components/ui/button'
```

---

**Status**: 📋 Plan Optimized for Next.js 16+

**Key Improvements**:

- ✅ Next.js 16 Server Components integration
- ✅ Handoff design tokens integration
- ✅ Tailwind v4 CSS variables
- ✅ Diataxis documentation structure
- ✅ KISS/DRY principles throughout
- ✅ Server/Client component patterns
- ✅ Performance optimizations

**Next Action**: Review plan → Begin Phase 1 (Design Tokens)
