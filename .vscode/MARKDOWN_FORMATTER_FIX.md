# Markdown Formatter Configuration

**Date:** 2026-01-10
**Status:** ✅ Resolved

---

## 🚨 Issue

**Error:** `Extension 'Biome' is configured as formatter but it cannot format 'Markdown'-files`

**Cause:** Biome does not support Markdown file formatting. The global default formatter was set to Biome, which caused conflicts when opening Markdown files.

---

## ✅ Solution Applied

### 1. Markdown-Specific Formatter Configuration

Added language-specific settings for Markdown and MDX files:

```json
"[markdown]": {
  "editor.defaultFormatter": "yzhang.markdown-all-in-one",
  "editor.formatOnSave": true,
  "editor.wordWrap": "on"
},
"[mdx]": {
  "editor.defaultFormatter": "yzhang.markdown-all-in-one",
  "editor.formatOnSave": true,
  "editor.wordWrap": "on"
}
```

### 2. Markdown All in One Extension

**Installed:** `yzhang.markdown-all-in-one` v3.6.2

**Features:**
- ✅ Markdown formatting
- ✅ Table of contents generation
- ✅ Preview support
- ✅ Table formatting
- ✅ List formatting

### 3. Extension Configuration

Added Markdown All in One settings:

```json
"markdown.extension.toc.levels": "2..6",
"markdown.extension.preview.autoShowPreviewToSide": false,
"markdown.extension.print.absoluteImgPath": false
```

---

## 📋 Current Formatter Configuration

| File Type             | Formatter           | Status |
| --------------------- | ------------------- | ------ |
| JavaScript/TypeScript | Biome               | ✅      |
| JSON/JSONC            | Biome               | ✅      |
| CSS                   | Biome               | ✅      |
| Markdown              | Markdown All in One | ✅      |
| MDX                   | Markdown All in One | ✅      |
| PowerShell            | PowerShell          | ✅      |

---

## ✅ Verification

### Check Extension is Installed

```powershell
code --list-extensions | Select-String "markdown"
```

Should output: `yzhang.markdown-all-in-one`

### Test Markdown Formatting

1. Open any `.md` or `.mdx` file
2. Add inconsistent formatting (extra spaces, etc.)
3. Save the file (`Ctrl+S`)
4. Markdown All in One should format it automatically

---

## 🔧 Configuration Details

### Markdown Settings

- **Formatter:** `yzhang.markdown-all-in-one`
- **Format on Save:** Enabled
- **Word Wrap:** Enabled (better for documentation)
- **TOC Levels:** 2-6 (for table of contents)

### Why Not Biome for Markdown?

Biome focuses on code formatting (JavaScript, TypeScript, JSON, CSS). Markdown requires different formatting rules:
- List indentation
- Table alignment
- Heading spacing
- Link formatting

Markdown All in One is specifically designed for Markdown formatting and provides better results.

---

## 📚 Related Documentation

- **Biome Configuration:** `.vscode/BIOME_BEST_PRACTICES.md`
- **Settings Guide:** `.vscode/settings.json`
- **Extensions Guide:** `.vscode/extensions.json`

---

## ✅ Checklist

- [x] Markdown formatter configured
- [x] MDX formatter configured
- [x] Markdown All in One extension installed
- [x] Extension settings configured
- [x] Format on save enabled for Markdown
- [ ] Test formatting on a Markdown file

---

**Last Updated:** 2026-01-10
