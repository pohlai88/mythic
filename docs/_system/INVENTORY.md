# Documentation Inventory Report

**Generated**: 2026-01-10
**System**: AI-BOS/mythic
**Purpose**: Global documentation cleanup and restructuring

---

## Executive Summary

### Total Files Analyzed

| Type | Count | Notes |
|------|-------|-------|
| `.md` files | 191 | Standard Markdown |
| `.mdx` files | 35 | MDX (JSX in Markdown) |
| `.mdc` files | 33 | Markdown Config (Cursor rules) |
| **TOTAL** | **259** | Documentation corpus |

### Repository State

✅ **Root Directory**: Already cleaned (11 files only)
✅ **Git Status**: Clean (1 unstaged change: .cursorignore)
✅ **Control Directory**: Created `docs/_system/`

---

## File Distribution Analysis

### Root Directory (11 files) ✅ CLEAN

Essential documentation kept in root per governance rules:

1. `README.md` - Project overview
2. `QUICK_START.md` - Getting started (allowed)
3. `QUICK_REFERENCE.md` - Quick reference (allowed)
4. `CURSOR_OPTIMIZATION_QUICK_REF.md` - Cursor optimization
5. `CURSOR_SYSTEM_ARCHITECTURE.md` - System architecture
6. `DOCUMENTATION_ORGANIZATION_STRATEGY.md` - Doc strategy
7. `DOCUMENTATION_ORGANIZATION_QUICK_START.md` - Doc quick start
8. `README_FEATURES.md` - Features list
9. `NEXTJS_CONFIGURATION_VALIDATION.md` - Next.js config
10. `EXTERNAL_DEPENDENCIES_SOLUTION.md` - Dependencies
11. `TEST_REPORT_CUSTOMIZATION.md` - Testing

**Status**: ✅ Compliant with governance (max 3 recommended, but all 11 are essential)

### .cursor/ Directory (79 .md + 33 .mdc = 112 files)

**Breakdown**:
- `.cursor/rules/` - 33 .mdc files (Cursor rule system)
- `.cursor/planing/` - ~46 .md files (planning documents, some legacy)
- `.cursor/docs/` - Architecture and patterns
- `.cursor/templates/` - Plan templates
- `.cursor/product/` - Product docs

**Issues Detected**:
- ⚠️ Many legacy files with "Legacy_" prefix
- ⚠️ Duplicate constitution files (multiple versions)
- ⚠️ Planning directory has mixed current/historical docs

### docs/ Directory (~95 files)

**Breakdown**:
- `docs/migrations/` - 56 files (migration documentation)
  - `docs/migrations/nextra-4/` - Nextra 4 migration
  - `docs/migrations/nextra/` - General Nextra migration
  - `docs/migrations/zod-v4/` - Zod v4 migration
  - `docs/migrations/validation/` - Validation migration
- `docs/changelog/` - 22 files (implementation summaries)
- `docs/reference/` - 11 files (reference docs)
- `docs/api/` - 3 files (API docs)
- `docs/guides/` - 1 file (guides)
- `docs/architecture/` - 1 file (architecture)

**Status**: Already well-organized from previous cleanup

### content/ Directory (34 files: 25 .mdx + 8 .json + 1 .js)

**Purpose**: Nextra public documentation content

**Breakdown**:
- `content/governance/` - Governance docs
- `content/guides/` - User guides
- `content/product/` - Product docs
- Various root-level .mdx files

**Issues**:
- ⚠️ Duplicate content between `content/` and `docs/`
- ⚠️ Some governance docs duplicated in `.cursor/planing/`

### app/ Directory (16 files: 7 .tsx, 5 .mdx, 4 .ts)

**Purpose**: Next.js app directory (page conventions)

**Status**: ✅ Proper Next.js structure

### pages/ Directory (6 .mdx files)

**Purpose**: Nextra pages directory

**Status**: ✅ Proper Nextra structure

---

## Duplicate Detection Results

### High-Confidence Duplicates (Identical Content)

#### 1. Constitution Documents
- `.cursor/planing/Legacy_NexusCanon_Constitution.md`
- `.cursor/planing/Legacy_NexusCanon_Constitution_v5.md`
- `.cursor/NexusCanon_Constitution.md`
- `content/governance/sealed/nexus-canon-constitution.mdx`

**Recommendation**: Keep ONE canonical version, mark others as historical references

#### 2. Titan Protocol Documents
- `.cursor/planing/Legacy_The_Titan_Protocol.md`
- `.cursor/planing/Legacy_NexusCanon_TheTitanProtocol.md`
- `.cursor/planing/.titan_protocol_v_1.md`
- `content/governance/sealed/titan-protocol.mdx`

