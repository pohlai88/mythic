# Governance Documentation

**Internal governance, decision tracking, and system control.**

---

## Structure

### Active Governance

**Location**: `active/` **Purpose**: Working governance documents (mutable,
versioned)

- Internal operating procedures
- Working governance specifications
- Active policy documents

### Draft Governance

**Location**: `draft/` **Purpose**: Proposed governance documents
(pre-ratification)

- Draft policies
- Proposed amendments
- Working specifications

---

## Public Governance

**For public-facing governance**, see:

- **[Sealed Documents](../../content/governance/sealed/)** - Immutable
  foundation
  - [NexusCanon Constitution](../../content/governance/sealed/nexus-canon-constitution.mdx)
  - [Titan Protocol](../../content/governance/sealed/titan-protocol.mdx)
  - [LBOS Origin Paper](../../content/governance/sealed/lbos-origin-paper.mdx)

- **[Active Governance](../../content/governance/active/)** - Current governance
  - [Planning Playbook](../../content/governance/active/planning-playbook.mdx)

- **[Amendments](../../content/governance/amendments/)** - Governance amendments
  - [A-001: Courts Charter](../../content/governance/amendments/a-001-courts-charter.mdx)

---

## Governance Layers

### Layer 0 (L0) - Foundational

- Core philosophical principles
- Immutable values
- **Status**: Sealed (cannot be modified without formal amendment)

### Layer 1 (L1) - Constitutional

- Governance rules
- Operational frameworks
- **Status**: Sealed (amendment process required)

### Layer 2 (L2) - Operational

- Planning procedures
- Reference benchmarks
- **Status**: Active (can be updated through normal procedures)

---

## Document Lifecycle

```
Draft → Active → Sealed (if foundational)
            ↓
       Legacy (if superseded)
```

**Draft**: Pre-ratification, working documents **Active**: Ratified, current
operational documents **Sealed**: Immutable, foundational documents
(hash-verified, ledger-tracked) **Legacy**: Superseded, archived for historical
reference

---

## Decision Tracking

**For all governance decisions**, see:

- **[Decision Ledger](../_system/DECISIONS.md)** - Append-only decision log
- **[Contradictions](../_system/CONTRADICTIONS.md)** - Conflict tracking &
  resolution

---

## Related Documentation

- **System Governance**: [`../_system/`](../_system/) - Documentation governance
- **Architecture Decisions**: [`../architecture/`](../architecture/) - Technical
  ADRs

---

**For Public Governance**: Visit
[content/governance/](../../content/governance/)
