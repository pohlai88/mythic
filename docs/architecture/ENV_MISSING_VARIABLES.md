# Missing Environment Variables - Analysis Report

**Status**: ✅ Analysis Complete | **Last Updated**: 2026-01-11 **Purpose**:
Document what's missing from current `env.EXAMPLE` file

---

## Critical Missing Variables (MUST ADD)

### 1. `DATABASE_URL` ⚠️ **CRITICAL**

**Status**: ❌ **MISSING** **Used by**:

- `apps/boardroom/src/db/index.ts` (primary database connection)
- `drizzle.config.ts` (Drizzle ORM config)
- `apps/boardroom/drizzle.config.ts` (app-specific Drizzle config)
- `scripts/setup-database.ts` (database setup script)

**Current situation**:

- ✅ Has `SESSION_DB_URL` (for Supabase sessions)
- ❌ Missing `DATABASE_URL` (for BoardRoom app database)

**Impact**:

- BoardRoom app **cannot connect to database** without this
- Database migrations won't work
- All database operations will fail

**Add to .env**:

```env
# Primary database for BoardRoom app
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# OR use individual components:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=mythic
DB_SSL=false
```

---

## Recommended Missing Variables (SHOULD ADD)

### 2. `NODE_ENV` ⚠️ **RECOMMENDED**

**Status**: ❌ **MISSING** **Used by**:

- `src/lib/logger.ts` (determines log level defaults)
- Next.js configs (environment-specific behavior)
- Multiple scripts

**Impact**:

- Defaults to `development` if not set
- Should be explicit for clarity

**Add to .env**:

```env
NODE_ENV=development
```

### 3. `LOG_LEVEL` ⚠️ **RECOMMENDED**

**Status**: ❌ **MISSING** **Used by**: `src/lib/logger.ts`

**Impact**:

- Defaults to `debug` (development) or `info` (production)
- Should be configurable

**Add to .env**:

```env
LOG_LEVEL=debug  # or info, warn, error
```

### 4. `NEXT_PUBLIC_SITE_URL` ⚠️ **RECOMMENDED**

**Status**: ❌ **MISSING** **Used by**: `apps/docs/app/sitemap.ts`

**Impact**:

- Sitemap uses hardcoded default: `https://nexuscanon.dev`
- Should use actual site URL

**Add to .env**:

```env
NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev
```

---

## Optional Missing Variables (NICE TO HAVE)

### 5. `TURBO_TOKEN` / `TURBO_TEAM` ⚠️ **OPTIONAL**

**Status**: ❌ **MISSING** **Used by**: Turbo remote cache in CI/CD

**Impact**:

- CI/CD uses local cache only (still works)
- Remote cache would make builds faster

**Add to .env** (if using Turbo remote cache):

```env
TURBO_TOKEN=your_turbo_token
TURBO_TEAM=your_turbo_team
```

### 6. `NEXT_PUBLIC_APP_URL` ⚠️ **OPTIONAL**

**Status**: ❌ **MISSING** **Used by**: Documentation references

**Impact**:

- App URLs might use defaults
- Should be explicit

**Add to .env**:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 7. `ANALYZE` ⚠️ **OPTIONAL**

**Status**: ❌ **MISSING** **Used by**: Bundle analysis

**Impact**:

- Bundle analysis not enabled by default
- Can enable when needed: `ANALYZE=true pnpm build`

**Add to .env** (when needed):

```env
# ANALYZE=true  # Uncomment to enable bundle analysis
```

---

## Security Issues Found

### ⚠️ CRITICAL: Real Secrets Exposed

**Current `env.EXAMPLE` contains**:

- ❌ Real Supabase API keys
- ❌ Real GitHub tokens
- ❌ Real OpenAI API keys
- ❌ Real database passwords
- ❌ Real email passwords (in comments!)
- ❌ Real Stripe keys
- ❌ Real Vercel tokens

**Action Required**:

1. ⚠️ **IMMEDIATE**: Rotate all exposed secrets
2. ⚠️ **IMMEDIATE**: Remove `env.EXAMPLE` from git if committed
3. ✅ **Create**: `.env.example` with placeholders only

---

## Summary: What to Add

### Priority 1: Critical (Must Add)

```env
# Database connection for BoardRoom app
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### Priority 2: Recommended (Should Add)

```env
NODE_ENV=development
LOG_LEVEL=debug
NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev
```

### Priority 3: Optional (Nice to Have)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
TURBO_TOKEN=your_turbo_token
TURBO_TEAM=your_turbo_team
```

---

## Complete Missing Variables List

| Variable               | Priority       | Status     | Used By                |
| ---------------------- | -------------- | ---------- | ---------------------- |
| `DATABASE_URL`         | 🔴 Critical    | ❌ Missing | BoardRoom app, Drizzle |
| `NODE_ENV`             | 🟡 Recommended | ❌ Missing | Logger, Next.js        |
| `LOG_LEVEL`            | 🟡 Recommended | ❌ Missing | Logger                 |
| `NEXT_PUBLIC_SITE_URL` | 🟡 Recommended | ❌ Missing | Sitemap                |
| `NEXT_PUBLIC_APP_URL`  | 🟢 Optional    | ❌ Missing | App URLs               |
| `TURBO_TOKEN`          | 🟢 Optional    | ❌ Missing | CI/CD cache            |
| `TURBO_TEAM`           | 🟢 Optional    | ❌ Missing | CI/CD cache            |
| `ANALYZE`              | 🟢 Optional    | ❌ Missing | Bundle analysis        |

---

## Quick Fix

Add these to your `.env` file:

```env
# ============================================================================
# CRITICAL: Database for BoardRoom App
# ============================================================================
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# ============================================================================
# RECOMMENDED: Application Environment
# ============================================================================
NODE_ENV=development
LOG_LEVEL=debug
NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev
```

---

**Last Updated**: 2026-01-11 **Status**: ✅ Analysis Complete
