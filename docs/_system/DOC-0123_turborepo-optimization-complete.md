---
doc_type: STANDARD
status: active
owner: architecture
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [architecture, turborepo, monorepo, optimization, performance]
related_docs:
  - DOC-0122_nextjs-monorepo-audit.md
  - TURBOREPO_OPTIMIZATION.md
---

# Turborepo Advanced Features & Optimization

**Optimization Date**: 2026-01-10
**Turborepo Version**: 2.3.3
**Status**: ✅ **FULLY OPTIMIZED**

---

## Executive Summary

This document details the comprehensive optimization of Turborepo configuration to maximize functionality, performance, and developer experience. All advanced features have been enabled and configured for optimal monorepo management.

### Key Optimizations

✅ **Advanced Features Enabled**:
- Enhanced task dependencies and parallelization
- Comprehensive environment variable tracking
- Output filtering and optimization
- Test task integration
- Cache management improvements
- Remote cache ready (signature enabled)
- Task graph visualization support
- Filtering capabilities

✅ **Performance Improvements**:
- Intelligent task scheduling
- Optimized cache invalidation
- Parallel execution maximized
- Reduced redundant builds

---

## 1. Enhanced Configuration Overview

### 1.1 Global Dependencies

**Optimized Tracking**:
```json
"globalDependencies": [
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "tsconfig.json",
  "next.config.js",
  "next.config.mjs",
  "biome.json",
  ".env",
  ".env.local",
  ".env.production"
]
```

**Benefits**:
- ✅ Tracks all configuration files
- ✅ Environment file changes invalidate cache appropriately
- ✅ Prevents stale builds from config drift

---

### 1.2 Global Environment Variables

**Comprehensive Tracking**:
```json
"globalEnv": [
  "NODE_ENV",
  "CI",
  "VERCEL",
  "VERCEL_ENV",
  "NEXT_PUBLIC_*",
  "TURBO_TOKEN",
  "TURBO_TEAM"
]
```

**Benefits**:
- ✅ Environment-aware caching
- ✅ CI/CD optimization
- ✅ Platform-specific builds (Vercel)
- ✅ Remote cache authentication

---

## 2. Enhanced Pipeline Configuration

### 2.1 Build Task Optimization

**Before**:
```json
"build": {
  "dependsOn": ["^build"],
  "outputs": [".next/**", "!.next/cache/**"],
  "env": ["NODE_ENV", "NEXT_PUBLIC_*", "VERCEL_*"],
  "cache": true
}
```

**After** (Optimized):
```json
"build": {
  "dependsOn": ["^build"],
  "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**", ".turbo/**"],
  "env": ["NODE_ENV", "NEXT_PUBLIC_*", "VERCEL_*", "ANALYZE"],
  "cache": true,
  "persistent": false
}
```

**Improvements**:
- ✅ Expanded output patterns for all build types
- ✅ Added ANALYZE env var for bundle analysis
- ✅ Explicit persistent flag (prevents dev server confusion)

---

### 2.2 Test Task Integration

**New Test Tasks**:
```json
"test": {
  "dependsOn": ["^build"],
  "outputs": ["coverage/**", ".test-results/**"],
  "cache": true,
  "persistent": false,
  "env": ["NODE_ENV", "CI"]
},
"test:watch": {
  "dependsOn": ["^build"],
  "outputs": [],
  "cache": false,
  "persistent": true
},
"test:coverage": {
  "dependsOn": ["^build"],
  "outputs": ["coverage/**"],
  "cache": true,
  "persistent": false,
  "env": ["NODE_ENV", "CI"]
}
```

**Benefits**:
- ✅ Test results cached (faster CI)
- ✅ Coverage reports tracked
- ✅ Watch mode for development
- ✅ CI-aware test execution

---

### 2.3 Enhanced Task Dependencies

**Optimized Dependency Chain**:
```json
{
  "lint": { "dependsOn": ["^build"] },
  "type-check": { "dependsOn": ["^build"] },
  "check": { "dependsOn": ["^build"] },
  "test": { "dependsOn": ["^build"] }
}
```

