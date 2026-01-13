---
doc_type: STANDARD
status: active
owner: documentation-governance
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [documentation, consolidation, DRY, duplicates]
---

# Documentation Consolidation Plan

**Generated**: 2026-01-10 **Status**: READY FOR EXECUTION **Purpose**: Execute
consolidation to eliminate duplicates and enforce DRY

---

## Consolidation Overview

### Priority Actions

| Priority   | Action                                 | Files    | Time   | Risk |
| ---------- | -------------------------------------- | -------- | ------ | ---- |
| **HIGH**   | Consolidate Root Migration Summary     | 2 files  | 15 min | Low  |
| **MEDIUM** | Add Cross-References (Turbopack)       | 2 files  | 5 min  | None |
| **MEDIUM** | Add Cross-References (Getting Started) | 3 files  | 10 min | None |
| **MEDIUM** | Add Cross-References (API Docs)        | 3 files  | 10 min | None |
| **LOW**    | Update Frontmatter                     | Multiple | 30 min | None |

**Total Estimated Time**: 70 minutes

---

## Action 1: Consolidate Root Migration Summary (HIGH PRIORITY)

### Files Involved

- **Source**: `docs/_system/ROOT_MIGRATION_SUMMARY.md`
- **Target**: `docs/_system/ROOT_MIGRATION_STRATEGY.md`

### Steps

1. **Read both files**
2. **Extract summary content** from ROOT_MIGRATION_SUMMARY.md
3. **Add "Execution Summary" section** to ROOT_MIGRATION_STRATEGY.md
4. **Update frontmatter** in strategy (add execution_date, execution_status)
5. **Delete** ROOT_MIGRATION_SUMMARY.md
6. **Update registry** (mark SYS-010 as consolidated)

### Content to Merge

From ROOT_MIGRATION_SUMMARY.md:

- Validation results section
- Files updated section
- Next steps section
- Success metrics

### Expected Result

- ✅ Single source of truth (ROOT_MIGRATION_STRATEGY.md)
- ✅ Complete migration history in one file
- ✅ No redundant summary file
- ✅ Registry updated

---

## Action 2: Add Cross-References (Turbopack) (MEDIUM PRIORITY)

### Files Involved

- `docs/reference/TURBOPACK_QUICK_REFERENCE.md`
- `docs/reference/TURBOPACK_SUPPORT.md`

### Steps

1. **Add to TURBOPACK_QUICK_REFERENCE.md**:

   ```markdown
   > **For troubleshooting and detailed setup**, see
   > [Turbopack Support](./TURBOPACK_SUPPORT.md)
   ```

2. **Add to TURBOPACK_SUPPORT.md**:

   ```markdown
   > **For quick command reference**, see
   > [Turbopack Quick Reference](./TURBOPACK_QUICK_REFERENCE.md)
   ```

3. **Update frontmatter** (add `related_docs` field)

### Expected Result

- ✅ Clear navigation between related docs
- ✅ Users know which doc to use
- ✅ No content duplication

---

## Action 3: Add Cross-References (Getting Started) (MEDIUM PRIORITY)

### Files Involved

- `QUICK_START.md` (root)
- `docs/guides/POST_CLONE_SETUP.md`
- `content/guides/getting-started.mdx`

### Steps

1. **Add to QUICK_START.md**:

   ```markdown
   > **For detailed setup instructions**, see
   > [Post-Clone Setup Guide](./docs/guides/POST_CLONE_SETUP.md) **For public
   > documentation**, see
   > [Getting Started Guide](./content/guides/getting-started.mdx)
   ```

2. **Add to POST_CLONE_SETUP.md**:

   ```markdown
   > **For quick overview**, see [Quick Start](../QUICK_START.md) **For public
   > documentation**, see
   > [Getting Started Guide](../content/guides/getting-started.mdx)
   ```

3. **Add to content/guides/getting-started.mdx**:
   ```markdown
   > **For quick overview**, see [Quick Start](/QUICK_START.md) **For detailed
   > setup**, see [Post-Clone Setup](/docs/guides/POST_CLONE_SETUP.md)
   ```

### Expected Result

- ✅ Clear navigation chain
- ✅ Users can find appropriate guide
- ✅ No confusion about which doc to use

