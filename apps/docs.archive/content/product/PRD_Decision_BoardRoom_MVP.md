---
title: PRD - AXIS Decision BoardRoom MVP
description: Complete Product Requirements Document for AXIS Decision BoardRoom MVP
version: 1.0.0
status: draft
product: AXIS Decision BoardRoom
brand: AXIS (Luxury Business Operating System)
---

# Product Requirements Document: AXIS Decision BoardRoom MVP

**Product Name**: The Apex (Executive Board Decision Engine)
**Brand**: AXIS - Luxury Business Operating System
**Version**: 3.0.0 (Olympian Implementation)
**Status**: Approved for Engineering
**Target Release**: Q1 2026
**Architectural Standard**: NexusCanon v4.0.0 + Olympian v1.0.0

---

## Document Sources

This PRD consolidates design-affecting points from:
- `.cursor/product/PRD_eBoard_v3.md` - Product requirements
- `.cursor/product/Axis_visual_canon_official_design_system.md` - Design system
- `.cursor/product/APEX_v3_COMPLETE_ARCHITECTURE.md` - Architecture specifications
- `.cursor/product/PRD_v3_STRATEGIC_ENHANCEMENTS.md` - Strategic enhancements

---

## 1. Executive Summary

### 1.1 The Problem (The Legal Fragility)

**Current Reality**: Executive decision-making is fragmented across informal channels:

- WhatsApp approvals lack forensic audit trails
- Email chains bury critical decisions in noise
- Spreadsheets become "Shadow Systems of Record"
- No real-time visibility into financial/strategic impact before approval
- Decision latency measured in days (email + meetings) instead of seconds

**Business Impact**:
- Missed market windows due to slow approvals
- Compliance risk from undocumented decisions
- Administrative overhead for CFO/COO managing approval chains

### 1.2 The Solution (The Apex)

**The Apex** is a High-Frequency Decision Engine that transforms executive governance from **"Slow Email"** to **"Fast Boardroom."**

**Core Value Proposition**:

1. **Zero Latency Decisions**: The "Dual-Screen Strategy" (Proposal + Impact) enables Sovereigns to approve in seconds, not days
2. **Forensic Accountability**: Every decision generates a 6W1H immutable audit trail (The Thanos Trace)
3. **Encrypted Privacy**: "Eyes Only" documents are client-side encrypted; even admins cannot decrypt them
4. **Structured Intent**: The "Living Schema" ensures proposals are machine-readable, enabling downstream automation

**Metaphorical Model**:

| Concept                | Traditional              | The Apex                               |
| ---------------------- | ------------------------ | -------------------------------------- |
| What we solve          | Customer support tickets | Executive proposals                    |
| Who decides            | Help desk agents         | The Sovereign (CEO)                    |
| How we structure input | Free-form text           | Schema-based stencils                  |
| How we track history   | Ticket updates           | Tri-Vector trace (Past/Present/Future) |
| Approval mechanism     | Agent assignment         | Digital signature + watermark          |

---

## 2. Product Overview

### 2.1 Vision

Transform executive decision-making from slow, fragmented email chains to fast, accountable, intelligence-driven boardroom decisions.

### 2.2 Goals

- Reduce decision latency from days to seconds
- Provide forensic accountability for all executive decisions
- Enable real-time impact analysis before approval
- Maintain cryptographic privacy for sensitive decisions
- Create structured, machine-readable decision records

### 2.3 Target Users

#### The Sovereign (Primary User: CEO / Board Chair)

**Goals**:
- Make high-impact decisions in seconds without getting lost in details
- Have immediate visibility into financial/strategic consequences before voting
- Maintain cryptographic proof of decision accountability

**Key Behaviors**:
- Scans proposals at high speed (5+ per session)
- Relies on the "Right Eye" (The Thanos Trace) to verify risk before clicking "Approve"
- Demands <200ms response time when switching between proposals
- May use one-handed gestures (iPad, pen) while in meetings

