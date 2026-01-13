---
doc_type: REFERENCE
status: active
owner: architecture
source_of_truth: true
created: 2026-01-11
modified: 2026-01-11
tags: [tailwind, intelligence, design-system, utilities, styling]
related_docs:
  - DOC-0126_tailwind-v4-design-system.md
  - TAILWIND_CLI_INTELLISENSE.md
---

# Intelligence-Driven Tailwind CSS System

**Status**: ✅ **ACTIVE** **Version**: 1.0.0 **Last Updated**: 2026-01-11

---

## Executive Summary

The Intelligence-Driven Tailwind CSS system provides **context-aware,
data-driven styling utilities** that automatically apply appropriate Tailwind
classes based on business logic, risk scores, status values, and real-time state
changes.

This system supports the **AXIS Decision BoardRoom MVP** requirement for
"intelligence-driven boardroom decisions" by enabling dynamic styling that
reflects:

- Real-time risk analysis
- Variance tracking (Budgeted/Planned/Actual)
- Proposal status changes
- Priority-based urgency indicators
- Calculated consequences

---

## Key Features

✅ **Risk-Based Styling**: Automatic color/background/border based on risk
scores ✅ **Status-Aware Styling**: Context-aware styling for proposal statuses
✅ **Variance Intelligence**: Dynamic styling based on percentage thresholds ✅
**Priority Indicators**: Visual urgency based on priority levels ✅ **Type-Safe
API**: Full TypeScript support with intelligent autocomplete ✅ **Axis Visual
Canon Compliant**: Respects material truth and gravitational time ✅ **Fluent
Builder API**: Chainable style builder for complex scenarios

---

## Quick Start

### Installation

The intelligence-driven utilities are part of `@mythic/shared-utils`:

```typescript
import {
  intelligentRiskStyles,
  intelligentStatusStyles,
  intelligentVarianceStyles,
  intelligentPriorityStyles,
  createIntelligentStyles,
} from "@mythic/nextjs-shared-utils"
```

### Basic Usage

```tsx
import { intelligentRiskStyles, intelligentStatusStyles } from '@mythic/nextjs-shared-utils'

// Risk-based styling (automatically calculates from variance %)
<div className={intelligentRiskStyles(15.5, 'future')}>
  Variance: +15.5% (Warning)
</div>

// Status-based styling
<span className={intelligentStatusStyles('APPROVED', 'badge')}>
  Approved
</span>
```

---

## Core Utilities

### 1. Risk-Based Styling

Automatically applies appropriate styling based on risk status or variance
percentage.

```typescript
intelligentRiskStyles(
  riskStatus: RiskStatus | number,
  vectorType: VectorType = 'future',
  className?: string
): string
```

**Risk Status Types**:

- `on_track`: Variance < 5%
- `warning`: Variance 5-10%
- `overrun`: Variance 10-20%
- `underrun`: Variance < -10%
- `critical`: Variance ≥ 20%

**Example**:

```tsx
// Using variance percentage (auto-calculates risk)
<div className={intelligentRiskStyles(12.5, 'future')}>
  Budget Overrun: +12.5%
</div>

// Using explicit risk status
<div className={intelligentRiskStyles('critical', 'future')}>
  Critical Risk Detected
</div>

// With additional classes
<div className={intelligentRiskStyles(8.3, 'present', 'p-4 rounded-lg')}>
  Warning: +8.3% variance
</div>
```

**Vector Types**:

- `past`: Historical data (gray/ash tones)
- `present`: Current state (gold accents)
- `future`: Predictive data (risk-based colors)

---

### 2. Status-Based Styling

Context-aware styling for proposal statuses.

```typescript
intelligentStatusStyles(
  status: ProposalStatus,
  variant: 'badge' | 'card' | 'border' | 'text' = 'badge',
  className?: string
): string
```

**Status Types**:

