# The Oracle: What-If Variance Analysis & Scenario Planning

## Strategic Enhancement to v3.0.0 PRD

### Document Version: 1.0 | Date: January 8, 2026

---

## Executive Summary

**Strategic Shift:** Transform What-If from "simple budget conflict detection" to "decisiveness
enablement" by integrating with the Case Template system and adding variance tracking (Budgeted vs
Planned vs Actual).

**Problem:** With 50+ pending proposals, managers can't analyze impact across portfolio. What-If was
just "will this proposal fit?" But executives need deeper insights: "Is this hire overrunning
because we miscalculated, or because market rates changed? How can we predict future variances?"

**Solution:** Every Case gets a "What-If Planning" section (built into Codex Stencils). As time
progresses, actual outcomes are tracked against budgeted/planned forecasts. This creates a
**Tri-Vector** learning loop: Past (Budgeted) → Present (Planned) → Future (Actual).

**Outcome:** Managers come to CEO meetings with **"Know-How" (what happened)** and **"Know-Why" (why
it happened)**, not just approval requests. CEO can then pool 50+ cases into 3-4 strategic scenarios
and make portfolio-level decisions.

**Phase 1 Impact:** MEDIUM effort, VERY HIGH value. Transforms organizational decision-making
culture.

---

## Problem Statement: The 50+ Pending Proposals Paralysis

### Current State (Without Oracle)

```
CEO View: Pool Table Dashboard
┌──────────────────────────────────────┐
│ LISTENING: 50 proposals              │
│ PENDING VOTE: 23 proposals           │
│ Budget Remaining: $2.0M              │
└──────────────────────────────────────┘

Manager: "Should I submit my $500k hiring proposal?"
CEO: "Is it critical?"
Manager: "Yes, we're down 3 engineers..."
CEO: "What's the impact on budget/timeline?"
Manager: "Uh... *goes to calc* ... probably overruns by 10-15%?"
CEO: "OK but what about the 22 other proposals? Can I approve them all?"
Manager: "I don't know..."
```

**Result:** Paralysis. Decisions delayed. Approvals bottleneck.

### Why This Matters

- **50+ pending proposals** = CEO needs intelligence to prioritize approval order
- **Budget overruns** = Costs money and trust
- **No variance learning** = Keep repeating same mistakes (hiring always overruns by 12%)
- **Reactive governance** = Approving without knowing downstream impact

---

## Solution Architecture: The Oracle (Weapon 8)

### Core Concept: Tri-Vector Planning

Every proposal has three time perspectives:

```
┌─────────────────────────────────────────┐
│   WHAT-IF VARIANCE ANALYSIS FLOW        │
├─────────────────────────────────────────┤
│                                         │
│  📋 BUDGETED (Past)                    │
│  └─ Initial estimate when creating     │
│     (e.g., $150k salary + $45k benefits)
│                                         │
│         ↓                               │
│                                         │
│  📊 PLANNED (Present)                  │
│  └─ Forecast at approval time          │
│     (May differ from budgeted)          │
│     (e.g., market rates went up)       │
│                                         │
│         ↓                               │
│                                         │
│  🎯 ACTUAL (Future/Now)                │
│  └─ Reality as it unfolds              │
│     Updated at milestone reviews       │
│     (e.g., hired for $160k)            │
│                                         │
│  → VARIANCE ANALYSIS                    │
│    Why did actual differ from budgeted?
│    What did we learn?                   │
│                                         │
└─────────────────────────────────────────┘
```

### Feature 1: Case Template What-If Planning

Each Codex Stencil (Hiring, Capex, Marketing, etc.) now includes planning sections:

#### Hiring Request Template Example

```typescript
export const HIRING_REQUEST_WHATIF = {
  stencil_id: "hiring_request_v2",

  // Existing proposal fields
  role: "Senior Software Engineer",
  department: "Engineering",

  // NEW: Budgeted Section
  budgeted_section: {
    budgeted_salary: 150_000,
    budgeted_benefits_pct: 30, // 30% of salary
    budgeted_equipment: 5_000,
    budgeted_training: 10_000,
    budgeted_total: 205_500, // Auto-calculated
  },

  // NEW: Planned Section
  planned_section: {
    planned_start_date: "2026-03-01",
    planned_ttp_days: 90, // Time-to-Productivity
    planned_roi_months: 9,
    planned_retention_pct: 85,
    planned_metrics: {
      "Expected Output": "3 features/quarter",
      "Team Fit": "95% match on tech stack",
    },
  },
};
```

