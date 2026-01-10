# Canonical Taxonomy + Directory Map

**Generated**: 2026-01-10
**Status**: PROPOSED (pending approval)
**Purpose**: Define authoritative documentation structure

---

## 1. Designated Directories

### 1.1 Root Directory (Essential Only)

**Location**: `/ (root)`
**Purpose**: Critical onboarding and reference documents
**Max Files**: 11 (proposed exception to governance rule 022)

**Allowed Files**:
```
1. README.md                                (REQUIRED: Project overview)
2. QUICK_START.md                           (REQUIRED: Getting started)
3. QUICK_REFERENCE.md                       (RECOMMENDED: Quick reference)

Essential System Documentation (up to 8):
4. CURSOR_SYSTEM_ARCHITECTURE.md            (System architecture)
5. CURSOR_OPTIMIZATION_QUICK_REF.md         (Optimization guide)
6. DOCUMENTATION_ORGANIZATION_STRATEGY.md   (Doc strategy)
7. DOCUMENTATION_ORGANIZATION_QUICK_START.md (Doc quick start)
8. README_FEATURES.md                       (Features reference)
9. NEXTJS_CONFIGURATION_VALIDATION.md       (Next.js config)
10. EXTERNAL_DEPENDENCIES_SOLUTION.md       (Dependencies)
11. TEST_REPORT_CUSTOMIZATION.md            (Testing)
```

**Status**: ✅ Currently compliant (11 files, all essential)

---

### 1.2 docs/ (Canonical Internal Documentation)

**Location**: `docs/`
**Purpose**: Primary documentation for internal development
**Indexing**: ✅ Included in AI context
**Public**: ❌ Internal only (not in Nextra)

**Structure**:
```
docs/
├── _system/                    # Governance tracking (NEW)
│   ├── INVENTORY.md           # File census
│   ├── DECISIONS.md           # Decision ledger
│   ├── CONTRADICTIONS.md      # Conflict tracking
│   ├── MIGRATION_PLAN.md      # This file's companion
│   └── TAXONOMY.md            # This file
│
├── architecture/               # System architecture (ACTIVE)
│   ├── overview.md            # High-level architecture
│   ├── system-design.md       # Detailed design
│   └── ...
│
├── api/                        # API documentation (ACTIVE)
│   ├── graphql.md
│   ├── rest.md
│   ├── trpc.md
│   └── autogeneration/
│
├── governance/                 # Internal governance (NEW - PROPOSED)
│   ├── active/                # Working governance docs
│   │   ├── planning-playbook.md
│   │   └── decision-process.md
│   └── draft/                 # Pre-ratification docs
│       └── proposals/
│
├── guides/                     # How-to guides (ACTIVE)
│   ├── getting-started.md
│   ├── setup.md
│   └── ...
│
├── reference/                  # Reference documentation (ACTIVE)
│   ├── kpi-reference.md
│   ├── best-practices.md
│   └── ...
│
├── migrations/                 # Historical migrations (ARCHIVED)
│   ├── nextra-4/
│   ├── nextra/
│   ├── zod-v4/
│   └── validation/
│   [Excluded from AI indexing per .cursorignore]
│
└── changelog/                  # Implementation summaries (ARCHIVED)
    └── 2025-01/
    [Excluded from AI indexing per .cursorignore]
```

---

### 1.3 content/ (Public Nextra Documentation)

**Location**: `content/`
**Purpose**: Public-facing documentation (Nextra)
**Indexing**: ✅ Included in AI context
**Public**: ✅ Published via Nextra

**Structure**:
```
content/
├── _meta.json                  # Nextra navigation
│
├── index.mdx                   # Homepage
├── about.mdx                   # About page
├── features.mdx                # Features
│
├── governance/                 # Public governance (ACTIVE)
│   ├── index.mdx
│   ├── sealed/                # Immutable foundation docs
│   │   ├── index.mdx
│   │   ├── nexus-canon-constitution.mdx
│   │   ├── titan-protocol.mdx
│   │   └── lbos-origin-paper.mdx
│   ├── active/                # Current governance
│   │   ├── index.mdx
│   │   └── planning-playbook.mdx
│   └── amendments/            # Governance amendments
│       ├── index.mdx
│       └── a-001-courts-charter.mdx
│
├── guides/                     # User guides (ACTIVE)
│   ├── index.mdx
│   ├── getting-started.mdx
│   ├── sealing-documents.mdx
│   └── amendments.mdx
│
└── product/                    # Product documentation (ACTIVE)
    ├── index.mdx
    ├── features.mdx
    └── roadmap.mdx
```

