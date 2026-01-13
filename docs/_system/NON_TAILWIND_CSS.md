---
doc_type: REFERENCE
status: active
owner: architecture
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [reference, css, migration, tailwind]
---

# Non-Tailwind CSS Files - Migration Reference

**Purpose**: Document all CSS files that are NOT part of the Tailwind CSS v4
design system.

---

## ⚠️ Marked Files

### 1. `styles/globals.css`

**Status**: ⚠️ **NON-TAILWIND** - Legacy/Third-party styles

**Contains**:

- Nextra documentation site styles
- KaTeX math rendering styles
- Code block enhancements
- Heading anchor styles
- Callout component styles
- Card hover effects
- Tabs animations
- Accordion transitions
- Print styles
- Dark mode overrides
- Accessibility styles
- Responsive typography

**Migration Strategy**:

- ✅ Keep for Nextra compatibility
- ⚠️ Consider migrating custom styles to Tailwind utilities
- 📝 Document which styles are Nextra-specific vs custom

**Priority**: Low (Nextra dependency)

---

### 2. `components/counters.module.css`

**Status**: ⚠️ **NON-TAILWIND** - CSS Modules

**Contains**:

- CSS Modules styles for counters component

**Migration Strategy**:

- 🔄 Convert to Tailwind utilities
- 🔄 Update component to use Tailwind classes
- 🗑️ Delete CSS Modules file after migration

**Priority**: Medium (Can be migrated)

---

## ✅ Tailwind CSS Files

### `styles/tailwind.css`

**Status**: ✅ **TAILWIND V4** - Design system tokens

**Contains**:

- All design tokens via `@theme` directive
- Color system
- Typography system
- Spacing system
- Shadow system
- Border radius system
- Transition system
- Dark mode tokens

**Action**: ✅ Use this file for all Tailwind configuration

---

## Migration Roadmap

### Phase 1: Documentation ✅

- [x] Identify all non-Tailwind CSS files
- [x] Document purpose and dependencies
- [x] Mark files with status

### Phase 2: Assessment

- [ ] Review each file for migration feasibility
- [ ] Identify Nextra-specific styles (keep)
- [ ] Identify custom styles (migrate)

### Phase 3: Migration

- [ ] Convert CSS Modules to Tailwind
- [ ] Replace custom CSS with design tokens
- [ ] Test functionality after migration

### Phase 4: Cleanup

- [ ] Remove migrated CSS files
- [ ] Update imports
- [ ] Verify no broken styles

---

## Best Practices

### ✅ DO

- Use Tailwind utilities for new components
- Reference design tokens from `styles/tailwind.css`
- Use TypeScript tokens from `lib/design-system/tokens.ts`
- Keep Nextra-specific styles in `globals.css`

### ❌ DON'T

- Don't create new CSS files
- Don't use CSS Modules (use Tailwind)
- Don't write custom CSS (use design tokens)
- Don't remove Nextra styles (breaks documentation)

---

**Last Updated**: 2026-01-10 **Status**: ✅ **DOCUMENTED**
