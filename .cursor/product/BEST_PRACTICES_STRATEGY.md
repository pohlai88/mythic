# Cursor Best Practices: Documentation Indexing & Rules Strategy

## 🎯 Executive Summary

This guide provides a strategic approach to maximizing Cursor's AI capabilities
through optimal documentation indexing and rules utilization. Follow these
practices to achieve consistent, accurate, and context-aware AI assistance.

---

## 📚 Part 1: Documentation Indexing Strategy

### 1.1 The Three-Layer Documentation Model

Organize documentation in three layers for optimal context management:

```
Layer 1: External Framework Docs (Always Available)
├── Next.js, React, TypeScript official docs
└── Core technology documentation

Layer 2: Project-Specific External Docs (Selective)
├── Supabase, Tailwind CSS
├── Active library documentation
└── API documentation you use

Layer 3: Internal Project Docs (Referenced in Rules)
├── Architecture documentation
├── Patterns and conventions
└── Project-specific guides
```

### 1.2 Documentation Indexing Decision Matrix

| Documentation Type                 | Index?       | Priority | When to Remove                 |
| ---------------------------------- | ------------ | -------- | ------------------------------ |
| Primary framework (Next.js, React) | ✅ Yes       | High     | Never (core dependency)        |
| Database (Supabase)                | ✅ Yes       | High     | When switching databases       |
| UI Library (Tailwind)              | ✅ Yes       | Medium   | When changing UI approach      |
| Utility Library (Zod)              | ✅ Yes       | Medium   | When removing from project     |
| Niche Library                      | ❌ No        | Low      | Only if actively used daily    |
| Tutorial/Guide                     | ❌ No        | Low      | Reference manually when needed |
| Internal Architecture              | ✅ Via Rules | High     | Keep in `.cursor/docs/`        |

### 1.3 Indexing Best Practices

#### ✅ DO:

1. **Start with Core (3-5 docs max)**

   ```
   Essential Index:
   - Next.js Documentation
   - React Documentation
   - Supabase Documentation
   ```

2. **Use Version-Specific URLs**
   - ✅ `https://nextjs.org/docs` (auto-updates)
   - ✅ `https://react.dev` (latest)
   - ❌ Avoid versioned URLs unless you need specific version

3. **Name Clearly in Cursor Settings**
   - ✅ "Next.js 15 Docs"
   - ✅ "Supabase API Reference"
   - ❌ "docs" or "next"

4. **Monitor Indexing Status**
   - Check `Settings > Features > Docs` regularly
   - Remove failed or outdated indexes
   - Re-index when frameworks update

5. **Combine External + Local**
   - External docs for framework knowledge
   - Local docs for project-specific patterns
   - Reference local docs in rules (not indexed separately)

#### ❌ DON'T:

1. **Don't Index Everything**
   - Too many docs = diluted context
   - AI becomes less accurate with too much information
   - Stick to 5-7 external docs maximum

2. **Don't Index Internal Docs as URLs**
   - Internal docs should be in `.cursor/docs/`
   - Reference them in rules, not as indexed URLs
   - Exception: If you host internal docs on a server

3. **Don't Index Deprecated Docs**
   - Remove old framework versions
   - Keep only current/active documentation
   - Check quarterly for updates

4. **Don't Index Large Tutorial Sites**
   - Tutorials are reference material, not active context
   - Use `@Docs` manually when needed
   - Index only official API references

---

## 📋 Part 2: Cursor Rules Strategy

### 2.1 Rules Organization Hierarchy

```
.cursor/rules/
├── 001_core-operational.mdc      # Always applied (alwaysApply: true)
├── 002_project-standards.mdc     # Always applied
├── patterns/
│   ├── 010_module-creation.mdc   # Applied to *.ts,*.tsx
│   ├── 020_api-design.mdc        # Applied to api/**/*.ts
│   └── 030_component-patterns.mdc # Applied to components/**/*.tsx
├── domain/
│   ├── 100_auth-rules.mdc        # Applied to auth/**/*
│   └── 200_database-rules.mdc    # Applied to lib/db/**/*
└── utilities/
    └── 300_testing-rules.mdc      # Applied to **/*.spec.ts
```

### 2.2 Rules Naming Convention

**Format:** `NNN_category-name.mdc`

