# Prettier Removal Guide

**Date:** 2026-01-10  
**Status:** ⚠️ Action Required

---

## 🚨 Issue Detected

The Prettier extension (`esbenp.prettier-vscode`) is still installed and active, which conflicts with Biome. This project uses **Biome** as the sole formatter and linter.

---

## ✅ Solution: Remove Prettier Extension

### Method 1: VS Code UI (Recommended)

1. Open VS Code Extensions view (`Ctrl+Shift+X`)
2. Search for "Prettier - Code formatter"
3. Click the gear icon ⚙️ next to the extension
4. Select **"Uninstall"**
5. Reload VS Code window (`Ctrl+Shift+P` → "Developer: Reload Window")

### Method 2: VS Code CLI

```powershell
# Uninstall Prettier extension
code --uninstall-extension esbenp.prettier-vscode
```

### Method 3: PowerShell Script

Run this PowerShell command:

```powershell
code --uninstall-extension esbenp.prettier-vscode
```

---

## ✅ Verification

After uninstalling, verify:

1. **Check Extensions:**
   ```powershell
   code --list-extensions | Select-String "prettier"
   ```
   Should return nothing.

2. **Check Settings:**
   - Open `.vscode/settings.json`
   - Verify `"prettier.enable": false` is set
   - Verify Biome is the default formatter for all file types

3. **Test Formatting:**
   - Open any `.ts` or `.tsx` file
   - Make a formatting change (add extra spaces)
   - Save the file (`Ctrl+S`)
   - Biome should format it, not Prettier

---

## 📋 Current Configuration

### ✅ Biome is Configured

- **Extension:** `biomejs.biome` ✅
- **Default Formatter:** Biome for all JS/TS/JSON/CSS files ✅
- **Format on Save:** Enabled ✅
- **Code Actions:** Auto-fix enabled ✅

### ❌ Prettier Should Be Removed

- **Extension:** `esbenp.prettier-vscode` ❌ (Remove this)
- **Settings:** `prettier.enable: false` ✅ (Already set)

---

## 🔍 Why This Matters

### Conflicts

1. **Formatting Conflicts:** Prettier and Biome may format code differently
2. **Performance:** Running both formatters wastes resources
3. **Confusion:** Developers won't know which formatter is active
4. **CI/CD:** Inconsistent formatting between local and CI

### Benefits of Biome Only

1. **Speed:** 10-50x faster than Prettier + ESLint
2. **Unified:** One tool for formatting, linting, and import organization
3. **Consistency:** Same rules everywhere
4. **Simplicity:** One configuration file (`biome.json`)

---

## 📝 Additional Cleanup (Optional)

If you have Prettier config files, you can remove them:

```powershell
# Remove Prettier config files (if they exist)
Remove-Item .prettierrc -ErrorAction SilentlyContinue
Remove-Item .prettierrc.json -ErrorAction SilentlyContinue
Remove-Item .prettierrc.js -ErrorAction SilentlyContinue
Remove-Item .prettierrc.yml -ErrorAction SilentlyContinue
Remove-Item .prettierignore -ErrorAction SilentlyContinue
```

**Note:** These files are not in the repository, but may exist locally.

---

## ✅ Checklist

- [ ] Uninstall Prettier extension
- [ ] Reload VS Code window
- [ ] Verify Prettier is not in extensions list
- [ ] Test formatting with Biome
- [ ] Remove Prettier config files (if any)
- [ ] Update team documentation

---

## 🆘 Troubleshooting

### Prettier Still Active After Uninstall

1. **Check User Settings:**
   - Open VS Code Settings (`Ctrl+,`)
   - Search for "prettier"
   - Remove any Prettier-related settings

2. **Check Workspace Settings:**
   - Verify `.vscode/settings.json` has `"prettier.enable": false`

3. **Restart VS Code:**
   - Completely close and reopen VS Code

### Extension Won't Uninstall

1. **Close All VS Code Windows:**
   - Make sure no VS Code instances are running

2. **Manual Removal:**
   ```powershell
   # Windows path
   Remove-Item "$env:USERPROFILE\.vscode\extensions\esbenp.prettier-vscode-*" -Recurse -Force
   ```

---

## 📚 References

- [Biome Documentation](https://biomejs.dev)
- [VS Code Extension Management](https://code.visualstudio.com/docs/editor/extension-marketplace)
- [Biome Best Practices](./BIOME_BEST_PRACTICES.md)

---

**Last Updated:** 2026-01-10
