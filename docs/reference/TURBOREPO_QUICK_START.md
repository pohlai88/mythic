# TurboRepo Quick Start Guide

**Date:** 2024-12-19
**Status:** ✅ Ready to Use

---

## 🚀 Quick Setup (2 Minutes)

### Step 1: Install TurboRepo

```bash
pnpm install
```

This installs `turbo` as a dev dependency.

---

### Step 2: Test TurboRepo

```bash
# First build (creates cache)
pnpm build

# Second build (uses cache - should be much faster)
pnpm build
```

**Expected:** Second build completes in seconds with "FULL TURBO" message.

---

## 📊 What TurboRepo Does

### Automatic Caching

TurboRepo **automatically** caches your scripts:
- ✅ `pnpm build` → Cached
- ✅ `pnpm lint` → Cached
- ✅ `pnpm type-check` → Cached
- ✅ `pnpm format:check` → Cached

### No Script Changes Needed

Your existing scripts work exactly the same:
```bash
pnpm build        # Works as before, but now cached!
pnpm lint         # Works as before, but now cached!
pnpm type-check   # Works as before, but now cached!
```

TurboRepo intercepts and caches automatically.

---

## 🎯 Common Commands

### Standard Usage (Recommended)

```bash
# Build (cached automatically)
pnpm build

# Lint (cached automatically)
pnpm lint

# Type check (cached automatically)
pnpm type-check
```

### Turbo-Specific Commands

```bash
# Run multiple tasks in parallel
pnpm turbo run lint type-check

# Run with cache summary
pnpm turbo run build --summarize

# Force rebuild (ignore cache)
pnpm turbo run build --force

# View what would run (dry run)
pnpm turbo run build --dry-run
```

---

## ⚡ Performance Benefits

### Build Times

| Scenario | Time | Cache Status |
|----------|------|--------------|
| **First Build** | ~2-3 min | Cache created |
| **No Changes** | ~5-10 sec | ✅ Cache hit (95% faster) |
| **Source Changed** | ~30-60 sec | ⚠️ Partial cache (70% faster) |
| **Config Changed** | ~2-3 min | ❌ Cache miss |

### Parallel Execution

```bash
# Run lint and type-check in parallel
pnpm turbo run lint type-check

# Saves ~30-50% time vs sequential
```

---

## 🔍 Verify It's Working

### Check 1: Cache Directory Created

```bash
ls -la .turbo
```

**Expected:** `.turbo` directory exists after first build

### Check 2: Second Build is Fast

```bash
# First build
time pnpm build

# Second build (should be much faster)
time pnpm build
```

**Expected:** Second build 70-95% faster

### Check 3: Cache Summary

```bash
pnpm turbo run build --summarize
```

**Expected:** Shows cache hits/misses

---

## 🛠️ Troubleshooting

### Cache Not Working?

```bash
# Check turbo is installed
pnpm list turbo

# Verify turbo.json exists
cat turbo.json

# Clear and rebuild
rm -rf .turbo
pnpm build
```

### Want to Disable Caching?

```bash
# Use --force flag
pnpm turbo run build --force

# Or run script directly (bypasses Turbo)
next build
```

---

## 📚 Learn More

- **Full Guide:** See `TURBOREPO_OPTIMIZATION.md`
- **TurboRepo Docs:** https://turbo.build/repo/docs
- **Single Package Guide:** https://turbo.build/repo/docs/guides/single-package-workspaces

---

**Last Updated:** 2024-12-19
**Status:** ✅ Ready to Use
**Next Step:** Run `pnpm install` then `pnpm build` twice to see caching in action!
