# README Standard Schema & Template

## Policy

**Single Format**: All README.md files in `apps/` and `packages/` MUST follow the same schema, format, and pattern.

**Template-Based**: All README files are generated from a single template. If the template changes, the schema changes, and all README files must be updated.

**Source of Truth**: `.cursor/templates/README_TEMPLATE.md` is the single source of truth for README format.

---

## Schema Overview

### Based on Industry Standards

1. **Standard-Readme Specification** - Community standard for README files
2. **npm Package README Standards** - npm registry requirements
3. **GitHub Best Practices** - GitHub community standards
4. **Next.js Patterns** - Next.js monorepo conventions

### Schema Location

- **Template**: `.cursor/templates/README_TEMPLATE.md`
- **JSON Schema**: `.cursor/templates/README_SCHEMA.json`
- **Validation**: `scripts/validate-readme-schema.ts`

---

## Required Sections (In Order)

### 1. Title & Description (Required)

```markdown
# [Project Name]

> [One-line description - max 120 characters]
```

**Rules**:
- Title must match directory/package name
- Description must start with `>`
- Description max 120 characters
- Optional badges after description

### 2. Table of Contents (Required)

```markdown
## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Related Documentation](#related-documentation)
```

**Rules**:
- Must include all required sections
- Links must match section headings exactly
- Use lowercase with hyphens for anchors

### 3. Overview (Required)

```markdown
## Overview

[2-3 paragraph description]

**Purpose**: [What problem does this solve?]

**Key Features**:
- Feature 1
- Feature 2

**Tech Stack**:
- Technology 1
- Technology 2
```

**Rules**:
- Must include Purpose
- Must include Key Features (min 1)
- Tech Stack is optional but recommended

### 4. Quick Start (Required)

```markdown
## Quick Start

[Get running in 60 seconds or less]

```bash
# Step 1
pnpm install

# Step 2
pnpm dev
```

**Prerequisites**:
- Node.js >= [version]
- pnpm >= [version]
```

**Rules**:
- Max 5 steps
- Each step must have command and description
- Must include prerequisites

### 5. Installation (Required)

```markdown
## Installation

### From Source

```bash
git clone [url]
pnpm install
pnpm build
```

### As Package (if applicable)

```bash
pnpm add @mythic/[package-name]
```
```

**Rules**:
- Must include "From Source"
- "As Package" only if applicable
- Commands must be executable

### 6. Usage (Required)

```markdown
## Usage

### Basic Usage

```typescript
import { Component } from '@mythic/package'

<Component />
```

### Advanced Usage (Optional)

[More complex examples]
```

**Rules**:
- Must include Basic Usage with code example
- Advanced Usage is optional
- CLI Usage if applicable

### 7. Architecture (Required)

```markdown
## Architecture

### Directory Structure

```
project/
├── app/
├── components/
└── src/
```

### Key Concepts

[Important architectural decisions]
```

**Rules**:
- Must include Directory Structure
- Key Concepts optional but recommended
- Data Flow optional

### 8. Development (Required)

```markdown
## Development

### Setup Development Environment

```bash
pnpm install
pnpm dev
pnpm type-check
```

### Development Workflow

1. Step 1
2. Step 2
```

**Rules**:
- Must include setup commands
- Must include workflow steps
- Code style guidelines optional

### 9. Troubleshooting (Required)

```markdown
## Troubleshooting

### Common Issues

#### Issue: [Problem]

**Symptoms**: [What you see]
**Cause**: [Why it happens]
**Solution**: [How to fix]

```bash
# Fix command
```
```

**Rules**:
- Must include at least one common issue
- Format: Title, Symptoms, Cause, Solution
- Code examples for solutions

### 10. License (Required)

```markdown
## License

[License type] - See [LICENSE](../LICENSE) file for details.
```

**Rules**:
- Must specify license type
- Must link to LICENSE file

### 11. Related Documentation (Required)

```markdown
## Related Documentation

- [Related App](./../related-app/README.md)
- [System Docs](../../docs/README.md)
```

**Rules**:
- Must include links to related README files
- Must include link to system documentation

---

## Optional Sections

### Configuration

