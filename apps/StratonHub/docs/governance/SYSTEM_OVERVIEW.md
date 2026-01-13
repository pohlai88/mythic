# Invisible Governance System Overview

**Purpose**: Complete reference for the governance system architecture and
integration. **Status**: OPERATIONAL **Version**: 1.1.0 **Last Verified**:
2026-01-13

---

## Concept Layer (Pre-Intake)

Before any Intake Checklist is allowed, the work must be scoped to an existing,
ratified Concept.

If no Concept exists, a Concept Definition MUST be created and ratified before
Intake can begin.

**Concepts define:**

- What exists in the system (semantic boundary)
- What explicitly does not exist (exclusions)
- The canonical Shell posture
- The conceptual boundary of future Intents

**Concept Registry**: [`docs/concepts/`](../concepts/)

```
CONCEPT REGISTRY (Pre-Governance)
        ↓
   INTAKE (Phase 0)
        ↓
   RATIFICATION (Phase 1)
        ↓
   IMPLEMENTATION
        ↓
   REGRESSION CHECK
```

Concepts change rarely. They are the semantic anchor for all downstream work.

---

## System Architecture

```
Request
   │
   ▼
┌─────────────────────────────────────────────────┐
│  INTAKE CHECKLIST (Phase 0)                     │
│  • 3 classification questions                   │
│  • Single-sentence intent test                  │
│  • Shell lock                                   │
│  • Mixed intent rejection                       │
└─────────────────┬───────────────────────────────┘
                  │ Pass
                  ▼
┌─────────────────────────────────────────────────┐
│  UX RATIFICATION PROCESS (Phase 1)              │
│  • Refuse List check                            │
│  • Negative Capability test                     │
│  • Silence Budget check                         │
│  • Degradation review                           │
└─────────────────┬───────────────────────────────┘
                  │ Approved
                  ▼
┌─────────────────────────────────────────────────┐
│  IMPLEMENTATION                                 │
│  • ESLint freeze zone enforcement               │
│  • Cursor AI governance rules                   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  PR SUBMISSION                                  │
│  • PR Template governance checklist             │
│  • pnpm check:governance CI validation          │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  REGRESSION CHECKLIST                           │
│  • Silent Killers integrity                     │
│  • Reader respect                               │
│  • Freeze zone compliance                       │
└─────────────────────────────────────────────────┘
```

---

## Governance Documents

| Document                                                                 | Purpose                           | Status    |
| ------------------------------------------------------------------------ | --------------------------------- | --------- |
| [`INTAKE_CHECKLIST.md`](INTAKE_CHECKLIST.md)                             | Pre-design classification gate    | IMMUTABLE |
| [`REFUSE_LIST.md`](REFUSE_LIST.md)                                       | Features never to add (60+ items) | RATIFIED  |
| [`SILENCE_BUDGET.md`](SILENCE_BUDGET.md)                                 | UI element cost tracking          | RATIFIED  |
| [`UX_RATIFICATION_PROCESS.md`](UX_RATIFICATION_PROCESS.md)               | Change approval flow              | RATIFIED  |
| [`UX_REGRESSION_CHECKLIST.md`](UX_REGRESSION_CHECKLIST.md)               | Decay detection (25+ checks)      | RATIFIED  |
| [`templates/UX_PROPOSAL_TEMPLATE.md`](templates/UX_PROPOSAL_TEMPLATE.md) | Required proposal format          | RATIFIED  |
| [`decisions/`](decisions/)                                               | Approved ADRs directory           | ACTIVE    |

---

## Enforcement Mechanisms

### ESLint Rules

**Location**: `eslint.config.mjs`

| Rule Section             | Purpose                                    |
| ------------------------ | ------------------------------------------ |
| 7.0 UX Freeze Zones      | Warn on frozen file modifications          |
| 7.1 Store Client-Only    | Block Zustand imports in Server Components |
| 7.2 Shell Escape Hatches | Block className/style props in Shells      |
| 7.3 Refuse List Patterns | Warn on Toast, scrollToTop, etc.           |

### Cursor AI Rules

**Location**: `.cursor/rules/035_invisible-governance.mdc`

| Section                 | Enforcement                       |
| ----------------------- | --------------------------------- |
| 1. UX Freeze Zones      | ADR required for frozen files     |
| 2. Refuse List          | Reject refused features           |
| 3. Silence Budget       | Calculate costs for proposals     |
| 4. Component Contracts  | Shell/Block/Store rules           |
| 5. Reader Respect       | Motion, interruption, degradation |
| 6. Negative Capability  | Challenge weak justifications     |
| 7. ADR Reference        | Require ADR for frozen zones      |
| 8. Luxury UX Principles | Align with Four Laws              |
| 9. Intake Enforcement   | 3 questions + Shell lock          |

### PR Template

**Location**: `.github/PULL_REQUEST_TEMPLATE.md`

Checklist sections:

- Intake (new pages/components)
- Freeze Zone Compliance
- Silence Budget
- Refuse List Compliance
- Regression Checks
- Reader Respect

