# Documentation Index

**Welcome to the AI-BOS/mythic documentation system.**

This directory contains all canonical internal documentation. For public-facing documentation, see [`content/`](../content/) (rendered via Nextra).

---

## 📚 Quick Navigation

### Essential Starting Points

- **Getting Started**: See root [`QUICK_START.md`](../QUICK_START.md)
- **Quick Reference**: See root [`QUICK_REFERENCE.md`](../QUICK_REFERENCE.md)
- **System Architecture**: See root [`CURSOR_SYSTEM_ARCHITECTURE.md`](../CURSOR_SYSTEM_ARCHITECTURE.md)

### Main Documentation Categories

| Category | Description | Path |
|----------|-------------|------|
| **🏛️ Architecture** | System design, architecture decisions | [`architecture/`](./architecture/) |
| **📡 API** | API documentation (GraphQL, REST, tRPC) | [`api/`](./api/) |
| **🏛️ Governance** | Internal governance & system control | [`governance/`](./governance/) |
| **📚 Guides** | How-to guides & setup instructions | [`guides/`](./guides/) |
| **📖 Reference** | Reference documentation & best practices | [`reference/`](./reference/) |
| **🗄️ Migrations** | Historical migration documentation | [`migrations/`](./migrations/) ⚠️ |
| **📅 Changelog** | Implementation summaries & history | [`changelog/`](./changelog/) ⚠️ |

⚠️ = Excluded from AI context (historical reference only)

---

## 🏗️ Architecture

**Current Documentation**:
- [RFL Doctrine v1.0](./architecture/RFL_DOCTRINE_v1.0.md) - Request-First Logic doctrine
- [Consistency & Sustainability Audit](./architecture/CONSISTENCY_SUSTAINABILITY_AUDIT.md)

**Purpose**: System architecture, design patterns, ADRs (Architecture Decision Records)

---

## 📡 API Documentation

**Current Documentation**:
- [API Autogeneration Strategy](./api/API_AUTOGENERATION_STRATEGY.md)
- [API Autogeneration Implementation](./api/API_AUTOGENERATION_IMPLEMENTATION.md)
- [API Autogeneration Quick Reference](./api/API_AUTOGENERATION_QUICK_REFERENCE.md)

**Purpose**: API specifications for GraphQL, REST, and tRPC endpoints

---

## 🏛️ Governance

**Current Documentation**:
- [Active Governance](./governance/active/) - Working governance documents

**Purpose**: Internal governance, decision tracking, system control

**For Public Governance**, see:
- [Sealed Documents](../content/governance/sealed/) - Immutable foundation (Constitution, Titan Protocol, LBOS Origin Paper)
- [Active Governance](../content/governance/active/) - Current governance (Planning Playbook)
- [Amendments](../content/governance/amendments/) - Governance amendments

---

## 📚 Guides

**Current Documentation**:
- [Post-Clone Setup](./guides/POST_CLONE_SETUP.md) - Setup after cloning repository

**Purpose**: Step-by-step guides for common tasks

---

## 📖 Reference

**Current Documentation**:
- [Cursor Best Practices (Evidence-Based)](./reference/CURSOR_BEST_PRACTICES_EVIDENCE_BASED.md)
- [KPI Reference](./reference/KPI_REFERENCE.md)
- [Turbopack Support](./reference/TURBOPACK_SUPPORT.md)
- [Turborepo Quick Start](./reference/TURBOREPO_QUICK_START.md)
- [Turborepo Optimization](./reference/TURBOREPO_OPTIMIZATION.md)
- [Node Version Management](./reference/NODE_VERSION_MANAGEMENT.md)
- [VS Code Nextra Integration](./reference/VSCODE_NEXTRA_INTEGRATION.md)
- [Features Checklist](./reference/FEATURES_CHECKLIST.md)
- [GitHub MCP Best Practices Report](./reference/GITHUB_MCP_BEST_PRACTICES_REPORT.md)
- [File System Management Best Practices](./reference/FILE_SYSTEM_MANAGEMENT_BEST_PRACTICES_REPORT.md)

**Purpose**: Reference documentation, best practices, configuration guides

---

## 🗄️ Historical Archives

### Migrations (Excluded from AI Context)

Documentation of past migrations. **For reference only**, not current patterns.

- [Nextra 4 Migration](./migrations/nextra-4/) - Nextra v3 → v4 migration (26 files)
- [Nextra Migration](./migrations/nextra/) - General Nextra migration (9 files)
- [Zod v4 Migration](./migrations/zod-v4/) - Zod enforcement & v4 migration (10 files)
- [Validation Migration](./migrations/validation/) - Validation system migration (5 files)

