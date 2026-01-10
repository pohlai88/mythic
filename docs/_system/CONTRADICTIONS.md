# Contradictions Report

**Generated**: 2026-01-10
**Status**: Active Tracking
**Purpose**: Log all detected contradictions for manual resolution

---

## Summary

| ID | Severity | Status | Category |
|----|----------|--------|----------|
| C-0001 | HIGH | Open | Documentation Storage Location |
| C-0002 | MEDIUM | Open | Sealed vs Legacy Taxonomy |
| C-0003 | MEDIUM | Open | Planning vs Documentation Directory |
| C-0004 | LOW | Open | Root Directory File Count |

---

## C-0001 — Documentation Storage Location Conflict

**Severity**: HIGH
**Status**: Open
**Discovered**: 2026-01-10

### Conflict Description

Three different locations contain governance documentation:

**Location A**: `docs/` (intended for canonical internal docs)
- Currently has migrations, changelog, reference, api, guides, architecture
- Does NOT have governance subdirectory

**Location B**: `content/governance/` (public-facing Nextra content)
- Contains: `sealed/nexus-canon-constitution.mdx`
- Contains: `sealed/titan-protocol.mdx`
- Contains: `sealed/lbos-origin-paper.mdx`
- Contains: `active/planning-playbook.mdx`
- Contains: `amendments/a-001-courts-charter.mdx`

**Location C**: `.cursor/planing/` (planning/historical)
- Contains: Multiple Legacy_Constitution files
- Contains: Multiple Legacy_TitanProtocol files
- Contains: Multiple planning playbook variants
- Contains: Governance attestation docs
- Contains: Amendment documents

### The Problem

Which location is the **source of truth** for:
- Constitution documents?
- Titan Protocol?
- LBOS Origin Paper?
- Planning Playbooks?
- Amendments?

### Impacts

- Developers unsure where to look for canonical governance
- Risk of editing wrong version
- Duplicate maintenance burden
- AI context confusion (reads multiple versions)

### Options

**Option A**: `content/governance/` is canonical (public-first)
- Pro: Nextra provides versioning and public access
- Pro: Already has sealed/ and active/ taxonomy
- Con: Mixes public and internal docs

**Option B**: `docs/governance/` is canonical (internal-first)
- Pro: Separates internal from public docs
- Pro: Aligns with docs/ directory structure
- Con: Would need to create and migrate

**Option C**: Hybrid (sealed in content/, working in .cursor/)
- Pro: Clear separation of immutable vs mutable
- Pro: Uses existing structure
- Con: Two sources of truth

### Recommendation

**Do NOT auto-resolve**. This requires stakeholder decision:

1. Define: Is governance public (Nextra) or internal (docs)?
2. Define: Where do working/draft governance docs live?
3. Define: Where do sealed/ratified governance docs live?
4. Define: What happens to `.cursor/planing/` governance docs?

**Proposed Resolution** (pending approval):
- Canonical sealed docs: `content/governance/sealed/` (public, immutable)
- Active working docs: `docs/governance/active/` (internal, mutable)
- Historical/legacy: `.cursor/archive/governance/` (reference only)

---

## C-0002 — Sealed vs Legacy Taxonomy Conflict

**Severity**: MEDIUM
**Status**: Open
**Discovered**: 2026-01-10

### Conflict Description

Two different markers are used for document status:

**Marker 1**: "Legacy_" prefix in filename
- Example: `Legacy_NexusCanon_Constitution.md`
- Implies: This document is outdated/superseded
- Found in: `.cursor/planing/` directory

**Marker 2**: "sealed/" directory path
- Example: `content/governance/sealed/nexus-canon-constitution.mdx`
- Implies: This document is immutable/ratified
- Found in: `content/governance/` directory

### The Problem

Same document (Constitution) appears as both "Legacy" AND "sealed":
- Is it superseded (legacy) or immutable (sealed)?
- What's the relationship between these statuses?

### Possible Interpretations

**Interpretation A**: Legacy refers to file format/location
- "Legacy_" files are old versions in old location
- "sealed/" files are current ratified versions in new location
- They're the same content, different states

**Interpretation B**: Legacy refers to superseded content
- "Legacy_" files were ratified but later superseded
- "sealed/" files are currently active and immutable
- Different versions of same doc

**Interpretation C**: No relationship
- "Legacy_" is just a naming convention
- "sealed/" is a governance state
- Unrelated concepts

### Recommendation

**Do NOT auto-resolve**. Need clear definition:

1. Define: What does "Legacy_" prefix mean?
2. Define: What does "sealed/" directory mean?
3. Define: Can a document be both legacy and sealed?
4. Define: What's the migration path from legacy to sealed?

**Proposed Taxonomy** (pending approval):
- `sealed/` = Ratified, immutable, authoritative
- `active/` = Working, mutable, under revision
- `legacy/` = Superseded, historical, reference only
- `draft/` = Proposed, not yet ratified

---

## C-0003 — Planning vs Documentation Directory Conflict

**Severity**: MEDIUM
**Status**: Open
**Discovered**: 2026-01-10

### Conflict Description

