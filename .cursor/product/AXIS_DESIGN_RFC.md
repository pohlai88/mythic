This is the correct move. AI Coding Assistants (Copilot, Cursor, etc.) and IDEs
do not understand "metaphor." They understand **constraints, tokens, and
logic.**

To stop the drift, we must translate your "Jurisdictional Surface" philosophy
into a technical **Request For Comments (RFC)** specification. This strips away
the poetry and leaves only the hard engineering rules.

Here is the translation of the **Axis Visual Canon** into a strictly enforceable
**Technical RFC**.

---

# RFC-AXIS-001: The Axis Design System Specification

**Status:** `DRAFT` (Pending Implementation) **Scope:** Global Styling,
Component Architecture, Animation Physics **Enforcement:** Strict (Linter/Code
Review)

## 1. Abstract

This RFC establishes the technical specifications for the "Axis" design
language. It replaces subjective descriptors (e.g., "feels like stone") with
objective constraints (e.g., "no drop shadows, 1px opacity borders"). The goal
is to eliminate visual drift by defining hard boundaries for layout, color, and
motion.

## 2. Design Tokens (Immutable)

### 2.1 Color Palette (Strict Hex)

The use of standard CSS named colors or arbitrary hex codes is **forbidden**.
Only the following tokens are permitted.

| Token Name    | Variable            | Hex Value | Usage Rule                                      |
| ------------- | ------------------- | --------- | ----------------------------------------------- |
| **Void**      | `--color-void`      | `#0a0a0b` | Global Backgrounds only. Never pure black.      |
| **Obsidian**  | `--color-obsidian`  | `#141416` | Surface elements (Cards, Sidebars).             |
| **Parchment** | `--color-parchment` | `#f8f6f0` | Primary Text. **NEVER use #FFFFFF.**            |
| **Ash**       | `--color-ash`       | `#d4cfc4` | Secondary/Muted text.                           |
| **Gold**      | `--color-gold`      | `#c9a961` | Active states, Focus rings, "Ratified" actions. |
| **Ember**     | `--color-ember`     | `#9d7a4a` | Destructive actions, Warnings.                  |

**Lint Rule:** `grep` codebase for `#FFFFFF` or `white` and throw error.

### 2.2 Typography Map

Fonts are functional tools, not aesthetic choices.

- **Canon (Headings):** `Cormorant Garamond` or `Playfair Display`.
- _Constraint:_ Must have `tracking-tight` (-0.02em).
- _Usage:_ H1, H2, H3 only.

- **Data (Meta):** `JetBrains Mono`.
- _Constraint:_ Uppercase preferred for labels. Small font size (12px/13px).
- _Usage:_ IDs, Timestamps, Status Tags, Navigation Links.

- **Prose (Body):** `Inter` or `Geist Sans`.
- _Usage:_ Long-form reading only.

### 2.3 Spacing & Layout

- **The Grid:** All layouts must respect a rigid vertical rhythm.
- **Padding:** "Aggressive Negative Space."
- _Minimum Container Padding:_ `px-6 py-8` (Mobile), `px-12 py-16` (Desktop).
- _Drift Prevention:_ If it feels empty, **do not** fill it. Leave it void.

---

## 3. Component Physics (The "No-Plastic" Doctrine)

### 3.1 Surface Definition (Cards & Containers)

"Plastic" UI uses shadows to create depth. Axis uses **Lighting and Borders**.

- **Border:** 1px Solid.
- **Color:** `rgba(255, 255, 255, 0.08)` (Dim) `var(--color-gold)` (Active).
- **Shadows:** **STRICTLY FORBIDDEN**.
- _Exception:_ Glow effects on active states only
  (`box-shadow: 0 0 20px -5px var(--color-gold)`).

- **Border Radius:**
- Standard: `2px` or `0px` (Sharp).
- Forbidden: `>4px` (No rounded corners).

### 3.2 Interaction States (Buttons)

A button is not a clickable shape; it is a mechanism.

- **Default State:** Transparent background, 1px border (`--color-ash/30`), Text
  (`--color-parchment`).
- **Hover State:** Background stays transparent, Border becomes `--color-gold`,
  Text becomes `--color-gold`.
- **Active/Ratified State:** Fill `--color-gold`, Text `--color-void`.
- **Transition:** `duration-300` minimum.

---

## 4. Motion Physics (Gravitational Time)

Standard "snappy" web animations (150ms - 300ms) are banned. Axis operates on
"Ritual Time."

- **Curve:** `cubic-bezier(0.2, 0.0, 0.0, 1.0)` (High friction, no bounce).
- **Durations:**
- _Micro-interaction (Hover):_ `700ms`
- _Macro-interaction (Page Load/Modal):_ `1200ms`
- _Ratification (Form Submit):_ `1618ms` (Golden Ratio scaling).

**Code Snippet (Tailwind Config):**

```javascript
theme: {
  extend: {
    transitionDuration: {
      'ritual': '700ms',
      'ratify': '1618ms',
    },
    transitionTimingFunction: {
      'weight': 'cubic-bezier(0.2, 0, 0, 1)',
    }
  }
}

```

---

## 5. Developer "Veto" List (Anti-Patterns)

The following patterns trigger an immediate "Non-Canonical" review status:

1. **The "Pop" Veto:** Using gradients as primary backgrounds.
2. **The "Float" Veto:** Using drop-shadows to lift elements.
3. **The "Friendly" Veto:** Using rounded-xl or circular buttons (pills).
4. **The "Rush" Veto:** Animations faster than 500ms.
5. **The "Bleach" Veto:** Any usage of `#FFFFFF`.

---

### How to use this with your IDE (Cursor/Copilot)

You should create a file named `.cursorrules` (or put this in your "Custom
Instructions") at the root of your project and paste the following block. This
effectively "programs" the AI to follow your doctrine.

```markdown
# AXIS SYSTEM INSTRUCTIONS

YOU ARE CODING FOR THE "AXIS" SYSTEM. Strictly adhere to the following visual
constraints. Do not deviate.

1.  **NO PURE WHITE:** Never use #FFFFFF or `bg-white`. Use `bg-[#0a0a0b]` for
    backgrounds and `text-[#f8f6f0]` for text.
2.  **NO SHADOWS:** Do not use `shadow-md`, `shadow-lg`, etc. Depth is defined
    by 1px borders (`border-white/10`).
3.  **NO ROUNDED CORNERS:** Max border-radius is `rounded-sm` or
    `rounded-[2px]`. Prefer `rounded-none`.
4.  **FONTS:**
    - Titles: Serif (Playfair/Cormorant).
    - UI/Data: Mono (JetBrains).
    - Body: Sans.
5.  **ANIMATION:** All transitions must be slow and deliberate. Use
    `duration-700` as the baseline.
6.  **TERMINOLOGY:**
    - Do not say "User", say "Operator".
    - Do not say "Settings", say "Config".
    - Do not say "Oops", say "Error".

If I ask for a button, give me a transparent button with a thin border that
lights up gold on hover.
```
