# Nextra CLI Guide

**Date:** 2024-12-19 **Question:** Is there a Nextra CLI available?

---

## 🎯 Quick Answer

**No dedicated Nextra CLI exists**, but there are several ways to create and
manage Nextra projects:

1. ✅ **Template Repository** (Recommended)
2. ✅ **create-next-app with Nextra example**
3. ✅ **Manual Installation**
4. ✅ **Vercel Template** (One-click deploy)

---

## 📋 Available Methods

### Method 1: Clone Template Repository (Current Method) ✅

**What You're Using:**

```bash
git clone https://github.com/shuding/nextra-docs-template.git my-project
cd my-project
pnpm install
```

**Pros:**

- ✅ Official template
- ✅ Pre-configured
- ✅ Best practices included
- ✅ Ready to use

**Cons:**

- ⚠️ Manual clone step
- ⚠️ Need to update configs

**Status:** ✅ **This is the recommended approach**

---

### Method 2: create-next-app with Nextra Example

**Command:**

```bash
npx create-next-app@latest my-nextra-app \
  --example "https://github.com/vercel/next.js/tree/canary/examples/with-nextra"
```

**Pros:**

- ✅ Uses official Next.js CLI
- ✅ Includes Nextra example
- ✅ Latest Next.js features

**Cons:**

- ⚠️ May need additional configuration
- ⚠️ Example may differ from template

**When to Use:**

- Starting fresh project
- Want latest Next.js features
- Prefer CLI workflow

---

### Method 3: Manual Installation

**Steps:**

```bash
# 1. Create Next.js app
npx create-next-app@latest my-docs

# 2. Install Nextra
cd my-docs
pnpm add nextra nextra-theme-docs

# 3. Configure next.config.js
# (Add Nextra configuration)

# 4. Create theme.config.tsx
# (Configure theme)

# 5. Set up pages structure
# (Create pages directory with MDX files)
```

**Pros:**

- ✅ Full control
- ✅ Custom setup
- ✅ Learn the internals

**Cons:**

- ⚠️ More manual work
- ⚠️ Need to configure everything
- ⚠️ Time-consuming

**When to Use:**

- Custom requirements
- Learning Nextra internals
- Advanced configurations

---

### Method 4: Vercel Template (One-Click)

**URL:** https://vercel.com/templates/next.js/nextra-docs

**Steps:**

1. Click "Deploy" button
2. Connect GitHub account
3. Configure project
4. Deploy automatically

**Pros:**

- ✅ Zero configuration
- ✅ Automatic deployment
- ✅ Vercel optimized

**Cons:**

- ⚠️ Requires Vercel account
- ⚠️ Less control over initial setup

**When to Use:**

- Quick deployment
- Vercel hosting
- Minimal setup needed

---

## 🔍 Why No Dedicated CLI?

### Current State

**Nextra doesn't have a dedicated CLI** like:

- `create-next-app` (Next.js)
- `create-react-app` (React)
- `vue create` (Vue)

### Reasons

1. **Template-Based Approach**
   - Nextra uses template repositories
   - Simpler maintenance
   - More flexible

2. **Next.js Integration**
   - Nextra is a Next.js plugin
   - Uses Next.js tooling
   - No separate CLI needed

3. **Flexibility**
   - Templates allow customization
   - No CLI constraints
   - Easier to modify

---

## 🛠️ Available Tools & Commands

### Next.js CLI (Used with Nextra)

**Create Next.js App:**

```bash
npx create-next-app@latest
```

**Next.js Dev Server:**

```bash
pnpm dev        # Uses: next dev
```

**Next.js Build:**

```bash
pnpm build      # Uses: next build
```

**Next.js Start:**

```bash
pnpm start      # Uses: next start
```

### Package Manager Commands

**Install Dependencies:**

```bash
pnpm install
# or
npm install
# or
yarn install
```

**Add Nextra:**

```bash
pnpm add nextra nextra-theme-docs
```

**Update Nextra:**

```bash
pnpm update nextra nextra-theme-docs
```

---

## 📦 Project Creation Comparison

| Method              | Command                         | Setup Time | Best For           |
| ------------------- | ------------------------------- | ---------- | ------------------ |
| **Template Clone**  | `git clone`                     | 5 min      | ✅ **Recommended** |
| **create-next-app** | `npx create-next-app --example` | 5-10 min   | Latest features    |
| **Manual Install**  | Multiple steps                  | 15-30 min  | Custom setup       |
| **Vercel Template** | Click deploy                    | 2 min      | Quick deploy       |

