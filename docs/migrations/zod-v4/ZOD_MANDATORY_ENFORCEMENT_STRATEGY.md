# Zod Mandatory Enforcement Strategy

## 🎯 Objective

Transform all **IDENTICAL** (currently used) Zod features from **OPTIONAL** to **MANDATORY** requirements across the entire workspace.

**Goal**: 100% compliance with mandatory Zod patterns and zero tolerance for deviations.

---

## 📋 Mandatory Features (27 Features - MUST USE)

### Core Requirements

1. **Import Path**: `import { z } from 'zod/v4'` (MUST use `/v4` suffix)
2. **Type Inference**: `z.infer<typeof schema>` (MUST use for all types)
3. **Schema Location**: All schemas MUST be in `src/lib/api-schemas/index.ts`
4. **Error Handling**: `z.ZodError` (MUST use for error handling)

### Mandatory Schema Patterns

#### String Schemas (MUST use these patterns)
- `z.string()` - Base string type
- `.min()` - Minimum length validation
- `.max()` - Maximum length validation
- `.email()` - Email validation
- `.datetime()` - ISO datetime strings

#### Number Schemas (MUST use these patterns)
- `z.number()` - Base number type
- `.min()` - Minimum value
- `.max()` - Maximum value
- `.int()` - Integer validation
- `.positive()` - Positive number validation
- `z.coerce.number()` - Number coercion for query params

#### Object Schemas (MUST use these patterns)
- `z.object()` - Object definition
- `.extend()` - Schema extension
- `.partial()` - Optional fields for updates
- `.strip()` - Default behavior (strip unknown keys)

#### Array Schemas (MUST use these patterns)
- `z.array()` - Array definition

#### Enum Schemas (MUST use these patterns)
- `z.enum()` - Enum definition

#### Wrapper Methods (MUST use these patterns)
- `.optional()` - Optional fields
- `.nullable()` - Nullable fields
- `.default()` - Default values

#### Documentation (MUST use these patterns)
- `.describe()` - Schema documentation

#### Integration (MUST use these patterns)
- `drizzle-zod` - Database schema integration
- `zod-to-openapi` - OpenAPI generation
- `.openapi()` - OpenAPI metadata

---

## 🛠️ Enforcement Mechanisms

### 1. Biome Integration (PRIMARY)

**Biome is the primary enforcement tool** for catching Zod violations at development time.

**Configuration**: `biome.json` includes Zod-specific rules
**Commands**:
- `pnpm check` - Run Biome validation
- `pnpm check:fix` - Auto-fix Biome issues
- `pnpm check:ci` - CI/CD validation

**What Biome Catches**:
- Import path violations (`'zod'` vs `'zod/v4'`)
- Type inference violations
- Missing documentation patterns
- Code style violations

### 2. Cursor Rules (IDE Integration)

**Cursor rules** provide IDE-level enforcement and guidance.

**Location**: `.cursor/rules/zod-mandatory-enforcement.mdc`
**Features**:
- Real-time guidance in IDE
- Pattern suggestions
- Violation warnings
- Customizable per workspace

**How to Customize**:
1. Open `.cursor/rules/zod-mandatory-enforcement.mdc`
2. Modify rules as needed
3. Cursor will apply changes immediately

### 3. TypeScript Type-Level Enforcement

Strict type definitions enforce mandatory patterns at compile time.

**Location**: `src/lib/zod/types.ts`
**Enforcement**: TypeScript compiler catches violations

### 4. Validation Scripts

Custom validation scripts catch patterns Biome cannot detect.

**Scripts**:
- `pnpm validate:zod` - Custom Zod validation
- `pnpm migrate:zod-imports` - Import migration

**Integration**: Works with Biome output

### 5. Pre-commit Hooks

Validate schemas before commits using Biome.

**Setup**: Add to `.husky/pre-commit` or similar
```bash
pnpm check --staged
pnpm validate:zod
```

### 6. CI/CD Validation

Automated checks in CI pipeline using Biome.

**Commands**:
- `pnpm check:ci` - Biome CI check
- `pnpm validate:zod` - Custom validation

### 7. Template Enforcement

Mandatory templates ensure new schemas follow patterns.

**Location**: `src/lib/api-schemas/patterns.ts`
**Usage**: Import and use mandatory patterns

---

## 📁 Implementation Structure

```
workspace/
├── src/
│   ├── lib/
│   │   ├── api-schemas/
│   │   │   ├── index.ts          # All schemas MUST be here
│   │   │   ├── patterns.ts        # Mandatory patterns
│   │   │   └── validators.ts      # Schema validators
│   │   └── zod/
│   │       ├── types.ts           # Mandatory type definitions
│   │       ├── helpers.ts         # Mandatory helper functions
│   │       └── rules.ts           # Type-level rules
├── scripts/
│   ├── validate-zod-schemas.ts    # Validation script
│   └── migrate-zod-imports.ts    # Migration script
├── .cursor/
│   └── rules/
│       └── zod-mandatory-rules.mdc  # Cursor rules
└── biome.json                     # Linting rules
```

---

## 🔧 Implementation Plan

### Phase 1: Foundation (Day 1)

1. **Create Mandatory Type Definitions**
2. **Create Schema Patterns Library**
3. **Create Validation Script**
4. **Update Import Paths**

### Phase 2: Enforcement (Day 2-3)

1. **Configure Biome Rules** (PRIMARY)
   - Add Zod-specific Biome rules
   - Configure overrides for schema files
   - Test Biome validation

2. **Create Cursor Rules** (IDE Integration)
   - Create `.cursor/rules/zod-mandatory-enforcement.mdc`
   - Configure for workspace customization
   - Test in IDE

3. **Create Pre-commit Hook**
   - Integrate Biome check
   - Add Zod validation script

4. **Add CI/CD Validation**
   - Configure Biome CI check
   - Add Zod validation to pipeline

### Phase 3: Migration (Day 4-5)

1. **Migrate Existing Code**
2. **Update Documentation**
3. **Train Team (if applicable)**
4. **Monitor Compliance**

---

## 📝 Detailed Implementation

### Step 1: Mandatory Type Definitions

Create type-level enforcement for mandatory patterns.

### Step 2: Schema Patterns Library

Create reusable patterns that enforce mandatory features.

### Step 3: Validation Script

Create automated validation that checks compliance.

### Step 4: Biome Configuration

**PRIMARY ENFORCEMENT TOOL**

Configure Biome to catch Zod violations:

1. **Update `biome.json`**:
   - Add overrides for `src/lib/api-schemas/**`
   - Configure strict rules for schema files
   - Enable import type checking

2. **Test Biome**:
   ```bash
   pnpm check
   pnpm check:fix
   ```

3. **Verify Integration**:
   - Biome catches import violations
   - Biome catches type issues
   - Biome auto-fixes where possible

### Step 5: Pre-commit Hooks

Validate schemas before commits.

### Step 6: CI/CD Integration

Add validation to CI pipeline.

---

## ✅ Success Criteria

- [ ] 100% of schemas use `'zod/v4'` import
- [ ] 100% of types use `z.infer<>`
- [ ] 100% of schemas are in `src/lib/api-schemas/`
- [ ] 0 violations in Biome (`pnpm check` passes)
- [ ] 0 violations in Zod validation (`pnpm validate:zod` passes)
- [ ] 0 violations in CI/CD
- [ ] All new schemas follow mandatory patterns
- [ ] All existing schemas migrated
- [ ] Cursor rules active and working in IDE

---

**Next Steps**: See implementation files below.
