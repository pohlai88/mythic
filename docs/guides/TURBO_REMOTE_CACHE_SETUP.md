# Turbo Remote Cache Setup Guide

**Status**: ✅ Active | **Last Updated**: 2026-01-11 **Purpose**: Step-by-step
guide to get Turbo token and team for remote cache

---

## Quick Setup (5 minutes)

### Step 1: Install Turbo CLI (if not already installed)

```bash
# Turbo is usually installed via pnpm, but you can install globally
npm install -g turbo

# Or use via pnpm
pnpm turbo --version
```

---

### Step 2: Login to Vercel Turbo

```bash
pnpm turbo login
```

**What happens**:

1. Opens browser to Vercel login page
2. Sign in with GitHub (or create Vercel account)
3. Authorizes Turbo CLI
4. Returns to terminal with success message

**Expected output**:

```
✓ Successfully authenticated
```

---

### Step 3: Link Your Repository

```bash
pnpm turbo link
```

**What happens**:

1. Asks if you want to link to Vercel (type `y`)
2. Asks which Vercel account/team to use
3. Links your local repo to Vercel Turbo
4. Shows your team name and token info

**Expected output**:

```
? Set up remote caching? (Y/n) y
? Which Vercel account/team? [Select your account]
✓ Remote caching enabled
✓ Team: your-team-name
```

---

### Step 4: Get Your Token & Team

After linking, you'll see:

```
✓ Remote caching enabled
✓ Team: your-team-name
✓ Token: tur_xxxxxxxxxxxxx
```

**Save these values**:

- `TURBO_TEAM` = `your-team-name` (shown in output)
- `TURBO_TOKEN` = `tur_xxxxxxxxxxxxx` (shown in output)

---

## Alternative: Get Token from Vercel Dashboard

**Note**: Vercel MCP (Model Context Protocol) does NOT provide Turbo tokens.
These are Turborepo-specific and must be obtained via Turbo CLI or Vercel
dashboard.

If you didn't save the token from `turbo link`, you can get it from Vercel:

### Option 1: Vercel Dashboard

1. **Go to**: https://vercel.com/account/tokens
2. **Create new token** (or use existing)
   - **Note**: This is a Vercel API token, NOT a Turbo token
   - For Turbo token, you MUST use `turbo login` + `turbo link`
3. **Team name** → Found in Vercel dashboard (top right)

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Get token
vercel whoami
# Shows your account/team info
```

---

## Step 5: Add to GitHub Secrets (for CI/CD)

1. **Go to**: Your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**:
   - Name: `TURBO_TOKEN`
   - Value: `tur_xxxxxxxxxxxxx` (from Step 4)
4. **New repository secret**:
   - Name: `TURBO_TEAM`
   - Value: `your-team-name` (from Step 4)

**Result**: CI/CD workflows will automatically use remote cache

---

## Step 6: Add to .env (for local development)

Add to your `.env` file:

```env
# ============================================================================
# Turbo Remote Cache (OPTIONAL - for faster builds)
# ============================================================================
TURBO_TOKEN=tur_xxxxxxxxxxxxx
TURBO_TEAM=your-team-name
```

**Note**: These are optional - Turborepo works without them (uses local cache)

---

## Verify Setup

### Test Remote Cache

```bash
# Build with remote cache
pnpm build

# Check cache status
pnpm turbo:summary
```

**Expected**: Shows cache hits from remote cache

### Check in CI/CD

After pushing to GitHub:

1. Check GitHub Actions workflow
2. Look for "Remote cache hit" messages
3. Builds should be faster (70-95% faster on cache hits)

---

## Troubleshooting

### Issue: "turbo login" fails

**Solution**:

```bash
# Try with explicit browser
pnpm turbo login --browser

# Or use token directly
export TURBO_TOKEN=tur_xxxxxxxxxxxxx
```

### Issue: "turbo link" says "already linked"

**Solution**:

```bash
# Unlink first
pnpm turbo unlink

# Then link again
pnpm turbo link
```

### Issue: Can't find team name

**Solution**:

1. Go to https://vercel.com/teams
2. Your team name is shown there
3. Or check Vercel dashboard (top right corner)

### Issue: Token not working in CI/CD

**Solution**:

1. Verify token in GitHub Secrets (Settings → Secrets)
2. Check token format: Should start with `tur_`
3. Ensure `TURBO_TEAM` is also set
4. Restart GitHub Actions workflow

---

## Quick Reference

### Commands

```bash
# Login to Vercel Turbo
pnpm turbo login

# Link repository
pnpm turbo link

# Unlink repository
pnpm turbo unlink

# Check status
pnpm turbo:summary
```

### Environment Variables

```env
TURBO_TOKEN=tur_xxxxxxxxxxxxx
TURBO_TEAM=your-team-name
```

### GitHub Secrets

- `TURBO_TOKEN` → Your Turbo token
- `TURBO_TEAM` → Your Vercel team name

---

## Benefits After Setup

✅ **Faster CI/CD builds** (70-95% faster on cache hits) ✅ **Shared cache**
across team members ✅ **Consistent artifacts** across environments ✅ **Reduced
build times** for unchanged code

---

## Summary

1. **Run**: `pnpm turbo login` (authenticate with Vercel)
2. **Run**: `pnpm turbo link` (link repository)
3. **Save**: Token and team name from output
4. **Add to GitHub Secrets**: `TURBO_TOKEN` and `TURBO_TEAM`
5. **Add to .env**: For local development (optional)

**Time**: ~5 minutes **Result**: Remote cache enabled, faster builds

---

**Last Updated**: 2026-01-11 **Status**: ✅ Active Guide
