# Zod Biome Integration Guide

## 🎯 Overview

This guide explains how Biome is integrated with Zod mandatory enforcement to catch violations at development time.

---

## 🔧 Biome Configuration

### Current Setup

Biome is configured in `biome.json` with:

1. **General Rules**: Applied to all files
2. **Schema-Specific Overrides**: Stricter rules for `src/lib/api-schemas/**` and `src/lib/zod/**`

### Schema File Overrides

```json
{
  "include": ["src/lib/api-schemas/**", "src/lib/zod/**"],
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "error"
      },
      "correctness": {
        "useExhaustiveDependencies": "error"
      },
      "style": {
        "useImportType": "error"
      }
    }
  }
}
```

---

## 🚀 Usage

### Basic Commands

```bash
# Run Biome check (catches Zod violations)
pnpm check

# Auto-fix Biome issues
pnpm check:fix

# Check staged files only
pnpm check:staged

# CI/CD check
pnpm check:ci
```

### Zod-Specific Validation

```bash
# Run custom Zod validation (includes Biome check)
pnpm validate:zod

# Combined: Biome + Zod validation
pnpm zod:validate
```

### Migration

```bash
# Migrate imports from 'zod' to 'zod/v4'
pnpm migrate:zod-imports

# Or use alias
pnpm zod:migrate
```

---

## 🔍 What Biome Catches

### 1. Import Violations

**Catches**: Using `'zod'` instead of `'zod/v4'`

```typescript
// ❌ Biome Error
import { z } from 'zod'

// ✅ Correct
import { z } from 'zod/v4'
```

**Biome Rule**: `style.useImportType` (enforced for schema files)

### 2. Type Safety Violations

**Catches**: Missing type inference, explicit `any`

```typescript
// ❌ Biome Error
const schema = z.object({ name: z.string() })
type User = { name: string } // Manual type

// ✅ Correct
const schema = z.object({ name: z.string() })
type User = z.infer<typeof schema>
```

**Biome Rule**: `suspicious.noExplicitAny` (error level)

### 3. Code Style Violations

**Catches**: Inconsistent formatting, missing imports

**Biome Rules**: All style rules apply

---

## 📋 Validation Workflow

### Development Workflow

1. **Write Code**: Create/update Zod schemas
2. **Run Biome**: `pnpm check`
3. **Auto-fix**: `pnpm check:fix` (if needed)
4. **Validate Zod**: `pnpm validate:zod`
5. **Commit**: Only if all checks pass

### Pre-commit Workflow

```bash
# In .husky/pre-commit or similar
pnpm check --staged
pnpm validate:zod
```

### CI/CD Workflow

```yaml
# Example GitHub Actions
- name: Biome Check
  run: pnpm check:ci

- name: Zod Validation
  run: pnpm validate:zod
```

---

## 🛠️ Customizing Biome Rules

### Add Zod-Specific Rules

Edit `biome.json`:

```json
{
  "overrides": [
    {
      "include": ["src/lib/api-schemas/**"],
      "linter": {
        "rules": {
          "style": {
            "useImportType": "error",
            "useNamingConvention": {
              "level": "error",
              "options": {
                "strictCase": false,
                "conventions": [
                  {
                    "selector": {
                      "kind": "variable",
                      "match": true
                    },
                    "formats": ["PascalCase", "camelCase"]
                  }
                ]
              }
            }
          }
        }
      }
    }
  ]
}
```

### Disable Rules (if needed)

```json
{
  "overrides": [
    {
      "include": ["**/*.test.ts"],
      "linter": {
        "rules": {
          "style": {
            "useImportType": "off"
          }
        }
      }
    }
  ]
}
```

---

## 🔗 Integration with Validation Script

The `validate-zod-schemas.ts` script integrates with Biome:

1. **Runs Biome First**: Checks for import violations, type issues
2. **Custom Validation**: Checks patterns Biome cannot detect
3. **Combined Report**: Shows both Biome and custom validation results

### Example Output

```
🔍 Validating Zod schemas with Biome integration...

📋 Step 1: Running Biome check...
✅ Biome check passed

📋 Step 2: Running custom Zod validation...
📊 Validated 45 files

📄 src/lib/api-schemas/index.ts
  ⚠️  Warnings:
    - SHOULD use .safeParse() instead of .parse()

📊 Validation Summary:
   Files with issues: 1
   Total errors: 0
   Total warnings: 1
   Biome check: ✅ Passed
============================================================

⚠️  Validation passed with warnings.
```

---

## 🎯 Best Practices

### 1. Run Biome Before Committing

Always run `pnpm check` before committing changes.

### 2. Use Auto-fix When Possible

```bash
pnpm check:fix
```

### 3. Fix Biome Errors First

Biome errors are usually easier to fix than custom validation errors.

### 4. Check Staged Files

```bash
pnpm check:staged
```

Only checks files you're committing.

### 5. Use CI/CD Integration

Add Biome checks to your CI/CD pipeline for automated validation.

---

## 🐛 Troubleshooting

### Biome Not Catching Violations

**Issue**: Biome not detecting Zod import violations

**Solution**:
1. Check `biome.json` includes schema files
2. Verify override rules are correct
3. Run `pnpm check` with verbose output

### False Positives

**Issue**: Biome flags correct code

**Solution**:
1. Review Biome rule configuration
2. Add exceptions in `biome.json` overrides
3. Use inline comments to disable specific rules

### Performance Issues

**Issue**: Biome check is slow

**Solution**:
1. Use `--staged` for staged files only
2. Use `--changed` for changed files only
3. Exclude large directories in `biome.json`

---

## 📚 Related Documentation

- [Biome Documentation](https://biomejs.dev/)
- [Zod Mandatory Enforcement Strategy](./ZOD_MANDATORY_ENFORCEMENT_STRATEGY.md)
- [Cursor Rules](./.cursor/rules/zod-mandatory-enforcement.mdc)
- [Validation Script](./scripts/validate-zod-schemas.ts)

---

**Last Updated**: 2024-12-19
**Biome Version**: 1.9.4
**Integration Status**: Active
