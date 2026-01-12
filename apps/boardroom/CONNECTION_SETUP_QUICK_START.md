# Database Connection Setup - Quick Start

**Two Options**: Docker Desktop (Local) or Neon (Cloud)

---

## Option 1: Docker Desktop (Local Development) 🐳

### Quick Setup (3 steps)

1. **Start PostgreSQL**:
   ```bash
   cd apps/boardroom
   docker-compose up -d
   ```

2. **Configure .env** (project root):
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=mythic_password
   DB_NAME=mythic
   DB_SSL=false
   ```

3. **Validate**:
   ```bash
   pnpm validate:db
   ```

**Done!** ✅

---

## Option 2: Neon (Cloud/Serverless) ✨

### Quick Setup (3 steps)

1. **Get Connection String** from [Neon Dashboard](https://console.neon.tech)

2. **Configure .env** (project root):
   ```env
   DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require&channel_binding=require
   ```

3. **Validate**:
   ```bash
   pnpm validate:db
   ```

**Done!** ✅

---

## Validation Output

### Success (Docker)
```
✅ Docker Desktop Connection Successful!
   Connection Time: 15ms
   Database: mythic
   User: postgres
   PostgreSQL Version: PostgreSQL 15.x
   Tables Found: 0
```

### Success (Neon)
```
✅ Direct Database Connection Successful!
   Connection Time: 120ms
   Database: neondb
   User: neondb_owner
   PostgreSQL Version: PostgreSQL 15.x
   Tables Found: 12

✨ Neon Serverless Features:
   - Connection pooling: Enabled
   - Serverless optimized: Yes
   - HTTP-based: Yes
   - Channel binding: ✅ Enabled (secure)
```

---

## Next Steps

After successful validation:

1. **Create Schema**:
   ```bash
   pnpm db:push
   ```

2. **Verify Tables**:
   ```bash
   pnpm validate:db
   ```

3. **Start Development**:
   ```bash
   pnpm dev
   ```

---

## Switching Between Options

**To switch from Docker to Neon**:
- Comment out `DB_*` variables
- Add `DATABASE_URL` with Neon connection string
- Run `pnpm validate:db`

**To switch from Neon to Docker**:
- Comment out `DATABASE_URL`
- Add `DB_*` variables
- Start Docker: `docker-compose up -d`
- Run `pnpm validate:db`

---

## Troubleshooting

### Docker Issues
- **Container not running**: `docker-compose up -d`
- **Port in use**: Change port in `docker-compose.yml`
- **Connection refused**: Check Docker Desktop is running

### Neon Issues
- **Connection timeout**: Check Neon dashboard (project may be paused)
- **SSL required**: Ensure `sslmode=require` in connection string
- **Channel binding**: Add `channel_binding=require` for enhanced security

---

## Documentation

- **Docker Setup**: `apps/boardroom/DOCKER_SETUP.md`
- **Neon Testing**: `apps/boardroom/NEON_CONNECTION_TEST.md`
- **Full Guide**: `apps/boardroom/DATABASE_CONNECTION_VALIDATION.md`

---

**Ready to connect!** 🚀
