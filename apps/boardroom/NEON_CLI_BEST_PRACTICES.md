# Neon CLI Best Practices Guide

## 🔐 Security Best Practices

### 1. **Authentication & Credentials**

```bash
# ✅ DO: Authenticate once, use context
neonctl auth
neonctl set-context --project-id <id>

# ❌ DON'T: Hardcode credentials in scripts
# ❌ DON'T: Commit connection strings to git
```

**Best Practice**:
- Authenticate once per session
- Use `set-context` to avoid repeated prompts
- Store connection strings in `.env` (gitignored)
- Rotate credentials if exposed

### 2. **Connection String Security**

```bash
# ✅ DO: Use pooler endpoint with SSL
neonctl connection-string --pooled --ssl require

# ✅ DO: Include channel binding for production
neonctl connection-string --pooled --ssl require --database-name neondb

# ❌ DON'T: Use direct endpoint for applications
# ❌ DON'T: Skip SSL in production
```

**Best Practice**:
- Always use `--pooled` for serverless applications
- Always use `--ssl require` for production
- Add `channel_binding=require` for enhanced security
- Never commit connection strings to version control

### 3. **Environment Management**

```bash
# ✅ DO: Use different projects/branches for environments
neonctl branches create --name dev --project-id <id>
neonctl branches create --name staging --project-id <id>

# ✅ DO: Use environment-specific connection strings
# Development: dev branch
# Staging: staging branch
# Production: main branch

# ❌ DON'T: Use same database for all environments
# ❌ DON'T: Share production credentials
```

---

## ⚡ Performance Best Practices

### 1. **Connection String Optimization**

```bash
# ✅ DO: Always use pooler endpoint
neonctl connection-string --pooled

# ✅ DO: Set appropriate timeouts
# Connection string should include:
# ?sslmode=require&channel_binding=require&connect_timeout=10&pool_timeout=0

# ❌ DON'T: Use direct endpoint for applications
# ❌ DON'T: Skip connection pooling
```

**Best Practice**:
- Pooler endpoint: Better for serverless, connection pooling
- Direct endpoint: Only for migrations/admin tasks
- Set `connect_timeout=10` for reasonable timeout
- Set `pool_timeout=0` for unlimited pool (serverless-optimized)

### 2. **Context Management**

```bash
# ✅ DO: Set context to avoid prompts
neonctl set-context --project-id <id>

# ✅ DO: Verify context before operations
neonctl set-context  # Shows current context

# ❌ DON'T: Run commands without context (causes prompts)
```

**Best Practice**:
- Set context at start of session
- Use `--project-id` flag if context not set
- Verify context before destructive operations

### 3. **Branch Strategy**

```bash
# ✅ DO: Use branches for feature development
neonctl branches create --name feature-xyz --project-id <id>

# ✅ DO: Use main branch for production
# ✅ DO: Use separate branches for dev/staging

# ❌ DON'T: Develop directly on production branch
# ❌ DON'T: Create too many branches (manage complexity)
```

**Best Practice**:
- One branch per feature/environment
- Use descriptive branch names
- Delete branches after merging
- Use point-in-time recovery for critical data

---

## 🔄 Workflow Best Practices

### 1. **Development Workflow**

```bash
# ✅ DO: Create feature branch
neonctl branches create --name feature-xyz --project-id <id>

# ✅ DO: Get connection string for branch
neonctl connection-string feature-xyz --pooled --ssl require

# ✅ DO: Update .env with branch connection string
# ✅ DO: Test on branch before merging

# ❌ DON'T: Work directly on main branch
# ❌ DON'T: Skip testing on branch
```

### 2. **Schema Management**

```bash
# ✅ DO: Use Drizzle migrations for schema changes
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Apply migrations

# ✅ DO: Test migrations on branch first
# ✅ DO: Review migration files before applying

# ❌ DON'T: Use db:push in production (use migrations)
# ❌ DON'T: Skip migration testing
```

### 3. **Connection String Sync**

```bash
# ✅ DO: Use automated sync script
pnpm neon:sync --auto-push

# ✅ DO: Verify connection after sync
pnpm validate:db

# ❌ DON'T: Manually copy-paste connection strings
# ❌ DON'T: Skip validation after sync
```

---

## 📊 Monitoring & Maintenance

### 1. **Regular Checks**

