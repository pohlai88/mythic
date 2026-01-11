# Nextra Documentation App

This is the Nextra 4 documentation site for the monorepo.

## Structure

```
apps/docs/
├── app/              # Next.js App Router pages
├── components/       # Nextra-specific components
├── content/          # MDX documentation files
├── lib/              # Utilities (i18n, etc.)
├── pages/            # Legacy pages directory
├── public/           # Static assets
├── styles/           # Global styles
├── mdx-components.tsx # MDX component registry
└── next.config.mjs   # Next.js + Nextra configuration
```

## Development

```bash
# Run dev server
pnpm dev:docs

# Or from root
cd apps/docs
pnpm dev
```

## Features

- Nextra 4 with App Router
- Pagefind search (Rust-powered)
- Governance components
- i18n support
- KaTeX for math rendering

## Content Organization

- `content/` - Main documentation content (MDX files)
- `pages/` - Legacy pages (being migrated to app/)
- `content/product/` - Product documentation including PRD

## Dependencies

This app uses workspace packages:
- `@mythic/shared-utils` - Shared utility functions
- `@mythic/design-system` - Design system (if needed)

## Configuration

- Next.js config: `next.config.mjs`
- TypeScript config: `tsconfig.json`
- Nextra config: In `next.config.mjs` via `nextra()` wrapper
