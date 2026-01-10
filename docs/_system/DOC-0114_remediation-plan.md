---
doc_type: STANDARD
status: active
owner: documentation-governance
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [documentation, remediation, cleanliness, compliance]
---

# Documentation Cleanliness Remediation Plan

**Generated**: 2026-01-10
**Status**: READY FOR EXECUTION
**Purpose**: Step-by-step plan to fix all cleanliness issues identified in audit

---

## Remediation Overview

### Issues Summary

- **Files Requiring Frontmatter**: 12 files
- **Files Requiring Rename**: 8 files
- **Files Requiring Formatting**: 15 files
- **Total Actions**: 35 individual fixes

### Estimated Time

- **Phase 1** (Frontmatter): 2-3 hours
- **Phase 2** (Renaming): 1 hour
- **Phase 3** (Formatting): 1 hour
- **Total**: 4-5 hours

---

## Phase 1: Add Frontmatter (HIGH PRIORITY)

### Files to Fix (12 files)

#### 1. `docs/architecture/RFL_DOCTRINE_v1.0.md`

**Current State**: No frontmatter, uses inline metadata

**Action**:
```yaml
---
doc_type: STANDARD
status: sealed
owner: architecture-team
source_of_truth: true
created: 2026-01-06
modified: 2026-01-06
tags: [architecture, rfl, doctrine, sealed]
version: 1.0.0
---
```

**Remove from content**: Status, Version, Date lines (move to frontmatter)

#### 2. `docs/api/API_AUTOGENERATION_STRATEGY.md`

**Action**:
```yaml
---
doc_type: STANDARD
status: active
owner: api-team
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [api, autogeneration, strategy, zod]
---
```

#### 3. `docs/api/API_AUTOGENERATION_IMPLEMENTATION.md`

**Action**:
```yaml
---
doc_type: STANDARD
status: active
owner: api-team
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [api, autogeneration, implementation, zod]
---
```

#### 4. `docs/api/API_AUTOGENERATION_QUICK_REFERENCE.md`

**Action**:
```yaml
---
doc_type: GUIDE
status: active
owner: api-team
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [api, autogeneration, quick-reference, zod]
---
```

#### 5. `docs/architecture/CONSISTENCY_SUSTAINABILITY_AUDIT.md`

**Action**:
```yaml
---
doc_type: STANDARD
status: active
owner: architecture-team
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [architecture, audit, consistency, sustainability]
---
```

#### 6-12. Reference Documentation Files

**Files**:
- `docs/reference/TURBOPACK_QUICK_REFERENCE.md`
- `docs/reference/TURBOPACK_SUPPORT.md`
- `docs/reference/TURBOREPO_QUICK_START.md`
- `docs/reference/TURBOREPO_OPTIMIZATION.md`
- `docs/reference/CURSOR_BEST_PRACTICES_EVIDENCE_BASED.md`
- `docs/reference/FEATURES_CHECKLIST.md`
- `docs/reference/FILE_SYSTEM_MANAGEMENT_BEST_PRACTICES_REPORT.md`

**Standard Frontmatter Template**:
```yaml
---
doc_type: REFERENCE
status: active
owner: documentation-governance
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [reference, topic-specific-tags]
---
```

---

## Phase 2: Rename Files (MEDIUM PRIORITY)

### Rename Mapping

| Current Name | New Name | DOC ID |
|--------------|----------|--------|
| `RFL_DOCTRINE_v1.0.md` | `DOC-0114_rfl-doctrine-v1.0.md` | DOC-0114 |
| `API_AUTOGENERATION_STRATEGY.md` | `DOC-0115_api-autogeneration-strategy.md` | DOC-0115 |
| `API_AUTOGENERATION_IMPLEMENTATION.md` | `DOC-0116_api-autogeneration-implementation.md` | DOC-0116 |
| `API_AUTOGENERATION_QUICK_REFERENCE.md` | `DOC-0117_api-autogeneration-quick-reference.md` | DOC-0117 |
| `CONSISTENCY_SUSTAINABILITY_AUDIT.md` | `DOC-0118_consistency-sustainability-audit.md` | DOC-0118 |
| `TURBOPACK_QUICK_REFERENCE.md` | `DOC-0119_turbopack-quick-reference.md` | DOC-0119 |
| `TURBOPACK_SUPPORT.md` | `DOC-0120_turbopack-support.md` | DOC-0120 |
| `TURBOREPO_QUICK_START.md` | `DOC-0121_turborepo-quick-start.md` | DOC-0121 |

### Steps for Each File

1. **Rename file** (git mv to preserve history)
2. **Update internal links** (search for old filename)
3. **Update registry** (change file path)
4. **Verify no broken links**

