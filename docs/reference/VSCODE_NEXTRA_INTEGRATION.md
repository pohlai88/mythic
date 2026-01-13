# VS Code + Nextra Auto-Detection Complete Guide

## Complete Answer to Your Questions

### Q1: How will files be automatically populated?

**Answer:** Files are automatically detected by **3 layers** working together:

1. **VS Code Filesystem (Built-in)**
   - VS Code watches all files in your workspace
   - Automatically detects new files when you create them
   - Updates file explorer in real-time
   - No configuration needed - it's built into VS Code

2. **Next.js File-Based Routing (Automatic)**
   - Next.js dev server watches `pages/` directory
   - Any file you create becomes a route automatically
   - `pages/new-page.mdx` → `/new-page` route
   - Hot reload updates the site instantly

3. **Navigation Auto-Generation (Our Script)**
   - Run `pnpm generate:meta` to update navigation
   - Or use watch mode: `pnpm generate:meta:watch`
   - Automatically creates `_meta.json` files

---

### Q2: How will files be automatically arranged?

**Answer:** Files are arranged by **file structure** + **navigation metadata**:

1. **File Structure = Route Structure**

   ```
   pages/
   ├── index.mdx              → / (homepage)
   ├── about.mdx              → /about
   └── guides/
       ├── getting-started.mdx → /guides/getting-started
       └── advanced.mdx        → /guides/advanced
   ```

2. **Navigation Arrangement = `_meta.json`**
   - Controls sidebar order and titles
   - Auto-generated from file structure
   - Customizable after generation

3. **VS Code File Explorer**
   - Shows actual file structure
   - Automatically updates when files change
   - No manual refresh needed

---

### Q3: How will new features/functions/routes be automatically detected?

**Answer:** Detection happens at **3 levels**:

#### Level 1: VS Code Detection (Instant)

- ✅ **Automatic** - VS Code detects new files immediately
- ✅ **No action needed** - Just create the file
- ✅ **File explorer updates** - See new files instantly

#### Level 2: Next.js Route Detection (Automatic)

- ✅ **Automatic** - Next.js dev server watches `pages/`
- ✅ **Hot reload** - Routes appear immediately
- ✅ **No restart needed** - Fast Refresh handles it

#### Level 3: Navigation Detection (Auto-Generated)

- ⚙️ **Run script** - `pnpm generate:meta`
- ⚙️ **Or watch mode** - `pnpm generate:meta:watch`
- ✅ **Auto-updates** - Navigation syncs with files

---

## VS Code Integration Setup

### Option 1: VS Code Tasks (Recommended)

**Use built-in tasks to automate everything:**

1. **Press `Ctrl+Shift+P`** → Type "Tasks: Run Task"
2. **Select task:**
   - `Generate Navigation Meta` - One-time generation
   - `Watch Navigation Meta` - Auto-update on file changes
   - `Watch All (Meta + Dev)` - Meta + Dev server together

**Or use keyboard shortcuts:**

- `Ctrl+Shift+B` - Run default build task
- Configure in `.vscode/tasks.json` (already created!)

### Option 2: File Watcher Extension

**Install "File Watcher" extension:**

1. Open Extensions (`Ctrl+Shift+X`)
2. Search: "File Watcher"
3. Install: "File Watcher" by appulate
4. Configure to run `pnpm generate:meta` on file changes

### Option 3: VS Code Settings (Auto-Format)

**Already configured in `.vscode/settings.json`:**

- ✅ `formatOnSave: true` - Auto-format on save
- ✅ `formatOnPaste: true` - Auto-format on paste
- ✅ Biome formatter - Handles MDX/Markdown

---

## Complete Workflow

### Daily Workflow (Recommended)

```bash
# Terminal 1: Start dev server (watches files automatically)
pnpm dev

# Terminal 2: Watch navigation (auto-updates _meta.json)
pnpm generate:meta:watch

# Now just create files - everything auto-updates!
```

### VS Code Workflow (Even Easier)

1. **Press `Ctrl+Shift+B`** → Select "Watch All (Meta + Dev)"
2. **Create new file:** `pages/new-feature.mdx`
3. **Everything happens automatically:**
   - ✅ VS Code detects file
   - ✅ Next.js creates route
   - ✅ Script updates navigation
   - ✅ Site reloads with new page

