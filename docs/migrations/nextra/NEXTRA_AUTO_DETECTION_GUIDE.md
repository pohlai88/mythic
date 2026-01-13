# Nextra Auto-Detection & Navigation Guide

## How Nextra Works with File System

### ✅ **Automatic (Built-in)**

1. **File-Based Routing**
   - Any file in `pages/` automatically becomes a route
   - `pages/about.mdx` → `/about`
   - `pages/guides/getting-started.mdx` → `/guides/getting-started`
   - Works with: `.mdx`, `.md`, `.tsx`, `.ts`, `.jsx`, `.js`

2. **File Watching (Dev Server)**
   - Next.js dev server watches `pages/` directory
   - New files are automatically detected
   - Hot reload updates the site instantly

### ❌ **Manual (Requires Configuration)**

1. **Sidebar Navigation**
   - Controlled by `_meta.json` or `_meta.js` files
   - **NOT automatic** - you must manually add entries
   - Without `_meta.json`, files exist but won't show in sidebar

2. **Page Titles & Ordering**
   - Must be specified in `_meta.json`
   - Order in sidebar = order in `_meta.json`

---

## Solution: Auto-Generate `_meta.json`

We've created a script that **automatically generates** `_meta.json` files from
your file structure!

### Quick Start

```bash
# Generate navigation once
pnpm generate:meta

# Watch for changes (auto-regenerate on file changes)
pnpm generate:meta:watch

# Generate both navigation and API docs
pnpm docs:generate
```

### How It Works

1. **Scans `pages/` directory** recursively
2. **Detects all page files** (`.mdx`, `.md`, `.tsx`, etc.)
3. **Generates `_meta.json`** for each directory
4. **Creates titles** from filenames (kebab-case → Title Case)
5. **Handles nested directories** automatically

### Example

**Before (Manual):**

```json
// pages/_meta.json (manually created)
{
  "index": "Introduction",
  "features": "Features Showcase",
  "about": "About"
}
```

**After (Auto-Generated):**

```json
// pages/_meta.json (auto-generated)
{
  "index": "Introduction",
  "features": "Features Showcase",
  "api-example": "API Example",
  "another": "Another Page",
  "advanced": {
    "title": "Advanced",
    "type": "page"
  },
  "about": "About"
}
```

---

## File Structure → Navigation Mapping

### Simple Pages

```
pages/
├── index.mdx          → "Introduction" (sidebar)
├── about.mdx          → "About" (sidebar)
└── features.mdx       → "Features" (sidebar)
```

### Nested Directories

```
pages/
├── guides/
│   ├── _meta.json     ← Auto-generated!
│   ├── getting-started.mdx
│   └── advanced.mdx
└── api/
    ├── _meta.json     ← Auto-generated!
    ├── rest.mdx
    └── graphql.mdx
```

**Generated `guides/_meta.json`:**

```json
{
  "getting-started": "Getting Started",
  "advanced": "Advanced"
}
```

### Directories with Index Files

```
pages/
└── docs/
    ├── index.mdx      → Shows as "Docs" in parent
    ├── guide1.mdx
    └── guide2.mdx
```

---

## Workflow Recommendations

### Option 1: Manual Generation (Recommended)

1. Create new page: `pages/new-feature.mdx`
2. Run: `pnpm generate:meta`
3. Review generated `_meta.json`
4. Customize titles/order if needed
5. Restart dev server (or it auto-reloads)

### Option 2: Watch Mode (Development)

1. Start watch mode: `pnpm generate:meta:watch`
2. Create/edit pages in `pages/`
3. `_meta.json` auto-updates on file changes
4. Next.js dev server picks up changes automatically

