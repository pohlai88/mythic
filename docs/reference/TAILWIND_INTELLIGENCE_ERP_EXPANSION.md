# Tailwind Intelligence ERP Expansion

**Status**: ✅ **ACTIVE** **Version**: 1.0.0 **Last Updated**: 2026-01-13

---

## Executive Summary

Comprehensive expansion of Tailwind Intelligence utilities for ERP business
logic patterns. Provides context-aware, data-driven styling for all ERP modules
including BoardRoom, Accounting, Finance, CRM, Manufacturing, Supply Chain,
Procurement, Marketing, and Investor Relations.

---

## Quick Start

### Installation

All ERP intelligence functions are part of `@mythic/shared-utils`:

```typescript
import {
  intelligentRoleStyles,
  intelligentBroadcastStyles,
  intelligentWorkflowStyles,
  intelligentValidationStyles,
  intelligentDataStateStyles,
  intelligentFinancialStyles,
  intelligentInventoryStyles,
  intelligentOrderStyles,
  intelligentPaymentStyles,
  intelligentApprovalWorkflowStyles,
  intelligentNotificationStyles,
  intelligentModuleStatusStyles,
  intelligentERPStyles,
} from "@mythic/nextjs-shared-utils"
```

---

## ERP Intelligence Functions

### 1. Role-Based Styling

Visual indicators for user roles (sovereign, council, observer).

```tsx
import { intelligentRoleStyles } from '@mythic/nextjs-shared-utils'

// Badge variant
<span className={intelligentRoleStyles('sovereign', 'badge')}>
  CEO
</span>

// Card variant
<div className={intelligentRoleStyles('council', 'card')}>
  Management Team
</div>
```

**Roles**:

- `sovereign`: Gold/amber tones (highest authority)
- `council`: Blue/teal tones (management)
- `observer`: Gray/ash tones (read-only)

---

### 2. Broadcast Styling

Context-aware styling for broadcast types, priorities, and states.

```tsx
import { intelligentBroadcastStyles } from '@mythic/nextjs-shared-utils'

// Emergency broadcast with high priority
<div className={intelligentBroadcastStyles('emergency', 'urgent', 'published', 'banner')}>
  System Maintenance Scheduled
</div>

// Draft announcement
<div className={intelligentBroadcastStyles('announcement', 'normal', 'draft', 'card')}>
  Draft Announcement
</div>
```

**Broadcast Types**:

- `approval`: Green/emerald tones
- `veto`: Red/ember tones
- `announcement`: Blue/gold tones
- `poll`: Purple/indigo tones
- `emergency`: Red/amber tones with animation

**Priorities**:

- `low`, `normal`, `high`, `urgent` (urgent includes pulse animation)

**States**:

- `draft`, `published`, `scheduled`, `expired`, `archived`

---

### 3. Workflow State Styling

Visual indicators for workflow progression.

```tsx
import { intelligentWorkflowStyles } from '@mythic/nextjs-shared-utils'

// Progress indicator
<div className={intelligentWorkflowStyles('in_progress', 'progress')}>
  Processing...
</div>

// Badge
<span className={intelligentWorkflowStyles('completed', 'badge')}>
  Completed
</span>
```

**Workflow States**:

- `pending`: Gray/ash tones
- `in_progress`: Blue/gold tones
- `completed`: Green/emerald tones
- `blocked`: Red/amber tones
- `cancelled`: Gray/charcoal tones

---

### 4. Validation State Styling

Visual feedback for form/data validation.

```tsx
import { intelligentValidationStyles } from '@mythic/nextjs-shared-utils'

// Input with validation
<input
  className={cn(
    'px-4 py-2',
    intelligentValidationStyles(hasError ? 'invalid' : 'valid', 'border')
  )}
/>

// Validation badge
<span className={intelligentValidationStyles('warning', 'badge')}>
  Warning
</span>
```

**Validation States**:

