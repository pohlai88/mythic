# Documentation Tool Quick Start

## Nextra Implementation for NexusCanon-AXIS

**Status:** Active Planning Document **Authority:** System Architect Office
**Reference:** @DOCUMENTATION_TOOL_RECOMMENDATION.md

---

## 🎯 Quick Decision Matrix

| Requirement        | Nextra              | Docusaurus            |
| ------------------ | ------------------- | --------------------- |
| Next.js Native     | ✅ Built on Next.js | ⚠️ Separate framework |
| Vercel Deployment  | ✅ Optimized        | ✅ Supported          |
| Markdown/MDX       | ✅ Native           | ✅ Native             |
| Versioning         | ✅ File-based       | ✅ Advanced UI        |
| Governance Support | ✅ Customizable     | ✅ Plugin support     |
| Learning Curve     | ✅ Low              | ⚠️ Medium             |
| **Recommendation** | **✅ PRIMARY**      | Alternative           |

---

## 🚀 Immediate Actions

### Step 1: Install Nextra (5 minutes)

```bash
# Navigate to monorepo root
cd c:\AI-BOS\eBOM

# Create docs app in apps directory
cd apps
npx create-next-app@latest docs --example "https://github.com/vercel/next.js/tree/canary/examples/with-nextra"

# Or use Vercel template directly
npx create-next-app@latest docs --template https://github.com/vercel/templates/tree/main/documentation-starter-kit
```

### Step 2: Directory Structure (10 minutes)

```
apps/docs/
├── pages/
│   ├── sealed/                    # L0/L1 Sealed Documents
│   │   ├── lbos-origin-paper/
│   │   │   └── index.mdx         # Sealed, immutable
│   │   ├── nexus-canon-constitution/
│   │   │   └── v1.0.mdx          # Ratified, immutable
│   │   └── axis-visual-constitution/
│   │       └── v1.0.mdx          # Ratified, immutable
│   ├── active/                   # L2 Planning Documents
│   │   ├── planning-playbook/
│   │   │   └── v2.mdx            # Mutable until sealed
│   │   └── decision-records/
│   │       └── DR-001.mdx         # Active decision tracking
│   └── amendments/                # Amendment Proposals
│       └── A-002/
│           └── draft.mdx          # Pending ratification
└── theme.config.tsx               # Nextra configuration
```

### Step 3: Frontmatter Schema (5 minutes)

**Standard Frontmatter for Governance Documents:**

```yaml
---
title: "Document Title"
status: "sealed" | "ratified" | "draft" | "active"
layer: "L0" | "L1" | "L2"
seal_date: "2026-01-10"
canonical_hash: "sha256:..."
amendment_id: "A-XXX" | null
derived_from: "LBOS Origin Paper (Sealed)"
constitutional_citations:
  - "Article I.1"
  - "Article II.2"
---
```

### Step 4: Nextra Configuration (10 minutes)

**`theme.config.tsx`:**

```tsx
import { DocsThemeConfig } from "nextra-theme-docs"

const config: DocsThemeConfig = {
  logo: <span>NexusCanon-AXIS</span>,
  project: {
    link: "https://github.com/your-org/nexuscanon-axis",
  },
  docsRepositoryBase:
    "https://github.com/your-org/nexuscanon-axis/tree/main/apps/docs",
  footer: {
    text: "NexusCanon-AXIS Documentation — Governance & Constitution",
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
}

export default config
```

---

## 📋 Migration Checklist

### Sealed Documents (Priority 1)

- [ ] Migrate LBOS Origin Paper
  - Source: `.cursor/planing/.lbos_origin_paper_sealed.md`
  - Target: `apps/docs/pages/sealed/lbos-origin-paper/index.mdx`
  - Action: Copy content, add frontmatter, mark as sealed

- [ ] Migrate NexusCanon Constitution v1.0
  - Source:
    `.cursor/planing/.nexus_canon_constitution_v_1_governance_pack_v_1.md`
  - Target: `apps/docs/pages/sealed/nexus-canon-constitution/v1.0.mdx`
  - Action: Copy content, add frontmatter, mark as ratified

- [ ] Migrate AXIS Visual Constitution v1.0
  - Source: `.cursor/planing/_axis_visual_constitution_v_1.md` (if exists)
  - Target: `apps/docs/pages/sealed/axis-visual-constitution/v1.0.mdx`
  - Action: Copy content, add frontmatter, mark as ratified

### Planning Documents (Priority 2)

- [ ] Migrate Planning Playbook v2
  - Source:
    `.cursor/planing/0.axis_governance_planning_tracking_playbook_with_reference_benchmarks_V2.md`
  - Target: `apps/docs/pages/active/planning-playbook/v2.mdx`
  - Action: Copy content, add frontmatter, mark as active

- [ ] Create Decision Records Directory
  - Target: `apps/docs/pages/active/decision-records/`
  - Action: Create DR template

### Cross-References (Priority 3)

- [ ] Update `@docs/...` references
  - Map to new Nextra paths
  - Create MDX citation components

- [ ] Create Citation Component
  - Component: `components/ConstitutionalCitation.tsx`
  - Purpose: Standardized citation format

---

## 🔗 Key Resources

### Official Documentation

- **Nextra:** https://nextra.site/
- **Vercel Template:** https://vercel.com/templates?type=documentation
- **Next.js Docs Example:**
  https://github.com/vercel/next.js/tree/canary/examples/with-nextra

### Governance References

- **LBOS Origin Paper:** Sealed, immutable
- **NexusCanon Constitution v1.0:** Ratified, immutable
- **Planning Playbook v2:** Active, mutable until sealed

---

## ⚠️ Constitutional Constraints

### Sealed Document Handling

**CRITICAL:** Sealed documents must:

1. Be stored in read-only Git branches
2. Display seal status in frontmatter
3. Show canonical hash for verification
4. Never be editable in documentation UI

### Amendment Tracking

**REQUIRED:** All amendments must:

1. Have unique amendment ID (A-XXX)
2. Reference target clause(s)
3. Include traceability check
4. Show derivation from Origin Paper

### Cross-Reference Integrity

**MANDATORY:** All citations must:

1. Use stable document paths
2. Reference specific clauses (Article X.Y)
3. Validate broken references
4. Preserve constitutional authority

---

## 🎯 Success Criteria

### Phase 1: Foundation ✅

- [ ] Nextra installed and running
- [ ] Directory structure created
- [ ] Frontmatter schema defined

### Phase 2: Migration ✅

- [ ] All sealed documents migrated
- [ ] Planning documents migrated
- [ ] Cross-references updated

### Phase 3: Governance ✅

- [ ] Seal status indicators working
- [ ] Amendment tracking functional
- [ ] Decision records integrated

---

**End of Quick Start Guide**
