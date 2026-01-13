# UX Regression Checklist

**Purpose**: Detect UX decay before it reaches production. **Authority**: All
PRs touching UI must pass this checklist. **Version**: 1.0.0 **Status**:
RATIFIED

---

## Overview

UX regression is subtle. It doesn't break tests. It passes linting. But it
erodes the reader experience.

This checklist catches:

- Silent Killer degradation
- Reader respect violations
- Degradation path failures
- Freeze zone violations

---

## How to Use

### Manual Review

Before merging any UI-related PR:

1. Run through each section
2. Check every applicable box
3. Document any exceptions
4. Require sign-off for failures

### Automated Check

Run the validation script:

```bash
pnpm check:ux-regression
```

The script validates automatable checks. Manual review covers the rest.

---

## Section A: Silent Killers Integrity

These are the luxury features that define the reading experience.

### A1. Quiet Links

- [ ] Links within prose have subtle underlines (30% opacity)
- [ ] Link underlines darken on hover (100% opacity)
- [ ] Link color matches text (not accent color at rest)
- [ ] No underlines on navigation/button links

**Verification**:

```css
/* Expected in prose-axis */
text-decoration-color: hsl(var(--color-accent) / 0.3);
```

### A2. Breathing Rhythm

- [ ] Scroll-driven animation present in `@supports` block
- [ ] Animation applies to `.prose-axis > *` elements
- [ ] Margin interpolates from 1.5rem to 2.25rem
- [ ] `prefers-reduced-motion` guard is present

**Verification**:

```css
/* Expected in globals.css */
@supports (animation-timeline: scroll()) { ... }
@media (prefers-reduced-motion: reduce) { animation: none !important; }
```

### A3. Authority Pause

- [ ] H1 has increased bottom margin (clamp 2.5rem-4rem)
- [ ] First element after H1 has intentional top padding
- [ ] H2 has section-level pause (clamp 3rem-4.5rem)
- [ ] H3 has subsection pause (clamp 2rem-3rem)

**Verification**:

```css
/* Expected in globals.css */
.prose-axis > h1:first-child {
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}
```

### A4. Hanging Punctuation

- [ ] Blockquotes have hanging quote mark
- [ ] Quote mark is positioned in left margin
- [ ] Lists have `list-style-position: outside`
- [ ] Bullet markers align in margin

**Verification**: Visual inspection of blockquotes and lists.

### A5. White-Glove Clipboard

- [ ] Code blocks have copy button
- [ ] Copy strips terminal prompts (`$`, `%`, `>`)
- [ ] Copy strips line numbers
- [ ] Feedback is subtle (text change, not toast)

**Verification**: Copy code block content and paste into text editor.

### A6. Scroll Memory

- [ ] Scroll position saved to sessionStorage on scroll
- [ ] Content hash validates before restore
- [ ] Restore scrolls to last-read heading
- [ ] Hash mismatch clears stale data

**Verification**: Navigate away and back, verify position restoration.

---

## Section B: Reader Respect

These protect the reader's focus and autonomy.

### B1. No New Interruptions

- [ ] No new modals added
- [ ] No new interstitials added
- [ ] No new overlays added
- [ ] No new required interactions before content

### B2. No New Notifications

- [ ] No toast notifications added
- [ ] No banner notifications added
- [ ] No sound effects added
- [ ] No browser notifications requested

### B3. Motion Respect

- [ ] All new animations respect `prefers-reduced-motion`
- [ ] No animation duration < 500ms (Rush Veto)
- [ ] No auto-playing animations
- [ ] No animations on page load

### B4. Reader Control

- [ ] No "scroll to top" buttons added
- [ ] No infinite scroll implemented
- [ ] No content lazy-loading that hides scroll position
- [ ] No sticky elements that reduce viewport

### B5. No Tracking Additions

- [ ] No new analytics pixels
- [ ] No new third-party scripts
- [ ] No new cookies set
- [ ] No localStorage used for tracking

---

## Section C: Degradation Path

These ensure the system works for everyone.

### C1. JavaScript Disabled

- [ ] All content is readable with JS disabled
- [ ] Layout is stable without JS
- [ ] Navigation works without JS
- [ ] No "enable JavaScript" messages

**Verification**: Disable JS in browser, navigate site.

### C2. CSS Animation Disabled