**Frustrations**:
- "Inbox Zero" anxiety from email chains
- Uncertainty about decision impact
- Lack of permanent audit trail for compliance

#### The Council (Secondary User: C-Suite Manager)

**Examples**: CTO, CFO, CMO, Regional Head, VP of Engineering

**Goals**:
- Submit standardized proposals to unblock their teams
- Get rapid feedback/approval without ambiguity
- Collaborate with other council members via comments

**Key Behaviors**:
- Uses "Codex Stencils" (pre-defined templates) for 90% of submissions
- Tags colleagues (@CFO) to build consensus before formal vote
- Monitors "The Listening" status to track approval progress
- May add custom metadata (risk scores, alternative options)

**Frustrations**:
- Ambiguous rejection reasons ("Need more info")
- Waiting for next board meeting to get sign-off
- No real-time presence indicators

#### The Guardian (Tertiary User: Compliance/Auditor)

**Goals**:
- Verify all high-impact decisions have complete audit trails
- Ensure sensitive decisions use encryption ("Eyes Only")
- Report on decision velocity, approval patterns

**Key Behaviors**:
- Views proposals in "Audit Mode" (read-only)
- Exports decision history for compliance reporting
- Sets up "alerts" for decisions exceeding thresholds (e.g., >$1M spend)

### 2.4 Success Metrics

- **Decision Latency**: Reduce from days to <5 minutes average
- **Approval Rate**: Track approval/rejection patterns
- **Audit Compliance**: 100% of decisions have complete 6W1H trail
- **User Adoption**: 90% of C-Suite using system within 3 months
- **Performance**: <200ms response time for all interactions

---

## 3. Design System Requirements

### 3.1 Visual Design System (Axis Visual Canon)

**Source**: `Axis_visual_canon_official_design_system.md`

**Status**: Ratified v1.0.0
**Applies To**: Axis, Quorum360, Naxus Cobalt
**Derived From**: NexusCanon 3.1.0

#### 3.1.1 Foundational Theory

**Jurisdiction, Not Product**: Axis is not a product that invites engagement. Axis is a system that _permits action_.

Therefore:
- The interface waits
- The interface resists
- The interface remembers

Visual design is a **governance tool**, not decoration.

**Material Truth (Anti-Plastic Doctrine)**: Plastic surfaces feel cheap because they reflect light uniformly, carry no memory, and do not resist interaction. Axis surfaces behave like material (wood grain, stone weight, parchment absorption).

**Light as Language**: Humans perceive meaning through _change in light over time_, not static color. Axis uses conditional illumination, slow transitions, and earned contrast.

#### 3.1.2 Color System (Material-Based)

Color in Axis represents **material states**, not UI states.

| Token     | Hex Value | Meaning             |
| --------- | --------- | ------------------- |
| Void      | #0a0a0b   | Absence / Authority |
| Obsidian  | #141416   | Surface / Weight    |
| Parchment | #f8f5f0   | Knowledge           |
| Ash       | #d4cfc4   | Commentary          |
| Gold      | #c9a961   | Ratified Authority  |
| Ember     | #9d7a4a   | Consequence         |

