---
doc_type: STANDARD
status: active
owner: documentation-governance
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [migration, root-directory, documentation-governance]
---

# Root Directory Migration Strategy (Optimized)

**Generated**: 2026-01-10
**Status**: ACTIVE
**Purpose**: Optimize root directory to essential files only, migrate others to designated locations

---

## 1. Current State Analysis

### Root Directory Files (11 total)

**Essential (Keep in Root)**:
1. ✅ `README.md` - Project overview (REQUIRED)
2. ✅ `QUICK_START.md` - Getting started guide (REQUIRED)
3. ✅ `QUICK_REFERENCE.md` - Quick reference (RECOMMENDED)

**System Documentation (8 files - Migrate to docs/reference/)**:
4. ⚠️ `CURSOR_SYSTEM_ARCHITECTURE.md` → `docs/architecture/DOC-XXXX_system-architecture.md`
5. ⚠️ `CURSOR_OPTIMIZATION_QUICK_REF.md` → `docs/reference/DOC-XXXX_cursor-optimization-quick-ref.md`
6. ⚠️ `DOCUMENTATION_ORGANIZATION_STRATEGY.md` → `docs/_system/DOC-XXXX_documentation-organization-strategy.md`
7. ⚠️ `DOCUMENTATION_ORGANIZATION_QUICK_START.md` → `docs/_system/DOC-XXXX_documentation-organization-quick-start.md`
8. ⚠️ `README_FEATURES.md` → `docs/reference/DOC-XXXX_features-reference.md`
9. ⚠️ `NEXTJS_CONFIGURATION_VALIDATION.md` → `docs/reference/DOC-XXXX_nextjs-configuration-validation.md`
10. ⚠️ `EXTERNAL_DEPENDENCIES_SOLUTION.md` → `docs/reference/DOC-XXXX_external-dependencies-solution.md`
11. ⚠️ `TEST_REPORT_CUSTOMIZATION.md` → `docs/reference/DOC-XXXX_test-report-customization.md`

---

## 2. Optimized Root Directory Policy

### 2.1 Allowed Files (STRICT - 3 files maximum)

**ONLY these 3 files allowed in root**:

```
1. README.md                    (REQUIRED: Project overview)
2. QUICK_START.md               (REQUIRED: Getting started)
3. QUICK_REFERENCE.md           (RECOMMENDED: Quick reference)
```

**Rationale**:
- These are the first files developers encounter
- Essential for onboarding and discovery
- All other documentation should be in designated directories

### 2.2 Prohibited Files

**ALL other markdown files in root are PROHIBITED**:
- System architecture docs → `docs/architecture/`
- Reference documentation → `docs/reference/`
- Strategy documents → `docs/_system/` or `docs/governance/`
- Configuration guides → `docs/reference/`
- Feature documentation → `docs/reference/`

---

## 3. Migration Plan

### Phase 1: Generate Document IDs

For each file to migrate, generate a DOC-XXXX identifier:

```bash
# Assign sequential IDs starting from highest existing
# Check docs/ for highest DOC-XXXX number
# Example: If highest is DOC-0099, start from DOC-0100
```

**File → New Path Mapping**:

| Current File | New Path | DOC ID |
|--------------|----------|--------|
| `CURSOR_SYSTEM_ARCHITECTURE.md` | `docs/architecture/DOC-0100_system-architecture.md` | DOC-0100 |
| `CURSOR_OPTIMIZATION_QUICK_REF.md` | `docs/reference/DOC-0101_cursor-optimization-quick-ref.md` | DOC-0101 |
| `DOCUMENTATION_ORGANIZATION_STRATEGY.md` | `docs/_system/DOC-0102_documentation-organization-strategy.md` | DOC-0102 |
| `DOCUMENTATION_ORGANIZATION_QUICK_START.md` | `docs/_system/DOC-0103_documentation-organization-quick-start.md` | DOC-0103 |
| `README_FEATURES.md` | `docs/reference/DOC-0104_features-reference.md` | DOC-0104 |
| `NEXTJS_CONFIGURATION_VALIDATION.md` | `docs/reference/DOC-0105_nextjs-configuration-validation.md` | DOC-0105 |
| `EXTERNAL_DEPENDENCIES_SOLUTION.md` | `docs/reference/DOC-0106_external-dependencies-solution.md` | DOC-0106 |
| `TEST_REPORT_CUSTOMIZATION.md` | `docs/reference/DOC-0107_test-report-customization.md` | DOC-0107 |

### Phase 2: Add Frontmatter to Migrated Files

Each migrated file MUST have frontmatter:

```yaml
---
doc_type: [STANDARD|GUIDE|REFERENCE]
status: active
owner: documentation-governance
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [relevant, tags]
migrated_from: [original-root-path]
---
```

### Phase 3: Update Links

**Files that reference root docs** (need link updates):
- `README.md` - Update links to new paths
- `QUICK_START.md` - Update links to new paths
- `QUICK_REFERENCE.md` - Update links to new paths
- `docs/README.md` - Update links to new paths
- Any other files referencing these docs

**Link Update Pattern**:
```markdown
# Before
[Cursor System Architecture](./CURSOR_SYSTEM_ARCHITECTURE.md)

# After
[Cursor System Architecture](./docs/architecture/DOC-0100_system-architecture.md)
```

### Phase 4: Create Redirect Stubs (Optional)

For backward compatibility, create minimal stubs in root:

```markdown
# CURSOR_SYSTEM_ARCHITECTURE.md (stub)

**Status**: MOVED

This document has been moved to: [docs/architecture/DOC-0100_system-architecture.md](./docs/architecture/DOC-0100_system-architecture.md)

Please update your bookmarks and links.
```

