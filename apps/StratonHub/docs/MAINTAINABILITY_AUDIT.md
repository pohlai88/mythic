# Maintainability Audit

**Purpose**: Identify long-term maintenance traps and provide preventive
measures. **Audit Date**: 2026-01-13 **Scope**: StratonHub Luxury UX System

---

## Executive Summary

The Luxury UX system is **well-architected** with clear separation of concerns.
However, there are 7 potential long-term traps that require monitoring.

| Risk Level  | Count | Action Required    |
| ----------- | ----- | ------------------ |
| 🔴 Critical | 0     | None               |
| 🟡 Medium   | 3     | Monitor + Document |
| 🟢 Low      | 4     | Awareness Only     |

**Overall Assessment**: ✅ Production Ready (with documented mitigations)

---

## 🟡 Medium Risk Traps

### Trap 1: CSS Scroll-Driven Animation Browser Support

**Location**: `app/globals.css` - Breathing Rhythm

**Risk**: Scroll-driven animations are Chrome/Edge 115+ only. Safari has partial
support. Firefox has no support (as of 2026-01).

**Current Mitigation**:

```css
@supports (animation-timeline: scroll()) {
  /* Feature only loads if supported */
}
@media (prefers-reduced-motion: reduce) {
  /* Accessibility fallback */
}
```

**Long-term Trap**:

- If Safari/Firefox adopt different syntax, we may need vendor prefixes
- Polyfill temptation (avoid — runtime cost defeats "zero cost" principle)

**Recommended Action**:

1. ✅ Keep `@supports` guard (already done)
2. ✅ Keep `prefers-reduced-motion` fallback (already done)
3. ⚠️ Add browser support comment with date for future review
4. ⚠️ Set calendar reminder: Review browser support Q2 2026

**Severity**: 🟡 Medium (graceful degradation exists)

---

### Trap 2: Zustand Store Hydration Timing

**Location**: `store/use-reader-prefs.ts`, `components/docs/DocLayout.tsx`

**Risk**: Zustand with `persist` + `skipHydration` requires manual rehydration.
If a developer imports the store in a Server Component, hydration mismatch
occurs.

**Current Mitigation**:

```typescript
// DocLayout.tsx
useEffect(() => {
  useReaderPrefs.persist.rehydrate()
}, [])
```

**Long-term Trap**:

- New developers may not understand `skipHydration` pattern
- ESLint cannot enforce "client-only import" rule
- Server Component import causes silent hydration mismatch

**Recommended Action**:

1. ✅ Add RFC-2119 documentation to store (already done)
2. ⚠️ Consider ESLint plugin: `eslint-plugin-react-server-components`
3. ⚠️ Add CI check: Grep for store imports in non-client files

**Enforcement Script** (add to CI):

```bash
# Check for Zustand imports in Server Components
grep -r "from '@/store'" --include="*.tsx" apps/StratonHub | \
  grep -v "'use client'" && echo "❌ Store imported in RSC" && exit 1
```

**Severity**: 🟡 Medium (documentation exists, but no enforcement)

---

### Trap 3: Content Hash Collision in Scroll Memory

**Location**: `hooks/use-scroll-memory.ts`

**Risk**: The content hash is a simple fingerprint (length + prefix + suffix).
Two different documents with same length and similar headings could collide.

**Current Implementation**:

```typescript
function generateContentHash(): string {
  const headingIds = Array.from(headings)
    .map((h) => h.id)
    .join("|")
  return `${len}:${prefix}:${suffix}`
}
```

**Long-term Trap**:

- Collision probability increases as document count grows
- If collision occurs: User jumps to wrong heading (bad UX, not breaking)

**Recommended Action**:

1. ⚠️ Monitor for collision reports (add error tracking)
2. ⚠️ If collisions occur, upgrade to proper hash (e.g., `cyrb53`)
3. ✅ Current implementation is acceptable for <1000 documents

**Mitigation if needed** (future):

```typescript
// cyrb53 hash (fast, good distribution)
function cyrb53(str: string): string {
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 ^= Math.imul(h1 ^ (h2 >>> 15), 2246822507)
  h2 ^= Math.imul(h2 ^ (h1 >>> 13), 3266489909)
  return ((h2 >>> 0) * 0x100000000 + (h1 >>> 0)).toString(36)
}
```

**Severity**: 🟡 Medium (unlikely, recoverable)

---

## 🟢 Low Risk Traps

### Trap 4: AxisStack Gap Rename (Breaking Change Risk)

**Location**: `components/blocks/AxisStack.tsx`

**Risk**: Gap values were renamed from `xl/lg/md/sm` to
`authority/section/block/tight`. Existing usages will break.

**Current State**:

- Old: `gap="xl"` → Error (type mismatch)
- New: `gap="authority"` → Works

**Long-term Trap**:

- If AxisStack is used elsewhere in the monorepo, those usages will fail
  TypeScript

**Recommended Action**:

1. ⚠️ Search codebase for `AxisStack` usage
2. ⚠️ Update all usages to new gap values
3. ✅ TypeScript will catch this at build time

**Severity**: 🟢 Low (TypeScript enforced)