---

## Automation Scripts

| Command                     | Script                       | Purpose                |
| --------------------------- | ---------------------------- | ---------------------- |
| `pnpm check:silence-budget` | `validate-silence-budget.ts` | Validate budget ledger |
| `pnpm check:ux-regression`  | `check-ux-regression.ts`     | Detect UX decay        |
| `pnpm check:governance`     | Both scripts                 | Full governance check  |

### Current Status

```
✅ Silence Budget: 100 units (HEALTHY)
✅ UX Regression: 6/8 passed, 0 errors, 2 warnings
```

---

## Integration Matrix

| From                 | To                   | Integration Type    |
| -------------------- | -------------------- | ------------------- |
| PR Template          | Intake Checklist     | Direct link         |
| PR Template          | Regression scripts   | Command reference   |
| Ratification Process | Intake Checklist     | Phase 0 gate        |
| Cursor Rule          | All governance docs  | Documentation table |
| ESLint               | Freeze zones         | Rule enforcement    |
| Scripts              | Silence Budget       | Ledger validation   |
| Scripts              | Regression Checklist | Automated checks    |

---

## Defense Layers

| Layer          | What It Blocks               | Document                     |
| -------------- | ---------------------------- | ---------------------------- |
| Intake         | Vague requests, mixed intent | INTAKE_CHECKLIST.md          |
| Ratification   | Weak justifications          | UX_RATIFICATION_PROCESS.md   |
| Refuse List    | Forbidden features           | REFUSE_LIST.md               |
| Silence Budget | UI bloat                     | SILENCE_BUDGET.md            |
| ESLint         | Freeze zone violations       | eslint.config.mjs            |
| Cursor Rules   | AI drift                     | 035_invisible-governance.mdc |
| PR Template    | Ungoverned PRs               | PULL_REQUEST_TEMPLATE.md     |
| Regression     | Decay                        | UX_REGRESSION_CHECKLIST.md   |

---

## Freeze Zones

### Frozen Files (ADR Required)

```
apps/StratonHub/store/use-reader-prefs.ts
apps/StratonHub/hooks/use-scroll-memory.ts
packages/TailwindCSS-V4/Design-System/src/tokens/axis-base.css
packages/TailwindCSS-V4/Design-System/src/tokens/axis-theme.css
```

### Frozen Patterns (Never Modify)

| Pattern            | Location      | Purpose             |
| ------------------ | ------------- | ------------------- |
| `prose-axis`       | globals.css   | Typography law      |
| `card-axis`        | axis-base.css | Card contract       |
| `btn-axis`         | axis-base.css | Button contract     |
| `h1-apex`          | axis-base.css | Authority hierarchy |
| `pause-authority`  | globals.css   | Spacing semantics   |
| `breathing rhythm` | globals.css   | Animation timing    |

### Immutable Documents

| Document             | Reason            |
| -------------------- | ----------------- |
| INTAKE_CHECKLIST.md  | Gate integrity    |
| LUXURY_UX_CHARTER.md | Design philosophy |

---

## Operational Cadence

### For New Pages/Components

1. Complete Intake Checklist
2. Lock Shell + Diataxis mode
3. Submit UX Proposal (if required)
4. Implement with governance compliance
5. Run `pnpm check:governance`
6. Submit PR with completed checklist

### For Existing Modifications

1. Check if file is frozen
2. If frozen, obtain ADR approval
3. Calculate Silence Budget impact
4. Verify Refuse List compliance
5. Run regression checks
6. Submit PR

### For Bug Fixes / Refactoring

1. No governance required (same behavior)
2. Run `pnpm check:governance` to verify
3. Submit PR

---

## Quick Commands

```bash
# Run all governance checks
pnpm --filter @mythic/straton-hub check:governance

# Run silence budget only
pnpm --filter @mythic/straton-hub check:silence-budget

# Run UX regression only
pnpm --filter @mythic/straton-hub check:ux-regression

# Type check
pnpm --filter @mythic/straton-hub type-check

# Lint
pnpm --filter @mythic/straton-hub lint
```

---

## System Health

### Current Metrics

| Metric              | Value     | Target |
| ------------------- | --------- | ------ |
| Silence Budget      | 100 units | > 50   |
| Regression Errors   | 0         | 0      |
| Regression Warnings | 2         | < 5    |
| Frozen Files        | 4         | —      |
| Refused Features    | 60+       | —      |
| Governance Docs     | 7         | —      |

### Known Warnings (Pre-existing)

1. **Quiet Links**: Styling not in globals.css (design decision)
2. **Animation Duration**: Some components use < 500ms (legacy)

These are informational, not blocking.

---

## Version History

| Version | Date       | Change                       |
| ------- | ---------- | ---------------------------- |
| 1.0.0   | 2026-01-13 | Initial system documentation |

---

**Status**: OPERATIONAL **Authority**: Invisible Governance System **Next
Review**: When new governance documents are added
