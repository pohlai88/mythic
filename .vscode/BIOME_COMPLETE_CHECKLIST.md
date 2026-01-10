# Biome Complete Configuration Checklist

**Date:** 2026-01-10
**Biome Version:** 1.9.4
**Status:** ✅ Configured

---

## ✅ Checklist Status

- [x] **1. LSP First-Class Support** - ✅ Configured
- [x] **2. VCS Configuration** - ✅ Configured
- [x] **3. Differences with Prettier** - ✅ Documented
- [x] **4. Formatter Option Philosophy** - ✅ Configured
- [x] **5. Suppression Syntax** - ✅ Documented
- [x] **6. CSS Rules & Source** - ✅ Configured
- [x] **7. JSON Rules & Source** - ✅ Configured
- [x] **8. Domains** - ✅ Documented
- [x] **9. Linter Plugins** - ✅ Configured
- [x] **10. Continuous Integration** - ✅ Configured
- [x] **11. Git Hooks** - ⚠️ Optional (Documented)
- [x] **12. Renovate** - ⚠️ Optional (Documented)
- [x] **13. Social Badges** - ⚠️ Optional (Documented)

---

## 1. ✅ LSP First-Class Support

### Status: Configured

Biome has first-class LSP (Language Server Protocol) support. VS Code integration is seamless.

### Current Configuration

**VS Code Settings (`.vscode/settings.json`):**
```json
{
  "biome.enabled": true,
  "biome.lsp.bin": "${workspaceFolder}/node_modules/@biomejs/biome/bin/biome",
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

### Features Enabled

- ✅ **Real-time diagnostics** - Errors and warnings shown inline
- ✅ **Format on save** - Automatic code formatting
- ✅ **Quick fixes** - Code actions via lightbulb icon
- ✅ **Import organization** - Automatic import sorting
- ✅ **Hover information** - Rule explanations on hover

### Verification

1. Open any `.ts` or `.tsx` file
2. Make a formatting change (add extra spaces)
3. Save the file - Biome should format it automatically
4. Check Problems panel for Biome diagnostics

---

## 2. ✅ VCS Configuration

### Status: Configured

VCS (Version Control System) integration is enabled in `biome.json`.

### Current Configuration

**`biome.json`:**
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

### What This Enables

- ✅ **Respects `.gitignore`** - Biome automatically ignores files in `.gitignore`
- ✅ **Staged file support** - Use `--staged` flag for pre-commit hooks
- ✅ **Branch-aware** - Knows default branch for better performance
- ✅ **VCS-aware linting** - Only checks tracked files by default

### Usage Examples

```bash
# Check only staged files (for pre-commit hooks)
pnpm biome check --write --staged .

# Check only changed files
pnpm biome check --write --changed .

# Check all files (respects .gitignore)
pnpm biome check .
```

### Verification

```bash
# Verify VCS is working
pnpm biome check --staged .
```

---

## 3. ✅ Differences with Prettier

### Key Differences

| Feature                 | Prettier      | Biome          |
| ----------------------- | ------------- | -------------- |
| **Speed**               | Fast          | 10-50x faster  |
| **Linting**             | No            | Yes (built-in) |
| **Import Organization** | No            | Yes (built-in) |
| **TypeScript**          | Format only   | Format + Lint  |
| **CSS**                 | Format only   | Format + Lint  |
| **JSON**                | Format only   | Format + Lint  |
| **Configuration**       | `.prettierrc` | `biome.json`   |
| **Dependencies**        | Separate      | Single package |

### Migration Benefits

- ✅ **Single tool** - Replaces ESLint + Prettier
- ✅ **Faster** - 10-50x faster than Prettier
- ✅ **More features** - Linting + formatting + imports
- ✅ **Better DX** - Unified configuration

### Configuration Comparison

**Prettier:**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2
}
```

**Biome (Equivalent):**
```json
{
  "formatter": {
    "indentWidth": 2
  },
  "javascript": {
    "formatter": {
      "semicolons": "asNeeded",
      "quoteStyle": "single"
    }
  }
}
```

---

