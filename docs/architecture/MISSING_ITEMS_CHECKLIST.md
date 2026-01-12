# Missing Items Checklist

**Status**: ✅ Active | **Last Updated**: 2026-01-11
**Purpose**: Comprehensive checklist of what might be missing in your setup

---

## Environment Variables (Check Your .env File)

### ✅ Required (Must Have)

- [ ] **`DATABASE_URL`** OR **`DB_PASSWORD`** (minimum)
  - **Used by**: `apps/boardroom/src/db/index.ts`, `drizzle.config.ts`, `scripts/setup-database.ts`
  - **Test**: `pnpm db:setup`
  - **If missing**: Database connection will fail

### ⚠️ Recommended (Should Have)

- [ ] **`NODE_ENV`**
  - **Used by**: Multiple files (logger, Next.js configs)
  - **Default**: `development` (if not set)
  - **Recommended**: Set explicitly

- [ ] **`LOG_LEVEL`**
  - **Used by**: `src/lib/logger.ts`
  - **Default**: `debug` (development), `info` (production)
  - **Recommended**: Set for consistent logging

- [ ] **`NEXT_PUBLIC_SITE_URL`**
  - **Used by**: `apps/docs/app/sitemap.ts`
  - **Current default**: `https://nexuscanon.dev`
  - **Recommended**: Set to your actual site URL

### ⚠️ Optional (Nice to Have)

- [ ] **`NEXT_PUBLIC_APP_URL`**
  - **Used by**: Documentation references
  - **Purpose**: App base URL for links

- [ ] **`NEXT_PUBLIC_VERCEL_ANALYTICS_ID`**
  - **Used by**: Vercel Analytics (if enabled)
  - **Purpose**: Analytics tracking

- [ ] **`TURBO_TOKEN`** / **`TURBO_TEAM`**
  - **Used by**: Turbo remote cache
  - **Purpose**: Faster CI/CD builds
  - **If missing**: Uses local cache only (still works)

---

## Configuration Files

### ✅ Required Files (Should Exist)

- [ ] **`.env`** - Your environment variables (gitignored)
- [ ] **`.env.example`** - Template for other developers (should be in git)
- [ ] **`package.json`** - ✅ Exists
- [ ] **`pnpm-workspace.yaml`** - ✅ Exists
- [ ] **`tsconfig.json`** - ✅ Exists
- [ ] **`turbo.json`** - ✅ Exists
- [ ] **`.node-version`** - ✅ Exists
- [ ] **`.nvmrc`** - ✅ Exists
- [ ] **`.npmrc`** - ✅ Exists

### ⚠️ App-Specific Configs

- [ ] **`apps/boardroom/next.config.mjs`** - ✅ Exists
- [ ] **`apps/boardroom/tsconfig.json`** - ✅ Exists
- [ ] **`apps/docs/next.config.mjs`** - ✅ Exists
- [ ] **`apps/docs/tsconfig.json`** - ✅ Exists

---

## Database Setup

### ✅ Required Steps

- [ ] **PostgreSQL installed and running**
  - **Test**: `psql --version`
  - **Check**: Service is running

- [ ] **Database created**
  - **Name**: `mythic` (or as specified in `DB_NAME`)
  - **Test**: `psql -U postgres -l | grep mythic`

- [ ] **Schema pushed/migrated**
  - **Command**: `pnpm db:push` or `pnpm db:migrate`
  - **Test**: `pnpm db:setup` should list tables

- [ ] **Connection verified**
  - **Test**: `pnpm db:setup`
  - **Expected**: "✅ Database connection successful"

---

## Dependencies

### ✅ Required Packages

- [ ] **All dependencies installed**
  - **Command**: `pnpm install`
  - **Test**: No errors during install

- [ ] **Node.js version correct**
  - **Required**: 20.18.0 (matches `.node-version`, `.nvmrc`)
  - **Test**: `node --version`

- [ ] **pnpm version correct**
  - **Required**: 8.15.0 (matches `packageManager` in `package.json`)
  - **Test**: `pnpm --version`

---

## Scripts & Tools

### ✅ Required Scripts Available

- [ ] **`pnpm validate:verbatim`** - ✅ Exists
- [ ] **`pnpm db:setup`** - ✅ Exists
- [ ] **`pnpm build`** - ✅ Exists
- [ ] **`pnpm lint`** - ✅ Exists
- [ ] **`pnpm type-check`** - ✅ Exists

---

## Documentation

### ✅ Created/Updated

- [x] **`docs/architecture/ENVIRONMENT_VARIABLES.md`** - Complete reference
- [x] **`docs/architecture/ENV_SETUP_CHECKLIST.md`** - Quick checklist
- [x] **`docs/architecture/CI_WORKFLOW_REQUIREMENTS.md`** - CI requirements
- [x] **`lib/env.ts`** - Environment utility

---

## Quick Verification Commands

### Check Environment Variables

```bash
# Check if .env exists
test -f .env && echo "✅ .env exists" || echo "❌ .env missing"

# Check for DATABASE_URL
grep -q "DATABASE_URL\|DB_PASSWORD" .env && echo "✅ Database config found" || echo "❌ Database config missing"
```

### Check Database Connection

```bash
pnpm db:setup
```

**Expected output**:
```
✅ Database connection successful
✅ Database schema already exists
📋 Current tables in database:
   - users
   - proposals
   ...
```

### Check All Configs Valid

```bash
pnpm validate:verbatim
```

**Expected output**:
```
✅ All verbatim files validated (X checks passed)
```

---

## Most Common Missing Items

Based on typical setups, these are most commonly missing:

1. **`DATABASE_URL` or `DB_PASSWORD`** - Required for BoardRoom app
2. **`NEXT_PUBLIC_SITE_URL`** - Used in sitemap generation
3. **Database not created** - PostgreSQL running but database doesn't exist
4. **Schema not pushed** - Database exists but tables not created

---

## Next Steps

1. **Verify .env file exists and has DATABASE_URL**
2. **Run `pnpm db:setup` to test database connection**
3. **Run `pnpm validate:verbatim` to check configs**
4. **Start dev server**: `pnpm dev:boardroom` or `pnpm dev:docs`

---

**Last Updated**: 2026-01-11
**Status**: ✅ Active
