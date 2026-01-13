---
title: "ADR-001: Event-Driven Architecture"
status: APPROVED
owner: Architecture Team
date: 2026-01-13
---

# ADR-001: Event-Driven Architecture

## Decision

Adopt event-driven architecture as the primary communication pattern between
domains.

## Context

NexusCanon consists of multiple bounded domains (BoardRoom, Accounting, CRM,
Manufacturing, Supply Chain) that need to communicate state changes without
tight coupling.

Requirements:

- Domains must remain independently deployable
- State changes must be auditable
- Cross-domain operations must be resilient to partial failures
- System must support eventual consistency

## Options Considered

### Option A: Direct API Calls (Sync)

- **Pros**: Simple, immediate consistency
- **Cons**: Tight coupling, cascading failures, no audit trail

### Option B: Shared Database

- **Pros**: Strong consistency, simple queries
- **Cons**: Coupling at data layer, schema coordination overhead

### Option C: Event-Driven (Chosen)

- **Pros**: Loose coupling, audit trail, resilience, scalability
- **Cons**: Eventual consistency, debugging complexity

## Consequences

### Positive

- Domains are decoupled: changes in one domain don't break others
- Complete audit trail of all state transitions
- Natural support for CQRS patterns
- Horizontal scalability through event partitioning

### Negative

- Developers must understand eventual consistency
- Debugging requires distributed tracing
- Idempotency required for all event handlers

## Compliance

- Refuse List check: PASS (`docs/governance/REFUSE_LIST.md`)
- Silence Budget impact: +0 (no UI surface)
- Degradation plan: N/A (backend architecture)

## Links

- Related: `docs/governance/UX_RATIFICATION_PROCESS.md`
- See also: ADR-002 (Domain Boundaries), ADR-003 (Saga Pattern)