- **NNN**: Three-digit priority/sequence number
  - `001-099`: Core operational rules (always apply)
  - `100-199`: Domain-specific rules
  - `200-299`: Utility/helper rules
  - `300+`: Specialized rules

- **category-name**: Descriptive, kebab-case name
  - ✅ `module-creation.mdc`
  - ✅ `api-design.mdc`
  - ❌ `rules.mdc` (too vague)
  - ❌ `ModuleCreation.mdc` (wrong case)

### 2.3 Rules Composition Strategy

#### Rule Types by Scope:

1. **Core Rules** (`alwaysApply: true`)
   - Project-wide standards
   - Coding conventions
   - Safety rules
   - **Keep under 100 lines each**

2. **Pattern Rules** (`globs: "*.ts,*.tsx"`)
   - File-type specific
   - Pattern enforcement
   - **Keep under 50 lines each**

3. **Domain Rules** (`globs: "auth/**/*"`)
   - Feature-specific
   - Domain logic
   - **Keep under 75 lines each**

### 2.4 Rules Best Practices

#### ✅ DO:

1. **Keep Rules Focused**

   ```markdown
   # ✅ Good: Focused rule

   ---

   description: Module creation patterns globs: "_.ts,_.tsx" alwaysApply: false

   ---

   Before creating modules, check @docs/patterns/module-patterns.md
   ```

2. **Reference Documentation**

   ```markdown
   **Reference Documentation:**

   - @docs/architecture/system-overview.md
   - @docs/patterns/module-patterns.md
   ```

3. **Use Specific Globs**

   ```yaml
   # ✅ Good: Specific
   globs: "app/api/**/*.ts,app/api/**/*.tsx"

   # ❌ Bad: Too broad
   globs: "**/*"
   ```

4. **Cross-Reference Rules**

   ```markdown
   For authentication patterns, see @rules/domain/auth-rules.mdc
   ```

5. **Test Rule Effectiveness**
   - Generate code before/after adding rules
   - Verify AI follows the rules
   - Update rules based on results

#### ❌ DON'T:

1. **Don't Create Monolithic Rules**
   - ❌ One 500-line rule file
   - ✅ Multiple focused 25-100 line rules

2. **Don't Use Vague Language**

   ```markdown
   # ❌ Bad: Vague

   "Write good code"

   # ✅ Good: Specific

   "Use TypeScript strict mode. No implicit any. All functions must have return
   types."
   ```

3. **Don't Override with `alwaysApply: true`**
   - Only use for truly universal rules
   - Most rules should be scoped with `globs`

4. **Don't Duplicate Information**
   - Put detailed patterns in `.cursor/docs/`
   - Reference docs in rules, don't copy content

---

## 🔗 Part 3: Integration Strategy

### 3.1 The Documentation-Rules Bridge

**Principle:** External docs provide framework knowledge, rules provide
project-specific guidance.

```
External Docs (Indexed)
    ↓
    Provides: Framework APIs, patterns, best practices
    ↓
Rules (Referenced)
    ↓
    Provides: Project-specific application of framework knowledge
    ↓
Local Docs (Referenced in Rules)
    ↓
    Provides: Detailed project patterns and conventions
```

### 3.2 Optimal Workflow

1. **Index External Framework Docs**
   - Next.js, React, Supabase
   - These provide base knowledge

2. **Create Local Documentation**
   - Architecture decisions
   - Project patterns
   - Custom conventions

3. **Create Focused Rules**
   - Reference local docs
   - Apply project-specific constraints
   - Use appropriate globs

4. **Test and Refine**
   - Ask Cursor questions
   - Verify it uses both indexed docs and rules
   - Update based on results

### 3.3 Example: Complete Integration

**External Docs (Indexed):**

- Next.js Documentation
- Supabase Documentation

**Local Docs (`.cursor/docs/`):**

- `architecture/system-overview.md`
- `patterns/module-patterns.md`

**Rules (`.cursor/rules/`):**

```markdown
---
description: Module creation guidelines
globs: "*.ts,*.tsx"
alwaysApply: false
---

**Reference Documentation:**

- @docs/patterns/module-patterns.md - Complete module guidelines
- @docs/architecture/system-overview.md - Project structure

Before creating a module:

1. Check @docs/patterns/module-patterns.md for structure
2. Follow Next.js App Router patterns (from indexed docs)
3. Use Supabase client patterns (from indexed docs)
```

---

