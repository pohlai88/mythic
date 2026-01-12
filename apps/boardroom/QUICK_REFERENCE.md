# Neon CLI + Drizzle Quick Reference

## 🚀 Most Common Commands

### Connection Management
```bash
# Sync connection string (auto-detect)
pnpm neon:sync

# Get connection string manually
pnpm neon:cs

# Validate connection
pnpm validate:db
```

### Branch Management
```bash
# Create branch
pnpm neon:branch create --name dev --project-id <id> --env development

# Switch branch
pnpm neon:branch switch --name staging --project-id <id> --env staging

# List branches
pnpm neon:branch list --project-id <id>
```

### Schema Management
```bash
# Push schema (no migrations)
pnpm db:push

# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Studio
pnpm db:studio
```

### Neon CLI Quick
```bash
# Get connection string
pnpm neon:cs

# List projects
pnpm neon:projects

# Set context
pnpm neon:context --project-id <id>
```

## 📋 Workflow Cheat Sheet

### New Feature Development
```bash
1. pnpm neon:branch create --name feature-xyz --project-id <id> --env development --auto-sync
2. # Make schema changes
3. pnpm db:generate
4. pnpm db:push
5. pnpm validate:db
```

### Deploy to Staging
```bash
1. pnpm neon:branch switch --name staging --project-id <id> --env staging
2. pnpm db:migrate
3. pnpm validate:db
```

### Deploy to Production
```bash
1. pnpm neon:branch switch --name main --project-id <id> --env production
2. pnpm db:generate  # Review
3. pnpm db:migrate
4. pnpm validate:db
```

## 🎯 One-Liners

```bash
# Full sync with auto-push
pnpm neon:sync --auto-push

# Production sync with migrations
pnpm neon:sync --env production --auto-migrate

# Quick branch switch
pnpm neon:branch switch --name dev --project-id <id> --env development --auto-sync
```

---

**For full documentation**: See `NEON_DRIZZLE_SYNERGY.md`