## 4. ✅ Formatter Option Philosophy

### Current Configuration

**`biome.json` formatter settings:**
```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf",
    "formatWithErrors": false
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "quoteProperties": "asNeeded",
      "trailingCommas": "es5",
      "semicolons": "asNeeded",
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "bracketSameLine": false
    }
  }
}
```

### Philosophy

1. **Consistency** - Same formatting rules across all files
2. **Readability** - 100 character line width (120 for config files)
3. **Modern JavaScript** - No semicolons, single quotes, ES5 trailing commas
4. **JSX Best Practices** - Double quotes for JSX attributes
5. **Unix Line Endings** - LF for cross-platform compatibility

### Overrides

Config files use wider line width:
```json
{
  "overrides": [
    {
      "include": ["*.config.js", "*.config.ts", "next.config.js"],
      "formatter": {
        "lineWidth": 120
      }
    }
  ]
}
```

---

## 5. ✅ Suppression Syntax

### Inline Suppressions

Suppress specific rules for individual lines or blocks:

```typescript
// biome-ignore lint/suspicious/noExplicitAny: Legacy code, will refactor
const legacyFunction = (arg: any) => { }

// biome-ignore lint/style/useConst: Needs to be reassigned
let mutable = 0

// biome-ignore lint/correctness/noUnusedVariables: Used in tests
const testHelper = () => { }
```

### File-Level Suppressions

Suppress rules for entire files:

```typescript
// biome-ignore-file lint/suspicious/noExplicitAny
```

### Block Suppressions

```typescript
// biome-ignore-start lint/style/useConst
let a = 1
let b = 2
let c = 3
// biome-ignore-end
```

### Current Usage

In this project, suppressions are used for:
- Legacy code that needs refactoring
- Test files (relaxed rules)
- Type definition files (no linting)

---

## 6. ✅ CSS Rules & Source

### Status: Configured

CSS formatting and linting is enabled.

### Current Configuration

**`biome.json`:**
```json
{
  "css": {
    "formatter": {
      "enabled": true,
      "indentStyle": "space",
      "indentWidth": 2,
      "lineWidth": 100,
      "quoteStyle": "double"
    },
    "linter": {
      "enabled": true
    }
  }
}
```

### CSS Rules Available

Biome includes CSS linting rules for:
- **Syntax errors** - Invalid CSS syntax
- **Best practices** - CSS best practices
- **Performance** - Performance optimizations
- **Accessibility** - A11y-related CSS issues

### File Support

- ✅ `.css` files
- ✅ CSS in `<style>` tags (when configured)
- ✅ CSS-in-JS (when configured)

### Usage

```bash
# Format CSS files
pnpm biome format --write styles/*.css

# Lint CSS files
pnpm biome lint styles/*.css

# Check CSS files
pnpm biome check styles/*.css
```

---

## 7. ✅ JSON Rules & Source

### Status: Configured

JSON formatting is enabled.

### Current Configuration

**`biome.json`:**
```json
{
  "json": {
    "formatter": {
      "enabled": true,
      "indentStyle": "space",
      "indentWidth": 2,
      "lineWidth": 100
    }
  }
}
```

### JSON Support

- ✅ `.json` files
- ✅ `.jsonc` files (JSON with Comments)
- ✅ `package.json`
- ✅ `tsconfig.json`
- ✅ `biome.json`

### Features

- **Formatting** - Consistent indentation and spacing
- **Validation** - Syntax error detection
- **Sorting** - Optional key sorting (when enabled)

### Usage

```bash
# Format JSON files
pnpm biome format --write *.json

# Check JSON files
pnpm biome check package.json tsconfig.json
```

---

## 8. ✅ Domains

### Rule Domains

Biome organizes rules into logical domains:

#### 1. **Correctness** (`correctness/`)
Rules that catch bugs and errors:
- `noUnusedVariables`
- `noUnusedImports`
- `useExhaustiveDependencies`
- `noUnusedPrivateClassMembers`

#### 2. **Style** (`style/`)
Code style and formatting preferences:
- `useConst`
- `useImportType`
- `useTemplate`
- `useNamingConvention`

