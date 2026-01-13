# GitHub Secrets - Permission Issue

**Status**: ⚠️ Permission Required | **Last Updated**: 2026-01-11 **Issue**:
GitHub CLI token doesn't have access to secrets

---

## Problem

**Error**: `HTTP 403: Resource not accessible by personal access token`

**Cause**: Your GitHub token doesn't have the required permissions to manage
repository secrets.

---

## Solutions

### Option 1: Update Token Permissions (Recommended)

1. **Go to**: https://github.com/settings/tokens
2. **Find your token** (the one starting with `github_pat_...`)
3. **Edit token** → Add scope: `admin:repo` or `repo` (with full control)
4. **Save** → Token will be regenerated
5. **Update in GitHub CLI**:
   ```bash
   gh auth refresh -s admin:repo
   ```

### Option 2: Create New Token with Proper Permissions

1. **Go to**: https://github.com/settings/tokens/new
2. **Select scopes**:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
3. **Generate token**
4. **Authenticate GitHub CLI**:
   ```bash
   gh auth login --with-token < your-token-file
   # Or
   echo "YOUR_NEW_TOKEN" | gh auth login --with-token
   ```

### Option 3: Use Web Interface (Easiest)

**If CLI permissions are too complex**, just use the web:

1. **Go to**: https://github.com/pohlai88/mythic/settings/secrets/actions
2. **Click**: "New repository secret"
3. **Add**:
   - Name: `TURBO_TOKEN`
   - Value: `C48Zm7IyYhSZEn0AlBYyYkUo`
4. **Repeat** for `TURBO_TEAM` = `team_05yVsWPh4ZJT3Q8u4sM6W2OP`

---

## Required Permissions

To manage secrets via CLI, your token needs:

- ✅ `repo` scope (full control)
- ✅ `workflow` scope (for Actions)

**Current token**: Has `repo` but might not have write access to secrets.

---

## Quick Fix: Use Web Interface

**Fastest solution** (2 minutes):

1. Visit: https://github.com/pohlai88/mythic/settings/secrets/actions
2. Add both secrets manually
3. Done!

---

## After Fixing Permissions

Once token has proper permissions, you can use:

```bash
# Add secrets
gh secret set TURBO_TOKEN --body "C48Zm7IyYhSZEn0AlBYyYkUo"
gh secret set TURBO_TEAM --body "team_05yVsWPh4ZJT3Q8u4sM6W2OP"

# Verify
gh secret list
```

---

## Summary

| Method            | Status               | Action Needed           |
| ----------------- | -------------------- | ----------------------- |
| **GitHub CLI**    | ⚠️ Needs permissions | Update token or use web |
| **Web Interface** | ✅ Works             | Just visit the URL      |
| **GitHub API**    | ⚠️ Needs permissions | Same as CLI             |

**Recommendation**: Use web interface for now (fastest), or update token
permissions for CLI.

---

**Last Updated**: 2026-01-11 **Status**: ⚠️ Permission Issue - Use Web Interface