- `DRAFT`: Ash tones (inactive)
- `LISTENING`: Gold tones (active, awaiting decision)
- `APPROVED`: Emerald tones (success)
- `VETOED`: Red tones (rejected)
- `ARCHIVED`: Charcoal tones (inactive)

**Example**:

```tsx
// Badge variant (default)
<span className={intelligentStatusStyles('LISTENING', 'badge')}>
  Awaiting Approval
</span>

// Card variant
<div className={intelligentStatusStyles('APPROVED', 'card', 'p-6')}>
  Proposal Approved
</div>

// Text variant
<p className={intelligentStatusStyles('VETOED', 'text')}>
  This proposal was vetoed
</p>
```

---

### 3. Variance-Based Styling

Dynamic styling based on variance percentage thresholds.

```typescript
intelligentVarianceStyles(
  variancePct: number,
  variant: 'badge' | 'text' | 'indicator' = 'badge',
  className?: string
): string
```

**Example**:

```tsx
// Badge variant
<span className={intelligentVarianceStyles(9.2, 'badge')}>
  Variance: +9.2%
</span>

// Text variant
<p className={intelligentVarianceStyles(-5.3, 'text')}>
  Under budget by 5.3%
</p>

// Indicator variant (for progress bars, etc.)
<div className={intelligentVarianceStyles(15.8, 'indicator', 'w-full h-2')} />
```

---

### 4. Priority-Based Styling

Visual urgency indicators based on priority levels.

```typescript
intelligentPriorityStyles(
  priority: PriorityLevel,
  variant: 'badge' | 'indicator' | 'text' = 'badge',
  className?: string
): string
```

**Priority Levels**:

- `HIGH`: Ember tones (urgent, pulsing animation)
- `MEDIUM`: Gold tones (moderate urgency)
- `LOW`: Ash tones (low urgency)

**Example**:

```tsx
// Badge with priority
<span className={intelligentPriorityStyles('HIGH', 'badge')}>
  High Priority
</span>

// Indicator dot
<div className={intelligentPriorityStyles('HIGH', 'indicator', 'w-2 h-2 rounded-full')} />

// Text styling
<h3 className={intelligentPriorityStyles('HIGH', 'text')}>
  Urgent: Budget Review Required
</h3>
```

---

### 5. Combined Intelligence Styling

Combine multiple intelligence factors into a single class string.

```typescript
intelligentStyles(config: {
  status?: ProposalStatus
  priority?: PriorityLevel
  riskStatus?: RiskStatus | number
  vectorType?: VectorType
  isSelected?: boolean
  isActive?: boolean
  isUrgent?: boolean
  className?: string
}): string
```

**Example**:

```tsx
<div
  className={intelligentStyles({
    status: "LISTENING",
    priority: "HIGH",
    riskStatus: 12.5,
    vectorType: "future",
    isSelected: true,
    isUrgent: true,
    className: "p-6 rounded-lg",
  })}
>
  High-priority proposal with risk warning
</div>
```

---

## Fluent Builder API

For complex styling scenarios, use the fluent builder API:

```typescript
import { createIntelligentStyles } from "@mythic/nextjs-shared-utils"

const styles = createIntelligentStyles()
  .risk(15.5, "future")
  .status("LISTENING", "card")
  .priority("HIGH", "text")
  .variance(12.3, "badge")
  .transition("illuminate")
  .gradient("warning")
  .add("p-6 rounded-lg")
  .build()
```

**Builder Methods**:

- `.risk(riskStatus, vectorType)` - Add risk-based styling
- `.status(status, variant)` - Add status-based styling
- `.priority(priority, variant)` - Add priority-based styling
- `.variance(variancePct, variant)` - Add variance-based styling
- `.responsive(type)` - Add responsive layout classes
- `.transition(type)` - Add intelligent transitions
- `.gradient(type)` - Add context-aware gradients
- `.add(className)` - Add custom classes
- `.build()` - Generate final class string

---