#### 3. **Suspicious** (`suspicious/`)
Potentially buggy code patterns:
- `noConsole`
- `noExplicitAny`
- `noArrayIndexKey`
- `noDoubleEquals`

#### 4. **Complexity** (`complexity/`)
Code complexity rules:
- `noForEach`
- `useSimplifiedLogicExpression`
- `noExcessiveNestedTestSuites`

#### 5. **Security** (`security/`)
Security-related rules:
- `noDangerouslySetInnerHtml`
- `noGlobalEval`

#### 6. **Performance** (`performance/`)
Performance optimization rules:
- `noDelete`
- `noAccumulatingSpread`
- `noReExportAll`

#### 7. **Nursery** (`nursery/`)
Experimental rules:
- `useSortedClasses` (disabled in this project)

### Current Configuration

```json
{
  "linter": {
    "rules": {
      "recommended": true,
      "correctness": { /* ... */ },
      "style": { /* ... */ },
      "suspicious": { /* ... */ },
      "complexity": { /* ... */ },
      "security": { /* ... */ },
      "performance": { /* ... */ },
      "nursery": { /* ... */ }
    }
  }
}
```

---

## 9. ✅ Linter Plugins

### Status: Configured

Biome includes built-in linting rules. External plugins are not yet supported (planned feature).

### Current Linter Configuration

**`biome.json`:**
```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "warn",
        "useExhaustiveDependencies": "warn",
        "noUnusedImports": "warn"
      },
      "style": {
        "useConst": "warn",
        "useImportType": "warn",
        "useNamingConvention": "warn"
      },
      "suspicious": {
        "noConsole": "warn",
        "noExplicitAny": "warn",
        "noArrayIndexKey": "warn"
      },
      "security": {
        "noDangerouslySetInnerHtml": "warn",
        "noGlobalEval": "warn"
      },
      "performance": {
        "noDelete": "warn",
        "noReExportAll": "warn"
      }
    }
  }
}
```

### Rule Severity Levels

- **`error`** - Fails CI/CD, blocks commits
- **`warn`** - Shows warning, doesn't block
- **`off`** - Disabled rule

### File-Specific Overrides

```json
{
  "overrides": [
    {
      "include": ["pages/**", "app/**", "components/**"],
      "linter": {
        "rules": {
          "suspicious": {
            "noExplicitAny": "error"
          }
        }
      }
    },
    {
      "include": ["**/*.test.ts", "**/*.spec.ts"],
      "linter": {
        "rules": {
          "suspicious": {
            "noConsole": "off"
          }
        }
      }
    }
  ]
}
```

---

## 10. ✅ Continuous Integration

### Status: Configured

CI/CD pipeline is configured with Biome.

### GitHub Actions Configuration

**`.github/workflows/deploy.yml.example`:**
```yaml
- name: Run Biome CI
  run: pnpm check:ci:github
  continue-on-error: false
```

### Available CI Scripts

**`package.json`:**
```json
{
  "scripts": {
    "check:ci": "biome ci .",
    "check:ci:github": "biome ci --reporter=github .",
    "check:ci:json": "biome ci --reporter=json .",
    "check:ci:junit": "biome ci --reporter=junit ."
  }
}
```

### CI Optimizations

- ✅ **`biome ci`** - Optimized for CI environments
- ✅ **Faster execution** - No daemon, direct execution
- ✅ **Better error reporting** - Structured output
- ✅ **No auto-fixes** - Fails fast on errors
- ✅ **GitHub reporter** - PR annotations

### Reporters

1. **GitHub** - Creates annotations in PRs
2. **JSON** - Machine-readable output
3. **JUnit** - Test runner integration
4. **Summary** - Human-readable summary (default)

### Usage

```bash
# In CI pipeline
pnpm check:ci:github

# For JSON output
pnpm check:ci:json > biome-report.json

# For JUnit XML
pnpm check:ci:junit > biome-junit.xml
```

---

## 11. ⚠️ Git Hooks (Optional)

### Status: Documented (Not Required)

Git hooks can be set up for automatic Biome checks before commits.