**Decision**: Stubs are optional - can be removed after link updates verified.

---

## 4. Validation Script Updates

### 4.1 Update `scripts/validate-docs-naming.ts`

**Current**:
```typescript
const ROOT_EXCEPTIONS = ['README.md', 'QUICK_START.md', 'QUICK_REFERENCE.md']
```

**Keep as-is** (already correct - only 3 files allowed).

### 4.2 Add Strict Root Validation

Add check to reject ALL other markdown files in root:

```typescript
// Check if in root directory
if (!location && !ROOT_EXCEPTIONS.includes(filename)) {
  violations.push({
    file,
    reason: 'Documentation not allowed in root directory (only README.md, QUICK_START.md, QUICK_REFERENCE.md allowed)',
    location: 'root',
  })
  stats.invalid++
  continue
}
```

---

## 5. Rule Updates

### 5.1 Update `.cursor/rules/022_documentation-governance.mdc`

**Current** (line 47-50):
```markdown
**Exception**: Only 3 files allowed in root:
- `README.md` (project overview)
- `QUICK_START.md` (getting started)
- `QUICK_REFERENCE.md` (quick reference)
```

**Keep as-is** (already correct).

### 5.2 Update `.cursor/rules/010_docs-directory-policy.mdc`

**Current** (line 13-17):
```markdown
✅ **Root Directory** (essential only, max 11 files)
- README.md (required)
- QUICK_START.md (required)
- QUICK_REFERENCE.md (recommended)
- Essential system docs (max 8 additional)
```

**Update to**:
```markdown
✅ **Root Directory** (essential only, STRICT 3 files)
- README.md (required)
- QUICK_START.md (required)
- QUICK_REFERENCE.md (recommended)
- NO OTHER DOCUMENTATION ALLOWED
```

### 5.3 Update `.cursor/rules/000_master-cursor-defaults.mdc`

**Current** (line 52):
```markdown
- / (root)           (except README.md, QUICK_START.md, QUICK_REFERENCE.md)
```

**Keep as-is** (already correct).

---

## 6. Execution Checklist

### Pre-Migration
- [ ] Verify git clean state
- [ ] Backup current state (git commit)
- [ ] Generate DOC-XXXX IDs for all 8 files
- [ ] Identify all files that link to root docs

### Migration
- [ ] Move `CURSOR_SYSTEM_ARCHITECTURE.md` → `docs/architecture/DOC-0100_system-architecture.md`
- [ ] Move `CURSOR_OPTIMIZATION_QUICK_REF.md` → `docs/reference/DOC-0101_cursor-optimization-quick-ref.md`
- [ ] Move `DOCUMENTATION_ORGANIZATION_STRATEGY.md` → `docs/_system/DOC-0102_documentation-organization-strategy.md`
- [ ] Move `DOCUMENTATION_ORGANIZATION_QUICK_START.md` → `docs/_system/DOC-0103_documentation-organization-quick-start.md`
- [ ] Move `README_FEATURES.md` → `docs/reference/DOC-0104_features-reference.md`
- [ ] Move `NEXTJS_CONFIGURATION_VALIDATION.md` → `docs/reference/DOC-0105_nextjs-configuration-validation.md`
- [ ] Move `EXTERNAL_DEPENDENCIES_SOLUTION.md` → `docs/reference/DOC-0106_external-dependencies-solution.md`
- [ ] Move `TEST_REPORT_CUSTOMIZATION.md` → `docs/reference/DOC-0107_test-report-customization.md`

### Post-Migration
- [ ] Add frontmatter to all migrated files
- [ ] Update all links in `README.md`
- [ ] Update all links in `QUICK_START.md`
- [ ] Update all links in `QUICK_REFERENCE.md`
- [ ] Update all links in `docs/README.md`
- [ ] Run link validation (no broken links)
- [ ] Run `pnpm validate:docs` (should pass)
- [ ] Verify root has only 3 files
- [ ] Test that all migrated docs are accessible
- [ ] Update `.cursorignore` if needed

### Optional: Redirect Stubs
- [ ] Create redirect stubs in root (if backward compatibility needed)
- [ ] Document stub removal timeline (e.g., after 30 days)

---

## 7. Success Criteria

### Quantitative
- ✅ Root directory: 3 files (down from 11)
- ✅ All 8 files migrated to designated directories
- ✅ All files have proper DOC-XXXX naming
- ✅ All files have frontmatter
- ✅ Zero broken links
- ✅ Validation script passes

### Qualitative
- ✅ Clear separation: root = onboarding, docs/ = reference
- ✅ Improved discoverability (docs organized by type)
- ✅ Governance compliance (strict 3-file limit)
- ✅ Better AI context (docs in proper directories)

---

## 8. Rollback Plan

If migration causes issues:

```bash
# Rollback individual file
git checkout HEAD -- [original-root-path]

# Rollback entire migration
git reset --hard [commit-before-migration]

# Restore from stubs (if created)
# Stubs contain original location info
```

---

## 9. Maintenance

### Ongoing Enforcement

**Pre-commit Hook**:
- Validates root has only 3 files
- Blocks new markdown files in root
- Enforces DOC-XXXX naming for migrated files

**CI/CD**:
- Validates root directory structure
- Checks for broken links
- Verifies frontmatter compliance

---

**Status**: Ready for execution
**Risk Level**: 🟢 LOW (reversible moves, no deletions)
**Estimated Time**: 1-2 hours (with verification)
