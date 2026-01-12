# Database Connection Validation Guide

## Quick Start

```bash
# Validate database connection
pnpm validate:db
```

## Connection Options

### Option 1: Docker Desktop (Local Development)

**Best for**: Local development, testing, offline work

#### Setup Steps

1. **Start Docker Desktop**
   - Ensure Docker Desktop is running
   - Verify with: `docker ps`

2. **Run PostgreSQL Container**
   ```bash
   docker run -d \
     --name postgres-mythic \
     -e POSTGRES_PASSWORD=mythic_password \
     -e POSTGRES_DB=mythic \
     -p 5432:5432 \
     postgres:15
   ```

3. **Configure .env File**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=mythic_password
   DB_NAME=mythic
   DB_SSL=false
   ```

4. **Validate Connection**
   ```bash
   pnpm validate:db
   ```

#### Docker Commands

```bash
# Start container
docker start postgres-mythic

# Stop container
docker stop postgres-mythic

# View logs
docker logs postgres-mythic

# Remove container
docker rm postgres-mythic
```

---

### Option 2: Direct Database Connection

**Best for**: Production, serverless, cloud deployments

#### Option 2A: Neon PostgreSQL (Recommended)

**Best for**: Serverless applications, production

1. **Sign up at [Neon.tech](https://neon.tech)**
   - Create a free account
   - Create a new project

2. **Get Connection String**
   - Copy connection string from Neon dashboard
   - Use **pooler endpoint** for serverless (includes `-pooler`)

3. **Configure .env File**
   ```env
   DATABASE_URL=postgresql://user:password@ep-xxx-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require
   ```

4. **Validate Connection**
   ```bash
   pnpm validate:db
   ```

#### Option 2B: Local PostgreSQL

**Best for**: Local development without Docker

1. **Install PostgreSQL**
   - Windows: Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql@15`
   - Linux: `sudo apt-get install postgresql-15`

2. **Start PostgreSQL**
   ```bash
   # macOS
   brew services start postgresql@15
   
   # Linux
   sudo systemctl start postgresql
   ```

3. **Create Database**
   ```bash
   psql -U postgres
   CREATE DATABASE mythic;
   \q
   ```

4. **Configure .env File**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=mythic
   DB_SSL=false
   ```

5. **Validate Connection**
   ```bash
   pnpm validate:db
   ```

---

## Validation Script Features

The validation script (`pnpm validate:db`) checks:

✅ **Connection Status**
- Tests database connectivity
- Measures connection time
- Verifies credentials

✅ **Database Information**
- PostgreSQL version
- Database name
- Current user

✅ **Schema Status**
- Lists all tables
- Checks if schema exists
- Identifies missing tables

✅ **Connection Method Detection**
- Auto-detects Docker vs Direct
- Provides method-specific troubleshooting

---

## Troubleshooting

### Docker Desktop Issues

**Problem**: "Docker Desktop may not be running"
```bash
# Solution: Start Docker Desktop application
# Then verify:
docker ps
```

**Problem**: "Connection refused"
```bash
# Solution: Check if container is running
docker ps | grep postgres

# If not running, start it:
docker start postgres-mythic
```

**Problem**: "Port 5432 already in use"
```bash
# Solution: Use different port or stop existing PostgreSQL
docker run -p 5433:5432 ...  # Use port 5433 instead
# Update DB_PORT=5433 in .env
```

### Direct Database Issues

**Problem**: "SSL connection required" (Neon)
```env
# Solution: Ensure connection string includes SSL
DATABASE_URL=postgresql://...?sslmode=require
```

**Problem**: "Connection timeout"
```bash
# Solution: Check network/firewall
# For Neon: Verify connection string uses pooler endpoint
# For local: Ensure PostgreSQL is running
```

**Problem**: "Authentication failed"
```bash
# Solution: Verify credentials
# Check .env file for correct username/password
# For Neon: Check if credentials were rotated in dashboard
```

---

## Environment Variables

### Option 1: Full Connection String (Recommended)

```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### Option 2: Individual Components

```env
DB_HOST=localhost          # or your database host
DB_PORT=5432               # PostgreSQL port
DB_USER=postgres           # Database user
DB_PASSWORD=your_password  # Database password
DB_NAME=mythic            # Database name
DB_SSL=false              # true for cloud, false for local
```

---

## Next Steps After Validation

### If Connection Successful

1. **Create Schema** (if tables don't exist)
   ```bash
   pnpm db:push
   ```

2. **Verify Schema**
   ```bash
   pnpm validate:db
   ```

3. **Run Performance Tests**
   ```bash
   pnpm db:performance
   ```

### If Connection Failed

1. **Review Error Messages**
   - Check the specific error in validation output
   - Follow troubleshooting steps above

2. **Verify Environment Variables**
   - Check `.env` file exists
   - Verify all required variables are set
   - Ensure no typos in credentials

3. **Test Connection Manually**
   ```bash
   # For local PostgreSQL
   psql -h localhost -U postgres -d mythic
   
   # For Neon
   psql 'postgresql://user:pass@host:port/db?sslmode=require'
   ```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `pnpm validate:db` | Validate database connection |
| `pnpm db:push` | Create/update database schema |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |
| `pnpm db:performance` | Run performance tests |

---

## Support

For more information:
- **Environment Variables**: `docs/architecture/ENVIRONMENT_VARIABLES.md`
- **Neon Setup**: `docs/guides/NEON_SETUP.md`
- **Database Schema**: `apps/boardroom/src/db/schema/`
