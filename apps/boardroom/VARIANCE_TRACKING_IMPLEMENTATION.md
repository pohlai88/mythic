# Variance Tracking Implementation (The Oracle - Weapon 8)

**Status**: ✅ **COMPLETE**
**Date**: 2026-01-11
**Version**: 1.0.0

---

## Executive Summary

Successfully implemented variance tracking system (The Oracle - Weapon 8) that integrates with the intelligence-driven Tailwind CSS system. This enables real-time risk assessment and variance analysis for proposals, replacing mock data with actual database-backed variance tracking.

---

## Implementation Details

### 1. Database Schema

**File**: `apps/boardroom/src/db/schema/variance.ts`

✅ **Created Tables**:

#### `case_whatif_budgets`
Tracks the progression: Budgeted → Planned → Actual

**Key Fields**:
- `budgetedTotal`: Manager's initial estimate
- `budgetedBreakdown`: JSON breakdown (salary, benefits, etc.)
- `plannedTotal`: Forecast at approval time
- `plannedMetrics`: JSON metrics (TTP, ROI, retention, etc.)
- `actualTotal`: Reality as it unfolds
- `actualBreakdown`: JSON actual breakdown
- `variancePct`: Calculated percentage ((actual - budgeted) / budgeted * 100)
- `varianceStatus`: Risk status (on_track, warning, overrun, underrun, critical)
- `varianceReason`: Why did it vary?

#### `case_whatif_milestones`
Tracks milestone reviews (30-day, Q1, annual) with variance tracking

**Key Fields**:
- `milestoneKey`: "onboarded", "q1_review", "30_day", "annual"
- `scheduledDate`: When it should happen
- `actualDate`: When it actually happened
- `budgetToDate`: Cumulative budgeted spend
- `actualToDate`: Cumulative actual spend
- `variancePctToDate`: Variance at this milestone

**Relationships**:
- `case_whatif_budgets.proposalId` → `proposals.id` (CASCADE DELETE)
- `case_whatif_milestones.whatifBudgetId` → `case_whatif_budgets.id` (CASCADE DELETE)

---

### 2. Server Actions

**File**: `apps/boardroom/app/actions/variance.ts`

✅ **Implemented Functions**:

#### `getVarianceData(proposalId: string)`
Fetches complete variance analysis for a proposal including:
- Budgeted/Planned/Actual values
- Calculated variance percentage
- Risk status
- Milestone reviews
- Breakdown data

**Returns**: `VarianceData | null`

**Features**:
- Validates input with Zod schema
- Handles missing variance data gracefully
- Parses numeric values from database
- Transforms milestones data
- Error handling with logging

#### Helper Functions:
- `calculateVariancePct(budgeted, actual)`: Calculates variance percentage
- `calculateRiskStatusFromVariance(variancePct)`: Determines risk status

---

### 3. Component Integration

**File**: `apps/boardroom/components/StrategyDrawer.tsx`

✅ **Updated ThanosTrace Component**:

**Before**: Used mock variance data for demonstration

**After**:
- Fetches real variance data from database
- Displays actual Budgeted/Planned/Actual values
- Shows calculated variance percentage
- Displays risk status with intelligence-driven styling
- Shows variance reason if available
- Displays milestone count
- Handles loading and error states
- Falls back gracefully when no variance data exists

**Key Features**:
- Real-time data fetching via `useEffect`
- Loading state with `LoadingState` component
- Error handling with user-friendly messages
- Fallback to proposal data if no variance record exists
- Intelligence-driven styling based on actual variance percentage

---

### 4. Intelligence-Driven Styling Integration

The variance tracking system seamlessly integrates with the intelligence-driven Tailwind CSS utilities:

✅ **Automatic Risk Calculation**:
- Variance percentage → Risk status → Styling
- Uses `calculateRiskStatus()` from `@mythic/shared-utils`
- Applies appropriate colors based on thresholds