---

### 1.4 .cursor/ (Cursor AI Configuration)

**Location**: `.cursor/`
**Purpose**: Cursor AI configuration and working docs
**Indexing**: Partial (rules, docs, templates ✅; work, archive ❌)
**Public**: ❌ Internal tooling

**Structure**:
```
.cursor/
├── rules/                      # Cursor rules (ACTIVE)
│   ├── 000_master-cursor-defaults.mdc
│   ├── 001_core-safety.mdc
│   ├── 022_documentation-governance.mdc
│   └── ... (33 .mdc files)
│   [Included in AI context]
│
├── docs/                       # Cursor-specific docs (ACTIVE)
│   ├── architecture/
│   │   └── system-overview.md
│   └── patterns/
│       └── module-patterns.md
│   [Included in AI context]
│
├── templates/                  # Plan templates (ACTIVE)
│   └── plans/
│       ├── component-plan.md
│       └── api-endpoint-plan.md
│   [Included in AI context]
│
├── skills/                     # Agent skills (ACTIVE)
│   └── workspace-optimizer/
│       └── SKILL.md
│   [Included in AI context]
│
├── product/                    # Product docs (ACTIVE)
│   ├── PRD_v3_STRATEGIC_ENHANCEMENTS.md
│   └── Axis_visual_canon_official_design_system.md
│   [Could move to docs/product/]
│
├── work/                       # Active planning/analysis (PROPOSED RENAME)
│   ├── current-analysis/
│   └── tool-comparisons/
│   [Currently: .cursor/planing/]
│   [Excluded from AI indexing - temporary work]
│
└── archive/                    # Historical reference (PROPOSED)
    ├── planning/              # Historical planning docs
    ├── legacy/                # Superseded documents
    │   ├── Legacy_NexusCanon_Constitution.md
    │   ├── Legacy_Titan_Protocol.md
    │   └── ...
    └── governance/            # Historical governance
    [Excluded from AI indexing]
```

---

### 1.5 .temp-docs/ (Temporary Holding Area)

**Location**: `.temp-docs/`
**Purpose**: Temporary working documents (7-day expiry)
**Indexing**: ❌ Excluded from AI context
**Format**: `TEMP-YYYYMMDD-HHMM_name.md`

**Current Status**: ✅ Only README.md (compliance guide)

---

### 1.6 .vscode/ (VS Code Configuration)

**Location**: `.vscode/`
**Purpose**: VS Code configuration files
**Documentation**: ✅ README.md allowed (exception)
**Status**: ✅ Compliant

---

### 1.7 app/, pages/, components/ (Code Directories)

**Location**: `app/`, `pages/`, `components/`
**Purpose**: Application code
**Documentation**: ❌ NO standalone .md files
**Exception**: ✅ Page-level .mdx files (Next.js/Nextra convention)
**Status**: ✅ Compliant

---

## 2. Document Types (Frontmatter Schema)

### 2.1 Required Frontmatter

Every document MUST have:

```yaml
---
doc_type: [CONSTITUTION|STANDARD|ADR|SPEC|PRD|RUNBOOK|POLICY|NOTE|GUIDE]
status: [draft|active|sealed|legacy|archived]
owner: [team-or-role]
source_of_truth: [true|false]
created: [YYYY-MM-DD]
modified: [YYYY-MM-DD]
tags: [tag1, tag2, ...]
---
```

### 2.2 Document Type Definitions

