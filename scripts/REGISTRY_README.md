# Function and Script Registry System

Automated system to detect, track, and query functions and scripts in the codebase.

## Overview

This registry system automatically:
- ✅ Detects new functions and scripts
- ✅ Tracks modifications to existing items
- ✅ Extracts JSDoc comments for usage documentation
- ✅ Maintains a searchable registry with metadata

## Quick Start

### 1. Scan and Build Registry

```bash
# Initial scan - builds the registry
pnpm registry:scan

# Scan and show what changed
pnpm registry:scan --diff

# Watch mode (auto-scan on file changes)
pnpm registry:scan --watch
```

### 2. Query the Registry

```bash
# Search by name
pnpm registry:query validate

# List all items
pnpm registry:query --list

# Find a specific script
pnpm registry:query --script validate-docs

# Find a specific function
pnpm registry:query --function createUser

# Filter by category
pnpm registry:query --category validation

# Filter by tag
pnpm registry:query --tag zod
```

## Registry Structure

The registry is stored in `scripts/function-registry.json`:

```json
{
  "version": "1.0.0",
  "description": "Function and Script Registry",
  "lastUpdated": "2026-01-12T10:00:00.000Z",
  "functions": [
    {
      "id": "unique_id",
      "name": "functionName",
      "filePath": "src/lib/utils.ts",
      "description": "Function description from JSDoc",
      "parameters": [...],
      "returnType": "string",
      "examples": [...],
      "exported": true,
      "category": "utility",
      "tags": ["zod", "validation"],
      "usage": "import { functionName } from 'src/lib/utils'",
      "lastModified": "2026-01-12T10:00:00.000Z",
      "hash": "content_hash"
    }
  ],
  "scripts": [
    {
      "id": "unique_id",
      "name": "script-name",
      "filePath": "scripts/validate-docs.ts",
      "description": "Script description from JSDoc",
      "usage": "pnpm validate:docs",
      "examples": [...],
      "category": "validation",
      "tags": ["docs", "validation"],
      "shebang": "#!/usr/bin/env tsx",
      "lastModified": "2026-01-12T10:00:00.000Z",
      "hash": "content_hash"
    }
  ]
}
```

## How It Works

### Function Detection

The scanner uses `ts-morph` to:
1. Parse TypeScript files in `src/`, `packages/**/src/`, `apps/**/src/`, `apps/**/lib/`
2. Extract exported functions and functions with JSDoc comments
3. Parse JSDoc for:
   - Description
   - Parameters with types and descriptions
   - Return types
   - `@example` tags
   - `@usage` tags
   - `@tag` tags

### Script Detection

The scanner:
1. Finds all `.ts` files in `scripts/` and `apps/**/scripts/`
2. Extracts JSDoc from the top of the file
3. Detects shebang (`#!/usr/bin/env tsx`)
4. Parses usage examples and tags

### Change Detection

Each item has a content hash. When scanning:
- **New items**: Not in previous registry
- **Modified items**: Hash changed
- **Deleted items**: In previous registry but not found

## JSDoc Format

### For Functions

```typescript
/**
 * Validates user input against schema
 *
 * @param input - The user input to validate
 * @param schema - Zod schema to validate against
 * @returns Validation result with errors if any
 * @example
 * const result = validateInput(data, userSchema)
 * if (result.success) {
 *   console.log(result.data)
 * }
 * @usage import { validateInput } from '@/lib/validation'
 * @tag zod validation
 */
export function validateInput(input: unknown, schema: z.ZodSchema) {
  // ...
}
```

### For Scripts

```typescript
#!/usr/bin/env tsx
/**
 * Documentation Validation Script
 *
 * Validates all documentation files against naming conventions.
 *
 * @usage pnpm validate:docs
 * @example
 * pnpm validate:docs
 * pnpm validate:docs --fix
 * @tag docs validation
 */
```

## Categories

Functions and scripts are automatically categorized:

- **utility**: Helper functions, utilities
- **api**: API endpoints, routes, handlers
- **validation**: Validation, checking, verification
- **generation**: Code/documentation generation
- **audit**: Auditing, analysis
- **migration**: Migration scripts
- **other**: Default category

## Integration

### Manual Usage

Run scans manually when needed:

```bash
pnpm registry:scan
pnpm registry:query <search-term>
```

### Git Hook Integration (Optional)

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
# Update registry before commit
pnpm registry:scan --diff
```

### CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Update Registry
  run: pnpm registry:scan
```

## Examples

### Find all validation functions

```bash
pnpm registry:query --category validation
```

### Find scripts that use Zod

```bash
pnpm registry:query --tag zod
```

### Find a specific function

```bash
pnpm registry:query --function createUser
```

### See what changed

```bash
pnpm registry:scan --diff
```

## Troubleshooting

### Registry not found

```bash
# Run initial scan
pnpm registry:scan
```

### Functions not detected

- Ensure function is exported OR has JSDoc comment
- Check file is in scanned directories
- Verify file is not excluded (no `.test.ts`, `.spec.ts`)

### Scripts not detected

- Ensure script has JSDoc comment at top
- Check script is in `scripts/` or `apps/**/scripts/`
- Verify file extension is `.ts`

## Advanced Usage

### Custom Search

The query tool supports flexible searching:

```bash
# Search across name, description, and file path
pnpm registry:query "user"

# Combine filters
pnpm registry:query --category validation --tag zod
```

### Export Registry

The registry JSON can be used programmatically:

```typescript
import registry from './scripts/function-registry.json'

// Find function
const func = registry.functions.find(f => f.name === 'validateInput')

// List all scripts
registry.scripts.forEach(s => console.log(s.name))
```

## Related Tools

- `generate-function-docs.ts` - Generates MDX docs from functions
- `generate-component-docs.ts` - Generates component docs
- `verbatim-registry.json` - Tracks verbatim config files

## Maintenance

The registry should be updated:
- After adding new functions/scripts
- After modifying existing functions/scripts
- Before major releases
- In CI/CD pipeline

Run `pnpm registry:scan` regularly to keep it up to date.
