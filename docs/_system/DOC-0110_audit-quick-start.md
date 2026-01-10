---
doc_type: GUIDE
status: active
owner: documentation-governance
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [documentation, audit, quick-start, DRY]
---

# Documentation Audit Quick Start

**Time Required**: 5 minutes
**Purpose**: Quick guide to running documentation audit and using the registry

---

## Quick Commands

```bash
# Run full documentation audit
pnpm audit:docs

# View registry
cat docs/_system/DOC-0108_documentation-registry.md

# View audit report
cat docs/_system/DOC-0109_audit-report.md
```

---

## What the Audit Does

1. **Scans** all documentation files
2. **Detects** duplicate content clusters
3. **Identifies** DRY violations
4. **Generates** recommendations
5. **Creates** audit report

---

## Understanding Results

### ✅ No Issues
```
✅ No issues detected. Documentation is DRY-compliant.
```

### ⚠️ Issues Found
```
⚠️  Issues detected. Review recommendations above.
```

**Check**:
- Duplicate clusters (consolidate or cross-reference)
- DRY violations (remove duplication)
- Missing cross-references (add links)

---

## Using the Registry

### Finding Documents

1. **By Category**: Check registry sections (Architecture, API, Guides, etc.)
2. **By ID**: Use ID format (ARC-001, API-001, etc.)
3. **By Topic**: Search for topic keywords

### Checking for Duplicates

1. Open registry: `docs/_system/DOC-0108_documentation-registry.md`
2. Check "Duplicates" column
3. Review recommendations

### Adding New Documents

1. **Check Registry First**: Search for similar content
2. **Assign ID**: Use format `CAT-XXX` (e.g., REF-018)
3. **Add Entry**: Update registry immediately
4. **Mark Source of Truth**: Set `source_of_truth: true`

---

## Common Tasks

### Before Creating New Doc

```bash
# 1. Check for similar content
pnpm audit:docs

# 2. Review registry
grep -i "your-topic" docs/_system/DOC-0108_documentation-registry.md

# 3. Check duplicates column
```

### After Creating New Doc

```bash
# 1. Add to registry
# Edit docs/_system/DOC-0108_documentation-registry.md

# 2. Run audit to verify
pnpm audit:docs

# 3. Add cross-references if needed
```

### Consolidating Duplicates

1. **Identify**: Check audit report
2. **Choose Source of Truth**: Pick canonical version
3. **Merge Content**: Combine into source
4. **Update Links**: Fix all references
5. **Delete Duplicate**: Remove redundant file
6. **Update Registry**: Mark as consolidated

---

## Registry Format

```markdown
| ID | File | Purpose | Status | Source of Truth | Duplicates |
|----|------|---------|--------|----------------|------------|
| REF-001 | `path/to/file.md` | Description | ✅ Active | ✅ Yes | None |
```

**Fields**:
- **ID**: Unique identifier (CAT-XXX)
- **File**: Path to document
- **Purpose**: What it covers
- **Status**: Active/Archived/Legacy
- **Source of Truth**: Is this canonical?
- **Duplicates**: Related files (if any)

---

## Best Practices

### ✅ DO

- Check registry before creating new docs
- Run audit before major changes
- Update registry immediately after changes
- Add cross-references for related docs
- Mark source of truth clearly

### ❌ DON'T

- Create docs without checking registry
- Ignore duplicate warnings
- Skip cross-references
- Leave duplicates unaddressed
- Forget to update registry

---

## Troubleshooting

### Audit Script Fails

```bash
# Check if glob is installed
pnpm add -D glob

# Check if file paths are correct
ls docs/**/*.md
```

### Registry Out of Sync

```bash
# Re-run audit
pnpm audit:docs

# Manually update registry
# Edit docs/_system/DOC-0108_documentation-registry.md
```

### Duplicates Not Detected

- Check file paths in script
- Verify exclude patterns
- Review similarity thresholds

---

## Next Steps

1. ✅ Run initial audit: `pnpm audit:docs`
2. ⏭️ Review findings in audit report
3. ⏭️ Address high-priority duplicates
4. ⏭️ Add missing cross-references
5. ⏭️ Update registry

---

**See Also**:
- [Documentation Registry](./DOC-0108_documentation-registry.md) - Complete registry
- [Audit Report](./DOC-0109_audit-report.md) - Detailed findings
- [Documentation Strategy](./DOC-0102_documentation-organization-strategy.md) - Organization strategy