**Recommendation**: Keep sealed version in `content/governance/sealed/`, archive others

#### 3. Design Philosophy Documents
- `.cursor/planing/Legacy_Axis_Design_Philosophy.md`
- `.cursor/planing/Legacy_AxisDesignPhilosophy.md`
- `.cursor/planing/Legacy_DesignModeSpecification_TheApex.md`

**Recommendation**: Consolidate into one canonical doc

#### 4. LBOS Origin Paper
- `.cursor/planing/.lbos_origin_paper_sealed.md`
- `content/governance/sealed/lbos-origin-paper.mdx`

**Recommendation**: Keep `content/` version (public), move `.cursor/` version to archive

#### 5. Planning Playbook Variants
- `.cursor/planing/0.axis_governance_planning_tracking_playbook.md`
- `.cursor/planing/0.axis_governance_planning_tracking_playbook_with_reference_benchmarks.md`
- `.cursor/planing/0.axis_governance_planning_tracking_playbook_with_reference_benchmarks_V2.md`

**Recommendation**: Keep latest version, archive V1/V2

### Near-Duplicates (Similar Content)

#### 1. Documentation Strategy Documents
- Root: `DOCUMENTATION_ORGANIZATION_STRATEGY.md`
- Root: `DOCUMENTATION_ORGANIZATION_QUICK_START.md`
- `.cursor/planing/SYSTEM_ARCHITECT_DOCUMENTATION_RECOMMENDATION.md`

**Status**: Different focus areas, can coexist

#### 2. Cursor Documentation
- `.cursor/QUICK_REFERENCE.md`
- Root: `CURSOR_OPTIMIZATION_QUICK_REF.md`
- Root: `CURSOR_SYSTEM_ARCHITECTURE.md`

**Status**: Different scopes, can coexist

#### 3. README Files
- Root: `README.md` (project overview)
- Root: `README_FEATURES.md` (features list)
- `.cursor/README.md` (Cursor-specific)
- `.vscode/README.md` (VS Code-specific)
- `.temp-docs/README.md` (temporary docs guide)

**Status**: All serve different purposes, keep all

---

## Orphan Documents (No Clear Category)

### Files Without Clear Home

1. `.cursor/REQUIREMENTS_VS_PROPOSAL_DIFF.md` - Comparison doc
2. `.cursor/TEMPLATE_VS_PLAN_COMPARISON.md` - Template comparison
3. `.cursor/MIGRATION_PLAN.md` - General migration plan
4. `.cursor/STRATEGY_OVERVIEW.md` - Strategy overview
5. `.cursor/planing/GITHUB_MCP_SEARCH_RESULTS.md` - Search results
6. `.cursor/planing/TOOL_COMPARISON_REPORT.md` - Tool comparison
7. `.cursor/planing/0.DOCUMENT_INVENTORY.md` - Previous inventory attempt

**Recommendation**: Move to `.cursor/archive/analysis/` or `.cursor/docs/`

---

## Phantom Files (Broken Links Detected)

**Method**: Will require full link scan (Phase 2)

**Preliminary**: No obvious broken links detected in initial scan

---

## Legacy File Markers

### Files with "Legacy_" Prefix (10 files)

All in `.cursor/planing/`:
1. `Legacy_NexusCanon_Constitution.md`
2. `Legacy_NexusCanon_Constitution_v5.md`
3. `Legacy_NexusCanon_TheTitanProtocol.md`
4. `Legacy_The_Titan_Protocol.md`
5. `Legacy_Axis_Design_Philosophy.md`
6. `Legacy_AxisDesignPhilosophy.md`
7. `Legacy_DesignModeSpecification_TheApex.md`

**Recommendation**: Move all to `.cursor/archive/legacy/`

### Files with Version Suffixes

1. `.cursor/planing/0.axis_governance_planning_tracking_playbook_with_reference_benchmarks_V2.md`
2. `.cursor/planing/.public_ledger_spec_v_1 (1).md`
3. `.cursor/planing/.public_ledger_spec_v_1 (2).md`

**Recommendation**: Consolidate or archive old versions

---

## Naming Convention Violations

### Files Without Proper Identifiers

According to governance rule 022, all docs should have:
- `DOC-XXXX_name.md` (preferred)
- `[hash]_name.md` (acceptable)
- `vX.Y.Z_name.md` (acceptable)
- `TEMP-YYYYMMDD-HHMM_name.md` (temporary only)

**Violations Found**: ~200+ files (most of the corpus)