- `valid`: Green border/text
- `invalid`: Red border/text
- `warning`: Amber/yellow border/text
- `pending`: Gray border/text

---

### 5. Data State Styling

Visual indicators for async data loading states.

```tsx
import { intelligentDataStateStyles } from '@mythic/nextjs-shared-utils'

// Loading skeleton
<div className={intelligentDataStateStyles('loading', 'skeleton')}>
  Loading...
</div>

// Error state
<div className={intelligentDataStateStyles('error', 'message')}>
  Failed to load data
</div>
```

**Data States**:

- `loading`: Pulsing skeleton
- `loaded`: Normal state
- `error`: Red/error tones
- `empty`: Gray/empty state
- `refreshing`: Slightly dimmed

---

### 6. Financial Status Styling

Visual indicators for financial status.

```tsx
import { intelligentFinancialStyles } from '@mythic/nextjs-shared-utils'

// Profit indicator
<span className={intelligentFinancialStyles('profitable', 'indicator')}>
  +$50K
</span>

// Loss indicator
<span className={intelligentFinancialStyles('loss', 'badge')}>
  -$20K
</span>
```

**Financial Statuses**:

- `profitable`: Green/emerald tones
- `break_even`: Gray/neutral tones
- `loss`: Red/ember tones
- `projected`: Blue/gold tones (future)

---

### 7. Inventory Level Styling

Visual indicators for inventory stock levels.

```tsx
import { intelligentInventoryStyles } from '@mythic/nextjs-shared-utils'

// Stock level badge
<span className={intelligentInventoryStyles('low_stock', 'badge')}>
  Low Stock
</span>

// Stock indicator
<div className={intelligentInventoryStyles('out_of_stock', 'indicator')} />
```

**Inventory Levels**:

- `in_stock`: Green tones
- `low_stock`: Amber/yellow tones
- `out_of_stock`: Red tones
- `backordered`: Purple/indigo tones

---

### 8. Order Status Styling

Visual indicators for order lifecycle.

```tsx
import { intelligentOrderStyles } from '@mythic/nextjs-shared-utils'

// Order status badge
<span className={intelligentOrderStyles('processing', 'badge')}>
  Processing
</span>

// Order timeline
<div className={intelligentOrderStyles('shipped', 'timeline')}>
  Shipped
</div>
```

**Order Statuses**:

- `pending`: Gray/ash tones
- `confirmed`: Blue tones
- `processing`: Gold/amber tones
- `shipped`: Teal/cyan tones
- `delivered`: Green/emerald tones
- `cancelled`: Red/ember tones
- `returned`: Purple/indigo tones

---

### 9. Payment Status Styling

Visual indicators for payment processing.

```tsx
import { intelligentPaymentStyles } from '@mythic/nextjs-shared-utils'

// Processing payment (with pulse)
<span className={intelligentPaymentStyles('processing', 'badge')}>
  Processing...
</span>

// Completed payment
<span className={intelligentPaymentStyles('completed', 'amount')}>
  $1,234.56
</span>
```

**Payment Statuses**:

- `pending`: Gray/ash tones
- `processing`: Gold/amber tones with pulse
- `completed`: Green/emerald tones
- `failed`: Red/ember tones
- `refunded`: Purple/indigo tones

---

### 10. Approval Workflow Styling

Visual indicators for approval workflow stages.

```tsx
import { intelligentApprovalWorkflowStyles } from '@mythic/nextjs-shared-utils'

// Approval stage badge
<span className={intelligentApprovalWorkflowStyles('under_review', 'badge')}>
  Under Review
</span>

// Progress indicator
<div className={intelligentApprovalWorkflowStyles('approved', 'progress')} />
```

**Approval Workflow Stages**:

- `submitted`: Blue tones
- `under_review`: Gold/amber tones
- `approved`: Green/emerald tones
- `rejected`: Red/ember tones
- `requires_changes`: Amber/yellow tones

