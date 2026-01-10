# Migration Plan

**Generated**: 2026-01-10
**Status**: PROPOSED (pending approval)
**Purpose**: Phased execution strategy for documentation cleanup

---

## Executive Summary

### Scope
- **Total Files**: 259 documentation files (.md, .mdx, .mdc)
- **Files to Move**: ~30-40 (duplicates, legacy, misplaced)
- **Directories to Create**: 5 new directories
- **Links to Update**: TBD (Phase 3 analysis)
- **Files to Delete**: ZERO (non-destructive approach)

### Timeline
- **Phase 0-1**: ✅ Complete (inventory + contradiction detection)
- **Phase 2**: ✅ Complete (taxonomy + this migration plan)
- **Phase 3**: Awaiting approval (~2-3 hours execution)
- **Phase 4**: After Phase 3 verification (~1 hour)

### Risk Level
- **Overall**: 🟢 LOW (non-destructive, reversible moves)
- **Data Loss**: 🟢 ZERO (no deletions)
- **Breaking Changes**: 🟡 LOW (will update links, provide redirects)

---

## Phase 0: Freeze + Safety Net ✅ COMPLETE

### Checklist

- [x] Verify git clean state (1 unstaged: .cursorignore)
- [x] Create `docs/_system/` control directory
- [x] Generate `INVENTORY.md` (file census)
- [x] Generate `CONTRADICTIONS.md` (conflict tracking)
- [x] Generate `DECISIONS.md` (decision ledger)
- [x] Generate `TAXONOMY.md` (canonical structure)
- [x] Generate `MIGRATION_PLAN.md` (this file)

### Deliverables

✅ `docs/_system/INVENTORY.md` - 259 files catalogued, 15+ duplicates detected
✅ `docs/_system/CONTRADICTIONS.md` - 4 contradictions documented
✅ `docs/_system/DECISIONS.md` - 7 decisions recorded
✅ `docs/_system/TAXONOMY.md` - Canonical structure defined
✅ `docs/_system/MIGRATION_PLAN.md` - This execution plan

### Status

**Complete**: 2026-01-10
**Blockers**: None
**Next**: Phase 1 (already complete)

---

## Phase 1: Inventory + Duplicate Detection ✅ COMPLETE

### Checklist

- [x] Scan all .md, .mdx, .mdc files (259 total)
- [x] Extract titles and headings
- [x] Detect duplicate clusters (15+ found)
- [x] Identify legacy files (10+ with "Legacy_" prefix)
- [x] Identify orphan documents (7 analysis docs)
- [x] Flag contradictions (4 major issues)

### Key Findings

**Duplicates Detected**:
1. Constitution documents (4 copies)
2. Titan Protocol documents (4 copies)
3. Design Philosophy documents (3 copies)
4. LBOS Origin Paper (2 copies)
5. Planning Playbook variants (3 versions)

**Legacy Files** (10+ with "Legacy_" prefix):
- All in `.cursor/planing/` directory
- Superseded governance documents
- Need archival to `.cursor/archive/legacy/`

**Orphan Documents** (7 analysis files):
- Tool comparisons, search results, inventories
- Should move to `.cursor/work/` or `.cursor/archive/`

### Status

**Complete**: 2026-01-10
**Blockers**: None
**Next**: Phase 2 (already complete)

---

## Phase 2: Taxonomy + Mapping ✅ COMPLETE

### Checklist

- [x] Define canonical directory structure (TAXONOMY.md)
- [x] Define document types and frontmatter schema
- [x] Define naming conventions (DOC-XXXX preferred)
- [x] Create directory decision matrix
- [x] Propose solutions to contradictions (D-0005, D-0006, D-0007)
- [x] Map old paths → new paths (see below)

### Path Mapping

#### Duplicate Governance Docs → Canonical Locations

