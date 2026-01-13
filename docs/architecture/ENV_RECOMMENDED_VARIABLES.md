# Recommended Environment Variables - Quick Add Guide

**Status**: ✅ Ready to Add | **Last Updated**: 2026-01-11 **Purpose**: Quick
reference for adding recommended variables to your `.env` file

---

## 🟡 Recommended Variables to Add

Add these three variables to your `.env` file:

```env
# ============================================================================
# Application Environment (RECOMMENDED)
# ============================================================================

NODE_ENV=development
LOG_LEVEL=debug
NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev
```

---

## Where to Add

Add these variables to your `.env` file (in the root directory). You can add
them:

1. **After `DATABASE_URL`** (recommended - keep database config together)
2. **In the "APPLICATION" section** (if you have one)
3. **At the top** (after any critical variables)

---

## Variable Details

### 1. `NODE_ENV=development`

**Purpose**: Sets the application environment **Used by**:

- `src/lib/logger.ts` (determines log level defaults)
- Next.js configs (environment-specific behavior)
- Multiple scripts

**Values**:

- `development` - Local development
- `production` - Production deployment
- `test` - Testing environment

**Impact**:

- Defaults to `development` if not set
- Should be explicit for clarity

---

### 2. `LOG_LEVEL=debug`

**Purpose**: Controls logging verbosity **Used by**: `src/lib/logger.ts`

**Values**:

- `debug` - Most verbose (development)
- `info` - Standard logging (production)
- `warn` - Warnings and errors only
- `error` - Errors only
- `fatal` - Fatal errors only
- `trace` - Most detailed (debugging)

**Impact**:

- Defaults to `debug` (development) or `info` (production)
- Should be configurable per environment

**Recommended by Environment**:

- Development: `LOG_LEVEL=debug`
- Production: `LOG_LEVEL=info`

---

### 3. `NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev`

**Purpose**: Site URL for sitemap and SEO **Used by**:
`apps/docs/app/sitemap.ts`

**Impact**:

- Sitemap currently uses hardcoded default: `https://nexuscanon.dev`
- Should use actual site URL for proper SEO

**Values**:

- Development: `http://localhost:3000`
- Production: `https://nexuscanon.dev` (or your actual domain)

---

## Complete Example

Here's how your `.env` file should look (with recommended variables added):

```env
# ============================================================================
# Database Configuration (REQUIRED)
# ============================================================================
DATABASE_URL=postgresql://neondb_owner:npg_1wpavUmJIdV8@ep-hidden-mountain-a1ckcj1m-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# ============================================================================
# Application Environment (RECOMMENDED)
# ============================================================================
NODE_ENV=development
LOG_LEVEL=debug
NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev

# ... rest of your variables ...
```

---

## Quick Copy-Paste

Copy this block and add it to your `.env` file:

```env
# ============================================================================
# Application Environment (RECOMMENDED)
# ============================================================================
NODE_ENV=development
LOG_LEVEL=debug
NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev
```

---

## Verification

After adding, verify they're loaded:

```bash
# Check if variables are set (PowerShell)
Get-Content .env | Select-String "NODE_ENV|LOG_LEVEL|NEXT_PUBLIC_SITE_URL"

# Or test in Node.js
node -e "require('dotenv').config(); console.log('NODE_ENV:', process.env.NODE_ENV); console.log('LOG_LEVEL:', process.env.LOG_LEVEL); console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);"
```

---

## Environment-Specific Values

### Development

```env
NODE_ENV=development
LOG_LEVEL=debug
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production

```env
NODE_ENV=production
LOG_LEVEL=info
NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev
```

---

## Summary

✅ **Add these 3 variables** to your `.env` file:

1. `NODE_ENV=development`
2. `LOG_LEVEL=debug`
3. `NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev`

**Location**: Add after `DATABASE_URL` or in an "APPLICATION" section

**Impact**:

- Better logging control
- Explicit environment configuration
- Proper sitemap URLs

---

**Last Updated**: 2026-01-11 **Status**: ✅ Ready to Add