### Link Update Commands

```bash
# Find all references to old filename
grep -r "RFL_DOCTRINE_v1.0" docs/ content/ .cursor/docs/

# Update links
# Change: [RFL Doctrine](./architecture/RFL_DOCTRINE_v1.0.md)
# To: [RFL Doctrine](./architecture/DOC-0114_rfl-doctrine-v1.0.md)
```

---

## Phase 3: Formatting Fixes (LOW PRIORITY)

### Automated Formatting

**Run formatter**:
```bash
# If markdownlint is configured
pnpm docs:lint:fix

# Or manually fix:
# - Remove trailing whitespace
# - Fix heading hierarchy
# - Add table of contents to long docs
```

### Manual Fixes Required

1. **Trailing Whitespace**: Remove from all files
2. **Heading Hierarchy**: Fix skipped levels
3. **Table of Contents**: Add to docs > 200 lines

---

## Execution Order

### Step 1: Preparation

- [ ] Review audit report
- [ ] Backup current state (git commit)
- [ ] Verify registry is up-to-date

### Step 2: Phase 1 - Frontmatter (2-3 hours)

- [ ] Add frontmatter to RFL_DOCTRINE_v1.0.md
- [ ] Add frontmatter to API_AUTOGENERATION_STRATEGY.md
- [ ] Add frontmatter to API_AUTOGENERATION_IMPLEMENTATION.md
- [ ] Add frontmatter to API_AUTOGENERATION_QUICK_REFERENCE.md
- [ ] Add frontmatter to CONSISTENCY_SUSTAINABILITY_AUDIT.md
- [ ] Add frontmatter to TURBOPACK_QUICK_REFERENCE.md
- [ ] Add frontmatter to TURBOPACK_SUPPORT.md
- [ ] Add frontmatter to TURBOREPO_QUICK_START.md
- [ ] Add frontmatter to TURBOREPO_OPTIMIZATION.md
- [ ] Add frontmatter to CURSOR_BEST_PRACTICES_EVIDENCE_BASED.md
- [ ] Add frontmatter to FEATURES_CHECKLIST.md
- [ ] Add frontmatter to FILE_SYSTEM_MANAGEMENT_BEST_PRACTICES_REPORT.md

### Step 3: Phase 2 - Renaming (1 hour)

- [ ] Rename RFL_DOCTRINE_v1.0.md → DOC-0114_rfl-doctrine-v1.0.md
- [ ] Rename API_AUTOGENERATION_STRATEGY.md → DOC-0115_api-autogeneration-strategy.md
- [ ] Rename API_AUTOGENERATION_IMPLEMENTATION.md → DOC-0116_api-autogeneration-implementation.md
- [ ] Rename API_AUTOGENERATION_QUICK_REFERENCE.md → DOC-0117_api-autogeneration-quick-reference.md
- [ ] Rename CONSISTENCY_SUSTAINABILITY_AUDIT.md → DOC-0118_consistency-sustainability-audit.md
- [ ] Rename TURBOPACK_QUICK_REFERENCE.md → DOC-0119_turbopack-quick-reference.md
- [ ] Rename TURBOPACK_SUPPORT.md → DOC-0120_turbopack-support.md
- [ ] Rename TURBOREPO_QUICK_START.md → DOC-0121_turborepo-quick-start.md
- [ ] Update all internal links
- [ ] Update registry

### Step 4: Phase 3 - Formatting (1 hour)

- [ ] Run formatter
- [ ] Fix trailing whitespace
- [ ] Fix heading hierarchy
- [ ] Add table of contents

### Step 5: Verification

- [ ] Run audit: `pnpm audit:docs:cleanliness`
- [ ] Verify compliance: Should be 95%+
- [ ] Check for broken links
- [ ] Update registry
- [ ] Commit changes

---

## Success Criteria

### Quantitative

- ✅ Frontmatter compliance: 68% → 100%
- ✅ Naming compliance: 78% → 100%
- ✅ Overall compliance: 78% → 95%+

### Qualitative

- ✅ All files have proper frontmatter
- ✅ All files follow naming convention
- ✅ No formatting issues
- ✅ Registry is accurate
- ✅ No broken links

---

## Rollback Plan

If remediation causes issues:

```bash
# Rollback individual file
git checkout HEAD -- [file-path]

# Rollback all changes
git reset --hard [commit-before-remediation]
```

---

**Status**: Ready for Execution
**Estimated Time**: 4-5 hours
**Risk Level**: 🟢 LOW (all changes reversible)

**Next Step**: Execute Phase 1 (Add Frontmatter)
