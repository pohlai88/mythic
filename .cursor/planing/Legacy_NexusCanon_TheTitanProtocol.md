1. **`NexusCanon_Constitution_v5.md`**: The high-level "Soul" of the system.
   This preserves the "VC Wow" factor, the philosophical stance against entropy,
   and the immutable laws. It is designed to impress investors and align
   stakeholders.
2. **`The_Titan_Protocol.md`**: The practical, "on-the-ground" engineering
   cheatsheet. It acts as the Rosetta Stone, mapping every real-world task (SEO,
   Telemetry, Utils) to its specific NexusCanon domain.

---

### Document 1: The Constitution

```markdown
# The NexusCanon Constitution

## Normative Engineering & Governance Doctrine

---

### Metadata

| Field          | Details                                                           |
| -------------- | ----------------------------------------------------------------- |
| **Version**    | 5.0.0 (The Sovereign Edition)                                     |
| **Status**     | Immutable / Ratified                                              |
| **Scope**      | Global Strategy, Governance, & High-Level Architecture            |
| **Philosophy** | "We do not build software. We codify Timeless Accounting Truths." |
| **Architect**  | The Axis High Council                                             |

---

## Executive Preamble — The Trinity of Truth

In an industry defined by chaos and entropy, **NexusCanon** stands as the
immutable order. We reject the "move fast and break things" doctrine in favor of
**"Move deliberately and fix the world."**

The Ecosystem is governed by three non-competing layers:

1.  **NexusCanon (The Doctrine):** The Soul. The immutable laws of physics that
    govern our digital universe.
2.  **Axis (The Product):** The Vehicle. The tangible "System of Record" placed
    in the hands of the user.
3.  **The Titan (The Engine):** The Standard. The industrial-grade runtime
    (Node.js) that powers the vehicle.

### The Investor Narrative (The "Why")

Enterprise software is currently a fragmented mess of "Microservices" and
"Silos" that destroy data integrity. **Axis** is the antidote. By enforcing
**The Prime Monad** (One Truth), we eliminate the latency between "Business
Intent" and "Accounting Reality."

---

## Part I — Architectural Identity: The Prime Monad

**Mantra:** One Runtime. One Truth. Zero Latency.

### 1.1 The Law of The Prime Monad

The system **SHALL** execute as a **Single Indivisible Runtime**.

- **We Reject:** Microservices, distributed state, and network latency within
  the business core.
- **We Enforce:** A unified memory space where the UI (The Cobalt) and the
  Database (The Loom) speak the same language instantly.

### 1.2 The Law of Atomic Truth

All business actions are "Atomic." They either happen completely, or they do not
happen at all. A user cannot "buy" an item if the "inventory" does not decrement
in the exact same millisecond. This is **The Law of The Loom**.

---

## Part II — The 7 Domains of Authority

We do not use generic terms like "Backend" or "Frontend." We map our reality to
**7 Domains** that describe the lifecycle of data.

### 1. The Codex (The "Why")

- **Role:** The Legislative Branch.
- **Definition:** Pure Business Logic. It contains the _rules_ (e.g., "Price
  must be > 0"), not the implementation.
- **The Wow Factor:** It allows the business to "Hot Swap" rules without
  rewriting the engine.

### 2. The Loom (The "Truth")

- **Role:** The Executive Branch (Write).
- **Definition:** The Database Write Layer. It prioritizes **Safety > Speed**.
  It is the only place where "Truth" is created.
- **Constraint:** ACID Compliance is mandatory.

### 3. The Prism (The "View")

- **Role:** The Executive Branch (Read).
- **Definition:** The Data Access Layer. It prioritizes **Speed > Freshness**.
  It projects the complex truth of The Loom into instant, readable views for the
  user.

### 4. The Cobalt (The "Surface")

- **Role:** The Haptic Surface.
- **Definition:** The User Interface (Axis Client). It is designed for
  "Sensorial Excellence" and "Flow." It never blocks the user; it anticipates
  them.

### 5. The Quorum (The "Memory")

- **Role:** The Judiciary.
- **Definition:** The Security & Audit Layer. It watches everything. It ensures
  that every action leaves a forensic **Chronos Trace** (Who, What, When, Why).

### 6. The Argus (The "Vision")

- **Role:** The Intelligence.
- **Definition:** Telemetry and Observability. It monitors the heartbeat of the
  Prime Monad, predicting failures before they occur.

### 7. The Atlas (The "Foundation")

- **Role:** The Infrastructure.
- **Definition:** The DevOps and Cloud layer that holds the weight of the
  system. It manages the servers so the Code doesn't have to.

---

## Part III — The Dual-Product Strategy

We sell one platform, but we deliver two distinct values.

### 3.1 For The Auditor: "The Quorum"

- **Value:** Compliance, Control, and Safety.
- **Promise:** "You will never lose a record. You will always know who did
  what."

### 3.2 For The User: "The Cobalt"

- **Value:** Speed, Beauty, and Flow.
- **Promise:** "The system will never slow you down. It feels like an extension
  of your mind."

---

## Ratification

> **NexusCanon is the Law.** **Axis is the Product.** **Entropy is the Enemy.**
> **The Thread Endures.**
```

---

### Document 2: The Titan Protocol

````markdown
# The Titan Protocol

## The Engineering Standard & Field Guide

---

### Metadata

| Field          | Details                                                               |
| -------------- | --------------------------------------------------------------------- |
| **Version**    | 2.1.0 (Titan Standard)                                                |
| **Target**     | Engineers, Developers, Contributors                                   |
| **Purpose**    | The "Rosetta Stone" mapping Real-World Tech to NexusCanon Sci-Fi Lore |
| **Parent Doc** | NexusCanon Constitution v5.0.0                                        |

