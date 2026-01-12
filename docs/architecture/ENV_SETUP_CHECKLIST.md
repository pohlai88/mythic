# Environment Variables Setup Checklist

**Status**: ✅ Active | **Last Updated**: 2026-01-11
**Purpose**: Quick checklist to verify all required environment variables are set

---

## Quick Check

Run this command to verify your `.env` file has the required variables:

```bash
# Check if .env exists
test -f .env && echo "✅ .env file exists" || echo "❌ .env file missing"

# Check for DATABASE_URL or DB_* variables
grep -E "^(DATABASE_URL|DB_HOST|DB_USER|DB_PASSWORD)" .env > /dev/null && echo "✅ Database config found" || echo "❌ Database config missing"
```

---

## Required Variables Checklist

### ✅ Database (Required for BoardRoom app)

- [ ] **`DATABASE_URL`** OR
- [ ] **`DB_HOST`** + **`DB_PASSWORD`** (minimum required)
  - `DB_HOST` (default: `localhost`)
  - `DB_PORT` (default: `5432`)
  - `DB_USER` (default: `postgres`)
  - `DB_PASSWORD` (required - no default)
  - `DB_NAME` (default: `mythic`)
  - `DB_SSL` (default: `false`)

**Quick Test**:
```bash
pnpm db:setup
```

---

## Optional Variables Checklist

### Application

- [ ] **`NODE_ENV`** - Set to `development`, `production`, or `test`
- [ ] **`LOG_LEVEL`** - Set to `debug`, `info`, `warn`, `error`, etc.

### Next.js Public Variables

- [ ] **`NEXT_PUBLIC_SITE_URL`** - Site URL for sitemap/SEO (used in `apps/docs/app/sitemap.ts`)
- [ ] **`NEXT_PUBLIC_APP_URL`** - App base URL
- [ ] **`NEXT_PUBLIC_VERCEL_ANALYTICS_ID`** - Vercel Analytics ID

### Turbo Remote Cache

- [ ] **`TURBO_TOKEN`** - Turbo remote cache token
- [ ] **`TURBO_TEAM`** - Turbo remote cache team

### Build & Development

- [ ] **`ANALYZE`** - Set to `true` to enable bundle analysis

---

## Complete .env Template

```env
# ============================================================================
# Database Configuration (REQUIRED for BoardRoom app)
# ============================================================================

# Option 1: Full connection string (recommended)
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/mythic

# Option 2: Individual components (alternative)
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_NAME=mythic
# DB_SSL=false

# ============================================================================
# Application Environment
# ============================================================================

NODE_ENV=development
LOG_LEVEL=debug

# ============================================================================
# Next.js Public Variables (available in browser)
# ============================================================================

NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=

# ============================================================================
# Turbo Remote Cache (OPTIONAL - for faster CI/CD)
# ============================================================================

# TURBO_TOKEN=your_turbo_token
# TURBO_TEAM=your_turbo_team

# ============================================================================
# Build & Development
# ============================================================================

# ANALYZE=true  # Enable bundle analysis
```

---

## Verification Steps

### 1. Check .env File Exists

```bash
ls -la .env
```

### 2. Verify Database Connection

```bash
pnpm db:setup
```

Expected output:
```
✅ Database connection successful
✅ Database schema already exists
📋 Current tables in database:
   - users
   - proposals
   ...
```

### 3. Verify Environment Variables Load

```bash
# Test in Node.js
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing')"
```

### 4. Check Next.js App Sees Variables

```bash
# Start dev server and check console
pnpm dev:boardroom
# Look for database connection errors
```

---

## Common Issues

### Issue: "DATABASE_URL is not defined"
**Solution**: 
1. Check `.env` file exists in project root
2. Verify `DATABASE_URL` or `DB_*` variables are set
3. Restart dev server after adding variables

### Issue: "Database connection failed"
**Solution**:
1. Verify PostgreSQL is running
2. Check credentials in `.env` are correct
3. Test connection: `pnpm db:setup`

### Issue: "NEXT_PUBLIC_* variables not available in browser"
**Solution**:
1. Ensure variable name starts with `NEXT_PUBLIC_`
2. Restart dev server after adding variable
3. Check variable is in root `.env` or app-specific `.env.local`

---

## Missing Variables Summary

Based on codebase analysis, ensure your `.env` has:

**Required**:
- ✅ `DATABASE_URL` OR `DB_*` variables

**Recommended**:
- ✅ `NODE_ENV=development`
- ✅ `LOG_LEVEL=debug` (or `info` for production)
- ✅ `NEXT_PUBLIC_SITE_URL` (for sitemap generation)

**Optional**:
- ⚠️ `TURBO_TOKEN` / `TURBO_TEAM` (for remote cache)
- ⚠️ `NEXT_PUBLIC_APP_URL` (for app URLs)
- ⚠️ `ANALYZE=true` (for bundle analysis)

---

**Last Updated**: 2026-01-11
**Status**: ✅ Active