Manager fills this out when creating proposal. It takes 5 extra minutes but enables:

- CEO to understand manager's expectations
- Automatic variance tracking over time
- Institutional learning: "Why do hiring plans consistently overrun?"

### Feature 2: Database Schema for Variance Tracking

```typescript
// Stores the variance analysis for each case/proposal
export const case_whatif_budgets = pgTable("case_whatif_budgets", {
  id: uuid("id").primaryKey(),
  proposal_id: uuid("proposal_id").notNull(),
  case_number: text("case_number").notNull(),
  stencil_id: text("stencil_id").notNull(),

  // BUDGETED (manager's initial estimate)
  budgeted_total: numeric("budgeted_total"),
  budgeted_breakdown: jsonb("budgeted_breakdown"),
  budgeted_at: timestamp("budgeted_at"),

  // PLANNED (forecast at approval time)
  planned_total: numeric("planned_total"),
  planned_metrics: jsonb("planned_metrics"),
  planned_at: timestamp("planned_at"),

  // ACTUAL (reality)
  actual_total: numeric("actual_total"),
  actual_breakdown: jsonb("actual_breakdown"),
  actual_metrics: jsonb("actual_metrics"),
  last_actual_at: timestamp("last_actual_at"),

  // VARIANCE (the learning signal)
  variance_pct: numeric("variance_pct"), // (actual - budgeted) / budgeted * 100
  variance_status: text("variance_status"), // "on_track" | "warning" | "overrun" | "underrun"
  variance_reason: text("variance_reason"), // Why did it vary?

  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
});

// Milestone tracking (e.g., "30-day review", "Q1 review", "annual review")
export const case_whatif_milestones = pgTable("case_whatif_milestones", {
  id: uuid("id").primaryKey(),
  whatif_budget_id: uuid("whatif_budget_id").notNull(),

  milestone_key: text("milestone_key"), // "onboarded", "q1_review"
  milestone_label: text("milestone_label"), // "Employee Onboarded", "Q1 Review"

  scheduled_date: date("scheduled_date"), // When it should happen
  actual_date: date("actual_date"), // When it actually happened

  budget_to_date: numeric("budget_to_date"), // Cumulative budgeted spend
  actual_to_date: numeric("actual_to_date"), // Cumulative actual spend
  variance_pct_to_date: numeric("variance_pct_to_date"),

  notes: text("notes"), // Reviewer observations
  reviewed_by: uuid("reviewed_by"),
  reviewed_at: timestamp("reviewed_at"),
});
```

### Feature 3: Scenario Manager Dashboard

Manager sees their cases with Tri-Vector visualization. This is the "Know-How" view.

```typescript
// Example: Manager's Engineering Hiring Dashboard

Interface WhatIfScenarioCard {
  case_number: "CASE-2501",
  title: "Senior Engineer Hire - Alice Chen",
  status: "active",
  
  past: {                    // Budgeted
    label: "📋 Budgeted",
    total: 205_500,
    breakdown: {
      salary: 150_000,
      benefits: 45_000,
      equipment: 5_000,
      training: 5_500
    },
    date: "2026-01-01"
  },
  
  present: {                 // Planned
    label: "📊 Planned",
    total: 215_000,          // Higher due to market rates
    metrics: {
      ttp: 90,
      roi: 9,
      retention: 85
    },
    date: "2026-02-15"       // Approval time
  },
  
  future: {                  // Actual (as of today)
    label: "🎯 Actual (Now)",
    current_total: 220_000,
    projection_eoy: 228_000,
    variance_from_budgeted: 14_500,
    variance_pct: 7.1,
    variance_status: "warning",  // Within 5-10% is warning
    
    // Visual indicator
    color: "#ff9800"          // Orange = warning
  },
  
  next_milestone: {
    label: "Q1 Review",
    scheduled_date: "2026-04-01",
    status: "due_soon"
  }
}
```

**UI Rendering:**

```
┌─────────────────────────────────────────────────────────┐
│ CASE-2501: Senior Engineer Hire - Alice Chen           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📋 Budgeted      │  📊 Planned       │  🎯 Actual     │
│  ────────────────   ──────────────      ──────────     │
│  $205,500         │  $215,000         │  $220,000      │
│                   │                   │  ⚠️ +7.1%      │
│  Salary: 150k     │  Salary: 155k     │  Status: Warn  │
│  Benefits: 45k    │  Benefits: 46.5k  │                │
│  Equipment: 5k    │  Equipment: 5k    │  Next Milestone│
│  Training: 5.5k   │  Training: 8.5k   │  Q1 Review     │
│                   │                   │  Due: Apr 1    │
│  Jan 1            │  Feb 15           │  [Schedule]    │
│                   │                   │                │
└─────────────────────────────────────────────────────────┘

Budget vs Reality Timeline (with milestones)
```

