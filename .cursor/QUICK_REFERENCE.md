# Cursor Rules & Documentation Quick Reference

## 🎯 The Golden Rules

1. **Index 3-5 external docs max** (framework knowledge)
2. **Keep rules under 100 lines** (focused and clear)
3. **Reference local docs in rules** (don't index them)
4. **Use specific globs** (scope rules appropriately)
5. **Test and refine** (verify AI follows your rules)

---

## 📚 Documentation Strategy

### External Docs (Index via Settings > Features > Docs)

**Must Have:**
```
✅ Next.js Documentation: https://nextjs.org/docs
✅ React Documentation: https://react.dev
✅ Supabase Documentation: https://supabase.com/docs
```

**Nice to Have:**
```
TypeScript: https://www.typescriptlang.org/docs
Tailwind CSS: https://tailwindcss.com/docs
```

### Local Docs (Store in `.cursor/docs/`)

**Structure:**
```
.cursor/docs/
├── architecture/
│   └── system-overview.md
├── patterns/
│   └── module-patterns.md
└── guides/
    └── supabase-setup.md
```

**Reference in Rules:**
```markdown
@docs/architecture/system-overview.md
@docs/patterns/module-patterns.md
```

---

## 📋 Rules Strategy

### File Naming
```
NNN_category-name.mdc

Examples:
001_core-operational.mdc
010_module-creation.mdc
100_auth-rules.mdc
```

### Rule Types

| Type | `alwaysApply` | `globs` | Use Case |
|------|---------------|---------|----------|
| Core | `true` | `"*.ts,*.tsx"` | Universal standards |
| Pattern | `false` | `"*.ts,*.tsx"` | File-type specific |
| Domain | `false` | `"auth/**/*"` | Feature-specific |

### Rule Template

```markdown
---
description: Brief description of rule purpose
globs: "*.ts,*.tsx"  # or specific paths
alwaysApply: false    # true only for universal rules
---

**Reference Documentation:**
- @docs/patterns/module-patterns.md

Your rule content here...
```

---

## 🔗 Integration Pattern

```
External Docs (Indexed)
    ↓ Framework knowledge
Rules (Referenced)
    ↓ Project application
Local Docs (Referenced in Rules)
    ↓ Detailed patterns
```

---

## ✅ Quick Checklist

### Setup
- [ ] Index 3-5 external framework docs
- [ ] Create `.cursor/docs/` structure
- [ ] Create core rules (001-099)
- [ ] Reference local docs in rules
- [ ] Test with sample queries

### Maintenance (Monthly)
- [ ] Review indexed docs relevance
- [ ] Update local documentation
- [ ] Test rule effectiveness
- [ ] Refine based on AI behavior

---

## 🚨 Common Mistakes

| ❌ Don't | ✅ Do |
|----------|-------|
| Index 20+ docs | Index 3-5 essential docs |
| One 500-line rule | Multiple 25-100 line rules |
| Vague globs: `"**/*"` | Specific: `"app/api/**/*.ts"` |
| Copy docs into rules | Reference: `@docs/file.md` |
| `alwaysApply: true` everywhere | Use only for universal rules |

---

## 📖 Full Guides

- **Strategy Guide:** `.cursor/BEST_PRACTICES_STRATEGY.md`
- **Indexing Guide:** `.cursor/docs/CURSOR_DOCUMENTATION_INDEXING_GUIDE.md`
- **Quick Start:** `.cursor/DOCUMENTATION_INDEXING_QUICK_START.md`

---

**Last Updated:** 2025-01-09
