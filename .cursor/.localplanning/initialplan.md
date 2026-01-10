---
name: Add Enforceable DoD and Measurable KPIs to Nextra Best Practices
overview: Transform NEXTRA_BEST_PRACTICES.md into an elite-grade enforcement system with enforceable Definition of Done (DoD) gates, measurable KPIs with evidence collection, and DRY architecture. Aligns with Next.js 16+, Vercel, TurboRepo, and Web Vitals official benchmarks. Fixes critical issues (INP vs FID, remove || true escapes), creates KPI_REFERENCE.md as SSOT, and implements automated metric collection.
todos: []
---

# Add Enforceable DoD and Measurable KPIs to Nextra Best Practices

## Executive Summary

**Objective**: Transform the best practices guide from "advisory" into a **production-grade enforcement system** that:

- Enforces quality gates with binary pass/fail criteria (no escape hatches)
- Measures real performance with evidence-backed KPIs
- Follows DRY principles with single source of truth architecture
- Aligns with elite practices from Next.js, Vercel, TurboRepo, and Web Vitals

**Impact**: Enables teams to ship with confidence, catch regressions early, and maintain elite performance standards automatically.

---

## Critical Corrections (Must Fix First)

### 1. Replace FID with INP (Web Vitals Update)

**Issue**: First Input Delay (FID) was deprecated in March 2024, replaced by Interaction to Next Paint (INP).

**Action**:

- Replace all FID references with INP throughout documentation
- Update thresholds: **INP ≤ 200ms** (good), 200-500ms (needs improvement), > 500ms (poor)
- Reference: [web.dev Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)

**Files Affected**: `NEXTRA_BEST_PRACTICES.md` (all sections mentioning FID)

### 2. Remove `|| true` Escape Hatches from DoD Gates

**Issue**: Current workflow uses `pnpm lint || true` and `pnpm type-check || true`, making gates unenforceable.

**Action**:

- Remove `|| true` from all quality gates
- Configure ESLint/TypeScript to distinguish errors (fail) from warnings (documented threshold)
- Implement proper error handling: Errors = hard fail, Warnings = configurable threshold

**Files Affected**: `.github/workflows/deploy.yml.example`

**Elite Practice**: [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist) requires strict enforcement.

---

## Architecture: DRY & Single Source of Truth

### Core Principle

**KPI_REFERENCE.md** serves as the **single source of truth (SSOT)** for all metrics, targets, and thresholds. All other documents reference this file to avoid duplication.

### Document Hierarchy

```
KPI_REFERENCE.md (SSOT)
    ↓ referenced by
NEXTRA_BEST_PRACTICES.md (DoD gates + KPI sections)
    ↓ implemented in
.github/workflows/deploy.yml.example (CI enforcement)
    ↓ validated by
scripts/verify-production.sh (local verification)
```

### DRY Implementation Strategy

1. **KPI Definitions**: Only in `KPI_REFERENCE.md`
2. **DoD Gates**: Defined once in `NEXTRA_BEST_PRACTICES.md`, referenced in workflow
3. **Workflow Steps**: Reusable patterns, no duplication
4. **Validation Scripts**: Single source for local verification

---

## Implementation Plan (Phased Approach)

### Phase 0: Foundation & Preparation

**Prerequisites**:

- [ ] Review current `NEXTRA_BEST_PRACTICES.md` structure
- [ ] Audit existing workflow for `|| true` patterns
- [ ] Identify all FID references
- [ ] Verify Next.js 16+ compatibility
- [ ] Check TurboRepo integration (if applicable)

**Deliverables**:

- Audit report of current state
- List of all files requiring changes
- Validation checklist

---

### Phase 1: Create KPI_REFERENCE.md (SSOT)

**Location**: New file `KPI_REFERENCE.md` (root directory)

**Purpose**: Single source of truth for all KPIs, targets, and measurement methods.

**Structure** (consistent schema per KPI):

```markdown
## [KPI Name]

- **Target**: [value with unit]
- **Source**: [CI / Lighthouse CI / Speed Insights / Synthetic]
- **Collection Method**: [specific tool/command]
- **Gate Type**: [fail | warn | trend]
- **Measurement Frequency**: [per-run | rolling | daily | weekly]
- **Official Reference**: [URL to authoritative source]
- **Notes**: [context, exceptions, edge cases]
```

**KPIs to Document** (9 core metrics):

#### 1. Build Success Rate

- **Target**: 100%
- **Source**: CI (GitHub Actions)
- **Collection Method**: Workflow job status (`success` vs `failure`)
- **Gate Type**: Fail (hard gate)
- **Measurement Frequency**: Per-run
- **Official Reference**: Internal DoD requirement
- **Notes**: Zero tolerance for build failures on `main` branch

#### 2. TypeScript Error Count

