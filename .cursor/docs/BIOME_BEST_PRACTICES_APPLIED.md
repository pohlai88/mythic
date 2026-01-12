# Biome Best Practices Implementation

**Date:** 2026-01-10
**Status:** ✅ Complete
**Version:** Biome 1.9.4

---

## 🎯 Overview

This document outlines the Biome best practices applied to the monorepo, optimizing the configuration for TypeScript, React, and Next.js development.

---

## ✅ Optimizations Applied

### 1. **Consolidated Override Patterns**

**Before:** Multiple overlapping overrides with redundant patterns
**After:** Consolidated, well-organized overrides grouped by purpose

**Improvements:**
- ✅ Merged duplicate patterns (e.g., `apps/**/app/**` and `app/**`)
- ✅ Added monorepo-specific patterns (`packages/**/src/**`)
- ✅ Better organization by file type and purpose
- ✅ Reduced configuration complexity

### 2. **Enhanced Monorepo Support**

**Patterns Added:**
```json
{
  "include": [
    "apps/**/src/lib/api-schemas/**",
    "apps/**/src/lib/zod/**",
    "packages/**/src/lib/api-schemas/**",
    "packages/**/src/lib/zod/**"
  ]
}
```

**Benefits:**
- ✅ Consistent linting across all packages
- ✅ Proper handling of shared code patterns
- ✅ Better type safety enforcement in monorepo structure

### 3. **Improved Test File Handling**

**Enhanced Patterns:**
```json
{
  "include": [
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "**/__tests__/**",
    "**/__mocks__/**"
  ]
}
```

**Benefits:**
- ✅ Covers all test file naming conventions
- ✅ Includes test directories (`__tests__`, `__mocks__`)
- ✅ Relaxed rules for test files (console allowed, exhaustive deps off)

### 4. **Better Configuration File Handling**

**Enhanced Patterns:**
```json
{
  "include": [
    "*.config.js",
    "*.config.ts",
    "*.config.mjs",
    "next.config.*",
    "tailwind.config.*",
    "turbo.json"
  ]
}
```

**Benefits:**
- ✅ Wider line width (120) for config files
- ✅ More lenient `any` type warnings
- ✅ Covers all config file extensions

### 5. **Optimized Security Rules**

**Stricter Rules for:**
- Server actions (`**/actions/**`, `**/server-actions/**`)
- API routes (`apps/**/app/api/**`)
- Zod schemas and API schemas

**Benefits:**
- ✅ Error-level enforcement for security-sensitive code
- ✅ Prevents dangerous patterns in critical paths
- ✅ Better type safety in data validation layers

---

## 📋 Configuration Structure

### Core Settings

```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

### Override Categories

1. **Configuration Files** - Wider line width, lenient rules
2. **Environment Files** - Strict type safety, process globals
3. **Schema/Validation Files** - Error-level enforcement
4. **Server Actions/API** - Security-focused rules
5. **UI Components** - Balanced rules for React/Next.js
6. **Test Files** - Relaxed rules for testing
7. **Scripts** - Console allowed
8. **Type Definitions** - Linting disabled
9. **Special Cases** - API routes, boardroom app

---

## 🚀 Performance Optimizations

### File Ignoring

**Optimized Ignore Patterns:**
- Build artifacts (`.next`, `dist`, `build`)
- Dependencies (`node_modules`)
- Cache files (`.turbo`, `*.tsbuildinfo`)
- Generated files (`public/sw.js`, `workbox-*.js`)

**Benefits:**
- ✅ Faster linting/formatting
- ✅ Reduced false positives
- ✅ Better CI/CD performance

### VCS Integration

```json
{
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true,
    "defaultBranch": "main"
  }
}
```

**Benefits:**
- ✅ Respects `.gitignore` patterns
- ✅ Only processes tracked files
- ✅ Faster operations on large repos

---

## 🔧 Integration Points

### 1. **VS Code Integration**

**Status:** ✅ Configured

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

**Features:**
- Format on save
- Auto-fix on save
- Import organization
- Language-specific formatters

### 2. **Pre-commit Hooks**

**Status:** ✅ Configured (`.lintstagedrc.json`)

```json
{
  "*.{ts,tsx}": ["biome check --write"],
  "*.{md,mdx,mdc}": ["markdownlint-cli2 --fix"],
  "*.json": ["biome format --write"]
}
```

**Benefits:**
- ✅ Automatic formatting before commit
- ✅ Fast (only staged files)
- ✅ Prevents unformatted code in repo

### 3. **Turbo Integration**

**Status:** ✅ Configured (`turbo.json`)

```json
{
  "globalDependencies": ["biome.json"]
}
```

**Benefits:**
- ✅ Cache invalidation on config changes
- ✅ Proper dependency tracking
- ✅ Monorepo-aware caching

### 4. **CI/CD Integration**

**Status:** ✅ Configured (`.github/workflows/ci.yml`)

```yaml
- name: Format check
  run: pnpm format:check