## CSS Utilities

The design system also includes CSS utilities that can be used directly in
HTML/JSX:

### Risk Utilities

```html
<div class="risk-on-track">On Track</div>
<div class="risk-warning">Warning</div>
<div class="risk-overrun">Overrun</div>
<div class="risk-underrun">Underrun</div>
<div class="risk-critical">Critical</div>
```

### Vector Utilities

```html
<div class="vector-past">Past Vector</div>
<div class="vector-present">Present Vector</div>
<div class="vector-future">Future Vector</div>
```

### Status Utilities

```html
<span class="status-draft">Draft</span>
<span class="status-listening">Listening</span>
<span class="status-approved">Approved</span>
<span class="status-vetoed">Vetoed</span>
<span class="status-archived">Archived</span>
```

### Priority Utilities

```html
<span class="priority-high">High Priority</span>
<span class="priority-medium">Medium Priority</span>
<span class="priority-low">Low Priority</span>
```

### Transition Utilities

```html
<div class="transition-illuminate">Illumination transition (1200ms)</div>
<div class="transition-commit">Commit transition (1618ms)</div>
<div class="transition-hover-intelligent">Hover transition (700ms)</div>
```

### Gradient Utilities

```html
<div class="gradient-approved">Approved gradient</div>
<div class="gradient-vetoed">Vetoed gradient</div>
<div class="gradient-warning">Warning gradient</div>
<div class="gradient-success">Success gradient</div>
<div class="gradient-neutral">Neutral gradient</div>
```

---

## Real-World Examples

### Example 1: Proposal Card with Intelligence

```tsx
import {
  intelligentStyles,
  intelligentRiskStyles,
  intelligentStatusStyles,
} from "@mythic/nextjs-shared-utils"

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const variancePct = calculateVariance(proposal)
  const riskStatus = calculateRiskStatus(variancePct)

  return (
    <div
      className={intelligentStyles({
        status: proposal.status,
        priority: proposal.priority,
        riskStatus: variancePct,
        vectorType: "future",
        isSelected: proposal.isSelected,
        className: "p-6 rounded-lg cursor-pointer",
      })}
    >
      <div className="flex items-center justify-between mb-4">
        <span className={intelligentStatusStyles(proposal.status, "badge")}>
          {proposal.status}
        </span>
        <span
          className={intelligentRiskStyles(riskStatus, "future", "text-sm")}
        >
          {variancePct > 0 ? "+" : ""}
          {variancePct.toFixed(1)}%
        </span>
      </div>
      <h3>{proposal.title}</h3>
    </div>
  )
}
```

### Example 2: Tri-Vector Display

```tsx
import { intelligentRiskStyles } from "@mythic/nextjs-shared-utils"

function TriVectorDisplay({ budgeted, planned, actual }: TriVectorProps) {
  const variancePct = ((actual - budgeted) / budgeted) * 100

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Past Vector */}
      <div
        className={intelligentRiskStyles("on_track", "past", "p-4 rounded-lg")}
      >
        <h4>📋 Budgeted</h4>
        <p className="text-2xl font-bold">${budgeted.toLocaleString()}</p>
      </div>

      {/* Present Vector */}
      <div
        className={intelligentRiskStyles(
          "on_track",
          "present",
          "p-4 rounded-lg"
        )}
      >
        <h4>📊 Planned</h4>
        <p className="text-2xl font-bold">${planned.toLocaleString()}</p>
      </div>

      {/* Future Vector (with risk-based styling) */}
      <div
        className={intelligentRiskStyles(
          variancePct,
          "future",
          "p-4 rounded-lg"
        )}
      >
        <h4>🎯 Actual</h4>
        <p className="text-2xl font-bold">${actual.toLocaleString()}</p>
        <p
          className={intelligentVarianceStyles(
            variancePct,
            "text",
            "text-sm mt-2"
          )}
        >
          Variance: {variancePct > 0 ? "+" : ""}
          {variancePct.toFixed(1)}%
        </p>
      </div>
    </div>
  )
}
```