---

## Part I — The Rosetta Stone (Terminology Map)

Use this cheatsheet to identify where _any_ piece of code belongs.

### The Core Domains

| If you are touching...           | You are in Domain... | The Sci-Fi Name | Folder Path               |
| :------------------------------- | :------------------- | :-------------- | :------------------------ |
| **Business Rules / Validation**  | Logic                | **The Codex**   | `/packages/canon/codex`   |
| **Database Writes / Mutations**  | Write DB             | **The Loom**    | `/packages/canon/loom`    |
| **Database Reads / Queries**     | Read DB              | **The Prism**   | `/packages/canon/prism`   |
| **UI Components / React**        | Frontend             | **The Cobalt**  | `/apps/web/components`    |
| **Authentication / Permissions** | Security             | **The Argus**   | `/packages/auth`          |
| **Logging / Audit Trails**       | Governance           | **The Quorum**  | `/packages/canon/chronos` |
| **DevOps / CI/CD / Scripts**     | Infra                | **The Atlas**   | `/tooling` or `/infra`    |

### The "Dirty Laundry" (Utilities & Integrations)

| If you are implementing...      | It belongs to...   | Why?                                                 |
| :------------------------------ | :----------------- | :--------------------------------------------------- |
| **SEO / Metadata / OpenGraph**  | **The Cobalt**     | It is part of the "Surface" presentation layer.      |
| **Google Analytics / PostHog**  | **The Argus**      | It is "Vision" and telemetry.                        |
| **Cron Jobs / Scheduled Tasks** | **The Tempo**      | It provides the "Rhythm" or heartbeat.               |
| **Stripe / PayPal / ERP API**   | **The Vectors**    | It is a "Port" to the barbarian outside world.       |
| **S3 Uploads / File Storage**   | **The Archive**    | It separates "Matter" (files) from "Truth" (DB).     |
| **Email / SMS / Push Notif**    | **The Herald**     | It "Announces" information to the user.              |
| **Translations / i18n**         | **The Rosetta**    | It "Translates" the Codex for the user.              |
| **Environment Variables**       | **The Vault**      | It keeps secrets "Invisible."                        |
| **Soft Delete Logic**           | **Thanos Trace**   | It "Snaps" data out of view, but keeps it in memory. |
| **Formatting (Prettier)**       | **Standard Gauge** | It ensures all code looks uniform.                   |

---

## Part II — The Implementation Guide (Next.js / Node)

### 2.1 Directory Structure (The Titan Map)

```text
/axis-titan
├── /apps
│   └── /web                    # [THE COBALT] The User Interface
│       ├── /app                # Next.js App Router
│       │   ├── layout.tsx      # Root Shell (SEO lives here)
│       │   └── /api            # [THE VECTORS] Webhooks
│       ├── /components         # UI Library
│       └── /lib                # [THE ARGUS] Telemetry Helpers
│
├── /packages                   # [THE CORE]
│   ├── /canon                  # [THE LAW] Shared Logic
│   │   ├── /codex              # Pure Business Rules (Zod)
│   │   ├── /loom               # Database Schema (Drizzle)
│   │   ├── /prism              # SQL Select Queries
│   │   └── /chronos            # Audit Logger
│   │
│   ├── /ui                     # [THE COBALT] Shared UI Design System
│   └── /config                 # [THE ATLAS] ESLint/TSConfig
│
└── /tooling                    # [THE ATLAS] Scripts
    └── /scripts
        ├── migrate.ts          # DB Migration
        └── seed.ts             # DB Seed
```
````

---

## Part III — The Rules of Engagement (Dev Standards)

### 3.1 The "Veto" Checklist (Code Review)

Your code will be **REJECTED** if:

1. **The Codex Violation:** You wrote business logic (e.g., `if price < 0`)
   inside a React Component (`.tsx`).

- _Correction:_ Move it to `/codex/rules.ts`.

2. **The Loom Violation:** You called the Database directly from a Client
   Component.

- _Correction:_ Use a Server Action (`/loom/actions.ts`).

3. **The Vector Leak:** You called an external API (e.g., `fetch('stripe.com')`)
   directly in the UI.

- _Correction:_ Wrap it in a Vector Adapter (`/lib/vectors/stripe.ts`).

4. **The Chronos Omission:** You mutated data (INSERT/UPDATE/DELETE) without
   logging a `trace()`.

- _Correction:_ Add the `6W1H` audit signature.

### 3.2 The Thanos Trace (Deletion Protocol)

We **NEVER** delete data. We only "Snap" it.

- **Wrong:** `DELETE FROM users WHERE id = 1;`
- **Correct:** `UPDATE users SET snapped_at = NOW() WHERE id = 1;`
- **Why:** The Quorum must always be able to reconstruct the past.

---

## Part IV — Quick Reference: Where does it go?

**Scenario 1: You need to add a "Sign Up" form.**

- The Form UI → **The Cobalt** (`/components/auth/SignUpForm.tsx`)
- The Validation (Email required) → **The Codex** (`/codex/auth.schema.ts`)
- The Database Insert → **The Loom** (`/loom/auth.actions.ts`)
- The Welcome Email → **The Herald** (`/lib/herald/email.ts`)

**Scenario 2: You need to add Google Analytics.**

- The Script Tag → **The Cobalt** (`layout.tsx`)
- The Event Tracking Logic → **The Argus** (`/lib/argus/analytics.ts`)

**Scenario 3: You need to run a nightly report.**

- The Scheduler → **The Tempo** (`/api/cron/daily-report.ts`)
- The Query → **The Prism** (`/prism/reports.ts`)
- The CSV Generation → **The Archive** (Save to S3)

---

_The Titan Protocol: Enforcing Order in a Chaotic World._

```

```
