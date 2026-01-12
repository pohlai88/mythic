---
name: Automated Code-to-Documentation Strategy
overview: Evaluate and implement the best strategy for automatically extracting documentation from code (types, components, functions) to build apps/docs, with 100% Tailwind CSS compliance and no Nextra dependencies.
todos:
  - id: install-deps
    content: "Install dependencies: ts-morph and react-docgen-typescript"
    status: completed
  - id: create-type-generator
    content: Create scripts/generate-type-docs.ts to extract TypeScript types/interfaces
    status: completed
  - id: create-component-generator
    content: Create scripts/generate-component-docs.ts to extract React component props
    status: completed
  - id: create-function-generator
    content: Create scripts/generate-function-docs.ts to extract functions with JSDoc
    status: completed
  - id: create-orchestrator
    content: Create scripts/generate-all-docs.ts to orchestrate all generators
    status: in_progress
  - id: add-watch-mode
    content: Add watch mode script for development (scripts/generate-docs-watch.ts)
    status: completed
  - id: update-package-json
    content: Add generate:docs and generate:docs:watch scripts to package.json
    status: completed
  - id: test-generation
    content: Test generators with existing codebase and validate MDX output
    status: in_progress
---

# Automated Code-to-Documentation Strategy for apps/docs

## Executive Summary

This plan evaluates and implements the optimal strategy for automatically extracting documentation from codebase to build `apps/docs`, ensuring 100% Tailwind CSS compliance and zero Nextra dependencies.

## Current State Analysis

### Existing Automation (Working)

- **API Documentation**: Zod schemas → OpenAPI → Swagger UI (`scripts/generate-api-docs.ts`)
- **Content Discovery**: File system → Navigation (`apps/docs/lib/page-map.ts`)
- **Documentation Audit**: Markdown analysis (`scripts/audit-documentation.ts`)

### Architecture Compliance

- ✅ Tailwind CSS v4 only (`@tailwindcss/postcss@^4.1.18`)
- ✅ Custom layout components (DocsLayout, DocsNavbar, DocsFooter)
- ✅ Design system tokens (void, parchment, gold, ash, charcoal)
- ✅ No Nextra dependencies

## Recommended Strategy

### Phase 1: Type Documentation (Priority 1)

**Tool**: `ts-morph` (TypeScript AST manipulation)

**Why**: Easier API than TypeScript compiler, better JSDoc extraction

**Implementation**:

- Create `scripts/generate-type-docs.ts`
- Extract interfaces, type aliases, enums from `src/**/*.ts`
- Generate MDX files in `apps/docs/content/reference/types/`
- Generate JSON metadata in `apps/docs/content/reference/types/.meta.json`

**Output Structure**:

```
apps/docs/content/reference/types/
├── UserResponse.mdx          # MDX for page-map.ts discovery
├── CreateUserInput.mdx
└── .meta.json                # JSON for programmatic access
```

### Phase 2: Component Documentation (Priority 2)

**Tool**: `react-docgen-typescript` (TypeScript-aware component extraction)

**Why**: Extracts props, JSDoc, examples from React components

**Implementation**:

- Create `scripts/generate-component-docs.ts`
- Extract from `components/**/*.tsx` and `apps/**/components/**/*.tsx`
- Generate MDX files in `apps/docs/content/reference/components/`
- Generate JSON metadata for component catalog

**Output Structure**:

```
apps/docs/content/reference/components/
├── Cards.mdx                 # Component API docs
├── DocsLayout.mdx
└── .meta.json                # Component catalog
```

### Phase 3: Function Documentation (Priority 3)

**Tool**: `ts-morph` (JSDoc extraction)

**Why**: Reuse same tool, extract function signatures and JSDoc comments

**Implementation**:

- Create `scripts/generate-function-docs.ts`
- Extract functions with JSDoc from `src/**/*.ts`
- Generate MDX files in `apps/docs/content/reference/functions/`
- Generate JSON metadata for function index

**Output Structure**:

```
apps/docs/content/reference/functions/
├── createUser.mdx            # Function reference
├── getPageMap.mdx
└── .meta.json                # Function index
```

### Phase 4: Unified Generation Script

**Implementation**:

- Create `scripts/generate-all-docs.ts`
- Orchestrates all generators
- Validates output
- Updates navigation structure

**Usage**:

```bash
pnpm generate:docs          # Generate all
pnpm generate:docs:watch    # Watch mode
```

## Technical Implementation Details

### 1. Type Documentation Generator

**File**: `scripts/generate-type-docs.ts`

**Key Features**:

- Uses `ts-morph` to parse TypeScript files
- Extracts JSDoc comments from interfaces/types
- Generates MDX with frontmatter (title, description, category)
- Generates JSON metadata with type information
- Uses Tailwind-compliant MDX templates

**MDX Template**:

