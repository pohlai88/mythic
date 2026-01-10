# The NexusCanon

## Normative Engineering & Governance Constitution

---

### Metadata

| Field          | Details                                                               |
| -------------- | --------------------------------------------------------------------- |
| **Version**    | 4.0.0 (Unified & Ratified)                                            |
| **Status**     | Immutable / Ratified                                                  |
| **Scope**      | Global Engineering, Operations, Audit, Product, & Commercial Strategy |
| **Supersedes** | LBOS, Digital Atelier, NexusCanon V1/V2/V3.0/V3.1                     |
| **Architect**  | The Axis High Council                                                 |

---

## Executive Preamble — The Trinity of Truth

To eliminate ambiguity and prevent semantic drift, this Constitution establishes a single, unified
frame of reference for all stakeholders. The system is governed by three non-competing layers:

1. **The Doctrine (NexusCanon):** The immutable architectural and governance laws.
2. **The Philosophy (Digital Atelier):** The soul of the system—software designed to preserve
   craftsmanship.
3. **The Product (Axis):** The execution vehicle delivered to the enterprise.

### The Mandate

We acknowledge that core business workflows are not features, but **Timeless Accounting Truths**.
The "3-Way Match" is a 1,000-year-old law. NexusCanon does not design these truths; it codifies them
into a System of Record.

---

## Part I — Architectural Identity: The Prime Monad

**Mantra:** One Runtime. One Truth. Zero Latency.

### 1.1 The Prime Monad

The system **SHALL** execute as a **Single Indivisible Runtime**. The distributed microservices
paradigm is explicitly rejected to prevent state fragmentation, network latency, and cognitive
overhead.

**The Law:** The application logic, database access, and UI rendering must exist within a unified
memory space (Monorepo) to guarantee Atomic Truth.

**The Exception:** Segregation is only permitted via **The Vectors** (External Adapters) or **The
Atlas** (Infrastructure shedding).

**Engineering Standards:**

| Acronym   | Principle              | Implementation Law                                      |
| --------- | ---------------------- | ------------------------------------------------------- |
| **KISS**  | Keep It Simple, Stupid | One runtime. No internal network calls.                 |
| **SOLID** | Single Responsibility  | Distinct Modules (VIP, Inventory) within the Monad.     |
| **DRY**   | Don't Repeat Yourself  | Shared "Types" package; Logic exists only in The Codex. |

### 1.2 Law of Atomic Truth

All business-critical actions spanning multiple domains SHALL execute as a single, unbreakable
transaction following ACID principles:

- **Atomicity:** All or nothing.
- **Consistency:** The database moves from one valid state to another valid state.
- **Isolation:** Transactions do not leak intermediate states.
- **Durability:** Committed data is permanent.

### 1.3 Amendment — Isomorphic Sovereignty (The Titan & The Olympian)

We recognize two valid manifestations of the Prime Monad. The Code Logic (**The Codex**) must be
written to be **Isomorphic**—capable of running on either runtime:

- **Manifestation A: The Titan (Node.js/Next.js)**
  - The Commercial Standard
  - Optimized for Ecosystem, Hiring, and Integration
  - Target: Enterprise deployment, standard hiring pools

- **Manifestation B: The Olympian (Deno)**
  - The Purity Standard
  - Optimized for Security, Zero-Config, and Scripting
  - Target: High-security modules, internal tooling, future-proofing

This ensures longevity without sacrificing present-day execution.

---

## Part II — The Domains of Authority (The Layering)

We reject generic terms like "Frontend" or "Backend." We recognize **7 Domains of Authority**.

