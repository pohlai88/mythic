# Zod 4.3.5 Features: Identical vs Applicable vs Ignore

## Quick Reference Summary

**Total Features Analyzed**: 95 **Version**: zod@4.3.5 (Latest)

---

## 📊 Feature Breakdown

### ✅ IDENTICAL (27 features - 28%)

**Currently Used - Keep Using**

| Feature                 | Location             | Usage                |
| ----------------------- | -------------------- | -------------------- |
| `.parse()`              | REST, GraphQL APIs   | Core validation      |
| `z.string()`            | All schemas          | String validation    |
| `.min()`, `.max()`      | User schemas         | Length validation    |
| `.email()`              | User schemas         | Email validation     |
| `.datetime()`           | Response schemas     | Timestamp validation |
| `z.number()`            | Pagination           | Number validation    |
| `.int()`, `.positive()` | User IDs, pagination | Integer validation   |
| `z.boolean()`           | User schema          | Boolean validation   |
| `z.object()`            | All schemas          | Object validation    |
| `.extend()`             | User query schema    | Schema extension     |
| `.partial()`            | Update schemas       | Optional fields      |
| `z.array()`             | Paginated responses  | Array validation     |
| `z.enum()`              | Pagination order     | Enum validation      |
| `.optional()`           | All schemas          | Optional fields      |
| `.nullable()`           | User schema          | Nullable fields      |
| `.default()`            | Pagination           | Default values       |
| `.coerce.number()`      | Pagination           | Number coercion      |
| `.describe()`           | API schemas          | Documentation        |
| `z.infer<>`             | All schemas          | Type inference       |
| `z.ZodError`            | Error handling       | Error types          |
| `drizzle-zod`           | Schema generation    | Drizzle integration  |
| `zod-to-openapi`        | API docs             | OpenAPI generation   |
| `.openapi()`            | API docs             | OpenAPI metadata     |
| `.transform()`          | REST API             | Value transformation |
| `.strip()`              | Default behavior     | Unknown key handling |

---

### ⚠️ APPLICABLE (61 features - 64%)

**Should Adopt - High Value**

#### Core Parsing (3)

- `.safeParse()` - Better error handling
- `.parseAsync()` - Async validation
- `.safeParseAsync()` - Async safe parsing

#### String Methods (10)

- `.length()` - Exact length validation
- `.url()` - URL validation
- `.uuid()` - UUID validation
- `.regex()` - Pattern matching
- `.startsWith()` - Prefix validation
- `.endsWith()` - Suffix validation
- `.toLowerCase()` - Data normalization
- `.toUpperCase()` - Data normalization
- `.trim()` - Input sanitization
- `.date()` - Date-only validation

#### Number Methods (5)

- `.negative()` - Negative number validation
- `.nonnegative()` - Zero-or-positive
- `.finite()` - Finite number check
- `.safe()` - Safe integer validation
- `.multipleOf()` - Divisibility check

#### Date Methods (3)

- `z.date()` - Date object validation
- `.min()` - Minimum date
- `.max()` - Maximum date

#### Object Methods (7)

- `.pick()` - Field selection
- `.omit()` - Field exclusion
- `.required()` - Make optional fields required
- `.deepPartial()` - Nested partials
- `.passthrough()` - Preserve unknown keys
- `.strict()` - Strict validation
- `.catchall()` - Dynamic keys

#### Array Methods (5)

- `.min()` - Minimum items
- `.max()` - Maximum items
- `.length()` - Exact length
- `.nonempty()` - Non-empty arrays
- `.element` - Element access

#### Tuple (1)

- `z.tuple()` - Fixed-length arrays

#### Enum (1)

- `z.nativeEnum()` - TypeScript enum support

#### Template Literals (1)

- `z.templateLiteral()` - String templates (NEW in Zod 4)

#### Union/Intersection (3)

- `z.union()` - Multiple types
- `z.intersection()` - Type merging
- `z.discriminatedUnion()` - Tagged unions

#### Literal/Branded (2)

- `z.literal()` - Exact values
- `.brand()` - Type branding

#### Transformation (5)

- `.refine()` - Custom validation
- `.superRefine()` - Complex validation
- `.check()` - Simple checks
- `.overwrite()` - Value replacement
- `.pipe()` - Schema composition

#### Wrappers (4)

- `.nullish()` - Null or undefined
- `.readonly()` - Immutable types
- `.catch()` - Error recovery
- `.nonoptional()` - Required fields

#### Coercion (4)

- `z.coerce.string()` - String coercion
- `z.coerce.boolean()` - Boolean coercion
- `z.coerce.date()` - Date coercion
- `.preprocess()` - Preprocessing

#### Metadata (2)

- `.meta()` - Custom metadata
- `.register()` - Schema registry

#### Utilities (4)

- `.clone()` - Schema copying
- `.isOptional()` - Runtime checks
- `.isNullable()` - Runtime checks
- `z.ZodIssue` - Detailed errors

#### Integration (1)

- `zod-to-json-schema` - JSON Schema generation (installed but unused)

---

### ❌ IGNORE (7 features - 7%)

**Not Relevant - Skip**

| Feature            | Reason                          |
| ------------------ | ------------------------------- |
| `.ip()`            | Not using IP validation         |
| `.emoji()`         | Not using emoji validation      |
| `.cuid()`          | Using serial IDs, not CUIDs     |
| `.cuid2()`         | Using serial IDs, not CUID2s    |
| `.nonpositive()`   | Not using negative-only numbers |
| `.date()` (string) | Using `.datetime()` instead     |

---

## 🎯 Top 10 Priority Features to Adopt

1. **`.safeParse()`** - Better error handling (replace all `.parse()`)
2. **`.trim()`** - Input sanitization (add to all string inputs)
3. **`.toLowerCase()`** - Data normalization (add to email/username)
4. **`.pick()` / `.omit()`** - Field selection (create public/private schemas)
5. **`.refine()`** - Custom validation (password strength, business rules)
6. **`.url()`** - URL validation (webhooks, links)
7. **`.uuid()`** - UUID validation (if using UUIDs)
8. **`.nonempty()`** - Array validation (prevent empty arrays)
9. **`.catch()`** - Error recovery (default values on error)
10. **`.readonly()`** - Immutability (config objects)

---

## 📈 Utilization Score

```
Current Utilization: 28% (27/95 features)
Optimization Potential: 64% (61 features to adopt)
Target Utilization: 92% (88/95 features)
```

---

## 🔄 Migration Checklist

### Immediate Actions

- [ ] Migrate imports: `'zod'` → `'zod/v4'`
- [ ] Replace `.parse()` with `.safeParse()`
- [ ] Add `.trim()` to all string inputs
- [ ] Add `.toLowerCase()` to email/username fields

### Short-term (1-2 weeks)

- [ ] Add `.pick()` and `.omit()` patterns
- [ ] Implement `.refine()` for custom validations
- [ ] Add `.url()` for URL fields
- [ ] Add `.nonempty()` for required arrays

### Medium-term (1 month)

- [ ] Add template literals
- [ ] Implement discriminated unions
- [ ] Add coercion for query parameters
- [ ] Use `.catch()` for error recovery

---

**See [ZOD_OPTIMIZATION_ANALYSIS.md](./ZOD_OPTIMIZATION_ANALYSIS.md) for
detailed analysis and examples.**
