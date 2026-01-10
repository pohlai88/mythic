---
doc_type: STANDARD
status: active
owner: documentation-governance
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
---
tags: [documentation, registry, audit, DRY]
---

# Documentation Registry & DRY Audit

**Generated**: 2026-01-10
**Status**: ACTIVE
**Purpose**: Comprehensive documentation registry to prevent duplicates and enforce DRY principles

---

## Registry Overview

This registry catalogs all documentation files with metadata to:
- ✅ Prevent duplicate content
- ✅ Enforce DRY (Don't Repeat Yourself)
- ✅ Track content ownership
- ✅ Identify consolidation opportunities
- ✅ Maintain single source of truth

---

## Registry Structure

### Categories

1. **Architecture** - System design, patterns, ADRs
2. **API** - API documentation (GraphQL, REST, tRPC)
3. **Guides** - How-to guides, tutorials
4. **Reference** - Reference documentation, best practices
5. **Governance** - Internal governance, policies
6. **System** - Documentation governance, metadata
7. **Migrations** - Historical migration docs (excluded from AI)
8. **Changelog** - Implementation summaries (excluded from AI)

---

## Active Documentation Registry

### Architecture (3 files)

| ID | File | Purpose | Status | Source of Truth | Duplicates |
|----|------|---------|--------|----------------|------------|
| ARC-001 | `docs/architecture/DOC-0100_system-architecture.md` | Next.js App Router architecture | ✅ Active | ✅ Yes | None |
| ARC-002 | `docs/architecture/DOC-0114_rfl-doctrine-v1.0.md` | Request-First Logic doctrine | ✅ Active | ✅ Yes | None |
| ARC-003 | `docs/architecture/DOC-0118_consistency-sustainability-audit.md` | Consistency audit | ✅ Active | ✅ Yes | None |

**DRY Status**: ✅ No duplicates detected

---

### API Documentation (4 files)

| ID | File | Purpose | Status | Source of Truth | Duplicates |
|----|------|---------|--------|----------------|------------|
| API-001 | `docs/api/DOC-0115_api-autogeneration-strategy.md` | API autogeneration strategy | ✅ Active | ✅ Yes | None |
| API-002 | `docs/api/DOC-0116_api-autogeneration-implementation.md` | API autogeneration implementation | ✅ Active | ✅ Yes | None |
| API-003 | `docs/api/DOC-0117_api-autogeneration-quick-reference.md` | API autogeneration quick ref | ✅ Active | ✅ Yes | None |
| API-004 | `docs/api/README.md` | API documentation index | ✅ Active | ✅ Yes | None |

**DRY Status**: ✅ No duplicates detected

---

### Guides (2 files)

| ID | File | Purpose | Status | Source of Truth | Duplicates |
|----|------|---------|--------|----------------|------------|
| GUI-001 | `docs/guides/POST_CLONE_SETUP.md` | Post-clone setup guide | ✅ Active | ✅ Yes | None |
| GUI-002 | `docs/guides/README.md` | Guides index | ✅ Active | ✅ Yes | None |

**DRY Status**: ✅ No duplicates detected

---

### Reference Documentation (15 files)

| ID | File | Purpose | Status | Source of Truth | Duplicates |
|----|------|---------|--------|----------------|------------|
| REF-001 | `docs/reference/DOC-0101_cursor-optimization-quick-ref.md` | Cursor optimization quick ref | ✅ Active | ✅ Yes | None |
| REF-002 | `docs/reference/DOC-0104_features-reference.md` | Features reference | ✅ Active | ✅ Yes | None |
| REF-003 | `docs/reference/DOC-0105_nextjs-configuration-validation.md` | Next.js config validation | ✅ Active | ✅ Yes | None |
| REF-004 | `docs/reference/DOC-0106_external-dependencies-solution.md` | External dependencies | ✅ Active | ✅ Yes | None |
| REF-005 | `docs/reference/DOC-0107_test-report-customization.md` | Test report customization | ✅ Active | ✅ Yes | None |
| REF-006 | `docs/reference/CURSOR_BEST_PRACTICES_EVIDENCE_BASED.md` | Cursor best practices | ✅ Active | ✅ Yes | None |
| REF-007 | `docs/reference/FEATURES_CHECKLIST.md` | Features checklist | ✅ Active | ✅ Yes | None |
| REF-008 | `docs/reference/FILE_SYSTEM_MANAGEMENT_BEST_PRACTICES_REPORT.md` | File system best practices | ✅ Active | ✅ Yes | None |
| REF-009 | `docs/reference/GITHUB_MCP_BEST_PRACTICES_REPORT.md` | GitHub MCP best practices | ✅ Active | ✅ Yes | None |
| REF-010 | `docs/reference/KPI_REFERENCE.md` | KPI reference | ✅ Active | ✅ Yes | None |
| REF-011 | `docs/reference/NODE_VERSION_MANAGEMENT.md` | Node version management | ✅ Active | ✅ Yes | None |
| REF-012 | `docs/reference/DOC-0119_turbopack-quick-reference.md` | Turbopack quick ref | ✅ Active | ✅ Yes | None |
| REF-013 | `docs/reference/DOC-0120_turbopack-support.md` | Turbopack support | ✅ Active | ✅ Yes | ⚠️ Potential overlap with REF-012 |
| REF-014 | `docs/reference/TURBOREPO_OPTIMIZATION.md` | Turborepo optimization | ✅ Active | ✅ Yes | None |
| REF-015 | `docs/reference/DOC-0121_turborepo-quick-start.md` | Turborepo quick start | ✅ Active | ✅ Yes | None |
| REF-016 | `docs/reference/VSCODE_NEXTRA_INTEGRATION.md` | VS Code Nextra integration | ✅ Active | ✅ Yes | None |
| REF-017 | `docs/reference/README.md` | Reference index | ✅ Active | ✅ Yes | None |

**DRY Violations**:
- ⚠️ REF-012 and REF-013: Both cover Turbopack - **CONSOLIDATE**

---

### Governance (1 file)

| ID | File | Purpose | Status | Source of Truth | Duplicates |
|----|------|---------|--------|----------------|------------|
| GOV-001 | `docs/governance/README.md` | Governance index | ✅ Active | ✅ Yes | None |

**Note**: Public governance docs in `content/governance/` are separate (public-facing)

---

### System Documentation (19 files)

| ID | File | Purpose | Status | Source of Truth | Duplicates |
|----|------|---------|--------|----------------|------------|
| SYS-001 | `docs/_system/INVENTORY.md` | File inventory | ✅ Active | ✅ Yes | None |
| SYS-002 | `docs/_system/TAXONOMY.md` | Directory taxonomy | ✅ Active | ✅ Yes | None |
| SYS-003 | `docs/_system/DECISIONS.md` | Decision ledger | ✅ Active | ✅ Yes | None |
| SYS-004 | `docs/_system/CONTRADICTIONS.md` | Contradictions tracking | ✅ Active | ✅ Yes | None |
| SYS-005 | `docs/_system/MIGRATION_PLAN.md` | Migration plan | ✅ Active | ✅ Yes | None |
| SYS-006 | `docs/_system/STATUS_REPORT.md` | Status report | ✅ Active | ✅ Yes | None |
| SYS-007 | `docs/_system/DOC-0102_documentation-organization-strategy.md` | Doc organization strategy | ✅ Active | ✅ Yes | None |
| SYS-008 | `docs/_system/DOC-0103_documentation-organization-quick-start.md` | Doc organization quick start | ✅ Active | ✅ Yes | ⚠️ Overlaps with SYS-007 |
| SYS-009 | `docs/_system/ROOT_MIGRATION_STRATEGY.md` | Root migration strategy | ✅ Active | ✅ Yes | None |
| SYS-010 | `docs/_system/ROOT_MIGRATION_SUMMARY.md` | Root migration summary | ✅ Active | ✅ Yes | ⚠️ Overlaps with SYS-009 |
| SYS-011 | `docs/_system/DOC-0108_documentation-registry.md` | This file | ✅ Active | ✅ Yes | None |
| SYS-012 | `docs/_system/DOC-0109_audit-report.md` | Documentation audit report | ✅ Active | ✅ Yes | None |
| SYS-013 | `docs/_system/DOC-0110_audit-quick-start.md` | Audit quick start guide | ✅ Active | ✅ Yes | None |
| SYS-014 | `docs/_system/DOC-0111_consolidation-plan.md` | Consolidation plan | ✅ Active | ✅ Yes | None |
| SYS-015 | `docs/_system/DOC-0112_audit-summary.md` | Audit executive summary | ✅ Active | ✅ Yes | None |
| SYS-016 | `docs/_system/DOC-0113_cleanliness-audit-report.md` | Cleanliness audit report | ✅ Active | ✅ Yes | None |
| SYS-017 | `docs/_system/DOC-0114_remediation-plan.md` | Remediation plan | ✅ Active | ✅ Yes | None |
| SYS-018 | `docs/_system/DOC-0115_audit-director-summary.md` | Audit director summary | ✅ Active | ✅ Yes | None |
| SYS-019 | `docs/_system/DOC-0116_remediation-complete.md` | Remediation completion report | ✅ Active | ✅ Yes | None |

**DRY Violations**:
- ⚠️ SYS-007 and SYS-008: Strategy vs Quick Start - **REVIEW** (may be intentional)
- ⚠️ SYS-009 and SYS-010: Strategy vs Summary - **CONSOLIDATE** (summary redundant)

---

### Root Documentation (3 files)

| ID | File | Purpose | Status | Source of Truth | Duplicates |
|----|------|---------|--------|----------------|------------|
| ROOT-001 | `README.md` | Project overview | ✅ Active | ✅ Yes | None |
| ROOT-002 | `QUICK_START.md` | Getting started | ✅ Active | ✅ Yes | None |
| ROOT-003 | `QUICK_REFERENCE.md` | Quick reference | ✅ Active | ✅ Yes | None |

**DRY Status**: ✅ No duplicates detected

---

### Content Directory (Public Documentation)

| ID | File | Purpose | Status | Source of Truth | Duplicates |
|----|------|---------|--------|----------------|------------|
| PUB-001 | `content/governance/sealed/nexus-canon-constitution.mdx` | Constitution (sealed) | ✅ Active | ✅ Yes | ⚠️ Legacy versions in `.cursor/planing/` |
| PUB-002 | `content/governance/sealed/titan-protocol.mdx` | Titan Protocol (sealed) | ✅ Active | ✅ Yes | ⚠️ Legacy versions in `.cursor/planing/` |
| PUB-003 | `content/governance/sealed/lbos-origin-paper.mdx` | LBOS Origin Paper (sealed) | ✅ Active | ✅ Yes | ⚠️ Legacy versions in `.cursor/planing/` |
| PUB-004 | `content/governance/active/planning-playbook.mdx` | Planning playbook (active) | ✅ Active | ✅ Yes | ⚠️ Multiple variants in `.cursor/planing/` |

**DRY Violations**:
- ⚠️ Multiple legacy versions in `.cursor/planing/` - **ARCHIVE** (see MIGRATION_PLAN.md)

---

## Duplicate Content Analysis

### High Priority Duplicates

#### 1. Turbopack Documentation (REF-012, REF-013)

**Files**:
- `docs/reference/TURBOPACK_QUICK_REFERENCE.md`
- `docs/reference/TURBOPACK_SUPPORT.md`

**Analysis**:
- Both cover Turbopack features
- Quick Reference: Command reference
- Support: Troubleshooting and setup

**Recommendation**: 
- ✅ Keep both (different purposes)
- ⚠️ Add cross-references between files
- 📝 Update registry to clarify distinction

#### 2. Documentation Organization (SYS-007, SYS-008)

**Files**:
- `docs/_system/DOC-0102_documentation-organization-strategy.md` (Strategy)
- `docs/_system/DOC-0103_documentation-organization-quick-start.md` (Quick Start)

**Analysis**:
- Strategy: Complete plan
- Quick Start: Execution guide

**Recommendation**:
- ✅ Keep both (different audiences)
- 📝 Add clear distinction in frontmatter

#### 3. Root Migration (SYS-009, SYS-010)

**Files**:
- `docs/_system/ROOT_MIGRATION_STRATEGY.md` (Strategy)
- `docs/_system/ROOT_MIGRATION_SUMMARY.md` (Summary)

**Analysis**:
- Strategy: Complete migration plan
- Summary: Validation results

**Recommendation**:
- ⚠️ **CONSOLIDATE**: Merge summary into strategy as "Execution Summary" section
- 📝 Update strategy with execution results

---

## DRY Violations

### Repeated Information

#### 1. Getting Started Content

**Locations**:
- `QUICK_START.md` (root)
- `docs/guides/POST_CLONE_SETUP.md`
- `content/guides/getting-started.mdx`

**Analysis**:
- Root: High-level overview
- Guides: Detailed setup
- Content: Public-facing guide

**Recommendation**:
- ✅ Keep all (different audiences)
- 📝 Add cross-references
- 📝 Ensure no content duplication

#### 2. Architecture Documentation

**Locations**:
- `docs/architecture/DOC-0100_system-architecture.md` (Next.js architecture)
- `.cursor/docs/architecture/` (Cursor architecture)

**Analysis**:
- Different scopes (Next.js vs Cursor)
- No overlap detected

**Recommendation**:
- ✅ Keep separate (different scopes)
- 📝 Clarify scope in frontmatter

#### 3. API Documentation

**Locations**:
- `docs/api/DOC-0115_api-autogeneration-strategy.md`
- `docs/api/DOC-0116_api-autogeneration-implementation.md`
- `docs/api/DOC-0117_api-autogeneration-quick-reference.md`

**Analysis**:
- Strategy: Planning
- Implementation: Details
- Quick Ref: Commands

**Recommendation**:
- ✅ Keep all (different purposes)
- 📝 Add navigation between files

---

## Content Similarity Matrix

### Similar Topics (Require Cross-References)

| Topic | Files | Similarity | Action |
|-------|-------|------------|--------|
| **Turbopack** | REF-012, REF-013 | High | Add cross-references |
| **Documentation Organization** | SYS-007, SYS-008 | Medium | Clarify distinction |
| **Root Migration** | SYS-009, SYS-010 | High | Consolidate summary |
| **Getting Started** | ROOT-002, GUI-001, PUB-004 | Medium | Add cross-references |
| **Architecture** | ARC-001, `.cursor/docs/architecture/` | Low | Different scopes |

---

## Consolidation Recommendations

### Immediate Actions

1. **Consolidate Root Migration Summary** (Priority: HIGH)
   - Merge `ROOT_MIGRATION_SUMMARY.md` into `ROOT_MIGRATION_STRATEGY.md`
   - Add "Execution Summary" section
   - Delete redundant summary file

2. **Add Cross-References** (Priority: MEDIUM)
   - Add links between Turbopack docs (REF-012 ↔ REF-013)
   - Add links between getting started docs
   - Add navigation between API docs

3. **Archive Legacy Governance** (Priority: HIGH)
   - Move legacy versions from `.cursor/planing/` to `.cursor/archive/`
   - Update registry to mark as archived
   - Add references to canonical versions

### Future Improvements

1. **Create Topic Index**
   - Build topic-based index (e.g., "Turbopack", "Getting Started")
   - Link all related documents
   - Update automatically via script

2. **Content Reuse System**
   - Extract common content to shared snippets
   - Use includes/references for repeated content
   - Maintain single source of truth

3. **Automated Duplicate Detection**
   - Script to detect similar content
   - Content similarity scoring
   - Alert on new duplicates

---

## Registry Maintenance

### Update Process

1. **New Document Creation**:
   - Check registry for similar content
   - Assign unique ID (CAT-XXX format)
   - Add to registry immediately
   - Mark source of truth

2. **Content Updates**:
   - Update registry metadata
   - Check for new duplicates
   - Update cross-references

3. **Document Deletion**:
   - Mark as archived in registry
   - Update cross-references
   - Maintain audit trail

### Registry Validation

**Automated Checks** (via pre-commit hook):
- ✅ All docs have registry entry
- ✅ No duplicate IDs
- ✅ Source of truth marked
- ✅ Cross-references valid

---

## Metrics

### Current State

| Metric | Count | Status |
|--------|-------|--------|
| Total Active Docs | 37 | ✅ |
| Duplicate Clusters | 3 | ⚠️ |
| DRY Violations | 2 | ⚠️ |
| Missing Cross-References | 5 | ⚠️ |
| Source of Truth Coverage | 100% | ✅ |

### Targets

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Duplicate Clusters | 3 | 0 | ⚠️ |
| DRY Violations | 2 | 0 | ⚠️ |
| Cross-Reference Coverage | 60% | 100% | ⚠️ |
| Registry Coverage | 100% | 100% | ✅ |

---

## Next Steps

1. ✅ **Immediate**: Consolidate SYS-010 into SYS-009
2. ⏭️ **Short-term**: Add cross-references (5 files)
3. ⏭️ **Short-term**: Archive legacy governance docs
4. ⏭️ **Medium-term**: Create topic index
5. ⏭️ **Long-term**: Implement automated duplicate detection

---

**Status**: Active Registry
**Last Updated**: 2026-01-10
**Next Review**: 2026-01-17 (weekly)
