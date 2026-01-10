# Design Mode Specification: "The Apex"

**Version:** 2.1 (Beastmode Integrated)
**Archetype:** The Forensic Dashboard
**Base DNA:** `prototype7.html`

---

## 1. The Apex Palette (Beastmode Implementation)

This mode enforces the "Rough/Dark" theme with "Supreme Gold" highlights.

| Token | Hex | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Void** | `#0a0a0b` | `bg-void` | The infinite background. Absolves all noise. |
| **Obsidian** | `#141416` | `bg-obsidian` | The tangible surface (Cards, Sidebars). |
| **Gold** | `#c9a961` | `text-gold` / `border-gold` | **The Signal.** Status, Hover, Active Borders. |
| **Parchment** | `#f8f6f0` | `text-parchment` | **The Signal Text.** Primary headings and body. |
| **Ash** | `#9ca3af` | `text-ash` | **The Noise Floor.** Secondary text, meta-data. |

---

## 2. Typography Physics (The Prototype DNA)

The Apex Mode rejects serif headlines (Cormorant) in favor of **Aerodynamic Sans** (Inter) to maximize scan speed, while keeping **Data Mechanical** (JetBrains).

### A. The Aerodynamic Heading (Inter)
* **Role:** Structure & Narrative
* **Settings:**
    * **Weight:** Light (300) or Regular (400). Never Bold.
    * **Tracking:** Tight (`-0.03em`). This creates "tension" and holds the line together.
    * **Case:** Sentence case.
* **Philosophy:** "The hull of the ship." Smooth, resisting no air.

### B. The Mechanical Data (JetBrains Mono)
* **Role:** Evidence & Controls
* **Settings:**
    * **Weight:** Regular (400).
    * **Tracking:** Wide (`0.05em` to `0.1em`).
    * **Case:** Uppercase (for labels/status).
* **Philosophy:** "The exposed wiring." Precise, forensic, undecorated.

---

## 3. Interaction Physics (The "Creature" Feel)

The Apex moves differently than web pages. It moves like heavy machinery.

### The "Gravity" Curve
Standard easing (`ease-in-out`) is banned. Use **Gravity Easing**.
* **CSS:** `cubic-bezier(0.4, 0, 0.2, 1)`
* **Feeling:** Starts fast (intent), lands soft (mass).

### The "Ignition" Hover
Buttons and Borders do not flicker. They heat up.
* **Duration:** `800ms` for borders, `300ms` for text.
* **Effect:** When hovering a card, the border color shifts from `Void` to `Gold` slowly, implying the user's attention is "charging" the element.

---

## 4. Layout Construct: "The Divergence"

As seen in the prototype, The Apex uses a layout technique called **"Divergence."**

* **The Anchor:** A massive, thin headline (Inter 300) anchors the top left.
* **The Fade:** The headline uses a gradient mask (`text-transparent bg-clip-text`) to fade the bottom half of the text. This implies the text is "emerging from the void."
* **The Status Line:** A JetBrains Mono status indicator (`SYSTEM ONLINE`) floats above, tethered by a thin Gold line.

**Code Reference (Tailwind):**
```html
<div class="flex items-center gap-3 text-[10px] tracking-[0.2em] text-gold uppercase opacity-90 font-mono">
  <div class="w-6 h-[1px] bg-gold opacity-50"></div>
  <span>System Online</span>
</div>

<h1 class="font-sans font-light text-6xl tracking-tighter text-parchment mt-6">
  The Apex
  <span class="block bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
    Governance.
  </span>
</h1>
```