---

## What Happens When You Create a File

### Step-by-Step Auto-Detection:

1. **You create:** `pages/guides/new-guide.mdx`

2. **VS Code (Instant):**
   - ✅ File appears in explorer
   - ✅ File is indexed for search
   - ✅ Syntax highlighting works

3. **Next.js Dev Server (1-2 seconds):**
   - ✅ Detects new file in `pages/`
   - ✅ Creates route: `/guides/new-guide`
   - ✅ Hot reloads the page
   - ✅ Route is accessible immediately

4. **Navigation Script (If watching):**
   - ✅ Detects new file
   - ✅ Updates `guides/_meta.json`
   - ✅ Adds "New Guide" to sidebar
   - ✅ Navigation updates automatically

5. **Result:**
   - ✅ File exists
   - ✅ Route works
   - ✅ Navigation shows it
   - ✅ Everything in sync

---

## VS Code Features Already Configured

### ✅ File Watching

- VS Code watches all files automatically
- No configuration needed

### ✅ Auto-Formatting

- MDX files format on save
- Markdown files format on save
- Biome handles formatting

### ✅ IntelliSense

- Path autocomplete works
- Import suggestions work
- TypeScript types work

### ✅ Git Integration

- Git detects new files
- Shows in source control
- Can commit immediately

---

## Troubleshooting

### Files Not Detected?

1. **Check VS Code:**
   - File should appear in explorer
   - If not, refresh explorer (`F5`)

2. **Check Next.js:**
   - Dev server must be running
   - Check terminal for errors
   - Restart if needed: `pnpm dev`

3. **Check Navigation:**
   - Run: `pnpm generate:meta`
   - Check `_meta.json` was updated
   - Restart dev server if needed

### Navigation Not Updating?

1. **Run generator manually:**

   ```bash
   pnpm generate:meta
   ```

2. **Check file location:**
   - Must be in `pages/` or subdirectory
   - Must have valid extension (`.mdx`, `.md`, etc.)

3. **Check `_meta.json`:**
   - Should exist in same directory
   - Should have valid JSON

### VS Code Tasks Not Working?

1. **Check tasks.json exists:**
   - Should be in `.vscode/tasks.json`
   - Already created for you!

2. **Run task manually:**
   - `Ctrl+Shift+P` → "Tasks: Run Task"
   - Select task from list

3. **Check pnpm:**
   - Must have pnpm installed
   - Must be in project root

---

## Quick Reference

### Commands

```bash
# Generate navigation once
pnpm generate:meta

# Watch for changes (auto-update)
pnpm generate:meta:watch

# Start dev server (auto-reload)
pnpm dev

# Generate everything
pnpm docs:generate
```

### VS Code Tasks

- `Ctrl+Shift+B` - Run build task
- `Ctrl+Shift+P` → "Tasks: Run Task" - Select specific task

### File Detection Timeline

| Action                 | Detection Time   | Automatic?      |
| ---------------------- | ---------------- | --------------- |
| Create file in VS Code | Instant          | ✅ Yes          |
| Next.js route created  | 1-2 seconds      | ✅ Yes          |
| Navigation updated     | When script runs | ⚙️ Manual/Watch |
| Site reloads           | 1-2 seconds      | ✅ Yes          |

---

## Summary

\*\*Your Questions Answered:

1. **"How will files be automatically populated?"**
   - ✅ VS Code filesystem watches automatically
   - ✅ Next.js dev server watches `pages/` automatically
   - ✅ Navigation script can watch automatically

2. **"How will files be automatically arranged?"**
   - ✅ File structure = route structure (automatic)
   - ✅ Navigation arranged by `_meta.json` (auto-generated)
   - ✅ VS Code explorer shows file structure (automatic)

3. **"How will new features/functions/routes be detected?"**
   - ✅ VS Code detects instantly (automatic)
   - ✅ Next.js detects in 1-2 seconds (automatic)
   - ✅ Navigation detects when script runs (manual or watch mode)

**Bottom Line:**

- **Files:** Automatically detected by VS Code + Next.js
- **Routes:** Automatically created by Next.js
- **Navigation:** Auto-generated with our script (run once or watch)

**Everything is automatic except navigation generation - but we've made that
easy with watch mode!**
