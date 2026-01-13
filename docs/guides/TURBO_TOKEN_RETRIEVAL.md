# Turbo Token Retrieval - When Only Team is Shown

**Status**: ✅ Active | **Last Updated**: 2026-01-11 **Purpose**: Get Turbo
token when only team name is displayed

---

## Your Current Situation

You ran `turbo link` and saw:

```
✓ Team: your-team-name
```

But **no token was shown**. Your `.turbo/config.json` shows:

```json
{
  "teamId": "team_05yVsWPh4ZJT3Q8u4sM6W2OP"
}
```

**This is normal** - Turbo sometimes doesn't display or store the token locally
for security.

---

## Solution: Get Token from Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Go to**: https://vercel.com
2. **Sign in** with your account
3. **Go to**: Settings → Tokens
4. **Create a new token** (or use existing)
   - **Note**: This creates a Vercel API token
   - For Turbo remote cache, you need a **Turbo-specific token**

### Method 2: Re-link and Capture Token

```bash
# Unlink first
pnpm turbo unlink

# Link again - this time watch carefully
pnpm turbo link
```

**When prompted**, the token might appear in:

- Terminal output (look carefully)
- Browser redirect URL
- Vercel dashboard after linking

---

## Important: Turbo Token vs Vercel Token

### Turbo Token (What You Need)

- Format: `tur_xxxxxxxxxxxxx`
- Purpose: Turborepo remote cache
- Obtained via: `turbo login` + `turbo link`

### Vercel API Token (Different)

- Format: `vercel_xxxxxxxxxxxxx` or similar
- Purpose: Vercel platform API
- Obtained via: Vercel dashboard

**They are different!** Make sure you get the Turbo token.

---

## Alternative: Check if Token is Needed

### Option 1: Test Without Token

Turbo remote cache **works without explicit token** if:

- You're logged in via `turbo login`
- Repository is linked via `turbo link`
- Team is configured

**Try building**:

```bash
pnpm build
```

If you see "Remote cache hit" messages, it's working without explicit token!

---

### Option 2: Use Team ID Instead

Your config shows:

```json
{
  "teamId": "team_05yVsWPh4ZJT3Q8u4sM6W2OP"
}
```

For CI/CD, you might only need:

- `TURBO_TEAM` = `team_05yVsWPh4ZJT3Q8u4sM6W2OP` (from config)
- `TURBO_TOKEN` = May not be required if auth is via Vercel

---

## For CI/CD (GitHub Actions)

### If Token Not Available

Your CI workflow can work with just team:

```yaml
env:
  TURBO_TEAM: team_05yVsWPh4ZJT3Q8u4sM6W2OP
  # TURBO_TOKEN might not be needed if using Vercel auth
```

### If Token Required

1. **Re-run** `pnpm turbo link` and capture token
2. **Or** check Vercel dashboard → Settings → Tokens
3. **Or** contact Vercel support for Turbo token

---

## Quick Test

Test if remote cache works without explicit token:

```bash
# Build and check for cache messages
pnpm build

# Look for:
# ✓ Remote cache hit
# or
# ⚠ Remote cache miss
```

If you see cache messages, **it's working!** Token might be stored in Vercel's
auth cache.

---

## Summary

**Your situation**:

- ✅ Team ID: `team_05yVsWPh4ZJT3Q8u4sM6W2OP` (found in config)
- ❓ Token: Not shown in output or config

**Solutions**:

1. **Test first**: Try building - remote cache might work without explicit token
2. **Re-link**: Run `pnpm turbo unlink` then `pnpm turbo link` again
3. **Vercel Dashboard**: Check Settings → Tokens
4. **For CI/CD**: Use team ID, token might not be required

---

**Last Updated**: 2026-01-11 **Status**: ✅ Active Guide