| Type | Purpose | Location | Mutability |
|------|---------|----------|------------|
| **CONSTITUTION** | Foundational governance | `content/governance/sealed/` | Immutable |
| **STANDARD** | Engineering/design standard | `docs/architecture/` | Versioned |
| **ADR** | Architecture Decision Record | `docs/architecture/adr/` | Immutable once ratified |
| **SPEC** | Technical specification | `docs/architecture/` or `docs/api/` | Versioned |
| **PRD** | Product Requirements Doc | `docs/product/` or `.cursor/product/` | Versioned |
| **RUNBOOK** | Operational procedure | `docs/guides/` | Versioned |
| **POLICY** | Compliance/security policy | `docs/governance/` | Versioned |
| **NOTE** | Working note/analysis | `.cursor/work/` | Temporary |
| **GUIDE** | How-to guide | `docs/guides/` or `content/guides/` | Versioned |

### 2.3 Status Definitions

| Status | Meaning | Typical Location | Mutability |
|--------|---------|------------------|------------|
| **draft** | Pre-ratification, working | `.cursor/work/` or `docs/*/draft/` | Mutable |
| **active** | Ratified, current | `docs/*/` or `content/*/active/` | Mutable (versioned) |
| **sealed** | Ratified, immutable | `content/governance/sealed/` | Immutable |
| **legacy** | Superseded, archived | `.cursor/archive/legacy/` | Read-only |
| **archived** | Historical reference | `.cursor/archive/*/` | Read-only |

---

## 3. Naming Conventions

### 3.1 Permanent Documentation

**Format**: `DOC-[NUMBER]_descriptive-name.md` (PREFERRED)

Example: `DOC-0042_architecture-overview.md`

**Alternative Formats** (acceptable):
- `[hash-8chars]_name.md` - e.g., `a7f3e2b1_api-spec.md`
- `v[VERSION]_name.md` - e.g., `v1.2.0_cursor-guide.md`

### 3.2 Temporary Documentation

**Format**: `TEMP-[YYYYMMDD-HHMM]_descriptive-name.md`

Example: `TEMP-20260110-1430_analysis-notes.md`

**Location**: `.temp-docs/` ONLY
**Expiry**: 7 days (auto-deleted by pre-commit hook)

### 3.3 Legacy Files (During Migration)

**Format**: Keep original name, add to frontmatter:
```yaml
status: legacy
superseded_by: [path-to-new-canonical-doc]
```

**Location**: `.cursor/archive/legacy/`

---

## 4. Link Conventions

### 4.1 Internal Links

**Absolute from project root**:
```markdown
[API Guide](/docs/api/graphql.md)
[Constitution](/content/governance/sealed/nexus-canon-constitution.mdx)
```

**Relative within same directory**:
```markdown
[Related Doc](./related-doc.md)
```

### 4.2 Cross-Repository Links

**Use full URL**:
```markdown
[External Spec](https://github.com/org/repo/blob/main/docs/spec.md)
```

---

## 5. Directory Decision Matrix

**When creating a new document, use this decision tree**:

```
Is it public-facing?
├─ YES → content/
│  ├─ Governance? → content/governance/
│  ├─ Guide? → content/guides/
│  └─ Product? → content/product/
│
└─ NO → Is it Cursor-specific?
   ├─ YES → .cursor/
   │  ├─ Rule? → .cursor/rules/
   │  ├─ Template? → .cursor/templates/
   │  ├─ Temporary? → .cursor/work/
   │  └─ Documentation? → .cursor/docs/
   │
   └─ NO → docs/
      ├─ Architecture? → docs/architecture/
      ├─ API? → docs/api/
      ├─ Guide? → docs/guides/
      ├─ Reference? → docs/reference/
      ├─ Governance? → docs/governance/
      └─ Migration/Historical? → docs/migrations/ or docs/changelog/
```

---

## 6. AI Context Optimization

### 6.1 Included in AI Context

✅ Root directory (11 essential files)
✅ `docs/` (except migrations/, changelog/)
✅ `content/` (all public docs)
✅ `.cursor/rules/` (all rules)
✅ `.cursor/docs/` (Cursor-specific docs)
✅ `.cursor/templates/` (plan templates)
✅ `.cursor/skills/` (agent skills)

