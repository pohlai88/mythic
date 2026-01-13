# Decisions Ledger (Append-Only)

**Purpose**: Record all architectural and organizational decisions **Format**:
Append-only (never edit/delete previous decisions) **Authority**: System
Architect + Stakeholder Approval

---

## D-0001 (2026-01-10) — Initialize Documentation Cleanup

**Decision**:

- Perform global documentation cleanup and restructuring
- Follow non-destructive approach (no deletions in Phase 1-2)
- Establish append-only decision ledger

**Rationale**:

- Repository contains 259 documentation files with duplicates and legacy content
- Root directory previously had 105 files, cleaned to 11
- Need systematic approach to further organization
- Must track decisions to prevent future entropy

**Impacts**:

- Create `docs/_system/` control directory
- Generate inventory, contradictions, and migration plan
- All future doc changes must be tracked here

**Approved by**:

- System Architect (AI Agent)
- Awaiting stakeholder approval

**Status**: PROVISIONAL (pending approval)

---

## D-0002 (2026-01-10) — Establish Control Files

**Decision**:

- Create `docs/_system/` directory for governance tracking
- Create control files:
  - `INVENTORY.md` (file census)
  - `DECISIONS.md` (this file)
  - `CONTRADICTIONS.md` (conflict tracking)
  - `MIGRATION_PLAN.md` (execution strategy)

**Rationale**:

- Need single source of truth for cleanup status
- Must track decisions to prevent regression
- Contradictions require explicit resolution (not auto-resolve)
- Migration must be planned before execution

**Impacts**:

- New directory: `docs/_system/`
- Version control tracks all decisions
- Git history becomes audit trail

**Approved by**:

- System Architect (AI Agent)

**Status**: IMPLEMENTED

---

## D-0003 (2026-01-10) — Adopt Non-Destructive Cleanup Strategy

**Decision**:

- Phase 1-2: Inventory and planning ONLY (no file moves/deletions)
- Phase 3: Staged moves with redirects/stubs (after approval)
- Phase 4: Final cutover (after verification)
- Never delete files; move to archive if superseded

**Rationale**:

- Repository has complex history and unclear canonical versions
- Risk of deleting important documents if moving too fast
- Need stakeholder input on contradictions (C-0001 through C-0004)
- Reversible moves safer than irreversible deletions

**Impacts**:

- Longer timeline (4 phases vs immediate execution)
- Lower risk (can roll back moves, cannot recover deletions)
- Requires approval gates between phases
- May create temporary `.archive/` directories

**Approved by**:

- System Architect (AI Agent)
- Follows industry best practice (measure twice, cut once)

**Status**: IMPLEMENTED

---

## D-0004 (2026-01-10) — Flag Contradictions as Blocking Issues

**Decision**:

- Identified 4 major contradictions (C-0001 through C-0004)
- Mark as BLOCKING for Phase 3 migration
- Do NOT auto-resolve; require stakeholder decision
- Document options and recommendations only

**Rationale**:

- C-0001 (doc storage location) affects where to migrate files
- C-0002 (sealed vs legacy taxonomy) affects file status interpretation
- C-0003 (planning vs documentation) affects directory purpose
- C-0004 (root file count) affects governance compliance
- Wrong assumptions could misplace canonical documents

**Impacts**:

- Phase 2 (taxonomy) can proceed with recommendations
- Phase 3 (migration) blocked until contradictions resolved
- Stakeholder input required for resolution

**Approved by**:

- System Architect (AI Agent)

**Status**: BLOCKING PHASE 3

---

## D-0005 (2026-01-10) — Recommend Governance Doc Canonical Locations

**Decision** (PROPOSED):

- Sealed governance docs: `content/governance/sealed/` (public, immutable)
- Active governance docs: `docs/governance/active/` (internal, working)
- Legacy governance docs: `.cursor/archive/governance/` (historical, reference)
- Planning docs: `.cursor/work/` (temporary analysis, cleaned regularly)

**Rationale**:

- Public governance (constitution, protocols) benefits from Nextra versioning
- Internal working docs need flexibility (docs/ directory)
- Historical docs should be archived but accessible
- Planning/analysis docs are temporary (not documentation)

**Impacts**:

- Would create `docs/governance/active/` directory
- Would rename `.cursor/planing/` to `.cursor/work/`
- Would create `.cursor/archive/governance/` and `.cursor/archive/planning/`
- Would move ~15 duplicate files to canonical locations

