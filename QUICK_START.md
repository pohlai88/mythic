# Nextra Documentation - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Clone the Template

```bash
git clone https://github.com/shuding/nextra-docs-template.git mythic-docs
cd mythic-docs
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Configure Theme

**⚠️ Nextra 4**: `theme.config.tsx` is no longer supported. Configure theme options in `app/layout.tsx`:

- Update `<Navbar logo={...}>` with your project name
- Set `projectLink` prop on `<Navbar>`
- Configure `docsRepositoryBase` prop on `<Layout>`
- See `app/layout.tsx` for examples

### Step 4: Start Development

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your documentation site.

---

## 📦 Deployment Options

### Option A: Vercel One-Click Deploy (Recommended)

1. Click "Deploy" button in the [Nextra template repository](https://github.com/shuding/nextra-docs-template)
2. Connect your GitHub account
3. Configure project settings
4. Deploy automatically

### Option B: Manual Vercel Deployment

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Option C: GitHub Actions + Vercel (Advanced)

1. Copy `.github/workflows/deploy.yml.example` to `.github/workflows/deploy.yml`
2. Configure GitHub Secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Push to `main` branch to trigger deployment

---

## 🔧 Essential Configuration

### Required Files

1. **`app/layout.tsx`** - Root layout with theme configuration (Nextra 4)
2. **`next.config.mjs`** - Next.js and Nextra configuration
3. **`content/`** - MDX content files (Nextra 4)

### Package Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

---

## ✅ Pre-Deployment Checklist

- [ ] Update `app/layout.tsx` with your branding (logo, links)
- [ ] Organize content in `content/` directory (Nextra 4)
- [ ] Configure theme props in `app/layout.tsx`
- [ ] Test build locally: `pnpm build && pnpm start`
- [ ] Verify all links work
- [ ] Check mobile responsiveness
- [ ] Test dark mode (ThemeSwitch component)

---

## 🔗 Key Resources

- **Full Best Practices Guide**: See `NEXTRA_BEST_PRACTICES.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Nextra Docs**: https://nextra.site
- **Vercel Docs**: https://vercel.com/docs

---

## 🆘 Troubleshooting

**Build fails?**
```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

**TypeScript errors?**
- Ensure `next-env.d.ts` exists
- Run `pnpm type-check` to see all errors

**Deployment issues?**
- Check Vercel build logs
- Verify environment variables
- Ensure GitHub Secrets are configured

---

**Need more details?** See `NEXTRA_BEST_PRACTICES.md` for comprehensive guidance.