```markdown
## Configuration

### Environment Variables

| Variable | Description | Required | Default   |
| -------- | ----------- | -------- | --------- |
| `VAR`    | Description | Yes      | `default` |
```

**When to Include**: If the project has configuration options

### API Reference

```markdown
## API Reference

#### `ComponentName`

Description.

**Props**:

| Prop   | Type     | Required | Default | Description |
| ------ | -------- | -------- | ------- | ----------- |
| `prop` | `string` | Yes      | -       | Description |

**Example**:

```typescript
<ComponentName prop="value" />
```
```

**When to Include**: If the project exports components, functions, or APIs

### Testing

```markdown
## Testing

### Run Tests

```bash
pnpm test
pnpm test:coverage
```
```

**When to Include**: If the project has tests

### Contributing

```markdown
## Contributing

1. Fork repository
2. Create feature branch
3. Submit pull request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.
```

**When to Include**: If the project accepts contributions

---

## Metadata (Required at End)

```markdown
---

**Version**: [version]
**Last Updated**: [YYYY-MM-DD]
**Status**: [Active/Development/Deprecated]
```

**Rules**:
- Must be at the end of file
- Version from package.json
- Last Updated: YYYY-MM-DD format
- Status: One of Active, Development, Deprecated, Archived

---

## Validation

### Schema Validation

```bash
# Validate README against schema
pnpm readme:validate

# Validate specific file
pnpm readme:validate apps/boardroom/README.md
```

### Pre-Commit Hook

```bash
# .husky/pre-commit
pnpm readme:validate-all
```

### CI/CD Check

```yaml
# .github/workflows/readme-check.yml
- name: Validate README Schema
  run: pnpm readme:validate-all
```

---

## Template Versioning

### Template Changes

When the template changes:

1. **Update Template**: `.cursor/templates/README_TEMPLATE.md`
2. **Update Schema**: `.cursor/templates/README_SCHEMA.json`
3. **Version Bump**: Update template version in template file
4. **Migration Script**: Run migration to update all README files
5. **Validation**: Validate all README files pass new schema

### Template Version

```markdown
<!-- Template Version: 1.0.0 -->
<!-- Last Updated: 2026-01-11 -->
```

---

## Examples

### ✅ CORRECT: apps/boardroom/README.md

Follows exact template structure with all required sections.

### ❌ INCORRECT: Missing Sections

```markdown
# BoardRoom

Some description.

## Usage

[Missing Overview, Quick Start, Installation, Architecture, etc.]
```

### ❌ INCORRECT: Wrong Order

```markdown
# BoardRoom

## Usage
## Overview  # Wrong order - Overview must come first
```

---

## Industry References

### Standard-Readme

- **Specification**: https://github.com/RichardLitt/standard-readme
- **Template**: Based on Standard-Readme v1.0.0

### npm Package README

- **Requirements**: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#readme
- **Best Practices**: npm registry standards

### GitHub README

- **Best Practices**: GitHub community standards
- **Templates**: GitHub Skills Content Model

### Next.js Patterns

- **Monorepo Structure**: Next.js App Router conventions
- **Documentation**: Next.js official documentation patterns

---

## Enforcement

### Build-Time Validation

All README files must:
1. ✅ Match template structure
2. ✅ Include all required sections
3. ✅ Follow section order
4. ✅ Include metadata
5. ✅ Pass schema validation

### Non-Compliance

If README doesn't match schema:
1. ❌ Pre-commit hook blocks commit
2. ❌ CI/CD fails build
3. ❌ Error message shows required fixes

---

## Migration Guide

### Updating Existing README Files

1. **Backup**: Create backup of existing README
2. **Template**: Copy from `.cursor/templates/README_TEMPLATE.md`
3. **Fill**: Fill in project-specific content
4. **Validate**: Run `pnpm readme:validate`
5. **Commit**: Commit updated README

### Automated Migration

```bash
# Migrate all README files to new template
pnpm readme:migrate

# Migrate specific file
pnpm readme:migrate apps/boardroom/README.md
```

---

**Template Version**: 1.0.0
**Schema Version**: 1.0.0
**Last Updated**: 2026-01-11
**Status**: Active