**Approved by**:

- PENDING STAKEHOLDER APPROVAL

**Status**: PROPOSED (resolves C-0001, C-0002, C-0003)

---

## D-0006 (2026-01-10) — Propose Governance Exception for Root Files

**Decision** (PROPOSED):

- Request amendment to governance rule 022
- Allow up to 11 essential files in root (currently compliant)
- Essential files defined as:
  - Project overview (README.md)
  - Getting started (QUICK_START.md)
  - Quick reference (QUICK_REFERENCE.md)
  - System architecture (CURSOR_SYSTEM_ARCHITECTURE.md)
  - Optimization guides (CURSOR_OPTIMIZATION_QUICK_REF.md)
  - Documentation strategy (DOCUMENTATION*ORGANIZATION*\*.md)
  - Critical config/reference (NEXTJS*\*, EXTERNAL*_, TEST\__)

**Rationale**:

- Current 11 files all serve essential onboarding/reference purposes
- Previous state was 105 files (89% reduction achieved)
- Governance rule was written assuming 3 files, but reality requires more
- Discoverability of essential docs is more important than arbitrary limit

**Impacts**:

- Would amend governance rule 022 exception clause
- Current root directory remains compliant (no moves needed)
- Future additions would require justification against "essential" criteria

**Approved by**:

- PENDING GOVERNANCE APPROVAL

**Status**: PROPOSED (resolves C-0004)

---

## D-0007 (2026-01-10) — Define Document Lifecycle States

**Decision** (PROPOSED):

- **DRAFT**: Pre-ratification, in `.cursor/work/` or `docs/*/draft/`
- **ACTIVE**: Ratified and current, in `docs/*/` or `content/*/active/`
- **SEALED**: Ratified and immutable, in `content/*/sealed/`
- **LEGACY**: Superseded but archived, in `.cursor/archive/legacy/`
- **ARCHIVED**: Historical reference, in `.cursor/archive/*/`

**Rationale**:

- Need clear taxonomy to resolve sealed vs legacy confusion (C-0002)
- Lifecycle progression: DRAFT → ACTIVE → (optional) SEALED or LEGACY
- SEALED means immutable foundation (constitution, protocols)
- LEGACY means superseded by newer version
- ARCHIVED means historical but not superseded (different purpose)

**Impacts**:

- Files with "Legacy\_" prefix would move to `.cursor/archive/legacy/`
- Files in `content/governance/sealed/` would keep SEALED status
- Active governance docs would move to `docs/governance/active/`
- Planning docs would remain in `.cursor/work/` as DRAFT

**Approved by**:

- PENDING STAKEHOLDER APPROVAL

**Status**: PROPOSED (resolves C-0002)

---

## Template for Future Decisions

```markdown
## D-XXXX (YYYY-MM-DD) — [Decision Title]

**Decision**:

- [What was decided]

**Rationale**:

- [Why this decision was made]

**Impacts**:

- [What changes as a result]

**Approved by**:

- [Who approved, when]

**Status**: [PROPOSED|APPROVED|IMPLEMENTED|DEPRECATED]
```

---

## Decision Status Summary

| ID     | Date       | Decision                 | Status      | Blocks  |
| ------ | ---------- | ------------------------ | ----------- | ------- |
| D-0001 | 2026-01-10 | Initialize cleanup       | PROVISIONAL | -       |
| D-0002 | 2026-01-10 | Create control files     | IMPLEMENTED | -       |
| D-0003 | 2026-01-10 | Non-destructive strategy | IMPLEMENTED | -       |
| D-0004 | 2026-01-10 | Flag contradictions      | BLOCKING    | Phase 3 |
| D-0005 | 2026-01-10 | Canonical doc locations  | PROPOSED    | -       |
| D-0006 | 2026-01-10 | Root files exception     | PROPOSED    | -       |
| D-0007 | 2026-01-10 | Document lifecycle       | PROPOSED    | -       |

---

## Next Decision Required

**Approval Needed**:

- D-0005: Approve canonical governance doc locations
- D-0006: Approve root directory exception
- D-0007: Approve document lifecycle taxonomy

**Blocked Until Approval**:

- Phase 3 migration (cannot proceed without canonical locations)
- Legacy file archival (cannot proceed without lifecycle taxonomy)
- Root directory enforcement (cannot proceed without exception approval)

**Status**: Awaiting stakeholder input on proposed decisions
