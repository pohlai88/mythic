# UX Ratification Process

**Purpose**: Formal gate for any UX change to frozen zones or new feature
proposals. **Authority**: All UX changes must pass through this process or be
rejected. **Version**: 1.0.0 **Status**: RATIFIED

---

## Overview

This process ensures that UX changes are:

- **Intentional** — Not accidental or convenient
- **Justified** — Earn their existence
- **Reversible** — Can be removed cleanly
- **Compliant** — Respect all governance rules

---

## Phase 0: Intake (MANDATORY)

**Before ratification begins, all requests must pass Intake.**

See: [`INTAKE_CHECKLIST.md`](INTAKE_CHECKLIST.md)

Intake validates:

- The 3 classification questions are answered
- Single-sentence intent test passes
- Shell is locked
- Diataxis mode is assigned
- Intent is singular (not mixed)

**If intake fails, ratification does not begin.**

```
Request → Intake Checklist → Pass? → Ratification
                              │
                              └─ Fail → Reject/Rewrite
```

---

## When is Ratification Required?

### Mandatory (Requires Full ADR)

| Change Type                     | Example                                |
| ------------------------------- | -------------------------------------- |
| Modify frozen file              | `axis-base.css`, `use-reader-prefs.ts` |
| Add new Silent Killer           | New typography utility                 |
| Change spacing semantics        | Modify `pause-authority` values        |
| Add new Shell or Block          | `NewShell.tsx`                         |
| Modify reader preference schema | Add new preference option              |

### Required (Lightweight Proposal)

| Change Type                         | Example                  |
| ----------------------------------- | ------------------------ |
| Add new component to existing Block | New variant for AxisCard |
| Modify non-frozen CSS               | App-specific styles      |
| Add utility function                | New hook in `hooks/`     |

### Not Required

| Change Type                 | Example                   |
| --------------------------- | ------------------------- |
| Bug fixes                   | Fix typo in documentation |
| Content updates             | Edit MDX content          |
| Dependency updates          | Security patches          |
| Refactoring (same behavior) | Extract function          |

---

## The Ratification Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    UX RATIFICATION FLOW                      │
└─────────────────────────────────────────────────────────────┘

Step 1: PROPOSAL
┌──────────────┐
│   Author     │  Fill out UX_PROPOSAL_TEMPLATE.md
│   submits    │  → docs/governance/decisions/ADR-XXX-title.md
└──────┬───────┘
       │
       ▼
Step 2: REFUSE LIST CHECK
┌──────────────┐
│   Check if   │  Is this feature on the Refuse List?
│   refused    │  ├─ Yes → REJECTED (no appeal)
└──────┬───────┘  └─ No → Continue
       │
       ▼
Step 3: NEGATIVE CAPABILITY TEST
┌──────────────┐
│   Justify    │  "Why would this be missed if never built?"
│   absence    │  ├─ Weak answer → REJECTED
└──────┬───────┘  └─ Strong answer → Continue
       │
       ▼
Step 4: SILENCE BUDGET CHECK
┌──────────────┐
│   Calculate  │  What is the silence cost?
│   cost       │  ├─ Budget negative → REJECTED (pay debt first)
└──────┬───────┘  └─ Budget positive → Continue
       │
       ▼
Step 5: DEGRADATION REVIEW
┌──────────────┐
│   Verify     │  Does it degrade gracefully?
│   fallbacks  │  ├─ No → REJECTED
└──────┬───────┘  └─ Yes → Continue
       │
       ▼
Step 6: STAKEHOLDER APPROVAL
┌──────────────┐
│   Review     │  Governance stakeholder reviews
│   & approve  │  ├─ Concerns → Revise proposal
└──────┬───────┘  └─ Approved → Continue
       │
       ▼
Step 7: IMPLEMENTATION
┌──────────────┐
│   Implement  │  Author implements with ADR reference
│   with ADR   │  PR links to approved ADR
└──────┬───────┘
       │
       ▼