---

## Strategic Impact: From 50+ Paralysis to Portfolio Decisions

### Before Oracle (Current State)

```
CEO: "We have 50 pending proposals. Should I approve all?"
Manager: "Depends..."
CEO: "Depends on what?"
Manager: "Budget. Timeline. Market conditions..."
CEO: "OK, give me a report."
Manager: *spends 4 hours in spreadsheets*
CEO: *approves 5 at random, defers rest*
```

### After Oracle (With Variance Intelligence)

```
CEO: Opens Pool Table Dashboard
     → 50 pending proposals shown as variance cards

CEO clicks "Create Scenario: Aggressive Q1 Growth"
     → Selects 5 hiring + 2 capex proposals
     → System runs variance analysis:
        - Total Budgeted: $2.5M
        - Total Planned: $2.6M
        - Total Projected Actual: $2.8M
        - Variance: +12% (OVERRUN)
     → Recommendations:
        "Defer 2 capex proposals to Q2 → stays within budget"
        "Negotiate start dates → saves $120k"

CEO: "Interesting. Show me Conservative scenario."
     → Selects 3 critical hirings only
     → Total budgeted: $600k
     → Total actual projection: $620k
     → Variance: +3.3% (ON TRACK)

CEO: "Approve Conservative. Defer rest."
     → Decisions made in 10 minutes with intelligence
```

---

## Implementation Roadmap

### Phase 1 (v3.0.0 MVP): Single-Case Variance Tracking

**Effort: MEDIUM | Timeline: 2-3 weeks**

**Deliverables:**

- ✅ Extend Codex Stencils with budgeted/planned sections (all templates)
- ✅ Create case_whatif_budgets + case_whatif_milestones database tables
- ✅ Build "Scenario Manager" dashboard with Tri-Vector cards
- ✅ Milestone review scheduling (reminder emails)
- ✅ Variance alerts (overrun by 10%+)
- ✅ API endpoints:
  - `POST /api/cases/:id/whatif/plan` (create plan)
  - `GET /api/cases/:id/whatif` (get variance analysis)
  - `POST /api/cases/:id/whatif/milestone/:id/review` (record milestone)
  - `GET /api/user/whatif/scenarios` (dashboard)

**Database Migrations:**

```sql
CREATE TABLE case_whatif_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL,
  case_number TEXT NOT NULL,
  stencil_id TEXT NOT NULL,
  budgeted_total NUMERIC(12,2),
  budgeted_breakdown JSONB,
  budgeted_at TIMESTAMP,
  planned_total NUMERIC(12,2),
  planned_metrics JSONB,
  planned_at TIMESTAMP,
  actual_total NUMERIC(12,2),
  actual_breakdown JSONB,
  actual_metrics JSONB,
  last_actual_at TIMESTAMP,
  variance_pct NUMERIC(5,2),
  variance_status TEXT,
  variance_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (proposal_id) REFERENCES proposals(id)
);

CREATE TABLE case_whatif_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatif_budget_id UUID NOT NULL,
  milestone_key TEXT NOT NULL,
  milestone_label TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  actual_date DATE,
  status TEXT,
  budget_to_date NUMERIC(12,2),
  actual_to_date NUMERIC(12,2),
  variance_pct_to_date NUMERIC(5,2),
  notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (whatif_budget_id) REFERENCES case_whatif_budgets(id)
);

CREATE INDEX idx_whatif_proposal ON case_whatif_budgets(proposal_id);
CREATE INDEX idx_whatif_case ON case_whatif_budgets(case_number);
CREATE INDEX idx_milestone_whatif ON case_whatif_milestones(whatif_budget_id);
```

### Phase 2 (v3.1): Multi-Case Scenario Pooling

**Effort: MEDIUM | Timeline: 2-3 weeks (depends on Phase 1 completion)**

**Deliverables:**

- Pool 50+ cases into 3-4 named scenarios (Aggressive, Conservative, Balanced)
- Multi-case variance aggregation
- Conflict detection: "If approve all, exceeds budget by $200k"
- Smart recommendations: "Defer case ABC to Q2"
- Predictive variance modeling (ML): "Based on past, hiring overruns by 8%"

**API Endpoints:**

