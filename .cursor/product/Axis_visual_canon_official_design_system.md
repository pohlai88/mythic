# Axis Visual Canon

**Status:** Ratified\
**Version:** 1.0.0\
**Applies To:** Axis, Quorum360, Naxus Cobalt\
**Derived From:** NexusCanon 3.1.0

---

## 1. Purpose

The Axis Visual Canon defines the _non-negotiable perceptual laws_ governing how Axis is seen, felt,
and trusted by humans.

This is not a branding guide. This is not UI polish.

It is a **jurisdictional surface specification**.

The goal is singular:

> **To ensure every interaction communicates authority, restraint, and human dignity.**

---

## 2. Foundational Theory

### 2.1 Jurisdiction, Not Product

Axis is not a product that invites engagement. Axis is a system that _permits action_.

Therefore:

- The interface waits.
- The interface resists.
- The interface remembers.

Visual design is a **governance tool**, not decoration.

---

### 2.2 Material Truth (Anti-Plastic Doctrine)

Plastic surfaces feel cheap because they:

- Reflect light uniformly
- Carry no memory
- Do not resist interaction

Axis surfaces behave like material:

- Wood (grain)
- Stone (weight)
- Parchment (absorption)

> **If a surface does not age, it does not deserve authority.**

---

### 2.3 Light as Language

Humans perceive meaning through _change in light over time_, not static color.

Axis therefore uses:

- Conditional illumination
- Slow transitions
- Earned contrast

Light indicates:

- Awareness (hover)
- Intent (press)
- Commitment (seal)

---

## 3. Typography Doctrine

### 3.1 Editorial Authority

Headings must feel written, not rendered.

- Serif only
- High contrast strokes
- Generous spacing

Recommended:

- Playfair Display
- Cormorant Garamond

```css
font-family: "Cormorant Garamond", serif;
```

---

### 3.2 Forensic Data

All numeric or immutable data must be monospaced.

Purpose:

- Eliminate ambiguity
- Signal permanence

Recommended:

- JetBrains Mono

```css
font-family: "JetBrains Mono", monospace;
```

---

### 3.3 Spoken White (Anti-Pure White Rule)

Pure white (#FFFFFF) is forbidden.

Text must use a _living neutral spectrum_:

- Parchment (primary)
- Ash (secondary)
- Gold (emphasis)

This preserves emotional calm and reading endurance.

---

## 4. Color System (Material-Based)

Color in Axis represents **material states**, not UI states.

| Token     | Meaning             |
| --------- | ------------------- |
| Void      | Absence / Authority |
| Obsidian  | Surface / Weight    |
| Parchment | Knowledge           |
| Ash       | Commentary          |
| Gold      | Ratified Authority  |
| Ember     | Consequence         |

```js
// BEASTMODE REDESIGN v2.0 - Supreme Luxury Gold & Comfortable Reading White
colors: {
  void: '#0a0a0b',        // Deepest black - Authority
  obsidian: '#141416',    // Surface - Weight, Material
  parchment: '#f8f6f0',   // Comfortable reading white (not pure white)
  ash: '#d4cfc4',         // Commentary - Secondary text
  gold: '#c9a961',        // Supreme luxury gold - Ratified Authority
  ember: '#9d7a4a'        // Consequence - Warning, Action
}
```

---

## 5. Interaction Law

### 5.1 Card vs Button

**Cards** illuminate knowledge. **Buttons** ratify decisions.

They must never behave the same.

---

### 5.2 Cards (Illumination)

- Dim at rest
- Light descends on hover
- Borders warm before content

```html
<section class="border border-charcoal bg-obsidian transition duration-[1200ms] hover:border-gold">
```

---

### 5.3 Buttons (Selection)

- Quiet visibility at rest
- Resistance before activation
- Time-based confirmation

```html
<button
  class="border border-gold px-16 py-5 font-mono tracking-decree transition duration-[1618ms] hover:bg-gold"
>
  SIGN
</button>
```

> **A decision must be felt before it is executed.**

---

## 6. Motion Physics

Axis motion obeys **gravitational time**, not UI speed.

- No bounce
- No snap
- No elastic easing

Recommended durations:

- Hover: 700–1200ms
- Commitment: 1618ms

Motion communicates consequence.

---

## 7. Accessibility Position (Preview)

Accessibility is a **sovereign mode**, not a forced aesthetic.

- Default: Sovereign Vision
- AA Mode: Enhanced Clarity
- AAA Mode: Forensic Precision

Modes alter contrast and weight — not identity.

(Charter defined separately.)

---

## 8. Application Guidelines

### 8.1 Do

- Respect silence
- Use space as authority
- Let the system wait

### 8.2 Do Not

- Add decorative color
- Animate for delight
- Explain what competence assumes

---

## 9. Enforcement

Any UI that:

- Uses pure white
- Treats buttons like cards
- Optimizes speed over weight

Is **Non-Canonical**.

---

## 10. Closing Statement

Axis does not compete for attention. Axis earns trust.

> **Restraint is the highest form of power.**

This document is binding.