### Example 3: Status Badge Component

```tsx
import {
  intelligentStatusStyles,
  intelligentPriorityStyles,
} from "@mythic/nextjs-shared-utils"

function StatusBadge({
  status,
  priority,
}: {
  status: ProposalStatus
  priority?: PriorityLevel
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={intelligentStatusStyles(
          status,
          "badge",
          "px-3 py-1 rounded-full"
        )}
      >
        {status}
      </span>
      {priority && (
        <span
          className={intelligentPriorityStyles(
            priority,
            "badge",
            "px-2 py-1 rounded-full text-xs"
          )}
        >
          {priority}
        </span>
      )}
    </div>
  )
}
```

---

## Type Safety

All utilities are fully typed with TypeScript:

```typescript
// Type-safe risk status
type RiskStatus = "on_track" | "warning" | "overrun" | "underrun" | "critical"

// Type-safe proposal status
type ProposalStatus = "DRAFT" | "LISTENING" | "APPROVED" | "VETOED" | "ARCHIVED"

// Type-safe priority
type PriorityLevel = "HIGH" | "MEDIUM" | "LOW"

// Type-safe vector type
type VectorType = "past" | "present" | "future"
```

---

## Axis Visual Canon Compliance

All intelligence-driven utilities respect the **Axis Visual Canon** design
principles:

✅ **Material Truth**: Colors represent material states, not UI states ✅
**Gravitational Time**: Transitions use 700ms (hover), 1200ms (illuminate),
1618ms (commit) ✅ **No Pure White**: Uses Parchment (#f8f5f0) instead of pure
white ✅ **Earned Contrast**: Risk/status colors are subtle and earned ✅ **No
Bounce/Snap**: All transitions use ease-out, no elastic easing

---

## Performance Considerations

- **Zero Runtime Overhead**: All utilities generate static class strings at
  build time
- **Tree-Shakeable**: Only import what you need
- **CSS-First**: Leverages Tailwind v4's CSS-first approach for optimal
  performance
- **Memoization-Friendly**: Class strings can be memoized for expensive
  components

---

## Migration Guide

### From Manual Class Strings

**Before**:

```tsx
const statusClass =
  proposal.status === "APPROVED"
    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    : proposal.status === "VETOED"
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : "bg-ash/20 text-ash border-ash/30"
```

**After**:

```tsx
const statusClass = intelligentStatusStyles(proposal.status, "badge")
```

### From Conditional Logic

**Before**:

```tsx
const riskClass =
  variancePct > 20
    ? "border-red-600/80 bg-red-600/10 text-red-300"
    : variancePct > 10
      ? "border-red-500/60 bg-red-500/5 text-red-400"
      : variancePct > 5
        ? "border-amber-500/60 bg-amber-500/5 text-amber-400"
        : "border-emerald-500/60 bg-emerald-500/5 text-emerald-400"
```

**After**:

```tsx
const riskClass = intelligentRiskStyles(variancePct, "future")
```

---

## Related Documentation

- [Tailwind CSS v4 Design System](./DOC-0126_tailwind-v4-design-system.md) -
  Complete design system reference
- [Tailwind CLI & IntelliSense](./TAILWIND_CLI_INTELLISENSE.md) - Development
  setup
- [PRD Decision BoardRoom MVP](../product/PRD_Decision_BoardRoom_MVP.md) -
  Product requirements

---

## Support

For questions or issues with intelligence-driven Tailwind utilities:

1. Check this documentation
2. Review the TypeScript types in
   `@mythic/shared-utils/src/tailwind-intelligence.ts`
3. Check the CSS utilities in `packages/TailwindCSS-V4/Design-System/src/tokens/input.css`

---

**Status**: ✅ Production Ready **Version**: 1.0.0 **Last Updated**: 2026-01-11
