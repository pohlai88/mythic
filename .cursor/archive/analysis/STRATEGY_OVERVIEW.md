---
status: archived
reason: orphan-analysis
archived_date: 2026-01-10
original_location: .cursor/STRATEGY_OVERVIEW.md
---

# Cursor Documentation & Rules Strategy Overview

## 🎯 The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                    CURSOR AI CONTEXT                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐             │
│  │  EXTERNAL DOCS   │      │   CURSOR RULES   │             │
│  │   (Indexed)      │      │    (.mdc files)  │             │
│  │                  │      │                  │             │
│  │ • Next.js        │      │ • Core Rules     │             │
│  │ • React          │◄────►│ • Pattern Rules  │             │
│  │ • Supabase       │      │ • Domain Rules  │             │
│  │                  │      │                  │             │
│  │ Framework        │      │ Project-Specific │             │
│  │ Knowledge        │      │ Application      │             │
│  └──────────────────┘      └──────────────────┘             │
│           │                          │                       │
│           │                          │                       │
│           └──────────┬───────────────┘                       │
│                      │                                       │
│                      ▼                                       │
│         ┌──────────────────────┐                             │
│         │   LOCAL DOCS        │                             │
│         │  (.cursor/docs/)    │                             │
│         │                     │                             │
│         │ • Architecture      │                             │
│         │ • Patterns          │                             │
│         │ • Guides            │                             │                             │
│         │                     │                             │
│         │ Detailed Project   │                             │
│         │ Patterns            │                             │
│         └──────────────────────┘                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Decision Framework

### What to Index as External Docs?

```
Is it a PRIMARY framework/library?
├─ YES → Index it (Next.js, React, Supabase)
└─ NO
   ├─ Is it used DAILY?
   │  ├─ YES → Index it (Tailwind, Zod)
   │  └─ NO → Don't index (reference manually)
   └─ Is it project-specific?
      └─ YES → Put in .cursor/docs/ (not indexed)
```

### What Goes in Rules vs Docs?

```
Is it a universal standard?
├─ YES → Core Rule (alwaysApply: true)
└─ NO
   ├─ Is it file-type specific?
   │  ├─ YES → Pattern Rule (globs: "*.ts,*.tsx")
   │  └─ NO
   │     ├─ Is it feature-specific?
   │     │  ├─ YES → Domain Rule (globs: "auth/**/*")
   │     │  └─ NO → Detailed Doc (reference in rule)
   └─ Is it detailed/complex?
     └─ YES → Local Doc (reference in rule)
```

---

## 🎨 Three-Layer Architecture

### Layer 1: External Documentation (Indexed)
**Purpose:** Framework knowledge  
**Location:** Cursor Settings > Features > Docs  
**Count:** 3-5 docs maximum  
**Examples:**
- Next.js Documentation
- React Documentation
- Supabase Documentation

### Layer 2: Cursor Rules (.mdc files)
**Purpose:** Project-specific application  
**Location:** `.cursor/rules/`  
**Count:** 5-15 focused rules  
**Examples:**
- `001_core-operational.mdc`
- `010_module-creation.mdc`
- `100_auth-rules.mdc`

### Layer 3: Local Documentation (Referenced)
**Purpose:** Detailed patterns and conventions  
**Location:** `.cursor/docs/`  
**Count:** As needed  
**Examples:**
- `architecture/system-overview.md`
- `patterns/module-patterns.md`
- `guides/supabase-setup.md`

---

## 🔄 Workflow

```
1. INDEX External Docs
   ↓
   Settings > Features > Docs
   Add: Next.js, React, Supabase
   
2. CREATE Local Docs
   ↓
   .cursor/docs/architecture/
   .cursor/docs/patterns/
   .cursor/docs/guides/
   
3. CREATE Rules
   ↓
   .cursor/rules/001_core.mdc
   Reference: @docs/patterns/module-patterns.md
   
4. TEST & REFINE
   ↓
   Ask Cursor questions
   Verify AI follows rules
   Update based on results
```

---

## 📈 Success Indicators

### ✅ Working Well
- AI suggests project-appropriate patterns
- Code matches existing codebase style
- AI references correct framework APIs
- Consistent behavior across sessions

### ⚠️ Needs Adjustment
- AI suggests patterns not in codebase
- Inconsistent code generation
- AI references wrong framework versions
- Too many conflicting suggestions

### 🔧 Fix Actions
1. Review indexed docs (remove irrelevant)
2. Check rule globs (ensure correct scope)
3. Verify local doc references
4. Test with specific queries
5. Update rules based on results

---

## 🎯 Quick Wins

### 30-Minute Setup
1. **Index 3 docs** (10 min)
   - Next.js, React, Supabase
2. **Create 3 local docs** (10 min)
   - Architecture, Patterns, Setup
3. **Create 2 core rules** (10 min)
   - Operational rules
   - Module creation rules

### Monthly Maintenance
1. Review indexed docs
2. Update local documentation
3. Test rule effectiveness
4. Refine based on results

---

## 📚 Documentation Hierarchy

```
BEST_PRACTICES_STRATEGY.md (Complete Guide)
    ↓
QUICK_REFERENCE.md (One-Page Cheat Sheet)
    ↓
STRATEGY_OVERVIEW.md (This File - Visual Guide)
    ↓
DOCUMENTATION_INDEXING_QUICK_START.md (5-Min Setup)
    ↓
.cursor/docs/CURSOR_DOCUMENTATION_INDEXING_GUIDE.md (Detailed How-To)
```

---

**Start Here:** `.cursor/QUICK_REFERENCE.md`  
**Deep Dive:** `.cursor/BEST_PRACTICES_STRATEGY.md`  
**Visual Guide:** This file

---

**Last Updated:** 2025-01-09
