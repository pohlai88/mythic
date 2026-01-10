# GitLens Troubleshooting - Git Detection Issue

## 🔍 Problem

GitLens was unable to find Git, even though Git is installed and working.

---

## ✅ Verification Results

### Git Installation

- **Git Version:** `2.50.0.windows.1` ✅
- **Git Status:** Installed and working ✅
- **Git Repository:** Found at `.git` ✅
- **Remote:** Configured (`origin/main`) ✅

### Repository Status

- **Branch:** `main`
- **Remote URL:** `https://github.com/pohlai88/eBOM.git`
- **Status:** Up to date with `origin/main`

---

## 🔧 Solution Applied

### Updated VS Code Settings

Added Git and GitLens configuration to `.vscode/settings.json`:

```json
{
  // Git Configuration
  "git.enabled": true,
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "git.path": null, // Auto-detect
  
  // GitLens Configuration
  "gitlens.codeLens.enabled": true,
  "gitlens.currentLine.enabled": true,
  "gitlens.hovers.enabled": true,
  "gitlens.statusBar.enabled": true
}
```

---

## 🚀 Fix Steps

### Step 1: Reload VS Code Window

1. Press `Ctrl+Shift+P`
2. Type: "Developer: Reload Window"
3. Press Enter

This will reload VS Code and re-detect Git.

### Step 2: Verify Git Detection

After reload:

1. **Check Git Status:**
   - Open Source Control panel (`Ctrl+Shift+G`)
   - Verify Git is detected
   - Check for any error messages

2. **Check GitLens:**
   - Open any file
   - Look for GitLens annotations (blame, commit info)
   - Check GitLens sidebar

### Step 3: If Still Not Working

#### Option A: Specify Git Path Manually

If auto-detection fails, find Git path:

```powershell
Get-Command git | Select-Object -ExpandProperty Source
```

Then update settings:

```json
"git.path": "C:\\Program Files\\Git\\bin\\git.exe"
```

#### Option B: Check GitLens Output

1. Open Output panel: `View → Output`
2. Select "GitLens" from dropdown
3. Check for error messages
4. Look for Git detection issues

#### Option C: Restart GitLens

1. Press `Ctrl+Shift+P`
2. Type: "GitLens: Reset Avatars Cache"
3. Or: "GitLens: Reset Suppressed Warnings"

---

## 🔍 Common Issues & Solutions

### Issue 1: Git Not in PATH

**Symptom:** VS Code can't find git.exe

**Solution:**
1. Find Git installation:
   ```powershell
   Get-Command git | Select-Object -ExpandProperty Source
   ```

2. Add to VS Code settings:
   ```json
   "git.path": "C:\\Program Files\\Git\\bin\\git.exe"
   ```

3. Or add Git to system PATH:
   - Add `C:\Program Files\Git\bin` to PATH
   - Restart VS Code

### Issue 2: GitLens Extension Not Activated

**Symptom:** GitLens installed but not working

**Solution:**
1. Check extension is enabled:
   - Extensions panel (`Ctrl+Shift+X`)
   - Search "GitLens"
   - Verify it's enabled (not disabled)

2. Reload window:
   - `Ctrl+Shift+P` → "Developer: Reload Window"

3. Check GitLens status:
   - Look for GitLens icon in status bar
   - Open GitLens sidebar

### Issue 3: Repository Not Detected

**Symptom:** Git works but GitLens doesn't see repository

**Solution:**
1. Verify repository:
   ```powershell
   cd c:\AI-BOS\eBOM
   git status
   ```

2. Check workspace folder:
   - Ensure VS Code is opened in the correct folder
   - File → Open Folder → Select `c:\AI-BOS\eBOM`

3. Reload window

### Issue 4: Permissions Issue

**Symptom:** Git commands work in terminal but not in VS Code

**Solution:**
1. Check file permissions
2. Run VS Code as Administrator (if needed)
3. Verify Git can access `.git` directory

---

## ✅ Verification Checklist

After applying fixes:

- [ ] VS Code window reloaded
- [ ] Git detected in Source Control panel
- [ ] GitLens extension enabled
- [ ] GitLens sidebar accessible
- [ ] Blame annotations visible in files
- [ ] GitLens status bar shows information
- [ ] No errors in GitLens output panel

---

## 🧪 Test GitLens

### Test 1: Blame Annotations

1. Open any file in the repository
2. **Expected:** GitLens shows commit info on each line
3. Hover over line numbers to see commit details

### Test 2: GitLens Sidebar

1. Click GitLens icon in sidebar
2. **Expected:** GitLens panel opens
3. Check for:
   - Repositories
   - File History
   - Commits
   - Branches

### Test 3: Status Bar

1. Open a file
2. Check bottom status bar
3. **Expected:** GitLens shows commit info, author, date

### Test 4: CodeLens

1. Open a file with functions/classes
2. **Expected:** GitLens shows commit info above definitions

---

## 📋 Current Configuration

### Git Settings

```json
{
  "git.enabled": true,
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "git.path": null
}
```

### GitLens Settings

```json
{
  "gitlens.codeLens.enabled": true,
  "gitlens.currentLine.enabled": true,
  "gitlens.hovers.enabled": true,
  "gitlens.statusBar.enabled": true
}
```

---

## 🔧 Advanced Configuration

### If Auto-Detection Fails

Find Git executable:

```powershell
# Method 1: PowerShell
Get-Command git | Select-Object -ExpandProperty Source

# Method 2: Check common locations
Test-Path "C:\Program Files\Git\bin\git.exe"
Test-Path "C:\Program Files (x86)\Git\bin\git.exe"
```

Then set in settings:

```json
"git.path": "C:\\Program Files\\Git\\bin\\git.exe"
```

### GitLens Advanced Settings

```json
{
  "gitlens.advanced.messages": {
    "suppressGitMissingWarning": false
  },
  "gitlens.codeLens.scopes": [
    "document",
    "containers",
    "blocks",
    "branches"
  ]
}
```

---

## ✅ Summary

**Git Status:**
- ✅ Git installed: `2.50.0.windows.1`
- ✅ Repository found: `.git` exists
- ✅ Git working: Commands execute successfully
- ✅ Remote configured: `origin/main`

**Configuration:**
- ✅ Git settings added to `.vscode/settings.json`
- ✅ GitLens settings configured
- ⏳ **Action Needed:** Reload VS Code window

**Next Step:**
1. Reload VS Code window (`Ctrl+Shift+P` → "Developer: Reload Window")
2. Verify GitLens detects Git
3. Test GitLens features

---

*Git configuration updated - Reload VS Code to activate!*