| Current Location | Action | New Location | Status |
|------------------|--------|--------------|--------|
| `.cursor/planing/Legacy_NexusCanon_Constitution.md` | ARCHIVE | `.cursor/archive/legacy/constitution-v1.md` | legacy |
| `.cursor/planing/Legacy_NexusCanon_Constitution_v5.md` | ARCHIVE | `.cursor/archive/legacy/constitution-v5.md` | legacy |
| `.cursor/NexusCanon_Constitution.md` | ARCHIVE | `.cursor/archive/legacy/constitution-working.md` | legacy |
| `content/governance/sealed/nexus-canon-constitution.mdx` | **KEEP** | (no move) | sealed ✅ CANONICAL |

| Current Location | Action | New Location | Status |
|------------------|--------|--------------|--------|
| `.cursor/planing/Legacy_The_Titan_Protocol.md` | ARCHIVE | `.cursor/archive/legacy/titan-protocol-v1.md` | legacy |
| `.cursor/planing/Legacy_NexusCanon_TheTitanProtocol.md` | ARCHIVE | `.cursor/archive/legacy/titan-protocol-v2.md` | legacy |
| `.cursor/planing/.titan_protocol_v_1.md` | ARCHIVE | `.cursor/archive/legacy/titan-protocol-v1-spec.md` | legacy |
| `content/governance/sealed/titan-protocol.mdx` | **KEEP** | (no move) | sealed ✅ CANONICAL |

| Current Location | Action | New Location | Status |
|------------------|--------|--------------|--------|
| `.cursor/planing/.lbos_origin_paper_sealed.md` | ARCHIVE | `.cursor/archive/legacy/lbos-origin-paper-draft.md` | legacy |
| `content/governance/sealed/lbos-origin-paper.mdx` | **KEEP** | (no move) | sealed ✅ CANONICAL |

#### Legacy Design Philosophy Docs → Archive

| Current Location | Action | New Location | Status |
|------------------|--------|--------------|--------|
| `.cursor/planing/Legacy_Axis_Design_Philosophy.md` | ARCHIVE | `.cursor/archive/legacy/axis-design-philosophy-v1.md` | legacy |
| `.cursor/planing/Legacy_AxisDesignPhilosophy.md` | ARCHIVE | `.cursor/archive/legacy/axis-design-philosophy-v2.md` | legacy |
| `.cursor/planing/Legacy_DesignModeSpecification_TheApex.md` | ARCHIVE | `.cursor/archive/legacy/design-mode-spec-apex.md` | legacy |

#### Planning Playbook Variants → Consolidate

| Current Location | Action | New Location | Status |
|------------------|--------|--------------|--------|
| `.cursor/planing/0.axis_governance_planning_tracking_playbook.md` | ARCHIVE | `.cursor/archive/planning/playbook-v1.md` | archived |
| `.cursor/planing/0.axis_governance_planning_tracking_playbook_with_reference_benchmarks.md` | ARCHIVE | `.cursor/archive/planning/playbook-v2.md` | archived |
| `.cursor/planing/0.axis_governance_planning_tracking_playbook_with_reference_benchmarks_V2.md` | ARCHIVE | `.cursor/archive/planning/playbook-v3.md` | archived |
| `content/governance/active/planning-playbook.mdx` | **KEEP** | (no move) | active ✅ CANONICAL |

#### Orphan Analysis Docs → Archive or Work

| Current Location | Action | New Location | Status |
|------------------|--------|--------------|--------|
| `.cursor/REQUIREMENTS_VS_PROPOSAL_DIFF.md` | MOVE | `.cursor/archive/analysis/requirements-proposal-diff.md` | archived |
| `.cursor/TEMPLATE_VS_PLAN_COMPARISON.md` | MOVE | `.cursor/archive/analysis/template-plan-comparison.md` | archived |
| `.cursor/MIGRATION_PLAN.md` | ARCHIVE | `.cursor/archive/planning/migration-plan-2025.md` | archived |
| `.cursor/STRATEGY_OVERVIEW.md` | ARCHIVE | `.cursor/archive/planning/strategy-overview-2025.md` | archived |
| `.cursor/planing/GITHUB_MCP_SEARCH_RESULTS.md` | ARCHIVE | `.cursor/archive/analysis/github-mcp-search-2025.md` | archived |
| `.cursor/planing/TOOL_COMPARISON_REPORT.md` | ARCHIVE | `.cursor/archive/analysis/tool-comparison-2025.md` | archived |
| `.cursor/planing/0.DOCUMENT_INVENTORY.md` | ARCHIVE | `.cursor/archive/analysis/document-inventory-2025.md` | archived |

