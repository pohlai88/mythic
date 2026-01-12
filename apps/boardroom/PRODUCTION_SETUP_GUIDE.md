# Production Setup Guide - Neon + Drizzle

## 🎯 Production-Ready Configuration

This guide ensures your Neon database and Drizzle setup are production-ready with maximum security, performance, and reliability.

---

## 📋 Pre-Production Checklist

### **1. Neon Configuration**

- [ ] Production project created in Neon
- [ ] Production branch configured (usually `main`)
- [ ] Pooler endpoint enabled
- [ ] SSL required
- [ ] Channel binding enabled
- [ ] Connection timeout configured (≤10s)
- [ ] Pool timeout set to 0 (unlimited)

### **2. Environment Variables**

- [ ] `DATABASE_URL` set with production connection string
- [ ] `NODE_ENV=production`
- [ ] Connection string uses pooler endpoint
- [ ] SSL and channel binding included
- [ ] No hardcoded credentials

### **3. Drizzle Configuration**

- [ ] Migrations configured
- [ ] Migration table set (`drizzle_migrations`)
- [ ] Schema paths correct
- [ ] Verbose mode enabled (for debugging)
- [ ] Strict mode enabled

### **4. Security**

- [ ] Connection string in `.env` (gitignored)
- [ ] SSL required
- [ ] Channel binding enabled
- [ ] Credentials rotated if exposed
- [ ] No secrets in code

### **5. Schema & Migrations**

- [ ] Schema files reviewed
- [ ] Migrations generated
- [ ] Migrations tested
- [ ] Rollback plan documented
- [ ] Backup strategy in place

---

## 🚀 Production Setup Steps

### **Step 1: Get Production Connection String**

```bash
# Get optimized production connection string
neonctl connection-string \
  main \
  --project-id <your-project-id> \
  --pooled \
  --ssl require \
  --database-name neondb \
  --role-name neondb_owner
```

**Expected Output**:
```
postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### **Step 2: Configure Production Environment**

Create `.env.production` or update `.env`:

```env
# Production Database
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connect_timeout=10&pool_timeout=0

# Environment
NODE_ENV=production

# Optional: Performance monitoring
LOG_LEVEL=info
```

### **Step 3: Run Production Setup Script**

```bash
cd apps/boardroom
tsx scripts/production-setup.ts --project-id <your-project-id>
```

**What it does**:
- ✅ Validates environment
- ✅ Gets production connection string
- ✅ Validates security settings
- ✅ Updates .env file
- ✅ Validates schema
- ✅ Runs migrations
- ✅ Performance testing

### **Step 4: Validate Production Setup**

```bash
# Run production validation
tsx scripts/production-validate.ts

# Or manually validate
pnpm validate:db
```

### **Step 5: Deploy Schema**

```bash
# Option A: Use migrations (recommended)
pnpm db:generate  # Review generated files
pnpm db:migrate   # Apply migrations

# Option B: Push schema (development only)
# pnpm db:push  # NOT recommended for production
```

---

## 🔒 Production Security Requirements

### **Connection String Requirements**

✅ **MUST HAVE**:
- Pooler endpoint (`-pooler.neon.tech`)
- SSL required (`sslmode=require`)
- Channel binding (`channel_binding=require`)

✅ **RECOMMENDED**:
- Connection timeout (`connect_timeout=10`)
- Pool timeout (`pool_timeout=0`)

### **Example Production Connection String**

```env
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connect_timeout=10&pool_timeout=0
```

### **Security Checklist**

- [ ] Connection string uses pooler endpoint
- [ ] SSL is required
- [ ] Channel binding enabled
- [ ] Connection string in `.env` (not committed)
- [ ] Credentials rotated if exposed
- [ ] No secrets in code or logs
- [ ] Environment variables validated

---

## 📊 Production Performance Targets

### **Connection Performance**

- **Cold Start**: < 200ms
- **Warm Connection**: < 50ms
- **Query Latency**: < 100ms (typical)
- **Migration Time**: < 5s (typical schema)

### **Monitoring**

```bash
# Test connection performance
pnpm validate:db

# Run performance tests
pnpm test:db-performance

# Monitor in production
# Set up alerts for:
# - Connection time > 500ms
# - Query time > 1s
# - Error rate > 1%
```

---

## 🔄 Production Deployment Workflow

### **1. Pre-Deployment**

```bash
# 1. Review schema changes
pnpm db:generate

# 2. Test migrations locally
pnpm db:migrate

# 3. Validate connection
pnpm validate:db

# 4. Run tests
pnpm test:db
```

### **2. Deployment**

```bash
# 1. Set production environment
export NODE_ENV=production

