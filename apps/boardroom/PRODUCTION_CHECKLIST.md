# Production Readiness Checklist

## ✅ Pre-Deployment Checklist

### **1. Neon Database Configuration**

- [ ] Production project created in Neon Console
- [ ] Production branch configured (usually `main`)
- [ ] Connection string uses **pooler endpoint** (`-pooler.neon.tech`)
- [ ] SSL required (`sslmode=require`)
- [ ] Channel binding enabled (`channel_binding=require`)
- [ ] Connection timeout ≤ 10s (production: 5s recommended)
- [ ] Pool timeout set to 0 (unlimited for serverless)
- [ ] Database name configured
- [ ] Role name configured

### **2. Environment Variables**

- [ ] `DATABASE_URL` set with production connection string
- [ ] `NODE_ENV=production`
- [ ] Connection string validated (pooler + SSL + channel binding)
- [ ] No hardcoded credentials
- [ ] `.env` file gitignored
- [ ] Production secrets in secure storage (Vercel, etc.)

### **3. Drizzle Configuration**

- [ ] `drizzle.config.ts` configured correctly
- [ ] Migration table configured (`drizzle_migrations`)
- [ ] Schema paths correct
- [ ] Verbose mode enabled
- [ ] Strict mode enabled
- [ ] Connection string loading from correct .env

### **4. Schema & Migrations**

- [ ] All schema files reviewed
- [ ] Migrations generated (`pnpm db:generate`)
- [ ] Migrations tested on staging
- [ ] Migration files reviewed
- [ ] Rollback plan documented
- [ ] No breaking changes without migration

### **5. Security**

- [ ] Connection string in `.env` (not committed)
- [ ] SSL required in connection string
- [ ] Channel binding enabled
- [ ] Credentials rotated if previously exposed
- [ ] No secrets in code or logs
- [ ] Environment variables validated with Zod

### **6. Performance**

- [ ] Connection time < 200ms (cold start)
- [ ] Connection time < 50ms (warm)
- [ ] Performance tests passing
- [ ] Query optimization reviewed
- [ ] Indexes created for frequently queried columns

### **7. Monitoring & Alerts**

- [ ] Connection monitoring set up
- [ ] Performance monitoring configured
- [ ] Error alerting configured
- [ ] Log aggregation set up
- [ ] Dashboard for database metrics

### **8. Backup & Recovery**

- [ ] Neon automatic backups enabled
- [ ] Point-in-time recovery tested
- [ ] Recovery procedures documented
- [ ] Backup schedule verified
- [ ] Test restore procedure completed

---

## 🚀 Production Deployment Steps

### **Step 1: Pre-Deployment Validation**

```bash
# 1. Validate environment
tsx scripts/production-validate.ts

# 2. Test connection
pnpm validate:db

# 3. Review migrations
pnpm db:generate
# Review generated files in drizzle/

# 4. Test migrations on staging
pnpm neon:branch switch --name staging --project-id <id>
pnpm db:migrate
pnpm validate:db
```

### **Step 2: Production Setup**

```bash
# Run production setup script
tsx scripts/production-setup.ts --project-id <your-project-id>
```

**This will**:
- ✅ Validate environment
- ✅ Get production connection string
- ✅ Validate security settings
- ✅ Update .env file
- ✅ Validate schema
- ✅ Run migrations
- ✅ Performance testing

### **Step 3: Final Validation**

```bash
# Run production validation
tsx scripts/production-validate.ts

# Manual checks
pnpm validate:db
pnpm test:db-performance
```

### **Step 4: Deploy**

```bash
# Deploy application
# (Your deployment process)

# Verify after deployment
pnpm validate:db
```

---

## 🔒 Production Security Checklist

### **Connection String Security**

- [ ] Uses pooler endpoint (`-pooler.neon.tech`)
- [ ] SSL required (`sslmode=require`)
- [ ] Channel binding enabled (`channel_binding=require`)
- [ ] Connection timeout configured (≤10s, production: 5s)
- [ ] Pool timeout set to 0 (unlimited)

### **Credentials Security**

- [ ] Connection string in `.env` (gitignored)
- [ ] No credentials in code
- [ ] No credentials in logs
- [ ] Credentials in secure storage (Vercel env vars, etc.)
- [ ] Credentials rotated if exposed
- [ ] Access limited to necessary personnel

### **Environment Security**

- [ ] `NODE_ENV=production` set
- [ ] Production environment isolated
- [ ] No development tools in production
- [ ] Error messages don't expose secrets
- [ ] Logging configured appropriately

---

## 📊 Production Performance Checklist

### **Connection Performance**

- [ ] Cold start: < 200ms
- [ ] Warm connection: < 50ms
- [ ] Query latency: < 100ms (typical)
- [ ] Migration time: < 5s (typical)

### **Optimization**

- [ ] Pooler endpoint used
- [ ] Connection pooling enabled
- [ ] Query optimization reviewed
- [ ] Indexes created
- [ ] Performance tests passing

---

## 🔄 Production Workflow

### **Daily Operations**

```bash
# Morning check
pnpm validate:db
pnpm test:db-performance

# Monitor logs
# Check for errors, slow queries
```

### **Schema Changes**

```bash
# 1. Develop on feature branch
pnpm neon:branch create --name feature-xyz --project-id <id>

# 2. Make schema changes
# Edit: apps/boardroom/src/db/schema/*.ts

# 3. Generate migrations
pnpm db:generate

# 4. Test on branch
pnpm db:migrate
pnpm validate:db

# 5. Test on staging
pnpm neon:branch switch --name staging --project-id <id>
pnpm db:migrate
pnpm validate:db

# 6. Deploy to production
pnpm neon:branch switch --name main --project-id <id>
pnpm db:migrate
pnpm validate:db
```

### **Emergency Procedures**

```bash
# Rollback migration
# 1. Review migration files
# 2. Create reverse migration
# 3. Apply reverse migration

# Point-in-time recovery
neonctl connection-string main@<timestamp> --pooled --ssl require

# Connection issues
# 1. Check Neon dashboard
# 2. Verify connection string
# 3. Test with neonctl
# 4. Check network/firewall
```

---

## 📝 Production Environment Template

### **`.env.production`**

```env
# Production Database (REQUIRED)
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connect_timeout=5&pool_timeout=0

# Environment (REQUIRED)
NODE_ENV=production

# Logging (RECOMMENDED)
LOG_LEVEL=info

# Application URL (REQUIRED)
NEXT_PUBLIC_APP_URL=https://your-production-url.com

# Analytics (OPTIONAL)
ANALYTICS_ENABLED=true
ANALYTICS_ENDPOINT=https://your-analytics-endpoint.com
```

---

## 🎯 Quick Production Commands

```bash
# Production setup
pnpm production:setup --project-id <id>

# Production validation
pnpm production:validate

# Get production connection string
neonctl connection-string main --project-id <id> --pooled --ssl require

# Switch to production
pnpm neon:branch switch --name main --project-id <id> --env production

# Run migrations
pnpm db:migrate

# Validate
pnpm validate:db
```

---

## ✅ Final Production Readiness

### **Before Going Live**

1. ✅ All checklist items completed
2. ✅ Production setup script run
3. ✅ Production validation passed
4. ✅ Migrations applied
5. ✅ Performance tests passing
6. ✅ Monitoring configured
7. ✅ Team trained
8. ✅ Documentation complete

---

**Status**: ✅ Production-Ready Checklist
**Last Updated**: 2026-01-11