- `POST /api/scenarios/create` (create multi-case scenario)
- `GET /api/scenarios/:id` (get scenario with conflict analysis)
- `GET /api/scenarios/:id/recommendations` (AI-powered suggestions)

### Phase 3 (v3.2): Predictive & Autonomous Features

- ML variance prediction ("This hire will likely overrun by 9%")
- Automated adjustment suggestions
- Integration with financial planning tools (NetSuite, SAP)
- Email/Slack alerts on milestone reviews

---

## How Oracle Solves Your Strategic Requirement

**Your Requirement:**

> "Everything shall be planned unless specifically mentioned. We need budgeted, planned,
> actual—similar to past-present-future. Draw important analysis figures at dashboard or scenario
> manager. Give managers Know-How and Know-Why, not just asking for approval."

**Oracle Delivers:**

| Requirement                    | Oracle Solution                                                      |
| ------------------------------ | -------------------------------------------------------------------- |
| **Everything Planned**         | Budgeted/Planned sections baked into every Codex Stencil             |
| **Past-Present-Future**        | Tri-Vector: Budgeted (Past) → Planned (Present) → Actual (Future)    |
| **Important Analysis Figures** | Dashboard card shows variance %, status, breakdown comparison        |
| **Know-How**                   | "Alice Chen cost 7.1% more than budgeted—why?"                       |
| **Know-Why**                   | Milestone reviews capture reason: "Market salary rates increased 8%" |
| **Not Just Approval**          | Manager comes with data; CEO makes strategic portfolio decisions     |

---

## Integration with Other Systems

### Integrates With: The Codex (Weapon 1)

Every stencil gets budgeted/planned sections automatically.

### Integrates With: The Vectors (Weapon 6)

What-If variance data feeds into portfolio analytics dashboard.

### Integrates With: The Compass (Weapon 7)

When hiring case approved, to-dos can reference variance targets: "Train new hire to 75%
productivity by day 90"

### Integrates With: The Herald (Weapon 9)

CEO can broadcast variance learnings: "Q4 hiring averaged 12% overrun due to market conditions.
Adjusting Q1 budget accordingly."

---

## Success Metrics

### Phase 1 Success (v3.0.0):

- ✅ 100% of active cases have budgeted/planned data
- ✅ Milestone reviews scheduled for >80% of cases
- ✅ Average variance alert response time <24 hours
- ✅ Manager feedback: "I understand what I committed to"

### Phase 2 Success (v3.1):

- ✅ CEO can create scenario in <2 minutes
- ✅ Portfolio decisions made with 3-4 scenarios (not random approvals)
- ✅ Variance predictions accurate to ±5%
- ✅ Organizational learning: "We now know hiring overruns by 8%"

---

## Risks & Mitigations

### Risk 1: "Budgeted/Planned is extra work"

**Mitigation:** Use pre-filled defaults from past similar cases. Most fields auto-calculated.

### Risk 2: "Variance tracking requires discipline (milestone reviews)"

**Mitigation:** Automated reminders. CEO can delegate to Guardian role. Milestone reviews <15 min.

### Risk 3: "50+ scenarios = analysis paralysis"

**Mitigation:** Start with 3-4 named scenarios (Aggressive, Conservative, Balanced). AI recommends
best.

### Risk 4: "Variance models are inaccurate"

**Mitigation:** Phase 1 has no ML (humans review). Phase 2 adds ML learning from actual variance
patterns.

---

## Next Steps

1. **Review & Validate** — Confirm case template What-If sections make sense for your use cases
2. **Design Workflow** — Detail how managers fill budgeted/planned sections (forms, defaults,
   examples)
3. **Create Mockups** — Design Tri-Vector card UI for scenario manager dashboard
4. **Database Migration** — Plan schema migration for active proposals
5. **API Development** — Build endpoints for plan creation, variance updates, milestone reviews
6. **Phase 1 Sprint** — 2-3 week sprint to deliver single-case variance tracking

---

## Questions for Strategic Alignment

1. **Case Review Frequency:** Should milestone reviews be quarterly, semi-annual, or annual? (Can
   vary by stencil type)
2. **Variance Thresholds:** At what % overrun do we escalate to CEO? (Recommend 10% default,
   configurable)
3. **Learning Loop:** Who owns variance analysis (Guardian? CFO?)? How often do we review patterns?
4. **Portfolio Limits:** What's the max number of cases to pool in one scenario? (Recommend 10-15 to
   avoid paralysis)
5. **Automation:** Should Oracle suggest recommendation automatically, or present data for manual
   decision?
