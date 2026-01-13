# Luxury UX Charter

**Purpose**: This document explains why StratonHub's documentation system feels
different. It is required reading for all developers contributing to this
codebase.

**Version**: 1.0.0 **Status**: RATIFIED **Authority**: This charter is design
law.

---

## The Luxury Principle

> "Luxury is not about adding more. It's about removing everything that
> interferes with the experience."

Most documentation systems optimize for **density** — fitting as much content as
possible on screen. This system optimizes for **comprehension** — ensuring
readers understand deeply, not just quickly.

The difference is felt, not measured.

---

## The Four Laws of Luxury UX

### Law 1: Silent Over Clever

**Every luxury feature must be invisible.**

| ❌ Clever (Avoid)         | ✅ Silent (Prefer)                       |
| ------------------------- | ---------------------------------------- |
| Animated loading spinners | Skeleton states that match content shape |
| Toast notifications       | Inline confirmation near the action      |
| Floating action buttons   | Contextual actions where needed          |
| "Scroll to top" buttons   | Natural navigation flow                  |

**Test**: If a user notices your feature, it's too loud.

### Law 2: Degrade, Never Break

**Every enhancement must work without JavaScript, without modern CSS, without
anything.**

```
Feature Degradation Ladder:
┌─────────────────────────────────────────┐
│ Full Experience (Modern browser + JS)   │ ← Best case
├─────────────────────────────────────────┤
│ Reduced Motion (CSS fallback)           │ ← A11y users
├─────────────────────────────────────────┤
│ No Scroll Animations (Old browser)      │ ← Graceful
├─────────────────────────────────────────┤
│ Static Content (No JS)                  │ ← Still works
└─────────────────────────────────────────┘
```

**Test**: Disable JavaScript. Is the content still readable?

### Law 3: Respect the Reader's Time

**Readers don't visit documentation for fun. They have a problem to solve.**

This means:

- **No interstitials** — Content loads immediately
- **No onboarding modals** — The interface explains itself
- **No gamification** — Progress bars, achievements, streaks are noise
- **No social proof** — "10,000 developers trust us" is irrelevant

**Test**: Can a reader find their answer in under 30 seconds?

### Law 4: Presentation, Never Structure

**User preferences affect how content looks, never what content exists.**

| ✅ Allowed (Presentation)   | ❌ Forbidden (Structure)         |
| --------------------------- | -------------------------------- |
| Font size adjustment        | Different content per preference |
| Line height for readability | Conditional sections             |
| Width modes (prose/wide)    | Hidden features based on prefs   |
| Code wrap toggle            | Abbreviated content              |

**Test**: If you remove all preferences, does the document still make sense?

---

## The Silent Killers

These are the invisible features that make readers feel respected.

### 1. Hanging Punctuation

Quotes and bullets "hang" in the margin for optical alignment.

```
Without:                      With:
┌──────────────────┐          ┌──────────────────┐
│ "This is a       │          │"This is a        │
│ quotation that   │          │ quotation that   │
│ looks awkward."  │          │ looks natural."  │
└──────────────────┘          └──────────────────┘
```

Readers don't notice. But something feels "off" without it.

### 2. Quiet Links

Links don't shout. Underlines are faint (30% opacity) until hover.

```css
/* The luxury pattern */
text-decoration-color: hsl(var(--color-accent) / 0.3);
```

This respects the reading flow. Links are discoverable, not distracting.

### 3. Breathing Rhythm

As readers scroll deeper, paragraph spacing gradually increases.

```
Page top:     margin-bottom: 1.5rem
Page middle:  margin-bottom: 1.75rem
Page bottom:  margin-bottom: 2.25rem
```

Readers don't notice. But long documents feel less exhausting.

### 4. Intentional Pause After Authority

The space after an H1 is not empty — it's a moment of respect.

