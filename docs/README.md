# Documentation Directory

This directory contains all project documentation organized by category.

## 📁 Structure

```
docs/
├── README.md              # This file - documentation index
│
├── guides/                # How-to guides and tutorials
│   ├── getting-started.md
│   ├── setup.md
│   └── deployment.md
│
├── architecture/          # System architecture documentation
│   ├── overview.md
│   ├── tech-stack.md
│   └── design-decisions.md
│
├── api/                   # API documentation
│   ├── graphql.md
│   ├── rest.md
│   └── trpc.md
│
├── migrations/            # Migration guides (archived)
│   ├── nextra-4/         # Nextra 4 migration docs
│   ├── zod-v4/           # Zod v4 migration docs
│   └── validation/       # Validation migration docs
│
├── reference/             # Reference documentation
│   ├── zod-schemas.md
│   ├── nextra-config.md
│   └── biome-config.md
│
└── changelog/             # Implementation summaries
    └── 2025-01/          # Monthly changelog entries
```

## 🎯 Quick Navigation

### Getting Started
- [Quick Start Guide](../QUICK_START.md) - Get up and running quickly
- [Setup Guide](./guides/setup.md) - Detailed setup instructions

### Architecture
- [System Overview](./architecture/overview.md) - High-level architecture
- [Tech Stack](./architecture/tech-stack.md) - Technology choices

### API Documentation
- [GraphQL API](./api/graphql.md) - GraphQL endpoint documentation
- [REST API](./api/rest.md) - REST endpoint documentation
- [tRPC API](./api/trpc.md) - tRPC endpoint documentation

### Migrations
- [Nextra 4 Migration](./migrations/nextra-4/) - Nextra 4 upgrade guide
- [Zod v4 Migration](./migrations/zod-v4/) - Zod v4 enforcement guide
- [Validation Migration](./migrations/validation/) - Validation setup guide

### Reference
- [Zod Schemas](./reference/zod-schemas.md) - Schema reference
- [Nextra Config](./reference/nextra-config.md) - Nextra configuration
- [Biome Config](./reference/biome-config.md) - Biome configuration

## 📝 Documentation Standards

### File Naming
- Use kebab-case for filenames: `getting-started.md`
- Be descriptive: `api-authentication.md` not `auth.md`

### Structure
- Start with frontmatter (optional but recommended):
  ```markdown
  ---
  title: Page Title
  date: 2025-01-27
  category: guide
  ---
  ```

### Links
- Use relative paths for internal links: `[Guide](./guides/setup.md)`
- Use absolute paths from root for cross-directory links: `/docs/api/graphql.md`

### Formatting
- Follow markdownlint rules (see `.markdownlint.json`)
- Maximum line length: 120 characters
- Use proper heading hierarchy (h1 → h2 → h3 → h4)

## 🛠️ Tools

### Validation
```bash
# Validate all documentation
pnpm validate-docs

# Lint markdown files
pnpm docs:lint

# Auto-fix linting issues
pnpm docs:lint:fix
```

### Organization
```bash
# Preview document organization (dry-run)
pnpm organize-docs:dry-run

# Organize documents
pnpm organize-docs
```

## 📚 Best Practices

1. **Keep it organized**: Place files in appropriate subdirectories
2. **Update regularly**: Keep documentation in sync with code changes
3. **Link properly**: Use relative paths and validate links
4. **Be consistent**: Follow naming conventions and formatting standards
5. **Document decisions**: Use architecture docs for design decisions

## 🔍 Finding Documentation

- **Quick Start**: See [QUICK_START.md](../QUICK_START.md)
- **Cursor AI Docs**: See [.cursor/docs/](../.cursor/docs/)
- **VS Code Config**: See [.vscode/](../.vscode/)

---

**Last Updated**: 2025-01-27
**Maintained by**: Development Team
