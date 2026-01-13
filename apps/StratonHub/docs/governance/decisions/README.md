# UX Architecture Decision Records

This directory contains approved UX Architecture Decision Records (ADRs).

## Naming Convention

```
ADR-XXX-short-title.md
```

- `XXX` = Sequential number (001, 002, 003...)
- `short-title` = Kebab-case description

## Status

| Status     | Meaning                          |
| ---------- | -------------------------------- |
| PROPOSED   | Under review                     |
| APPROVED   | Ratified, implementation allowed |
| REJECTED   | Declined, archived for reference |
| DEFERRED   | Valid but postponed              |
| SUPERSEDED | Replaced by newer ADR            |

## Current ADRs

| ADR                                                | Title                                    | Status   | Date       |
| -------------------------------------------------- | ---------------------------------------- | -------- | ---------- |
| [ADR-001](./ADR-001-event-driven-architecture.md)  | Event-Driven Architecture                | APPROVED | 2026-01-13 |
| [ADR-002](./ADR-002-domain-boundary-definition.md) | Domain Boundary Definition               | APPROVED | 2026-01-13 |
| [ADR-003](./ADR-003-saga-pattern-cross-domain.md)  | Saga Pattern for Cross-Domain Operations | APPROVED | 2026-01-13 |

## Process

See [`UX_RATIFICATION_PROCESS.md`](../UX_RATIFICATION_PROCESS.md) for the full
approval flow.

## Template

Use [`templates/UX_PROPOSAL_TEMPLATE.md`](../templates/UX_PROPOSAL_TEMPLATE.md)
for new proposals.
