# Supabase Local Development Setup

## ✅ Configuration Complete

**Status:** ✅ **SUPABASE LOCAL IS RUNNING**

Your local Supabase development environment is successfully configured and running!

---

## 🌐 Local Development URLs

### Development Tools

| Service     | URL                        | Description                   |
| ----------- | -------------------------- | ----------------------------- |
| **Studio**  | http://127.0.0.1:54323     | Supabase Studio (Database UI) |
| **Mailpit** | http://127.0.0.1:54324     | Email testing tool            |
| **MCP**     | http://127.0.0.1:54321/mcp | Model Context Protocol        |

### APIs

| Service            | URL                                 | Description             |
| ------------------ | ----------------------------------- | ----------------------- |
| **Project URL**    | http://127.0.0.1:54321              | Main project endpoint   |
| **REST API**       | http://127.0.0.1:54321/rest/v1      | REST API endpoint       |
| **GraphQL**        | http://127.0.0.1:54321/graphql/v1   | GraphQL endpoint        |
| **Edge Functions** | http://127.0.0.1:54321/functions/v1 | Edge Functions endpoint |

### Database

| Item               | Value                                                     |
| ------------------ | --------------------------------------------------------- |
| **Connection URL** | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
| **Host**           | `127.0.0.1`                                               |
| **Port**           | `54322`                                                   |
| **Database**       | `postgres`                                                |
| **Username**       | `postgres`                                                |
| **Password**       | `postgres`                                                |

### Authentication Keys

| Key Type            | Value                                            |
| ------------------- | ------------------------------------------------ |
| **Publishable Key** | `sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH` |
| **Secret Key**      | `sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz`      |

### Storage (S3)

| Item           | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| **URL**        | http://127.0.0.1:54321/storage/v1/s3                               |
| **Access Key** | `625729a08b95bf1b7ff351a663f3a23c`                                 |
| **Secret Key** | `850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907` |
| **Region**     | `local`                                                            |

---

## 🔧 Environment Variables Setup

### For Next.js Project

Create or update `.env.local` in `with-supabase-app/`:

```env
# Supabase Local Development
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz

# Database (if needed)
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### For Direct Database Access

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=54322
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

---

## 🚀 Quick Start Commands

### Start Supabase Local

```powershell
cd C:\AI-BOS\eBOM\with-supabase-app
supabase start
```

### Stop Supabase Local

```powershell
supabase stop
```

### Reset Database

```powershell
supabase db reset
```

### View Logs

```powershell
supabase logs
```

### Generate TypeScript Types

```powershell
supabase gen types typescript --local > types/supabase.ts
```

### Run Migrations

```powershell
supabase migration up
```

---

## 📋 Common Tasks

### 1. Access Supabase Studio

Open in browser: http://127.0.0.1:54323

- View tables and data
- Run SQL queries
- Manage authentication
- Configure storage buckets

### 2. Test Email (Mailpit)

Open in browser: http://127.0.0.1:54324

- View all emails sent by Supabase
- Test authentication flows
- Check email templates

### 3. Connect Your Next.js App

Update your Supabase client configuration to use local URLs:

```typescript
// lib/supabase/client.ts
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
```

### 4. Run Database Migrations

```powershell
# Create a new migration
supabase migration new migration_name

# Apply migrations
supabase migration up

# Check migration status
supabase migration list
```

---

## ⚠️ Important Notes

### Docker Requirement

- Supabase local requires Docker Desktop to be running
- All services run in Docker containers
- Ensure Docker is started before running `supabase start`

### Port Usage

The following ports are used by Supabase local:

- `54321` - API Gateway
- `54322` - PostgreSQL Database
- `54323` - Studio
- `54324` - Mailpit
- `54325` - Analytics (if enabled)

Ensure these ports are available.

### Data Persistence

- Local data is stored in Docker volumes
- Data persists between `supabase stop` and `supabase start`
- Use `supabase db reset` to clear all data

### Windows-Specific

- Analytics requires Docker daemon on `tcp://localhost:2375`
- See: https://supabase.com/docs/guides/local-development/cli/getting-started?platform=windows

---

## 🔍 Verification Checklist

- [x] Supabase CLI installed (`supabase --version` works)
- [x] Docker Desktop running
- [x] `supabase start` executed successfully
- [x] All containers running (13/13)
- [x] Studio accessible at http://127.0.0.1:54323
- [x] Environment variables configured
- [ ] Next.js app connected to local Supabase
- [ ] Database migrations applied (if any)
- [ ] TypeScript types generated

---

## 📚 Next Steps

1. **Open Supabase Studio:**

   - Navigate to http://127.0.0.1:54323
   - Explore the database interface

2. **Update Environment Variables:**

   - Create `.env.local` with local Supabase URLs
   - Restart Next.js dev server

3. **Test Connection:**

   - Start Next.js app: `npm run dev`
   - Test authentication flows
   - Verify database queries work

4. **Create Migrations:**
   - Set up your database schema
   - Run migrations locally
   - Test before deploying

---

## 🎯 Quick Reference

### Start Development

```powershell
# Terminal 1: Start Supabase
supabase start

# Terminal 2: Start Next.js
cd with-supabase-app
npm run dev
```

### Stop Development

```powershell
# Stop Supabase
supabase stop

# Stop Next.js (Ctrl+C)
```

### Reset Everything

```powershell
# Reset database
supabase db reset

# Restart services
supabase stop
supabase start
```

---

## ✅ Status Summary

| Component          | Status        | Details                    |
| ------------------ | ------------- | -------------------------- |
| **Supabase CLI**   | ✅ Installed  | Working correctly          |
| **Docker**         | ✅ Running    | All containers started     |
| **Local Services** | ✅ Running    | 13/13 containers active    |
| **Studio**         | ✅ Accessible | http://127.0.0.1:54323     |
| **Database**       | ✅ Ready      | PostgreSQL on port 54322   |
| **APIs**           | ✅ Ready      | All endpoints available    |
| **Configuration**  | ✅ Complete   | All URLs and keys provided |

---

**🎉 Your local Supabase development environment is ready to use!**

---

_Last updated: After successful `supabase start`_
