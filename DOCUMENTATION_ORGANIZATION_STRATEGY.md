# Documentation Organization Strategy

**Status**: Implementation Plan
**Date**: 2025-01-27
**Priority**: High - Repository Cleanliness

---

## 🎯 Problem Statement

The repository root contains **212+ markdown files** scattered across multiple directories, making it difficult for developers to:
- Find relevant documentation
- Understand project structure
- Maintain clean workspace
- Onboard new team members

---

## 📊 Current State Analysis

### Root Directory Clutter
- **Implementation Summaries**: 30+ files (NEXTRA_4_*, ZOD_*, VALIDATION_*)
- **Migration Guides**: 15+ files
- **Quick References**: 10+ files
- **Setup Guides**: 8+ files
- **Architecture Docs**: Mixed in root and `.cursor/` directories

### Existing Structure
- ✅ `docs/` - Empty except README (intended for public docs)
- ✅ `.cursor/docs/` - Cursor-specific documentation
- ✅ `.cursor/rules/` - Cursor rules (.mdc files)
- ✅ `.vscode/` - VS Code configuration and docs
- ❌ Root directory - Cluttered with 80+ markdown files

---

## 🏗️ Proposed Structure

```
mythic/
├── README.md                    # Main project README (keep)
├── QUICK_START.md              # Quick start guide (keep in root)
│
├── docs/                        # Public project documentation
│   ├── README.md               # Documentation index
│   │
│   ├── guides/                 # How-to guides
│   │   ├── getting-started.md
│   │   ├── setup.md
│   │   ├── deployment.md
│   │   └── troubleshooting.md
│   │
│   ├── architecture/           # System architecture
│   │   ├── overview.md
│   │   ├── tech-stack.md
│   │   └── design-decisions.md
│   │
│   ├── api/                    # API documentation
│   │   ├── graphql.md
│   │   ├── rest.md
│   │   └── trpc.md
│   │
│   ├── migrations/             # Migration guides (archived)
│   │   ├── nextra-4/
│   │   │   ├── overview.md
│   │   │   ├── theme-config.md
│   │   │   ├── remote-docs.md
│   │   │   └── component-migration.md
│   │   ├── zod-v4/
│   │   │   └── enforcement-strategy.md
│   │   └── validation/
│   │       └── biome-migration.md
│   │
│   ├── reference/              # Reference documentation
│   │   ├── zod-schemas.md
│   │   ├── nextra-config.md
│   │   └── biome-config.md
│   │
│   └── changelog/              # Implementation summaries
│       ├── 2025-01/
│       │   ├── nextra-4-complete.md
│       │   └── zod-enforcement.md
│       └── archive/            # Older summaries
│
├── .cursor/                    # Cursor AI configuration
│   ├── docs/                   # Cursor-specific docs (keep)
│   ├── rules/                  # Cursor rules (keep)
│   └── archive/                # Archived planning docs
│       └── planning/           # Move .cursor/planing/* here
│
├── .vscode/                     # VS Code configuration
│   ├── settings.json           # Keep config files
│   ├── extensions.json
│   └── archive/                # Keep existing archive
│
└── scripts/                     # Automation scripts
    ├── organize-docs.ts        # NEW: Document organizer
    ├── validate-docs.ts         # NEW: Documentation validator
    └── generate-index.ts        # NEW: Generate docs index
```

---

## 🛠️ Tools & Dev Dependencies

### Required Tools

1. **Documentation Linter** - Ensure consistency
   ```json
   "markdownlint-cli2": "^0.11.0"
   "remark-cli": "^12.0.0"
   "remark-preset-lint-markdown-style-guide": "^6.0.0"
   ```

2. **Documentation Generator** - Auto-generate indexes
   ```json
   "typedoc": "^0.26.0"          # TypeScript API docs
   "jsdoc": "^4.0.2"             # JavaScript docs
   ```

3. **File Organization** - Automated cleanup
   ```json
   "glob": "^11.0.0"             # File pattern matching
   "chalk": "^5.3.0"             # Terminal colors
   "inquirer": "^9.2.15"         # Interactive prompts
   ```

4. **Pre-commit Hooks** - Prevent future clutter
   ```json
   "husky": "^9.0.11"
   "lint-staged": "^15.2.0"
   ```

5. **Documentation Server** - Local preview
   ```json
   "serve": "^14.2.3"             # Simple HTTP server
   ```

---

## 📋 Implementation Plan

### Phase 1: Setup Tools (15 minutes)

1. **Install Dependencies**
   ```bash
   pnpm add -D markdownlint-cli2 remark-cli remark-preset-lint-markdown-style-guide \
     typedoc jsdoc glob chalk inquirer husky lint-staged serve
   ```