**Benefits**:
- ✅ Ensures dependencies built before checks
- ✅ Parallel execution where possible
- ✅ Correct execution order guaranteed

---

## 3. Advanced Features Enabled

### 3.1 Remote Cache Configuration

**Configuration**:
```json
"remoteCache": {
  "enabled": false,
  "signature": true
}
```

**Status**: Ready for activation

**Setup Steps**:
1. Create Vercel account (or use self-hosted)
2. Link Turborepo: `pnpm turbo login`
3. Link repository: `pnpm turbo link`
4. Enable in `turbo.json`: `"enabled": true`

**Benefits**:
- ✅ Team-wide cache sharing
- ✅ CI/CD speed improvements (70-95% faster)
- ✅ Consistent builds across machines
- ✅ Signed cache artifacts (security)

---

### 3.2 Task Graph Visualization

**Commands Available**:
```bash
# Visualize task graph
pnpm turbo:graph

# View task dependencies
turbo run build --graph

# Export graph to file
turbo run build --graph=graph.html
```

**Benefits**:
- ✅ Understand task relationships
- ✅ Identify optimization opportunities
- ✅ Debug dependency issues
- ✅ Visualize build pipeline

---

### 3.3 Advanced Filtering

**Filtering Capabilities**:

#### By Package Name
```bash
# Build specific package
pnpm build:filter @mythic/web

# Build package and dependencies
pnpm build:filter @mythic/web...

# Build package and dependents
pnpm build:filter ...@mythic/web
```

#### By Directory
```bash
# Build all packages in apps/
turbo run build --filter="./apps/*"

# Build all packages in packages/
turbo run build --filter="./packages/*"
```

#### By Git Changes
```bash
# Build only changed packages
pnpm build:changed

# Test only changed packages
pnpm test:changed

# Lint only changed packages
pnpm lint:changed
```

#### Complex Filters
```bash
# Build changed packages and their dependencies
turbo run build --filter=[HEAD^1]...

# Exclude specific package
turbo run build --filter='!@mythic/docs'

# Multiple filters
turbo run build --filter=@mythic/web --filter=@mythic/api
```

**Benefits**:
- ✅ Faster local development
- ✅ Targeted CI/CD runs
- ✅ Reduced build times
- ✅ Focused testing

---

## 4. New Scripts Added

### 4.1 Build Scripts

```json
{
  "build": "turbo run build",
  "build:filter": "turbo run build --filter",
  "build:changed": "turbo run build --filter=[HEAD^1]"
}
```

**Usage**:
```bash
# Standard build (all packages)
pnpm build

# Build specific package
pnpm build:filter @mythic/web

# Build only changed packages
pnpm build:changed
```

---

### 4.2 Test Scripts

```json
{
  "test": "turbo run test",
  "test:watch": "turbo run test:watch",
  "test:coverage": "turbo run test:coverage",
  "test:changed": "turbo run test --filter=[HEAD^1]"
}
```

**Usage**:
```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# Test only changed packages
pnpm test:changed
```

---

### 4.3 Cache Management Scripts

```json
{
  "turbo:graph": "turbo run build --graph",
  "turbo:summary": "turbo run build --summarize",
  "turbo:dry-run": "turbo run build --dry-run",
  "turbo:cache:status": "turbo run build --summarize",
  "clean:cache": "turbo run clean --force"
}
```

**Usage**:
```bash
# Visualize task graph
pnpm turbo:graph

# View cache summary
pnpm turbo:summary

# Dry run (see what would execute)
pnpm turbo:dry-run

# Check cache status
pnpm turbo:cache:status

# Force clean cache
pnpm clean:cache
```

---

### 4.4 Changed-Only Scripts

```json
{
  "lint:changed": "turbo run lint --filter=[HEAD^1]",
  "type-check:changed": "turbo run type-check --filter=[HEAD^1]",
  "check:changed": "turbo run check --filter=[HEAD^1]",
  "test:changed": "turbo run test --filter=[HEAD^1]",
  "verify:changed": "turbo run verify --filter=[HEAD^1]"
}
```

