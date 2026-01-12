---
title: ELITE Verbatim Strategy
description: Prevent configuration drift, ensure exact file contents, eliminate debugging nightmares
status: sealed
layer: L2
document_hash: sha256:TO_BE_COMPUTED
effective_date: 2026-01-11
version: "1.0.0"
sealed_by: Architecture Team
sealed_date: 2026-01-11
---

# ELITE Verbatim Strategy - Avoid Debugging Hell

**Status**: 🔒 **SEALED** - Governance-Grade | **Version**: 1.0.0 | **Last Updated**: 2026-01-11
**Purpose**: Prevent configuration drift, ensure exact file contents, eliminate debugging nightmares
**Layer**: L2 (Operational) - Architecture documentation

---

## Table of Contents

1. [Philosophy](#1-philosophy)
2. [Core Principles](#2-core-principles)
3. [Verbatim File Categories](#3-verbatim-file-categories)
4. [Implementation Strategy](#4-implementation-strategy)
5. [Validation & Enforcement](#5-validation--enforcement)
6. [Debugging Prevention Patterns](#6-debugging-prevention-patterns)
7. [Tooling & Automation](#7-tooling--automation)
8. [Troubleshooting Guide](#8-troubleshooting-guide)

---

## 1. Philosophy

### The Problem: Configuration Drift Hell

**Symptoms**:
- ✅ Works on my machine, fails in CI
- ✅ Build succeeds locally, fails in production
- ✅ TypeScript errors appear randomly
- ✅ Dependencies resolve differently across environments
- ✅ "It was working yesterday" syndrome
- ✅ Hours spent debugging config instead of building features

**Root Cause**: Configuration files drift from canonical versions
- Manual edits without documentation
- Copy-paste errors
- Environment-specific overrides
- Tool version mismatches
- Missing or incorrect file contents

### The Solution: Verbatim Enforcement

**ELITE Verbatim Strategy** = **Exact file contents, validated, enforced, documented**

Every critical configuration file has:
1. ✅ **Canonical Source**: Single source of truth
2. ✅ **Verbatim Template**: Exact contents documented
3. ✅ **Validation Script**: Automated verification
4. ✅ **Pre-commit Enforcement**: Blocks drift before commit
5. ✅ **Documentation**: Why each line exists

---

## 2. Core Principles

### Principle 1: Single Source of Truth (SSOT)

**✅ DO**:
- One canonical version of each config file
- Document exact contents in this guide
- Version control all configs
- Never modify without updating documentation

**❌ DON'T**:
- Create environment-specific variants
- Modify configs "just to test"
- Leave configs undocumented
- Copy configs without tracking source

### Principle 2: Verbatim = Exact Match

**✅ Verbatim Files**:
- Contents must match documentation exactly
- Whitespace, comments, order all matter
- No "equivalent" variations
- No "it should work the same" assumptions

**Example**:
```json
// ✅ CORRECT: Exact match
{
  "version": "20.18.0"
}

// ❌ WRONG: Different format
{
  "version": "20.18.0",
  "comment": "Node version"
}
```

### Principle 3: Validation Before Execution

**✅ DO**:
- Validate configs before builds
- Check file contents in CI/CD
- Fail fast on mismatches
- Provide clear error messages

**❌ DON'T**:
- Assume configs are correct
- Skip validation for "speed"
- Allow silent failures
- Debug after the fact

### Principle 4: Documentation as Code

**✅ DO**:
- Document configs in this guide
- Include exact file contents
- Explain why each setting exists
- Link to tool documentation

**❌ DON'T**:
- Leave configs undocumented
- Assume knowledge is shared
- Document only "non-obvious" parts
- Create separate docs that drift

---

## 3. Verbatim File Categories

### 3.1 Critical Verbatim Files (Must Match Exactly)

These files **MUST** match documented contents verbatim:

#### **Node.js Version Files**

**✅ `.node-version`** - For asdf/nodenv
```
20.18.0
```

**✅ `.nvmrc`** - For nvm
```
20.18.0
```

**Why Verbatim**:
- Node version mismatches cause build failures
- Different versions = different behavior
- CI/CD must match local development

**Validation**:
```bash
# Must match package.json engines.node
# Must match GitHub Actions node-version
```

---

#### **Package Manager Config**

**✅ `.npmrc`** - pnpm Configuration
```
# Enable pre/post scripts for pnpm
# pnpm@8 by default doesn't execute pre/post scripts
# pnpm@9 by default runs pre/post scripts
enable-pre-post-scripts=true
```

**Why Verbatim**:
- Script execution behavior differs by pnpm version
- Missing scripts = silent failures
- Peer dependency resolution varies

**Validation**:
```bash
# Must match package.json packageManager version
# Must enable pre/post scripts for pnpm@8
```

---

#### **Workspace Definition**

**✅ `pnpm-workspace.yaml`** - Workspace Canonical Source
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Why Verbatim**:
- Single source of truth for workspace
- Duplication in package.json creates conflicts
- Wrong paths = missing packages

**Validation**:
```bash
# Must NOT have workspaces field in package.json
# Must match actual directory structure
```

---

#### **TypeScript Base Config**

**✅ `tsconfig.json`** - Root TypeScript Base
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "noEmit": true
  },
  "exclude": ["node_modules", "dist", ".next", ".turbo"]
}
```

**Why Verbatim**:
- Type checking behavior depends on exact settings
- Different targets = different type errors
- Module resolution affects imports

**Validation**:
```bash
# Must compile without errors
# Must match app tsconfig.json extends
```

---

#### **TurboRepo Config**

**✅ `turbo.json`** - Build Pipeline
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "package.json",
    "pnpm-workspace.yaml",
    "tsconfig.json"
  ],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Why Verbatim**:
- Pipeline dependencies affect build order
- Wrong outputs = cache misses
- Global deps = rebuild triggers

**Validation**:
```bash
# Must list only truly global configs (10-15 max)
# Must match actual pipeline tasks
```

---

### 3.2 Conditional Verbatim Files (Context-Dependent)

These files have verbatim templates but may vary by context:

#### **GitHub Actions Workflow**

**✅ `.github/workflows/ci.yml`** - CI Pipeline

**Verbatim Template**:
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

permissions:
  contents: read
  pull-requests: write

jobs:
  build:
    name: Build & Test
    runs-on: ubuntu-latest
    env:
      # Optional: Turbo remote cache credentials (empty if not set)
      TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
      TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 2 # ⭐ ELITE: Shallow clone for Turbo filtering

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8.15.0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
        # ⭐ ELITE: Remote cache enabled (optional, uses job-level env vars)

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Format check
        run: pnpm format:check

      - name: Test
        run: pnpm test
        if: github.event_name == 'pull_request'

      - name: Build summary
        if: always()
        run: pnpm turbo:summary
```

**Why Verbatim**:
- CI failures waste developer time
- Different Node versions = different results
- Missing steps = incomplete validation

**Validation**:
```bash
# Must use exact pnpm version (8.15.0)
# Must use Node 20 (matches .node-version)
# Must use shallow clone (fetch-depth: 2)
```

---

### 3.3 Reference Verbatim Files (Documentation Only)

These files are documented for reference but may evolve:

#### **Biome Config**

**✅ `biome.json`** - Linting & Formatting

**Current Verbatim** (see ROOT_CONFIG_ELITE_MANAGEMENT.md for exact contents):
- Formatter: 2 spaces, 100 char width
- Linter: Enabled
- Ignore: Build artifacts

**Why Documented**:
- Formatting inconsistencies cause merge conflicts
- Linter rules affect code quality
- Team must use same settings

---

## 4. Implementation Strategy

### 4.1 Verbatim File Registry

**Location**: `scripts/verbatim-registry.json`

```json
{
  "files": [
    {
      "path": ".node-version",
      "category": "critical",
      "template": "20.18.0",
      "validation": "must-match-package-json-engines",
      "documentation": "docs/architecture/ELITE_VERBATIM_STRATEGY.md#node-version-files"
    },
    {
      "path": ".nvmrc",
      "category": "critical",
      "template": "20.18.0",
      "validation": "must-match-node-version",
      "documentation": "docs/architecture/ELITE_VERBATIM_STRATEGY.md#node-version-files"
    },
    {
      "path": ".npmrc",
      "category": "critical",
      "template": "enable-pre-post-scripts=true",
      "validation": "must-enable-pre-post-scripts",
      "documentation": "docs/architecture/ELITE_VERBATIM_STRATEGY.md#npmrc"
    },
    {
      "path": "pnpm-workspace.yaml",
      "category": "critical",
      "template": "packages:\n  - \"apps/*\"\n  - \"packages/*\"",
      "validation": "must-not-have-workspaces-in-package-json",
      "documentation": "docs/architecture/ROOT_CONFIG_ELITE_MANAGEMENT.md#pnpm-workspace"
    }
  ]
}
```

### 4.2 Validation Script

**Location**: `scripts/validate-verbatim.ts`

```typescript
#!/usr/bin/env tsx

/**
 * ELITE Verbatim Strategy - Validation Script
 *
 * Validates that critical config files match documented verbatim templates.
 * Fails fast on mismatches to prevent debugging hell.
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import verbatimRegistry from './verbatim-registry.json'

interface ValidationResult {
  file: string
  passed: boolean
  error?: string
}

function validateFile(file: { path: string; template: string }): ValidationResult {
  try {
    const filePath = join(process.cwd(), file.path)
    const actual = readFileSync(filePath, 'utf-8').trim()
    const expected = file.template.trim()

    if (actual !== expected) {
      return {
        file: file.path,
        passed: false,
        error: `Mismatch: Expected exact match with template`
      }
    }

    return { file: file.path, passed: true }
  } catch (error) {
    return {
      file: file.path,
      passed: false,
      error: `File not found or unreadable: ${error}`
    }
  }
}

function main() {
  const criticalFiles = verbatimRegistry.files.filter(f => f.category === 'critical')
  const results = criticalFiles.map(validateFile)
  const failures = results.filter(r => !r.passed)

  if (failures.length > 0) {
    console.error('❌ Verbatim validation failed:\n')
    failures.forEach(f => {
      console.error(`  ${f.file}: ${f.error}`)
    })
    console.error('\n💡 Fix: Update files to match verbatim templates in docs/architecture/ELITE_VERBATIM_STRATEGY.md')
    process.exit(1)
  }

  console.log('✅ All verbatim files validated')
}

main()
```

### 4.3 Pre-commit Hook Integration

**Location**: `.husky/pre-commit`

```bash
#!/usr/bin/env sh

# Validate verbatim config files
echo "Validating verbatim config files..."
pnpm tsx scripts/validate-verbatim.ts

if [ $? -ne 0 ]; then
  echo "❌ Verbatim validation failed"
  echo "Fix config files to match documented templates"
  exit 1
fi

echo "✅ Verbatim validation passed"
```

### 4.4 CI/CD Validation

**Add to `.github/workflows/ci.yml`**:

```yaml
- name: Validate verbatim configs
  run: pnpm tsx scripts/validate-verbatim.ts
```

---

## 5. Validation & Enforcement

### 5.1 Validation Levels

**Level 1: Critical Files (Blocking)**
- `.node-version`, `.nvmrc` - Node version
- `.npmrc` - Package manager config
- `pnpm-workspace.yaml` - Workspace definition
- `tsconfig.json` - TypeScript base config

**Level 2: Important Files (Warning)**
- `turbo.json` - Build pipeline
- `.github/workflows/ci.yml` - CI config
- `biome.json` - Linting config

**Level 3: Reference Files (Documentation)**
- Other configs documented but may evolve

### 5.2 Enforcement Mechanisms

**✅ Pre-commit Hook**:
- Blocks commits with mismatched critical files
- Provides clear error messages
- Links to documentation

**✅ CI/CD Validation**:
- Validates on every PR
- Fails builds on mismatches
- Prevents merge of broken configs

**✅ Developer Tools**:
- VS Code task to validate
- Script to check before push
- Auto-fix where possible

### 5.3 Auto-Fix Strategy

**✅ Safe Auto-Fixes**:
- Whitespace normalization
- Comment formatting
- Line ending conversion

**❌ Manual Review Required**:
- Content changes
- New settings
- Version updates

---

## 6. Debugging Prevention Patterns

### Pattern 1: Version Synchronization

**Problem**: Node version mismatch causes "works on my machine"

**Solution**: Verbatim enforcement
```bash
# ✅ All files must match:
.node-version: 20.18.0
.nvmrc: 20.18.0
package.json engines.node: >=20.0.0
.github/workflows/ci.yml node-version: 20
```

**Validation**:
```typescript
function validateNodeVersion() {
  const nodeVersion = readFileSync('.node-version', 'utf-8').trim()
  const nvmrc = readFileSync('.nvmrc', 'utf-8').trim()
  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))

  if (nodeVersion !== nvmrc) {
    throw new Error('Node version files must match')
  }

  // Check engines.node is compatible
  const enginesNode = packageJson.engines?.node
  if (!enginesNode || !enginesNode.includes('20')) {
    throw new Error('package.json engines.node must include Node 20')
  }
}
```

### Pattern 2: Package Manager Config

**Problem**: pnpm scripts not running, peer dependency issues

**Solution**: Verbatim `.npmrc`
```ini
# Must enable pre/post scripts for pnpm@8
enable-pre-post-scripts=true
```

**Validation**:
```typescript
function validateNpmrc() {
  const npmrc = readFileSync('.npmrc', 'utf-8')
  if (!npmrc.includes('enable-pre-post-scripts=true')) {
    throw new Error('.npmrc must enable pre/post scripts for pnpm@8')
  }
}
```

### Pattern 3: Workspace Definition

**Problem**: Packages not found, workspace conflicts

**Solution**: Single source of truth
```yaml
# ✅ pnpm-workspace.yaml is canonical
# ❌ package.json workspaces field must NOT exist
```

**Validation**:
```typescript
function validateWorkspace() {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))
  if (packageJson.workspaces) {
    throw new Error('package.json must NOT have workspaces field (use pnpm-workspace.yaml)')
  }
}
```

### Pattern 4: TypeScript Config Inheritance

**Problem**: Type errors appear randomly, imports fail

**Solution**: Verbatim base config, documented inheritance
```json
// Root tsconfig.json: Base only, NO references
// App tsconfig.json: Extends root, adds references
```

**Validation**:
```typescript
function validateTsConfig() {
  const rootTsConfig = JSON.parse(readFileSync('tsconfig.json', 'utf-8'))
  if (rootTsConfig.references) {
    throw new Error('Root tsconfig.json must NOT have references (use solution-style)')
  }
}
```

---

## 7. Tooling & Automation

### 7.1 Validation Scripts

**`scripts/validate-verbatim.ts`**:
- Validates all critical verbatim files
- Provides clear error messages
- Exits with code 1 on failure

**`scripts/check-node-version.ts`**:
- Validates Node version consistency
- Checks all version files match
- Validates against package.json

**`scripts/check-workspace.ts`**:
- Validates workspace definition
- Ensures no duplication
- Checks package paths exist

### 7.2 VS Code Tasks

**`.vscode/tasks.json`**:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Validate Verbatim Configs",
      "type": "shell",
      "command": "pnpm tsx scripts/validate-verbatim.ts",
      "problemMatcher": []
    }
  ]
}
```

### 7.3 Package Scripts

**`package.json`**:
```json
{
  "scripts": {
    "validate:verbatim": "tsx scripts/validate-verbatim.ts",
    "validate:node-version": "tsx scripts/check-node-version.ts",
    "validate:workspace": "tsx scripts/check-workspace.ts",
    "validate:all": "pnpm validate:verbatim && pnpm validate:node-version && pnpm validate:workspace"
  }
}
```

---

## 8. Troubleshooting Guide

### Issue: "Node version mismatch"

**Symptoms**:
- Build fails in CI but works locally
- TypeScript errors appear randomly
- Package resolution fails

**Solution**:
```bash
# 1. Check all version files match
cat .node-version .nvmrc package.json | grep -i "20"

# 2. Validate verbatim files
pnpm validate:verbatim

# 3. Update to match canonical version
echo "20.18.0" > .node-version
echo "20.18.0" > .nvmrc
```

### Issue: "pnpm scripts not running"

**Symptoms**:
- Pre-commit hooks don't run
- Post-install scripts skipped
- Lifecycle scripts ignored

**Solution**:
```bash
# 1. Check .npmrc has enable-pre-post-scripts
cat .npmrc | grep enable-pre-post-scripts

# 2. If missing, add verbatim:
echo "enable-pre-post-scripts=true" >> .npmrc

# 3. Validate
pnpm validate:verbatim
```

### Issue: "Workspace packages not found"

**Symptoms**:
- Import errors for workspace packages
- TypeScript can't resolve @mythic/* packages
- Build fails with "module not found"

**Solution**:
```bash
# 1. Check pnpm-workspace.yaml exists and is correct
cat pnpm-workspace.yaml

# 2. Check package.json does NOT have workspaces field
cat package.json | grep -i workspaces

# 3. Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: "TypeScript config errors"

**Symptoms**:
- Type errors in one app but not another
- Import resolution fails
- Build succeeds but type-check fails

**Solution**:
```bash
# 1. Check root tsconfig.json has NO references
cat tsconfig.json | grep references

# 2. Check app tsconfig.json extends root
cat apps/*/tsconfig.json | grep extends

# 3. Validate TypeScript configs
pnpm type-check
```

---

## 9. Success Metrics

### Targets

**✅ Zero Config Drift**:
- All critical files match verbatim templates
- Pre-commit hooks prevent mismatches
- CI/CD validates on every PR

**✅ Fast Debugging**:
- Config issues caught before commit
- Clear error messages point to exact files
- Documentation explains every setting

**✅ Team Confidence**:
- Developers trust configs are correct
- No "works on my machine" issues
- Consistent behavior across environments

### Monitoring

**Track**:
- Number of verbatim validation failures
- Time spent debugging config issues
- Config-related build failures
- Developer feedback on clarity

---

## 10. Implementation Checklist

### Phase 1: Foundation (Week 1)

- [ ] Create verbatim registry (`scripts/verbatim-registry.json`)
- [ ] Implement validation script (`scripts/validate-verbatim.ts`)
- [ ] Document all critical verbatim files
- [ ] Add pre-commit hook validation
- [ ] Test validation on existing files

### Phase 2: Enforcement (Week 2)

- [ ] Add CI/CD validation step
- [ ] Create VS Code tasks
- [ ] Add package.json scripts
- [ ] Document troubleshooting guide
- [ ] Train team on verbatim strategy

### Phase 3: Expansion (Week 3+)

- [ ] Add more files to verbatim registry
- [ ] Implement auto-fix for safe changes
- [ ] Create validation dashboard
- [ ] Monitor success metrics
- [ ] Iterate based on feedback

---

## 11. Related Documentation

- **ROOT_CONFIG_ELITE_MANAGEMENT.md** - Complete root config guide
- **MONOREPO_BEST_PRACTICES.md** - Monorepo patterns
- **TURBOREPO_OPTIMIZATION.md** - Build optimization

---

**Last Updated**: 2026-01-11
**Status**: 🔒 **SEALED** - Governance-Grade - Implementation Complete
**Sealed Date**: 2026-01-11
**Version**: 1.0.0

---

## Document Seal Verification

**Hash**: `sha256:TO_BE_COMPUTED` (run `pnpm tsx scripts/compute-doc-hash.ts docs/architecture/ELITE_VERBATIM_STRATEGY.md` to compute)

**Verification**:
```bash
# Compute document hash
pnpm tsx scripts/compute-doc-hash.ts docs/architecture/ELITE_VERBATIM_STRATEGY.md

# Verify hash matches frontmatter
# Hash must match exactly for document integrity
```

**Amendment Process**: This document is sealed (L2 Operational). Changes require:
1. Architecture team review
2. Update version number
3. Recompute and update hash
4. Update sealed_date