## 📊 Part 4: Maintenance Strategy

### 4.1 Quarterly Review Checklist

**Documentation:**

- [ ] Review indexed external docs for relevance
- [ ] Remove unused or deprecated docs
- [ ] Update local documentation
- [ ] Verify all `@docs/` references still work

**Rules:**

- [ ] Review rule effectiveness
- [ ] Consolidate overlapping rules
- [ ] Update globs if project structure changed
- [ ] Test rules with sample queries

### 4.2 When to Update

**Update Documentation When:**

- Framework version changes
- Project architecture evolves
- New patterns emerge
- Old patterns become deprecated

**Update Rules When:**

- AI doesn't follow expected patterns
- Project structure changes
- New conventions are established
- Rules become too long (>100 lines)

### 4.3 Version Control Strategy

**Commit to Git:**

- ✅ `.cursor/rules/*.mdc` - All rules
- ✅ `.cursor/docs/**/*.md` - All local docs
- ✅ `.cursor/BEST_PRACTICES_STRATEGY.md` - This guide

**Don't Commit:**

- ❌ Cursor settings (user-specific)
- ❌ Indexed external docs (stored in Cursor, not repo)

---

## 🎯 Part 5: Quick Reference

### Documentation Indexing

| Action              | Command/Path                 |
| ------------------- | ---------------------------- |
| Add external doc    | `@Docs` → Add new doc → URL  |
| View indexed docs   | `Settings > Features > Docs` |
| Reference local doc | `@docs/filename.md` in rules |

### Rules Management

| Action         | File Location                |
| -------------- | ---------------------------- |
| Create rule    | `.cursor/rules/NNN_name.mdc` |
| Reference doc  | `@docs/subdir/file.md`       |
| Reference rule | `@rules/subdir/rule.mdc`     |
| View rules     | `.cursor/rules/` directory   |

### Best Practices Summary

1. **Documentation:**
   - Index 3-5 essential external docs
   - Keep local docs in `.cursor/docs/`
   - Reference local docs in rules

2. **Rules:**
   - Keep rules focused (<100 lines)
   - Use specific globs
   - Reference documentation
   - Test effectiveness regularly

3. **Integration:**
   - External docs = framework knowledge
   - Rules = project application
   - Local docs = detailed patterns

---

## 📈 Success Metrics

### How to Know It's Working

**Good Signs:**

- ✅ AI follows project patterns without explicit prompts
- ✅ AI references correct framework APIs
- ✅ AI suggests project-appropriate solutions
- ✅ Code generation matches existing codebase style

**Warning Signs:**

- ⚠️ AI suggests patterns not in your codebase
- ⚠️ AI doesn't follow documented conventions
- ⚠️ Too many conflicting suggestions
- ⚠️ AI references wrong framework versions

**If You See Warnings:**

1. Review indexed documentation (remove irrelevant)
2. Check rule globs (ensure correct scope)
3. Verify local docs are referenced correctly
4. Test with specific queries
5. Update rules based on results

---

## 🚀 Getting Started Checklist

### Initial Setup (30 minutes)

- [ ] **Index Core External Docs** (10 min)
  - [ ] Next.js Documentation
  - [ ] React Documentation
  - [ ] Supabase Documentation

- [ ] **Create Local Documentation** (10 min)
  - [ ] `.cursor/docs/architecture/system-overview.md`
  - [ ] `.cursor/docs/patterns/module-patterns.md`
  - [ ] `.cursor/docs/guides/setup-guide.md`

- [ ] **Create Core Rules** (10 min)
  - [ ] `001_core-operational.mdc` (alwaysApply: true)
  - [ ] `010_module-creation.mdc` (globs: "_.ts,_.tsx")
  - [ ] Reference local docs in rules

### Ongoing Maintenance (Monthly)

- [ ] Review indexed docs for relevance
- [ ] Update local documentation
- [ ] Test rules with sample queries
- [ ] Refine based on AI behavior

---

## 📚 Additional Resources

- [Cursor Context Documentation](https://docs.cursor.com/context)
- [Cursor Rules Documentation](https://docs.cursor.com/context/rules)
- [Codebase Indexing Guide](https://docs.cursor.com/context/codebase-indexing)
- [Agent Skills Specification](https://agentskills.io/specification)

---

**Last Updated:** 2025-01-09 **Version:** 1.0 **Maintained By:** Project Team