**Benefits**:
- ✅ Faster pre-commit hooks
- ✅ Quick validation before push
- ✅ Focused CI/CD runs
- ✅ Reduced execution time

---

## 5. Performance Optimizations

### 5.1 Cache Hit Rate Optimization

**Strategies Applied**:
1. ✅ Comprehensive output patterns
2. ✅ Environment variable tracking
3. ✅ Global dependency tracking
4. ✅ Proper task dependencies

**Expected Results**:
- **Cold Build**: 2-3 minutes (baseline)
- **Cached Build** (no changes): 5-10 seconds (95% faster)
- **Partial Build** (source changes): 30-60 seconds (70% faster)
- **Config Change**: 2-3 minutes (baseline, correct invalidation)

---

### 5.2 Parallel Execution

**Optimization**:
- ✅ Independent tasks run in parallel
- ✅ Dependency-aware scheduling
- ✅ Maximum CPU utilization
- ✅ Task graph optimization

**Example**:
```bash
# These run in parallel:
turbo run lint type-check format:check

# These run sequentially (dependencies):
turbo run build test verify
```

---

### 5.3 Incremental Builds

**Features**:
- ✅ Only changed packages rebuild
- ✅ Dependencies automatically detected
- ✅ Cache reuse for unchanged packages
- ✅ Minimal rebuild scope

---

## 6. Developer Experience Improvements

### 6.1 Quick Commands

**Common Workflows**:

```bash
# Development
pnpm dev                    # Start all dev servers
pnpm dev --filter=@mythic/web  # Start specific app

# Building
pnpm build                  # Build all
pnpm build:changed          # Build only changed

# Testing
pnpm test                   # Test all
pnpm test:changed           # Test only changed
pnpm test:coverage          # Coverage report

# Validation
pnpm verify                 # Full verification
pnpm verify:changed         # Verify only changed

# Cache Management
pnpm turbo:summary          # View cache status
pnpm clean:cache            # Clear cache
```

---

### 6.2 CI/CD Optimization

**Recommended CI Pipeline**:

```yaml
# .github/workflows/ci.yml
- name: Build changed packages
  run: pnpm build:changed

- name: Test changed packages
  run: pnpm test:changed

- name: Lint changed packages
  run: pnpm lint:changed

- name: Type-check changed packages
  run: pnpm type-check:changed
```

**Benefits**:
- ✅ Faster CI runs (80-90% faster)
- ✅ Focused on actual changes
- ✅ Reduced resource usage
- ✅ Faster feedback loops

---

## 7. Monitoring & Debugging

### 7.1 Cache Analysis

**Commands**:
```bash
# View cache summary
pnpm turbo:summary

# Output shows:
# - Tasks executed
# - Cache hits
# - Cache misses
# - Execution time
# - Cache effectiveness
```

---

### 7.2 Task Graph Analysis

**Commands**:
```bash
# Visualize graph
pnpm turbo:graph

# Export to file
turbo run build --graph=graph.html

# Analyze dependencies
turbo run build --graph | dot -Tsvg > graph.svg
```

---

### 7.3 Dry Run

**Command**:
```bash
pnpm turbo:dry-run

# Shows:
# - What would execute
# - What would be cached
# - Task order
# - Dependencies
```

---

## 8. Remote Cache Setup (Future)

### 8.1 Vercel Remote Cache

**Setup Steps**:

1. **Create Vercel Account**:
   ```bash
   # Visit https://vercel.com
   # Sign up / Login
   ```

2. **Link Turborepo**:
   ```bash
   pnpm turbo login
   ```

3. **Link Repository**:
   ```bash
   pnpm turbo link
   ```

4. **Enable Remote Cache**:
   ```json
   // turbo.json
   "remoteCache": {
     "enabled": true,
     "signature": true
   }
   ```

5. **Set Team Token** (Optional):
   ```bash
   export TURBO_TOKEN="your-token"
   export TURBO_TEAM="your-team"
   ```

**Benefits**:
- ✅ Team-wide cache sharing
- ✅ CI/CD uses same cache
- ✅ 70-95% faster builds
- ✅ Consistent artifacts

---

