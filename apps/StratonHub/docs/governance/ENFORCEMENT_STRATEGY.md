# Enforcement Strategy: Diataxis + Next.js + Tailwind

**Purpose**: Define contract-first, type-safe enforcement for all three
frameworks **Authority**: Build-time validation blocks non-compliant content
**Status**: ACTIVE **Version**: 1.0.0

---

## The Problem: "Diataxis Without Diataxis"

**Current State**:

- ✅ Diataxis `type` field is validated (required in frontmatter)
- ❌ Diataxis **content structure** is NOT enforced
- ⚠️ Next.js patterns are checked but not integrated
- ⚠️ Tailwind patterns are checked but not integrated

**Result**: Documents can claim to be "tutorial" but have no "Steps" section.
This is "Diataxis without Diataxis."

---

## Solution: Multi-Layer Contract-First Enforcement

### Priority Hierarchy

```
1. Diataxis Framework (Content Structure)
   └─ Contract: Zod schemas per document type
   └─ Enforcement: Build-time structure validation
   └─ Indexing: Structure-aware search

2. Next.js App Router (System Framework)
   └─ Contract: Route structure conventions
   └─ Enforcement: Build-time route validation
   └─ Indexing: Route-based content discovery

3. Tailwind CSS (UI/UX Framework)
   └─ Contract: Utility-first patterns
   └─ Enforcement: Build-time style validation
   └─ Indexing: Style-aware component discovery
```

---

## Layer 1: Diataxis Enforcement (Content Structure)

### Contract Definition

**Location**: `lib/content/diataxis-contracts.ts`

```typescript
// Contract: Tutorial Structure
export const tutorialContract = z4.object({
  // Frontmatter (already validated)
  frontmatter: frontmatterSchema,

  // Content Structure (NEW - this is what was missing)
  structure: z4.object({
    hasIntroduction: z4.boolean(),
    hasPrerequisites: z4.boolean(),
    hasSteps: z4.boolean(),
    stepCount: z4.number().min(1),
    hasWhatWeBuilt: z4.boolean(),
    hasNextSteps: z4.boolean(),
    sectionOrder: z4.array(z4.string()),
  }),
})

// Similar contracts for: how-to, reference, explanation
```

### Enforcement Points

1. **Build-Time Validation**

   ```bash
   pnpm validate:diataxis
   ```

   - Validates content structure matches declared type
   - Blocks build if structure violations found
   - Reports specific missing sections

2. **Pre-Commit Hook**

   ```bash
   # .husky/pre-commit
   pnpm validate:diataxis || exit 1
   ```

3. **Type-Safe Content Loading**

   ```typescript
   // lib/content/loader.ts
   export function loadContentFile(filePath: string): ContentFile {
     const file = loadContentFileRaw(filePath)

     // ✅ NEW: Validate structure matches type
     const structureResult = validateDiataxisStructure(
       file.frontmatter.type,
       file.content
     )

     if (!structureResult.success) {
       throw new Error(
         `Structure violation: ${structureResult.errors.join(", ")}`
       )
     }

     return file
   }
   ```

### Indexing Integration

**Location**: `lib/search/index-builder.ts`

```typescript
// Enhanced indexing with structure awareness
export function buildSearchIndex(): SearchIndex[] {
  const index: SearchIndex[] = []

  for (const filePath of mdxFiles) {
    const file = loadContentFile(filePath)

    // ✅ Structure-aware indexing
    const structure = extractStructure(file.content, file.frontmatter.type)

    index.push({
      ...baseFields,
      type: file.frontmatter.type,
      structure: {
        sections: structure.sections,
        stepCount: structure.stepCount,
        hasCodeExamples: structure.hasCodeExamples,
      },
    })
  }

  return index
}
```

---

## Layer 2: Next.js App Router Enforcement

### Contract Definition

**Location**: `lib/routing/nextjs-contracts.ts`

```typescript
// Contract: App Router Structure
export const appRouterContract = z4.object({
  // Route group structure
  routeGroups: z4.array(
    z4.object({
      name: z4.string().regex(/^\([a-z-]+\)$/), // (audiences)
      hasLayout: z4.boolean(),
      hasPage: z4.boolean(),
    })
  ),

  // Dynamic routes
  dynamicRoutes: z4.array(
    z4.object({
      pattern: z4.string().regex(/^\[.+\]$/), // [audience], [surface]
      hasPage: z4.boolean(),
    })
  ),

  // Required files
  requiredFiles: z4.object({
    hasRootLayout: z4.boolean(),
    hasRootPage: z4.boolean(),
  }),
})
```