```

**Benefits:**
- ✅ Enforces formatting in CI
- ✅ Prevents merge of unformatted code
- ✅ Consistent codebase quality

---

## 📊 Rule Configuration Summary

### Base Rules (Recommended + Custom)

| Category        | Level      | Key Rules                                           |
| --------------- | ---------- | --------------------------------------------------- |
| **Correctness** | Warn       | Unused variables, imports, exhaustive deps          |
| **Style**       | Warn       | Const usage, import types, naming                   |
| **Suspicious**  | Error/Warn | Console (error), explicit any (warn), double equals |
| **Complexity**  | Warn/Off   | Simplified logic, forEach (off)                     |
| **Security**    | Warn       | Dangerous HTML, global eval                         |
| **Performance** | Warn       | Delete, accumulating spread, re-export all          |
| **A11y**        | Warn       | Key events, valid anchors, ARIA props               |

### Override Rules (Stricter)

| Pattern               | Stricter Rules                                             |
| --------------------- | ---------------------------------------------------------- |
| **Schema/Zod files**  | `noExplicitAny: error`, `useImportType: error`             |
| **Server actions**    | `noExplicitAny: error`, security rules: error              |
| **UI components**     | `noExplicitAny: error`, `useExhaustiveDependencies: error` |
| **Environment files** | `noExplicitAny: error`, `useImportType: error`             |

---

## 🎓 Best Practices Applied

### 1. **Monorepo Configuration**

✅ **Centralized Config** - Single `biome.json` at root
✅ **Pattern-Based Overrides** - Monorepo-aware patterns
✅ **Shared Rules** - Consistent across all packages

### 2. **Performance**

✅ **File Ignoring** - Comprehensive ignore patterns
✅ **VCS Integration** - Respects `.gitignore`
✅ **Selective Processing** - Only processes relevant files

### 3. **Developer Experience**

✅ **Auto-formatting** - Format on save enabled
✅ **Auto-fixing** - Fixes issues automatically
✅ **Import Organization** - Auto-organizes imports
✅ **Clear Error Messages** - Helpful diagnostics

### 4. **Type Safety**

✅ **Strict Rules** - Error-level for critical paths
✅ **Type Imports** - Enforces `import type`
✅ **No Explicit Any** - Warns/errors on `any` usage
✅ **Exhaustive Dependencies** - React hooks validation

### 5. **Security**

✅ **Dangerous Patterns** - Blocks `dangerouslySetInnerHTML`
✅ **Global Eval** - Prevents `eval()` usage
✅ **API Routes** - Stricter rules for server code

---

## 📝 Usage Examples

### Format Files

```bash
# Format all files
pnpm biome format --write

# Format specific files
pnpm biome format --write src/**/*.ts
```

### Lint Files

```bash
# Lint all files
pnpm biome lint

# Lint and auto-fix
pnpm biome lint --write
```

### Check Everything

```bash
# Format, lint, and organize imports
pnpm biome check --write

# Check without fixing
pnpm biome check
```

### Monorepo Commands

```bash
# Run across all packages
pnpm check

# Run only on changed files
pnpm check:changed

# Fix issues
pnpm check:fix
```

---

## 🔍 Validation

### Verify Configuration

```bash
# Check config is valid
pnpm biome check biome.json

# Format config file
pnpm biome format --write biome.json
```

### Test Integration

```bash
# Test VS Code integration
# 1. Open any .ts/.tsx file
# 2. Make formatting changes
# 3. Save (Ctrl+S / Cmd+S)
# 4. Should auto-format

# Test pre-commit hook
# 1. Make unformatted changes
# 2. Stage files (git add)
# 3. Commit (git commit)
# 4. Should auto-format before commit
```

---

## 📚 References

- [Biome Documentation](https://biomejs.dev/)
- [Biome Configuration](https://biomejs.dev/reference/configuration/)
- [Biome Rules](https://biomejs.dev/linter/rules/)
- [Monorepo Best Practices](https://biomejs.dev/guides/getting-started/)

---

## ✅ Checklist

- [x] Biome installed (`@biomejs/biome@^1.9.4`)
- [x] Configuration optimized (`biome.json`)
- [x] VS Code integration configured
- [x] Pre-commit hooks configured
- [x] Turbo integration configured
- [x] CI/CD integration configured
- [x] Monorepo patterns added
- [x] Security rules enforced
- [x] Performance optimizations applied
- [x] Documentation created

---

## 🎯 Next Steps

1. **Team Adoption**
   - Share this document with team
   - Ensure VS Code extension installed
   - Run `pnpm check` to verify setup

2. **Gradual Migration** (if migrating from ESLint/Prettier)
   - Keep both tools temporarily
   - Migrate package by package
   - Remove old tools once migration complete

3. **Continuous Improvement**
   - Monitor rule effectiveness
   - Adjust rules based on team feedback
   - Keep Biome updated

---

**Status:** ✅ Production Ready
**Last Updated:** 2026-01-10
**Maintained By:** Development Team
