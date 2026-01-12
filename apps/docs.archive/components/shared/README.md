# Shared Components Library

Reusable UI components for the documentation app following DRY/KISS principles and Tailwind ELITE Methodology.

---

## Components

### Button

Intelligence-aware button component with standardized styling.

**Props**:
- `variant`: 'primary' | 'secondary' | 'ghost'
- `status`: ProposalStatus (optional) - Applies intelligence-driven status styling
- `priority`: PriorityLevel (optional) - Applies intelligence-driven priority styling
- `size`: 'sm' | 'md' | 'lg'
- Standard button HTML attributes

**Example**:
```tsx
import { Button } from '@/components/shared'

<Button variant="primary" status="APPROVED" priority="HIGH">
  Submit
</Button>
```

---

### Card

Status-aware card component with compound component pattern.

**Props**:
- `status`: ProposalStatus (optional)
- `priority`: PriorityLevel (optional)
- `gradient`: 'approved' | 'vetoed' | 'warning' | 'success' | 'neutral' (optional)
- `hover`: boolean (default: true)
- Standard div HTML attributes

**Compound Components**:
- `Card.Header` - Card header section
- `Card.Title` - Card title
- `Card.Content` - Card content
- `Card.Footer` - Card footer section

**Example**:
```tsx
import { Card } from '@/components/shared'

<Card status="APPROVED" priority="HIGH">
  <Card.Header>
    <Card.Title>Getting Started</Card.Title>
  </Card.Header>
  <Card.Content>
    Learn how to get started.
  </Card.Content>
  <Card.Footer>
    <Button>Read More</Button>
  </Card.Footer>
</Card>
```

---

### Badge

Generic badge component extending DocumentTypeBadge pattern.

**Props**:
- `variant`: 'status' | 'priority' | 'custom'
- `status`: ProposalStatus (optional)
- `priority`: PriorityLevel (optional)
- `size`: 'sm' | 'md' | 'lg'
- Standard span HTML attributes

**Example**:
```tsx
import { Badge } from '@/components/shared'

<Badge status="APPROVED" size="md">
  Approved
</Badge>
```

---

### Link

Intelligent link component with transition styles.

**Props**:
- `variant`: 'default' | 'primary' | 'muted'
- Standard Next.js Link props

**Example**:
```tsx
import { Link } from '@/components/shared'

<Link href="/guides" variant="primary">
  View Guides
</Link>
```

---

### Container

Responsive container with consistent spacing.

**Props**:
- `variant`: 'default' | 'narrow' | 'wide' | 'full'
- Standard div HTML attributes

**Example**:
```tsx
import { Container } from '@/components/shared'

<Container variant="narrow">
  {/* content */}
</Container>
```

---

## Design Principles

### DRY (Don't Repeat Yourself)
- Centralized styling patterns
- Reusable component primitives
- Single source of truth via design tokens

### KISS (Keep It Simple, Stupid)
- Prefer Tailwind utilities over custom CSS
- Intelligence functions for complex conditional styling
- Component composition over complex props

### Intelligence-Driven
- Status-aware styling via `intelligentStatusStyles()`
- Priority-based styling via `intelligentPriorityStyles()`
- Consistent transitions via `intelligentTransitionStyles()`

---

## Usage Guidelines

1. **Always use shared components** for common UI patterns
2. **Leverage intelligence utilities** for conditional styling
3. **Use compound components** for flexible composition
4. **Follow responsive patterns** from `tailwind-utils.ts`
5. **Maintain accessibility** using ARIA patterns from `aria-patterns.ts`

---

## Related Documentation

- [Main README](../../README.md) - Full documentation
- [Tailwind Utilities](../../lib/tailwind-utils.ts) - Responsive utilities
- [Design Tokens](../../lib/design-tokens.ts) - Token references
- [ARIA Patterns](../../lib/aria-patterns.ts) - Accessibility utilities
