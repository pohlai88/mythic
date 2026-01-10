# v3.0.0 PRD Complete: All 9 Weapons + Strategic Enhancements

## Integration Summary & Updated Architecture

### Date: January 8, 2026

---

## Updated Weapons Architecture (9 Domains of Authority)

| # | Weapon               | Domain           | Purpose                                     | Status      |
| - | -------------------- | ---------------- | ------------------------------------------- | ----------- |
| 1 | **The Codex**        | Living Schema    | Proposal templates (stencils)               | ✅ Original |
| 2 | **The Thanos Trace** | Forensic Audit   | 6W1H immutable decision trail               | ✅ Original |
| 3 | **The BoardDialog**  | Collaboration    | Real-time comments/consensus                | ✅ Original |
| 4 | **The Hierarchy**    | Access Control   | Role-based permissions                      | ✅ Original |
| 5 | **The Vault**        | Privacy          | Client-side encryption (Eyes Only)          | ✅ Original |
| 6 | **The Vectors**      | Analytics        | Multi-dimensional metrics                   | ✅ Original |
| 7 | **The Compass**      | Execution        | Lite To-Dos integration                     | ✅ Original |
| 8 | **The Oracle** ⭐    | What-If Planning | Variance Analysis (Budgeted/Planned/Actual) | ✨ NEW      |
| 9 | **The Herald** ⭐    | Announcements    | Sticky banner + broadcast tracking          | ✨ NEW      |

---

## Strategic Enhancement: The Oracle (Weapon 8)

### What Changed from Original "What-If"

**Before:** Simple budget check ("Can we afford this?")

```
Remaining Budget: $1.5M
- This Proposal: $500k
= Remaining: $1.0M ✅
```

**After:** Full variance intelligence system

```
📋 BUDGETED (Manager's estimate)    $500k
📊 PLANNED (Forecast at approval)   $520k
🎯 ACTUAL (Reality as unfolds)      $548k
─────────────────────────────────────────
Variance: +9.6% (WARNING)
Status: Over-hired → market rates up 8%
```

### Core Integration Points

**1. Extends The Codex (Weapon 1)**

- Every proposal stencil now includes budgeted/planned sections
- Example: Hiring stencil has salary estimate + time-to-productivity + ROI forecast

**2. Data Model: case_whatif_budgets + case_whatif_milestones**

- Tracks variance over time
- Milestone reviews (30-day, Q1, annual)
- Learning loop: Why do actual costs differ from budgeted?

**3. Dashboard: Scenario Manager**

- Tri-Vector visualization (Past/Present/Future)
- Shows variance %, status, breakdown
- Milestone tracking + next review scheduling

**4. Phase 2: Multi-Case Scenarios**

- Pool 50+ pending cases into 3-4 strategic scenarios
- Automatic conflict detection: "If approve all, exceeds budget"
- AI recommendations: "Defer case X to Q2"

### Database Schema

```typescript
// Phase 1 tables
case_whatif_budgets {
  proposal_id, case_number, stencil_id,
  budgeted_total, budgeted_breakdown, budgeted_at,
  planned_total, planned_metrics, planned_at,
  actual_total, actual_breakdown, actual_metrics,
  variance_pct, variance_status, variance_reason
}

case_whatif_milestones {
  whatif_budget_id, milestone_key, milestone_label,
  scheduled_date, actual_date,
  budget_to_date, actual_to_date, variance_pct_to_date,
  notes, reviewed_by, reviewed_at
}
```

---

## Phase 1 MVP: Complete Feature Set

### Original 4 Enhancements (v3.0.0)

- ✅ **Pool Table Dashboard** (Functional, real-time, metrics)
- ✅ **Global Config** (CEO-controlled parameters, 40+)
- ✅ **User Config** (Manager preferences, 35+)
- ✅ **Lite To-Dos** (Quick creation, proposal-linked)

### New Strategic Additions (Phase 1)

- ✅ **Broadcast Announcements** (The Herald) — Sticky banner, read tracking
- ✅ **What-If Variance Analysis** (The Oracle) — Budgeted/Planned/Actual tracking
- ✅ **Config Layering** (3-tier: Global → Circle → User) — Architecture foundation
- ✅ **Simple Budget Check** — Remaining budget warning

### Nice-to-Have (Phase 1)

- ✅ **Delegated Draft To-Dos** — Managers pre-draft tasks for CEO
- ✅ **Broadcast History** — Compliance audit trail

**Total Phase 1 Scope:** 10 features, 6-8 weeks, 2 engineers + 1 product

---

## Phase 2 (v3.1): Advanced Features

- **Advanced What-If Scenarios** (Multi-case pooling, conflict detection)
- **To-Do Gating** (Linear dependencies, Guardian verification)
- **Delegated Approvals** (Managers pre-draft approvals)
- **Broadcast Integrations** (Slack, email, analytics)
- **Predictive Variance** (ML models from historical data)

---

## How Oracle Solves Your Strategic Insight

**Your Requirement:**

> "Everything shall be planned. Budgeted, Planned, Actual. Draw important analysis figures. Give
> managers Know-How and Know-Why, not just asking for approval."

**Oracle Delivers:**

```
MANAGER'S PERSPECTIVE:
─────────────────────
1. Create hiring proposal using HIRING_REQUEST stencil
2. Fill "Budgeted" section: salary $150k, benefits $45k, equipment $5k
3. Fill "Planned" section: start date, time-to-productivity, ROI months
4. CEO approves
5. 30 days later: Milestone review
   → Actual cost: $160k
   → Variance: +6.7% (reason: market rates)
6. 90 days later: Next milestone
   → Re-forecast full-year cost
   → Oracle shows trend: "On track for 8.5% overrun"

CEO'S PERSPECTIVE:
─────────────────
1. Sees 50 pending proposals as variance cards
2. Creates scenario: "Aggressive Q1 Growth" (5 hirings + 2 capex)
3. Oracle calculates:
   - Total budgeted: $2.5M
   - Total projected actual: $2.8M
   - Conflict: "Exceeds budget by $300k"
4. Oracle recommends: "Defer capex to Q2 → within budget"
5. CEO makes strategic decision with intelligence
```