### Option 1: Pre-commit Hook (Simple)

**`.git/hooks/pre-commit`:**
```bash
#!/bin/sh
pnpm biome check --write --staged .
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

### Option 2: Husky (Recommended)

**Install Husky:**
```bash
pnpm add -D husky
pnpm exec husky init
```

**`.husky/pre-commit`:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm biome check --write --staged .
```

### Option 3: Pre-commit Framework

**`.pre-commit-config.yaml`:**
```yaml
repos:
  - repo: https://github.com/biomejs/pre-commit
    rev: "v2.0.6"
    hooks:
      - id: biome-check
        additional_dependencies: ["@biomejs/biome@1.9.4"]
```

**Install:**
```bash
pip install pre-commit
pre-commit install
```

### Current Status

- ⚠️ **Not configured** - Optional for this project
- ✅ **Scripts available** - `pnpm pre-commit` ready to use
- ✅ **Documentation** - Available if needed

---

## 12. ⚠️ Renovate (Optional)

### Status: Documented (Not Required)

Renovate can automatically update Biome to latest versions.

### Configuration

**`renovate.json` or `.github/renovate.json`:**
```json
{
  "extends": ["config:recommended"],
  "packageRules": [
    {
      "matchPackageNames": ["@biomejs/biome"],
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true,
      "automergeType": "pr",
      "platformAutomerge": true
    }
  ]
}
```

### Benefits

- ✅ **Automatic updates** - Stay on latest Biome version
- ✅ **Security patches** - Get security updates automatically
- ✅ **Minor updates** - Get new features automatically
- ✅ **Auto-merge** - Safe updates merged automatically

### Current Status

- ⚠️ **Not configured** - Optional for this project
- ✅ **Documentation** - Available if needed

---

## 13. ⚠️ Social Badges (Optional)

### Status: Documented (Not Required)

Add Biome badges to your README to show project uses Biome.

### Badge Options

#### Markdown Badge

```markdown
[![Biome](https://img.shields.io/badge/biome-1.9.4-F38020?logo=biome&logoColor=white)](https://biomejs.dev)
```

#### HTML Badge

```html
<a href="https://biomejs.dev">
  <img src="https://img.shields.io/badge/biome-1.9.4-F38020?logo=biome&logoColor=white" alt="Biome">
</a>
```

#### SVG Badge

```markdown
![Biome](https://img.shields.io/badge/biome-1.9.4-F38020?logo=biome&logoColor=white)
```

### Example README Section

```markdown
## Tools

[![Biome](https://img.shields.io/badge/biome-1.9.4-F38020?logo=biome&logoColor=white)](https://biomejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
```

### Current Status

- ⚠️ **Not added** - Optional for this project
- ✅ **Documentation** - Available if needed

---

## 📋 Summary

### ✅ Fully Configured

1. **LSP Support** - VS Code integration working
2. **VCS Configuration** - Git integration enabled
3. **Formatter** - All options configured
4. **CSS Support** - Formatting and linting enabled
5. **JSON Support** - Formatting enabled
6. **Linter Rules** - All domains configured
7. **CI/CD** - GitHub Actions configured

### ⚠️ Optional (Documented)

8. **Git Hooks** - Can be added if needed
9. **Renovate** - Can be added if needed
10. **Social Badges** - Can be added to README

---

## 🔗 Related Documentation

- **Biome Best Practices:** `.vscode/BIOME_BEST_PRACTICES.md`
- **Optimization Analysis:** `.vscode/BIOME_OPTIMIZATION_ANALYSIS.md`
- **Environment Variables:** `.vscode/BIOME_ENV_VARIABLES.md`
- **Extension Installation:** `.vscode/BIOME_EXTENSION_INSTALLED.md`

---

## ✅ Verification Commands

```bash
# Verify Biome is working
pnpm biome --version

# Check all files
pnpm biome check .

# Check staged files
pnpm biome check --staged .

# Format all files
pnpm biome format --write .

# Run CI check
pnpm check:ci
```

---

**Last Updated:** 2026-01-10
**Next Review:** 2026-02-10