`.cursor/planing/` directory contains ~46 files, but serves unclear purpose:

**Observation A**: Name suggests planning/temporary
- Directory: `.cursor/planing/` (note: "planing" not "planning")
- Implication: Temporary working documents

**Observation B**: Contents suggest permanent docs
- Contains: Constitution documents
- Contains: Sealed protocols
- Contains: Ratified amendments
- Contains: Governance specifications
- Implication: Permanent authoritative documents

### The Problem

Is `.cursor/planing/` for:
- **Temporary planning** (should be cleaned regularly)?
- **Permanent documentation** (should be kept)?
- **Historical archive** (superseded docs)?
- **Working drafts** (pre-ratification)?

### Files in Question

**Clearly Planning** (temporary):
1. Tool comparison reports
2. Implementation strategies
3. Search results
4. Analysis documents

**Clearly Documentation** (permanent):
1. Constitution documents
2. Sealed protocols
3. Ratified amendments
4. Core specifications

**Ambiguous** (unknown):
1. Planning playbook variants (3 versions)
2. Registry specifications
3. Ledger templates
4. Governance rollups

### Recommendation

**Do NOT auto-resolve**. Need directory purpose clarification:

1. Define: What is `.cursor/planing/` for?
2. Separate: Active planning from finished documentation
3. Move: Permanent docs to appropriate canonical location
4. Archive: Historical planning documents

**Proposed Structure** (pending approval):
```
.cursor/
├── planing/ → .cursor/work/ (active planning/analysis)
├── archive/
│   ├── planning/ (historical planning docs)
│   └── legacy/ (superseded documents)
└── docs/ (Cursor-specific technical docs)
```

---

## C-0004 — Root Directory File Count Conflict

**Severity**: LOW
**Status**: Open
**Discovered**: 2026-01-10

### Conflict Description

**Governance Rule 022** states:
> "Exception: Only 3 files allowed in root:
> - README.md (project overview)
> - QUICK_START.md (getting started)
> - QUICK_REFERENCE.md (quick reference)"

**Current Reality**: 11 files in root
1. README.md ✅ (allowed)
2. QUICK_START.md ✅ (allowed)
3. QUICK_REFERENCE.md ✅ (allowed)
4. CURSOR_OPTIMIZATION_QUICK_REF.md ⚠️ (essential but not in exception list)
5. CURSOR_SYSTEM_ARCHITECTURE.md ⚠️ (essential but not in exception list)
6. DOCUMENTATION_ORGANIZATION_STRATEGY.md ⚠️
7. DOCUMENTATION_ORGANIZATION_QUICK_START.md ⚠️
8. README_FEATURES.md ⚠️
9. NEXTJS_CONFIGURATION_VALIDATION.md ⚠️
10. EXTERNAL_DEPENDENCIES_SOLUTION.md ⚠️
11. TEST_REPORT_CUSTOMIZATION.md ⚠️

### The Problem

All 11 files serve essential purposes:
- Developer onboarding (README, QUICK_START, QUICK_REFERENCE)
- System architecture (CURSOR_SYSTEM_ARCHITECTURE)
- Optimization guides (CURSOR_OPTIMIZATION_QUICK_REF)
- Documentation strategy (DOCUMENTATION_ORGANIZATION_*)
- Configuration validation (NEXTJS_CONFIGURATION_VALIDATION)
- Features reference (README_FEATURES)
- Dependency solutions (EXTERNAL_DEPENDENCIES_SOLUTION)
- Testing customization (TEST_REPORT_CUSTOMIZATION)

But governance says max 3 files.

### Options

**Option A**: Request exception for all 11 files
- Pro: Keeps essential docs accessible
- Con: Violates governance rule

**Option B**: Consolidate into subdirectories
- Pro: Follows governance rule
- Con: Reduces discoverability of essential docs

**Option C**: Amend governance rule
- Pro: Aligns rule with reality
- Con: Requires governance process

### Recommendation

**Propose governance amendment**:

Update governance rule 022 exception to:
> "Exception: Root directory may contain:
> 1. README.md (required: project overview)
> 2. QUICK_START.md (required: getting started)
> 3. QUICK_REFERENCE.md (recommended: quick reference)
> 4. Essential system documentation (max 8 additional files):
>    - System architecture overview
>    - Optimization guides
>    - Configuration validation
>    - Critical references
>
> All other documentation MUST reside in designated directories."

**Rationale**: 11 essential files is still 89% cleaner than previous 105 files.

---

## Decision Required

**Next Steps**:

1. **C-0001**: Approve canonical governance doc locations
2. **C-0002**: Define sealed/legacy taxonomy
3. **C-0003**: Clarify .cursor/planing/ purpose
4. **C-0004**: Request governance exception or consolidate

**Blocked Actions** (pending resolution):
- Cannot migrate duplicate constitution docs (C-0001)
- Cannot archive legacy files (C-0002)
- Cannot reorganize .cursor/planing/ (C-0003)
- Cannot enforce root directory limit (C-0004)

**Status**: Phase 1 complete, Phase 2 blocked on contradiction resolution
