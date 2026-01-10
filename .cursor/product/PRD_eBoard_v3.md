sq# PRD: The Apex (Executive Board Decision Engine)

## Product Requirements Document v3.0.0

**Deno + Fresh Implementation Standard**

---

### Document Metadata

| Field                      | Value                                       |
| -------------------------- | ------------------------------------------- |
| **Version**                | 3.0.0 (Olympian Implementation)             |
| **Status**                 | Approved for Engineering                    |
| **Architectural Standard** | NexusCanon v4.0.0 + Olympian v1.0.0         |
| **Runtime**                | Deno 2.x + Fresh 2.x (Islands Architecture) |
| **Database**               | PostgreSQL 15+ (ACID Compliance)            |
| **Target Release**         | Q1 2026                                     |
| **Product Owner**          | The Axis High Council                       |

---

## Part I — Executive Summary & Product Vision

### I.1 The Problem (The Legal Fragility)

**Current Reality:** Executive decision-making is fragmented across informal channels:

- WhatsApp approvals lack forensic audit trails
- Email chains bury critical decisions in noise
- Spreadsheets become "Shadow Systems of Record"
- No real-time visibility into financial/strategic impact before approval
- Decision latency measured in days (email + meetings) instead of seconds

**Business Impact:**

- Missed market windows due to slow approvals
- Compliance risk from undocumented decisions
- Administrative overhead for CFO/COO managing approval chains

### I.2 The Solution (The Apex)

**The Apex** is a High-Frequency Decision Engine that transforms executive governance from **"Slow
Email"** to **"Fast Boardroom."**

**Core Value Proposition:**

1. **Zero Latency Decisions:** The "Dual-Screen Strategy" (Proposal + Impact) enables Sovereigns to
   approve in seconds, not days
2. **Forensic Accountability:** Every decision generates a 6W1H immutable audit trail (The Thanos
   Trace)
3. **Encrypted Privacy:** "Eyes Only" documents are client-side encrypted; even admins cannot
   decrypt them
4. **Structured Intent:** The "Living Schema" ensures proposals are machine-readable, enabling
   downstream automation

**Metaphorical Model:**

| Concept                | Traditional              | The Apex                               |
| ---------------------- | ------------------------ | -------------------------------------- |
| What we solve          | Customer support tickets | Executive proposals                    |
| Who decides            | Help desk agents         | The Sovereign (CEO)                    |
| How we structure input | Free-form text           | Schema-based stencils                  |
| How we track history   | Ticket updates           | Tri-Vector trace (Past/Present/Future) |
| Approval mechanism     | Agent assignment         | Digital signature + watermark          |

---

## Part II — Product Narrative & User Experience

### II.1 User Personas

#### The Sovereign (Primary User: CEO / Board Chair)

**Goals:**

- Make high-impact decisions in seconds without getting lost in details
- Have immediate visibility into financial/strategic consequences before voting
- Maintain cryptographic proof of decision accountability

**Key Behaviors:**

- Scans proposals at high speed (5+ per session)
- Relies on the "Right Eye" (The Thanos Trace) to verify risk before clicking "Approve"
- Demands <200ms response time when switching between proposals
- May use one-handed gestures (iPad, pen) while in meetings

**Frustrations:**

- "Inbox Zero" anxiety from email chains
- Uncertainty about decision impact
- Lack of permanent audit trail for compliance

---

#### The Council (Secondary User: C-Suite Manager)

**Examples:** CTO, CFO, CMO, Regional Head, VP of Engineering

**Goals:**

- Submit standardized proposals to unblock their teams
- Get rapid feedback/approval without ambiguity
- Collaborate with other council members via comments

**Key Behaviors:**

- Uses "Codex Stencils" (pre-defined templates) for 90% of submissions
- Tags colleagues (@CFO) to build consensus before formal vote
- Monitors "The Listening" status to track approval progress
- May add custom metadata (risk scores, alternative options)

**Frustrations:**

- Ambiguous rejection reasons ("Need more info")
- Waiting for next board meeting to get sign-off
- No real-time presence indicators

---

#### The Guardian (Tertiary User: Compliance/Auditor)

**Goals:**

- Verify all high-impact decisions have complete audit trails
- Ensure sensitive decisions use encryption ("Eyes Only")
- Report on decision velocity, approval patterns

**Key Behaviors:**

- Views proposals in "Audit Mode" (read-only)
- Exports decision history for compliance reporting
- Sets up "alerts" for decisions exceeding thresholds (e.g., >$1M spend)

---

### II.2 The Dual-Screen Strategy

The Apex implements a **"Split-Brain Viewport"** that eliminates context-switching.

**Left Panel (60% - The Pool Table / Functional Dashboard):**

The Pool Table is a **live operational dashboard**, not just a list. It combines proposal visibility
with decision velocity metrics.

**Core Components:**

1. **Proposal List (Sortable/Filterable)**
   - Scrollable list of active/historical proposals with rich visual indicators
   - Status badges (DRAFT, LISTENING, APPROVED, VETOED) with color coding
   - Priority indicators (HIGH/MEDIUM/LOW based on amount or risk score)
   - Time remaining (SLA countdown if deadline is set)
   - Avatar stack showing current approvers + their vote status
   - Search & filter by: circle, status, amount range, date range, approver name
   - Sort by: date created, amount, approvers remaining, urgency

2. **Dashboard Metrics (Header Area)**
   - **Total Pending:** Count of proposals in LISTENING state
   - **Awaiting Your Vote:** Count where user is required approver
   - **Avg Decision Time:** Days from LISTENING → APPROVED
   - **This Week's Approvals:** Quick stat showing velocity
   - **At-Risk Proposals:** Count exceeding SLA time or approval threshold

3. **Quick Actions per Proposal**
   - Open (click row) → Full proposal view
   - Vote (hover) → Approve/Veto buttons appear
   - Tag (hover) → @mention colleagues
   - Create To-Do (new) → Quick link to create a linked task
   - Reassign (admin only) → Move to different approver

4. **Visual Intelligence**
   - Red warning if proposal approaching deadline
   - Pulse animation if you're mentioned in comments
   - Green checkmark if all approvers voted
   - Faded text if proposal is archived

**Right Panel (40% - The Strategy Drawer):**

- **Tab 1: The Thanos Trace** (Default view)
  - **Past Vector:** Version history, editor timeline, comment count
  - **Present Vector:** Real-time viewers (who is looking right now?), last activity timestamp
  - **Future Vector:** Calculated impact (budget, headcount, timeline), risk score, affected
    downstream systems

- **Tab 2: The BoardDialog** (Chat/Collaboration)
  - Comment thread for council discussion
  - @mentions trigger haptic alerts for tagged users
  - Three modes: Open Floor (all see), Sovereign Consultation (one person replies), Whisper
    (encrypted sidebar)

- **Tab 3: The Codex** (Schema Definition)
  - Shows the "stencil" this proposal is using
  - Displays required vs. optional fields
  - Allows inline editing of optional metadata

- **Tab 4: Linked To-Dos** (NEW — Decision Enablement)
  - Shows any to-do tasks created from this proposal
  - Quick link to create a new to-do ("Implement if approved")
  - Displays to-do status + assignee
  - Allows closing to-dos directly from this panel

**Interaction Model:**

- Clicking a proposal on the Left instantly populates all four Tabs on the Right
- No page navigation; Thumb Zone FAB remains fixed for Approve/Veto
- <200ms response time from click to content render (critical performance requirement)

---

### II.3 The Golden Thumb (Approval Mechanism)

**Location:** Fixed to bottom-right "Thumb Zone" (one-handed accessible)

**Actions:**

1. **APPROVE** — Locks proposal to APPROVED state + generates cryptographic signature
2. **VETO** — Locks proposal to VETOED state + requires comment explaining reason
3. **CONSULT** — Reopens proposal back to LISTENING + assigns to specific council member

**The Watermark Engine (Optimistic UI):**

- **Client-Side (16ms):** UI instantly overlays "SIGNED BY SOVEREIGN" watermark + locks form +
  provides haptic feedback
- **Server-Side (async):** Database transaction commits the decision + Chronos generates 6W1H audit
  record
- **Reconciliation:** If server rejects (rare), UI rolls back with error message

This optimistic UI gives the Sovereign instant visual feedback while the backend persists
asynchronously.

---

## Part II.5 — Configuration Layers (Governance & Personalization)

### II.5.1 Global Config (The Sovereign's Law)

**Purpose:** CEO/Admin sets enterprise-wide policies that apply to all users.

**Scope:** These are non-negotiable system defaults. Every manager operates under these rules.

**Configurable Parameters:**

