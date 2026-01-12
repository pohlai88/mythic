# Deployment Guide

**Status**: ✅ Ready for Production
**Last Updated**: 2026-01-11

---

## Pre-Deployment Checklist

### ✅ Code Quality
- [x] TypeScript compiles without errors (`pnpm type-check`)
- [x] Linter passes (`pnpm lint`)
- [x] No console errors or warnings
- [x] All imports resolve correctly
- [x] No hardcoded secrets or API keys

### ✅ Build Verification
- [x] Production build succeeds (`pnpm build`)
- [x] Bundle size within budget (<250KB per chunk)
- [x] No build warnings
- [x] Static pages generate correctly
- [x] MDX content renders properly

### ✅ Configuration
- [x] Environment variables configured
- [x] `NEXT_PUBLIC_SITE_URL` set correctly
- [x] Sitemap generates correctly
- [x] robots.txt configured
- [x] Security headers configured

### ✅ Performance
- [x] Server components optimized
- [x] Client components memoized
- [x] Code splitting configured
- [x] Image optimization enabled
- [x] Analytics configured

---

## Environment Variables

### Required

```bash
# Site URL (for sitemap and metadata)
NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev
```

### Optional

```bash
# Bundle Analysis (development only)
ANALYZE=false
```

---

## Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository**
   - Go to Vercel Dashboard
   - Import Git repository
   - Select `apps/docs` as root directory

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `pnpm build` (or `cd apps/docs && pnpm build`)
   - Output Directory: `.next`
   - Install Command: `pnpm install`

3. **Set Environment Variables**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

4. **Deploy**
   - Push to main branch triggers automatic deployment
   - Or deploy manually from Vercel Dashboard

### Other Platforms

#### Netlify

```toml
# netlify.toml
[build]
  command = "cd apps/docs && pnpm build"
  publish = "apps/docs/.next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Self-Hosted

```bash
# Build
cd apps/docs
pnpm build

# Start production server
pnpm start
```

---

## Build Verification

### Local Build Test

```bash
# From monorepo root
cd apps/docs
pnpm install
pnpm build
pnpm start
```

### Bundle Analysis

```bash
# Analyze bundle size
ANALYZE=true pnpm build

# Check output in .next/analyze/
```

### Type Checking

```bash
# Verify TypeScript
pnpm type-check
```

### Linting

```bash
# Check code quality
pnpm lint

# Auto-fix issues
pnpm lint:fix
```

---

## Post-Deployment Verification

### ✅ Functionality
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] MDX pages render
- [ ] Search works (if implemented)
- [ ] Dark mode toggle works
- [ ] Analytics tracking works

### ✅ Performance
- [ ] Page load time < 2s
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size within budget

### ✅ SEO
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] robots.txt accessible at `/robots.txt`
- [ ] Meta tags present
- [ ] Open Graph tags present
- [ ] Structured data (if implemented)

### ✅ Security
- [ ] Security headers present
- [ ] HTTPS enabled
- [ ] No exposed secrets
- [ ] CSP headers configured

---

## Monitoring

### Vercel Analytics

Automatically enabled via `@vercel/analytics`:
- Page views
- Performance metrics
- Real-time monitoring

### Speed Insights

Automatically enabled via `@vercel/speed-insights`:
- Core Web Vitals
- Performance scores
- Real user monitoring

### Custom Monitoring

Add custom monitoring in `app/layout.tsx` or `app/providers.tsx`:

```tsx
// Example: Custom error tracking
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Send to monitoring service
  })
}
```

---

## Troubleshooting

### Build Failures

```bash
# Clear Next.js cache
rm -rf apps/docs/.next

# Clear node_modules
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

### Type Errors

```bash
# Check TypeScript
pnpm type-check

# Verify workspace packages
pnpm install
```

### Bundle Size Issues

```bash
# Analyze bundle
ANALYZE=true pnpm build

# Check for large dependencies
pnpm why <package-name>
```

### Runtime Errors

1. Check browser console
2. Check server logs
3. Verify environment variables
4. Check Next.js build output

---

## Rollback Procedure

### Vercel

1. Go to Vercel Dashboard
2. Select deployment
3. Click "Promote to Production"
4. Or redeploy previous version

### Manual

```bash
# Revert to previous commit
git revert HEAD
git push

# Or checkout previous version
git checkout <previous-commit>
git push --force
```

---

## Performance Targets

- **Page Load**: < 2s
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 250KB per chunk
- **Lighthouse Score**: > 90

---

## Security Checklist

- [x] Security headers configured
- [x] HTTPS enforced
- [x] No exposed secrets
- [x] CSP headers (if needed)
- [x] XSS protection enabled
- [x] CSRF protection (if forms)

---

## Support

For issues or questions:
1. Check [README.md](./README.md)
2. Review Next.js documentation
3. Check Vercel deployment logs
4. Review build output

---

**Status**: ✅ Ready for Production
**Last Updated**: 2026-01-11