Step 8: REGRESSION CHECK
┌──────────────┐
│   Verify     │  Run UX regression checklist
│   no decay   │  ├─ Fails → Fix before merge
└──────────────┘  └─ Passes → MERGED
```

---

## Proposal Requirements

Every proposal must include (see `templates/UX_PROPOSAL_TEMPLATE.md`):

### Mandatory Fields

| Field                      | Description                                 |
| -------------------------- | ------------------------------------------- |
| **Owner**                  | Which Shell or Block owns this?             |
| **Affects Reading Rhythm** | Does it interrupt or alter reading flow?    |
| **Adds Cognitive Load**    | Does it require user decision-making?       |
| **Reversible**             | Can it be removed without breaking content? |
| **Silence Cost**           | Net change to silence budget                |

### Mandatory Sections

1. **Justification of Absence**
   - Why would readers miss this if it never existed?
   - What problem does it solve that cannot be solved otherwise?

2. **Degradation Path**
   - How does this behave without JavaScript?
   - How does this behave with reduced motion preference?
   - How does this behave in unsupported browsers?

3. **Exit Strategy**
   - How do we remove this if it fails?
   - What dependencies would need cleanup?
   - Is there a sunset date for evaluation?

---

## Decision Outcomes

### APPROVED

- ADR is moved to `docs/governance/decisions/`
- Silence budget is updated
- Implementation can proceed
- PR must reference ADR

### REJECTED

- ADR is archived with rejection reason
- Author may revise and resubmit (once)
- Repeated rejections suggest feature doesn't belong

### DEFERRED

- Feature is valid but timing is wrong
- Revisit date is set
- No implementation until revisit

---

## ADR Numbering

Format: `ADR-XXX-short-title.md`

```
ADR-001-scroll-memory.md
ADR-002-reader-preferences.md
ADR-003-breathing-rhythm.md
```

Numbers are sequential. Never reuse a rejected ADR number.

---

## Governance Stakeholders

| Role          | Responsibility                |
| ------------- | ----------------------------- |
| **UX Owner**  | Final approval authority      |
| **Tech Lead** | Implementation feasibility    |
| **Author**    | Proposal quality and accuracy |

Quorum: UX Owner approval is required. Tech Lead is advisory.

---

## Timeline

| Stage                | Maximum Duration     |
| -------------------- | -------------------- |
| Proposal submission  | Immediate            |
| Initial review       | 2 business days      |
| Stakeholder decision | 5 business days      |
| Revision (if needed) | 3 business days      |
| **Total maximum**    | **10 business days** |

If no decision within timeline, proposal is auto-DEFERRED for 30 days.

---

## Appeals

### Rejection Appeal

A rejected proposal may be appealed once if:

1. New evidence is presented
2. Original objection is addressed
3. Silence budget has improved

Appeal process:

1. Submit revised ADR with `APPEAL:` prefix
2. Include response to original rejection
3. Stakeholder re-reviews within 5 days

### No Appeal Available

- Features on the Refuse List
- Proposals that fail Negative Capability test
- Proposals that create new escape hatches

---

## Integration with Other Governance

### Refuse List

Before ratification, check `REFUSE_LIST.md`. If feature is listed:

- **Immediate rejection**
- No ratification process needed
- No appeal available

### Silence Budget

During ratification, calculate silence cost. If budget is negative:

- **Deferred until debt paid**
- Author may propose removals to create budget
- See `SILENCE_BUDGET.md` for cost table

### Regression Checklist

After implementation, run regression checks. If checks fail:

- **Block merge**
- Fix regression before approval
- See `UX_REGRESSION_CHECKLIST.md`

---

## Version History

| Version | Date       | Change               |
| ------- | ---------- | -------------------- |
| 1.0.0   | 2026-01-13 | Initial ratification |

---

**Status**: RATIFIED **Authority**: Invisible Governance System **Last
Updated**: 2026-01-13