```bash
# ✅ DO: Monitor project status
neonctl projects get <project-id>

# ✅ DO: Check branch status
neonctl branches list --project-id <id>

# ✅ DO: Monitor operations
neonctl operations list --project-id <id>

# ❌ DON'T: Ignore operation failures
# ❌ DON'T: Skip regular health checks
```

### 2. **Performance Monitoring**

```bash
# ✅ DO: Test connection performance
pnpm validate:db

# ✅ DO: Run performance tests
pnpm test:db-performance

# ✅ DO: Monitor connection times
# Target: < 200ms (cold), < 50ms (warm)

# ❌ DON'T: Ignore slow connections
# ❌ DON'T: Skip performance testing
```

### 3. **Backup & Recovery**

```bash
# ✅ DO: Use point-in-time recovery
neonctl connection-string main@2024-01-01T00:00:00Z --pooled

# ✅ DO: Create branches for testing
# ✅ DO: Document recovery procedures

# ❌ DON'T: Rely only on Neon backups
# ❌ DON'T: Skip recovery testing
```

---

## 🛠️ Integration Best Practices

### 1. **With Drizzle**

```bash
# ✅ DO: Sync connection string before migrations
pnpm neon:sync
pnpm db:generate
pnpm db:migrate

# ✅ DO: Use migrations for production
# ✅ DO: Test migrations on branch first

# ❌ DON'T: Use db:push in production
# ❌ DON'T: Skip migration generation
```

### 2. **With CI/CD**

```bash
# ✅ DO: Use API keys in CI/CD
neonctl --api-key <key> connection-string --pooled

# ✅ DO: Set context in CI/CD
neonctl set-context --project-id <id>

# ✅ DO: Use environment-specific branches
# Development: dev branch
# Staging: staging branch
# Production: main branch

# ❌ DON'T: Use interactive prompts in CI/CD
# ❌ DON'T: Hardcode credentials
```

### 3. **With Environment Variables**

```bash
# ✅ DO: Store connection strings in .env
DATABASE_URL=postgresql://...@ep-xxx-pooler.neon.tech/db?sslmode=require

# ✅ DO: Use different .env files per environment
# .env.development
# .env.staging
# .env.production

# ✅ DO: Load .env automatically in scripts

# ❌ DON'T: Commit .env files
# ❌ DON'T: Share .env files
```

---

## 🎯 Command Best Practices

### 1. **Connection String Commands**

```bash
# ✅ BEST: Full optimization
neonctl connection-string \
  --pooled \
  --ssl require \
  --database-name neondb \
  --role-name neondb_owner

# ✅ GOOD: With context set
neonctl connection-string --pooled --ssl require

# ⚠️ ACCEPTABLE: Interactive (slower)
neonctl connection-string --pooled
```

### 2. **Project Management**

```bash
# ✅ DO: List projects in JSON for scripts
neonctl projects list --output json

# ✅ DO: Get project details
neonctl projects get <project-id>

# ✅ DO: Use descriptive project names

# ❌ DON'T: Create too many projects
# ❌ DON'T: Use generic project names
```

### 3. **Branch Management**

```bash
# ✅ DO: Use descriptive branch names
neonctl branches create --name feature-user-auth --project-id <id>

# ✅ DO: List branches before creating
neonctl branches list --project-id <id>

# ✅ DO: Delete unused branches
neonctl branches delete <branch-id> --project-id <id>

# ❌ DON'T: Create branches with generic names
# ❌ DON'T: Leave unused branches
```

---

## 🔍 Error Handling

### 1. **Common Errors & Solutions**

```bash
# Error: "Multiple projects found"
# Solution: Use --project-id flag
neonctl connection-string --project-id <id> --pooled

# Error: "Authentication required"
# Solution: Run neonctl auth
neonctl auth

# Error: "Project not found"
# Solution: Verify project ID
neonctl projects list

# Error: "Connection timeout"
# Solution: Check Neon dashboard (project may be paused)
# Solution: Verify connection string format
```

### 2. **Validation**

```bash
# ✅ DO: Always validate after changes
pnpm validate:db

# ✅ DO: Test connection before using
# ✅ DO: Check error messages carefully

# ❌ DON'T: Ignore validation errors
# ❌ DON'T: Skip connection testing
```

---

## 📝 Scripting Best Practices

### 1. **Non-Interactive Scripts**

