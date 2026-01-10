# Cursor Documentation Indexing Guide

## 📚 Overview

Cursor allows you to index custom documentation to enhance AI context awareness. This guide covers best practices for organizing and indexing both external and local documentation.

---

## 🎯 Two Types of Documentation

### 1. **External Documentation (URL-based)**

- Public documentation websites (e.g., Next.js docs, Supabase docs)
- API documentation
- Framework documentation
- Third-party library docs

### 2. **Local Documentation (Project-specific)**

- Project architecture docs
- API specifications
- Development guides
- Custom patterns and conventions

---

## 🚀 How to Add External Documentation

### Method 1: Via Chat (`@Docs`)

1. **Open Cursor Chat** (`Ctrl+L` or `Ctrl+K`)
2. **Type:** `@Docs`
3. **Select:** `Add new doc`
4. **Enter URL:** Paste the documentation URL
5. **Wait for Indexing:** Cursor will crawl and index the documentation

### Method 2: Via Settings

1. **Open Settings:** `Ctrl+,` (or `File > Preferences > Settings`)
2. **Navigate:** `Features > Docs` (or search for "Docs")
3. **Click:** `Add New Documentation`
4. **Enter URL:** Paste the documentation URL
5. **Confirm:** Cursor will start indexing

### Example URLs to Index

```
# Framework Documentation
https://nextjs.org/docs
https://react.dev
https://supabase.com/docs

# API Documentation
https://docs.supabase.com/reference/javascript/introduction
https://tailwindcss.com/docs

# Library Documentation
https://zod.dev
https://tanstack.com/query/latest
```

---

## 📁 Organizing Local Documentation

### Recommended Directory Structure

```
.cursor/
├── rules/              # Cursor rules (.mdc files)
│   ├── operational-rules.mdc
│   └── new-module-pattern-template-rules.mdc
├── docs/              # Local documentation (this directory)
│   ├── architecture/
│   │   ├── system-overview.md
│   │   ├── database-schema.md
│   │   └── api-design.md
│   ├── guides/
│   │   ├── setup-guide.md
│   │   ├── deployment.md
│   │   └── troubleshooting.md
│   └── patterns/
│       ├── module-patterns.md
│       └── error-handling.md
└── templates/         # Code templates (optional)
    └── module-template.ts
```

### Best Practices for Local Docs

1. **Use Clear File Names**

   - ✅ `api-authentication.md`
   - ❌ `auth.md` (too vague)

2. **Organize by Topic**

   - Group related documentation in subdirectories
   - Use consistent naming conventions

3. **Include Metadata**

   - Add frontmatter with descriptions
   - Tag documents for easy discovery

4. **Keep Docs Focused**
   - One topic per document
   - Use clear headings and structure

---

## 🔗 Referencing Documentation in Rules

### In Cursor Rules (`.mdc` files)

You can reference local documentation files in your rules:

```markdown
---
description: Module creation guidelines
globs: "*.ts,*.tsx"
alwaysApply: false
---

Before creating a new module, refer to:

- @architecture/module-patterns.md
- @guides/setup-guide.md

Follow the patterns documented in these files.
```

### File Reference Syntax

- `@filename.md` - References a file in the same directory
- `@subdirectory/filename.md` - References a file in a subdirectory
- `@../parent/filename.md` - References a file in a parent directory

---

## 📋 What Documentation to Index

### High Priority (Always Index)

1. **Framework Documentation**

   - Next.js, React, TypeScript
   - Your primary framework's official docs

2. **Database Documentation**

   - Supabase, PostgreSQL, Prisma
   - Your database-specific documentation

3. **API Documentation**
   - External APIs you integrate with
   - Your own API documentation

### Medium Priority (Project-Specific)

4. **Library Documentation**

   - UI libraries (shadcn/ui, Tailwind)
   - Utility libraries (Zod, date-fns)
   - Only index libraries you actively use

5. **Architecture Documentation**
   - System design documents
   - Database schema documentation
   - API design specifications

### Low Priority (Reference Only)

6. **Tutorials and Guides**
   - Setup guides
   - Deployment procedures
   - Troubleshooting guides

---

## ✅ Best Practices

### 1. **Scope Appropriately**

- ✅ Index only documentation relevant to your project
- ❌ Don't index everything "just in case"
- **Why:** Too much context can reduce AI accuracy

### 2. **Keep Documentation Current**

- Update indexed docs when frameworks/libraries update
- Remove deprecated documentation
- **How:** Cursor auto-refreshes, but verify periodically