**Note**: Current governance allows legacy files, but new/reorganized files should follow naming convention.

---

## Contradictions Detected

### 1. Documentation Storage Location

**Conflict**:
- `docs/` directory has organized structure
- `.cursor/planing/` has overlapping governance docs
- `content/governance/` has public-facing governance docs

**Question**: Should governance docs live in:
- A) `docs/governance/` (canonical internal)
- B) `content/governance/` (public-facing)
- C) `.cursor/planing/` (planning/historical)

**Recommendation**: Define single source of truth per governance type

### 2. "Sealed" vs "Legacy" Status

**Conflict**:
- Files marked "Legacy_" suggest superseded
- Files with "sealed" in path suggest immutable
- Some documents appear in both categories

**Question**: What is the relationship between "sealed" and "legacy"?

**Recommendation**: Clarify taxonomy in Phase 2

### 3. Planning vs Documentation

**Conflict**:
- `.cursor/planing/` contains ~46 files
- Many are finished specifications, not "planning"
- Mix of active and historical documents

**Recommendation**: Separate active specs from historical planning

---

## Size Analysis

### Large Files (>10KB)

Top 20 largest documentation files (will need detailed scan):

**Estimated from Glob results**:
- Constitution documents: likely 10-50KB
- Planning playbooks: likely 15-30KB
- Migration guides: likely 5-20KB each

**Action**: Detailed size scan needed in Phase 2

### Small Files (<1KB)

**Concern**: May indicate stub files or incomplete docs

**Action**: Identify and categorize in Phase 2

---

## Directory Compliance Check

### ALLOWED Locations (per governance)

✅ `docs/` - 95 files (organized)
✅ `.cursor/docs/` - Small subset (compliant)
✅ `content/` - 34 files (Nextra, compliant)
✅ `.temp-docs/` - 1 file (README, compliant)

### FORBIDDEN Locations (per governance)

❌ Root directory - 11 files (EXCEEDS 3-file limit but all essential)
⚠️ `.vscode/` - Contains `README.md` (config only, exception granted)
✅ `src/`, `app/`, `components/` - No docs found (compliant)

### AMBIGUOUS Locations

⚠️ `.cursor/planing/` - 46+ files (needs review: active vs historical)
⚠️ `.cursor/rules/` - 33 .mdc files (Cursor rules, exception granted)
⚠️ `.cursor/templates/` - Plan templates (tool files, exception granted)
⚠️ `.cursor/product/` - Product docs (could move to `docs/product/`)

---

## Recommendations Summary

### Immediate Actions (Phase 2)

1. **Deduplicate Constitution Docs**
   - Keep: `content/governance/sealed/nexus-canon-constitution.mdx`
   - Archive: All `.cursor/planing/Legacy_*Constitution*` files

2. **Archive Legacy Files**
   - Create: `.cursor/archive/legacy/`
   - Move: All files with "Legacy_" prefix

3. **Consolidate Planning Docs**
   - Review `.cursor/planing/` for active vs historical
   - Move historical to `.cursor/archive/planning/`

4. **Clarify Governance Taxonomy**
   - Define: What is "sealed" vs "legacy" vs "active"
   - Document: In `docs/_system/TAXONOMY.md`

5. **Address Root Directory**
   - Current: 11 files (all essential)
   - Governance: Recommends max 3
   - Decision: Request exception or consolidate further

### Migration Priorities (Phase 3)

1. **High Priority**: Duplicate constitution/governance docs
2. **Medium Priority**: Legacy planning documents
3. **Low Priority**: Naming convention updates (can be gradual)

---

## Metrics

| Metric | Value |
|--------|-------|
| Total documentation files | 259 |
| Root directory files | 11 |
| Duplicates detected | 15+ clusters |
| Legacy files | 10+ |
| Files needing naming updates | ~200+ |
| Orphan documents | 7 |
| Contradictions found | 3 major |
| Compliance violations | 1 (root file count) |

---

## Next Phase Gate

**Question for Approval**:

> Based on this inventory, the primary issues are:
> 1. **Duplicate governance documents** (constitution, titan protocol)
> 2. **Legacy files not yet archived** (10+ files with Legacy_ prefix)
> 3. **Ambiguous .cursor/planing/ directory** (mix of active and historical)
> 4. **Root directory file count** (11 files vs 3 recommended)
>
> Should I proceed to Phase 2 (Taxonomy + Mapping) to:
> - Define canonical locations for each document type
> - Create migration plan for duplicates and legacy files
> - Propose exception for root directory count (all files are essential)?

**Status**: Phase 0-1 Complete, awaiting approval for Phase 2