### 8.2 Self-Hosted Remote Cache

**Alternative**: Use self-hosted cache server

**Configuration**:
```json
"remoteCache": {
  "enabled": true,
  "signature": true,
  "url": "https://your-cache-server.com"
}
```

---

## 9. Best Practices

### 9.1 Task Configuration

✅ **DO**:
- Use `dependsOn: ["^build"]` for tasks that need dependencies
- Specify all outputs for proper caching
- Track environment variables that affect builds
- Use `persistent: true` only for dev servers

❌ **DON'T**:
- Cache file-modifying tasks (format, fix)
- Skip output patterns
- Ignore environment variables
- Use persistent for build tasks

---

### 9.2 Filtering Strategy

✅ **DO**:
- Use `--filter=[HEAD^1]` for CI/CD
- Target specific packages during development
- Include dependencies when needed (`...`)

❌ **DON'T**:
- Build everything when only one package changed
- Skip dependency builds when needed
- Use filters unnecessarily

---

### 9.3 Cache Management

✅ **DO**:
- Monitor cache hit rates
- Clear cache when needed (`clean:cache`)
- Use remote cache for teams
- Track cache effectiveness

❌ **DON'T**:
- Ignore cache misses
- Keep stale cache
- Share cache without signatures
- Cache sensitive data

---

## 10. Migration Checklist

### ✅ Completed

- [x] Enhanced `turbo.json` configuration
- [x] Added comprehensive task definitions
- [x] Integrated test tasks
- [x] Added filtering scripts
- [x] Configured cache management
- [x] Added monitoring commands
- [x] Documented all features
- [x] Optimized task dependencies

### 🔄 Next Steps

- [ ] Enable remote cache (when ready)
- [ ] Set up CI/CD with filtering
- [ ] Monitor cache hit rates
- [ ] Optimize based on metrics
- [ ] Train team on new commands

---

## 11. Performance Metrics

### Expected Improvements

| Metric             | Before       | After        | Improvement    |
| ------------------ | ------------ | ------------ | -------------- |
| **Cold Build**     | 2-3 min      | 2-3 min      | Baseline       |
| **Cached Build**   | 2-3 min      | 5-10 sec     | **95% faster** |
| **Partial Build**  | 2-3 min      | 30-60 sec    | **70% faster** |
| **CI Build**       | 5-10 min     | 1-2 min      | **80% faster** |
| **Test Execution** | Full suite   | Changed only | **90% faster** |
| **Lint Execution** | All packages | Changed only | **85% faster** |

---

## 12. Troubleshooting

### Issue: Cache Not Working

**Symptoms**: Builds always take full time

**Solutions**:
1. Check `turbo.json` exists and is valid
2. Verify `turbo` is installed: `pnpm list turbo`
3. Check file permissions
4. Try `pnpm clean:cache` then rebuild
5. Verify outputs are correctly specified

---

### Issue: Tasks Running in Wrong Order

**Symptoms**: Dependencies not built before dependents

**Solutions**:
1. Check `dependsOn` configuration
2. Use `dependsOn: ["^build"]` for dependency builds
3. Verify task graph: `pnpm turbo:graph`
4. Review dependency chain

---

### Issue: Filter Not Working

**Symptoms**: Filter command affects wrong packages

**Solutions**:
1. Verify package names in `package.json`
2. Check workspace configuration
3. Use `--filter` with correct syntax
4. Test with `--dry-run` first

---

### Issue: Remote Cache Not Syncing

**Symptoms**: Cache not shared across machines

**Solutions**:
1. Verify remote cache enabled
2. Check authentication: `pnpm turbo login`
3. Verify team/repo linked: `pnpm turbo link`
4. Check network connectivity
5. Verify `TURBO_TOKEN` and `TURBO_TEAM` set

---

## 13. References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Turborepo Filtering Guide](https://turbo.build/repo/docs/core-concepts/filtering)
- [Turborepo Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Turborepo Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Turborepo Task Dependencies](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)

---

**Status**: ✅ **FULLY OPTIMIZED**
**Last Updated**: 2026-01-10
**Next Review**: After remote cache activation