```typescript
// /canon/codex/global-config.ts
export interface GlobalConfig {
  // Approval Rules
  approval_threshold: {
    capex_requires_board_vote: number; // e.g., $500k
    hiring_requires_cfo_approval: boolean;
    budget_expansion_auto_escalate: boolean;
  };

  // Data Retention
  archive_after_days: number; // e.g., 365 days
  soft_delete_enabled: boolean; // Never hard-delete proposals
  audit_trail_immutable: boolean; // ALWAYS true

  // Security & Encryption
  eyes_only_encryption_required: boolean; // Force encryption for sensitive docs?
  mandatory_2fa: boolean; // 2-factor auth for all users?
  session_timeout_minutes: number; // e.g., 480 (8 hours)

  // Notifications
  mention_alert_enabled: boolean;
  email_digest_frequency: "realtime" | "daily" | "weekly";
  slack_integration_enabled: boolean;

  // ERP Vector Configuration
  vector_refresh_interval_minutes: number; // e.g., 5 min
  vector_cache_stale_after_hours: number; // e.g., 24 hours
  sap_api_enabled: boolean;
  stripe_api_enabled: boolean;

  // UI/UX Defaults
  default_sort_by: "date_created" | "amount" | "urgency";
  show_risk_scores: boolean;
  show_approver_avatars: boolean;
  theme: "light" | "dark" | "system";
}
```

**Who Can Edit:** CEO (Sovereign), System Admin (with Admin Hat)

**Where It's Set:** Admin console at `/routes/admin/settings.tsx`

**Audit Trail:** Every change to Global Config is logged in Thanos with reason + who changed it +
timestamp

**Change Propagation:** Updates apply immediately to all active sessions (via WebSocket broadcast)

**Risk:** If CEO sets `capex_requires_board_vote = $1M`, existing $500k approvals cannot be modified
retroactively (immutable law)

---

### II.5.2 User Config (The Manager's Preference)

**Purpose:** Each manager personalizes their own view/behavior without affecting others.

**Scope:** Personal preferences that don't impact governance rules.

**Configurable Parameters:**

```typescript
// /canon/codex/user-config.ts
export interface UserConfig {
  user_id: string;

  // Display Preferences
  theme: "light" | "dark" | "system";
  default_view: "pool_table" | "kanban" | "calendar";
  cards_per_page: number; // e.g., 10, 20, 50
  compact_mode: boolean; // Minimize whitespace

  // Notification Settings
  email_notifications: boolean;
  mention_alerts: "instant" | "digest" | "silent";
  approval_reminders: boolean;
  digest_frequency: "daily" | "weekly";

  // Decision Context
  show_future_vector: boolean; // Show budget impact?
  show_past_versions: boolean; // Show proposal history?
  auto_collapse_comments: boolean; // Hide comment thread by default?

  // To-Do Integration (NEW)
  link_to_dos_on_approval: boolean; // Auto-create to-do when I approve?
  to_do_default_assignee: string | null; // e.g., "project_manager@company.com"
  to_do_default_due_days: number; // e.g., 7 days after approval
  show_to_do_panel: boolean; // Show linked to-dos in right drawer?

  // Filter Defaults
  filter_by_circle: string[]; // Which circles to show?
  filter_by_status: string[]; // DRAFT, LISTENING, APPROVED, VETOED?
  hide_archived: boolean;
  only_awaiting_my_vote: boolean; // Show only proposals I need to approve?

  // Proposal Stencil Defaults
  favorite_stencils: string[]; // e.g., ["hiring_request_v2", "capex_request_v1"]
  stencil_defaults: {
    [stencil_id: string]: { [field_id: string]: any }; // e.g., hiring_request_v2.department = "Engineering"
  };
}
```

**Who Can Edit:** The manager themselves

**Where It's Set:** Personal settings at `/routes/settings/preferences.tsx`

**Storage:** Stored in `user_configs` table (indexed by user_id for <50ms lookup)

**Sync:** Changes apply instantly to current session

**Privacy:** User config is never shared with others; purely personal

---

## Part III — Core Features (The Weapons: 9 Domains of Authority)

**Weapons Overview:**

1. **The Codex** — Living Schema (proposal templates)
2. **The Thanos Trace** — Forensic Audit Trail
3. **The BoardDialog** — Real-Time Collaboration
4. **The Hierarchy** — Role-Based Access Control
5. **The Vault** — Encrypted Privacy
6. **The Vectors** — Multi-Dimensional Analytics
7. **The Compass** — Lite To-Dos Integration
8. **The Oracle** — What-If Variance Analysis ⭐ NEW
9. **The Herald** — Broadcast Announcements ⭐ NEW

### III.1 Weapon 1: The Living Schema (The Codex)

**Purpose:** Eliminate free-text proposals; force structure.

**Implementation:**

```typescript
// /canon/codex/manifest.ts (NexusCanon: The Codex domain)
export interface Stencil {
  id: string; // "capex_request_v1"
  name: string; // "Capital Expenditure Request"
  description: string;
  version: number;
  fields: StencilField[];
  required_approvers: string[]; // ["CFO", "CEO"]
  max_amount?: number; // If exceeded, escalates to full board
}

export interface StencilField {
  id: string;
  label: string;
  type: "string" | "number" | "date" | "enum" | "jsonb";
  required: boolean;
  validation_rule?: string; // Zod schema
  placeholder?: string;
}

// Example: Hiring Stencil
export const HIRING_STENCIL: Stencil = {
  id: "hiring_request_v2",
  name: "Hiring Request",
  version: 2,
  fields: [
    {
      id: "job_title",
      label: "Job Title",
      type: "string",
      required: true,
    },
    {
      id: "level",
      label: "Seniority Level",
      type: "enum",
      required: true,
      validation_rule: "junior|mid|senior|principal",
    },
    {
      id: "annual_salary",
      label: "Annual Salary (USD)",
      type: "number",
      required: true,
      validation_rule: "number|min:50000|max:500000",
    },
  ],
  required_approvers: ["CTO", "CFO", "CEO"],
};
```

**Benefits:**

- Proposals are machine-readable (enables automation, reporting)
- No ambiguous free-form fields
- Schema can be updated without code deployment (hot-swappable)
- Each proposal version is immutably tied to its stencil version

---

### III.2 Weapon 2: The Thanos Trace (The Right Drawer)

**Purpose:** Provide forensic context without opening the full proposal.

**The Tri-Vector Model:**

| Vector                  | What it Shows                  | Example                                                                                           |
| ----------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Past (Forensic)**     | Proposal history and evolution | "Manager X submitted 2 hours ago. 3 versions. Last edit by CFO 15 min ago."                       |
| **Present (Pulse)**     | Real-time activity             | "CFO & CMO currently viewing. 4 comments in last hour."                                           |
| **Future (Prediction)** | Calculated consequences        | "Approval impacts Q3 Marketing Budget by 12%. Risk Score: MEDIUM. Affects 3 downstream projects." |

**Implementation (Deno):**

```typescript
// /canon/loom/schema.ts (NexusCanon: The Loom domain)
import { InferSelectModel } from "drizzle-orm";
import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const thanos_events = pgTable("thanos_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  proposal_id: uuid("proposal_id").notNull(),
  actor_id: uuid("actor_id").notNull(),

  // The Tri-Vector
  vector: text("vector").notNull(), // "PAST" | "PRESENT" | "FUTURE"

  // 6W1H Forensic Signature
  who: uuid("who").notNull(),
  what: text("what").notNull(), // "CREATED" | "EDITED" | "APPROVED" | "COMMENTED"
  when: timestamp("when").notNull().defaultNow(),
  where: text("where").notNull(), // "web" | "api" | "webhook"
  why: text("why"), // Reason for action
  which: jsonb("which"), // Alternatives considered
  how: text("how"), // Method (UI click, API call, batch)

  payload: jsonb("payload").notNull(), // Full snapshot of data at that moment
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export type ThanosEvent = InferSelectModel<typeof thanos_events>;
```

**Real-Time Updates:**

- WebSocket feed pushes new Thanos events to all viewers
- Client subscribes to `proposal/:id/trace` channel
- Updates appear instantly without page refresh

---

### III.3 Weapon 3: The BoardDialog (The Listening Layer)

**Purpose:** Enable council collaboration without leaving the proposal view.

**Modes:**

1. **The Open Floor:** All council members in the circle see comments
   - Enables fast consensus-building
   - @mention syntax: `@CFO can you review budget?`
   - Mentions trigger haptic alert + SSE notification

2. **Sovereign Consultation:** CEO asks one council member; others see Q but not reply options
   - Privacy for sensitive discussions
   - Prevents "group-think" in voting

3. **The Whisper:** Encrypted sidebar between two people
   - Client-side AES-GCM encryption
   - Server stores ciphertext; keys never transmitted
   - Even admins cannot read (The Vault principle)

**Implementation:**

```typescript
// /canon/loom/mutations.ts (NexusCanon: Write operations)
import { db } from "./client.ts";
import { board_comments, proposals } from "./schema.ts";
import { trace } from "@/lib/audit/tracer.ts";

export async function addComment(
  proposal_id: string,
  actor_id: string,
  content: string,
  mode: "open" | "consultation" | "whisper",
  mentions: string[] = [],
) {
  // [THE LOOM] Write to database with ACID guarantee
  const comment = await db.insert(board_comments).values({
    id: crypto.randomUUID(),
    proposal_id,
    actor_id,
    content,
    mode,
    created_at: new Date(),
  }).returning();

  // [THE CHRONOS] Log the action
  await trace({
    who: actor_id,
    what: "COMMENTED",
    when: new Date(),
    where: "web",
    why: `Added comment in ${mode} mode`,
    which: mentions,
    how: "UI submit",
    proposal_id,
  });

  // [THE HERALD] Notify mentioned parties
  for (const mention_id of mentions) {
    await notifyUser(mention_id, {
      type: "mention",
      proposal_id,
      actor_id,
      preview: content.substring(0, 100),
    });
  }

  return comment;
}
```

