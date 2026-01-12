# Turborepo Quick Reference

**Essential commands and configurations for daily development**

---

## Common Commands

### Development

```bash
# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm dev:docs
pnpm dev:boardroom

# Run with filter
turbo run dev --filter=@mythic/docs
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
turbo run build --filter=@mythic/docs

# Build changed packages only
turbo run build --filter=[HEAD^1]

# Build with dependencies
turbo run build --filter=@mythic/docs^...
```

### Quality Checks

```bash
# Lint all
pnpm lint

# Type check all
pnpm type-check

# Test all
pnpm test

# Run specific task
turbo run lint --filter=@mythic/boardroom
```

### Cache Management

```bash
# Clear cache
turbo run build --force

# View cache status
turbo run build --summarize

# Dry run (preview)
turbo run build --dry-run
```

### Analysis

```bash
# Dependency graph
turbo run build --graph

# Build summary
turbo run build --summarize

# See what would run
turbo run build --dry-run
```

---

## Task Dependencies

### Common Patterns

```json
{
  "build": {
    "dependsOn": ["^build"],  // Build deps first
    "outputs": [".next/**"],
    "cache": true
  },
  "dev": {
    "cache": false,
    "persistent": true,
    "dependsOn": []
  },
  "lint": {
    "dependsOn": ["^build"],
    "cache": true
  },
  "test": {
    "dependsOn": ["build"],
    "cache": true
  }
}
```

### Dependency Operators

- **`^build`** - Build dependencies first
- **`build`** - Run build task in same package first
- **No prefix** - Run in parallel

---

## Filtering

### Filter by Package

```bash
# Single package
turbo run build --filter=@mythic/docs

# Multiple packages
turbo run build --filter=@mythic/docs --filter=@mythic/boardroom

# Package and dependencies
turbo run build --filter=@mythic/docs^...

# Package and dependents
turbo run build --filter=...@mythic/shared-utils
```

### Filter by Change

```bash
# Changed since last commit
turbo run build --filter=[HEAD^1]

# Changed in branch
turbo run build --filter=[origin/main...]
```

---

## Configuration Tips

### Optimize Cache

```json
{
  "tasks": {
    "build": {
      "outputs": [
        ".next/**",
        "!.next/cache/**",  // Exclude cache
        "dist/**"
      ]
    }
  }
}
```

### Global Dependencies

```json
{
  "globalDependencies": [
    "package.json",
    "pnpm-lock.yaml",
    "tsconfig.json",
    "next.config.mjs"
  ]
}
```

### Environment Variables

```json
{
  "tasks": {
    "build": {
      "env": ["NODE_ENV", "NEXT_PUBLIC_*"]
    }
  }
}
```

---

## Troubleshooting

### Cache Not Working

```bash
# Force rebuild
turbo run build --force

# Clear .turbo directory
rm -rf .turbo
```

### Slow Builds

```bash
# Check what's running
turbo run build --summarize

# See dependency graph
turbo run build --graph
```

### Type Errors

```bash
# Rebuild TypeScript project references
pnpm type-check

# Clear TS build info
find . -name "tsconfig.tsbuildinfo" -delete
```

---

## Best Practices

1. **Cache build outputs** - `.next/`, `dist/`
2. **Don't cache dev servers** - Set `cache: false`
3. **Use `^build`** - Build dependencies first
4. **Declare global deps** - Config files that affect builds
5. **Filter when possible** - Don't build everything

---

**Quick Tip**: Use `turbo run build --summarize` to see build performance and cache hits.