---

## Action 4: Add Cross-References (API Docs) (MEDIUM PRIORITY)

### Files Involved

- `docs/api/API_AUTOGENERATION_STRATEGY.md`
- `docs/api/API_AUTOGENERATION_IMPLEMENTATION.md`
- `docs/api/API_AUTOGENERATION_QUICK_REFERENCE.md`

### Steps

1. **Add to API_AUTOGENERATION_STRATEGY.md**:

   ```markdown
   ## Next Steps

   - **Implementation**: See
     [API Autogeneration Implementation](./API_AUTOGENERATION_IMPLEMENTATION.md)
   - **Quick Reference**: See
     [API Autogeneration Quick Reference](./API_AUTOGENERATION_QUICK_REFERENCE.md)
   ```

2. **Add to API_AUTOGENERATION_IMPLEMENTATION.md**:

   ```markdown
   ## Related Documentation

   - **Strategy**: See
     [API Autogeneration Strategy](./API_AUTOGENERATION_STRATEGY.md)
   - **Quick Reference**: See
     [API Autogeneration Quick Reference](./API_AUTOGENERATION_QUICK_REFERENCE.md)
   ```

3. **Add to API_AUTOGENERATION_QUICK_REFERENCE.md**:

   ```markdown
   ## Related Documentation

   - **Strategy**: See
     [API Autogeneration Strategy](./API_AUTOGENERATION_STRATEGY.md)
   - **Implementation**: See
     [API Autogeneration Implementation](./API_AUTOGENERATION_IMPLEMENTATION.md)
   ```

### Expected Result

- ✅ Clear progression: Strategy → Implementation → Quick Ref
- ✅ Users can navigate between related docs
- ✅ No content duplication

---

## Action 5: Update Frontmatter (LOW PRIORITY)

### Files to Update

All documentation files with similar topics should have:

```yaml
---
doc_type: STANDARD
status: active
owner: documentation-governance
source_of_truth: true
created: YYYY-MM-DD
modified: YYYY-MM-DD
tags: [relevant, tags]
related_docs: # NEW FIELD
  - path/to/related-doc-1.md
  - path/to/related-doc-2.md
---
```

### Steps

1. **Identify related docs** (from registry)
2. **Add `related_docs` field** to frontmatter
3. **Update registry** with cross-reference metadata

### Expected Result

- ✅ Machine-readable cross-references
- ✅ Can generate navigation automatically
- ✅ Better discoverability

---

## Execution Checklist

### Pre-Execution

- [ ] Review consolidation plan
- [ ] Backup current state (git commit)
- [ ] Verify registry is up-to-date
- [ ] Review audit report

### Execution

- [ ] Action 1: Consolidate Root Migration Summary
- [ ] Action 2: Add Cross-References (Turbopack)
- [ ] Action 3: Add Cross-References (Getting Started)
- [ ] Action 4: Add Cross-References (API Docs)
- [ ] Action 5: Update Frontmatter

### Post-Execution

- [ ] Run audit: `pnpm audit:docs`
- [ ] Verify no broken links
- [ ] Update registry
- [ ] Update audit report
- [ ] Commit changes

---

## Success Criteria

### Quantitative

- ✅ Duplicate clusters: 3 → 0 (after consolidation)
- ✅ DRY violations: 2 → 0 (after cross-references)
- ✅ Cross-reference coverage: 60% → 100%
- ✅ Registry accuracy: 100%

### Qualitative

- ✅ Single source of truth for all topics
- ✅ Clear navigation between related docs
- ✅ No redundant content
- ✅ Better discoverability

---

## Rollback Plan

If consolidation causes issues:

```bash
# Rollback individual action
git checkout HEAD -- [file-path]

# Rollback all changes
git reset --hard [commit-before-consolidation]
```

---

## Maintenance

### After Consolidation

1. **Run audit weekly**: `pnpm audit:docs`
2. **Review registry monthly**: Check for new duplicates
3. **Update cross-references**: When adding new related docs
4. **Maintain registry**: Update immediately after changes

---

**Status**: Ready for Execution **Estimated Time**: 70 minutes **Risk Level**:
🟢 LOW (all changes reversible)

**Next Step**: Execute Action 1 (Consolidate Root Migration Summary)