```
┌──────────────────────────────────────┐
│                                      │
│  THE TITLE                           │ ← Authority
│                                      │
│         ← Intentional void (4rem)    │
│                                      │
│  First paragraph begins here...      │ ← Content
│                                      │
└──────────────────────────────────────┘
```

This signals: "You have arrived. Take a breath."

### 5. White-Glove Clipboard

Code blocks copy clean. No `$` prompts, no line numbers.

```bash
$ npm install next          # User sees this
npm install next            # Clipboard receives this
```

Readers paste directly into their terminal. It just works.

### 6. Scroll Memory

When returning to a page, readers land on their last-read heading.

This is sessionStorage + content hash validation. If the content changes between
visits, the stored position is discarded (prevents jumping to wrong section).

---

## The Concierge Pattern

Luxury features are called "Concierge" features because:

1. **They anticipate needs** — Clipboard sanitization anticipates paste errors
2. **They work silently** — No confirmation dialogs, no feedback toasts
3. **They degrade gracefully** — sessionStorage unavailable? No problem.
4. **They never block** — Async operations never prevent interaction

---

## Component Architecture

### Shells Own Layout

```
PageShell     → Page-level container, width governance
DocShell      → Documentation pages, context-aware right rail
ContentShell  → Prose typography, Silent Killers
CenteredShell → Error/Status pages
```

### Blocks Own Content

```
AxisHero      → Page headers with status/title/subtitle
AxisStack     → Vertical rhythm (DRY spacing)
AxisCard      → Interactive content cards
CodeBlock     → White-glove clipboard
```

### Escape Hatches Are Closed

**No `className` props on Shells.** This is intentional.

```tsx
// ❌ FORBIDDEN
<PageShell className="my-custom-override">

// ✅ ALLOWED
<PageShell width="wide">
```

If you need a custom layout, create a new Shell. Don't escape.

---

## The Freeze Line

Certain features are now **design law** and must not change:

| Feature               | Status    | Reason                    |
| --------------------- | --------- | ------------------------- |
| Breathing Rhythm CSS  | 🔒 FROZEN | Zero runtime cost, proven |
| Quiet Links           | 🔒 FROZEN | Typography law            |
| Hanging Punctuation   | 🔒 FROZEN | Typography law            |
| White-Glove Clipboard | 🔒 FROZEN | UX contract               |
| Scroll Memory         | 🔒 FROZEN | UX contract               |
| Reader Prefs Schema   | 🔒 FROZEN | API contract              |

**To unfreeze**: Requires documented regression and stakeholder approval.

---

## Adding New Features

Before proposing a new UX feature, answer:

### The Luxury Checklist

1. **Is it silent?**
   - If users notice, it's too loud
   - If it requires explanation, it's too complex

2. **Does it degrade gracefully?**
   - No JavaScript? Still works
   - Reduced motion? Respects preference
   - Old browser? Falls back cleanly

3. **Can it be removed without breaking content?**
   - Features are additive
   - Content never depends on features

4. **Is it presentation-only?**
   - Preferences never affect structure
   - Content never conditionally renders

If any answer is "no" → **Reject the feature.**

---

## Terminology

| Term              | Meaning                                                         |
| ----------------- | --------------------------------------------------------------- |
| **Silent Killer** | Feature so subtle users don't notice, but would miss if removed |
| **Concierge**     | Anticipatory feature that saves users work                      |
| **Authority**     | Major heading (H1) that establishes page hierarchy              |
| **Pause**         | Intentional whitespace that signals importance                  |
| **Freeze**        | Feature locked as design law, cannot change                     |
| **Escape Hatch**  | Workaround that bypasses design system (forbidden)              |

---

## Summary

This documentation system is different because:

1. **We optimize for comprehension, not density**
2. **Every feature is silent until needed**
3. **Nothing breaks when features are unavailable**
4. **Preferences affect presentation, never structure**

The result: Readers feel respected. They don't know why. They just do.

---

**Status**: RATIFIED **Last Updated**: 2026-01-13 **Authority**: Luxury UX
Charter v1.0.0