- [ ] Layout is stable without CSS animations
- [ ] Content is not dependent on animation timing
- [ ] No content hidden until animation completes
- [ ] Static fallbacks exist for animated content

**Verification**: Add `* { animation: none !important; }` to test.

### C3. Reduced Motion

- [ ] `prefers-reduced-motion` is checked for all animations
- [ ] Alternative static presentation provided
- [ ] No motion is forced on users
- [ ] Scroll-driven animations disabled

**Verification**: Enable reduced motion in OS, navigate site.

### C4. Browser Compatibility

- [ ] Features use `@supports` guards where needed
- [ ] Fallbacks exist for unsupported features
- [ ] No console errors in Safari
- [ ] No console errors in Firefox

### C5. No Flash of Unstyled Content

- [ ] Critical CSS loads before content
- [ ] No layout shift on hydration
- [ ] No theme flash (dark/light)
- [ ] No font flash (FOIT/FOUT handled)

---

## Section D: Freeze Zone Compliance

These protect design law.

### D1. Frozen Files

- [ ] No modifications to `axis-base.css` without ADR
- [ ] No modifications to `use-reader-prefs.ts` without ADR
- [ ] No modifications to `use-scroll-memory.ts` without ADR
- [ ] No modifications to `axis-theme.css` without ADR

### D2. Frozen Patterns

- [ ] `prose-axis` utility unchanged
- [ ] `card-axis` utility unchanged
- [ ] `btn-axis` utility unchanged
- [ ] `h1-apex` utility unchanged

### D3. No New Escape Hatches

- [ ] No `className` props added to Shells
- [ ] No `style` props added to Shells
- [ ] No `!important` overrides added
- [ ] No inline styles in components

### D4. No Refuse List Violations

- [ ] No features from Refuse List implemented
- [ ] No patterns resembling refused features
- [ ] No "temporary" implementations of refused features

---

## Section E: Component Contracts

These ensure architectural integrity.

### E1. Shell Boundaries

- [ ] Shells do not contain business logic
- [ ] Shells do not fetch data
- [ ] Shells do not import Blocks directly (only children)
- [ ] PageShell width props unchanged

### E2. Block Contracts

- [ ] Blocks do not access Zustand stores directly
- [ ] Blocks receive all data via props
- [ ] Blocks do not define new CSS utilities
- [ ] AxisStack uses semantic gap values

### E3. Store Contracts

- [ ] Stores are only imported in client components
- [ ] Stores do not affect content structure
- [ ] Stores do not store server state
- [ ] Reader preferences remain advisory-only

---

## Automated Checks

The `check-ux-regression.ts` script validates:

| Check                             | Automated |
| --------------------------------- | --------- |
| Frozen file modifications         | Yes       |
| Refuse List patterns              | Yes       |
| `prefers-reduced-motion` presence | Yes       |
| Escape hatch detection            | Yes       |
| Store import locations            | Yes       |
| Animation duration violations     | Yes       |
| Silence Budget calculation        | Yes       |

Manual review required for: | Check | Manual | |-------|--------| | Visual
appearance | Yes | | Interaction feel | Yes | | Reading flow | Yes | |
Degradation experience | Yes |

---

## Failure Handling

### Critical Failures (Block Merge)

- Frozen file modification without ADR
- Refuse List violation
- Missing reduced-motion guard
- New escape hatch

### Warning Failures (Require Justification)

- Silence Budget impact > 10 units
- New interactive control
- New animation
- New preference option

### Informational (Review Only)

- CSS changes outside frozen zones
- New utility functions
- Refactoring changes

---

## Sign-off

Before merge, confirm:

```markdown
## UX Regression Sign-off

- [ ] Section A: Silent Killers Integrity - PASSED
- [ ] Section B: Reader Respect - PASSED
- [ ] Section C: Degradation Path - PASSED
- [ ] Section D: Freeze Zone Compliance - PASSED
- [ ] Section E: Component Contracts - PASSED

Reviewer: ******\_\_\_****** Date: ******\_\_\_******
```

---

## Version History

| Version | Date       | Change               |
| ------- | ---------- | -------------------- |
| 1.0.0   | 2026-01-13 | Initial ratification |

---

**Status**: RATIFIED **Authority**: Invisible Governance System **Last
Updated**: 2026-01-13
