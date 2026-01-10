# Archive Directory

**Purpose**: Historical reference only. No canonical truth lives here.

---

## What This Directory Contains

This directory contains archived documents that are no longer actively maintained but are preserved for historical reference, audit trails, and context.

### Subdirectories

**`legacy/`** - Superseded governance documents
- Documents that have been replaced by canonical versions
- Marked with `status: legacy` frontmatter
- Include `superseded_by` reference to current canonical doc

**`planning/`** - Historical planning documents
- Old migration plans, implementation strategies
- Superseded by current system documentation
- Kept for decision history and audit trail

**`analysis/`** - Orphan analysis documents
- Tool comparisons, requirement diffs, one-off analyses
- Not part of ongoing documentation structure
- Kept for context and decision rationale

---

## Important Rules

### ❌ DO NOT Use for Current Work
- This is NOT a working directory
- All content is historical/reference only
- Do not link to archived docs in active documentation

### ✅ What This Directory Is For
- Historical reference
- Audit trails
- Understanding past decisions
- Context for "why did we do X?"

### 🔒 Archive Policy
- Files here are read-only (no updates except metadata)
- All archived files must have frontmatter:
  ```yaml
  status: archived|legacy
  reason: [why archived]
  archived_date: YYYY-MM-DD
  original_location: [path]
  superseded_by: [canonical doc if applicable]
  ```

---

## AI Context Exclusion

This directory is excluded from Cursor AI context via `.cursorignore` to:
- Reduce noise in AI suggestions
- Prevent AI from learning obsolete patterns
- Focus AI on current canonical documentation

**Configuration**: `.cursorignore` includes:
```
.cursor/archive/**
```

---

## Finding Current Documentation

**Instead of using archived docs, see**:
- **Public docs**: `content/` (Nextra site)
- **Internal docs**: `docs/` (engineering documentation)
- **Governance**: `docs/_system/` (system governance)
- **Sealed docs**: `content/governance/sealed/` (immutable foundation)

---

**Created**: 2026-01-10
**Authority**: Documentation Cleanup Phase 3, Batch 4