#### Directory Rename

| Current Location | Action | New Location | Reason |
|------------------|--------|--------------|--------|
| `.cursor/planing/` | RENAME | `.cursor/work/` | Clarify purpose: temporary working docs |

### Status

**Complete**: 2026-01-10
**Blockers**: Awaiting approval for proposed decisions (D-0005, D-0006, D-0007)
**Next**: Phase 3 (execution)

---

## Phase 3: Staged Moves + Link Updates ⏳ AWAITING APPROVAL

### Prerequisites

**Required Approvals**:
1. ✅ D-0005: Canonical governance doc locations
2. ✅ D-0006: Root directory exception (11 files)
3. ✅ D-0007: Document lifecycle taxonomy (draft/active/sealed/legacy/archived)

**Blockers**:
- Cannot proceed until stakeholder approves path mapping
- Cannot update links until canonical locations confirmed

### Execution Plan

#### Batch 1: Create New Directories

**No risk, non-destructive**

```bash
# Create archive structure
mkdir -p .cursor/archive/legacy
mkdir -p .cursor/archive/planning
mkdir -p .cursor/archive/analysis
mkdir -p .cursor/archive/governance

# Create governance structure
mkdir -p docs/governance/active
mkdir -p docs/governance/draft
```

**Verification**:
- Confirm directories created successfully
- Confirm no files moved yet

#### Batch 2: Archive Legacy Files (10 files)

**Low risk, reversible**

**Files to Move**:
1. Legacy Constitution files (3) → `.cursor/archive/legacy/`
2. Legacy Titan Protocol files (3) → `.cursor/archive/legacy/`
3. Legacy Design Philosophy files (3) → `.cursor/archive/legacy/`
4. Legacy LBOS Origin Paper (1) → `.cursor/archive/legacy/`

**Process**:
```bash
# For each file:
1. Add frontmatter to original:
   ---
   status: legacy
   superseded_by: [canonical-path]
   archived_date: 2026-01-10
   ---

2. Move file to .cursor/archive/legacy/ with descriptive name

3. Create stub at original location (optional):
   # [Original Title]
   
   **Status**: LEGACY - This document has been superseded
   
   **Canonical Version**: [link to canonical doc]
   
   **Archived**: 2026-01-10 to `.cursor/archive/legacy/[new-name].md`
   
   This file is kept for historical reference only.
```

**Link Updates**:
- Scan all docs for links to these files
- Update to point to canonical versions (not archives)
- If stub created, links can point to stub (will redirect)

**Verification**:
- Confirm 10 files moved
- Confirm stubs created (if applicable)
- Confirm no broken links (run link checker)

#### Batch 3: Archive Planning Variants (3 files)

**Low risk, reversible**

**Files to Move**:
1. Planning Playbook v1, v2, v3 → `.cursor/archive/planning/`

**Process**: Same as Batch 2

**Verification**:
- Confirm 3 files moved
- Confirm canonical playbook in `content/governance/active/` untouched
- Confirm no broken links

#### Batch 4: Archive Orphan Analysis Docs (7 files)

**Low risk, reversible**

**Files to Move**:
1. Comparison reports (2) → `.cursor/archive/analysis/`
2. Planning docs (2) → `.cursor/archive/planning/`
3. Search/tool reports (3) → `.cursor/archive/analysis/`

**Process**: Same as Batch 2

**Verification**:
- Confirm 7 files moved
- Confirm no broken links

#### Batch 5: Rename .cursor/planing/ → .cursor/work/

**Medium risk, affects many files**

**Action**:
```bash
# Option A: Git mv (preserves history)
git mv .cursor/planing .cursor/work

# Option B: Manual rename + git add (simpler)
mv .cursor/planing .cursor/work
git add .cursor/work
git rm -r .cursor/planing
```