### 6.2 Excluded from AI Context

❌ `docs/migrations/` (historical, not current patterns)
❌ `docs/changelog/` (past implementations, not active)
❌ `.cursor/work/` (temporary analysis, noise)
❌ `.cursor/archive/` (historical reference, not current)
❌ `.temp-docs/` (temporary, expires in 7 days)
❌ `node_modules/`, `.next/`, etc. (build artifacts)

**Configuration**: `.cursorignore`

---

## 7. Migration Path

### 7.1 Files Requiring Moves

**High Priority** (duplicate/misplaced governance docs):
1. `.cursor/planing/Legacy_*Constitution*.md` → `.cursor/archive/legacy/`
2. `.cursor/planing/Legacy_*Titan*.md` → `.cursor/archive/legacy/`
3. `.cursor/planing/*playbook* (duplicates)` → Consolidate + archive old versions

**Medium Priority** (organizational):
4. `.cursor/planing/` → `.cursor/work/` (rename directory)
5. Active planning docs → `.cursor/work/`
6. Historical planning docs → `.cursor/archive/planning/`

**Low Priority** (naming convention):
7. Apply `DOC-XXXX_` naming to new/reorganized docs (gradual)

### 7.2 Directories to Create

```bash
# New directories needed:
docs/_system/                   # ✅ Already created
docs/governance/active/         # For internal governance docs
docs/governance/draft/          # For proposed governance
.cursor/work/                   # Rename from .cursor/planing/
.cursor/archive/                # For historical docs
.cursor/archive/legacy/         # For superseded docs
.cursor/archive/planning/       # For historical planning
.cursor/archive/governance/     # For historical governance
```

---

## 8. Enforcement

### 8.1 Pre-Commit Hooks

**Validation Rules**:
1. ✅ No new docs in forbidden locations
2. ✅ All new docs have proper frontmatter
3. ✅ Naming convention followed (DOC-XXXX or TEMP-YYYYMMDD-HHMM)
4. ✅ Temporary docs in .temp-docs/ not older than 7 days
5. ✅ Internal links valid

**Location**: `.husky/pre-commit` + `scripts/validate-docs-naming.ts`

### 8.2 CI/CD Checks

**GitHub Actions** (`.github/workflows/docs-check.yml`):
1. Validate documentation structure
2. Check for broken links
3. Verify frontmatter compliance
4. Enforce naming conventions

---

## 9. Exceptions

### 9.1 Approved Exceptions

✅ Root directory: 11 files (proposed exception to 3-file limit)
✅ `.vscode/README.md`: Configuration documentation
✅ `.temp-docs/README.md`: Temporary docs guide
✅ `app/**/*.mdx`, `pages/**/*.mdx`: Next.js/Nextra page files
✅ `.cursor/rules/*.mdc`: Cursor rule files (not standard markdown)

### 9.2 No Other Exceptions

All other documentation MUST follow taxonomy and naming conventions.

---

## 10. Status Summary

### Current State
- ✅ Root directory clean (11 essential files)
- ✅ docs/ well-organized (previous cleanup)
- ⚠️ .cursor/planing/ needs reorganization (46 files, mixed purpose)
- ⚠️ Duplicate governance docs detected (15+ files)
- ⚠️ Legacy files not yet archived (10+ files)

### Target State
- ✅ Root directory: 11 essential files (exception approved)
- ✅ docs/ canonical internal docs with _system/ governance
- ✅ content/ public docs with sealed governance
- ✅ .cursor/work/ for temporary analysis
- ✅ .cursor/archive/ for historical reference
- ✅ Zero duplicates (all deduplicated via references)
- ✅ All files comply with naming conventions

---

## Next Phase

**Approval Needed**:
1. Approve this taxonomy (canonical locations)
2. Approve proposed decisions (D-0005, D-0006, D-0007)
3. Approve migration plan (next file)

**Then Proceed To**:
- Phase 3: Staged moves + link updates
- Phase 4: Cutover + navigation generation

**Status**: Phase 2 complete, awaiting approval for Phase 3
