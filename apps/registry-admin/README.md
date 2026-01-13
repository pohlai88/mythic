# Registry Admin Dashboard

Standalone admin dashboard for the Function & Script Registry.

## Quick Start

```bash
# Scan registry and start dashboard (default port 4000)
pnpm registry:all

# Or use explicit command
pnpm registry:admin

# Custom port via environment variable
REGISTRY_ADMIN_PORT=5000 pnpm registry:admin:port
```

Dashboard will be available at: **http://localhost:4000**

## Features

- ✅ **TanStack Query Integration** - Type-safe data fetching with caching
- ✅ **Comprehensive Schema** - Includes dependencies, lineage, and metadata
- ✅ **Dynamic Path Resolution** - No hardcoded paths, uses config + env
- ✅ **Next.js Best Practices** - Proper app/ and shared/ boundaries
- ✅ **Environment Variables** - Configurable via `.env` file

## Configuration

### Environment Variables

Add to root `.env` file:

```env
# Registry Admin Port (default: 4000)
REGISTRY_ADMIN_PORT=4000

# Custom registry path (optional)
REGISTRY_PATH=./scripts/function-registry.json
```

### Structure

```
apps/registry-admin/
├── app/                    # Next.js App Router (top level)
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── shared/                # Shared code (bottom level)
│   ├── config/            # Configuration
│   ├── hooks/             # React hooks (TanStack Query)
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
└── package.json
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
cd apps/registry-admin
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Architecture

### Clear Boundaries

- **Top Level (`app/`)**: Next.js routes, pages, API routes
- **Bottom Level (`shared/`)**: Reusable utilities, hooks, types, config

### No Hardcoding

- All paths resolved dynamically via config system
- Environment variables for configuration
- Works in both monorepo and standalone contexts

### TanStack Query

- Type-safe data fetching
- Automatic caching and refetching
- Optimistic updates support
- DevTools integration

## Related

- `scripts/registry-scanner.ts` - Registry scanner
- `scripts/registry-query.ts` - CLI query tool
- `scripts/function-registry.json` - Registry data