---

## API Endpoints Added

### Phase 1: Oracle (What-If Variance)

```
POST   /api/cases/:id/whatif/plan
       Create budgeted/planned plan for case

GET    /api/cases/:id/whatif
       Get variance analysis for case

POST   /api/cases/:id/whatif/milestone/:id/review
       Record milestone review (actual costs/metrics)

GET    /api/user/whatif/scenarios
       Get all scenarios (dashboard data)

GET    /api/scenarios/stats
       Portfolio-level variance summary
```

### Phase 1: Herald (Broadcast Announcements)

```
POST   /api/admin/broadcasts
       Create announcement (CEO only)

GET    /api/broadcasts/active
       Get sticky announcements for user

POST   /api/broadcasts/:id/read
       Mark announcement as read

GET    /api/broadcasts/history
       Audit trail (compliance)

GET    /api/broadcasts/:id/read-stats
       Analytics (who read, when)

WS     /api/broadcasts/stream
       WebSocket real-time delivery
```

---

## Database Migrations

### Add Oracle Tables

```sql
CREATE TABLE case_whatif_budgets (...)
CREATE TABLE case_whatif_milestones (...)
```

### Add Herald Tables (Already in PRD)

```sql
CREATE TABLE broadcasts (...)
CREATE TABLE broadcast_reads (...)
```

### Extend Codex Stencils

```sql
ALTER TABLE proposal_stencils 
ADD COLUMN budgeted_fields JSONB,
ADD COLUMN planned_fields JSONB,
ADD COLUMN variance_milestones JSONB;
```

---

## Documentation Updated

| Document                             | Changes                                                                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **PRD_eBoard_v3.md**                 | Added Part III.8 (Oracle) + Part III.9 (Herald), updated Part III header to list 9 weapons                                  |
| **PRD_v3_STRATEGIC_ENHANCEMENTS.md** | Completely rewrote Section 2 (What-If) with variance tracking architecture, updated priority matrix, Phase 1 scope expanded |
| **ORACLE_WHATIF_ENHANCEMENT.md**     | NEW — Complete strategic justification + implementation roadmap for variance analysis                                       |

---

## Timeline: Path to Production

### Week 1-2: Infrastructure

- Database migration (case_whatif_* tables)
- Extend Codex Stencils with budgeted/planned sections
- API endpoints for plan creation + variance tracking

### Week 2-3: Dashboard

- Scenario Manager card component (Tri-Vector visualization)
- Milestone review scheduling UI
- Variance alert logic

### Week 3-4: Herald Integration

- Broadcast banner UI
- Read tracking
- WebSocket real-time delivery
- Sticky persistence

### Week 4-5: Testing + Polish

- Variance calculation validation
- Performance testing (50+ cases)
- UI/UX polish
- Documentation + training

### End of Week 5: Production Ready (v3.0.0)

---

## Success Criteria

✅ **Phase 1 MVP Success:**

- Managers can create budgeted/planned forecasts in <5 minutes
- Dashboard shows Tri-Vector cards with variance %, status, next milestone
- CEO can see 50+ pending proposals as variance-informed portfolio
- Milestone reviews are scheduled + completed on time
- Zero data loss in migration

✅ **Strategic Success:**

- Decisions made with "Know-Why" (variance reasoning) not just "Know-How" (what happened)
- Portfolio-level thinking (approving scenarios, not individual proposals)
- Organizational learning: "We now know hiring overruns by X%"
- Decision latency: Approval time reduced from days → hours

---

## Questions for Stakeholders

1. **Budgeted Defaults:** Should Oracle suggest budgeted values based on past similar cases?
2. **Variance Thresholds:** When do we escalate (e.g., >10% overrun)?
3. **Milestone Frequency:** Quarterly reviews? Semi-annual? Custom per stencil?
4. **Portfolio Limits:** Max cases to pool in one scenario (recommend 10-15)?
5. **Automation Level:** Should Oracle recommend scenarios automatically?

---

## Success Looks Like

**Before Oracle:**

```
CEO: "Should I approve Case 2501?"
Manager: "Yes"
CEO: "Why?"
Manager: "It's important"
CEO: *approves 5 cases, defers 45 randomly*
```

**After Oracle:**

```
CEO: Opens Pool Table Dashboard
     → 50 cases shown with variance cards
     → Creates "Conservative Q1" scenario (10 cases)
     → Oracle shows total variance: +5% (WARNING)
     → Creates "Aggressive Q1" scenario (20 cases)
     → Oracle shows total variance: +18% (OVERRUN)
     → Approves Conservative, defers Aggressive to Q2
     → Decisions made in 15 minutes with intelligence
```

---

## What's Next

1. ✅ **Strategic alignment** — This document confirms Oracle design
2. 📋 **Implementation planning** — Database schema review, API design
3. 🛠️ **Development sprint** — Week 1 infrastructure work
4. 📚 **Team training** — How to fill budgeted/planned sections
5. 🚀 **Gradual rollout** — Beta test with early users, gather feedback

Your insight about "Know-How" vs "Know-Why" is the guiding principle. Every feature in Oracle should
answer one of these:

- **Know-How:** "What happened? (Actual vs Budgeted)"
- **Know-Why:** "Why did it happen? (Variance reason)"

This transforms The Apex from a governance tool to a **decision intelligence system**.
