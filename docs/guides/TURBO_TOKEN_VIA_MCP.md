# Turbo Token via Vercel MCP - Not Available

**Status**: ⚠️ Not Supported | **Last Updated**: 2026-01-11 **Purpose**: Clarify
that Vercel MCP cannot provide Turbo tokens

---

## Quick Answer

**No, Vercel MCP cannot provide Turbo token and Turbo team.**

Turbo tokens are **Turborepo-specific** and are not available through Vercel's
API or MCP.

---

## Why MCP Can't Provide Turbo Tokens

### 1. Different Services

- **Vercel MCP** → Vercel platform API (deployments, projects, etc.)
- **Turbo Token** → Turborepo remote cache service (separate from Vercel API)

### 2. Token Types

- **Vercel API Token** → For Vercel platform operations
- **Turbo Token** → For Turborepo remote cache (starts with `tur_`)

### 3. Authentication Flow

- Turbo tokens require **Turborepo CLI authentication** (`turbo login`)
- Not available through Vercel's standard API endpoints

---

## How to Get Turbo Token (Correct Method)

### ✅ Method 1: Turbo CLI (Recommended)

```bash
# Step 1: Login
pnpm turbo login
# Opens browser, authenticates with Vercel

# Step 2: Link repository
pnpm turbo link
# Shows token and team name
```

**Output**:

```
✓ Remote caching enabled
✓ Team: your-team-name
✓ Token: tur_xxxxxxxxxxxxx
```

### ✅ Method 2: Vercel Dashboard

1. **Go to**: https://vercel.com
2. **Sign in** with your account
3. **Team name** → Found in top right corner
4. **For Turbo token**: Must use `turbo login` + `turbo link` (cannot get from
   dashboard directly)

---

## What Vercel MCP Can Do

Vercel MCP can help with:

- ✅ List Vercel projects
- ✅ Get deployment information
- ✅ Check project status
- ✅ Access Vercel API tokens (different from Turbo tokens)

**But NOT**:

- ❌ Turbo tokens (`TURBO_TOKEN`)
- ❌ Turbo team names (`TURBO_TEAM`)
- ❌ Turborepo remote cache configuration

---

## Summary

| Method               | Can Get Turbo Token? | Notes                                     |
| -------------------- | -------------------- | ----------------------------------------- |
| **Vercel MCP**       | ❌ No                | Not available via MCP                     |
| **Vercel API**       | ❌ No                | Turbo tokens not in Vercel API            |
| **Turbo CLI**        | ✅ Yes               | `turbo login` + `turbo link`              |
| **Vercel Dashboard** | ⚠️ Partial           | Can see team name, but token requires CLI |

---

## Recommended Approach

**Use Turbo CLI** (fastest and most reliable):

```bash
# One-time setup
pnpm turbo login
pnpm turbo link

# Save the output:
# TURBO_TEAM=your-team-name
# TURBO_TOKEN=tur_xxxxxxxxxxxxx
```

Then add to:

- `.env` file (for local development)
- GitHub Secrets (for CI/CD)

---

## Alternative: Check Existing Configuration

If you've already set up Turbo, check:

```bash
# Check if already linked
cat .turbo/config.json

# Or check environment
echo $TURBO_TOKEN
echo $TURBO_TEAM
```

---

**Last Updated**: 2026-01-11 **Status**: ⚠️ MCP Not Available - Use Turbo CLI
Instead