---

### III.4 Weapon 4: The Hierarchy (Circles & Admin Hat)

**Purpose:** Model real organizational structure (global C-Suite, regional teams, projects).

**Architecture:**

```typescript
// /canon/codex/types.ts (NexusCanon: The Codex types)
export interface Circle {
  id: string;
  name: string;
  sovereign_id: string; // The owner
  description?: string;
  members: CircleMember[];
  parent_circle_id?: string; // Nested hierarchies
}

export interface CircleMember {
  user_id: string;
  role: "sovereign" | "council" | "observer";
  permissions: Permission[];
  admin_hat?: AdminHat; // Granted capability
}

export interface AdminHat {
  id: string;
  capability: "schema_editor" | "user_manager" | "archive_admin";
  granted_by: string;
  expires_at?: Date;
}

// The CEO grants the CTO the "schema_editor" Admin Hat
// The CTO remains a Council member for proposals
// But gains the ability to edit Codex Stencils (manifest.json)
```

**Permission Model:**

- Being in a Circle grants implicit **read access** to all proposals in that Circle
- **Comment access** is Circle-wide (no granular blocking)
- **Approve access** is defined by the stencil's `required_approvers` field
- **Admin Hat** is a role-based capability, not a separate user type

---

### III.5 Weapon 5: The Vault (Cryptographic Privacy)

**Purpose:** "Eyes Only" documents that only Author and Sovereign can decrypt.

**Implementation (Client-Side Encryption):**

```typescript
// /islands/VaultToggle.tsx (NexusCanon: The Cobalt - interactive island)
import { useState } from "preact/hooks";

export default function VaultToggle() {
  const [isEyesOnly, setIsEyesOnly] = useState(false);

  const handleEncrypt = async (file: File) => {
    if (!isEyesOnly) {
      // Normal upload to S3
      await uploadToArchive(file);
      return;
    }

    // [THE VAULT] Client-side encryption
    const keyMaterial = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true, // extractable
      ["encrypt", "decrypt"],
    );

    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: new Uint8Array(12) },
      keyMaterial,
      new TextEncoder().encode(file),
    );

    // Store encrypted blob
    await uploadToArchive(new Blob([encryptedData]));

    // Store key with Sovereign + Author only
    await saveVaultKey(keyMaterial, [author_id, sovereign_id]);
  };

  return (
    <label>
      <input
        type="checkbox"
        checked={isEyesOnly}
        onChange={(e) => setIsEyesOnly(e.currentTarget.checked)}
      />
      Eyes Only (Encrypted)
    </label>
  );
}
```

**Key Storage:**

- The encryption key is stored in a separate, highly-restricted table
- Only Sovereign + Author can retrieve it
- Admin Hat does NOT grant access to keys
- If Sovereign loses the key, Shamir's Secret Sharing (3-of-5 council members) can reconstruct it

---

### III.6 Weapon 6: The Vectors (ERP Integration Ports)

**Purpose:** Fetch live ERP data (budget, headcount, vendor spend) to populate "Future Vector."

**Architecture (The Vector Adapter):**

```typescript
// /lib/adapters/erp.ts (NexusCanon: The Vectors domain)
import { stripe } from "@/lib/adapters/stripe.ts";

export interface VectorPort {
  name: string;
  url: string;
  auth: "api_key" | "oauth2";
  fields_available: string[];
}

export const ERP_PORTS = {
  sap: {
    name: "SAP SuccessFactors",
    url: "https://api.sap.com",
    fields: ["ytd_spend", "headcount", "budget_remaining"],
  },
  stripe: {
    name: "Stripe",
    url: "https://api.stripe.com",
    fields: ["mrr", "churn_rate", "ltv"],
  },
};

// When a proposal is viewed, fetch live Vector data
export async function enrichProposalWithVectors(proposal: Proposal) {
  const future_vector: Record<string, unknown> = {};

  // Example: For a "Hiring Request" stencil, fetch current headcount
  if (proposal.stencil_id === "hiring_request_v2") {
    const current_headcount = await sap.api.get("/headcount", {
      params: { department: proposal.content.department },
    });
    future_vector.current_headcount = current_headcount;
  }

  // Example: For any proposal >$100k, fetch Stripe MRR
  if (proposal.content.amount > 100000) {
    const stripe_data = await stripe.accounts.retrieve();
    future_vector.monthly_revenue = stripe_data.charges_enabled ? true : false;
  }

  return future_vector;
}
```

**Important:** Vector calls are **non-blocking** and **non-critical**.

- If SAP is slow, the proposal still renders with cached "Stale" data
- Fresh vector data is fetched in the background via `GET /api/v1/proposals/:id/vectors`
- Client-side updates the Future Vector section when fresh data arrives

---

### III.7 Weapon 7: The Compass (Lite To-Dos App Integration)

**Purpose:** Convert approval decisions into actionable to-do tasks. Makes The Apex more "decisive"
by linking governance → execution.

**Core Concept:** When a manager approves a proposal, they can immediately create a to-do task
("Implement this hire", "Allocate budget", "Brief the team") without leaving the approval flow.

**Feature Set:**

**1. Quick To-Do Creation (From Proposal Approval)**

```typescript
// When user clicks APPROVE button, offer:
"APPROVE + CREATE TO-DO?"

// Lightweight modal appears:
Task: [_____________________]  // Pre-filled with proposal summary
Assignee: [Dropdown of team members]
Due Date: [Calendar picker, defaults to +7 days]
Priority: [High | Normal | Low]
Linked To: <proposal_id>  // Immutable backlink

[Create To-Do] [Skip]
```

**2. To-Do Dashboard (Lite, Embedded)**

- **Location:** Right panel, "Tab 4: Linked To-Dos" when a proposal is selected
- **Shows:** All to-dos linked to this proposal
- **Actions:**
  - Mark as done (checkbox)
  - Reassign (dropdown)
  - Add comment
  - Delete (soft-delete only)

**Example UI:**

```
Proposal: "Hire Senior Engineer"

├─ To-Do: "Post job on LinkedIn" [Done] Assigned to: Marketing
├─ To-Do: "Brief team on new hire" [Pending] Assigned to: CTO
└─ To-Do: "Prepare onboarding materials" [Pending] Assigned to: HR
```

**3. To-Do List Page**

- **Location:** Navigation menu → "My To-Dos"
- **View:** List of all to-dos assigned to user (Kanban optional in Phase 2)
- **Filters:** By status (pending, done), priority, due date, linked proposal
- **Bulk Actions:** Mark multiple as done, bulk reassign
- **Performance:** <500ms load time (cached with WebSocket updates)

**4. To-Do Schema (The Loom)**

```typescript
// /canon/loom/schema.ts
export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  linked_proposal_id: uuid("linked_proposal_id"), // Nullable (can exist without proposal)
  title: text("title").notNull(),
  description: text("description"),
  assignee_id: uuid("assignee_id").notNull(),
  created_by: uuid("created_by").notNull(),
  status: text("status").notNull(), // "pending" | "done" | "archived"
  priority: text("priority"), // "high" | "normal" | "low"
  due_date: timestamp("due_date"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
```

**5. Why This Makes Decisions More Decisive**

- **Execution Clarity:** "Approve" doesn't mean "let it happen passively." It means "approve +
  define what happens next."
- **Accountability:** Every to-do is tied to the approval decision, creating an unbroken chain:
  Proposal → Approval → Action → Completion
- **Audit Trail:** Chronos tracks when to-dos are completed, enabling metrics like "How fast do we
  execute on approvals?"
- **Reduced Friction:** No context switch ("I approved a hire, now how do I tell the team?"). It's
  all in one flow.

**6. To-Do Notifications**

- **When assigned:** Instant SSE notification + optional email (respects user config)
- **When due:** Reminder 1 day before due date
- **When overdue:** Daily reminder
- **When marked done:** Notify creator + linked proposal viewers

**7. To-Do Integration with Pool Table**

- **Visual Indicator:** Proposal shows "3 linked to-dos" badge
- **Quick Create:** Hover on proposal → "+ Create To-Do" button
- **Completion Status:** "Proposal APPROVED, but 2/3 linked to-dos still pending" warning

**Database Query (Example):**

```typescript
// Get all to-dos linked to a specific proposal
export async function getProposalTodos(proposal_id: string) {
  return await db
    .select()
    .from(todos)
    .where(eq(todos.linked_proposal_id, proposal_id))
    .orderBy(desc(todos.priority), asc(todos.due_date));
}
```

**Phase 1 MVP:** Simple list + checkboxes + due date. No Kanban.