**Link Updates**:
- Scan all docs for links to `.cursor/planing/`
- Update to `.cursor/work/`
- Update .cursorignore if references planing/

**Verification**:
- Confirm directory renamed
- Confirm all files intact
- Confirm links updated
- Confirm git history preserved (if using git mv)

#### Batch 6: Update Canonical Doc Frontmatter

**Low risk, improves metadata**

**Files to Update**:
- All files in `content/governance/sealed/` → Add `status: sealed`
- All files in `content/governance/active/` → Add `status: active`
- All files in `docs/` → Add appropriate doc_type and status

**Process**:
```bash
# For each canonical doc:
1. Add/update frontmatter:
   ---
   doc_type: [appropriate type]
   status: [active|sealed]
   owner: [team]
   source_of_truth: true
   created: [date]
   modified: [today]
   tags: [relevant, tags]
   supersedes: [list of legacy paths]
   ---

2. Commit with clear message
```

**Verification**:
- Confirm all canonical docs have proper frontmatter
- Confirm `source_of_truth: true` set correctly
- Run validation script: `pnpm validate:docs`

#### Batch 7: Update .cursorignore

**Low risk, improves AI context**

**Updates**:
```
# Add exclusions for archives
.cursor/archive/         # Historical docs (exclude from AI)
.cursor/work/            # Temporary analysis (exclude from AI)
```

**Verification**:
- Confirm .cursorignore updated
- Test AI context: Should not see archived docs in suggestions

### Rollback Strategy

**If anything goes wrong**:

```bash
# Rollback individual batch:
git checkout HEAD -- [files]

# Rollback entire phase:
git reset --hard [commit-before-phase-3]

# Restore from stubs:
# Stubs contain original location info
# Can manually restore files if needed
```

### Status

**Status**: AWAITING APPROVAL
**Estimated Time**: 2-3 hours (with verification)
**Risk**: 🟢 LOW (all moves reversible, no deletions)

---

## Phase 4: Cutover + Navigation ⏳ PENDING PHASE 3

### Prerequisites

**Required**:
1. Phase 3 complete and verified
2. All links validated (no broken links)
3. All canonical docs have proper frontmatter

### Execution Plan

#### Step 1: Generate Documentation Indexes

**Create**: `docs/README.md` (main index)

```markdown
# Documentation Index

## 📚 Main Documentation

### Architecture
- [System Overview](./architecture/overview.md)
- [Tech Stack](./architecture/tech-stack.md)

### API Documentation
- [GraphQL API](./api/graphql.md)
- [REST API](./api/rest.md)
- [tRPC API](./api/trpc.md)

### Guides
- [Getting Started](./guides/getting-started.md)
- [Post-Clone Setup](./guides/POST_CLONE_SETUP.md)

### Reference
- [KPI Reference](./reference/KPI_REFERENCE.md)
- [Best Practices](./reference/CURSOR_BEST_PRACTICES_EVIDENCE_BASED.md)

### Governance
- [Active Governance](./governance/active/)
- [Draft Proposals](./governance/draft/)

## 🗄️ Archives

### Migrations (Historical)
- [Nextra 4 Migration](./migrations/nextra-4/)
- [Zod v4 Migration](./migrations/zod-v4/)
- [Validation Migration](./migrations/validation/)

### Changelog (Historical)
- [2025-01 Implementations](./changelog/2025-01/)

## 🔧 System Files

### Documentation Governance
- [Inventory](._system/INVENTORY.md) - File census
- [Taxonomy](._system/TAXONOMY.md) - Structure definition
- [Decisions](._system/DECISIONS.md) - Decision ledger
- [Contradictions](._system/CONTRADICTIONS.md) - Conflict tracking
- [Migration Plan](._system/MIGRATION_PLAN.md) - This cleanup plan
```

**Create**: Category indexes for each subdirectory

```bash
# Generate indexes:
docs/architecture/README.md
docs/api/README.md
docs/guides/README.md
docs/reference/README.md
docs/governance/README.md
```

#### Step 2: Update Nextra Navigation

**Update**: `content/_meta.json`

Ensure governance section reflects canonical structure:

