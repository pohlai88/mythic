# README-Only Policy - Next.js Best Practices

## Policy Summary

**Rule**: README.md is the ONLY official documentation file for each domain/app. All other .md files will be removed to avoid confusion.

**Exception**: Directories starting with "." (dot-directories) are functional directories and excluded from this policy.

---

## Next.js Official Best Practices

### Monorepo Structure (Next.js Recommended)

According to Next.js documentation and community best practices:

```
my-monorepo/
├── README.md                    # Root project README
├── apps/                        # Applications
│   ├── web/                    # Next.js app
│   │   └── README.md           # ✅ App documentation
│   ├── admin/                  # Next.js app
│   │   └── README.md           # ✅ App documentation
│   └── docs/                   # Documentation site (special case)
│       ├── README.md           # ✅ App documentation
│       ├── app/                # Next.js App Router
│       │   └── **/*.mdx       # ✅ Content pages (not app docs)
│       └── content/            # MDX content
│           └── **/*.mdx       # ✅ Content pages (not app docs)
│
├── packages/                    # Shared packages
│   ├── ui/                     # UI components
│   │   └── README.md           # ✅ Package documentation
│   ├── utils/                  # Utilities
│   │   └── README.md           # ✅ Package documentation
│   └── config/                 # Configurations
│       └── README.md           # ✅ Package documentation
│
└── [dot-directories]/          # Functional directories (excluded)
    ├── .cursor/                # ✅ Cursor AI config (excluded)
    ├── .vscode/                # ✅ VS Code config (excluded)
    ├── .github/                # ✅ GitHub workflows (excluded)
    └── .temp-docs/             # ✅ Temporary docs (excluded)
```