**CRITICAL CONSTRAINT**: Pure white (#FFFFFF) is **FORBIDDEN** - Use Parchment (#f8f5f0) instead. Text must use a _living neutral spectrum_ (Parchment, Ash, Gold) to preserve emotional calm and reading endurance.

**EXCEPTION - Optical Signal White**: For gradient text effects in headings (e.g., h1 with background-clip: text), optical signal white (#fdfdfc) or white gradients may be used for visual hierarchy. This is the only exception to the pure white prohibition.

#### 3.1.3 Typography Doctrine

**Editorial Authority**:
- Headings must feel written, not rendered
- Serif only (for traditional authority)
- High contrast strokes
- Generous spacing
- Recommended: Playfair Display, Cormorant Garamond

```css
font-family: "Cormorant Garamond", serif;
```

**Alternative - Modern Typography** (for contemporary interfaces):
- Inter Light (300) with negative letter-spacing (-0.03em)
- Creates "engineered authority" aesthetic
- Suitable for system interfaces and modern applications

```css
font-family: "Inter", sans-serif;
font-weight: 300;
letter-spacing: -0.03em;
```

**Forensic Data**:
- All numeric or immutable data must be monospaced
- Purpose: Eliminate ambiguity, signal permanence
- Recommended: JetBrains Mono

```css
font-family: "JetBrains Mono", monospace;
```

**Spoken White (Anti-Pure White Rule)**:
- Pure white (#FFFFFF) is **FORBIDDEN** - Use Parchment (#f8f5f0) instead
- Text must use living neutral spectrum: Parchment (primary), Ash (secondary), Gold (emphasis)
- **Exception**: Optical signal white (#fdfdfc) or white gradients allowed for gradient text effects in headings only

#### 3.1.4 Motion Physics

Axis motion obeys **gravitational time**, not UI speed.

**Rules**:
- NO bounce
- NO snap
- NO elastic easing

**Recommended Durations**:
- Hover: 700-1200ms
- Commitment: 1618ms

Motion communicates consequence.

#### 3.1.5 Interaction Law

**Cards vs Buttons**: They must never behave the same.

**Cards (Illumination)**:
- Dim at rest
- Light descends on hover
- Borders warm before content
- Transition duration: 1200ms

```html
<section class="border border-charcoal bg-obsidian transition duration-1200 hover:border-gold">
```

**Buttons (Selection)**:
- Quiet visibility at rest
- Resistance before activation
- Time-based confirmation
- Transition duration: 1618ms

```html
<button class="border border-gold px-16 py-5 font-mono tracking-decree transition duration-1618 hover:bg-gold">
  SIGN
</button>
```

> **A decision must be felt before it is executed.**

#### 3.1.6 Accessibility Position

Accessibility is a **sovereign mode**, not a forced aesthetic.

- Default: Sovereign Vision
- AA Mode: Enhanced Clarity
- AAA Mode: Forensic Precision

Modes alter contrast and weight — not identity.

#### 3.1.7 Application Guidelines

**Do**:
- Respect silence
- Use space as authority
- Let the system wait

**Do Not**:
- Add decorative color
- Animate for delight
- Explain what competence assumes

**Enforcement**: Any UI that uses pure white, treats buttons like cards, or optimizes speed over weight is **Non-Canonical**.

---

## 4. Functional Requirements

### 4.1 The Dual-Screen Strategy

The Apex implements a **"Split-Brain Viewport"** that eliminates context-switching.

#### 4.1.1 Left Panel (60% - The Pool Table / Functional Dashboard)

The Pool Table is a **live operational dashboard**, not just a list. It combines proposal visibility with decision velocity metrics.

**Core Components**:

1. **Proposal List (Sortable/Filterable)**
   - Scrollable list of active/historical proposals with rich visual indicators
   - Status badges (DRAFT, LISTENING, APPROVED, VETOED) with color coding
   - Priority indicators (HIGH/MEDIUM/LOW based on amount or risk score)
   - Time remaining (SLA countdown if deadline is set)
   - Avatar stack showing current approvers + their vote status
   - Search & filter by: circle, status, amount range, date range, approver name
   - Sort by: date created, amount, approvers remaining, urgency

2. **Dashboard Metrics (Header Area)**
   - **Total Pending**: Count of proposals in LISTENING state
   - **Awaiting Your Vote**: Count where user is required approver
   - **Avg Decision Time**: Days from LISTENING → APPROVED
   - **This Week's Approvals**: Quick stat showing velocity
   - **At-Risk Proposals**: Count exceeding SLA time or approval threshold

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

#### 4.1.2 Right Panel (40% - The Strategy Drawer)

- **Tab 1: The Thanos Trace** (Default view)
  - **Past Vector**: Version history, editor timeline, comment count
  - **Present Vector**: Real-time viewers (who is looking right now?), last activity timestamp
  - **Future Vector**: Calculated impact (budget, headcount, timeline), risk score, affected downstream systems

- **Tab 2: The BoardDialog** (Chat/Collaboration)
  - Comment thread for council discussion
  - @mentions trigger haptic alerts for tagged users
  - Three modes: Open Floor (all see), Sovereign Consultation (one person replies), Whisper (encrypted sidebar)

- **Tab 3: The Codex** (Schema Definition)
  - Shows the "stencil" this proposal is using
  - Displays required vs. optional fields
  - Allows inline editing of optional metadata

- **Tab 4: Linked To-Dos** (NEW — Decision Enablement)
  - Shows any to-do tasks created from this proposal
  - Quick link to create a new to-do ("Implement if approved")
  - Displays to-do status + assignee
  - Allows closing to-dos directly from this panel

**Interaction Model**:
- Clicking a proposal on the Left instantly populates all four Tabs on the Right
- No page navigation; Thumb Zone FAB remains fixed for Approve/Veto
- <200ms response time from click to content render (critical performance requirement)

### 4.2 The Golden Thumb (Approval Mechanism)

**Location**: Fixed to bottom-right "Thumb Zone" (one-handed accessible)

**Actions**:

1. **APPROVE** — Locks proposal to APPROVED state + generates cryptographic signature
2. **VETO** — Locks proposal to VETOED state + requires comment explaining reason
3. **CONSULT** — Reopens proposal back to LISTENING + assigns to specific council member

**The Watermark Engine (Optimistic UI)**:

- **Client-Side (16ms)**: UI instantly overlays "SIGNED BY SOVEREIGN" watermark + locks form + provides haptic feedback
- **Server-Side (async)**: Database transaction commits the decision + Chronos generates 6W1H audit record
- **Reconciliation**: If server rejects (rare), UI rolls back with error message

This optimistic UI gives the Sovereign instant visual feedback while the backend persists asynchronously.

### 4.3 The 9 Weapons (Domains of Authority)

#### Weapon 1: The Codex (Living Schema)

**Purpose**: Eliminate free-text proposals; force structure.

**Implementation**:
- Proposal templates (stencils) with versioned schemas
- Machine-readable fields (string, number, date, enum, jsonb)
- Required vs. optional field validation
- Hot-swappable schema updates without code deployment

**Example Stencil**:
```typescript
{
  id: "hiring_request_v2",
  name: "Hiring Request",
  version: 2,
  fields: [
    { id: "job_title", label: "Job Title", type: "string", required: true },
    { id: "level", label: "Seniority Level", type: "enum", required: true, validation_rule: "junior|mid|senior|principal" },
    { id: "annual_salary", label: "Annual Salary (USD)", type: "number", required: true, validation_rule: "number|min:50000|max:500000" }
  ],
  required_approvers: ["CTO", "CFO", "CEO"]
}
```

#### Weapon 2: The Thanos Trace (Forensic Audit Trail)

**Purpose**: Provide forensic context without opening the full proposal.

**The Tri-Vector Model**:

| Vector                  | What it Shows                  | Example                                                                                           |
| ----------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Past (Forensic)**     | Proposal history and evolution | "Manager X submitted 2 hours ago. 3 versions. Last edit by CFO 15 min ago."                       |
| **Present (Pulse)**     | Real-time activity             | "CFO & CMO currently viewing. 4 comments in last hour."                                           |
| **Future (Prediction)** | Calculated consequences        | "Approval impacts Q3 Marketing Budget by 12%. Risk Score: MEDIUM. Affects 3 downstream projects." |

**6W1H Forensic Signature**:
- **Who**: Actor ID
- **What**: Action type (CREATED, EDITED, APPROVED, COMMENTED)
- **When**: Timestamp
- **Where**: Source (web, api, webhook)
- **Why**: Reason for action
- **Which**: Alternatives considered
- **How**: Method (UI click, API call, batch)

**Real-Time Updates**: WebSocket feed pushes new Thanos events to all viewers instantly.

#### Weapon 3: The BoardDialog (Real-Time Collaboration)

**Purpose**: Enable council collaboration without leaving the proposal view.

**Modes**:

1. **The Open Floor**: All council members in the circle see comments
   - Enables fast consensus-building
   - @mention syntax: `@CFO can you review budget?`
   - Mentions trigger haptic alert + SSE notification

2. **Sovereign Consultation**: CEO asks one council member; others see Q but not reply options
   - Privacy for sensitive discussions
   - Prevents "group-think" in voting

3. **The Whisper**: Encrypted sidebar between two people
   - Client-side AES-GCM encryption
   - Server stores ciphertext; keys never transmitted
   - Even admins cannot read (The Vault principle)

#### Weapon 4: The Hierarchy (Circles & Admin Hat)

**Purpose**: Model real organizational structure (global C-Suite, regional teams, projects).

**Architecture**:
- **Circles**: Organizational units (e.g., "Engineering", "Marketing", "Board")
- **Circle Members**: Users with roles (sovereign, council, observer)
- **Admin Hat**: Granted capabilities (schema_editor, user_manager, archive_admin)
- **Nested Hierarchies**: Parent-child circle relationships

#### Weapon 5: The Vault (Encrypted Privacy)

**Purpose**: Client-side encryption for "Eyes Only" documents.

**Implementation**:
- Client-side AES-GCM encryption before upload
- Server stores ciphertext only
- Keys never transmitted to server
- Even admins cannot decrypt
- Decryption happens client-side on authorized access

#### Weapon 6: The Vectors (Multi-Dimensional Analytics)

**Purpose**: Multi-dimensional metrics and reporting.

**Features**:
- Decision velocity tracking
- Approval pattern analysis
- Budget impact calculations
- Risk score computation
- Downstream system impact assessment

#### Weapon 7: The Compass (Lite To-Dos Integration)

**Purpose**: Quick to-do creation linked to proposals.

**Features**:
- Create to-do from proposal approval
- Link to-dos to proposals
- Track to-do status in proposal view
- Default assignee and due date configuration

#### Weapon 8: The Oracle (What-If Variance Analysis) — NEW

**Purpose**: Variance tracking (Budgeted/Planned/Actual) for decision intelligence.

**Core Features**:
- **Budgeted Section**: Manager's initial estimate
- **Planned Section**: Forecast at approval time
- **Actual Section**: Reality as it unfolds
- **Variance Analysis**: Percentage difference and status (on_track, warning, overrun, underrun)
- **Milestone Reviews**: Scheduled reviews (30-day, Q1, annual) with variance tracking

**Database Schema**:
```typescript
case_whatif_budgets {
  proposal_id, case_number, stencil_id,
  budgeted_total, budgeted_breakdown, budgeted_at,
  planned_total, planned_metrics, planned_at,
  actual_total, actual_breakdown, actual_metrics,
  variance_pct, variance_status, variance_reason
}

case_whatif_milestones {
  whatif_budget_id, milestone_key, milestone_label,
  scheduled_date, actual_date,
  budget_to_date, actual_to_date, variance_pct_to_date,
  notes, reviewed_by, reviewed_at
}
```

**Phase 2**: Multi-case scenario pooling with conflict detection.

#### Weapon 9: The Herald (Broadcast Announcements) — NEW

**Purpose**: Sticky banner announcements with read tracking.

**Features**:
- CEO/Admin creates sticky announcements
- Link announcements to proposals
- Read tracking per user
- WebSocket real-time delivery
- Compliance audit trail

### 4.4 Configuration Layers

#### 4.4.1 Global Config (The Sovereign's Law)

**Purpose**: CEO/Admin sets enterprise-wide policies that apply to all users.

**Configurable Parameters** (40+):
- Approval Rules: capex_requires_board_vote, hiring_requires_cfo_approval, budget_expansion_auto_escalate
- Data Retention: archive_after_days, soft_delete_enabled, audit_trail_immutable
- Security & Encryption: eyes_only_encryption_required, mandatory_2fa, session_timeout_minutes
- Notifications: mention_alert_enabled, email_digest_frequency, slack_integration_enabled
- ERP Vector Configuration: vector_refresh_interval_minutes, vector_cache_stale_after_hours, sap_api_enabled
- UI/UX Defaults: default_sort_by, show_risk_scores, show_approver_avatars, theme

**Who Can Edit**: CEO (Sovereign), System Admin (with Admin Hat)
**Where It's Set**: Admin console at `/routes/admin/settings.tsx`
**Audit Trail**: Every change logged in Thanos with reason + who changed it + timestamp
**Change Propagation**: Updates apply immediately to all active sessions (via WebSocket broadcast)

#### 4.4.2 User Config (The Manager's Preference)

**Purpose**: Each manager personalizes their own view/behavior without affecting others.

**Configurable Parameters** (35+):
- Display Preferences: theme, default_view, cards_per_page, compact_mode
- Notification Settings: email_notifications, mention_alerts, approval_reminders, digest_frequency
- Decision Context: show_future_vector, show_past_versions, auto_collapse_comments
- To-Do Integration: link_to_dos_on_approval, to_do_default_assignee, to_do_default_due_days, show_to_do_panel
- Filter Defaults: filter_by_circle, filter_by_status, hide_archived, only_awaiting_my_vote
- Proposal Stencil Defaults: favorite_stencils, stencil_defaults

**Who Can Edit**: The manager themselves
**Where It's Set**: Personal settings at `/routes/settings/preferences.tsx`
**Storage**: Stored in `user_configs` table (indexed by user_id for <50ms lookup)
**Privacy**: User config is never shared with others; purely personal

---

## 5. Technical Requirements

### 5.1 Technology Stack

**Runtime**: Deno 2.x + Fresh 2.x (Islands Architecture)
**Database**: PostgreSQL 15+ (ACID Compliance)
**Architectural Standard**: NexusCanon v4.0.0 + Olympian v1.0.0
**Target Release**: Q1 2026

### 5.2 Architecture Constraints

**Single Indivisible Runtime**: The application logic, database access, and UI rendering must exist within a unified memory space (Monorepo) to guarantee Atomic Truth.

**The Prime Monad**: One Runtime. One Truth. Zero Latency.

**Exception**: Segregation is only permitted via **The Vectors** (External Adapters) or **The Atlas** (Infrastructure shedding).

### 5.3 Performance Requirements

- **Response Time**: <200ms from click to content render (critical)
- **Optimistic UI**: 16ms client-side watermark + async server-side persistence
- **WebSocket Latency**: Real-time updates with <100ms propagation
- **Database Queries**: <50ms lookup for user configs
- **Vector Refresh**: Configurable interval (default: 5 minutes)

### 5.4 Security Requirements

- **Client-Side Encryption**: AES-GCM for "Eyes Only" documents
- **2FA**: Mandatory (configurable via Global Config)
- **Session Timeout**: Configurable (default: 480 minutes / 8 hours)
- **Audit Trail**: Immutable 6W1H records in Thanos
- **Access Control**: Role-based permissions via The Hierarchy

### 5.5 Database Schema

**Core Tables**:
- `proposals` - Proposal records
- `proposal_stencils` - Schema templates
- `thanos_events` - 6W1H audit trail
- `board_comments` - Collaboration comments
- `circles` - Organizational hierarchy
- `circle_members` - User-circle relationships
- `user_configs` - Personal preferences
- `global_config` - Enterprise-wide settings
- `case_whatif_budgets` - Variance tracking
- `case_whatif_milestones` - Milestone reviews
- `broadcasts` - Announcements
- `broadcast_reads` - Read tracking

### 5.6 API Endpoints

**Core APIs**:
- `POST /api/proposals` - Create proposal
- `GET /api/proposals/:id` - Get proposal
- `POST /api/proposals/:id/approve` - Approve proposal
- `POST /api/proposals/:id/veto` - Veto proposal
- `POST /api/proposals/:id/comments` - Add comment
- `GET /api/proposals/:id/trace` - Get Thanos trace
- `POST /api/cases/:id/whatif/plan` - Create variance plan
- `GET /api/cases/:id/whatif` - Get variance analysis
- `POST /api/admin/broadcasts` - Create announcement
- `GET /api/broadcasts/active` - Get active announcements

**WebSocket Channels**:
- `proposal/:id/trace` - Real-time Thanos events
- `proposal/:id/comments` - Real-time comment updates
- `broadcasts/stream` - Real-time announcement delivery

---

## 6. Governance & Compliance

### 6.1 NexusCanon Constitution Compliance

**Article II - Decision Making**:
- All significant decisions shall be recorded with: Decision ID, Timestamp, Reasoning, Stakeholders, Outcome
- Human judgment remains supreme; AI systems provide recommendations but do not make binding decisions

**Article V - Amendment**:
- Amendments must be proposed in writing, include rationale, undergo review period, receive required approval
- All amendments tracked in public ledger

### 6.2 Titan Protocol Requirements

**Gate Requirements** (before any significant change):
1. Documentation Check - All relevant documentation must be updated
2. Hash Verification - Affected sealed documents verified
3. Ledger Entry - Change recorded in public ledger
4. Review Approval - Required approvals obtained

### 6.3 Decision Memory Implementation

Every decision generates:
- Immutable 6W1H audit trail (The Thanos Trace)
- Cryptographic signature (The Watermark Engine)
- Version history (Past Vector)
- Real-time activity tracking (Present Vector)
- Impact analysis (Future Vector)

### 6.4 Document Sealing Requirements

- SHA-256 hash computation for all sealed documents
- Ledger entry integration for immutability
- Integrity verification on access

---

## 7. Design Constraints & Principles

### 7.1 Core Principles

- **DRY (Don't Repeat Yourself)**: Single source of truth for each design decision
- **LightWeight**: Essential information only, no over-engineering
- **KISS (Keep It Simple, Stupid)**: Clear, simple structure and language

### 7.2 Luxury Brand Positioning

**AXIS Brand Values**:
- Authority through restraint
- Material truth (anti-plastic)
- Gravitational time (not UI speed)
- Sensorial excellence
- Human dignity

**Visual Identity**:
- Supreme luxury gold (#c9a961) for ratified authority
- Comfortable reading white (Parchment #f8f5f0, NOT pure white)
- Material-based color system (not UI state colors)

### 7.3 Material Design Principles

- **Cards**: Illuminate knowledge (dim at rest, light descends on hover)
- **Buttons**: Ratify decisions (quiet visibility, resistance before activation)
- **Motion**: Gravitational time (700-1200ms hover, 1618ms commitment)
- **Light**: Conditional illumination, slow transitions, earned contrast

### 7.4 Non-Negotiable Constraints

**FORBIDDEN**:
- Pure white (#FFFFFF) - Use Parchment (#f8f5f0) instead (Exception: Optical signal white #fdfdfc for gradient text effects)
- Buttons behaving like cards - Must maintain distinction
- Speed optimization over weight - Motion must communicate consequence
- Decorative color - Color represents material states only
- Bounce/snap/elastic easing - Motion obeys gravitational time only

---

## 8. MVP Scope

### 8.1 Phase 1 MVP (In Scope)

**Core Features**:
- ✅ Pool Table Dashboard (Functional, real-time, metrics)
- ✅ Global Config (CEO-controlled parameters, 40+)
- ✅ User Config (Manager preferences, 35+)
- ✅ Lite To-Dos (Quick creation, proposal-linked)
- ✅ Broadcast Announcements (The Herald) - Sticky banner, read tracking
- ✅ What-If Variance Analysis (The Oracle) - Budgeted/Planned/Actual tracking
- ✅ Config Layering (3-tier: Global → Circle → User)
- ✅ Simple Budget Check - Remaining budget warning

**9 Weapons (All Implemented)**:
1. The Codex - Living Schema
2. The Thanos Trace - Forensic Audit Trail
3. The BoardDialog - Real-Time Collaboration
4. The Hierarchy - Access Control
5. The Vault - Encrypted Privacy
6. The Vectors - Analytics
7. The Compass - To-Dos Integration
8. The Oracle - What-If Variance Analysis
9. The Herald - Broadcast Announcements

**Timeline**: 6-8 weeks, 2 engineers + 1 product

### 8.2 Phase 2 (Out of Scope for MVP)

- Advanced What-If Scenarios (Multi-case pooling, conflict detection)
- To-Do Gating (Linear dependencies, Guardian verification)
- Delegated Approvals (Managers pre-draft approvals)
- Broadcast Integrations (Slack, email, analytics)
- Predictive Variance (ML models from historical data)

### 8.3 Future Considerations

- Mobile native apps
- Offline access
- Extended ERP integrations
- Advanced AI recommendations
- Multi-tenant support

---

## 9. Dependencies

### 9.1 External Dependencies

- **Deno 2.x**: Runtime environment
- **Fresh 2.x**: Web framework (Islands Architecture)
- **PostgreSQL 15+**: Database (ACID Compliance)
- **WebSocket**: Real-time communication
- **AES-GCM**: Client-side encryption

### 9.2 Internal Dependencies

- **NexusCanon v4.0.0**: Governance framework
- **Olympian v1.0.0**: Architectural standard
- **Axis Visual Canon v1.0.0**: Design system

### 9.3 Design System Dependencies

- **Typography**: Playfair Display, Cormorant Garamond (serif), Inter (sans-serif, modern), JetBrains Mono (mono)
- **Color System**: Material-based tokens (Void, Obsidian, Parchment, Ash, Gold, Ember)
- **Motion**: Gravitational time transitions (700-1200ms hover, 1618ms commitment)

---

## 10. Appendix

### 10.1 Design Token Reference

**Complete Color Palette**:
```typescript
colors: {
  void: '#0a0a0b',        // Deepest black - Authority
  obsidian: '#141416',    // Surface - Weight, Material
  parchment: '#f8f5f0',   // Comfortable reading white (NOT pure white)
  ash: '#d4cfc4',         // Commentary - Secondary text
  gold: '#c9a961',        // Supreme luxury gold - Ratified Authority
  ember: '#9d7a4a'        // Consequence - Warning, Action
}
```

**Typography Scale**:
- Editorial Authority: Serif (Playfair Display, Cormorant Garamond)
- Modern Authority: Sans-serif (Inter Light 300, -0.03em tracking) - for contemporary interfaces
- Forensic Data: Monospaced (JetBrains Mono)
- Spoken White: Living neutral spectrum (Parchment/Ash/Gold)
- Optical Signal White: #fdfdfc (Exception: gradient text effects in headings only)

**Motion Durations**:
- Hover: 700-1200ms
- Commitment: 1618ms
- NO bounce, NO snap, NO elastic easing

### 10.2 Component Inventory

**Core Components**:
- Pool Table (Proposal List + Dashboard Metrics)
- Strategy Drawer (4 Tabs: Thanos Trace, BoardDialog, Codex, Linked To-Dos)
- Golden Thumb (Fixed approval mechanism)
- Proposal Cards (Illuminate knowledge)
- Approval Buttons (Ratify decisions)
- Watermark Engine (Optimistic UI)

### 10.3 Governance Reference

**NexusCanon Constitution**:
- Article II: Decision Making (Decision Memory)
- Article V: Amendment Process

**Titan Protocol**:
- Gate Requirements (Documentation, Hash Verification, Ledger Entry, Review Approval)
- Operational Procedures (Document Sealing, Amendment Process)

**Axis Visual Canon**:
- Ratified v1.0.0
- Non-negotiable perceptual laws
- Enforcement: TITAN-CI-AXIS01 gate

---

## Document Metadata

**Version**: 1.0.0
**Status**: Draft
**Last Updated**: 2026-01-10
**Author**: Product Team
**Approved By**: Pending
**Next Review**: TBD

---

**End of PRD**
