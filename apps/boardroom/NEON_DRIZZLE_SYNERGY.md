# Neon CLI + Drizzle Maximum Synergy Guide

## 🚀 Advanced Features & Functionality

### 1. **Automated Connection String Sync**

**Script**: `scripts/neon-drizzle-sync.ts`

Automatically syncs Neon connection strings with Drizzle configuration.

```bash
# Basic sync (auto-detects project)
pnpm neon:sync

# Sync specific branch
pnpm neon:sync --branch dev --auto-push

# Production sync with migrations
pnpm neon:sync --env production --auto-migrate

# Full control
pnpm neon:sync --project-id <id> --branch main --database neondb --role neondb_owner --auto-push
```

**Features**:
- ✅ Auto-detects Neon project
- ✅ Gets optimized connection string
- ✅ Updates .env automatically
- ✅ Optional schema push
- ✅ Optional migration generation

### 2. **Branch-Based Environment Management**

**Script**: `scripts/neon-branch-manager.ts`

Manages Neon branches for multi-environment development.

```bash
# Create dev branch
pnpm neon:branch create --name dev --project-id <id> --env development --auto-sync

# Switch to staging
pnpm neon:branch switch --name staging --project-id <id> --env staging

# List all branches
pnpm neon:branch list --project-id <id>
```

**Use Cases**:
- **Development**: Isolated branch for feature development
- **Staging**: Pre-production testing environment
- **Production**: Live production database

### 3. **Quick Neon CLI Commands**

```bash
# Get connection string
pnpm neon:cs

# List projects
pnpm neon:projects

# Set context (avoid prompts)
pnpm neon:context --project-id <id>
```

### 4. **Drizzle Advanced Features**

#### Migration Management

```bash
# Generate migrations
pnpm db:generate

# Push schema (no migrations)
pnpm db:push

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

#### Schema Introspection

```bash
# Generate from existing database
drizzle-kit introspect

# Pull schema from database
drizzle-kit pull
```

## 🔄 Workflow Examples

### Development Workflow

```bash
# 1. Create dev branch
pnpm neon:branch create --name dev --project-id <id> --env development --auto-sync

# 2. Make schema changes
# Edit: apps/boardroom/src/db/schema/*.ts

# 3. Generate migrations
pnpm db:generate

# 4. Push to dev branch
pnpm db:push

# 5. Test
pnpm validate:db
pnpm test:db
```

### Staging Workflow

```bash
# 1. Switch to staging
pnpm neon:branch switch --name staging --project-id <id> --env staging

# 2. Run migrations
pnpm db:migrate

# 3. Validate
pnpm validate:db
```

### Production Workflow

```bash
# 1. Switch to production
pnpm neon:branch switch --name main --project-id <id> --env production

# 2. Review migrations
pnpm db:generate  # Review generated files

# 3. Run migrations (carefully!)
pnpm db:migrate

# 4. Verify
pnpm validate:db
```

## 🎯 Synergistic Optimizations

### 1. **Connection String Optimization**

Automatically applied by `getDatabaseUrl()`:
- ✅ Pooler endpoint conversion
- ✅ SSL enforcement
- ✅ Channel binding preservation
- ✅ Connection timeout (10s)
- ✅ Pool timeout (0 = unlimited)

### 2. **Neon Branch Integration**

- Use branches for feature development
- Point-in-time recovery via Neon
- Isolated testing environments
- Zero-downtime schema changes

### 3. **Drizzle Migration Strategy**

- Generate migrations from schema changes
- Version-controlled migration files
- Rollback support
- Multi-environment support

### 4. **Performance Monitoring**

```bash
# Test connection performance
pnpm test:db-performance

# Validate connection
pnpm validate:db
```

## 📊 Advanced Features

### Point-in-Time Recovery

```bash
# Get connection string at specific time
neonctl connection-string main@2024-01-01T00:00:00Z --pooled

# Get connection string at LSN
neonctl connection-string main@0/234235 --pooled
```

### Multi-Database Support

```bash
# Sync specific database
pnpm neon:sync --database mydb --role myrole

# Switch database in branch
pnpm neon:branch switch --name dev --database testdb
```

### Automated CI/CD Integration

```bash
# In CI/CD pipeline
pnpm neon:sync --env production --auto-migrate
pnpm validate:db
pnpm test:db
```

## 🔧 Configuration Files

### `.env` Structure

```env
# Primary connection (auto-updated by sync script)
DATABASE_URL=postgresql://...@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require&channel_binding=require

# Environment marker
NODE_ENV=development

# Optional: Individual vars (fallback)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=mythic
DB_SSL=true
```

### `drizzle.config.ts`

Already optimized with:
- ✅ Direct connection string support
- ✅ Automatic .env loading
- ✅ Migration table configuration
- ✅ Verbose mode
- ✅ Strict mode
- ✅ Breakpoints enabled

## 📈 Performance Metrics

### Expected Performance:
- **Connection Time**: < 200ms (cold start)
- **Connection Time**: < 50ms (warm)
- **Query Latency**: < 100ms (typical)
- **Migration Time**: < 5s (typical schema)

### Optimization Checklist:
- [x] Pooler endpoint
- [x] SSL + Channel binding
- [x] Connection timeouts optimized
- [x] Drizzle HTTP driver
- [x] Neon serverless config
- [x] Branch-based environments
- [x] Automated sync scripts

## 🚨 Best Practices

### 1. **Always Use Branches for Development**
```bash
# Create feature branch
pnpm neon:branch create --name feature-xyz --project-id <id> --env development
```

### 2. **Validate Before Production**
```bash
# Always validate before pushing to production
pnpm validate:db
pnpm test:db
```

### 3. **Use Migrations for Production**
```bash
# Generate migrations
pnpm db:generate

# Review migrations
# Then run
pnpm db:migrate
```

### 4. **Monitor Performance**
```bash
# Regular performance checks
pnpm test:db-performance
```

## 📚 Command Reference

### Neon CLI
```bash
pnpm neon:cs              # Get connection string
pnpm neon:projects        # List projects
pnpm neon:context         # Set context
```

### Drizzle
```bash
pnpm db:push              # Push schema
pnpm db:generate          # Generate migrations
pnpm db:migrate           # Run migrations
pnpm db:studio            # Open Studio
```

### Synergy Scripts
```bash
pnpm neon:sync            # Sync connection string
pnpm neon:branch create  # Create branch
pnpm neon:branch switch  # Switch branch
pnpm neon:branch list    # List branches
```

### Validation
```bash
pnpm validate:db         # Validate connection
pnpm test:db             # Run tests
pnpm test:db-performance # Performance test
```

## 🎉 Maximum Synergy Achieved!

**Features Enabled**:
- ✅ Automated connection string sync
- ✅ Branch-based environments
- ✅ Migration automation
- ✅ Performance optimization
- ✅ Security hardening
- ✅ Multi-environment support
- ✅ Point-in-time recovery ready
- ✅ CI/CD integration ready

---

**Status**: ✅ Maximum Configuration Complete
**Last Updated**: 2026-01-11
**Version**: 2.0.0
