# CI Workflow Requirements

**Status**: ✅ Active | **Last Updated**: 2026-01-11
**Purpose**: Document what's required vs optional in the CI workflow

---

## Required (Must Have)

### 1. GitHub Actions Setup
- ✅ GitHub repository with Actions enabled
- ✅ Workflow file: `.github/workflows/ci.yml`

### 2. Required Steps (All Jobs)
- ✅ **Checkout code** - `actions/checkout@v4`
- ✅ **Setup pnpm** - `pnpm/action-setup@v2` (version 8.15.0)
- ✅ **Setup Node.js** - `actions/setup-node@v4` (version 20)
- ✅ **Install dependencies** - `pnpm install --frozen-lockfile`

### 3. Required Validation Steps
- ✅ **Validate verbatim configs** - `pnpm validate:verbatim`
- ✅ **Build** - `pnpm build`
- ✅ **Lint** - `pnpm lint`
- ✅ **Type check** - `pnpm type-check`
- ✅ **Format check** - `pnpm format:check`

### 4. Required Permissions
```yaml
permissions:
  contents: read
  pull-requests: write
```

### 5. Required Package Manager
- ✅ **pnpm** version 8.15.0 (enforced by `packageManager` field)
- ✅ **Node.js** version 20 (matches `.node-version`, `.nvmrc`)

---

## Optional (Nice to Have)

### 1. Turbo Remote Cache (Optional)
- ⚠️ **TURBO_TOKEN** - Optional secret for Turbo remote cache
- ⚠️ **TURBO_TEAM** - Optional secret for Turbo remote cache

**Behavior**:
- ✅ If **not set**: Uses local cache only (still works)
- ✅ If **set**: Uses remote cache (faster CI/CD, shared across team)

**How to Enable**:
1. Sign up for Turbo remote cache (Vercel or self-hosted)
2. Get your `TURBO_TOKEN` and `TURBO_TEAM`
3. Add as GitHub repository secrets:
   - Settings → Secrets and variables → Actions
   - Add `TURBO_TOKEN` and `TURBO_TEAM`

**Current Status**: Optional - workflow works without them

### 2. Test Step (Conditional)
- ⚠️ **Test** - Only runs on pull requests
  ```yaml
  if: github.event_name == 'pull_request'
  ```

---

## Workflow Jobs

### Job 1: `build` (Required)
**Purpose**: Full build and validation
**Runs on**: All pushes and PRs
**Steps**:
1. Checkout
2. Setup pnpm
3. Setup Node.js
4. Install dependencies
5. **Validate verbatim configs** (NEW - ELITE strategy)
6. Build
7. Lint
8. Type check
9. Format check
10. Test (PRs only)
11. Build summary

### Job 2: `quality` (Required)
**Purpose**: Quality checks in parallel
**Runs on**: All pushes and PRs
**Steps**:
1. Checkout
2. Setup pnpm
3. Setup Node.js
4. Install dependencies
5. Run quality checks in parallel (lint, type-check, format-check)

### Job 3: `changed-files` (Conditional)
**Purpose**: Build only changed files (faster PR checks)
**Runs on**: Pull requests only
**Condition**: `if: github.event_name == 'pull_request'`
**Steps**:
1. Checkout (full depth for change detection)
2. Setup pnpm
3. Setup Node.js
4. Install dependencies
5. Build changed packages
6. Lint changed files
7. Type check changed files

---

## Minimum Requirements Summary

**To run CI successfully, you need**:
1. ✅ GitHub repository with Actions enabled
2. ✅ pnpm 8.15.0 installed (or Corepack enabled)
3. ✅ Node.js 20 available
4. ✅ All dependencies installable (`pnpm install` works)
5. ✅ All scripts defined in `package.json`:
   - `validate:verbatim`
   - `build`
   - `lint`
   - `type-check`
   - `format:check`

**Optional but recommended**:
- ⚠️ Turbo remote cache secrets (faster CI/CD)
- ⚠️ Test suite (for PR validation)

---

## Troubleshooting

### Issue: "TURBO_TOKEN context access might be invalid"
**Status**: ⚠️ **Expected warning** - Can be ignored
**Reason**: Linter can't verify secrets exist
**Impact**: None - workflow works correctly
**Solution**: Ignore the warning, or set the secrets if you want remote cache

### Issue: Workflow fails on "Validate verbatim configs"
**Solution**: Run `pnpm validate:verbatim` locally to see what's wrong
**Fix**: Update config files to match verbatim templates in `docs/architecture/ELITE_VERBATIM_STRATEGY.md`

### Issue: Build fails
**Check**:
1. All dependencies installed?
2. Node version matches `.node-version` (20.18.0)?
3. pnpm version matches `packageManager` (8.15.0)?

---

**Last Updated**: 2026-01-11
**Status**: ✅ Active