---

### 11. Notification Styling

Visual styling for notification types.

```tsx
import { intelligentNotificationStyles } from '@mythic/nextjs-shared-utils'

// Success toast
<div className={intelligentNotificationStyles('success', 'toast')}>
  Operation completed successfully
</div>

// Error alert
<div className={intelligentNotificationStyles('error', 'alert')}>
  Operation failed
</div>
```

**Notification Types**:

- `info`: Blue tones
- `success`: Green tones
- `warning`: Amber/yellow tones
- `error`: Red tones
- `system`: Gray/neutral tones

---

### 12. Module Status Styling

Visual indicators for ERP module status.

```tsx
import { intelligentModuleStatusStyles } from '@mythic/nextjs-shared-utils'

// Active module
<span className={intelligentModuleStatusStyles('active', 'badge')}>
  Active
</span>

// Maintenance module
<div className={intelligentModuleStatusStyles('maintenance', 'card')}>
  Under Maintenance
</div>
```

**Module Statuses**:

- `active`: Green tones
- `inactive`: Gray tones
- `maintenance`: Amber/yellow tones
- `deprecated`: Red tones with strikethrough

---

## Combined ERP Intelligence

Use `intelligentERPStyles()` to combine multiple intelligence factors:

```tsx
import { intelligentERPStyles } from "@mythic/nextjs-shared-utils"

// Complex component with multiple intelligence factors
;<div
  className={intelligentERPStyles({
    role: "sovereign",
    workflowState: "in_progress",
    validationState: "valid",
    dataState: "loaded",
    isUrgent: true,
    isSelected: false,
    className: "p-4 rounded-lg",
  })}
>
  Executive Dashboard
</div>
```

---

## Usage Patterns by ERP Module

### BoardRoom Module

```tsx
// Proposal status (existing)
import { intelligentStatusStyles } from '@mythic/nextjs-shared-utils'
<span className={intelligentStatusStyles('APPROVED', 'badge')}>

// Role-based access indicators
import { intelligentRoleStyles } from '@mythic/nextjs-shared-utils'
<div className={intelligentRoleStyles('sovereign', 'indicator')}>

// Approval workflow
import { intelligentApprovalWorkflowStyles } from '@mythic/nextjs-shared-utils'
<span className={intelligentApprovalWorkflowStyles('under_review', 'badge')}>
```

### Accounting Module

```tsx
// Financial status
import { intelligentFinancialStyles } from '@mythic/nextjs-shared-utils'
<span className={intelligentFinancialStyles('profitable', 'badge')}>

// Payment status
import { intelligentPaymentStyles } from '@mythic/nextjs-shared-utils'
<span className={intelligentPaymentStyles('completed', 'amount')}>
```

### Finance Module

```tsx
// Financial projections
import { intelligentFinancialStyles } from '@mythic/nextjs-shared-utils'
<span className={intelligentFinancialStyles('projected', 'chart')}>

// Workflow states
import { intelligentWorkflowStyles } from '@mythic/nextjs-shared-utils'
<div className={intelligentWorkflowStyles('in_progress', 'progress')}>
```

### CRM Module

```tsx
// Order status
import { intelligentOrderStyles } from '@mythic/nextjs-shared-utils'
<span className={intelligentOrderStyles('processing', 'badge')}>

// Notification types
import { intelligentNotificationStyles } from '@mythic/nextjs-shared-utils'
<div className={intelligentNotificationStyles('info', 'toast')}>
```

### Manufacturing Module

```tsx
// Workflow states
import { intelligentWorkflowStyles } from '@mythic/nextjs-shared-utils'
<span className={intelligentWorkflowStyles('in_progress', 'badge')}>

// Inventory levels
import { intelligentInventoryStyles } from '@mythic/nextjs-shared-utils'
<span className={intelligentInventoryStyles('low_stock', 'badge')}>
```

