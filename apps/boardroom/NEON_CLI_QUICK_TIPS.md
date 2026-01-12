# Neon CLI Quick Tips & Best Practices

## 🎯 Top 10 Best Practices

### 1. **Always Use Pooler Endpoint**
```bash
# ✅ DO
neonctl connection-string --pooled

# ❌ DON'T (direct endpoint - slower)
neonctl connection-string
```

### 2. **Set Context to Avoid Prompts**
```bash
# ✅ DO (once per session)
neonctl set-context --project-id <id>

# ❌ DON'T (causes prompts)
neonctl connection-string --pooled  # Without context
```

### 3. **Always Use SSL in Production**
```bash
# ✅ DO
neonctl connection-string --pooled --ssl require

# ❌ DON'T
neonctl connection-string --pooled  # Missing SSL
```

### 4. **Use Branches for Development**
```bash
# ✅ DO
neonctl branches create --name dev --project-id <id>

# ❌ DON'T
# Work directly on main/production branch
```

### 5. **Use Migrations, Not db:push in Production**
```bash
# ✅ DO (production)
pnpm db:generate
pnpm db:migrate

# ⚠️ OK (development)
pnpm db:push
```

### 6. **Never Commit Connection Strings**
```bash
# ✅ DO
# Store in .env (gitignored)

# ❌ DON'T
# Commit to git, share in chat, etc.
```

### 7. **Validate After Changes**
```bash
# ✅ DO
pnpm validate:db

# ❌ DON'T
# Skip validation
```

### 8. **Use Descriptive Names**
```bash
# ✅ DO
neonctl branches create --name feature-user-auth

# ❌ DON'T
neonctl branches create --name test
```

### 9. **Monitor Performance**
```bash
# ✅ DO
pnpm test:db-performance

# ❌ DON'T
# Ignore slow connections
```

### 10. **Clean Up Unused Branches**
```bash
# ✅ DO
neonctl branches delete <branch-id> --project-id <id>

# ❌ DON'T
# Leave unused branches
```

---

## 🚀 One-Liner Best Practices

```bash
# Get optimized connection string
neonctl connection-string --pooled --ssl require --database-name neondb

# Set context (avoid prompts)
neonctl set-context --project-id <id>

# Create feature branch
neonctl branches create --name feature-xyz --project-id <id>

# List projects (JSON for scripts)
neonctl projects list --output json

# Sync connection string
pnpm neon:sync --auto-push
```

---

## 🔒 Security Checklist

- [ ] Using pooler endpoint
- [ ] SSL enabled
- [ ] Channel binding enabled
- [ ] Connection strings in .env (not committed)
- [ ] Different projects/branches per environment
- [ ] Context set (avoid prompts)
- [ ] Credentials rotated if exposed

---

## ⚡ Performance Checklist

- [ ] Pooler endpoint used
- [ ] Connection timeout configured (10s)
- [ ] Pool timeout optimized (0 for serverless)
- [ ] Connection time < 200ms (cold)
- [ ] Connection time < 50ms (warm)
- [ ] Performance tests passing

---

## 📋 Daily Workflow Checklist

```bash
# Morning
1. neonctl set-context --project-id <id>
2. pnpm neon:cs  # Get connection string
3. pnpm validate:db  # Verify connection

# During Development
4. Make changes
5. pnpm db:generate  # Generate migrations
6. pnpm db:push  # Test on branch
7. pnpm test:db  # Run tests

# Before Committing
8. pnpm validate:db  # Final check
9. Review migrations
10. Commit changes
```

---

## 🎓 Pro Tips

### **Tip 1: Use Aliases**
```bash
# Add to your shell profile
alias neon-cs='neonctl connection-string --pooled --ssl require'
alias neon-projects='neonctl projects list'
```

### **Tip 2: JSON Output for Scripts**
```bash
# Parse in scripts
neonctl projects list --output json | jq '.[0].id'
```

### **Tip 3: Point-in-Time Recovery**
```bash
# Recover data from specific time
neonctl connection-string main@2024-01-01T00:00:00Z --pooled
```

### **Tip 4: Multi-Environment Setup**
```bash
# Development
neonctl branches create --name dev --project-id <id>

# Staging
neonctl branches create --name staging --project-id <id>

# Production (main branch)
# Use main branch for production
```

---

## 🚨 Common Mistakes to Avoid

1. ❌ **Using direct endpoint** → Use `--pooled`
2. ❌ **Skipping SSL** → Always use `--ssl require`
3. ❌ **Working on production** → Use branches
4. ❌ **Using db:push in production** → Use migrations
5. ❌ **Committing connection strings** → Use .env
6. ❌ **Ignoring validation** → Always validate
7. ❌ **Generic branch names** → Use descriptive names
8. ❌ **Leaving unused branches** → Clean up
9. ❌ **Skipping performance tests** → Monitor regularly
10. ❌ **No context set** → Set context first

---

## 📚 Quick Reference

| Task | Command |
|------|---------|
| Get connection string | `pnpm neon:cs` |
| Set context | `pnpm neon:context --project-id <id>` |
| List projects | `pnpm neon:projects` |
| Sync connection | `pnpm neon:sync` |
| Create branch | `pnpm neon:branch create --name dev --project-id <id>` |
| Switch branch | `pnpm neon:branch switch --name staging --project-id <id>` |
| Validate | `pnpm validate:db` |
| Push schema | `pnpm db:push` |
| Generate migrations | `pnpm db:generate` |
| Run migrations | `pnpm db:migrate` |

---

**For complete guide**: See `NEON_CLI_BEST_PRACTICES.md`
