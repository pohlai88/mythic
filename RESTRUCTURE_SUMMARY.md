# Monorepo Restructure Summary

## ✅ Completed

### 1. Directory Structure Created
- ✅ `apps/docs/` - Nextra documentation app
- ✅ `apps/boardroom/` - Executive BoardRoom MVP app
- ✅ `packages/design-system/` - Axis Visual Canon design system
- ✅ `packages/shared-types/` - Shared TypeScript types & Zod schemas
- ✅ `packages/shared-utils/` - Shared utility functions
- ✅ `packages/config/` - Shared configurations

### 2. Package Configuration
- ✅ Created `package.json` for all packages
- ✅ Updated root `package.json` with monorepo scripts
- ✅ Updated `pnpm-workspace.yaml` with workspace structure
- ✅ Updated `turbo.json` (already configured)

### 3. TypeScript Configuration
- ✅ Updated root `tsconfig.json` with workspace path mappings
- ✅ Created `tsconfig.json` for each package
- ✅ Created `tsconfig.json` for each app

### 4. Design System Package
- ✅ Created Axis Visual Canon v1.0.0 tokens
- ✅ Created Button component (following Axis principles)
- ✅ Created Card component (following Axis principles)
- ✅ Exported all design system components

### 5. Shared Packages
- ✅ Created `shared-utils` with `cn()`, composition utilities, date utilities
- ✅ Created `shared-types` with BoardRoom and ERP domain types
- ✅ Created Zod schemas for proposals, circles, thanos events

### 6. Apps Structure
- ✅ Created `apps/docs` with Nextra 4 configuration
- ✅ Created `apps/boardroom` with basic Next.js structure
- ✅ Created initial layout and page components

## 📋 Next Steps (Manual Migration Required)

### Step 1: Move Nextra Files to `apps/docs/`

```bash
# Move app directory
mv app apps/docs/

# Move content directory
mv content apps/docs/

# Move pages directory
mv pages apps/docs/

# Move MDX components
mv mdx-components.tsx apps/docs/

# Move Nextra remote filepaths
mv nextra-remote-filepaths apps/docs/

# Move Nextra-specific components
mkdir -p apps/docs/components/governance
mv components/governance/* apps/docs/components/governance/
mv components/api-reference.tsx apps/docs/components/
mv components/code-block.tsx apps/docs/components/
mv components/steps.tsx apps/docs/components/
mv components/tabs.tsx apps/docs/components/

# Move i18n
mkdir -p apps/docs/lib
mv lib/i18n apps/docs/lib/
```

### Step 2: Update Import Paths in `apps/docs`

After moving files, update imports:

**In `apps/docs/app/layout.tsx`:**
```typescript
// Change from:
import { cn } from '@/lib/utils'

// To:
import { cn } from '@mythic/shared-utils'
```

**In `apps/docs/mdx-components.tsx`:**
```typescript
// Update component imports to use relative paths
import { AmendmentHistory, ... } from './components/governance'
```

### Step 3: Move Styles

```bash
# Move styles to apps/docs
mv styles apps/docs/
```

### Step 4: Update `apps/docs` Dependencies

The `apps/docs/package.json` already includes workspace dependencies. After moving files, run:

```bash
pnpm install
```

### Step 5: Create BoardRoom App Structure

The basic structure is created. Next, implement:

1. **Database Schema** (`apps/boardroom/src/db/schema.ts`)
   - Proposals table
   - Circles table
   - Thanos events table
   - User configs table
   - Global config table

2. **The 9 Weapons** (`apps/boardroom/src/weapons/`)
   - Codex (Living Schema)
   - Thanos Trace (Forensic Audit)
   - BoardDialog (Collaboration)
   - Hierarchy (Circles & Admin)
   - Vault (Encryption)
   - Vectors (Analytics)
   - Compass (To-Dos)
   - Oracle (What-If Analysis)
   - Herald (Broadcasts)

3. **Components** (`apps/boardroom/components/`)
   - Pool Table (Proposal List + Dashboard)
   - Strategy Drawer (4 Tabs)
   - Golden Thumb (Approval Mechanism)

4. **Server Actions** (`apps/boardroom/app/actions/`)
   - Proposal creation/approval/veto
   - Comment management
   - Config management

### Step 6: Update Root Files

Some files should remain at root:
- `turbo.json` ✅ (already configured)
- `pnpm-workspace.yaml` ✅ (already updated)
- `package.json` ✅ (already updated)
- `tsconfig.json` ✅ (already updated)
- `.gitignore` (keep at root)
- `.cursor/` (keep at root)
- `scripts/` (keep at root)
- `docs/` (keep at root - system documentation)

### Step 7: Clean Up

After migration, remove or update:
- Root `next.config.mjs` (no longer needed at root)
- Root `app/` directory (moved to `apps/docs/`)
- Root `components/` directory (split between apps)
- Root `lib/` directory (moved to packages)

## 🎯 Architecture Principles

### NexusCanon v4.0.0 + Olympian v1.0.0

1. **Single Indivisible Runtime**
   - Application logic, database access, and UI rendering in unified memory space
   - Monorepo structure ensures atomic truth

2. **The Prime Monad**
   - One Runtime. One Truth. Zero Latency.
   - Shared packages ensure consistency

3. **Material Truth (Axis Visual Canon)**
   - Colors represent material states (Void, Obsidian, Parchment, Ash, Gold, Ember)
   - Pure white (#FFFFFF) is FORBIDDEN - use Parchment (#f8f5f0)
   - Motion obeys gravitational time (700-1200ms hover, 1618ms commitment)

## 📚 Key Files

- **PRD**: `content/product/PRD_Decision_BoardRoom_MVP.md`
- **Architecture**: `.cursor/NexusCanon_Olympian.md`
- **Migration Guide**: `MONOREPO_RESTRUCTURE.md`
- **This Summary**: `RESTRUCTURE_SUMMARY.md`

## 🚀 Development Commands

```bash
# Install dependencies
pnpm install

# Run all apps
pnpm dev

# Run specific app
pnpm dev:docs
pnpm dev:boardroom

# Build all
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint
```

## ✨ Benefits of New Structure

1. **Clear Separation**: Apps and packages are clearly separated
2. **Shared Code**: Design system and utilities are reusable
3. **Type Safety**: Shared types ensure consistency
4. **Scalability**: Easy to add new apps or packages
5. **Build Optimization**: Turborepo caches and parallelizes builds
6. **Developer Experience**: Clear structure, easy navigation

## 🔄 Migration Checklist

- [ ] Move Nextra files to `apps/docs/`
- [ ] Update import paths in `apps/docs`
- [ ] Move styles to `apps/docs`
- [ ] Run `pnpm install` to link workspace packages
- [ ] Test `apps/docs` builds and runs
- [ ] Implement BoardRoom app structure
- [ ] Create database schema for BoardRoom
- [ ] Implement The 9 Weapons
- [ ] Update any remaining root-level imports
- [ ] Clean up unused root files
- [ ] Update CI/CD if needed
- [ ] Update documentation

---

**Status**: Structure created, ready for file migration
**Next Action**: Move files from root to `apps/docs/` following Step 1 above
