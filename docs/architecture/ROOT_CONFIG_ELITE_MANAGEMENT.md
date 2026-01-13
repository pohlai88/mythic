# Root Configuration - Elite Management Guide

**Next.js + Turborepo Monorepo - Enterprise Configuration Strategy**

> **Status**: ✅ Governance-Grade | **Version**: 2.0.0 | **Last Updated**:
> 2026-01-11 **Seal-Ready**: ✅ Three Governing Rules Enforced

---

## Table of Contents

1. [Elite Root Config Philosophy](#1-elite-root-config-philosophy)
2. [Required Root Configs](#2-required-root-configs)
3. [Optional Root Configs](#3-optional-root-configs)
4. [App-Specific Configs](#4-app-specific-configs)
5. [Shared Configs Strategy](#5-shared-configs-strategy)
6. [Configuration Hierarchy](#6-configuration-hierarchy)
7. [Elite Patterns](#7-elite-patterns)
8. [Anti-Patterns](#8-anti-patterns)
9. [⚡ Scale Challenge: 500+ Config Files](#9-scale-challenge-500-config-files)
   ⭐
10. [Package Boundary Enforcement](#10-package-boundary-enforcement) ⭐ **NEW**
11. [Cursor Governance Configuration](#11-cursor-governance-configuration) ⭐
    **NEW**
12. [Three Governing Rules (Seal-Ready)](#12-three-governing-rules-seal-ready)
    ⭐ **NEW**

---

## 1. Elite Root Config Philosophy

### Core Principles

**✅ DO: Centralize Monorepo-Level Configs**

- Root configs apply to entire monorepo
- Shared configs in `packages/Monorepo/Config/`
- App-specific configs in `apps/*/`

**❌ DON'T: Mix Concerns**

- Don't put app-specific configs at root
- Don't duplicate configs across apps
- Don't create configs that only one app uses

---

## 2. Required Root Configs

### 2.1 Package Management

**✅ `package.json`** - Root Package Configuration

```json
{
  "name": "@mythic/monorepo",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  }
}
```

**Elite Practices**:

- ✅ **Prime Monad**: `pnpm-workspace.yaml` is the **single source of truth**
  for workspace definition
- ✅ **DO NOT** use `workspaces` field in `package.json` (pnpm ignores it,
  creates double-source-of-truth risk)
- ✅ Pin `packageManager` version (enforced by Corepack)
- ✅ Set `engines` for Node.js and pnpm versions (enforced by package managers)
- ✅ Use TurboRepo scripts for all tasks
- ✅ Keep shared dependencies at root when possible

**Version Upgrade Policy**:

- ✅ **Who**: Architecture team or designated maintainer
- ✅ **Where**: Document in ADR or decision ledger
- ✅ **Gate**: Minimum test gate required:
  ```bash
  pnpm -r build && pnpm -r lint && pnpm -r type-check
  ```
- ✅ **Process**:
  1. Update `.node-version`, `.nvmrc`, `package.json` engines
  2. Update `packageManager` in `package.json`
  3. Run test gate
  4. Document decision in `docs/architecture/ADRs/`

**✅ `pnpm-workspace.yaml`** - Workspace Definition (CANONICAL)

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Elite Practices**:

- ✅ **CANONICAL**: This is the **single source of truth** for workspace
  definition
- ✅ Keep it simple (just workspace paths)
- ✅ Don't add complex logic here
- ✅ **DO NOT** duplicate in `package.json` workspaces field

**✅ `pnpm-lock.yaml`** - Lock File (Auto-generated)

**Elite Practices**:

- ✅ Commit to git (single source of truth)
- ✅ Don't manually edit
- ✅ Regenerate with `pnpm install`

---

### 2.2 Build System

**✅ `turbo.json`** - Turborepo Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "package.json",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    "packages/Monorepo/Config/**/*.json"
  ],
  "globalEnv": ["NODE_ENV", "CI", "NEXT_PUBLIC_*", "TURBO_TOKEN", "TURBO_TEAM"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["next.config.mjs", "tsconfig.json", "package.json"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "outputLogs": "new-only",
      "cache": true
    }
  },
  "remoteCache": {
    "enabled": true,
    "signature": true
  }
}
```

**Elite Practices**:

- ✅ **Minimal Global Deps**: Only truly global configs (affects ALL apps)
- ✅ **App-Specific in Inputs**: `next.config.mjs`, `tsconfig.json` go in task
  `inputs` (not global)
- ✅ Track environment variables in `globalEnv`
- ✅ Use `outputLogs: "new-only"` for cleaner output
- ✅ Enable remote cache for team sharing
- ✅ Set `signature: true` for cache security

**Key Principle**:

- `globalDependencies` = Configs that affect ALL apps (root + shared config
  packages)
- Task `inputs` = Configs that affect specific apps (app-specific configs)

---

### 2.3 TypeScript

**✅ `tsconfig.json`** - Root TypeScript Configuration (Base Only)

```json
{
  "compilerOptions": {
    "composite": true,
    "incremental": true,
    "paths": {
      "@mythic/shared-utils": ["./packages/NextJS/Shared-Utils/src"],
      "@mythic/shared-types": ["./packages/TypeScript/Shared-Types/src"],
      "@mythic/design-system": ["./packages/TailwindCSS-V4/Design-System/src"]
    }
  }
}
```

**Elite Practices**:

- ✅ **CANONICAL**: Root `tsconfig.json` is **base-only** (no references)
- ✅ Use `composite: true` for project references
- ✅ Use `incremental: true` for faster builds
- ✅ Define workspace package paths
- ✅ **DO NOT** add `references` array to root (causes reference explosion at
  scale)

**✅ TypeScript Solution-Style References (CANONICAL)**

**CANONICAL APPROACH**: Root has NO references, apps reference only their
dependencies

```json
// Root tsconfig.json (CANONICAL - Base Only)
{
  "compilerOptions": {
    "composite": true,
    "incremental": true,
    "paths": {
      "@mythic/shared-utils": ["./packages/NextJS/Shared-Utils/src"],
      "@mythic/shared-types": ["./packages/TypeScript/Shared-Types/src"],
      "@mythic/design-system": ["./packages/TailwindCSS-V4/Design-System/src"]
    }
  }
  // ✅ NO references array - base config only
}

// apps/my-app/tsconfig.json (CANONICAL)
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [".//*"]
    }
  },
  "references": [
    { "path": "../../packages/shared-utils" },
    { "path": "../../packages/domain-auth" }
  ]
}
```

**Elite Practices**:

- ✅ **CANONICAL**: Root `tsconfig.json` has NO references (base config only)
- ✅ Each app/package references only its direct dependencies
- ✅ Apps extend root config and add their own references
- ✅ Prevents reference explosion (200+ projects → only direct deps per app)

**Migration Note**:

- Small scale (<10 apps): Root references OK for convenience
- Medium+ scale (10+ apps): Migrate to solution-style (remove root references)
- Current workspace: Can keep root references for now, migrate when scaling

---

### 2.4 Version Control

**✅ `.gitignore`** - Git Ignore Rules

```gitignore
# Dependencies
node_modules
.pnp
.pnp.js

# Build outputs
.next
out
dist
build
.turbo

# Environment
.env
.env.local
.env*.local

# Build artifacts
tsconfig.tsbuildinfo
next-env.d.ts
vercel-types.d.ts

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Testing
coverage
.nyc_output

# Temporary
*.tmp
*.temp
.cache
```

**Elite Practices**:

- ✅ Ignore all build artifacts
- ✅ Ignore environment files
- ✅ Ignore cache directories
- ✅ Ignore generated files

---

## 3. Optional Root Configs

### 3.1 Code Quality

**✅ `biome.json`** - Linter & Formatter

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "files": {
    "ignore": [
      "node_modules",
      ".next",
      "dist",
      "build",
      ".turbo",
      "*.tsbuildinfo"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true
  }
}
```

**Elite Practices**:

- ✅ Use Biome for linting and formatting
- ✅ Ignore build artifacts
- ✅ Set consistent formatting rules
- ✅ Share config via `packages/Monorepo/Config/` if needed

**✅ `.lintstagedrc.json`** - Pre-commit Hooks

```json
{
  "*.{ts,tsx}": ["biome check --write", "git add"],
  "*.{md,mdx}": ["prettier --write", "git add"]
}
```

**Elite Practices**:

- ✅ Run linter on staged files
- ✅ Auto-fix when possible
- ✅ Keep it fast (only staged files)

---

### 3.2 Node.js Version

**✅ `.node-version`** - Node Version (for asdf/nvm)

```
20.18.0
```

**✅ `.nvmrc`** - Node Version (for nvm)

```
20.18.0
```

**Elite Practices**:

- ✅ Pin Node.js version
- ✅ Match `package.json` engines
- ✅ Use both files for compatibility

**✅ `.npmrc`** - npm/pnpm Configuration

```
# Enable pre/post scripts for pnpm
enable-pre-post-scripts=true

# Workspace behavior
shamefully-hoist=false

# Peer dependency handling
strict-peer-dependencies=true
```

**Elite Practices**:

- ✅ Configure workspace behavior
- ✅ Set peer dependency handling
- ✅ Document non-obvious settings

**⚠️ Strict Peer Dependencies Handling**:

- ✅ `strict-peer-dependencies=true` enforces correctness
- ⚠️ **Exception Policy**: When upstream packages publish imperfect peer ranges:
  - Document waiver in `zod-waivers.json` (if using Zod governance)
  - Or use `overrides` in `package.json`:
    ```json
    {
      "pnpm": {
        "overrides": {
          "react": "^18.3.1"
        }
      }
    }
    ```
- ✅ Prefer fixing upstream packages over permanent overrides

---

### 3.3 Styling

**✅ Tailwind Configuration - Elite Placement Rule**

**CANONICAL**: Use design system package for Tailwind config

```typescript
// packages/design-system/tailwind.config.ts (CANONICAL)
import type { Config } from "tailwindcss"
import { tokens } from "./src/tokens"

const config: Config = {
  content: [
    "../../apps/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
    },
  },
  plugins: [],
}

export default config
```

**Apps Reference Design System**:

```typescript
// apps/my-app/tailwind.config.ts
import baseConfig from "@mythic/design-system/tailwind.config"

export default {
  ...baseConfig,
  content: [...baseConfig.content, "./app/**/*.{js,ts,jsx,tsx,mdx}"],
}
```

**Elite Practices**:

- ✅ **CANONICAL**: Put Tailwind config in `packages/design-system/`
- ✅ **DO NOT** put at root (design system package is the source of truth)
- ✅ Apps extend design system config
- ✅ Design system tokens are the single source of truth
- ✅ Only create app-specific config if app needs custom tokens

**✅ `components.json`** - shadcn/ui Configuration

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "apps/docs/styles/globals.css"
  }
}
```

**Elite Practices**:

- ✅ Only if using shadcn/ui
- ✅ Configure for App Router (RSC)
- ✅ Point to correct paths

---

### 3.4 Database

**✅ `drizzle.config.ts`** - Database ORM Config (if shared)

```typescript
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./packages/TypeScript/Shared-Types/src/db/schema.ts",
  out: "./src/generated",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

**Elite Practices**:

- ✅ Only if database is shared
- ✅ Otherwise, put in `apps/*/drizzle.config.ts`
- ✅ Use environment variables

---

### 3.5 Other

**✅ `.env.example`** - Environment Template

```bash
# Database
DATABASE_URL=postgresql://...

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Elite Practices**:

- ✅ **Naming**: Use `.env.example` (conventional, tooling recognizes it)
- ✅ Document all required env vars
- ✅ Provide examples
- ✅ Don't include secrets
- ✅ Commit to git (template for developers)

**✅ `zod-waivers.json`** - Governance (if using Zod)

```json
{
  "waivers": [],
  "metadata": {
    "lastUpdated": "2026-01-11"
  }
}
```

**Elite Practices**:

- ✅ Track schema validation waivers
- ✅ Review regularly
- ✅ Document reasons

---

## 4. App-Specific Configs

### 4.1 Next.js Config

**✅ `apps/*/next.config.mjs`** - App-Specific Next.js Config

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@mythic/design-system", "@mythic/shared-utils"],
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.vercel.app"],
    },
  },
}

export default nextConfig
```

**Elite Practices**:

- ✅ **NEVER** put `next.config.*` at root
- ✅ Each app has its own config
- ✅ Optimize workspace packages
- ✅ Configure app-specific features

**❌ Anti-Pattern**:

```javascript
// ❌ BAD: Root next.config.mjs
// Creates ambiguity - which app does it apply to?
```

---

### 4.2 TypeScript Config

**✅ `apps/*/tsconfig.json`** - App-Specific TypeScript

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}
```

**Elite Practices**:

- ✅ Extend root `tsconfig.json`
- ✅ Add app-specific paths
- ✅ Include app-specific files

---

## 5. Shared Configs Strategy

### 5.1 Packages/Config Pattern

**✅ `packages/Monorepo/Config/`** - Shared Configurations

```
packages/Monorepo/Config/
├── eslint-config/
│   └── index.js
├── typescript-config/
│   └── base.json
└── package.json
```

**Elite Practices**:

- ✅ Create shared config packages
- ✅ Apps import and extend
- ✅ Single source of truth
- ✅ Version together

---

## 6. Configuration Hierarchy

### Elite Hierarchy

```
Root Configs (Monorepo-Level)
├── package.json          # Workspace definition
├── pnpm-workspace.yaml   # Workspace paths
├── turbo.json           # Build system
├── tsconfig.json        # Base TypeScript
├── .gitignore          # Git rules
└── [optional configs]   # Biome, Tailwind, etc.

App Configs (App-Specific)
├── apps/*/next.config.mjs    # Next.js config
├── apps/*/tsconfig.json      # TypeScript (extends root)
├── apps/*/tailwind.config.ts # Tailwind (if app-specific)
└── apps/*/package.json      # App dependencies

Package Configs (Package-Specific)
├── packages/*/tsconfig.json  # TypeScript (extends root)
└── packages/*/package.json   # Package dependencies

Shared Configs (Reusable)
└── packages/Monorepo/Config/          # Shared config packages
```

---

## 7. Elite Patterns

### 7.1 Config Inheritance

**✅ Pattern: Extend Root Configs**

```json
// apps/boardroom/tsconfig.json
{
  "extends": "../../tsconfig.json", // ✅ Extend root
  "compilerOptions": {
    "baseUrl": "." // ✅ Add app-specific
  },
  "references": [{ "path": "../../packages/shared-utils" }]
}
```

### 7.2 Environment Variables

**✅ Pattern: Track in turbo.json**

```json
{
  "globalEnv": [
    "NODE_ENV",
    "NEXT_PUBLIC_*", // ✅ Wildcard for Next.js public vars
    "TURBO_TOKEN",
    "TURBO_TEAM"
  ],
  "tasks": {
    "build": {
      "env": ["NODE_ENV", "NEXT_PUBLIC_*", "VERCEL_*"]
    }
  }
}
```

### 7.3 Cache Dependencies (Elite Scale Pattern)

**✅ Pattern: Minimal Global Dependencies**

```json
{
  "globalDependencies": [
    "package.json", // ✅ Affects all
    "pnpm-lock.yaml", // ✅ Affects all
    "pnpm-workspace.yaml", // ✅ Affects all
    "packages/Monorepo/Config/**/*.json" // ✅ Shared configs only
  ],
  "tasks": {
    "build": {
      "inputs": [
        "next.config.mjs", // ✅ App-specific (not global)
        "tsconfig.json", // ✅ App-specific (not global)
        "package.json" // ✅ App-specific (not global)
      ]
    }
  }
}
```

**Key Principle**:

- `globalDependencies` = Only configs that affect ALL apps
- Task `inputs` = Configs that affect specific apps

---

## 8. Anti-Patterns

### ❌ Don't: Root Next.js Config

```javascript
// ❌ BAD: Root next.config.mjs
// Creates ambiguity - which app does it apply to?
```

**✅ DO**: Put in `apps/*/next.config.mjs`

### ❌ Don't: Duplicate Configs

```json
// ❌ BAD: Same config in multiple apps
// apps/docs/tsconfig.json
// apps/boardroom/tsconfig.json
// (duplicate base config)
```

**✅ DO**: Extend root `tsconfig.json`

### ❌ Don't: App-Specific Root Configs

```typescript
// ❌ BAD: Root tailwind.config.ts for single app
// Only apps/docs uses Tailwind
```

**✅ DO**: Put in `apps/docs/tailwind.config.ts`

### ❌ Don't: Missing Global Dependencies

```json
// ❌ BAD: Not tracking root configs
{
  "globalDependencies": [] // Missing configs!
}
```

**✅ DO**: List all root configs that affect builds

---

## 9. ⚡ Scale Challenge: 500+ Config Files

### The Problem

**Scenario**: Monorepo with 500+ config files

- 200 apps (`apps/*/next.config.mjs`, `tsconfig.json`, etc.)
- 200 packages (`packages/*/tsconfig.json`, `package.json`, etc.)
- 100+ root/shared configs

**Consequences**:

#### 1. **TurboRepo Performance Degradation** ⚠️

```json
// ❌ PROBLEM: Listing 500 files in globalDependencies
{
  "globalDependencies": [
    "package.json",
    "tsconfig.json"
    // ... 498 more files
  ]
}
```

**Impact**:

- 🐌 **Slow cache key generation** (500+ file hashes)
- 🐌 **Slow cache invalidation** (checking 500+ files)
- 🐌 **High memory usage** (storing 500+ file metadata)
- 🐌 **Cache misses** (any config change invalidates everything)

**Performance Impact**:

- Cache key generation: **5-10 seconds** (vs <1s for 10 files)
- Cache invalidation: **10-30 seconds** (vs <2s for 10 files)
- Memory overhead: **50-100MB** (vs <5MB for 10 files)

---

#### 2. **TypeScript Project References Explosion** ⚠️

```json
// ❌ PROBLEM: 200+ references in root tsconfig.json
{
  "references": [
    { "path": "./packages/pkg-1" },
    { "path": "./packages/pkg-2" },
    // ... 198 more references
    { "path": "./apps/app-1" }
    // ... 200 more app references
  ]
}
```

**Impact**:

- 🐌 **Slow TypeScript compilation** (checking 200+ projects)
- 🐌 **High memory usage** (loading 200+ project graphs)
- 🐌 **IDE slowdown** (TypeScript server overwhelmed)
- 🐌 **Build time increase** (10-30x slower)

**Performance Impact**:

- TypeScript compilation: **30-60 seconds** (vs 2-5s for 10 projects)
- IDE responsiveness: **5-10 second delays** (vs <1s)
- Memory usage: **2-4GB** (vs 200-500MB)

---

#### 3. **Config Maintenance Nightmare** ⚠️

**Problems**:

- 🔍 **Hard to find** which config applies to what
- 🔍 **Duplicate configs** across apps/packages
- 🔍 **Inconsistent settings** (different versions, rules)
- 🔍 **Update propagation** (changing 200+ files)

**Maintenance Impact**:

- Finding relevant config: **5-10 minutes** (vs <30s)
- Updating all configs: **Hours** (vs minutes)
- Ensuring consistency: **Manual review** (error-prone)

---

#### 4. **Cache Invalidation Cascade** ⚠️

```json
// ❌ PROBLEM: Any root config change invalidates all 200 apps
{
  "globalDependencies": [
    "biome.json" // Change this → invalidates ALL 200 apps
  ]
}
```

**Impact**:

- 🐌 **Massive cache invalidation** (200+ apps rebuild)
- 🐌 **CI/CD slowdown** (full rebuilds instead of incremental)
- 🐌 **Wasted compute** (rebuilding unchanged apps)

**Performance Impact**:

- CI/CD build time: **30-60 minutes** (vs 5-10 min incremental)
- Cache hit rate: **<10%** (vs 80-90% with proper scoping)

---

### Elite Solutions for Scale

#### Solution 1: Config Layering & Inheritance ⭐

**Strategy**: Hierarchical config inheritance

```
Root (Base)
├── packages/Monorepo/Config/base/     # Base configs
│   ├── tsconfig.base.json
│   ├── eslint.base.json
│   └── biome.base.json
│
├── packages/Monorepo/Config/apps/     # App-specific base
│   ├── tsconfig.apps.json
│   └── next.config.base.mjs
│
└── packages/Monorepo/Config/packages/  # Package-specific base
    └── tsconfig.packages.json
```

**Implementation**:

```json
// packages/Monorepo/Config/base/tsconfig.base.json
{
  "compilerOptions": {
    "composite": true,
    "incremental": true
  }
}

// packages/Monorepo/Config/apps/tsconfig.apps.json
{
  "extends": "../base/tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}

// apps/my-app/tsconfig.json
{
  "extends": "@mythic/config-apps/tsconfig",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

**Benefits**:

- ✅ **Single source of truth** (base configs)
- ✅ **Easy updates** (change base, all inherit)
- ✅ **Reduced duplication** (200 files → 3 base configs)
- ✅ **Faster TurboRepo** (only track base configs)

---

#### Solution 2: Selective Global Dependencies ⭐

**Strategy**: Only track truly global configs

```json
// ✅ ELITE: Only root-level configs that affect ALL apps
{
  "globalDependencies": [
    "package.json", // ✅ Affects all
    "pnpm-lock.yaml", // ✅ Affects all
    "pnpm-workspace.yaml", // ✅ Affects all
    "packages/Monorepo/Config/**/*.json" // ✅ Shared configs only
  ],
  "tasks": {
    "build": {
      "inputs": [
        "next.config.mjs", // ✅ App-specific (not global)
        "tsconfig.json" // ✅ App-specific (not global)
      ]
    }
  }
}
```

**Benefits**:

- ✅ **Faster cache keys** (5-10 files vs 500+)
- ✅ **Targeted invalidation** (only affected apps rebuild)
- ✅ **Higher cache hit rate** (80-90% vs <10%)

---

#### Solution 3: TypeScript Project Reference Groups ⭐

**Strategy**: Group references by domain

```json
// ✅ ELITE: Grouped references
{
  "references": [
    // Core packages (always needed)
    { "path": "./packages/shared-utils" },
    { "path": "./packages/shared-types" },

    // Domain groups (optional)
    { "path": "./packages/domain-auth" },
    { "path": "./packages/domain-billing" },

    // Apps (only direct dependencies)
    { "path": "./apps/docs" },
    { "path": "./apps/boardroom" }
  ]
}
```

**Better**: Use TypeScript solution files

```json
// tsconfig.solution.json (root)
{
  "files": [],
  "references": [
    { "path": "./packages/shared-utils" },
    { "path": "./packages/shared-types" }
  ]
}

// apps/my-app/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "references": [
    { "path": "../../packages/shared-utils" },
    { "path": "../../packages/domain-auth" }
  ]
}
```

**Benefits**:

- ✅ **Faster compilation** (only compile what's needed)
- ✅ **Lower memory** (don't load unused projects)
- ✅ **Better IDE performance** (smaller project graph)

---

#### Solution 4: Config Packages with Versioning ⭐

**Strategy**: Versioned config packages

```
packages/Monorepo/Config/
├── base/
│   ├── package.json          # @mythic/config-base@1.0.0
│   └── tsconfig.json
├── apps/
│   ├── package.json          # @mythic/config-apps@1.0.0
│   └── tsconfig.json
└── packages/
    ├── package.json          # @mythic/config-packages@1.0.0
    └── tsconfig.json
```

**Usage**:

```json
// apps/my-app/package.json
{
  "devDependencies": {
    "@mythic/config-apps": "workspace:*"
  }
}

// apps/my-app/tsconfig.json
{
  "extends": "@mythic/config-apps/tsconfig"
}
```

**Benefits**:

- ✅ **Versioned configs** (can update gradually)
- ✅ **Workspace protocol** (automatic updates)
- ✅ **Type safety** (TypeScript knows about configs)
- ✅ **Easy migration** (update package version)

---

#### Solution 5: Config Generation & Templates ⭐

**Strategy**: Generate configs from templates

```typescript
// scripts/generate-configs.ts
import { writeFileSync } from "fs"
import { glob } from "glob"

const apps = glob.sync("apps/*/package.json")

apps.forEach((appPath) => {
  const appName = appPath.split("/")[1]

  // Generate tsconfig.json
  writeFileSync(
    `apps/${appName}/tsconfig.json`,
    JSON.stringify(
      {
        extends: "../../packages/Monorepo/Config/apps/tsconfig.json",
        compilerOptions: {
          baseUrl: ".",
          paths: {
            "@/*": ["./*"],
          },
        },
      },
      null,
      2
    )
  )
})
```

**Benefits**:

- ✅ **Consistency** (all configs from same template)
- ✅ **Easy updates** (change template, regenerate)
- ✅ **Reduced errors** (no manual copy-paste)

---

#### Solution 6: TurboRepo Task Filtering ⭐

**Strategy**: Use filters to avoid processing all configs

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": [
        "next.config.mjs", // ✅ Only app-specific
        "tsconfig.json", // ✅ Only app-specific
        "package.json" // ✅ Only app-specific
      ],
      "outputs": [".next/**"]
    }
  }
}
```

**Usage**:

```bash
# ✅ ELITE: Only build changed apps
turbo run build --filter=[HEAD^1]

# ✅ ELITE: Only build specific app
turbo run build --filter=@mythic/docs

# ✅ ELITE: Build app + dependencies
turbo run build --filter=@mythic/docs^...
```

**Benefits**:

- ✅ **Faster builds** (only build what changed)
- ✅ **Better caching** (per-app cache keys)
- ✅ **Parallel execution** (build multiple apps simultaneously)

---

### Elite Scale Architecture

```
Root (Minimal - 10-15 files)
├── package.json
├── pnpm-workspace.yaml
├── turbo.json              # ✅ Only truly global deps
├── tsconfig.json           # ✅ Base only
└── .gitignore

packages/Monorepo/Config/ (Shared - 5-10 files)
├── base/
│   └── tsconfig.base.json
├── apps/
│   └── tsconfig.apps.json
└── packages/
    └── tsconfig.packages.json

apps/*/ (Generated - 2-3 files per app)
├── next.config.mjs         # ✅ App-specific
├── tsconfig.json           # ✅ Extends @mythic/config-apps
└── package.json            # ✅ App dependencies

packages/*/ (Generated - 1-2 files per package)
├── tsconfig.json           # ✅ Extends @mythic/config-packages
└── package.json            # ✅ Package dependencies
```

**Result**:

- ✅ **10-15 root configs** (vs 500+)
- ✅ **5-10 shared configs** (vs 200+ duplicates)
- ✅ **Generated app/package configs** (consistent, maintainable)
- ✅ **Fast TurboRepo** (only track 10-15 files)
- ✅ **Fast TypeScript** (only compile what's needed)

---

### Performance Comparison

| Metric                     | 500 Configs (Naive) | 500 Configs (Elite) | Improvement    |
| -------------------------- | ------------------- | ------------------- | -------------- |
| **Cache Key Generation**   | 5-10s               | <1s                 | **10x faster** |
| **Cache Invalidation**     | 10-30s              | <2s                 | **15x faster** |
| **TypeScript Compilation** | 30-60s              | 2-5s                | **12x faster** |
| **CI/CD Build Time**       | 30-60min            | 5-10min             | **6x faster**  |
| **Cache Hit Rate**         | <10%                | 80-90%              | **9x better**  |
| **Memory Usage**           | 2-4GB               | 200-500MB           | **8x less**    |

---

## 📋 Elite Scale Checklist

### For 500+ Config Files:

- [ ] **Config Layering**: Use hierarchical inheritance
- [ ] **Selective Global Deps**: Only track truly global configs
- [ ] **Project Reference Groups**: Group by domain
- [ ] **Config Packages**: Versioned, reusable configs
- [ ] **Config Generation**: Generate from templates
- [ ] **Task Filtering**: Use TurboRepo filters
- [ ] **Monitor Performance**: Track cache hit rates, build times
- [ ] **Gradual Migration**: Update configs incrementally

---

## 🎯 Elite Summary

### Small Scale (<50 configs)

- ✅ Simple root configs
- ✅ Direct inheritance
- ✅ Manual management OK

### Medium Scale (50-200 configs)

- ✅ Config packages
- ✅ Selective global deps
- ✅ Some automation

### Large Scale (200-500+ configs) ⭐

- ✅ **Config layering** (hierarchical)
- ✅ **Selective global deps** (only root)
- ✅ **Config generation** (from templates)
- ✅ **Project reference groups** (by domain)
- ✅ **Versioned config packages** (gradual updates)
- ✅ **Task filtering** (build only what changed)

**Result**: ✅ **Scalable, maintainable, performant**

---

## 10. Package Boundary Enforcement ⭐ **NEW**

### 10.1 Prime Monad Boundary Rules

**Purpose**: Enforce architectural boundaries (RFL doctrine, domain isolation)

**Elite Practice**: Prevent cross-domain imports and maintain single source of
truth

### 10.2 ESLint Import Restrictions

**✅ Pattern: Enforce Package Boundaries**

```json
// packages/Monorepo/Config/eslint-config/index.js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@mythic/domain-*'],
            message: 'Cross-domain imports forbidden. Use @mythic/shared-types instead.',
            allowTypeImports: true,
          },
          {
            group: ['apps/*'],
            message: 'Apps cannot import from other apps. Use shared packages instead.',
          },
        ],
      },
    ],
  },
}
```

**Usage**:

```typescript
// ❌ FORBIDDEN: Cross-domain import
import { Invoice } from "@mythic/domain-finance"
// In domain-procurement/rfl/store.ts

// ✅ CORRECT: Use shared-types bridge
import { Invoice } from "@mythic/typescript-shared-types"
// In domain-procurement/rfl/store.ts
```

### 10.3 Dependency Graph Validation

**✅ Pattern: CI Dependency Check**

```typescript
// scripts/validate-boundaries.ts
import { readFileSync } from "fs"
import { glob } from "glob"

function validateBoundaries() {
  const apps = glob.sync("apps/*/package.json")

  for (const appPath of apps) {
    const pkg = JSON.parse(readFileSync(appPath, "utf-8"))
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }

    // Check for forbidden cross-app imports
    for (const dep of Object.keys(deps)) {
      if (dep.startsWith("@mythic/") && dep.includes("apps/")) {
        throw new Error(`App ${appPath} imports from another app: ${dep}`)
      }
    }
  }
}
```

**CI Integration**:

```yaml
# .github/workflows/ci.yml
- name: Validate Boundaries
  run: pnpm validate:boundaries
```

**Elite Practices**:

- ✅ Enforce RFL doctrine (no cross-domain imports)
- ✅ Prevent app-to-app imports
- ✅ Use shared-types as bridge between domains
- ✅ Validate in CI/CD pipeline

---

## 11. Cursor Governance Configuration ⭐ **NEW**

### 11.1 Cursor as First-Class Tool

**Purpose**: Configure Cursor AI agent governance alongside runtime tooling

### 11.2 `.cursorignore` - Agent Context Boundaries

**✅ `.cursorignore`** - Cursor AI Context Rules

```gitignore
# Dependencies (exclude from AI context)
node_modules/
.pnp/

# Build outputs
.next/
out/
dist/
build/
.turbo

# Environment
.env
.env*.local

# Logs
*.log

# Testing
coverage/
.nyc_output

# Temporary
*.tmp
*.temp
.cache/

# Documentation archives (historical reference only)
.cursor/archive/

# PRD / Architecture Planning (preserved zones)
.cursor/planing
.cursor/product
```

**Elite Practices**:

- ✅ Exclude build artifacts from AI context
- ✅ Preserve planning zones (`.cursor/planing`, `.cursor/product`)
- ✅ Archive historical docs (`.cursor/archive/`)
- ✅ Keep AI context focused on active code

### 11.3 Cursor Documentation Hierarchy

**✅ Canonical Documentation Locations**

```
.cursor/
├── docs/              # ✅ Layer 3: Canonical reference (AI reads)
│   ├── architecture/
│   ├── patterns/
│   └── guides/
├── planing/            # ✅ Preserved: Planning artifacts (immutable)
├── product/            # ✅ Preserved: Product specs (immutable)
└── archive/            # ✅ Historical: Excluded from AI context
```

**Elite Practices**:

- ✅ `.cursor/docs/` = Canonical reference (AI reads for context)
- ✅ `.cursor/planing/` = Preserved zone (immutable, codeowner-protected)
- ✅ `.cursor/product/` = Preserved zone (immutable, codeowner-protected)
- ✅ `.cursor/archive/` = Historical (excluded from AI context)

### 11.4 Cursor Rules Governance

**✅ Rule Configuration** (see `.cursor/rules/000_RULE_GOVERNANCE.mdc`)

**Elite Practices**:

- ✅ Only 3 rules with `alwaysApply: true` (governance, master, safety)
- ✅ All other rules use `alwaysApply: false` with glob patterns
- ✅ Pre-commit validation enforces rule configuration
- ✅ Performance budget: <13 active rules, <50ms load time

---

## 12. Three Governing Rules (Seal-Ready) ⭐

### Rule 1: Root is Minimal and Monorepo-Only

**✅ CANONICAL**:

- Root configs = Only monorepo-level configs
- App-specific configs = `apps/*/`
- Shared configs = `packages/Monorepo/Config/`

**Enforcement**:

- ❌ No `next.config.*` at root
- ❌ No app-specific configs at root
- ✅ Only 10-15 root configs maximum

### Rule 2: All Shared Config Lives in `packages/Monorepo/Config/*`

**✅ CANONICAL**:

- Shared configs = `packages/Monorepo/Config/*` packages
- TurboRepo tracks `packages/Monorepo/Config/**/*.json` in globalDependencies
- Apps extend shared configs via workspace packages

**Enforcement**:

- ✅ Versioned config packages (`@mythic/config-*`)
- ✅ Single source of truth
- ✅ No duplication across apps

### Rule 3: TypeScript Solution-Style References is Canonical

**✅ CANONICAL**:

- Root `tsconfig.json` = Base config only (NO references)
- Each app/package = References only direct dependencies
- Prevents reference explosion at scale

**Enforcement**:

- ❌ No references array in root `tsconfig.json`
- ✅ Apps reference only their dependencies
- ✅ Prevents 200+ project reference explosion

---

## 📋 Elite Scale Checklist

### For 500+ Config Files:

- [ ] **Config Layering**: Use hierarchical inheritance
- [ ] **Selective Global Deps**: Only track truly global configs (10-15 files)
- [ ] **Solution-Style References**: Root has NO references, apps reference only
      deps
- [ ] **Config Packages**: Versioned, reusable configs in `packages/Monorepo/Config/`
- [ ] **Config Generation**: Generate from templates
- [ ] **Task Filtering**: Use TurboRepo filters
- [ ] **Boundary Enforcement**: ESLint + CI validation
- [ ] **Cursor Governance**: `.cursorignore` + preserved zones
- [ ] **Monitor Performance**: Track cache hit rates, build times
- [ ] **Gradual Migration**: Update configs incrementally

---

## 🎯 Elite Summary

### Small Scale (<50 configs)

- ✅ Simple root configs
- ✅ Direct inheritance
- ✅ Manual management OK

### Medium Scale (50-200 configs)

- ✅ Config packages
- ✅ Selective global deps
- ✅ Some automation

### Large Scale (200-500+ configs) ⭐

- ✅ **Config layering** (hierarchical)
- ✅ **Selective global deps** (only root, 10-15 files)
- ✅ **Solution-style references** (root has NO references)
- ✅ **Config generation** (from templates)
- ✅ **Versioned config packages** (gradual updates)
- ✅ **Task filtering** (build only what changed)
- ✅ **Boundary enforcement** (ESLint + CI)
- ✅ **Cursor governance** (agent context boundaries)

**Result**: ✅ **Scalable, maintainable, performant, governance-grade**

---

**Last Updated**: 2026-01-11 **Status**: ✅ **Governance-Grade - Seal-Ready**
