# Add GitHub Secrets via CLI

**Status**: ✅ Active | **Last Updated**: 2026-01-11 **Purpose**: Add Turbo
secrets to GitHub using GitHub CLI

---

## Quick Answer

**Yes, GitHub CLI (`gh`) can add secrets!**

**GitHub MCP**: ❌ Not available (no GitHub MCP tools in Cursor) **GitHub CLI**:
✅ Can add secrets (if installed and token has permissions)

**⚠️ Note**: Your token needs `admin:repo` or `repo` scope with write access to
secrets.

---

## Method 1: GitHub CLI (Recommended)

### Prerequisites

1. **Install GitHub CLI** (if not installed):

   ```bash
   # Windows (via winget)
   winget install --id GitHub.cli

   # Or download from: https://cli.github.com/
   ```

2. **Authenticate**:
   ```bash
   gh auth login
   ```

### Add Secrets

```bash
# Add TURBO_TOKEN
gh secret set TURBO_TOKEN --body "C48Zm7IyYhSZEn0AlBYyYkUo"

# Add TURBO_TEAM
gh secret set TURBO_TEAM --body "team_05yVsWPh4ZJT3Q8u4sM6W2OP"
```

**Note**: Make sure you're in the repository directory or specify the repo:

```bash
gh secret set TURBO_TOKEN --body "C48Zm7IyYhSZEn0AlBYyYkUo" --repo owner/repo-name
```

---

## Method 2: GitHub API (Alternative)

If GitHub CLI is not available, use the API directly:

### Step 1: Get Repository Public Key

```bash
# Get public key (requires GITHUB_TOKEN)
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/actions/secrets/public-key
```

**Response**:

```json
{
  "key_id": "1234567890",
  "key": "base64-encoded-public-key"
}
```

### Step 2: Encrypt Secret

You need to encrypt the secret using the public key. This requires:

- The public key from Step 1
- A library to encrypt (like `libsodium` or `tweetnacl`)

### Step 3: Add Secret

```bash
curl -X PUT \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/actions/secrets/TURBO_TOKEN \
  -d '{
    "encrypted_value": "encrypted-secret-value",
    "key_id": "key-id-from-step-1"
  }'
```

**Note**: This is complex - GitHub CLI is much easier!

---

## Method 3: Manual (Easiest)

If CLI/API is too complex:

1. **Go to**:
   https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions
2. **Click**: "New repository secret"
3. **Add**:
   - Name: `TURBO_TOKEN`
   - Value: `C48Zm7IyYhSZEn0AlBYyYkUo`
4. **Repeat** for `TURBO_TEAM`

---

## Quick Script (GitHub CLI)

Create a script to add both secrets:

```bash
#!/bin/bash
# add-turbo-secrets.sh

gh secret set TURBO_TOKEN --body "C48Zm7IyYhSZEn0AlBYyYkUo"
gh secret set TURBO_TEAM --body "team_05yVsWPh4ZJT3Q8u4sM6W2OP"

echo "✅ Secrets added successfully!"
```

**PowerShell version**:

```powershell
# add-turbo-secrets.ps1
gh secret set TURBO_TOKEN --body "C48Zm7IyYhSZEn0AlBYyYkUo"
gh secret set TURBO_TEAM --body "team_05yVsWPh4ZJT3Q8u4sM6W2OP"
Write-Host "✅ Secrets added successfully!"
```

---

## Verify Secrets Added

```bash
# List all secrets (names only, not values)
gh secret list
```

**Expected output**:

```
TURBO_TEAM
TURBO_TOKEN
```

---

## Summary

| Method           | Difficulty | Speed  | Recommended                   |
| ---------------- | ---------- | ------ | ----------------------------- |
| **GitHub CLI**   | Easy       | Fast   | ✅ Yes                        |
| **GitHub API**   | Hard       | Medium | ⚠️ Only if CLI unavailable    |
| **Manual (Web)** | Easy       | Slow   | ✅ Yes (if CLI not installed) |

---

## Your Values

**To add**:

- `TURBO_TOKEN` = `C48Zm7IyYhSZEn0AlBYyYkUo`
- `TURBO_TEAM` = `team_05yVsWPh4ZJT3Q8u4sM6W2OP`

---

**Last Updated**: 2026-01-11 **Status**: ✅ Guide Ready