### 3. **Use Descriptive Names**

- When adding docs, use clear names in Cursor settings
- Example: "Next.js 15 Docs" instead of "docs"

### 4. **Organize by Priority**

- Mark frequently-used docs for quick access
- Group related documentation together

### 5. **Combine with Rules**

- Reference documentation in your Cursor rules
- Use `@filename.md` syntax to link to local docs

### 6. **Version-Specific Documentation**

- Index documentation matching your project versions
- Example: Next.js 15 docs if you use Next.js 15

---

## 🎨 Example: Complete Setup

### Step 1: Create Documentation Structure

```powershell
# Create directories
mkdir -p .cursor/docs/architecture
mkdir -p .cursor/docs/guides
mkdir -p .cursor/docs/patterns
```

### Step 2: Add External Documentation

Via Cursor Settings > Features > Docs:

1. Add: `https://nextjs.org/docs` → Name: "Next.js 15 Docs"
2. Add: `https://supabase.com/docs` → Name: "Supabase Docs"
3. Add: `https://tailwindcss.com/docs` → Name: "Tailwind CSS Docs"

### Step 3: Create Local Documentation

Create `.cursor/docs/architecture/system-overview.md`:

```markdown
# System Architecture Overview

## Tech Stack

- Next.js 15 (App Router)
- Supabase (Database & Auth)
- TypeScript
- Tailwind CSS

## Project Structure

- `/app` - Next.js app directory
- `/components` - React components
- `/lib` - Utility functions
```

### Step 4: Reference in Rules

Update `.cursor/rules/operational-rules.mdc`:

```markdown
---
description: Core operational rules
globs: "*.ts,*.tsx,*.js,*.jsx"
alwaysApply: true
---

Refer to @docs/architecture/system-overview.md for project structure.

Before creating new modules, check @docs/patterns/module-patterns.md
```

---

## 🔍 Managing Indexed Documentation

### View Indexed Docs

1. **Settings:** `Cursor Settings > Features > Docs`
2. **See List:** All indexed documentation appears here
3. **Status:** Shows indexing status and last update

### Update Documentation

- **Automatic:** Cursor periodically refreshes indexed docs
- **Manual:** Delete and re-add if needed
- **Shared:** If another user indexed the same URL, you get it instantly

### Remove Documentation

1. Go to `Settings > Features > Docs`
2. Find the documentation entry
3. Click delete/remove
4. Confirm removal

---

## 🚨 Common Issues & Solutions

### Issue: Documentation Not Indexing

**Solutions:**

1. Check if URL is accessible
2. Verify URL format (must be valid HTTP/HTTPS)
3. Wait longer (large docs take time)
4. Check Cursor logs for errors

### Issue: Documentation Out of Date

**Solutions:**

1. Remove and re-add the documentation
2. Cursor auto-refreshes, but manual refresh may be needed
3. Check documentation source for updates

### Issue: Too Much Context

**Solutions:**

1. Remove less-used documentation
2. Be selective about what to index
3. Use `alwaysApply: false` in rules to limit context

### Issue: Local Docs Not Found

**Solutions:**

1. Verify file paths in `@filename.md` references
2. Use relative paths from the rule file location
3. Check file extensions (`.md` not `.mdc` for docs)

---

## 📊 Recommended Documentation Index

### For This Project (eBOM)

**External Documentation:**

- ✅ Next.js Documentation: `https://nextjs.org/docs`
- ✅ Supabase Documentation: `https://supabase.com/docs`
- ✅ React Documentation: `https://react.dev`
- ✅ TypeScript Documentation: `https://www.typescriptlang.org/docs`
- ✅ Tailwind CSS: `https://tailwindcss.com/docs`

**Local Documentation (to create):**

- `.cursor/docs/architecture/system-overview.md`
- `.cursor/docs/guides/supabase-setup.md`
- `.cursor/docs/patterns/module-patterns.md`

---

## 🎯 Quick Reference

### Add External Doc

```
@Docs → Add new doc → Paste URL
```

### Add via Settings

```
Ctrl+, → Features > Docs → Add New Documentation
```

### Reference in Rules

```markdown
@docs/filename.md
```

### View Indexed Docs

```
Settings > Features > Docs
```

---

## 📚 Additional Resources

- [Cursor Documentation Context Guide](https://docs.cursor.com/context)
- [Cursor Rules Documentation](https://docs.cursor.com/context/rules)
- [Agent Skills Specification](https://agentskills.io/specification)

---

**Last Updated:** 2025-01-09
**Version:** 1.0
