# UX Proposal: [Title]

**ADR Number**: ADR-XXX **Author**: [Name] **Date**: [YYYY-MM-DD] **Status**:
PROPOSED | APPROVED | REJECTED | DEFERRED

---

## Summary

[One paragraph describing what this proposal adds/changes]

---

## Governance Checklist

| Field                      | Value              |
| -------------------------- | ------------------ |
| **Owner**                  | [Shell/Block name] |
| **Affects Reading Rhythm** | Yes / No           |
| **Adds Cognitive Load**    | Yes / No           |
| **Reversible**             | Yes / No           |
| **Silence Cost**           | [+N / -N] units    |

---

## Refuse List Check

- [ ] This feature is NOT on the Refuse List
- [ ] OR: Exception criteria applies (document below)

**Exception justification** (if applicable): [Explain why this exception is
valid]

---

## Justification of Absence

> "Why would this feature be missed if never built?"

[Provide compelling evidence that readers would suffer without this feature.
Vague answers like "it would be nice" or "other sites have it" are
insufficient.]

### Problem Statement

[What specific problem does this solve?]

### Alternative Solutions Considered

| Alternative | Why Rejected |
| ----------- | ------------ |
| [Option 1]  | [Reason]     |
| [Option 2]  | [Reason]     |

### Evidence of Need

[User research, support tickets, measurable pain points]

---

## Degradation Path

### Without JavaScript

[How does this feature behave if JS is disabled?]

- [ ] Content is still accessible
- [ ] Feature degrades to static alternative
- [ ] No functionality requires JS

### With Reduced Motion

[How does this feature behave with `prefers-reduced-motion: reduce`?]

- [ ] All animations are disabled
- [ ] Alternative static presentation provided
- [ ] No motion is forced on users

### In Unsupported Browsers

[How does this feature behave in older browsers?]

- [ ] Feature is progressively enhanced
- [ ] Fallback exists for browsers without support
- [ ] Content is never blocked

---

## Exit Strategy

### Removal Plan

[How do we remove this feature if it fails or is no longer needed?]

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Dependencies

[What would need to change if this feature is removed?]

| Dependency       | Impact            |
| ---------------- | ----------------- |
| [File/Component] | [Change required] |

### Sunset Criteria

[Under what conditions should this feature be reconsidered?]

- Revisit date: [YYYY-MM-DD]
- Success metric: [Measurable outcome]
- Failure indicator: [What would signal failure]

---

## Implementation Details

### Files to Create/Modify

| File           | Change                  |
| -------------- | ----------------------- |
| [path/to/file] | [Description of change] |

### Silence Budget Impact

| Action              | Units      |
| ------------------- | ---------- |
| [New element added] | -X         |
| [Element removed]   | +X         |
| **Net Impact**      | **[+/-X]** |

### Current Silence Budget Balance

- Before: [X] units
- After: [X +/- impact] units

---

## Stakeholder Review

### UX Owner

- [ ] Approved
- [ ] Rejected (reason: \_\_\_)
- [ ] Deferred (revisit: \_\_\_)

**Comments**: [Optional feedback]

### Tech Lead (Advisory)

- [ ] Feasible as proposed
- [ ] Feasible with modifications
- [ ] Not feasible (reason: \_\_\_)

**Comments**: [Optional feedback]

---

## Decision

**Final Status**: [APPROVED / REJECTED / DEFERRED]

**Rationale**: [Brief explanation of decision]

**Conditions** (if applicable): [Any conditions on approval]

---

## Implementation Reference

Once approved, link the implementing PR here:

- PR: [#XXX](link-to-pr)
- Merged: [YYYY-MM-DD]
- Regression Check: [ ] Passed

---

## Version History

| Version | Date   | Change           |
| ------- | ------ | ---------------- |
| 1.0     | [Date] | Initial proposal |
