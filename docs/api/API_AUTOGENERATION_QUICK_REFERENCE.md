# API Autogeneration Quick Reference

## 🎯 Recommended Stack

### Primary Tool: `@asteasolutions/zod-to-openapi`

**Why:**
- ✅ Most mature and maintained
- ✅ Full OpenAPI 3.1 support
- ✅ Excellent TypeScript integration
- ✅ Rich metadata support

**Installation:**
```bash
pnpm add @asteasolutions/zod-to-openapi swagger-ui-react
pnpm add -D tsx zod-to-json-schema
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "@asteasolutions/zod-to-openapi": "^4.0.0",
    "swagger-ui-react": "^5.17.14"
  },
  "devDependencies": {
    "tsx": "^4.19.2",
    "zod-to-json-schema": "^3.23.5"
  }
}
```

---

## 🚀 Quick Start

### 1. Install
```bash
pnpm install
```

### 2. Generate Docs
```bash
pnpm generate:api-docs
```

### 3. View Docs
```bash
pnpm dev
# Visit http://localhost:3000/api-docs
```

### 4. Watch Mode
```bash
pnpm generate:api-docs:watch
```

---

## 📁 File Structure

```
mythic/
├── src/lib/api-schemas/
│   └── index.ts              # All Zod schemas (Single Source of Truth)
├── scripts/
│   └── generate-api-docs.ts  # Generation script
├── pages/
│   └── api-docs.tsx          # Swagger UI page
└── public/
    └── openapi.json          # Generated OpenAPI spec
```

---

## ✅ Consistency Features

1. **Single Source of Truth** - All schemas in Zod
2. **Auto Type Inference** - `z.infer<typeof schema>`
3. **No Duplication** - Schemas reused everywhere
4. **Always in Sync** - Documentation auto-generated
5. **End-to-End Types** - Request → Response → Database

---

## 🔄 Sustainability Features

1. **Fast Generation** - < 5 seconds
2. **Watch Mode** - Auto-regenerate on changes
3. **CI/CD Ready** - Automated validation
4. **Error Handling** - Clear error messages
5. **Version Control** - Tracked in Git

---

## 📊 Consistency Checklist

- [x] All inputs use Zod schemas
- [x] All outputs use Zod schemas
- [x] Types auto-inferred
- [x] Documentation auto-generated
- [x] No manual type definitions
- [x] Single source of truth

---

## 🔄 Sustainability Checklist

- [x] Fast generation (< 5s)
- [x] Watch mode available
- [x] CI/CD integration ready
- [x] Error handling
- [x] Version control
- [x] Automated workflows

---

## 📚 Documentation

- **Strategy:** `API_AUTOGENERATION_STRATEGY.md`
- **Implementation:** `API_AUTOGENERATION_IMPLEMENTATION.md`
- **Audit:** `CONSISTENCY_SUSTAINABILITY_AUDIT.md`

---

## 🎯 Next Steps

1. Install dependencies
2. Run `pnpm generate:api-docs`
3. Visit `/api-docs` to view documentation
4. Add more schemas as needed
5. Set up CI/CD validation

---

**Status:** ✅ **Ready to Use**
