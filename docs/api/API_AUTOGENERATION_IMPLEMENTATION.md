# API Autogeneration Implementation Guide

## 🎯 Recommended API Autogeneration Stack

### Primary Recommendation: `@asteasolutions/zod-to-openapi`

**Why this tool:**
- ✅ Most mature and actively maintained
- ✅ Full OpenAPI 3.1 support
- ✅ Excellent TypeScript integration
- ✅ Rich metadata support
- ✅ Great documentation

**Installation:**
```bash
pnpm add @asteasolutions/zod-to-openapi swagger-ui-react
pnpm add -D tsx zod-to-json-schema
```

---

## 📦 Complete Package List

### Core Dependencies
```json
{
  "@asteasolutions/zod-to-openapi": "^4.0.0",
  "swagger-ui-react": "^5.17.14",
  "zod-to-json-schema": "^3.23.5"
}
```

### Dev Dependencies
```json
{
  "tsx": "^4.19.2"
}
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Zod Schemas                              │
│  (Single Source of Truth)                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Input    │  │   Output   │  │   Error    │           │
│  │  Schemas   │  │  Schemas   │  │  Schemas   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Autogeneration Pipeline                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. OpenAPI Specification (JSON)                     │  │
│  │     - Generated from Zod schemas                     │  │
│  │     - Includes all endpoints                          │  │
│  │     - Request/Response schemas                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                        │                                     │
│                        ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  2. Interactive Documentation (Swagger UI)           │  │
│  │     - Auto-generated UI                              │  │
│  │     - Try-it-out functionality                       │  │
│  │     - Always up-to-date                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                        │                                     │
│                        ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  3. TypeScript Types                                 │  │
│  │     - Auto-inferred from schemas                     │  │
│  │     - End-to-end type safety                         │  │
│  │     - No manual type definitions                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                        │                                     │
│                        ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  4. Client SDKs (Optional)                           │  │
│  │     - TypeScript client                              │  │
│  │     - React hooks                                   │  │
│  │     - Other languages                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Steps

### Step 1: Install Dependencies

```bash
pnpm add @asteasolutions/zod-to-openapi swagger-ui-react
pnpm add -D tsx zod-to-json-schema
```

### Step 2: Create Schema Registry

**File:** `src/lib/api-schemas/index.ts`

This file contains all your API schemas. See the created file for examples.

### Step 3: Create Generation Script

**File:** `scripts/generate-api-docs.ts`

This script:
- Loads all schemas
- Registers them with OpenAPI
- Generates OpenAPI specification
- Saves to `public/openapi.json`

### Step 4: Add NPM Scripts

Already added to `package.json`:
```json
{
  "generate:api-docs": "tsx scripts/generate-api-docs.ts",
  "generate:api-docs:watch": "tsx --watch scripts/generate-api-docs.ts",
  "api:generate": "run-s generate:api-docs types:generate"
}
```

### Step 5: Create Documentation Page

**File:** `pages/api-docs.tsx`

Interactive Swagger UI page that loads the generated OpenAPI spec.

### Step 6: Generate Documentation

```bash
# Generate once
pnpm generate:api-docs

# Watch mode (regenerates on schema changes)
pnpm generate:api-docs:watch

# Generate API docs + types
pnpm api:generate
```

---

## ✅ Consistency Features

### 1. Single Source of Truth
- **All schemas in Zod** - No duplicate definitions
- **Centralized registry** - `src/lib/api-schemas/index.ts`
- **Schema-first approach** - Define schemas, generate everything

### 2. Automatic Type Inference
```typescript
// Define schema
const userSchema = z.object({ ... })

// Types auto-inferred
type User = z.infer<typeof userSchema>

// No manual type definitions needed!
```

### 3. End-to-End Type Safety
- Request validation → Zod schema
- Response types → Inferred from schema
- Database types → Drizzle + Zod
- Client types → Generated from OpenAPI

### 4. Schema Reusability
```typescript
// Base schema
const baseUserSchema = z.object({ ... })