✅ **Dynamic Styling**:
- Future Vector card uses `intelligentRiskStyles(variancePct, 'future')`
- Risk status badge uses `intelligentRiskStyles(riskStatus, 'future')`
- Variance percentage display uses `intelligentRiskStyles(variancePct, 'future')`

✅ **Threshold-Based Colors**:
- `< -10%`: Blue tones (underrun)
- `-10% to 5%`: Emerald tones (on_track)
- `5% to 10%`: Amber tones (warning)
- `10% to 20%`: Red tones (overrun)
- `≥ 20%`: Dark red with pulse (critical)

---

## Data Flow

```
1. User selects proposal in PoolTable
   ↓
2. StrategyDrawer receives proposal
   ↓
3. ThanosTrace component mounts
   ↓
4. useEffect triggers getVarianceData(proposalId)
   ↓
5. Server action queries case_whatif_budgets table
   ↓
6. Returns VarianceData with Budgeted/Planned/Actual
   ↓
7. Component calculates variancePct and riskStatus
   ↓
8. Intelligence-driven styling applied based on risk
   ↓
9. UI displays with context-aware colors
```

---

## Usage Example

```tsx
// In StrategyDrawer component
function ThanosTrace({ proposal }: { proposal: Proposal }) {
  const [varianceData, setVarianceData] = useState<VarianceData | null>(null)

  useEffect(() => {
    async function loadVarianceData() {
      const data = await getVarianceData({ proposalId: proposal.id })
      setVarianceData(data)
    }
    loadVarianceData()
  }, [proposal.id])

  // Use varianceData for display
  // Intelligence-driven styling automatically applied
}
```

---

## Database Schema Reference

### case_whatif_budgets

```typescript
{
  id: uuid
  proposalId: uuid (FK → proposals.id)
  caseNumber: text
  stencilId: text
  budgetedTotal: numeric(12,2)
  budgetedBreakdown: jsonb
  budgetedBy: uuid
  budgetedAt: timestamp
  plannedTotal: numeric(12,2)
  plannedMetrics: jsonb
  plannedNotes: text
  plannedAt: timestamp
  actualTotal: numeric(12,2)
  actualBreakdown: jsonb
  actualMetrics: jsonb
  actualReviewCount: numeric(5,0)
  lastActualAt: timestamp
  variancePct: numeric(5,2)
  varianceReason: text
  varianceStatus: text
  createdAt: timestamp
  updatedAt: timestamp
}
```

### case_whatif_milestones

```typescript
{
  id: uuid
  whatifBudgetId: uuid (FK → case_whatif_budgets.id)
  milestoneKey: text
  milestoneLabel: text
  scheduledDate: date
  actualDate: date
  budgetToDate: numeric(12,2)
  actualToDate: numeric(12,2)
  variancePctToDate: numeric(5,2)
  notes: text
  reviewedBy: uuid
  reviewedAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

## Next Steps

### Phase 1: Complete ✅
- [x] Database schema creation
- [x] Server actions for fetching variance data
- [x] Component integration with real data
- [x] Intelligence-driven styling integration

### Phase 2: Future Enhancements
- [ ] Create variance data (POST endpoint for creating/updating variance)
- [ ] Update variance data (PUT endpoint for updating actual values)
- [ ] Milestone review creation and updates
- [ ] Variance trend charts and visualization
- [ ] Automated variance status calculation on data updates
- [ ] Variance alerts and notifications
- [ ] Multi-case scenario pooling (Phase 2 feature)

---

## Testing

✅ **Verified**:
- No linting errors
- Type safety maintained
- Schema relationships correct
- Server action input validation
- Component error handling
- Loading states
- Fallback behavior

---

## Related Files

- `apps/boardroom/src/db/schema/variance.ts` - Database schema
- `apps/boardroom/app/actions/variance.ts` - Server actions
- `apps/boardroom/components/StrategyDrawer.tsx` - Component integration
- `packages/shared-utils/src/tailwind-intelligence.ts` - Intelligence utilities
- `apps/boardroom/INTELLIGENCE_DRIVEN_IMPLEMENTATION.md` - Intelligence system docs

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: 2026-01-11
