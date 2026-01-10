# The Titan Protocol

## The Engineering Standard & Field Guide

---

### Metadata

| Field          | Details                                                               |
| -------------- | --------------------------------------------------------------------- |
| **Version** | 2.1.0 (Titan Standard)                                                |
| **Target** | Engineers, Developers, Contributors                                   |
| **Purpose** | The "Rosetta Stone" mapping Real-World Tech to NexusCanon Sci-Fi Lore |
| **Parent Doc** | NexusCanon Constitution v5.0.0                                        |

---

## Part I — The Rosetta Stone (Terminology Map)

Use this cheatsheet to identify where *any* piece of code belongs.

### The Core Domains
| If you are touching... | You are in Domain... | The Sci-Fi Name | Folder Path |
| :--- | :--- | :--- | :--- |
| **Business Rules / Validation** | Logic | **The Codex** | `/packages/canon/codex` |
| **Database Writes / Mutations** | Write DB | **The Loom** | `/packages/canon/loom` |
| **Database Reads / Queries** | Read DB | **The Prism** | `/packages/canon/prism` |
| **UI Components / React** | Frontend | **The Cobalt** | `/apps/web/components` |
| **Authentication / Permissions** | Security | **The Argus** | `/packages/auth` |
| **Logging / Audit Trails** | Governance | **The Quorum** | `/packages/canon/chronos` |
| **DevOps / CI/CD / Scripts** | Infra | **The Atlas** | `/tooling` or `/infra` |

### The "Dirty Laundry" (Utilities & Integrations)
| If you are implementing... | It belongs to... | Why? |
| :--- | :--- | :--- |
| **SEO / Metadata / OpenGraph** | **The Cobalt** | It is part of the "Surface" presentation layer. |
| **Google Analytics / PostHog** | **The Argus** | It is "Vision" and telemetry. |
| **Cron Jobs / Scheduled Tasks** | **The Tempo** | It provides the "Rhythm" or heartbeat. |
| **Stripe / PayPal / ERP API** | **The Vectors** | It is a "Port" to the barbarian outside world. |
| **S3 Uploads / File Storage** | **The Archive** | It separates "Matter" (files) from "Truth" (DB). |
| **Email / SMS / Push Notif** | **The Herald** | It "Announces" information to the user. |
| **Translations / i18n** | **The Rosetta** | It "Translates" the Codex for the user. |
| **Environment Variables** | **The Vault** | It keeps secrets "Invisible." |
| **Soft Delete Logic** | **Thanos Trace** | It "Snaps" data out of view, but keeps it in memory. |
| **Formatting (Prettier)** | **Standard Gauge**| It ensures all code looks uniform. |

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

---

## Part III — The Rules of Engagement (Dev Standards)

### 3.1 The "Veto" Checklist (Code Review)

Your code will be **REJECTED** if:

1. **The Codex Violation:** You wrote business logic (e.g., `if price < 0`) inside a React Component (`.tsx`).
* *Correction:* Move it to `/codex/rules.ts`.


2. **The Loom Violation:** You called the Database directly from a Client Component.
* *Correction:* Use a Server Action (`/loom/actions.ts`).


3. **The Vector Leak:** You called an external API (e.g., `fetch('stripe.com')`) directly in the UI.
* *Correction:* Wrap it in a Vector Adapter (`/lib/vectors/stripe.ts`).


4. **The Chronos Omission:** You mutated data (INSERT/UPDATE/DELETE) without logging a `trace()`.
* *Correction:* Add the `6W1H` audit signature.



### 3.2 The Thanos Trace (Deletion Protocol)

We **NEVER** delete data. We only "Snap" it.

* **Wrong:** `DELETE FROM users WHERE id = 1;`
* **Correct:** `UPDATE users SET snapped_at = NOW() WHERE id = 1;`
* **Why:** The Quorum must always be able to reconstruct the past.

---

## Part IV — Quick Reference: Where does it go?

**Scenario 1: You need to add a "Sign Up" form.**

* The Form UI → **The Cobalt** (`/components/auth/SignUpForm.tsx`)
* The Validation (Email required) → **The Codex** (`/codex/auth.schema.ts`)
* The Database Insert → **The Loom** (`/loom/auth.actions.ts`)
* The Welcome Email → **The Herald** (`/lib/herald/email.ts`)

**Scenario 2: You need to add Google Analytics.**

* The Script Tag → **The Cobalt** (`layout.tsx`)
* The Event Tracking Logic → **The Argus** (`/lib/argus/analytics.ts`)

**Scenario 3: You need to run a nightly report.**

* The Scheduler → **The Tempo** (`/api/cron/daily-report.ts`)
* The Query → **The Prism** (`/prism/reports.ts`)
* The CSV Generation → **The Archive** (Save to S3)

---

*The Titan Protocol: Enforcing Order in a Chaotic World.*