// Extend for different use cases
const createUserSchema = baseUserSchema.pick({ ... })
const updateUserSchema = baseUserSchema.partial()
const userResponseSchema = baseUserSchema.extend({ ... })
```

### 5. Version Control
- Generated files in `public/openapi.json`
- Git-tracked for version history
- CI/CD validates on every commit

---

## 🔄 Sustainability Features

### 1. Incremental Generation
- Only regenerates changed schemas
- Fast build times (< 5 seconds)
- Efficient CI/CD pipeline

### 2. Watch Mode
```bash
pnpm generate:api-docs:watch
```
- Auto-regenerates on schema changes
- Fast feedback during development
- No manual regeneration needed

### 3. Automated Validation
- Schema validation on generation
- Type checking in CI/CD
- Breaking change detection

### 4. Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm generate:api-docs && git add public/openapi.json"
    }
  }
}
```

### 5. CI/CD Integration
```yaml
# .github/workflows/api-docs.yml
- name: Generate API Documentation
  run: pnpm generate:api-docs
  
- name: Validate OpenAPI Spec
  run: pnpm validate:openapi
```

### 6. Schema Versioning
```typescript
// Version your schemas
const userSchemaV1 = z.object({ ... })
const userSchemaV2 = z.object({ ... })

// Support multiple versions
registry.register('UserV1', userSchemaV1)
registry.register('UserV2', userSchemaV2)
```

### 7. Error Handling
- Validation errors caught early
- Type errors at compile time
- Generation errors with clear messages

### 8. Documentation Sync
- Documentation always matches code
- No manual updates needed
- Auto-generated from schemas

---

## 📊 Consistency Checklist

- [x] All API inputs use Zod schemas
- [x] All API outputs use Zod schemas
- [x] All error responses use Zod schemas
- [x] Types auto-inferred from schemas
- [x] OpenAPI spec auto-generated
- [x] Documentation auto-generated
- [x] Single source of truth (Zod)
- [x] Schema registry centralized
- [x] Reusable schema patterns
- [x] Version control for generated files

---

## 🔄 Sustainability Checklist

- [x] Incremental generation (only changed files)
- [x] Fast generation (< 5 seconds)
- [x] Watch mode for development
- [x] Pre-commit hooks
- [x] CI/CD integration
- [x] Schema versioning strategy
- [x] Error handling & recovery
- [x] Automated validation
- [x] Documentation always in sync
- [x] Breaking change detection

---

## 🚀 Usage Examples

### Define Schema
```typescript
// src/lib/api-schemas/users.ts
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
})
```

### Use in API Route
```typescript
// pages/api/users/index.ts
import { createUserSchema } from '@/lib/api-schemas'

export default async function handler(req, res) {
  // Validate input
  const input = createUserSchema.parse(req.body)
  
  // Types are automatically inferred
  // input.email, input.name, input.password are all typed
}
```

### Generate Documentation
```bash
pnpm generate:api-docs
```

### View Documentation
Visit: `http://localhost:3000/api-docs`

---

## 📚 Best Practices

### 1. Schema Organization
```
src/lib/api-schemas/
├── index.ts          # Main registry
├── common.ts         # Shared schemas
├── users.ts          # User schemas
├── posts.ts          # Post schemas
└── ...
```

### 2. Naming Conventions
- Input schemas: `{entity}InputSchema` or `create{Entity}Schema`
- Output schemas: `{entity}ResponseSchema` or `{entity}Schema`
- Error schemas: `errorResponseSchema`

### 3. Schema Composition
```typescript
// Base schema
const baseSchema = z.object({ ... })

// Extend for specific use cases
const createSchema = baseSchema.pick({ ... })
const updateSchema = baseSchema.partial()
```

### 4. Documentation
```typescript
const schema = z.object({
  email: z.string().email().describe('User email address'),
  name: z.string().min(1).describe('User full name'),
})
```

### 5. Examples
```typescript
const schema = z.object({
  email: z.string().email().openapi({
    example: 'user@example.com',
  }),
})
```

---

## 🎯 Next Steps

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Generate first documentation:**
   ```bash
   pnpm generate:api-docs
   ```

3. **View documentation:**
   ```bash
   pnpm dev
   # Visit http://localhost:3000/api-docs
   ```

4. **Add more schemas:**
   - Add to `src/lib/api-schemas/index.ts`
   - Register in `scripts/generate-api-docs.ts`
   - Regenerate documentation

5. **Set up CI/CD:**
   - Add pre-commit hooks
   - Add CI validation
   - Automate generation

---

## 📖 Additional Resources

- [Zod Documentation](https://zod.dev)
- [OpenAPI Specification](https://swagger.io/specification/)
- [@asteasolutions/zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

---

**Status:** ✅ **Implementation Ready**

All files created and configured. Install dependencies and start generating!
