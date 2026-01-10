# Architecture Documentation

**System design, architecture decisions, and technical standards.**

---

## Current Documentation

| Document | Description | Status |
|----------|-------------|--------|
| [RFL Doctrine v1.0](./RFL_DOCTRINE_v1.0.md) | Request-First Logic doctrine | Active |
| [Consistency & Sustainability Audit](./CONSISTENCY_SUSTAINABILITY_AUDIT.md) | System consistency audit | Active |

---

## Purpose

This directory contains:

- **Architecture Decision Records (ADRs)** - Key architectural decisions with rationale
- **Design Patterns** - Established patterns and standards
- **System Design** - High-level system architecture documentation
- **Technical Standards** - Engineering standards and conventions

---

## Document Types

### ADRs (Architecture Decision Records)

Format: `ADR-[NUMBER]_decision-title.md`

Template:
```markdown
# ADR-001: Decision Title

**Status**: Proposed|Accepted|Deprecated|Superseded
**Date**: YYYY-MM-DD
**Deciders**: [names/roles]

## Context
[What is the issue motivating this decision?]

## Decision
[What is the change we're proposing?]

## Consequences
[What becomes easier or harder as a result?]
```

### Design Documents

Format: `DOC-[NUMBER]_design-title.md`

Purpose: Detailed technical designs for major features or systems

---

## Related Documentation

- **API Architecture**: [`../api/`](../api/)
- **Governance Decisions**: [`../_system/DECISIONS.md`](../_system/DECISIONS.md)
- **Public Governance**: [`../../content/governance/`](../../content/governance/)

---

**For Questions**: See [System Architecture Overview](../../CURSOR_SYSTEM_ARCHITECTURE.md) in root directory
