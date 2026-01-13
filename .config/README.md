# Configuration Files Directory

This directory contains all moveable configuration files that were previously at
the project root.

## Moved Config Files

### Linting & Formatting

- `eslint.config.mjs` - ESLint configuration
- `eslint.typed.config.mjs` - TypeScript-specific ESLint configuration

### Testing

- `vitest.config.ts` - Vitest test configuration
- `vitest.setup.ts` - Vitest setup file

### Database

- `drizzle.config.ts` - Drizzle ORM configuration

### Code Generation

- `codegen.yml` - GraphQL code generation configuration

### Design System

- `figma-export.config.js` - Figma export CLI configuration
- `handoff.config.js` - Handoff design token sync configuration
- `components.json` - shadcn/ui configuration

### Other

- `zod-waivers.json` - Zod validation waivers
- `vercel-types.d.ts` - Vercel TypeScript types

## Required Root Configs (Not Moved)

These config files **must** remain at the project root:

- `package.json` - Package manager requirement
- `pnpm-workspace.yaml` - pnpm workspace requirement
- `turbo.json` - Turborepo requirement
- `tsconfig.json` - Base TypeScript configuration
- `next-env.d.ts` - Next.js requirement

## Usage

All tools have been updated to reference configs in `.config/`:

```bash
# ESLint
pnpm lint:typed  # Uses .config/eslint.typed.config.mjs

# Drizzle
pnpm db:generate  # Uses .config/drizzle.config.ts

# Vitest
pnpm test  # Uses .config/vitest.config.ts

# Figma Export
pnpm figma:export-components  # Uses .config/figma-export.config.js
```

## Migration Date

**2026-01-13** - All config files moved from root to `.config/` directory.