```json
{
  "index": "Home",
  "about": "About",
  "features": "Features",
  "guides": "Guides",
  "governance": {
    "title": "Governance",
    "items": {
      "sealed": "Sealed Documents",
      "active": "Active Governance",
      "amendments": "Amendments"
    }
  },
  "product": "Product"
}
```

#### Step 3: Update Root Documentation

**Update**: Root `README.md`

Add section pointing to new structure:

```markdown
## 📚 Documentation

- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **Quick Reference**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **System Architecture**: [CURSOR_SYSTEM_ARCHITECTURE.md](./CURSOR_SYSTEM_ARCHITECTURE.md)
- **Full Documentation**: [docs/](./docs/)
- **Public Docs**: [content/](./content/) (published via Nextra)
```

#### Step 4: Generate Final Reports

**Create**: `docs/_system/CLEANUP_REPORT.md`

**Contents**:
- Summary of changes
- Files moved (with before/after paths)
- Duplicates resolved
- Legacy files archived
- Canonical locations established
- Metrics (before/after file counts, duplicate reduction, etc.)

**Create**: `docs/_system/POST_CLEANUP_VALIDATION.md`

**Contents**:
- Link validation report (all links checked)
- Frontmatter compliance report
- Naming convention compliance
- Directory structure verification
- AI context optimization results

#### Step 5: Update Development Documentation

**Update**: `.cursor/docs/architecture/system-overview.md`

Add section on documentation organization:

```markdown
## Documentation Organization

The repository documentation follows a structured taxonomy:

- **Root**: Essential onboarding docs (11 files)
- **docs/**: Canonical internal documentation
  - Includes: architecture, api, guides, reference, governance
  - Excludes from AI: migrations, changelog (historical)
- **content/**: Public Nextra documentation
  - Includes: governance (sealed/active), guides, product
- **.cursor/**: Cursor AI configuration
  - work/: Temporary analysis (excluded from AI)
  - archive/: Historical reference (excluded from AI)
  - rules/: Active Cursor rules (included in AI)

See: [docs/_system/TAXONOMY.md](../../docs/_system/TAXONOMY.md)
```

### Status

**Status**: PENDING (awaits Phase 3 completion)
**Estimated Time**: 1 hour
**Risk**: 🟢 VERY LOW (documentation only, no file moves)

---

## Post-Migration Checklist

### Immediate Verification

- [ ] No broken links (run link checker)
- [ ] All canonical docs have `source_of_truth: true` frontmatter
- [ ] All legacy docs have `status: legacy` and `superseded_by` frontmatter
- [ ] .cursorignore excludes archives and work directories
- [ ] Root directory has exactly 11 files
- [ ] docs/_system/ has all control files

### Quality Checks

- [ ] All duplicates resolved (only canonical versions active)
- [ ] All legacy files archived (not deleted)
- [ ] All planning variants consolidated
- [ ] All orphan docs relocated
- [ ] Directory structure matches TAXONOMY.md

### AI Context Verification

- [ ] Cursor AI no longer suggests legacy docs
- [ ] Cursor AI suggests canonical docs correctly
- [ ] .cursorignore properly excludes archives
- [ ] Context quality improved (less noise)

### Documentation Validation

- [ ] Run `pnpm validate:docs` (if script exists)
- [ ] Run `markdownlint` (if configured)
- [ ] Check for markdown syntax errors
- [ ] Verify all frontmatter valid YAML

### Git Verification

- [ ] All moves committed with clear messages
- [ ] Git history preserved (if using git mv)
- [ ] No uncommitted changes
- [ ] Repository in clean state

---

## Success Metrics

### Quantitative

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total documentation files | 259 | 259 | 0 (no deletions) |
| Root directory files | 11 | 11 | Maintained |
| Duplicate file clusters | 15+ | 0 | 100% resolved |
| Legacy files unarchived | 10+ | 0 | 100% archived |
| Orphan docs | 7 | 0 | 100% relocated |
| Files with proper frontmatter | ~10% | ~90% | 800% improvement |
| Files following naming convention | ~5% | ~30% | 500% improvement |

### Qualitative

