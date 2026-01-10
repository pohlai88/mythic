# Cursor Configuration & Best Practices

Welcome to the Cursor configuration directory. This directory contains rules, documentation, and best practices for maximizing Cursor AI's effectiveness in this project.

---

## 📁 Directory Structure

```
.cursor/
├── README.md (this file)
│
├── 📋 Strategy & Guides
│   ├── BEST_PRACTICES_STRATEGY.md      # Complete best practices guide
│   ├── STRATEGY_OVERVIEW.md             # Visual strategy overview
│   ├── QUICK_REFERENCE.md               # One-page cheat sheet
│   └── DOCUMENTATION_INDEXING_QUICK_START.md  # 5-minute setup guide
│
├── 📚 Rules (.mdc files)
│   ├── operational-rules.mdc                    # Core operational standards
│   ├── 005_documentation-indexing-strategy.mdc  # Documentation indexing best practices
│   └── new-module-pattern-template-rules.mdc    # Module creation patterns
│
└── 📖 Documentation
    └── docs/
        ├── architecture/
        │   └── system-overview.md       # System architecture
        ├── patterns/
        │   └── module-patterns.md       # Module patterns
        ├── guides/
        │   └── supabase-setup.md        # Supabase setup
        └── CURSOR_DOCUMENTATION_INDEXING_GUIDE.md  # Detailed indexing guide
```

---

## 🚀 Quick Start

### For New Team Members

1. **Read First:** `.cursor/QUICK_REFERENCE.md` (5 minutes)
2. **Setup:** Follow `.cursor/DOCUMENTATION_INDEXING_QUICK_START.md` (5 minutes)
3. **Deep Dive:** Read `.cursor/BEST_PRACTICES_STRATEGY.md` (20 minutes)

### For Experienced Users

- **Quick Reference:** `.cursor/QUICK_REFERENCE.md`
- **Strategy Overview:** `.cursor/STRATEGY_OVERVIEW.md`

---

## 📚 Documentation Guide

### What Each File Contains

| File | Purpose | When to Read |
|------|---------|--------------|
| `QUICK_REFERENCE.md` | One-page cheat sheet | Daily reference |
| `STRATEGY_OVERVIEW.md` | Visual strategy guide | Understanding the big picture |
| `BEST_PRACTICES_STRATEGY.md` | Complete guide | Initial setup, deep dive |
| `DOCUMENTATION_INDEXING_QUICK_START.md` | 5-min setup | First-time setup |
| `docs/CURSOR_DOCUMENTATION_INDEXING_GUIDE.md` | Detailed how-to | Troubleshooting, advanced usage |

---

## 🎯 Core Principles

### 1. Documentation Indexing
- **Index 3-5 external docs** (framework knowledge)
- **Store local docs** in `.cursor/docs/` (project patterns)
- **Reference local docs** in rules (don't index them)

### 2. Rules Organization
- **Keep rules focused** (<100 lines each)
- **Use specific globs** (scope appropriately)
- **Reference documentation** (link to local docs)

### 3. Integration
- **External docs** = Framework knowledge
- **Rules** = Project application
- **Local docs** = Detailed patterns

---

## 📋 Current Configuration

### Indexed External Documentation
*(Add via Settings > Features > Docs)*

**Recommended:**
- ✅ Next.js Documentation: `https://nextjs.org/docs`
- ✅ React Documentation: `https://react.dev`
- ✅ Supabase Documentation: `https://supabase.com/docs`

### Active Rules

1. **`operational-rules.mdc`**
   - Core operational standards
   - Always applied (`alwaysApply: true`)
   - References: System overview, patterns, guides

2. **`005_documentation-indexing-strategy.mdc`**
   - Documentation indexing best practices
   - Always applied (`alwaysApply: true`)
   - Enforces three-layer documentation model
   - Guides what to index vs. what to reference

3. **`new-module-pattern-template-rules.mdc`**
   - Module creation guidelines
   - Applied to TypeScript files (`globs: "*.ts,*.tsx"`)
   - References: Module patterns, architecture

### Local Documentation

- **Architecture:** System overview, tech stack, project structure
- **Patterns:** Module creation, error handling, testing
- **Guides:** Supabase setup, development workflows

---

## 🔧 Maintenance

### Monthly Checklist

- [ ] Review indexed external docs for relevance
- [ ] Update local documentation
- [ ] Test rule effectiveness with sample queries
- [ ] Refine rules based on AI behavior
- [ ] Verify all `@docs/` references still work

### When to Update

**Update Documentation When:**
- Framework versions change
- Project architecture evolves
- New patterns emerge

**Update Rules When:**
- AI doesn't follow expected patterns
- Project structure changes
- Rules become too long (>100 lines)

---

## 🎓 Learning Path

### Beginner
1. Read `QUICK_REFERENCE.md`
2. Follow `DOCUMENTATION_INDEXING_QUICK_START.md`
3. Test with sample queries

### Intermediate
1. Read `STRATEGY_OVERVIEW.md`
2. Review existing rules
3. Create domain-specific rules

### Advanced
1. Read `BEST_PRACTICES_STRATEGY.md`
2. Optimize documentation structure
3. Create custom rule hierarchies

---

## 📖 Additional Resources

- [Cursor Context Documentation](https://docs.cursor.com/context)
- [Cursor Rules Documentation](https://docs.cursor.com/context/rules)
- [Codebase Indexing Guide](https://docs.cursor.com/context/codebase-indexing)
- [Agent Skills Specification](https://agentskills.io/specification)

---

## 🤝 Contributing

When adding new rules or documentation:

1. **Follow naming conventions:**
   - Rules: `NNN_category-name.mdc`
   - Docs: `category/descriptive-name.md`

2. **Update this README** if adding new sections

3. **Reference in rules** when creating new local docs

4. **Test effectiveness** before committing

---

## ❓ FAQ

### Q: How many external docs should I index?
**A:** 3-5 maximum. Too many dilutes context.

### Q: Should I index local docs?
**A:** No. Store them in `.cursor/docs/` and reference in rules.

### Q: How long should rules be?
**A:** Keep under 100 lines. Split large rules into multiple focused ones.

### Q: When should I use `alwaysApply: true`?
**A:** Only for truly universal rules. Most rules should use specific globs.

### Q: How do I test if rules are working?
**A:** Ask Cursor questions and verify it follows your documented patterns.

---

**Last Updated:** 2025-01-09  
**Maintained By:** Project Team