**Source**: [Next.js Documentation](https://nextjs.org/docs) + [Monorepo Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/monorepos)

---

## Policy Rules

### ✅ ALLOWED: README.md Files

**Location**: Every `apps/` and `packages/` directory
- `apps/boardroom/README.md` ✅
- `apps/accounting/README.md` ✅
- `apps/finance/README.md` ✅
- `packages/design-system/README.md` ✅
- `packages/shared-utils/README.md` ✅

**Content**: README must cover:
- Purpose and overview
- Quick start / Getting started
- Architecture / Structure
- Configuration
- Development workflow
- API / Usage examples
- Troubleshooting

### ❌ FORBIDDEN: All Other .md Files

**Location**: `apps/` and `packages/` directories (except dot-directories)

**Examples of files to REMOVE**:
- `apps/boardroom/IMPLEMENTATION_STEPS.md` ❌
- `apps/boardroom/AUDIT_REPORT.md` ❌
- `apps/docs/BUILD_ERROR_ANALYSIS.md` ❌
- `apps/docs/DEPLOYMENT.md` ❌
- `apps/DRY_ARCHITECTURE_COMPLETE.md` ❌
- `packages/design-system/DOCUMENTATION_CLEANUP.md` ❌

**Action**: Move content to README.md, then delete file

### ✅ EXCLUDED: Dot-Directories (Functional Directories)

**Directories starting with "." are EXCLUDED from README-only policy**:

1. **`.cursor/`** - Cursor AI configuration
   - Purpose: Cursor rules, docs, templates, skills
   - Documentation: Allowed (functional directory)
   - Files: `.mdc` rules, `.md` docs

2. **`.vscode/`** - VS Code configuration
   - Purpose: VS Code settings, tasks, extensions
   - Documentation: README.md allowed (exception)
   - Files: `.json` configs, `README.md`

3. **`.github/`** - GitHub workflows
   - Purpose: CI/CD workflows, templates
   - Documentation: Workflow docs allowed
   - Files: `.yml` workflows, `.md` templates

4. **`.temp-docs/`** - Temporary documentation
   - Purpose: 7-day temporary holding area
   - Documentation: Allowed (functional directory)
   - Files: `TEMP-*.md` files

5. **`.husky/`** - Git hooks
   - Purpose: Pre-commit, pre-push hooks
   - Documentation: Hook docs allowed
   - Files: Shell scripts, configs

6. **Other dot-files**: `.gitignore`, `.npmrc`, `.nvmrc`, etc.
   - Purpose: Configuration files
   - Documentation: N/A (config files only)

### ✅ SPECIAL CASE: Documentation Site (apps/docs)

**apps/docs** is a Next.js application that serves documentation:

**Allowed Files**:
- `apps/docs/README.md` ✅ - Documents the docs app itself
- `apps/docs/app/**/*.mdx` ✅ - Content pages (Next.js App Router)
- `apps/docs/content/**/*.mdx` ✅ - Content pages (MDX content)

**Forbidden Files**:
- `apps/docs/AUDIT_REPORT_2026.md` ❌ - Move to README.md
- `apps/docs/BUILD_ERROR_ANALYSIS.md` ❌ - Move to README.md
- `apps/docs/DEPLOYMENT.md` ❌ - Move to README.md
- `apps/docs/IMPLEMENTATION_STEPS.md` ❌ - Move to README.md

**Distinction**:
- **README.md**: Documents the documentation app (how to run, deploy, configure)
- **.mdx files**: Are the documentation content (user-facing docs), not app documentation

---

## Enforcement Strategy

### 1. Pre-Commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
# Check for non-README .md files in apps/ and packages/
pnpm docs:check-readme-only
```

### 2. Validation Script

```typescript
// scripts/validate-readme-only.ts
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

const EXCLUDED_DIRS = [
  '.cursor',
  '.vscode',
  '.github',
  '.temp-docs',
  '.husky',
  'node_modules',
  '.next',
  '.git',
]

function isDotDirectory(dir: string): boolean {
  return dir.startsWith('.')
}

function checkDirectory(dir: string, basePath: string = ''): string[] {
  const violations: string[] = []
  const fullPath = join(basePath, dir)

  // Skip excluded directories
  if (EXCLUDED_DIRS.includes(dir) || isDotDirectory(dir)) {
    return violations
  }

  try {
    const entries = readdirSync(fullPath)
    const hasReadme = entries.includes('README.md')
    const mdFiles = entries.filter(
      (f) => f.endsWith('.md') && f !== 'README.md'
    )

    // Check for violations
    if (mdFiles.length > 0) {
      violations.push(
        ...mdFiles.map((f) => join(fullPath, f).replace(/\\/g, '/'))
      )
    }

    // Recursively check subdirectories (but not node_modules, .next, etc.)
    for (const entry of entries) {
      const entryPath = join(fullPath, entry)
      const stat = statSync(entryPath)
      if (stat.isDirectory() && !EXCLUDED_DIRS.includes(entry)) {
        violations.push(...checkDirectory(entry, fullPath))
      }
    }
  } catch {
    // Skip if can't read
  }

  return violations
}

// Check apps/ and packages/
const appsViolations = checkDirectory('apps')
const packagesViolations = checkDirectory('packages')

const allViolations = [...appsViolations, ...packagesViolations]

if (allViolations.length > 0) {
  console.error('❌ README-Only Policy Violations:')
  allViolations.forEach((v) => console.error(`  - ${v}`))
  console.error('\nAction: Move content to README.md, then delete file')
  process.exit(1)
}

console.log('✅ README-Only Policy: Compliant')
```

### 3. CI/CD Check

```yaml
# .github/workflows/docs-check.yml
name: Documentation Check

on: [push, pull_request]

jobs:
  check-readme-only:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm docs:check-readme-only
```

---

## Migration Process

### Step 1: Identify Violations

```bash
# Run validation script
pnpm docs:check-readme-only
```

### Step 2: Consolidate to README

For each violation file:
1. Read the file content
2. Determine relevant section in README
3. Add content to README.md
4. Update README table of contents
5. Delete the violation file

### Step 3: Update README Structure

Each README.md should follow this structure:

```markdown
# [App/Package Name]

## Overview
[Purpose and description]

## Quick Start
[Getting started instructions]

## Architecture
[Structure and design]

## Configuration
[Configuration options]

## Development
[Development workflow]

## API / Usage
[Usage examples]

## Troubleshooting
[Common issues and solutions]

## Related Documentation
[Links to related docs]
```

---

## Examples

### ✅ CORRECT: apps/boardroom/

```
apps/boardroom/
├── README.md                    # ✅ Only documentation file
├── package.json
├── app/
├── components/
└── src/
```

### ❌ INCORRECT: apps/boardroom/

```
apps/boardroom/
├── README.md
├── IMPLEMENTATION_STEPS.md     # ❌ Remove
├── AUDIT_REPORT.md             # ❌ Remove
├── SETUP_GUIDE.md              # ❌ Remove (move to README)
└── ...
```

### ✅ CORRECT: packages/design-system/

```
packages/design-system/
├── README.md                    # ✅ Only documentation file
├── package.json
├── src/
└── ...
```

### ✅ EXCLUDED: .cursor/

```
.cursor/
├── README.md                    # ✅ Allowed (functional directory)
├── rules/
│   └── *.mdc                    # ✅ Allowed (functional files)
└── docs/
    └── *.md                     # ✅ Allowed (functional directory)
```

---

## Benefits

1. **Single Source of Truth**: README.md is the only place to look
2. **Reduced Confusion**: No scattered documentation files
3. **Easier Maintenance**: Update one file, not many
4. **Better Onboarding**: Clear entry point for new developers
5. **Next.js Compliance**: Follows Next.js monorepo best practices

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Monorepo Guide](https://nextjs.org/docs/app/building-your-application/configuring/monorepos)
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)

---

**Status**: ✅ Policy Defined
**Enforcement**: Pre-commit hook + CI/CD
**Compliance**: Required for all apps and packages