### Option 3: Pre-commit Hook (Advanced)

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
pnpm generate:meta
git add pages/**/_meta.json
```

---

## Customization After Generation

The script generates sensible defaults, but you can customize:

### Custom Titles

```json
{
  "api-example": "API Reference", // Generated: "API Example"
  "features": "Features Showcase"
}
```

### External Links

```json
{
  "contact": {
    "title": "Contact ↗",
    "type": "page",
    "href": "https://twitter.com/yourhandle",
    "newWindow": true
  }
}
```

### Menu Folders

```json
{
  "guides": {
    "title": "Documentation",
    "type": "menu" // Collapsible folder
  }
}
```

---

## What Gets Auto-Detected

### ✅ Detected

- `.mdx`, `.md` files → Pages
- `.tsx`, `.ts`, `.jsx`, `.js` files → Pages
- Nested directories → Folders
- Index files → Directory pages

### ❌ Ignored

- Files starting with `_` (e.g., `_app.tsx`, `_meta.json`)
- `404.tsx` (error page)
- `sitemap.xml.ts` (sitemap generator)
- Hidden files (starting with `.`)

---

## Integration with API Docs

The project also has **auto-generated API documentation**:

```bash
# Generate API docs from Zod schemas
pnpm generate:api-docs

# Generate everything (navigation + API docs)
pnpm docs:generate
```

This creates `/api-docs` page with interactive Swagger UI.

---

## Troubleshooting

### Navigation Not Updating?

1. **Check `_meta.json` exists** in the directory
2. **Restart dev server** (`pnpm dev`)
3. **Verify file format** (valid JSON)
4. **Check file extensions** (must be `.mdx`, `.md`, `.tsx`, etc.)

### Files Not Showing?

1. **Run generator**: `pnpm generate:meta`
2. **Check file location** (must be in `pages/` or subdirectory)
3. **Verify filename** (no special characters, use kebab-case)
4. **Check console** for Next.js errors

### Custom Titles Not Working?

- Edit `_meta.json` manually after generation
- Script preserves manual customizations (doesn't overwrite if you edit
  carefully)
- Or use `_meta.js` for dynamic generation

---

## Best Practices

1. **Use kebab-case** for filenames: `getting-started.mdx` ✅
2. **Organize by feature**: `pages/guides/`, `pages/api/`, etc.
3. **Run generator regularly**: After adding new pages
4. **Review generated files**: Customize titles/order as needed
5. **Commit `_meta.json`**: Keep navigation in version control

---

## Summary

| Feature            | Status            | How It Works                     |
| ------------------ | ----------------- | -------------------------------- |
| **File → Route**   | ✅ Automatic      | Next.js file-based routing       |
| **File Detection** | ✅ Automatic      | Next.js dev server watches files |
| **Navigation**     | ⚙️ Auto-Generated | Run `pnpm generate:meta`         |
| **API Docs**       | ⚙️ Auto-Generated | Run `pnpm generate:api-docs`     |
| **Hot Reload**     | ✅ Automatic      | Next.js Fast Refresh             |

**Bottom Line:**

- Files are **automatically detected** as routes
- Navigation is **auto-generated** with our script
- You just need to **run the generator** when adding new pages

---

## Quick Reference

```bash
# Generate navigation
pnpm generate:meta

# Watch for changes
pnpm generate:meta:watch

# Generate API docs
pnpm generate:api-docs

# Generate everything
pnpm docs:generate
```

---

## VS Code Integration

**For complete VS Code setup and automation, see:**

- `VSCODE_NEXTRA_INTEGRATION.md` - Complete VS Code integration guide
- `.vscode/tasks.json` - Pre-configured VS Code tasks

### Quick VS Code Setup

1. **Use VS Code Tasks:**
   - Press `Ctrl+Shift+P` → "Tasks: Run Task"
   - Select "Watch All (Meta + Dev)" for full automation

2. **File Watching:**
   - VS Code automatically detects new files
   - Next.js automatically creates routes
   - Navigation script can watch for changes

3. **Auto-Formatting:**
   - Already configured in `.vscode/settings.json`
   - MDX/Markdown format on save automatically