```bash
# ✅ DO: Set context or use --project-id
neonctl set-context --project-id <id>
neonctl connection-string --pooled

# ✅ DO: Use --output json for parsing
neonctl projects list --output json

# ✅ DO: Handle errors gracefully
set -e  # Exit on error
```

### 2. **Automation**

```bash
# ✅ DO: Use environment variables
export NEON_PROJECT_ID=<id>
neonctl connection-string --project-id $NEON_PROJECT_ID --pooled

# ✅ DO: Use API keys for CI/CD
neonctl --api-key $NEON_API_KEY connection-string --pooled

# ❌ DON'T: Use interactive prompts in scripts
# ❌ DON'T: Hardcode values
```

---

## 🚀 Quick Reference: Do's and Don'ts

### ✅ DO's

- ✅ Always use `--pooled` for applications
- ✅ Always use `--ssl require` for production
- ✅ Set context to avoid prompts
- ✅ Use branches for feature development
- ✅ Use migrations for schema changes
- ✅ Validate connections regularly
- ✅ Monitor performance
- ✅ Use descriptive names
- ✅ Clean up unused branches
- ✅ Test on branches before production

### ❌ DON'Ts

- ❌ Don't use direct endpoint for applications
- ❌ Don't skip SSL in production
- ❌ Don't commit connection strings
- ❌ Don't work directly on production
- ❌ Don't use db:push in production
- ❌ Don't ignore errors
- ❌ Don't skip validation
- ❌ Don't create too many branches
- ❌ Don't use generic names
- ❌ Don't skip testing

---

## 📚 Recommended Workflows

### **Daily Development**

```bash
# 1. Set context (once per session)
neonctl set-context --project-id <id>

# 2. Get connection string
pnpm neon:cs > .env.local

# 3. Validate
pnpm validate:db

# 4. Work on feature
# ... make changes ...

# 5. Test
pnpm test:db
```

### **Feature Development**

```bash
# 1. Create feature branch
pnpm neon:branch create --name feature-xyz --project-id <id> --env development

# 2. Make schema changes
# Edit: apps/boardroom/src/db/schema/*.ts

# 3. Generate migrations
pnpm db:generate

# 4. Push to branch
pnpm db:push

# 5. Test
pnpm validate:db
pnpm test:db
```

### **Production Deployment**

```bash
# 1. Switch to production
pnpm neon:branch switch --name main --project-id <id> --env production

# 2. Review migrations
pnpm db:generate  # Review files

# 3. Run migrations
pnpm db:migrate

# 4. Validate
pnpm validate:db

# 5. Monitor
pnpm test:db-performance
```

---

## 🎓 Advanced Best Practices

### 1. **Point-in-Time Recovery**

```bash
# ✅ DO: Use for data recovery
neonctl connection-string main@2024-01-01T00:00:00Z --pooled

# ✅ DO: Document recovery procedures
# ✅ DO: Test recovery process

# ❌ DON'T: Rely only on point-in-time recovery
```

### 2. **Multi-Database Strategy**

```bash
# ✅ DO: Use separate databases for different purposes
neonctl databases create --project-id <id> --name analytics_db

# ✅ DO: Use role-based access
neonctl connection-string --role-name readonly_user --pooled

# ❌ DON'T: Mix different data types in one database
```

### 3. **Performance Tuning**

```bash
# ✅ DO: Monitor connection times
# Target: < 200ms (cold), < 50ms (warm)

# ✅ DO: Use connection pooling
# ✅ DO: Optimize query patterns

# ❌ DON'T: Ignore slow queries
# ❌ DON'T: Skip performance monitoring
```

---

## 🔗 Integration Checklist

- [ ] Neon CLI installed and authenticated
- [ ] Context set for project
- [ ] Connection string optimized (pooler + SSL)
- [ ] Environment variables configured
- [ ] Branches created for dev/staging/prod
- [ ] Drizzle migrations configured
- [ ] Validation scripts working
- [ ] Performance tests passing
- [ ] Documentation updated
- [ ] Team trained on workflows

---

## 📖 Additional Resources

- **Neon CLI Docs**: https://neon.com/docs/reference/neon-cli
- **Neon Best Practices**: https://neon.tech/docs/guides
- **Drizzle Integration**: See `NEON_DRIZZLE_SYNERGY.md`
- **Quick Reference**: See `QUICK_REFERENCE.md`

---

**Status**: ✅ Best Practices Documented
**Last Updated**: 2026-01-11
**Version**: 1.0.0
