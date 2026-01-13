# KPI Reference - Single Source of Truth

> **Purpose**: This document serves as the authoritative source for all Key
> Performance Indicators (KPIs), targets, and measurement methods. All other
> documentation references this file to maintain consistency and avoid
> duplication.

## Overview

This reference defines all KPIs used to measure the quality, performance, and
reliability of the Nextra documentation site. KPIs are categorized by:

- **Gate Type**: Fail (hard gate), Warn (threshold), Trend (monitoring)
- **Source**: CI (synthetic), Field (real users), Hybrid
- **Frequency**: Per-run, Rolling, Weekly, Monthly

---

## Build & CI KPIs

### 1. Build Success Rate

- **Target**: 100%
- **Source**: CI (GitHub Actions)
- **Collection Method**: Workflow job status (`success` vs `failure`)
- **Gate Type**: Fail (hard gate)
- **Measurement Frequency**: Per-run
- **Official Reference**: Internal DoD requirement
- **Notes**: Zero tolerance for build failures on `main` branch

### 2. TypeScript Error Count

- **Target**: 0 errors
- **Source**: CI (`pnpm type-check`)
- **Collection Method**: `tsc --noEmit` exit code and error output
- **Gate Type**: Fail (hard gate)
- **Measurement Frequency**: Per-run
- **Official Reference**:
  [Next.js TypeScript Configuration](https://nextjs.org/docs/app/api-reference/config/typescript)
- **Notes**: Warnings are acceptable if documented in `tsconfig.json`

### 3. ESLint Error Count

- **Target**: 0 errors
- **Source**: CI (`pnpm lint`)
- **Collection Method**: `next lint` exit code and error output
- **Gate Type**: Fail (hard gate)
- **Measurement Frequency**: Per-run
- **Official Reference**:
  [Next.js ESLint Configuration](https://nextjs.org/docs/app/api-reference/config/eslint)
- **Notes**: Configure ESLint to distinguish errors from warnings. Warnings
  threshold configurable.

### 4. Build Time (Cold)

- **Target**: < 5 minutes
- **Source**: CI (`build_seconds` in kpi-report.json)
- **Collection Method**: Timestamp difference before/after `pnpm build`
- **Gate Type**: Trend (alert if consistently high)
- **Measurement Frequency**: Per-run (cold builds only)
- **Official Reference**: Internal benchmark (Next.js typical: 2-4 min for docs
  sites)
- **Notes**: Cold = no cache hit. Cached builds should be < 2 min.

### 5. Build Time (Cached)

- **Target**: < 2 minutes
- **Source**: CI (`build_seconds` in kpi-report.json when `cache_hit: true`)
- **Collection Method**: Timestamp difference when cache restored
- **Gate Type**: Trend (alert if consistently high)
- **Measurement Frequency**: Per-run (cached builds only)
- **Official Reference**:
  [Next.js CI Build Caching](https://nextjs.org/docs/app/guides/ci-build-caching)
- **Notes**: Indicates cache effectiveness.

### 6. Cache Hit Rate (Rolling)

- **Target**: ≥ 70%
- **Source**: CI (computed from `cache-hit` booleans across runs)
- **Collection Method**: Aggregate `cache-hit: true` / total runs over last N
  runs
- **Gate Type**: Trend (alert if < 70% over last 20 runs)
- **Measurement Frequency**: Rolling (computed weekly)
- **Official Reference**:
  [Next.js CI Build Caching](https://nextjs.org/docs/app/guides/ci-build-caching)
- **Notes**: GitHub Actions cache outputs boolean per run; percentage must be
  computed across runs.

---

## Performance KPIs (Synthetic - Lighthouse)

### 7. Lighthouse Performance Score

- **Target**: ≥ 90
- **Source**: Lighthouse CI (synthetic)
- **Collection Method**: `@lhci/cli` or GitHub Actions Lighthouse action
- **Gate Type**: Fail (hard gate)
- **Measurement Frequency**: Per-run (on main branch)
- **Official Reference**:
  [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- **Notes**: Elite practice threshold. All categories (Performance,
  Accessibility, SEO, Best Practices) must meet threshold.

### 8. Lighthouse Accessibility Score

- **Target**: ≥ 90
- **Source**: Lighthouse CI (synthetic)
- **Collection Method**: `@lhci/cli` or GitHub Actions Lighthouse action
- **Gate Type**: Fail (hard gate)
- **Measurement Frequency**: Per-run (on main branch)
- **Official Reference**:
  [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- **Notes**: Part of Lighthouse suite. Enforces WCAG AA + 0 critical violations
  (see accessibility note in Section 6).

### 9. Lighthouse SEO Score

- **Target**: ≥ 90
- **Source**: Lighthouse CI (synthetic)
- **Collection Method**: `@lhci/cli` or GitHub Actions Lighthouse action
- **Gate Type**: Fail (hard gate)
- **Measurement Frequency**: Per-run (on main branch)
- **Official Reference**:
  [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- **Notes**: Part of Lighthouse suite.

### 10. Lighthouse Best Practices Score

- **Target**: ≥ 90
- **Source**: Lighthouse CI (synthetic)
- **Collection Method**: `@lhci/cli` or GitHub Actions Lighthouse action
- **Gate Type**: Fail (hard gate)
- **Measurement Frequency**: Per-run (on main branch)
- **Official Reference**:
  [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- **Notes**: Part of Lighthouse suite.

---

## Performance KPIs (Field - Real Users)

### 11. LCP (Largest Contentful Paint)

- **Target**: ≤ 2.5s (good), 2.5-4.0s (needs improvement), > 4.0s (poor)
- **Source**: Vercel Speed Insights (field metrics, real users)
- **Collection Method**: Speed Insights dashboard / API
- **Gate Type**: Trend (alert if worsens week-over-week)
- **Measurement Frequency**: Weekly aggregation
- **Official Reference**:
  [Web Vitals Thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)
- **Notes**: Field metrics preferred over synthetic. Track 75th percentile.

### 12. CLS (Cumulative Layout Shift)

- **Target**: ≤ 0.1 (good), 0.1-0.25 (needs improvement), > 0.25 (poor)
- **Source**: Vercel Speed Insights (field metrics)
- **Collection Method**: Speed Insights dashboard / API
- **Gate Type**: Trend (alert if worsens week-over-week)
- **Measurement Frequency**: Weekly aggregation
- **Official Reference**:
  [Web Vitals Thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)
- **Notes**: Track 75th percentile. Lower is better.

### 13. INP (Interaction to Next Paint)

- **Target**: ≤ 200ms (good), 200-500ms (needs improvement), > 500ms (poor)
- **Source**: Vercel Speed Insights (field metrics)
- **Collection Method**: Speed Insights dashboard / API
- **Gate Type**: Trend (alert if worsens week-over-week)
- **Measurement Frequency**: Weekly aggregation
- **Official Reference**:
  [Web Vitals Thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) -
  **Replaces deprecated FID**
- **Notes**: Track 75th percentile. Measures responsiveness to user
  interactions. **FID was deprecated in March 2024; INP is the current Core Web
  Vital for responsiveness.**

---

## KPI Collection & Reporting

### CI Collection

- **Artifact**: `kpi-report.json` (uploaded every CI run)
- **Location**: GitHub Actions artifacts
- **Retention**: 14 days
- **Schema**:
  ```json
  {
    "git_sha": "abc123...",
    "run_id": "1234567890",
    "build_seconds": 145,
    "cache_hit": "true",
    "timestamp": "2024-01-15T10:30:00Z"
  }
  ```

### Production Collection

- **Tool**: Vercel Speed Insights
- **Dashboard**: Vercel project dashboard
- **API**: Speed Insights API (for automation)
- **Metrics**: LCP, CLS, INP (field metrics from real users)

### Regression Detection

- **Hard Gates**: Fail CI if threshold not met (Lighthouse scores, build errors)
- **Trend Alerts**: Weekly comparison of CWV metrics, alert on degradation
- **Automation**: GitHub Actions scheduled workflow (optional)

---

## References

### Official Documentation

- [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Next.js CI Build Caching](https://nextjs.org/docs/app/guides/ci-build-caching)
- [Next.js TypeScript Configuration](https://nextjs.org/docs/app/api-reference/config/typescript)
- [Next.js ESLint Configuration](https://nextjs.org/docs/app/api-reference/config/eslint)
- [Web Vitals Thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
- [Vercel Speed Insights Metrics](https://vercel.com/docs/speed-insights/metrics)
- [GitHub Actions Dependency Caching](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)

### Core Web Vitals

- [LCP (Largest Contentful Paint)](https://web.dev/lcp/)
- [CLS (Cumulative Layout Shift)](https://web.dev/cls/)
- [INP (Interaction to Next Paint)](https://web.dev/inp/) - **Replaces FID**

---

**Last Updated**: 2024-12-19 **Next.js Version**: 16.1.1+ **Plan Version**: 2.0
(Enhanced with Elite Practices & DRY)
