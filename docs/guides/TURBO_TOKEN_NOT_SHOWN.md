# Turbo Token Not Shown in Output - How to Find It

**Status**: ✅ Active | **Last Updated**: 2026-01-11
**Purpose**: Help when `turbo link` shows team but not token

---

## Issue: Token Not Displayed

Sometimes `turbo link` only shows:
```
✓ Remote caching enabled
✓ Team: your-team-name
```

But **doesn't show the token**. This is normal - the token is stored in a config file.

---

## Solution: Check Config File

### Method 1: Check `.turbo/config.json`

The token is stored in `.turbo/config.json`:

```bash
# View the config file
cat .turbo/config.json

# Or on Windows PowerShell
Get-Content .turbo\config.json
```

**Expected content** (may vary):
```json
{
  "teamId": "team_xxxxxxxxxxxxx",
  "token": "tur_xxxxxxxxxxxxx"
}
```

**OR** (if only teamId is shown):
```json
{
  "teamId": "team_xxxxxxxxxxxxx"
}
```

**If token is missing**:
- The token might be stored in Vercel's auth cache
- You may need to re-link or check Vercel dashboard
- Token is sometimes not stored locally for security

**Extract values**:
- `TURBO_TEAM` = Value from `teamId` (or use the team name you saw)
- `TURBO_TOKEN` = Value from `token` (if present) OR get from Vercel

---

### Method 2: Use Turbo CLI to Check

```bash
# Check if linked
pnpm turbo whoami

# Or check status
pnpm turbo link --dry-run
```

---

### Method 3: Check Environment Variables

If you've already set it:

```bash
# Check if already set
echo $TURBO_TOKEN
echo $TURBO_TEAM

# Or on Windows PowerShell
$env:TURBO_TOKEN
$env:TURBO_TEAM
```

---

## If Config File Doesn't Exist

### Re-run turbo link

```bash
# Unlink first (if needed)
pnpm turbo unlink

# Then link again
pnpm turbo link
```

**This time, look carefully at the output** - the token might be shown but easy to miss.

---

## Alternative: Get Token from Vercel

If you can't find the token:

### Option 1: Vercel Dashboard

1. **Go to**: https://vercel.com
2. **Sign in**
3. **Go to**: Settings → Tokens
4. **Note**: Vercel API tokens are different from Turbo tokens
5. **For Turbo token**: You need to use `turbo link` or check `.turbo/config.json`

### Option 2: Re-authenticate

```bash
# Re-login
pnpm turbo login

# Re-link
pnpm turbo link
```

---

## Quick Check Script

Create a script to extract token:

```bash
# PowerShell script
$config = Get-Content .turbo\config.json | ConvertFrom-Json
Write-Host "TURBO_TEAM: $($config.teamId)"
Write-Host "TURBO_TOKEN: $($config.token)"
```

Or manually:
1. Open `.turbo/config.json`
2. Find `"token"` field
3. Copy the value (starts with `tur_`)

---

## After Finding Token

### Add to .env

```env
TURBO_TOKEN=tur_xxxxxxxxxxxxx
TURBO_TEAM=your-team-name
```

### Add to GitHub Secrets

1. GitHub → Settings → Secrets → Actions
2. Add `TURBO_TOKEN` = `tur_xxxxxxxxxxxxx`
3. Add `TURBO_TEAM` = `your-team-name`

---

## Troubleshooting

### Issue: `.turbo/config.json` doesn't exist

**Solution**: Run `pnpm turbo link` again

### Issue: Config file exists but no token field

**Solution**: 
1. Run `pnpm turbo unlink`
2. Run `pnpm turbo link` again
3. Check output carefully

### Issue: Token field is empty

**Solution**:
1. Run `pnpm turbo login` (re-authenticate)
2. Run `pnpm turbo link` again

---

## Summary

**If you only see team name**:
1. ✅ Check `.turbo/config.json` for the token
2. ✅ Extract `token` field value
3. ✅ Use that as `TURBO_TOKEN`

**Token format**: Starts with `tur_` followed by alphanumeric characters

---

**Last Updated**: 2026-01-11
**Status**: ✅ Active Guide
