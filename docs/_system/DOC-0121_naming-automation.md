---
doc_type: STANDARD
status: active
owner: documentation-governance
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [documentation, automation, naming, governance]
---

# Documentation Naming Automation

**Date**: 2026-01-10 **Status**: ✅ **ACTIVE** **Purpose**: Automated naming
convention enforcement and fixing

---

## Overview

Documentation naming is now **automated** with auto-fix capabilities. Instead of
manual renaming, the system automatically fixes naming violations before
validation.

---

## Automated Naming Fix

### How It Works

1. **Pre-Commit Hook**: Automatically runs before every commit
2. **Detection**: Finds files with invalid naming patterns
3. **Auto-Fix**: Renames files to DOC-XXXX format
4. **Reference Updates**: Updates all internal links automatically
5. **Validation**: Verifies fixes before allowing commit

### Naming Format

**Preferred Format**: `DOC-XXXX_descriptive-name.md`

- `DOC-XXXX`: Sequential 4-digit number (auto-generated)
- `descriptive-name`: Lowercase, hyphenated, alphanumeric only
- Extension: `.md` or `.mdx`

**Example**:

- `API_AUTOGENERATION_STRATEGY.md` → `DOC-0115_api-autogeneration-strategy.md`

---

## Commands

### Auto-Fix Naming

```bash
# Auto-fix all naming violations
pnpm fix:docs:naming

# Or use validation with auto-fix
pnpm validate:docs:naming:fix
```

### Validate Only

```bash
# Check naming without fixing
pnpm validate:docs:naming
```

---

## Pre-Commit Integration

The pre-commit hook automatically:

1. ✅ Runs auto-fix on all files
2. ✅ Validates naming compliance
3. ✅ Blocks commit if violations remain
4. ✅ Updates all internal references

**No manual intervention required** - naming is enforced automatically.

---

## Auto-Fix Process

### Step 1: Detection

Finds files that don't match naming patterns:

- Missing DOC-XXXX prefix
- Invalid characters
- Wrong format

### Step 2: Generation

- Finds highest existing DOC number
- Generates next sequential number
- Creates sanitized descriptive name

### Step 3: Renaming

- Uses `git mv` to preserve history
- Falls back to regular rename if not in git
- Handles conflicts (skips if target exists)

### Step 4: Reference Updates

- Scans all markdown files
- Updates links to renamed files
- Updates direct references
- Preserves link text

---

## Examples

### Before Auto-Fix

```
docs/api/API_AUTOGENERATION_STRATEGY.md
docs/reference/TURBOPACK_QUICK_REFERENCE.md
```

### After Auto-Fix

```
docs/api/DOC-0115_api-autogeneration-strategy.md
docs/reference/DOC-0119_turbopack-quick-reference.md
```

### Reference Updates

**Before**:

```markdown
See [API Strategy](./api/API_AUTOGENERATION_STRATEGY.md)
```

**After**:

```markdown
See [API Strategy](./api/DOC-0115_api-autogeneration-strategy.md)
```

---

## Configuration

### Excluded Directories

Auto-fix skips:

- `content/` (Nextra routing files)
- `docs/migrations/` (historical)
- `docs/changelog/` (historical)
- Root exceptions (README.md, etc.)

### Naming Rules

1. **Lowercase**: All descriptive names converted to lowercase
2. **Hyphenated**: Spaces/underscores → hyphens
3. **Alphanumeric**: Special characters removed
4. **Length Limit**: Max 50 characters for descriptive part
5. **Sequential IDs**: DOC numbers assigned sequentially

---

## Manual Override

If you need to manually assign a DOC number:

1. Rename file manually: `DOC-XXXX_your-name.md`
2. Run validation: `pnpm validate:docs:naming`
3. System will use your assigned number

---

## Troubleshooting

### Auto-Fix Not Running

```bash
# Check pre-commit hook
cat .husky/pre-commit

# Run manually
pnpm fix:docs:naming
```

### Conflicts

If target file exists:

- Auto-fix skips the file
- Manual intervention required
- Check for duplicate content

### Reference Updates Failed

```bash
# Manually update references
grep -r "old-filename" docs/
# Update links manually
```

---

## Benefits

### Before Automation

- ❌ Manual renaming required
- ❌ Manual reference updates
- ❌ Easy to miss violations
- ❌ Inconsistent naming

### After Automation

- ✅ Automatic renaming
- ✅ Automatic reference updates
- ✅ Pre-commit enforcement
- ✅ Consistent naming always

---

## Status

**Automation**: ✅ **ACTIVE** **Pre-Commit**: ✅ **ENABLED** **Auto-Fix**: ✅
**WORKING**

All documentation naming is now automated. No manual intervention required.

---

**Last Updated**: 2026-01-10 **Next Review**: As needed