### Enforcement Points

1. **Build-Time Validation**

   ```bash
   pnpm validate:nextjs
   ```

   - Validates route structure
   - Ensures required files exist
   - Checks route group conventions

2. **Type-Safe Route Generation**

   ```typescript
   // lib/routing/generate-route.ts
   export function generateRoute(audience: Audience, surface?: Surface): Route {
     // ✅ Contract validation
     const route = {
       path: `/${audience}${surface ? `/${surface}` : ""}`,
       segments: [audience, surface].filter(Boolean),
     }

     const result = routeContract.safeParse(route)
     if (!result.success) {
       throw new Error(`Invalid route: ${result.error.message}`)
     }

     return route
   }
   ```

### Indexing Integration

```typescript
// Route-aware search
export function buildSearchIndex(): SearchIndex[] {
  // ... existing code ...

  index.push({
    ...baseFields,
    route: generateRoute(file.frontmatter.audience, file.frontmatter.surface),
    routeSegments: [file.frontmatter.audience, file.frontmatter.surface].filter(
      Boolean
    ),
  })
}
```

---

## Layer 3: Tailwind CSS Enforcement

### Contract Definition

**Location**: `lib/styling/tailwind-contracts.ts`

```typescript
// Contract: Tailwind Utility Patterns
export const tailwindContract = z4.object({
  // No custom CSS files (except globals.css)
  hasCustomCSS: z4.boolean(),

  // Utility-first patterns
  usesUtilities: z4.boolean(),
  usesCustomClasses: z4.boolean(), // Should be false

  // Design system compliance
  usesDesignTokens: z4.boolean(),
  usesIntelligenceClasses: z4.boolean(),
})
```

### Enforcement Points

1. **Build-Time Validation**

   ```bash
   pnpm validate:tailwind
   ```

   - Scans for custom CSS files
   - Validates utility-first patterns
   - Checks design system compliance

2. **Component Validation**

   ```typescript
   // lib/styling/validate-component.ts
   export function validateComponentStyles(
     componentPath: string
   ): ValidationResult {
     const source = readFileSync(componentPath, "utf-8")

     // Check for custom CSS
     if (source.includes("style=") || source.includes("<style>")) {
       return {
         success: false,
         errors: ["Custom inline styles detected - use Tailwind utilities"],
       }
     }

     // Check for design system usage
     const usesDesignSystem = /className="[^"]*axis-/g.test(source)

     return {
       success: usesDesignSystem,
       errors: usesDesignSystem
         ? []
         : ["Component should use design system classes"],
     }
   }
   ```

### Indexing Integration

```typescript
// Style-aware component discovery
export function indexComponents(): ComponentIndex[] {
  // Index components with their Tailwind patterns
  return components.map((comp) => ({
    ...baseFields,
    styles: {
      utilityClasses: extractUtilityClasses(comp.source),
      designSystemClasses: extractDesignSystemClasses(comp.source),
      customCSS: false, // Enforced
    },
  }))
}
```

---

## Integrated Validation Pipeline

### Build Script

**Location**: `package.json`

```json
{
  "scripts": {
    "validate:all": "pnpm validate:diataxis && pnpm validate:nextjs && pnpm validate:tailwind",
    "validate:diataxis": "tsx scripts/validate-diataxis-structure.ts",
    "validate:nextjs": "tsx scripts/check-nextjs-compliance.ts",
    "validate:tailwind": "tsx scripts/check-tailwind-compliance.ts",
    "build": "pnpm validate:all && pnpm search:build-index && next build"
  }
}
```

### Pre-Commit Hook

**Location**: `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running integrated validation..."

# Diataxis structure validation
pnpm validate:diataxis || exit 1

# Next.js compliance
pnpm validate:nextjs || exit 1

# Tailwind compliance
pnpm validate:tailwind || exit 1

echo "✅ All validations passed"
```

---

## Contract-First Typesafety

### Type Generation