### Supply Chain Module

```tsx
// Order status
import { intelligentOrderStyles } from '@mythic/nextjs-shared-utils'
<span className={intelligentOrderStyles('shipped', 'status')}>

// Inventory levels
import { intelligentInventoryStyles } from '@mythic/nextjs-shared-utils'
<span className={intelligentInventoryStyles('backordered', 'stock')}>
```

### Procurement Module

```tsx
// Approval workflow
import { intelligentApprovalWorkflowStyles } from '@mythic/nextjs-shared-utils'
<span className={intelligentApprovalWorkflowStyles('submitted', 'badge')}>

// Payment status
import { intelligentPaymentStyles } from '@mythic/nextjs-shared-utils'
<span className={intelligentPaymentStyles('pending', 'badge')}>
```

---

## Best Practices

### ✅ DO:

1. **Use for Context-Aware Styling**

   ```tsx
   // ✅ Good: Dynamic based on data
   <span className={intelligentOrderStyles(order.status, 'badge')}>
   ```

2. **Combine with Base Utilities**

   ```tsx
   // ✅ Good: Intelligence + base utilities
   <div className={cn(
     'p-4 rounded-lg',
     intelligentWorkflowStyles(workflow.state, 'badge')
   )}>
   ```

3. **Use Appropriate Variants**
   ```tsx
   // ✅ Good: Right variant for context
   <span className={intelligentRoleStyles(role, 'badge')}> // For badges
   <div className={intelligentRoleStyles(role, 'card')}> // For cards
   ```

### ❌ DON'T:

1. **Don't Use for Static Styling**

   ```tsx
   // ❌ Bad: Static styling should use utilities directly
   <div className={intelligentOrderStyles('pending', 'badge')}> // If status never changes

   // ✅ Good: Use utilities directly
   <div className="px-2 py-1 rounded-xs text-xs font-medium">
   ```

2. **Don't Over-Compose**

   ```tsx
   // ❌ Bad: Too many intelligence factors
   <div className={intelligentERPStyles({
     role: 'sovereign',
     broadcastType: 'announcement',
     workflowState: 'in_progress',
     validationState: 'valid',
     dataState: 'loaded',
     financialStatus: 'profitable',
     inventoryLevel: 'in_stock',
     orderStatus: 'processing',
     paymentStatus: 'completed',
     // ... too many!
   })}>

   // ✅ Good: Focused intelligence
   <div className={intelligentERPStyles({
     role: 'sovereign',
     workflowState: 'in_progress',
     className: 'p-4',
   })}>
   ```

---

## CSS Custom Properties Required

These intelligence functions rely on CSS custom properties defined in your
design system. Ensure these are defined in your `@theme` or `@layer` directives:

```css
/* Role classes */
.role-sovereign {
  /* Gold/amber tones */
}
.role-council {
  /* Blue/teal tones */
}
.role-observer {
  /* Gray/ash tones */
}

/* Broadcast classes */
.broadcast-approval {
  /* Green/emerald tones */
}
.broadcast-veto {
  /* Red/ember tones */
}
.broadcast-emergency {
  /* Red/amber tones */
}

/* Workflow classes */
.workflow-pending {
  /* Gray/ash tones */
}
.workflow-in-progress {
  /* Blue/gold tones */
}
.workflow-completed {
  /* Green/emerald tones */
}

/* ... and so on for all intelligence classes */
```

---

## Related Documentation

- `docs/reference/TAILWIND_INTELLIGENCE_DRIVEN.md` - Base intelligence functions
- `packages/NextJS/Shared-Utils/src/tailwind-intelligence.ts` - Base implementation
- `packages/NextJS/Shared-Utils/src/tailwind-intelligence-erp.ts` - ERP implementation

---

**Status**: ✅ **PRODUCTION READY** **Coverage**: All 12 ERP modules supported
**Patterns**: 12+ intelligence functions for ERP business logic