```mdx
---
title: {{name}}
description: {{description}}
category: reference
tags: [types, api]
---

# {{name}}

{{description}}

## Properties

{{#each properties}}
### {{name}}

**Type**: `{{type}}`

{{optional ? '**Optional**' : '**Required**'}}

{{docs}}
{{/each}}
```

### 2. Component Documentation Generator

**File**: `scripts/generate-component-docs.ts`

**Key Features**:

- Uses `react-docgen-typescript` to extract component metadata
- Extracts props, JSDoc, examples
- Generates MDX with component API documentation
- Generates JSON for component catalog

**MDX Template**:

```mdx
---
title: {{displayName}}
description: {{description}}
category: reference
tags: [components, ui]
---

# {{displayName}}

{{description}}

## Props

{{#each props}}
### {{name}}

**Type**: `{{type}}`

{{required ? '**Required**' : 'Optional'}}

{{description}}
{{/each}}
```

### 3. Function Documentation Generator

**File**: `scripts/generate-function-docs.ts`

**Key Features**:

- Uses `ts-morph` to extract functions
- Extracts JSDoc comments, parameters, return types
- Extracts `@example` tags from JSDoc
- Generates MDX with function reference
- Generates JSON for function index

**MDX Template**:

```mdx
---
title: {{name}}
description: {{description}}
category: reference
tags: [functions, api]
---

# {{name}}

{{description}}

## Parameters

{{#each params}}
### {{name}}

**Type**: `{{type}}`

{{docs}}
{{/each}}

## Returns

`{{returnType}}`

{{#if examples}}
## Examples

{{#each examples}}
\`\`\`typescript
{{this}}
\`\`\`
{{/each}}
{{/if}}
```

### 4. Integration with Existing System

**Auto-Discovery**:

- Generated MDX files automatically discovered by `apps/docs/lib/page-map.ts`
- Appear in navigation automatically
- No manual configuration needed

**Rendering**:

- MDX files use existing `apps/docs/mdx-components.tsx`
- All styling via Tailwind utilities (already configured)
- Design system tokens automatically applied

**JSON Metadata**:

- Used for programmatic access (search, filtering)
- Can be consumed by custom components
- Enables advanced features (search, filtering, cross-references)

## Dependencies to Add

```json
{
  "devDependencies": {
    "ts-morph": "^21.0.1",
    "react-docgen-typescript": "^2.2.2"
  }
}
```

## File Structure

```
scripts/
├── generate-type-docs.ts          # NEW: Type documentation
├── generate-component-docs.ts      # NEW: Component documentation
├── generate-function-docs.ts      # NEW: Function documentation
├── generate-all-docs.ts            # NEW: Unified orchestrator
└── generate-api-docs.ts            # EXISTING: API docs

apps/docs/content/reference/
├── types/
│   ├── UserResponse.mdx
│   ├── CreateUserInput.mdx
│   └── .meta.json
├── components/
│   ├── Cards.mdx
│   ├── DocsLayout.mdx
│   └── .meta.json
└── functions/
    ├── createUser.mdx
    ├── getPageMap.mdx
    └── .meta.json
```

## Compliance Requirements

### Tailwind CSS Only

- ✅ All generated MDX uses Tailwind utilities (via `mdx-components.tsx`)
- ✅ No custom CSS classes in generated docs
- ✅ Design system tokens (void, parchment, gold) automatically applied
- ✅ Responsive design via Tailwind breakpoints

### No Nextra

- ✅ Zero Nextra dependencies
- ✅ Custom content discovery (page-map.ts)
- ✅ Custom layout components
- ✅ 100% Tailwind CSS styling

## Success Metrics

- **Coverage**: All exported types, components, functions documented
- **Automation**: Zero manual documentation writing
- **Discovery**: Auto-discovered by page-map.ts
- **Compliance**: 100% Tailwind CSS, zero Nextra
- **Performance**: Generation time < 30s for full codebase

## Implementation Order

1. **Install dependencies** (`ts-morph`, `react-docgen-typescript`)
2. **Create type docs generator** (highest value, simplest)
3. **Create component docs generator** (high value, moderate complexity)
4. **Create function docs generator** (moderate value, moderate complexity)
5. **Create unified orchestrator** (ties everything together)
6. **Add watch mode** (development experience)
7. **Add to package.json scripts** (easy access)
8. **Test with existing codebase** (validate output)

## Risk Mitigation

- **Tool Compatibility**: Test `ts-morph` and `react-docgen-typescript` with TypeScript 5.3+
- **Performance**: Large codebases may need incremental generation
- **JSDoc Quality**: Encourage JSDoc comments in code for better docs
- **Output Quality**: Validate generated MDX before committing

## Future Enhancements

- **Cross-references**: Link types to components, components to functions
- **Search Integration**: Use JSON metadata for full-text search
- **Version Tracking**: Track documentation changes over time
- **CI/CD Integration**: Auto-generate docs on code changes
