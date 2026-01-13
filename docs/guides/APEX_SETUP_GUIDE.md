# The Apex MVP - Setup Guide

Complete setup instructions for **AXIS Decision BoardRoom MVP (The Apex)**.

---

## Prerequisites

- **Node.js**: 20.0.0 or higher
- **pnpm**: 8.15.0 or higher
- **PostgreSQL**: 15.0 or higher
- **Git**: Latest version

---

## Step 1: Install Dependencies

### 1.1 Install Node Dependencies

```bash
pnpm install
```

This installs all required packages including:

- `@trpc/client` - tRPC client for type-safe APIs
- `@trpc/react-query` - React Query integration for tRPC
- `@trpc/server` - tRPC server (already installed)
- `drizzle-orm` - Type-safe ORM
- `@tanstack/react-query` - Data fetching and caching
- All other dependencies

### 1.2 Verify Installation

```bash
pnpm list @trpc/client @trpc/react-query
```

You should see both packages listed.

---

## Step 2: Database Setup

### 2.1 Install PostgreSQL

**Windows:**

- Download from
  [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- Install with default settings
- Note the password you set for the `postgres` user

**macOS:**

```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt-get update
sudo apt-get install postgresql-15
sudo systemctl start postgresql
```

### 2.2 Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE mythic;

# Verify
\l

# Exit
\q
```

### 2.3 Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/mythic

# Or use individual components:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=mythic
DB_SSL=false
```

### 2.4 Verify Database Connection

```bash
# Test connection
pnpm tsx scripts/setup-database.ts
```

This script will:

- ✅ Check database connection
- ✅ Verify schema exists
- ✅ List current tables

### 2.5 Generate and Run Migrations

```bash
# Generate migrations from schema
pnpm drizzle-kit generate

# Push schema to database (creates tables)
pnpm drizzle-kit push

# Or use migrate (for production)
pnpm drizzle-kit migrate
```

**Expected Output:**

- Tables created: `users`, `proposals`, `proposal_stencils`, `thanos_events`,
  etc.

---

## Step 3: Start Development Server

### 3.1 Start Next.js Dev Server

```bash
pnpm dev
```

The server will start on `http://localhost:3000`

### 3.2 Access The Apex

Navigate to: **http://localhost:3000/apex**

---

## Step 4: Verify Setup

### 4.1 Check API Endpoints

Test tRPC API:

```bash
curl http://localhost:3000/api/trpc/getUser?input=%7B%22id%22%3A1%7D
```

### 4.2 Check Database Tables

```bash
psql -U postgres -d mythic -c "\dt"
```

You should see all tables listed.

### 4.3 Check Application Logs

Look for:

- ✅ Database connection successful
- ✅ tRPC router initialized
- ✅ Next.js server running

---

## Troubleshooting

### Issue: "Cannot find module '@trpc/client'"

**Solution:**

```bash
pnpm install @trpc/client @trpc/react-query
```

### Issue: "Database connection failed"

**Solutions:**

1. Verify PostgreSQL is running:

   ```bash
   # Windows
   services.msc (check PostgreSQL service)

   # macOS/Linux
   pg_isready
   ```

2. Check credentials in `.env` file

3. Test connection manually:
   ```bash
   psql -U postgres -d mythic
   ```

### Issue: "Schema not found"

**Solution:**

```bash
# Regenerate and push schema
pnpm drizzle-kit generate
pnpm drizzle-kit push
```

### Issue: "/apex route not found"

**Solution:**

- Ensure `app/apex/page.tsx` exists
- Restart dev server: `pnpm dev`

### Issue: "Type errors in tRPC"

**Solution:**

```bash
# Regenerate types
pnpm type-check

# If using Drizzle, regenerate DB types
pnpm drizzle-kit generate
```

---

## Performance Targets

Once running, verify these targets:

- ✅ **Response Time**: <200ms from click to content render
- ✅ **Optimistic UI**: 16ms client-side watermark
- ✅ **Database Queries**: <50ms lookup for user configs
- ✅ **Motion**: Gravitational time (1200ms hover, 1618ms commitment)

---

## Next Steps After Setup

1. **Authentication**: Add user authentication (NextAuth.js recommended)
2. **Seed Data**: Create sample proposals, users, circles
3. **WebSocket**: Implement real-time updates
4. **2FA**: Add mandatory 2FA
5. **Testing**: Add unit and integration tests

---

## Quick Reference

```bash
# Install dependencies
pnpm install

# Setup database
pnpm tsx scripts/setup-database.ts
pnpm drizzle-kit push

# Start dev server
pnpm dev

# Access application
open http://localhost:3000/apex
```

---

## Support

For issues or questions:

1. Check this guide
2. Review PRD: `/content/product/PRD_Decision_BoardRoom_MVP.md`
3. Check database logs
4. Review Next.js console output

---

**Status**: ✅ Setup Guide Complete **Last Updated**: 2026-01-10