2. **Configure Markdown Linting**
   ```bash
   # Create .markdownlint.json
   ```

3. **Setup Husky Pre-commit**
   ```bash
   npx husky init
   ```

### Phase 2: Create Organization Scripts (30 minutes)

1. **Document Organizer Script** (`scripts/organize-docs.ts`)
   - Categorize files by prefix/pattern
   - Move to appropriate directories
   - Update internal links
   - Generate migration report

2. **Documentation Validator** (`scripts/validate-docs.ts`)
   - Check markdown syntax
   - Validate internal links
   - Check for broken references
   - Ensure consistent formatting

3. **Index Generator** (`scripts/generate-index.ts`)
   - Generate `docs/README.md` index
   - Create category indexes
   - Update navigation

### Phase 3: Execute Organization (20 minutes)

1. **Dry Run** - Preview changes
   ```bash
   pnpm organize-docs --dry-run
   ```

2. **Execute** - Apply changes
   ```bash
   pnpm organize-docs
   ```

3. **Validate** - Check results
   ```bash
   pnpm validate-docs
   ```

### Phase 4: Setup Automation (10 minutes)

1. **Pre-commit Hook** - Prevent root clutter
   ```bash
   # .husky/pre-commit
   ```

2. **CI/CD Check** - Validate in PRs
   ```yaml
   # .github/workflows/docs-check.yml
   ```

---

## 🔧 Scripts to Create

### 1. Document Organizer (`scripts/organize-docs.ts`)

**Purpose**: Automatically categorize and move documentation files

**Features**:
- Pattern-based categorization
- Link updating
- Backup creation
- Dry-run mode
- Migration report generation

### 2. Documentation Validator (`scripts/validate-docs.ts`)

**Purpose**: Ensure documentation quality and consistency

**Checks**:
- Markdown syntax
- Internal link validity
- Broken references
- Consistent formatting
- Required frontmatter

### 3. Index Generator (`scripts/generate-index.ts`)

**Purpose**: Auto-generate documentation indexes

**Features**:
- Category-based organization
- Auto-generated TOC
- Link validation
- Search-friendly structure

---

## 📝 Pre-commit Hook Rules

### Rules to Enforce

1. **No Markdown Files in Root** (except README.md, QUICK_START.md)
   ```bash
   # Reject commits with new .md files in root
   ```

2. **Documentation Must Have Frontmatter**
   ```bash
   # Require frontmatter with title, date, category
   ```

3. **Links Must Be Valid**
   ```bash
   # Check all internal links exist
   ```

4. **Consistent Naming**
   ```bash
   # Enforce kebab-case for filenames
   ```

---

## 🎯 Categorization Rules

### File Patterns → Destination

| Pattern             | Category    | Destination                   |
| ------------------- | ----------- | ----------------------------- |
| `NEXTRA_4_*`        | Migration   | `docs/migrations/nextra-4/`   |
| `ZOD_*`             | Migration   | `docs/migrations/zod-v4/`     |
| `VALIDATION_*`      | Migration   | `docs/migrations/validation/` |
| `*_SUMMARY.md`      | Changelog   | `docs/changelog/YYYY-MM/`     |
| `*_GUIDE.md`        | Guide       | `docs/guides/`                |
| `*_REFERENCE.md`    | Reference   | `docs/reference/`             |
| `API_*`             | API Docs    | `docs/api/`                   |
| `QUICK_*`           | Quick Start | Root (keep)                   |
| `.cursor/planing/*` | Archive     | `.cursor/archive/planning/`   |

---

## ✅ Success Criteria

- [ ] Zero markdown files in root (except README.md, QUICK_START.md)
- [ ] All documentation categorized and organized
- [ ] Internal links updated and validated
- [ ] Pre-commit hooks prevent future clutter
- [ ] Documentation index auto-generated
- [ ] CI/CD validates documentation structure
- [ ] Developer onboarding time reduced by 50%

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
pnpm add -D markdownlint-cli2 remark-cli remark-preset-lint-markdown-style-guide \
  typedoc jsdoc glob chalk inquirer husky lint-staged serve

# 2. Setup husky
npx husky init

# 3. Run organization (dry-run first)
pnpm organize-docs --dry-run

# 4. Execute organization
pnpm organize-docs

# 5. Validate results
pnpm validate-docs

# 6. Generate index
pnpm generate-docs-index
```

---

## 📚 Next Steps

1. Review and approve this strategy
2. Create organization scripts
3. Execute Phase 1-4
4. Document the new structure
5. Update team onboarding docs

---

**For questions or suggestions, see**: `.cursor/docs/architecture/system-overview.md`