---

## 🚀 Recommended Workflow

### For New Projects

**Option A: Template (Recommended)**

```bash
# 1. Clone template
git clone https://github.com/shuding/nextra-docs-template.git my-docs
cd my-docs

# 2. Install dependencies
pnpm install

# 3. Configure
# Edit theme.config.tsx
# Edit pages/_meta.json

# 4. Start development
pnpm dev
```

**Option B: create-next-app**

```bash
# 1. Create with Nextra example
npx create-next-app@latest my-docs \
  --example "https://github.com/vercel/next.js/tree/canary/examples/with-nextra"

# 2. Install dependencies
cd my-docs
pnpm install

# 3. Configure
# Edit theme.config.tsx
# Edit pages/_meta.json

# 4. Start development
pnpm dev
```

---

## 🔧 Management Commands

### Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Code Quality

```bash
# Lint
pnpm lint

# Type check
pnpm type-check

# Format code
pnpm format
```

### Analysis

```bash
# Bundle analysis
pnpm analyze
```

---

## 📚 Official Resources

### Templates & Examples

1. **Nextra Docs Template** (What you're using)
   - Repository: https://github.com/shuding/nextra-docs-template
   - Status: ✅ Official, maintained
   - Best for: Documentation sites

2. **Next.js with Nextra Example**
   - Repository:
     https://github.com/vercel/next.js/tree/canary/examples/with-nextra
   - Status: ✅ Official example
   - Best for: Custom Next.js apps

3. **Vercel Template**
   - URL: https://vercel.com/templates/next.js/nextra-docs
   - Status: ✅ Official, one-click
   - Best for: Quick deployment

### Documentation

- **Nextra Docs:** https://nextra.site
- **Next.js Docs:** https://nextjs.org/docs
- **Nextra GitHub:** https://github.com/shuding/nextra

---

## 💡 Future CLI Possibilities

### Potential CLI Features (If Created)

**Hypothetical `nextra-cli` commands:**

```bash
# Create new project
nextra create my-docs

# Add new page
nextra add page about

# Generate sitemap
nextra generate sitemap

# Update theme
nextra update theme

# Validate configuration
nextra validate
```

**Current Status:** ❌ Not available (use templates instead)

---

## ✅ Current Best Practice

### Recommended Approach

**Use the Template Repository** (what you're doing):

```bash
# 1. Clone
git clone https://github.com/shuding/nextra-docs-template.git my-docs

# 2. Install
cd my-docs
pnpm install

# 3. Configure
# - Edit theme.config.tsx
# - Edit pages/_meta.json
# - Add your content

# 4. Develop
pnpm dev
```

**Why This Works Best:**

- ✅ Official template
- ✅ Pre-configured
- ✅ Best practices included
- ✅ Well-maintained
- ✅ Community support

---

## 🎯 Summary

### CLI Availability

| Tool        | CLI Available              | Alternative            |
| ----------- | -------------------------- | ---------------------- |
| **Nextra**  | ❌ No                      | ✅ Template repository |
| **Next.js** | ✅ Yes (`create-next-app`) | ✅ Can use with Nextra |
| **Vercel**  | ✅ Yes (`vercel` CLI)      | ✅ One-click template  |

### Your Current Setup

**Status:** ✅ **Optimal**

You're using the **recommended approach**:

- ✅ Template repository cloned
- ✅ Dependencies installed
- ✅ Configuration files present
- ✅ Ready for development

**No CLI needed** - the template approach is the official recommendation!

---

## 📝 Quick Reference

### Create New Nextra Project

```bash
# Method 1: Template (Recommended)
git clone https://github.com/shuding/nextra-docs-template.git my-docs
cd my-docs && pnpm install

# Method 2: create-next-app
npx create-next-app@latest my-docs \
  --example "https://github.com/vercel/next.js/tree/canary/examples/with-nextra"

# Method 3: Vercel Template
# Visit: https://vercel.com/templates/next.js/nextra-docs
```

### Manage Existing Project

```bash
# Development
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Type check
pnpm type-check
```

---

**Last Updated:** 2024-12-19 **Answer:** ❌ **No dedicated Nextra CLI**, but
template approach is recommended **Status:** ✅ Your current setup is optimal
