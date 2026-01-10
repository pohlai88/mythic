# Rule Configuration Governance

## Quick Reference

### Allowed alwaysApply: true Rules (ONLY 3)

1. `000_RULE_GOVERNANCE.mdc` - Configuration control
2. `000_master-cursor-defaults.mdc` - Core behavior  
3. `001_core-safety.mdc` - Safety guardrails

**All other rules MUST have `alwaysApply: false`**

---

## Commands

```bash
# Validate all rule configurations
pnpm validate:rules

# Auto-fix common violations
pnpm validate:rules:fix

# Strict validation (fails on warnings)
pnpm validate:rules:strict
```

---

## Rule Creation Template

```yaml
---
description: "Clear description of what this rule does"
globs: "*.ts,*.tsx"
alwaysApply: false
priority: 50
---

# Rule Name

**Purpose**: What this rule accomplishes
**Scope**: Which files/scenarios it applies to

## Rules

1. Rule content here
```

---

## Common Issues & Fixes

### Issue: Too many alwaysApply: true rules

```bash
# Auto-fix
pnpm validate:rules:fix

# Manually: Edit rule file and change to:
alwaysApply: false
```

### Issue: Missing glob patterns

```bash
# Add to frontmatter:
globs: "*.ext"
```

### Issue: Cursor hanging/slow

```bash
# Check rule count
pnpm validate:rules

# Should see:
# Always loaded: 3 (target)
# Conditional: N (remaining rules)
```

---

## Pre-commit Hook

Rules are validated automatically on every commit:

- ✅ Validates alwaysApply usage
- ✅ Checks glob patterns  
- ✅ Enforces naming convention
- ❌ Blocks commit if violations found
- 🔧 Suggests fixes

---

## Audit Log

Location: `.cursor/rule-audit.log`

Tracks all rule changes:
- Auto-fixes applied
- Validation results
- Configuration changes

---

**Full documentation**: @.cursor/rules/000_RULE_GOVERNANCE.mdc
