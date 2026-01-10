# Post-Clone Configuration Guide

This guide walks you through all the configuration steps needed after cloning this repository from GitHub.

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Verify Prerequisites

**Required:**
- **Node.js**: Version 18+ ([Download](https://nodejs.org/))
- **pnpm**: Package manager ([Install](https://pnpm.io/installation))
  ```bash
  npm install -g pnpm
  ```

**Verify installations:**
```bash
node --version  # Should be 18.x or higher
pnpm --version # Should be 8.x or higher
```

---

### Step 2: Install Dependencies

```bash
# Navigate to project directory
cd mythic

# Install all dependencies
pnpm install
```

**Expected output:** Dependencies installed successfully, `node_modules` created.

---

### Step 3: Update Package Scripts (If Missing)

Check if `package.json` has all required scripts. If not, add them:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "verify": "./scripts/verify-production.sh"
  }
}
```

**Note:** The `verify` script requires the `scripts/verify-production.sh` file to be executable (see Step 6).

---

### Step 4: Configure Theme (`theme.config.tsx`)

**Location:** `theme.config.tsx`

**Required Changes:**

1. **Update Logo:**
   ```tsx
   logo: <span>Your Project Name</span>,
   ```

2. **Update GitHub Repository Links:**
   ```tsx
   project: {
     link: 'https://github.com/YOUR-ORG/YOUR-REPO',
   },
   docsRepositoryBase: 'https://github.com/YOUR-ORG/YOUR-REPO/tree/main',
   ```

3. **Update Footer:**
   ```tsx
   footer: {
     text: '© 2024 Your Company. All rights reserved.',
   },
   ```

4. **Update Chat/Discord Link (Optional):**
   ```tsx
   chat: {
     link: 'https://discord.gg/your-server',
   },
   ```

**Example Complete Configuration:**
```tsx
import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>My Documentation</span>,
  project: {
    link: 'https://github.com/your-org/your-repo',
  },
  chat: {
    link: 'https://discord.gg/your-server',
  },
  docsRepositoryBase: 'https://github.com/your-org/your-repo/tree/main',
  footer: {
    text: '© 2024 Your Company. All rights reserved.',
  },
  // Optional: Enable dark mode
  darkMode: true,
  nextThemes: {
    defaultTheme: 'dark',
  },
}

export default config
```

---

### Step 5: Configure Navigation (`pages/_meta.json`)

**Location:** `pages/_meta.json`

Update the navigation structure to match your documentation:

```json
{
  "index": "Introduction",
  "getting-started": "Getting Started",
  "api": {
    "title": "API Reference",
    "type": "page"
  },
  "guides": "Guides",
  "about": {
    "title": "About",
    "type": "page"
  }
}
```

**Note:** File names in `pages/` directory should match the keys in `_meta.json`.

---

### Step 6: Make Scripts Executable (Unix/Mac/Linux)

If you're on Unix-based systems (Mac/Linux), make the verification script executable:

```bash
chmod +x scripts/verify-production.sh
```

**Windows users:** Skip this step (PowerShell handles scripts differently).

---

### Step 7: Test Local Development

```bash
# Start development server
pnpm dev
```

**Expected:** Server starts on `http://localhost:3000`

**Verify:**
- ✅ Site loads without errors
- ✅ Navigation works
- ✅ Dark mode toggles (if enabled)
- ✅ All pages are accessible

---

### Step 8: Verify Production Build

```bash
# Build for production
pnpm build

# Test production build locally
pnpm start
```

**Expected:** Build completes successfully, production server starts.

**Or use the verification script:**
```bash
pnpm verify
```

---

## 🔧 Advanced Configuration

### Optional: Enhance Next.js Configuration

**Location:** `next.config.js`

**Current (Basic):**
```javascript
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = withNextra()
```

**Enhanced (Recommended - See `NEXTRA_BEST_PRACTICES.md` Section 2.1):**
```javascript
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

module.exports = withNextra({
  reactStrictMode: true,
  poweredByHeader: false, // Security: Remove X-Powered-By header
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  typescript: {
    ignoreBuildErrors: false, // Fail build on TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: false, // Fail build on ESLint errors
  },
})
```

---

### Optional: Set Up GitHub Actions CI/CD

**If you want automated deployments:**

1. **Copy workflow file:**
   ```bash
   cp .github/workflows/deploy.yml.example .github/workflows/deploy.yml
   ```

2. **Configure GitHub Secrets** (Repository Settings → Secrets and variables → Actions):
   - `VERCEL_TOKEN` - Get from [Vercel Account Tokens](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID` - Get from Vercel Dashboard → Settings → General
   - `VERCEL_PROJECT_ID` - Get from Vercel Project Settings → General

3. **Push to trigger workflow:**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Actions workflow"
   git push origin main
   ```

**Reference:** See `NEXTRA_BEST_PRACTICES.md` Section 5 for complete setup.

---

### Optional: Configure Vercel Deployment

**Option A: Vercel Dashboard (Recommended)**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure build settings (auto-detected for Next.js)
5. Deploy

**Option B: Vercel CLI**
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

**Option C: GitHub Actions** (See above)

---

### Optional: Environment Variables

**For basic Nextra sites:** No environment variables needed.

**If you need to add variables:**
- **Local:** Create `.env.local` (not committed to git)
- **Vercel:** Add in Project Settings → Environment Variables
- **GitHub Actions:** Add as GitHub Secrets (if using workflow)

**Example `.env.local` (if needed):**
```env
# Analytics (if using)
NEXT_PUBLIC_ANALYTICS_ID=your-id

# API Keys (if needed)
API_KEY=your-key
```

**Important:** Add `.env.local` to `.gitignore` (already included).

---

## ✅ Post-Configuration Checklist

### Immediate (Required)
- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] Dependencies installed (`pnpm install`)
- [ ] `theme.config.tsx` updated with your branding
- [ ] `pages/_meta.json` configured for your navigation
- [ ] Development server runs (`pnpm dev`)
- [ ] Production build succeeds (`pnpm build`)

### Before First Deployment (Recommended)
- [ ] Test production build locally (`pnpm start`)
- [ ] Run verification script (`pnpm verify`)
- [ ] Update `package.json` metadata (name, description, repository)
- [ ] Review and update `README.md`
- [ ] Configure GitHub Actions workflow (if using CI/CD)
- [ ] Set up Vercel project (if deploying to Vercel)

### Production Readiness (See `NEXTRA_BEST_PRACTICES.md` Section 6)
- [ ] Run Lighthouse audit (target: 90+ scores)
- [ ] Test mobile responsiveness
- [ ] Verify all links work
- [ ] Check SEO metadata
- [ ] Configure security headers
- [ ] Set up monitoring (Vercel Analytics/Speed Insights)

---

## 🆘 Troubleshooting

### Issue: `pnpm: command not found`
**Solution:**
```bash
npm install -g pnpm
```

### Issue: Build fails with TypeScript errors
**Solution:**
```bash
# Check TypeScript errors
pnpm type-check

# Ensure next-env.d.ts exists
ls next-env.d.ts
```

### Issue: Build fails with ESLint errors
**Solution:**
```bash
# Check ESLint errors
pnpm lint

# Fix auto-fixable issues
pnpm lint --fix
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Use different port
pnpm dev -- -p 3001
```

### Issue: Scripts not executable (Unix/Mac)
**Solution:**
```bash
chmod +x scripts/verify-production.sh
```

### Issue: Module not found errors
**Solution:**
```bash
# Clean install
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
```

---

## 📚 Next Steps

1. **Read the Best Practices Guide:**
   - See `NEXTRA_BEST_PRACTICES.md` for comprehensive guidance
   - See `KPI_REFERENCE.md` for performance targets

2. **Customize Your Documentation:**
   - Add content to `pages/` directory
   - Update navigation in `pages/_meta.json`
   - Add custom components to `components/`

3. **Deploy:**
   - Choose deployment option (Vercel recommended)
   - Configure CI/CD if needed
   - Set up monitoring

4. **Optimize:**
   - Follow `NEXTRA_BEST_PRACTICES.md` Section 6 (Production Checklist)
   - Monitor KPIs (see `KPI_REFERENCE.md`)
   - Iterate based on performance metrics

---

## 🔗 Quick Reference

**Essential Commands:**
```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript check
pnpm verify           # Run production verification
```

**Key Files:**
- `theme.config.tsx` - Theme and branding
- `next.config.js` - Next.js configuration
- `pages/_meta.json` - Navigation structure
- `package.json` - Project metadata and scripts

**Documentation:**
- `QUICK_START.md` - Quick setup guide
- `NEXTRA_BEST_PRACTICES.md` - Comprehensive best practices
- `KPI_REFERENCE.md` - Performance targets and KPIs

---

**Last Updated:** 2024-12-19
**Next.js Version:** 16.1.1+
**Nextra Version:** Latest
