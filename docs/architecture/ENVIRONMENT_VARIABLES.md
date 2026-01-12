# Environment Variables Reference

**Status**: ✅ Active | **Last Updated**: 2026-01-11
**Purpose**: Document all environment variables used in the monorepo

---

## Required Environment Variables

### Database Configuration

**✅ `DATABASE_URL`** (Preferred)
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

**OR** use individual components:

- **`DB_HOST`** - Database host (default: `localhost`)
- **`DB_PORT`** - Database port (default: `5432`)
- **`DB_USER`** - Database user (default: `postgres`)
- **`DB_PASSWORD`** - Database password (required)
- **`DB_NAME`** - Database name (default: `mythic`)
- **`DB_SSL`** - Enable SSL (default: `false`, set to `true` for Neon/cloud)

**Example**:
```env
# Option 1: Full connection string (recommended for Neon/cloud)
DATABASE_URL=postgresql://user:password@host:5432/mythic?sslmode=require

# Option 2: Individual components (for local development)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=mythic
DB_SSL=false
```

---

## Optional Environment Variables

### Application Environment

**`NODE_ENV`** - Node environment
- Values: `development`, `production`, `test`
- Default: `development`

**`NEXT_PUBLIC_*`** - Next.js public environment variables
- Available in browser
- Examples:
  - `NEXT_PUBLIC_APP_URL=http://localhost:3000` - App base URL
  - `NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev` - Site URL for sitemap/SEO
  - `NEXT_PUBLIC_VERCEL_ANALYTICS_ID=...` - Vercel Analytics ID

### Turbo Remote Cache (Optional)

**`TURBO_TOKEN`** - Turbo remote cache token
- Optional: Only needed for remote cache
- If not set: Uses local cache only

**`TURBO_TEAM`** - Turbo remote cache team
- Optional: Only needed for remote cache
- If not set: Uses local cache only

### Build & Development

**`ANALYZE`** - Enable bundle analysis
- Values: `true` or unset
- Example: `ANALYZE=true pnpm build`

**`LOG_LEVEL`** - Logging level
- Values: `fatal`, `error`, `warn`, `info`, `debug`, `trace`
- Default: `debug` (development), `info` (production)
- Used by: `src/lib/logger.ts`

**`VERCEL`** - Vercel deployment detection
- Auto-set by Vercel
- Used for platform-specific optimizations

**`VERCEL_ENV`** - Vercel environment
- Auto-set by Vercel
- Values: `development`, `preview`, `production`

---

## Environment File Loading

### Automatic Loading

**Next.js Apps** (apps/boardroom, apps/docs):
- ✅ Automatically loads `.env`, `.env.local`, `.env.production`, etc.
- ✅ No manual `dotenv` import needed in Next.js code

**Scripts** (scripts/*.ts):
- ✅ Must explicitly load: `import { config } from 'dotenv'; config()`
- ✅ Scripts that load dotenv:
  - `scripts/setup-database.ts`
  - `drizzle.config.ts`
  - `apps/boardroom/drizzle.config.ts`

**Database Connection** (apps/boardroom/src/db/index.ts):
- ✅ Now loads dotenv explicitly
- ✅ Falls back to default if DATABASE_URL not set

### Loading Order

1. System environment variables (highest priority)
2. `.env.local` (gitignored, local overrides)
3. `.env.production` / `.env.development` (environment-specific)
4. `.env` (base configuration, lowest priority)

---

## Environment File Locations

### Project Root
- **`.env`** - Base environment variables (committed to git if using `.env.example`)
- **`.env.local`** - Local overrides (gitignored)
- **`.env.production`** - Production overrides
- **`.env.development`** - Development overrides

### App-Specific (Next.js)
- **`apps/*/.env.local`** - App-specific local overrides
- **`apps/*/.env.production`** - App-specific production config

---

## Usage Examples

### In Scripts

```typescript
import { config } from 'dotenv'
config() // Load .env file

const dbUrl = process.env.DATABASE_URL
```

### In Next.js Apps

```typescript
// No dotenv import needed - Next.js loads automatically
const dbUrl = process.env.DATABASE_URL
const publicUrl = process.env.NEXT_PUBLIC_APP_URL
```

### Using Utility (lib/env.ts)

```typescript
import { getDatabaseUrl, getEnv, getOptionalEnv } from '@/lib/env'

const dbUrl = getDatabaseUrl() // Handles DATABASE_URL or individual components
const nodeEnv = getOptionalEnv('NODE_ENV', 'development')
```

---

## Security Best Practices

### ✅ DO:
- ✅ Use `.env.local` for secrets (gitignored)
- ✅ Commit `.env.example` with placeholder values
- ✅ Use GitHub Secrets for CI/CD
- ✅ Never commit actual secrets to git

### ❌ DON'T:
- ❌ Commit `.env` with real credentials
- ❌ Commit `.env.local` (should be gitignored)
- ❌ Hardcode secrets in code
- ❌ Expose secrets in client-side code (use `NEXT_PUBLIC_*` only for public values)

---

## CI/CD Environment Variables

### GitHub Actions

**Required** (set as GitHub Secrets):
- None (workflow works without secrets)

**Optional** (for remote cache):
- `TURBO_TOKEN` - Turbo remote cache token
- `TURBO_TEAM` - Turbo remote cache team

**Auto-set by GitHub**:
- `CI=true`
- `GITHUB_*` variables

### Vercel

**Auto-set by Vercel**:
- `VERCEL=true`
- `VERCEL_ENV` (development/preview/production)
- `VERCEL_URL`

**Required** (set in Vercel dashboard):
- `DATABASE_URL` (if using database)

---

## Troubleshooting

### Issue: "Missing required environment variable"
**Solution**: Check `.env` file exists and has the required variable

### Issue: Scripts don't see .env variables
**Solution**: Ensure script imports and calls `config()` from dotenv:
```typescript
import { config } from 'dotenv'
config()
```

### Issue: Next.js app doesn't see .env variables
**Solution**: 
- Check variable name starts with `NEXT_PUBLIC_` for client-side
- Restart dev server after changing .env
- Check file is in correct location (app root or app directory)

---

**Last Updated**: 2026-01-11
**Status**: ✅ Active
