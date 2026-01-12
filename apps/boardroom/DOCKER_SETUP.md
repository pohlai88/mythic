# Docker Development Setup

**Quick Start**: Local PostgreSQL database using Docker Desktop

---

## Prerequisites

- **Docker Desktop** installed and running
- Verify Docker is running:
  ```bash
  docker ps
  ```

---

## Quick Start

### 1. Start PostgreSQL Container

```bash
# Using docker-compose (recommended)
docker-compose up -d

# OR using docker run directly
docker run -d \
  --name postgres-mythic \
  -e POSTGRES_PASSWORD=mythic_password \
  -e POSTGRES_DB=mythic \
  -p 5432:5432 \
  postgres:15-alpine
```

### 2. Configure Environment Variables

Create or update `.env` file in project root:

```env
# Docker PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=mythic_password
DB_NAME=mythic
DB_SSL=false
```

### 3. Validate Connection

```bash
pnpm validate:db
```

Expected output:
```
✅ Docker Desktop Connection Successful!
   Connection Time: XXms
   Database: mythic
   User: postgres
   PostgreSQL Version: PostgreSQL 15.x
   Tables Found: 0
```

### 4. Create Database Schema

```bash
pnpm db:push
```

---

## Docker Compose Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f postgres
```

### Restart Services
```bash
docker-compose restart
```

### Remove Everything (including data)
```bash
docker-compose down -v
```

---

## Docker Run Commands (Alternative)

### Start Container
```bash
docker start postgres-mythic
```

### Stop Container
```bash
docker stop postgres-mythic
```

### View Logs
```bash
docker logs postgres-mythic
```

### Remove Container
```bash
docker rm postgres-mythic
```

### Remove Container and Volume
```bash
docker rm -v postgres-mythic
```

---

## Connection Details

**Host**: `localhost`  
**Port**: `5432`  
**User**: `postgres`  
**Password**: `mythic_password` (change in docker-compose.yml)  
**Database**: `mythic`

**Connection String**:
```
postgresql://postgres:mythic_password@localhost:5432/mythic
```

---

## Troubleshooting

### Container Won't Start

**Check Docker Desktop is running**:
```bash
docker ps
```

**Check container status**:
```bash
docker ps -a | grep postgres-mythic
```

**View error logs**:
```bash
docker logs postgres-mythic
```

### Port Already in Use

If port 5432 is already in use:

1. **Change port in docker-compose.yml**:
   ```yaml
   ports:
     - "5433:5432"  # Use 5433 instead
   ```

2. **Update .env**:
   ```env
   DB_PORT=5433
   ```

### Connection Refused

1. **Verify container is running**:
   ```bash
   docker ps | grep postgres
   ```

2. **Check health status**:
   ```bash
   docker inspect postgres-mythic | grep Health
   ```

3. **Restart container**:
   ```bash
   docker restart postgres-mythic
   ```

### Reset Database

**Remove all data and start fresh**:
```bash
docker-compose down -v
docker-compose up -d
pnpm db:push
```

---

## Data Persistence

Data is stored in a Docker volume named `postgres_data`. This means:
- ✅ Data persists when container stops
- ✅ Data persists when container is removed
- ❌ Data is lost when volume is removed (`docker-compose down -v`)

**Volume Location** (Docker Desktop):
- Windows: `\\wsl$\docker-desktop-data\data\docker\volumes\`
- macOS: `~/Library/Containers/com.docker.docker/Data/`

---

## Development Workflow

### Daily Development

1. **Start Docker Desktop**
2. **Start PostgreSQL**:
   ```bash
   docker-compose up -d
   ```
3. **Verify connection**:
   ```bash
   pnpm validate:db
   ```
4. **Start dev server**:
   ```bash
   pnpm dev
   ```

### When Done

```bash
# Stop containers (data persists)
docker-compose stop

# OR remove containers (data persists)
docker-compose down
```

---

## Production vs Development

**Development (Docker)**:
- Local PostgreSQL in Docker
- No SSL required
- Fast iteration
- Easy to reset

**Production (Neon)**:
- Serverless PostgreSQL
- SSL required (`sslmode=require`)
- Channel binding recommended
- Managed service

**Switch between them** by changing `.env` file:
- Docker: Use `DB_*` variables
- Neon: Use `DATABASE_URL`

---

## Next Steps

1. ✅ Start Docker container
2. ✅ Validate connection: `pnpm validate:db`
3. ✅ Create schema: `pnpm db:push`
4. ✅ Start development: `pnpm dev`

---

**Ready for local development!** 🐳
