# Nextra Documentation Site - Best Practices Guide

## Overview

This guide provides comprehensive best practices for setting up, configuring, and deploying a Nextra documentation site using Next.js, Vercel, and GitHub Actions.

---

## 1. Project Setup & Structure

### 1.1 Initial Setup

**Recommended Approach:**
- Use the official [Nextra Docs Template](https://github.com/shuding/nextra-docs-template) as your starting point
- Use `pnpm` as your package manager (as per template and your project preferences)
- Ensure Node.js 18+ is installed

**Project Structure:**
```
mythic/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── app/                         # App Router (Nextra 4)
│   ├── layout.tsx              # Root layout with theme props
│   └── [[...mdxPath]]/         # Catch-all MDX route
├── components/                  # Custom React components
├── content/                     # MDX content files (Nextra 4)
│   └── *.mdx
├── public/                      # Static assets
├── .gitignore
├── next.config.mjs             # Next.js configuration
├── package.json
└── tsconfig.json                # TypeScript configuration
```

### 1.2 Package Manager

**Best Practice:** Use `pnpm` for consistency with the template and your monorepo setup:

```json
{
  "packageManager": "pnpm@8.0.0"
}
```

**Installation:**
```bash
pnpm install
```

---

## 2. Next.js Configuration Best Practices

### 2.1 Core Configuration (`next.config.mjs`)

**⚠️ Nextra 4 Changes**: `theme.config.tsx` is no longer supported. Theme options are now passed as props to components in `app/layout.tsx`.

Based on the Nextra 4 template and Next.js 16 best practices:

```javascript
import nextra from 'nextra'

const withNextra = nextra({
  // Content directory configuration (Nextra 4)
  contentDirBasePath: '/',

  // Nextra 4 features (JSON-serializable only for Turbopack)
  defaultShowCopyCode: true,
  readingTime: true,
  latex: true,

  // Search configuration
  search: {
    codeblocks: false,
  },

  // ⚠️ DO NOT add theme or themeConfig - removed in Nextra 4
  // ⚠️ DO NOT add mdxOptions with plugins (functions) - breaks Turbopack
})

export default withNextra({
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false, // Security: Remove X-Powered-By header

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // TypeScript configuration
  typescript: {
    // Fail build on TypeScript errors in production
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Fail build on ESLint errors in production
    ignoreDuringBuilds: false,
  },
})
```

### 2.2 TypeScript Configuration (`tsconfig.json`)

**Best Practices:**
- Enable strict mode for better type safety
- Configure path aliases for cleaner imports
- Include Next.js types

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 3. Nextra Theme Configuration

### 3.1 Theme Configuration (`theme.config.tsx`)

**Best Practices:**

```tsx
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  // Project branding
  logo: <span>Your Project Name</span>,

  // Repository link
  project: {
    link: 'https://github.com/your-org/your-repo',
  },

  // Documentation link
  docsRepositoryBase: 'https://github.com/your-org/your-repo/tree/main',

  // Footer configuration
  footer: {
    text: '© 2024 Your Company. All rights reserved.',
  },

  // Search configuration
  search: {
    placeholder: 'Search documentation...',
  },

  // Sidebar configuration
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },

  // Edit link
  editLink: {
    text: 'Edit this page on GitHub →',
  },

  // Feedback
  feedback: {
    content: 'Question? Give us feedback →',
    labels: 'feedback',
  },

  // Dark mode
  darkMode: true,
  nextThemes: {
    defaultTheme: 'dark',
  },
}

export default config
```

### 3.2 Content Organization

**Best Practices:**
- Use `_meta.json` files to control navigation structure
- Organize content logically by feature/domain
- Use consistent naming conventions (kebab-case for files)

**Example `_meta.json`:**
```json
{
  "index": "Introduction",
  "getting-started": "Getting Started",
  "api": {
    "title": "API Reference",
    "type": "page"
  },
  "guides": "Guides"
}
```

---

## 4. Vercel Deployment Best Practices

### 4.1 Automatic Deployment Setup

**Recommended Approach:**
1. Connect your GitHub repository to Vercel
2. Enable automatic deployments for all branches
3. Configure preview deployments for pull requests

**Vercel Configuration (`vercel.json` - optional):**
```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

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

### 4.2 Environment Variables

**Best Practices:**
- Store sensitive data in Vercel Environment Variables
- Use different environments (Production, Preview, Development)
- Never commit `.env` files to version control

**Required Variables:**
- None typically needed for basic Nextra sites
- Add as needed for analytics, API keys, etc.

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

### 4.3 Build Optimization

**Vercel automatically:**
- Caches `.next/cache` between builds
- Optimizes images automatically
- Enables ISR (Incremental Static Regeneration)
- Provides edge network for global CDN

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

---

## 5. GitHub Actions CI/CD Best Practices

### 5.1 Complete Workflow Configuration

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Documentation

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  # Lint and type check
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
        run: pnpm lint || true  # Adjust based on your lint script

      - name: Run TypeScript check
        run: pnpm type-check || true  # Adjust based on your type-check script
```

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

  # Build verification
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
        uses: actions/cache@v4
        with:
          path: |
            ~/.pnpm-store
            ${{ github.workspace }}/.next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ hashFiles('**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mdx') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-

      - name: Build project
        run: pnpm build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: .next
          retention-days: 1

  # Deploy to Vercel (only on main branch)
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    needs: [lint, build]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
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

      - name: Install Vercel CLI
        run: pnpm add -g vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 5.2 Required GitHub Secrets

Configure these in your repository settings (Settings → Secrets and variables → Actions):

1. **VERCEL_TOKEN**: Your Vercel authentication token
   - Get from: https://vercel.com/account/tokens

2. **VERCEL_ORG_ID**: Your Vercel organization ID
   - Get from: Vercel dashboard → Settings → General

3. **VERCEL_PROJECT_ID**: Your Vercel project ID
   - Get from: Vercel project settings → General

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

### 5.3 Build Caching Best Practices

**Critical:** Cache `.next/cache` for faster builds:

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

This follows [Next.js CI Build Caching guidelines](https://nextjs.org/docs/app/guides/ci-build-caching).

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
```

**Collection Method**:

1. Workflow step measures build time (see Section 5.1 workflow example)
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

---

## 6. Production Checklist

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

### 6.1 Before Going to Production

Based on [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist):

#### Performance
- [ ] Run `pnpm build` locally to catch build errors
- [ ] Test production build with `pnpm start`
- [ ] Run Lighthouse audit (target: 90+ scores)
- [ ] Optimize images using Next.js `<Image>` component
- [ ] Enable font optimization with `next/font`
- [ ] Analyze bundle size with `@next/bundle-analyzer`

#### SEO & Metadata
- [ ] Configure metadata for all pages
- [ ] Add Open Graph images
- [ ] Generate sitemap.xml
- [ ] Configure robots.txt
- [ ] Add structured data (JSON-LD) if needed

#### Security
- [ ] Remove `X-Powered-By` header (`poweredByHeader: false`)
- [ ] Configure Content Security Policy (CSP)
- [ ] Ensure environment variables are secure
- [ ] Review and secure Server Actions
- [ ] Enable tainting for sensitive data

#### Accessibility
- [ ] Run ESLint with `jsx-a11y` plugin
- [ ] Test keyboard navigation
- [ ] Verify color contrast (WCAG 2.2 AAA)
- [ ] Test with screen readers
- [ ] Add proper ARIA labels

#### Error Handling
- [ ] Create custom error pages (`error.tsx`)
- [ ] Create 404 page (`not-found.tsx`)
- [ ] Add global error boundary (`global-error.tsx`)
- [ ] Implement proper error logging

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

### 6.2 Monitoring & Analytics

**Recommended Tools:**
- **Vercel Analytics**: Built-in performance monitoring
- **Core Web Vitals**: Use `useReportWebVitals` hook
- **Error Tracking**: Consider Sentry or similar
- **Search Analytics**: Track documentation search patterns

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
- CI gates: Enforced in GitHub Actions workflow (see Section 5)
- Trend monitoring: Vercel Speed Insights dashboard (built-in) or custom scheduled workflow
- Alerts: GitHub Issues, Slack, or email (configure as needed)

**Reference**:
- [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
- See `KPI_REFERENCE.md` for complete KPI definitions and regression rules

---

## 7. Development Best Practices

### 7.1 Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type check
pnpm type-check  # Add to package.json if needed

# Lint
pnpm lint  # Add to package.json if needed
```

### 7.2 Content Writing

**MDX Best Practices:**
- Use consistent heading hierarchy (H1 → H2 → H3)
- Add code examples with syntax highlighting
- Include images in `/public` directory
- Use frontmatter for page metadata
- Keep lines under 100 characters for readability

**Example MDX:**
```mdx
---
title: Getting Started
description: Learn how to get started with our product
---

# Getting Started

Welcome to our documentation!

## Installation

\`\`\`bash
pnpm install
\`\`\`

## Next Steps

- Read the [API Reference](/api)
- Check out [Examples](/examples)
```

### 7.3 Component Development

**Best Practices:**
- Create reusable components in `/components`
- Use TypeScript for type safety
- Follow React Server Components patterns
- Minimize client-side JavaScript

---

## 8. Troubleshooting

### 8.1 Common Issues

**Build Failures:**
- Clear `.next` directory: `rm -rf .next`
- Clear pnpm cache: `pnpm store prune`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

**TypeScript Errors:**
- Ensure `next-env.d.ts` is present
- Check `tsconfig.json` paths configuration
- Verify Next.js types are installed

**Deployment Issues:**
- Verify Vercel secrets are configured correctly
- Check build logs in Vercel dashboard
- Ensure `package.json` has correct build scripts

### 8.2 Performance Issues

**Slow Builds:**
- Enable build caching (see GitHub Actions section)
- Use Turbopack for faster builds
- Optimize image sizes and formats

**Large Bundle Sizes:**
- Use `@next/bundle-analyzer` to identify large dependencies
- Implement code splitting
- Lazy load components where appropriate

---

## 9. Additional Resources

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Nextra Documentation](https://nextra.site)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### Templates & Examples
- [Nextra Docs Template](https://github.com/shuding/nextra-docs-template)
- [Vercel Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

### Tools
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals](https://web.dev/vitals/)

---

## 10. Summary Checklist

### Initial Setup
- [ ] Clone Nextra template
- [ ] Configure `theme.config.tsx`
- [ ] Set up TypeScript
- [ ] Configure ESLint
- [ ] Set up Git repository

### Development
- [ ] Organize content structure
- [ ] Create navigation (`_meta.json`)
- [ ] Write documentation content
- [ ] Add custom components if needed
- [ ] Test locally

### Deployment
- [ ] Connect to Vercel
- [ ] Configure GitHub Actions workflow
- [ ] Set up GitHub Secrets
- [ ] Test deployment pipeline
- [ ] Verify production build

### Production
- [ ] Run production checklist
- [ ] Set up monitoring
- [ ] Configure analytics
- [ ] Test error handling
- [ ] Verify SEO configuration

---

**Last Updated:** 2024-12-19
**Next.js Version:** 16.1.1
**Nextra Version:** Latest (check template)
