# PRD v3.0.0 — Strategic Enhancement Evaluation

**Recommendations for v3.1+ Evolution**

---

## Executive Summary

Your feedback is strategically sound. The three proposed enhancements + config layering are all
valuable, but with different priorities and implementation timelines.

**My Recommendation:** YES (all 3), with HYBRID pacing. Phase 1 → 2 → 3.

**Critical Addition:** The **Broadcast Announcements System** (CEO/Admin sticky banner with proposal
linking) is foundational and should be **Phase 1 MVP**.

---

## 1️⃣ Delegated Draft Workflow

### Verdict: **YES** ✅

**Reasoning:**

- Solves real UX friction ("blank page burden" for CEO)
- Reduces cognitive load on Sovereign (they review, don't invent)
- Maintains CEO authority (they can reject/edit pre-drafted to-dos)
- Aligns with "Council proposes, Sovereign decides" principle

**Implementation Cost:** LOW (Phase 1 addition)

### How It Works

```
CURRENT FLOW:
Manager submits proposal → CEO approves → CEO creates to-do manually
                                          ↑ Cognitive burden here

NEW FLOW:
Manager submits proposal → Manager pre-drafts suggested to-dos → CEO approves
                                                                 → One-click confirm pre-drafted to-dos
                                                                 → Edit/reject if needed
                          ↑ Burden shifted to proposer (who knows what's needed)
```

### Database Schema Addition

```typescript
// In proposals table, add:
suggested_todos: {
  title: string;
  assignee_id: string;
  due_days_from_approval: number;
  priority: "high" | "normal" | "low";
}
[];

// Example:
{
  suggested_todos: [
    { title: "Post job on LinkedIn", assignee_id: "marketing_id", due_days: 3, priority: "high" },
    { title: "Brief engineering team", assignee_id: "cto_id", due_days: 7, priority: "normal" },
    { title: "Prepare onboarding", assignee_id: "hr_id", due_days: 14, priority: "normal" },
  ];
}
```

### UI Flow

```
WHEN MANAGER CREATES PROPOSAL:
┌──────────────────────────────────┐
│ Proposal Form (Hiring Request)   │
├──────────────────────────────────┤
│ Job Title: [Senior Engineer]     │
│ Salary: $250k                    │
│                                  │
│ SUGGESTED TO-DOS (NEW):          │
│ ☑ Post job on LinkedIn           │
│   └─ Assignee: Marketing         │
│   └─ Due: 3 days                 │
│   └─ Priority: High              │
│                                  │
│ ☑ Brief team on new hire         │
│   └─ Assignee: CTO               │
│   └─ Due: 7 days                 │
│   └─ Priority: Normal            │
│                                  │
│ [+ Add Another Suggested To-Do]  │
│ [Submit Proposal]                │
└──────────────────────────────────┘

WHEN CEO APPROVES:
┌──────────────────────────────────┐
│ APPROVE + CREATE TO-DOS?         │
├──────────────────────────────────┤
│ SUGGESTED BY MANAGER:            │
│ ☑ Post job on LinkedIn           │
│ ☑ Brief team on new hire         │
│ ☑ Prepare onboarding             │
│                                  │
│ [One-click] [Edit] [Reject All]  │
│                                  │
│ [APPROVE + CREATE] [APPROVE ONLY]│
└──────────────────────────────────┘
```

### Benefits

| Benefit                              | Impact                                                          |
| ------------------------------------ | --------------------------------------------------------------- |
| **Reduced Sovereign Cognitive Load** | CEO focuses on "Should we do this?" not "What do we do after?"  |
| **Faster Decision-Making**           | No pausing to define follow-up tasks                            |
| **Accountability**                   | Manager owns the "how," Sovereign owns the "whether"            |
| **Audit Trail**                      | Chronos tracks: Manager proposed → CEO approved → Tasks created |
| **Flexibility**                      | CEO can still reject/edit suggested to-dos                      |

### Implementation Timeline

**Phase 2** (Post-Launch)

- Add `suggested_todos` field to proposals schema
- Add form UI for managers to define suggested to-dos
- Modify approval modal to show pre-drafted tasks
- Update to-do creation logic to respect suggestions

---

## 2️⃣ Decision Simulation (What-If Vector) — ENHANCED WITH VARIANCE TRACKING

### Verdict: **HYBRID → YES (with variance extension)** 🔀→✅

**Strategic Shift:** Instead of simple budget conflict detection, integrate What-If scenarios with
the **Case Template System** and add **Variance Analysis** (Budgeted vs Planned vs Actual). This
transforms What-If from "approval gating" to "decisiveness enablement"—giving managers the
"Know-How" and "Know-Why" before CEO approves.

**Why This Matters:**

- **Current problem:** 50+ pending proposals create analysis paralysis; manager can't justify impact
- **Your insight:** Use Case templates to standardize What-If planning, then track variance to
  create learning loop
- **Result:** Managers come prepared with budgeted/planned/actual analysis; CEO gets decision-ready
  intelligence

### Architecture: Case-Based What-If with Variance Tracking

#### 1. What-If Case Template Extension

Each Codex Stencil (Hiring Request, Capex, Marketing Budget, etc.) gets a **What-If Planning
Section**:

```typescript
// /canon/codex/case-template-whatif.ts

export interface CaseWhatIfTemplate {
  stencil_id: string; // e.g., "hiring_request_v2"
  budgeted_section: {
    fields: [
      { label: "Annual Salary Budget"; type: "currency"; key: "budgeted_salary" },
      { label: "Benefits Budget"; type: "currency"; key: "budgeted_benefits" },
      { label: "Equipment Budget"; type: "currency"; key: "budgeted_equipment" },
      { label: "Training Budget"; type: "currency"; key: "budgeted_training" },
    ];
  };
  planned_section: {
    fields: [
      { label: "Expected Start Date"; type: "date"; key: "planned_start" },
      { label: "Onboarding Duration (weeks)"; type: "number"; key: "planned_onboarding" },
      { label: "Ramp-Up Timeline (days)"; type: "number"; key: "planned_rampup" },
      {
        label: "Productivity Target (% of senior)";
        type: "percentage";
        key: "planned_productivity";
      },
    ];
  };
  variance_tracking: {
    enabled: true;
    review_interval: "quarterly" | "bi-annual" | "annual";
    milestones: [
      { key: "first_month"; label: "1-Month Review"; days: 30 },
      { key: "three_month"; label: "Q1 Review"; days: 90 },
      { key: "six_month"; label: "Mid-Year Review"; days: 180 },
      { key: "annual"; label: "Annual Review"; days: 365 },
    ];
  };
}

// Example: Hiring Stencil Extended with What-If
export const HIRING_WHATIF_STENCIL: CaseWhatIfTemplate = {
  stencil_id: "hiring_request_v2",
  budgeted_section: {
    fields: [
      { label: "Annual Salary Budget", type: "currency", key: "budgeted_salary" },
      { label: "Benefits Budget (30% of salary)", type: "currency", key: "budgeted_benefits" },
      { label: "Equipment + Setup", type: "currency", key: "budgeted_equipment" },
      { label: "Training (first year)", type: "currency", key: "budgeted_training" },
    ],
  },
  planned_section: {
    fields: [
      { label: "Expected Start Date", type: "date", key: "planned_start" },
      { label: "Time-to-Productivity (days)", type: "number", key: "planned_ttp" },
      { label: "Expected ROI (months)", type: "number", key: "planned_roi" },
      { label: "Retention Confidence (%)", type: "percentage", key: "planned_retention" },
    ],
  },
  variance_tracking: {
    enabled: true,
    review_interval: "quarterly",
    milestones: [
      { key: "onboarding", label: "Onboarded", days: 30 },
      { key: "q1_review", label: "Q1 Review", days: 90 },
      { key: "mid_year", label: "Mid-Year Review", days: 180 },
      { key: "annual", label: "Annual Review", days: 365 },
    ],
  },
};
```

#### 2. Variance Analysis Database Schema

```typescript
// Track the progression: Budgeted → Planned → Actual
export const case_whatif_budgets = pgTable("case_whatif_budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  proposal_id: uuid("proposal_id").notNull(),
  case_number: text("case_number").notNull(), // Link to Case
  stencil_id: text("stencil_id").notNull(), // Which template

  // BUDGETED (from proposal/case creation)
  budgeted_total: numeric("budgeted_total", { precision: 12, scale: 2 }).notNull(),
  budgeted_breakdown: jsonb("budgeted_breakdown"), // { salary: 150000, benefits: 45000, ... }
  budgeted_by: uuid("budgeted_by").notNull(), // Manager who created
  budgeted_at: timestamp("budgeted_at").notNull().defaultNow(),

  // PLANNED (manager's expectation at approval time)
  planned_total: numeric("planned_total", { precision: 12, scale: 2 }),
  planned_metrics: jsonb("planned_metrics"), // { ttp: 60, roi: 9, retention: 85, ... }
  planned_notes: text("planned_notes"),
  planned_at: timestamp("planned_at"),

  // ACTUAL (tracking against reality)
  actual_total: numeric("actual_total", { precision: 12, scale: 2 }),
  actual_breakdown: jsonb("actual_breakdown"), // Populated as time progresses
  actual_metrics: jsonb("actual_metrics"),
  actual_review_count: integer("actual_review_count").default(0),
  last_actual_at: timestamp("last_actual_at"),

  // VARIANCE ANALYSIS
  variance_pct: numeric("variance_pct", { precision: 5, scale: 2 }), // (actual - budgeted) / budgeted * 100
  variance_reason: text("variance_reason"), // Why did it vary? Free-form or category
  variance_status: text("variance_status"), // "on_track" | "warning" | "overrun" | "underrun"

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Milestone tracking for variance reviews
export const case_whatif_milestones = pgTable("case_whatif_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  whatif_budget_id: uuid("whatif_budget_id").notNull(),
  milestone_key: text("milestone_key").notNull(), // "onboarding", "q1_review", etc.
  milestone_label: text("milestone_label").notNull(),

  scheduled_date: date("scheduled_date").notNull(), // When it should happen
  actual_date: date("actual_date"), // When it actually happened

  // Metrics captured at this milestone
  budget_to_date: numeric("budget_to_date", { precision: 12, scale: 2 }),
  actual_to_date: numeric("actual_to_date", { precision: 12, scale: 2 }),
  variance_to_date_pct: numeric("variance_to_date_pct", { precision: 5, scale: 2 }),

  notes: text("notes"), // Reviewer observations
  reviewed_by: uuid("reviewed_by"),
  reviewed_at: timestamp("reviewed_at"),

  created_at: timestamp("created_at").notNull().defaultNow(),
});
```

#### 3. What-If Scenario Manager Dashboard

Manager creates case with What-If plan; sees variance dashboard over time:

```typescript
// Scenario Manager Card in Dashboard

interface WhatIfScenarioCard {
  case_number: string;
  proposal_title: string;
  status: "active" | "under_review" | "completed";

  // The "Past-Present-Future" Tri-Vector
  budgeted: {
    total: number;
    breakdown: Record<string, number>;
    date: Date;
  };

  planned: {
    total: number;
    metrics: Record<string, any>;
    date: Date;
  };

  actual: {
    current_total: number;
    projection_eoy: number;
    variance_from_budgeted: number;
    variance_pct: number;
    status: "on_track" | "warning" | "overrun" | "underrun";
  };

  next_milestone: {
    label: string;
    scheduled_date: Date;
    status: "due_soon" | "upcoming" | "overdue";
  };
}

// Example Dashboard Component

export function WhatIfAnalysisFigure({ scenario }: { scenario: WhatIfScenarioCard }) {
  return (
    <div className="what-if-analysis">
      <h3>{scenario.case_number}: {scenario.proposal_title}</h3>

      {/* The Know-How: Visual Tri-Vector */}
      <div className="tri-vector">
        <div className="vector past">
          <h4>📋 Budgeted</h4>
          <p className="amount">${scenario.budgeted.total.toLocaleString()}</p>
          <ul className="breakdown">
            {Object.entries(scenario.budgeted.breakdown).map(([key, val]) => (
              <li key={key}>{key}: ${val.toLocaleString()}</li>
            ))}
          </ul>
          <p className="date">{scenario.budgeted.date.toLocaleDateString()}</p>
        </div>

        <div className="vector present">
          <h4>📊 Planned</h4>
          <p className="amount">${scenario.planned.total.toLocaleString()}</p>
          <ul className="metrics">
            {Object.entries(scenario.planned.metrics).map(([key, val]) => (
              <li key={key}>{key}: {val}</li>
            ))}
          </ul>
          <p className="date">{scenario.planned.date.toLocaleDateString()}</p>
        </div>

        <div className="vector future">
          <h4>🎯 Actual (Now)</h4>
          <p className={`amount ${scenario.actual.status}`}>
            ${scenario.actual.current_total.toLocaleString()}
          </p>
          <p className="variance">
            Variance: {scenario.actual.variance_pct > 0 ? "+" : ""}
            {scenario.actual.variance_pct.toFixed(1)}%
          </p>
          <p className={`status ${scenario.actual.status}`}>
            {scenario.actual.status === "on_track" && "✅ On Track"}
            {scenario.actual.status === "warning" && "⚠️ Warning"}
            {scenario.actual.status === "overrun" && "❌ Over Budget"}
            {scenario.actual.status === "underrun" && "💰 Under Budget"}
          </p>
        </div>
      </div>

      {/* The Know-Why: Analysis Chart */}
      <div className="analysis-chart">
        <h4>Budget Variance Over Time</h4>
        {/* Chart showing: Budgeted (baseline) vs Planned (initial forecast) vs Actual (reality) */}
        <VarianceChart
          budgeted={scenario.budgeted.total}
          planned={scenario.planned.total}
          actual={scenario.actual.current_total}
          milestones={scenario.milestones}
        />
      </div>

      {/* Next Actions */}
      <div className="next-milestone">
        <h4>Next Milestone</h4>
        <p>
          {scenario.next_milestone.label} —{" "}
          {scenario.next_milestone.scheduled_date.toLocaleDateString()}
        </p>
        <button>Schedule Review</button>
      </div>
    </div>
  );
}

// CSS-in-JS for Tri-Vector visualization
const styles = `
.tri-vector {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
}

.vector {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.vector.past { border-left: 4px solid #9e9e9e; }  /* Gray = past */
.vector.present { border-left: 4px solid #2196f3; } /* Blue = present */
.vector.future { border-left: 4px solid #4caf50; }  /* Green = future */

.amount {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.amount.on_track { color: #4caf50; }
.amount.warning { color: #ff9800; }
.amount.overrun { color: #f44336; }
.amount.underrun { color: #2196f3; }

.status {
  font-weight: bold;
  margin-top: 0.5rem;
}

.status.on_track { color: #4caf50; }
.status.warning { color: #ff9800; }
.status.overrun { color: #f44336; }
.status.underrun { color: #2196f3; }
`;
```

#### 4. Multi-Proposal Scenario Analysis (Phase 2)

Once single-case variance is solid, enable "What-If Pool" scenarios:

```typescript
// Advanced: Multi-case scenario planning

interface WhatIfScenario {
  name: string;                              // e.g., "Aggressive Growth"
  description: string;
  cases_included: string[];                  // Case numbers to include
  assumptions: Record<string, any>;          // Override assumptions
  
  // Total impact across all cases
  total_impact: {
    budgeted_total: number;
    planned_total: number;
    projected_variance: number;
    conflicts: string[];                     // "If approve all, exceeds budget by $200k"
    recommendations: string[];
  };
}

// API: Create scenario from case pool
POST /api/scenarios/create
{
  name: "Aggressive Q1 Growth",
  description: "Hire 3 engineers + 1 designer + 2 marketing",
  case_ids: ["CASE-2501", "CASE-2502", "CASE-2503", "CASE-2504", "CASE-2505"],
  assumptions: {
    salary_inflation: 0.05,
    retention_rate: 0.95,
    productivity_ramp: 60  // days to productivity
  }
}

Response:
{
  scenario_id: "scenario-001",
  total_budgeted: 1_500_000,
  total_planned: 1_450_000,
  total_projected_actual: 1_580_000,  // With variance learning
  variance_pct: 5.3,
  conflicts: [
    "Exceeds Q1 budget by $80k",
    "Requires Board approval per Global Config"
  ],
  recommendations: [
    "Defer CASE-2505 (Marketing hire) to Q2",
    "Negotiate startup date for CASE-2502 (Designer) to mid-month"
  ]
}
```

### Decision

**Phase 1 MVP (UPGRADED from "simple budget check"):**

- Single-case variance tracking: Budgeted → Planned → Actual
- Case-template What-If planning sections
- Tri-Vector dashboard visualization (Past/Present/Future)
- Milestone review scheduling
- Variance analysis with "Know-How" + "Know-Why"
- **Effort: MEDIUM-LOW | Value: VERY HIGH** (transforms decision-making culture)

**Phase 2:**

- Multi-case scenario pooling (Aggressive, Conservative, Balanced)
- Advanced constraint solving (what's the optimal approval order?)
- Predictive variance modeling (ML learning from past variances)
- Integration with CI/CD for automated variance reporting

**Why This Addresses Your Insight:**

- ✅ Managers come prepared with budgeted/planned/actual analysis before CEO meeting
- ✅ What-If planning is baked into Case templates (not a separate system)
- ✅ Variance tracking creates learning loop: why do hiring plans consistently overrun by 8%?
- ✅ CEO gets "decisiveness enablement" (know-why) instead of just approval gating
- ✅ Scales to 50+ pending proposals: each has its own variance story

---

## 3️⃣ Conditional Approvals (To-Do Gating)

### Verdict: **HYBRID** 🔀

**Why Hybrid (not full YES):**

- **Excellent for safety** (prevents premature execution)
- **Adds complexity** (conditional state machine)
- **Admin overhead** (requires CEO to think through gating rules)
- **Phase 2-3 candidate** (not critical for MVP, but valuable later)

**Recommendation:** Implement **simple version in Phase 2**, full version in **Phase 3**.

### Simple Version (Phase 2)

**Linear Dependency (Task Order):**

```typescript
// To-Do creation UI adds optional "Depends On" field
Create To-Do Modal:
┌─────────────────────────────────┐
│ Task: "Release Funds"           │
│ Assignee: [Finance]             │
│ Due: 7 days                     │
│ Priority: High                  │
│                                 │
│ DEPENDENCY (NEW):               │
│ ☑ Cannot mark 'Done' until:     │
│    [Contract Signed] ← Task #1  │
│                                 │
│ [Create To-Do]                  │
└─────────────────────────────────┘
```

**How It Works:**

1. Manager creates Task B with "Depends on Task A"
2. Task B shows as "Blocked" (grayed out) until Task A is marked Done
3. When trying to mark Task B Done, system checks: "Task A marked Done?" → if yes, allow
4. Notification sent: "Task B is now unblocked!"

**Implementation:**

- Add `depends_on_todo_id` field to todos table
- Add blocking logic in update endpoint
- Show "Blocked" state in UI with red banner
- Performance: <100ms (single foreign key check)

### Complex Version (Phase 3)

**Multi-Step Workflows with Guardian Verification:**

```typescript
// Guardian can "verify" that a task was legitimately completed
// before dependent tasks unlock

Task Flow:
Task 1: "Sign Contract" → Assigned to: Legal
Task 2: "Release Funds" → Depends on Task 1, Guardian Verification Required
Task 3: "Onboard Employee" → Depends on Task 2

When Task 1 marked 'Done':
┌──────────────────────────────────┐
│ ⚠️ VERIFICATION REQUIRED         │
│ Task: "Sign Contract"            │
│ Status: Done (by Legal Team)     │
│ Evidence: [Contract PDF link]    │
│                                  │
│ Guardian must verify before      │
│ Task 2 can proceed.              │
│                                  │
│ [View Evidence] [Verify] [Reject]│
└──────────────────────────────────┘
```

### Benefits & Risks

| Version        | Benefit                                     | Risk           | Timeline |
| -------------- | ------------------------------------------- | -------------- | -------- |
| Simple (v3.2)  | Prevents out-of-order execution             | Minimal        | 2 weeks  |
| Complex (v3.3) | Adds verification gate for high-value tasks | Admin overhead | 4 weeks  |

**Recommendation:** Start with Simple version (Phase 2), learn from usage, then decide if Complex
version is needed (Phase 3).

---

## 4️⃣ Config Matrix — Layered Inheritance

### Verdict: **YES** ✅

**This is essential architecture. Not optional.**

**Why YES:**

- Prevents performance degradation as config scope grows
- Follows DRY principle (no duplicating global config at user level)
- Enables cache invalidation strategy (know exactly what changed)
- Required for WebSocket broadcast optimization

### Layered Inheritance Model

```typescript
// THREE LAYERS, EACH WITH OWN STORAGE + CACHE STRATEGY

Layer 1: GLOBAL LAW (CEO Sets)
├─ Storage: global_configs table (single row)
├─ Cache: In-Memory Broadcast (WebSocket)
├─ TTL: Immediate (broadcast on change)
├─ Example: approval_threshold: capex > $500k requires board
│
├─ API: GET /api/admin/global-config → Returns merged config
│
└─ Broadcast: When CEO changes config
   → WebSocket message to ALL active sessions
   → "Config updated: approval_threshold = $750k"
   → All clients reload local config immediately

Layer 2: CIRCLE RULES (Optional - Future)
├─ Storage: circles table metadata column
├─ Cache: Redis / Local KV (5-min TTL)
├─ Example: "SEA Region requires all proposals >$100k to go to Regional Head"
│
└─ Use Case: Multi-regional organizations with local governance

Layer 3: USER PREFS (Manager Sets)
├─ Storage: user_configs table (indexed by user_id)
├─ Cache: Database index (<50ms lookup)
├─ Example: theme: "dark", email_frequency: "daily"
│
└─ Use Case: Personal UX customization (doesn't affect governance)
```

### Config Resolution Logic

```typescript
// When loading config for a user viewing a proposal in a circle:

function getEffectiveConfig(user_id: string, circle_id: string) {
  // START with GLOBAL LAW (immutable)
  let config = await getGlobalConfig();

  // LAYER Circle Rules (if it exists)
  const circleOverrides = await getCircleRules(circle_id);
  if (circleOverrides) {
    config = { ...config, ...circleOverrides };
  }

  // LAYER User Preferences (only for UI, not governance)
  const userPrefs = await getUserConfig(user_id);
  config = { ...config, ...userPrefs };

  return config;
}
```

### Performance Optimization

```typescript
// Cache strategy to prevent N+1 queries

// 1. Global Config
┌─────────────────────────────────┐
│ global_configs table            │ ← Single row, rarely changes
│ Broadcast on change via WS      │
│ In-memory copy in all clients   │
└─────────────────────────────────┘

// 2. Circle Rules (if enabled)
┌─────────────────────────────────┐
│ Redis Cache (5-min TTL)         │
│ Key: "circle:{circle_id}:rules" │
│ Invalidate on CEO change        │
└─────────────────────────────────┘

// 3. User Prefs
┌─────────────────────────────────┐
│ user_configs table              │
│ Indexed by user_id              │
│ <50ms direct lookup             │
│ Change applies immediately      │
└─────────────────────────────────┘
```

### Implementation Roadmap

**Phase 1:** Global Config + User Prefs (2 layers) **Phase 2:** Add Circle Rules layer (if customers
request regional governance) **Phase 3:** Add Team Rules layer (if needed for granular control)

---

## 🚀 THE CRITICAL ADDITION: Broadcast Announcements

### Verdict: **YES** ✅ (PHASE 1 MVP)

**This is your most important insight.** You're absolutely right that this is missing and critical.

**Why It's Critical:**

- CEO actions (decisions, comments, approvals) need **visibility across the organization**
- Current PRD lacks a **channel for executive announcements**
- "Sticky banner" = persistent, non-dismissible (until read)
- Linking to proposals = maintains forensic audit trail

### The Broadcast System (New Weapon 8)

**Location:** Top of page, sticky banner

**UI Example:**

```
┌─────────────────────────────────────────────────────────┐
│ 📢 CEO ANNOUNCEMENT (Sticky Banner)                     │
├─────────────────────────────────────────────────────────┤
│ "Approved: Q1 Marketing Budget Expansion"               │
│ By: CEO (John Smith)                                    │
│ Action: APPROVED                                        │
│ Proposal: #PROP-2024-0451 (Marketing Budget $500k)      │
│ Reason: "Market window closing. Aggressive spend now."  │
│ Timestamp: Jan 8, 2026 11:23 AM EST                     │
│                                                         │
│ [View Proposal] [Mark Read] [Dismiss]                  │
└─────────────────────────────────────────────────────────┘
```

### What Can Be Broadcast

| Event            | Example                                     | Audience       | Icon |
| ---------------- | ------------------------------------------- | -------------- | ---- |
| **Approval**     | "Approved: Hiring 5 Engineers"              | Entire org     | ✅   |
| **Veto**         | "Vetoed: Q4 Capex (needs rework)"           | Entire org     | ❌   |
| **Announcement** | "All proposals >$1M now require board vote" | Entire org     | 📢   |
| **Poll**         | "Voting: Should we acquire StartupX?"       | Circle members | 🗳️   |
| **Emergency**    | "PAUSE all hiring approvals immediately"    | Entire org     | 🚨   |

### Database Schema

```typescript
// New table: broadcasts
export const broadcasts = pgTable("broadcasts", {
  id: uuid("id").primaryKey().defaultRandom(),

  // WHO
  created_by: uuid("created_by").notNull(), // CEO/Admin

  // WHAT
  type: text("type").notNull(), // "approval" | "veto" | "announcement" | "poll" | "emergency"
  title: text("title").notNull(),
  message: text("message"),

  // LINKED TO
  proposal_id: uuid("proposal_id"), // If about a proposal
  case_number: text("case_number"), // If about a ticket/case

  // TARGETING
  audience: text("audience").notNull(), // "all" | "circle:{id}" | "role:{role}"

  // VISIBILITY
  sticky: boolean("sticky").default(true), // Non-dismissible?
  expires_at: timestamp("expires_at"), // Auto-remove after N days

  // TRACKING
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Track who has read each broadcast
export const broadcast_reads = pgTable("broadcast_reads", {
  id: uuid("id").primaryKey().defaultRandom(),
  broadcast_id: uuid("broadcast_id").notNull(),
  user_id: uuid("user_id").notNull(),
  read_at: timestamp("read_at").notNull().defaultNow(),
});
```

### API Endpoints

```typescript
// Create broadcast (CEO/Admin only)
POST /api/admin/broadcasts
{
  type: "approval",
  title: "Q1 Marketing Budget Approved",
  message: "Moving forward with aggressive Q1 spend to capture market window.",
  proposal_id: "uuid",
  audience: "all",
  sticky: true,
  expires_at: "2026-01-15"
}

// Get active broadcasts (for sticky banner)
GET /api/broadcasts/active
→ Returns all broadcasts where expires_at > now() and user hasn't read

// Mark broadcast as read
POST /api/broadcasts/:id/read
→ Records user_id + read timestamp in broadcast_reads

// Get broadcast history (audit trail)
GET /api/broadcasts?limit=50&offset=0
→ Returns paginated list of past broadcasts
```

### UI Components

**1. Sticky Banner (New Island)**

```typescript
// /islands/BroadcastBanner.tsx
export default function BroadcastBanner() {
  const [broadcasts, setBroadcasts] = useState([]);

  useEffect(() => {
    // Subscribe to WebSocket for new broadcasts
    const ws = new WebSocket("ws://localhost/api/broadcasts/stream");
    ws.onmessage = (event) => {
      const newBroadcast = JSON.parse(event.data);
      setBroadcasts([newBroadcast, ...broadcasts]);
    };
  }, []);

  return (
    <>
      {broadcasts.map((broadcast) => (
        <div className="sticky-banner">
          <div className="icon">{getIcon(broadcast.type)}</div>
          <div className="content">
            <h3>{broadcast.title}</h3>
            <p>{broadcast.message}</p>
            {broadcast.proposal_id && (
              <a href={`/proposals/${broadcast.proposal_id}`}>
                View Proposal
              </a>
            )}
          </div>
          <button onClick={() => markAsRead(broadcast.id)}>
            Mark Read
          </button>
        </div>
      ))}
    </>
  );
}
```

**2. Broadcast Creation Modal (For CEO/Admin)**

```typescript
// /routes/admin/broadcast.tsx
// Simple form to create + send broadcasts
// Pre-fill with common templates:
// - "Approved: [Proposal Title]"
// - "Veto: [Proposal Title] - [Reason]"
// - "Announcement: [Free text]"
// - "Emergency: [Free text]"
```

**3. Broadcast History Page**

```typescript
// /routes/broadcasts/history.tsx
// Paginated list of all past broadcasts
// Filter by: type, audience, creator, date
// Search: by title/message
// Export to CSV: for compliance
```

### Benefits

| Benefit                    | Impact                                                   |
| -------------------------- | -------------------------------------------------------- |
| **Organization Alignment** | Everyone knows CEO decisions immediately (no rumor mill) |
| **Transparency**           | Reasoning behind approvals/vetoes visible org-wide       |
| **Accountability**         | Forensic record of who said what when                    |
| **Urgency**                | Sticky banner makes urgent announcements inescapable     |
| **Compliance**             | Audit trail for "CEO announced policy change on Jan 8"   |
| **Morale**                 | Recognition of approvals (positive feedback)             |

### Implementation Timeline

**Phase 1 MVP:**

- Broadcasts table + broadcast_reads table
- POST /api/admin/broadcasts (create)
- GET /api/broadcasts/active (fetch sticky)
- Sticky banner component
- Basic template types (approval, veto, announcement)

**Phase 2:**

- Broadcast history page + search
- Advanced targeting (circles, roles)
- Email notification option
- Slack integration (post broadcasts to #announcements)

---

## 📊 Complete Enhancement Priority Matrix

| Feature                                   | Verdict | Phase | Effort | Value     | Dependency      |
| ----------------------------------------- | ------- | ----- | ------ | --------- | --------------- |
| **Broadcast Announcements** (Herald) ⭐   | YES     | 1     | LOW    | CRITICAL  | None            |
| **What-If Variance Analysis** (Oracle) ⭐ | YES     | 1     | MEDIUM | VERY HIGH | None            |
| **Config Layering** ⭐                    | YES     | 1     | MEDIUM | CRITICAL  | None            |
| **Simple Budget Check**                   | YES     | 1     | LOW    | HIGH      | Config Layering |
| **Delegated Draft To-Dos**                | YES     | 2     | LOW    | HIGH      | Phase 1         |
| **Advanced What-If Scenarios**            | HYBRID  | 2     | MEDIUM | HIGH      | Oracle Phase 1  |
| **Simple To-Do Gating**                   | HYBRID  | 2     | MEDIUM | MEDIUM    | Phase 1         |
| **Guardian Verification**                 | HYBRID  | 3     | MEDIUM | MEDIUM    | Phase 2         |

---

## 🎯 Recommended v3.1 Scope (Phase 1 Expansion — UPDATED)

Based on your strategic insight about variance tracking transforming decision-making culture:

### CRITICAL FOR MVP (Week 1-3)

- ☑️ **What-If Variance Analysis** (Oracle) — Case templates + Budgeted/Planned/Actual tracking +
  Tri-Vector dashboard
- ☑️ **Broadcast Announcements** (Herald) — Sticky banner + templates + read tracking
- ☑️ **Config Layering** — 3-tier inheritance (Global Law → Circle Rules → User Prefs)
- ☑️ **Simple Budget Check** — Remaining budget warning per proposal

### SHOULD HAVE (Week 3-4)

- ☑️ **Delegated Draft To-Dos** — Managers pre-draft suggested tasks for CEO approval
- ☑️ **Broadcast History Page** — Audit trail + compliance + search

### NICE TO HAVE (Phase 2)

- ☐ **Advanced What-If Scenarios** — Multi-case pooling (50+ proposals → 3-4 scenarios)
- ☐ **To-Do Gating** — Linear dependencies + Guardian verification
- ☐ **Email/Slack Integration** — Notification channels
- ☐ **Predictive Variance Modeling** — ML learning from past variances

---

## 🏁 Final Summary — Strategic Enhancement Overview

**Your Strategic Shift:** Transform What-If from "approval gating" → "decisiveness enablement"

**Key Insight Validated:**

> "Everything should be planned. Budgeted vs Planned vs Actual. Draw important analysis figures at
> dashboard. Give managers Know-How (what happened) and Know-Why (why it happened), not simply ask
> for approval."

**My Recommendations (UPDATED):**

1. **What-If Variance Analysis (Oracle)** — **YES, Phase 1** (STRATEGIC UPGRADE)
2. **Delegated Draft** — **YES, Phase 2** (Reduces CEO cognitive load)
3. **What-If Scenarios** — **HYBRID, Phase 2** (Simple version now, complex later)
4. **To-Do Gating** — **HYBRID, Phase 2-3** (Safety feature for high-value tasks)
5. **Config Layering** — **YES, Phase 1** (Essential architecture)

**Updated Timeline:**

- **Phase 1 MVP (v3.0):** Pool Table + Configs + To-Dos + **Broadcasts** + Budget Check
- **Phase 2 (v3.1):** Delegated Drafts + What-If + Gating + Broadcast History
- **Phase 3 (v3.2):** Guardian Verification + Advanced Automation

---

_Recommendations prepared: January 8, 2026_\
_Status: Ready for engineering team review_