**Phase 2 Expansion:** Kanban board, bulk actions, integration with Slack workflow, recurring to-dos

---

### III.8 Weapon 8: The Oracle (What-If Variance Analysis & Scenario Planning) ⭐ STRATEGIC UPGRADE

**Purpose:** Transform What-If from "approval gating" to "decisiveness enablement." Managers come to
CEO meetings with Budgeted/Planned/Actual variance analysis, eliminating last-minute surprises and
enabling fact-based decisions at scale (50+ pending proposals).

**Core Concept:** Every Case has a "What-If Planning" section (built into Codex Stencils). As time
progresses, actual outcomes are tracked against budgeted/planned forecasts, creating a "Tri-Vector"
learning loop: **Past (Budgeted) → Present (Planned) → Future (Actual)**. This teaches the
organization "Know-How" (what happened) and "Know-Why" (why it happened).

**Feature 1: What-If Case Template Extension**

Each proposal stencil (Hiring, Capex, Marketing Budget, etc.) includes a planning section:

```typescript
// /canon/codex/case-template-whatif.ts

// Example: Hiring Request with What-If Planning
export const HIRING_REQUEST_WHATIF = {
  stencil_id: "hiring_request_v2",

  // Existing proposal fields (role, salary, department, etc.)

  // NEW: What-If Planning Section
  budgeted_section: {
    label: "📋 Budget Plan",
    fields: [
      { label: "Annual Salary", key: "budgeted_salary", type: "currency", required: true },
      {
        label: "Benefits (% of salary)",
        key: "budgeted_benefits_pct",
        type: "percentage",
        required: true,
      },
      { label: "Equipment & Setup", key: "budgeted_equipment", type: "currency" },
      { label: "Training & Development", key: "budgeted_training", type: "currency" },
      { label: "Total First-Year Cost", key: "budgeted_total", type: "currency", readonly: true },
    ],
  },

  planned_section: {
    label: "🎯 Execution Plan",
    fields: [
      { label: "Target Start Date", key: "planned_start_date", type: "date", required: true },
      {
        label: "Time-to-Productivity (days)",
        key: "planned_ttp_days",
        type: "number",
        required: true,
      },
      { label: "Expected ROI (months)", key: "planned_roi_months", type: "number" },
      { label: "Retention Confidence (%)", key: "planned_retention_pct", type: "percentage" },
      { label: "Key Success Metrics", key: "planned_metrics", type: "textarea" },
    ],
  },

  variance_tracking: {
    enabled: true,
    review_interval: "quarterly",
    milestones: [
      { key: "onboarded", label: "Employee Onboarded", offset_days: 30 },
      { key: "productive", label: "Reached Productivity Baseline", offset_days: 90 },
      { key: "q1_review", label: "Q1 Review & Actual Cost Analysis", offset_days: 90 },
      { key: "annual_review", label: "Annual Review & ROI Validation", offset_days: 365 },
    ],
  },
};

// Capex Example
export const CAPEX_REQUEST_WHATIF = {
  stencil_id: "capex_request_v1",
  budgeted_section: {
    label: "💰 Budget Plan",
    fields: [
      { label: "Equipment Cost", key: "budgeted_equipment_cost", type: "currency" },
      { label: "Installation & Setup", key: "budgeted_installation", type: "currency" },
      { label: "Maintenance (Year 1)", key: "budgeted_maintenance", type: "currency" },
      { label: "Total Budgeted", key: "budgeted_total", type: "currency", readonly: true },
    ],
  },
  planned_section: {
    label: "📊 Performance Plan",
    fields: [
      { label: "Implementation Timeline (weeks)", key: "planned_timeline_weeks", type: "number" },
      { label: "Expected Utilization (%)", key: "planned_utilization_pct", type: "percentage" },
      { label: "Payback Period (months)", key: "planned_payback_months", type: "number" },
      { label: "Capacity Increase (%)", key: "planned_capacity_increase", type: "percentage" },
    ],
  },
  variance_tracking: {
    enabled: true,
    review_interval: "semi-annual",
    milestones: [
      { key: "installed", label: "Equipment Installed", offset_days: 30 },
      { key: "operational", label: "Fully Operational", offset_days: 60 },
      { key: "six_month_review", label: "6-Month Review", offset_days: 180 },
      { key: "annual_review", label: "Annual ROI Review", offset_days: 365 },
    ],
  },
};
```

**Feature 2: Variance Tracking Database**

Track the reality: what was budgeted vs what was planned vs what actually happened.

```typescript
// Stores the variance analysis for each case/proposal
export const case_whatif_budgets = pgTable("case_whatif_budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  proposal_id: uuid("proposal_id").notNull(),
  case_number: text("case_number").notNull(), // Reference to Case system
  stencil_id: text("stencil_id").notNull(), // Which template

  // BUDGETED: Manager's initial estimate when creating proposal
  budgeted_total: numeric("budgeted_total", { precision: 12, scale: 2 }).notNull(),
  budgeted_breakdown: jsonb("budgeted_breakdown"), // { salary: 150000, benefits: 45000, equipment: 5000 }
  budgeted_at: timestamp("budgeted_at").notNull().defaultNow(),

  // PLANNED: Manager's forecast at approval time (may differ from budgeted)
  planned_total: numeric("planned_total", { precision: 12, scale: 2 }),
  planned_metrics: jsonb("planned_metrics"), // { ttp: 60, roi: 9, retention: 85, payback: 18 }
  planned_notes: text("planned_notes"), // Why does planned differ from budgeted?
  planned_at: timestamp("planned_at"),

  // ACTUAL: Reality as it unfolds (updated at milestone reviews)
  actual_total: numeric("actual_total", { precision: 12, scale: 2 }),
  actual_breakdown: jsonb("actual_breakdown"), // Updated as reality unfolds
  actual_metrics: jsonb("actual_metrics"), // Measured outcomes
  last_actual_at: timestamp("last_actual_at"),

  // VARIANCE ANALYSIS: The Learning Signal
  variance_pct: numeric("variance_pct", { precision: 5, scale: 2 }), // (actual - budgeted) / budgeted * 100
  variance_status: text("variance_status"), // "on_track" | "warning" | "overrun" | "underrun"
  variance_reason: text("variance_reason"), // Why did it vary? (learning opportunity)

  // Governance
  created_by: uuid("created_by").notNull(), // Manager who created case
  reviewed_by: uuid("reviewed_by"), // Guardian/CEO who approved
  approved_by: uuid("approved_by"),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Milestone Reviews: Capture snapshots at defined intervals
export const case_whatif_milestones = pgTable("case_whatif_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  whatif_budget_id: uuid("whatif_budget_id").notNull(),

  milestone_key: text("milestone_key").notNull(), // "onboarded", "q1_review", "annual"
  milestone_label: text("milestone_label").notNull(),

  scheduled_date: date("scheduled_date").notNull(), // When milestone should occur
  actual_date: date("actual_date"), // When it actually occurred
  status: text("status"), // "scheduled" | "completed" | "overdue"

  // Metrics at this point in time
  budget_to_date: numeric("budget_to_date", { precision: 12, scale: 2 }), // Cumulative budgeted spend
  actual_to_date: numeric("actual_to_date", { precision: 12, scale: 2 }), // Cumulative actual spend
  variance_pct_to_date: numeric("variance_pct_to_date", { precision: 5, scale: 2 }), // Running variance

  // Observations from reviewer
  notes: text("notes"), // "On track. Candidate ramps faster than expected."
  reviewed_by: uuid("reviewed_by"),
  reviewed_at: timestamp("reviewed_at"),

  created_at: timestamp("created_at").notNull().defaultNow(),
});
```

**Feature 3: What-If Scenario Manager (Dashboard)**

Manager views their cases with variance analysis—the "Tri-Vector" Past/Present/Future visualization.

