# Documentation Tool Recommendation for NexusCanon-AXIS

## System Architect Assessment

**Date:** 2026-01-10
**Status:** Ratified Recommendation
**Authority:** System Architect Office
**Derived From:** LBOS Origin Paper (Sealed), NexusCanon Constitution v1.0

---

## Executive Summary

For the NexusCanon-AXIS Luxury Business Operating System, the documentation infrastructure must support:

- **Sealed Document Management** (immutable references)
- **Version Control & Amendment Tracking**
- **Cross-Reference Integrity** (constitutional citations)
- **Decision Record Preservation**
- **Governance Audit Trails**

**Primary Recommendation:** **Nextra** (Next.js-native, Vercel-optimized)
**Alternative:** **Docusaurus** (if advanced features required)

---

## 1. Primary Recommendation: Nextra

### 1.1 Authority & Identity

**Tool:** Nextra
**Layer:** L2 (Planning & Extensions)
**Status:** Open Source (MIT License)
**Boundary:** Documentation site generator only; does not create governance authority

**Source:** [Nextra Documentation](https://nextra.site/)
**Vercel Template:** [Nextra Docs Starter Kit](https://vercel.com/templates?type=documentation)

### 1.2 Required Cluster Outputs

#### ✅ Constitutional Alignment

1. **Markdown/MDX Support**

   - Native support for sealed document format
   - Enables governance document preservation
   - Supports frontmatter for metadata (seal status, amendment IDs)

2. **File-System-Based Versioning**

   - Directory structure enables sealed document isolation
   - Supports immutable reference preservation
   - Enables amendment tracking via directory structure

3. **Next.js Integration**

   - Native Next.js 16 compatibility
   - Vercel deployment optimization
   - Aligns with existing monorepo structure

4. **Cross-Reference Support**

   - MDX enables React components for citation links
   - File-based routing enables stable document references
   - Supports constitutional citation patterns

5. **Search & Navigation**
   - Auto-generated sidebars
   - Full-text search capability
   - Anchor link generation for clause references

### 1.3 Enforcement & Planning Hooks

#### Implementation Notes (AXIS/Titan)

**AXIS (Product Layer):**

- Documentation site must clearly distinguish:
  - **Sealed Documents** (read-only, immutable)
  - **Active Planning Documents** (mutable until ratification)
  - **Amendment Proposals** (draft status)

**Titan (Execution Layer):**

- Veto documentation structure that allows editing sealed documents
- Require frontmatter validation for seal status
- Enforce directory structure for versioning

#### Governance Structure Example

```
docs/
├── sealed/                    # L0/L1 Sealed Documents
│   ├── lbos-origin-paper/
│   │   └── index.md          # Sealed, immutable
│   ├── nexus-canon-constitution/
│   │   └── v1.0.md           # Ratified, immutable
│   └── axis-visual-constitution/
│       └── v1.0.md           # Ratified, immutable
├── active/                   # L2 Planning Documents
│   ├── planning-playbook/
│   │   └── v2.md            # Mutable until sealed
│   └── decision-records/
│       └── DR-001.md         # Active decision tracking
└── amendments/                # Amendment Proposals
    └── A-002/
        └── draft.md          # Pending ratification
```

### 1.4 Technical Specifications

**Installation:**

```bash
npx create-next-app@latest docs --example "https://github.com/vercel/next.js/tree/canary/examples/with-nextra"
```

**Key Features:**

- ✅ Markdown/MDX support
- ✅ Auto-generated navigation
- ✅ Syntax highlighting
- ✅ Dark mode support
- ✅ Internationalization (i18n)
- ✅ TypeScript support
- ✅ Vercel deployment ready

**Constitutional Compliance:**

- ✅ Supports immutable sealed documents (read-only via Git)
- ✅ Enables versioning via directory structure
- ✅ Supports cross-references via MDX links
- ✅ Preserves document integrity (no runtime mutation)

---

## 2. Alternative Recommendation: Docusaurus

### 2.1 When to Consider Docusaurus

**Use Docusaurus if:**

- Advanced versioning UI required (version dropdowns)
- Multi-language documentation needed
- Blog integration required
- Plugin ecosystem needed

**Trade-off:** Heavier framework, more configuration overhead

### 2.2 Authority & Identity

**Tool:** Docusaurus
**Layer:** L2 (Planning & Extensions)
**Status:** Open Source (MIT License)
**Boundary:** Documentation framework; does not create governance authority

**Source:** [Docusaurus Documentation](https://docusaurus.io/)

### 2.3 Constitutional Alignment

**Strengths:**

- Advanced versioning UI
- Plugin ecosystem
- Blog support
- Multi-language support

**Considerations:**

- Requires React learning curve
- More complex deployment
- Heavier than Nextra

---

## 3. Implementation Roadmap

### Phase 1: Foundation (Week 1)

1. **Install Nextra**

   ```bash
   cd apps
   npx create-next-app@latest docs --example "https://github.com/vercel/next.js/tree/canary/examples/with-nextra"
   ```

2. **Structure Directories**

   - `docs/sealed/` - Immutable documents
   - `docs/active/` - Planning documents
   - `docs/amendments/` - Amendment proposals

3. **Configure Frontmatter Schema**
   - Seal status field
   - Amendment ID field
   - Constitutional citation field

### Phase 2: Migration (Week 2)

1. **Migrate Sealed Documents**

   - LBOS Origin Paper → `docs/sealed/lbos-origin-paper/`
   - NexusCanon Constitution → `docs/sealed/nexus-canon-constitution/v1.0.md`
   - AXIS Visual Constitution → `docs/sealed/axis-visual-constitution/v1.0.md`

2. **Migrate Planning Documents**

   - Planning Playbook → `docs/active/planning-playbook/v2.md`
   - Decision Records → `docs/active/decision-records/`

3. **Establish Cross-References**
   - Update all `@docs/...` references
   - Create MDX components for citations

### Phase 3: Governance Integration (Week 3)

1. **Seal Status Indicators**

   - Visual badges for sealed documents
   - Read-only enforcement UI

2. **Amendment Tracking**

   - Amendment proposal workflow
   - Ratification status tracking

3. **Decision Record Integration**
   - DR template integration
   - Cross-reference validation

---

## 4. Constitutional Compliance Checklist

### ✅ Sealed Document Preservation

- [ ] Sealed documents stored in read-only Git branches
- [ ] Frontmatter indicates seal status
- [ ] No edit capability for sealed documents in UI
- [ ] Hash verification displayed for sealed documents

### ✅ Version Control

- [ ] Directory structure supports versioning
- [ ] Version navigation available
- [ ] Amendment history tracked

### ✅ Cross-Reference Integrity

- [ ] Constitutional citations use stable references
- [ ] Broken reference detection
- [ ] Citation format standardized

### ✅ Decision Memory

- [ ] Decision records preserved
- [ ] Amendment proposals tracked
- [ ] Rationale capture enabled

---

## 5. Recommended Next Steps

1. **Approve Tool Selection**

   - System Architect recommends Nextra
   - Alternative: Docusaurus if advanced features needed

2. **Create Implementation Plan**

   - Detailed migration strategy
   - Governance structure setup
   - Cross-reference mapping

3. **Establish Documentation Standards**
   - Frontmatter schema
   - Citation format
   - Seal status indicators

---

## 6. Amendment & Governance

**This Recommendation:**

- **Status:** Active Planning Document (L2)
- **Authority:** System Architect Office
- **Change Policy:** Mutable until ratified
- **Seal Status:** Not sealed

**Traceability:**

- **Derived From:** LBOS Origin Paper (Sealed), NexusCanon Constitution v1.0
- **Constitutional Citations:** Article I (Purpose), Article IX (Amendment)

**Impact Analysis:**

- **Doctrine:** None (tooling recommendation only)
- **Product (AXIS):** Documentation site structure
- **Execution (Titan):** Next.js app creation, Vercel deployment

---

**End of Recommendation**