---

### Trap 5: Right Rail Threshold Magic Number

**Location**: `components/shells/DocShell.tsx`

**Risk**: `RIGHT_RAIL_THRESHOLD = 3` is a magic number. Future developers may
change it without understanding the UX rationale.

**Current Mitigation**:

```typescript
/** Minimum heading count to show right rail (Table of Contents) */
const RIGHT_RAIL_THRESHOLD = 3
```

**Long-term Trap**:

- Threshold may need adjustment per document type
- No A/B testing data to validate "3" is correct

**Recommended Action**:

1. ✅ Document the rationale (done via comment)
2. ⚠️ Consider making threshold configurable per Diataxis type
3. ⚠️ Add analytics to track right rail engagement

**Severity**: 🟢 Low (easy to adjust)

---

### Trap 6: sessionStorage Quota Exhaustion

**Location**: `hooks/use-scroll-memory.ts`

**Risk**: Each page visit stores 2 keys in sessionStorage. Over a long session
with many pages, quota could be exhausted.

**Calculation**:

```
Per page: ~100 bytes (key + heading ID + hash)
sessionStorage limit: 5MB
Max pages before quota: ~50,000
```

**Long-term Trap**:

- Heavy users with 1000+ page visits per session could approach limits
- Quota error silently fails (already handled with try/catch)

**Recommended Action**:

1. ✅ Try/catch already handles quota errors (graceful degradation)
2. ⚠️ Consider LRU cache pattern if analytics show heavy usage
3. ✅ Current implementation is acceptable for typical usage

**Severity**: 🟢 Low (graceful degradation exists)

---

### Trap 7: CSS Custom Properties Dependency Chain

**Location**: `app/globals.css` - Reader Preferences CSS

**Risk**: Reader preference CSS depends on CSS custom properties from design
system. If design system changes variable names, globals.css breaks.

**Dependencies**:

```css
.doc-layout[data-width="prose"] {
  max-width: var(--container-prose); /* ← Depends on design system */
}
```

**Long-term Trap**:

- Design system variable rename breaks globals.css
- No TypeScript to catch CSS variable mismatches

**Recommended Action**:

1. ⚠️ Add CSS variable validation script
2. ⚠️ Consider CSS Modules or css-in-js for type safety
3. ✅ Current risk is acceptable with design system governance

**Severity**: 🟢 Low (design system is sealed/governed)

---

## Preventive Measures Checklist

### Immediate Actions (Do Now)

- [ ] Run search for `AxisStack` with old gap values (`xl`, `lg`, `md`, `sm`)
- [ ] Add CI script for Zustand RSC import detection
- [ ] Add browser support review reminder to calendar (Q2 2026)

### Quarterly Review Actions

- [ ] Check CSS scroll-driven animation browser support
- [ ] Review sessionStorage usage analytics
- [ ] Validate right rail threshold with user data

### Annual Review Actions

- [ ] Audit all CSS custom property dependencies
- [ ] Review content hash collision reports
- [ ] Update browser support documentation

---

## Dependency Health

| Dependency            | Version | Risk      | Notes                                   |
| --------------------- | ------- | --------- | --------------------------------------- |
| zustand               | 5.0.10  | 🟢 Low    | Stable, well-maintained                 |
| next-themes           | 0.4.x   | 🟢 Low    | Standard pattern                        |
| @tanstack/react-query | 5.x     | 🟢 Low    | Configured, not yet used                |
| tailwindcss           | 4.x     | 🟡 Medium | v4 is new, monitor for breaking changes |

---

## Architecture Decision Records

### ADR-001: Why skipHydration for Zustand?

**Context**: Zustand with localStorage persistence causes hydration mismatch.

**Decision**: Use `skipHydration: true` and manual rehydration in useEffect.

**Consequences**:

- ✅ No hydration mismatch
- ✅ SSR renders with default values
- ⚠️ Requires developer awareness

### ADR-002: Why Data Attributes Instead of Conditional Classes?

**Context**: Reader preferences need to affect styling without layout shift.

**Decision**: Use `data-*` attributes and CSS attribute selectors.

**Consequences**:

- ✅ CSS handles transitions smoothly
- ✅ No React re-render on preference change
- ✅ Hydration-safe (attributes present on first render)

### ADR-003: Why sessionStorage for Scroll Memory?

**Context**: Need to persist scroll position per page.

**Decision**: Use sessionStorage (per-session) instead of localStorage
(permanent).

**Consequences**:

- ✅ Fresh start each browser session
- ✅ No stale data accumulation
- ✅ Smaller storage footprint

---

## Conclusion

The Luxury UX system is well-designed with appropriate mitigations for
identified risks. No critical issues found.

**Recommended Priority**:

1. 🟡 Add CI enforcement for Zustand RSC imports (Trap 2)
2. 🟡 Set browser support review reminder (Trap 1)
3. 🟢 Search for AxisStack old gap usage (Trap 4)

**Next Audit**: Q2 2026

---

**Audit Completed By**: AI Assistant **Audit Date**: 2026-01-13 **Document
Version**: 1.0.0
