# StratonHub

> Production-ready ERP documentation system built with Next.js App Router,
> Tailwind CSS v4, and custom MDX processing

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Related Documentation](#related-documentation)

---

## Overview

The ERP Documentation System provides comprehensive documentation for
developers, end users, and business stakeholders. Built with Next.js 16 App
Router, Tailwind CSS v4, and custom MDX processing, it delivers a fast,
searchable, and professional documentation experience.

**Purpose**: Provide a single source of truth for all ERP system documentation,
serving multiple audiences with appropriate content and navigation.

**Key Features**:

- Audience-based navigation (Developers, Users, Business)
- Surface-based organization (11 surfaces/domains)
- Fuzzy full-text search with command palette (Cmd+K)
- Type-safe content validation with Drizzle Zod schemas
- Diataxis framework for content structure
- Responsive design with Tailwind V4

**Tech Stack**:

- Next.js 16 (App Router)
- Tailwind CSS v4
- @next/mdx for MDX processing
- Drizzle Zod for schema validation
- Fuse.js for fuzzy search
- cmdk for command palette

---

## Quick Start

Get the documentation system running in 3 steps:

```bash
# Step 1: Install dependencies
pnpm install

# Step 2: Start development server
pnpm dev

# Step 3: Open in browser
# Navigate to http://localhost:3000
```

**Prerequisites**:

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Workspace dependencies installed

---

## Installation

### From Source

```bash
# Clone repository (if not already cloned)
git clone [repository-url]

# Navigate to StratonHub app
cd apps/StratonHub

# Install dependencies
pnpm install

# Build
pnpm build
```

### Development Setup

```bash
# Install all workspace dependencies
cd [monorepo-root]
pnpm install

# Start StratonHub development server
cd apps/StratonHub
pnpm dev
```

---

## Usage

### Development Server

```bash
# Start development server with Turbopack
pnpm dev

# Server runs on http://localhost:3000
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Search Functionality

- Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open command palette
- Type to search documentation
- Results show with context and route information

### Content Management

- Add MDX files to `app/(audiences)/[audience]/[surface]/page.mdx`
- Frontmatter must validate against Drizzle Zod schema
- Content must follow Diataxis framework

---

## Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://nexuscanon.dev
ANALYZE=true  # Enable bundle analysis
```

### Next.js Configuration

Configuration in `next.config.mjs`:

- MDX processing with `@next/mdx`
- Performance optimizations
- Security headers
- Image optimization

### Tailwind V4 Configuration

Configuration in `postcss.config.mjs` and `app/globals.css`:

- Design system tokens
- Custom theme variables
- Responsive breakpoints

---

## Architecture

### Directory Structure

```
apps/StratonHub/
├── app/                          # Next.js App Router
│   ├── (audiences)/             # Route group for audiences
│   │   ├── developers/          # Developers documentation
│   │   ├── users/               # End users documentation
│   │   └── business/             # Business stakeholders documentation
│   ├── api/                     # API routes
│   │   └── search/              # Search API endpoint
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   └── docs/                     # Documentation components
│       ├── CommandPalette.tsx   # Cmd+K command palette
│       ├── AudienceSelector.tsx  # Audience switcher
│       └── ModuleNav.tsx        # Surface navigation
├── lib/
│   ├── content/                 # Content management
│   │   ├── schemas.ts           # Drizzle Zod schemas
│   │   └── loader.ts             # Content loading
│   └── search/                  # Search functionality
│       ├── index-builder.ts     # Build-time indexing
│       └── fuzzy.ts             # Fuzzy search
├── templates/
│   ├── layout-schemas/          # Layout wireframes
│   └── content-schemas/         # Content templates
├── scripts/                      # Validation scripts
└── public/                       # Static assets
```

### Key Concepts

**Audience-Based Organization**: Content organized by target audience
(developers, users, business) for better navigation and discovery.

**Surface-Based Routing**: Dynamic routes for surfaces/domains enable scalable
content organization.

**Type-Safe Content**: Drizzle Zod schemas ensure all content frontmatter is
validated at build time.

**Diataxis Framework**: Content follows Diataxis document types (tutorial,
how-to, reference, explanation) for consistent structure.

### Data Flow

1. **Build Time**: MDX files indexed, frontmatter validated, search index
   generated
2. **Request Time**: Routes resolved, content loaded, metadata generated
3. **Runtime**: Search queries processed, command palette provides results

---

## API Reference

### Search API

#### `GET /api/search`

Search documentation content.

**Query Parameters**:

| Parameter  | Type     | Required | Description        |
| ---------- | -------- | -------- | ------------------ |
| `q`        | `string` | Yes      | Search query       |
| `audience` | `string` | No       | Filter by audience |
| `surface`  | `string` | No       | Filter by surface  |
| `limit`    | `number` | No       | Results limit      |

**Response**:

```json
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "route": "string",
      "audience": "developers" | "users" | "business",
      "surface": "string",
      "type": "tutorial" | "how-to" | "reference" | "explanation",
      "score": 0.5
    }
  ],
  "total": 10
}
```

### Content Schemas

#### `FrontmatterInsertSchema`

Schema for validating new content frontmatter.

**Required Fields**:

- `title`: string
- `audience`: 'developers' | 'users' | 'business'

**Optional Fields**:

- `description`: string
- `surface`: Surface/domain name
- `type`: Diataxis document type
- `published`: boolean (default: true)
- `last_updated`: datetime string (YYYY-MM-DD format)

---

## Development

### Setup Development Environment

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run type checking
pnpm type-check

# Run linter
pnpm lint
```

### Development Workflow

1. Create content in `app/(audiences)/[audience]/[surface]/page.mdx`
2. Ensure frontmatter validates against schema
3. Test content rendering
4. Validate with `pnpm docs:validate`
5. Commit changes

### Code Style

- Follow TypeScript strict mode
- Use Tailwind V4 utilities (no custom CSS)
- Follow Next.js App Router conventions
- Use Drizzle Zod schemas for validation

### Adding New Content

1. Choose appropriate audience and surface
2. Select document type (tutorial, how-to, reference, explanation)
3. Use template from `templates/content-schemas/`
4. Fill in frontmatter following schema
5. Write content following Diataxis structure
6. Validate with `pnpm docs:validate`

---

## Testing

### Run Validation Scripts

```bash
# Validate all documentation
pnpm docs:validate

# Check for pollution (archive references)
pnpm docs:check-pollution

# Check Next.js compliance
pnpm docs:check-nextjs

# Check Tailwind compliance
pnpm docs:check-tailwind

# Validate README files
pnpm readme:validate-all

# Check README-only policy
pnpm readme:check-only
```

### Test Structure

Validation scripts ensure:

- Content schema compliance
- Next.js App Router compliance
- Tailwind V4 compliance
- README-only policy compliance
- Zero pollution from archive

---

## Troubleshooting

### Common Issues

#### Issue: Build fails with schema validation errors

**Symptoms**: Build fails with Zod validation errors

**Cause**: Frontmatter doesn't match Drizzle Zod schema

**Solution**:

1. Check frontmatter against schema in `lib/content/schemas.ts`
2. Ensure all required fields are present
3. Ensure field types match schema
4. Run `pnpm docs:validate` to see specific errors

#### Issue: Search not working

**Symptoms**: Command palette shows no results

**Cause**: Search index not generated or API not working

**Solution**:

1. Ensure search index exists: `public/search-index.json`
2. Check API route: `app/api/search/route.ts`
3. Verify search index was built at build time
4. Check browser console for errors

#### Issue: MDX files not rendering

**Symptoms**: MDX pages show 404 or don't render

**Cause**: File structure doesn't match App Router conventions

**Solution**:

1. Ensure files are in `app/` directory
2. Use `page.mdx` for route pages
3. Check route structure matches file path
4. Verify `next.config.mjs` has MDX configuration

#### Issue: Tailwind styles not applying

**Symptoms**: Styles don't appear or look wrong

**Cause**: Tailwind V4 not configured correctly

**Solution**:

1. Check `postcss.config.mjs` has `@tailwindcss/postcss` plugin
2. Verify `app/globals.css` imports Tailwind
3. Ensure design system tokens are defined
4. Check for hardcoded colors (should use tokens)

### Getting Help

- [Next.js Documentation](https://nextjs.org/docs) - Next.js App Router
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs) - Tailwind V4
- [Diataxis Framework](https://diataxis.fr/) - Content structure
- [Drizzle Zod](https://orm.drizzle.team/docs/zod) - Schema validation

---

## License

Private - Internal use only

---

## Related Documentation

- [Selective Copy Process](./SELECTIVE_COPY_PROCESS.md) - How to copy content
  from archive
- [Layout Schemas](./templates/layout-schemas/) - Layout wireframes
- [Content Templates](./templates/content-schemas/) - Content templates
- [System Documentation](../../docs/README.md) - System documentation
- [Design System](../../packages/design-system/README.md) - Design system

---

**Version**: 1.0.0 **Last Updated**: 2026-01-11 **Status**: Active