- **Target**: 0 errors
- **Source**: CI (`pnpm type-check`)
- **Collection Method**: `tsc --noEmit` exit code and error output
- **Gate Type**: Fail (hard gate)
- **Measurement Frequency**: Per-run
- **Official Reference**: [Next.js TypeScript Configuration](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- **Notes**: Warnings are acceptable if documented in `tsconfig.json`

#### 3. ESLint Error Count

- **Target**: 0 errors
- **Source**: CI (`pnpm lint`)
- **Collection Method**: `next lint` exit code and error output
- **Gate Type**: Fail (hard gate)
- **Measurement Frequency**: Per-run
- **Official Reference**: [Next.js ESLint Configuration](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- **Notes**: Configure ESLint to distinguish errors from warnings. Warnings threshold configurable.

#### 4. Build Time (Cold)

- **Target**: < 5 minutes
- **Source**: CI (`build_seconds` in kpi-report.json)
- **Collection Method**: Timestamp difference before/after `pnpm build`
- **Gate Type**: Trend (alert if consistently high)
- **Measurement Frequency**: Per-run (cold builds only)
- **Official Reference**: Internal benchmark (Next.js typical: 2-4 min for docs sites)
- **Notes**: Cold = no cache hit. Cached builds should be < 2 min.

#### 5. Build Time (Cached)

- **Target**: < 2 minutes
- **Source**: CI (`build_seconds` in kpi-report.json when `cache_hit: true`)
- **Collection Method**: Timestamp difference when cache restored
- **Gate Type**: Trend (alert if consistently high)
- **Measurement Frequency**: Per-run (cached builds only)
- **Official Reference**: [Next.js CI Build Caching](https://nextjs.org/docs/app/guides/ci-build-caching)
- **Notes**: Indicates cache effectiveness.

#### 6. Cache Hit Rate (Rolling)

- **Target**: ≥ 70%
- **Source**: CI (computed from `cache-hit` booleans across runs)
- **Collection Method**: Aggregate `cache-hit: true` / total runs over last N runs
- **Gate Type**: Trend (alert if < 70% over last 20 runs)
- **Measurement Frequency**: Rolling (computed weekly)
- **Official Reference**: [Next.js CI Build Caching](https://nextjs.org/docs/app/guides/ci-build-caching)
- **Notes**: GitHub Actions cache outputs boolean per run; percentage must be computed across runs.

#### 7. Lighthouse Performance Score

- **Target**: ≥ 90
- **Source**: Lighthouse CI (synthetic)
- **Collection Method**: `@lhci/cli` or GitHub Actions Lighthouse action
- **Gate Type**: Fail (hard gate)
- **Measurement Frequency**: Per-run (on main branch)
- **Official Reference**: [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- **Notes**: Elite practice threshold. All categories (Performance, Accessibility, SEO, Best Practices) must meet threshold.

#### 8. LCP (Largest Contentful Paint)

- **Target**: ≤ 2.5s (good), 2.5-4.0s (needs improvement), > 4.0s (poor)
- **Source**: Vercel Speed Insights (field metrics, real users)
- **Collection Method**: Speed Insights dashboard / API
- **Gate Type**: Trend (alert if worsens week-over-week)
- **Measurement Frequency**: Weekly aggregation
- **Official Reference**: [Web Vitals Thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)
- **Notes**: Field metrics preferred over synthetic. Track 75th percentile.

#### 9. CLS (Cumulative Layout Shift)

- **Target**: ≤ 0.1 (good), 0.1-0.25 (needs improvement), > 0.25 (poor)
- **Source**: Vercel Speed Insights (field metrics)
- **Collection Method**: Speed Insights dashboard / API
- **Gate Type**: Trend (alert if worsens week-over-week)
- **Measurement Frequency**: Weekly aggregation
- **Official Reference**: [Web Vitals Thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)
- **Notes**: Track 75th percentile. Lower is better.

#### 10. INP (Interaction to Next Paint)

- **Target**: ≤ 200ms (good), 200-500ms (needs improvement), > 500ms (poor)
- **Source**: Vercel Speed Insights (field metrics)
- **Collection Method**: Speed Insights dashboard / API
- **Gate Type**: Trend (alert if worsens week-over-week)
- **Measurement Frequency**: Weekly aggregation
- **Official Reference**: [Web Vitals Thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) - **Replaces deprecated FID**
- **Notes**: Track 75th percentile. Measures responsiveness to user interactions.

**Additional KPIs** (optional, document if used):

- Lighthouse Accessibility Score (≥ 90)
- Lighthouse SEO Score (≥ 90)
- Lighthouse Best Practices Score (≥ 90)
- Bundle Size (trend monitoring)
- First Byte Time (TTFB)

**File Structure**:

```markdown
# KPI Reference - Single Source of Truth

> **Purpose**: This document serves as the authoritative source for all Key Performance Indicators (KPIs), targets, and measurement methods. All other documentation references this file to maintain consistency and avoid duplication.

## Overview

This reference defines all KPIs used to measure the quality, performance, and reliability of the Nextra documentation site. KPIs are categorized by:
- **Gate Type**: Fail (hard gate), Warn (threshold), Trend (monitoring)
- **Source**: CI (synthetic), Field (real users), Hybrid
- **Frequency**: Per-run, Rolling, Weekly, Monthly

## Build & CI KPIs

[KPI definitions 1-6]

## Performance KPIs (Synthetic)

[KPI definitions 7]

## Performance KPIs (Field - Real Users)

[KPI definitions 8-10]

## KPI Collection & Reporting

### CI Collection
- **Artifact**: `kpi-report.json` (uploaded every CI run)
- **Location**: GitHub Actions artifacts
- **Retention**: 14 days
- **Schema**: See workflow definition

### Production Collection
- **Tool**: Vercel Speed Insights
- **Dashboard**: Vercel project dashboard
- **API**: Speed Insights API (for automation)

### Regression Detection
- **Hard Gates**: Fail CI if threshold not met
- **Trend Alerts**: Weekly comparison, alert on degradation
- **Automation**: GitHub Actions scheduled workflow (optional)

## References

[All official documentation links]
```

**Validation**:

- [ ] All KPIs have consistent schema
- [ ] All official references are valid URLs
- [ ] Gate types are clearly defined
- [ ] Measurement methods are specific and actionable
- [ ] No duplication with other documents

---

### Phase 2: Enhance NEXTRA_BEST_PRACTICES.md

**Strategy**: Add DoD and KPI sections to existing structure without disrupting flow. Reference `KPI_REFERENCE.md` to maintain DRY.

#### 2.1 Enhance Section 4 (Vercel Deployment)

**Location**: After Sections 4.1, 4.2, 4.3

**4.1.1 Definition of Done (Deployment)** - Insert after 4.1:

```markdown
### 4.1.1 Definition of Done (Deployment)

**Enforceable Gates** (all must pass):
- ✅ Preview deployment created for every PR (via Vercel Git integration)
- ✅ Production deployment succeeds on `main` branch push
- ✅ Site responds `200 OK` on root path (`/`) and `/sitemap.xml` (if enabled)
- ✅ Required security headers present (minimum: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`)
- ✅ No "error" entries in Vercel build logs (warnings allowed only if explicitly documented in project config)
- ✅ Build completes within acceptable time (see `KPI_REFERENCE.md` for thresholds)

**Verification**:
- Automated: Vercel deployment status API
- Manual: Vercel dashboard → Deployments → Check status and logs
- CI: Smoke test `curl -I $PROD_URL` (status code + headers)

**Reference**: See `KPI_REFERENCE.md` for detailed KPI definitions.
```

**4.2.1 Deployment Performance KPIs** - Insert after 4.2:

```markdown
### 4.2.1 Deployment Performance KPIs

**Field Metrics** (Real Users - Preferred):
- **LCP**: ≤ 2.5s (see `KPI_REFERENCE.md` for full thresholds)
- **CLS**: ≤ 0.1 (see `KPI_REFERENCE.md` for full thresholds)
- **INP**: ≤ 200ms (see `KPI_REFERENCE.md` for full thresholds)

**Collection**: Vercel Speed Insights (enabled in `next.config.js` or Vercel dashboard)

**Synthetic Metrics** (CI - Lighthouse):
- **Performance**: ≥ 90
- **Accessibility**: ≥ 90
- **SEO**: ≥ 90
- **Best Practices**: ≥ 90

**Collection**: Lighthouse CI (see Section 5.3.1 for setup)

**Reference**: See `KPI_REFERENCE.md` for complete KPI definitions, targets, and measurement methods.
```

**4.3.1 Vercel Deployment Metrics (Verification)** - Insert after 4.3:

````markdown
### 4.3.1 Vercel Deployment Metrics (Verification)

**Speed Insights Setup**:
1. Enable Speed Insights in Vercel dashboard (Project Settings → Analytics)
2. Or configure in `next.config.js`:
   ```javascript
   import { SpeedInsights } from '@vercel/speed-insights/next'
   
   export default {
     // ... other config
   }
   ```
3. Add to `app/layout.tsx` or `pages/_app.tsx`:
   ```tsx
   import { SpeedInsights } from '@vercel/speed-insights/next'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <SpeedInsights />
         </body>
       </html>
     )
   }
   ```

**Smoke Check** (CI):
- Purpose: Verify deployment is accessible (not a true KPI due to region/network variance)
- Command: `curl -I $PROD_URL`
- Assertions: Status `200`, required headers present
- Note: This is a smoke test, not a performance measurement

**Reference**: 
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
- [Vercel Speed Insights Metrics](https://vercel.com/docs/speed-insights/metrics)
- See `KPI_REFERENCE.md` for field metric thresholds
````

#### 2.2 Enhance Section 5 (GitHub Actions Build)

**Location**: After Sections 5.1, 5.2, 5.3

**5.1.1 Definition of Done (Build)** - Insert after 5.1:

```markdown
### 5.1.1 Definition of Done (Build)

**Enforceable Gates** (all must pass):
- ✅ `pnpm install --frozen-lockfile` succeeds (no lockfile conflicts)
- ✅ `pnpm lint` exits 0 (0 ESLint errors; warnings threshold configurable)
- ✅ `pnpm type-check` exits 0 (0 TypeScript errors; warnings allowed if documented)
- ✅ `pnpm build` exits 0 (build completes successfully)
- ✅ `.next/cache` is restored/saved in CI (cache mechanism functional)

**Verification**:
- Automated: GitHub Actions workflow (see `.github/workflows/deploy.yml.example`)
- Local: Run `scripts/verify-production.sh`

**Reference**: See `KPI_REFERENCE.md` for detailed KPI definitions and thresholds.
```

**5.2.1 Key Performance Indicators (Build)** - Insert after 5.2:

```markdown
### 5.2.1 Key Performance Indicators (Build)

**Per-Run Metrics** (CI measurable):
- **Build Success Rate**: 100% on `main` branch (see `KPI_REFERENCE.md`)
- **Cache Hit**: Boolean per run (`cache-hit: true/false` from `actions/cache`)

**Rolling Metrics** (aggregated, not per-run):
- **Cache Hit Rate**: ≥ 70% over last N runs (see `KPI_REFERENCE.md` for computation method)
- **Build Time Trend**: Alert if consistently high (see `KPI_REFERENCE.md` for thresholds)

**Collection**:
- Per-run: `kpi-report.json` artifact (see workflow definition)
- Rolling: Computed in scheduled workflow or external dashboard

**Reference**: See `KPI_REFERENCE.md` for complete definitions, targets, and measurement methods.
```

**5.3.1 Build Performance Metrics (Evidence)** - Insert after 5.3:

````markdown
### 5.3.1 Build Performance Metrics (Evidence)

**KPI Report Schema** (`kpi-report.json`):
```json
{
  "git_sha": "abc123...",
  "run_id": "1234567890",
  "build_seconds": 145,
  "cache_hit": "true",
  "timestamp": "2024-01-15T10:30:00Z"
}
````

**Collection Method**:

1. Workflow step measures build time (see Phase 4.3)
2. Cache hit status read from `actions/cache` output
3. Report uploaded as artifact (retention: 14 days)

**Rolling KPI Computation**:

- GitHub Actions cache outputs boolean per run, not percentage
- Percentage must be computed across runs (e.g., last 20 runs)
- Implement in scheduled workflow or external tool

**Reference**:

- [Next.js CI Build Caching](https://nextjs.org/docs/app/guides/ci-build-caching)
- [GitHub Actions Dependency Caching](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- See `KPI_REFERENCE.md` for thresholds and computation methods
````

#### 2.3 Enhance Section 6 (Production Checklist)

**Location**: Before 6.1, After 6.1, After 6.2

**6.0 Definition of Done (Production Readiness)** - Insert before 6.1:
```markdown
### 6.0 Definition of Done (Production Readiness)

**Enforceable Gates** (all must pass before production):
- ✅ `pnpm build`, `pnpm lint`, `pnpm type-check` succeed (see Section 5.1.1)
- ✅ Lighthouse CI reports stored as artifacts (all categories ≥ 90)
- ✅ Core Web Vitals tracked via Speed Insights in production
- ✅ Next.js production checklist items applied (see [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist))

**Verification**:
- Automated: CI gates (see Section 5)
- Manual: Review production checklist (Section 6.1)
- Monitoring: Speed Insights dashboard (Section 6.2)

**Reference**: See `KPI_REFERENCE.md` for detailed KPI definitions and thresholds.
````


**6.1.1 Production Readiness KPIs** - Insert after 6.1:

```markdown
### 6.1.1 Production Readiness KPIs

**Synthetic Metrics** (CI - Lighthouse CI):
- **Performance**: ≥ 90
- **Accessibility**: ≥ 90
- **SEO**: ≥ 90
- **Best Practices**: ≥ 90

**Field Metrics** (Production - Speed Insights):
- **LCP**: ≤ 2.5s (see `KPI_REFERENCE.md` for full thresholds)
- **CLS**: ≤ 0.1 (see `KPI_REFERENCE.md` for full thresholds)
- **INP**: ≤ 200ms (see `KPI_REFERENCE.md` for full thresholds)

**Accessibility Note**: 
WCAG 2.2 AAA is fine as aspiration, but if enforcing as DoD, expect frequent failures. Most teams enforce **AA + "0 critical violations"** (axe-core) and then "AAA where feasible". See [Next.js Accessibility](https://nextjs.org/docs/app/building-your-application/accessibility) for guidance.

**Reference**: See `KPI_REFERENCE.md` for complete definitions, targets, and measurement methods.
```

**6.2.1 Performance Benchmarks (Targets vs Evidence)** - Insert after 6.2:

```markdown
### 6.2.1 Performance Benchmarks (Targets vs Evidence)

**Single Source of Truth**: All KPI targets and thresholds are defined in `KPI_REFERENCE.md`. This section references that file to avoid duplication.

**Evidence Storage**:
- **CI Metrics**: `kpi-report.json` artifact (GitHub Actions)
- **Lighthouse Reports**: Lighthouse CI artifacts (GitHub Actions)
- **Field Metrics**: Vercel Speed Insights dashboard (production)

**Regression Detection**:
- **Hard Gates**: CI fails if Lighthouse < threshold (see `KPI_REFERENCE.md`)
- **Trend Alerts**: Weekly comparison of CWV metrics, alert on degradation
- **Automation**: Optional scheduled workflow for trend analysis

**Reference**: See `KPI_REFERENCE.md` for complete KPI definitions and regression rules.
```

**6.3 KPI Tracking & Regression Detection** - New section after 6.2:

```markdown
### 6.3 KPI Tracking & Regression Detection

**Architecture**:
- **Single Source of Truth**: `KPI_REFERENCE.md` defines all KPIs, targets, and measurement methods
- **Collection (CI)**: Build seconds, cache-hit boolean, lighthouse scores (see Section 5.3.1)
- **Collection (Production)**: Speed Insights CWV (field metrics) - see Section 4.2.1

**Regression Rules**:
1. **Hard Fail (CI Gate)**: Lighthouse score < threshold → CI fails
2. **Trend Alert (Monitoring)**: CWV worsens week-over-week → Alert (not fail)
3. **Build Performance**: Cache hit rate < 70% over N runs → Alert

**Implementation**:
- CI gates: Enforced in GitHub Actions workflow (see Phase 4)
- Trend monitoring: Vercel Speed Insights dashboard (built-in) or custom scheduled workflow
- Alerts: GitHub Issues, Slack, or email (configure as needed)

**Reference**: 
- [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
- See `KPI_REFERENCE.md` for complete KPI definitions and regression rules
```

**Global Updates**:

- [ ] Replace all FID references with INP
- [ ] Update accessibility guidance (AA + 0 critical vs AAA)
- [ ] Add cross-references to `KPI_REFERENCE.md` where appropriate
- [ ] Ensure all KPI mentions reference SSOT

**Validation**:

- [ ] All new sections reference `KPI_REFERENCE.md`
- [ ] No KPI definitions duplicated (only references)
- [ ] DoD gates are binary (pass/fail, no ambiguity)
- [ ] All official references are valid URLs

---

### Phase 3: Fix GitHub Actions Workflow

**Location**: `.github/workflows/deploy.yml.example`

**Strategy**: Transform workflow from "advisory" to "enforceable" by removing escape hatches and adding metric collection.

#### 3.1 Remove `|| true` from DoD Gates

**Current (Unenforceable)**:

```yaml
- name: Run ESLint
  run: pnpm lint || true

- name: Run TypeScript check
  run: pnpm type-check || true
```

**Enhanced (Enforceable)**:

```yaml
- name: Run ESLint
  run: pnpm lint
  # Fails on errors (hard gate). Configure ESLint to distinguish errors from warnings.

- name: Run TypeScript check
  run: pnpm type-check
  # Fails on errors (hard gate). Warnings allowed if documented in tsconfig.json.
```

**Elite Practice**: [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist) requires strict enforcement.

#### 3.2 Add Cache Step ID (for KPI Collection)

**Current**:

```yaml
- name: Cache Next.js build
  uses: actions/cache@v4
  with:
    path: |
      ~/.pnpm-store
      ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ hashFiles('**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mdx') }}
    restore-keys: |
      ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-
```

**Enhanced**:

```yaml
- name: Cache Next.js build
  id: next-cache  # Required to read cache-hit output for KPI collection
  uses: actions/cache@v4
  with:
    path: |
      ~/.pnpm-store
      ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ hashFiles('**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mdx') }}
    restore-keys: |
      ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-
```

**Reference**: [GitHub Actions Cache Action](https://github.com/actions/cache#outputs)

#### 3.3 Measure Build Time and Collect KPIs

**Replace**:

```yaml
- name: Build project
  run: pnpm build
```

**With**:

```yaml
- name: Build + Collect KPIs
  id: kpi-collect
  run: |
    # Measure build time (no job.duration - measure actual command)
    START=$(date +%s)
    pnpm build
    EXIT_CODE=$?
    END=$(date +%s)
    
    BUILD_SECONDS=$((END-START))
    CACHE_HIT="${{ steps.next-cache.outputs.cache-hit }}"
    
    # Generate KPI report
    cat > kpi-report.json << EOF
    {
      "git_sha": "${{ github.sha }}",
      "run_id": "${{ github.run_id }}",
      "build_seconds": $BUILD_SECONDS,
      "cache_hit": "$CACHE_HIT",
      "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    }
    EOF
    
    # Fail if build failed
    exit $EXIT_CODE
```

**Elite Practice**: Measure actual command execution time, not job duration (which includes setup/teardown).

#### 3.4 Upload KPI Report Artifact

**Add after build step**:

```yaml
- name: Upload KPI Report
  uses: actions/upload-artifact@v4
  with:
    name: kpi-report
    path: kpi-report.json
    retention-days: 14
    if-no-files-found: error  # Fail if report not generated
```

**Reference**: [GitHub Actions Upload Artifact](https://github.com/actions/upload-artifact)

#### 3.5 Add Minimal Permissions (Security Best Practice)

**Add at workflow level**:

```yaml
permissions:
  contents: read
  pull-requests: read
  # No write permissions unless explicitly needed
```

**Reference**: [GitHub Actions Secure Use](https://docs.github.com/en/actions/security/security-hardening-for-github-actions)

#### 3.6 Complete Enhanced Workflow Structure

**Full enhanced workflow** (key sections):

```yaml
name: Deploy Documentation

on:
  push:
    branches:
                                                                                                                                                                                                                                                   - main
  pull_request:
    branches:
                                                                                                                                                                                                                                                   - main

permissions:
  contents: read
  pull-requests: read

jobs:
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
                                                                                                                                                                                                                                                   - name: Checkout code
        uses: actions/checkout@v4

                                                                                                                                                                                                                                                   - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

                                                                                                                                                                                                                                                   - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

                                                                                                                                                                                                                                                   - name: Install dependencies
        run: pnpm install --frozen-lockfile

                                                                                                                                                                                                                                                   - name: Run ESLint
        run: pnpm lint
        # Hard gate: fails on errors

                                                                                                                                                                                                                                                   - name: Run TypeScript check
        run: pnpm type-check
        # Hard gate: fails on errors

  build:
    name: Build Verification
    runs-on: ubuntu-latest
    steps:
                                                                                                                                                                                                                                                   - name: Checkout code
        uses: actions/checkout@v4

                                                                                                                                                                                                                                                   - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

                                                                                                                                                                                                                                                   - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

                                                                                                                                                                                                                                                   - name: Install dependencies
        run: pnpm install --frozen-lockfile

                                                                                                                                                                                                                                                   - name: Cache Next.js build
        id: next-cache
        uses: actions/cache@v4
        with:
          path: |
            ~/.pnpm-store
            ${{ github.workspace }}/.next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ hashFiles('**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mdx') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-

                                                                                                                                                                                                                                                   - name: Build + Collect KPIs
        id: kpi-collect
        run: |
          START=$(date +%s)
          pnpm build
          EXIT_CODE=$?
          END=$(date +%s)
          
          BUILD_SECONDS=$((END-START))
          CACHE_HIT="${{ steps.next-cache.outputs.cache-hit }}"
          
          cat > kpi-report.json << EOF
          {
            "git_sha": "${{ github.sha }}",
            "run_id": "${{ github.run_id }}",
            "build_seconds": $BUILD_SECONDS,
            "cache_hit": "$CACHE_HIT",
            "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
          }
          EOF
          
          exit $EXIT_CODE

                                                                                                                                                                                                                                                   - name: Upload KPI Report
        uses: actions/upload-artifact@v4
        with:
          name: kpi-report
          path: kpi-report.json
          retention-days: 14
          if-no-files-found: error

                                                                                                                                                                                                                                                   - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: .next
          retention-days: 1

  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    needs: [lint, build]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      # ... existing deploy steps ...
```

**Validation**:

- [ ] No `|| true` escape hatches remain
- [ ] Cache step has `id: next-cache`
- [ ] KPI collection measures actual build time
- [ ] KPI report uploaded as artifact
- [ ] Permissions are minimal
- [ ] Workflow follows [GitHub Actions best practices](https://docs.github.com/en/actions/learn-github-actions/best-practices)

---

### Phase 4: Create Production Verification Script

**Location**: New file `scripts/verify-production.sh`

**Purpose**: Local verification script that matches CI DoD gates for pre-commit/pre-push validation.

**Content**:

```bash
#!/bin/bash
set -euo pipefail

# Production Verification Script
# Matches CI DoD gates for local validation
# Reference: NEXTRA_BEST_PRACTICES.md Section 5.1.1

echo "🔍 Running production verification..."

# DoD Gate 1: Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# DoD Gate 2: Lint (hard gate - fails on errors)
echo "🔍 Running ESLint..."
pnpm lint

# DoD Gate 3: Type check (hard gate - fails on errors)
echo "🔍 Running TypeScript check..."
pnpm type-check

# DoD Gate 4: Build (hard gate - fails on errors)
echo "🏗️  Building project..."
pnpm build

# Optional: Lighthouse CI (if configured)
if command -v lhci &> /dev/null; then
  echo "📊 Running Lighthouse CI..."
  pnpm lighthouse-ci || echo "⚠️  Lighthouse CI not fully configured (optional)"
else
  echo "ℹ️  Lighthouse CI not installed (optional)"
fi

echo "✅ Production verification passed!"
echo ""
echo "Next steps:"
echo "  - Review KPI_REFERENCE.md for performance targets"
echo "  - Check NEXTRA_BEST_PRACTICES.md Section 6 for production checklist"
```

**Make executable**:

```bash
chmod +x scripts/verify-production.sh
```

**Integration** (optional - add to `package.json`):

```json
{
  "scripts": {
    "verify": "./scripts/verify-production.sh",
    "pre-push": "pnpm verify"
  }
}
```

**Validation**:

- [ ] Script matches CI DoD gates
- [ ] Script is executable
- [ ] Error handling is proper (`set -euo pipefail`)
- [ ] Optional steps are clearly marked

---

### Phase 5: TurboRepo Integration (If Applicable)

**Context**: If project uses TurboRepo, ensure KPIs align with TurboRepo caching and build strategies.

**Considerations**:

- TurboRepo has its own cache mechanism (separate from Next.js `.next/cache`)
- Build time KPIs should account for TurboRepo's incremental builds
- Cache hit rates may differ (TurboRepo remote cache vs GitHub Actions cache)

**Actions** (if TurboRepo detected):

- [ ] Document TurboRepo-specific KPIs in `KPI_REFERENCE.md`
- [ ] Update workflow to measure TurboRepo cache hits
- [ ] Reference [TurboRepo Caching](https://turbo.build/repo/docs/core-concepts/caching)

**Reference**: [TurboRepo Documentation](https://turbo.build/repo/docs)

---

## File Changes Summary

### Modified Files

1. **`NEXTRA_BEST_PRACTICES.md`**:

                                                                                                                                                                                                                                                                                                                                                                                                - Add DoD subsections: 4.1.1, 5.1.1, 6.0
                                                                                                                                                                                                                                                                                                                                                                                                - Add KPI subsections: 4.2.1, 4.3.1, 5.2.1, 5.3.1, 6.1.1, 6.2.1
                                                                                                                                                                                                                                                                                                                                                                                                - Add new Section 6.3: KPI Tracking & Regression Detection
                                                                                                                                                                                                                                                                                                                                                                                                - Replace all FID references with INP
                                                                                                                                                                                                                                                                                                                                                                                                - Update accessibility guidance (AA + 0 critical vs AAA)
                                                                                                                                                                                                                                                                                                                                                                                                - Add cross-references to `KPI_REFERENCE.md` (DRY)

2. **`.github/workflows/deploy.yml.example`**:

                                                                                                                                                                                                                                                                                                                                                                                                - Remove `|| true` from lint and type-check steps (enforceable gates)
                                                                                                                                                                                                                                                                                                                                                                                                - Add `id: next-cache` to cache step (KPI collection)
                                                                                                                                                                                                                                                                                                                                                                                                - Replace "Build project" with "Build + Collect KPIs" (metric collection)
                                                                                                                                                                                                                                                                                                                                                                                                - Add "Upload KPI Report" artifact step
                                                                                                                                                                                                                                                                                                                                                                                                - Add minimal permissions block (security)
                                                                                                                                                                                                                                                                                                                                                                                                - Improve error handling

### New Files

3. **`KPI_REFERENCE.md`** (new - SSOT):

                                                                                                                                                                                                                                                                                                                                                                                                - Complete KPI catalog with consistent schema
                                                                                                                                                                                                                                                                                                                                                                                                - Official references for each KPI
                                                                                                                                                                                                                                                                                                                                                                                                - Gate types (fail/warn/trend) clearly defined
                                                                                                                                                                                                                                                                                                                                                                                                - Measurement methods and frequencies
                                                                                                                                                                                                                                                                                                                                                                                                - Regression detection rules

4. **`scripts/verify-production.sh`** (new):

                                                                                                                                                                                                                                                                                                                                                                                                - Automated DoD gate verification
                                                                                                                                                                                                                                                                                                                                                                                                - Matches CI requirements for local validation
                                                                                                                                                                                                                                                                                                                                                                                                - Optional Lighthouse CI integration

---

## Success Criteria

### Functional Requirements

- [ ] All DoD gates are enforceable (no `|| true` escapes)
- [ ] All KPIs have measurable targets with evidence collection
- [ ] INP replaces FID throughout documentation
- [ ] Single source of truth for KPIs (`KPI_REFERENCE.md`)
- [ ] Workflow collects real metrics (build time, cache hit, etc.)
- [ ] Official references included for all benchmarks
- [ ] DRY principles applied (no duplication between files)

### Quality Requirements

- [ ] All KPI definitions reference `KPI_REFERENCE.md` (no duplication)
- [ ] DoD gates are binary (pass/fail, no ambiguity)
- [ ] Measurement methods are specific and actionable
- [ ] All official references are valid URLs
- [ ] Workflow follows GitHub Actions best practices
- [ ] Scripts are executable and properly error-handled

### Elite Practice Alignment

- [ ] Aligns with [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [ ] Follows [Next.js CI Build Caching](https://nextjs.org/docs/app/guides/ci-build-caching) guidelines
- [ ] Uses [Web Vitals Thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) (INP ≤ 200ms)
- [ ] Implements [Vercel Speed Insights](https://vercel.com/docs/speed-insights) best practices
- [ ] Follows [GitHub Actions Security](https://docs.github.com/en/actions/security/security-hardening-for-github-actions) guidelines

---

## Elite Practice Alignment

### Official Sources & Benchmarks

**Next.js**:

- [Production Checklist](https://nextjs.org/docs/app/guides/production-checklist) - Lighthouse ≥ 90
- [CI Build Caching](https://nextjs.org/docs/app/guides/ci-build-caching) - Cache `.next/cache`
- [TypeScript Configuration](https://nextjs.org/docs/app/building-your-application/configuring/typescript) - Strict enforcement
- [ESLint Configuration](https://nextjs.org/docs/app/building-your-application/configuring/eslint) - Error vs warning distinction

**Vercel**:

- [Speed Insights](https://vercel.com/docs/speed-insights) - Field metrics collection
- [Speed Insights Metrics](https://vercel.com/docs/speed-insights/metrics) - CWV thresholds
- [Deployment Best Practices](https://vercel.com/docs/deployments) - Security headers

**Web Vitals**:

- [Core Web Vitals Thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) - INP ≤ 200ms (replaces FID)
- [LCP Thresholds](https://web.dev/lcp/) - ≤ 2.5s
- [CLS Thresholds](https://web.dev/cls/) - ≤ 0.1

**GitHub Actions**:

- [Caching Dependencies](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows) - Cache strategy
- [Security Hardening](https://docs.github.com/en/actions/security/security-hardening-for-github-actions) - Minimal permissions

**TurboRepo** (if applicable):

- [Caching](https://turbo.build/repo/docs/core-concepts/caching) - Remote cache integration

### Target Values (Elite Practice)

**Build & CI**:

- Build Success Rate: **100%** (zero tolerance)
- TypeScript Errors: **0** (hard gate)
- ESLint Errors: **0** (hard gate)
- Cache Hit Rate: **≥ 70%** (rolling, trend alert)
- Build Time (Cold): **< 5 min** (trend alert)
- Build Time (Cached): **< 2 min** (trend alert)

**Performance (Synthetic - Lighthouse)**:

- Performance: **≥ 90**
- Accessibility: **≥ 90**
- SEO: **≥ 90**
- Best Practices: **≥ 90**

**Performance (Field - Real Users)**:

- LCP: **≤ 2.5s** (good), 2.5-4.0s (needs improvement)
- CLS: **≤ 0.1** (good), 0.1-0.25 (needs improvement)
- INP: **≤ 200ms** (good), 200-500ms (needs improvement)

---

## Risk Mitigation

### Potential Issues & Solutions

1. **Issue**: ESLint/TypeScript warnings treated as errors

                                                                                                                                                                                                                                                                                                                                                                                                - **Solution**: Configure ESLint/TypeScript to distinguish errors from warnings. Document warning thresholds in `KPI_REFERENCE.md`.

2. **Issue**: Cache hit rate computation complexity

                                                                                                                                                                                                                                                                                                                                                                                                - **Solution**: Use scheduled workflow or external tool to compute rolling metrics. Document method in `KPI_REFERENCE.md`.

3. **Issue**: Field metrics (CWV) not available immediately

                                                                                                                                                                                                                                                                                                                                                                                                - **Solution**: Use synthetic (Lighthouse) for CI gates, field metrics for trend monitoring. Document in `KPI_REFERENCE.md`.

4. **Issue**: TurboRepo integration conflicts

                                                                                                                                                                                                                                                                                                                                                                                                - **Solution**: Document TurboRepo-specific considerations in Phase 5. Update KPIs if TurboRepo detected.

5. **Issue**: Workflow permissions too restrictive

                                                                                                                                                                                                                                                                                                                                                                                                - **Solution**: Start with minimal permissions, add only if needed. Document rationale.

---

## Validation & Testing

### Pre-Implementation

- [ ] Audit current state (FID references, `|| true` patterns)
- [ ] Verify Next.js 16+ compatibility
- [ ] Check TurboRepo integration (if applicable)

### Post-Implementation

- [ ] Verify all DoD gates fail on errors (test with intentional error)
- [ ] Verify KPI report is generated and uploaded
- [ ] Verify cache hit detection works
- [ ] Verify all references to `KPI_REFERENCE.md` are valid
- [ ] Test local verification script
- [ ] Verify workflow runs successfully on test branch

### Ongoing

- [ ] Monitor KPI trends (weekly review)
- [ ] Update `KPI_REFERENCE.md` if thresholds change
- [ ] Review and update official references annually

---

## Timeline & Dependencies

### Phase Order (Sequential)

1. **Phase 0**: Foundation & Preparation (1-2 hours)
2. **Phase 1**: Create `KPI_REFERENCE.md` (2-3 hours)
3. **Phase 2**: Enhance `NEXTRA_BEST_PRACTICES.md` (3-4 hours)
4. **Phase 3**: Fix GitHub Actions Workflow (2-3 hours)
5. **Phase 4**: Create Verification Script (1 hour)
6. **Phase 5**: TurboRepo Integration (if applicable, 1-2 hours)

### Dependencies

- Phase 1 must complete before Phase 2 (SSOT must exist)
- Phase 2 can reference Phase 1 (DRY principle)
- Phase 3 depends on Phase 1 (KPI definitions)
- Phase 4 depends on Phase 3 (matches CI gates)
- Phase 5 is optional (only if TurboRepo detected)

**Total Estimated Time**: 10-15 hours

---

## Maintenance & Evolution

### Regular Updates

- **Quarterly**: Review and update official references
- **Annually**: Review and update KPI thresholds based on industry trends
- **As Needed**: Update when Next.js/Vercel release major versions

### Version Control

- Track changes to `KPI_REFERENCE.md` in git
- Document threshold changes in commit messages
- Consider versioning KPI schema if structure changes significantly

### Community Feedback

- Gather feedback from team on DoD gates
- Adjust thresholds based on real-world performance
- Document exceptions and rationale

---

**Last Updated**: 2024-12-19

**Next.js Version**: 16.1.1+

**Plan Version**: 2.0 (Enhanced with Elite Practices & DRY)