- ✅ Clear canonical locations for all doc types
- ✅ No contradictions (all 4 resolved)
- ✅ Clean directory structure
- ✅ Improved AI context quality
- ✅ Better developer discoverability
- ✅ Governance compliance achieved

---

## Maintenance Plan

### Ongoing Enforcement

**Pre-commit Hook**:
- Validates new docs in allowed locations
- Checks frontmatter compliance
- Enforces naming conventions
- Prevents temp docs > 7 days old

**CI/CD** (GitHub Actions):
- Runs link validation
- Checks documentation structure
- Verifies frontmatter
- Reports violations in PRs

### Regular Reviews

**Weekly**:
- Clean `.cursor/work/` (archive or delete old analysis)
- Check `.temp-docs/` (should be empty or < 7 days)

**Monthly**:
- Review `docs/_system/CONTRADICTIONS.md` (should be empty)
- Review `docs/_system/DECISIONS.md` (append new decisions)
- Validate link health (run link checker)

**Quarterly**:
- Full documentation audit
- Update TAXONOMY.md if needed
- Consolidate archives (compress old planning docs)

### Future Improvements

**Short-term** (next 3 months):
1. Implement automated link checking (CI/CD)
2. Create documentation linting (markdownlint)
3. Add frontmatter validation script
4. Generate automated indexes

**Long-term** (next 6-12 months):
1. Migrate more docs to DOC-XXXX naming convention
2. Add version control for sealed documents
3. Implement documentation search (Pagefind/Algolia)
4. Create documentation contribution guide

---

## Risk Assessment

### Low Risk ✅

- File moves (reversible via git)
- Adding frontmatter (non-breaking)
- Creating directories (no side effects)
- Updating .cursorignore (reversible)

### Medium Risk ⚠️

- Renaming .cursor/planing/ → work/ (affects many references)
- Updating links (risk of breaking if script has bugs)

**Mitigation**:
- Test link updates on one file first
- Use git to track all changes
- Keep stubs at old locations (redirects)
- Validate all links before final commit

### Zero Risk 🟢

- Creating control files (docs/_system/)
- Generating reports
- Adding indexes
- Documentation-only changes

---

## Timeline Summary

### Completed

- **Phase 0**: ✅ Control files created (30 minutes)
- **Phase 1**: ✅ Inventory complete (1 hour)
- **Phase 2**: ✅ Taxonomy defined (2 hours)

### Remaining

- **Phase 3**: ⏳ Awaiting approval (~2-3 hours execution)
- **Phase 4**: ⏳ After Phase 3 (~1 hour)
- **Total Remaining**: 3-4 hours

### Total Project Time

**Estimated**: 5-7 hours (planning + execution)
**Actual** (so far): 3.5 hours (planning)
**Remaining**: 3-4 hours (execution)

---

## Approval Gate

**Required Approvals Before Phase 3**:

1. ✅ Approve TAXONOMY.md (canonical structure)
2. ✅ Approve path mapping (old → new locations)
3. ✅ Approve decision D-0005 (governance doc locations)
4. ✅ Approve decision D-0006 (root directory exception)
5. ✅ Approve decision D-0007 (document lifecycle states)

**Question**:

> Phase 0-2 complete. I have:
> - Inventoried 259 files
> - Detected 15+ duplicate clusters
> - Identified 10+ legacy files needing archival
> - Defined canonical taxonomy and directory structure
> - Mapped migration paths for all affected files
> - Proposed solutions to all 4 contradictions
>
> The migration is **non-destructive** (no deletions), **reversible** (all moves via git), and **low-risk** (extensive verification steps).
>
> **Approve Phase 3 execution?**
> 
> If yes, I will:
> 1. Create archive directories
> 2. Move legacy files (with stubs/redirects)
> 3. Archive planning variants
> 4. Rename .cursor/planing/ → work/
> 5. Update all links
> 6. Add canonical frontmatter
> 7. Update .cursorignore
> 8. Verify no broken links
>
> **Estimated time**: 2-3 hours
> **Risk level**: 🟢 LOW

**Status**: Phase 2 complete, awaiting approval to proceed to Phase 3