**Why excluded from AI**: Historical implementation details don't reflect current codebase patterns.

### Changelog (Excluded from AI Context)

Past implementation summaries. **For audit trail only**, not current state.

- [2025-01 Implementations](./changelog/2025-01/) - January 2025 implementation summaries (22 files)

**Why excluded from AI**: Past implementations are not representative of current active work.

---

## 🔧 System Files (_system/)

**Documentation Governance & Control**:

| File | Purpose |
|------|---------|
| [INVENTORY.md](./_system/INVENTORY.md) | Complete file census (259 files) |
| [TAXONOMY.md](./_system/TAXONOMY.md) | Canonical directory structure |
| [DECISIONS.md](./_system/DECISIONS.md) | Append-only decision ledger |
| [CONTRADICTIONS.md](./_system/CONTRADICTIONS.md) | Conflict tracking & resolution |
| [MIGRATION_PLAN.md](./_system/MIGRATION_PLAN.md) | Cleanup execution plan |
| [STATUS_REPORT.md](./_system/STATUS_REPORT.md) | Cleanup status summary |

**Purpose**: Track documentation cleanup, decisions, and governance

---

## 🎯 Finding What You Need

### For Developers

1. **Getting Started**: [`QUICK_START.md`](../QUICK_START.md) in root
2. **Architecture Overview**: [`CURSOR_SYSTEM_ARCHITECTURE.md`](../CURSOR_SYSTEM_ARCHITECTURE.md)
3. **API Docs**: [`docs/api/`](./api/)
4. **Setup Guides**: [`docs/guides/`](./guides/)

### For Governance

1. **Public Governance**: [`content/governance/`](../content/governance/)
2. **Internal Governance**: [`docs/governance/`](./governance/)
3. **Decision History**: [`docs/_system/DECISIONS.md`](./_system/DECISIONS.md)

### For Contributors

1. **Best Practices**: [`docs/reference/`](./reference/)
2. **Architecture Patterns**: [`docs/architecture/`](./architecture/)
3. **Setup Guide**: [`docs/guides/POST_CLONE_SETUP.md`](./guides/POST_CLONE_SETUP.md)

---

## 📋 Documentation Standards

### File Naming Convention

**Preferred**: `DOC-[NUMBER]_descriptive-name.md`
- Example: `DOC-0042_architecture-overview.md`

**Acceptable Alternatives**:
- Hash prefix: `a7f3e2b1_api-spec.md`
- Version prefix: `v1.0.0_cursor-guide.md`

**Temporary Docs**: `TEMP-[YYYYMMDD-HHMM]_name.md` (in `.temp-docs/` only)

### Required Frontmatter

```yaml
---
doc_type: GUIDE|SPEC|ADR|STANDARD|POLICY|RUNBOOK|NOTE
status: draft|active|sealed|legacy|archived
owner: team-or-role
source_of_truth: true|false
created: YYYY-MM-DD
modified: YYYY-MM-DD
tags: [relevant, tags]
---
```

### Document Lifecycle

```
Draft → Active → Sealed (immutable)
             ↓
           Legacy (superseded)
```

---

## 🤖 AI Context Optimization

### Included in Cursor AI Context

✅ All documentation in `docs/` (except migrations/, changelog/)
✅ All public documentation in `content/`
✅ All architecture and API docs
✅ All guides and reference docs

### Excluded from Cursor AI Context

❌ `docs/migrations/` - Historical, not current patterns
❌ `docs/changelog/` - Past implementations
❌ `.cursor/archive/` - Archived documents
❌ `.cursor/work/` - Temporary analysis

**Configuration**: See [`.cursorignore`](../.cursorignore)

---

## 📝 Contributing to Documentation

1. **For new docs**: Use proper naming convention (DOC-XXXX preferred)
2. **For updates**: Update `modified` date in frontmatter
3. **For governance docs**: Follow amendment process (see [`content/governance/amendments/`](../content/governance/amendments/))
4. **For temporary work**: Use `.temp-docs/` with TEMP- prefix (7-day expiry)

**Pre-commit Hook**: Validates naming and frontmatter compliance

---

## 🔗 External Resources

- **Nextra Documentation**: https://nextra.site
- **Next.js Documentation**: https://nextjs.org/docs
- **tRPC Documentation**: https://trpc.io
- **Zod Documentation**: https://zod.dev

---

**Last Updated**: 2026-01-10
**Cleanup Phase**: Phase 4 (Cutover + Navigation)
**Total Documentation Files**: 259 (191 .md, 35 .mdx, 33 .mdc)