```typescript
// lib/content/contracts.ts
export const contentContract = z4.object({
  // Frontmatter (existing)
  frontmatter: frontmatterSchema,

  // Structure (NEW)
  structure: diataxisStructureSchema,

  // Route (NEW)
  route: nextjsRouteSchema,

  // Styles (NEW)
  styles: tailwindStylesSchema,
})

// Inferred type
export type ValidatedContent = z4.infer<typeof contentContract>
```

### Usage

```typescript
// All content loading returns validated, type-safe content
export function loadContentFile(filePath: string): ValidatedContent {
  const file = loadContentFileRaw(filePath)

  // Validate all three layers
  const result = contentContract.safeParse({
    frontmatter: file.frontmatter,
    structure: extractStructure(file.content, file.frontmatter.type),
    route: generateRoute(file.frontmatter.audience, file.frontmatter.surface),
    styles: extractStyles(file.content),
  })

  if (!result.success) {
    throw new Error(`Content validation failed: ${result.error.message}`)
  }

  return result.data
}
```

---

## Indexing Strategy

### Multi-Dimensional Index

**Location**: `lib/search/enhanced-index.ts`

```typescript
export interface EnhancedSearchIndex extends SearchIndex {
  // Diataxis structure
  structure: {
    sections: string[]
    stepCount?: number
    hasCodeExamples: boolean
  }

  // Next.js route
  route: {
    path: string
    segments: string[]
    audience: Audience
    surface?: Surface
  }

  // Tailwind patterns (for component discovery)
  styles?: {
    utilityClasses: string[]
    designSystemClasses: string[]
  }
}
```

### Search with Framework Awareness

```typescript
// Search respects all three frameworks
export function search(
  query: string,
  filters: {
    type?: DiataxisType
    audience?: Audience
    surface?: Surface
    hasSteps?: boolean // Diataxis-aware
    routeSegment?: string // Next.js-aware
  }
): SearchResult[] {
  // Filter by Diataxis type
  let results = index.filter((item) => {
    if (filters.type && item.type !== filters.type) return false
    if (filters.hasSteps && !item.structure.stepCount) return false
    return true
  })

  // Filter by Next.js route
  results = results.filter((item) => {
    if (filters.audience && item.route.audience !== filters.audience)
      return false
    if (filters.surface && item.route.surface !== filters.surface) return false
    return true
  })

  // Fuzzy search
  return fuse.search(query, {
    keys: ["title", "content", "structure.sections"],
  })
}
```

---

## Best Practices Summary

### Diataxis Framework

1. **Contract-First**: Define structure contracts per type
2. **Build-Time Enforcement**: Validate structure matches type
3. **Type-Safe Loading**: Content loader validates structure
4. **Structure-Aware Indexing**: Search includes structure metadata

### Next.js App Router

1. **Route Contracts**: Define route structure schemas
2. **Build-Time Validation**: Ensure route conventions
3. **Type-Safe Routing**: Route generation validates contracts
4. **Route-Aware Indexing**: Search includes route metadata

### Tailwind CSS

1. **Utility-First Contracts**: Define allowed patterns
2. **Build-Time Validation**: Block custom CSS
3. **Design System Compliance**: Enforce design token usage
4. **Style-Aware Indexing**: Component discovery includes styles

---

## Implementation Checklist

- [x] Create Diataxis structure validator (`validate-diataxis-structure.ts`)
- [ ] Integrate Diataxis validation into content loader
- [ ] Create Next.js route contracts
- [ ] Create Tailwind style contracts
- [ ] Build integrated validation pipeline
- [ ] Update pre-commit hooks
- [ ] Enhance search index with structure/route/style metadata
- [ ] Update build script to run all validations
- [ ] Document contracts in codebase
- [ ] Add validation to CI/CD pipeline

---

## Success Criteria

✅ **Diataxis**: All documents have structure matching their declared type ✅
**Next.js**: All routes follow App Router conventions ✅ **Tailwind**: All
components use utility-first patterns ✅ **Typesafety**: All content loading is
contract-validated ✅ **Indexing**: Search is aware of all three frameworks ✅
**Build-Time**: Non-compliant content blocks build

---

**Status**: ACTIVE **Last Updated**: 2026-01-13 **Authority**: Enforcement
Strategy
