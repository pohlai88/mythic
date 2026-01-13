# Root Config Governance - Cursor Rule Implementation

**Date**: 2026-01-11 **Status**: ✅ **RULE CREATED - READY FOR ENFORCEMENT**

---

## Executive Summary

Created Cursor rule to enforce Root Configuration Elite Management Guide
governance principles.

**Rule File**: `.cursor/rules/015_root-config-governance.mdc` **Priority**: 15
**Glob Patterns**: `package.json`, `pnpm-workspace.yaml`, `turbo.json`,
`tsconfig.json`, `next.config.*`, `tailwind.config.*`, `*.mjs`, `*.ts`,
`apps/**/next.config.*`, `apps/**/tsconfig.json`

---

## ✅ Three Governing Rules Enforced

### Rule 1: Root is Minimal and Monorepo-Only

**Enforcement**:

- ✅ REJECT `next.config.*` at root (must be in `apps/*/`)
- ✅ REJECT app-specific configs at root
- ✅ VERIFY maximum 10-15 root configs
- ✅ CHECK config is truly monorepo-level

---

### Rule 2: All Shared Config Lives in `packages/Monorepo/Config/*`

**Enforcement**:

- ✅ VERIFY shared configs are in `packages/Monorepo/Config/*`
- ✅ CHECK TurboRepo tracks `packages/Monorepo/Config/**/*.json` in globalDependencies
- ✅ REJECT duplicate configs across apps
- ✅ VERIFY versioned config packages

---

### Rule 3: TypeScript Solution-Style References is Canonical

**Enforcement**:

- ✅ CHECK root `tsconfig.json` has NO references (at scale)
- ✅ VERIFY apps reference only their dependencies
- ✅ PREVENT circular references
- ✅ ENFORCE solution-style pattern

---

## ✅ Additional Governance Enforced

### Package Management

- ✅ **pnpm-workspace.yaml is Canonical**: WARN if `workspaces` in
  `package.json`
- ✅ **Version Upgrade Policy**: CHECK test gate and ADR documentation

### TurboRepo Configuration

- ✅ **Minimal Global Dependencies**: VERIFY only truly global configs
- ✅ **Task Inputs**: CHECK app-specific configs are in `inputs`

### Styling Configuration

- ✅ **Tailwind Placement**: VERIFY config in `packages/design-system/`
- ✅ **Design System Tokens**: CHECK single source of truth

### Package Boundaries

- ✅ **Cross-Domain Imports**: REJECT forbidden patterns
- ✅ **RFL Doctrine**: ENFORCE shared-types bridge

### Cursor Governance

- ✅ **.cursorignore**: VERIFY build artifacts excluded
- ✅ **Documentation Hierarchy**: CHECK preserved zones respected

---

## 📋 Validation Checklist

The rule enforces a validation checklist when creating/modifying root configs:

- [ ] ✅ Is this config truly monorepo-level?
- [ ] ✅ Is this config app-specific? (If yes, move to `apps/*/`)
- [ ] ✅ Is this config shared? (If yes, move to `packages/Monorepo/Config/`)
- [ ] ✅ Does `pnpm-workspace.yaml` match workspace structure?
- [ ] ✅ Are `globalDependencies` minimal (only truly global)?
- [ ] ✅ Are app-specific configs in task `inputs`?
- [ ] ✅ Does root `tsconfig.json` have NO references? (at scale)
- [ ] ✅ Do apps reference only their dependencies?
- [ ] ✅ Is Tailwind config in design system package?
- [ ] ✅ Are package boundaries respected?

---

## 🎯 Enforcement Actions

### Automatic Enforcement:

1. **Root Config Creation**:
   - ✅ Check if config is app-specific → REJECT (move to `apps/*/`)
   - ✅ Check if config is shared → REJECT (move to `packages/Monorepo/Config/`)
   - ✅ Verify config is truly monorepo-level

2. **Package.json Modification**:
   - ✅ Check for `workspaces` field → WARN (remove, use pnpm-workspace.yaml)
   - ✅ Verify `packageManager` is pinned
   - ✅ Verify `engines` match `.node-version` and `.nvmrc`

3. **Turbo.json Modification**:
   - ✅ Check `globalDependencies` are minimal
   - ✅ Verify app-specific configs are in task `inputs`
   - ✅ Verify `packages/Monorepo/Config/**/*.json` is tracked

4. **TypeScript Config Modification**:
   - ✅ Check root `tsconfig.json` has NO references (at scale)
   - ✅ Verify apps reference only their dependencies
   - ✅ Prevent circular references

5. **Next.js Config Creation**:
   - ✅ REJECT if at root (must be in `apps/*/`)
   - ✅ Verify app-specific optimizations

---

## 📊 Rule Configuration

```yaml
File: .cursor/rules/015_root-config-governance.mdc
Priority: 15
Always Apply: false
Glob Patterns:
  - package.json
  - pnpm-workspace.yaml
  - turbo.json
  - tsconfig.json
  - next.config.*
  - tailwind.config.*
  - *.mjs
  - *.ts
  - apps/**/next.config.*
  - apps/**/tsconfig.json
```

**Activation**: Rule activates when editing files matching glob patterns.

---

## 🔄 Next Steps

### Option 1: Maintain (Documentation Only)

- ✅ Guide exists as reference
- ✅ Rule exists but not actively enforced
- ✅ Manual compliance

### Option 2: Maintain + Enforce (Current Implementation)

- ✅ Guide exists as reference
- ✅ Rule actively enforces governance
- ✅ Cursor AI validates on config file edits
- ✅ **RECOMMENDED**: Best balance of guidance and enforcement

### Option 3: Start from Today (Strict Enforcement)

- ✅ Guide exists as reference
- ✅ Rule actively enforces governance
- ✅ Pre-commit hooks validate compliance
- ✅ CI/CD validates compliance
- ✅ **ADVANCED**: Maximum enforcement, requires tooling setup

---

## ✅ Implementation Status

**Rule Created**: ✅ Complete **Rule Tested**: ⏳ Pending (test on next config
edit) **Documentation**: ✅ Complete **Enforcement Level**: Option 2 (Maintain +
Enforce)

---

**Last Updated**: 2026-01-11 **Status**: ✅ **RULE CREATED - READY FOR
ENFORCEMENT**