| Domain            | Standard Term    | The NexusCanon Definition                                                                                                                             |
| ----------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. The Codex**  | Business Logic   | The Semantic Master. The "Living Schema" that separates the Why (Rules) from the How (Code). It manages "Proactive Aliasing" (e.g., Denim = #0000FF). |
| **2. The Loom**   | Write DB         | Safety > Speed. The domain of High Friction and ACID transactions. It weaves the "Atomic Truth."                                                      |
| **3. The Prism**  | Read DB          | Speed > Freshness. The domain of Zero Friction. It projects truth into Materialized Views (<100ms).                                                   |
| **4. The Cobalt** | Frontend / UI    | Sensorial Excellence. The Haptic Surface. It adheres to "Golden Ratio Timing" (1.618s) and "One-Handed Operation."                                    |
| **5. The Quorum** | Security / Audit | Forever Remember. The Governance Layer. It enforces the Chronos Trace (6W1H) on every mutation.                                                       |
| **6. The Argus**  | Observability    | Panoptical Vision. The Telemetry Layer (Phase 2). It monitors every heartbeat and predicts anomalies (The Oracle).                                    |
| **7. The Atlas**  | Infrastructure   | Immutable Foundation. The IaC layer that holds the weight of the Monad. It contains the "Circuit Breakers."                                           |

### 2.1 The Loom — Write Domain

The Loom is the domain of **High Friction** and **Accounting Truth**.

- **Function:** Validates intent, enforces accounting laws.
- **Constraint:** Write Latency $< 200ms$. Safety $>$ Speed.
- **Ownership:** Strict PostgreSQL schema partitioning.

### 2.2 The Prism — Read Domain

The Prism is the domain of **Zero Friction** and **Presentation**.

- **Function:** Projects truth into Materialized Views.
- **Constraint:** Read Latency $< 100ms$. Speed $>$ Freshness.

### 2.3 The Codex — Semantic Master

The Codex separates the **Why** from the **How**.

**The Mechanism of Extension:**

- **Dual-Metadata:** Distinguishes "Technical Type" (decimal) from "Business Concept" (Wholesale
  Price).
- **The Manifest:** A dynamic configuration (JSON/YAML) that maps Concepts to Columns.
- **Hot-Swappable Schema:** Business users can add fields via The Manifest. The system utilizes
  JSONB or Sparse Columns to adapt without code deployment.

---

## Part III — Operational Doctrine: CRUD-S-AP & Chronos

**Mantra:** Never Block. Always Inform. Forever Remember.

### 3.1 CRUD-S-AP

Standard CRUD is insufficient. We mandate **CRUD-S-AP**:

| Operation     | Definition        |
| ------------- | ----------------- |
| **Create**    | Intent            |
| **Read**      | Materialized      |
| **Update**    | Context-Aware     |
| **Delete**    | Soft/Audited      |
| **Search**    | Semantic/Vector   |
| **Audit**     | Immutable 6W1H    |
| **Proactive** | Anticipatory Risk |

### 3.2 The Chronos Trace

Every mutation must be signed by the **6W1H forensic signature**:

- **Who:** Actor
- **What:** Action
- **When:** Timestamp
- **Where:** Context
- **Why:** Intent
- **Which:** Alternatives
- **How:** Method

### 3.3 The "Never Block" Doctrine

**Mantra:** Compliance is a Variable.

- **Rule:** The system never blocks a business-critical action unless physically impossible.
- **Segregation of Duties (SoD):** Violations are permitted but flagged with a permanent Risk Marker
  in the Chronos Trace.

### 3.4 The Operational Mechanics (The Dirty Laundry)

To prevent entropy, we formally name the mechanical subsystems.

#### 3.4.1 The Vectors (Integration)

**Mantra:** Sanitize the Foreign.

External systems (Stripe, Legacy ERPs) are "Barbarians." They communicate through The Vector Ports.

**Law:** No external data touches The Loom until it passes through a Vector Adapter and is validated
against The Codex.

#### 3.4.2 The Tempo (Scheduling)

**Mantra:** The Heartbeat.

We do not use random "Cron Jobs." We use The Tempo.

**Law:** The Tempo is a rhythmic trigger (Heartbeat) that wakes the Prime Monad to perform
maintenance. It is defined in code, not in OS crontabs.

#### 3.4.3 The Vault (Secrets)

**Mantra:** Invisible Ink.

**Law:** Secrets (API Keys, Certs) are never committed to code. They are injected by The Atlas at
runtime into the process environment.

#### 3.4.4 The Archive (Storage)

**Mantra:** Reference vs. Matter.

**Law:** The Loom stores the Reference (URL/Pointer). The Archive (S3/Blob) stores the Matter
(Files/Images). Never store binary data in The Loom.

#### 3.4.5 The Rosetta (Internationalization)

**Mantra:** Content is Data.

**Law:** We do not hardcode text. We register Keys (BTN_SUBMIT) in The Codex. The Rosetta projects
the correct locale (EN/VN) via The Prism.

#### 3.4.6 The Herald (Notifications)

**Mantra:** Fire and Forget.

**Law:** The Monad generates the message intent. The Herald delivers it asynchronously (Email/SMS).

---

## Part IV — The Haptic Surface: Axis Flow

**Mantra:** Sensorial Excellence. One-Handed Precision.

### 4.1 The Physics of Luxury

- **Golden Ratio Timing:** Animations must adhere to natural physics ($1.618$s decay), giving
  "weight" to digital objects.
- **Partial Prerendering (PPR):** Content streams in; the frame never flickers.
- **Zero-Bundle HTML:** Use React Server Components (RSC) for instant paint.

### 4.2 The Thumb Zone

- **One-Handed Law:** Critical actions must be executable with one hand ("Heads-Up" operation).

---

## Part V — The Repository Guidelines

We define two valid repository structures. **Standard A** is the primary commercial vehicle.
**Standard B** is the reference implementation for purity.

### Standard A: The Titan (Next.js v16 + Turborepo)

**Target:** Commercial, Enterprise, Standard Hiring.

```
/axis-monorepo
├── /apps
│   └── /axis-web               # [THE COBALT] (Next.js App Router)
│       ├── /app                # Routes & Pages Only
│       │   ├── /api            # [THE VECTORS] Webhooks
│       │   ├── /login          # Feature Route
│       │   │   ├── page.tsx    # Server Component
│       │   │   └── layout.tsx  # Layout Persistence
│       │   └── globals.css     # Physics (Variables/Themes)
│       │
│       ├── /components         # [THE COBALT] UI Library
│       │   ├── /ui             # Atomic Haptic Components
│       │   └── /features       # Composite UI (Forms, Tables)
│       │
│       ├── /server             # [THE PRIME MONAD] Server-Only
│       │   ├── /actions        # [THE LOOM] Write/Mutations
│       │   ├── /data           # [THE PRISM] Read/Queries
│       │   └── /db             # [THE ATLAS] Persistence Config
│       │
│       └── /lib                # [THE ARGUS & CHRONOS]
│           ├── /audit          # [CHRONOS] Logging
│           ├── /infra          # [THE ATLAS] Adapters
│           └── utils.ts        # Generic Helpers
│
├── /packages                   # [THE IMMUTABLE CORE]
│   ├── /canon                  # [THE CODEX] (Pure TS Business Logic)
│   │   ├── /rules              # "Price > 0"
│   │   ├── /types              # Shared Types
│   │   ├── /i18n               # [THE ROSETTA] Locales
│   │   └── /manifest           # "Living Schema" definitions
│   │
│   ├── /loom                   # [THE LOOM] (Database & Mutations)
│   │   ├── /schema             # Drizzle/Prisma Schema
│   │   └── /actions            # Server Actions (Zod Protected)
│   │
│   ├── /prism                  # [THE PRISM] (Data Access Layer)
│   │   └── /dto                # Optimized Read Objects
│   │
│   └── /infra                  # [THE ATLAS]
│       ├── /audit              # [CHRONOS] Tracing Lib
│       └── /adapters           # [VECTORS] Stripe/Resend/S3
│
├── middleware.ts               # [THE ARGUS] (Auth Check)
├── instrumentation.ts          # [THE ARGUS] (Telemetry)
├── biome.json                  # [THE LAW] Strict Formatting
└── turbo.json                  # [THE PIPELINE] Build System
```

### Standard B: The Olympian (Deno + Fresh)

**Target:** Internal Scripting, High-Security Modules, Future Proofing.

```
/axis-monad
├── deno.json                   # [THE ATLAS] Config & Security Permissions
├── main.ts                     # [PRIME MONAD] Entry Point
│
├── /routes                     # [THE COBALT] URL Map
│   ├── index.tsx               # Zero-Bundle Island
│   └── /api                    # [THE VECTORS]
│       └── _middleware.ts      # [THE ARGUS] Security Watcher
│
├── /islands                    # [THE COBALT] Client-Side Haptics
│   └── Counter.tsx
│
├── /canon                      # [THE LAW]
│   ├── /codex                  # [THE CODEX] Rules (Isomorphic)
│   ├── /loom                   # [THE LOOM] KV / Postgres Logic
│   └── /chronos                # [CHRONOS] Audit Tracing
│
├── /static                     # [THE ARCHIVE] Public Assets
└── /vectors                    # [THE VECTORS]
    └── stripe.ts               # External Adapter
```

---

## Part VI — The Dual-Product Strategy

**Mantra:** One Monad. Two Faces.

We distinguish the Governance Layer from the Execution Layer to serve distinct market needs.

### 6.1 The Quorum

- **Archetype:** The White Label.
- **Target:** The Auditor / CFO / Compliance Officer.
- **Focus:** The Chronos Trace.
- **Value:** Immutable proof of "Timeless Accounting Truths."
- **Behavior:** Strict, transparent, forensic.

### 6.2 The Cobalt

- **Archetype:** The Blue Label.
- **Target:** The Artisan / Store Manager / Creative.
- **Focus:** The Haptic Surface.
- **Value:** Speed, elegance, and "Never Block" utility.
- **Behavior:** Fluid, proactive, invisible.

---

## Part VII — Anti-Complexity Governance

**Mantra:** Reject Entropy. Verify Value.

### The Veto Checklist (The 5 Questions)

1. **Utility:** Does this solve a REAL business problem TODAY?
2. **Simplicity:** Can a junior developer debug it at 3 AM?
3. **Proportionality:** Does it add more infrastructure than business value?
4. **Resilience:** Will it survive if the DevOps lead leaves?
5. **Velocity:** Does it make the system FASTER for the end user?

**Decision Rule:** Any "No" = Automatic Veto.

### Drift Enforcement (The Code of Veto)

Any Pull Request (PR) **SHALL be rejected immediately** if it violates the following:

1. **The Monad Breach:** Introducing a new "Service" or container without Council approval.

2. **The Codex Bypass:** Writing business logic inside a UI Component (`.tsx`).

3. **The Loom Violation:** Performing a Database Mutation (INSERT/UPDATE) inside a generic utility
   or UI file.

4. **The Chronos Omission:** A mutation that lacks a `trace()` call (6W1H signature).

5. **The Vector Leak:** Calling an external API (`fetch`) directly without wrapping it in a Vector
   Adapter.

---

## Part VIII — Engineering Quick Reference

**Status:** Operational Reference **Mantra:** A Place for Everything, and Everything in its Place.

### 8.1 The Core Logic (Where Code Lives)

| Standard Concept     | NexusCanon Domain     | The Rule (The "Why")                                                                           | Directory / Location                             |
| -------------------- | --------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Backend / API**    | **The Prime Monad**   | "One Runtime." No microservices. Logic executes in a single process to guarantee zero latency. | `/axis/core`                                     |
| **Business Rules**   | **The Codex**         | "Why > How." If it validates, defines, or sets a limit, it is a Rule, not code.                | `/canon/codex/rules` or `/core/rules`            |
| **Database (Write)** | **The Loom**          | "Safety > Speed." For ACID transactions and "Accounting Truth."                                | `/server/actions` (Next) or `/canon/loom` (Deno) |
| **Database (Read)**  | **The Prism**         | "Speed > Freshness." For cached views and UI data. Never write here.                           | `/server/data` (Next) or `/canon/prism` (Deno)   |
| **Frontend / UI**    | **The Cobalt**        | "Sensorial Excellence." Haptic components and user flow.                                       | `/components/ui`                                 |
| **Audit Log**        | **The Chronos Trace** | "Forever Remember." Every mutation MUST have a trace.                                          | `/lib/audit`                                     |

### 8.2 The "Dirty Laundry" (Messy Reality)

| The "Messy" Task           | NexusCanon Domain       | Implementation Law                                             | Where to put it?                 |
| -------------------------- | ----------------------- | -------------------------------------------------------------- | -------------------------------- |
| **Translations (i18n)**    | **The Rosetta Layer**   | "Content is Data." Register keys in The Codex.                 | `/core/i18n` or `/canon/rosetta` |
| **Cron Jobs / Scheduling** | **The Tempo**           | "The Heartbeat." No separate worker server.                    | `/core/tempo`                    |
| **File Uploads**           | **The Archive**         | "Reference vs. Matter." Loom stores URL, Archive stores file.  | `/lib/infra/archive`             |
| **API Keys / Secrets**     | **The Vault**           | "Invisible Ink." Secrets injected at runtime.                  | `/infra/vault` (GitIgnored)      |
| **3rd Party Webhooks**     | **The Vector Ports**    | "Sanitize the Foreign." External data enters via Vector first. | `/lib/adapters`                  |
| **Sending Emails / SMS**   | **The Herald**          | "Fire and Forget." Async message delivery.                     | `/lib/adapters/herald`           |
| **Feature Flags**          | **The Living Manifest** | "No Code Deploys." Toggles live in Schema.                     | `/core/manifest`                 |

### 8.3 Emergency Protocols (When Things Break)

| Scenario               | Protocol                | Action                                                                        |
| ---------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| **Database Overload**  | **The Circuit Breaker** | The Atlas sheds load. Drops non-critical reads (Prism) to save writes (Loom). |
| **User Network Drops** | **Optimistic Deferral** | The Cobalt continues. Queues actions locally, syncs when connection returns.  |
| **Logic Drift**        | **The Veto**            | CI/CD automatically rejects PRs that add internal HTTP calls or bypass Codex. |

---

## Part IX — Canonical Appendices

### Appendix A: Glossary of Terms

- **NexusCanon:** The Law.
- **Axis:** The Product.
- **Prime Monad:** The Single Runtime (Node.js/Deno).
- **Loom:** The Write DB (3NF).
- **Prism:** The Read DB (Materialized).
- **Codex:** The Business Rules Engine.
- **The Quorum:** The Governance Product (Audit).
- **The Cobalt:** The Flow Product (UX).
- **The Argus:** Observability & Telemetry.
- **The Atlas:** Infrastructure & IaC.
- **The Vectors:** External Integration Adapters.
- **The Chronos:** Audit Trail (6W1H).
- **The Tempo:** Scheduled Tasks Engine.
- **The Vault:** Secrets Management.
- **The Archive:** File Storage.
- **The Rosetta:** Internationalization Layer.
- **The Herald:** Notification System.

### Appendix B: The Narrative Arc

Modern enterprise systems break under complexity. They fragment truth and block operations. We build
the Digital Atelier to restore craftsmanship through Atomic Truth and Sensorial Design.

### Appendix C: VC / PE Narrative

- **The Problem:** ERPs are bureaucratic anchors.
- **The Moat:** NexusCanon (Architecture) + The Quorum (Compliance) + The Cobalt (UX).
- **The Product:** Axis (The System of Record).

### Appendix D: Enforced Repository Structure

See Part V for complete directory trees for both Standard A (Titan) and Standard B (Olympian).

### Appendix E: Drift Enforcement Rule

See Part VII - Drift Enforcement (The Code of Veto) for complete PR rejection criteria.

### Appendix F: Public One-Pager

**Axis:** The System of Record for Modern Operations.

- Runs the Business (Core).
- Proves Compliance (Ledger).
- Enables Speed (Flow).

### Appendix G: Internal Canon Quick Reference

- If it mutates data → **Loom**
- If it reads fast → **Prism**
- If it explains why → **Codex**
- If it requires Audit → **The Quorum**
- If it touches User → **The Cobalt**
- If it schedules → **The Tempo**
- If it integrates → **The Vectors**
- If it stores files → **The Archive**
- If it translates → **The Rosetta**
- If it notifies → **The Herald**

### Appendix H: CI / Architectural Enforcement Rules

❌ **No** internal HTTP calls. ❌ **No** direct DB access from UI (Cobalt). ❌ **No** business logic
in UI components. ❌ **No** secrets in code. ❌ **No** external API calls without Vector adapter.

✅ **All** Mutations wrapped in BEGIN...COMMIT. ✅ **Chronos** Trace required for all state changes.
✅ **Isomorphic** Codex (runs on both Node & Deno). ✅ **Biome** formatting enforced. ✅ **Zod**
validation on all inputs.

### Appendix I: Conceptual Map

```
        NexusCanon (The Law)
                │
        ┌───────┴───────┐
    The Quorum      The Cobalt
   (Governance)       (Flow)
        │               │
        └───────┬───────┘
           Prime Monad
         (Single Runtime)
              │
    ┌─────────┼─────────┐
The Titan         The Olympian
(Node.js)            (Deno)
```

---

## Ratification

This document is the **Single Source of Truth**.

> **NexusCanon is the Law.**
>
> **Quorum & Cobalt are the Hands.**
>
> **Axis is the Vehicle.**
>
> **The Thread Endures.**

---

_Version 4.0.0 — Last Updated: January 8, 2026_