# 2. Run production setup
tsx scripts/production-setup.ts --project-id <id>

# 3. Validate production
tsx scripts/production-validate.ts
```

### **3. Post-Deployment**

```bash
# 1. Verify connection
pnpm validate:db

# 2. Check performance
pnpm test:db-performance

# 3. Monitor logs
# Watch for errors, slow queries, etc.
```

---

## 🛡️ Production Best Practices

### **1. Always Use Migrations**

```bash
# ✅ DO (Production)
pnpm db:generate
pnpm db:migrate

# ❌ DON'T (Production)
pnpm db:push  # Only for development
```

### **2. Test Before Production**

```bash
# Test on staging branch first
neonctl branches create --name staging --project-id <id>
pnpm neon:branch switch --name staging --project-id <id>
pnpm db:migrate
pnpm validate:db
```

### **3. Monitor Performance**

```bash
# Regular performance checks
pnpm test:db-performance

# Monitor connection times
pnpm validate:db
```

### **4. Backup Strategy**

- ✅ Use Neon's automatic backups
- ✅ Use point-in-time recovery
- ✅ Test recovery procedures
- ✅ Document backup schedule

### **5. Error Handling**

- ✅ Log all database errors
- ✅ Set up alerts for failures
- ✅ Monitor error rates
- ✅ Have rollback plan ready

---

## 📝 Production Environment Variables

### **Required**

```env
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connect_timeout=10&pool_timeout=0
NODE_ENV=production
```

### **Recommended**

```env
LOG_LEVEL=info
NEXT_PUBLIC_APP_URL=https://your-production-url.com
```

### **Optional**

```env
ANALYTICS_ENABLED=true
ANALYTICS_ENDPOINT=https://your-analytics-endpoint.com
```

---

## 🔍 Production Validation

### **Automated Validation**

```bash
# Run full production validation
tsx scripts/production-validate.ts
```

**Checks**:
- ✅ Environment variables
- ✅ Connection string security
- ✅ Schema integrity
- ✅ Migration status
- ✅ Performance metrics

### **Manual Validation**

```bash
# 1. Validate connection
pnpm validate:db

# 2. Check schema
pnpm db:studio  # Visual inspection

# 3. Test queries
# Run sample queries to verify functionality

# 4. Performance test
pnpm test:db-performance
```

---

## 🚨 Production Troubleshooting

### **Connection Issues**

```bash
# Check connection
pnpm validate:db

# Verify connection string
echo $DATABASE_URL

# Test with Neon CLI
neonctl connection-string main --pooled --ssl require
```

### **Migration Issues**

```bash
# Check migration status
pnpm db:generate  # See if new migrations needed

# Review migration files
ls drizzle/

# Rollback if needed
# (Manual process - review migration files)
```

### **Performance Issues**

```bash
# Test performance
pnpm test:db-performance

# Check connection time
pnpm validate:db

# Monitor in Neon dashboard
```

---

## 📚 Production Scripts

### **Available Scripts**

```bash
# Production setup
tsx scripts/production-setup.ts --project-id <id>

# Production validation
tsx scripts/production-validate.ts

# Connection sync
pnpm neon:sync --env production

# Branch management
pnpm neon:branch switch --name main --project-id <id> --env production
```

---

## ✅ Production Readiness Checklist

### **Configuration**
- [ ] Production connection string configured
- [ ] Environment variables set
- [ ] Security settings validated
- [ ] Drizzle configured

### **Schema**
- [ ] Schema reviewed
- [ ] Migrations generated
- [ ] Migrations tested
- [ ] Schema deployed

### **Security**
- [ ] SSL enabled
- [ ] Channel binding enabled
- [ ] Credentials secured
- [ ] No secrets in code

### **Performance**
- [ ] Connection time < 200ms
- [ ] Performance tests passing
- [ ] Monitoring configured
- [ ] Alerts set up

### **Operations**
- [ ] Backup strategy in place
- [ ] Recovery procedures documented
- [ ] Rollback plan ready
- [ ] Team trained

---

## 🎯 Quick Production Setup

```bash
# 1. Get production connection string
neonctl connection-string main --project-id <id> --pooled --ssl require

# 2. Add to .env.production
DATABASE_URL=<connection-string>
NODE_ENV=production

# 3. Run production setup
tsx scripts/production-setup.ts --project-id <id>

# 4. Validate
tsx scripts/production-validate.ts

# 5. Deploy
pnpm db:migrate
```

---

**Status**: ✅ Production-Ready
**Last Updated**: 2026-01-11
**Version**: 1.0.0