```typescript
// The Scenario Manager Card

interface WhatIfScenario {
  case_number: string;
  proposal_title: string;
  status: "active" | "under_review" | "completed" | "archived";

  // The Three Vectors
  past: {
    label: "📋 Budgeted";
    total: number;
    breakdown: Record<string, number>;
    date: Date;
    color: "#9e9e9e"; // Gray = past
  };

  present: {
    label: "📊 Planned";
    total: number;
    metrics: Record<string, any>;
    date: Date;
    color: "#2196f3"; // Blue = present
  };

  future: {
    label: "🎯 Actual (Now)";
    current_total: number;
    projection_eoy: number;
    variance_from_budgeted: number;
    variance_pct: number;
    variance_status: "on_track" | "warning" | "overrun" | "underrun";
    color: "#4caf50" | "#ff9800" | "#f44336"; // Green/Orange/Red based on status
  };

  next_milestone: {
    label: string;
    scheduled_date: Date;
    status: "due_soon" | "upcoming" | "overdue";
  };
}

// UI Component: Tri-Vector Analysis Card
export function WhatIfAnalysisCard({ scenario }: { scenario: WhatIfScenario }) {
  return (
    <div className="what-if-card">
      <h3>{scenario.case_number}: {scenario.proposal_title}</h3>

      {/* Tri-Vector Visualization */}
      <div className="tri-vector-display">
        <div className="vector vector-past">
          <h4>{scenario.past.label}</h4>
          <p className="amount">${scenario.past.total.toLocaleString()}</p>
          <dl className="breakdown">
            {Object.entries(scenario.past.breakdown).map(([key, val]) => (
              <React.Fragment key={key}>
                <dt>{key}:</dt>
                <dd>${val.toLocaleString()}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>

        <div className="vector vector-present">
          <h4>{scenario.present.label}</h4>
          <p className="amount">${scenario.present.total.toLocaleString()}</p>
          <dl className="metrics">
            {Object.entries(scenario.present.metrics).map(([key, val]) => (
              <React.Fragment key={key}>
                <dt>{key}:</dt>
                <dd>{val}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>

        <div className={`vector vector-future vector-${scenario.future.variance_status}`}>
          <h4>{scenario.future.label}</h4>
          <p className="amount">${scenario.future.current_total.toLocaleString()}</p>
          <p className="variance">
            {scenario.future.variance_pct > 0 ? "+" : ""}
            {scenario.future.variance_pct.toFixed(1)}%
          </p>
          <p className={`status status-${scenario.future.variance_status}`}>
            {scenario.future.variance_status === "on_track" && "✅ On Track"}
            {scenario.future.variance_status === "warning" && "⚠️ Warning (-5% to +5%)"}
            {scenario.future.variance_status === "overrun" && "❌ Over Budget (+5% or more)"}
            {scenario.future.variance_status === "underrun" && "💰 Under Budget (-5% or more)"}
          </p>
        </div>
      </div>

      {/* Variance Chart Over Time */}
      <div className="variance-chart">
        <h4>Budget vs Reality Timeline</h4>
        <LineChart
          datasets={[
            {
              label: "Budgeted",
              data: scenario.milestones.map((m) => m.budget_to_date),
              color: "#9e9e9e",
            },
            {
              label: "Planned",
              data: scenario.milestones.map((m) => m.planned_to_date),
              color: "#2196f3",
            },
            {
              label: "Actual",
              data: scenario.milestones.map((m) => m.actual_to_date),
              color: "#4caf50",
            },
          ]}
          xAxis={scenario.milestones.map((m) => m.milestone_label)}
        />
      </div>

      {/* Next Milestone */}
      <div className="next-milestone">
        <h4>📌 Next Milestone</h4>
        <p>{scenario.next_milestone.label}</p>
        <p className="date">
          Scheduled: {scenario.next_milestone.scheduled_date.toLocaleDateString()}
        </p>
        <button className="btn-schedule-review">Schedule Review</button>
      </div>
    </div>
  );
}

// Styling for Tri-Vector
const triBectorStyles = `
.tri-vector-display {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.vector {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.vector-past { border-left: 4px solid #9e9e9e; background-color: #fafafa; }
.vector-present { border-left: 4px solid #2196f3; background-color: #f5f7fb; }
.vector-future { border-left: 4px solid #ccc; }

.vector-future.vector-on_track { border-left: 4px solid #4caf50; background-color: #f5fdf5; }
.vector-future.vector-warning { border-left: 4px solid #ff9800; background-color: #fff8f5; }
.vector-future.vector-overrun { border-left: 4px solid #f44336; background-color: #fdf5f5; }
.vector-future.vector-underrun { border-left: 4px solid #2196f3; background-color: #f5f7fb; }

.amount {
  font-size: 1.75rem;
  font-weight: bold;
  color: #333;
  margin: 0.75rem 0;
}

.breakdown, .metrics {
  text-align: left;
  font-size: 0.875rem;
  margin: 1rem 0;
}

.breakdown dt, .metrics dt {
  color: #666;
  font-weight: 500;
}

.breakdown dd, .metrics dd {
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.variance {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.status {
  font-weight: 600;
  margin-top: 0.5rem;
}

.status-on_track { color: #4caf50; }
.status-warning { color: #ff9800; }
.status-overrun { color: #f44336; }
.status-underrun { color: #2196f3; }

.variance-chart {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.variance-chart h4 {
  color: #333;
  margin-bottom: 1rem;
}

.next-milestone {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.next-milestone h4 {
  color: #333;
  margin-bottom: 0.5rem;
}

.next-milestone .date {
  color: #999;
  font-size: 0.875rem;
}

.btn-schedule-review {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-schedule-review:hover {
  background-color: #1976d2;
}
`;
```

**Feature 4: Multi-Case Scenario Pooling (Phase 2)**

When CEO sees 50+ pending proposals, they can run scenario analysis across groups:

```typescript
// "Aggressive Q1 Growth" Scenario
interface WhatIfScenario {
  name: string;
  description: string;
  cases: string[];  // Case numbers to include
  
  total_budgeted: number;
  total_planned: number;
  total_projected_actual: number;
  
  conflicts: string[];  // "Exceeds Q1 budget by $80k"
  recommendations: string[];  // "Defer case 2505 to Q2"
}

// Create Scenario
POST /api/scenarios/create
{
  name: "Aggressive Q1 Growth",
  case_ids: ["CASE-2501", "CASE-2502", "CASE-2503", "CASE-2504", "CASE-2505"]
}

Response:
{
  scenario_id: "scen-001",
  name: "Aggressive Q1 Growth",
  total_budgeted: 1_500_000,
  total_planned: 1_450_000,
  total_projected_actual: 1_580_000,
  variance_pct: 5.3,
  conflicts: [
    "❌ Exceeds Q1 approved budget by $80,000",
    "❌ Requires Board special approval per Global Config"
  ],
  recommendations: [
    "✅ Defer CASE-2505 (Marketing hire) to Q2 → stays within budget",
    "✅ Negotiate start date for CASE-2502 (Designer) to mid-month → saves $25k Q1"
  ]
}
```

**Feature 5: Notifications & Reminders**

- **Milestone Due:** 7 days before scheduled review date
- **Milestone Overdue:** Daily reminder if past scheduled date
- **Variance Alert:** If actual exceeds budgeted by >10%, notify manager + CEO
- **Review Request:** When milestone data needs to be collected

**Why This Transforms Decision-Making:**

| Before                                             | After                                                                          |
| -------------------------------------------------- | ------------------------------------------------------------------------------ |
| CEO asks "Can we afford this?" → Manager scrambles | Manager comes prepared with Budgeted/Planned/Actual analysis                   |
| "50 pending proposals" = paralysis                 | "50 pending proposals" = pool them into 3-4 scenarios + see impacts            |
| No learning from past decisions                    | Variance tracking creates institutional memory: "hiring always overruns by 8%" |
| What-If is tactical (this proposal only)           | What-If is strategic (portfolio-level decisions)                               |
| Executives have gut feelings                       | Executives have data-driven "Know-Why"                                         |

**Phase 1 MVP:**

- ✅ Single-case variance tracking (Budgeted → Planned → Actual)
- ✅ Case template What-If sections
- ✅ Tri-Vector dashboard visualization
- ✅ Milestone review scheduling
- ✅ Variance alerts (overrun by 10%+)
- **Effort: MEDIUM | Value: VERY HIGH**

**Phase 2 Expansion:**

- Multi-case scenario pooling
- Predictive variance modeling (ML: hiring tends to overrun)
- Automated recommendations ("defer this to Q2")
- Integration with financial planning tools (NetSuite, SAP)

---

### III.9 Weapon 9: The Herald (Broadcast Announcements System) ⭐ NEW

**Purpose:** Enable CEO/Admin to broadcast critical decisions and announcements organization-wide
with persistent visibility (sticky banner). Ensures alignment and maintains forensic audit trail.

**Core Concept:** The Sovereign's voice carries authority. When a decision is made (Approved,
Vetoed, Policy Change), every manager needs to know immediately. No notification fatigue—sticky
banner persists until read.

**Feature Set:**

**1. Broadcast Types**

| Type             | Use Case                         | Example                                           | Icon |
| ---------------- | -------------------------------- | ------------------------------------------------- | ---- |
| **Approval**     | Significant decisions            | "Approved: Q1 Marketing Budget Expansion ($500k)" | ✅   |
| **Veto**         | Rejected proposals (with reason) | "Vetoed: Annual Capex - needs rework"             | ❌   |
| **Announcement** | Policy changes, org news         | "New policy: All hires >$150k require board vote" | 📢   |
| **Poll**         | Quick surveys to council         | "Voting: Should we acquire StartupX?"             | 🗳️   |
| **Emergency**    | Urgent action required           | "PAUSE all hiring approvals immediately"          | 🚨   |

**2. Sticky Banner (Always Visible)**

```
┌──────────────────────────────────────────────────────┐
│ 📢 CEO ANNOUNCEMENT (Persistent Banner)              │
├──────────────────────────────────────────────────────┤
│ Approved: Q1 Marketing Budget Expansion              │
│ By: CEO (John Smith) • Jan 8, 2026 11:23 AM          │
│                                                      │
│ "Market window closing. Aggressive Q1 spend is       │
│  critical for capturing mind share."                 │
│                                                      │
│ Linked Proposal: #PROP-2024-0451                     │
│ Linked Case: Case #4521 (Vendor Contract)            │
│                                                      │
│ [View Proposal] [View Case] [Mark Read] [Dismiss]    │
└──────────────────────────────────────────────────────┘
```

**Design Rules:**

- **Non-dismissible** (until explicitly marked read)
- **Sticky position** (stays at top while scrolling)
- **Color-coded** by type (green=approval, red=veto, orange=announcement, blue=poll, red=emergency)
- **Linked context** (click to view related proposal/case)
- **Timestamp** (when was it announced?)
- **Read tracking** (who has seen this?)

**3. Database Schema**

```typescript
// /canon/loom/schema.ts
export const broadcasts = pgTable("broadcasts", {
  id: uuid("id").primaryKey().defaultRandom(),

  // WHO
  created_by: uuid("created_by").notNull(), // CEO/Admin only

  // WHAT
  type: text("type").notNull(), // "approval" | "veto" | "announcement" | "poll" | "emergency"
  title: text("title").notNull(), // "Approved: Q1 Marketing Budget"
  message: text("message"), // Full explanation

  // LINKED TO
  proposal_id: uuid("proposal_id"), // If about a proposal
  case_number: text("case_number"), // If about a ticket/support case

  // TARGETING
  audience: text("audience").notNull(), // "all" | "circle:{id}" | "role:{role}"

  // VISIBILITY
  sticky: boolean("sticky").default(true), // Non-dismissible?
  expires_at: timestamp("expires_at"), // Auto-hide after N days

  // TRACKING
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Track who has read
export const broadcast_reads = pgTable("broadcast_reads", {
  id: uuid("id").primaryKey().defaultRandom(),
  broadcast_id: uuid("broadcast_id").notNull(),
  user_id: uuid("user_id").notNull(),
  read_at: timestamp("read_at").notNull().defaultNow(),
});
```

**4. API Endpoints**

```typescript
// CREATE broadcast (CEO/Admin only)
POST /api/admin/broadcasts
Request: {
  type: "approval",
  title: "Q1 Marketing Budget Approved",
  message: "Moving forward with aggressive Q1 spend to capture market window.",
  proposal_id: "uuid",
  case_number: "optional-case-456",
  audience: "all",  // or "circle:engineering" or "role:council"
  sticky: true,
  expires_at: "2026-01-15"
}
Response: { id: "broadcast_uuid", created_at: "...", audience_count: 45 }

// FETCH active broadcasts (for sticky banner)
GET /api/broadcasts/active
Response: [
  {
    id: "uuid",
    type: "approval",
    title: "...",
    message: "...",
    proposal_id: "...",
    created_by: "...",
    created_at: "...",
    read: false  // Has THIS user read it?
  }
]

// MARK as read
POST /api/broadcasts/:id/read
Response: { broadcast_id: "uuid", read_at: "..." }

// GET broadcast history (compliance/audit)
GET /api/broadcasts/history?type=approval&limit=50&offset=0
Response: [ { ... }, { ... } ]

// GET read stats (who has seen?)
GET /api/broadcasts/:id/read-stats
Response: {
  total_audience: 45,
  read_count: 32,
  unread_count: 13,
  read_by: [
    { user_id: "...", username: "cto", read_at: "2026-01-08T11:30:00Z" },
    { user_id: "...", username: "cfo", read_at: "2026-01-08T11:45:00Z" }
  ]
}
```

**5. UI Components**

**Sticky Banner Island:**

```typescript
// /islands/BroadcastBanner.tsx
export default function BroadcastBanner() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  // Subscribe to new broadcasts via WebSocket
  useEffect(() => {
    const ws = new WebSocket("ws://localhost/api/broadcasts/stream");
    ws.onmessage = (event) => {
      const newBroadcast = JSON.parse(event.data);
      setBroadcasts([newBroadcast, ...broadcasts]);
    };
  }, []);

  const handleMarkRead = async (broadcastId: string) => {
    await fetch(`/api/broadcasts/${broadcastId}/read`, { method: "POST" });
    setBroadcasts(broadcasts.filter((b) => b.id !== broadcastId));
  };

  return (
    <div className="broadcast-stack">
      {broadcasts.map((bc) => (
        <div className={`banner banner--${bc.type}`}>
          <div className="banner-icon">{getIcon(bc.type)}</div>
          <div className="banner-content">
            <h3>{bc.title}</h3>
            <p>{bc.message}</p>
            {bc.proposal_id && <a href={`/proposals/${bc.proposal_id}`}>View Proposal</a>}
            {bc.case_number && <a href={`/cases/${bc.case_number}`}>View Case</a>}
          </div>
          <button onClick={() => handleMarkRead(bc.id)}>Mark Read</button>
        </div>
      ))}
    </div>
  );
}
```

**Broadcast Creation Modal (CEO Only):**

```typescript
// /routes/admin/broadcast.tsx
// Form fields:
// - Type dropdown: [Approval | Veto | Announcement | Poll | Emergency]
// - Title: text input
// - Message: rich text editor
// - Link Proposal: dropdown search
// - Link Case: text input
// - Audience: dropdown [All | Specific Circle | Specific Role]
// - Sticky: toggle (default ON)
// - Expires At: date picker (default +7 days)
// [Preview] [Send] buttons
```

**6. Why This Matters (The Voice of Authority)**

| Benefit            | Impact                                                     |
| ------------------ | ---------------------------------------------------------- |
| **Org Alignment**  | Everyone knows CEO decisions instantly (no rumors)         |
| **Transparency**   | Reasoning visible org-wide (builds trust)                  |
| **Accountability** | Forensic record: "CEO announced this on Jan 8 at 11:23 AM" |
| **Urgency**        | Emergency broadcasts are inescapable (sticky banner)       |
| **Compliance**     | Audit trail for policy announcements                       |
| **Morale**         | Recognition of big wins (positive feedback to team)        |

**7. Notifications**

- **For Sticky Banner:** Instant (real-time via WebSocket)
- **For Email (Optional):** Respects user config (digest frequency)
- **For Slack (Phase 2):** Auto-post to #announcements channel
- **For Mobile:** Push notification if using PWA

**8. Broadcast Templates (Quick Create)**

CEO can pick a template to speed up creation:

```
Templates:
1. "Approved: [Proposal Title] - [Reason]"
   → Pre-fills with proposal details
   
2. "Vetoed: [Proposal Title] - [Reason for rework]"
   → Pre-fills with proposal details + note
   
3. "Policy Announcement: [Policy Name]"
   → Free-text, targets entire org
   
4. "Emergency Action: [Action Required]"
   → High visibility, sticky for 24 hours
   
5. "Achievement Celebration: [Team] achieved [Goal]"
   → Morale booster, links to related proposal
```

**9. Read Tracking & Analytics**

CEO can see:

- "Broadcast #BCAST-001 read by 32/45 council members (71%)"
- Who hasn't read it yet (reminder opportunity)
- When each person read it (compliance audit)

**Phase 1 MVP:**

- Sticky banner + broadcast creation
- Basic types (approval, veto, announcement)
- Proposal + case linking
- Mark read functionality
- WebSocket real-time delivery

**Phase 2 Expansion:**

- Broadcast history page
- Email notifications
- Slack integration
- Advanced targeting (circles, roles)
- Read analytics dashboard

---

## Part IV — Technical Architecture (The Olympian)

### IV.1 Runtime & Framework

**Stack Decision:**

| Layer          | Technology     | Why (NexusCanon Rationale)                                                                    |
| -------------- | -------------- | --------------------------------------------------------------------------------------------- |
| **Runtime**    | Deno 2.x       | [The Prime Monad] Secure by default. No node_modules entropy. Native TypeScript.              |
| **Framework**  | Fresh 2.x      | [The Cobalt] Islands Architecture = zero JS by default. Only hydrates interactive components. |
| **Database**   | PostgreSQL 15+ | [The Loom] ACID compliance for financial transactions. Supports JSONB for flexible schemas.   |
| **ORM**        | Drizzle ORM    | Type-safe SQL. Deno-compatible. Supports migrations natively.                                 |
| **Validation** | Zod            | Schema validation (isomorphic). Used in both Deno backend + client-side forms.                |

---

### IV.2 Directory Structure (Deno + Fresh)

```
/axis-apex
├── deno.json                   # [THE ATLAS] Config + Dependencies
├── deno.lock                   # [THE ATLAS] Lock file
├── fresh.config.ts             # Fresh configuration
├── main.ts                     # [PRIME MONAD] Production entry
│
├── /routes                     # [THE COBALT] Pages
│   ├── index.tsx               # Home (Zero JS)
│   ├── _app.tsx                # App shell + layout
│   ├── _middleware.ts          # [THE ARGUS] Auth check
│   ├── /proposals              # Feature route
│   │   ├── index.tsx           # Pool Table + Thanos Trace
│   │   ├── /[id]               # Dynamic proposal detail
│   │   └── new.tsx             # Create proposal (stencil picker)
│   │
│   ├── /api                    # [THE VECTORS] REST endpoints
│   │   ├── /proposals
│   │   │   ├── route.ts        # GET /api/proposals
│   │   │   ├── [id].ts         # PATCH /api/proposals/:id
│   │   │   └── [id]
│   │   │       └── trace.ts    # GET /api/proposals/:id/trace
│   │   │
│   │   ├── /comments           # Thanos Trace comments
│   │   ├── /circles            # Circle management
│   │   └── _middleware.ts      # [THE ARGUS] API auth
│   │
│   └── /audit                  # Guardian-only views
│       ├── decisions.tsx       # Decision audit log
│       └── export.ts           # Export compliance report
│
├── /islands                    # [THE COBALT] Interactive Components
│   ├── ProposalCard.tsx        # Clickable proposal item
│   ├── ThanosTrace.tsx         # Right drawer tri-vector view
│   ├── BoardDialog.tsx         # Comment thread + mentions
│   ├── GoldenThumb.tsx         # Approve/Veto/Consult FAB
│   ├── CodexForm.tsx           # Dynamic stencil form renderer
│   └── VaultToggle.tsx         # Eyes Only encryption UI
│
├── /components                 # [THE COBALT] Server-side components
│   ├── /ui                     # Atomic components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Tabs.tsx
│   │   └── Modal.tsx
│   │
│   └── /features               # Composite components
│       ├── ProposalList.tsx    # Pool Table wrapper
│       ├── StrategyDrawer.tsx  # Right panel container
│       └── Header.tsx          # Nav + user menu
│
├── /canon                      # [THE LAW] Core Logic (Isomorphic)
│   ├── /codex                  # [THE CODEX] Business Rules
│   │   ├── manifest.ts         # Stencil definitions
│   │   ├── rules.ts            # Validation logic
│   │   ├── types.ts            # Shared TypeScript interfaces
│   │   └── mod.ts              # Exports
│   │
│   ├── /loom                   # [THE LOOM] Write Operations
│   │   ├── schema.ts           # Drizzle schema definitions
│   │   ├── client.ts           # Database connection singleton
│   │   ├── mutations.ts        # INSERT/UPDATE operations
│   │   └── mod.ts              # Exports
│   │
│   ├── /prism                  # [THE PRISM] Read Operations
│   │   ├── queries.ts          # SELECT statements
│   │   ├── dto.ts              # Data Transfer Objects
│   │   └── mod.ts              # Exports
│   │
│   └── /chronos                # [CHRONOS] Audit Trail
│       ├── tracer.ts           # 6W1H logging function
│       ├── types.ts            # Event type definitions
│       └── mod.ts              # Exports
│
├── /lib                        # [THE ATLAS] Infrastructure
│   ├── /infra                  # Infrastructure adapters
│   │   ├── archive.ts          # [THE ARCHIVE] S3/Blob storage
│   │   ├── herald.ts           # [THE HERALD] Email/Notifications
│   │   ├── vault.ts            # [THE VAULT] Key management
│   │   └── permission.ts       # Role-based access control
│   │
│   ├── /adapters               # [THE VECTORS] External API integrations
│   │   ├── sap.ts              # SAP SuccessFactors
│   │   ├── stripe.ts           # Stripe (if revenue tracking)
│   │   └── erp.ts              # Generic ERP adapter
│   │
│   ├── /auth                   # [THE ARGUS] Authentication
│   │   ├── session.ts          # Session management
│   │   └── rbac.ts             # Role-based access control
│   │
│   └── utils.ts                # Generic helpers (string, date, etc)
│
├── /static                     # [THE ARCHIVE] Public assets
│   ├── /images
│   ├── /fonts
│   └── favicon.ico
│
├── /tests                      # [THE QUORUM] Test suite
│   ├── /unit                   # Unit tests for /canon
│   ├── /integration            # API integration tests
│   └── /e2e                    # End-to-end tests (Puppeteer)
│
└── /docs                       # Documentation
    ├── ARCHITECTURE.md         # System design
    ├── API.md                  # OpenAPI / endpoint docs
    └── DEPLOYMENT.md           # Deno Deploy setup
```

---

### IV.3 Deno Configuration (deno.json)

```json
{
  "tasks": {
    "dev": "deno run --allow-net --allow-read --allow-env --watch main.ts",
    "start": "deno run --allow-net --allow-read --allow-env main.ts",
    "test": "deno test --allow-all",
    "test:coverage": "deno test --coverage=./coverage --allow-all",
    "db:migrate": "deno run --allow-all ./lib/infra/migrate.ts",
    "db:seed": "deno run --allow-all ./lib/infra/seed.ts",
    "fmt": "deno fmt",
    "lint": "deno lint"
  },
  "imports": {
    "@/": "./",
    "@canon/": "./canon/",
    "@lib/": "./lib/",
    "@components/": "./components/",
    "@islands/": "./islands/",

    "fresh": "https://deno.land/x/fresh@2.0.0/mod.ts",
    "drizzle-orm": "npm:drizzle-orm@^0.33.0",
    "postgres": "npm:postgres@^3.4.0",
    "zod": "npm:zod@^3.22.0",
    "@std/": "https://deno.land/std@0.224.0/",
    "@oak/": "https://deno.land/x/oak@13.0.0/",
    "preact": "npm:preact@^10.18.0",
    "preact/hooks": "npm:preact@^10.18.0/hooks"
  },
  "compilerOptions": {
    "lib": ["deno.window", "dom", "dom.iterable"],
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  },
  "fmt": {
    "useTabs": false,
    "lineWidth": 100,
    "indentWidth": 2,
    "semiColons": true,
    "singleQuote": false,
    "proseWrap": "preserve"
  },
  "lint": {
    "rules": {
      "tags": ["recommended"]
    }
  }
}
```

---

### IV.4 The CRUD-S-AP Data Model

Following NexusCanon **CRUD-S-AP** doctrine:

#### Create (Intent)

```typescript
// POST /api/proposals
// [THE CODEX] Validates against Stencil schema
// [THE LOOM] Inserts into proposals table
// [THE CHRONOS] Records "CREATED" event

POST /api/proposals
{
  "circle_id": "uuid",
  "stencil_id": "hiring_request_v2",
  "content": {
    "job_title": "Senior Engineer",
    "level": "senior",
    "annual_salary": 250000
  }
}

→ Response 201
{
  "id": "proposal_uuid",
  "status": "DRAFT",
  "created_at": "2026-01-08T12:00:00Z"
}
```

#### Read (Materialized)

```typescript
// GET /api/proposals?status=LISTENING&circle_id=...
// [THE PRISM] Fetches optimized DTOs (NOT raw database rows)
// Response includes only fields needed for Pool Table view

GET /api/proposals?status=LISTENING
[
  {
    "id": "proposal_uuid",
    "title": "Senior Engineer Hiring",
    "circle": "Engineering",
    "amount": 250000,
    "status": "LISTENING",
    "created_at": "2026-01-08T12:00:00Z",
    "approvers_needed": ["CTO", "CEO"],
    "approvals_received": ["CTO"],
    "comment_count": 3
  }
]
```

#### Update (Context-Aware)

```typescript
// PATCH /api/proposals/:id
// Context: Is this a vote? A comment? A metadata change?
// [THE LOOM] Applies patch with transaction guarantee
// [THE CHRONOS] Records the context

PATCH /api/proposals/uuid
{
  "action": "APPROVE",
  "signature": "ed25519_signature_hex"
}

→ Atomically:
  1. Set status = "APPROVED"
  2. Record signature + timestamp in approvals table
  3. Create ThanosEvent (APPROVED action)
  4. Publish WebSocket notification to all viewers
```

#### Delete (Soft/Archived)

```typescript
// DELETE /api/proposals/:id
// [NexusCanon Rule] Never hard-delete
// [THE LOOM] Sets status = "ARCHIVED", marks archived_at timestamp
// [THE CHRONOS] Records "ARCHIVED" event with reason

DELETE /api/proposals/uuid
{
  "reason": "Duplicate submission. See proposal_xyz instead."
}

→ Soft-deletes:
  - Proposal remains in database
  - Thanos_events remain intact (forensic trail)
  - Guardian reports can still access for compliance
```

#### Search (Semantic)

```typescript
// GET /api/proposals/search?q=budget+expansion&filter=amount>100000
// [THE PRISM] Full-text search on proposal titles + stencil names
// [Optional Phase 2] Vector semantic search on proposal content

GET /api/proposals/search?q=budget
[
  { "id": "uuid1", "title": "Annual Budget Revision", ... },
  { "id": "uuid2", "title": "Marketing Budget Expansion", ... }
]
```

#### Audit (Immutable 6W1H)

```typescript
// GET /api/proposals/:id/trace
// [THE CHRONOS] Returns complete forensic history

GET / api / proposals / uuid / trace[
  {
    "id": "trace_1",
    "who": "ceo_user_id",
    "what": "APPROVED",
    "when": "2026-01-08T13:00:00Z",
    "where": "web",
    "why": "Budget aligns with Q1 goals",
    "which": ["option_A", "option_B"], // alternatives considered
    "how": "UI golden thumb click",
    "vector": "FUTURE",
    "payload": { "budget_impact": 12.5, "risk_score": "MEDIUM" },
  }
];
```

#### Proactive (Anticipatory Risk)

```typescript
// Phase 2: Background job that flags risky proposals
// [THE TEMPO] Runs every hour via scheduled task
// [THE CODEX] Applies risk calculation rules
// [THE HERALD] Sends alert if risk > threshold

If (proposal.amount > $1M AND approval_count < required_approvals):
  → Flag "URGENT: High-value proposal with incomplete approvals"
  → Send alert to Sovereign + CFO
```

---

## Part V — Performance & Reliability

### V.1 Performance Targets (Critical)

| Metric                                    | Target          | Rationale                                                      |
| ----------------------------------------- | --------------- | -------------------------------------------------------------- |
| **Time-to-Interactive (Pool Table Load)** | <1s             | User must scan proposals without lag                           |
| **Right Drawer Population**               | <200ms          | When clicking a proposal, Thanos Trace must appear immediately |
| **Watermark Rendering**                   | <16ms (1 frame) | Golden Thumb click must show approval stamp optimistically     |
| **WebSocket Message Latency**             | <300ms          | Real-time mentions + trace updates                             |
| **Database Transaction Time**             | <200ms          | Write latency (Loom constraint per Constitution)               |

### V.2 Reliability & Uptime

**SLA Target:** 99.5% uptime (43 minutes downtime/month)

**Circuit Breaker Pattern:**

- If ERP Vector (SAP) is slow/unavailable → serve cached data to users
- If notifications (Herald) fail → queue them for retry, don't block proposal approval
- If Thanos Trace DB is slow → show "Loading..." indicator, don't block UI

**Backup & Recovery:**

- PostgreSQL replication (primary + 1 replica)
- Deno Deploy global distribution (ultra-low latency via isolates)
- Automated daily backup to S3 with 30-day retention

---

## Part VI — Security & Compliance

### VI.1 Deno Permission Model (The Shield)

Every Deno process runs with explicit, minimal permissions:

```bash
# Production Runtime Permissions
deno run \
  --allow-net=api.stripe.com,api.sap.com,postgresql.db \
  --allow-read=./static,./deno.lock \
  --allow-env=DATABASE_URL,STRIPE_API_KEY,JWT_SECRET \
  main.ts
```

**Principle:** If a process is compromised, attacker cannot automatically exfiltrate all secrets or
access arbitrary network endpoints.

### VI.2 Authentication & Authorization

**Authentication (The Argus):**

- OAuth 2.0 via corporate identity provider (Okta, Entra ID)
- JWT tokens stored in secure, httpOnly cookies
- Session timeout: 8 hours (with optional "remember me" extending to 30 days)

**Authorization (The Quorum):**

- Role-based access control (RBAC) enforced at API layer
- Circle membership determines proposal access
- Admin Hat is a temporary, auditable capability grant

```typescript
// /lib/auth/rbac.ts
export async function canApproveProposal(
  user_id: string,
  proposal_id: string,
): Promise<boolean> {
  const proposal = await db.query.proposals.findFirst({
    where: eq(proposals.id, proposal_id),
  });

  const required_approvers = getStencilRequiredApprovers(proposal.stencil_id);

  const user_role = await getUserRoleInCircle(user_id, proposal.circle_id);

  return required_approvers.includes(user_role);
}
```

### VI.3 Data Protection

- **Encryption at Transit:** TLS 1.3 for all network communication
- **Encryption at Rest:** PostgreSQL encryption (pgcrypto) for sensitive columns
- **The Vault:** Client-side AES-GCM for "Eyes Only" documents (keys never reach server)
- **Secrets Management:** All API keys stored in `Deno.env`, never in code

---

## Part VII — User Stories & Acceptance Criteria

| ID       | Persona   | Story                                                                               | Acceptance Criteria                                                                                          |
| -------- | --------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **US-1** | Sovereign | As a CEO, I want to see the financial impact of a proposal without opening it fully | <200ms render time when clicking a proposal. Right drawer shows budget impact, risk score, affected systems. |
| **US-2** | Council   | As a Manager, I want to submit a hiring request using a standard template           | Stencil picker loads <1s. Form validates real-time. Submit creates draft in <500ms.                          |
| **US-3** | Sovereign | As a CEO, I want instant visual confirmation that I approved a decision             | Clicking "Approve" shows watermark within 16ms. Database commit happens asynchronously.                      |
| **US-4** | Council   | As a CFO, I want to be alerted when someone mentions me in proposal discussion      | @mention triggers browser notification + haptic alert within 300ms.                                          |
| **US-5** | Guardian  | As Auditor, I want a complete forensic trail of how every decision was made         | Exporting decision history shows 6W1H data for 100% of approvals.                                            |
| **US-6** | Sovereign | As a CEO, I want sensitive documents encrypted so only I can read them              | Toggling "Eyes Only" encrypts attachment client-side. Even admins cannot decrypt.                            |
| **US-7** | Council   | As a Manager, I want to see live budget data from SAP when proposing a hire         | Future Vector fetches current headcount/budget. Updates every 5 minutes.                                     |

---

## Part VIII — Implementation Roadmap

### Phase 1: MVP (Weeks 1-4)

**Scope:** Core decision engine without external integrations

- ✅ Stencil-based proposal creation (The Codex)
- ✅ Pool Table + Thanos Trace UI (The Dual-Screen)
- ✅ Approve/Veto with optimistic watermark (The Golden Thumb)
- ✅ Basic BoardDialog (Open Floor mode only)
- ✅ Chronos audit trail (Write-only)

**Tech Stack:** Deno + Fresh + PostgreSQL

**Exit Criteria:** Internal team (Project Alpha circle) can create/approve 10+ proposals error-free

---

### Phase 2: Expanded Features (Weeks 5-8)

**Scope:** Advanced governance + integrations

- ✅ Admin Hat (Capability grants)
- ✅ Whisper mode (Encrypted comments)
- ✅ Sovereign Consultation (Private asks)
- ✅ Eyes Only (Client-side encryption)
- ✅ Vector Port (SAP integration)
- ✅ Real-time presence (WebSocket indicators)

**Exit Criteria:** SEA Region team (50+ users) completes staging QA

---

### Phase 3: Production & Launch (Weeks 9+)

**Scope:** Performance hardening + compliance

- ✅ Global Deno Deploy distribution
- ✅ Automated backups + disaster recovery
- ✅ SOC2 compliance audit
- ✅ Guardian audit dashboards
- ✅ Performance optimization (<200ms guarantee)

**Exit Criteria:** Production launch to full Global C-Suite. 99.5% SLA sustained for 30 days.

---

## Part IX — Success Metrics

### Product-Level KPIs

| KPI                          | Target                                                     | Rationale                                    |
| ---------------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| **Decision Velocity**        | Avg 2 days from submission to approval (Phase 2: <4 hours) | Faster decisions = faster business execution |
| **Approval Accuracy**        | 100% of decisions have complete 6W1H audit trail           | Compliance requirement                       |
| **User Adoption**            | 80% of C-Suite using The Apex within 6 months              | Product viability                            |
| **Proposal Standardization** | 95% of submissions use Codex Stencils (not free-text)      | Enables automation                           |

### Technical KPIs

| KPI                           | Target | Rationale                 |
| ----------------------------- | ------ | ------------------------- |
| **API Response Time (p95)**   | <200ms | Thanos Trace render speed |
| **Database Query Time (p95)** | <100ms | The Loom constraint       |
| **Uptime**                    | 99.5%  | Enterprise reliability    |
| **Test Coverage**             | >85%   | Code quality              |

---

## Part X — Risk Management

| Risk                                         | Likelihood | Impact   | Mitigation                                                                                         |
| -------------------------------------------- | ---------- | -------- | -------------------------------------------------------------------------------------------------- |
| **Stencil Schema Breaks Existing Proposals** | Medium     | High     | Implement immutable schema versioning. Old proposals rendered with their original stencil version. |
| **Sovereign Loses Eyes Only Key**            | Low        | Critical | Shamir's Secret Sharing recovery (3 of 5 council members can reconstruct key).                     |
| **ERP Integration Latency**                  | High       | Medium   | Vector calls are non-blocking. Serve cached data immediately, refresh background.                  |
| **Deno Ecosystem Immaturity**                | Low        | Medium   | Fallback plan: Port critical code to Node.js/Next.js if needed. (Codex is isomorphic)              |
| **Database Migration Complexity**            | Medium     | High     | Pre-production testing of migrations on replica. Rollback procedure documented.                    |

---

## Ratification

This PRD represents the **Comprehensive Olympian Implementation Standard** for The Apex.

Every decision aligns with the **NexusCanon Constitution v4.0.0** and the **Olympian Implementation
Guide v1.0.0**.

**Architecture approved by:** The Axis High Council

> **The Apex is the Sovereign Standard.**
>
> **The Boardroom is the Law.**
>
> **Zero Latency. Forensic Truth. Deno Power.**

---

_Document Version: 3.0.0_\
_Status: Approved for Engineering_\
_Last Updated: January 8, 2026_
